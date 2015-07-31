# stsplatform-lib-node

This node module allows developers to use the STS Platform (including the FREE version 'WoTKit').

# Dependencies

*   "q": "^1.4.1"

# Installing the library

You can install using npm with:

```
npm install stsplatform
```

# Getting Started

Require the stsplatform module

```
var sts = require('stsplatform');
```

Create an STS Platform client:

```
var client = new sts.Client();
```

Print a sensor hosted in the platform.

```
var sensor = new sts.Sensors(client, 'mike.yvr-arrive');

// Using callbacks:
sensor.get(null, function(error,response){
  console.log(response.data);
});

// Using promises:
sensor.get().then(function(response){
  console.log(response.data);
});
```

Print some data (last data point)
```
var data = new sts.Data(sensor);

// Using callbacks:
data.get({beforeE:1}, function(error, response){
  console.log(response.data);
});

// Using promises:
data.get({beforeE:1}).then(function(response){
  console.log(response.data);
});
```

# Using the library

All methods rely on the Client Object. The parameter CONF is not required, but allows you to configure your client to specify your credentials and url of the STS Platform instance you want to access. By default the client will use the community edition of the STS Platform (WoTKit):

A common configuration object is:

```
CONF = {
  url:"http://wotkit.sensetecnic.com/api",
  auth:{key_id:KEY_ID, key_password:KEY_PASSWORD},  
}
```

You can then instantiate your client like this:

```
var client = new sts.Client();
```

To access resources you build them up hierarchically. A sensor lives in an STS Platform Server:
```
var client = new sts.Client();
var sensor = new sts.Sensors(client, 'SENSORNAME');
```

Data lives in a Sensor:
```
var client = new sts.Client();
var sensor = new sts.Sensors(client, 'SENSORNAME');
var data = new sts.Data(sensor)
```

And so on. Each element that uses the Client object can access GET, POST, PUT and DELETE methods. These methods take parameters and return a STSPlatformResponse object containing "data" and "code". Data is the parsed response from the STS Platform server. Code is an integer response code from the STS Platform server.

You can either use callback form or promises to perform your async http requests to the STS Platform server. The library uses the [Q module](https://www.npmjs.com/package/q) to build its promises.

```
var client = new sts.Client();
var sensor = new sts.Sensors(client, 'SENSORNAME');
var data = new sts.Data(sensor)


// Using callbacks
data.get({key:value}, function(error, response){
  console.log(response.data);
  console.log(response.code);
});

// Using promises
data.get({key:value}).then(function(response){
  console.log(response.data);
  console.log(response.code);
});
```

For more information on the API, support and examples visit [http://developers.sensetecnic.com](http://developers.sensetecnic.com)

# Supported Resources

To get started, import the library:
```
var sts = require('stsplatform');
```

#### Configuring the client

You can configure the client to use a different STS Platform URL (in this case the free version 'WoTKit'). You can also configure it to use a username and password, or a valid key_id and key_password:
```
var conf = {
  url:"http://wotkit.sensetecnic.com/api",
  //auth:{username:USERNAME, password:PASSWORD},
  //auth:{key_id:KEY_ID, key_password:KEY_PASSWORD},  
}
var client = new sts.Client(conf)
```

#### Get Sensors

```
var c = new sts.Client(CONF);
var s = new sts.Sensors(c, SENSOR_NAME);

// Using callbacks
s.get(null, function(error, response){ //no parameters must be explicit (null)
  console.log(response.data);
});

// Using promises
s.get().then(function(response){
  console.log(response.data);
});
```

#### Get Data:

```
var c = new sts.Client(CONF);
var s = new sts.Sensors(c, SENSOR_NAME);
var d = new sts.Data(s);

// Using callbacks
d.get({beforeE:1}, function(error, response){
  console.log(response.data);
});

// Using promises
d.get({beforeE:1}).then(function(response){
  console.log(response.data);
});
```

#### Publish Data

```
var c = new sts.Client(CONF);
var s = new sts.Sensors(c, SENSOR_NAME);
var d = new sts.Data(s);

// Using callbacks
d.post({value:42}, function(error, response){
  d.get({beforeE:1}, function(error, response){
    console.log(response.data);
  });
});

// Using promises
d.post({value:42}).then(function(response){
  d.get({beforeE:1});
}).then(function(response){
  console.log(response.data);
});
```

#### Get Sensor Fields

```
var c = new sts.Client(CONF);
var s = new sts.Sensors(c, SENSOR_NAME);
var fs = new sts.Fields(s);

// Using callbacks
fs.get({beforeE:1}, function(error, response){
  console.log(response.data);
});

// Using promises
fs.get({beforeE:1}).then(function(response){
  console.log(response.data);
});
```

#### Organizations

```
var c = new sts.Client(CONF);
var o = new sts.Orgs(c, ORG_NAME);

// Using callbacks
o.get(null, function(error, response){
  console.log(response.data);
});

// Using promises
o.get().then(function(response){
  console.log(response.data);
});
```

# Development

Clone the latest stable (Master) repository:

```
git clone https://github.com/SenseTecnic/stsplatform-lib-node
cd stsplatform-lib-node
```

Run the tests:

```
grunt
```
