var sts = require('stsplatform');

var conf = {
  url:"http://wotkit.sensetecnic.com/api",
  auth:{key_id:"KEYID", key_password:"KEYPASSWORD"}, // TODO: configure your key and password: https://wotkit.sensetecnic.com/wotkit/keys

};

var sensor_name = "USERNAME.SENSORNAME"; //TODO:configure your sensor name

var org_name = "sensetecnic";

// Create a client
var c = new sts.Client(conf);

/* Get Sensors */

var s = new sts.Sensors(c, sensor_name);

// Using callbacks
s.get(null, function(error, response){ //no parameters must be explicit (null)
  console.log(response.data);
});

// Using promises
s.get().then(function(response){
  console.log(response.data);
});


/* Get Data */

var s = new sts.Sensors(c, sensor_name);
var d = new sts.Data(s);

// Using callbacks
d.get({beforeE:1}, function(error, response){
  console.log(response.data);
});

// Using promises
d.get({beforeE:1}).then(function(response){
  console.log(response.data);
});

/* Publish Data */

var s = new sts.Sensors(c, sensor_name);
var d = new sts.Data(s);

// Using callbacks
d.post({value:42}, function(){
  d.get({beforeE:1}, function(error, response){
    console.log(response.data);
  });
});

// Using promises
d.post({value:42}).then(function(){
  d.get({beforeE:1});
}).then(function(response){
  console.log(response.data);
});

/* Get Sensor Fields */

var s = new sts.Sensors(c, sensor_name);
var fs = new sts.Fields(s);

// Using callbacks
fs.get({beforeE:1}, function(error, response){
  console.log(response.data);
});

// Using promises
fs.get({beforeE:1}).then(function(response){
  console.log(response.data);
});

/* Organizations */

var o = new sts.Orgs(c, org_name);

// Using callbacks
o.get(null, function(error, response){
  console.log(response.data);
});

// Using promises
o.get().then(function(response){
  console.log(response.data);
});
