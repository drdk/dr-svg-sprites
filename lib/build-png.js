var btoa = require("btoa");
var async = require("async");
var svg2png = require("svg2png");

module.exports = function (sprite, callback) {
	
	var tasks = sprite.sizes.map(function (size) {
		return function (callback) {
			svg2png("data:image/svg+xml;base64," + btoa(sprite.source), size.pngPath, size.width / sprite.width, function () {
				callback(null, size.pngPath);
			});
		};
	});
	
	async.parallel(tasks, function (err, result) {
		callback(null, "sprites built");
	});
	
};