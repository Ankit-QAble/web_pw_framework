# Email Reporting Integration

This framework includes email reporting functionality that automatically sends test results and Allure reports via email.

## Features

- **Automatic Email Reports**: Sends test execution results with Playwright HTML report attachments
- **SMTP Configuration**: Supports various SMTP providers (Gmail, Outlook, custom servers)
- **Environment-specific Settings**: Different email configurations for development, preprod, and production
- **Test Screenshots**: Automatically attaches failed test screenshots
- **HTML Email Body**: Rich HTML formatted emails with test details

## Configuration

### 1. Update Email Settings in `playwright.config.ts`

```typescript
const PROFILES = {
  development: {
    // ... other settings
    reportEmail: {
      email: true, // Enable/disable email reporting
      to: ['your-email@company.com'],
      subject: 'Automation Test Report',
      body: 'Test execution completed for development environment',
    },
    reportSmtp: {
      smtp: true, // Enable/disable SMTP
      host: 'smtp.gmail.com', // SMTP server host
      port: 587, // SMTP port (587 for TLS, 465 for SSL)
      auth: {
        user: 'your-email@gmail.com', // Your email
        pass: 'your-app-password', // App-specific password
      },
    }
  },
  preprod: {
    // ... other settings
    reportEmail: {
      email: true,
      to: ['team-lead@company.com', 'qa-team@company.com'],
      subject: 'Preprod Test Report - Allure Results',
      body: 'Test execution completed for preprod environment. Allure report attached.',
    },
    reportSmtp: {
      smtp: true,
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password',
      },
    }
  }
}
```

### 2. SMTP Provider Setup

