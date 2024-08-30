pipeline {
    agent { label 'amazon-linux' }

    environment {
        ECR_ENDPOINT = "975049907995.dkr.ecr.ap-southeast-2.amazonaws.com"
        REPO_NAME = "ecr-antonio-demo"
        CORE_REPO_URL = 'https://github.com/AntNeo/EZPZOS.Core.git'  // 核心依赖仓库URL
        GIT_CREDENTIALS_ID = 'git-credentials' // Jenkins中配置的git凭证ID
        ECR_CREDENTIALS_ID = 'ecr-credentials'
        AWS_DEFAULT_REGION = 'ap-southeast-2'
        AWS_MAIN_CREDENTIALS_ID = 'aws-main-credentials'
    }

    stages {
        stage('build') {
            steps {
                script {
                    echo "Cloning core repository with credentials..."
                    dir('EZPZOS.Core') {
                        git branch: 'main', credentialsId: "${GIT_CREDENTIALS_ID}", url: "${CORE_REPO_URL}"
                    }
                    
                    withCredentials([aws(credentialsId: "${ECR_CREDENTIALS_ID}")]) {
                        sh '''
                        #!/bin/bash
                        aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin ${ECR_ENDPOINT}
                        '''
                    }

                    // configure registry
                    docker.withRegistry("https://${ECR_ENDPOINT}") {
                    
                        // build image
                        def customImage = docker.build("${REPO_NAME}:${env.BUILD_ID}")
                    
                        // push image
                        customImage.push()
                    }
                }
            }
        }
        stage('deploy') {
            steps {
                script {
                    // deploy image
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "${AWS_MAIN_CREDENTIALS_ID}"]]) {
                        sh """
                        CLUSTER_NAME="uat-antoneo-cluster"
                        SERVICE_NAME="uat-antoneo-service"
                        TASK_DEFINITION_NAME="uat-antoneo-task"
                        NEW_IMAGE="${REPO_NAME}:${env.BUILD_ID}"
                        REGION="ap-southeast-2"
                        sudo yum install -y jq
                        
                        docker run \
                            -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
                            -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
                            amazon/aws-cli:latest \
                            ecs describe-task-definition --task-definition \$TASK_DEFINITION_NAME --region \$REGION | \
                        
                        jq --arg IMAGE "\$NEW_IMAGE" '.taskDefinition | \
                            .containerDefinitions[0].image = \$IMAGE | \
                            del(.taskDefinitionArn) | \
                            del(.revision) | \
                            del(.status) | \
                            del(.requiresAttributes) | \
                            del(.compatibilities) | \
                            del(.registeredAt) | \
                            del(.registeredBy)' \
                        > new-task-def.json

                        NEW_TASK_DEFINITION=\$(docker run \
                            -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
                            -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
                            -v \$(pwd):/workdir \
                            amazon/aws-cli:latest \
                            ecs register-task-definition \
                                --family \$TASK_DEFINITION_NAME \
                                --cli-input-json file:///workdir/new-task-def.json \
                                --query 'taskDefinition.taskDefinitionArn' \
                                --output text \
                                --region \$REGION)

                        docker run \
                            -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
                            -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
                            amazon/aws-cli:latest \
                            ecs update-service --cluster \$CLUSTER_NAME --service \$SERVICE_NAME --task-definition \$NEW_TASK_DEFINITION --region \$REGION

                        rm -f new-task-def.json
                        """
                    }
                }
            }
        }
    }
}
