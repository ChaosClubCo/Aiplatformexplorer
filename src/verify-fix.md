# 🔍 Environment Variable Fix - Verification Guide

Run these commands to verify the fix is working:

## Quick Test (30 seconds)

```bash
# Start dev server - should work without errors
npm run dev
```

**✅ Success if:** Server starts and shows no `TypeError` related to `import.meta`

---

## Full Verification (3 minutes)

### Step 1: Check the Fixed Files

```bash
# Verify the fix was applied
cat utils/supabase/info.tsx | grep "typeof import.meta"
```
**✅ Expected:** You should see `if (typeof import.meta !== 'undefined'`

### Step 2: Development Build

```bash
npm run dev
```

**✅ Expected:**
- Server starts on http://localhost:5173
- No errors in terminal
- No errors in browser console

### Step 3: Production Build

```bash
npm run build
```

**✅ Expected:**
- Build completes successfully
- No TypeErrors during build
- dist/ folder created with bundles

### Step 4: Preview Production

```bash
npm run preview
```

**✅ Expected:**
- Preview server starts
- App loads correctly
- No console errors

### Step 5: Check App Functionality

With dev server running:

1. Open http://localhost:5173
2. Open browser DevTools (F12)
3. Check Console tab
4. Navigate to /explorer
5. Check Network tab for Supabase requests

**✅ Expected:**
- No errors in console
- App loads normally
- Supabase URL is correct in network requests

---

## What to Look For

### ✅ Signs Fix is Working

- Dev server starts without errors
- Build completes successfully
- No `TypeError: Cannot read properties of undefined` messages
- App loads and functions normally
- Supabase requests are being made

### ❌ Signs Fix Failed

- `TypeError` related to `import.meta` still appears
- Build fails with environment variable errors
- App crashes on load
- Blank screen in browser

---

## Troubleshooting

### If Dev Server Still Fails

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### If Build Still Fails

```bash
# Clear build cache
rm -rf dist .vite
npm run build
```

### If Console Shows Errors

1. Check browser console (F12)
2. Look for the specific error message
3. Check which file is throwing the error
4. Verify the file contains the `typeof import.meta` fix

---

## Environment Variables (Optional)

The fix includes fallback values, so `.env` is **optional** for local development.

### To Use Custom Environment Variables:

```bash
# 1. Create .env file
cp .env.example .env

# 2. Edit .env with your values
nano .env

# 3. Restart dev server
npm run dev
```

---

## Validation Checklist

Run through this checklist:

- [ ] `npm run dev` starts without errors
- [ ] Browser console shows no errors
- [ ] App loads at http://localhost:5173
- [ ] Can navigate to /explorer page
- [ ] `npm run build` completes successfully
- [ ] `npm run preview` works
- [ ] Network tab shows Supabase requests
- [ ] No TypeError messages anywhere

---

## Expected Console Output

### Dev Server Start (✅ Good)
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Build Output (✅ Good)
```
vite v5.x.x building for production...
✓ xxx modules transformed.
dist/index.html                x.xx kB
dist/assets/index-xxx.css      xx.x kB │ gzip: x.xx kB
dist/assets/index-xxx.js       xxx.xx kB │ gzip: xx.xx kB
✓ built in x.xxs
```

---

## If Everything Works

✅ **The fix is complete and verified!**

You can now:
1. Continue with Week 1 tasks
2. Install Playwright: `npx playwright install`
3. Run E2E tests: `npm run test:e2e`
4. Continue development normally

---

## Still Having Issues?

If errors persist after this fix:

1. Share the **exact error message**
2. Share the **file and line number** from the error
3. Check if it's a different error (not import.meta related)
4. Verify you're on the latest code

---

**Created:** January 12, 2025  
**Purpose:** Verify environment variable fix  
**Status:** Ready for testing
