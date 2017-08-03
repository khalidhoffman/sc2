const supertest = require('supertest');
const chai = require('chai');

const Server = require('../');

const expect = chai.expect;
const testServer = new Server();
const request = supertest(testServer.toNativeServer());

describe('/api', function () {

    describe('POST /query/playlist', function() {

        it('returns a 401 status when an unauthorized request is received', function () {

            return request.post('/api/query/playlist')
                .set('Accept', 'application/json')
                .send({playlistName: 'Cruise'})
                .expect(401);

        });

        it.skip('returns an array', function () {

            return request.post('/api/query/playlist')
                .set('Accept', 'application/json')
                .send({playlistName: 'Cruise'})
                .expect('Content-Type', /json/)
                .expect(200, function (err, res) {
                    expect(res.body).to.be.an('array');
                });

        });
    });
});
