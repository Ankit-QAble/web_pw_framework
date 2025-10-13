# Multi-Provider Grid Setup

Your framework now supports **multiple cloud testing providers** with easy switching between them!

## 🌐 Supported Providers

- ✅ **LambdaTest** - Configured and working
- ✅ **BrowserStack** - Configured and ready
- 🚀 **Easy to add more** - Extensible architecture

---

## 📋 How It Works

The configuration uses a **provider-based** approach:

```typescript
grid: {
  isGrid: true,                    // Enable/disable grid
  provider: 'lambdatest',          // Choose provider
  
  // Provider-specific configurations
  lambdatest: { /* config */ },
  browserstack: { /* config */ },
}
```

When `isGrid: true`, the framework:
1. Reads the `provider` field
2. Uses the corresponding provider configuration
3. Builds the correct WebSocket endpoint
4. Connects to that provider's cloud

---

## 🎯 Quick Start

### Run on LambdaTest
```typescript
grid: {
  isGrid: true,
  provider: 'lambdatest',
}
```
```bash
npm test
```

### Run on BrowserStack
```typescript
grid: {
  isGrid: true,
  provider: 'browserstack',
}
```
```bash
npm test
```

### Run Locally
```typescript
grid: {
  isGrid: false,
}
```
```bash
npm test
```

---

## 🔄 Switching Providers

### Method 1: Edit Configuration File

In `playwright.config.ts`:

```typescript
development: {
  grid: {
    isGrid: true,
    provider: 'lambdatest',  // ← Change this line
  }
}
```

**Available values:**
- `'lambdatest'` → Tests run on LambdaTest
- `'browserstack'` → Tests run on BrowserStack

### Method 2: Use Multiple Profiles

Create different profiles for different providers:

```typescript
const PROFILES = {
  development: {
    grid: { isGrid: true, provider: 'lambdatest' }
  },
  
  staging: {
    grid: { isGrid: true, provider: 'browserstack' }
  },
  
  production: {
    grid: { isGrid: true, provider: 'lambdatest' }
  },
  
  local: {
    grid: { isGrid: false }
  }
}
```

Run with:
```bash
RUN=development npm test    # LambdaTest
RUN=staging npm test        # BrowserStack
RUN=production npm test     # LambdaTest
RUN=local npm test          # Local
```

### Method 3: Environment Variable

Add environment variable support:

```typescript
grid: {
  isGrid: true,
  provider: process.env.GRID_PROVIDER || 'lambdatest',
}
```

Run with:
```bash
GRID_PROVIDER=browserstack npm test
GRID_PROVIDER=lambdatest npm test
```

---

## 📊 Provider Comparison

| Feature | LambdaTest | BrowserStack |
|---------|------------|--------------|
| **WebSocket URL** | `wss://cdp.lambdatest.com/playwright` | `wss://cdp.browserstack.com/playwright` |
| **Capabilities Key** | `'LT:Options'` | `'bstack:options'` |
| **Username Field** | `user` | `userName` |
| **Access Key Field** | `accessKey` | `accessKey` |
| **Dashboard** | automation.lambdatest.com | automate.browserstack.com |
| **Video Recording** | ✅ Yes | ✅ Yes |
| **Network Logs** | ✅ Yes | ✅ Yes |
| **Console Logs** | ✅ Yes | ✅ Yes |
| **Local Testing** | ✅ Yes | ✅ Yes |

---

## 🎨 Configuration Examples

### Example 1: LambdaTest Configuration

```typescript
grid: {
  isGrid: true,
  provider: 'lambdatest',
  
  lambdatest: {
    user: 'your-username',
    key: 'your-access-key',
    capabilities: {
      'LT:Options': {
        platform: 'Windows 10',
        browserName: 'Chrome',
        browserVersion: 'latest',
        resolution: '1920x1080',
        name: 'Test Name',
        build: 'Build Name',
        projectName: 'Project Name',
        console: true,
        network: true,
        video: true,
      }
    }
  }
}
```

### Example 2: BrowserStack Configuration

```typescript
grid: {
  isGrid: true,
  provider: 'browserstack',
  
  browserstack: {
    user: 'your-username',
    key: 'your-access-key',
    capabilities: {
      'bstack:options': {
        os: 'Windows',
        osVersion: '10',
        browserName: 'chrome',
        browserVersion: 'latest',
        resolution: '1920x1080',
        projectName: 'Project Name',
        buildName: 'Build Name',
        sessionName: 'Test Name',
        networkLogs: true,
        consoleLogs: 'info',
        video: true,
      }
    }
  }
}
```

### Example 3: Multi-Profile Setup

```typescript
const PROFILES = {
  dev_lambdatest: {
    baseURL: 'http://dev.example.com',
    grid: { isGrid: true, provider: 'lambdatest' }
  },
  
  dev_browserstack: {
    baseURL: 'http://dev.example.com',
    grid: { isGrid: true, provider: 'browserstack' }
  },
  
  staging: {
    baseURL: 'https://staging.example.com',
    grid: { isGrid: true, provider: 'browserstack' }
  },
  
  local: {
    baseURL: 'http://localhost:3000',
    grid: { isGrid: false }
  }
}
```

Run specific profile:
```bash
RUN=dev_lambdatest npm test
RUN=dev_browserstack npm test
RUN=staging npm test
RUN=local npm test
```

