---
sidebar_position: 1
---

# File Upload Guide

This guide covers file upload functionality in the framework, including direct file input uploads and file uploads via button clicks that open file dialogs.

## Table of Contents

- [Direct File Input Upload](#direct-file-input-upload)
- [File Upload via Button Click](#file-upload-via-button-click)
- [File Upload Inside Iframe](#file-upload-inside-iframe)
- [File Path Formats](#file-path-formats)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Direct File Input Upload

Use `uploadFile()` when you have a direct file input element (`<input type="file">`).

### Method Signature

```typescript
protected async uploadFile(
  selector: SelectorDefinition, 
  filePath: string | string[], 
  timeout: number = 5000
): Promise<void>
```

### Examples

**Single File Upload:**
```typescript
await this.uploadFile(
  LoginPageLocators.documentUpload, 
  'E:/Project/web_pw_framework/cl_document.pdf'
);
```

**Multiple Files Upload:**
```typescript
await this.uploadFile(
  LoginPageLocators.multipleFileUpload, 
  [
    'E:/Project/web_pw_framework/file1.pdf',
    'E:/Project/web_pw_framework/file2.jpg'
  ]
);
```

**With Custom Timeout:**
```typescript
await this.uploadFile(
  LoginPageLocators.documentUpload, 
  'E:/Project/web_pw_framework/cl_document.pdf',
  10000 // 10 seconds timeout
);
```

## File Upload via Button Click

Use `uploadFileViaButton()` when clicking a button opens a Windows file dialog.

### Method Signature

```typescript
protected async uploadFileViaButton(
  buttonSelector: SelectorDefinition, 
  filePath: string | string[], 
  timeout: number = 10000
): Promise<void>
```

### How It Works

1. Sets up file chooser listener before clicking
2. Clicks the button that opens the file dialog
3. Waits for file chooser dialog to appear
4. Automatically selects and uploads the file(s)
5. Closes the dialog

### Examples

**Single File Upload:**
```typescript
await this.uploadFileViaButton(
  LoginPageLocators.uploadButton, 
  'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg'
);
```

**Multiple Files Upload:**
```typescript
await this.uploadFileViaButton(
  LoginPageLocators.uploadButton, 
  [
    'E:/Project/web_pw_framework/Mr_Abdulla_Image.jpg',
    'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg'
  ]
);
```

**With Error Handling:**
```typescript
async uploadCommercialLicence(): Promise<void> {
  try {
    this.logger.info('Starting commercial licence upload process');
    
    await this.waitForTimeout(10000);
    
    await this.uploadFileViaButton(
      LoginPageLocators.CLFileUploadButton, 
      'E:/Project/web_pw_framework/cl_document.pdf'
    );
    
    this.logger.info('File uploaded successfully, waiting for verification');
    await this.waitForTimeout(120000);
    
    await this.waitForVisible(LoginPageLocators.verifiedText, 60000);
    await this.click(LoginPageLocators.closeButton);
    
    this.logger.info('Commercial licence uploaded successfully');
    await this.takeScreenshot('commercial-licence-uploaded-successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Commercial licence upload failed: ${errorMessage}`);
    await this.takeScreenshot('commercial-licence-upload-failed');
    throw new Error(`Commercial licence upload failed: ${errorMessage}`);
  }
}
```

## File Upload Inside Iframe

Use `uploadFileViaButtonInFrame()` when the upload button is inside an iframe.

### Method Signature

```typescript
protected async uploadFileViaButtonInFrame(
  iframeSelector: string | { name?: string; url?: string | RegExp }, 
  buttonSelector: string, 
  filePath: string | string[], 
  timeout: number = 10000
): Promise<void>
```

### How It Works

1. Gets the iframe frame object
2. Locates the upload button inside the iframe
3. Sets up file chooser listener
4. Clicks the button inside the iframe
5. Handles the file chooser dialog
6. Uploads the file(s)

### Examples

**Basic Iframe Upload:**
```typescript
await this.uploadFileViaButtonInFrame(
  'iframe#myIframe',  // iframe selector
  '//button[normalize-space()="Upload"]',  // upload button inside iframe
  'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg',
  15000 // timeout for file chooser
);
```

**Using Locators:**
```typescript
await this.uploadFileViaButtonInFrame(
  LoginPageLocators.uploadIframe,
  LoginPageLocators.uploadOwnerId,
  'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg'
);
```

**Complete Iframe Upload Flow:**
```typescript
async uploadOwnerIdInIframe(): Promise<void> {
  try {
    this.logger.info('Starting owner ID upload inside iframe');
    
    // Wait for iframe to be available
    await this.waitForTimeout(30000);
    
    // Upload file via button click inside iframe
    await this.uploadFileViaButtonInFrame(
      LoginPageLocators.uploadIframe,  // iframe#myIframe
      LoginPageLocators.uploadOwnerId,  // //button[normalize-space()='Upload']
      'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg',
      15000 // timeout for file chooser
    );
    
    this.logger.info('Owner ID file uploaded successfully inside iframe');
    await this.takeScreenshot('owner-id-uploaded-in-iframe');
    
    // Wait and click Continue button inside iframe
    await this.waitForTimeout(60000);
    await this.clickContinueButtonInIframe();
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Failed to upload owner ID in iframe: ${errorMessage}`);
    await this.takeScreenshot('owner-id-upload-failed-in-iframe');
    throw new Error(`Failed to upload owner ID in iframe: ${errorMessage}`);
  }
}
```

## File Path Formats

The framework accepts various file path formats:

### Absolute Paths (Windows)
```typescript
'E:/Project/web_pw_framework/cl_document.pdf'
```

### Absolute Paths (Unix/Mac)
```typescript
'/Users/username/Documents/file.pdf'
```

### Relative Paths from Project Root
```typescript
'cl_document.pdf'
```

### Relative Paths from Test File
```typescript
'./test-files/document.pdf'
```

**Note:** When using Windows paths, you can use forward slashes (`/`) which Playwright accepts, or escape backslashes (`\\`).

## Complete Examples

### Example 1: Complete File Upload Flow

```typescript
async uploadCommercialLicence(): Promise<void> {
  try {
    this.logger.info('Starting commercial licence upload process');
    
    // Wait for upload button
    await this.waitForTimeout(10000);
    
    // Upload file via button click
    await this.uploadFileViaButton(
      LoginPageLocators.CLFileUploadButton, 
      'E:/Project/web_pw_framework/cl_document.pdf'
    );
    
    this.logger.info('File uploaded successfully, waiting for verification');
    
    // Wait for verification
    await this.waitForTimeout(120000);
    
    // Verify upload success
    await this.waitForVisible(LoginPageLocators.verifiedText, 60000);
    await this.click(LoginPageLocators.closeButton);
    
    this.logger.info('Commercial licence uploaded successfully');
    await this.takeScreenshot('commercial-licence-uploaded-successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Commercial licence upload failed: ${errorMessage}`);
    await this.takeScreenshot('commercial-licence-upload-failed');
    throw new Error(`Commercial licence upload failed: ${errorMessage}`);
  }
}
```

### Example 2: Multiple File Uploads

```typescript
async uploadOwnerDocuments(): Promise<void> {
  try {
    // Upload multiple files
    await this.uploadFileViaButton(
      LoginPageLocators.ownerIDUploadButton,
      [
        'E:/Project/web_pw_framework/Mr_Abdulla_Image.jpg',
        'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg'
      ]
    );
    
    this.logger.info('Owner documents uploaded successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Failed to upload owner documents: ${errorMessage}`);
    throw error;
  }
}
```

### Example 3: Iframe Upload with Verification

```typescript
async uploadAndVerifyInIframe(): Promise<void> {
  try {
    // Step 1: Wait for iframe
    await this.waitForVisible(LoginPageLocators.uploadIframe, 10000);
    
    // Step 2: Upload file inside iframe
    await this.uploadFileViaButtonInFrame(
      LoginPageLocators.uploadIframe,
      LoginPageLocators.uploadOwnerId,
      'E:/Project/web_pw_framework/Mr_Abdulla_Id.jpg'
    );
    
    // Step 3: Wait for processing
    await this.waitForTimeout(60000);
    
    // Step 4: Upload image inside iframe
    await this.uploadFileViaButtonInFrame(
      LoginPageLocators.uploadIframe,
      LoginPageLocators.uploadOwnerImage,
      'E:/Project/web_pw_framework/Mr_Abdulla_Image.jpg'
    );
    
    this.logger.info('Iframe upload completed');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Iframe upload failed: ${errorMessage}`);
    throw error;
  }
}
```

## Best Practices

1. **Always wait for elements** before uploading
   ```typescript
   await this.waitForVisible(LoginPageLocators.uploadButton, 10000);
   await this.uploadFileViaButton(LoginPageLocators.uploadButton, filePath);
   ```

2. **Use appropriate timeouts** for file processing
   ```typescript
   await this.uploadFileViaButton(button, filePath, 15000); // 15 seconds
   ```

3. **Handle errors gracefully** with try-catch blocks
   ```typescript
   try {
     await this.uploadFileViaButton(button, filePath);
   } catch (error) {
     // Log and handle error
   }
   ```

4. **Take screenshots** on success and failure
   ```typescript
   await this.takeScreenshot('upload-success');
   ```

5. **Use absolute paths** for reliability
   ```typescript
   'E:/Project/web_pw_framework/file.pdf' // Preferred
   ```

6. **Log file paths** for debugging
   ```typescript
   this.logger.info(`Uploading file: ${filePath}`);
   ```

## Troubleshooting

### File Dialog Doesn't Open

**Problem:** File dialog doesn't appear when clicking upload button

**Solutions:**
- Ensure `uploadFileViaButton()` is used, not `uploadFile()`
- Verify button selector is correct
- Check that element is clickable and visible
- Increase timeout if needed

```typescript
// Wrong - won't work for button that opens dialog
await this.uploadFile(buttonSelector, filePath);

// Correct - handles file dialog
await this.uploadFileViaButton(buttonSelector, filePath);
```

### File Not Uploading

**Problem:** File upload fails silently or throws error

**Solutions:**
- Verify file path is correct and file exists
- Use forward slashes or escaped backslashes in paths
- Check file permissions
- Verify file size is within limits

```typescript
// Check file exists
const fs = require('fs');
if (!fs.existsSync(filePath)) {
  throw new Error(`File not found: ${filePath}`);
}
```

### Timeout Errors

**Problem:** Timeout waiting for file chooser or upload completion

**Solutions:**
- Increase timeout parameter
- Check file size and network speed
- Add wait after upload for processing

```typescript
// Increase timeout
await this.uploadFileViaButton(button, filePath, 30000); // 30 seconds

// Wait after upload
await this.uploadFileViaButton(button, filePath);
await this.waitForTimeout(60000); // Wait for processing
```

### Iframe Upload Issues

**Problem:** File upload fails inside iframe

**Solutions:**
- Ensure iframe is loaded before uploading
- Use `uploadFileViaButtonInFrame()` for iframe uploads
- Verify iframe selector is correct
- Check that button exists inside iframe

```typescript
// Wait for iframe first
await this.waitForVisible(LoginPageLocators.uploadIframe, 10000);

// Then upload
await this.uploadFileViaButtonInFrame(
  LoginPageLocators.uploadIframe,
  LoginPageLocators.uploadButton,
  filePath
);
```

## Additional Resources

- [Playwright File Upload Documentation](https://playwright.dev/docs/input#upload-files)
- [File Chooser API](https://playwright.dev/docs/api/class-filechooser)

