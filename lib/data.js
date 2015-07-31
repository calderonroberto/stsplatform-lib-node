var _super = require("./requesthandler.js").prototype,
    method = Data.prototype = Object.create( _super );

method.constructor = Data;

function Data(handler, id) {
  handler = handler || null;
  id = id || "";
  _super.constructor.apply( this, arguments );
}

module.exports = Data;
