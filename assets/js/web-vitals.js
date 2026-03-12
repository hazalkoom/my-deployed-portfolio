/**
 * Core Web Vitals Monitoring
 * Tracks LCP, FID, CLS, and sends to analytics
 */

(function () {
  "use strict";

  // Check if web-vitals library is available
  if (typeof window.webVitals === 'undefined') {
    console.warn('web-vitals library not loaded. Install from: https://web.dev/web-vitals/');
    return;
  }

  // Get the web-vitals functions
  var { getCLS, getFID, getFCP, getLCP, getTTFB } = window.webVitals;

  // Initialize vitals tracking
  function initWebVitals() {
    var vitals = {
      LCP: null,
      FID: null,
      CLS: null,
      FCP: null,
      TTFB: null
    };

    /**
     * Send metric to analytics (Google Analytics or custom)
     */
    function sendMetricToAnalytics(name, value) {
      if (typeof gtag === 'undefined') return;

      var eventLabel = {
        'LCP': 'Largest Contentful Paint',
        'FID': 'First Input Delay',
        'CLS': 'Cumulative Layout Shift',
        'FCP': 'First Contentful Paint',
        'TTFB': 'Time to First Byte'
      }[name] || name;

      gtag('event', 'web_vital', {
        'event_category': 'Web Vitals',
        'event_label': eventLabel,
        'value': Math.round(value),
        'event_callback': function () {
          console.log('Web Vital recorded:', name, '=', Math.round(value) + 'ms');
        }
      });
    }

    /**
     * Handle metric callback
     */
    function handleMetric(metric) {
      vitals[metric.name] = metric.value;
      
      console.log(`📊 Web Vital - ${metric.name}:`, Math.round(metric.value) + 'ms');
      
      // Log to analytics
      sendMetricToAnalytics(metric.name, metric.value);

      // Log thresholds
      logVitalStatus(metric.name, metric.value);
    }

    /**
     * Log if vital meets good/needs improvement/poor thresholds
     */
    function logVitalStatus(name, value) {
      var threshold = {
        'LCP': [2500, 4000],     // Good < 2.5s, Needs improvement < 4s
        'FID': [100, 300],       // Good < 100ms, Needs improvement < 300ms
        'CLS': [0.1, 0.25],      // Good < 0.1, Needs improvement < 0.25
        'FCP': [1800, 3000],     // Good < 1.8s, Needs improvement < 3s
        'TTFB': [600, 1200]      // Good < 600ms, Needs improvement < 1.2s
      }[name];

      if (!threshold) return;

      var [good, needsImprovement] = threshold;
      var status = value <= good ? '✅ Good' : value <= needsImprovement ? '⚠️  Needs Improvement' : '❌ Poor';
      
      console.log(`   ${status} (${Math.round(value)}ms)`);
    }

    // Register callbacks for each metric
    if (typeof getCLS === 'function') {
      getCLS(handleMetric);
    }
    if (typeof getFID === 'function') {
      getFID(handleMetric);
    }
    if (typeof getFCP === 'function') {
      getFCP(handleMetric);
    }
    if (typeof getLCP === 'function') {
      getLCP(handleMetric);
    }
    if (typeof getTTFB === 'function') {
      getTTFB(handleMetric);
    }

    console.log('🚀 Core Web Vitals monitoring initialized');
    return vitals;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebVitals, { once: true });
  } else {
    initWebVitals();
  }
})();
