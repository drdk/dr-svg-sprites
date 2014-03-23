var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var async = require("async");
var util = require("./util");
var fsutil = require("./fsutil");
var svgutil = require("./svgutil");

module.exports = function (config, files, callback) {

	var tasks = {};
	var suffix = ".svg";
		
	files.forEach(function (file) {
		tasks[file] = function (_callback) {
			svgutil.loadShape(file, _callback);
		};
	});

	fsutil.mkdirRecursive(config.spritePath);

	async.parallel(tasks, function (err, results) {
		var spriteData = {
			elements: [],
			path: config.spritePath + "/" + util.joinName(config.prefix, config.name, "sprite") + ".svg",
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
				className: util.joinName(config.prefix, filename.slice(filename.lastIndexOf("/") + 1, -suffix.length)),
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

		var filepath = path.relative(process.cwd(), config.spritePath + "/" + util.joinName(config.prefix, config.name, "sprite") + ".svg");
		fs.writeFileSync(filepath, svgutil.wrap(x, spriteHeight, elements), "utf8");

		callback(null, config, spriteData);
	});
};