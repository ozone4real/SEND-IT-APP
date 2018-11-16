import { expect } from 'chai';
import request from 'supertest';
import app from '../server/index';

import { userTestData, signInTestData } from './mockdata/userMockData';
import parcelTestData from './mockdata/parcelMockData';

// POST /api/v1/parcels test
describe('create-parcel-delivery-order endpoint', () => {
  it('should respond with a 400 (Bad request) status code if all required parameters are not provided by a user', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send(parcelTestData.incompleteData)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).match(/Incomplete request/i);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with a 400 (Bad request) status code if unwanted parameters are provided by a user', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send(parcelTestData.unwantedParams)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).match(/Unwanted parameter/i);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });


  it('should respond with a 400 (Bad request) status code if the data is improper', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send(parcelTestData.improperData)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with a 200 success status code and create the delivery order if the data is correct', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send(parcelTestData.expectedData)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.includes.all.keys('userId', 'status', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});

// GET /api/v1/parcels test
describe('fetch all parcel delivery orders', () => {
  it('should respond with a 200 success status code and return all the parcel delivery orders data', (done) => {
    request(app)
      .get('/api/v1/parcels')
      .expect(200)
      .expect((res) => {
        expect(res.body).to.be.an('array');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});

describe('GET all parcel delivery orders for a specific user', () => {
  it('should respond with a 404 (Not found) status code if there are no orders found for the user', (done) => {
    request(app)
    // request with an invalid user id : 'aaaak'
      .get('/api/v1/users/:aaaak/parcels')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).to.equal('No orders found for user');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with a 200 (success) status code and return all orders for a user if there are any', (done) => {
    request(app)
    // request with a valid user id : 'ayzay'
      .get('/api/v1/users/ayzay/parcels')
      .expect(200)
      .expect((res) => {
        expect(res.body).to.be.an('array');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});

// GET /api/v1/parcels/:id test
describe('fetch-specific-delivery-order endpoint', () => {
  it('should respond with a 404 (Not found) status code if the order is not found', (done) => {
    request(app)
    // request with invalid parcel id : 1000000
      .get('/api/v1/parcels/1000000')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).to.equal('Order not found');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with a 200 success status code if the order is found', (done) => {
    request(app)
    // request with valid parcel id
      .get('/api/v1/parcels/1')
      .expect(200)
      .expect((res) => {
        expect(res.body).to.includes.all.keys('userId', 'status', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});

// PUT /api/v1/parcels/:parcelId/cancel test
describe('cancel-parcel-delivery-order endpoint', () => {
  it('should respond with a 404 (Not found) status code if the order requested to be cancelled is not found', (done) => {
    request(app)
    // invalid parcel id : p089
      .put('/api/v1/parcels/p089/cancel')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).to.equal('Order not found');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});

it('should respond with a 200 (success) status code if the order was found and return the updated order data', (done) => {
  request(app)
  // valid parcel id: 1
    .put('/api/v1/parcels/1/cancel')
    .expect(200)
    .expect((res) => {
      expect(res.body.status).to.equal('cancelled');
    })
    .end((err) => {
      if (err) return done(err);
      return done();
    });
});


// POST /api/v1/auth/signup
describe('signup user endpoint', () => {
  it('should respond with a 400 (Bad request) status code if all required parameters are not provided by a user', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(userTestData.incompleteData)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).match(/Incomplete request/i);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with a 400 (Bad request) status code if unwanted parameters are provided by a user', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(userTestData.unwantedParams)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).match(/Unwanted parameter/i);
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });


  it('should respond with a 400 (Bad request) status code if the data is improper', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(signInTestData.invalidData)
      .expect(400)
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with a 200 success status code and sign up the user if the data provided is okay', (done) => {
    request(app)
      .post('/api/v1/auth/signup')
      .send(userTestData.expectedData)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.includes.all.keys('phoneNo', 'email', 'password', 'fullname', 'userId');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});

// POST /api/v1/auth/signup
describe('sign in user endpoint', () => {
  it('should respond with a 401 (Unauthorized) status code if the login data is invalid', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send(signInTestData.invalidData)
      .expect(401)
      .expect((res) => {
        expect(res.body.message).to.equal('Invalid email or password');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });

  it('should respond with a 200 success status code and sign in the user if the login data provided is valid', (done) => {
    request(app)
      .post('/api/v1/auth/signin')
      .send(signInTestData.validData)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).to.equal('login successful');
      })
      .end((err) => {
        if (err) return done(err);
        return done();
      });
  });
});
