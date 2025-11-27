pipeline {
    agent any
    tools {
        nodejs 'nodejs-18'  // Make sure this matches the NodeJS tool name in Jenkins global config
    }
    environment {
        PATH = "${tool 'nodejs-18'}/bin:${env.PATH}"
    }
    stages {
        stage('TEST_FIRST') {
            steps {
                echo '🔥 TEST STAGE RUNNING!'
                sh '''
                    echo "=== DEBUG INFO ==="
                    pwd
                    ls -la *.js package*
                    which node || echo "❌ NO NODE!"
                    node --version || echo "❌ NODE FAILED"
                    if [ -f test-example.js ]; then
                        echo "🎯 RUNNING TEST!"
                        node test-example.js
                    else
                        echo "❌ NO TEST FILE"
                    fi
                '''
            }
        }
        stage('List Files') {
            steps {
                sh 'ls -la'
            }
        }
        stage('Build Docker') {
            steps {
                sh '''
                    export PATH=$PATH:/usr/local/bin
                    docker build -t digdigdigdig/jenkins-template:${BUILD_NUMBER} -f Dockerfile.example .
                    docker tag digdigdigdig/jenkins-template:${BUILD_NUMBER} digdigdigdig/jenkins-template:latest
                '''
            }
        }
        stage('Push Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        export PATH=$PATH:/usr/local/bin
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push digdigdigdig/jenkins-template:${BUILD_NUMBER}
                        docker push digdigdigdig/jenkins-template:latest
                    '''
                }
            }
        }
        stage('Deploy Kubernetes') {
            steps {
                withCredentials([string(credentialsId: 'kubconfig', variable: 'KUBECONFIG_CONTENT')]) {
                    sh '''
                        export PATH=$PATH:/usr/local/bin
                        if ! command -v kubectl >/dev/null 2>&1; then
                            echo "WARNING: kubectl not found - skipping"
                            exit 0
                        fi
                        echo "$KUBECONFIG_CONTENT" > /tmp/kubeconfig
                        export KUBECONFIG=/tmp/kubeconfig
                        kubectl get nodes || true
                    '''
                }
            }
        }
    }
    post {
        always {
            sh 'docker logout || true'
        }
    }
}
