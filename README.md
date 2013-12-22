# string-case-match

String matching class. Given a set of strings to match, will be able to search it by different input.

## Installation and usage

With node.js
```bash
npm install string-case-match
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
