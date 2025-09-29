@echo off

REM Set environment to preprod
set NODE_ENV=development

REM Run critical tests
echo Running critical tests in preprod environment...
npx playwright test --grep "@critical"

REM Generate Allure report
echo Generating Allure report...
npx allure generate allure-results --clean

REM Open Allure report
echo Opening Allure report...
npx allure open
