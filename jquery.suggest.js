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

			// create suggestion field
			var $suggest = $('<div/>', {
				'css' : {
					'height'          : $this.height(),
					'width'           : $this.width(),
					'position'        : 'absolute',
					'top'             : $this.css('borderTopWidth'),
					'left'            : $this.css('borderLeftWidth'),
					'padding'         : $this.cssShortForAllSides('padding'),
					'margin'          : $this.cssShortForAllSides('margin'),
					'fontFamily'      : $this.css('fontFamily'),
					'fontSize'        : $this.css('fontSize'),
					'fontWeight'      : $this.css('fontWeight'),
					'letterSpacing'   : $this.css('letterSpacing'),
					'backgroundColor' : $this.css('backgroundColor'),
					'color'           : '#ccc'
				}
			});
			
			// create container
			$this
				.css('background', 'transparent')
				.wrap($('<div/>', {
					'css': { 'position' : 'relative' }
				}));
			
			$suggest.insertAfter($this);

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
						var $hide = $('<span/>', 
							{ 'css' : { 'color': $this.css('backgroundColor') },
							'text' : needle
						});
						$suggest
							.empty()
							.append($hide)
							.append(term.slice(needle.length));
						// use first result
						return false;
					}
					$suggest.html("");
				});
			});
		});

	};
	
	/* A little helper to calculate the sum of different
   * CSS properties around all four sides
   *
   * EXAMPLE:
   * $('#my-div').cssSum('padding');
   */
  $.fn.cssShortForAllSides = function(property) {
  	var $self = $(this), sum = [];
  	$($.map(['Top', 'Right', 'Bottom', 'Left'], function(side){
			return property + side;
		})).each(function(i, e) {
  		sum.push($self.css(e));
  	});
  	return sum.join(' ');
  };
})(jQuery);
