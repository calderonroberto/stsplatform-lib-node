var method = RequestHandler.prototype;
var STSPlatformError = require('./errors/stsplatformerror.js');
var STSPlatformResponse = require('./stsplatformresponse.js');
var url = require("url");

var querystring = require('querystring');

var http = require("http");

var Q = require('q');

function RequestHandler(successor, id) {
    this.__successor = successor || null;
    id = id || ""; //we don't need it as part of the prototype
    this.resource = "/" +
        this.constructor.name.toLowerCase() + "/" + id || "";
    this.url = "http://wotkit.sensetecnic.com/api";
    this.auth = null;
}

method.setHandler =  function (handler) {
  this.__successor = handler;
};

method.setConfig = function (config) {
  if ('url' in config) {
    //TODO: better regex
    var expression = /(http|https):\/\//ig; //as long as it has http(s)
    var regexp = new RegExp(expression);
    if ( !config.url.match(regexp) ){
      throw new STSPlatformError('Malformed URL string');
    }
    this.url = config.url;
  }
  if ('auth' in config) {
    if ( !('username' in config.auth) && !('key_id' in config.auth) ){
      throw new STSPlatformError('Malformed Auth Object');
    }
    if ('username' in config.auth){
      this.auth = {
        key_id: config.auth.username,
        key_password: config.auth.password
      };
    }
    if ('key_id' in config.auth){
      this.auth = config.auth;
    }

  }
};

method.get = function(params, callback, resource){
  params = params || null;
  resource = resource || "";
  deferred = Q.defer();

  if (this.__successor !== null) {
    return this.__successor.get(params, callback, this.resource + resource);
  } else {
    var headers = handleAuthentication(this),
    query = handleParams(params),
    uri = url.parse(this.url);

    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    //headers['Content-Length'] = query.length;

    var options = {
      hostname: uri.hostname,
      path: uri.pathname + resource + query,
      port: uri.port,
      method:'GET',
      headers: headers
    };

    var req = http.request(options, function(res){
      var result = "";
      res.on('data',function(chunk) {
        result += chunk;
      });
      res.on('end', function(){
        try {
          var response = new STSPlatformResponse(res, result);
          deferred.resolve(response);
        } catch (error){
          deferred.reject(error);
        }
      });
    });

    req.end();

    deferred.promise.nodeify(callback);
    return deferred.promise;
  }

};

method.post = function(payload, callback, resource) {
  payload = payload || null;
  resource = resource || "";
  deferred = Q.defer();

  if (this.__successor !== null) {
    return this.__successor.post(payload, callback, this.resource + resource);
  } else {
    var headers = handleAuthentication(this),
    uri = url.parse(this.url);
    var post_data = handlePayload(payload);

    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = post_data.length;

    var options = {
      hostname: uri.hostname,
      path: uri.pathname + resource,
      port: uri.port,
      method:'POST',
      headers: headers
    };

    var req = http.request(options, function(res){
      var result = "";
      res.on('data',function(chunk) {
        result += chunk;
      });
      res.on('end', function(){
        try {
          var response = new STSPlatformResponse(res, result);
          deferred.resolve(response);
        } catch (error){
          deferred.reject(error);
        }
      });
    });

    req.write(post_data);
    req.end();

    deferred.promise.nodeify(callback);
    return deferred.promise;
  }
};

method.put = function(payload, callback, resource){
  //TODO
};

method.delete = function(params, callback, resource) {
  //TODO
};

// Private Methods

function handleAuthentication (handler) {
  if (handler.auth !== null) {
    return { 'Authorization' : 'Basic ' +
        new Buffer(handler.auth.key_id + ':' + handler.auth.key_password).toString('base64')};
  } else {
    return {};
  }
}

function handleParams(params) {
  if (params === null){
    return "";
  } else {
    return "?"+querystring.stringify(params);
  }
}

function handlePayload(payload){
  if (payload === null){
    return "";
  } else {
    try {
      return JSON.stringify(payload);
    } catch (error){
      throw new STSPlatformError("Error stringifying JSON payload");
    }
  }

}

module.exports = RequestHandler;
