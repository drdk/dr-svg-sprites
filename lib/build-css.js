var fs = require("fs");
var handlebars = require("handlebars");
var util = require("./util");

module.exports = function (sprite, callback) {

	var config = sprite.config;
	var svgSelector = config.svgSelector;
	var pngSelector = config.pngSelector;

	handlebars.registerHelper("url", function (path) {
		return path.replace(/\\/g, "/");
	});

	handlebars.registerHelper("unit", function (value, modifier) {
		if (typeof modifier == "number") {
			value *= modifier;
		}
		if (config.units == "rem") {
			value = value / config.baseFontSize;
		}
		return value + ((value === 0) ? "" : config.units);
	});

	handlebars.registerHelper("svgSelector", function (items) {
		return svgSelector + items.map(function (item) {
			return item.className;
		}).join(", " + svgSelector);
	});

	handlebars.registerHelper("svgSelectorAll", function (sizes) {
		return sizes.map(function (size) {
			return handlebars.helpers.svgSelector.apply(this, [size.items]);
		}.bind(this)).join(", ");
	});

	handlebars.registerHelper("pngSelector", function (items) {
		return pngSelector + items.map(function (item) {
			return item.className;
		}).join(", " + pngSelector);
	});

	handlebars.registerHelper("pngSelectorAll", function (sizes) {
		return sizes.map(function (size) {
			return handlebars.helpers.pngSelector.apply(this, [size.items]);
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