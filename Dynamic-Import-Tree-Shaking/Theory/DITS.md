## Dynamic Import & Tree Shaking in Modern JavaScript

* Improving Performance with Code Splitting & Dead Code Elimination

## Why Performance Matters

* Large bundle size increases load time
* Poor user experience on slow networks
* Higher bounce rate

->  Large Bundle → Slow Load → Bad UX

## What is Dynamic Import?

* Loads code at runtime
* Enables code splitting
* Supports lazy loading
* Improves initial page load speed

# Static Import Example :

import HeavyComponent from "./HeavyComponent

# Dynamic Import Example :

const HeavyComponent = React.lazy(() =>
import("./HeavyComponent")
)

<Suspense fallback={<p>Loading...</p>}>
<HeavyComponent />
</Suspense>

# EXPLANATION:

HeavyComponent loads only when it is needed.

## Live Demo Explanation(Explain in demo)

# Before (Static Import)

* HeavyComponent included in main bundle
* Larger initial JavaScript file
* Slower initial load

# After (Dynamic Import)

* HeavyComponent split into a separate chunk
* Loaded only on user interaction
* Smaller initial bundle

## What is Tree Shaking?

* Removes unused exports from the final bundle
* Works with ES Modules (import/export)
* Happens during production build

# Example:

// App.jsx
import { add } from "./utils"

// utils.js
export function add(a, b) {
return a + b
}
export function repeatFunction() {
return "TreeShakingDemo".repeat(50000)
}

# RESULT
repeatFunction() is removed from the production bundle.

## How Bundlers Help

# Modern bundlers like:

* Webpack
* Vite
* Rollup

# They:

* Perform static analysis
* Split code into chunks
* Remove unused exports
* Optimize production builds

## Real World Use Cases

* Admin panels
* Large chart libraries
* Dashboard modules
* Route-based splitting
* Role-based feature loading

# Example:

* Load admin module only for admin users.

## Benefits

* Smaller initial bundle
* Faster application loading
* Better user experience
* Improved Lighthouse score
* Optimized performance on mobile devices


## Conclusion

* Performance optimization is essential in modern web applications.

# Dynamic Import and Tree Shaking together:

* Reduce bundle size
* Improve load speed
* Enhance user experience
* Make applications scalable

### Dynamic Import improves initial loading performance, while Tree Shaking reduces overall bundlesize. Together, they make modern web applications faster and more efficient.