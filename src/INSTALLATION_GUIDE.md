# 30-Day V1 Rebuild - Package Installation Guide

## Required Dependencies

### Production Dependencies

```bash
# Error tracking and monitoring
npm install @sentry/react web-vitals

# Form validation (Week 2)
npm install zod

# React Hook Form (Week 2 - specific version required)
npm install react-hook-form@7.55.0
```

### Development Dependencies

```bash
# E2E Testing
npm install -D @playwright/test

# Accessibility Testing
npm install -D @axe-core/cli

# Performance Testing  
npm install -D @lhci/cli

# Build Optimization (Week 3)
npm install -D vite-plugin-compression
```

## Install Playwright Browsers

After installing @playwright/test, run:

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers for testing.

## Add to package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    
    "test:a11y": "axe http://localhost:5173 --exit",
    
    "lighthouse": "lhci autorun",
    "lighthouse:open": "lhci open"
  }
}
```

## Verification

After installation, verify everything works:

```bash
# Check installations
npm list @sentry/react web-vitals @playwright/test @axe-core/cli

# Verify Playwright browsers installed
npx playwright --version

# Test E2E setup (will fail until app runs, but checks config)
npm run test:e2e -- --list

# Start dev server
npm run dev

# In another terminal, run tests
npm run test:e2e
```

## Environment Variables

Don't forget to set up your `.env` file:

```bash
cp .env.example .env
```

Then edit `.env` with your actual values:

```env
VITE_SUPABASE_URL=https://gcqfqzhgludrzkfajljp.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_key_here
VITE_SENTRY_DSN=  # Optional for now
VITE_FEATURE_CLOUD_SYNC=true
```

## Troubleshooting

### Playwright Installation Issues

If `npx playwright install` fails:

```bash
# Try with sudo (Linux/Mac)
sudo npx playwright install

# Or install specific browser
npx playwright install chromium

# Windows: Run as Administrator
```

### Module Not Found Errors

If you get import errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Sentry Errors in Development

Sentry errors are expected without a DSN. The app will work fine. To silence them:

1. Don't set `VITE_SENTRY_DSN` in `.env`
2. Sentry only initializes in production (`import.meta.env.PROD`)

## Installation Checklist

- [ ] Production dependencies installed
- [ ] Dev dependencies installed
- [ ] Playwright browsers installed
- [ ] Scripts added to package.json
- [ ] `.env` file created from `.env.example`
- [ ] Dev server starts successfully
- [ ] Can run `npm run test:e2e` (even if tests fail)

## Next Steps

After installation:

1. ✅ Complete Week 1 tasks
2. ⏭️ Run E2E tests and fix failures
3. ⏭️ Set up Lighthouse CI
4. ⏭️ Document baseline metrics
5. ⏭️ Start Week 2 (Accessibility fixes)
