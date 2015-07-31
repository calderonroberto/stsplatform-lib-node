var assert = require('chai').assert,
sts = require('../stsplatform');

// Declare your settings as specified in settings_example.js
var settings = require("./settings.js"),
conf = settings.conf;

var client = new sts.Client(conf);
var orgs = new sts.Orgs(client);
var sensetecnic_org = new sts.Orgs(client, 'sensetecnic');

describe('#constructor', function(){
  it('should have methods', function () {
    assert.isFunction(orgs.setHandler);
    assert.isFunction(orgs.get);
    assert.isFunction(orgs.post);
    assert.isFunction(orgs.put);
    assert.isFunction(orgs.delete);
  });
});


/**
* GET
**/

describe ('#get#callbacks', function(){
  this.timeout(10000); //10 seconds
  it ('should search orgs', function(done){
    orgs.get({'text':'sensetecnic'}, function(error,response){
      response.constructor.name.should.equal("STSPlatformResponse");
      response.code.should.equal(200);
      done();
    });
  });
  it ('should get one org', function(done){
    sensetecnic_org.get(null, function(error,response){
      response.constructor.name.should.equal("STSPlatformResponse");
      response.code.should.equal(200);
      response.data.name.should.equal('sensetecnic');
      done();
    });
  });
});

describe ('#get#promises#search', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    orgs.get().then(function(res){
      response = res;
      done();
    });
  });
  it ('should search orgs)', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(200);
  });
});

describe ('#get#promises#oneorg', function(){
  this.timeout(10000); //10 seconds
  var response;
  beforeEach(function(done){ // We wait the promise to return before our test
    sensetecnic_org.get().then(function(res){
      response = res;
      done();
    });
  });
  it ('should search orgs)', function(){
    response.constructor.name.should.equal("STSPlatformResponse");
    response.code.should.equal(200);
    response.data.name.should.equal('sensetecnic');
  });
});
