# Azure Playwright Testing - Complete Setup Guide

This guide will help you set up and run your Playwright tests on Azure Playwright Testing service.

---

## 📋 Prerequisites

- Azure subscription (free tier available)
- Playwright tests in your project (✅ You have this)
- Internet connection

---

## 🚀 Step-by-Step Setup

### Step 1: Create Azure Playwright Testing Workspace

1. **Go to Azure Portal:**
   - Visit: https://portal.azure.com/
   - Sign in with your Microsoft account

2. **Create a new Playwright Testing workspace:**
   - Click **"Create a resource"**
   - Search for **"Playwright Testing"**
   - Click **"Create"**

3. **Configure the workspace:**
   - **Subscription:** Select your Azure subscription
   - **Resource Group:** Create new or select existing (e.g., `playwright-testing-rg`)
   - **Name:** Give it a unique name (e.g., `my-playwright-workspace`)
   - **Region:** Choose the closest region to you:
     - East US (`eastus`)
     - West US 2 (`westus2`)
     - West Europe (`westeurope`)
     - UK South (`uksouth`)
     - Australia East (`australiaeast`)
   - Click **"Review + Create"**
   - Click **"Create"**

4. **Wait for deployment to complete** (usually takes 1-2 minutes)

---

### Step 2: Get Your Service URL

1. Go to your newly created Playwright Testing workspace
2. In the **Overview** section, you'll see:
   - **Service endpoint** or **Workspace URL**
   - Format: `https://<region>.api.playwright.microsoft.com/accounts/<workspace-id>`
   - Example: `https://eastus.api.playwright.microsoft.com/accounts/abc123def456`

3. **Copy this URL** - you'll need it for the .env file

---

### Step 3: Generate Access Token

1. In your Playwright Testing workspace, navigate to:
   - **Settings** → **Access tokens** (or **Authentication**)

2. Click **"Generate token"** or **"New access token"**

3. **Configure the token:**
   - **Name:** Give it a descriptive name (e.g., `local-dev-token`)
   - **Expiration:** Choose duration (30 days, 90 days, or custom)
   - Click **"Generate"**

4. **Copy the token immediately** and save it securely
   - ⚠️ **Important:** You won't be able to see it again!
   - If you lose it, you'll need to generate a new one

---

### Step 4: Configure Your .env File

1. **Open the `.env` file** in your project root (already created for you)

2. **Update with your Azure credentials:**

```env
# Azure Playwright Testing Service URL
# Replace with YOUR actual service URL from Azure Portal
PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com/accounts/your-workspace-id

# Azure Playwright Testing Access Token
# Replace with YOUR actual access token
PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-actual-access-token-here

# Environment
NODE_ENV=staging

# Base URL for your application
BASE_URL=https://your-app-url.com
```

3. **Save the file**

---

### Step 5: Verify the Setup

Run this command to test your Azure connection:

```bash
npm run test:azure:10workers
```

**Expected output:**
- ✅ Connection to Azure successful
- ✅ Tests running on cloud-hosted browsers
- ✅ Results reported back to your terminal

**If you see "Grid Mode: DISABLED":**
- Check that `PLAYWRIGHT_SERVICE_URL` is correctly set in `.env`
- Verify the URL format is correct
- Make sure there are no extra spaces or quotes

---

## 🎯 Available Azure Commands

Once configured, you can use these commands:

```bash
# Run all tests with 10 workers
npm run test:azure:10workers

# Run all tests with 20 workers (default)
npm run test:azure

# Run all tests with 50 workers (maximum parallelization)
npm run test:azure:50workers

# Run smoke tests only
npm run test:azure:smoke

# Run critical tests only
npm run test:azure:critical

# Run specific browser
npm run test:azure:chromium
npm run test:azure:firefox
npm run test:azure:webkit
```

---

## 📊 Benefits of Azure Playwright Testing

✅ **High Parallelization:** Run up to 50 tests in parallel
✅ **Cloud Browsers:** No need to install browsers locally
✅ **Fast Execution:** Microsoft's cloud infrastructure
✅ **Cross-Platform:** Test on Windows, Linux, macOS
✅ **Cost-Effective:** Pay per minute of test execution
✅ **Integrated Reporting:** Built-in test results and artifacts

---

## 🔧 Troubleshooting

### Issue: "PLAYWRIGHT_SERVICE_URL not set"
**Solution:** Make sure `.env` file exists and contains the correct URL

### Issue: "Authentication failed"
**Solution:** Regenerate your access token and update `.env`

### Issue: "Connection timeout"
**Solution:** Check your internet connection and Azure service status

### Issue: Tests still running locally
**Solution:** Verify the `.env` file is in the project root and contains valid credentials

---

## 📝 Important Notes

1. **Security:** Never commit `.env` file to Git (it's already in `.gitignore`)
2. **Token Rotation:** Regenerate tokens periodically for security
3. **Costs:** Monitor your Azure usage to avoid unexpected charges
4. **Regions:** Use the region closest to your location for best performance

---

## 🆘 Need Help?

- Azure Playwright Documentation: https://learn.microsoft.com/en-us/azure/playwright-testing/
- Azure Portal: https://portal.azure.com/
- Playwright Documentation: https://playwright.dev/

---

**Ready to start?** Follow the steps above, and you'll be running tests on Azure in minutes! 🚀

