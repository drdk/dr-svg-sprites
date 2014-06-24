# dr-svg-sprites

> Create SVG sprites with PNG fallbacks at needed sizes

### Usage

Minimal:

```js
var builder = require("dr-svg-sprites");
var options = {
	spriteElementPath: "img/logos",
	spritePath: "img/sprites/logo-sprite.svg",
	cssPath: "css/logo-sprite.css"
};
builder(options, function () {
	// sprite was built
});
```

would yield the following files:
- `css/logo-sprite.css`
- `img/sprites/logo-sprite.svg`
- `img/sprites/logo-sprite.png`

Advanced:

```js
var builder = require("dr-svg-sprites");
var options = {
	name: "tv",
	prefix: "dr-logos",
	spriteElementPath: "img/logos/tv",
	spritePath: "img/sprites",
	layout: "packed",
	cssPath: "css",
	cssSuffix: "less",
	cssUnit: "rem",
	sizes: {
		large: 24,
		small: 16
	},
	refSize: "large"
};
builder(options, function () {
	// sprite was built
});
```

would yield the following files:
- `css/dr-logos-tv-sprite.less`
- `img/sprites/dr-logos-tv-sprite.svg`
- `img/sprites/dr-logos-tv-sprite-large.png`
- `img/sprites/dr-logos-tv-sprite-small.png`


### Options

