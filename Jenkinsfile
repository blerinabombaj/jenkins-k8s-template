pipeline {
    agent any
    environment {
        PATH = "$PATH:/usr/local/bin"
        IMAGE_NAME = "digdigdigdig/${APP_NAME}"
        APP_NAME = "CHANGE_ME"  // ← CHANGE PER PROJECT
    }
    stages {
        stage('Checkout') {
            steps {
                git url: 'git@github.com:blerinabombaj/${APP_NAME}.git', 
                    credentialsId: 'github-ssh', 
                    branch: 'main'
            }
        }
        stage('Build Docker') {
            steps {
                sh '''
                export PATH=$PATH:/usr/local/bin
                docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .
                docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest
                '''
            }
        }
        stage('Push Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', 
                                                 usernameVariable: 'DOCKER_USER', 
                                                 passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    export PATH=$PATH:/usr/local/bin
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push ${IMAGE_NAME}:${BUILD_NUMBER}
                    docker push ${IMAGE_NAME}:latest
                    '''
                }
            }
        }
        stage('Deploy Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_CONTENT')]) {
                    sh '''
                    export PATH=$PATH:/usr/local/bin
                    TEMP_KUBE=$(mktemp)
                    echo "$KUBECONFIG_CONTENT" > $TEMP_KUBE
                    export KUBECONFIG=$TEMP_KUBE
                    sed "s|{{APP_NAME}}|${APP_NAME}|g; s|{{IMAGE_NAME}}|${IMAGE_NAME}:${BUILD_NUMBER}|g" k8s-deployment.yaml | kubectl apply -f -
                    kubectl rollout status deployment/${APP_NAME}
                    '''
                }
            }
        }
    }
}
