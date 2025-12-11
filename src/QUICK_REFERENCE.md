# Quick Reference Card - AI Platform Explorer

## 🚀 Quick Start Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build
```

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `/App.tsx` | Main application entry point |
| `/components/EnhancedROICalculator.tsx` | ROI calculator with validated benchmarks |
| `/components/PlatformCard.tsx` | Animated platform card component |
| `/data/platforms.ts` | Platform data source (16+ platforms) |
| `/types.ts` | TypeScript type definitions |
| `/styles/globals.css` | Global styles & CSS variables |

---

## 🎨 Design Tokens

### Colors
```typescript
Primary:      #E88A1D  // Orange
Primary Dark: #D07614  // Dark Orange
Primary Light:#FEF3E7  // Light Orange

Success:      #059669  // Green
Warning:      #F59E0B  // Amber
Error:        #DC2626  // Red
Info:         #0284C7  // Blue
```

### Spacing (Tailwind)
```
gap-2  = 8px   | p-2  = 8px   | m-2  = 8px
gap-4  = 16px  | p-4  = 16px  | m-4  = 16px
gap-6  = 24px  | p-6  = 24px  | m-6  = 24px
```

### Breakpoints
```
sm: 640px    // Tablet
md: 768px    // Large tablet
lg: 1024px   // Desktop
xl: 1280px   // Large desktop
2xl: 1536px  // Ultra-wide
```

---

## 🧩 Component Patterns

### Lazy Loading
```typescript
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize component
const MyComponent = memo(({ data }) => { ... });

// Memoize computation
const result = useMemo(() => expensiveCalc(data), [data]);

// Memoize callback
const handler = useCallback(() => doSomething(id), [id]);
```

### Animation (Motion)
```typescript
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

---

## ♿ Accessibility Checklist

```typescript
// ✅ Semantic HTML
<button> not <div onClick>

// ✅ ARIA labels
<button aria-label="Close modal">×</button>

// ✅ Keyboard support
onKeyPress={(e) => {
  if (e.key === 'Enter') handleAction();
}}

// ✅ Focus management
<button className="focus:ring-2 focus:ring-[#E88A1D]">

// ✅ Screen reader
<div role="status" aria-live="polite">
  Loading...
</div>

// ✅ Touch targets
<button className="min-w-[44px] min-h-[44px]">
```

---

## 📊 ROI Calculator Benchmarks

### Quick Reference
```typescript
// Industry Average (Capgemini 2025)
averageROI: 1.7x (170%)

// Return per $1 (IDC 2024)
returnPer$1: $3.70 average, $10 top 5%

// Productivity Savings (per employee/year)
conservative: $8,700   // Larridin 2025
midpoint:     $13,350  // Blended
optimistic:   $18,000  // LSE/Protiviti 2024

// Adoption Rates (Axis Intelligence 2025)
execSponsored: 89% success
itOnlyInitiative: 34% success

// Risk (Gartner July 2024)
pocAbandonment: 30%
rootCause: 43% poor data quality
```

### Industry Multipliers
```typescript
general:       1.0x  // Baseline
financial:     1.15x // +15%
healthcare:    1.10x // +10%
technology:    1.20x // +20%
manufacturing: 1.05x // +5%
```

---

## 🔍 Common Tasks

### Add New Platform
```typescript
// In /data/platforms.ts
{
  id: 'new-platform',
  name: 'Platform Name',
  provider: 'Provider Name',
  providerKey: 'provider',
  logo: '🔷',
  category: 'enterprise',
  categoryLabel: 'Enterprise Foundation',
  // ... rest of required fields
}
```

### Update Benchmark Data
```typescript
// In /components/EnhancedROICalculator.tsx
const productivityValues = {
  conservative: 8700,   // Update with new data
  midpoint: 13350,      // Update with new data
  optimistic: 18000     // Update with new data
};
// Always cite source in comment!
```

### Add New Filter
```typescript
// In /components/FilterBar.tsx
// 1. Add to select options
<option value="new-filter">New Filter</option>

// 2. Add to filter logic in App.tsx
if (filters.newFilter !== 'all') {
  filtered = filtered.filter(p => p.newField === filters.newFilter);
}
```

---

## 🎯 Performance Tips

