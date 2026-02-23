/**
 * Sentry Error Tracking Setup
 * 
 * To enable error tracking:
 * 1. Create a Sentry account at https://sentry.io
 * 2. Create a project for your portfolio
 * 3. Replace YOUR_SENTRY_DSN with your actual DSN
 * 4. Uncomment the script tag in index.html
 * 
 * Sentry Documentation: https://docs.sentry.io/platforms/javascript/
 */

// Initialize Sentry (via CDN)
// Add to <head>: <script src="https://browser.sentry-cdn.com/7.84.0/bundle.min.js"></script>

if (typeof Sentry !== 'undefined') {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN', // Replace with your Sentry DSN
    environment: 'production',
    tracesSampleRate: 0.1, // 10% transaction sampling
    release: '2.0.0',
    
    // Capture exceptions and messages
    attachStacktrace: true,
    
    // User context (optional)
    initialScope: {
      tags: {
        component: 'portfolio',
        app_version: '2.0.0'
      }
    },
    
    // Filter out certain errors
    beforeSend(event, hint) {
      // Ignore 404 errors from missing assets
      if (event.exception) {
        const error = hint.originalException;
        if (error.message && error.message.includes('404')) {
          return null;
        }
      }
      return event;
    },
    
    // Error reporting breadcrumbs
    breadcrumbs: {
      console: true,
      dom: true,
      fetch: true,
      history: true,
      sentry: true,
      xhr: true
    }
  });

  // Capture unhandled promise rejections
  Sentry.captureException = function(exception) {
    console.error('Error tracked:', exception);
    // Call original Sentry method
    return Sentry.captureException(exception);
  };

  console.log('✅ Sentry error tracking initialized');
} else {
  console.warn('⚠️  Sentry not loaded. Error tracking disabled.');
}

// Optional: Track custom errors
window.addEventListener('error', function(event) {
  if (typeof Sentry !== 'undefined') {
    Sentry.captureException(event.error);
  }
});

// Optional: Track unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
  if (typeof Sentry !== 'undefined') {
    Sentry.captureException(event.reason);
  }
});
