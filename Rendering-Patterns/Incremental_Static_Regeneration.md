# Incremental Static Regeneration (ISR)

## Overview

**Incremental Static Regeneration (ISR)** allows you to create or update static pages *after* you’ve built your site.

With ISR, you can retain the benefits of static generation (SSG) while scaling to millions of pages. You don't need to rebuild the entire site just to update a single page.

It bridges the gap between **Static Site Generation (SSG)** and **Server-Side Rendering (SSR)**.

## How it Works (Stale-While-Revalidate)

ISR uses a caching strategy known as **Stale-While-Revalidate**.

1.  **First Request**: The user visits a page. The CDN serves the existing static page (even if it's "stale").
2.  **Revalidation Trigger**: If the defined `revalidate` time has passed, the background regeneration process is triggered.
3.  **Background Generation**: The server regenerates the page in the background with fresh data.
4.  **Update**:
    *   If generation succeeds: The new page replaces the old one in the cache. Next user gets the fresh version.
    *   If generation fails: The old page remains. Users still see the content (no downtime).

### Visualizing the Flow
```
               ┌────────────┐
               │ First Build│
               └─────┬──────┘
                     ▼
                Static HTML

User Request ─────────► CDN

          │
          ▼
   HTML Served Instantly

          │
          ▼
Check Revalidate Timer

          │
   Expired?
     │   │
    NO   YES
     │     ▼
     │  Trigger Background Regeneration
     │        │
     │        ▼
     │   Fetch Fresh Data
     │        │
     │        ▼
     │   Generate New HTML
     │        │
     └────────┴──► Update Cache
```

## Implementation

ISR pattern that can be implemented using valid **HTTP Cache-Control** headers and a capable CDN (like Cloudflare, Vercel Edge, or Fastly).

### The `stale-while-revalidate` Header

The core of ISR relies on this HTTP header:

```http
Cache-Control: public, s-maxage=10, stale-while-revalidate=59
```

*   **`s-maxage=10`**: The content is fresh for 10 seconds. CDN serves it directly.
*   **`stale-while-revalidate=59`**: If a request comes between 10s and 69s (10 + 59), serve the *stale* content immediately, but trigger a background revalidation to update the cache.

### Conceptual Node.js / Express Example

You can implement a poor-man's ISR server using a file system cache.

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const CACHE_DURATION = 10 * 1000; 

app.get('/product/:id', async (req, res) => {
  const cachePath = path.join(__dirname, 'cache', `${req.params.id}.html`);
  
  
  if (fs.existsSync(cachePath)) {
    const stats = fs.statSync(cachePath);
    const age = Date.now() - stats.mtimeMs;

    const content = fs.readFileSync(cachePath, 'utf-8');
    res.send(content);

    if (age > CACHE_DURATION) {
      console.log('Cache stale. Revalidating in background...');
      generateAndSaveProductHTML(req.params.id, cachePath); 
    }
    return;
  }

  console.log('Miss. Blocking render...');
  const content = await generateAndSaveProductHTML(req.params.id, cachePath);
  res.send(content);
});

async function generateAndSaveProductHTML(id, outputPath) {
  // Simulate DB fetch and expensive render
  const price = Math.floor(Math.random() * 1000);
  const html = `<html><body><h1>Product ${id}</h1><p>Price: $${price}</p><p>Generated at: ${new Date().toISOString()}</p></body></html>`;
  
  fs.writeFileSync(outputPath, html);
  return html;
}

app.listen(3000, () => console.log('ISR Server running on port 3000'));
```

## Key Concepts

### 1. Revalidate (`revalidate: seconds`)
Defines the "freshness" of the data.
*   **Low value (e.g., 1s)**: Near real-time, higher server load.
*   **High value (e.g., 600s)**: Stale data for longer, very low server load.

### 2. Fallback Strategies
When a user requests a page that wasn't generated at build time:
*   **`fallback: false`**: Returns a 404. Good for small sites where all paths are known.
*   **`fallback: true`**: Serves a "Loading..." state immediately, fetches data on client, then caches the result. Good for large e-commerce.
*   **`fallback: 'blocking'`**: Server-renders the page on-the-fly (SSR-like) for the first request, then caches it. Good for SEO.

### 3. On-Demand Revalidation
Instead of waiting for a timer, you can manually purge the cache using a webhook (e.g., when a CMS content is updated).

```ts
// pages/api/revalidate.ts
export default async function handler(req, res) {
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    await res.revalidate('/blog/post-1');
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

## ISR vs SSG vs SSR

| Feature | SSG (Static) | SSR (Server) | ISR (Incremental) |
| :--- | :--- | :--- | :--- |
| **Build Time** | Slow (Builds all pages) | Fast (Builds nothing) | Fast (Builds critical pages) |
| **Request Time** | Ultra-Fast (CDN) | Slow (Server render) | Ultra-Fast (CDN) |
| **Data Freshness**| Stale (until next build)| Always Fresh | Fresh after `revalidate` |
| **Server Load** | Zero | High (Per request) | Low (Per revalidate) |
| **Best For** | Blogs, Docs, Marketing | Dashboards, Private User Data | E-commerce, News, Social |


## E-commerce Use case

Timer-based ISR is good…  But modern systems use:

👉 Event-driven ISR

Meaning:  Rebuild when data changes. Not after time.

🛒 Example — E-commerce Product Update

Let’s say: Admin updates product price in CMS.

```
Admin → CMS → triggers webhook
Webhook → ISR Server
ISR Server → regenerates only affected page
CDN cache updated
```

Diagram 

```
Admin updates product

        │
        ▼
     CMS

        │
        ▼
   Webhook Sent
        │
        ▼
 ISR Regeneration Service
        │
        ▼
 Fetch Product API
        │
        ▼
 Render HTML
        │
        ▼
 Update CDN Cache
        │
        ▼
 Next User Gets Fresh Page

```

🧑‍💻 Code Example
server-isr.js
```jsx
import express from "express";
import fetch from "node-fetch";
import React from "react";
import ReactDOMServer from "react-dom/server";
import Page from "./src/Page.jsx";

const app = express();
app.use(express.json());

let cache = {
  html: null
};

async function generateHTML() {
  console.log("Regenerating via webhook...");

  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const posts = await res.json();

  const html = ReactDOMServer.renderToString(
    React.createElement(Page, { posts })
  );

  cache.html = `
    <!DOCTYPE html>
    <html>
      <body>
        <div id="root">${html}</div>
      </body>
    </html>
  `;
}

app.get("/posts", async (req, res) => {
  if (!cache.html) {
    await generateHTML();
  }
  res.send(cache.html);
});

// Webhook endpoint
app.post("/revalidate", async (req, res) => {
  await generateHTML();
  res.json({ message: "Page regenerated" });
});

app.listen(4000, () => {
  console.log("ISR Webhook running → http://localhost:4000/posts");
});

```

🧠 Mordern ISR is shifting from:  ⏱️ Time-driven → 🔔 Event-driven

Because:

Real-time freshness matters more than fixed intervals.

### 💡 Invalidation Strategies
ISR isn’t about regeneration time. It’s about when to invalidate cache.

| Strategy         | Example                            |
| ---------------- | ---------------------------------- |
| Time-based       | Rebuild every 60 sec               |
| Event-based      | CMS update                         |
| Dependency-based | Price API changed                  |
| Traffic-based    | High-demand pages refreshed faster |


## Pros & Cons

### ✅ Pros
*   **Performance**: Users get static HTML from the edge (CDN).
*   **Scalability**: Can handle millions of pages without massive build times.
*   **Resiliency**: If the backend API fails, users still see the cached (stale) version.

### ❌ Cons
*   **Consistency**: Users might see outdated data until the revalidation completes.
*   **Complexity**: Debugging cache issues can be trickier than pure SSR/SSG.


## Conclusion

ISR is the "Goldilocks" solution for most content-driven websites. It offers the **speed of Static** with the **flexibility of Dynamic** rendering.