# Grid Configuration Setup

This project supports running tests on **LambdaTest Grid** with conditional execution based on the `isGrid` flag.

## 🌐 How It Works

The framework automatically detects the `isGrid` setting in your profile configuration and routes tests accordingly:
- **`isGrid: true`** → Tests run on LambdaTest cloud grid
- **`isGrid: false`** → Tests run locally on your machine

## Configuration Structure

In `playwright.config.ts`, each profile has a `grid` configuration:

```typescript
grid: {
  isGrid: true,  // Enable/disable grid execution
  url: 'https://hub.lambdatest.com/wd/hub',
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
      selenium_version: '4.0.0',
      driver_version: 'latest',
      console: true,
      network: true,
      visual: true,
      video: true,
      terminal: true,
    }
  }
}
```

## Capabilities Explained

### Platform & Browser
- **`platform`**: OS platform (Windows 10, Windows 11, macOS, etc.)
- **`browserName`**: Browser to use (Chrome, Firefox, Edge, Safari)
- **`browserVersion`**: Browser version (latest, 120, 119, etc.)
- **`resolution`**: Screen resolution (1920x1080, 1366x768, etc.)

### Test Identification
- **`name`**: Test session name (appears in LambdaTest dashboard)
- **`build`**: Build identifier for grouping tests
- **`projectName`**: Project name for organization

### Debugging Features
- **`console`**: Capture browser console logs
- **`network`**: Capture network logs
- **`visual`**: Enable visual regression
- **`video`**: Record video of test execution
- **`terminal`**: Capture terminal logs

## Usage Examples

### Example 1: Run on Grid (Development Profile)
```typescript
// In playwright.config.ts
development: {
  // ... other settings
  grid: {
    isGrid: true,  // ✅ Enable grid
    // ... capabilities
  }
}
```

Run tests:
```bash
npm test
# or
npx playwright test
```

You'll see:
```
🌐 Grid Mode: ENABLED - Tests will run on LambdaTest
   Platform: Windows 10
   Browser: Chrome latest
   Build: Development Build
```

### Example 2: Run Locally (Preprod Profile)
```typescript
// In playwright.config.ts
preprod: {
  // ... other settings
  grid: {
    isGrid: false,  // ❌ Disable grid
    // ... capabilities
  }
}
```

Run tests:
```bash
RUN=preprod npm test
```

You'll see:
```
💻 Grid Mode: DISABLED - Tests will run locally
```

### Example 3: Switch Between Grid and Local
You can easily toggle by changing the `isGrid` flag:

```typescript
// Run on grid
grid: { isGrid: true, ... }

// Run locally
grid: { isGrid: false, ... }
```

## Profile-Specific Configurations

### Development Profile
- **isGrid**: `true` (default)
- **Platform**: Windows 10
- **Browser**: Chrome latest
- **Build**: "Development Build"

### Preprod Profile
- **isGrid**: `false` (default)
- **Platform**: Windows 10
- **Browser**: Chrome latest
- **Build**: "Preprod Build"

## Advanced Capabilities

### Mobile Testing on Grid
```typescript
capabilities: {
  'LT:Options': {
    platformName: 'android',
    deviceName: 'Galaxy S21',
    platformVersion: '11',
    // ... other options
  }
}
```

### Specific Browser Versions
```typescript
capabilities: {
  'LT:Options': {
    browserName: 'Chrome',
    browserVersion: '120.0',  // Specific version
  }
}
```

### Geolocation Testing
```typescript
capabilities: {
  'LT:Options': {
    geoLocation: 'US',  // or 'IN', 'GB', 'FR', etc.
  }
}
```

### Timezone Testing
```typescript
capabilities: {
  'LT:Options': {
    timezone: 'America/New_York',
  }
}
```

## Environment Variables

You can override settings using environment variables:

```bash
# Switch environment
RUN=development npm test
RUN=preprod npm test

# Override browser
BROWSER=firefox npm test
```

## LambdaTest Dashboard

When tests run on grid, you can monitor them in real-time:

1. Go to [LambdaTest Dashboard](https://automation.lambdatest.com/)
2. Login with your credentials
3. Navigate to **Automation** → **Playwright**
4. View your test executions with:
   - Live test execution
   - Video recordings
   - Console logs
   - Network logs
   - Screenshots
   - Test timeline

## Troubleshooting

### Issue: Tests not connecting to grid
**Solution**: Verify credentials in `playwright.config.ts`
```typescript
user: 'your-username',
key: 'your-access-key',
```

### Issue: Slow test execution on grid
**Solution**: Reduce parallel workers for grid execution
```typescript
parallel: 2,  // Lower number for grid
```

### Issue: Timeout errors on grid
**Solution**: Increase timeouts for grid execution
```typescript
timeout: 120000,  // 2 minutes
actionTimeout: 120000,
navigationTimeout: 180000,
```

## Best Practices

1. **Use Grid for CI/CD**: Set `isGrid: true` for production pipelines
2. **Use Local for Development**: Set `isGrid: false` for faster local debugging
3. **Meaningful Names**: Use descriptive `name` and `build` values for easy tracking
4. **Enable Logs**: Keep `console`, `network`, and `video` enabled for debugging
5. **Version Control**: Don't commit access keys; use environment variables

## Security Note

⚠️ **Never commit your LambdaTest credentials to version control!**

Consider using environment variables:
```typescript
grid: {
  user: process.env.LT_USERNAME || 'your-username',
  key: process.env.LT_ACCESS_KEY || 'your-access-key',
}
```

Then set environment variables:
```bash
export LT_USERNAME=your-username
export LT_ACCESS_KEY=your-access-key
```

## Additional Resources

- [LambdaTest Playwright Documentation](https://www.lambdatest.com/support/docs/playwright-testing/)
- [LambdaTest Capabilities Generator](https://www.lambdatest.com/capabilities-generator/)
- [Playwright Test Configuration](https://playwright.dev/docs/test-configuration)

