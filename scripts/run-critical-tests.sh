#!/bin/bash

# Set environment to preprod
export NODE_ENV="preprod"

# Run critical tests
echo "Running critical tests in preprod environment..."
npx playwright test --grep "@critical"

# Generate Allure report
echo "Generating Allure report..."
npx allure generate allure-results --clean

# Open Allure report
echo "Opening Allure report..."
npx allure open
