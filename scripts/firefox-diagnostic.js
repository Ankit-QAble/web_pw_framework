#!/usr/bin/env node

/**
 * Firefox-specific Diagnostic Script
 * Helps diagnose Firefox issues in Jenkins CI environment
 */

const { firefox } = require('playwright');

async function firefoxDiagnostic() {
  console.log('🔍 Starting Firefox diagnostic...');
  console.log(`📍 Environment: ${process.env.CI ? 'CI' : 'Local'}`);
  console.log(`📍 Node version: ${process.version}`);
  console.log(`📍 Platform: ${process.platform}`);
  
  const url = process.env.BASE_URL || 'http://devwebpanel.sadadqa.com:3004';
  console.log(`📍 Target URL: ${url}`);
  
  // Firefox-optimized browser launch options
  const browser = await firefox.launch({
    headless: true,
    args: [
      '-headless',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=TranslateUI',
      '--disable-ipc-flooding-protection',
      '--memory-pressure-off',
      '--max_old_space_size=4096',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-images',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-default-browser-check',
      '--disable-logging',
      '--disable-permissions-api',
      '--disable-presentation-api',
      '--disable-print-preview',
      '--disable-speech-api',
      '--disable-file-system',
      '--disable-client-side-phishing-detection',
      '--disable-component-update',
      '--disable-domain-reliability',
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-hang-monitor',
      '--disable-prompt-on-repost',
      '--disable-background-networking',
      '--disable-sync-preferences'
    ],
    timeout: 60000,
    slowMo: 100
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    timeout: 120000
  });

  const page = await context.newPage();

  try {
    console.log('🚀 Starting Firefox navigation test...');
    const startTime = Date.now();
    
    // Test 1: Basic navigation
    console.log('1️⃣ Testing basic navigation...');
    try {
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 120000 
      });
      const navTime = Date.now() - startTime;
      console.log(`✅ Navigation completed in ${navTime}ms`);
      
      // Check if page is still open
      if (page.isClosed()) {
        console.log('❌ Page was closed after navigation');
        return;
      }
      
      const title = await page.title();
      console.log(`📄 Page title: ${title}`);
      
    } catch (error) {
      console.log(`❌ Navigation failed: ${error.message}`);
      return;
    }

    // Test 2: Network idle with extended timeout
    console.log('2️⃣ Testing network idle...');
    try {
      await page.waitForLoadState('networkidle', { timeout: 60000 });
      const networkTime = Date.now() - startTime;
      console.log(`✅ Network idle achieved in ${networkTime}ms`);
    } catch (error) {
      console.log(`⚠️ Network idle timeout: ${error.message}`);
      
      // Check if page is still functional
      if (page.isClosed()) {
        console.log('❌ Page was closed during network idle wait');
        return;
      }
      
      try {
        const title = await page.title();
        const currentUrl = page.url();
        console.log(`🔍 Page still functional - Title: ${title}, URL: ${currentUrl}`);
      } catch (titleError) {
        console.log(`❌ Page not functional: ${titleError.message}`);
        return;
      }
    }

    // Test 3: Check for login elements
    console.log('3️⃣ Testing login element detection...');
    try {
      const loginSelectors = [
        '//h2[normalize-space()=\'Login in to SADAD\']',
        'h2',
        '[class*="title"]',
        '[class*="heading"]',
        'h1',
        'input[placeholder*="Number"]',
        'input[placeholder*="Password"]',
        'button[type="submit"]'
      ];
      
      for (const selector of loginSelectors) {
        if (page.isClosed()) {
          console.log(`❌ Page was closed during element check`);
          return;
        }
        
        try {
          const count = await page.locator(selector).count();
          if (count > 0) {
            const text = await page.locator(selector).first().textContent();
            console.log(`✅ Found element: ${selector} (${count} instances) - Text: ${text}`);
          } else {
            console.log(`❌ Element not found: ${selector}`);
          }
        } catch (elementError) {
          console.log(`⚠️ Error checking element ${selector}: ${elementError.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ Element check failed: ${error.message}`);
    }

    // Test 4: Check page content
    console.log('4️⃣ Testing page content...');
    try {
      if (page.isClosed()) {
        console.log(`❌ Page was closed before content check`);
        return;
      }
      
      const currentUrl = page.url();
      const pageTitle = await page.title();
      const bodyText = await page.locator('body').textContent();
      
      console.log(`📄 Current URL: ${currentUrl}`);
      console.log(`📄 Page title: ${pageTitle}`);
      console.log(`📄 Body text length: ${bodyText?.length || 0} characters`);
      
      // Check for specific text patterns
      const textPatterns = ['login', 'sadad', 'password', 'mobile', 'number'];
      for (const pattern of textPatterns) {
        const found = bodyText?.toLowerCase().includes(pattern.toLowerCase());
        console.log(`🔍 Contains "${pattern}": ${found ? '✅' : '❌'}`);
      }
      
    } catch (error) {
      console.log(`❌ Content check failed: ${error.message}`);
    }

    // Test 5: Take screenshot
    console.log('5️⃣ Testing screenshot capability...');
    try {
      if (page.isClosed()) {
        console.log(`❌ Page was closed before screenshot`);
        return;
      }
      
      const screenshot = await page.screenshot({ fullPage: true });
      const fs = require('fs');
      const path = require('path');
      const screenshotPath = path.join(process.cwd(), 'firefox-diagnostic-screenshot.png');
      fs.writeFileSync(screenshotPath, screenshot);
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      console.log(`❌ Screenshot failed: ${error.message}`);
    }

  } catch (error) {
    console.error('💥 Firefox diagnostic failed:', error);
  } finally {
    try {
      await browser.close();
      console.log('🏁 Firefox diagnostic completed');
    } catch (closeError) {
      console.log(`⚠️ Browser close warning: ${closeError.message}`);
    }
  }
}

// Run the diagnostic
firefoxDiagnostic().catch(console.error);
