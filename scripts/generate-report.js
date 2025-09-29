const { execSync } = require('child_process');
const path = require('path');

console.log('Generating Allure report...');

try {
  // Generate Allure report
  execSync('npx allure generate allure-results --clean -o allure-report', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('Allure report generated successfully!');
  console.log('Report location: allure-report/index.html');
  
} catch (error) {
  console.error('Failed to generate Allure report:', error.message);
  process.exit(1);
}
