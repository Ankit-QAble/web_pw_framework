 export const DemoPageLocators = {
  loginContainer: [
    '.orangehrm-login-slot-wrapper',
    '.orangehrm-login-form',
    'form.oxd-form'
  ],
  loginTitle: [
    '.orangehrm-login-title',
    '//h5[contains(@class,"orangehrm-login-title")]',
    '//h5[normalize-space()="Login"]'
  ],
  usernameField: [
    'input[name="username"]',
    '//input[@placeholder="Username"]',
    '.oxd-input[name="username"]'
  ],
  passwordField: [
    'input[name="password"]',
    '//input[@placeholder="Password"]',
    '.oxd-input[name="password"]'
  ],
  loginButton: [
    'button[type="submit"]',
    '//button[normalize-space()="Login"]'
  ],
  forgotPasswordLink: [
    '.orangehrm-login-forgot-header',
    '//p[contains(@class,"orangehrm-login-forgot-header")]'
  ],
  companyBrandingImage: [
    'img[alt="company-branding"]',
    '.orangehrm-login-branding img'
  ],
  invalidCredentialsAlert: [
    '.oxd-alert-content-text',
    '//p[contains(@class,"alert-content-text")]',
    '//p[normalize-space()="Invalid credentials"]'
  ],
  dashboardHeader: [
    '//h6[text()="Dashboard"]',
    '.oxd-topbar-header-breadcrumb h6'
  ],
  quickLaunchSection: [
    '(//p[normalize-space()="Quick Launch"]/ancestor::div[contains(@class,"orangehrm-dashboard-widget")])[1]',
    '(//div[contains(@class,"orangehrm-dashboard-widget")][.//p[normalize-space()="Quick Launch"]])[1]',
    'css=.orangehrm-dashboard-widget:has(p:has-text("Quick Launch"))'
  ],
  userDropdownTrigger: [
    '.oxd-userdropdown-name',
    '//p[contains(@class,"oxd-userdropdown-name")]'
  ],
  logoutLink: [
    'a[href$="/auth/logout"]',
    '//a[normalize-space()="Logout"]'
  ]
};
