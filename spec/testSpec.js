import { post } from 'request';
import { incompleteData, improperData, expectedData } from './testHelper';

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
