var path = require("path");
var _ = require("lodash");
var layout = require("layout");
var Model = require("fishbone");
var util = require("./util");

module.exports = Model({
	/*
	config: null,
	width: null,
	height: null,
	cssPath: null,
	svgPath: null,
	items: [],
	sizes: [],
	*/
	init: function (config, options) {

		// Humble defaults
		var defaults = {
			unit: 10,
			prefix: "",
			cssSuffix: "css",
			baseFontSize: 16,
			units: "px",
			layout: "left-right",
			template: "",
			optInSelector: ".svg",
			optOutSelector: "",
			includeElementSizes: true
		};

		// Merge defaults with user configuration
		config = _.assign(defaults, config);

		if (config.prefix && !("cssPrefix" in config)) {
			config.cssPrefix = config.prefix;
		}

		if (!config.template) {
			var template = "../templates/stylesheet.hbs";
			if (!config.includeElementSizes) {
				template = "../templates/stylesheet-without-dimensions.hbs";
			}
			config.template = path.join(__dirname, template);
		}

		if (config.spritePath.slice(-1) == "/") {
			config.spritePath = config.spritePath.slice(0, -1);
		}

		if (config.optOutSelector) {
			config.optInSelector = "";
			if (config.optOutSelector.slice(-1) != " ") {
				config.optOutSelector += " ";
			}
		}
		else {
			if (config.optInSelector.slice(-1) != " ") {
				config.optInSelector += " ";
			}
		}

		this.name = config.name;
		this.config = config;
		this.items = [];
		this.sizes = [];
		this.cssPath = path.join(config.cssPath, util.joinName(config.cssPrefix, config.name, "sprites") + "." + config.cssSuffix);
		this.svgPath = path.join(config.spritePath, util.joinName(config.prefix, config.name, "sprite") + ".svg");
	},
	prepare: function () {

		// layout

		var layoutData = layout(this.config.layout);
		this.items.forEach(function (element) {
			layoutData.addItem(element);
		});
		_.assign(this, layoutData.export());

		// sizes

		if (this.config.sizes && !_.isEmpty(this.config.sizes)) {
			for (var label in this.config.sizes) {
				this.addSize(label);
			}
		}
		else {
			this.addSize("");
		}

	},
	addItem: function (file, source, width, height) {

		var filename = path.basename(file);
		var classNameBase = path.basename(file, path.extname(file));

		this.items.push({
			classNameBase: this.config.map && this.config.map[classNameBase] || classNameBase,
			source: source,
			cssWidth: Math.ceil(width),
			cssHeight: Math.ceil(width),
			width: util.roundUpToUnit(width + this.config.unit, this.config.unit),
			height: util.roundUpToUnit(height + this.config.unit, this.config.unit),
			x: null,
			y: null
		});
	},
	addSize: function (label) {
		var config = this.config;
		var size = (config.sizes && label in config.sizes) ? config.sizes[label] : 1;
		var refSize = (typeof config.refSize == "string") ? config.sizes[config.refSize] : config.refSize || size;
		var pngPath = path.join(config.spritePath, util.joinName(config.prefix, config.name, label, "sprite") + ".png");
		var width = util.scaleValue(this.width, size, refSize);
		var height = util.scaleValue(this.height, size, refSize);
		var items = this.items.map(function (item) {
			return {
				className: util.makeClassName(item.classNameBase, label, config.prefix),
				width: util.scaleValue(item.cssWidth, size, refSize),
				height: util.scaleValue(item.cssHeight, size, refSize),
				x: util.scaleValue(item.x, size, refSize),
				y: util.scaleValue(item.y, size, refSize)
			};
		});

		this.sizes.push({
			label: label,
			items: items,
			pngPath: pngPath,
			width: width,
			height: height
		});
	}
});