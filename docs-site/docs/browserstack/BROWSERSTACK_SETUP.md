# BrowserStack Grid Setup

This guide explains how to configure and use BrowserStack for running your Playwright tests on the cloud.

## 🌐 Overview

The framework now supports **two cloud testing providers**:
- **LambdaTest** (already configured)
- **BrowserStack** (new)

You can easily switch between providers by changing the `provider` field in your configuration.

---

## 📋 Configuration Structure

In `playwright.config.ts`, each profile has a `grid` configuration with both providers:

```typescript
grid: {
  isGrid: true,                    // Enable/disable grid execution
  provider: 'browserstack',        // Choose provider: 'lambdatest' or 'browserstack'
  
  // LambdaTest Configuration
  lambdatest: {
    user: 'your-lambdatest-username',
    key: 'your-lambdatest-access-key',
    capabilities: { /* ... */ }
  },
  
  // BrowserStack Configuration
  browserstack: {
    user: 'your-browserstack-username',
    key: 'your-browserstack-access-key',
    capabilities: {
      'bstack:options': {
        os: 'Windows',
        osVersion: '10',
        browserName: 'chrome',
        browserVersion: 'latest',
        resolution: '1920x1080',
        projectName: 'Web Framework',
        buildName: 'Development Build',
        sessionName: 'Playwright Development Tests',
        local: false,
        networkLogs: true,
        consoleLogs: 'info',
        video: true,
      }
    }
  }
}
```

---

## 🔧 Setup Steps

### Step 1: Get BrowserStack Credentials

1. Go to **https://www.browserstack.com/accounts/settings**
2. Login with your BrowserStack account
3. Find your credentials:
   - **Username**: Your BrowserStack username
   - **Access Key**: Click to reveal/copy your access key

### Step 2: Update Configuration

Edit `playwright.config.ts`:

```typescript
development: {
  // ... other settings
  grid: {
    isGrid: true,
    provider: 'browserstack',  // ← Change to 'browserstack'
    
    browserstack: {
      user: 'your-username',              // ← Your BrowserStack username
      key: 'your-access-key',             // ← Your BrowserStack access key
      capabilities: {
        'bstack:options': {
          os: 'Windows',                  // Windows, OS X, etc.
          osVersion: '10',                // 10, 11, Monterey, etc.
          browserName: 'chrome',          // chrome, firefox, edge, safari
          browserVersion: 'latest',       // latest, 120, 119, etc.
          resolution: '1920x1080',        // Screen resolution
          projectName: 'Web Framework',
          buildName: 'Development Build',
          sessionName: 'Playwright Tests',
          local: false,                   // Enable local testing if needed
          networkLogs: true,              // Capture network logs
          consoleLogs: 'info',            // Console log level
          video: true,                    // Record video
        }
      }
    }
  }
}
```

### Step 3: Run Tests

```bash
npm test
```

You'll see:
```
🌐 Grid Mode: ENABLED - Tests will run on BrowserStack
   Platform: Windows 10
   Browser: chrome latest
   Build: Development Build
   Provider: BrowserStack
   WebSocket Endpoint: wss://cdp.browserstack.com/playwright?caps=...
```

---

## 🎨 BrowserStack Capabilities

### Operating Systems

**Windows:**
```typescript
os: 'Windows',
osVersion: '11',    // 11, 10, 8.1, 8, 7
```

**macOS:**
```typescript
os: 'OS X',
osVersion: 'Monterey',  // Monterey, Big Sur, Catalina, Mojave
```

**Linux:**
```typescript
os: 'Linux',
osVersion: 'focal',  // focal, bionic
```

### Browsers

**Chrome:**
```typescript
browserName: 'chrome',
browserVersion: 'latest',  // or specific version like '120'
```

**Firefox:**
```typescript
browserName: 'firefox',
browserVersion: 'latest',
```

**Edge:**
```typescript
browserName: 'edge',
browserVersion: 'latest',
```

**Safari:**
```typescript
browserName: 'safari',
browserVersion: 'latest',
os: 'OS X',  // Safari only on macOS
osVersion: 'Monterey',
```

### Resolutions

Common resolutions:
- `1920x1080` (Full HD)
- `1366x768` (HD)
- `1280x1024` (SXGA)
- `2560x1440` (2K)

### Additional Options

**Local Testing:**
```typescript
local: true,  // Test local websites
localIdentifier: 'my-local-tunnel',
```

**Network Logs:**
```typescript
networkLogs: true,  // Capture network activity
```

**Console Logs:**
```typescript
consoleLogs: 'info',  // 'disable', 'errors', 'warnings', 'info', 'verbose'
```

**Video Recording:**
```typescript
video: true,  // Record video of test execution
```

**Debug Mode:**
```typescript
debug: true,  // Enable debug mode
```

**Timezone:**
```typescript
timezone: 'America/New_York',  // Set timezone
```

