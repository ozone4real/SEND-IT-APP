import { get } from 'request';

describe('fetch all parcel delivery orders', () => {
  it('should respond with a 200 success status code and return all the parcel delivery orders data', (done) => {
    get('http://localhost:8000/api/v1/parcels', (error, response, body) => {
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(body)).toEqual(jasmine.arrayContaining([jasmine.any(Object)]));
      done();
    });
  });
});
