// Minimal Jenkins declarative pipeline to run:
// npx playwright test --config=playwright.service.config.ts --workers=20
pipeline {
  agent {
    docker {
      // Official Playwright image with browsers preinstalled
      image 'mcr.microsoft.com/playwright:v1.49.1-jammy'
      args '--ipc=host'
    }
  }

  options {
    timestamps()
    ansiColor('xterm')
  }

  environment {
    CI = 'true'
    HEADLESS = 'true'
    RUN = 'development' // change if you use another profile
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install deps & browsers') {
      steps {
        sh '''
          npm ci
          npx playwright install --with-deps
        '''
      }
    }

    stage('Run tests') {
      steps {
        sh 'npx playwright test --config=playwright.service.config.ts --workers=20'
      }
    }
  }

  post {
    always {
      // Publish JUnit results (enabled via CI=true in playwright.config.ts)
      junit allowEmptyResults: true, keepLongStdio: true, testResults: 'junit.xml'

      // Archive HTML report and other artifacts
      archiveArtifacts allowEmptyArchive: true, artifacts: '''
        playwright-report/**/*
        allure-results/**/*
        test-results/results.json
        screenshots/**/*
      '''
    }
  }
}
