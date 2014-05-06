var path = require("path");
var _ = require("lodash");
var async = require("async");
var util = require("./util");
var buildCSS = require("./build-css");
var svg2png = require("svg2png");

module.exports = function (err, config, sprite) {
	var pngSpritesToBuild = [];
	var sizeLabel, size;
	var refSize = (typeof config.refSize == "string") ? config.sizes[config.refSize] : config.refSize;
		
	_.forOwn(config.sizes, function (size, sizeLabel) {
		var pngPath = path.join(config.spritePath, util.joinName(config.prefix, config.name, sizeLabel, "sprite") + ".png");
		var width = util.scaleValue(sprite.width, size, refSize);
		var height = util.scaleValue(sprite.height, size, refSize);

		sprite.sizes[sizeLabel] = {
			path: pngPath,
			width: width,
			height: height
		};
		
		var scale = size / refSize;
		
		pngSpritesToBuild.push(function (callback) {
			svg2png(sprite.path, pngPath, scale, function () {
				callback(null, pngPath);
			});
		});
	});
	
	async.parallel(pngSpritesToBuild, function (err, result) {
		if (config.cssPath) {
			buildCSS(config, sprite);
		}
		else {
			callback(null, "sprites built");
		}
	});
	
};