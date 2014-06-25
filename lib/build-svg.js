var _ = require("lodash");
var util = require("./util");
var svgutil = require("./svgutil");

module.exports = function (sprite, callback) {

	var items = sprite.items.map(function (item) {
		return svgutil.transform(item.source, item.x, item.y);
	});

	var attributes = {};
	_.assign(attributes, sprite.config.svgAttributes);
	_.assign(attributes, sprite.namespaces);

	var source = svgutil.wrap(sprite.width, sprite.height, items, attributes);

	util.write(sprite.svgPath, source, callback);
	
};