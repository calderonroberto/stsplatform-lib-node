var _super = require("./requesthandler.js").prototype,
    method = Orgs.prototype = Object.create( _super );

method.constructor = Orgs;

function Orgs(handler, id) {
  handler = handler || null;
  id = id || "";
  _super.constructor.apply( this, arguments );
}

module.exports = Orgs;
