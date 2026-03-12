# Build Process Documentation

## Overview
This portfolio uses a modern build pipeline to optimize assets for production deployment.

## Setup

### Installation
```bash
npm install
```

Installs development dependencies:
- **esbuild**: Fast JavaScript bundler/minifier
- **postcss**: CSS transformation tool
- **csso-cli**: Advanced CSS minification
- **prettier**: Code formatter
- **eslint**: JavaScript linter

## Scripts

### Production Build
```bash
npm run build
```
Runs the complete build pipeline:
1. Minifies CSS files
2. Minifies JavaScript files
3. Generates build summary

Output files:
- `assets/css/dist/main.min.css`
- `assets/css/dist/light-mode.min.css`
- `assets/js/dist/core.min.js`
- `assets/js/dist/animations.min.js`
- `assets/js/dist/contact-form.min.js`

### Development Watch Mode
```bash
npm run watch
```
Monitors file changes and automatically rebuilds on save. Useful during development.

### Format Code
```bash
npm run format
```
Formats JavaScript and CSS files using Prettier.

### Lint JavaScript
```bash
npm run lint
```
Checks JavaScript files for code quality issues.

## Build Scripts

Located in `/scripts/`:

- **build-css.js**: Minifies CSS with CSSO (60-70% compression)
- **build-js.js**: Minifies JS with esbuild (40-50% compression)
- **cleanup.js**: Generates build summary with file sizes
- **watch.js**: File system watcher for development

## Deployment

### Using Minified Files (Production)
Update `index.html` to reference minified files:

```html
<!-- Before -->
<link href="assets/css/main.css" rel="stylesheet">

<!-- After -->
<link href="assets/css/dist/main.min.css" rel="stylesheet">
```

### Current Setup (Development)
Currently serving unminified files for easier debugging. Update to minified versions when ready for production.

## Performance Impact

Expected reductions from minification:
- **main.css**: ~2.2KB → ~0.7KB (68% reduction)
- **animations.js**: ~7KB → ~3KB (57% reduction)
- **core.js**: ~2KB → ~1KB (50% reduction)
- **contact-form.js**: ~3KB → ~1.2KB (60% reduction)

**Total savings**: ~15-20% of CSS/JS assets

## Next Steps

1. Test minified files in staging
2. Update HTML to use dist/ files
3. Run performance audit with Lighthouse
4. Monitor Core Web Vitals in production
5. Consider critical CSS extraction for above-fold content
