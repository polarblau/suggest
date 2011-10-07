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
 *   'source': ["ActionScript", "AppleScript", "Asp", ...]
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
          'fontStyle'       : $this.css('fontStyle'),
          'lineHeight'      : $this.css('lineHeight'),
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
        // 'enter' or 'tab' key was pressed
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13 || code == 9) {
          $(this).val($suggest.text());
          $suggest.html("");
          e.preventDefault();
        }

        // some other key was pressed
        var needle = $(this).val();

        // is the field empty?
        if (!$.trim(needle).length) {
          $suggest.html("");
          return false;
        }
        
        // empty suggestion
        $suggest.empty();
        
        // compare input with haystack
        var regex = new RegExp('^' + needle, 'i'),
            bg = $this.css('backgroundColor'),
            template = function(term) {
              return '<span style="color:'+bg+';">'+needle+'</span>'+term.slice(needle.length);
            };
        
        for (var i = 0, l = options.source; i < l.length; i++) {
          if (regex.test(l[i])) {
            $suggest.html(template(l[i], needle));
            break;
          }
        }
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
