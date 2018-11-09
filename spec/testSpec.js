import { put } from 'request';

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
