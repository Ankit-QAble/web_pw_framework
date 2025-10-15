# Simple Azure Setup Checker

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host " Azure Playwright Testing - Setup Checker" -ForegroundColor Cyan
Write-Host "==========================================================="-ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item "env.azure.example" ".env"
    Write-Host "Created .env file from template" -ForegroundColor Green
    Write-Host ""
}

# Read .env file
$envContent = Get-Content ".env" | Where-Object { $_ -notmatch "^#" -and $_ -match "\S" }
$serviceUrl = ""
$accessToken = ""

foreach ($line in $envContent) {
    if ($line -match "^PLAYWRIGHT_SERVICE_URL=(.+)") {
        $serviceUrl = $matches[1].Trim()
    }
    if ($line -match "^PLAYWRIGHT_SERVICE_ACCESS_TOKEN=(.+)") {
        $accessToken = $matches[1].Trim()
    }
}

Write-Host "Current Configuration:" -ForegroundColor Yellow
Write-Host ""

# Check Service URL
Write-Host "[1] Service URL: " -NoNewline -ForegroundColor White
if ($serviceUrl -and $serviceUrl -ne "https://eastus.api.playwright.microsoft.com") {
    Write-Host "CONFIGURED" -ForegroundColor Green
    Write-Host "    $serviceUrl" -ForegroundColor Gray
    $urlOk = $true
} else {
    Write-Host "NOT CONFIGURED" -ForegroundColor Red
    Write-Host "    Current: $serviceUrl" -ForegroundColor Gray
    $urlOk = $false
}

# Check Access Token
Write-Host "[2] Access Token: " -NoNewline -ForegroundColor White
if ($accessToken -and $accessToken -ne "your-access-token-here" -and $accessToken.Length -gt 30) {
    Write-Host "CONFIGURED" -ForegroundColor Green
    $tokenStart = $accessToken.Substring(0, [Math]::Min(20, $accessToken.Length))
    Write-Host "    $tokenStart..." -ForegroundColor Gray
    $tokenOk = $true
} else {
    Write-Host "NOT CONFIGURED" -ForegroundColor Red
    Write-Host "    Current: $accessToken" -ForegroundColor Gray
    $tokenOk = $false
}

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Cyan

if ($urlOk -and $tokenOk) {
    Write-Host ""
    Write-Host "SUCCESS! Your Azure configuration is complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run tests on Azure with:" -ForegroundColor Cyan
    Write-Host "  npm run test:azure:10workers" -ForegroundColor White
    Write-Host "  npm run test:azure:50workers" -ForegroundColor White
    Write-Host "  npm run test:azure:smoke" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ACTION REQUIRED: Please update your .env file" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You need to:" -ForegroundColor White
    Write-Host ""
    
    if (-not $urlOk) {
        Write-Host "  1. Get Service URL from Azure Portal:" -ForegroundColor Yellow
        Write-Host "     - Go to: https://portal.azure.com" -ForegroundColor Gray
        Write-Host "     - Search for 'Playwright Testing'" -ForegroundColor Gray
        Write-Host "     - Click your workspace" -ForegroundColor Gray
        Write-Host "     - Copy the Service Endpoint from Overview" -ForegroundColor Gray
        Write-Host ""
    }
    
    if (-not $tokenOk) {
        Write-Host "  2. Get Access Token from Azure Portal:" -ForegroundColor Yellow
        Write-Host "     - In your workspace, go to Settings > Access tokens" -ForegroundColor Gray
        Write-Host "     - Click 'Generate token'" -ForegroundColor Gray
        Write-Host "     - Copy the token immediately (you won't see it again!)" -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "  3. Update .env file with your values" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Need help creating a workspace?" -ForegroundColor Cyan
    Write-Host "  Visit: https://portal.azure.com/#create/Microsoft.Playwright" -ForegroundColor Gray
    Write-Host ""
    Write-Host "For detailed instructions, see:" -ForegroundColor Cyan
    Write-Host "  - QUICK_START_AZURE.md" -ForegroundColor Gray
    Write-Host "  - AZURE_SETUP_GUIDE.md" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "===========================================================" -ForegroundColor Cyan
Write-Host ""

