var request = require('supertest');

describe("Server", function(){
    var server = require('../../server');

    describe("API", function(){

        describe("POST /api/query/playlist", function(){

            it("returns an array", function(done){
                pending("requires authentication");
                request(server)
                    .post('/api/query/playlist')
                    .set('Accept', 'application/json')
                    .send({playListName: 'Cruise'})
                    .expect('Content-Type', /json/)
                    .expect(200, buildJasmineCallback(done))

            })
        })
    });
});


function buildJasmineCallback(done) {
    return function (err, response) {
        if (err) {
            if (response) console.error(response.body);
            done.fail(err)
        } else {
            done()
        }
    }
}