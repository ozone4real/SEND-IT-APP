[![Build Status](https://travis-ci.org/ozone4real/SEND-IT-APP.svg?branch=develope)](https://travis-ci.org/ozone4real/SEND-IT-APP)[![Maintainability](https://api.codeclimate.com/v1/badges/67cef4b78d4744b3d303/maintainability)](https://codeclimate.com/github/ozone4real/SEND-IT-APP/maintainability)
[![Coverage Status](https://coveralls.io/repos/github/ozone4real/SEND-IT-APP/badge.svg?branch=develope)](https://coveralls.io/github/ozone4real/SEND-IT-APP?branch=develope)

https://ozone4real.github.io
# SEND-IT-APP
SendIT is a courier service that helps users deliver parcels to different destinations. SendIT provides courier quotes based on weight categories.



### IMPLEMENTED FEATURES

 * Users can Sign up and Sign in.
 * Users can create a parcel delivery order
 * Users can change the destination of a parcel delivery order.
 * Users can cancel a parcel delivery order.
 * Users can see the details of a delivery order</li>
 * Admin can change the status and present location of a parcel delivery order.
 


### USER INTERFACE

User interface is hosted <a href= "https://ozone4real.github.io/SEND-IT-APP/UI/">here</a>.



### TECHNOLOGIES USED

**User Interface**
* Hyper Text Mark-up Language
* Cascading Styles Sheet
* Javascript

#### Server-side API ####
* <a href= "https://nodeJS.org">NodeJS</a>  - A runtime environment based off of Chrome's V8 Engine for writing Javascript code on the server.
* <a href="https://expressJS.com">ExpressJS</a>  - A Web framework based on Node.js.
    
**Development Tools**
* <a href="https://babeljs.io">Babel</a> - A javascript transpiler.
* <a href = "https://eslint.org/">ESlint</a> - A javascript code linting library.
* <a href = "https://https://github.com/airbnb/javascript">Airbnb</a> - ESlint style guide.

**Testing tools**
* <a href="https://jasmine.github.io/">Jasmine</a> - A Javascript testing framework.
* <a href= "https://www.npmjs.com/package/supertest">Supertests</a> - Request module for testing HTTP servers.



### API INFORMATION

|   METHOD      |  DESCRIPTION   | ENDPOINT                    |
| ------------- | -------------- |-----------------------------|
|   GET         | GET all orders |`GET /api/v1/parcels/`          |
|   GET         | GET a particular order  |`GET /api/v1/parcels/<parcelId>`|
|   POST        | Create an order|`POST /api/v1/parcels`          |
|   GET         | GET all orders by a user|`GET /api/v1/users/<userId>/parcels`|
|   PUT         |Cancel an order |`PUT /api/v1/parcels/<parcelId>`|
 
 
### HOW TO INSTALL THIS APP

**Installation**
* Install the latest version of <a href="https://nodejs.org">nodeJS</a>
* Clone this repository using git clone https://github.com/ozone4real/SEND-IT-APP.git 
* Run npm install to install all dependencies.
* Run npm start to start the server.
* Navigate to `localhost:8000/api/v1` in your browser to access the application.

**Testing**
* Install <a href="https://www.getpostman.com/apps">Postman</a>
* Test the endpoints manually by sending requests to `localhost:8000/endpoint`
* Run `npm test` on your local terminal to test automatically.

### AUTHOR
Ogbonna Ezenwa.

**Twitter handle**: `@ozonkwo`


