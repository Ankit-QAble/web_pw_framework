#!/usr/bin/env node

/**
 * Jenkins-specific Diagnostic Script
 * Helps diagnose page closure and resource issues in Jenkins CI environment
 */

const { chromium } = require('playwright');

async function jenkinsDiagnostic() {
  console.log('🔍 Starting Jenkins diagnostic...');
  console.log(`📍 Environment: ${process.env.CI ? 'CI' : 'Local'}`);
  console.log(`📍 Node version: ${process.version}`);
  console.log(`📍 Platform: ${process.platform}`);
  
  const url = process.env.BASE_URL || 'http://devwebpanel.sadadqa.com:3004';
  console.log(`📍 Target URL: ${url}`);
  
  // Jenkins-optimized browser launch options
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
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
    // Add timeout for context operations
    timeout: 120000
  });

  const page = await context.newPage();

  try {
    console.log('🚀 Starting navigation test...');
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

    // Test 3: Extended wait to check for page closure
    console.log('3️⃣ Testing extended wait for page stability...');
    try {
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(5000);
        
        if (page.isClosed()) {
          console.log(`❌ Page was closed during extended wait (iteration ${i + 1})`);
          return;
        }
        
        try {
          const title = await page.title();
          console.log(`✅ Page still functional after ${(i + 1) * 5}s - Title: ${title}`);
        } catch (titleError) {
          console.log(`❌ Page became inaccessible after ${(i + 1) * 5}s: ${titleError.message}`);
          return;
        }
      }
      console.log('✅ Page remained stable for 50 seconds');
    } catch (error) {
      console.log(`❌ Extended wait failed: ${error.message}`);
    }

    // Test 4: Check for specific elements
    console.log('4️⃣ Testing element presence...');
    try {
      const elements = [
        'input[type="text"]',
        'input[type="password"]',
        'button',
        'form'
      ];
      
      for (const selector of elements) {
        if (page.isClosed()) {
          console.log(`❌ Page was closed during element check`);
          return;
        }
        
        const count = await page.locator(selector).count();
        console.log(`🔍 Found ${count} elements matching: ${selector}`);
      }
    } catch (error) {
      console.log(`❌ Element check failed: ${error.message}`);
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
      const screenshotPath = path.join(process.cwd(), 'jenkins-diagnostic-screenshot.png');
      fs.writeFileSync(screenshotPath, screenshot);
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      console.log(`❌ Screenshot failed: ${error.message}`);
    }

  } catch (error) {
    console.error('💥 Diagnostic failed:', error);
  } finally {
    try {
      await browser.close();
      console.log('🏁 Diagnostic completed');
    } catch (closeError) {
      console.log(`⚠️ Browser close warning: ${closeError.message}`);
    }
  }
}

// Run the diagnostic
jenkinsDiagnostic().catch(console.error);
