var helpers = {
  switchClass: function (from, to) {
  	var domNode = this.getDOMNode();
  	domNode.className = domNode.className.replace(from,to);
  },
  prefixedEvent: function (element, type, callback) {
  	pfx = ["webkit", "moz", "MS", "o", ""];

  	for (var p = 0; p < pfx.length; p++) {
  		if (!pfx[p]) type = type.toLowerCase();
  		element.addEventListener(pfx[p]+type, callback, false);
  	}
  }
};

module.exports = helpers;