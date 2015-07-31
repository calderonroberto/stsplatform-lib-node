var assert = require('chai').assert,
sts = require('../stsplatform');

// Declare your settings as specified in settings_example.js
var settings = require("./settings.js"),
conf = settings.conf,
sensor_name = settings.sensor_name;

var client = new sts.Client(conf);
var sensor = new sts.Sensors(client, sensor_name);
var data = new sts.Data(sensor);

// For testing creating a sensor
var random_value = Math.random();

describe('#constructor', function(){
  it('should have url and auth', function () {
    assert.isFunction(data.setHandler);
    assert.isFunction(data.get);
    assert.isFunction(data.post);
    assert.isFunction(data.put);
    assert.isFunction(data.delete);
  });
});

/**
* POST
**/

describe('#post#callbacks', function (){
  it('should create data', function(done){
    this.timeout(10000);
    data.post({value:random_value}, function(error,response){
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
    data.post({value:random_value}).then(function(res){
      response = res;
      done();
    });
  });
  it('should create data', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(201);
  });
});

/**
* GET
**/

describe ('#get#callbacks', function(){
  this.timeout(10000); //10 seconds
  it ('should retrive data', function(done){
    data.get({beforeE:1}, function(error,response){
      response.constructor.name.should.equal("STSPlatformResponse");
      response.code.should.equal(200);
      response.data[0].value.should.equal(random_value);
      done();
    });
  });
});

describe ('#get#promises', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    data.get({beforeE:1}).then(function(res){
      response = res;
      done();
    });
  });
  it ('should retrieve data)', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(200);
    response.data[0].value.should.equal(random_value);
  });
});

/**
* PUT
**/
var batchdata = [
  {"timestamp":"2012-12-12T03:34:28.626Z","value":67.0,"lng":-123.1404,"lat":49.20532},
  {"timestamp":"2012-12-12T03:34:28.665Z","value":63.0,"lng":-123.14054,"lat":49.20554}
];

describe('#put#callbacks', function (){
  it('should add batch data', function(done){
    this.timeout(10000);
    data.put(batchdata, function(error, response){
      response.constructor.name.should.equal("STSPlatformResponse");
      response.code.should.equal(204);
      done();
    });
  });
});


describe('#put#promises', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    data.put(batchdata).then(function(res){
      response = res;
      done();
    });
  });
  it('should add batch data', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(204);
  });
});


/**
* DELETE
**/

describe('#delete#callbacks', function (){
  it('should delete data', function(done){
    this.timeout(10000);
    data.delete("2012-12-12T03:34:28.626Z", function(error,response){
      response.constructor.name.should.equal("STSPlatformResponse");
      response.code.should.equal(204);
      done();
    });
  });
});

describe('#delete#promises', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    data.delete("2012-12-12T03:34:28.626Z").then(function(res){
      response = res;
      done();
    });
  });
  it('should delete data', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(204);
  });
});
