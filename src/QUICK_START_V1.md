# 🚀 Quick Start - V1 Rebuild

**For developers joining the 30-day V1 rebuild**

---

## ⚡ Get Started in 5 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npx playwright install

# 3. Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development
npm run dev

# 5. Run tests (in another terminal)
npm run test:e2e
```

---

## 📁 Project Structure (V1 Focus)

```
/
├── App.tsx                    # Main app (Sentry + Web Vitals)
├── utils/
│   ├── monitoring.ts          # Sentry + monitoring utils
│   └── supabase/info.tsx      # Supabase config (env vars)
├── context/
│   └── AppContext.tsx         # Global state (stacks, platforms)
├── contexts/
│   └── AuthContext.tsx        # Auth (internal-user)
├── services/
│   └── stackPersistence.ts    # Stack sync (local + Supabase)
├── pages/
│   ├── PlatformExplorer.tsx   # Main page ⭐
│   └── StackManagerPage.tsx   # Stacks page
├── e2e/
│   └── critical-flows.spec.ts # E2E tests
└── .env.example               # Environment template
```

---

## 🎯 V1 Scope (ONLY THIS)

### ✅ In Scope
- Browse 16 AI platforms
- Filter (provider, category, search, sort)
- Select multiple platforms
- Save selections as "Stacks"
- View/load/delete saved stacks
- Offline-first + cloud sync
- Export stack to JSON
- **WCAG 2.2 AA accessibility**

### ❌ Out of Scope (V2+)
- Team collaboration
- Notion/GitHub export
- ROI Calculator enhancements
- Intelligence Engine wizard
- Persona Generator
- Onboarding tour
- Table view (mobile)

---

## 🧪 Testing Commands

```bash
# E2E tests (all browsers)
npm run test:e2e

# E2E tests (interactive UI)
npm run test:e2e:ui

# E2E tests (watch mode)
npm run test:e2e -- --headed

# Accessibility audit
npm run test:a11y

# Performance (Lighthouse)
npm run lighthouse
```

---

## 🐛 Debugging

### E2E Tests Failing?

```bash
# Run in headed mode to see browser
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- -g "Flow 1"

# Debug mode (step through)
npm run test:e2e:debug
```

### Sentry Errors?

Sentry only runs in production:
```bash
npm run build
npm run preview
# Then check console for Sentry messages
```

### Stack Sync Not Working?

Check browser DevTools:
1. Network tab → Filter "stacks"
2. Should see POST to `/make-server-8c5e19c9/stacks/internal-user`
3. If 401 error → Check Authorization header
4. If 404 error → Check Supabase function deployed

---

## 📊 Current Status

**Week:** 1 of 4  
**Progress:** 10% complete (3/30 days)  
**Status:** ✅ ON TRACK

**Completed:**
- ✅ Security (env vars)
- ✅ Monitoring (Sentry + Web Vitals)
- ✅ E2E tests written
- ✅ Auth verified

**Next Up:**
- ⏳ Run E2E tests
- ⏳ Lighthouse CI
- ⏳ Week 2: Accessibility fixes

---

## 🔥 Hot Paths (What to Work On)

### Week 1 (Current)
1. Run E2E tests → Fix failures
2. Add data-testid attributes
3. Set up Lighthouse CI
4. Document baseline metrics

### Week 2 (Next)
1. Fix color contrast (`text-gray-500` → `text-gray-700`)
2. Add ARIA live regions
3. Fix focus management in modals
4. Add skip links
5. Fix touch targets (44x44px)

---

## 🆘 Common Issues

### "Module not found: @sentry/react"

```bash
npm install @sentry/react web-vitals
```

### "Playwright not installed"

```bash
npm install -D @playwright/test
npx playwright install
```

### "VITE_SUPABASE_URL is not defined"

```bash
cp .env.example .env
# Edit .env
```

### Git Errors on .env

`.env` is gitignored (intentional). Use `.env.example` as template.

---

## 📖 Key Documents

| File | Purpose |
|------|---------|
| `/30DAY_V1_STATUS.md` | Overall progress |
| `/WEEK1_PROGRESS.md` | Week 1 details |
| `/COMPREHENSIVE_UX_AUDIT_REPORT.md` | Full audit + rebuild prompt |
| `/INSTALLATION_GUIDE.md` | Detailed setup |
| `/REBUILD_SESSION_SUMMARY.md` | Latest session notes |

---

## 💪 Success Criteria

### Week 1
- [ ] E2E tests passing
- [ ] Performance baseline documented
- [ ] Monitoring active

### V1 Launch (Day 30)
- [ ] Crash-free >= 99.5%
- [ ] Lighthouse Accessibility >= 90
- [ ] LCP < 2.5s
- [ ] 0 WCAG AA violations
- [ ] Stack save success >= 95%

---

## 🚨 Non-Negotiables

1. **No scope creep** - Only V1 features
2. **WCAG 2.2 AA** - Must pass accessibility
3. **Crash-free >= 99.5%** - Stability required
4. **Performance budgets** - LCP < 2.5s
5. **No rewrites** - Incremental fixes only

---

## 🎯 Weekly Goals

| Week | Goal | Status |
|------|------|--------|
| 1 | Stabilize & Measure | 60% ✅ |
| 2 | Accessibility (WCAG AA) | 0% ⏳ |
| 3 | Security + Performance | 0% ⏳ |
| 4 | Polish + CI/CD + Launch | 0% ⏳ |

---

## 📞 Get Help

- **Documentation:** Read files in order:
  1. This file (Quick Start)
  2. `/30DAY_V1_STATUS.md` (Overall status)
  3. `/COMPREHENSIVE_UX_AUDIT_REPORT.md` (Detailed plan)

- **Debugging:** Check `/REBUILD_SESSION_SUMMARY.md` for latest notes

- **Questions:** Review weekly progress files (`/WEEK1_PROGRESS.md`, etc.)

---

**Last Updated:** January 12, 2025  
**Ready to code!** 🚀
