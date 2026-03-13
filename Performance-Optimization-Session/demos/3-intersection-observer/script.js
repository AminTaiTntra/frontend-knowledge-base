class SideBySideComparison {
    constructor() {
        this.scrollMetrics = {
            imagesLoaded: 0,
            scrollCount: 0,
            performanceScore: 100,
            loadTimes: []
        };
        
        this.observerMetrics = {
            imagesLoaded: 0,
            scrollCount: 0,
            performanceScore: 100,
            loadTimes: []
        };
        
        this.observers = [];
        this.scrollHandler = null;
        
        this.initializeElements();
        this.setupScrollEvents();
        this.setupIntersectionObserver();
        this.startMonitoring();
    }

    initializeElements() {
        // Scroll Events Section Elements
        this.scrollPerformanceEl = document.getElementById('scroll-performance');
        this.scrollEventsCountEl = document.getElementById('scroll-events-count');
        this.scrollImagesLoadedEl = document.getElementById('scroll-images-loaded');
        this.scrollLoadTimeEl = document.getElementById('scroll-load-time');
        this.scrollPerformanceLog = document.getElementById('scroll-performance-log');
        this.scrollContainer = document.getElementById('scroll-container');
        this.scrollGalleryItems = this.scrollContainer.querySelectorAll('.gallery-item');
        
        // Intersection Observer Section Elements
        this.observerPerformanceEl = document.getElementById('observer-performance');
        this.observerEventsCountEl = document.getElementById('observer-events-count');
        this.observerImagesLoadedEl = document.getElementById('observer-images-loaded');
        this.observerLoadTimeEl = document.getElementById('observer-load-time');
        this.observerPerformanceLog = document.getElementById('observer-performance-log');
        this.observerContainer = document.getElementById('observer-container');
        this.observerGalleryItems = this.observerContainer.querySelectorAll('.gallery-item');
    }

    setupScrollEvents() {
        const handleScroll = () => {
            this.scrollMetrics.scrollCount++;
            
            // HEAVY computation to show performance impact
            const start = performance.now();
            
            // Simulate expensive operations
            for (let i = 0; i < 50000; i++) {
                Math.random() * Math.random() * Math.sin(i) * Math.cos(i);
            }
            
            // Multiple expensive DOM queries
            this.scrollGalleryItems.forEach(el => {
                for (let j = 0; j < 3; j++) {
                    el.offsetHeight;
                    el.getBoundingClientRect();
                }
            });
            
            const processingTime = performance.now() - start;
            
            // Degrade performance score
            this.scrollMetrics.performanceScore = Math.max(0, 100 - Math.floor(this.scrollMetrics.scrollCount / 2));
            
            // Check viewport manually (expensive way)
            this.checkViewportWithScrollEvents();
            
            // Log every scroll event
            this.logScrollPerformance(`🔥 SCROLL EVENT #${this.scrollMetrics.scrollCount} - ${processingTime.toFixed(1)}ms processing!`);
            
            // Update metrics
            this.updateScrollMetrics();
            
            // Show performance warnings
            if (this.scrollMetrics.scrollCount % 3 === 0) {
                this.showScrollWarning();
            }
        };

        // Listen to scroll events on the scroll container
        this.scrollContainer.addEventListener('scroll', handleScroll);
        this.scrollHandler = handleScroll;
        
        this.logScrollPerformance('🚨 Scroll Events Active - Heavy processing on every scroll!');
    }

    checkViewportWithScrollEvents() {
        const containerRect = this.scrollContainer.getBoundingClientRect();
        const scrollTop = this.scrollContainer.scrollTop;
        
        this.scrollGalleryItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top < containerRect.bottom && rect.bottom > containerRect.top;
            
            if (isVisible) {
                item.classList.add('visible');
                const img = item.querySelector('.lazy-image');
                if (img && !img.classList.contains('loaded')) {
                    this.loadScrollImage(img);
                }
            }
        });
    }

    loadScrollImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        const loadStart = performance.now();
        
        // Add artificial delay to show slower loading
        setTimeout(() => {
            const tempImg = new Image();
            tempImg.onload = () => {
                const loadTime = Math.round(performance.now() - loadStart);
                this.scrollMetrics.loadTimes.push(loadTime);
                
                img.src = src;
                img.classList.add('loaded');
                
                this.scrollMetrics.imagesLoaded++;
                this.updateScrollMetrics();
                
                // Show slow load indicator
                this.showLoadTimeIndicator(img, loadTime, 'slow');
                
                this.logScrollPerformance(`📸 Image loaded via scroll events: ${loadTime}ms (SLOW!)`);
            };
            tempImg.src = src;
        }, 150 + Math.random() * 200); // Random delay 150-350ms
    }
    setupIntersectionObserver() {
        // Image loading observer
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('.lazy-image');
                    if (img && !img.classList.contains('loaded')) {
                        this.loadObserverImage(img);
                        imageObserver.unobserve(entry.target);
                    }
                }
            });
        }, {
            root: this.observerContainer,
            rootMargin: '50px'
        });

        // Animation observer
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.logObserverPerformance(`✨ Element ${entry.target.dataset.index} detected efficiently (0ms CPU!)`);
                }
            });
        }, {
            root: this.observerContainer,
            threshold: 0.1
        });

        // Observe all gallery items
        this.observerGalleryItems.forEach(item => {
            imageObserver.observe(item);
            animationObserver.observe(item);
        });

        this.observers = [imageObserver, animationObserver];
        
        this.logObserverPerformance('🚀 Intersection Observer active - Zero scroll events needed!');
        this.logObserverPerformance('✅ Browser-optimized viewport detection enabled');
    }

    loadObserverImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        const loadStart = performance.now();
        
        const tempImg = new Image();
        tempImg.onload = () => {
            const loadTime = Math.round(performance.now() - loadStart);
            this.observerMetrics.loadTimes.push(loadTime);
            
            img.src = src;
            img.classList.add('loaded');
            
            this.observerMetrics.imagesLoaded++;
            this.updateObserverMetrics();
            
            // Show fast load indicator
            this.showLoadTimeIndicator(img, loadTime, 'fast');
            
            this.logObserverPerformance(`📸 Image loaded via Intersection Observer: ${loadTime}ms (FAST!)`);
        };
        tempImg.src = src;
    }
    showLoadTimeIndicator(img, loadTime, type) {
        const indicator = document.createElement('div');
        indicator.className = `load-time-indicator ${type}`;
        indicator.textContent = `${loadTime}ms`;
        
        const container = img.closest('.gallery-item');
        container.appendChild(indicator);
        
        setTimeout(() => {
            indicator.remove();
        }, 3000);
    }

    showScrollWarning() {
        const warning = document.createElement('div');
        warning.className = 'scroll-warning';
        warning.innerHTML = `
            <strong>⚠️ Performance Impact!</strong><br>
            ${this.scrollMetrics.scrollCount} scroll events fired!<br>
            Performance: ${this.scrollMetrics.performanceScore}%
        `;
        
        document.querySelector('.bad-section').appendChild(warning);
        
        setTimeout(() => {
            warning.remove();
        }, 3000);
    }

    updateScrollMetrics() {
        this.scrollPerformanceEl.textContent = `${this.scrollMetrics.performanceScore}%`;
        this.scrollEventsCountEl.textContent = this.scrollMetrics.scrollCount;
        this.scrollImagesLoadedEl.textContent = this.scrollMetrics.imagesLoaded;
        
        const avgLoadTime = this.scrollMetrics.loadTimes.length > 0 
            ? Math.round(this.scrollMetrics.loadTimes.reduce((sum, time) => sum + time, 0) / this.scrollMetrics.loadTimes.length)
            : 0;
        this.scrollLoadTimeEl.textContent = `${avgLoadTime}ms`;
        
        // Update performance badge color
        this.scrollPerformanceEl.style.color = this.scrollMetrics.performanceScore < 50 ? '#ef4444' : 
                                               this.scrollMetrics.performanceScore < 80 ? '#f59e0b' : '#10b981';
    }

    updateObserverMetrics() {
        this.observerPerformanceEl.textContent = `${this.observerMetrics.performanceScore}%`;
        this.observerEventsCountEl.textContent = this.observerMetrics.scrollCount; // Always 0
        this.observerImagesLoadedEl.textContent = this.observerMetrics.imagesLoaded;
        
        const avgLoadTime = this.observerMetrics.loadTimes.length > 0 
            ? Math.round(this.observerMetrics.loadTimes.reduce((sum, time) => sum + time, 0) / this.observerMetrics.loadTimes.length)
            : 0;
        this.observerLoadTimeEl.textContent = `${avgLoadTime}ms`;
    }
    logScrollPerformance(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry scroll-log';
        entry.textContent = `[${timestamp}] ${message}`;
        
        this.scrollPerformanceLog.appendChild(entry);
        this.scrollPerformanceLog.scrollTop = this.scrollPerformanceLog.scrollHeight;
    }

    logObserverPerformance(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry observer-log';
        entry.textContent = `[${timestamp}] ${message}`;
        
        this.observerPerformanceLog.appendChild(entry);
        this.observerPerformanceLog.scrollTop = this.observerPerformanceLog.scrollHeight;
    }

    startMonitoring() {
        // Demo is ready - no automatic popups
    }

}

// Initialize the side-by-side comparison
document.addEventListener('DOMContentLoaded', () => {
    window.comparison = new SideBySideComparison();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.comparison && window.comparison.observers) {
        window.comparison.observers.forEach(observer => observer.disconnect());
    }
});