var path = require("path");
var _ = require("lodash");
var layout = require("layout");
var util = require("./util");

function Sprite (_config) {

	// Humble defaults
	var defaults = {
		prefix: "",
		cssPath: "",
		cssSuffix: "css",
		previewPath: "",
		//cssSvgPrefix: ".svg",
		//cssPngPrefix: "",
		cssUnit: "px",
		cssBaseFontSize: 16,
		cssIncludeElementSizes: true,
		layout: "horizontal",
		template: "",
		baseQuery: "@media only screen and (min-width: {{breakpoint}})"
	};

	// Merge defaults with user configuration
	var config = _.assign(defaults, _config);

	if (config.prefix && !("cssPrefix" in config)) {
		config.cssPrefix = config.prefix;
	}

	var layouts = {
		"horizontal": "left-right",
		"vertical": "top-down",
		"packed": "binary-tree"
	};

	if (typeof config.spriteElementPath == "string" && !config.spriteElementPath.match(/[*+(){}|!]/)) {
		config.spriteElementPath = path.join(config.spriteElementPath, "*.svg");
	}

	if (config.layout in layouts) {
		config.layout = layouts[config.layout];
	}

	if (!config.template) {
		config.template = path.join(__dirname, "../templates/stylesheet.hbs");
	}

	/*
	if (config.spritePath.slice(-1) == "/") {
		config.spritePath = config.spritePath.slice(0, -1);
	}
	*/

	if ("cssPngPrefix" in config) {
		if (!("cssSvgPrefix" in config)) {
			config.cssSvgPrefix = "";
		}
	}
	else {
		if (!("cssSvgPrefix" in config)) {
			config.cssSvgPrefix = ".svg";
		}
		config.cssPngPrefix = "";
	}
	if (config.cssPngPrefix && config.cssPngPrefix.slice(-1) != " ") {
		config.cssPngPrefix += " ";
	}
	if (config.cssSvgPrefix && config.cssSvgPrefix.slice(-1) != " ") {
		config.cssSvgPrefix += " ";
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

	var previewPath;
	// if the path includes filename just use the raw path - otherwise assemble path
	if (config.previewPath) {
		if (config.previewPath.match(/\.html$/)) {
			previewPath = config.previewPath;
		}
		else {
			previewPath = path.join(config.previewPath, util.joinName(config.prefix, config.name, "sprite") + ".html");
		}
	}
	
	if (typeof config.unit != "number") {
		
		if (config.sizes) {
			var usedSizes = [];
			var refSize = (typeof config.refSize === "number") ? config.refSize : null;
			if (Array.isArray(config.sizes)) {
				[].push.apply(usedSizes, config.sizes);
			}
			else {
				if (refSize in config.sizes) {
					refSize = config.sizes[refSize];
					if (Array.isArray(refSize)) {
						refSize = refSize[0];
					}
				}
				var size;
				for (var label in config.sizes) {
					size = config.sizes[label];
					[].push.apply(usedSizes, Array.isArray(size) ? size : [size]);
				}
			}
			if (refSize) {
				usedSizes.push(config.refSize);
			}
			else if (typeof config.refSize === "string") {
				refSize = config.sizes[config.refSize];
				if (Array.isArray(refSize)) {
					refSize = refSize[0];
				}
			}
			var min = Math.min.apply(null, usedSizes);
			if (min < refSize) {
				min = refSize;
			}
			var gcd = util.gcdm(usedSizes);
			config.unit = min / gcd;
		}
		else {
			config.unit = 5;
		}
		
	}

	if (config.breakpoints) {
		config.breakpoints = config.breakpoints.map(function (breakpoint) {
			var query;
			if (typeof breakpoint == "number") {
				breakpoint += "px";
			}
			if (breakpoint.indexOf("@") == 0) {
				query = breakpoint;
			}
			else {
				query = config.baseQuery.replace("{{breakpoint}}", breakpoint)
			}
			return {
				query: query
			};
		});
	}

	this.name = config.name;
	this.config = config;
	this.items = [];
	this.sizes = [];
	this.cssPath = cssPath;
	this.svgPath = svgPath;
	this.previewPath = previewPath;
	this.namespaces = [];
};

Sprite.prototype.prepare = function () {

	// layout

	var layoutData = layout(this.config.layout);
	this.items.forEach(function (element) {
		layoutData.addItem(element);
	});
	_.assign(this, layoutData.export());
	
	// sizes

	if (this.config.sizes && !Array.isArray(this.config.sizes) && !_.isEmpty(this.config.sizes)) {
		for (var label in this.config.sizes) {
			this.addSize(label);
		}
	}
	else {
		this.addSize("");
	}

};

Sprite.prototype.addItem = function (file, source, namespaces, width, height) {

	var filename = path.basename(file);
	var classNameBase = path.basename(file, path.extname(file));

	if (Array.isArray(namespaces)) {
		namespaces.forEach(function (namespace) {
			if (this.namespaces.indexOf(namespace) === -1) {
				this.namespaces.push(namespace);
			}
		}, this);
	}

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
		cssHeight: Math.ceil(height),
		width: util.roundUpToUnit(width + this.config.unit, this.config.unit),
		height: util.roundUpToUnit(height + this.config.unit, this.config.unit),
		x: null,
		y: null
	});
};

Sprite.prototype.addSize = function (label) {
	var config = this.config;
	var breakpoints = [];
	var breakpointSizes = null;
	var size = 1;
	if (config.sizes) {
		if (Array.isArray(config.sizes)) {
			size = config.sizes;
		}
		else if (label in config.sizes) {
			size = config.sizes[label];
		}
	}
	if (Array.isArray(size)) {
		breakpointSizes = size.slice(1);
		size = size[0];
	}
	var refSize = config.refSize || size;
	if (typeof config.refSize == "string") {
		refSize = config.sizes[refSize];
	}
	if (Array.isArray(refSize)) {
		refSize = refSize[0];
	}
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

	if (config.breakpoints && breakpointSizes) {
		breakpoints = config.breakpoints.map(function (breakpoint, index) {
			var size = breakpointSizes[index];
			return {
				query: breakpoint.query,
				width: util.scaleValue(this.width, size, refSize),
				height: util.scaleValue(this.height, size, refSize),
				items: this.items.map(function (item, index) {
					return {
						className: items[index].className,
						width: util.scaleValue(item.cssWidth, size, refSize),
						height: util.scaleValue(item.cssHeight, size, refSize),
						x: util.scaleValue(item.x, size, refSize),
						y: util.scaleValue(item.y, size, refSize)
					};
				})
			};
		}, this);
	}

	this.sizes.push({
		label: label,
		items: items,
		pngPath: pngPath,
		width: width,
		height: height,
		breakpoints: breakpoints
	});
};

module.exports = Sprite;