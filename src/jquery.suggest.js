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

  $.fn.suggest = function(source, options) {
    
    var settings = $.extend({
      suggestionColor : '#ccc'
    }, options);

    return this.each(function() {

      $this = $(this);
      
      // this helper will show possible suggestions
      // and needs to match the input field in style
      var $suggest = $('<div/>', {
        'css' : {
          'position'        : 'absolute',
          'height'          : $this.height(),
          'width'           : $this.width(),
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
          'color'           : settings.suggestionColor
        }
      });

      $this
        .attr({
          'autocomplete'    : "off",
          'spellcheck'      : "false",
          'dir'             : "ltr"
        })
        // by setting the background to transparent, we will
        // be able to "see through" to the suggestion helper
        .css({
          'background'      : 'transparent'
        })                  
        .wrap($('<div/>', {
          'css': { 
            'position'      : 'relative' 
          }
        }))
        
        // we need to capture `tab` keydown, but for everything else
        // we need to capture keyup events -- hence let's forward 
        // the event in case the tab key has been pressed
        .bind('keydown.suggest', function(e){
          var code = (e.keyCode ? e.keyCode : e.which);
          if (code == 9) {
            e.preventDefault();
            var forward = $.Event('keyup.suggest', { keyCode: 9 });
            $(this).trigger(forward);
          }
        })
        
        .bind('keyup.suggest', function(e) {
          
          // what has been input?
          var needle = $(this).val();
          // convert spaces to make them visible
          var needleWithWhiteSpace = needle.replace(' ', '&nbsp;');       
          
          // accept suggestion with 'enter' or 'tab'
          var code = (e.keyCode ? e.keyCode : e.which);
          if (code == 13 || code == 9) {
            e.preventDefault();
            var currentlySuggested = $suggest.text();
            $(this).val(currentlySuggested);
            $suggest.empty();
          }
          
          // make sure the helper is empty
          $suggest.empty();
                 
          // if nothing has been input, leave it with that
          if (!$.trim(needle).length) {
            return false;
          }
          
          // see if anything in source matches the input
          // by escaping the input' string for use with regex 
          // we allow to search for terms containing specials chars as well
          var regex = new RegExp('^' + needle.replace(/[-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'i');
          for (var i = 0, l = source; i < l.length; i++) {
            if (regex.test(l[i])) {      
              $suggest.html(needleWithWhiteSpace + l[i].slice(needle.length));
              break;
            }
          }
        })
    
        // clear suggestion on blur
        .bind('blur.suggest', function(){
          $suggest.empty();
        });
        
        // insert the suggestion helper within the wrapper
        $suggest.insertAfter($this);
        
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
    var properties = $.map(['Top', 'Right', 'Bottom', 'Left'], function(side){
      return property + side;
    });
    $.each(properties, function(i, e) {
      sum.push($self.css(e) || "0");
    });
    return sum.join(' ');
  };
})(jQuery);
