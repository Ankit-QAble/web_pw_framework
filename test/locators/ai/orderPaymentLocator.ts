export const orderPaymentLocators = {
  openUserManu: "//button[@aria-label='Open user menu']",
  myOrderButton: "//span[normalize-space()='My Orders']",
  paymentPending: "(//span[text()='Payment Pending']//..//..//..//..//a[contains(text(),'AUG-')])[1]",
  orderPrice: "(//span[text()='Payment Pending']//..//..//..//..//p)[1]",
  inrPrice: "(//span[text()='Payment Pending']//..//..//..//..//p)[2]",
  totalPrice: "(//p[text()='Total Price :']//..//p)[2]",
  paymentPendingText: "//span[normalize-space()='Payment Pending']",
  payNowButton: "//button[.//p[text()='Pay Now']]",
  bankTransferText: "//input[@id='payment-online']/ancestor::div[contains(@class, 'flex-col')][1]",
  paaymentPayNowNutton: "//button[.//span[text()='Pay Now']]",
  showAllButton: "//span[text()='Show all']",
  cardDetailsButton: "//p[text()='Cards (Credit/Debit)']",
  cardNumberInput: "//input[@id='cardNumber']",
  expiryDateInput: "//input[@id='cardExpiry']",
  cvvInput: "//input[@id='cardCvv']",
  otpInput: "//input[@id='password']",
  cardNameInput: "//input[@id='cardOwnerName']",
  agreeButton: "//p[text()='I agree to save my card details']",
  proceedButton: "//span[text()='PROCEED']",
  paySubmitButton: "//input[@id='submitBtn']",
  paymentSuccessText: "//h2[normalize-space()='Payment Success!']",
  paidAmount: "//h1"



};