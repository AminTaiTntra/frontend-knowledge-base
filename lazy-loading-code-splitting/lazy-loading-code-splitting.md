# React Code Splitting and Lazy Loading
## Problem Statement
When we build a React application, all components are combined into a single JavaScript bundle file
```jsx 
bundle.js (2 MB)
 ├ Home
 ├ Dashboard
 ├ Profile
 ├ Settings
 ├ Charts
 └ Admin
 ```
### What happens here?
Even if the user visits only the Home page, the browser still downloads the entire bundle 
including:

- Dashboard
- Profile
- Charts
- Admin

Problems:
- Large bundle size
- Slow initial load
- Poor performance
- Bad user experience

## What is Code Splitting?
Code Splitting means breaking your large JavaScript bundle into smaller chunks and loading them only when needed.

❌ Without Code Splitting

React app loads everything at once:
```jsx
bundle.js (2 MB)
 ├ Home
 ├ Dashboard
 ├ Profile
 ├ Settings
 ├ Charts
 └ Admin
 ```

 ### What happen here? 

 Even if user visits only Home → still loads everything → slow initial load.

✅ With Code Splitting

Split into chunks:
```jsx
main.js
home.chunk.js
dashboard.chunk.js
profile.chunk.js
```

Now the browser loads only the required file.

Example:
- Home page → loads home.chunk.js
- Dashboard page → loads dashboard.chunk.js

## What Code Splitting Improves?
- Faster initial load
- Better performance
- Reduced bundle size
- Better user experience
- Optimized network usage

## What is Lazy Loading?

Lazy Loading means loading a component only when it is required instead of loading it at the start.

Lazy loading uses code splitting internally.

### React provides:

- React.lazy()
- Suspense

### Normal Import (Without Lazy Loading)
```jsx
import Dashboard from "./Dashboard";
```
### Problem:

Dashboard loads immediately and becomes part of main bundle.
Even if not used.

### Lazy Import (With Lazy Loading)
```jsx
import React, { lazy, Suspense } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function LazyLoadingExample() {

  return (

    <Suspense fallback={<div>Loading...</div>}>

      <Dashboard />

    </Suspense>
  );
}
```

### Explanation
#### lazy()
```jsx
const Dashboard = lazy(() => import("./Dashboard"));
```

This tells React:

Load Dashboard only when required.

Webpack creates separate chunk file.

#### Suspense
```jsx
<Suspense fallback={<div>Loading...</div>}>
```
Suspense shows fallback UI while component loads.

Example:

- Loading spinner
- Loading text
- Skeleton

## Browser Behavior

### Without Code Splitting

Browser loads:
```jsx
main.js
```

Contains entire application.

### With Code Splitting

Initially loads:
```jsx
main.js
```

Later loads:
```jsx
dashboard.chunk.js
```

Only when user visits Dashboard.

## Where to Use Lazy Loading

Use Lazy loading for:

- Pages
- Dashboard
- Charts
- Modals
- Admin panels
- Reports
- Heavy libraries

## Where NOT to Use Lazy Loading

Avoid lazy loading for:

- Button
- Input
- Small components
- Icons

Because it creates extra network request.

## How to Achieve Code Splitting
### Method 1: Route Based Splitting (Most Common)

Each route loads separately.

```jsx
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/Profile"));

<Routes>
  <Route
    path="/"
    element={
      <Suspense fallback={<Loader />}>
        <Home />
      </Suspense>
    }
  />

  <Route
    path="/profile"
    element={
      <Suspense fallback={<Loader />}>
        <Profile />
      </Suspense>
    }
  />
</Routes>
```
### Method 2: Component Based Splitting

Used for heavy components.

```jsx
const HeavyChart = lazy(() => import("../components/HeavyChart"));

export default function Dashboard() {
  const [show, setShow] = useState(false);

  return (
    <>
      <button onClick={() => setShow(true)}>
        Load Chart
      </button>

      {show && (
        <Suspense fallback={<h3>Loading Chart...</h3>}>
          <HeavyChart />
        </Suspense>
      )}
    </>
  );
}

```

### Method 3: Library Based Splitting
Used for heavy libraries.

Example:
```jsx
const Editor = lazy(() => import("./Editor"))
```
Loads only when needed.

### How It Works Internally

Lazy loading uses dynamic import:
```jsx
import("./Dashboard")
```

Any bundlers like Webpack detects this and creates separate chunk file automatically.

## Before vs After Comparison
| Without Code Splitting | With Code Splitting |
| ---------------------- | ------------------- |
| Large bundle           | Small bundles       |
| Slow loading           | Fast loading        |
| Loads everything       | Loads only required |
| Poor performance       | Better performance  |

## Summary

Code splitting splits bundle into chunks, and lazy loading loads those chunks only when required, improving performance.

This improves:

- Performance
- Load time
- User experience