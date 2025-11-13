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
  dashboardTitle: "//h2[normalize-space()='Welcome to SADAD!']"
};