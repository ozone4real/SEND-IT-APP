'use strict';

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _testHelper = require('./testHelper');

var _index = require('../server/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// POST /api/v1/parcels test
describe('create-parcel-delivery-order endpoint', function () {
  it('should respond with a 400 (Bad request) status code if all required parameters are not provided by a user', function (done) {
    (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(_testHelper.incompleteData).expect(400).expect(function (res) {
      expect(res.body.message).toBe('Incomplete request');
    }).end(function () {
      done();
    });
  });

  it('should respond with a 400 (Bad request) status code if the data is improper', function (done) {
    (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(_testHelper.improperData).expect(400).expect(function (res) {
      expect(res.body.message).toBe('Improper data provided');
    }).end(function () {
      done();
    });
  });

  it('should respond with a 200 success status code and create the delivery order if the data is correct', function (done) {
    (0, _supertest2.default)(_index2.default).post('/api/v1/parcels').send(_testHelper.expectedData).expect(200).expect(function (res) {
      var dataKeys = Object.keys(res.body);
      expect(datakeys).toEqual(jasmine.arrayContaining(['userId', 'status', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription']));
    }).end(function () {
      done();
    });
  });
});

// GET /api/v1/parcels test
describe('fetch all parcel delivery orders', function () {
  it('should respond with a 200 success status code and return all the parcel delivery orders data', function (done) {
    (0, _supertest2.default)(_index2.default).get('/api/v1/parcels').expect(200).expect(function (res) {
      expect(res.body).toEqual(jasmine.arrayContaining([jasmine.any(Object)]));
    }).end(function () {
      done();
    });
  });
});

describe('GET all parcel delivery orders for a specific user', function () {
  it('should respond with a 404 (Not found) status code if there are no orders found for the user', function (done) {
    (0, _supertest2.default)(_index2.default)
    // request with an invalid user id : 'aaaak'
    .get('/api/v1/users/:aaaak/parcels').expect(404).expect(function (res) {
      expect(res.body.message).toBe('No orders found for user');
    }).end(function () {
      done();
    });
  });

  it('should respond with a 200 (success) status code and return all orders for a user if there are any', function (done) {
    (0, _supertest2.default)(_index2.default)
    // request with a valid user id : 'ayzay'
    .get('/api/v1/users/ayzay/parcels').expect(200).expect(function (res) {
      expect(res.body).toEqual(jasmine.arrayContaining([jasmine.any(Object)]));
    }).end(function () {
      done();
    });
  });
});

// GET /api/v1/parcels/:id test
describe('fetch-specific-delivery-order endpoint', function () {
  it('should respond with a 404 (Not found) status code if the order is not found', function (done) {
    (0, _supertest2.default)(_index2.default)
    // request with invalid parcel id : 1000000
    .get('/api/v1/parcels/1000000').expect(404).expect(function (res) {
      expect(res.body.message).toBe('Order not found');
    }).end(function () {
      done();
    });
  });

  it('should respond with a 200 success status code if the order is found', function (done) {
    (0, _supertest2.default)(_index2.default)
    // request with valid parcel id
    .get('/api/v1/parcels/1').expect(200).expect(function (res) {
      var dataKeys = Object.keys(res.body);
      expect(dataKeys).toEqual(jasmine.arrayContaining(['userId', 'status', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription']));
    }).end(function () {
      done();
    });
  });
});

// PUT /api/v1/parcels/:parcelId/cancel test
describe('cancel-parcel-delivery-order endpoint', function () {
  it('should respond with a 404 (Not found) status code if the order requested to be cancelled is not found', function (done) {
    (0, _supertest2.default)(_index2.default)
    // invalid parcel id : p089
    .put('/api/v1/parcels/p089/cancel').expect(404).expect(function (res) {
      expect(res.body.message).toBe('Order not found');
    }).end(function () {
      done();
    });
  });
});

it('should respond with a 200 (success) status code if the order was found and return the updated order data', function (done) {
  (0, _supertest2.default)(_index2.default)
  // valid parcel id: 1
  .put('/api/v1/parcels/1/cancel').expect(function (res) {
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('cancelled');
  }).end(function () {
    done();
  });
});