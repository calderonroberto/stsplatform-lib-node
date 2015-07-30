var expect = require('chai').expect,
should = require('chai').should(),
assert = require('chai').assert,
sts = require('../stsplatform');

//While it is better to mock http resources with sinon the API changes make it easier and more robust to test against the real API.

// Declare your settings as specified in settings_example.js
var settings = require("./settings.js"),
conf = settings.conf,
sensor_name = settings.sensor_name;
private_sensor_name = settings.private_sensor_name;

var default_client = new sts.Client();
var conf_client = new sts.Client(conf);
var sensors = new sts.Sensors(default_client); //sensors no auth
var public_sensor = new sts.Sensors(default_client, sensor_name);
var private_sensor = new sts.Sensors(conf_client, private_sensor_name);

describe('#constructor', function(){
  it('should have url and auth', function () {
    expect(sensors.url).to.equal('http://wotkit.sensetecnic.com/api');
    assert.isFunction(sensors.setHandler);
    assert.isFunction(sensors.get);
    assert.isFunction(sensors.post);
    assert.isFunction(sensors.put);
    assert.isFunction(sensors.delete);
  });
});

/**
* GET
**/

describe ('#get#callbacks', function(){
  this.timeout(10000); //10 seconds
  it ('should search for sensors (parameters)', function(done){
    sensors.get({tags:'elephants'}, function(error,response){
      response.constructor.name.should.equal("STSPlatformResponse");
      response.code.should.equal(200);
      done();
    });
  });

  it ('should get public sensor (no parameters, no credentials)', function(done){
    public_sensor.get(null, function(error, response){
      should.not.exist(error);
      response.constructor.name.should.equal("STSPlatformResponse");
      response.data.name.should.equal(sensor_name.split('.')[1]);
      done();
    });
  });

  it ('should get private sensor using credentials', function(done){
    private_sensor.get(null, function(error,response){
      should.not.exist(error);
      response.constructor.name.should.equal("STSPlatformResponse");
      response.data.name.should.equal(private_sensor_name.split('.')[1]);
      done();
    });
  });
});

describe ('#get#promises#publicsensor', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    public_sensor.get().then(function(res){
      response = res;
      done();
    });
  });
  it ('should get public sensor (no parameters, no credentials)', function(){
    expect(response.constructor.name).equals("STSPlatformResponse");
    expect(response.data.name).equals(sensor_name.split('.')[1]);
  });
});

describe ('#get#promises#sensorsearch', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    sensors.get({tags:"elephants"}).then(function(res){
      response = res;
      done();
    });
  });
  it ('should search for sensors (parameters)',function(){
    expect(response.constructor.name).equals("STSPlatformResponse");
    expect(response.code).equals(200);
    expect(response.data[0].tags).include("elephants");
  });
});

describe ('#get#promises#publicsensor', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    private_sensor.get().then(function(res){
      response = res;
      done();
    });
  });
  it ('should get private sensor using credentials', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.data.name.should.equal(private_sensor_name.split('.')[1]);
  });
});


/**
* POST
**/

//Only for posts
var random_sensor_name = Math.random().toString(36).substring(7);
var new_sensor = {
    name:random_sensor_name,
    longName:'Delete Me Sensor',
    description:'Auto generated for tests..',
    tags: ['elephants']
};

describe('#post#callbacks', function (){
  it('should create a sensor with credentials', function(done){
    this.timeout(10000);
    var sensor = new sts.Sensors(conf_client);
    sensor.post(new_sensor, function(error,response){
      response.constructor.name.should.equal("STSPlatformResponse");
      response.code.should.equal(201);
      done();
    });
  });

});

describe('#post#promises', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    new_sensor.name += "promises";
    var sensor = new sts.Sensors(conf_client);
    sensor.post(new_sensor).then(function(res){
      response = res;
      done();
    });
  });

  it('should create a sensor with credentials', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(201);
  });
});

/**
* PUT
**/

describe('#put#callbacks', function (){
  it('should modify a sensor with credentials');
});

describe('#put#promises', function(){
  it('should modify a sensor with credentials');
});


/**
* DELETE
**/

describe('#delete#callbacks', function (){
  it('should delete a sensor with credentials');
});

describe('#delete#promises', function(){
  it('should delete a sensor with credentials');
});
