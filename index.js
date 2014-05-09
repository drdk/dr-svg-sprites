/*
 * dr-svg-sprites
 *
 *
 * Copyright (c) 2014 drdk
 * Licensed under the MIT license.
 */

"use strict";

module.exports = function (config, callback) {

	var path = require("path");
	var async = require("async");
	var vfs = require("vinyl-fs");
	var through = require("through2");
	var svgutil = require("./lib/svgutil");
	var Sprite = require("./lib/sprite");
	var buildCSS = require("./lib/build-css");
	var buildSVG = require("./lib/build-svg");
	var buildPNG = require("./lib/build-png");
	var buildPreview = require("./lib/build-preview");

	var glob = config.spriteElementPath + path.sep + "*.svg";
	var sprite = new Sprite(config)

	vfs.src(glob).pipe(build(sprite));

	function build (sprite) {

		return through.obj(function (file, encoding, callback) {
			svgutil.parse(file.contents.toString(), function (err, data) {
				sprite.addItem(file.path, data.source, data.width, data.height);
				callback(null);
			});
		}, function () {

			sprite.prepare();

			var tasks = [
				function (callback) {
					buildSVG(sprite, function () {
						buildPNG(sprite, callback);
					});
				}
			];
			
			if (sprite.cssPath) {
				tasks.push(function (callback) {
					buildCSS(sprite, callback);
				});
			}
			
			if (sprite.previewPath) {
				tasks.push(function (callback) {
					buildPreview(sprite, callback);
				});
			}

			async.parallel(
				tasks,
				function () {
					if (typeof callback == "function") {
						callback(null);
					}
				}
			);
			
		});
		
	}

};
