# 🚀 Quick Start: Run Tests on Azure in 5 Minutes

## ✅ What You Need to Get:

### 1️⃣ Azure Playwright Service URL
- Go to: https://portal.azure.com/
- Search for "Playwright Testing"
- If you DON'T have a workspace: Click "Create" and follow the wizard
- If you DO have a workspace: Click on it and copy the URL from Overview
- **Format:** `https://<region>.api.playwright.microsoft.com/accounts/<workspace-id>`

### 2️⃣ Access Token
- In your workspace, go to: **Settings** → **Access tokens**
- Click **"Generate token"**
- Copy it immediately (you won't see it again!)

---

## 📝 Update Your .env File

Open `.env` file and replace these 3 lines:

```env
# REPLACE THIS:
PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com

# WITH YOUR ACTUAL URL FROM AZURE:
PLAYWRIGHT_SERVICE_URL=https://<your-region>.api.playwright.microsoft.com/accounts/<your-workspace-id>

# REPLACE THIS:
PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-access-token-here

# WITH YOUR ACTUAL TOKEN:
PLAYWRIGHT_SERVICE_ACCESS_TOKEN=eyJhbGc... (your actual token)

# OPTIONAL - Update your app URL:
BASE_URL=https://your-actual-app-url.com
```

---

## 🎯 Test It!

After updating `.env`, run:

```bash
npm run test:azure:10workers
```

**You should see:**
- ✅ "Connecting to Azure Playwright Service..."
- ✅ Tests running on cloud browsers
- ✅ High parallelization (10 workers)

---

## 🆘 Don't have an Azure workspace yet?

### Option A: Create via Azure Portal (Recommended)
1. Visit: https://portal.azure.com/
2. Click "Create a resource"
3. Search "Playwright Testing"
4. Click "Create" and fill in:
   - **Resource Group:** Create new (e.g., `playwright-rg`)
   - **Name:** `my-playwright-workspace`
   - **Region:** Choose closest to you (e.g., East US, West Europe)
5. Click "Review + Create" → "Create"
6. Wait 2 minutes for deployment

### Option B: Use Azure CLI (Advanced)
```bash
# Install Azure CLI first: https://aka.ms/installazurecli
az login
az playwright create --name my-playwright-workspace --resource-group playwright-rg --location eastus
```

---

## 💡 Quick Links

- **Azure Portal:** https://portal.azure.com/
- **Create Playwright Workspace:** https://portal.azure.com/#create/Microsoft.Playwright
- **Azure Playwright Docs:** https://learn.microsoft.com/en-us/azure/playwright-testing/
- **Full Setup Guide:** See `AZURE_SETUP_GUIDE.md` in this folder

---

## ⏱️ Time Estimate

- **If you have workspace:** 2 minutes (just get URL + token)
- **If you need to create workspace:** 10 minutes (includes Azure setup)

---

**Ready?** Let's get started! 🚀

