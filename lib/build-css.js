var fs = require("fs");
var path = require("path");
var handlebars = require("handlebars");
var util = require("./util");

module.exports = function (sprite, callback) {

	var config = sprite.config;

	
	handlebars.registerHelper("url", function (filepath, relation) {
		if (typeof relation == "string") {
			relation = path.dirname(relation);
		}
		else {
			relation = config.cssPath;
		}
		return path.relative(relation, filepath).replace(/\\/g, "/");
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

	handlebars.registerHelper("prefix", function (items, prefix) {
		return prefix + items.map(function (item) {
			return item.className;
		}).join(", " + prefix);
	});

	handlebars.registerHelper("prefixAll", function (sizes, prefix) {
		return sizes.map(function (size) {
			return handlebars.helpers.prefix.apply(this, [size.items, prefix]);
		}.bind(this)).join(", ");
	});

	fs.readFile(config.template, "utf-8", function (err, template) {
		if (err) {
			throw err;
		}

		var compiler = handlebars.compile(template);
		var source = compiler(sprite);
		
		source = source.replace(/(^(\r\n)+)|((\r\n)+$)/g, "").replace(/(\r\n)+/g, "\r\n");

		util.write(sprite.cssPath, source, function () {
			callback(null);
		});
	});

};