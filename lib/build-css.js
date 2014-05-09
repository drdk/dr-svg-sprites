var fs = require("fs");
var handlebars = require("handlebars");
var util = require("./util");

module.exports = function (sprite, callback) {

	var config = sprite.config;
	var optInSelector = config.optInSelector;
	var optOutSelector = config.optOutSelector;

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

	handlebars.registerHelper("optIn", function (items) {
		return optInSelector + items.map(function (item) {
			return item.className;
		}).join(", " + optInSelector);
	});

	handlebars.registerHelper("optInAll", function (sizes) {
		return sizes.map(function (size) {
			return handlebars.helpers.optIn.apply(this, [size.items]);
		}.bind(this)).join(", ");
	});

	handlebars.registerHelper("optOut", function (items) {
		return optOutSelector + items.map(function (item) {
			return item.className;
		}).join(", " + optOutSelector);
	});

	handlebars.registerHelper("optOutAll", function (sizes) {
		return sizes.map(function (size) {
			return handlebars.helpers.optOut.apply(this, [size.items]);
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