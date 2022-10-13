## **Section 23: CI/CD**

## Table of Contents
- [**Section 23: CI/CD**](#section-23-cicd)
- [Table of Contents](#table-of-contents)
  - [Development Workflow](#development-workflow)
  - [Git Repository Approaches](#git-repository-approaches)
  - [Creating a GitHub Action](#creating-a-github-action)
  - [Adding a CI Test Script](#adding-a-ci-test-script)
  - [Running Tests on PR Creation](#running-tests-on-pr-creation)
  - [Output of Failing Tests](#output-of-failing-tests)
  - [Running Tests in Parallel](#running-tests-in-parallel)
  - [Verifying a Test Run](#verifying-a-test-run)
  - [Selective Test Execution](#selective-test-execution)
  - [Deployment Options](#deployment-options)
  - [Creating a Hosted Cluster](#creating-a-hosted-cluster)
  - [Reminder on Kubernetes Context](#reminder-on-kubernetes-context)
  - [Reminder on Swapping Contexts](#reminder-on-swapping-contexts)
  - [The Deployment Plan](#the-deployment-plan)
  - [Building an Image in an Action](#building-an-image-in-an-action)
  - [Testing the Image Build](#testing-the-image-build)
  - [Restarting the Deployment](#restarting-the-deployment)
  - [Applying Kubernetes Manifests](#applying-kubernetes-manifests)
  - [Prod vs Dev Manifest Files](#prod-vs-dev-manifest-files)
  - [Manual Secret Creation](#manual-secret-creation)
  - [Don't Forget Ingress-Nginx!](#dont-forget-ingress-nginx)
  - [Testing Automated Deployment](#testing-automated-deployment)
  - [Additional Deploy Files](#additional-deploy-files)
  - [A Successful Deploy!](#a-successful-deploy)
  - [Buying a Domain Name](#buying-a-domain-name)
  - [Configuring the Domain Name](#configuring-the-domain-name)
  - [One Small Fix](#one-small-fix)
  - [One More Small Fix](#one-more-small-fix)
  - [I Really Hope This Works](#i-really-hope-this-works)
  - [Next Steps](#next-steps)

### Development Workflow

![](section-23/teams.jpg)
![](section-23/branch.jpg)

**[⬆ back to top](#table-of-contents)**

### Git Repository Approaches

- Mono Repo Approach (selected)
- Repo-Per-Service Approach (not selected, many overheads)

![](section-23/mono-repo.jpg)
![](section-23/repo-per-service.jpg)

- copy ticketing folder to Desktop
- open ticketing folder with VS Code
```console
git init
```
- create .gitignore
```git
node_modules
.DS_Store
```
```console
git add .
git commit -m "initial commit"
```
- goto github
- create a new repo: ticketing
- goto ticketing folder
```console
git remote add origin https://github.com/chesterheng/ticketing.git
git push origin master
```
- Refer to https://github.com/chesterheng/ticketing

**[⬆ back to top](#table-of-contents)**

### Creating a GitHub Action

![](section-23/github-action.jpg)

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Events that trigger workflows](https://docs.github.com/en/actions/reference/events-that-trigger-workflows)

```yml
name: tests

on: 
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd auth && npm install && npm run test:ci
```

**[⬆ back to top](#table-of-contents)**

### Adding a CI Test Script

- to run test only one time

```json
  "test:ci": "jest"
```

```console
git status
git add .
git commit -m "463. Adding a CI Test Script"
git pull origin master
git push origin master
```

**[⬆ back to top](#table-of-contents)**

### Running Tests on PR Creation

Local Machine

- Make change to code for tickets service
- Commit code to a git branch (any besides master!)
```console
git branch -m 464-running-tests-on-pr-creation
git add .
git commit -m "464. Running Tests on PR Creation"
git push --set-upstream origin 464-running-tests-on-pr-creation
```
- Push branch to github
![](section-23/run-action-1.jpg)
![](section-23/run-action-2.jpg)

**[⬆ back to top](#table-of-contents)**

### Output of Failing Tests

- Change expect result to make test fails
```console
git add .
git commit -m "465. Output of Failing Tests"
git push
```

Github

- Github receives updated branch
- You manually create a pull request to merge branch into master
- Github automatically runs tests for project

**[⬆ back to top](#table-of-contents)**

### Running Tests in Parallel

```yaml
name: tests-orders

on: 
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd orders && npm install && npm run test:ci
```

```yaml
name: tests-payments

on: 
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd payments && npm install && npm run test:ci
```

```yaml
name: tests-tickets

on: 
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd tickets && npm install && npm run test:ci
```

**[⬆ back to top](#table-of-contents)**

### Verifying a Test Run

- make a change and commit
- push a PR and see 4 tests run in parallel

**[⬆ back to top](#table-of-contents)**

### Selective Test Execution

![](section-23/selective-test-execution.jpg)

- paths parameter
- run auth test if path change is auth folder

```yaml
name: tests-auth

on: 
  pull_request:
    paths:
      - 'auth/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd auth && npm install && npm run test:ci
```

**[⬆ back to top](#table-of-contents)**

### Deployment Options

- A credit card will be required to move forward
- $1 for a domain name, $0.72 a day to run the cluster
- You can probably find a coupon code to pay $0 for the cluster

3 nodes, each with 2gb ram + 1 cpu PLUS EXTRAS

| Digital Ocean      | AWS        | Google Cloud | Azure     |
| ------------------ | ---------- | ------------ | --------- |
| $40/month          | $126/month | $113/month   | $72/month |
| Really easy to use | Hardest    | Easy         | Easy      |

- Digital Ocean is selected

**[⬆ back to top](#table-of-contents)**

### Creating a Hosted Cluster

![](section-23/choose-cluster-capacity.jpg)

**[⬆ back to top](#table-of-contents)**

### Reminder on Kubernetes Context

![](section-23/context.jpg)
![](section-23/doctl.jpg)

- [Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
- [doctl](https://github.com/digitalocean/doctl#installing-doctl)
- doctl auth init

![](section-23/token.jpg)

**[⬆ back to top](#table-of-contents)**

### Reminder on Swapping Contexts

| Action                                  | Command                                                 |
| --------------------------------------- | ------------------------------------------------------- |
| Authenticating with Doctl               | doctl auth init                                         |
| Get connection info for our new cluster | doctl kubernetes cluster kubeconfig save <cluster_name> |
| List all contexts                       | kubectl config view                                     |
| Use a different context                 | kubectl config use-context <context_name>               |

```console
doctl kubernetes cluster kubeconfig save ticketing
kubectl get pods
kubectl get nodes
kubectl config view
kubectl config use-context docker-desktop
kubectl get nodes
kubectl get pods
```

![](section-23/context-2.jpg)

**[⬆ back to top](#table-of-contents)**

### The Deployment Plan

![](section-23/deployment-plan.jpg)

**[⬆ back to top](#table-of-contents)**

### Building an Image in an Action

![](section-23/secrets.jpg)

```yaml
name: deploy-auth

on:
  push:
    branches: 
      - master
    paths:
      - 'auth/**'

jobs:
  build:
   runs-on: ubuntu-latest
   steps:
     - uses: actions/checkout@v2
     - run: cd auth && docker build -t chesterheng/auth .
     - run: docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
       env:
         DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
         DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
     - run: docker push chesterheng/auth
```

**[⬆ back to top](#table-of-contents)**

### Testing the Image Build

- After merge to master
- Build a new auth image
- Push to docker hub

**[⬆ back to top](#table-of-contents)**

### Restarting the Deployment

![](section-23/restart-deployment.jpg)

```yaml
name: deploy-auth

on:
  push:
    branches: 
      - master
    paths:
      - 'auth/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd auth && docker build -t chesterheng/auth .
      - run: docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
      - run: docker push chesterheng/auth
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      - run: doctl kubernetes cluster kubeconfig save ticketing
      - run: kubectl rollout restart deployment auth-depl
```

**[⬆ back to top](#table-of-contents)**

### Applying Kubernetes Manifests

```yaml
name: deploy-manifests

on:
  push:
    branches: 
      - master
    paths:
      - 'infra/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      - run: doctl kubernetes cluster kubeconfig save ticketing
      - run: kubectl apply -f infra/k8s
```

**[⬆ back to top](#table-of-contents)**

### Prod vs Dev Manifest Files

- create k8s-dev folder to store ingress-srv.yaml for development environmemt
- create k8s-prod folder to store ingress-srv.yaml for production environmemt
- 
```yaml
name: deploy-manifests

on:
  push:
    branches: 
      - master
    paths:
      - 'infra/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      - run: doctl kubernetes cluster kubeconfig save ticketing
      - run: kubectl apply -f infra/k8s && kubectl apply -f infra/k8s-prod
```

**[⬆ back to top](#table-of-contents)**

### Manual Secret Creation

```console
kubectl config view
kubectl config use-context do-sgp1-ticketing
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=sadghgjgshdajh
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_...
kubectl get sesrets
```

**[⬆ back to top](#table-of-contents)**

### Don't Forget Ingress-Nginx!

[NGINX Ingress Controller - Digital Ocean](https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean)

```console
kubectl config view
kubectl config use-context do-sgp1-ticketing
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.34.1/deploy/static/provider/do/deploy.yaml
```

**[⬆ back to top](#table-of-contents)**

### Testing Automated Deployment

- make a change in auth folder
- commit the change and do a PR
- merge to master and deploy-auth action will execute
 
**[⬆ back to top](#table-of-contents)**

### Additional Deploy Files

```console
kubectl get pods
kubectl logs auth-depl-db79bbf7f-dsjnr
```
Add in the following similar deploy files

- deploy-client.yaml
- deploy-expiration.yaml
- deploy-orders.yaml
- deploy-payments.yaml
- deploy-tickets.yaml

```yaml
name: deploy-client

on:
  push:
    branches:
      - master
    paths:
      - 'client/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: cd client && docker build -t chesterheng/client .
      - run: docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
      - run: docker push chesterheng/client
      - uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}
      - run: doctl kubernetes cluster kubeconfig save ticketing
      - run: kubectl rollout restart deployment client-depl
```

**[⬆ back to top](#table-of-contents)**

### A Successful Deploy!

- make changes in auth folder
- make changes in client folder
- make changes in expiration folder
- make changes in orders folder
- make changes in payments folder
- make a PR and merge

![](section-23/successful-deploy.jpg)

**[⬆ back to top](#table-of-contents)**

### Buying a Domain Name

![](section-23/load-balancer-1.jpg)
![](section-23/load-balancer-2.jpg)

- [namecheap](https://www.namecheap.com/)

**[⬆ back to top](#table-of-contents)**

### Configuring the Domain Name

![](section-23/domain-name.jpg)

- add digitalocean DNS to domain name
  - ns1.digitalocean.com 
  - ns2.digitalocean.com 
  - ns3.digitalocean.com 

![](section-23/add-domain-name.jpg)
![](section-23/configure-domain.jpg)

- update live domain name at ingress-srv.yaml
```yaml
# k8s/ingress-srv.yaml
- host: www.chesterheng.xyz
```

**[⬆ back to top](#table-of-contents)**

### One Small Fix

[Accessing pods over a managed load-balancer from inside the cluster](https://github.com/digitalocean/digitalocean-cloud-controller-manager/blob/master/docs/controllers/services/examples/README.md#accessing-pods-over-a-managed-load-balancer-from-inside-the-cluster)

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-service
  annotations:
    kubernetes.io/ingress.class: nginx
    nginx.ingress.kubernetes.io/use-regex: 'true'
spec:
  rules:
    - host: www.chesterheng.xyz
      http:
        paths:
          - path: /api/payments/?(.*)
            backend:
              serviceName: payments-srv
              servicePort: 3000
          - path: /api/users/?(.*)
            backend:
              serviceName: auth-srv
              servicePort: 3000
          - path: /api/tickets/?(.*)
            backend:
              serviceName: tickets-srv
              servicePort: 3000
          - path: /api/orders/?(.*)
            backend:
              serviceName: orders-srv
              servicePort: 3000
          - path: /?(.*)
            backend:
              serviceName: client-srv
              servicePort: 3000
---
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/do-loadbalancer-enable-proxy-protocol: 'true'
    service.beta.kubernetes.io/do-loadbalancer-hostname: 'www.chesterheng.xyz'
  labels:
    helm.sh/chart: ingress-nginx-2.0.3
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/version: 0.32.0
    app.kubernetes.io/managed-by: Helm
    app.kubernetes.io/component: controller
  name: ingress-nginx-controller
  namespace: ingress-nginx
spec:
  type: LoadBalancer
  externalTrafficPolicy: Local
  ports:
    - name: http
      port: 80
      protocol: TCP
      targetPort: http
    - name: https
      port: 443
      protocol: TCP
      targetPort: https
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/instance: ingress-nginx
    app.kubernetes.io/component: controller
```

```javascript
// build-client.js
import axios from 'axios';

export default ({ req }) => {
  if(typeof window === 'undefined') {
    // we are on the server

    return axios.create({
      baseURL: 'http://www.chesterheng.xyz',
      headers: req.headers
    });
  } else {
    // we are on the browser

    return axios.create({
      baseURL: ''
    });
  }
};
```

**[⬆ back to top](#table-of-contents)**

### One More Small Fix

You may recall that we configured all of our services to only use cookies when the user is on an HTTPS connection.  This will cause auth to fail while we do this initial deploy of our app, since we don't have HTTPS setup right now.

To disable the HTTPS checking, go to the app.ts file in the auth, orders, tickets, and payments services.  At the cookie-session middleware, change the following:

> secure: process.env.NODE_ENV !== 'test',

to:

> secure: false,

**[⬆ back to top](#table-of-contents)**

### I Really Hope This Works

Goto chrome. Key in www.chesterheng.xyz to test

**[⬆ back to top](#table-of-contents)**

### Next Steps

Destroy 

- load balancer - $10/month
- kubernetes cluster - $30/month

![](section-23/destroy-load-balancer.jpg)
![](section-23/destroy-kubernetes-cluster.jpg)

| Feature                                   | Details                                                                                                                                                                                                                                              |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Add in HTTPS                              | See cert-manager.io                                                                                                                                                                                                                                  |
| Add in Email Support                      | Send a user an email after they have paid for an order.  Create a new service using Mailchimp/Sendgrid/similar                                                                                                                                       |
| Add in 'build' steps for our prod cluster | Right now we are still running our services + the client in 'dev' mode.  Add in additional Dockerfiles to build each service prior to deployment                                                                                                     |
| Create a staging cluster                  | Our teammates might want to test out our app manually before we deploy it.  Maybe we could add in a new Github workflow to watch for pushes to a new branch of 'staging'.  Create a new cluster that you will deploy to when you push to this branch |

**[⬆ back to top](#table-of-contents)**