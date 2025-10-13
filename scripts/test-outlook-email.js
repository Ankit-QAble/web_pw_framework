#!/usr/bin/env node

/**
 * Test script for Outlook email functionality
 * This script tests the email service with Outlook/Office 365 configuration
 */

const { emailService } = require('../framework/utils/EmailService');
const { envConfig } = require('../framework/utils/EnvConfig');

async function testOutlookEmail() {
  console.log('🧪 Testing Outlook Email Functionality');
  console.log('=====================================');

  try {
    // Set Outlook as email provider
    process.env.EMAIL_PROVIDER = 'outlook';
    
    // Get provider configuration
    const providerConfig = envConfig.getEmailProviderConfig();
    console.log('📧 Email Provider:', providerConfig.provider);
    console.log('🌐 SMTP Host:', providerConfig.host);
    console.log('🔌 Port:', providerConfig.port);
    console.log('🔒 Secure:', providerConfig.secure);
    console.log('🔑 Requires App Password:', providerConfig.requiresAppPassword);

    // Get SMTP configuration
    const smtpConfig = envConfig.getSmtpConfig();
    console.log('\n📋 SMTP Configuration:');
    console.log('- Host:', smtpConfig.host);
    console.log('- Port:', smtpConfig.port);
    console.log('- User:', smtpConfig.auth.user);
    console.log('- Password:', smtpConfig.auth.pass ? '***configured***' : 'NOT SET');

    // Test email configuration
    const emailConfig = {
      email: true,
      to: ['test@example.com'], // Replace with actual test email
      subject: 'Outlook Email Test - Framework',
      body: 'This is a test email to verify Outlook integration with the Playwright framework.'
    };

    console.log('\n📤 Test Email Configuration:');
    console.log('- To:', emailConfig.to.join(', '));
    console.log('- Subject:', emailConfig.subject);

    // Check if credentials are configured
    if (!smtpConfig.auth.user || smtpConfig.auth.user === 'your-email@outlook.com') {
      console.log('\n⚠️  WARNING: Outlook email credentials not configured!');
      console.log('Please set the following environment variables:');
      console.log('  export SMTP_USER=your-email@outlook.com');
      console.log('  export SMTP_PASS=your-password');
      console.log('\nOr update the .env file with your Outlook credentials.');
      return;
    }

    if (!smtpConfig.auth.pass || smtpConfig.auth.pass === 'your-password') {
      console.log('\n⚠️  WARNING: Outlook email password not configured!');
      console.log('Please set the SMTP_PASS environment variable with your Outlook password.');
      return;
    }

    console.log('\n🚀 Attempting to send test email...');
    
    // Initialize transporter
    await emailService.initializeTransporter(smtpConfig, providerConfig);
    console.log('✅ SMTP transporter initialized successfully');

    // Send test notification
    await emailService.sendNotification(emailConfig, smtpConfig, 'Outlook email test successful!', providerConfig);
    console.log('✅ Test email sent successfully!');

    console.log('\n🎉 Outlook email functionality test completed successfully!');
    console.log('Check your inbox for the test email.');

  } catch (error) {
    console.error('\n❌ Outlook email test failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Verify your Outlook email and password');
      console.log('2. Try using an app password instead of your regular password');
      console.log('3. Ensure 2-factor authentication is enabled if using app password');
    } else if (error.message.includes('Connection timeout')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check if your organization blocks SMTP connections');
      console.log('2. Try using port 25 or 2525 as alternatives');
      console.log('3. Verify firewall settings');
    }
  }
}

// Run the test
if (require.main === module) {
  testOutlookEmail().catch(console.error);
}

module.exports = { testOutlookEmail };