---

## 🖥️ Console Output

### LambdaTest
```
🌐 Grid Mode: ENABLED - Tests will run on LambdaTest
   Platform: Windows 10
   Browser: Chrome latest
   Build: Development Build
   Provider: LambdaTest
   WebSocket Endpoint: wss://cdp.lambdatest.com/playwright?capabilities=...
   Credentials: Embedded in capabilities JSON (user: your-username)
```

### BrowserStack
```
🌐 Grid Mode: ENABLED - Tests will run on BrowserStack
   Platform: Windows 10
   Browser: chrome latest
   Build: Development Build
   Provider: BrowserStack
   WebSocket Endpoint: wss://cdp.browserstack.com/playwright?caps=...
   Credentials: Embedded in capabilities JSON (user: your-username)
```

### Local
```
💻 Grid Mode: DISABLED - Tests will run locally
```

---

## 🔧 Configuration Tips

### Tip 1: Keep Credentials Separate

Use environment variables:

```typescript
lambdatest: {
  user: process.env.LT_USERNAME || 'fallback',
  key: process.env.LT_ACCESS_KEY || 'fallback',
}

browserstack: {
  user: process.env.BS_USERNAME || 'fallback',
  key: process.env.BS_ACCESS_KEY || 'fallback',
}
```

### Tip 2: Share Common Capabilities

```typescript
const commonCapabilities = {
  browserName: 'chrome',
  browserVersion: 'latest',
  resolution: '1920x1080',
};

lambdatest: {
  capabilities: {
    'LT:Options': {
      ...commonCapabilities,
      platform: 'Windows 10',
    }
  }
}
```

### Tip 3: Provider-Specific Builds

```typescript
lambdatest: {
  capabilities: {
    'LT:Options': {
      build: `LambdaTest Build - ${new Date().toISOString()}`,
    }
  }
},

browserstack: {
  capabilities: {
    'bstack:options': {
      buildName: `BrowserStack Build - ${new Date().toISOString()}`,
    }
  }
}
```

---

## 📈 Use Cases

### Use Case 1: Cross-Browser Testing Across Providers

```bash
# Test on LambdaTest
GRID_PROVIDER=lambdatest npm test

# Test on BrowserStack
GRID_PROVIDER=browserstack npm test

# Compare results from both providers
```

### Use Case 2: Provider Failover

If one provider is down, quickly switch to another:

```typescript
const ACTIVE_PROVIDER = process.env.GRID_PROVIDER || 'lambdatest';

grid: {
  isGrid: true,
  provider: ACTIVE_PROVIDER,
}
```

```bash
# Primary provider (LambdaTest)
npm test

# If primary is down, use backup (BrowserStack)
GRID_PROVIDER=browserstack npm test
```

### Use Case 3: Cost Optimization

Use different providers for different test types:

```typescript
smoke_tests: {
  grid: { provider: 'lambdatest' }  // Cheaper for quick tests
},

regression_tests: {
  grid: { provider: 'browserstack' }  // Better for extensive testing
}
```

---

## 🔍 Viewing Results

### LambdaTest Dashboard
- **URL**: https://automation.lambdatest.com/
- **Navigate**: Automation → Playwright
- **Features**: Live view, video, logs, network

### BrowserStack Dashboard
- **URL**: https://automate.browserstack.com/
- **Navigate**: Automate → Playwright
- **Features**: Video, console, network, screenshots

---

## 🛠️ Extending to More Providers

Want to add Sauce Labs, Perfecto, or another provider?

### Step 1: Add Provider Configuration

```typescript
grid: {
  isGrid: true,
  provider: 'saucelabs',
  
  saucelabs: {
    user: 'your-username',
    key: 'your-access-key',
    capabilities: { /* Sauce Labs specific */ }
  }
}
```

### Step 2: Update Capabilities Builder

In `playwright.config.ts`:

```typescript
if (provider === 'saucelabs') {
  // Build Sauce Labs capabilities
  return {
    // Sauce Labs format
  };
}
```

### Step 3: Update WebSocket Endpoint

```typescript
else if (provider === 'saucelabs') {
  wsEndpoint = `wss://ondemand.saucelabs.com/playwright`;
  projectName = 'saucelabs-grid';
}
```

---

## ✅ Best Practices

1. **Use Environment Variables** for credentials
2. **Keep provider configs in sync** (same browser/platform)
3. **Test locally first** before running on grid
4. **Monitor provider dashboards** for insights
5. **Use meaningful names** in capabilities
6. **Enable logging** for debugging
7. **Document provider-specific quirks**

---

## 📚 Documentation Links

- **LambdaTest Setup**: `docs/GRID_SETUP.md`
- **BrowserStack Setup**: `docs/BROWSERSTACK_SETUP.md`
- **Quick Reference**: `GRID_QUICK_REFERENCE.md`
- **Examples**: `examples/grid-example.md`

---

## 🎯 Quick Commands

```bash
# LambdaTest
npm test  # (if provider='lambdatest' in config)

# BrowserStack
npm test  # (if provider='browserstack' in config)

# Local
RUN=local npm test

# Override with environment variable
GRID_PROVIDER=browserstack npm test
```

---

**Multi-provider setup complete!** You can now easily switch between cloud testing providers! 🚀

