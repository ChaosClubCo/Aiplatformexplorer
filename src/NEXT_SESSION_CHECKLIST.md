# ✅ Next Session Checklist - Week 1 Completion

**Session Focus:** Complete Week 1 (Days 4-5)  
**Estimated Time:** 3-4 hours  
**Goal:** E2E tests passing, performance baseline documented

---

## 🎯 Session Objectives

- [ ] Run E2E tests and fix all failures
- [ ] Set up Lighthouse CI
- [ ] Document baseline performance metrics
- [ ] Complete Week 1 deliverables

---

## 📋 Step-by-Step Tasks

### Part 1: E2E Test Execution (60 min)

#### Step 1.1: Install Playwright Browsers
```bash
npx playwright install
```
**Expected:** Downloads ~300MB of browsers (Chromium, Firefox, WebKit)  
**Validation:** `npx playwright --version` shows version number

---

#### Step 1.2: Run E2E Tests (First Attempt)
```bash
npm run test:e2e
```
**Expected:** Some tests will fail (normal for first run)  
**Note:** Record which tests fail and why

---

#### Step 1.3: Fix Test Failures

**Common Issues:**

**Issue: Can't find elements**
```typescript
// Add data-testid attributes to components
// Example: PlatformCard.tsx
<div data-testid="platform-card" className="...">
  <button data-testid="view-details-btn">View Details</button>
</div>

// Update test selectors
await page.click('[data-testid="view-details-btn"]');
```

**Issue: Timing problems**
```typescript
// Add explicit waits
await page.waitForSelector('[data-testid="platform-card"]');
await page.waitForLoadState('networkidle');
```

**Issue: Async state updates**
```typescript
// Wait for element to appear
await expect(page.locator('text=Saved')).toBeVisible({ timeout: 5000 });
```

---

#### Step 1.4: Run Tests Again
```bash
npm run test:e2e
```
**Goal:** All critical flow tests passing  
**Acceptable:** 90% pass rate (some edge cases OK to defer)

---

#### Step 1.5: Test on Mobile Viewports
```bash
# Run only mobile tests
npm run test:e2e -- --project="Mobile Chrome"
```
**Validation:** Mobile-specific tests pass

---

### Part 2: Lighthouse CI Setup (45 min)

#### Step 2.1: Install Lighthouse CI
```bash
npm install -D @lhci/cli
```

---

#### Step 2.2: Create Lighthouse Configuration
Create `/lighthouserc.js`:

