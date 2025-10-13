# Run BrowserStack tests with multiple tags
# This PowerShell script properly handles the grep pattern on Windows

# Option 1: Run with OR pattern (if SDK supports it)
$grepPattern = "(@critical|@smoke)"
Write-Host "Running BrowserStack tests with pattern: $grepPattern" -ForegroundColor Green
Write-Host "Note: Due to BrowserStack SDK limitations on Windows, running tags separately..." -ForegroundColor Yellow

# Workaround: Run each tag in sequence
Write-Host "`nRunning @smoke tests..." -ForegroundColor Cyan
npx browserstack-node-sdk playwright test --grep="@smoke"

Write-Host "`nRunning @critical tests..." -ForegroundColor Cyan
npx browserstack-node-sdk playwright test --grep="@critical"

Write-Host "`nAll tagged tests completed!" -ForegroundColor Green

