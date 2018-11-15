import {expect} from 'chai';
import request from 'supertest';
import app from '../server/index';

import userTestData from './mockdata/userMockData';

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
          if(err)return done(err);
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
          if(err)return done(err);
          return done();
        });
    });
  
  
    it('should respond with a 400 (Bad request) status code if the data is improper', (done) => {
      request(app)
        .post('/api/v1/auth/signup')
        .send(userTestData.improperData)
        .expect(400)
        .end((err) => {
          if(err)return done(err);
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
          if(err)return done(err);
          return done();
        });
    });
  });
  
  