- [options.name](#optionsname)
- [options.spriteElementPath](#optionsspriteelementpath)
- [options.spritePath](#optionsspritepath)
- [options.previewPath](#optionspreviewpath)
- [options.cssPath](#optionscsspath)
- [options.cssPrefix](#optionscssPrefix)
- [options.cssSuffix](#optionscsspath)
- [options.cssSvgPrefix](#optionscsspath)
- [options.cssPngPrefix](#optionscsspath)
- [options.cssPath](#optionscsspath)
- [options.cssUnit](#optionscssunit)
- [options.cssBaseFontSize](#optionscssbasefontsize)
- [options.cssIncludeElementSizes](#optionscssincludeelementsizes)
- [options.template](#optionstemplate)
- [options.layout](#optionslayout)
- [options.map](#optionsmap)
- [options.unit](#optionsunit)
- [options.refSize](#optionsrefSize)
- [options.sizes](#optionssizes)
- [options.breakpoints](#optionsbreakpoints)
- [options.baseQuery](#optionsbasequery)
- [options.svgo](#optionssvgo)


#### options.name
Type: `String`
Optional

Used when automatically building stylesheet and image filenames.

#### options.spriteElementPath
Type: `String` or glob pattern

Either the path a fodler containing the elements - or a glob pattern (string or array of strings) that matches the elements - to be sprited.

#### options.spritePath
Type: `String`

Destination path of the generated sprite images.

If the filename part (ending in `.svg`) is omitted it will be built from `options.prefix`, `options.name` and  `"sprite"`.

#### options.previewPath
Type: `String`
Default value: `""`
Optional

The path where to built a preview page. 

If the filename part (ending in `.html`) is omitted it will be built from `options.prefix`, `options.name` and  `"sprite"`.

Default is no preview.

#### options.cssPath
Type: `String`
Optional

Destination path of the generated stylesheet.

If a filename part is omitted it will get built from `options.cssPrefix`, `options.name`, `"sprite"` and `options.cssSuffix`.

If left blank only svg sprites and png fallbacks are generated.
			
#### options.prefix
Type: `String`
Default value: `""`
Optional

Defines a prefix for the name of the sprite stylesheet, images and classnames.

#### options.cssPrefix
Type: `String`
Default value: `""`
Optional

Defines a prefix for the name of the sprite stylesheet (this overrides `options.prefix` if set).

Only used when automatically building stylesheet filenames.

#### options.cssSuffix
Type: `String`
Default value: `"css"`
Optional

Stylesheet filetype suffix.

Only used when automatically building stylesheet filenames.

#### options.cssSvgPrefix
Type: `String`
Default value: `".svg"`
Optional

Defines a prefix for selectors to target svg sprites. 

#### options.cssPngPrefix
Type: `String`
Default value: `""`
Optional

Defines a prefix for selectors to target png sprites. 


#### options.cssUnit
Type: `String`
Default value: `"px"`
Optional

Defines the unit used for dimensions and positions in the stylesheet.
Only other unit that is supported (in a meaningful way) is `"rem"` - which is used in combination with `options.cssBaseFontSize`.

#### options.cssBaseFontSize
Type: `String`
Default value: `16`
Optional

Used to calculate values when using `options.cssUnit` set to `"rem"`.

#### options.cssIncludeElementSizes
Type: `Boolean`
Default value: `true`
Optional

If set to `false` `width` and `height` for the svg elements will be omitted from the stylesheet. Useful in combination with a `options.layout` of `"alt-diagonal"`.

#### options.template
Type: `String`
Default value: `"../templates/stylesheet.hbs"`
Optional

Defines the path of the Handlebars template to use for generating the stylesheet.

The data object passed to the Handlebars template is a `Sprite` instance (see `./lib/Sprite.js`).

Templates have a few internal helpers at their disposal:

- `url`: Takes a path (`String`) and returns a CSS appropriate path.
- `unit`: Adds units to a value (`Number`) if needed and also converts from `px` to `rem`.
- `prefix`: Accepts an array of items (`Sprite.sizes[].items`) and a selector prefix (`String`). Returns a comma separated prefixed selector for all elements in a size.
- `prefixAll`: Accepts an array of sizes (`Sprite.sizes`) and a selector prefix (`String`). Returns a comma separated prefixed selector for all elements for all sizes.


#### options.layout
Type: `String`
Default value: `"horizontal"`
Optional

Defines the layout of elements in the sprite. Possible values:
- `"horizontal"`: Elements are placed side-by-side.
- `"vertical"`: Elements are placed above eachother.
- `"packed"`: Elements are packed into smallest possible space.
- `"diagonal"`: Elements are distributed from top-left to bottom-right corner.
- `"alt-diagonal"`: Elements are distributed from bottom-left to top-right corner.

#### options.map
Type: `Object|Function`
Default value: `null`
Optional

Can be used to translate svg element basenames (filename without extension) into desired names. Handy if the basenames don't make good classnames (or contain invalid chars).

If an object is supplied it will be used as a lookup table.

If a function is supplied it will be used to transform the svg element basename.

#### options.unit
Type: `Number`
Default value: `5`

Defines unit size of the grid the sprite elements snap to.
If `options.sizes` is used a default unit size will calculated to ensure placement is  across the different sizes.

#### options.refSize
Type: `String|Number`
Optional

Defines the basic size of your source svg-elements. All other sizes will be calculated relating to this. It can either be a key from the `sizes` option (which refers to a number) or just a raw number.

![Source elements and refSize](https://raw.github.com/drdk/grunt-dr-svg-sprites/master/docs/img/docs-source-elements.png)

Notice how one source element is bigger than the `refSize`; this ok - as every element is scaled proportionally.

#### options.sizes
Type: `Object`
Optional

A hash of size labels and values (`Number` - or `Array` if used in conjunction with `options.breakpoints` - see below) that define the different sizes of the needed sprites.

```js
var options = {
	// some options
	sizes: {
		large: 39,
		small: 13
	},
	refSize: "large",
	// more options
};
```

![sizes](https://raw.github.com/drdk/grunt-dr-svg-sprites/master/docs/img/docs-sprite-sizes.png)

1 SVG sprite is generated and 2 PNG sprites (1 per defined size).

#### options.breakpoints
Type: `Array`
Optional

Let's you define breakpoints or custom media queries for a sprite.
Each value in the array is transformed into a media query string (if it's not already one) via the `options.baseQuery` template.
Numbers are automatically prepended `px` units.
Values in `options.sizes` are expanded to arrays of values; the first value is the default size value used without media queries and each subsequent value is matched with a corresponding `options.breakpoints` value.

```js
var options = {
	// some options
	breakpoints: [530, "80em", "@media only screen and (orientation:portrait)"],
	sizes: {
		large: [39, 52, 65, 39],
		small: [13, 26, 39, 26]
	},
	// more options
};
```

**Note**: No additional PNG fallbacks are generated for breakpoints in the thinking that clients supporting media queries also have SVG support.

#### options.baseQuery
Type: `String`
Default value: `"@media only screen and (min-width: {{breakpoint}})"`
Optional

Used to generate media query strings from the values of `options.breakpoints` by replacing the `{{breakpoint}}` token with each.

```js
var options = {
	// some options
	baseQuery: "@media only screen and (monochrome) and (min-width: {{breakpoint}})",
	breakpoints: [530, 960, 1280],
	sizes: {
		large: [39, 52, 65, 39],
		small: [13, 26, 39, 26]
	},
	// more options
};
```

#### options.svgo
Type: `Object`
Optional

This options gives a direct route to configure [svgo](https://github.com/svg/svgo) which is used behind the scene reading and outputting SVG's.

```js
var options = {
	// some options
	svgo: {
		plugins: [
			{ mergePaths: false },
			{ convertTransforms: false }
		]
	},
	// more options
}
```

---

## Contributing

Pull request for bug-fixes/features are welcome - though I will reserve judgement on what actually goes in ;)

New features should be accompanied by [tests](#testing).

### Code style

Basically you should just try to follow the general style of the existing code.

**Do's:**

* Tabs for indentation, spaces for alignment.
* Separate var-statements when also assigning values.
* Semicolons.

**Dont's:**

* Single-line if/else-statements.
* Pad parens with spaces.
* Comma-first.

```js
var style = {
	comma: "last",
	useTabs: true,
	semicolons: true
};
var useTabs = false;
var comma, semicolons;

if (!useTabs) {
	useTabs = style.useTabs;
}

comma = style.comma;
semicolons = style.semicolons;

if (comma === "last" && useTabs && semicolons) {
	console.log("Thumbs up!");
}
```


### Testing

Testing consists of building a suite of test sprites (configs defined in `test/tests.js`) to a tmp folder. The generated files are then diffed against the corresponding files in `test/prebuilt`.
Any changes are logged to the console either as just `changed` (png) or as full patch-style output (svg, html, css etc). 

The full test suite can be run in a console with:

```
npm test
```

or

```
node test/runner.js
```

Specific tests can be run by supplying the names of the tests as additional arguments:

```
node test/runner.js map-object map-function
```

---

## Changelog

### 0.9.7

Features:

* `options.svgo` added.

Changes:

* `options.spriteElementPath` now also supports glob patterns.
* Added tests.

### 0.9.5

Features:

* `options.breakpoints` added.
* `options.baseQuery` added.

Changes:

* `options.sizes` also accepts arrays of values when used in combination with `options.breakpoints`.
* White-space can now be controlled in templates without it getting clobbered.

### 0.9.0

Features:

* `options.layout` added.
* `options.map` added.
* `options.template` added.
* `options.previewPath` added.
* `options.cssSvgPrefix` added.
* `options.cssPngPrefix` added.
* `options.cssUnit` added.
* `options.cssBaseFontSize` added.
* `options.cssIncludeElementSizes` added.

Changes:

* `options.sizes` and `options.refSize` are now optional (which also means no size tag is added to classnames if `options.sizes` is omitted).
* `options.spritePath` and `options.cssPath` now also accept a full path including filename for simpler configuration.
