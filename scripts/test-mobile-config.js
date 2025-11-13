#!/usr/bin/env node
/**
 * Quick script to verify mobile configuration is working
 */

console.log('\n📱 Testing Mobile Configuration...\n');

// Test 1: Check if MOBILE_DEVICE is set
if (process.env.MOBILE_DEVICE) {
  console.log(`✅ MOBILE_DEVICE: ${process.env.MOBILE_DEVICE}`);
} else {
  console.log('❌ MOBILE_DEVICE: Not set');
}

// Test 2: Check viewport dimensions
if (process.env.VIEWPORT_WIDTH) {
  console.log(`✅ VIEWPORT_WIDTH: ${process.env.VIEWPORT_WIDTH}px`);
}
if (process.env.VIEWPORT_HEIGHT) {
  console.log(`✅ VIEWPORT_HEIGHT: ${process.env.VIEWPORT_HEIGHT}px`);
}

console.log('\n💡 To test mobile configuration:');
console.log('   npm run test:mobile:iphone');
console.log('   npm run test:mobile:custom\n');
