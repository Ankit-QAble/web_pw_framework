import { FullConfig } from '@playwright/test';
import { emailService } from './EmailService';

async function globalTeardown(config: FullConfig) {
  console.log('Sending test report email with Playwright report...');
  
  // Access profile configuration from global
  const selectedProfile = (global as any).selectedProfile;
  console.log('Selected profile:', selectedProfile ? 'found' : 'not found');
  
  if (selectedProfile?.reportEmail?.email && selectedProfile?.reportSmtp?.smtp) {
    console.log('Email configuration found, preparing Playwright report...');
    
    console.log('Attempting to send email with Playwright test report...');
    try {
      await emailService.sendTestReport(
        selectedProfile.reportEmail,
        selectedProfile.reportSmtp
      );
      console.log('Test report email sent successfully');
    } catch (error) {
      console.error('Failed to send test report email:', error);
    }
  } else {
    console.log('Email or SMTP configuration is disabled or missing:');
    console.log('- Email enabled:', selectedProfile?.reportEmail?.email);
    console.log('- SMTP enabled:', selectedProfile?.reportSmtp?.smtp);
    console.log('- Email config exists:', !!selectedProfile?.reportEmail);
    console.log('- SMTP config exists:', !!selectedProfile?.reportSmtp);
  }
}

export default globalTeardown;
