var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var vfs = require("vinyl-fs");
var async = require("async");
var through = require("through2");
var diff = require("diff");
var hashfile = require("hashfile");
var builder = require("../index");

var tmpPath = path.normalize("./tmp/");
var buildPath = path.normalize("./test/prebuilt/");

var defaults = {
	spriteElementPath: "./test/source/img/shapes",
	spritePath: "./tmp/img/sprites",
	cssPath: "./tmp/css"
};

vfs.src("./test/tests/*.json").pipe(test());

function test () {

	return through.obj(function (file, encoding, callback) {
		
		var options = JSON.parse(file.contents.toString());

		var _options = _.assign(defaults, options);

		builder(_options, function (err, result) {

			var files = [];
			var subresult;
			for (var type in result) {
				subresult = result[type];
				if (!Array.isArray(subresult)) {
					files.push(subresult);
				}
				else {
					files = files.concat(subresult);
				}
			}

			var changes = {};

			vfs.src(files).pipe(through.obj(function (file, encoding, callback) {

				var newFile = file.path;
				var relFile = path.relative(__dirname, newFile);
				var ext = path.extname(newFile);
				var oldFile = newFile.replace(tmpPath, buildPath);
				fs.exists(oldFile, function (exists) {
					var result = {};
					if (exists) {
						switch (ext) {

							case ".png":
								async.parallel(
									{
										newFile: function (callback) {
											hashfile(newFile, function (err, hash) {
												callback(null, hash);
											});
										},
										oldFile: function (callback) {
											hashfile(oldFile, function (err, hash) {
												callback(null, hash);
											});
										}
									},
									function (err, hashes) {
										if (hashes.newFile != hashes.oldFile) {
											result.status = "changed";
										}
										else {
											result.status = "unchanged";
										}
										changes[relFile] = result;
										callback(null);
									}
								);
								break;

							default:
								async.parallel(
									{
										newFile: function (callback) {
											fs.readFile(newFile, "utf-8", function (err, content) {
												callback(null, content);
											});
										},
										oldFile: function (callback) {
											fs.readFile(oldFile, "utf-8", function (err, content) {
												callback(null, content);
											});
										}
									},
									function (err, contents) {
										if (contents.newFile != contents.oldFile) {
											result.status = "changed";
											//var d = diff.diffChars(contents.newFile, contents.oldFile);
											var patch = diff.createPatch(oldFile, contents.oldFile, contents.newFile);
											result.changes = patch;
										}
										else {
											result.status = "unchanged";
										}
										changes[relFile] = result;
										callback(null);
									}
								);
								break; 
						}
					}
					else {
						result.status = "added";
						changes[relFile] = result;
						callback(null);
					}
				});

			}, function () {
				console.log("");
				console.log("changes in", _options.name, ":");
				var file;
				for (var filename in changes) {
					file = changes[filename];
					console.log(filename, ":", file.status);
					if (file.changes) {
						console.log(file.changes);
					}
				}
				callback(null);
			}));

		});

	}, function () {

		console.log("Tests done.")
		
	});
	
}

/*

	"./tmp/img/sprite.svg": {
		status: "added", //"changed", "unchanged",
		changes: []
	}

*/