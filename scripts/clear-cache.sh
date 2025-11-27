#!/bin/bash
# Clear Cache Script for Linux/Mac
# This script clears various caches that might cause module resolution issues

echo "🧹 Clearing caches..."

# Clear Playwright cache
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ Cleared Playwright cache"
else
    echo "ℹ️  No Playwright cache found"
fi

# Clear TypeScript build info
if [ -f ".tsbuildinfo" ]; then
    rm -f .tsbuildinfo
    echo "✅ Cleared TypeScript build cache"
fi

# Clear test results
if [ -d "test-results" ]; then
    rm -rf test-results
    echo "✅ Cleared test results"
fi

echo ""
echo "✨ Cache clearing complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Restart TypeScript Server: Ctrl+Shift+P -> 'TypeScript: Restart TS Server'"
echo "   2. Or restart your IDE/Editor completely"
echo "   3. Run your tests again"


