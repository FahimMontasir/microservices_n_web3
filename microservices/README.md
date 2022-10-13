# micro services

## Fundamental idea about micro services

1. `monolith architecture:` where we have only one data connected to all features
2. `micro services architecture:` a single microservice contains routing, middleware,
   business login, db to implement `one feature` of our app

### data management

1. each services gets its own database(if needed)
2. services will never ever reach another services database
3. one database per service
4. communication strategy:
   1. `sync`: services communicate with each other by using direct request (not a good approach)
   2. `async`: services communicate each other using events
      1. using event bus (bad approach)
      2. crazy way: add to collection and simultaneously emit an event (best)

# Microservices with Node JS and React Study Guide

## [**Section 01: Fundamental Ideas Around Microservices**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-01.md)

## [**Section 02: A Mini-Microservices App**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-02.md)

## [**Section 03: Running Services with Docker**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-03.md)

## [**Section 04: Orchestrating Collections of Services with Kubernetes**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-04.md)

## [**Section 05: Architecture of Multi-Service Apps**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-05.md)

## [**Section 06: Leveraging a Cloud Environment for Development**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-06.md)

## [**Section 07: Response Normalization Strategies**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-07.md)

## [**Section 08: Database Management and Modeling**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-08.md)

## [**Section 09: Authentication Strategies and Options**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-09.md)

## [**Section 10: Testing Isolated Microservices**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-10.md)

## [**Section 11: Integrating a Server-Side-Rendered React App**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-11.md)

## [**Section 12: Code Sharing and Reuse Between Services**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-12.md)

## [**Section 13: Create-Read-Update-Destroy Server Setup**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-13.md)

## [**Section 14: NATS Streaming Server - An Event Bus Implementation**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-14.md)

## [**Section 15: Connecting to NATS in a Node JS World**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-15.md)

## [**Section 16: Managing a NATS Client**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-16.md)

## [**Section 17: Cross-Service Data Replication In Action**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-17.md)

## [**Section 18: Understanding Event Flow**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-18.md)

## [**Section 19: Listening for Events and Handling Concurrency Issues**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-19.md)

## [**Section 20: Worker Services**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-20.md)

## [**Section 21: Handling Payments**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-21.md)

## [**Section 22: Back to the Client**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-22.md)

## [**Section 23: CI/CD**](https://github.com/FahimMontasir/microservices_n_web3/tree/master/microservices/docs/section-23.md)
