/*!
 * Suggest jQuery plugin
 *
 * Copyright (c) 2011 Florian Plank (http://www.polarblau.com/)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * USAGE:
 * 
 * 
 * $('#search').suggest({
 * 	'source': ["ActionScript", "AppleScript", "Asp", ...]
 * });
 */

(function($) {

	$.fn.suggest = function(options) {
		var defaults = {
			'source': [],
			'containerClass': 'suggest-container',
			'suggestionClass': 'suggest-suggestion'
		};
		return this.each(function() {
			options = $.extend(true, defaults, options);
			$this = $(this);

			// create container
			$this.wrap($('<div/>', {
				'class': options.containerClass
			}));

			// create suggestion field
			var $suggest = $('<div/>', {
				'css' : { 'height' : $this.height() }
			});
			$suggest.addClass(options.suggestionClass).insertAfter($this);

			// 
			$this.keyup(function(e) {
				// 'enter' key was pressed
				var code = (e.keyCode ? e.keyCode : e.which);
				if (code == 13) {
					$(this).val($suggest.text());
					$suggest.html("");
					return false;
				}

				// some other key was pressed
				var needle = $(this).val();

				// is the field empty?
				if (!$.trim(needle).length) {
					$suggest.html("");
					return false;
				}

				// compare input with haystack
				$.each(options.source, function(i, term) {
					var regex = new RegExp('^' + needle, 'i');
					if (regex.test(term)) {
						$suggest.html('<span>' + needle + '</span>' + term.slice(needle.length));
						// use first result
						return false;
					}
					$suggest.html("");
				});
			});
		});

	};
})(jQuery);
