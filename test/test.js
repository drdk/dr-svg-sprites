var _ = require("lodash");
var vfs = require("vinyl-fs");
var through = require("through2");
var builder = require("../index");

vfs.src("./test/tests/*.json").pipe(test());

function test () {

	return through.obj(function (file, encoding, callback) {
		
		var options = JSON.parse(file.contents.toString());
		
		var _options = _.assign({
			spriteElementPath: "./test/img/shapes",
			spritePath: "./tmp/img/sprites",
			cssPath: "./tmp/css"
		}, options);

		builder(_options, function (err, result) {
			console.log(_options.name, result);
			callback(null);
		});

	}, function () {

		console.log("Tests done.")
		
	});
	
}