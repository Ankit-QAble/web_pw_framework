#!/usr/bin/env node

/**
 * Firefox Launch Diagnostic Script
 * Tests Firefox browser launch in Jenkins CI environment
 */

const { firefox, chromium } = require('playwright');

async function testFirefoxLaunch() {
  console.log('🔍 Testing Firefox launch in CI environment...');
  console.log(`📍 Environment: ${process.env.CI ? 'CI' : 'Local'}`);
  console.log(`📍 Node version: ${process.version}`);
  console.log(`📍 Platform: ${process.platform}`);
  
  // Test 1: Try Firefox launch
  console.log('\n1️⃣ Testing Firefox launch...');
  let firefoxBrowser = null;
  try {
    firefoxBrowser = await firefox.launch({
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
      timeout: 120000,
      slowMo: 200
    });
    
    console.log('✅ Firefox launched successfully');
    
    // Test 2: Create context
    console.log('\n2️⃣ Testing Firefox context creation...');
    const context = await firefoxBrowser.newContext({
      viewport: { width: 1280, height: 720 },
      timeout: 120000
    });
    console.log('✅ Firefox context created successfully');
    
    // Test 3: Create page
    console.log('\n3️⃣ Testing Firefox page creation...');
    const page = await context.newPage();
    console.log('✅ Firefox page created successfully');
    
    // Test 4: Navigate to a simple page
    console.log('\n4️⃣ Testing Firefox navigation...');
    await page.goto('about:blank');
    console.log('✅ Firefox navigation successful');
    
    // Cleanup
    await firefoxBrowser.close();
    console.log('✅ Firefox browser closed successfully');
    
  } catch (error) {
    console.log(`❌ Firefox launch failed: ${error.message}`);
    
    if (firefoxBrowser) {
      try {
        await firefoxBrowser.close();
      } catch (closeError) {
        console.log(`⚠️ Firefox close error: ${closeError.message}`);
      }
    }
    
    // Test 5: Try Chromium as fallback
    console.log('\n5️⃣ Testing Chromium fallback...');
    try {
      const chromiumBrowser = await chromium.launch({
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
        ],
        timeout: 60000,
        slowMo: 100
      });
      
      console.log('✅ Chromium launched successfully as fallback');
      
      const context = await chromiumBrowser.newContext({
        viewport: { width: 1280, height: 720 }
      });
      console.log('✅ Chromium context created successfully');
      
      const page = await context.newPage();
      console.log('✅ Chromium page created successfully');
      
      await page.goto('about:blank');
      console.log('✅ Chromium navigation successful');
      
      await chromiumBrowser.close();
      console.log('✅ Chromium browser closed successfully');
      
      console.log('\n🎯 RECOMMENDATION: Use Chromium fallback for Firefox in CI');
      
    } catch (chromiumError) {
      console.log(`❌ Chromium fallback also failed: ${chromiumError.message}`);
      console.log('\n🚨 CRITICAL: Both Firefox and Chromium failed to launch');
    }
  }
}

// Run the diagnostic
testFirefoxLaunch().catch(console.error);
