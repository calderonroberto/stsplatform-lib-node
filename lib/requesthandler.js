var method = RequestHandler.prototype;

var http = require("http");
var url = require("url");
var querystring = require('querystring');
var Q = require('q');

var STSPlatformError = require('./errors/stsplatformerror.js');
var STSPlatformResponse = require('./stsplatformresponse.js');

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

/**
* Makes a GET request
* @param {Object} params - params to pass to the request
* @param {Function} callback - a callback to call if not using promises
* @param {String} resource - the resource, e.g. "/sensors/name"
*/
method.get = function(params, callback, resource){
  params = params || null;
  resource = resource || "";
  if (this.__successor !== null) {
    return this.__successor.get(params, callback, this.resource + resource);
  } else {
    return makeRequest('GET', this, params, callback, resource);
  }
};

/**
* Makes a POST request
* @param {Object} payload - payload to pass to the request
* @param {Function} callback - a callback to call if not using promises
* @param {String} resource - the resource, e.g. "/sensors/name"
*/
method.post = function(payload, callback, resource) {
  payload = payload || null;
  resource = resource || "";
  if (this.__successor !== null) {
    return this.__successor.post(payload, callback, this.resource + resource);
  } else {
    return makeRequest('POST', this, payload, callback, resource);
  }
};

/**
* Makes a PUT request
* @param {Object} payload - payload to pass to the request
* @param {Function} callback - a callback to call if not using promises
* @param {String} resource - the resource, e.g. "/sensors/name"
*/
method.put = function(payload, callback, resource){
  payload = payload || null;
  resource = resource || "";
  deferred = Q.defer();
  if (this.__successor !== null) {
    return this.__successor.put(payload, callback, this.resource + resource);
  } else {
    return makeRequest('PUT', this, payload, callback, resource);
  }

};

/**
* Makes a DELETE request
* @param {Object} params - params to pass to the request
* @param {Function} callback - a callback to call if not using promises
* @param {String} resource - the resource, e.g. "/sensors/name"
*/
method.delete = function(params, callback, resource) {
    params = params || null;
    resource = resource || "";
    deferred = Q.defer();

    if (this.__successor !== null) {
      return this.__successor.delete(params, callback, this.resource + resource);
    } else {
      return makeRequest('DELETE', this, params, callback, resource);
    }
};

// Private Methods

/**
* Creates a request header. If the handler has an authorization parameter it
* will add a BasicAuth element with configured auth key and password.
* @param {RequestHandler} handler - An STS Platform Client
* @return {Object} A header object {}
*/
function createRequestHeader (handler) {
  if (handler.auth !== null) {
    return { 'Authorization' : 'Basic ' +
        new Buffer(handler.auth.key_id + ':' + handler.auth.key_password).toString('base64')};
  } else {
    return {};
  }
}

/**
* Handles parameters for a x-www-form-urlencoded request, creating a url string.
* @param {Object} params - An object containing paramerers, e.g. {key:"value"}
* @return {String} A url-encoded string with parameters: "?key=value&key2=value2"
*/
function handleParams(params) {
  if (params === null){
    return "";
  } else {
    return "?"+querystring.stringify(params);
  }
}

/**
* Handles a payload for an application/json request, crating a json string.
* @param {Object} payload - An object containing parameters, e.g. {key:"value"}
* @return {String} A stringified JSON object.
*/
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

/**
* Create a request options object.
* @param {String} method - GET, POST, PUT or DELETE
* @param {Object} uri - a parsed URI object containing hstname, pathname and port
* @param {String} resource - a resource string "/sensors/name"
* @param {String} query - a url-encoded query to append to resource
* @param {Object} headers - headers of the request
* @return {Object} options object
*/
function createOptions(method, uri, resource, query, headers){
  return {
    hostname: uri.hostname,
    path: uri.pathname + resource + query,
    port: uri.port,
    method: method,
    headers: headers
  };
}

/**
* Create and specify how to handle a request.
* Will call deferred.resolve or deferred.reject on request end.
* @param {Object} options - An options object
* @param {Promise} deferred - A Q deferred promise created with Q.defer()
*/
function handleRequest(options, deferred) {
  return http.request(options, function(res){
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
}

/**
* Create a request options object and return a promise
* @param {String} method - GET, POST, PUT or DELETE
* @param {RequestHandler} handler - handler for auth and url
* @param {String} params - params OR payload string (url-encoded or json)
* @param {Function} callback - callback to defer to
* @param {String} resource - string specifying a resource, e.g. "/sensors/name"
* @return {Promise} returns a deferred promise
*/
function makeRequest(method, handler, params, callback, resource) {
  var headers = createRequestHeader(handler);
  var uri = url.parse(handler.url);
  var options = {};
  var req = Object;
  var deferred = Q.defer();
  if (method === 'GET' || method ==='DELETE') { //if using params url (urlencoded)
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    var query = handleParams(params);
    options = createOptions(method, uri, resource, query, headers);
    req = handleRequest(options, deferred);
    req.end();
  } else if (method ==='POST' || method === 'PUT') { //if using json body request
    var post_data = handlePayload(params);
    headers['Content-Type'] = 'application/json';
    headers['Content-Length'] = post_data.length;
    options = createOptions(method,uri,resource, "", headers);
    req = handleRequest(options, deferred);
    req.write(post_data);
    req.end();
  }
  deferred.promise.nodeify(callback);
  return deferred.promise;
}

module.exports = RequestHandler;
