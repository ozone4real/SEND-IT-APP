require 'coveralls'
Coveralls.wear!

import request from 'supertest';

import { incompleteData, improperData, expectedData } from './testHelper';
import app from '../server/index';


// POST /api/v1/parcels test
describe('create-parcel-delivery-order endpoint', () => {
  it('should respond with a 400 (Bad request) status code if all required parameters are not provided by a user', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send(incompleteData)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Incomplete request');
      })
      .end(() => {
        done();
      });
  });

  it('should respond with a 400 (Bad request) status code if the data is improper', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send(improperData)
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe('Improper data provided');
      })
      .end(() => {
        done();
      });
  });

  it('should respond with a 200 success status code and create the delivery order if the data is correct', (done) => {
    request(app)
      .post('/api/v1/parcels')
      .send(expectedData)
      .expect(200)
      .expect((res) => {
        const dataKeys = Object.keys(res.body);
        expect(datakeys).toEqual(jasmine.arrayContaining(['userId', 'status', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription']));
      })
      .end(() => {
        done();
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
        expect(res.body).toEqual(jasmine.arrayContaining([jasmine.any(Object)]));
      })
      .end(() => { done(); });
  });
});

describe('GET all parcel delivery orders for a specific user', () => {
  it('should respond with a 404 (Not found) status code if there are no orders found for the user', (done) => {
    request(app)
    // request with an invalid user id : 'aaaak'
      .get('/api/v1/users/:aaaak/parcels')
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('No orders found for user');
      })
      .end(() => {
        done();
      });
  });

  it('should respond with a 200 (success) status code and return all orders for a user if there are any', (done) => {
    request(app)
    // request with a valid user id : 'ayzay'
      .get('/api/v1/users/ayzay/parcels')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(jasmine.arrayContaining([jasmine.any(Object)]));
      })
      .end(() => {
        done();
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
        expect(res.body.message).toBe('Order not found');
      })
      .end(() => {
        done();
      });
  });

  it('should respond with a 200 success status code if the order is found', (done) => {
    request(app)
    // request with valid parcel id
      .get('/api/v1/parcels/1')
      .expect(200)
      .expect((res) => {
        const dataKeys = Object.keys(res.body);
        expect(dataKeys).toEqual(jasmine.arrayContaining(['userId', 'status', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription']));
      })
      .end(() => {
        done();
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
        expect(res.body.message).toBe('Order not found');
      })
      .end(() => {
        done();
      });
  });
});

it('should respond with a 200 (success) status code if the order was found and return the updated order data', (done) => {
  request(app)
  // valid parcel id: 1
    .put('/api/v1/parcels/1/cancel')
    .expect((res) => {
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('cancelled');
    })
    .end(() => {
      done();
    });
});
