sts = require('../stsplatform');

// Create a Client.
var client = new sts.Client();

// Create a sensor object, referencing the client/
var sensor = new sts.Sensors(client, 'calderonroberto.demo');

// Get the sensor information (print the response code)
sensor.get().then(function(response){
  console.log(">>> Sensor Info");
  console.log(response.data);
  console.log(response.code);
});

// Create a Data object using a sensor
var data = new sts.Data(sensor);

// Print some data (last element)
// http://wotkit.readthedocs.org/en/latest/api_v1/api_sensor_data.html#raw-data-retrieval
data.get({beforeE:1}).then(function(response){
  console.log(">>> Data");
  console.log(response.data);
  console.log(response.code);
});
