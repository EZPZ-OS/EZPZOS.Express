pipeline {
    agent any
    environment {
        AWS_ACCOUNT_ID = '975049907995'
        AWS_REGION = 'ap-southeast-2'
        ECR_REPOSITORY_NAME = 'ezpzos-express'
        IMAGE_TAG = 'latest'
        CLUSTER_NAME = 'ezpzos-fargate-cluster'
        SERVICE_NAME = 'ezpzos'
        TASK_DEFINITION = 'ezpzos-ec2-fargate'
    }
   stages{
        stage('Git clone from EZPZOS'){
            steps{
                script{
                    withCredentials([string(credentialsId: 'git_credential', variable: 'git_credential')]){
                        sh'''
                        git clone https://$git_credential@github.com/EZPZ-OS/EZPZOS.Core.git ../EZPZOS.Core
                        '''
                    }
                }
            }
        }
        stage('Run Core'){
            steps{
                script{
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_credentials']]){
                        dir('../EZPZOS.Core'){
                            sh '''
                            rm .env
                            aws s3 cp "s3://ezpzos-env-file/core-env" .env
                            npm i
                            npm run build
                            '''
                        }
                    }
                }
            }
        }
        stage('Build EZPZOS.Express'){
            steps{
                script{
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_credentials']]){
                        dir(''){
                            sh '''
                            aws s3 cp "s3://ezpzos-env-file/express-env" .env
                            mv Dockerfile ../
                            '''
                        }
                    }
                }
            }
        }
        stage('Build Docker Container'){
            steps{
                script{
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_credentials']]){
                        dir('../'){
                            docker.build("${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY_NAME}:${IMAGE_TAG}",'.')
                            docker.image("${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY_NAME}:${IMAGE_TAG}").push()

                        }
                    }
                }
            }
        }
        stage('Set Up Task Definition'){
            steps{
                script{
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_credentials']]){
                        dir('../'){
                            sh '''
                                aws ecs describe-task-definition --task-definition --output json\
                                $(aws ecs list-task-definitions --family-prefix ${TASK_DEFINITION} --query 'taskDefinitionArns[-1]' --output text) > latest_task_definition.json
                                '''
                        }
                    }
                }
            }
        }
        stage('Register ECS Service with Task Definition'){
            steps{
                script{
                    withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws_credentials']]){
                        dir('../'){
                            sh '''
                                aws ecs update-service \
                                --cluster "$CLUSTER_NAME"\
                                --service "$SERVICE_NAME"\
                                --task-definition "$(aws ecs list-task-definitions --family-prefix ezpzos-ec2-fargate --query 'taskDefinitionArns[-1]' --output text)"\
                                --region "${AWS_REGION}"
                                '''
                        }
                    }
                }
            }
        }
        
   }
    post{
        always{
            cleanWs()
            deleteDir()
            script{
                sh '''
                rm -rf ../EZPZOS.Core
                docker rmi $(docker images -q)
                pwd
                ls 
                ls ../*

                '''

            }
         }
    }
}