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
			cssPath: "",
			cssSuffix: "css",
			baseFontSize: 16,
			lengthUnit: "px",
			layout: "horizontal",
			template: "",
			svgSelector: ".svg",
			pngSelector: "",
			includeElementSizes: true
		};

		// Merge defaults with user configuration
		config = _.assign(defaults, config);

		if (config.prefix && !("cssPrefix" in config)) {
			config.cssPrefix = config.prefix;
		}

		var layouts = {
			"horizontal": "left-right",
			"vertical": "top-down",
			"packed": "binary-tree"
		};

		if (config.layout in layouts) {
			config.layout = layouts[config.layout];
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

		if (config.pngSelector) {
			config.svgSelector = "";
			if (config.pngSelector.slice(-1) != " ") {
				config.pngSelector += " ";
			}
		}
		else {
			if (config.svgSelector.slice(-1) != " ") {
				config.svgSelector += " ";
			}
		}

		var cssPath;
		// if the path includes filename just use the raw path - otherwise assemble path
		if (path.basename(config.cssPath).indexOf(".") > -1) {
			cssPath = config.cssPath;
		}
		else {
			cssPath = path.join(config.cssPath, util.joinName(config.cssPrefix, config.name, "sprite") + "." + config.cssSuffix);
		}

		var svgPath;
		// if the path includes filename just use the raw path - otherwise assemble path
		if (config.spritePath.match(/\.svg$/)) {
			svgPath = config.spritePath;
		}
		else {
			svgPath = path.join(config.spritePath, util.joinName(config.prefix, config.name, "sprite") + ".svg");
		}

		this.name = config.name;
		this.config = config;
		this.items = [];
		this.sizes = [];
		this.cssPath = cssPath;
		this.svgPath = svgPath;
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

		if (this.config.map) {
			if (typeof this.config.map == "function") {
				classNameBase = this.config.map(classNameBase);
			}
			else if (this.config.map[classNameBase]) {
				classNameBase = this.config.map[classNameBase];
			}
		}

		this.items.push({
			classNameBase: classNameBase,
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
		var width = util.scaleValue(this.width, size, refSize);
		var height = util.scaleValue(this.height, size, refSize);
		var pngPath = this.svgPath.replace(/\.svg$/, ((label) ? "-" + label : "") + ".png");
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