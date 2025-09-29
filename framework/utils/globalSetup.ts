import { FullConfig } from '@playwright/test';
import { emailService } from './EmailService';

async function globalSetup(config: FullConfig) {
  console.log('Setting up email reporting...');
  
  // Access profile configuration from global
  const selectedProfile = (global as any).selectedProfile;
  
  if (selectedProfile?.reportEmail?.email && selectedProfile?.reportSmtp?.smtp) {
    try {
      await emailService.sendNotification(
        selectedProfile.reportEmail,
        selectedProfile.reportSmtp,
        'Test execution started'
      );
      console.log('Test start notification sent');
    } catch (error) {
      console.error('Failed to send test start notification:', error);
    }
  }
}

export default globalSetup;
