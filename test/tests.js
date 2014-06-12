module.exports = [
	
	{
		name: "previewPath",
		previewPath: "./tmp/previewPath/previewPath.html"
	},

	{
		name: "prefix",
		prefix: "my_prefix"
	},

	{
		name: "cssSuffix",
		cssSuffix: "less"
	},

	{
		name: "cssUnit",
		cssUnit: "rem"
	},

	{
		name: "cssUnit-cssBaseFontSize",
		cssUnit: "rem",
		cssBaseFontSize: 10
	},

	{
		name: "cssPrefix",
		cssPrefix: "my_css_prefix"
	},

	{
		name: "cssSvgPrefix",
		cssSvgPrefix: ".supports-svg"
	},

	{
		name: "cssPngPrefix",
		cssPngPrefix: ".supports-png"
	},

	{
		name: "cssPngPrefix-cssSvgPrefix",
		cssPngPrefix: ".supports-png",
		cssSvgPrefix: ".supports-svg"
	},

	{
		name: "cssIncludeElementSizes",
		cssIncludeElementSizes: false
	},

	{
		name: "layout-vertical",
		layout: "vertical"
	},

	{
		name: "layout-packed",
		layout: "packed"
	},

	{
		name: "layout-horizontal",
		layout: "horizontal"
	},

	{
		name: "layout-diagonal",
		layout: "diagonal"
	},

	{
		name: "layout-alt-diagonal",
		layout: "alt-diagonal"
	},

	{
		name: "map-object",
		map: {
			"circle": "sphere",
			"square": "cube",
			"triangle": "pyramid"
		}
	},

	{
		name: "map-function",
		map: function (name) {
			return name.split("").reverse().join("");
		}
	},

	{
		name: "unit",
		unit: 20
	},

	{
		name: "refSize-number",
		refSize: 26,
		sizes: {
			small: 13,
			large: 39
		}
	},

	{
		name: "refSize-string",
		refSize: "medium",
		sizes: {
			small: 13,
			medium: 26,
			large: 39
		}
	},

	{
		name: "breakpoints",
		breakpoints: [400, 640, 800],
		refSize: "medium",
		sizes: {
			small: [13, 26, 39, 52],
			medium: [26, 39, 52, 65]
		}
	},

	{
		name: "breakpoints-em",
		breakpoints: ["30em", "60em", "90em"],
		refSize: "medium",
		sizes: {
			small: [13, 26, 39, 52],
			medium: [26, 39, 52, 65]
		}
	},

	{
		name: "breakpoints-custom",
		breakpoints: ["@media only screen and (min-width: 30.0625em) and (max-width: 60em)", "@media only screen and (min-width: 60.0625em) and (max-width: 90em)", "@media only screen and (min-width: 90.0625em)"],
		refSize: "medium",
		sizes: {
			small: [13, 26, 39, 52],
			medium: [26, 39, 52, 65]
		}
	},

	{
		name: "baseQuery",
		baseQuery: "@media only screen and (orientation:portrait) and (min-width: {{breakpoint}})",
		breakpoints: [400, 640, 800],
		refSize: "medium",
		sizes: {
			small: [13, 26, 39, 52],
			medium: [26, 39, 52, 65]
		}
	}

];