### DO ✅
```typescript
// Lazy load heavy components
const Matrix = lazy(() => import('./FeatureMatrix'));

// Memoize expensive calculations
const sorted = useMemo(() => sortData(data), [data]);

// Use callbacks for event handlers
const onClick = useCallback(() => {}, [deps]);

// Memo components that receive callbacks
export default memo(Component);
```

### DON'T ❌
```typescript
// Don't create functions in render
<button onClick={() => handleClick(id)}>  // ❌
<button onClick={handleClick}>            // ✅

// Don't use inline objects
<Component style={{ color: 'red' }} />    // ❌
const style = { color: 'red' };           // ✅

// Don't forget dependencies
useMemo(() => calc(data))                 // ❌
useMemo(() => calc(data), [data])         // ✅
```

---

## 🐛 Debugging

### React DevTools
```bash
# Install extension, then:
1. Open DevTools
2. Go to "Profiler" tab
3. Click record
4. Perform action
5. Stop recording
6. Analyze component renders
```

### Performance Profiling
```typescript
// Add to component
useEffect(() => {
  const start = performance.now();
  // ... operation
  const end = performance.now();
  console.log(`Took ${end - start}ms`);
}, [deps]);
```

### Common Issues

**Issue:** Component re-rendering too much
```typescript
// Solution: Wrap in memo
export default memo(Component);
```

**Issue:** Slow filtering
```typescript
// Solution: Use useMemo
const filtered = useMemo(() => 
  data.filter(item => ...), 
  [data, filters]
);
```

**Issue:** Animation jank
```typescript
// Solution: Use transform/opacity
// ✅ GPU-accelerated
transform: translateY(10px);
opacity: 0.5;

// ❌ CPU-bound
top: 10px;
visibility: hidden;
```

---

## 📱 Responsive Classes

### Mobile First
```typescript
// Base (mobile)
<div className="text-sm p-2">

// Tablet and up
<div className="text-sm sm:text-base p-2 sm:p-4">

// Desktop and up
<div className="text-sm sm:text-base lg:text-lg">
```

### Common Patterns
```typescript
// Hide on mobile
<div className="hidden md:block">Desktop only</div>

// Show on mobile only
<div className="block md:hidden">Mobile only</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
```

---

## 🔧 VS Code Shortcuts

### Tailwind IntelliSense
1. Install "Tailwind CSS IntelliSense" extension
2. Get autocomplete in className
3. Hover for color previews

### Useful Snippets
```typescript
// Type 'rafce' → React Arrow Function Export Component
const Component = () => {
  return <div></div>
}
export default Component

// Type 'imrc' → Import React Component
import Component from './Component'

// Type 'usf' → useState snippet
const [state, setState] = useState(initialState)
```

---

## 📚 Documentation Links

### Internal
- [Full Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Validated Benchmarks](./VALIDATED_BENCHMARKS.md)
- [Main README](./README.md)

### External
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Motion Docs](https://motion.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🆘 Emergency Fixes

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript Errors
```bash
# Check types
npm run type-check

# Common fix: restart TS server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Import Errors
```typescript
// Wrong ❌
import { motion } from 'framer-motion'

// Correct ✅
import { motion } from 'motion/react'
```

### Styling Not Applied
```bash
# Restart dev server
Ctrl+C
npm run dev

# Clear browser cache
Hard refresh: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Win)
```

---

## ✅ Pre-Deployment Checklist

```bash
# 1. Type check
npm run type-check

# 2. Lint check
npm run lint

# 3. Build successfully
npm run build

# 4. Preview build
npm run preview

# 5. Test in production mode
# - All features work
# - No console errors
# - Loading states correct
# - Animations smooth
# - Mobile responsive

# 6. Deploy
# Copy /dist folder to hosting
```

---

## 🎓 Learning Resources

### React
- [React Beta Docs](https://react.dev) - Modern React patterns
- [React DevTools](https://react.dev/learn/react-developer-tools) - Debugging

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app)

### Tailwind
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Play](https://play.tailwindcss.com) - Online playground

### Accessibility
- [ARIA Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM](https://webaim.org) - Accessibility resources

---

**Last Updated:** December 2025
**Version:** 3.1.0

*Keep this card handy for daily development! 📌*
