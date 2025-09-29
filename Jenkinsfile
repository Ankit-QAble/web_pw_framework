pipeline {
    agent any
    
    environment {
        CI = 'true'
        JENKINS = 'true'
        NODE_VERSION = '18'
        PLAYWRIGHT_BROWSERS_PATH = '/var/lib/jenkins/.cache/ms-playwright'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // Install Node.js if not available
                    sh '''
                        if ! command -v node &> /dev/null; then
                            echo "Installing Node.js ${NODE_VERSION}"
                            curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                        fi
                        node --version
                        npm --version
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        echo "Installing npm dependencies..."
                        npm ci
                        
                        echo "Installing Playwright browsers..."
                        npx playwright install --with-deps chromium
                        
                        echo "Verifying Playwright installation..."
                        npx playwright --version
                    '''
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                script {
                    sh '''
                        echo "Running Playwright tests..."
                        npx playwright test --reporter=html,allure-playwright
                    '''
                }
            }
            post {
                always {
                    // Archive test results
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright HTML Report'
                    ])
                    
                    // Archive Allure results
                    allure([
                        includeProperties: false,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results']]
                    ])
                    
                    // Archive screenshots
                    archiveArtifacts artifacts: 'screenshots/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }
    }
    
    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        failure {
            // Send notification on failure
            emailext (
                subject: "Test Execution Failed - ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "Test execution failed. Please check the build logs and reports.",
                to: "${env.CHANGE_AUTHOR_EMAIL ?: 'default@company.com'}"
            )
        }
    }
}
