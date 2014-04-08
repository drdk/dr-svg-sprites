function scaleValue (value, newSize, oldSize) {
	return Math.ceil(value * newSize / oldSize);
}

function roundUpToUnit (num, unit) {
	var dif = num % unit;
	return (dif) ? num + unit - dif : num;
}

function joinName () {
	var args = [].slice.call(arguments);
	return args.filter(function(arg){ return !!arg; }).join("-");
}

function makeClassName (string, sizeLabel, prefix) {

	if (string.indexOf("{size}") > -1) {
		string = substitute(string, {size: sizeLabel});
	}
	else {
		string += "-" + sizeLabel;
	}

	if (string[0] !== "." && string.indexOf(prefix) !== 0) {
		string = prefix + "-" + string;
	}

	return ((string[0] != ".") ? "." : "") + string;
}

function substitute (string, object) {
	return string.replace(/\{([a-zA-Z}]+)\}/g, function (match, token) {
		return (token in object) ? object[token]: match;
	});
}

function addUnits(value) {
	var response = "";
	if (value === 0) {
		response = value;
	} else {
		response = value + config.units;
	}
	return response;
}

function quotePath(path) {
	return "'" + path + "'";
}

module.exports.scaleValue = scaleValue;

module.exports.roundUpToUnit = roundUpToUnit;

module.exports.joinName = joinName;

module.exports.makeClassName = makeClassName;

module.exports.substitute = substitute;

module.exports.addUnits = addUnits;

module.exports.quotePath = quotePath;