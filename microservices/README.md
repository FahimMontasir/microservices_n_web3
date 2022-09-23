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
