var util = require("./util");
var svgutil = require("./svgutil");

module.exports = function (sprite, callback) {

	var items = sprite.items.map(function (item) {
		return svgutil.transform(item.source, item.x, item.y);
	});

	var source = svgutil.wrap(sprite.width, sprite.height, items, sprite.namespaces);

	util.write(sprite.svgPath, source, callback);
	
};