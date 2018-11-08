import { get } from 'request';

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
