var fs = require("fs");
var path = require("path");
var async = require("async");
var vfs = require("vinyl-fs");
var through = require("through2");
var diff = require("diff");
var hashfile = require("hashfile");

var ADDED = "added";
var CHANGED = "changed";
var UNCHANGED = "unchanged";

module.exports = function (name, newPath, oldPath, callback) {

	newPath = path.resolve(newPath);
	oldPath = path.resolve(oldPath);

	var glob = [path.join(newPath, name, "*"), "!" + path.join(newPath, name, "config.json")];

	var changes = {};

	vfs.src(glob).pipe(through.obj(function (file, encoding, callback) {

		var newFile = file.path;
		var relFile = path.relative(__dirname, newFile);
		var ext = path.extname(newFile);
		var oldFile = path.join(oldPath, path.relative(newPath, newFile));

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
									result.status = CHANGED;
								}
								else {
									result.status = UNCHANGED;
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
										callback(null, content && content.replace(/\r\n/g, "\n"));
									});
								},
								oldFile: function (callback) {
									fs.readFile(oldFile, "utf-8", function (err, content) {
										callback(null, content && content.replace(/\r\n/g, "\n"));
									});
								}
							},
							function (err, contents) {
								if (contents.newFile != contents.oldFile) {
									result.status = CHANGED;
									//var d = diff.diffChars(contents.newFile, contents.oldFile);
									var patch = diff.createPatch(path.relative(__dirname, oldFile), contents.oldFile, contents.newFile);
									result.changes = patch;
								}
								else {
									result.status = UNCHANGED;
								}
								changes[relFile] = result;
								callback(null);
							}
						);
						break;
				}
			}
			else {
				result.status = ADDED;
				changes[relFile] = result;
				callback(null);
			}
		});

	}, function () {
		var log = [];

		var file, status, hasChanged;
		for (var filename in changes) {
			file = changes[filename];
			status = file.status;
			if (status != UNCHANGED) {
				if (file.changes) {
					log.push("");
					log.push(filename + "");
					log.push(file.changes + "");
					log.push("");
				}
				else {
					log.push([filename + "", ":", status + ""]);
				}
				hasChanged = true;
			}
		}

		log.unshift(["Diffed", name, (!hasChanged) ? "(no changes)" : ""]);

		log.forEach(function (msg) {
			console.log.apply(null, (Array.isArray(msg)) ? msg : [msg]);
		});
		callback(null);
	}));

};