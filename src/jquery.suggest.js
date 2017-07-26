/*!
 * Suggest jQuery plugin
 *
 * Copyright (c) 2015 Florian Plank (http://www.polarblau.com/)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * USAGE:
 *
 * $('#container').suggest(haystack, {
 *   suggestionColor   : '#cccccc',
 *   moreIndicatorClass: 'suggest-more',
 *   moreIndicatorText : '&hellip;',
 *   validationKeys    : [35, 39]
 * });
 *
 */

(function($) {

  $.fn.suggest = function(source, options) {

    var CODE_TAB = 9;
    var CODE_ENTER = 13;
    var CODE_END = 35;
    var CODE_ARROW_LEFT = 37;
    var CODE_ARROW_UP = 38;
    var CODE_ARROW_RIGHT = 39;
    var CODE_ARROW_DOWN = 40;

    var settings = $.extend({
      suggestionColor       : '#ccc',
      moreIndicatorClass    : 'suggest-more',
      moreIndicatorText     : '&hellip;',
      validationKeys          : [CODE_TAB, CODE_ENTER]
    }, options);

    return this.each(function() {

      var $this = $(this);

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
          'color'           : settings.suggestionColor,
          'fontKerning'     : $this.css('fontKerning')
        }
      });

      var $more = $('<span/>', {
        'css' : {
          'position'        : 'absolute',
          'top'             : $suggest.height() + parseInt($this.css('fontSize'), 10) / 2,
          'left'            : $suggest.width(),
          'display'         : 'block',
          'fontSize'        : $this.css('fontSize'),
          'fontFamily'      : $this.css('fontFamily'),
          'color'           : settings.suggestionColor
        },
        'class'             : settings.moreIndicatorClass
      })
      .html(settings.moreIndicatorText)
      .hide();

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
            'position'      : 'relative',
            'paddingBottom' : '1em'
          }
        }))

        .bind('keydown.suggest', function(e){
          var code = (e.keyCode ? e.keyCode : e.which);

          // If any key considered as validation key is pressed, prevent
          // its default action, but only if there were suggestions
          if ($.inArray(code, settings.validationKeys) !== -1) {
            if (!$suggest.is(':empty')) {
              e.preventDefault();
            }

          // use arrow keys to cycle through suggestions
          } else if (code === CODE_ARROW_UP || code === CODE_ARROW_DOWN) {
            e.preventDefault();
            var suggestions = $(this).data('suggestions');

            if (suggestions.all.length > 1) {
              // arrow down:
              if (code === CODE_ARROW_DOWN && suggestions.index < suggestions.all.length - 1) {
                suggestions.suggest.html(suggestions.all[++suggestions.index]);
              // arrow up:
              } else if (code === CODE_ARROW_UP && suggestions.index > 0) {
                suggestions.suggest.html(suggestions.all[--suggestions.index]);
              }
              $(this).data('suggestions').index = suggestions.index;
            }
          }
        })

        .bind('keyup.suggest', function(e) {
          var code = (e.keyCode ? e.keyCode : e.which);

          // Have the arrow keys been pressed?
          if (code === CODE_ARROW_UP || code === CODE_ARROW_DOWN) {
            return false;
          }

          // by default we hide the "more suggestions" indicator
          $more.hide();

          // what has been input?
          var needle = $(this).val();

          // convert spaces to make them visible
          var needleWithWhiteSpace = needle.replace(' ', '&nbsp;');

          // accept suggestion with 'enter' or 'tab'
          // if the suggestion hasn't been accepted yet
          if ($.inArray(code, settings.validationKeys) !== -1) {
            // only accept if there's anything suggested
            if ($suggest.text().length > 0) {
              e.preventDefault();
              var suggestions = $(this).data('suggestions');
              $(this).val(suggestions.terms[suggestions.index]);
              // clean the suggestion for the looks
              $suggest.empty();
              return false;
            }
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
          var suggestions = [], terms = [];
          for (var i = 0, l = source; i < l.length; i++) {
            if (regex.test(l[i])) {
              terms.push(l[i]);
              suggestions.push(needleWithWhiteSpace + l[i].slice(needle.length));
            }
          }
          if (suggestions.length > 0) {
            // if there's any suggestions found, use the first
            // don't show the suggestion if it's identical with the current input
            if (suggestions[0] !== needle) {
              $suggest.html(suggestions[0]);
            }
            // store found suggestions in data for use with arrow keys
            $(this).data('suggestions', {
              'all'    : suggestions,
              'terms'  : terms,
              'index'  : 0,
              'suggest': $suggest
            });

            // show the indicator that there's more suggestions available
            // only for more than one suggestion
            if (suggestions.length > 1) {
              $more.show();
            }
          }
        })

        // clear suggestion on blur
        .bind('blur.suggest', function(){
          $suggest.empty();
        });

        // insert the suggestion helpers within the wrapper
        $suggest.insertAfter($this);
        $more.insertAfter($suggest);

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
