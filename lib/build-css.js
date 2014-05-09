var fs = require("fs");
var handlebars = require("handlebars");
var util = require("./util");

module.exports = function (sprite, callback) {

	var config = sprite.config;
	var cssSvgPrefix = config.cssSvgPrefix;
	var cssPngPrefix = config.cssPngPrefix;

	handlebars.registerHelper("url", function (path) {
		return path.replace(/\\/g, "/");
	});

	handlebars.registerHelper("unit", function (value, modifier) {
		if (typeof modifier == "number") {
			value *= modifier;
		}
		if (config.cssUnit == "rem") {
			value = value / config.cssBaseFontSize;
		}
		return value + ((value === 0) ? "" : config.cssUnit);
	});

	handlebars.registerHelper("svgPrefix", function (items) {
		return cssSvgPrefix + items.map(function (item) {
			return item.className;
		}).join(", " + cssSvgPrefix);
	});

	handlebars.registerHelper("svgPrefixAll", function (sizes) {
		return sizes.map(function (size) {
			return handlebars.helpers.svgPrefix.apply(this, [size.items]);
		}.bind(this)).join(", ");
	});

	handlebars.registerHelper("pngPrefix", function (items) {
		return cssPngPrefix + items.map(function (item) {
			return item.className;
		}).join(", " + cssPngPrefix);
	});

	handlebars.registerHelper("pngPrefixAll", function (sizes) {
		return sizes.map(function (size) {
			return handlebars.helpers.pngPrefix.apply(this, [size.items]);
		}.bind(this)).join(", ");
	});

	fs.readFile(config.template, "utf-8", function (err, template) {
		if (err) {
			throw err;
		}

		var compiler = handlebars.compile(template);
		var source = compiler(sprite);

		util.write(sprite.cssPath, source, function () {
			callback(null);
		});
	});

};