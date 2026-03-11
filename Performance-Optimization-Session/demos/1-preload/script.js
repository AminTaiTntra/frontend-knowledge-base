class PreloadComparison {
    constructor() {
        this.slowMetrics = {
            loadTime: 0,
            fontFlash: 'Yes',
            layoutShifts: 0
        };
        
        this.fastMetrics = {
            loadTime: 0,
            fontFlash: 'No',
            layoutShifts: 0
        };
        
        this.initializeElements();
        this.setupSlowSection();
        this.setupFastSection();
        this.startDemo();
    }

    initializeElements() {
        // Slow section elements
        this.slowSpeedEl = document.getElementById('slow-speed');
        this.slowLoadTimeEl = document.getElementById('slow-load-time');
        this.slowFontFlashEl = document.getElementById('slow-font-flash');
        this.slowLayoutShiftsEl = document.getElementById('slow-layout-shifts');
        this.slowLog = document.getElementById('slow-log');
        this.slowHeroImg = document.getElementById('slow-hero-img');
        this.slowFontElements = document.querySelectorAll('.slow-font');
        
        // Fast section elements
        this.fastSpeedEl = document.getElementById('fast-speed');
        this.fastLoadTimeEl = document.getElementById('fast-load-time');
        this.fastFontFlashEl = document.getElementById('fast-font-flash');
        this.fastLayoutShiftsEl = document.getElementById('fast-layout-shifts');
        this.fastLog = document.getElementById('fast-log');
        this.fastHeroImg = document.getElementById('fast-hero-img');
        this.fastFontElements = document.querySelectorAll('.fast-font');
    }

    setupSlowSection() {
        this.logSlow('❌ Starting without preload - resources will load slowly');
        
        // Simulate slow font loading with flash
        setTimeout(() => {
            this.logSlow('❌ HTML loaded, but font not ready yet');
            this.logSlow('❌ Text showing in fallback font (system font)');
        }, 500);
        
        // Simulate font flash after delay
        setTimeout(() => {
            this.simulateFontFlash();
            this.logSlow('❌ Font finally loaded - text flashes to new font!');
            this.slowMetrics.layoutShifts = 1;
            this.updateSlowMetrics();
        }, 2000);
        
        // Load hero image slowly
        setTimeout(() => {
            this.loadSlowImage(this.slowHeroImg, 800);
        }, 1500);
    }

    setupFastSection() {
        this.logFast('✅ Starting with preload - resources loading immediately');
        
        // Preload font immediately
        this.preloadFont();
        
        // Load hero image quickly (simulating preload)
        setTimeout(() => {
            this.loadFastImage(this.fastHeroImg, 100);
        }, 200);
        
        setTimeout(() => {
            this.logFast('✅ Font preloaded and ready instantly');
            this.logFast('✅ No font flash - smooth text rendering');
        }, 300);
    }

    preloadFont() {
        // Create preload link for Google Fonts
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
        preloadLink.as = 'style';
        preloadLink.onload = () => {
            // Load the actual stylesheet
            const styleLink = document.createElement('link');
            styleLink.rel = 'stylesheet';
            styleLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap';
            document.head.appendChild(styleLink);
            
            this.logFast('✅ Font preloaded successfully');
        };
        document.head.appendChild(preloadLink);
    }

    simulateFontFlash() {
        this.slowFontElements.forEach(element => {
            // Add flash animation
            element.classList.add('font-flash');
            
            // Change to Inter font after flash
            setTimeout(() => {
                element.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
                element.classList.remove('font-flash');
            }, 500);
        });
    }

    loadSlowImage(img, delay) {
        const src = img.dataset.src;
        if (!src) return;

        const loadStart = performance.now();
        
        this.logSlow('❌ Starting to load hero image...');
        
        setTimeout(() => {
            const tempImg = new Image();
            tempImg.onload = () => {
                const loadTime = Math.round(performance.now() - loadStart);
                
                img.src = src;
                img.classList.add('loaded');
                
                this.slowMetrics.loadTime = loadTime;
                this.updateSlowMetrics();
                
                // Show slow load indicator
                this.showLoadIndicator(img, loadTime, 'slow');
                
                this.logSlow(`❌ Hero image loaded after ${loadTime}ms (SLOW!)`);
            };
            tempImg.src = src;
        }, delay);
    }

    loadFastImage(img, delay) {
        const src = img.dataset.src;
        if (!src) return;

        const loadStart = performance.now();
        
        this.logFast('✅ Loading preloaded hero image...');
        
        setTimeout(() => {
            const tempImg = new Image();
            tempImg.onload = () => {
                const loadTime = Math.round(performance.now() - loadStart);
                
                img.src = src;
                img.classList.add('loaded');
                
                this.fastMetrics.loadTime = loadTime;
                this.updateFastMetrics();
                
                // Show fast load indicator
                this.showLoadIndicator(img, loadTime, 'fast');
                
                this.logFast(`✅ Hero image loaded in ${loadTime}ms (FAST!)`);
            };
            tempImg.src = src;
        }, delay);
    }

    showLoadIndicator(img, loadTime, type) {
        const indicator = document.createElement('div');
        indicator.className = `load-indicator ${type}`;
        indicator.textContent = `${loadTime}ms`;
        
        const container = img.closest('.image-container');
        if (container) {
            container.appendChild(indicator);
            
            setTimeout(() => {
                indicator.remove();
            }, 3000);
        }
    }

    updateSlowMetrics() {
        this.slowSpeedEl.textContent = 'Slow';
        this.slowLoadTimeEl.textContent = `${this.slowMetrics.loadTime}ms`;
        this.slowFontFlashEl.textContent = this.slowMetrics.fontFlash;
        this.slowLayoutShiftsEl.textContent = this.slowMetrics.layoutShifts;
    }

    updateFastMetrics() {
        this.fastSpeedEl.textContent = 'Fast';
        this.fastLoadTimeEl.textContent = `${this.fastMetrics.loadTime}ms`;
        this.fastFontFlashEl.textContent = this.fastMetrics.fontFlash;
        this.fastLayoutShiftsEl.textContent = this.fastMetrics.layoutShifts;
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

// Initialize the preload comparison
document.addEventListener('DOMContentLoaded', () => {
    window.preloadComparison = new PreloadComparison();
});