```javascript
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173/explorer'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

---

#### Step 2.3: Add Lighthouse Scripts to package.json
```json
{
  "scripts": {
    "lighthouse": "lhci autorun",
    "lighthouse:open": "lhci open"
  }
}
```

---

#### Step 2.4: Run Lighthouse
```bash
npm run build
npm run lighthouse
```

**Expected Output:**
```
Accessibility:  ?? / 100
Performance:    ?? / 100
Best Practices: ?? / 100
SEO:           ?? / 100
```

---

#### Step 2.5: Review Lighthouse Report
```bash
npm run lighthouse:open
```
**Action:** Note any critical issues (especially accessibility)

---

### Part 3: Document Baseline Metrics (30 min)

#### Step 3.1: Measure Bundle Size
```bash
npm run build
ls -lh dist/assets/*.js
```
**Record:** Main bundle size in KB

---

#### Step 3.2: Collect Performance Metrics

Create `/BASELINE_METRICS.md`:

```markdown
# Baseline Performance Metrics - Week 1

**Date:** [Current Date]
**Git Commit:** [Current commit hash]

## Bundle Size
- Main bundle: XXX KB (gzipped)
- Vendor bundle: XXX KB
- Total: XXX KB
- **Target:** < 200 KB ✅/❌

## Lighthouse Scores
- Performance: XX/100
- Accessibility: XX/100 (**Target: >= 90**)
- Best Practices: XX/100
- SEO: XX/100

## Web Vitals (from Lighthouse)
- LCP: XXXXms (**Target: < 2500ms**)
- FID: XXms (**Target: < 100ms**)
- CLS: X.XX (**Target: < 0.1**)
- FCP: XXXXms
- TTFB: XXXms

## E2E Test Results
- Total tests: 13
- Passing: XX
- Failing: XX
- Pass rate: XX%

## Browser Compatibility
- ✅/❌ Chromium
- ✅/❌ Firefox
- ✅/❌ WebKit
- ✅/❌ Mobile Chrome
- ✅/❌ Mobile Safari

## Known Issues
1. [List any known issues]
2. [Accessibility violations]
3. [Performance bottlenecks]

## Next Steps
1. Week 2: Fix accessibility violations
2. Week 3: Optimize performance
```

---

#### Step 3.3: Update Project Status

Update `/30DAY_V1_STATUS.md`:
- Change Week 1 status to 100%
- Update overall progress to 17%
- Add baseline metrics
- List Week 2 tasks

---

### Part 4: Sentry Setup (Optional, 15 min)

#### Step 4.1: Create Sentry Project
1. Go to https://sentry.io
2. Sign up / log in
3. Create new project (React)
4. Copy DSN

---

#### Step 4.2: Add DSN to .env
```env
VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

#### Step 4.3: Test Sentry
```bash
npm run build
npm run preview
```
Open app, trigger error, check Sentry dashboard

---

## 📊 Completion Criteria

### Must Complete
- [ ] E2E tests passing (>= 90%)
- [ ] Lighthouse CI configured
- [ ] Baseline metrics documented
- [ ] Week 1 status updated

### Nice to Have
- [ ] Sentry configured
- [ ] All tests 100% passing
- [ ] Accessibility score >= 90

---

## 🚨 Troubleshooting

### Playwright Installation Fails
```bash
# Try with sudo (Mac/Linux)
sudo npx playwright install

# Or install specific browser
npx playwright install chromium
```

### Lighthouse Fails to Start Server
```bash
# Verify preview works
npm run build
npm run preview
# Then open http://localhost:4173 manually

# Update lighthouserc.js URL if port different
```

### E2E Tests Timeout
```typescript
// Increase timeout in playwright.config.ts
use: {
  timeout: 60000, // 60 seconds
}
```

---

## 🎯 Session Success Metrics

**Minimum Success:**
- [x] 80% of E2E tests passing
- [x] Lighthouse runs successfully
- [x] Baseline metrics documented

**Full Success:**
- [x] 100% of E2E tests passing
- [x] Lighthouse Accessibility >= 85
- [x] All metrics documented
- [x] Week 1 complete

---

## 📝 Session Output

By end of session, you should have:

1. **Passing Tests**
   - E2E test results (screenshots if failures)
   - Test report in `playwright-report/`

2. **Performance Data**
   - Lighthouse report
   - Bundle size measurements
   - `/BASELINE_METRICS.md` file

3. **Updated Documentation**
   - `/30DAY_V1_STATUS.md` updated
   - `/WEEK1_PROGRESS.md` marked complete
   - Week 2 tasks ready

4. **Optional: Sentry**
   - Sentry project created
   - DSN added to `.env`
   - Error tracking verified

---

## ⏭️ After This Session

### Week 2 Preparation

Review these files before starting Week 2:
- `/COMPREHENSIVE_UX_AUDIT_REPORT.md` - Section on accessibility fixes
- Week 2 tasks in rebuild prompt
- WCAG 2.2 AA requirements

### Week 2 Preview

**Focus:** Accessibility (WCAG 2.2 AA)

**Quick wins:**
1. Color contrast fixes (2 hours)
2. ARIA live regions (2 hours)
3. Focus management (3 hours)
4. Skip links (1 hour)
5. Touch targets (2 hours)
6. Score badge icons (2 hours)

**Total:** ~12 hours (3 days)

---

## 🚀 Ready to Start?

```bash
# 1. Pull latest changes
git pull

# 2. Install any new dependencies
npm install

# 3. Install Playwright browsers
npx playwright install

# 4. Start testing!
npm run test:e2e

# 5. Document as you go
# Update BASELINE_METRICS.md with findings
```

**Good luck! 🎯**

---

*Created: January 12, 2025*  
*Next Session Target: Complete Week 1*  
*Estimated Time: 3-4 hours*
