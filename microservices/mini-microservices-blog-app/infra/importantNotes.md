# Solution for ErrImagePull (imagePullPolicy)

Run the following command:
`eval $(minikube docker-env)`
\*Note - This command will need to be repeated anytime you close
and restart the terminal session.

Afterward, you can build your image: (if need cd into to the exact service)
`docker build -t USERNAME/REPO .`

Update, your pod manifest as shown above and then run:
`kubectl apply -f infra/k8s/`
