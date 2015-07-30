var _super = require("./requesthandler.js").prototype,
    method = Client.prototype = Object.create( _super );

method.constructor = Client;

function Client(config) {
    _super.constructor.apply( this, null );
    if (config !== undefined){
      this.setConfig(config);
    }
}

module.exports = Client;
