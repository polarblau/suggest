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
          
          if (code == 9 && !e.altKey) {
            e.preventDefault();
            var forward = $.Event('keyup.suggest', { keyCode: 9 });
            $(this).trigger(forward);
          
          // use arrow keys to cycle through suggestions
          } else if (code == 38 || code == 40) {
            e.preventDefault();
            var suggestions = $(this).data('suggestions');
            
            if (suggestions.all.length > 1) {
              if (code == 40 && suggestions.index < suggestions.all.length - 1) {
                suggestions.suggest.html(suggestions.all[++suggestions.index]);
              } else if (code == 38 && suggestions.index > 0) {
                suggestions.suggest.html(suggestions.all[--suggestions.index]);
              }
              $(this).data('suggestions').index = suggestions.index;
            }
          }
        })
        
        .bind('keyup.suggest', function(e) {
          var code = (e.keyCode ? e.keyCode : e.which);
          
          // Have the arrow keys been pressed?
          if (code == 38 || code == 40) {
            return false;
          }
          // what has been input?
          var needle = $(this).val();
          // convert spaces to make them visible
          var needleWithWhiteSpace = needle.replace(' ', '&nbsp;');       
          
          // accept suggestion with 'enter' or 'tab'
          if (code == 9 || code == 13) {
            e.preventDefault();
            var currentlySuggested = $suggest.text();
            $(this).val(currentlySuggested);
            $suggest.empty();
            return false;
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
          var suggestions = [];
          for (var i = 0, l = source; i < l.length; i++) {
            if (regex.test(l[i])) {      
              suggestions.push(needleWithWhiteSpace + l[i].slice(needle.length));
            }
          }
          if (suggestions.length > 0) {
            // if there's any suggestions found, use the first 
            $suggest.html(suggestions[0]);
            // store found suggestions in data for use with arrow keys
            $(this).data('suggestions', {
              'all'    : suggestions,
              'index'  : 0,
              'suggest': $suggest
            });
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
