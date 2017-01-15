node('node') {
    try {

        stage 'Checkout'
            checkout scm

        stage 'Update NPM'
            sh 'node -v'
            sh 'npm prune'
            sh 'npm install'

        stage 'Build'
            sh 'npm build'

        stage  'Deploy'
            echo 'Deploy'
    }

    catch (err) {

    }
}