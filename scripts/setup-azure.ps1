# Azure Playwright Testing Setup Helper
# This script helps you configure Azure Playwright Testing

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Azure Playwright Testing - Setup Helper                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Check if .env file exists
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "env.azure.example" $envFile
    Write-Host "✅ .env file created!`n" -ForegroundColor Green
}

Write-Host "📋 Current Setup Status:`n" -ForegroundColor Yellow

# Read current .env values
$envContent = Get-Content $envFile -Raw
$serviceUrl = ($envContent | Select-String -Pattern 'PLAYWRIGHT_SERVICE_URL=(.+)' -AllMatches).Matches.Groups[1].Value.Trim()
$accessToken = ($envContent | Select-String -Pattern 'PLAYWRIGHT_SERVICE_ACCESS_TOKEN=(.+)' -AllMatches).Matches.Groups[1].Value.Trim()

# Check Service URL
Write-Host "1. Service URL: " -NoNewline -ForegroundColor White
if ($serviceUrl -match "https://.+\.api\.playwright\.microsoft\.com") {
    if ($serviceUrl -notmatch "your-workspace-id|eastus\.api\.playwright\.microsoft\.com$") {
        Write-Host "✅ Configured" -ForegroundColor Green
        $urlConfigured = $true
    } else {
        Write-Host "⚠️  Using example URL - NEEDS UPDATE" -ForegroundColor Yellow
        Write-Host "   Current: $serviceUrl" -ForegroundColor Gray
        $urlConfigured = $false
    }
} else {
    Write-Host "❌ Not configured" -ForegroundColor Red
    $urlConfigured = $false
}

# Check Access Token
Write-Host "2. Access Token: " -NoNewline -ForegroundColor White
if ($accessToken -and $accessToken -ne "your-access-token-here" -and $accessToken.Length -gt 20) {
    Write-Host "✅ Configured" -ForegroundColor Green
    $tokenConfigured = $true
} else {
    Write-Host "❌ Not configured" -ForegroundColor Red
    Write-Host "   Current: $accessToken" -ForegroundColor Gray
    $tokenConfigured = $false
}

Write-Host "`n" + "─" * 60 + "`n" -ForegroundColor Gray

