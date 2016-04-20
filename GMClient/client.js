/**
* This is a wrapper around the GM client API.
* The purpose is not to parse the output and extract meaning,
* only to make the request and return the response.
* Different users might have different use cases for different errors
* and it is better for the user to handle it than have this client do it.
*/

var request = require('request');

// Ideally we would want this to be read from a configuration file
var endpoint = 'http://gmapi.azurewebsites.net/';

// Helper function to create a request for gmapi.
createRequest = function(resource, id) {
  return {
    url: endpoint + resource,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    json: {
      'id': id,
      'responseType': 'JSON'
    }
  };
}

// Call 'getVehicleInfoService' endpoint and return response
exports.getVehicleInfoService = function(id, callback) {
  var req = createRequest('getVehicleInfoService', id);
  request.post(req, function(error, response, body){
      callback(body);
  });
}

// Call 'getSecurityStatusService' endpoint and return response
exports.getSecurityStatusService = function(id, callback) {
  var req = createRequest('getSecurityStatusService', id);
  request.post(req, function(error, response, body) {
    callback(body);
  });
}

// Call 'getEnergyService' endpoint and return response
exports.getEnergyService = function(id, callback) {
  var req = createRequest('getEnergyService', id);
  request.post(req, function(error, response, body){
    callback(body);
  });
}

// Call 'actionEngineService' endpoint and return response
exports.actionEngineService = function(id, action, callback) {
  var req = createRequest('actionEngineService', id);
  req.json['command'] = action;
  request.post(req, function(error, response, body){
    callback(body);
  });
}
