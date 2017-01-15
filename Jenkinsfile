node {
    try {

        stage 'Checkout'
            git pull

        stage 'Update NPM'
            sh 'node -v'
            sh 'npm prune'
            sh 'npm install'

        stage  'Deploy'
            echo 'Deploy'
    }

    catch (err) {

    }
}