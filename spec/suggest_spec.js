describe('suggest', function () {
  
  // Helpers
  
  function hasNamesSpacedEvent(el, event, namespace) {
    var events = $(el).data("events");
    return events[event] !== undefined && events[event][0].namespace === namespace; 
  };
  
  var enterTextAndTriggerKeyUp = function(input, text, key) {
    var e = $.Event("keyup");
    e.which = key;
    $(input).val(text).trigger(e);
  };
  
  // Custom matchers
  
  var isInputSuggestified = function(input) {
    var isSuggestified = hasNamesSpacedEvent(input, "keyup", "suggest") && hasNamesSpacedEvent(input, "blur", "suggest");
    return isSuggestified ? isSuggestified : null;
  };

  beforeEach(function () {
    this.addMatchers({
      toBeSuggestified: function() {
        return isInputSuggestified(this.actual);
      },
      toBeNotSuggestified: function() {
        return !isInputSuggestified(this.actual);
      }
    });
  });
  
  // Build and remove fixtures in setup and teardown
  
  beforeEach(function () {
    $('<input type="text" name="search" id="search" class="suggest" />').appendTo('body');
  });

  afterEach(function () {
    $("#search").remove();
  });

  //
  
  // TEST: Settings
  
  it('should use a default color for the suggestion text', function() {
    var $input = $("#search").suggest(["foo"]);
    expect($input.next("div").css("color")).toEqual("rgb(204, 204, 204)");
  });
  
  it('should allow setting a color for the suggestion text', function() {
    var $input = $("#search").suggest(["foo"], { 'suggestionColor': "red" });
    expect($input.next("div").css("color")).toEqual("rgb(255, 0, 0)");
  });
  
  // TEST: CSS & Attrbutes 
  
  it('should set the input background color to transparent', function() {
    var $input = $("#search").suggest(["foo"]);
    expect($input.css("backgroundColor")).toEqual("rgba(0, 0, 0, 0)");
  });
  
  it('should turn the input autocomplete attribute off', function() {
    var $input = $("#search").suggest(["foo"]);
    expect($input.attr("autocomplete")).toEqual("off");
  });
  
  it('should ensure the input reading direction', function() {
    var $input = $("#search").suggest(["foo"]);
    expect($input.attr("dir")).toEqual("ltr");
  });
  
  it('should set the input spellcheck attribute to false', function() {
    var $input = $("#search").suggest(["foo"]);
    expect($input.attr("spellcheck")).toEqual("false");
  });
  
  // TEST: Search and display suggestions
 
  it('should display a suggestion', function() {
    var $input = $("#search").suggest(["foo"]);
    enterTextAndTriggerKeyUp($input , "f", 70);
    expect($input.next("div").text()).toEqual("foo");
  });
  
  it('should find a suggestion', function() {
    var $input = $("#search").suggest(["bar", "foo"]);
    enterTextAndTriggerKeyUp($input , "f", 70);
    expect($input.next("div").text()).toEqual("foo");
  });
  
  it('should find a suggestion including a special char', function() {
    var $input = $("#search").suggest(["c++"]);
    enterTextAndTriggerKeyUp($input , "c", 67);
    expect($input.next("div").text()).toEqual("c++");
  });
  
  it('should suggest first found item', function() {
    var $input = $("#search").suggest(["foo", "faa"]);
    enterTextAndTriggerKeyUp($input , "f", 70);
    expect($input.next("div").text()).toEqual("foo");
  });
  
  it('should suggest nothing if nothing found', function() {
    var $input = $("#search").suggest(["foo", "faa"]);
    enterTextAndTriggerKeyUp($input , "b", 66);
    expect($input.next("div").text()).toEqual("");
  });
  
  it('should ignore case of input', function() {
    var $input = $("#search").suggest(["Foo"]);
    enterTextAndTriggerKeyUp($input , "F", 70);
    expect($input.next("div").text()).toEqual("Foo");
  });
  
  it('should accept suggestion on enter', function() {
    var $input = $("#search").suggest(["foo"]);
    enterTextAndTriggerKeyUp($input , "f", 70);
    expect($input.next("div").text()).toEqual("foo");
    var e = $.Event("keyup"); e.which = 13;
    $input.trigger(e);
    expect($input.val()).toEqual("foo");
  });
  
  it('should accept suggestion on tab', function() {
    var $input = $("#search").suggest(["foo"]);
    enterTextAndTriggerKeyUp($input , "f", 70);
    expect($input.next("div").text()).toEqual("foo");
    var e = $.Event("keyup"); e.which = 9;
    $input.trigger(e);
    expect($input.val()).toEqual("foo");
  });
  
  it('should accept suggestion including a special char on enter', function() {
    var $input = $("#search").suggest(["c++"]);
    enterTextAndTriggerKeyUp($input , "c", 67);
    expect($input.next("div").text()).toEqual("c++");
    var e = $.Event("keyup"); e.which = 13;
    $input.trigger(e);
    expect($input.val()).toEqual("c++");
  });
  
  it('should remove the suggestion on blur', function() {
    var $input = $("#search").suggest(["Foo"]);
    enterTextAndTriggerKeyUp($input , "F", 70);
    expect($input.next("div").text()).toEqual("Foo");
    $input.trigger("blur");
    expect($input.next("div").text()).toEqual("");
  });
  
  it('should convert spaces', function() {
     var $input = $("#search").suggest(["Foo bar"]);
     enterTextAndTriggerKeyUp($input , "Foo b", 70);
     expect($input.next("div").html()).toEqual("Foo&nbsp;bar");
     $input.trigger("blur");
     expect($input.next("div").text()).toEqual("");
   });
  
  // TEST: General jQuery plugin functionality 

  it('should be applicable to multiple elements', function() {
    var $input_1 = $("#search");
    var $input_2 = $('<input type="text" name="search" id="search-1" class="suggest" />').appendTo('body');
    $(".suggest").suggest(["Foo"]);
    expect($input_1).toBeSuggestified();
    expect($input_2).toBeSuggestified();
    $input_2.remove();
  });
  
  it('should be applicable to some but not other elements', function() {

  });
  
  it('should be chainable', function() {
    var $input = $("#search");
    $input.suggest(["Foo"]).addClass('foo');
    expect($input.hasClass('foo')).toBeTruthy();
  });

});