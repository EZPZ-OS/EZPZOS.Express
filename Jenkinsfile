pipeline{
    agent any
    stages{
        stage('echo hello world'){
            steps{
                script{
                    sh '''
                        npm i
                        
                    '''
                }
            }
        }
    }
    post{
        always{
            cleanWs()
            deleteDir()
        }
    }
}