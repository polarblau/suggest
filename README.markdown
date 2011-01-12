# Usage
	
	$('#container').suggest({
		'source': ["ActionScript", "AppleScript", "Asp", ...],  // required!
		'containerClass': 'suggest-container',                  // optional
		'suggestionClass': 'suggest-suggestion'                 // optional
	});

Check out the [demo here](http://www.polarblau.com/code/jquery/suggest).
	
Requires basic HTML structure
	<input type="text" name="search" id="search" class="search" />
	
Please have a look at the CSS included in the index.html file! You'll need to adjust it for your own purpose.
	
This plugin currently doesn't support remote resources for haystacks for performance reasons. This might change in the future.