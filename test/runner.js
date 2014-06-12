var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var async = require("async");
var builder = require("../index");
var tests = require("../test/tests").slice();
var differ = require("../test/differ");

var newPath = path.normalize("./tmp/");
var oldPath = path.normalize("./test/prebuilt/");

var defaults = {
	spriteElementPath: "./test/source/img/shapes"
};

var testsToRun = process.argv.slice(2).map(function (name) {
	return _.clone(_.find(tests, {name: name}), true);
});

if (!testsToRun.length) {
	testsToRun = _.clone(tests, true);
}

run(testsToRun, buildTest, buildDone);

function buildDone () {
	console.log("All tests built.");
	run(testsToRun, diffTest, diffDone);
}

function diffDone () {
	console.log("All tests diffed.");
}

function run (items, func, callback) {
	var queue = async.queue(func, items.length);
	queue.push(items);
	queue.drain = callback;
}

function diffTest (options, callback) {
	differ(options.name, newPath, oldPath, callback);
}

function buildTest (options, callback) {
	
	var _options = _.clone(options, true);

	_.assign(_options, defaults);

	if (!("spritePath" in _options) && !("cssPath" in _options)) {
		var root = path.join(newPath, _options.name);
		_options.spritePath = root;
		_options.cssPath = root;
	}

	if (!("previewPath" in _options)) {
		_options.previewPath = path.join(root, "index.html");
	}

	builder(_options, function (err, result) {
		console.log("Built", _options.name);
		callback(null);
	});

}