var _super = require("./requesthandler.js").prototype,
    method = Fields.prototype = Object.create( _super );

method.constructor = Fields;

function Fields(handler, id) {
  handler = handler || null;
  id = id || "";
  _super.constructor.apply( this, arguments );
}

module.exports = Fields;
