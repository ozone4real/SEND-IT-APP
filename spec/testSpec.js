import { get } from 'request';

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
