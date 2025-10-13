# How to Switch Between Grid Providers

Quick guide for switching between LambdaTest and BrowserStack.

---

## 🔄 Quick Switch Guide

### Currently Running: LambdaTest ✅

To switch to BrowserStack:

#### Step 1: Get BrowserStack Credentials
1. Visit: https://www.browserstack.com/accounts/settings
2. Copy your **Username**
3. Copy your **Access Key**

#### Step 2: Update Configuration
Open `playwright.config.ts` and update **TWO** sections:

**Section 1: Development Profile (Line 49-51)**
```typescript
browserstack: {
  user: 'paste-your-username-here',
  key: 'paste-your-access-key-here',
```

**Section 2: Preprod Profile (Line 123-125)**
```typescript
browserstack: {
  user: 'paste-your-username-here',
  key: 'paste-your-access-key-here',
```

#### Step 3: Change Provider
In **Development Profile (Line 25)**:
```typescript
provider: 'browserstack',  // ← Change from 'lambdatest' to 'browserstack'
```

#### Step 4: Run Tests
```bash
npm test
```

#### Step 5: View Results
Go to: https://automate.browserstack.com/dashboard

---

## 🔙 Switch Back to LambdaTest

In `playwright.config.ts`, line 25:
```typescript
provider: 'lambdatest',  // ← Change back to 'lambdatest'
```

Run:
```bash
npm test
```

View results: https://automation.lambdatest.com/

---

## 🎯 Visual Guide

### Current State (LambdaTest)
```typescript
// Line 25 in playwright.config.ts
development: {
  grid: {
    isGrid: true,
    provider: 'lambdatest',  ← CURRENT
  }
}
```

### After Switch (BrowserStack)
```typescript
// Line 25 in playwright.config.ts
development: {
  grid: {
    isGrid: true,
    provider: 'browserstack',  ← CHANGED
  }
}
```

---

## 📊 Comparison Table

| Action | LambdaTest | BrowserStack |
|--------|------------|--------------|
| **Provider Value** | `'lambdatest'` | `'browserstack'` |
| **Credentials Status** | ✅ Configured | ⚠️ Need to add |
| **Dashboard** | automation.lambdatest.com | automate.browserstack.com |
| **Ready to Use** | ✅ Yes | ⚠️ After adding credentials |

---

## 🧪 Test Provider Switch

After switching, run:
```bash
npx playwright test --list
```

You should see:
```
🌐 Grid Mode: ENABLED - Tests will run on BrowserStack
   Platform: Windows 10
   Browser: chrome latest
   Build: Development Build
   Provider: BrowserStack
```

---

## 🚨 Common Issues

### Issue: "Grid provider 'browserstack' configuration not found"
**Solution:** Make sure you updated credentials in lines 49-51 and 123-125

### Issue: "Unauthorized" error
**Solution:** Check your BrowserStack credentials are correct

### Issue: Still showing LambdaTest
**Solution:** 
1. Check `provider` value (line 25)
2. Restart terminal
3. Run tests again

---

## ✅ Checklist for Switching to BrowserStack

- [ ] Get BrowserStack username
- [ ] Get BrowserStack access key
- [ ] Update line 50 (development profile username)
- [ ] Update line 51 (development profile access key)
- [ ] Update line 124 (preprod profile username)
- [ ] Update line 125 (preprod profile access key)
- [ ] Change `provider` to `'browserstack'` (line 25)
- [ ] Save file
- [ ] Run `npm test`
- [ ] Check BrowserStack dashboard

---

## 💡 Pro Tips

### Tip 1: Keep Both Configured
Keep credentials for both providers so you can switch anytime:
```typescript
provider: 'lambdatest',  // or 'browserstack'
```

### Tip 2: Use Environment Variables
```typescript
provider: process.env.GRID_PROVIDER || 'lambdatest',
```

Then switch with:
```bash
GRID_PROVIDER=browserstack npm test
```

### Tip 3: Different Profiles for Different Providers
```bash
RUN=development npm test   # LambdaTest
RUN=staging npm test       # BrowserStack
```

---

## 📞 Need Help?

- **LambdaTest Issues**: See `docs/GRID_SETUP.md`
- **BrowserStack Issues**: See `docs/BROWSERSTACK_SETUP.md`
- **Multi-Provider Guide**: See `docs/MULTI_PROVIDER_SETUP.md`
- **Quick Reference**: See `GRID_QUICK_REFERENCE.md`

---

**Happy Testing!** 🚀

