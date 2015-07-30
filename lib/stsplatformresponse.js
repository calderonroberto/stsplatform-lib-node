method = STSPlatformResponse.prototype = Object.create(null);

method.constructor = STSPlatformResponse;

function STSPlatformResponse(res, body) {
  if (!body) {
    this.data = "";
  } else {
    this.data = JSON.parse(body);
  }
  this.code = res.statusCode;
}

module.exports = STSPlatformResponse;
