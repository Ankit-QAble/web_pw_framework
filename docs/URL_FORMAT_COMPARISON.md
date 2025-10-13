# URL Format Comparison: Selenium vs Playwright

## Quick Answer: Where Are Credentials Passed?

**Your credentials ARE embedded in the connection URL!**

They're just in a different format because Playwright uses WebSocket (wss://) instead of HTTPS.

---

## Format Breakdown

### 🔴 Selenium Format (What you asked about)
```
https://ankitpatelsadad:LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6@hub.lambdatest.com/wd/hub
       └────────────┘ └──────────────────────────────────────────────────┘
          username                    access key
```

**Tools that use this:**
- Selenium WebDriver
- WebDriverIO
- Protractor
- Any Selenium-based framework

**Protocol:** HTTPS (HTTP Secure)

---

### 🟢 Playwright Format (What we're using)
```
wss://cdp.lambdatest.com/playwright?capabilities={"LT:Options":{"username":"ankitpatelsadad","accessKey":"LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6"}}
                                                                 └────────────┘            └──────────────────────────────────────────────────┘
                                                                    username                            access key
```

**Tools that use this:**
- Playwright
- Puppeteer
- Any CDP-based framework

**Protocol:** WSS (WebSocket Secure)

---

## Side-by-Side Comparison

| Aspect | Selenium | Playwright |
|--------|----------|------------|
| **Protocol** | HTTPS | WSS (WebSocket) |
| **Credentials Location** | In URL path | In capabilities JSON parameter |
| **URL Format** | `https://user:pass@hub.lambdatest.com/wd/hub` | `wss://cdp.lambdatest.com/playwright?capabilities={...}` |
| **Authentication** | Basic Auth (URL-encoded) | JSON payload |
| **Communication** | REST API (request/response) | Bidirectional WebSocket |
| **Used By** | Selenium, WebDriverIO | Playwright, Puppeteer |

---

## Visual Flow in Your Project

```
Step 1: Configuration (playwright.config.ts)
┌─────────────────────────────────────────────┐
│ grid: {                                     │
│   user: 'ankitpatelsadad',                  │ ← YOU DEFINE CREDENTIALS HERE
│   key: 'LT_3R7SNKvxrQqDBZTeI3vCIxIy6...',  │
│ }                                           │
└─────────────────────────────────────────────┘
              ↓
Step 2: Build Capabilities (Line 119-130)
┌─────────────────────────────────────────────┐
│ capabilities = {                            │
│   'LT:Options': {                           │
│     username: gridConfig.user,              │ ← CREDENTIALS EXTRACTED
│     accessKey: gridConfig.key,              │
│     platform: 'Windows 10',                 │
│     browserName: 'Chrome',                  │
│   }                                         │
│ }                                           │
└─────────────────────────────────────────────┘
              ↓
Step 3: Build WebSocket URL (Line 141)
┌─────────────────────────────────────────────────────────────────────────────┐
│ wsEndpoint = wss://cdp.lambdatest.com/playwright?capabilities={             │
│   "LT:Options": {                                                           │
│     "username": "ankitpatelsadad",           ← CREDENTIALS EMBEDDED IN URL  │
│     "accessKey": "LT_3R7SNKvxrQqDBZTeI3vCIxIy6...",  ← HERE!               │
│     "platform": "Windows 10",                                               │
│     "browserName": "Chrome"                                                 │
│   }                                                                         │
│ }                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘
              ↓
Step 4: Playwright Connects
┌─────────────────────────────────────────────┐
│ Playwright connects using the WebSocket URL │
│ with embedded credentials                   │
└─────────────────────────────────────────────┘
```

---

## Example: Real URL Being Used

When your test runs with `isGrid: true`, the actual connection URL is:

### Readable Format:
```javascript
wss://cdp.lambdatest.com/playwright?capabilities={
  "browserName": "chrome",
  "browserVersion": "latest",
  "LT:Options": {
    "username": "ankitpatelsadad",              // ← YOUR USERNAME
    "accessKey": "LT_3R7SNKvxrQqDBZTeI3vCIxIy6...",  // ← YOUR ACCESS KEY
    "platform": "Windows 10",
    "browserName": "Chrome",
    "browserVersion": "latest",
    "name": "Playwright Development Tests",
    "build": "Development Build"
  }
}
```

### URL-Encoded Format (actual):
```
wss://cdp.lambdatest.com/playwright?capabilities=%7B%22browserName%22%3A%22chrome%22%2C%22LT%3AOptions%22%3A%7B%22username%22%3A%22ankitpatelsadad%22%2C%22accessKey%22%3A%22LT_3R7SNKvxrQqDBZTeI3vCIxIy6...
```

---

## How to See the Credentials Being Passed

### Option 1: Console Output
When you run tests, you'll see:
```bash
npm test
```

Output:
```
🌐 Grid Mode: ENABLED - Tests will run on LambdaTest
   Platform: Windows 10
   Browser: Chrome latest
   Build: Development Build
   WebSocket Endpoint: wss://cdp.lambdatest.com/playwright
   Credentials: Embedded in capabilities (username: ankitpatelsadad)
   ↑
   ↑ THIS LINE CONFIRMS CREDENTIALS ARE BEING USED
```

### Option 2: Add Debug Logging
Add this to `playwright.config.ts` (line 142):
```typescript
console.log('Full capabilities:', JSON.stringify(capabilities, null, 2));
```

You'll see:
```json
{
  "LT:Options": {
    "username": "ankitpatelsadad",
    "accessKey": "LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6",
    ...
  }
}
```

---

## Why Not Use the Selenium URL Format?

You might wonder: "Can I just use `https://user:pass@hub.lambdatest.com/wd/hub`?"

**Answer: No, because:**

1. **Playwright uses CDP (Chrome DevTools Protocol)**, not Selenium WebDriver
2. **CDP requires WebSocket** (wss://), not HTTPS
3. **LambdaTest's Playwright endpoint** is different from Selenium endpoint
4. **Credentials must be in JSON capabilities** for CDP connections

**The WebSocket format IS the correct way for Playwright!**

---

## Summary

✅ **YES, credentials ARE in the URL** - just in the `capabilities` parameter  
✅ **Format is DIFFERENT** from Selenium because Playwright uses WebSocket  
✅ **Location**: `wss://cdp.lambdatest.com/playwright?capabilities={"LT:Options":{"username":"...","accessKey":"..."}}`  

Your original format (`https://user:pass@hub`) is for **Selenium**, not **Playwright**.

---

## Quick Reference

| What You Asked For | What We're Using | Why |
|-------------------|------------------|-----|
| `https://user:pass@hub.lambdatest.com/wd/hub` | `wss://cdp.lambdatest.com/playwright?capabilities={...}` | Playwright uses CDP/WebSocket, not Selenium/HTTPS |
| Credentials in URL path | Credentials in JSON parameter | CDP protocol requirement |
| Basic Auth | JSON payload | WebSocket standard |

**Both methods pass credentials in the URL - just in different formats!**

---

## Verify It's Working

Run your tests:
```bash
npm test
```

Check:
1. ✅ Console shows: `Credentials: Embedded in capabilities (username: ankitpatelsadad)`
2. ✅ Tests appear in LambdaTest dashboard: https://automation.lambdatest.com/
3. ✅ No authentication errors

If all three are true, your credentials are being passed correctly! 🎉

