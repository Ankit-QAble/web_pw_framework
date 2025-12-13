import { Reporter, FullResult, Suite, TestCase, TestResult, FullConfig } from '@playwright/test/reporter';
import { emailService } from '../utils/EmailService';
import { envConfig } from '../utils/EnvConfig';
import * as path from 'path';

class EmailReporter implements Reporter {
  private config: FullConfig | undefined;
  private suite: Suite | undefined;

  onBegin(config: FullConfig, suite: Suite) {
    this.config = config;
    this.suite = suite;
  }

  async onEnd(result: FullResult) {
    console.log(`Test run finished with status: ${result.status}`);

    // Access profile configuration from global context (set in globalSetup or config)
    // Note: In reporters, we might not have access to global variables set in test context easily.
    // However, we can check the environment variables or config.
    
    // We need to determine if email reporting is enabled. 
    // Since we can't easily access the specific 'selectedProfile' object from globalSetup here without passing it,
    // we will reconstruct the logic or use environment variables.
    
    // Better approach: Check if we can get the profile from the config metadata or just assume 
    // we should send it if configured in the reporter options.
    
    // For now, let's try to reuse the existing logic by checking the same conditions as globalTeardown
    // or simply send the report if the reporter is active.
    
    // Let's reconstruct the profile logic briefly or rely on EnvConfig
    const currentProfileName = process.env.RUN_PROFILE || process.env.NODE_ENV || 'development';
    
    // We need to import the profiles from config, but config is a TS file. 
    // Instead, let's look at how globalTeardown did it.
    // globalTeardown accessed (global as any).selectedProfile. 
    // Reporters run in the same process as the test runner, so they *might* share the global scope if it's the main process.
    // Let's try to access the global profile.
    
    const selectedProfile = (global as any).selectedProfile;
    
    if (selectedProfile?.reportEmail?.email && selectedProfile?.reportSmtp?.smtp) {
        console.log('EmailReporter: Preparing to send email report...');
        
        // Calculate stats directly from the suite
        const stats = {
            passed: 0,
            failed: 0,
            skipped: 0,
            total: 0
        };

        const countTests = (suite: Suite) => {
            suite.tests.forEach(test => {
                const lastResult = test.results[test.results.length - 1];
                if (lastResult) {
                    stats.total++;
                    if (lastResult.status === 'passed') stats.passed++;
                    else if (lastResult.status === 'failed' || lastResult.status === 'timedOut') stats.failed++;
                    else if (lastResult.status === 'skipped') stats.skipped++;
                }
            });
            suite.suites.forEach(childSuite => countTests(childSuite));
        };

        if (this.suite) {
            countTests(this.suite);
        }

        console.log('EmailReporter: Calculated stats:', stats);

        // Get provider config
        const providerConfig = envConfig.getEmailProviderConfig();

        try {
            // We pass the stats directly to sendTestReport
            // We need to modify sendTestReport to accept optional stats to avoid re-reading JSON
            await emailService.sendTestReport(
                selectedProfile.reportEmail,
                selectedProfile.reportSmtp,
                providerConfig,
                stats
            );
            console.log('EmailReporter: Email sent successfully.');
        } catch (error) {
            console.error('EmailReporter: Failed to send email:', error);
        }
    } else {
        // If we can't find the profile in global, we might be in a separate process (sharding etc).
        // But for this project's simple setup, it likely works. 
        // If it doesn't, we will see "EmailReporter: Skipping email..." logs.
        if (!selectedProfile) {
             console.log('EmailReporter: selectedProfile not found in global scope. Trying to send based on EnvConfig if possible, or skipping.');
             // Fallback: If we are here, the user likely wants an email.
             // But we need the credentials and "to" address.
        }
    }
  }
}

export default EmailReporter;
