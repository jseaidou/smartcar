var chai = require('chai');
var rewire = require('rewire');
var expect = chai.expect;

var app = rewire('../../src/GMClient/client');
createRequest = app.__get__('createRequest');
endpoint = app.__get__('endpoint');
describe("Client", function(){
  it("should create proper request", function(done){
    var expectedID = 1234;
    var expectedResource = '/my_resource'
    var req = createRequest(expectedResource, expectedID);
    expect(req.method).to.equal('POST');
    expect(req.url).to.equal(endpoint + expectedResource);
    expect(req.headers['Content-Type']).to.equal('application/json');
    expect(req.json['id']).to.equal(expectedID);
    done();
  });
});
