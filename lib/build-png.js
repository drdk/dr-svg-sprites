var async = require("async");
var svg2png = require("svg2png");

module.exports = function (sprite, callback) {

	var tasks = sprite.sizes.map(function (size) {
		return function (callback) {
			svg2png(sprite.svgPath, size.pngPath, size.width / sprite.width, function (err) {
				if (err) {
					throw err;
				}
				callback(null, size.pngPath);
			});
		};
	});
	
	async.parallel(tasks, callback);
	
};