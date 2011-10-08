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

  $.fn.suggest = function(source) {

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
          'color'           : '#ccc'
        }
      });
      
      // when setting the color to transparent, the cursor will not
      // be visibile anymore, we need to fix that
      var inputCursorStyle = {
        'borderRight'       : '1px solid ' + $this.css('color')
      };
      
      // this helper will show what has been input
      var $input = $('<div/>', {
        'css' : {
          'position'        : 'absolute',
          'height'          : $this.height(),
          'top'             : $this.css('paddingTop'),
          'bottom'          : $this.css('paddingBottom'),
          'left'            : $this.css('borderLeftWidth'),
          'paddingLeft'     : $this.css('paddingLeft'),
          'paddingRight'    : 0,
          'paddingTop'      : $this.css('borderTopWidth'),
          'paddingBottom'   : $this.css('borderBottomWidth'),
          'margin'          : $this.cssShortForAllSides('margin'),
          'fontFamily'      : $this.css('fontFamily'),
          'fontSize'        : $this.css('fontSize'),
          'fontStyle'       : $this.css('fontStyle'),
          'lineHeight'      : $this.css('lineHeight'),
          'fontWeight'      : $this.css('fontWeight'),
          'letterSpacing'   : $this.css('letterSpacing'),
          'color'           : $this.css('color')
        }
      });

      $this
        .attr({
          'autocomplete'    : "off",
          'spellcheck'      : "false",
          'dir'             : "ltr"
        })
        .css({
          'color'           : 'transparent',
          'background'      : 'transparent'
        })                  
        .wrap($('<div/>', {
          'css': { 'position' : 'relative' }
        }))
        .bind('keyup.suggest', function(e) {
          
          // what has been input?
          var needle = $(this).val();
                  
          // convert spaces to make them visible
          var needleWithWhiteSpace = needle.replace(' ', '&#160;');
          $input.html(needleWithWhiteSpace);
        
          // accept suggestion with 'enter' or 'tab'
          var code = (e.keyCode ? e.keyCode : e.which);
          if (code == 13 || code == 9) {
            var currentlySuggested = $suggest.text();
            $(this).val(currentlySuggested);
            $input.text(currentlySuggested);
            return false;
          }
        
          $suggest.empty();
      
          // nothing has been input
          if (!$.trim(needle).length) {
            return false;
          }
          
          // see if anything in source matches the input
          var regex = new RegExp('^' + needle, 'i');
          for (var i = 0, l = source; i < l.length; i++) {
            if (regex.test(l[i])) {            
              $suggest.html(needleWithWhiteSpace + l[i].slice(needle.length));
              break;
            }
          }
        })
        
        // show the fake cursor on focus
        .bind('focus.suggest', function(){
          $input.css(inputCursorStyle);
        })
        
        // hide the fake cursor on blur
        .bind('blur.suggest', function(){
          $suggest.empty();
          $input.css('borderRight', 'none');
        });
        
        // insert the helpers within the wrapper
        $input.insertAfter($this);
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
    $($.map(['Top', 'Right', 'Bottom', 'Left'], function(side){
      return property + side;
    })).each(function(i, e) {
      sum.push($self.css(e));
    });
    return sum.join(' ');
  };
})(jQuery);
