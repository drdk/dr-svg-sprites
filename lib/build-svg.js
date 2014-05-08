var util = require("./util");
var svgutil = require("./svgutil");

module.exports = function (sprite, callback) {

	var items = sprite.items.map(function (item) {
		return svgutil.transform(item.source, item.x, item.y);
	});

	sprite.setSource(svgutil.wrap(sprite.width, sprite.height, items));

	util.write(sprite.svgPath, sprite.source, function () {
		callback(null);
	});
	
};