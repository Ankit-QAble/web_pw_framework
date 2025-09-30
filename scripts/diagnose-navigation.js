#!/usr/bin/env node

/**
 * Navigation Diagnostic Script for Jenkins
 * Helps diagnose navigation timeout issues in CI environments
 */

const { chromium } = require('playwright');

async function diagnoseNavigation() {
  console.log('🔍 Starting navigation diagnostic...');
  
  const url = process.env.BASE_URL || 'http://devwebpanel.sadadqa.com:3004';
  console.log(`📍 Target URL: ${url}`);
  
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
      '--disable-features=VizDisplayCompositor'
    ]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    console.log('🚀 Attempting navigation...');
    const startTime = Date.now();
    
    // Test different navigation strategies
    console.log('📋 Testing navigation strategies:');
    
    // Strategy 1: Basic navigation with domcontentloaded
    try {
      console.log('1️⃣ Testing domcontentloaded strategy...');
      await page.goto(url, { 
        waitUntil: 'domcontentloaded',
        timeout: 60000 
      });
      const domTime = Date.now() - startTime;
      console.log(`✅ DOM content loaded in ${domTime}ms`);
      
      const title = await page.title();
      console.log(`📄 Page title: ${title}`);
      
    } catch (error) {
      console.log(`❌ DOM content strategy failed: ${error.message}`);
    }

    // Strategy 2: Network idle with extended timeout
    try {
      console.log('2️⃣ Testing network idle strategy...');
      await page.waitForLoadState('networkidle', { timeout: 60000 });
      const networkTime = Date.now() - startTime;
      console.log(`✅ Network idle achieved in ${networkTime}ms`);
    } catch (error) {
      console.log(`⚠️ Network idle timeout (expected): ${error.message}`);
      
      // Check if page is still functional
      try {
        const title = await page.title();
        const currentUrl = page.url();
        console.log(`🔍 Page still functional - Title: ${title}, URL: ${currentUrl}`);
      } catch (titleError) {
        console.log(`❌ Page not functional: ${titleError.message}`);
      }
    }

    // Strategy 3: Check for specific elements
    try {
      console.log('3️⃣ Testing element presence...');
      const elements = [
        'input[type="text"]',
        'input[type="password"]',
        'button',
        'form'
      ];
      
      for (const selector of elements) {
        const count = await page.locator(selector).count();
        console.log(`🔍 Found ${count} elements matching: ${selector}`);
      }
    } catch (error) {
      console.log(`❌ Element check failed: ${error.message}`);
    }

    // Strategy 4: Check network requests
    try {
      console.log('4️⃣ Checking network activity...');
      const responses = [];
      page.on('response', response => {
        responses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      });

      // Wait a bit to collect responses
      await page.waitForTimeout(5000);
      
      console.log(`📊 Collected ${responses.length} network responses:`);
      responses.slice(0, 5).forEach((response, index) => {
        console.log(`  ${index + 1}. ${response.status} ${response.statusText} - ${response.url}`);
      });
      
    } catch (error) {
      console.log(`❌ Network check failed: ${error.message}`);
    }

    // Take a screenshot for visual verification
    try {
      console.log('5️⃣ Taking diagnostic screenshot...');
      const screenshot = await page.screenshot({ fullPage: true });
      const fs = require('fs');
      const path = require('path');
      const screenshotPath = path.join(process.cwd(), 'diagnostic-screenshot.png');
      fs.writeFileSync(screenshotPath, screenshot);
      console.log(`📸 Screenshot saved: ${screenshotPath}`);
    } catch (error) {
      console.log(`❌ Screenshot failed: ${error.message}`);
    }

  } catch (error) {
    console.error('💥 Diagnostic failed:', error);
  } finally {
    await browser.close();
    console.log('🏁 Diagnostic completed');
  }
}

// Run the diagnostic
diagnoseNavigation().catch(console.error);
