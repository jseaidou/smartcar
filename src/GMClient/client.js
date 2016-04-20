/**
* This is a wrapper around the GM client API.
* The purpose is not to parse the output and extract meaning,
* only to make the request and return the response.
* Different users might have different use cases for different errors
* and it is better for the user to handle it than have this client do it.
*/

var request = require('request');

const endpoint = 'http://gmapi.azurewebsites.net/';

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

exports.getVehicleInfoService = function(id, callback) {
  var req = createRequest('getVehicleInfoService', id);
  request.post(req, function(error, response, body){
      callback(body);
  });
}

exports.getSecurityStatusService = function(id, callback) {
  var req = createRequest('getSecurityStatusService', id);
  request.post(req, function(error, response, body) {
    callback(body);
  });
}

exports.getEnergyService = function(id, callback) {
  var req = createRequest('getEnergyService', id);
  request.post(req, function(error, response, body){
    callback(body);
  });
}

exports.actionEngineService = function(id, action, callback) {
  var req = createRequest('actionEngineService', id);
  req.json['command'] = action + "_VEHICLE";
  request.post(req, function(error, response, body){
    callback(body);
  });
}
