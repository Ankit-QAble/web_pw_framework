# SauceDemo Login Test Plan

## Application Overview

Test plan for the login page of Sauce Demo (https://www.saucedemo.com/). Covers positive path and a set of negative scenarios including empty fields, invalid credentials, and locked out user.

## Test Scenarios

### 1. Login Scenarios

**Seed:** `test/specs/seed.spec.ts`

#### 1.1. Successful login with valid credentials

**File:** `test/login/positive.spec.ts`

**Steps:**
  1. Navigate to https://www.saucedemo.com/
    - expect: Login form is displayed with username and password fields and a login button
  2. Enter a valid username (e.g. standard_user)
    - expect: Username field contains the entered value
  3. Enter the corresponding valid password (e.g. secret_sauce)
    - expect: Password field contains the entered value
  4. Click the login button
    - expect: User is redirected to the inventory page
    - expect: Page header or product list is visible indicating successful login

#### 1.2. Login with empty username

**File:** `test/login/negative_empty_username.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: Login form is present
  2. Leave the username field blank
    - expect: Username field is empty
  3. Enter a valid password
    - expect: Password field contains the entered value
  4. Click login
    - expect: An error message appears stating username is required
    - expect: User remains on login page

#### 1.3. Login with empty password

**File:** `test/login/negative_empty_password.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: Login form is present
  2. Enter a valid username
    - expect: Username field contains the entered value
  3. Leave the password field blank
    - expect: Password field is empty
  4. Click login
    - expect: An error message appears stating password is required
    - expect: User remains on login page

#### 1.4. Login with both fields empty

**File:** `test/login/negative_both_empty.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: Login form is present
  2. Leave both username and password blank
    - expect: Both fields are empty
  3. Click login
    - expect: An error message appears stating username is required
    - expect: User remains on login page

#### 1.5. Login with invalid password

**File:** `test/login/negative_invalid_password.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: Login form is present
  2. Enter a valid username
    - expect: Username field contains the entered value
  3. Enter an incorrect password
    - expect: Password field contains the entered value
  4. Click login
    - expect: An error message appears indicating username and password do not match or are invalid
    - expect: User remains on login page

#### 1.6. Login with invalid username

**File:** `test/login/negative_invalid_username.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: Login form is present
  2. Enter an invalid username
    - expect: Username field contains the entered value
  3. Enter a valid password
    - expect: Password field contains the entered value
  4. Click login
    - expect: An error message appears indicating username and password do not match or are invalid
    - expect: User remains on login page

#### 1.7. Login with locked out user

**File:** `test/login/negative_locked_out.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: Login form is present
  2. Enter the locked_out_user username
    - expect: Username field contains the entered value
  3. Enter the correct password
    - expect: Password field contains the entered value
  4. Click login
    - expect: An error message appears stating user has been locked out
    - expect: User remains on login page
