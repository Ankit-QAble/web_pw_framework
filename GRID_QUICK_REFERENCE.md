# Grid Configuration - Quick Reference

## 🌐 Supported Providers

- ✅ **LambdaTest** (Default)
- ✅ **BrowserStack**

## Current Configuration

### Development Profile (Default)
```typescript
isGrid: true
provider: 'lambdatest'  ✅ ENABLED - Tests run on LambdaTest
```

### Preprod Profile
```typescript
isGrid: false  ❌ DISABLED - Tests run locally
```

## How to Switch

### Option 1: Change Provider in playwright.config.ts
```typescript
// Run on LambdaTest
grid: { isGrid: true, provider: 'lambdatest', ... }

// Run on BrowserStack
grid: { isGrid: true, provider: 'browserstack', ... }

// Run locally
grid: { isGrid: false, ... }
```

### Option 2: Use Different Profiles
```bash
# Run on grid (development profile)
npm test

# Run locally (preprod profile)
RUN=preprod npm test
```

## Quick Commands

```bash
# Run on LambdaTest Grid (development profile)
npm test

# Run locally (preprod profile)
RUN=preprod npm test

# Run specific test on grid
npx playwright test login.spec.ts

# Run with specific browser on grid
BROWSER=firefox npm test
```

## Visual Indicators

When you run tests, you'll see:

**LambdaTest:**
```
🌐 Grid Mode: ENABLED - Tests will run on LambdaTest
   Platform: Windows 10
   Browser: Chrome latest
   Build: Development Build
   Provider: LambdaTest
```

**BrowserStack:**
```
🌐 Grid Mode: ENABLED - Tests will run on BrowserStack
   Platform: Windows 10
   Browser: chrome latest
   Build: Development Build
   Provider: BrowserStack
```

**Local:**
```
💻 Grid Mode: DISABLED - Tests will run locally
```

## Provider Dashboards

### LambdaTest
- URL: https://automation.lambdatest.com/
- Username: ankitpatelsadad

### BrowserStack
- URL: https://automate.browserstack.com/
- Username: (your BrowserStack username)

## Current Capabilities

### LambdaTest
- Platform: Windows 10
- Browser: Chrome (latest)
- Resolution: 1920x1080
- Video: Enabled
- Network Logs: Enabled
- Console Logs: Enabled

### BrowserStack
- OS: Windows 10
- Browser: chrome (latest)
- Resolution: 1920x1080
- Video: Enabled
- Network Logs: Enabled
- Console Logs: info

## Need More Details?

- **Multi-Provider Guide**: [docs/MULTI_PROVIDER_SETUP.md](docs/MULTI_PROVIDER_SETUP.md)
- **LambdaTest Setup**: [docs/GRID_SETUP.md](docs/GRID_SETUP.md)
- **BrowserStack Setup**: [docs/BROWSERSTACK_SETUP.md](docs/BROWSERSTACK_SETUP.md)
- **Examples**: [examples/grid-example.md](examples/grid-example.md)

