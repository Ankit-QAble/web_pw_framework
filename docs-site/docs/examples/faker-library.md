---
sidebar_position: 3
---

# Faker Library Guide

This guide covers using the Faker.js library for generating realistic test data in your automation tests. Faker helps create dynamic, randomized test data to avoid conflicts and make tests more realistic.

## Table of Contents

- [Installation](#installation)
- [Personal Information](#personal-information)
- [Numbers and Strings](#numbers-and-strings)
- [Dates](#dates)
- [Company Information](#company-information)
- [Practical Examples](#practical-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Installation

Faker is already included in the framework. Import it in your page objects:

```typescript
import { faker } from '@faker-js/faker';
```

## Personal Information

Generate realistic personal information for test users.

### Full Name

```typescript
// Full name
const fullName = faker.person.fullName(); // "John Doe"

// First name
const firstName = faker.person.firstName(); // "John"

// Last name
const lastName = faker.person.lastName(); // "Doe"

// Middle name
const middleName = faker.person.middleName(); // "Michael"
```

### Email Addresses

```typescript
// Random email
const email = faker.internet.email(); // "john.doe@example.com"

// Email with specific first and last name
const customEmail = faker.internet.email({ 
  firstName: 'ankit', 
  lastName: 'patel' 
}); // "ankit.patel@example.com"

// Email with custom domain
const domainEmail = faker.internet.email({ 
  firstName: 'test', 
  lastName: 'user',
  provider: 'sadad.qa'
}); // "test.user@sadad.qa"
```

### Phone Numbers

```typescript
// Random phone number
const phone = faker.phone.number(); // "+1-555-123-4567"

// Phone number with format
const formattedPhone = faker.phone.number('###-###-####'); // "555-123-4567"

// Mobile number (8 digits)
const mobileNumber = faker.string.numeric(8); // "12345678"

// Mobile number (10 digits)
const mobileNumber10 = faker.string.numeric(10); // "1234567890"
```

### Addresses

```typescript
// Street address
const address = faker.location.streetAddress(); // "123 Main St"

// City
const city = faker.location.city(); // "New York"

// State
const state = faker.location.state(); // "California"

// Country
const country = faker.location.country(); // "United States"

// Zip code
const zipCode = faker.location.zipCode(); // "12345"

// Full address
const fullAddress = faker.location.streetAddress({ useFullAddress: true });
```

## Numbers and Strings

Generate random numbers and strings for various purposes.

### Numeric Strings

```typescript
// Random numeric string (8 digits)
const numericString = faker.string.numeric(8); // "12345678"

// Random numeric string (10 digits)
const accountNumber = faker.string.numeric(10); // "1234567890"

// Random numeric string with specific length
const idNumber = faker.string.numeric(12); // "123456789012"
```

### Alphanumeric Strings

```typescript
// Random alphanumeric string
const alphanumeric = faker.string.alphanumeric(10); // "a1b2c3d4e5"

// Random UUID
const uuid = faker.string.uuid(); // "550e8400-e29b-41d4-a716-446655440000"

// Random hexadecimal
const hex = faker.string.hexadecimal({ length: 8 }); // "0x1a2b3c4d"
```

### Random Numbers

```typescript
// Random integer between min and max
const randomNumber = faker.number.int({ min: 1, max: 100 }); // 42

// Random float
const randomFloat = faker.number.float({ min: 0, max: 100, precision: 0.01 }); // 42.35

// Random big integer
const bigInt = faker.number.bigInt({ min: 1000n, max: 9999n }); // 5432n
```

## Dates

Generate random dates for testing date-related functionality.

```typescript
// Random recent date
const recentDate = faker.date.recent(); // Recent date

// Random future date
const futureDate = faker.date.future(); // Future date

// Random past date
const pastDate = faker.date.past(); // Past date

// Random date between range
const dateBetween = faker.date.between({ 
  from: '2024-01-01', 
  to: '2024-12-31' 
});

// Random date in the next year
const nextYear = faker.date.future({ years: 1 });
```

## Company Information

Generate company-related test data.

```typescript
// Company name
const companyName = faker.company.name(); // "Acme Corp"

// Business name
const businessName = faker.company.name(); // "Tech Solutions Inc"

// Company catchphrase
const catchphrase = faker.company.catchPhrase(); // "Innovative solutions"

// Company buzzword
const buzzword = faker.company.buzzNoun(); // "synergy"
```

## Practical Examples

### Example 1: Registration Form

Generate complete user registration data:

```typescript
async registerUser(): Promise<void> {
  // Generate test data using Faker
  const mobileNumber = faker.string.numeric(8);
  const emailCount = faker.string.numeric(3);
  const email = `ankit.patel${emailCount}@sadad.qa`;
  const password = 'QAble@2020';
  
  // Fill registration form
  await this.fill(LoginPageLocators.businessEmailfield, email);
  await this.fill(LoginPageLocators.mobileNumberfield, mobileNumber);
  await this.fill(LoginPageLocators.passwordFieldBox, password);
  await this.fill(LoginPageLocators.confirmPasswordField, password);
  
  this.logger.info(`User registered: ${email}, Mobile: ${mobileNumber}`);
}
```

### Example 2: Dynamic IBAN Number

Generate dynamic IBAN numbers:

```typescript
async enterIBANNumber(): Promise<void> {
  // Generate random account number
  const accountNumber = faker.string.numeric(10);
  
  // Create IBAN with dynamic account number
  const iban = `QA58DOHB1234ABCD567${accountNumber}`;
  
  await this.fill(LoginPageLocators.enterIBANNumber, iban);
  this.logger.info(`IBAN number entered: ${iban}`);
}
```

### Example 3: Business Details

Generate business information:

```typescript
async fillBusinessDetails(): Promise<void> {
  // Generate business data
  const businessName = faker.company.name();
  const businessEmail = faker.internet.email({ 
    firstName: 'business', 
    lastName: 'test',
    provider: 'sadad.qa'
  });
  
  // Fill business form
  await this.fill(LoginPageLocators.businessLegalName, businessName);
  await this.fill(LoginPageLocators.businessEmail, businessEmail);
  
  this.logger.info(`Business: ${businessName}, Email: ${businessEmail}`);
}
```

### Example 4: Signatory Information

Generate signatory data:

```typescript
async addSignatory(): Promise<void> {
  // Generate signatory name
  const signatoryName = faker.person.fullName();
  
  // Add signatory
  await this.click(LoginPageLocators.addSignatoryButton);
  await this.fill(LoginPageLocators.addSignatoryName, signatoryName);
  await this.click(LoginPageLocators.addSignatoryButtonInside);
  
  this.logger.info(`Added signatory: ${signatoryName}`);
}
```

### Example 5: Complete User Profile

Generate complete user profile:

```typescript
async createUserProfile(): Promise<void> {
  const profile = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode(),
    company: faker.company.name()
  };
  
  // Fill profile form
  await this.fill(LoginPageLocators.firstNameField, profile.firstName);
  await this.fill(LoginPageLocators.lastNameField, profile.lastName);
  await this.fill(LoginPageLocators.emailField, profile.email);
  await this.fill(LoginPageLocators.phoneField, profile.phone);
  await this.fill(LoginPageLocators.addressField, profile.address);
  await this.fill(LoginPageLocators.cityField, profile.city);
  await this.fill(LoginPageLocators.zipCodeField, profile.zipCode);
  await this.fill(LoginPageLocators.companyField, profile.company);
  
  this.logger.info(`Created profile for: ${profile.firstName} ${profile.lastName}`);
}
```

### Example 6: Dynamic Test Data with Timestamps

Generate unique test data using timestamps:

```typescript
async registerUserWithTimestamp(): Promise<void> {
  const timestamp = Date.now();
  const emailCount = faker.string.numeric(3);
  
  const userData = {
    email: `ankit.patel${emailCount}${timestamp}@sadad.qa`,
    mobileNumber: faker.string.numeric(8),
    username: `user_${timestamp}`
  };
  
  await this.fill(LoginPageLocators.businessEmailfield, userData.email);
  await this.fill(LoginPageLocators.mobileNumberfield, userData.mobileNumber);
  
  this.logger.info(`Registered user: ${userData.email}`);
}
```

## Best Practices

1. **Use Faker for dynamic data** to avoid test conflicts
   ```typescript
   // Good - unique each run
   const email = faker.internet.email();
   
   // Avoid - same every run
   const email = 'test@example.com';
   ```

2. **Combine Faker with static data** when needed
   ```typescript
   // Good - combines Faker with static domain
   const email = `user${faker.string.numeric(3)}@sadad.qa`;
   ```

3. **Log generated data** for debugging
   ```typescript
   const email = faker.internet.email();
   this.logger.info(`Generated email: ${email}`);
   ```

4. **Use appropriate Faker methods** for data types
   ```typescript
   // Good - specific method
   const mobile = faker.string.numeric(8);
   
   // Avoid - generic method
   const mobile = faker.string.alphanumeric(8); // May include letters
   ```

5. **Seed Faker** for reproducible tests (optional)
   ```typescript
   import { faker } from '@faker-js/faker';
   
   // Set seed for reproducible results
   faker.seed(123);
   const email = faker.internet.email(); // Same email every time
   ```

6. **Store generated data** when you need to reuse it
   ```typescript
   const userData = {
     email: faker.internet.email(),
     mobile: faker.string.numeric(8)
   };
   
   // Use userData.email and userData.mobile throughout test
   ```

## Troubleshooting

### Duplicate Data Conflicts

**Problem:** Generated data conflicts with existing test data

**Solutions:**
- Use more unique identifiers (timestamps, UUIDs)
- Combine multiple Faker methods
- Add random suffixes or prefixes

```typescript
// Add timestamp for uniqueness
const email = `user${Date.now()}@example.com`;

// Combine multiple Faker methods
const email = `${faker.person.firstName()}.${faker.person.lastName()}${faker.string.numeric(3)}@example.com`;
```

### Data Format Issues

**Problem:** Generated data doesn't match application format requirements

**Solutions:**
- Use appropriate Faker methods for data types
- Format data after generation if needed
- Check format requirements match application expectations

```typescript
// Format phone number
const phone = faker.phone.number('###-###-####');

// Format IBAN
const accountNumber = faker.string.numeric(10);
const iban = `QA58DOHB1234ABCD567${accountNumber}`;
```

### Reproducible Test Data

**Problem:** Need same data for debugging or test reproducibility

**Solutions:**
- Use Faker seed for reproducible results
- Store generated data in variables
- Use static data for critical test scenarios

```typescript
// Set seed for reproducibility
faker.seed(123);
const email = faker.internet.email(); // Same every time

// Or store generated data
const testData = {
  email: faker.internet.email(),
  mobile: faker.string.numeric(8)
};
// Reuse testData throughout test
```

### Performance Considerations

**Problem:** Faker generation is slow for large datasets

**Solutions:**
- Generate data once and reuse
- Use simpler Faker methods when possible
- Cache generated data if needed

```typescript
// Generate once
const userData = {
  email: faker.internet.email(),
  mobile: faker.string.numeric(8)
};

// Reuse throughout test
await this.fill(emailField, userData.email);
await this.fill(mobileField, userData.mobile);
```

## Additional Resources

- [Faker.js Documentation](https://fakerjs.dev/)
- [Faker.js API Reference](https://fakerjs.dev/api/)
- [Faker.js GitHub Repository](https://github.com/faker-js/faker)

