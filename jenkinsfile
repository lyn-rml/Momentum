
pipeline {
    agent any

    tools {
        nodejs 'Node24'
    }

    environment {
        HUSKY = '0'
    }

    options {
        skipDefaultCheckout(true)
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
            }
        }

        stage('Code quality') {
            steps {
                sh 'npm run format:check'
                sh 'npm run lint'
            }
        }

        stage('Unit tests') {
            steps {
                sh 'npm run test:ci'
            }
        }

        stage('Production build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
