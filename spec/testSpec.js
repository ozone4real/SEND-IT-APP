import { get, post, put } from 'request';
import { incompleteData, improperData, expectedData } from './testHelper';


describe('fetch all parcel delivery orders', () => {
  it('should respond with a 200 success status code and return all the parcel delivery orders data', (done) => {
    get('http://localhost:8000/api/v1/parcels', (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(body)).toEqual(jasmine.arrayContaining([jasmine.any(Object)]));
      done();
    });
  });
});



describe('cancel-parcel-delivery-order endpoint', () => {
  it('should respond with a 404 (Not found) status code if the order requested to be cancelled is not found', (done) => {
    // invalid parcel id : p089
    put('http://localhost:8000/api/v1/parcels/p089/cancel', (error, response, body) => {
       expect(response.statusCode).toBe(404);
      expect(body).toBe('Order not found');
      done();
    });
  });
   it('should respond with a 200 (success) status code if the order was found and return the updated order data', (done) => {
     put('http://localhost:8000/api/v1/parcels/1/cancel', (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(body)).toEqual(jasmine.objectContaining({ status: 'cancelled' }));
       done();
    });
  });
});
      

describe('fetch-specific-delivery-order endpoint', () => {
  it('should respond with a 404 (Not found) status code if the order is not found', (done) => {
    // request with invalid parcel id
    get('http://localhost:8000/api/v1/parcels/1000000', (error, response, body) => {
      expect(response.statusCode).toBe(404);
      expect(body).toBe('Order not found');
      done();
    });
  });
  
  it('should respond with a 200 success status code if the order is found', (done) => {
    // request with valid parcel id
    get('http://localhost:8000/api/v1/parcels/1', (error, response, body) => {
      const dataKeys = Object.keys(JSON.parse(body));
      expect(response.statusCode).toBe(200);
      expect(dataKeys).toEqual(jasmine.arrayContaining(['userId', 'status', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription']));
      done();
    });
  });
});


describe('GET all parcel delivery orders for a specific user', () => {
  it('should respond with a 404 (Not found) status code if there are no orders found for the user', (done) => {
    // request with an invalid user id : 'aaaak'
    get('http://localhost:8000/api/v1/users/:aaaak/parcels', (error, response, body) => {
      expect(response.statusCode).toBe(404);
      expect(body).toBe('No orders found for user');
      done();
    });
  });

  it('should respond with a 200 (success) status code and return all orders for a user if there are any', (done) => {
    // request with a valid user id : 'ayzay'
    get('http://localhost:8000/api/v1/users/ayzay/parcels', (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(body)).toEqual(jasmine.arrayContaining([jasmine.any(Object)]));
      done();
    });
  });
});


describe('create-parcel-delivery-order endpoint', () => {
  it('should respond with a 400 (Bad request) status code if all required parameters are not provided by a user', (done) => {
    post({ url: 'http://localhost:8000/api/v1/parcels', form: incompleteData }, (error, response, body) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it('should respond with a 400 (Bad request) status code if the data is improper', (done) => {
    post({ url: 'http://localhost:8000/api/v1/parcels', form: improperData }, (error, response, body) => {
      expect(response.statusCode).toBe(400);
      done();
    });
  });
  it('should respond with a 200 success status code and create the delivery order if the data is correct', (done) => {
    post({ url: 'http://localhost:8000/api/v1/parcels', form: expectedData }, (error, response, body) => {
      const dataKeys = Object.keys(JSON.parse(body));
      expect(response.statusCode).toBe(200);
      expect(dataKeys).toEqual(jasmine.arrayContaining(['userId', 'pickupAddress', 'deliveryAddress', 'deliveryTime', 'parcelDescription']));
      done();
    });
  });
});
