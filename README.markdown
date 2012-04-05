# Usage

```javascript
var haystack = ["ActionScript", "AppleScript", "Asp", ...];
$('#container').suggest(haystack, {
  // Available options with defaults:
  suggestionColor   : '#cccccc',
  moreIndicatorClass: 'suggest-more'
  moreIndicatorText	: '&hellip;'
});
```

```html
<input type="text" name="search" id="search" />
```

More information and demo can be found [here](http://polarblau.github.com/suggest/).

The plugin will generate the CSS required based on the input's styles.

This plugin currently doesn't support remote resources for haystacks for performance reasons. This might change in the future.


# Installation via npm

```bash
npm install jquery-suggest
```

# Contributers

* **cabgfx** https://github.com/cabgfx
