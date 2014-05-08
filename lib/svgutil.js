var fs = require("fs");
var path = require("path");
var SVGO = require("svgo");

var svgo = new SVGO();

function parse (content, callback) {
	svgo.optimize(content, function (result) {
		var data = {
			source: result.data.replace(/^<svg[^>]+>|<\/svg>$/g, ""),
			width: parseFloat(result.info.width),
			height: parseFloat(result.info.height)
		}
		callback(null, data);
	});
}

function transform (data, x, y, fill) {
	if (x == 0 && y == 0) {
		return data;
	}
	if (data != data.match(/^<g>(?:.*?)<\/g>/)) {
		data = "<g>" + data + "</g>";
	}
	var attributes = " transform=\"translate(" + x + ( y ? " " + y : "" ) + ")\"";
	if (fill) {
		if (data.match(/fill="/)) {
			data = data.replace(/(fill=")[^"]+(")/g, "$1" + fill + "$2");
		}
		else {
			attributes += " fill=\"" + fill + "\"";
		}
	}
	data = data.replace(/^<g/, "<g" + attributes);
	return data;
}

function wrap (width, height, shapes) {
	return '<svg baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 ' + width + ' ' + height + '" >' + shapes.join("") + '</svg>';
}

module.exports.parse = parse;

module.exports.transform = transform;

module.exports.wrap = wrap;