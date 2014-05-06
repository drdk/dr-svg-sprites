var fs = require("fs");
var path = require("path");

function getFiles (dir, type, callback) {
	if (typeof type == "function") {
		callback = type;
		type = "";
	}
	fs.readdir(dir, function (err, entries) {
		if (err) {
			throw err;
		}

		var result = entries.filter(function (entry) {
			return (!type || path.extname(entry) == type);
		});
		
		callback(result);

	});
}

module.exports.getFiles = getFiles;