#### Gmail Setup
1. Enable 2-factor authentication on your Google account
2. Generate an app-specific password:
   - Go to [Google Account settings](https://myaccount.google.com/)
   - Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
   - Go to **Security** → **App passwords**
   - Select **Mail** as the app and **Other** as the device
   - Enter "Playwright Framework" as the device name
   - Click **Generate**
   - Copy the 16-character app password (format: `abcd efgh ijkl mnop`)
3. Use the app password in the configuration (NOT your regular Gmail password)

**Important**: Gmail will reject regular passwords with the error "Application-specific password required". You MUST use an App Password.

#### Outlook/Office 365 Setup

The framework now supports Outlook/Office 365 email providers with automatic configuration detection.

**Option 1: Using Environment Variables (Recommended)**
```bash
# Set email provider to Outlook
export EMAIL_PROVIDER=outlook

# Configure Outlook SMTP settings
export SMTP_HOST=smtp.office365.com
export SMTP_PORT=587
export SMTP_USER=your-email@outlook.com
export SMTP_PASS=your-password
```

**Option 2: Direct Configuration in playwright.config.ts**
```typescript
reportSmtp: {
  smtp: true,
  host: 'smtp.office365.com',
  port: 587,
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password',
  },
}
```

**Outlook Authentication Options:**
1. **Regular Password**: Use your Outlook account password
2. **App Password**: For enhanced security, generate an app password:
   - Go to [Microsoft Account Security](https://account.microsoft.com/security)
   - Navigate to **Security** → **Advanced security options**
   - Under **App passwords**, click **Create a new app password**
   - Select **Mail** and generate a password
   - Use this app password instead of your regular password

**Supported Outlook Domains:**
- `@outlook.com`
- `@hotmail.com`
- `@live.com`
- `@office365.com`
- Custom Office 365 domains

#### Custom SMTP Server
```typescript
reportSmtp: {
  smtp: true,
  host: 'your-smtp-server.com',
  port: 587, // or 465 for SSL
  auth: {
    user: 'your-username',
    pass: 'your-password',
  },
}
```

## Usage

### Running Tests with Email Reporting

```bash
# Development environment with email reporting
npm run test:dev

# Preprod environment with email reporting
npm run test:preprod

# Production environment with email reporting
npm run test:prod
```

### Manual Report Generation and Email

```bash
# Generate Allure report
npm run report:generate

# Open generated report
npm run report:open

# Serve report locally
npm run report
```

## Email Content

The email includes:

1. **Test Execution Summary**
   - Execution timestamp
   - Environment information
   - Base URL used
   - Custom message from configuration

2. **Attachments**
   - Playwright HTML report (`playwright-report.html`)
   - Failed test screenshots (up to 5 images)
   - Test artifacts from `test-results/` directory

3. **HTML Formatting**
   - Professional HTML email layout
   - Test details and metadata
   - Clear formatting for readability

## Environment Variables

You can override email settings using environment variables:

```bash
# Disable email reporting
export EMAIL_REPORTING=false

# Override recipient list
export EMAIL_RECIPIENTS="user1@company.com,user2@company.com"

# Override SMTP settings
export SMTP_HOST="custom-smtp.com"
export SMTP_PORT="587"
export SMTP_USER="custom-user"
export SMTP_PASS="custom-password"
```

## Email Provider Configuration

The framework supports multiple email providers with automatic configuration:

### Supported Providers

1. **Gmail** (default)
   - Provider: `gmail`
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Requires: App-specific password

2. **Outlook/Office 365**
   - Provider: `outlook`, `office365`, or `microsoft`
   - Host: `smtp.office365.com`
   - Port: `587`
   - Supports: Regular password or app password

### Switching Email Providers

**Method 1: Environment Variable**
```bash
# Switch to Outlook
export EMAIL_PROVIDER=outlook
export SMTP_USER=your-email@outlook.com
export SMTP_PASS=your-password

# Switch to Gmail
export EMAIL_PROVIDER=gmail
export SMTP_USER=your-email@gmail.com
export SMTP_PASS=your-app-password
```

**Method 2: .env File**
```bash
# .env file
EMAIL_PROVIDER=outlook
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Method 3: Programmatic Configuration**
```typescript
// In your test setup
import { envConfig } from './framework/utils/EnvConfig';

// The framework automatically detects the provider based on EMAIL_PROVIDER
const providerConfig = envConfig.getEmailProviderConfig();
console.log('Using email provider:', providerConfig.provider);
```

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**
   - **Error: "Application-specific password required"**
     - This is a Gmail security requirement
     - You MUST use a Gmail App Password, not your regular password
     - Follow the Gmail setup steps above to generate an App Password
   - **Error: "Invalid login" (Outlook)**
     - Verify your Outlook email and password
     - Try using an app password instead of your regular password
     - Ensure 2-factor authentication is enabled if using app password
   - **Error: "Connection timeout" (Outlook)**
     - Check if your organization blocks SMTP connections
     - Try using port 25 or 2525 as alternatives
     - Verify firewall settings
   - Verify username and password
   - For Gmail, ensure you're using an app-specific password
   - Check if 2-factor authentication is enabled

2. **Connection Timeout**
   - Verify SMTP host and port
   - Check firewall settings
   - Try different ports (587 for TLS, 465 for SSL)

3. **Email Not Sent**
   - Check if `email: true` and `smtp: true` are set
   - Verify recipient email addresses
   - Check console logs for error messages

4. **Missing Attachments**
   - Ensure Playwright report is generated (automatically after test execution)
   - Check if `playwright-report` directory exists
   - Verify test execution completed successfully

### Debug Mode

Enable debug logging by setting environment variable:

```bash
export DEBUG=email:*
npm run test:dev
```

## Security Considerations

1. **Credentials Security**
   - Use app-specific passwords instead of main account passwords
   - Consider using environment variables for sensitive data
   - Store credentials in secure configuration files

2. **Email Content**
   - Avoid including sensitive data in email content
   - Be cautious with screenshot attachments (may contain sensitive information)
   - Consider data retention policies for test artifacts

3. **Network Security**
   - Use TLS/SSL connections for SMTP
   - Verify SMTP server certificates
   - Consider VPN for corporate environments

## Advanced Configuration

### Custom Email Templates

You can customize the email template by modifying `EmailService.ts`:

```typescript
private generateEmailBody(body: string, hasAttachments: boolean): string {
  // Customize HTML template here
  return `
    <html>
      <body>
        <h1>Custom Test Report</h1>
        <!-- Your custom content -->
      </body>
    </html>
  `;
}
```

### Conditional Email Sending

Add conditions for when to send emails:

```typescript
// In globalTeardown.ts
if (selectedProfile?.reportEmail?.email && 
    selectedProfile?.reportSmtp?.smtp &&
    process.env.CI === 'true') { // Only send emails in CI
  await emailService.sendTestReport(/*...*/);
}
```

### Multiple Recipients

```typescript
reportEmail: {
  email: true,
  to: [
    'qa-team@company.com',
    'dev-team@company.com',
    'manager@company.com'
  ],
  subject: 'Test Report',
  body: 'Test execution completed',
}
```
