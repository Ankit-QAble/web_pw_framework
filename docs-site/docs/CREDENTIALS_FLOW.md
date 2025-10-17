# LambdaTest Credentials Flow

## Where Are Credentials Passed?

### 📍 Location 1: Configuration (playwright.config.ts)

```typescript
grid: {
  isGrid: true,
  user: 'ankitpatelsadad',  // ← Your username
  key: 'LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6',  // ← Your access key
}
```

### 📍 Location 2: Capabilities Object (Line 126-127)

```typescript
function buildLambdaTestCapabilities(gridConfig: any, browser: string) {
  return {
    'LT:Options': {
      username: gridConfig.user,      // ← Username passed here
      accessKey: gridConfig.key,      // ← Access key passed here
      // ... other capabilities
    }
  };
}
```

### 📍 Location 3: WebSocket URL (Line 141)

```typescript
const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`;
```

This creates a URL like:
```
wss://cdp.lambdatest.com/playwright?capabilities={
  "LT:Options": {
    "username": "ankitpatelsadad",
    "accessKey": "LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6",
    ...
  }
}
```

## URL Format Comparison

### ❌ Selenium WebDriver Format (NOT used for Playwright)
```
https://ankitpatelsadad:LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6@hub.lambdatest.com/wd/hub
        ↑              ↑
     username      access key (in URL)
```

**Used for:** Selenium, WebDriverIO, Protractor

### ✅ Playwright Format (What we're using)
```
wss://ankitpatelsadad:LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6@cdp.lambdatest.com/playwright?capabilities={...}
       ↑              ↑
    username      access key (in WebSocket URL)
```

**Used for:** Playwright, Puppeteer (CDP-based tools)

## Visual Flow

```
Configuration
    ↓
grid: {
  user: 'ankitpatelsadad'
  key: 'LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6'
}
    ↓
buildLambdaTestCapabilities()
    ↓
capabilities = {
  'LT:Options': {
    username: 'ankitpatelsadad',      ← Extracted from grid.user
    accessKey: 'LT_3R7S...',          ← Extracted from grid.key
    platform: 'Windows 10',
    browserName: 'Chrome',
    ...
  }
}
    ↓
wsEndpoint = wss://cdp.lambdatest.com/playwright?capabilities=${JSON.stringify(capabilities)}
    ↓
Playwright connects to LambdaTest using WebSocket
```

## Console Output When Running Tests

When you run `npm test` with grid enabled, you'll see:

```
🌐 Grid Mode: ENABLED - Tests will run on LambdaTest
   Platform: Windows 10
   Browser: Chrome latest
   Build: Development Build
   WebSocket Endpoint: wss://cdp.lambdatest.com/playwright
   Credentials: Embedded in capabilities (username: ankitpatelsadad)
   ↑
   ↑ Shows where credentials are being used
```

## Why Different URL Formats?

### Selenium WebDriver
- Uses HTTP/HTTPS protocol
- Credentials in URL: `https://user:key@hub.lambdatest.com/wd/hub`
- Sends commands via REST API
- Works with: Selenium, WebDriverIO, Protractor

### Playwright (CDP)
- Uses WebSocket protocol (wss://)
- Credentials in JSON capabilities parameter
- Uses Chrome DevTools Protocol (CDP)
- More efficient, bidirectional communication
- Works with: Playwright, Puppeteer

## Example: Full WebSocket URL

When your test runs, the actual WebSocket URL looks like:

```
wss://cdp.lambdatest.com/playwright?capabilities=%7B%22browserName%22%3A%22chrome%22%2C%22browserVersion%22%3A%22latest%22%2C%22LT%3AOptions%22%3A%7B%22platform%22%3A%22Windows%2010%22%2C%22username%22%3A%22ankitpatelsadad%22%2C%22accessKey%22%3A%22LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6%22%7D%7D
```

Decoded, it contains:
```json
{
  "browserName": "chrome",
  "browserVersion": "latest",
  "LT:Options": {
    "platform": "Windows 10",
    "username": "ankitpatelsadad",
    "accessKey": "LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6",
    "name": "Playwright Development Tests",
    "build": "Development Build",
    ...
  }
}
```

## Code Reference

### Where to find the credential passing logic:

1. **Configuration**: Lines 23-30, 76-83 in `playwright.config.ts`
   ```typescript
   grid: {
     user: 'ankitpatelsadad',
     key: 'LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6',
   }
   ```

2. **Capabilities Builder**: Lines 118-130 in `playwright.config.ts`
   ```typescript
   function buildLambdaTestCapabilities(gridConfig: any, browser: string) {
     return {
       'LT:Options': {
         username: gridConfig.user,
         accessKey: gridConfig.key,
       }
     };
   }
   ```

3. **WebSocket Endpoint**: Lines 136-148 in `playwright.config.ts`
   ```typescript
   const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${...}`;
   ```

## Verify Credentials

To verify your credentials are being passed correctly:

1. **Check console output** when running tests:
   ```bash
   npm test
   ```
   
   You should see:
   ```
   Credentials: Embedded in capabilities (username: ankitpatelsadad)
   ```

2. **Check LambdaTest Dashboard**:
   - Go to https://automation.lambdatest.com/
   - Your tests should appear in the dashboard
   - If credentials are wrong, you'll get an authentication error

3. **Debug mode**: Add this to see the full URL:
   ```typescript
   console.log('Full WebSocket URL:', wsEndpoint);
   ```

## Summary

✅ **Credentials ARE being passed** in the WebSocket URL  
✅ **Format is correct** for Playwright (CDP-based)  
✅ **Location**: Embedded in the `capabilities` JSON parameter  
✅ **URL**: `wss://cdp.lambdatest.com/playwright?capabilities=...`  

❌ **NOT using** Selenium format: `https://user:key@hub.lambdatest.com/wd/hub`  
❌ **NOT using** HTTP/HTTPS protocol (WebSocket instead)  

