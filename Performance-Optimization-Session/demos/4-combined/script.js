class CombinedComparison {
    constructor() {
        this.unoptimizedMetrics = {
            imagesLoaded: 0,
            loadTime: 0,
            prefetched: 0,
            performance: 45
        };
        
        this.optimizedMetrics = {
            imagesLoaded: 0,
            loadTime: 0,
            prefetched: 0,
            performance: 100
        };
        
        this.observers = [];
        this.prefetchedResources = new Set();
        
        this.initializeElements();
        this.setupUnoptimizedSection();
        this.setupOptimizedSection();
        this.startDemo();
    }

    initializeElements() {
        // Unoptimized section elements
        this.unoptimizedPerformanceEl = document.getElementById('unoptimized-performance');
        this.unoptimizedLoadTimeEl = document.getElementById('unoptimized-load-time');
        this.unoptimizedImagesEl = document.getElementById('unoptimized-images');
        this.unoptimizedPrefetchedEl = document.getElementById('unoptimized-prefetched');
        this.unoptimizedLog = document.getElementById('unoptimized-log');
        this.unoptimizedContainer = document.getElementById('unoptimized-container');
        this.unoptimizedHero = document.getElementById('unoptimized-hero');
        this.unoptimizedGalleryItems = this.unoptimizedContainer.querySelectorAll('.gallery-item');
        
        // Optimized section elements
        this.optimizedPerformanceEl = document.getElementById('optimized-performance');
        this.optimizedLoadTimeEl = document.getElementById('optimized-load-time');
        this.optimizedImagesEl = document.getElementById('optimized-images');
        this.optimizedPrefetchedEl = document.getElementById('optimized-prefetched');
        this.optimizedLog = document.getElementById('optimized-log');
        this.optimizedContainer = document.getElementById('optimized-container');
        this.optimizedHero = document.getElementById('optimized-hero');
        this.optimizedGalleryItems = this.optimizedContainer.querySelectorAll('.gallery-item');
        this.prefetchableCards = document.querySelectorAll('.prefetchable');
    }

    setupUnoptimizedSection() {
        // Load hero image slowly
        setTimeout(() => {
            this.loadUnoptimizedImage(this.unoptimizedHero, 800);
        }, 500);
        
        // Load all gallery images at once (bad practice)
        this.unoptimizedGalleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
                const img = item.querySelector('img');
                if (img) {
                    this.loadUnoptimizedImage(img, 400 + (index * 200));
                }
            }, 1000 + (index * 300));
        });
        
        this.logUnoptimized('❌ Loading all resources at once - inefficient!');
        this.logUnoptimized('❌ No preload: Hero image loading slowly');
        this.logUnoptimized('❌ No lazy loading: All images requested immediately');
    }

    setupOptimizedSection() {
        // Load hero image quickly (simulating preload)
        setTimeout(() => {
            this.loadOptimizedImage(this.optimizedHero, 50);
        }, 100);
        
        // Setup Intersection Observer for gallery
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    const img = entry.target.querySelector('img');
                    if (img && !img.classList.contains('loaded')) {
                        this.loadOptimizedImage(img, 80);
                        imageObserver.unobserve(entry.target);
                    }
                }
            });
        }, {
            root: this.optimizedContainer,
            rootMargin: '50px'
        });

        this.optimizedGalleryItems.forEach(item => {
            imageObserver.observe(item);
        });

        this.observers.push(imageObserver);
        
        // Setup prefetching
        this.setupPrefetching();
        
        this.logOptimized('✅ Preload: Hero image loading instantly');
        this.logOptimized('✅ Intersection Observer: Efficient lazy loading active');
        this.logOptimized('✅ Prefetch: Hover cards to prefetch resources');
    }

    setupPrefetching() {
        this.prefetchableCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('prefetched')) {
                    const page = card.dataset.page;
                    this.prefetchResource(page);
                    card.classList.add('prefetched');
                    
                    this.optimizedMetrics.prefetched++;
                    this.updateOptimizedMetrics();
                    
                    this.logOptimized(`🔮 Prefetched: ${page} page ready for instant navigation`);
                }
            });
        });
    }

    prefetchResource(page) {
        if (!this.prefetchedResources.has(page)) {
            this.prefetchedResources.add(page);
            
            // Simulate prefetch with a fake link
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = `./pages/${page}.html`;
            document.head.appendChild(link);
        }
    }

    loadUnoptimizedImage(img, delay) {
        const src = img.dataset.src;
        if (!src) return;

        const loadStart = performance.now();
        
        setTimeout(() => {
            const tempImg = new Image();
            tempImg.onload = () => {
                const loadTime = Math.round(performance.now() - loadStart);
                
                img.src = src;
                img.classList.add('loaded');
                
                this.unoptimizedMetrics.imagesLoaded++;
                this.unoptimizedMetrics.loadTime = Math.max(this.unoptimizedMetrics.loadTime, loadTime);
                this.updateUnoptimizedMetrics();
                
                // Show slow load indicator
                this.showLoadIndicator(img, loadTime, 'slow');
                
                this.logUnoptimized(`📸 Image loaded slowly: ${loadTime}ms`);
            };
            tempImg.src = src;
        }, delay);
    }

    loadOptimizedImage(img, delay) {
        const src = img.dataset.src;
        if (!src) return;

        const loadStart = performance.now();
        
        setTimeout(() => {
            const tempImg = new Image();
            tempImg.onload = () => {
                const loadTime = Math.round(performance.now() - loadStart);
                
                img.src = src;
                img.classList.add('loaded');
                
                this.optimizedMetrics.imagesLoaded++;
                this.optimizedMetrics.loadTime = Math.max(this.optimizedMetrics.loadTime, loadTime);
                this.updateOptimizedMetrics();
                
                // Show fast load indicator
                this.showLoadIndicator(img, loadTime, 'fast');
                
                this.logOptimized(`📸 Image loaded efficiently: ${loadTime}ms`);
            };
            tempImg.src = src;
        }, delay);
    }

    showLoadIndicator(img, loadTime, type) {
        const indicator = document.createElement('div');
        indicator.className = `${type}-load-indicator`;
        indicator.textContent = `${loadTime}ms`;
        
        const container = img.closest('.gallery-item') || img.closest('.hero-image');
        if (container) {
            container.appendChild(indicator);
            
            setTimeout(() => {
                indicator.remove();
            }, 3000);
        }
    }

    updateUnoptimizedMetrics() {
        this.unoptimizedPerformanceEl.textContent = `${this.unoptimizedMetrics.performance}%`;
        this.unoptimizedLoadTimeEl.textContent = `${this.unoptimizedMetrics.loadTime}ms`;
        this.unoptimizedImagesEl.textContent = this.unoptimizedMetrics.imagesLoaded;
        this.unoptimizedPrefetchedEl.textContent = this.unoptimizedMetrics.prefetched;
    }

    updateOptimizedMetrics() {
        this.optimizedPerformanceEl.textContent = `${this.optimizedMetrics.performance}%`;
        this.optimizedLoadTimeEl.textContent = `${this.optimizedMetrics.loadTime}ms`;
        this.optimizedImagesEl.textContent = this.optimizedMetrics.imagesLoaded;
        this.optimizedPrefetchedEl.textContent = this.optimizedMetrics.prefetched;
    }

    logUnoptimized(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${timestamp}] ${message}`;
        
        this.unoptimizedLog.appendChild(entry);
        this.unoptimizedLog.scrollTop = this.unoptimizedLog.scrollHeight;
    }

    logOptimized(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${timestamp}] ${message}`;
        
        this.optimizedLog.appendChild(entry);
        this.optimizedLog.scrollTop = this.optimizedLog.scrollHeight;
    }

    startDemo() {
        // Demo is ready - no automatic popups
    }

}

// Initialize the combined comparison
document.addEventListener('DOMContentLoaded', () => {
    window.combinedComparison = new CombinedComparison();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.combinedComparison && window.combinedComparison.observers) {
        window.combinedComparison.observers.forEach(observer => observer.disconnect());
    }
});