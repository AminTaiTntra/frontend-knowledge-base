# Resource Hints: Preload & Prefetch

## Preload vs Prefetch

### Preload
- **Purpose**: Load critical resources immediately
- **Priority**: High priority, blocks rendering if needed
- **Use Case**: Critical CSS, fonts, hero images
- **Timing**: Current page, immediate need

### Prefetch
- **Purpose**: Load resources for future navigation
- **Priority**: Low priority, idle time loading
- **Use Case**: Next page resources, user likely to visit
- **Timing**: Future pages

## Resource Types & Strategies

### Critical Resources (Preload)
```html
<!-- Critical CSS -->
<link rel="preload" href="/critical.css" as="style">

<!-- Web Fonts -->
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>

<!-- Hero Images -->
<link rel="preload" href="/hero.jpg" as="image">

<!-- Critical JavaScript -->
<link rel="preload" href="/app.js" as="script">
```

### Future Resources (Prefetch)
```html
<!-- Next page likely to be visited -->
<link rel="prefetch" href="/product-details.html">

<!-- Commonly accessed images -->
<link rel="prefetch" href="/product-gallery.jpg">

<!-- Route-based prefetching -->
<link rel="prefetch" href="/api/products">
```

## Production Scenarios

### E-commerce Product Page
1. **Preload**: Product hero image, critical CSS
2. **Prefetch**: Related products, cart page resources
3. **Strategy**: Load current product fast, prepare for user journey

### News Portal
1. **Preload**: Article content, reading fonts
2. **Prefetch**: Trending articles, category pages
3. **Strategy**: Fast article reading, smooth navigation

### SPA Dashboard
1. **Preload**: Initial route bundle, core CSS
2. **Prefetch**: Secondary route bundles
3. **Strategy**: Fast initial load, seamless route transitions

## Implementation Patterns

### Dynamic Preloading
```javascript
const preloadCriticalResource = (url, type) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = url;
  link.as = type;
  document.head.appendChild(link);
};
```

### Intelligent Prefetching
```javascript
const prefetchOnHover = (element, url) => {
  element.addEventListener('mouseenter', () => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  }, { once: true });
};
```

### Connection Optimization
```html
<!-- DNS prefetch for external domains -->
<link rel="dns-prefetch" href="//cdn.example.com">

<!-- Preconnect for critical third-party resources -->
<link rel="preconnect" href="//fonts.googleapis.com" crossorigin>
```

## Performance Metrics Impact

### Core Web Vitals
- **LCP**: Preload hero images, critical CSS
- **FID**: Prefetch interactive resources
- **CLS**: Preload fonts to prevent layout shifts

### Loading Performance
- **TTFB**: DNS prefetch, preconnect
- **FCP**: Preload critical rendering resources
- **TTI**: Strategic script preloading/prefetching