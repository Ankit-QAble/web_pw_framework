# Clear Cache Script for Windows PowerShell
# This script clears various caches that might cause module resolution issues

Write-Host "🧹 Clearing caches..." -ForegroundColor Cyan

# Clear Playwright cache
if (Test-Path "node_modules\.cache") {
    Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
    Write-Host "✅ Cleared Playwright cache" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No Playwright cache found" -ForegroundColor Yellow
}

# Clear TypeScript build info
if (Test-Path ".tsbuildinfo") {
    Remove-Item -Force ".tsbuildinfo" -ErrorAction SilentlyContinue
    Write-Host "✅ Cleared TypeScript build cache" -ForegroundColor Green
}

# Clear test results
if (Test-Path "test-results") {
    Remove-Item -Recurse -Force "test-results" -ErrorAction SilentlyContinue
    Write-Host "✅ Cleared test results" -ForegroundColor Green
}

Write-Host "`n✨ Cache clearing complete!" -ForegroundColor Green
Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Restart TypeScript Server: Ctrl+Shift+P -> 'TypeScript: Restart TS Server'" -ForegroundColor White
Write-Host "   2. Or restart your IDE/Editor completely" -ForegroundColor White
Write-Host "   3. Run your tests again" -ForegroundColor White


