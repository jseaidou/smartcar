var supertest = require("supertest");
var should = require("should");
var rewire = require("rewire");
var sinon = require("sinon");
var chai = require("chai");
var expect = chai.expect;

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");
var clientMock = {};

describe("Test findByID", function() {
  it("should return proper four door vehicle", function(done){
    clientMock.getVehicleInfoService = sinon.stub().callsArgWith(1, {
      'status': '200',
      'data': {
        'fourDoorSedan': {
          'value': 'True'
        },
        'vin': {
          'value': 'myvin'
        },
        'color': {
          'value': 'red'
        },
        'driveTrain': {
          'value': 'electric'
        }
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.findByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message['vin']).to.equal('myvin');
        expect(message['color']).to.equal('red');
        expect(message['driveTrain']).to.equal('electric');
        expect(message['doorCount']).to.equal(4);
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });

  it("Should return proper 2 door sedan", function(done) {
    clientMock.getVehicleInfoService = sinon.stub().callsArgWith(1, {
      'status': '200',
      'data': {
        'fourDoorSedan': {
          'value': 'False'
        },
        'vin': {
          'value': 'myvin'
        },
        'color': {
          'value': 'red'
        },
        'driveTrain': {
          'value': 'electric'
        }
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.findByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message['vin']).to.equal('myvin');
        expect(message['color']).to.equal('red');
        expect(message['driveTrain']).to.equal('electric');
        expect(message['doorCount']).to.equal(2);
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });

  it("should fail on non 200 return status", function(done){
    clientMock.getVehicleInfoService = sinon.stub().callsArgWith(1, {
      'status': '404',
      'reason': 'my reason'
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.findByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message).to.equal('my reason');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('404');
        return this;
      }
    });
    done();
  });
});

describe("Test getDoorsByID", function(){
  it("Should return all doors and status", function(done){
    clientMock.getSecurityStatusService = sinon.stub().callsArgWith(1, {
      'status': '200',
      'data': {
        'doors': {
          'values': [
            {
              'location': {
                'value': 'frontLeft'
              },
              'locked': {
                'value': 'True'
              }
            },
            {
              'location': {
                'value': 'frontRight'
              },
              'locked': {
                'value': 'True'
              }
            }
          ]
        }
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.getDoorsByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message.length).to.equal(2);
        expect(message[0].location).to.equal('frontLeft');
        expect(message[0].locked).to.equal('true');
        expect(message[1].location).to.equal('frontRight');
        expect(message[1].locked).to.equal('true');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });
  it("Should return error status and reason", function(done){
    clientMock.getSecurityStatusService = sinon.stub().callsArgWith(1, {
      'status': '404',
      'reason': 'my reason'
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.getDoorsByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message).to.equal('my reason')
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('404');
        return this;
      }
    });
    done();
  });
});

describe("Test getFuelByID", function(){
  it("Should return all doors and status", function(done){
    clientMock.getEnergyService = sinon.stub().callsArgWith(1, {
      'status': '200',
      'data': {
        "tankLevel": {
          "value": "30"
        }
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.getFuelByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message.percent).to.equal(30);
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });
  it("Should return error and reason", function(done){
    clientMock.getEnergyService = sinon.stub().callsArgWith(1, {
      'status': '404',
      'reason': 'my reason'
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.getFuelByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message).to.equal('my reason');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('404');
        return this;
      }
    });
    done();
  });
});

describe("Test getBatteryById", function(){
  it("Should return battery level", function(done){
    clientMock.getEnergyService = sinon.stub().callsArgWith(1, {
      'status': '200',
      'data': {
        "batteryLevel": {
          "value": "30"
        }
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.getBatteryByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message.percent).to.equal(30);
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });
  it("Should return error and reason", function(done){
    clientMock.getEnergyService = sinon.stub().callsArgWith(1, {
      'status': '404',
      'reason': 'my reason'
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.getFuelByID({
      'params': {
        'id': 1234
      }
    }, {
      send: function(message){
        expect(message).to.equal('my reason');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('404');
        return this;
      }
    });
    done();
  });
});

describe("Test updateEngineByID", function(){
  it("should start engine successfully", function(done){
    clientMock.actionEngineService = sinon.stub().callsArgWith(2, {
      'status': '200',
      'actionResult': {
        'status': 'EXECUTED'
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.updateEngineByID({
      'params': {
        'id': 1234
      },
      'body': {
        'action': 'START'
      }
    }, {
      send: function(message){
        expect(message.status).to.equal('success');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });
  it("should stop engine successfully", function(done){
    clientMock.actionEngineService = sinon.stub().callsArgWith(2, {
      'status': '200',
      'actionResult': {
        'status': 'EXECUTED'
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.updateEngineByID({
      'params': {
        'id': 1234
      },
      'body': {
        'action': 'STOP'
      }
    }, {
      send: function(message){
        expect(message.status).to.equal('success');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });
  it("should stop engine unsuccessfully", function(done){
    clientMock.actionEngineService = sinon.stub().callsArgWith(2, {
      'status': '200',
      'actionResult': {
        'status': 'FAILED'
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.updateEngineByID({
      'params': {
        'id': 1234
      },
      'body': {
        'action': 'STOP'
      }
    }, {
      send: function(message){
        expect(message.status).to.equal('error');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });
  it("should start engine unsuccessfully", function(done){
    clientMock.actionEngineService = sinon.stub().callsArgWith(2, {
      'status': '200',
      'actionResult': {
        'status': 'FAILED'
      }
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.updateEngineByID({
      'params': {
        'id': 1234
      },
      'body': {
        'action': 'START'
      }
    }, {
      send: function(message){
        expect(message.status).to.equal('error');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('200');
        return this;
      }
    });
    done();
  });
  it("should return non 200 when starting engine", function(done){
    clientMock.actionEngineService = sinon.stub().callsArgWith(2, {
      'status': '404',
      'reason': 'my reason'
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.updateEngineByID({
      'params': {
        'id': 1234
      },
      'body': {
        'action': 'START'
      }
    }, {
      send: function(message){
        expect(message).to.equal('my reason');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('404');
        return this;
      }
    });
    done();
  });
  it("should return non 200 when stopping engine", function(done){
    clientMock.actionEngineService = sinon.stub().callsArgWith(2, {
      'status': '404',
      'reason': 'my reason'
    });
    var vehicles = rewire('../../src/routes/vehicles')
    vehicles.__set__({
        'GMClient': clientMock
    });
    vehicles.updateEngineByID({
      'params': {
        'id': 1234
      },
      'body': {
        'action': 'STOP'
      }
    }, {
      send: function(message){
        expect(message).to.equal('my reason');
      },
      json: function(err){},
      status: function(responseStatus) {
        expect(responseStatus).to.equal('404');
        return this;
      }
    });
    done();
  });
});