# Provide next steps
if ($urlConfigured -and $tokenConfigured) {
    Write-Host "🎉 Configuration looks good!" -ForegroundColor Green
    Write-Host "`nYou can now run:" -ForegroundColor Cyan
    Write-Host "  npm run test:azure:10workers`n" -ForegroundColor White
    
    # Ask if they want to test now
    $test = Read-Host "Would you like to run a test now? (y/n)"
    if ($test -eq "y" -or $test -eq "Y") {
        Write-Host "`nRunning test..." -ForegroundColor Cyan
        npm run test:azure:10workers
    }
} else {
    Write-Host "⚠️  Configuration incomplete. Let's fix it!`n" -ForegroundColor Yellow
    
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  STEP 1: Get Your Azure Playwright Workspace Credentials  " -ForegroundColor Cyan
    Write-Host "═══════════════════════════════════════════════════════════`n" -ForegroundColor Cyan
    
    Write-Host "Do you have an Azure Playwright Testing workspace?" -ForegroundColor White
    Write-Host "  1. Yes - I have a workspace" -ForegroundColor Green
    Write-Host "  2. No - I need to create one`n" -ForegroundColor Yellow
    
    $choice = Read-Host "Enter your choice (1 or 2)"
    
    if ($choice -eq "2") {
        Write-Host "`n🔧 Creating Azure Playwright Workspace:`n" -ForegroundColor Cyan
        Write-Host "1. Open: https://portal.azure.com/#create/Microsoft.Playwright" -ForegroundColor White
        Write-Host "2. Sign in with your Microsoft account" -ForegroundColor White
        Write-Host "3. Fill in the form:" -ForegroundColor White
        Write-Host "   - Resource Group: Create new -> 'playwright-testing-rg'" -ForegroundColor Gray
        Write-Host "   - Name: 'my-playwright-workspace' (or your choice)" -ForegroundColor Gray
        Write-Host "   - Region: Select closest to you (East US or West Europe)" -ForegroundColor Gray
        Write-Host "4. Click 'Review + Create' → 'Create'" -ForegroundColor White
        Write-Host "5. Wait 2-3 minutes for deployment`n" -ForegroundColor White
        
        $opened = Read-Host "Press Enter when you've created the workspace"
    }
    
    Write-Host "`n" + "═" * 60 -ForegroundColor Cyan
    Write-Host "  STEP 2: Get Your Service URL                              " -ForegroundColor Cyan
    Write-Host "═" * 60 + "`n" -ForegroundColor Cyan
    
    Write-Host "1. Go to: https://portal.azure.com/" -ForegroundColor White
    Write-Host "2. Search for 'Playwright Testing' in the search bar" -ForegroundColor White
    Write-Host "3. Click on your workspace" -ForegroundColor White
    Write-Host "4. In the Overview, copy the 'Service Endpoint' URL" -ForegroundColor White
    Write-Host "   Format: https://<region>.api.playwright.microsoft.com/accounts/<id>`n" -ForegroundColor Gray
    
    $newUrl = Read-Host "Paste your Service URL here (or press Enter to skip)"
    
    Write-Host "`n" + "═" * 60 -ForegroundColor Cyan
    Write-Host "  STEP 3: Generate Access Token                             " -ForegroundColor Cyan
    Write-Host "═" * 60 + "`n" -ForegroundColor Cyan
    
    Write-Host "1. In your workspace, go to: Settings → Access tokens" -ForegroundColor White
    Write-Host "2. Click 'Generate token' or 'New access token'" -ForegroundColor White
    Write-Host "3. Give it a name (e.g., 'local-dev')" -ForegroundColor White
    Write-Host "4. Set expiration (30-90 days recommended)" -ForegroundColor White
    Write-Host "5. Click 'Generate' and COPY THE TOKEN immediately!`n" -ForegroundColor White
    
    $newToken = Read-Host "Paste your Access Token here (or press Enter to skip)" -AsSecureString
    $newTokenPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($newToken))
    
    # Update .env file if values provided
    if ($newUrl) {
        $envContent = $envContent -replace "PLAYWRIGHT_SERVICE_URL=.+", "PLAYWRIGHT_SERVICE_URL=$newUrl"
        Write-Host "✅ Service URL updated!" -ForegroundColor Green
    }
    
    if ($newTokenPlain) {
        $envContent = $envContent -replace "PLAYWRIGHT_SERVICE_ACCESS_TOKEN=.+", "PLAYWRIGHT_SERVICE_ACCESS_TOKEN=$newTokenPlain"
        Write-Host "✅ Access Token updated!" -ForegroundColor Green
    }
    
    if ($newUrl -or $newTokenPlain) {
        Set-Content -Path $envFile -Value $envContent
        Write-Host "`n✅ .env file updated successfully!`n" -ForegroundColor Green
        
        Write-Host "You can now run:" -ForegroundColor Cyan
        Write-Host "  npm run test:azure:10workers`n" -ForegroundColor White
    } else {
        Write-Host "`n⚠️  No changes made to .env file" -ForegroundColor Yellow
        Write-Host "Please manually edit .env file with your credentials.`n" -ForegroundColor White
    }
}

Write-Host "`n" + "═" * 60 -ForegroundColor Cyan
Write-Host "  Useful Commands                                            " -ForegroundColor Cyan
Write-Host "═" * 60 + "`n" -ForegroundColor Cyan

Write-Host "npm run test:azure:10workers  " -NoNewline -ForegroundColor White
Write-Host "# Run tests with 10 workers" -ForegroundColor Gray
Write-Host "npm run test:azure:50workers  " -NoNewline -ForegroundColor White
Write-Host "# Run tests with 50 workers (max)" -ForegroundColor Gray
Write-Host "npm run test:azure:smoke      " -NoNewline -ForegroundColor White
Write-Host "# Run smoke tests only" -ForegroundColor Gray
Write-Host "npm run test:azure:critical   " -NoNewline -ForegroundColor White
Write-Host "# Run critical tests only`n" -ForegroundColor Gray

Write-Host "📚 For more help, see:" -ForegroundColor Cyan
Write-Host "   - QUICK_START_AZURE.md" -ForegroundColor White
Write-Host "   - AZURE_SETUP_GUIDE.md`n" -ForegroundColor White

