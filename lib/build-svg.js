var fs = require("fs");
var path = require("path");
var mkdirp = require("mkdirp");
var _ = require("lodash");
var async = require("async");
var util = require("./util");
var svgutil = require("./svgutil");

module.exports = function (config, files, callback) {

	var tasks = {};
	var suffix = ".svg";
		
	files.forEach(function (file) {
		tasks[file] = function (_callback) {
			svgutil.loadShape(file, _callback);
		};
	});

	mkdirp(config.spritePath, function (err) {
		if (err) {
			throw err;
		}
		async.parallel(tasks, build);
	});

	function build (err, results) {
		var spriteData = {
			elements: [],
			path: path.join(config.spritePath, util.joinName(config.prefix, config.name, "sprite") + suffix),
			sizes: {}
		};
		var spriteHeight = 0; 
		var elementUnitWidth = 0;
		var elements = [];
		var x = 0;
		var resultsList = [];
		var filename;
		
		_.forOwn(results, function (svg, filename) {
			resultsList.push({
				className: util.joinName(config.prefix, path.basename(filename, suffix)),
				filename: filename,
				svg: svg
			});
		});

		resultsList.sort(function (a, b) {
			if (a.className > b.className) {
				return 1;
			}
			if (a.className < b.className) {
				return -1;
			}
			return 0;
		});

		resultsList.forEach(function (result) {
			var filename = result.filename;
			var svg = result.svg;
			var className = result.className;
				
			elementUnitWidth = util.roundUpToUnit(svg.info.width, config.unit);
			if (spriteHeight < svg.info.height) {
				spriteHeight = svg.info.height;
			}
			spriteData.elements.push({
				className: className,
				width: Math.ceil(svg.info.width),
				height: svg.info.height,
				x: x
			});
			elements.push(svgutil.transform(svg.data, x, 0));
			x += elementUnitWidth + config.unit;
		});

		x = util.roundUpToUnit(x, config.unit);
		spriteHeight = util.roundUpToUnit(spriteHeight, config.unit);
		spriteData.width = x;
		spriteData.height = spriteHeight;

		var filepath = path.relative(process.cwd(), path.join(config.spritePath, util.joinName(config.prefix, config.name, "sprite") + suffix));
		fs.writeFile(filepath, svgutil.wrap(x, spriteHeight, elements), function (err) {
			if (err) {
				throw err;
			}
			callback(null, config, spriteData);
		});

	}
};