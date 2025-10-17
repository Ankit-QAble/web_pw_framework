# Grid Configuration Example

## Current Setup

Your project is now configured with **conditional grid execution**. Tests will automatically run on LambdaTest Grid when `isGrid: true`, and locally when `isGrid: false`.

## Example 1: Running on LambdaTest Grid

**Configuration (Development Profile):**
```typescript
development: {
  grid: {
    isGrid: true,  // ✅ Grid enabled
    // ... capabilities
  }
}
```

**Run Command:**
```bash
npm test
```

**What happens:**
1. Framework detects `isGrid: true`
2. Creates WebSocket connection to LambdaTest
3. Tests execute on LambdaTest cloud browsers
4. Results visible in LambdaTest dashboard

**Console Output:**
```
🌐 Grid Mode: ENABLED - Tests will run on LambdaTest
   Platform: Windows 10
   Browser: Chrome latest
   Build: Development Build

Running 3 tests using 1 worker
✓ login.spec.ts:3:5 › Login Page Tests › Enter valid credentials (5s)
```

## Example 2: Running Locally

**Configuration (Preprod Profile):**
```typescript
preprod: {
  grid: {
    isGrid: false,  // ❌ Grid disabled
    // ... capabilities
  }
}
```

**Run Command:**
```bash
RUN=preprod npm test
```

**What happens:**
1. Framework detects `isGrid: false`
2. Launches local browser
3. Tests execute on your machine
4. Results saved locally

**Console Output:**
```
💻 Grid Mode: DISABLED - Tests will run locally

Running 3 tests using 1 worker
✓ login.spec.ts:3:5 › Login Page Tests › Enter valid credentials (3s)
```

## Example 3: Switching Between Grid and Local

### Method 1: Toggle isGrid flag
```typescript
// In playwright.config.ts
development: {
  grid: { isGrid: true }   // Run on grid
}

// Change to
development: {
  grid: { isGrid: false }  // Run locally
}
```

### Method 2: Use different profiles
```bash
# Development profile (grid enabled)
npm test

# Preprod profile (grid disabled)
RUN=preprod npm test
```

## Example 4: Custom Capabilities

You can customize browser, platform, and features:

```typescript
grid: {
  isGrid: true,
  capabilities: {
    'LT:Options': {
      platform: 'macOS Monterey',     // Change OS
      browserName: 'Firefox',          // Change browser
      browserVersion: '120',           // Specific version
      resolution: '2560x1440',         // Change resolution
      name: 'Custom Test Name',        // Test name
      build: 'Sprint 5',               // Build identifier
      
      // Debugging features
      console: true,    // Browser console logs
      network: true,    // Network activity
      video: true,      // Video recording
      
      // Advanced features
      geoLocation: 'US',              // Geolocation
      timezone: 'America/New_York',   // Timezone
    }
  }
}
```

## Example 5: Multiple Browser Testing

Test on different browsers by switching capabilities:

**Chrome:**
```typescript
capabilities: {
  'LT:Options': {
    browserName: 'Chrome',
    browserVersion: 'latest',
  }
}
```

**Firefox:**
```typescript
capabilities: {
  'LT:Options': {
    browserName: 'Firefox',
    browserVersion: 'latest',
  }
}
```

**Edge:**
```typescript
capabilities: {
  'LT:Options': {
    browserName: 'MicrosoftEdge',
    browserVersion: 'latest',
  }
}
```

**Safari:**
```typescript
capabilities: {
  'LT:Options': {
    platform: 'macOS Monterey',
    browserName: 'Safari',
    browserVersion: 'latest',
  }
}
```

## Example 6: CI/CD Pipeline

**Jenkinsfile example:**
```groovy
pipeline {
  stages {
    stage('Test on Grid') {
      steps {
        sh 'npm test'  // Uses development profile with isGrid: true
      }
    }
  }
}
```

**GitHub Actions example:**
```yaml
- name: Run tests on LambdaTest
  run: npm test
  env:
    RUN: development  # Uses profile with isGrid: true
```

## Viewing Results

### On LambdaTest Dashboard:
1. Visit: https://automation.lambdatest.com/
2. Login with your credentials
3. Navigate to: Automation → Playwright
4. See:
   - Live test execution
   - Video recordings
   - Console logs
   - Network logs
   - Screenshots
   - Timeline

### Locally:
- HTML Report: `playwright-report/index.html`
- Allure Report: `allure-report/index.html`
- Screenshots: `screenshots/` folder

## Pro Tips

1. **Use Grid for CI/CD**: Set `isGrid: true` in CI environments
2. **Use Local for Development**: Set `isGrid: false` for faster debugging
3. **Meaningful Names**: Use descriptive names in capabilities
4. **Enable Logging**: Keep debugging features enabled
5. **Monitor Dashboard**: Check LambdaTest dashboard during execution

## Troubleshooting

### Grid connection issues?
```typescript
// Check credentials
grid: {
  user: 'ankitpatelsadad',
  key: 'LT_3R7SNKvxrQqDBZTeI3vCIxIy6jv1Ike3YpMRghc0ER4XDH6',
}
```

### Tests not running on grid?
```typescript
// Verify isGrid is true
grid: {
  isGrid: true,  // Must be true
}
```

### Want to switch quickly?
```bash
# Just change the profile
RUN=development npm test  # Grid enabled
RUN=preprod npm test      # Grid disabled
```

