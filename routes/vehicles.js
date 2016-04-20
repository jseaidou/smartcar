/**
* This module is the endpoint definition for the smartcar.
* All endpoints for the /vehicles/* routes are implemented here.
*/
var GMClient = require('../GMClient/client')

exports.findByID = function(req, res) {
  // Make API request to get vehicle info
  GMClient.getVehicleInfoService(req.params.id, function(response){
    if (response.status != '200') {
      // Since it's not the expected 200, return the error back.
      res.status(response.status).send(response.reason);
      return;
    }
    var vehicle = response.data;
    var count = 2
    if (vehicle.fourDoorSedan.value === 'True') {
      count = 4
    }

    res.status(response.status).send({
      'vin': vehicle.vin.value,
      'color': vehicle.color.value,
      'driveTrain': vehicle.driveTrain.value,
      'doorCount':count
    });
  });
}

exports.getDoorsByID = function(req, res) {
  GMClient.getSecurityStatusService(req.params.id, function(response){
    if (response.status != '200') {
      res.status(response.status).send(response.reason);
      return;
    }
    var vehicle = response.data;
    doors = []
    for (var i = 0; i < vehicle.doors.values.length; i++) {
      var location = vehicle.doors.values[i].location
      var locked = vehicle.doors.values[i].locked
      doors.push({
        'location': location.value,
        'locked': (locked.value.toLowerCase() === 'true')
      });
    }
    res.status(response.status).send(doors);
  });
}

exports.getFuelByID = function(req, res) {
  GMClient.getEnergyService(req.params.id, function(response){
    if (response.status != '200') {
      res.status(response.status).send(response.reason);
      return;
    }
    var vehicle = response.data;
    var levelType = vehicle.tankLevel.type;
    var level = vehicle.tankLevel.value;
    if(levelType === 'Null') {
      level = 0;
    }

    res.status(response.status).send({'percent': parseFloat(level)});
  });
}

exports.getBatteryByID = function(req, res) {
  GMClient.getEnergyService(req.params.id, function(response){
    if (response.status != '200') {
      res.status(response.status).send(response.reason);
      return;
    }
    var vehicle = response.data;
    var levelType = vehicle.batteryLevel.type;
    var level = vehicle.batteryLevel.value;
    if (levelType === 'Null') {
      level = 0;
    }
    res.status(response.status).send({'percent': parseFloat(level)});
  })
}

exports.updateEngineByID = function(req, res) {
  action = req.body.action + "_VEHICLE";
  GMClient.actionEngineService(req.params.id, action, function(resp) {
    if (resp.status != '200') {
      res.status(resp.status).send(resp.reason);
      return;
    }

    var status = resp.actionResult.status;
    var successful = "error";
    if (status === "EXECUTED") {
      successful = "success";
    }
    res.status(resp.status).send({'status': successful})
  });
}
