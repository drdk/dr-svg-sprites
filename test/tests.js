module.exports = [
	
	{
		name: "spriteElementPath-string"
	},
	
	{
		name: "spriteElementPath-glob-star",
		spriteElementPath: "./test/source/img/shapes/*le.svg"
	},
	
	{
		name: "spriteElementPath-glob-parens",
		spriteElementPath: "./test/source/img/shapes/+(square|triangle).svg"
	},
	
	{
		name: "spriteElementPath-glob-negation",
		spriteElementPath: ["./test/source/img/shapes/*.svg", "!./test/source/img/shapes/triangle.svg"]
	},

	{
		name: "spritePath-file",
		spritePath: "./tmp/spritePath-file/spritePath-file.svg"
	},

	{
		name: "spritePath-path",
		spritePath: "./tmp/spritePath-path/sprite"
	},

	{
		name: "previewPath",
		previewPath: "./tmp/previewPath/previewPath.html"
	},

	{
		name: "cssPath-file",
		cssPath: "./tmp/cssPath-file/cssPath-file.css"
	},

	{
		name: "cssPath-path",
		cssPath: "./tmp/cssPath-path/css/cssPath-path.css"
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
		name: "cssPngPrefix-cssSvgPrefix-blank",
		cssSvgPrefix: ""
	},

	{
		name: "cssUnit-rem",
		cssUnit: "rem"
	},

	{
		name: "cssUnit-cssBaseFontSize-rem",
		cssUnit: "rem",
		cssBaseFontSize: 10
	},

	{
		name: "cssUnit-em",
		cssUnit: "em"
	},

	{
		name: "cssUnit-cssBaseFontSize-em",
		cssUnit: "em",
		cssBaseFontSize: 10
	},

	{
		name: "cssIncludeElementSizes",
		cssIncludeElementSizes: false
	},

	{
		name: "selector-advanced",
		spriteElementPath: "./test/source/img/shapes-with-state/*.svg",
		previewPath: null,
		selector: function (filename, tokens) {
			var parts = filename.split("_");
			var state = (parts.length === 2) ? ":" + parts[1] : "";
			return "button" + state + " > ." + parts[0];
		},
		refSize: "medium",
		sizes: {
			small: [13],
			medium: [26]
		}
	},

	/*
		template
	*/

	{
		name: "layout-horizontal",
		layout: "horizontal"
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
	},

	{
		name: "svgo",
		svgo: {
			plugins: [
				{ mergePaths: false },
				{ convertTransforms: false },
				{ cleanupIDs: false }
			]
		}
	},

	{
		name: "svgAttributes",
		svgAttributes: {
			version: "1.0",
			baseProfile: null,
			preserveAspectRatio: "xMaxYMax meet"
		}
	},

	{
		name: "breakpoints-cssUnit-em",
		cssUnit: "em",
		breakpoints: [400, 640, 800],
		refSize: "medium",
		sizes: {
			small: [13, 26, 39, 52],
			medium: [26, 39, 52, 65]
		}
	}

];