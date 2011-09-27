# Usage
	
```javascript
$('#container').suggest({
  'source': ["ActionScript", "AppleScript", "Asp", ...],  // required!
  'containerClass': 'suggest-container',                  // optional
  'suggestionClass': 'suggest-suggestion'                 // optional
});
```

Check out the [demo here](http://www.polarblau.com/code/jquery/suggest).
	
Requires basic HTML structure

```html
<input type="text" name="search" id="search" class="search" />
```

The plugin will generate the CSS required based on the input's styles.
	
This plugin currently doesn't support remote resources for haystacks for performance reasons. This might change in the future.