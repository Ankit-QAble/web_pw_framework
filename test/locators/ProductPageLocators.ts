export const ProductPageLocators = {
    // Login Elements
    // Using internal:role for inputs as they are precise
    mobileNumberField: 'internal:role=textbox[name="Mobile Number"]',
    passwordField: 'internal:role=textbox[name="Password"]',
    loginButton: 'button:has-text("Login")',
    
    // OTP Elements
    otpInput1: 'input[name="otp1"]',
    otpInput2: 'input[name="otp2"]',
    otpInput3: 'input[name="otp3"]',
    otpInput4: 'input[name="otp4"]',
    otpInput5: 'input[name="otp5"]',
    otpInput6: 'input[name="otp6"]',
    
    // Navigation
    // Using has-text for robustness against whitespace/casing
    sidebarLogo: '//a[@class="sidebar-logo"]',
    basicStoreLink: 'a:has-text("basicstore Basic Store")',
    
    // Product Creation Elements
    createProductButton: 'button:has-text("Create Product")',
    // Using nth=4 based on original script logic
    productImageUpload: 'div:text("Choose a Product Image") >> nth=4', 
    productNameInput: '#exampleInputEmail1',
    productPriceInput: '#price',
    productQuantityInput: 'internal:role=spinbutton[name="Text input with dropdown"]',
    productUnitSelect: '#inlineFormCustomSelect',
    productDescriptionInput: '#exampleFormControlTextarea1',
    unlimitedAvailabilityCheckbox: 'text=Unlimited Product Availability',
    // Submit button is the last one with this text
    submitCreateProductButton: 'button:has-text("Create Product") >> nth=-1',
    
    // Dialog/Modal
    cancelButton: 'button:has-text("Cancel")'
};
