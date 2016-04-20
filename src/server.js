var express = require('express');
var vehicles = require('./routes/vehicles');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.use(express.json());
app.get('/vehicles/:id', vehicles.findByID);
app.get('/vehicles/:id/doors', vehicles.getDoorsByID);
app.get('/vehicles/:id/fuel', vehicles.getFuelByID);
app.get('/vehicles/:id/battery', vehicles.getBatteryByID);
app.post('/vehicles/:id/engine', vehicles.updateEngineByID);

app.listen(3000);
console.log('Listening on port 3000...');
