## **Section 01: Fundamental Ideas Around Microservices**

## Table of Contents
- [**Section 01: Fundamental Ideas Around Microservices**](#section-01-fundamental-ideas-around-microservices)
- [Table of Contents](#table-of-contents)
  - [What Is a Microservice?](#what-is-a-microservice)
  - [Data in Microservices](#data-in-microservices)
  - [Big Problems with Data](#big-problems-with-data)
  - [Sync Communication Between Services](#sync-communication-between-services)
  - [Async: Event-Based Communication](#async-event-based-communication)
  - [Async: A Crazy Way of Storing Data](#async-a-crazy-way-of-storing-data)
  - [Pros and Cons of Async Communication](#pros-and-cons-of-async-communication)

### What Is a Microservice?

A monolith contains

- Routing
- Middleware
- Business Logic
- Database access
to implement all features of our app

![](section-01/monolith-server.jpg)

A single microservice contains

- Routing
- Middleware
- Business Logic
- Database access
to implement one feature of our app

![](section-01/single-microservice.jpg)


- Microservices are basiclly software broken into functional components, components that are independent, autonomous processes and are not dependents on others. You no longer have one huge app and a databases. You have decentralised data management. Each component should be replaceable and upgradable
- Best resource to start with microservices is Martin Fowley :)
- [Microservices](https://martinfowler.com/articles/microservices.html)
- [Microservices Guide](https://martinfowler.com/microservices/)

**[⬆ back to top](#table-of-contents)**

### Data in Microservices

Data management between services

- This is the big problem of microservices, and what 90% of this course focuses on

With microservices, we store and access data in sort of strange way. Let's look at 

- how we store data: Each service gets its own database (if it needs one) 
- how we access it: Services will never, ever reach into another services database

![](section-01/store-data.jpg)
![](section-01/access-data.jpg)

Why Database-Per-Service pattern?

- We want each service to run independently of other services
![](section-01/common-database.jpg)
![](section-01/service-dependent.jpg)
- Database schema/structure might change unexpectedly
![](section-01/schema-change.jpg)
- Some services might function more efficiently with different types of DB's (sql vs nosql)

**[⬆ back to top](#table-of-contents)**

### Big Problems with Data

![](section-01/basic-ecommerce-app.jpg)
![](section-01/monolithic-server-example.jpg)
![](section-01/monolithic-server-addon.jpg)
![](section-01/microservices-addon.jpg)

**[⬆ back to top](#table-of-contents)**

### Sync Communication Between Services

Communication Strategies Between Services
- Sync: Services communicate with each other using direct requests
- Async: Services communicate with each other using events

These two serve different purpose.
- direct HTTP calls create a dependancy between your services, and if so you have to ask yourself if in the end it's not the same service that you artificially split.
- using event or queues you have to be aware that it may takes some time before the second service has the information available to use.
- In the end the means of communication describe how close the two service are. In my experience, two services with databases may be used asynchronously because they have their data state. If you have no local database, then you need someone to provide them synchronously. (this is just an simple example, it always depends xD)

- Event is from source to destination while requests is for destination to source.
- Request : someone ask for information
- Event : someone notify information to registered client

Depends on the use case

- Prefer event based when there are more subscribers to be notified of an event
- Prefer direct requests for something like service aggregation

Notes on Sync Communication

| Pro                              | Con                                                           |
| -------------------------------- | ------------------------------------------------------------- |
| Conceptually easy to understand! | Introduces a dependency between services                      |
| Service D won't need a database! | If any inter-service request fails, the overall request fails |
|                                  | The entire request is only as fast as the slowest request     |
|                                  | Can easily introduce webs of requests                         |

![](section-01/sync-communication.jpg)
![](section-01/webs-of-requests.jpg)

**[⬆ back to top](#table-of-contents)**

### Async: Event-Based Communication

![](section-01/event-bus.jpg)

**[⬆ back to top](#table-of-contents)**

### Async: A Crazy Way of Storing Data

Service D: Code to show products ordered by a particular user
Let's refine the exact goal of this service
Service D: Given the ID of a user, show the title and image for every product they have ever ordered

![](section-01/service-d-db.jpg)
![](section-01/service-d-db-implement.jpg)
![](section-01/request-create-product.jpg)
![](section-01/request-signup.jpg)
![](section-01/request-order-product.jpg)

**[⬆ back to top](#table-of-contents)**

### Pros and Cons of Async Communication

| Pros                                               | Cons                 |
| -------------------------------------------------- | -------------------- |
| Service D has zero dependencies on other services! | Data duplication.    |
| Service D will be extremely fast!                  | Harder to understand |

**[⬆ back to top](#table-of-contents)**