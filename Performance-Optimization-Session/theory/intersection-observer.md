# Intersection Observer API

## What is Intersection Observer?

A browser API that efficiently observes changes in the intersection of a target element with an ancestor element or the viewport.

## Why Use Intersection Observer?

### Traditional Scroll Events Problems
- **Performance**: Fires continuously during scroll
- **Blocking**: Synchronous, blocks main thread
- **Battery**: High CPU usage on mobile
- **Complexity**: Manual viewport calculations

### Intersection Observer Benefits
- **Asynchronous**: Non-blocking observations
- **Efficient**: Browser-optimized calculations
- **Battery-friendly**: Minimal CPU usage
- **Precise**: Built-in threshold controls

## Core Concepts

### Observer Configuration
```javascript
const options = {
  root: null,           // viewport (default)
  rootMargin: '0px',    // margin around root
  threshold: 0.1        // 10% visibility triggers
};
```

### Threshold Strategies
- **0.0**: Element enters viewport
- **0.5**: Element 50% visible
- **1.0**: Element fully visible
- **[0, 0.25, 0.5, 0.75, 1]**: Multiple thresholds

## Production Use Cases

### Lazy Loading Images
```javascript
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});
```

### Infinite Scrolling
```javascript
const infiniteObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      loadMoreContent();
    }
  });
}, { rootMargin: '100px' });
```

### Analytics Tracking
```javascript
const analyticsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      trackElementView(entry.target.id);
    }
  });
}, { threshold: 0.5 });
```

### Animation Triggers
```javascript
const animationObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.3 });
```

## Advanced Patterns

### Progressive Image Loading
1. **Placeholder**: Low-quality image placeholder
2. **Intersection**: Detect when image enters viewport
3. **Progressive**: Load higher quality versions
4. **Fallback**: Handle loading errors gracefully

### Content Prioritization
1. **Above-fold**: Immediate loading
2. **Below-fold**: Intersection-based loading
3. **Off-screen**: Prefetch on approach
4. **Never-seen**: Skip loading entirely

### Performance Monitoring
```javascript
const performanceObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const loadTime = performance.now() - entry.time;
    analytics.track('element-load-time', {
      element: entry.target.id,
      loadTime,
      intersectionRatio: entry.intersectionRatio
    });
  });
});
```

## Performance Best Practices

### Observer Reuse
- Create one observer per use case
- Observe multiple elements with same observer
- Unobserve elements when done

### Threshold Optimization
- Use minimal thresholds needed
- Avoid too many threshold values
- Consider rootMargin for early triggering

### Memory Management
- Unobserve elements when component unmounts
- Disconnect observers when not needed
- Clean up references to prevent leaks