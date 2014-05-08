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

	var glob = path.relative(process.cwd(), config.spriteElementPath) + path.sep + "*.svg";
	
	vfs.src(glob).pipe(function build () {

		var sprite = new Sprite(config);

		return through.obj(function (file, encoding, callback) {
			
			svgutil.parse(file.contents.toString(), function (err, data) {
				sprite.addItem(file.path, data.source, data.width, data.height);
				callback(null);
			});
			
		}, function () {
			
			sprite.prepare();

			async.parallel(
				[
					function (callback) {
						buildCSS(sprite, callback);
					},
					function (callback) {
						buildSVG(sprite, function (_callback) {
							buildPNG(sprite, _callback);
						});
					},
				],
				function () {
					callback(null);
				}
			);

		});
		
	});

};