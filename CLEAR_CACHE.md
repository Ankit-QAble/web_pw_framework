# How to Clear Cache and Restart TypeScript Server

## Method 1: Restart TypeScript Server in VS Code/Cursor

### Option A: Using Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: `TypeScript: Restart TS Server`
3. Press Enter

### Option B: Using Keyboard Shortcut
- The command palette method is the most reliable

## Method 2: Clear Playwright Cache

### Option A: Using Playwright CLI
```bash
npx playwright install --force
```

### Option B: Manual Cache Clear
```bash
# Delete Playwright cache directory
rm -rf node_modules/.cache/playwright
# On Windows PowerShell:
Remove-Item -Recurse -Force node_modules\.cache\playwright -ErrorAction SilentlyContinue
```

## Method 3: Clear All Caches (Recommended)

Run these commands in your project directory:

### Windows PowerShell:
```powershell
# Clear Playwright cache
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue

# Clear TypeScript build cache
Remove-Item -Recurse -Force .tsbuildinfo -ErrorAction SilentlyContinue

# Clear test results
Remove-Item -Recurse -Force test-results -ErrorAction SilentlyContinue
```

### Linux/Mac:
```bash
# Clear Playwright cache
rm -rf node_modules/.cache

# Clear TypeScript build cache
rm -f .tsbuildinfo

# Clear test results
rm -rf test-results
```

## Method 4: Full Clean (Nuclear Option)

If the above doesn't work, do a full clean:

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Clear all caches
npm cache clean --force
```

## After Clearing Cache

1. Restart your IDE/Editor (VS Code/Cursor)
2. Restart TypeScript Server (Method 1)
3. Run your tests again

## Verify the Fix

After clearing cache, check if the error is gone:
- The linter should no longer show the `csv-parse/sync` error
- Your tests should run without module resolution errors


