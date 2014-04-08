/*
 * dr-svg-sprites
 *
 *
 * Copyright (c) 2013 drdk
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (config, callback) {

	var _ = require("lodash");
	var path = require("path");
	var fsutil = require("./lib/fsutil");
	var buildCSS = require("./lib/build-css");
	var buildSVGSprite = require("./lib/build-svg");
	var buildPNGSprites = require("./lib/build-png");

	// Humble defaults
	var defaults = {
		unit: 10,
		prefix: "",
		cssSuffix: "css",
		units: "px"
	}

	// Merge defaults with user configuration
	config = _.assign(defaults, config);
	if (typeof callback == "function") {
		config.callback = callback;
	}

	var root = path.relative(process.cwd(), config.spriteElementPath);

	if (config.prefix && !("cssPrefix" in config)) {
		config.cssPrefix = config.prefix;
	}

	config.spritePath = config.spritePath.replace(/\\/g, "/").replace(/\/$/, "");

	var spriteElements = fsutil.getFiles(root, ".svg").map(function(spriteElement){
		return root + "/" + spriteElement;
	});
	spriteElements.sort();

	buildSVGSprite(config, spriteElements, buildPNGSprites);

};