class PrefetchComparison {
    constructor() {
        this.slowMetrics = {
            prefetched: 0,
            clickTime: 0,
            cacheHits: 0
        };
        
        this.fastMetrics = {
            prefetched: 0,
            clickTime: 0,
            cacheHits: 0
        };
        
        this.prefetchedPages = new Set();
        this.pageContent = {
            about: {
                title: 'About Us',
                content: 'We are a company dedicated to web performance optimization. Our mission is to make the web faster for everyone through innovative techniques and best practices.'
            },
            products: {
                title: 'Our Products',
                content: 'Discover our amazing range of performance optimization tools and services. From automated testing to real-time monitoring, we have everything you need.'
            },
            contact: {
                title: 'Contact Us',
                content: 'Get in touch with our team of performance experts. We are here to help you optimize your website and improve user experience.'
            }
        };
        
        this.initializeElements();
        this.setupSlowSection();
        this.setupFastSection();
        this.setupModal();
        this.startDemo();
    }

    initializeElements() {
        // Slow section elements
        this.slowNavSpeedEl = document.getElementById('slow-nav-speed');
        this.slowPrefetchedEl = document.getElementById('slow-prefetched');
        this.slowClickTimeEl = document.getElementById('slow-click-time');
        this.slowCacheHitsEl = document.getElementById('slow-cache-hits');
        this.slowLog = document.getElementById('slow-log');
        this.slowCards = document.querySelectorAll('.slow-card');
        
        // Fast section elements
        this.fastNavSpeedEl = document.getElementById('fast-nav-speed');
        this.fastPrefetchedEl = document.getElementById('fast-prefetched');
        this.fastClickTimeEl = document.getElementById('fast-click-time');
        this.fastCacheHitsEl = document.getElementById('fast-cache-hits');
        this.fastLog = document.getElementById('fast-log');
        this.fastCards = document.querySelectorAll('.fast-card');
        
        // Modal elements
        this.modal = document.getElementById('page-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalContent = document.getElementById('modal-content');
        this.modalLoadTime = document.getElementById('modal-load-time');
        this.modalClose = document.getElementById('modal-close');
    }

    setupSlowSection() {
        this.logSlow('❌ No prefetch enabled - pages will load on click');
        
        this.slowCards.forEach(card => {
            const button = card.querySelector('.nav-button');
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = card.dataset.page;
                this.handleSlowNavigation(page);
            });
        });
    }

    setupFastSection() {
        this.logFast('✅ Prefetch enabled - hover cards to preload pages');
        
        this.fastCards.forEach(card => {
            // Setup hover prefetching
            card.addEventListener('mouseenter', () => {
                const page = card.dataset.page;
                if (!this.prefetchedPages.has(page)) {
                    this.prefetchPage(page, card);
                }
            });
            
            // Setup click navigation
            const button = card.querySelector('.nav-button');
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const page = card.dataset.page;
                this.handleFastNavigation(page);
            });
        });
    }

    prefetchPage(page, card) {
        this.prefetchedPages.add(page);
        
        // Visual feedback
        card.classList.add('prefetched');
        const statusText = card.querySelector('.prefetch-status span:last-child');
        statusText.textContent = 'Prefetched!';
        
        // Update metrics
        this.fastMetrics.prefetched++;
        this.updateFastMetrics();
        
        // Simulate prefetch with artificial delay
        setTimeout(() => {
            this.logFast(`🔮 Prefetched: ${page} page ready for instant navigation`);
        }, 100);
        
        this.logFast(`🔄 Prefetching ${page} page on hover...`);
    }

    handleSlowNavigation(page) {
        const clickStart = performance.now();
        
        this.logSlow(`❌ User clicked ${page} - starting to load page now...`);
        this.logSlow(`❌ No cache available - requesting from server`);
        
        // Simulate slow loading
        setTimeout(() => {
            const clickTime = Math.round(performance.now() - clickStart);
            this.slowMetrics.clickTime = clickTime;
            this.updateSlowMetrics();
            
            this.showModal(page, clickTime, false);
            this.logSlow(`❌ Page loaded after ${clickTime}ms (SLOW!)`);
        }, 800 + Math.random() * 400); // 800-1200ms delay
    }

    handleFastNavigation(page) {
        const clickStart = performance.now();
        
        if (this.prefetchedPages.has(page)) {
            // Fast navigation from cache
            setTimeout(() => {
                const clickTime = Math.round(performance.now() - clickStart);
                this.fastMetrics.clickTime = clickTime;
                this.fastMetrics.cacheHits++;
                this.updateFastMetrics();
                
                this.showModal(page, clickTime, true);
                this.logFast(`✅ Instant navigation! Loaded from cache in ${clickTime}ms`);
            }, 50 + Math.random() * 50); // 50-100ms delay
        } else {
            // Slow navigation (not prefetched)
            this.logFast(`⚠️ Page not prefetched - loading slowly...`);
            setTimeout(() => {
                const clickTime = Math.round(performance.now() - clickStart);
                this.fastMetrics.clickTime = clickTime;
                this.updateFastMetrics();
                
                this.showModal(page, clickTime, false);
                this.logFast(`⚠️ Slow load: ${clickTime}ms (should have hovered first!)`);
            }, 600 + Math.random() * 300);
        }
    }

    showModal(page, loadTime, fromCache) {
        const pageData = this.pageContent[page];
        
        this.modalTitle.textContent = pageData.title;
        this.modalContent.textContent = pageData.content;
        this.modalLoadTime.textContent = `${loadTime}ms`;
        
        const loadTimeEl = this.modalLoadTime.parentElement;
        loadTimeEl.className = `load-time ${fromCache ? 'fast' : 'slow'}`;
        
        this.modal.classList.add('show');
    }

    setupModal() {
        this.modalClose.addEventListener('click', () => {
            this.modal.classList.remove('show');
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.classList.remove('show');
            }
        });
    }

    updateSlowMetrics() {
        this.slowNavSpeedEl.textContent = 'Slow';
        this.slowPrefetchedEl.textContent = this.slowMetrics.prefetched;
        this.slowClickTimeEl.textContent = `${this.slowMetrics.clickTime}ms`;
        this.slowCacheHitsEl.textContent = this.slowMetrics.cacheHits;
    }

    updateFastMetrics() {
        this.fastNavSpeedEl.textContent = this.fastMetrics.prefetched > 0 ? 'Instant' : 'Ready';
        this.fastPrefetchedEl.textContent = this.fastMetrics.prefetched;
        this.fastClickTimeEl.textContent = `${this.fastMetrics.clickTime}ms`;
        this.fastCacheHitsEl.textContent = this.fastMetrics.cacheHits;
    }

    logSlow(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${timestamp}] ${message}`;
        
        this.slowLog.appendChild(entry);
        this.slowLog.scrollTop = this.slowLog.scrollHeight;
    }

    logFast(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${timestamp}] ${message}`;
        
        this.fastLog.appendChild(entry);
        this.fastLog.scrollTop = this.fastLog.scrollHeight;
    }

    startDemo() {
        // Demo is ready - no automatic popups
    }

}

// Initialize the prefetch comparison
document.addEventListener('DOMContentLoaded', () => {
    window.prefetchComparison = new PrefetchComparison();
});