# string-case-match

String matching class. Given a set of strings to match, it will search it by different input.  
It is able to search strings as abbreviations (e.g. `HelloWorld` matches `hw`, `hewo`, `h w`, ...). Works in node.js and all modern browsers without any dependencies. This script is intended to use as ranking function for autocompletes, searches for short strings, etc.  

See the [live demo](http://antelle.github.io/string-case-match/) page to play with it.

## Installation

With node.js
```bash
npm install string-case-match
```
```bash
bower install string-case-match
```
```javascript 
var StringCaseMatch = require("string-case-match");
console.log(new StringCaseMatch(["hello"], { start: "<i>", end: "</i>" }).matches("hell"));
```
In browser with require.js
```javascript 
require(["string-case-match"], function(StringCaseMatch) {
  console.log(new StringCaseMatch(["hello"], { start: "<i>", end: "</i>" }).matches("hell"));
})
```
Without require.js:
```html
<script src="path/to/string-case-match.js"></script>
<script>
  console.log(new StringCaseMatch(["hello"], { start: "<i>", end: "</i>" }).matches("hell"));
</script>
```
## Usage
You can find actual examples in the [spec](https://github.com/antelle/string-case-match/blob/master/spec/string-case-match.spec.js) file but here's a quick example:
```javascript
// init a matcher instance with strings to search
var matcher = new StringCaseMatch(["HelloWorld", "Hello", "Bye"]);
// get matches against "hell" word (matches will be sorted by rank in descending order)
var matches = matcher.matches("hell"); // ["Hello", "HelloWorld"] 
var matches = matcher.matches("hell", 1); // top 1 match

// to highlight found characters, use this:
var matcher = new StringCaseMatch(["HelloWorld"], { start: "<i>", end: "</i>" });
var matches = matcher.matches("hell"); // matches will look like "<i>Hell</i>oWorld"

// just get a string rank, don't search anything
// rank is [0..1], 0 - no match, 1 - complete match
var rank = new StringCaseMatch().rank("hello-world", "hell"); 
```

## License 
`string-case-match` is redistributed under [MIT license](https://raw.github.com/antelle/string-case-match/master/MIT-LICENSE.txt). So, you can use it in any projects without attribution.
