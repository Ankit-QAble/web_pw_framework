# Running Tests with MCP (Model Context Protocol)

This guide explains how to run your Playwright tests using MCP in Cursor.

## What is MCP?

MCP (Model Context Protocol) allows AI assistants to interact with tools and services. Cursor includes a built-in Playwright MCP server that enables browser automation and test execution.

## Methods to Run Tests

### Method 1: Direct MCP Tool Usage (In Cursor)

You can ask me (the AI assistant) to:
- Run specific tests: "Run the login test"
- Run tests with filters: "Run all smoke tests"
- Navigate and interact with your app through the browser

**Example commands you can use:**
```
"Run the login test for me"
"Execute all tests with @smoke tag"
"Run tests on the preprod environment"
```

### Method 2: Via NPM Scripts

Use the MCP-integrated scripts:

```powershell
# Run any test
npm run test:mcp

# Run smoke tests
npm run test:mcp:smoke

# Run critical tests
npm run test:mcp:critical

# Run login test specifically
npm run test:mcp:login
```

### Method 3: Direct Playwright Commands

Standard Playwright commands work:

```powershell
# Run all tests
npm test

# Run with specific environment
$env:RUN="preprod"; npm test

# Run specific test file
npm test test/specs/login.spec.ts

# Run with filter
npm test -- --grep "@smoke"

# UI mode (interactive)
npm run test:ui
```

## MCP Test Runner Script

The `scripts/run-test-mcp.js` script provides MCP-friendly test execution:

```javascript
// Available commands:
node scripts/run-test-mcp.js run:smoke      // Run @smoke tests
node scripts/run-test-mcp.js run:critical   // Run @critical tests
node scripts/run-test-mcp.js run:login      // Run login test
node scripts/run-test-mcp.js run:all        // Run all tests
```

## Running Tests in Different Environments

### Development Environment
```powershell
$env:RUN="development"; npm test
```

### Preprod Environment
```powershell
$env:RUN="preprod"; npm test
```

### With MCP Integration
```powershell
# In PowerShell, set environment and run
$env:RUN="preprod"
npm run test:mcp:smoke
```

## Integration with Endform (via MCP)

Since Endform CLI doesn't work on Windows, you can use MCP to:

1. **Generate test commands** that work with Endform
2. **Prepare test execution** for CI/CD
3. **Validate test configuration** before pushing to GitHub

**Example workflow:**
1. Use MCP to test locally with `npm run test:mcp:smoke`
2. Push to GitHub where Endform runs in CI/CD
3. View results in GitHub Actions and Endform dashboard

## Example: Asking MCP to Run Tests

You can simply ask me:

```
"Can you run the login test?"
"Run all smoke tests in development environment"
"Execute tests and show me the results"
```

I'll use the available Playwright MCP tools to:
1. Execute the tests
2. Take screenshots if needed
3. Provide results and feedback

## Troubleshooting MCP Test Execution

### If tests fail to run:
1. **Check browser installation:**
   ```powershell
   npm run install:browsers
   ```

2. **Verify environment variables:**
   ```powershell
   echo $env:RUN
   ```

3. **Run in debug mode:**
   ```powershell
   npm run test:debug
   ```

4. **Check Playwright config:**
   - Ensure `playwright.config.ts` is valid
   - Verify test directory matches your structure

### MCP-Specific Issues:

**"Tool not available"**: 
- Restart Cursor
- Ensure Playwright MCP server is enabled in Cursor settings

**"Tests don't appear to run"**:
- Check console output
- Verify npm scripts are correct
- Try running directly: `npm test`

## Using MCP for Test Development

MCP can help you:
- **Generate tests**: "Create a test for the login page"
- **Debug tests**: "Show me what happens when I navigate to the login page"
- **Fix tests**: "Help me fix the failing login test"
- **Run tests**: "Run all tests and show results"

## Combining MCP with Endform Workflow

```
Local Development (Windows):
├── Use MCP → Run tests locally
├── Debug issues
└── Commit changes

CI/CD (GitHub Actions):
├── Endform runs tests on Linux
├── Distributed execution
└── Results in dashboard
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests locally |
| `npm run test:mcp:smoke` | Run smoke tests via MCP |
| `npm run test:mcp:critical` | Run critical tests via MCP |
| `npm run test:ui` | Open Playwright UI |
| `npm run test:debug` | Debug mode |
| `npm run test:endform` | Run via Endform (Linux only) |

## Next Steps

1. **Try asking me to run a test**: "Run the login test"
2. **Use npm scripts**: `npm run test:mcp:smoke`
3. **Set up CI/CD**: Your GitHub Actions workflow with Endform is ready
4. **Monitor results**: Check GitHub Actions and Endform dashboard

---

For more details, see:
- [README.md](./README.md) - General test framework docs
- [ENDFORM_SETUP.md](./ENDFORM_SETUP.md) - Endform setup guide
- Playwright MCP docs in Cursor