**Geolocation:**
```typescript
geoLocation: 'US',  // Set geolocation
```

---

## 🔄 Switching Between Providers

### Method 1: Change Provider in Config

```typescript
// Run on BrowserStack
grid: {
  isGrid: true,
  provider: 'browserstack',  // ← Change this
}

// Run on LambdaTest
grid: {
  isGrid: true,
  provider: 'lambdatest',  // ← Change this
}

// Run locally
grid: {
  isGrid: false,  // ← Disable grid
}
```

### Method 2: Use Different Profiles

Create separate profiles for each provider:

```typescript
const PROFILES = {
  development: {
    grid: { isGrid: true, provider: 'lambdatest' }
  },
  staging: {
    grid: { isGrid: true, provider: 'browserstack' }
  },
  local: {
    grid: { isGrid: false }
  }
}
```

Run with:
```bash
RUN=development npm test  # LambdaTest
RUN=staging npm test      # BrowserStack
RUN=local npm test        # Local
```

---

## 📊 View Results on BrowserStack

### Dashboard
1. Go to: **https://automate.browserstack.com/dashboard**
2. Login with your credentials
3. Navigate to: **Automate** → **Playwright**

### What You'll See
- 📹 **Video recordings** of test execution
- 📊 **Console logs** (browser console output)
- 🌐 **Network logs** (HTTP requests/responses)
- 📸 **Screenshots** at various stages
- ⏱️ **Timeline** of test execution
- 🔍 **Test details** (pass/fail, duration, etc.)

---

## 💡 Examples

### Example 1: Chrome on Windows 11
```typescript
browserstack: {
  capabilities: {
    'bstack:options': {
      os: 'Windows',
      osVersion: '11',
      browserName: 'chrome',
      browserVersion: 'latest',
    }
  }
}
```

### Example 2: Safari on macOS Monterey
```typescript
browserstack: {
  capabilities: {
    'bstack:options': {
      os: 'OS X',
      osVersion: 'Monterey',
      browserName: 'safari',
      browserVersion: 'latest',
    }
  }
}
```

### Example 3: Firefox on Linux
```typescript
browserstack: {
  capabilities: {
    'bstack:options': {
      os: 'Linux',
      osVersion: 'focal',
      browserName: 'firefox',
      browserVersion: 'latest',
    }
  }
}
```

### Example 4: Local Testing
```typescript
browserstack: {
  capabilities: {
    'bstack:options': {
      local: true,
      localIdentifier: 'test-tunnel',
      // Test your localhost URLs
    }
  }
}
```

---

## 🆚 LambdaTest vs BrowserStack

| Feature | LambdaTest | BrowserStack |
|---------|------------|--------------|
| **Provider Field** | `'lambdatest'` | `'browserstack'` |
| **Capabilities Key** | `'LT:Options'` | `'bstack:options'` |
| **Username Field** | `user` | `userName` |
| **WebSocket URL** | `wss://cdp.lambdatest.com/playwright` | `wss://cdp.browserstack.com/playwright` |
| **Dashboard** | automation.lambdatest.com | automate.browserstack.com |

---

## 🔧 Troubleshooting

### Issue: Authentication Failed
**Solution:** Verify your credentials at https://www.browserstack.com/accounts/settings

### Issue: Tests Not Appearing in Dashboard
**Solution:** 
1. Check if `isGrid: true`
2. Verify `provider: 'browserstack'`
3. Ensure credentials are correct

### Issue: Connection Timeout
**Solution:** 
1. Check internet connection
2. Verify BrowserStack service status
3. Check firewall settings

### Issue: Browser Not Supported
**Solution:** Check BrowserStack's supported browsers and versions at their documentation

---

## 🔐 Security Best Practices

### Use Environment Variables

Create `.env` file:
```env
BROWSERSTACK_USERNAME=your-username
BROWSERSTACK_ACCESS_KEY=your-access-key
```

Update config:
```typescript
browserstack: {
  user: process.env.BROWSERSTACK_USERNAME || 'fallback-username',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'fallback-key',
}
```

### Add to .gitignore
```
.env
.env.local
```

---

## 📚 Additional Resources

- **BrowserStack Dashboard**: https://automate.browserstack.com/
- **BrowserStack Playwright Docs**: https://www.browserstack.com/docs/automate/playwright
- **Capabilities Builder**: https://www.browserstack.com/docs/automate/playwright/playwright-caps
- **Support**: support@browserstack.com

---

## ✅ Quick Checklist

- [ ] Get BrowserStack credentials
- [ ] Update `browserstack.user` in config
- [ ] Update `browserstack.key` in config
- [ ] Set `provider: 'browserstack'`
- [ ] Set `isGrid: true`
- [ ] Run `npm test`
- [ ] Check BrowserStack dashboard for results

---

**Setup Complete!** Your tests can now run on BrowserStack cloud infrastructure! 🎉

