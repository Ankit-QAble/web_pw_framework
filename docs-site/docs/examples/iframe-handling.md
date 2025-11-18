---
sidebar_position: 2
---

# Iframe Handling Guide

This guide covers comprehensive iframe handling in the framework, including getting frames, clicking elements, filling inputs, waiting for elements, and uploading files inside iframes.

## Table of Contents

- [Getting an Iframe](#getting-an-iframe)
- [Clicking Elements Inside Iframe](#clicking-elements-inside-iframe)
- [Filling Input Fields Inside Iframe](#filling-input-fields-inside-iframe)
- [Waiting for Elements Inside Iframe](#waiting-for-elements-inside-iframe)
- [File Upload Inside Iframe](#file-upload-inside-iframe)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Getting an Iframe

Before interacting with elements inside an iframe, you need to get the frame object.

### Method Signature

```typescript
protected async getFrame(
  iframeSelector: string | { name?: string; url?: string | RegExp }, 
  timeout: number = 10000
): Promise<Frame>
```

### Examples

**By Iframe Selector (Most Common):**
```typescript
const frame = await this.getFrame('iframe#myIframe');
```

**By Iframe Name Attribute:**
```typescript
const frame = await this.getFrame({ name: 'upload-frame' });
```

**By Iframe URL Pattern:**
```typescript
const frame = await this.getFrame({ url: /upload/i });
```

**By Exact URL:**
```typescript
const frame = await this.getFrame({ url: 'https://app.example.com/upload' });
```

**Using Locators:**
```typescript
const frame = await this.getFrame(LoginPageLocators.uploadIframe);
```

## Clicking Elements Inside Iframe

Click on buttons, links, or any clickable elements inside an iframe.

### Method Signature

```typescript
protected async clickInFrame(
  iframeSelector: string | { name?: string; url?: string | RegExp }, 
  elementSelector: string, 
  timeout: number = 5000
): Promise<void>
```

### Examples

**Basic Click:**
```typescript
await this.clickInFrame(
  'iframe#myIframe',  // iframe selector
  '//button[normalize-space()="Continue"]',  // element inside iframe
  10000 // timeout
);
```

**Using Locators:**
```typescript
await this.clickInFrame(
  LoginPageLocators.uploadIframe,
  LoginPageLocators.continueButtonInIframe
);
```

**Complete Example:**
```typescript
async clickContinueButtonInIframe(): Promise<void> {
  try {
    this.logger.info('Clicking Continue button inside iframe');
    
    // Wait for iframe to be available
    await this.waitForTimeout(60000);
    
    // Click the Continue button inside the iframe
    await this.clickInFrame(
      LoginPageLocators.uploadIframe,  // iframe#myIframe
      LoginPageLocators.continueButtonInIframe,  // //button[normalize-space()='Continue']
      10000 // timeout
    );
    
    this.logger.info('Continue button clicked successfully in iframe');
    await this.takeScreenshot('continue-button-clicked-in-iframe');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Failed to click Continue button in iframe: ${errorMessage}`);
    await this.takeScreenshot('continue-button-click-failed-in-iframe');
    throw new Error(`Failed to click Continue button in iframe: ${errorMessage}`);
  }
}
```

## Filling Input Fields Inside Iframe

Fill text inputs, textareas, or any input fields inside an iframe.

### Method Signature

```typescript
protected async fillInFrame(
  iframeSelector: string | { name?: string; url?: string | RegExp }, 
  elementSelector: string, 
  value: string, 
  timeout: number = 5000
): Promise<void>
```

### Examples

**Basic Fill:**
```typescript
await this.fillInFrame(
  'iframe#myIframe',
  'input#username',
  'testuser@example.com'
);
```

**Using Locators:**
```typescript
await this.fillInFrame(
  LoginPageLocators.uploadIframe,
  LoginPageLocators.usernameFieldInIframe,
  'test@example.com'
);
```

**Complete Example:**
```typescript
async fillFormInIframe(): Promise<void> {
  await this.fillInFrame(
    LoginPageLocators.uploadIframe,
    LoginPageLocators.nameFieldInIframe,
    'John Doe'
  );
  
  await this.fillInFrame(
    LoginPageLocators.uploadIframe,
    LoginPageLocators.emailFieldInIframe,
    'john.doe@example.com'
  );
}
```

## Waiting for Elements Inside Iframe

Wait for elements to become visible, attached, or meet other conditions inside an iframe.

### Method Signature

```typescript
protected async waitForVisibleInFrame(
  iframeSelector: string | { name?: string; url?: string | RegExp }, 
  elementSelector: string, 
  timeout: number = 5000
): Promise<void>
```

### Examples

**Wait for Element Visibility:**
```typescript
await this.waitForVisibleInFrame(
  'iframe#myIframe',
  '//div[@class="success-message"]',
  10000
);
```

**Using Locators:**
```typescript
await this.waitForVisibleInFrame(
  LoginPageLocators.uploadIframe,
  LoginPageLocators.successMessageInIframe,
  10000
);
```

**Complete Example:**
```typescript
async waitForVerificationInIframe(): Promise<void> {
  // Wait for iframe
  await this.waitForVisible(LoginPageLocators.uploadIframe, 10000);
  
  // Wait for verification message inside iframe
  await this.waitForVisibleInFrame(
    LoginPageLocators.uploadIframe,
    LoginPageLocators.verifiedTextInIframe,
    60000
  );
  
  this.logger.info('Verification message appeared in iframe');
}
```

## File Upload Inside Iframe

Upload files when the upload button is inside an iframe.

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

**Complete Example:**
```typescript
async uploadOwnerIdInIframe(): Promise<void> {
  try {
    this.logger.info('Starting owner ID upload inside iframe');
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Failed to upload owner ID in iframe: ${errorMessage}`);
    await this.takeScreenshot('owner-id-upload-failed-in-iframe');
    throw new Error(`Failed to upload owner ID in iframe: ${errorMessage}`);
  }
}
```

## Complete Examples

### Example 1: Complete Iframe Interaction Flow

```typescript
async completeIframeVerification(): Promise<void> {
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
    
    // Step 4: Click Continue button inside iframe
    await this.clickInFrame(
      LoginPageLocators.uploadIframe,
      LoginPageLocators.continueButtonInIframe,
      10000
    );
    
    // Step 5: Upload image inside iframe
    await this.uploadFileViaButtonInFrame(
      LoginPageLocators.uploadIframe,
      LoginPageLocators.uploadOwnerImage,
      'E:/Project/web_pw_framework/Mr_Abdulla_Image.jpg'
    );
    
    // Step 6: Wait for verification message
    await this.waitForVisibleInFrame(
      LoginPageLocators.uploadIframe,
      LoginPageLocators.verifiedTextInIframe,
      60000
    );
    
    this.logger.info('Iframe verification completed');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger.error(`Iframe verification failed: ${errorMessage}`);
    throw error;
  }
}
```

### Example 2: Form Filling Inside Iframe

```typescript
async fillFormInIframe(): Promise<void> {
  // Wait for iframe
  await this.waitForVisible(LoginPageLocators.uploadIframe, 10000);
  
  // Fill form fields inside iframe
  await this.fillInFrame(
    LoginPageLocators.uploadIframe,
    LoginPageLocators.nameFieldInIframe,
    'John Doe'
  );
  
  await this.fillInFrame(
    LoginPageLocators.uploadIframe,
    LoginPageLocators.emailFieldInIframe,
    'john.doe@example.com'
  );
  
  // Click submit button inside iframe
  await this.clickInFrame(
    LoginPageLocators.uploadIframe,
    LoginPageLocators.submitButtonInIframe
  );
  
  // Wait for success message
  await this.waitForVisibleInFrame(
    LoginPageLocators.uploadIframe,
    LoginPageLocators.successMessageInIframe,
    10000
  );
}
```

### Example 3: Multiple Actions in Iframe

```typescript
async performMultipleActionsInIframe(): Promise<void> {
  const iframeSelector = LoginPageLocators.uploadIframe;
  
  // Wait for iframe
  await this.waitForVisible(iframeSelector, 10000);
  
  // Action 1: Fill input
  await this.fillInFrame(iframeSelector, 'input#field1', 'value1');
  
  // Action 2: Click button
  await this.clickInFrame(iframeSelector, 'button#next');
  
  // Action 3: Wait for element
  await this.waitForVisibleInFrame(iframeSelector, 'div#step2', 10000);
  
  // Action 4: Upload file
  await this.uploadFileViaButtonInFrame(
    iframeSelector,
    'button#upload',
    'E:/Project/web_pw_framework/file.pdf'
  );
  
  // Action 5: Click continue
  await this.clickInFrame(iframeSelector, 'button#continue');
}
```

## Best Practices

1. **Always wait for iframe** to be available before interacting
   ```typescript
   await this.waitForVisible(LoginPageLocators.uploadIframe, 10000);
   ```

2. **Use descriptive selectors** for iframe identification
   ```typescript
   // Good
   'iframe#myIframe'
   { name: 'upload-frame' }
   
   // Avoid
   'iframe' // Too generic if multiple iframes exist
   ```

3. **Handle timeouts** appropriately for iframe content loading
   ```typescript
   await this.clickInFrame(iframeSelector, elementSelector, 10000);
   ```

4. **Test iframe interactions** separately before combining
   ```typescript
   // Test each action individually first
   await this.clickInFrame(iframeSelector, buttonSelector);
   // Then combine into flow
   ```

5. **Use locators** from LoginPageLocators for maintainability
   ```typescript
   // Good - maintainable
   await this.clickInFrame(
     LoginPageLocators.uploadIframe,
     LoginPageLocators.continueButtonInIframe
   );
   
   // Avoid - hard to maintain
   await this.clickInFrame('iframe#myIframe', '//button[1]');
   ```

6. **Log iframe interactions** for debugging
   ```typescript
   this.logger.info('Interacting with iframe: uploadIframe');
   ```

## Troubleshooting

### Iframe Not Found

**Problem:** Iframe selector doesn't match any iframe

**Solutions:**
- Verify iframe selector is correct
- Check if iframe is loaded before accessing
- Use browser DevTools to inspect iframe attributes
- Try different selector methods (id, name, url)

```typescript
// Check iframe exists
const iframeExists = await this.isVisible(LoginPageLocators.uploadIframe);
if (!iframeExists) {
  throw new Error('Iframe not found');
}
```

### Element Not Found Inside Iframe

**Problem:** Element selector doesn't match any element inside iframe

**Solutions:**
- Ensure selector is relative to iframe content, not main page
- Verify element exists in iframe DOM
- Check if element is inside nested iframes
- Use browser DevTools to inspect iframe content

```typescript
// Debug: Get frame and check element
const frame = await this.getFrame(iframeSelector);
const elementCount = await frame.locator(elementSelector).count();
console.log(`Found ${elementCount} elements`);
```

### Timeout Waiting for Iframe

**Problem:** Timeout error when getting iframe

**Solutions:**
- Increase timeout parameter
- Wait for iframe to load before accessing
- Check network conditions and page load time
- Verify iframe source URL is accessible

```typescript
// Wait for iframe to be attached
await this.waitForVisible(LoginPageLocators.uploadIframe, 30000);

// Then get frame
const frame = await this.getFrame(LoginPageLocators.uploadIframe, 30000);
```

### File Upload Fails Inside Iframe

**Problem:** File upload doesn't work inside iframe

**Solutions:**
- Use `uploadFileViaButtonInFrame()` for iframe uploads
- Ensure iframe is loaded before uploading
- Verify button exists inside iframe
- Check file chooser timeout

```typescript
// Ensure iframe is ready
await this.waitForVisible(LoginPageLocators.uploadIframe, 10000);

// Then upload
await this.uploadFileViaButtonInFrame(
  LoginPageLocators.uploadIframe,
  LoginPageLocators.uploadButton,
  filePath,
  20000 // Increase timeout
);
```

### Cross-Origin Iframe Issues

**Problem:** Cannot access iframe content due to cross-origin restrictions

**Solutions:**
- Verify iframe source allows access
- Check browser console for CORS errors
- Some iframes may require special handling
- Consider using different approach if iframe blocks access

## Additional Resources

- [Playwright Frames Documentation](https://playwright.dev/docs/frames)
- [Frame API Reference](https://playwright.dev/docs/api/class-frame)

