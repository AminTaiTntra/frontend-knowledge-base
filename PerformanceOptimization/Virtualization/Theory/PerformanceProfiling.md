# React Performance Profiling

## 1. Introduction

Performance profiling is the process of analyzing how an application behaves during runtime in terms of rendering, CPU usage, memory usage, and execution time.

It helps developers identify performance bottlenecks and optimize application performance.

---

## 2. Why Performance Profiling is Important

- Detect slow components
- Identify unnecessary re-renders
- Optimize heavy calculations
- Improve user experience
- Reduce CPU and memory usage

---

## 3. Development vs Production Build

### Development Mode

- Includes debugging checks  
- Slower rendering  
- Used for development and debugging  

### Production Mode

- Optimized build  
- Faster rendering  
- Used for accurate performance profiling  

### Commands

```bash
yarn build
yarn start

### 4. Tools for Performance Profiling

1. Chrome DevTools Performance Tab  
2. React Developer Tools Profiler  
3. Lighthouse  
4. TanStack Query Devtools (for API debugging)

---

## 5. Using Chrome DevTools Performance Tab

### Steps

1. Open Chrome DevTools  
2. Go to **Performance** tab  
3. Click **Record**  
4. Perform actions in the application  
5. Stop recording  

### This shows

- CPU usage  
- JavaScript execution  
- Rendering time  
- Layout shifts  

---

## 6. React DevTools Profiler

React DevTools Profiler allows developers to measure how long React components take to render.

### Steps

1. Install **React Developer Tools extension**  
2. Open **DevTools**  
3. Go to **Profiler** tab  
4. Click **Record**  
5. Perform UI actions  
6. Stop recording  

### Profiler shows

- Component render time  
- Why component rendered  
- Component hierarchy (**Flamegraph**)

---

## 7. Understanding Profiler Views

### Flamegraph

Shows component hierarchy and rendering cost.

### Ranked

Shows components sorted by render time.

### Timeline

Shows rendering activity across time.

---

## 8. Common Performance Problems

1. Unnecessary re-renders  
2. Large list rendering  
3. Expensive calculations  
4. Frequent state updates  
5. Multiple API calls  

---

## 9. Optimization Techniques

### Memoization

- `React.memo`
- `useMemo`
- `useCallback`

### Lazy Loading

```javascript
React.lazy()

14. Summary
Performance profiling helps identify slow components and rendering bottlenecks.
Using tools like Chrome DevTools and React Profiler, developers can analyze rendering behavior and optimize applications using memoization, virtualization, lazy loading, and efficient state management.
