# Contributing

Pull request for bug-fixes/features are welcome - though I will reserve judgement on what actually goes in ;)

New features should be accompanied by [tests](#testing).

## Code style

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


## Testing

Testing consists of building a suite of test sprites (configs defined in `test/tests.js`) to a tmp folder. The generated files are then diffed against the corresponding files in `test/prebuilt`.
Any changes are logged to the console either as just `changed` (png) or as full patch-style output (svg, html, css etc).
When changes have been vetted any valid changes should be moved to `test/prebuilt` and commited.  

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