var _super = require("./requesthandler.js").prototype,
    method = Sensors.prototype = Object.create( _super );

method.constructor = Sensors;

function Sensors(handler, id) {
  handler = handler || null;
  id = id || "";
  _super.constructor.apply( this, arguments );
}

module.exports = Sensors;
