export const LoginPageLocators = {
  mobileNumberField: [
    "//input[@formcontrolname='email']",
    '#exampleFormControlInput1',
    '.form-control.custom-input',
    "input[type='text']"
  ],
  passwordField: 'input[type="password"]',
  loginButton: '//button[@type="submit"]',
  pageTitle: "//h2[normalize-space()='Login in to SADAD']",
  enterOTPTitle: "//h2[normalize-space()='OTP Verification']",
  enterOTP: "//div[@class='otp-box-main']/div/input",
  dashboardTitle: "//h2[normalize-space()='Welcome to SADAD!']",
  registerButton: "//a[normalize-space()='Register']",
  businessEmailfield: "//input[@id='emailField']",
  mobileNumberfield: "//input[@id='mobile']",
  passwordFieldBox: "//input[@id='passwordField']",
  confirmPasswordField: "//input[@id='confirmPassword']",
  getStartedButton: "//button[normalize-space()='Get Started']",

  sadadInvoice: "//h3[normalize-space()='SADAD Invoice']",
  createAccountButton: [
    "//button[normalize-space()='Create Account']",
    "button[type='submit']",
    "(//button[normalize-space()='Create Account'])[1]"
  ],

  completeNowButton: "//button[normalize-space()='Complete Now']",

  businessLegalName: "//input[@id='bussNameId']",
  businessLegalForm: "//input[@id='legalFormId']",
  BusinessHome: "//a[normalize-space()='Business Home']",
  ownerPartnersId: "//p[normalize-space()='Owner/Partners ID']",
  commercialLicene: "//p[normalize-space()='Commerical Licence']",
  confirmBusinessLegalFormButton: "//button[normalize-space()='Confirm Business Legal Form']",

  businessCategory: "//input[@id='categoryId']",
  smallScaleBusiness: "//span[normalize-space()='- (7093794)']",
  confirmCategoryButton: "//button[normalize-space()='Confirm Category']",

  saveAndNextButton: "//button[normalize-space()='Save & Next']",

  businessDetailsInReview: "//button[normalize-space()='Review']",

  CLFileUploadButton: "(//div[@class='od-listing ng-star-inserted'])[1]/div[3]",
  verifiedText: "(//*[contains(text(),'Verified')])[2]",
  closeButton: "//a[@class='ob-header-close ng-star-inserted']",
  verifiedButtonAfterUpload: "//*[contains(text(),'Verified')]",
  ownerIDUploadButton: "(//div[@class='od-listing ng-star-inserted'])[1]/div[3]",
  ownerID: "//*[contains(text(),'28563402509')]",
  ownerIDTitle: "//*[contains(text(),'ABDULLA MOHAMED A A ALYAFEI')]",

  //----------------------New Locators----------------------/
  bankAccountName: "//input[@id='bankAccNameId']",
  enterIBANNumber: "//input[@id='bankIBANNumId']",
  bankAccountDocument: "//div[@class='od-upload']//a",
  bankAccountType: "//input[@id='bankAccountType']",

  //----------------------Confirm Bank Details----------------------/
  verifyBankName: "//p[normalize-space()='KHALED PMAR HAZZAM']",
  verifyIBANNumber: "//p[normalize-space()='QA58DOHB1234ABCD5678901235678']",
  verifyDohaBank: "//p[normalize-space()='Doha Bank']",
  confirmButton: "//button[normalize-space()='Confirm']",

  //----------------------Verify Identity----------------------/
  addSignatoryButton: "//a[normalize-space()='Add Signatory']",
  addSignatoryName: "//input[@placeholder='Enter Full Name']",
  addSignatoryButtonInside: "//button[normalize-space()='Add Signatory']",
  verifySignatoryName: "//h4[normalize-space()='QA Automation']",
  startButton: "//button[normalize-space()='Start']",
  aggreeCheckBox: "//span[@class='checkmarker']",
  agreeButton: "//button[normalize-space()='I Agree']",
  
  
  // Iframe selector for upload functionality
  uploadIframe: "iframe#myIframe", // Iframe with id="myIframe"
  uploadOwnerId: "//button[normalize-space()='Upload']",
  continueButtonInIframe: "//button[normalize-space()='Continue']", // Continue button inside iframe
  // Alternative selector: "button.proofPreview-continue-button"
  uploadOwnerImage: "//button[normalize-space()='Upload']",


  proceedToEsignatureButton: "//button[normalize-space()='Proceed to E-signature']",
  verifySubmission: "//h4[normalize-space()='Video Verification Submitted']",
  uploadSignDocumentButton: "div[class='esign-inner-main upload-esign d-none_ ng-star-inserted'] button[type='submit']",
  TnCButton: "label[for='checkbox3_esign']",
  submitButton: "//button[normalize-space()='Submit']",
  verifyESignSubmited: "//h4[normalize-space()='E-Signature Submitted']",
  doneButton: "//button[normalize-space()='Done']",

  onboardingCompleted: "//h4[normalize-space()='Your Onboarding is now Completed']",

};