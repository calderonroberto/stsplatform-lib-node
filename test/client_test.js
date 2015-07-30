var expect = require('chai').expect,
//should = require('chai').should(),
assert = require('chai').assert,
sts = require('../stsplatform');

describe('#constructor', function(){
  var client = new sts.Client();
  it('should have url and auth', function () {
    expect(client.url).to.equal('http://wotkit.sensetecnic.com/api');
    expect(client.auth).to.be.a('null');
  });
});

describe('#constructor', function(){
  var conf_url = {url:'http://newurl.com/api'};
  var client = new sts.Client(conf_url);
  var conf_wrong = {url:"wrong url"};
  var wrong_url = function (){
    new sts.Client(conf_wrong);
  };
  it('should change url', function () {
    expect(client.url).to.equal('http://newurl.com/api');
    expect(client.auth).to.be.a('null');
  });
  it('should throw error with bad url', function(){
    assert.throw(wrong_url, Error, "Malformed URL string");
  });

});

describe('#constructor', function(){
  var conf_auth_username = {auth:{username:'me', password:'pass'}};
  var conf_auth_key = {auth:{key_id:'id', key_password:'pas'}};
  var conf_wrong = {auth:{}};
  var client_username = new sts.Client(conf_auth_username);
  var client_key = new sts.Client(conf_auth_key);
  var wrong_auth = function (){
    new sts.Client(conf_wrong);
  };
  it('should create key_id with username', function () {
    expect(client_username.auth.key_id).to.equal('me');
    expect(client_username.auth.key_password).to.equal('pass');
  });
  it('should create key_id with key_id', function () {
    expect(client_key.auth.key_id).to.equal('id');
    expect(client_key.auth.key_password).to.equal('pas');
  });

  it ('should throw error when bad auth', function(){
    assert.throw(wrong_auth, Error, "Malformed Auth Object");
  });

});
