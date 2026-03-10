# Static Site Generation (SSG) Rendering Pattern 

## Overview

In React Rendering is expensive 

❓ “But, Why is rendering expensive?”

Rendering is expensive because it requires executing UI logic, fetching data, and generating HTML for every request — which consumes CPU, memory, and network resources repeatedly even when the output is identical.

Rendering is not just:

```
return <Component />
````

Rendering involves a full pipeline:

```
Fetch Data → Execute Logic → Build UI Tree → Convert to HTML → Send to user
```

Each step consumes CPU, memory, I/O, and time.

So modern systems shift rendering:

| Strategy | Rendering Time                      |
| -------- | ----------------------------------- |
| CSR      | After user request                  |
| SSR      | During user request                 |
| SSG      | Before user request                 |
| ISR      | After build but before next request |


## Static Site Generation (SSG)

Static Site Generation (SSG) is a rendering pattern in React that involves generating the HTML for a page at build time. This means that the HTML is generated once when the application is built, and then served as a static file to the user. SSG is a great choice for pages that don't change often, such as blog posts, documentation pages, and marketing pages.

## How SSG Works

SSG works by generating the HTML for a page at build time. This means that the HTML is generated once when the application is built, and then served as a static file to the user. SSG is a great choice for pages that don't change often, such as blog posts, documentation pages, and marketing pages.


At build time:

1. Data is fetched from APIs / CMS
2. React renders HTML using server renderer
3. HTML is saved as static file
4. CDN serves it directly

This creates a:

`Frozen snapshot of UI state`

Example: At build time:

```
Product price = ₹999
```

All users see ₹999 until next build. No server logic needed per request.

Runtime rendering = proportional to traffic.

Build-time rendering = independent of traffic.

Example:

If 1M users visit:

| Strategy | Render Count |
| -------- | ------------ |
| SSR      | 1,000,000    |
| SSG      | 1            |


## SSG Architecture
````
        ┌──────────────┐
        │   Build Time │
        └──────┬───────┘
               │
        Fetch Data (API)
               │
               ▼
        React Render (SSR)
               │
               ▼
        Static HTML Generated
               │
               ▼
        Stored on CDN
               │
               ▼
User Request ─────────► CDN ─────────► HTML Served
````


## Benefits of SSG

- **Fast**: SSG is very fast because the HTML is already generated when the user requests the page.
- **Secure**: SSG is very secure because the HTML is already generated when the user requests the page.
- **Scalable**: SSG is very scalable because the HTML is already generated when the user requests the page.

## Drawbacks of SSG

- **Not suitable for dynamic content**: SSG is not suitable for pages that change often, such as blog posts, documentation pages, and marketing pages.
- **Not suitable for user-specific content**: SSG is not suitable for pages that contain user-specific content, such as blog posts, documentation pages, and marketing pages.
- SSG Build Explosion Problem: As site grows: 
  - Pages = 100 → ok
  - Pages = 10,000 → slow
  - Pages = 1M → impossible
  
  Build time becomes: O(n)

- SSG cannot handle:
  - Logged-in users
  - Region-based pricing
  - Role-based UI


## When to Use SSG

SSG is a great choice for pages that don't change often, such as blog posts, documentation pages, and marketing pages.

## When Not to Use SSG

SSG is not a good choice for pages that change often, such as blog posts, documentation pages, and marketing pages.

## Example

```tsx
// pages/index.tsx
import React from 'react';

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
```

## Conclusion

SSG is a great choice for pages that don't change often, such as blog posts, documentation pages, and marketing pages. This is where ISR enters.



