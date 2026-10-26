
pipeline {
    agent any

    tools {
        nodejs 'Node24'
    }

    environment {
        HUSKY = '0'
        MOMENTUM_IP = '10.176.234.135'
    }

    options {
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
        timestamps()
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    parameters {
        booleanParam(
            name: 'SIMULATE_FAILURE',
            defaultValue: false,
            description: 'Lab test: simulate a deployment failure to test rollback'
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm

                script {
                    def revision = sh(
                        script: 'git rev-parse --short=12 HEAD',
                        returnStdout: true
                    ).trim()

                    env.IMAGE_TAG = "momentum:${revision}"
                }

                echo "Building ${env.IMAGE_TAG}"
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
            environment {
                NODE_OPTIONS = '--no-experimental-webstorage'
            }

            steps {
                sh 'npm run test:ci'
            }
        }

        stage('Production build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker build') {
            steps {
                sh 'docker build -t "$IMAGE_TAG" .'
            }
        }

        stage('Test Docker image') {
            steps {
                sh '''
                    set -eu

                    name="momentum-candidate-${BUILD_NUMBER}"

                    docker run -d --rm \
                        --name "$name" \
                        -p 127.0.0.1:18082:80 \
                        "$IMAGE_TAG"

                    trap 'docker rm -f "$name" >/dev/null 2>&1 || true' EXIT

                    healthy=0

                    for i in $(seq 1 10); do
                        if curl -fsS -o /dev/null http://127.0.0.1:18082/ &&
                           curl -fsS -o /dev/null http://127.0.0.1:18082/quote; then
                            healthy=1
                            break
                        fi

                        sleep 2
                    done

                    test "$healthy" -eq 1
                '''
            }
        }

        stage('Deploy to NodeZero') {
            steps {
                sh '''
                    MOMENTUM_HOST_IP="$MOMENTUM_IP" \
                    SIMULATE_FAILURE="${SIMULATE_FAILURE:-false}" \
                    bash scripts/deploy.sh "$IMAGE_TAG"
                '''
            }
        }
    }

    post {
        success {
            echo "CI/CD successful: ${env.IMAGE_TAG}"
        }

        failure {
            echo 'Pipeline failed. Check the logs and deployed version.'
        }
    }
}
