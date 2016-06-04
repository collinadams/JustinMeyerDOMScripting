(function() {
  $ = function(selector) {};

  $.extend = function(target, object) {
    for(var prop in object){
      if(object.hasOwnProperty(prop)){
        target[prop] = object[prop];
      }
    }
    return target;
  };

  // Static methods
  var isArrayLike = function(obj) {
    if(typeof obj.length === 'number'){
      if(obj.length === 0){
        return true;
      }else if(obj.length > 0){
        return (obj.length - 1) in obj;
      }
    }
    return false;
  };

  $.extend($, {
    isArray: function(obj) {
      if(Object.prototype.toString.call(obj) === '[object Array]'){
        return true;
      }else{
        return false;
      }
    },
    each: function(collection, cb) {},
    makeArray: function(arr) {},
    proxy: function(fn, context) {}
  });

  $.extend($.prototype, {
    html: function(newHtml) {},
    val: function(newVal) {},
    text: function(newText) {},
    find: function(selector) {},
    next: function() {},
    prev: function() {},
    parent: function() {},
    children: function() {},
    attr: function(attrName, value) {},
    css: function(cssPropName, value) {},
    width: function() {},
    offset: function() {
      var offset = this[0].getBoundingClientRect();
      return {
        top: offset.top + window.pageYOffset,
        left: offset.left + window.pageXOffset
      };
    },
    hide: function() {},
    show: function() {},

    // Events
    bind: function(eventName, handler) {},
    unbind: function(eventName, handler) {},
    has: function(selector) {
      var elements = [];
	
      $.each(this, function(i, el) {
        if(el.matches(selector)) {
          elements.push(el);
        }
      });
    
      return $( elements );
    },
    on: function(eventType, selector, handler) {
      return this.bind(eventType, function(ev){
        var cur = ev.target;
        do {
          if ($([ cur ]).has(selector).length) {
            handler.call(cur, ev);
          }
          cur = cur.parentNode;
        } while (cur && cur !== ev.currentTarget);
      });
    },
    off: function(eventType, selector, handler) {},
    data: function(propName, data) {},

    // Extra
    addClass: function(className) {},
    removeClass: function(className) {},
    append: function(element) {}
  });

  $.buildFragment = function(html) {};
})();