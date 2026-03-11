export const AutomationTestStoreLocators = {
  loginNameInput: '#loginFrm_loginname',
  passwordInput: '#loginFrm_password',
  loginButton: "//button[normalize-space()='Login']",
  siteHeaderLink: 'internal:role=link[name="Automation Test Store"]',
  menCategoryLink: 'internal:role=link[name="Men"]',
  categoryItemBodyShower: '#maincontainer li:has-text("Body & Shower")',
  categoryItemFragranceSets: '#maincontainer li:has-text("Fragrance Sets")',
  categoryItemPreShaveShaving: '#maincontainer li:has-text("Pre-Shave & Shaving")',
  bodyShowerLink: '#maincontainer a:has-text("Body & Shower")',
  mainContainer: '#maincontainer',
  addToCartButton: '[title="Add to Cart"]',
  cartMiniHeader: 'internal:role=link[name="    2 Items - $"]',
  viewCartButton: 'a[title="View Cart"]',
  cartLink: 'a[href*="checkout/cart"]',
  cartContainer: '#cart',
  delete: "//a[@class='btn btn-sm btn-default']"
};
