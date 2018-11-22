import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import app from '../server/index';
import db from '../server/db/connection';

import { signUpTestData, signInTestData } from './mockdata/userMockData';
import parcelTestData from './mockdata/parcelMockData';

let userToken;
let regUserId;
let adminToken;
let adminUserId;
let parcelId;

const { expect } = chai;
chai.use(chaiHttp);

describe('Integration testing', () => {
  before(async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signUpTestData.expectedData1);
    userToken = res.body.token;
    regUserId = res.body.user.userid;
  });

  before(async () => {
    const {
      userId, email, password, phoneNo, fullname, isAdmin,
    } = signUpTestData.expectedData2;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      `INSERT INTO users (userId, email, password, phoneNo, fullname, isAdmin)
       values ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, email, hashedPassword, phoneNo, fullname, isAdmin]
    );

    const response = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signInTestData.validData2);
    adminToken = response.body.token;
    adminUserId = response.body.user.userid;
  });

  beforeEach((done) => {
    chai.request(app)
      .post('/api/v1/parcels')
      .set('x-auth-token', userToken)
      .send(parcelTestData.expectedData)
      .end((err, res) => {
        parcelId = res.body.parcelid;
        done();
      });
  });

  after(async () => {
    await db.query('TRUNCATE TABLE users, parcelOrders');
  });
  // POST /api/v1/parcels test
  describe('create-parcel-delivery-order endpoint', () => {
    it('should respond with a 400 (Bad request) status code if all required parameters are not provided by a user', (done) => {
      chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth-token', userToken)
        .send(parcelTestData.incompleteData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });

    it('should respond with a 400 (Bad request) status code if unwanted parameters are provided by a user', (done) => {
      chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth-token', userToken)
        .send(parcelTestData.unwantedParams)
        .end((err, res) => {
          expect(res.body.message).match(/Unwanted parameter/i);
          expect(res).to.have.status(400);
          done();
        });
    });


    it('should respond with a 400 (Bad request) status code if the data is improper', (done) => {
      chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth-token', userToken)
        .send(parcelTestData.improperData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          return done();
        });
    });

    it('should respond with a 401 (Unauthorized) status code if no authentication token was provided', (done) => {
      chai.request(app)
        .post('/api/v1/parcels')
        .send(parcelTestData.expectedData)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 401 (Unauthorized) status code if an invalid authentication token was provided', (done) => {
      chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth-token', `${userToken}fjfjfj84`)
        .send(parcelTestData.expectedData)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 200 success status code and create the delivery order if the data is correct', (done) => {
      chai.request(app)
        .post('/api/v1/parcels')
        .set('x-auth-token', userToken)
        .send(parcelTestData.expectedData)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.includes.all.keys('userid', 'status', 'pickupaddress', 'destination', 'pickuptime', 'parceldescription', 'parcelweight');
          done();
        });
    });
  });

  // GET /api/v1/parcels test
  describe('fetch all parcel delivery orders', () => {
    it('should respond with a 401(Unauthorized) status code if no token was provided by the user', (done) => {
      chai.request(app)
        .get('/api/v1/parcels')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 401 (Unauthorized) status code if an invalid authentication token was provided', (done) => {
      chai.request(app)
        .get('/api/v1/parcels')
        .set('x-auth-token', `${userToken}fjfjfj84`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 403 (Forbidden) status code if the token provided is not an admin token', (done) => {
      chai.request(app)
        .get('/api/v1/parcels')
        .set('x-auth-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should fetch all parcel delivery orders if the user proves to be an admin', (done) => {
      chai.request(app)
        .get('/api/v1/parcels')
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  // GET /api/v1/users/<userId>/parcels
  describe('GET all parcel delivery orders for a specific user', () => {
    it('should respond with a 401(Unauthorized) status code if no token was provided by the user', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${regUserId}/parcels`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 401 (Unauthorized) status code if an invalid authentication token was provided', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${regUserId}/parcels`)
        .set('x-auth-token', `${userToken}fjfjfj84`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 403 (Forbidden) status code if the authentication token is valid but its id does not match the id in the request', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${adminUserId}/parcels`)
        .set('x-auth-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.message).match(/forbidden/i);
          done();
        });
    });


    it('should respond with a 404 (Not found) status code if there are no orders found for the user', (done) => {
      // user has no orders yet
      chai.request(app)
        .get(`/api/v1/users/${adminUserId}/parcels`)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).match(/no orders/i);
          done();
        });
    });

    it('should respond with a 200 (success) status code and return all orders for a user if the user passes the authentication and has some orders', (done) => {
      chai.request(app)
        .get(`/api/v1/users/${regUserId}/parcels`)
        .set('x-auth-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  // GET /api/v1/parcels/:id test
  describe('fetch-specific-delivery-order endpoint', () => {
    it('should respond with a 401(Unauthorized) status code if no token was provided by the user', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/1')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 401 (Unauthorized) status code if an invalid authentication token was provided', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/1')
        .set('x-auth-token', `${userToken}fjfjfj84`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 404 (Not found) status code if a valid token was provided but the order is not found', (done) => {
      chai.request(app)
      // request with invalid parcel id : 1000000
        .get('/api/v1/parcels/1000000')
        .set('x-auth-token', `${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Order not found');
          return done();
        });
    });

    it('should respond with a 200 success status code if there is an order with the specified id', (done) => {
      chai.request(app)
      // request with valid parcel id
        .get(`/api/v1/parcels/${parcelId}`)
        .set('x-auth-token', `${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.includes.all.keys('userid', 'status', 'pickupaddress', 'destination', 'pickuptime', 'parceldescription', 'parcelweight');
          return done();
        });
    });
  });

  // PUT /api/v1/parcels/:parcelId/cancel test
  describe('cancel-parcel-delivery-order endpoint', () => {
    it('should respond with a 401(Unauthorized) status code if no token was provided by the user', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/cancel')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 401 (Unauthorized) status code if an invalid authentication token was provided', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/cancel')
        .set('x-auth-token', `${userToken}fjfjfj84`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 404 (Not found) status code if a valid token was provided but the order requested to be cancelled is not found', (done) => {
      chai.request(app)
      // request with invalid parcel id : 1000000
        .put('/api/v1/parcels/1000000/cancel')
        .set('x-auth-token', `${userToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Order not found');
          return done();
        });
    });
  });

  it('should respond with a 200 (success) status code and return the updated order data if authentication was passed and the order was found ', (done) => {
    chai.request(app)
    // valid parcel id: 3
      .put(`/api/v1/parcels/${parcelId}/cancel`)
      .set('x-auth-token', `${userToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('cancelled');
        return done();
      });
  });


  // POST /api/v1/auth/signup
  describe('signup user endpoint', () => {
    it('should respond with a 400 (Bad request) status code if all required parameters are not provided by a user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(signUpTestData.incompleteData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).match(/Incomplete request/i);
          return done();
        });
    });

    it('should respond with a 400 (Bad request) status code if unwanted parameters are provided by a user', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(signUpTestData.unwantedParams)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).match(/Unwanted parameter/i);
          return done();
        });
    });


    it('should respond with a 400 (Bad request) status code if the data is improper', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(signUpTestData.invalidData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          return done();
        });
    });

    it('should respond with a 200 success status code and sign up the user if the data provided is okay', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send(signUpTestData.expectedData3)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body.user).to.includes.all.keys('phoneno', 'email', 'password', 'fullname', 'userid');
          expect(res.body.token);
          return done();
        });
    });
  });

  // POST /api/v1/auth/signin
  describe('sign in user endpoint', () => {
    it('should respond with a 401 (Unauthorized) status code if the login data is invalid', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(signInTestData.invalidData)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/Invalid email or password/i);
          return done();
        });
    });

    it('should respond with a 200 success status code and sign in the user if the login data provided is valid', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send(signInTestData.validData1)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).match(/Welcome/i);
          return done();
        });
    });
  });

  // PUT /api/v1/parcels/<parcelId>/status
  describe('Change delivery status endpoint', () => {
    it('should respond with a 401(Unauthorized) status code if no token was provided by the user', (done) => {
      chai.request(app)
        .put(`/api/v1/parcels/${parcelId}/status`)
        .send({ status: 'in transit' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 401 (Unauthorized) status code if an invalid authentication token was provided', (done) => {
      chai.request(app)
        .put(`/api/v1/parcels/${parcelId}/status`)
        .set('x-auth-token', `${userToken}fjfjfj84`)
        .send({ status: 'delivered' })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 403 (Forbidden) status code if the authentication token is valid but not an admin token', (done) => {
      chai.request(app)
        .put(`/api/v1/parcels/${parcelId}/status`)
        .set('x-auth-token', userToken)
        .send({ status: 'delivered' })
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 404 (not found) status code if the token is for an admin but the order was not found', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/200/status')
        .set('x-auth-token', adminToken)
        .send({ status: 'delivered' })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).match(/not found/i);
          done();
        });
    });

    it('should respond with a 400 (bad request) status code if the status value is invalid', (done) => {
      chai.request(app)
        .put(`/api/v1/parcels/${parcelId}/status`)
        .set('x-auth-token', adminToken)
        .send({ status: 'sleeping' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).match(/invalid/i);
          done();
        });
    });

    it('should respond with a 400 (success) status code if the status is in transit but no present location was provided', (done) => {
      chai.request(app)
        .put(`/api/v1/parcels/${parcelId}/status`)
        .set('x-auth-token', adminToken)
        .send({ status: 'in transit' })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.message).to.equal("Changing the status to 'in transit' requires a 'present location', value");
          done();
        });
    });

    it('should respond with a 200 (success) status code if the status value is valid, update the database and return the updated data', (done) => {
      chai.request(app)
        .put(`/api/v1/parcels/${parcelId}/status`)
        .set('x-auth-token', adminToken)
        .send({ status: 'in transit', presentLocation: 'Badagary' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('in transit');
          done();
        });
    });
  });

  describe('change destination endpoint', () => {
    it('should respond with a 401(Unauthorized) status code if no token was provided by the user', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/destination')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 401 (Unauthorized) status code if an invalid authentication token was provided', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/destination')
        .set('x-auth-token', `${userToken}fjfjfj84`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).match(/access denied/i);
          done();
        });
    });

    it('should respond with a 404 (not found) status code if the user passes authentication but the parcel order is not found', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/100000/destination')
        .set('x-auth-token', userToken)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).match(/not found/i);
          done();
        });
    });
  });
});
