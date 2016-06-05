(function() {
  $ = function(selector) {
    if(! (this instanceof $)){
      return new $(selector);
    }
    var elements;
    if(typeof selector === 'string'){
      elements = document.querySelectorAll(selector);
    }else{
      elements = selector;
    }
    $.each(elements, $.proxy(function(index, element){
      this[index] = element;
    }, this));
    // [].push.apply(this, elements);
    this.length = elements.length;
  };

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
    each: function(collection, cb) {
      if(isArrayLike(collection)){
        for(var i = 0; i < collection.length; i++){
          cb.call(collection[i], i, collection[i]);
        }
      }else{
        for(var prop in collection){
          if(collection.hasOwnProperty(prop)){
            cb.call(collection[prop], prop, collection[prop]);
          }
        }
      }
      return collection;
    },
    makeArray: function(arrayLike) {
      var newArr = [];
      $.each(arrayLike, function(ind, val){
        newArr.push(val);
      })
      return newArr;
    },
    proxy: function(fn, context) {
      return function(){
        var passedArgs = Array.prototype.slice.call(arguments);
        return fn.apply(context, passedArgs);
      }
    }
  });

  var getText = function(el){
    var txt = '';

    $.each(el.childNodes, function(ind, childNode){
      if(childNode.nodeType === Node.TEXT_NODE){
        txt += childNode.nodeValue;
      }else if(childNode.nodeType === Node.ELEMENT_NODE){
        txt += getText(childNode);
      }
    });
    return txt;
  };

  function makeTraverser (cb){
    return function(){
      var elements = [];
      var args = arguments;

      $.each(this, function(ind, el){
        var ret = cb.apply(el, args);

        if(ret && isArrayLike(ret)){
          [].push.apply(elements, ret);
        }else if(ret){
          elements.push(ret);
        }
      })

      return $(elements);
    };
  }

  $.extend($.prototype, {
    html: function(newHtml) {
      if(arguments.length){
        return $.each(this, function(ind, element){
          element.innerHTML = newHtml;
        });
      }else{
        return this[0].innerHTML;
      }
    },
    val: function(newVal) {
      if(arguments.length){
        return $.each(this, function(ind, el){
          el.value = newVal;
        });
      }else{
        return this[0].value;
      }
    },
    text: function(newText) {
      if(arguments.length){
        this.html('');
        return $.each(this, function(ind, el){
          var newTextNode = document.createTextNode(newText);
          el.appendChild(newTextNode);
        });
      }else{
        return this[0] && getText(this[0]);
      }
    },
    find: function(selector) {
      var elements = [];

      $.each(this, function(ind, el){
          [].push.apply(elements, el.querySelectorAll(selector));
      });

      return $(elements);
    },
    next: function() {
      var nextElements = [];

      $.each(this, function(ind, el){
        var current = el.nextSibling;
        while(current && (current.nodeType !== Node.ELEMENT_NODE)){
          current = current.nextSibling;
        }
        if(current){
          [].push.call(nextElements, current);
        }
      });
      return $(nextElements);
    },
    prev: function() {
      var nextElements = [];

      $.each(this, function(ind, el){
        var current = el.previousSibling;
        while(current && (current.nodeType !== Node.ELEMENT_NODE)){
          current = current.previousSibling;
        }
        if(current){
          [].push.call(nextElements, current);
        }
      });
      return $(nextElements);
    },
    parent: makeTraverser(function(){
      return this.parentNode;
    }),
    // parent: function() {
    //   var parents = [];

    //   $.each(this, function(ind, el){
    //     [].push.call(parents, el.parentNode)
    //   })

    //   return $(parents);
    // },
    children: makeTraverser(function(){
      return this.children;
    }),
    attr: function(attrName, value) {
      if(arguments.length > 1){
        return $.each(this, function(ind, el){
          el.setAttribute(attrName, value);
        });
      }else{
        return this[0] && this[0].getAttribute(attrName);
      }
    },
    css: function(cssPropName, value) {
      if(arguments.length > 1){
        $.each(this, function(ind, el){
          el.style[cssPropName] = value;
        })
      }else{
        return this[0] && document.defaultView.getComputedStyle(this[0]).getPropertyValue(cssPropName);
      }
    },
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