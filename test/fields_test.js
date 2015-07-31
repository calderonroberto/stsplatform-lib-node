var assert = require('chai').assert,
sts = require('../stsplatform');

// Declare your settings as specified in settings_example.js
var settings = require("./settings.js"),
conf = settings.conf,
sensor_name = settings.sensor_name;

var client = new sts.Client(conf);
var sensor = new sts.Sensors(client, sensor_name);
var fields = new sts.Fields(sensor);

var newfield = {
  name: "newfield",
  longName: "newfield",
  type: "NUMBER",
  index: 99,
  required: "false",
  value: 0
};

var promisesnewfield = {
  name: "promisesnewfield",
  longName: "newfield",
  type: "NUMBER",
  index: 99,
  required: "false",
  value: 0
};



describe('#constructor', function(){
  it('should have methods', function () {
    assert.isFunction(fields.setHandler);
    assert.isFunction(fields.get);
    assert.isFunction(fields.post);
    assert.isFunction(fields.put);
    assert.isFunction(fields.delete);
  });
});


/**
* GET
**/

describe ('#get#callbacks', function(){
  this.timeout(10000); //10 seconds
  it ('should retrive fields', function(done){
    fields.get(null, function(error,response){
      response.constructor.name.should.equal("STSPlatformResponse");
      response.code.should.equal(200);
      response.data[0].name.should.equal('value');
      done();
    });
  });
});

describe ('#get#promises', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    fields.get().then(function(res){
      response = res;
      done();
    });
  });
  it ('should retrieve data)', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(200);
    response.data[0].name.should.equal('value');
  });
});

/**
* PUT
**/

describe('#put#callbacks', function (){
  it('should addupdate fields', function(done){
    this.timeout(10000);
    new_field = new sts.Fields(sensor, 'newfield');
    new_field.put(newfield, function(error, response){
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
    new_field = new sts.Fields(sensor, 'promisesnewfield');
    new_field.put(promisesnewfield).then(function(res){
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

/*
f = sts.Fields(s, 'newfield')
        r = f.delete()
        self.assertEquals(r.code,204)
*/
describe('#delete#callbacks', function (){
  it('can delete fields', function(done){
    this.timeout(10000);
    new_field = new sts.Fields(sensor, 'newfield');
    new_field.delete(null, function(error,response){
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
    new_field = new sts.Fields(sensor, 'promisesnewfield');
    new_field.delete().then(function(res){
      response = res;
      done();
    });
  });
  it('should delete fields', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(204);
  });
});
