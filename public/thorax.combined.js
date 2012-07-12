/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
  navigator = window.navigator,
  location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
    // The jQuery object is actually just the init constructor 'enhanced'
    return new jQuery.fn.init( selector, context, rootjQuery );
  },

  // Map over jQuery in case of overwrite
  _jQuery = window.jQuery,

  // Map over the $ in case of overwrite
  _$ = window.$,

  // A central reference to the root jQuery(document)
  rootjQuery,

  // A simple way to check for HTML strings or ID strings
  // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
  quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

  // Check if a string has a non-whitespace character in it
  rnotwhite = /\S/,

  // Used for trimming whitespace
  trimLeft = /^\s+/,
  trimRight = /\s+$/,

  // Match a standalone tag
  rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

  // JSON RegExp
  rvalidchars = /^[\],:{}\s]*$/,
  rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
  rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
  rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

  // Useragent RegExp
  rwebkit = /(webkit)[ \/]([\w.]+)/,
  ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
  rmsie = /(msie) ([\w.]+)/,
  rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

  // Matches dashed string for camelizing
  rdashAlpha = /-([a-z]|[0-9])/ig,
  rmsPrefix = /^-ms-/,

  // Used by jQuery.camelCase as callback to replace()
  fcamelCase = function( all, letter ) {
    return ( letter + "" ).toUpperCase();
  },

  // Keep a UserAgent string for use with jQuery.browser
  userAgent = navigator.userAgent,

  // For matching the engine and version of the browser
  browserMatch,

  // The deferred used on DOM ready
  readyList,

  // The ready event handler
  DOMContentLoaded,

  // Save a reference to some core methods
  toString = Object.prototype.toString,
  hasOwn = Object.prototype.hasOwnProperty,
  push = Array.prototype.push,
  slice = Array.prototype.slice,
  trim = String.prototype.trim,
  indexOf = Array.prototype.indexOf,

  // [[Class]] -> type pairs
  class2type = {};

jQuery.fn = jQuery.prototype = {
  constructor: jQuery,
  init: function( selector, context, rootjQuery ) {
    var match, elem, ret, doc;

    // Handle $(""), $(null), or $(undefined)
    if ( !selector ) {
      return this;
    }

    // Handle $(DOMElement)
    if ( selector.nodeType ) {
      this.context = this[0] = selector;
      this.length = 1;
      return this;
    }

    // The body element only exists once, optimize finding it
    if ( selector === "body" && !context && document.body ) {
      this.context = document;
      this[0] = document.body;
      this.selector = selector;
      this.length = 1;
      return this;
    }

    // Handle HTML strings
    if ( typeof selector === "string" ) {
      // Are we dealing with HTML string or an ID?
      if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
        // Assume that strings that start and end with <> are HTML and skip the regex check
        match = [ null, selector, null ];

      } else {
        match = quickExpr.exec( selector );
      }

      // Verify a match, and that no context was specified for #id
      if ( match && (match[1] || !context) ) {

        // HANDLE: $(html) -> $(array)
        if ( match[1] ) {
          context = context instanceof jQuery ? context[0] : context;
          doc = ( context ? context.ownerDocument || context : document );

          // If a single string is passed in and it's a single tag
          // just do a createElement and skip the rest
          ret = rsingleTag.exec( selector );

          if ( ret ) {
            if ( jQuery.isPlainObject( context ) ) {
              selector = [ document.createElement( ret[1] ) ];
              jQuery.fn.attr.call( selector, context, true );

            } else {
              selector = [ doc.createElement( ret[1] ) ];
            }

          } else {
            ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
            selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
          }

          return jQuery.merge( this, selector );

        // HANDLE: $("#id")
        } else {
          elem = document.getElementById( match[2] );

          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          if ( elem && elem.parentNode ) {
            // Handle the case where IE and Opera return items
            // by name instead of ID
            if ( elem.id !== match[2] ) {
              return rootjQuery.find( selector );
            }

            // Otherwise, we inject the element directly into the jQuery object
            this.length = 1;
            this[0] = elem;
          }

          this.context = document;
          this.selector = selector;
          return this;
        }

      // HANDLE: $(expr, $(...))
      } else if ( !context || context.jquery ) {
        return ( context || rootjQuery ).find( selector );

      // HANDLE: $(expr, context)
      // (which is just equivalent to: $(context).find(expr)
      } else {
        return this.constructor( context ).find( selector );
      }

    // HANDLE: $(function)
    // Shortcut for document ready
    } else if ( jQuery.isFunction( selector ) ) {
      return rootjQuery.ready( selector );
    }

    if ( selector.selector !== undefined ) {
      this.selector = selector.selector;
      this.context = selector.context;
    }

    return jQuery.makeArray( selector, this );
  },

  // Start with an empty selector
  selector: "",

  // The current version of jQuery being used
  jquery: "1.7.2",

  // The default length of a jQuery object is 0
  length: 0,

  // The number of elements contained in the matched element set
  size: function() {
    return this.length;
  },

  toArray: function() {
    return slice.call( this, 0 );
  },

  // Get the Nth element in the matched element set OR
  // Get the whole matched element set as a clean array
  get: function( num ) {
    return num == null ?

      // Return a 'clean' array
      this.toArray() :

      // Return just the object
      ( num < 0 ? this[ this.length + num ] : this[ num ] );
  },

  // Take an array of elements and push it onto the stack
  // (returning the new matched element set)
  pushStack: function( elems, name, selector ) {
    // Build a new jQuery matched element set
    var ret = this.constructor();

    if ( jQuery.isArray( elems ) ) {
      push.apply( ret, elems );

    } else {
      jQuery.merge( ret, elems );
    }

    // Add the old object onto the stack (as a reference)
    ret.prevObject = this;

    ret.context = this.context;

    if ( name === "find" ) {
      ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
    } else if ( name ) {
      ret.selector = this.selector + "." + name + "(" + selector + ")";
    }

    // Return the newly-formed element set
    return ret;
  },

  // Execute a callback for every element in the matched set.
  // (You can seed the arguments with an array of args, but this is
  // only used internally.)
  each: function( callback, args ) {
    return jQuery.each( this, callback, args );
  },

  ready: function( fn ) {
    // Attach the listeners
    jQuery.bindReady();

    // Add the callback
    readyList.add( fn );

    return this;
  },

  eq: function( i ) {
    i = +i;
    return i === -1 ?
      this.slice( i ) :
      this.slice( i, i + 1 );
  },

  first: function() {
    return this.eq( 0 );
  },

  last: function() {
    return this.eq( -1 );
  },

  slice: function() {
    return this.pushStack( slice.apply( this, arguments ),
      "slice", slice.call(arguments).join(",") );
  },

  map: function( callback ) {
    return this.pushStack( jQuery.map(this, function( elem, i ) {
      return callback.call( elem, i, elem );
    }));
  },

  end: function() {
    return this.prevObject || this.constructor(null);
  },

  // For internal use only.
  // Behaves like an Array's method, not like a jQuery method.
  push: push,
  sort: [].sort,
  splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
  var options, name, src, copy, copyIsArray, clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
    deep = target;
    target = arguments[1] || {};
    // skip the boolean and the target
    i = 2;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
    target = {};
  }

  // extend jQuery itself if only one argument is passed
  if ( length === i ) {
    target = this;
    --i;
  }

  for ( ; i < length; i++ ) {
    // Only deal with non-null/undefined values
    if ( (options = arguments[ i ]) != null ) {
      // Extend the base object
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];

        // Prevent never-ending loop
        if ( target === copy ) {
          continue;
        }

        // Recurse if we're merging plain objects or arrays
        if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : [];

          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }

          // Never move original objects, clone them
          target[ name ] = jQuery.extend( deep, clone, copy );

        // Don't bring in undefined values
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  // Return the modified object
  return target;
};

jQuery.extend({
  noConflict: function( deep ) {
    if ( window.$ === jQuery ) {
      window.$ = _$;
    }

    if ( deep && window.jQuery === jQuery ) {
      window.jQuery = _jQuery;
    }

    return jQuery;
  },

  // Is the DOM ready to be used? Set to true once it occurs.
  isReady: false,

  // A counter to track how many items to wait for before
  // the ready event fires. See #6781
  readyWait: 1,

  // Hold (or release) the ready event
  holdReady: function( hold ) {
    if ( hold ) {
      jQuery.readyWait++;
    } else {
      jQuery.ready( true );
    }
  },

  // Handle when the DOM is ready
  ready: function( wait ) {
    // Either a released hold or an DOMready/load event and not yet ready
    if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
      // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
      if ( !document.body ) {
        return setTimeout( jQuery.ready, 1 );
      }

      // Remember that the DOM is ready
      jQuery.isReady = true;

      // If a normal DOM Ready event fired, decrement, and wait if need be
      if ( wait !== true && --jQuery.readyWait > 0 ) {
        return;
      }

      // If there are functions bound, to execute
      readyList.fireWith( document, [ jQuery ] );

      // Trigger any bound ready events
      if ( jQuery.fn.trigger ) {
        jQuery( document ).trigger( "ready" ).off( "ready" );
      }
    }
  },

  bindReady: function() {
    if ( readyList ) {
      return;
    }

    readyList = jQuery.Callbacks( "once memory" );

    // Catch cases where $(document).ready() is called after the
    // browser event has already occurred.
    if ( document.readyState === "complete" ) {
      // Handle it asynchronously to allow scripts the opportunity to delay ready
      return setTimeout( jQuery.ready, 1 );
    }

    // Mozilla, Opera and webkit nightlies currently support this event
    if ( document.addEventListener ) {
      // Use the handy event callback
      document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

      // A fallback to window.onload, that will always work
      window.addEventListener( "load", jQuery.ready, false );

    // If IE event model is used
    } else if ( document.attachEvent ) {
      // ensure firing before onload,
      // maybe late but safe also for iframes
      document.attachEvent( "onreadystatechange", DOMContentLoaded );

      // A fallback to window.onload, that will always work
      window.attachEvent( "onload", jQuery.ready );

      // If IE and not a frame
      // continually check to see if the document is ready
      var toplevel = false;

      try {
        toplevel = window.frameElement == null;
      } catch(e) {}

      if ( document.documentElement.doScroll && toplevel ) {
        doScrollCheck();
      }
    }
  },

  // See test/unit/core.js for details concerning isFunction.
  // Since version 1.3, DOM methods and functions like alert
  // aren't supported. They return false on IE (#2968).
  isFunction: function( obj ) {
    return jQuery.type(obj) === "function";
  },

  isArray: Array.isArray || function( obj ) {
    return jQuery.type(obj) === "array";
  },

  isWindow: function( obj ) {
    return obj != null && obj == obj.window;
  },

  isNumeric: function( obj ) {
    return !isNaN( parseFloat(obj) ) && isFinite( obj );
  },

  type: function( obj ) {
    return obj == null ?
      String( obj ) :
      class2type[ toString.call(obj) ] || "object";
  },

  isPlainObject: function( obj ) {
    // Must be an Object.
    // Because of IE, we also have to check the presence of the constructor property.
    // Make sure that DOM nodes and window objects don't pass through, as well
    if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
      return false;
    }

    try {
      // Not own constructor property must be Object
      if ( obj.constructor &&
        !hasOwn.call(obj, "constructor") &&
        !hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
        return false;
      }
    } catch ( e ) {
      // IE8,9 Will throw exceptions on certain host objects #9897
      return false;
    }

    // Own properties are enumerated firstly, so to speed up,
    // if last one is own, then all properties are own.

    var key;
    for ( key in obj ) {}

    return key === undefined || hasOwn.call( obj, key );
  },

  isEmptyObject: function( obj ) {
    for ( var name in obj ) {
      return false;
    }
    return true;
  },

  error: function( msg ) {
    throw new Error( msg );
  },

  parseJSON: function( data ) {
    if ( typeof data !== "string" || !data ) {
      return null;
    }

    // Make sure leading/trailing whitespace is removed (IE can't handle it)
    data = jQuery.trim( data );

    // Attempt to parse using the native JSON parser first
    if ( window.JSON && window.JSON.parse ) {
      return window.JSON.parse( data );
    }

    // Make sure the incoming data is actual JSON
    // Logic borrowed from http://json.org/json2.js
    if ( rvalidchars.test( data.replace( rvalidescape, "@" )
      .replace( rvalidtokens, "]" )
      .replace( rvalidbraces, "")) ) {

      return ( new Function( "return " + data ) )();

    }
    jQuery.error( "Invalid JSON: " + data );
  },

  // Cross-browser xml parsing
  parseXML: function( data ) {
    if ( typeof data !== "string" || !data ) {
      return null;
    }
    var xml, tmp;
    try {
      if ( window.DOMParser ) { // Standard
        tmp = new DOMParser();
        xml = tmp.parseFromString( data , "text/xml" );
      } else { // IE
        xml = new ActiveXObject( "Microsoft.XMLDOM" );
        xml.async = "false";
        xml.loadXML( data );
      }
    } catch( e ) {
      xml = undefined;
    }
    if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
      jQuery.error( "Invalid XML: " + data );
    }
    return xml;
  },

  noop: function() {},

  // Evaluates a script in a global context
  // Workarounds based on findings by Jim Driscoll
  // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
  globalEval: function( data ) {
    if ( data && rnotwhite.test( data ) ) {
      // We use execScript on Internet Explorer
      // We use an anonymous function so that context is window
      // rather than jQuery in Firefox
      ( window.execScript || function( data ) {
        window[ "eval" ].call( window, data );
      } )( data );
    }
  },

  // Convert dashed to camelCase; used by the css and data modules
  // Microsoft forgot to hump their vendor prefix (#9572)
  camelCase: function( string ) {
    return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
  },

  nodeName: function( elem, name ) {
    return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
  },

  // args is for internal usage only
  each: function( object, callback, args ) {
    var name, i = 0,
      length = object.length,
      isObj = length === undefined || jQuery.isFunction( object );

    if ( args ) {
      if ( isObj ) {
        for ( name in object ) {
          if ( callback.apply( object[ name ], args ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.apply( object[ i++ ], args ) === false ) {
            break;
          }
        }
      }

    // A special, fast, case for the most common use of each
    } else {
      if ( isObj ) {
        for ( name in object ) {
          if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
            break;
          }
        }
      } else {
        for ( ; i < length; ) {
          if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
            break;
          }
        }
      }
    }

    return object;
  },

  // Use native String.trim function wherever possible
  trim: trim ?
    function( text ) {
      return text == null ?
        "" :
        trim.call( text );
    } :

    // Otherwise use our own trimming functionality
    function( text ) {
      return text == null ?
        "" :
        text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
    },

  // results is for internal usage only
  makeArray: function( array, results ) {
    var ret = results || [];

    if ( array != null ) {
      // The window, strings (and functions) also have 'length'
      // Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
      var type = jQuery.type( array );

      if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
        push.call( ret, array );
      } else {
        jQuery.merge( ret, array );
      }
    }

    return ret;
  },

  inArray: function( elem, array, i ) {
    var len;

    if ( array ) {
      if ( indexOf ) {
        return indexOf.call( array, elem, i );
      }

      len = array.length;
      i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

      for ( ; i < len; i++ ) {
        // Skip accessing in sparse arrays
        if ( i in array && array[ i ] === elem ) {
          return i;
        }
      }
    }

    return -1;
  },

  merge: function( first, second ) {
    var i = first.length,
      j = 0;

    if ( typeof second.length === "number" ) {
      for ( var l = second.length; j < l; j++ ) {
        first[ i++ ] = second[ j ];
      }

    } else {
      while ( second[j] !== undefined ) {
        first[ i++ ] = second[ j++ ];
      }
    }

    first.length = i;

    return first;
  },

  grep: function( elems, callback, inv ) {
    var ret = [], retVal;
    inv = !!inv;

    // Go through the array, only saving the items
    // that pass the validator function
    for ( var i = 0, length = elems.length; i < length; i++ ) {
      retVal = !!callback( elems[ i ], i );
      if ( inv !== retVal ) {
        ret.push( elems[ i ] );
      }
    }

    return ret;
  },

  // arg is for internal usage only
  map: function( elems, callback, arg ) {
    var value, key, ret = [],
      i = 0,
      length = elems.length,
      // jquery objects are treated as arrays
      isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

    // Go through the array, translating each of the items to their
    if ( isArray ) {
      for ( ; i < length; i++ ) {
        value = callback( elems[ i ], i, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }

    // Go through every key on the object,
    } else {
      for ( key in elems ) {
        value = callback( elems[ key ], key, arg );

        if ( value != null ) {
          ret[ ret.length ] = value;
        }
      }
    }

    // Flatten any nested arrays
    return ret.concat.apply( [], ret );
  },

  // A global GUID counter for objects
  guid: 1,

  // Bind a function to a context, optionally partially applying any
  // arguments.
  proxy: function( fn, context ) {
    if ( typeof context === "string" ) {
      var tmp = fn[ context ];
      context = fn;
      fn = tmp;
    }

    // Quick check to determine if target is callable, in the spec
    // this throws a TypeError, but we will just return undefined.
    if ( !jQuery.isFunction( fn ) ) {
      return undefined;
    }

    // Simulated bind
    var args = slice.call( arguments, 2 ),
      proxy = function() {
        return fn.apply( context, args.concat( slice.call( arguments ) ) );
      };

    // Set the guid of unique handler to the same of original handler, so it can be removed
    proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

    return proxy;
  },

  // Mutifunctional method to get and set values to a collection
  // The value/s can optionally be executed if it's a function
  access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
    var exec,
      bulk = key == null,
      i = 0,
      length = elems.length;

    // Sets many values
    if ( key && typeof key === "object" ) {
      for ( i in key ) {
        jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
      }
      chainable = 1;

    // Sets one value
    } else if ( value !== undefined ) {
      // Optionally, function values get executed if exec is true
      exec = pass === undefined && jQuery.isFunction( value );

      if ( bulk ) {
        // Bulk operations only iterate when executing function values
        if ( exec ) {
          exec = fn;
          fn = function( elem, key, value ) {
            return exec.call( jQuery( elem ), value );
          };

        // Otherwise they run against the entire set
        } else {
          fn.call( elems, value );
          fn = null;
        }
      }

      if ( fn ) {
        for (; i < length; i++ ) {
          fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
        }
      }

      chainable = 1;
    }

    return chainable ?
      elems :

      // Gets
      bulk ?
        fn.call( elems ) :
        length ? fn( elems[0], key ) : emptyGet;
  },

  now: function() {
    return ( new Date() ).getTime();
  },

  // Use of jQuery.browser is frowned upon.
  // More details: http://docs.jquery.com/Utilities/jQuery.browser
  uaMatch: function( ua ) {
    ua = ua.toLowerCase();

    var match = rwebkit.exec( ua ) ||
      ropera.exec( ua ) ||
      rmsie.exec( ua ) ||
      ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
      [];

    return { browser: match[1] || "", version: match[2] || "0" };
  },

  sub: function() {
    function jQuerySub( selector, context ) {
      return new jQuerySub.fn.init( selector, context );
    }
    jQuery.extend( true, jQuerySub, this );
    jQuerySub.superclass = this;
    jQuerySub.fn = jQuerySub.prototype = this();
    jQuerySub.fn.constructor = jQuerySub;
    jQuerySub.sub = this.sub;
    jQuerySub.fn.init = function init( selector, context ) {
      if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
        context = jQuerySub( context );
      }

      return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
    };
    jQuerySub.fn.init.prototype = jQuerySub.fn;
    var rootjQuerySub = jQuerySub(document);
    return jQuerySub;
  },

  browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
  class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
  jQuery.browser[ browserMatch.browser ] = true;
  jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
  jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
  trimLeft = /^[\s\xA0]+/;
  trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
  DOMContentLoaded = function() {
    document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
    jQuery.ready();
  };

} else if ( document.attachEvent ) {
  DOMContentLoaded = function() {
    // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
    if ( document.readyState === "complete" ) {
      document.detachEvent( "onreadystatechange", DOMContentLoaded );
      jQuery.ready();
    }
  };
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
  if ( jQuery.isReady ) {
    return;
  }

  try {
    // If IE is used, use the trick by Diego Perini
    // http://javascript.nwbox.com/IEContentLoaded/
    document.documentElement.doScroll("left");
  } catch(e) {
    setTimeout( doScrollCheck, 1 );
    return;
  }

  // and execute any waiting functions
  jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
  var object = flagsCache[ flags ] = {},
    i, length;
  flags = flags.split( /\s+/ );
  for ( i = 0, length = flags.length; i < length; i++ ) {
    object[ flags[i] ] = true;
  }
  return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *  flags:  an optional list of space-separated flags that will change how
 *      the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *  once:     will ensure the callback list can only be fired once (like a Deferred)
 *
 *  memory:     will keep track of previous values and will call any callback added
 *          after the list has been fired right away with the latest "memorized"
 *          values (like a Deferred)
 *
 *  unique:     will ensure a callback can only be added once (no duplicate in the list)
 *
 *  stopOnFalse:  interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

  // Convert flags from String-formatted to Object-formatted
  // (we check in cache first)
  flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

  var // Actual callback list
    list = [],
    // Stack of fire calls for repeatable lists
    stack = [],
    // Last fire value (for non-forgettable lists)
    memory,
    // Flag to know if list was already fired
    fired,
    // Flag to know if list is currently firing
    firing,
    // First callback to fire (used internally by add and fireWith)
    firingStart,
    // End of the loop when firing
    firingLength,
    // Index of currently firing callback (modified by remove if needed)
    firingIndex,
    // Add one or several callbacks to the list
    add = function( args ) {
      var i,
        length,
        elem,
        type,
        actual;
      for ( i = 0, length = args.length; i < length; i++ ) {
        elem = args[ i ];
        type = jQuery.type( elem );
        if ( type === "array" ) {
          // Inspect recursively
          add( elem );
        } else if ( type === "function" ) {
          // Add if not in unique mode and callback is not in
          if ( !flags.unique || !self.has( elem ) ) {
            list.push( elem );
          }
        }
      }
    },
    // Fire callbacks
    fire = function( context, args ) {
      args = args || [];
      memory = !flags.memory || [ context, args ];
      fired = true;
      firing = true;
      firingIndex = firingStart || 0;
      firingStart = 0;
      firingLength = list.length;
      for ( ; list && firingIndex < firingLength; firingIndex++ ) {
        if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
          memory = true; // Mark as halted
          break;
        }
      }
      firing = false;
      if ( list ) {
        if ( !flags.once ) {
          if ( stack && stack.length ) {
            memory = stack.shift();
            self.fireWith( memory[ 0 ], memory[ 1 ] );
          }
        } else if ( memory === true ) {
          self.disable();
        } else {
          list = [];
        }
      }
    },
    // Actual Callbacks object
    self = {
      // Add a callback or a collection of callbacks to the list
      add: function() {
        if ( list ) {
          var length = list.length;
          add( arguments );
          // Do we need to add the callbacks to the
          // current firing batch?
          if ( firing ) {
            firingLength = list.length;
          // With memory, if we're not firing then
          // we should call right away, unless previous
          // firing was halted (stopOnFalse)
          } else if ( memory && memory !== true ) {
            firingStart = length;
            fire( memory[ 0 ], memory[ 1 ] );
          }
        }
        return this;
      },
      // Remove a callback from the list
      remove: function() {
        if ( list ) {
          var args = arguments,
            argIndex = 0,
            argLength = args.length;
          for ( ; argIndex < argLength ; argIndex++ ) {
            for ( var i = 0; i < list.length; i++ ) {
              if ( args[ argIndex ] === list[ i ] ) {
                // Handle firingIndex and firingLength
                if ( firing ) {
                  if ( i <= firingLength ) {
                    firingLength--;
                    if ( i <= firingIndex ) {
                      firingIndex--;
                    }
                  }
                }
                // Remove the element
                list.splice( i--, 1 );
                // If we have some unicity property then
                // we only need to do this once
                if ( flags.unique ) {
                  break;
                }
              }
            }
          }
        }
        return this;
      },
      // Control if a given callback is in the list
      has: function( fn ) {
        if ( list ) {
          var i = 0,
            length = list.length;
          for ( ; i < length; i++ ) {
            if ( fn === list[ i ] ) {
              return true;
            }
          }
        }
        return false;
      },
      // Remove all callbacks from the list
      empty: function() {
        list = [];
        return this;
      },
      // Have the list do nothing anymore
      disable: function() {
        list = stack = memory = undefined;
        return this;
      },
      // Is it disabled?
      disabled: function() {
        return !list;
      },
      // Lock the list in its current state
      lock: function() {
        stack = undefined;
        if ( !memory || memory === true ) {
          self.disable();
        }
        return this;
      },
      // Is it locked?
      locked: function() {
        return !stack;
      },
      // Call all callbacks with the given context and arguments
      fireWith: function( context, args ) {
        if ( stack ) {
          if ( firing ) {
            if ( !flags.once ) {
              stack.push( [ context, args ] );
            }
          } else if ( !( flags.once && memory ) ) {
            fire( context, args );
          }
        }
        return this;
      },
      // Call all the callbacks with the given arguments
      fire: function() {
        self.fireWith( this, arguments );
        return this;
      },
      // To know if the callbacks have already been called at least once
      fired: function() {
        return !!fired;
      }
    };

  return self;
};




var // Static reference to slice
  sliceDeferred = [].slice;

jQuery.extend({

  Deferred: function( func ) {
    var doneList = jQuery.Callbacks( "once memory" ),
      failList = jQuery.Callbacks( "once memory" ),
      progressList = jQuery.Callbacks( "memory" ),
      state = "pending",
      lists = {
        resolve: doneList,
        reject: failList,
        notify: progressList
      },
      promise = {
        done: doneList.add,
        fail: failList.add,
        progress: progressList.add,

        state: function() {
          return state;
        },

        // Deprecated
        isResolved: doneList.fired,
        isRejected: failList.fired,

        then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
          deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
          return this;
        },
        always: function() {
          deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
          return this;
        },
        pipe: function( fnDone, fnFail, fnProgress ) {
          return jQuery.Deferred(function( newDefer ) {
            jQuery.each( {
              done: [ fnDone, "resolve" ],
              fail: [ fnFail, "reject" ],
              progress: [ fnProgress, "notify" ]
            }, function( handler, data ) {
              var fn = data[ 0 ],
                action = data[ 1 ],
                returned;
              if ( jQuery.isFunction( fn ) ) {
                deferred[ handler ](function() {
                  returned = fn.apply( this, arguments );
                  if ( returned && jQuery.isFunction( returned.promise ) ) {
                    returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
                  } else {
                    newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
                  }
                });
              } else {
                deferred[ handler ]( newDefer[ action ] );
              }
            });
          }).promise();
        },
        // Get a promise for this deferred
        // If obj is provided, the promise aspect is added to the object
        promise: function( obj ) {
          if ( obj == null ) {
            obj = promise;
          } else {
            for ( var key in promise ) {
              obj[ key ] = promise[ key ];
            }
          }
          return obj;
        }
      },
      deferred = promise.promise({}),
      key;

    for ( key in lists ) {
      deferred[ key ] = lists[ key ].fire;
      deferred[ key + "With" ] = lists[ key ].fireWith;
    }

    // Handle state
    deferred.done( function() {
      state = "resolved";
    }, failList.disable, progressList.lock ).fail( function() {
      state = "rejected";
    }, doneList.disable, progressList.lock );

    // Call given func if any
    if ( func ) {
      func.call( deferred, deferred );
    }

    // All done!
    return deferred;
  },

  // Deferred helper
  when: function( firstParam ) {
    var args = sliceDeferred.call( arguments, 0 ),
      i = 0,
      length = args.length,
      pValues = new Array( length ),
      count = length,
      pCount = length,
      deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
        firstParam :
        jQuery.Deferred(),
      promise = deferred.promise();
    function resolveFunc( i ) {
      return function( value ) {
        args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
        if ( !( --count ) ) {
          deferred.resolveWith( deferred, args );
        }
      };
    }
    function progressFunc( i ) {
      return function( value ) {
        pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
        deferred.notifyWith( promise, pValues );
      };
    }
    if ( length > 1 ) {
      for ( ; i < length; i++ ) {
        if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
          args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
        } else {
          --count;
        }
      }
      if ( !count ) {
        deferred.resolveWith( deferred, args );
      }
    } else if ( deferred !== firstParam ) {
      deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
    }
    return promise;
  }
});




jQuery.support = (function() {

  var support,
    all,
    a,
    select,
    opt,
    input,
    fragment,
    tds,
    events,
    eventName,
    i,
    isSupported,
    div = document.createElement( "div" ),
    documentElement = document.documentElement;

  // Preliminary tests
  div.setAttribute("className", "t");
  div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

  all = div.getElementsByTagName( "*" );
  a = div.getElementsByTagName( "a" )[ 0 ];

  // Can't get basic test support
  if ( !all || !all.length || !a ) {
    return {};
  }

  // First batch of supports tests
  select = document.createElement( "select" );
  opt = select.appendChild( document.createElement("option") );
  input = div.getElementsByTagName( "input" )[ 0 ];

  support = {
    // IE strips leading whitespace when .innerHTML is used
    leadingWhitespace: ( div.firstChild.nodeType === 3 ),

    // Make sure that tbody elements aren't automatically inserted
    // IE will insert them into empty tables
    tbody: !div.getElementsByTagName("tbody").length,

    // Make sure that link elements get serialized correctly by innerHTML
    // This requires a wrapper element in IE
    htmlSerialize: !!div.getElementsByTagName("link").length,

    // Get the style information from getAttribute
    // (IE uses .cssText instead)
    style: /top/.test( a.getAttribute("style") ),

    // Make sure that URLs aren't manipulated
    // (IE normalizes it by default)
    hrefNormalized: ( a.getAttribute("href") === "/a" ),

    // Make sure that element opacity exists
    // (IE uses filter instead)
    // Use a regex to work around a WebKit issue. See #5145
    opacity: /^0.55/.test( a.style.opacity ),

    // Verify style float existence
    // (IE uses styleFloat instead of cssFloat)
    cssFloat: !!a.style.cssFloat,

    // Make sure that if no value is specified for a checkbox
    // that it defaults to "on".
    // (WebKit defaults to "" instead)
    checkOn: ( input.value === "on" ),

    // Make sure that a selected-by-default option has a working selected property.
    // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
    optSelected: opt.selected,

    // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
    getSetAttribute: div.className !== "t",

    // Tests for enctype support on a form(#6743)
    enctype: !!document.createElement("form").enctype,

    // Makes sure cloning an html5 element does not cause problems
    // Where outerHTML is undefined, this still works
    html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

    // Will be defined later
    submitBubbles: true,
    changeBubbles: true,
    focusinBubbles: false,
    deleteExpando: true,
    noCloneEvent: true,
    inlineBlockNeedsLayout: false,
    shrinkWrapBlocks: false,
    reliableMarginRight: true,
    pixelMargin: true
  };

  // jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
  jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

  // Make sure checked status is properly cloned
  input.checked = true;
  support.noCloneChecked = input.cloneNode( true ).checked;

  // Make sure that the options inside disabled selects aren't marked as disabled
  // (WebKit marks them as disabled)
  select.disabled = true;
  support.optDisabled = !opt.disabled;

  // Test to see if it's possible to delete an expando from an element
  // Fails in Internet Explorer
  try {
    delete div.test;
  } catch( e ) {
    support.deleteExpando = false;
  }

  if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
    div.attachEvent( "onclick", function() {
      // Cloning a node shouldn't copy over any
      // bound event handlers (IE does this)
      support.noCloneEvent = false;
    });
    div.cloneNode( true ).fireEvent( "onclick" );
  }

  // Check if a radio maintains its value
  // after being appended to the DOM
  input = document.createElement("input");
  input.value = "t";
  input.setAttribute("type", "radio");
  support.radioValue = input.value === "t";

  input.setAttribute("checked", "checked");

  // #11217 - WebKit loses check when the name is after the checked attribute
  input.setAttribute( "name", "t" );

  div.appendChild( input );
  fragment = document.createDocumentFragment();
  fragment.appendChild( div.lastChild );

  // WebKit doesn't clone checked state correctly in fragments
  support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

  // Check if a disconnected checkbox will retain its checked
  // value of true after appended to the DOM (IE6/7)
  support.appendChecked = input.checked;

  fragment.removeChild( input );
  fragment.appendChild( div );

  // Technique from Juriy Zaytsev
  // http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
  // We only care about the case where non-standard event systems
  // are used, namely in IE. Short-circuiting here helps us to
  // avoid an eval call (in setAttribute) which can cause CSP
  // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
  if ( div.attachEvent ) {
    for ( i in {
      submit: 1,
      change: 1,
      focusin: 1
    }) {
      eventName = "on" + i;
      isSupported = ( eventName in div );
      if ( !isSupported ) {
        div.setAttribute( eventName, "return;" );
        isSupported = ( typeof div[ eventName ] === "function" );
      }
      support[ i + "Bubbles" ] = isSupported;
    }
  }

  fragment.removeChild( div );

  // Null elements to avoid leaks in IE
  fragment = select = opt = div = input = null;

  // Run tests that need a body at doc ready
  jQuery(function() {
    var container, outer, inner, table, td, offsetSupport,
      marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
      paddingMarginBorderVisibility, paddingMarginBorder,
      body = document.getElementsByTagName("body")[0];

    if ( !body ) {
      // Return for frameset docs that don't have a body
      return;
    }

    conMarginTop = 1;
    paddingMarginBorder = "padding:0;margin:0;border:";
    positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
    paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
    style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
    html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
      "<table " + style + "' cellpadding='0' cellspacing='0'>" +
      "<tr><td></td></tr></table>";

    container = document.createElement("div");
    container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
    body.insertBefore( container, body.firstChild );

    // Construct the test element
    div = document.createElement("div");
    container.appendChild( div );

    // Check if table cells still have offsetWidth/Height when they are set
    // to display:none and there are still other visible table cells in a
    // table row; if so, offsetWidth/Height are not reliable for use when
    // determining if an element has been hidden directly using
    // display:none (it is still safe to use offsets if a parent element is
    // hidden; don safety goggles and see bug #4512 for more information).
    // (only IE 8 fails this test)
    div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
    tds = div.getElementsByTagName( "td" );
    isSupported = ( tds[ 0 ].offsetHeight === 0 );

    tds[ 0 ].style.display = "";
    tds[ 1 ].style.display = "none";

    // Check if empty table cells still have offsetWidth/Height
    // (IE <= 8 fail this test)
    support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

    // Check if div with explicit width and no margin-right incorrectly
    // gets computed margin-right based on width of container. For more
    // info see bug #3333
    // Fails in WebKit before Feb 2011 nightlies
    // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
    if ( window.getComputedStyle ) {
      div.innerHTML = "";
      marginDiv = document.createElement( "div" );
      marginDiv.style.width = "0";
      marginDiv.style.marginRight = "0";
      div.style.width = "2px";
      div.appendChild( marginDiv );
      support.reliableMarginRight =
        ( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
    }

    if ( typeof div.style.zoom !== "undefined" ) {
      // Check if natively block-level elements act like inline-block
      // elements when setting their display to 'inline' and giving
      // them layout
      // (IE < 8 does this)
      div.innerHTML = "";
      div.style.width = div.style.padding = "1px";
      div.style.border = 0;
      div.style.overflow = "hidden";
      div.style.display = "inline";
      div.style.zoom = 1;
      support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

      // Check if elements with layout shrink-wrap their children
      // (IE 6 does this)
      div.style.display = "block";
      div.style.overflow = "visible";
      div.innerHTML = "<div style='width:5px;'></div>";
      support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
    }

    div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
    div.innerHTML = html;

    outer = div.firstChild;
    inner = outer.firstChild;
    td = outer.nextSibling.firstChild.firstChild;

    offsetSupport = {
      doesNotAddBorder: ( inner.offsetTop !== 5 ),
      doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
    };

    inner.style.position = "fixed";
    inner.style.top = "20px";

    // safari subtracts parent border width here which is 5px
    offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
    inner.style.position = inner.style.top = "";

    outer.style.overflow = "hidden";
    outer.style.position = "relative";

    offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
    offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

    if ( window.getComputedStyle ) {
      div.style.marginTop = "1%";
      support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
    }

    if ( typeof container.style.zoom !== "undefined" ) {
      container.style.zoom = 1;
    }

    body.removeChild( container );
    marginDiv = div = container = null;

    jQuery.extend( support, offsetSupport );
  });

  return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
  rmultiDash = /([A-Z])/g;

jQuery.extend({
  cache: {},

  // Please use with caution
  uuid: 0,

  // Unique for each copy of jQuery on the page
  // Non-digits removed to match rinlinejQuery
  expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

  // The following elements throw uncatchable exceptions if you
  // attempt to add expando properties to them.
  noData: {
    "embed": true,
    // Ban all objects except for Flash (which handle expandos)
    "object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
    "applet": true
  },

  hasData: function( elem ) {
    elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
    return !!elem && !isEmptyDataObject( elem );
  },

  data: function( elem, name, data, pvt /* Internal Use Only */ ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var privateCache, thisCache, ret,
      internalKey = jQuery.expando,
      getByName = typeof name === "string",

      // We have to handle DOM nodes and JS objects differently because IE6-7
      // can't GC object references properly across the DOM-JS boundary
      isNode = elem.nodeType,

      // Only DOM nodes need the global jQuery cache; JS object data is
      // attached directly to the object so GC can occur automatically
      cache = isNode ? jQuery.cache : elem,

      // Only defining an ID for JS objects if its cache already exists allows
      // the code to shortcut on the same path as a DOM node with no cache
      id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
      isEvents = name === "events";

    // Avoid doing any more work than we need to when trying to get data on an
    // object that has no data at all
    if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
      return;
    }

    if ( !id ) {
      // Only DOM nodes need a new unique ID for each element since their data
      // ends up in the global cache
      if ( isNode ) {
        elem[ internalKey ] = id = ++jQuery.uuid;
      } else {
        id = internalKey;
      }
    }

    if ( !cache[ id ] ) {
      cache[ id ] = {};

      // Avoids exposing jQuery metadata on plain JS objects when the object
      // is serialized using JSON.stringify
      if ( !isNode ) {
        cache[ id ].toJSON = jQuery.noop;
      }
    }

    // An object can be passed to jQuery.data instead of a key/value pair; this gets
    // shallow copied over onto the existing cache
    if ( typeof name === "object" || typeof name === "function" ) {
      if ( pvt ) {
        cache[ id ] = jQuery.extend( cache[ id ], name );
      } else {
        cache[ id ].data = jQuery.extend( cache[ id ].data, name );
      }
    }

    privateCache = thisCache = cache[ id ];

    // jQuery data() is stored in a separate object inside the object's internal data
    // cache in order to avoid key collisions between internal data and user-defined
    // data.
    if ( !pvt ) {
      if ( !thisCache.data ) {
        thisCache.data = {};
      }

      thisCache = thisCache.data;
    }

    if ( data !== undefined ) {
      thisCache[ jQuery.camelCase( name ) ] = data;
    }

    // Users should not attempt to inspect the internal events object using jQuery.data,
    // it is undocumented and subject to change. But does anyone listen? No.
    if ( isEvents && !thisCache[ name ] ) {
      return privateCache.events;
    }

    // Check for both converted-to-camel and non-converted data property names
    // If a data property was specified
    if ( getByName ) {

      // First Try to find as-is property data
      ret = thisCache[ name ];

      // Test for null|undefined property data
      if ( ret == null ) {

        // Try to find the camelCased property
        ret = thisCache[ jQuery.camelCase( name ) ];
      }
    } else {
      ret = thisCache;
    }

    return ret;
  },

  removeData: function( elem, name, pvt /* Internal Use Only */ ) {
    if ( !jQuery.acceptData( elem ) ) {
      return;
    }

    var thisCache, i, l,

      // Reference to internal data cache key
      internalKey = jQuery.expando,

      isNode = elem.nodeType,

      // See jQuery.data for more information
      cache = isNode ? jQuery.cache : elem,

      // See jQuery.data for more information
      id = isNode ? elem[ internalKey ] : internalKey;

    // If there is already no cache entry for this object, there is no
    // purpose in continuing
    if ( !cache[ id ] ) {
      return;
    }

    if ( name ) {

      thisCache = pvt ? cache[ id ] : cache[ id ].data;

      if ( thisCache ) {

        // Support array or space separated string names for data keys
        if ( !jQuery.isArray( name ) ) {

          // try the string as a key before any manipulation
          if ( name in thisCache ) {
            name = [ name ];
          } else {

            // split the camel cased version by spaces unless a key with the spaces exists
            name = jQuery.camelCase( name );
            if ( name in thisCache ) {
              name = [ name ];
            } else {
              name = name.split( " " );
            }
          }
        }

        for ( i = 0, l = name.length; i < l; i++ ) {
          delete thisCache[ name[i] ];
        }

        // If there is no data left in the cache, we want to continue
        // and let the cache object itself get destroyed
        if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
          return;
        }
      }
    }

    // See jQuery.data for more information
    if ( !pvt ) {
      delete cache[ id ].data;

      // Don't destroy the parent cache unless the internal data object
      // had been the only thing left in it
      if ( !isEmptyDataObject(cache[ id ]) ) {
        return;
      }
    }

    // Browsers that fail expando deletion also refuse to delete expandos on
    // the window, but it will allow it on all other JS objects; other browsers
    // don't care
    // Ensure that `cache` is not a window object #10080
    if ( jQuery.support.deleteExpando || !cache.setInterval ) {
      delete cache[ id ];
    } else {
      cache[ id ] = null;
    }

    // We destroyed the cache and need to eliminate the expando on the node to avoid
    // false lookups in the cache for entries that no longer exist
    if ( isNode ) {
      // IE does not allow us to delete expando properties from nodes,
      // nor does it have a removeAttribute function on Document nodes;
      // we must handle all of these cases
      if ( jQuery.support.deleteExpando ) {
        delete elem[ internalKey ];
      } else if ( elem.removeAttribute ) {
        elem.removeAttribute( internalKey );
      } else {
        elem[ internalKey ] = null;
      }
    }
  },

  // For internal use only.
  _data: function( elem, name, data ) {
    return jQuery.data( elem, name, data, true );
  },

  // A method for determining if a DOM node can handle the data expando
  acceptData: function( elem ) {
    if ( elem.nodeName ) {
      var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

      if ( match ) {
        return !(match === true || elem.getAttribute("classid") !== match);
      }
    }

    return true;
  }
});

jQuery.fn.extend({
  data: function( key, value ) {
    var parts, part, attr, name, l,
      elem = this[0],
      i = 0,
      data = null;

    // Gets all values
    if ( key === undefined ) {
      if ( this.length ) {
        data = jQuery.data( elem );

        if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
          attr = elem.attributes;
          for ( l = attr.length; i < l; i++ ) {
            name = attr[i].name;

            if ( name.indexOf( "data-" ) === 0 ) {
              name = jQuery.camelCase( name.substring(5) );

              dataAttr( elem, name, data[ name ] );
            }
          }
          jQuery._data( elem, "parsedAttrs", true );
        }
      }

      return data;
    }

    // Sets multiple values
    if ( typeof key === "object" ) {
      return this.each(function() {
        jQuery.data( this, key );
      });
    }

    parts = key.split( ".", 2 );
    parts[1] = parts[1] ? "." + parts[1] : "";
    part = parts[1] + "!";

    return jQuery.access( this, function( value ) {

      if ( value === undefined ) {
        data = this.triggerHandler( "getData" + part, [ parts[0] ] );

        // Try to fetch any internally stored data first
        if ( data === undefined && elem ) {
          data = jQuery.data( elem, key );
          data = dataAttr( elem, key, data );
        }

        return data === undefined && parts[1] ?
          this.data( parts[0] ) :
          data;
      }

      parts[1] = value;
      this.each(function() {
        var self = jQuery( this );

        self.triggerHandler( "setData" + part, parts );
        jQuery.data( this, key, value );
        self.triggerHandler( "changeData" + part, parts );
      });
    }, null, value, arguments.length > 1, null, false );
  },

  removeData: function( key ) {
    return this.each(function() {
      jQuery.removeData( this, key );
    });
  }
});

function dataAttr( elem, key, data ) {
  // If nothing was found internally, try to fetch any
  // data from the HTML5 data-* attribute
  if ( data === undefined && elem.nodeType === 1 ) {

    var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

    data = elem.getAttribute( name );

    if ( typeof data === "string" ) {
      try {
        data = data === "true" ? true :
        data === "false" ? false :
        data === "null" ? null :
        jQuery.isNumeric( data ) ? +data :
          rbrace.test( data ) ? jQuery.parseJSON( data ) :
          data;
      } catch( e ) {}

      // Make sure we set the data so it isn't changed later
      jQuery.data( elem, key, data );

    } else {
      data = undefined;
    }
  }

  return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
  for ( var name in obj ) {

    // if the public data object is empty, the private is still empty
    if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
      continue;
    }
    if ( name !== "toJSON" ) {
      return false;
    }
  }

  return true;
}




function handleQueueMarkDefer( elem, type, src ) {
  var deferDataKey = type + "defer",
    queueDataKey = type + "queue",
    markDataKey = type + "mark",
    defer = jQuery._data( elem, deferDataKey );
  if ( defer &&
    ( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
    ( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
    // Give room for hard-coded callbacks to fire first
    // and eventually mark/queue something else on the element
    setTimeout( function() {
      if ( !jQuery._data( elem, queueDataKey ) &&
        !jQuery._data( elem, markDataKey ) ) {
        jQuery.removeData( elem, deferDataKey, true );
        defer.fire();
      }
    }, 0 );
  }
}

jQuery.extend({

  _mark: function( elem, type ) {
    if ( elem ) {
      type = ( type || "fx" ) + "mark";
      jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
    }
  },

  _unmark: function( force, elem, type ) {
    if ( force !== true ) {
      type = elem;
      elem = force;
      force = false;
    }
    if ( elem ) {
      type = type || "fx";
      var key = type + "mark",
        count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
      if ( count ) {
        jQuery._data( elem, key, count );
      } else {
        jQuery.removeData( elem, key, true );
        handleQueueMarkDefer( elem, type, "mark" );
      }
    }
  },

  queue: function( elem, type, data ) {
    var q;
    if ( elem ) {
      type = ( type || "fx" ) + "queue";
      q = jQuery._data( elem, type );

      // Speed up dequeue by getting out quickly if this is just a lookup
      if ( data ) {
        if ( !q || jQuery.isArray(data) ) {
          q = jQuery._data( elem, type, jQuery.makeArray(data) );
        } else {
          q.push( data );
        }
      }
      return q || [];
    }
  },

  dequeue: function( elem, type ) {
    type = type || "fx";

    var queue = jQuery.queue( elem, type ),
      fn = queue.shift(),
      hooks = {};

    // If the fx queue is dequeued, always remove the progress sentinel
    if ( fn === "inprogress" ) {
      fn = queue.shift();
    }

    if ( fn ) {
      // Add a progress sentinel to prevent the fx queue from being
      // automatically dequeued
      if ( type === "fx" ) {
        queue.unshift( "inprogress" );
      }

      jQuery._data( elem, type + ".run", hooks );
      fn.call( elem, function() {
        jQuery.dequeue( elem, type );
      }, hooks );
    }

    if ( !queue.length ) {
      jQuery.removeData( elem, type + "queue " + type + ".run", true );
      handleQueueMarkDefer( elem, type, "queue" );
    }
  }
});

jQuery.fn.extend({
  queue: function( type, data ) {
    var setter = 2;

    if ( typeof type !== "string" ) {
      data = type;
      type = "fx";
      setter--;
    }

    if ( arguments.length < setter ) {
      return jQuery.queue( this[0], type );
    }

    return data === undefined ?
      this :
      this.each(function() {
        var queue = jQuery.queue( this, type, data );

        if ( type === "fx" && queue[0] !== "inprogress" ) {
          jQuery.dequeue( this, type );
        }
      });
  },
  dequeue: function( type ) {
    return this.each(function() {
      jQuery.dequeue( this, type );
    });
  },
  // Based off of the plugin by Clint Helfers, with permission.
  // http://blindsignals.com/index.php/2009/07/jquery-delay/
  delay: function( time, type ) {
    time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    type = type || "fx";

    return this.queue( type, function( next, hooks ) {
      var timeout = setTimeout( next, time );
      hooks.stop = function() {
        clearTimeout( timeout );
      };
    });
  },
  clearQueue: function( type ) {
    return this.queue( type || "fx", [] );
  },
  // Get a promise resolved when queues of a certain type
  // are emptied (fx is the type by default)
  promise: function( type, object ) {
    if ( typeof type !== "string" ) {
      object = type;
      type = undefined;
    }
    type = type || "fx";
    var defer = jQuery.Deferred(),
      elements = this,
      i = elements.length,
      count = 1,
      deferDataKey = type + "defer",
      queueDataKey = type + "queue",
      markDataKey = type + "mark",
      tmp;
    function resolve() {
      if ( !( --count ) ) {
        defer.resolveWith( elements, [ elements ] );
      }
    }
    while( i-- ) {
      if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
          ( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
            jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
          jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
        count++;
        tmp.add( resolve );
      }
    }
    resolve();
    return defer.promise( object );
  }
});




var rclass = /[\n\t\r]/g,
  rspace = /\s+/,
  rreturn = /\r/g,
  rtype = /^(?:button|input)$/i,
  rfocusable = /^(?:button|input|object|select|textarea)$/i,
  rclickable = /^a(?:rea)?$/i,
  rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
  getSetAttribute = jQuery.support.getSetAttribute,
  nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
  attr: function( name, value ) {
    return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
  },

  removeAttr: function( name ) {
    return this.each(function() {
      jQuery.removeAttr( this, name );
    });
  },

  prop: function( name, value ) {
    return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
  },

  removeProp: function( name ) {
    name = jQuery.propFix[ name ] || name;
    return this.each(function() {
      // try/catch handles cases where IE balks (such as removing a property on window)
      try {
        this[ name ] = undefined;
        delete this[ name ];
      } catch( e ) {}
    });
  },

  addClass: function( value ) {
    var classNames, i, l, elem,
      setClass, c, cl;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).addClass( value.call(this, j, this.className) );
      });
    }

    if ( value && typeof value === "string" ) {
      classNames = value.split( rspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];

        if ( elem.nodeType === 1 ) {
          if ( !elem.className && classNames.length === 1 ) {
            elem.className = value;

          } else {
            setClass = " " + elem.className + " ";

            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
              if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
                setClass += classNames[ c ] + " ";
              }
            }
            elem.className = jQuery.trim( setClass );
          }
        }
      }
    }

    return this;
  },

  removeClass: function( value ) {
    var classNames, i, l, elem, className, c, cl;

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( j ) {
        jQuery( this ).removeClass( value.call(this, j, this.className) );
      });
    }

    if ( (value && typeof value === "string") || value === undefined ) {
      classNames = ( value || "" ).split( rspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];

        if ( elem.nodeType === 1 && elem.className ) {
          if ( value ) {
            className = (" " + elem.className + " ").replace( rclass, " " );
            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
              className = className.replace(" " + classNames[ c ] + " ", " ");
            }
            elem.className = jQuery.trim( className );

          } else {
            elem.className = "";
          }
        }
      }
    }

    return this;
  },

  toggleClass: function( value, stateVal ) {
    var type = typeof value,
      isBool = typeof stateVal === "boolean";

    if ( jQuery.isFunction( value ) ) {
      return this.each(function( i ) {
        jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
      });
    }

    return this.each(function() {
      if ( type === "string" ) {
        // toggle individual class names
        var className,
          i = 0,
          self = jQuery( this ),
          state = stateVal,
          classNames = value.split( rspace );

        while ( (className = classNames[ i++ ]) ) {
          // check each className given, space seperated list
          state = isBool ? state : !self.hasClass( className );
          self[ state ? "addClass" : "removeClass" ]( className );
        }

      } else if ( type === "undefined" || type === "boolean" ) {
        if ( this.className ) {
          // store className if set
          jQuery._data( this, "__className__", this.className );
        }

        // toggle whole className
        this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
      }
    });
  },

  hasClass: function( selector ) {
    var className = " " + selector + " ",
      i = 0,
      l = this.length;
    for ( ; i < l; i++ ) {
      if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
        return true;
      }
    }

    return false;
  },

  val: function( value ) {
    var hooks, ret, isFunction,
      elem = this[0];

    if ( !arguments.length ) {
      if ( elem ) {
        hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

        if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
          return ret;
        }

        ret = elem.value;

        return typeof ret === "string" ?
          // handle most common string cases
          ret.replace(rreturn, "") :
          // handle cases where value is null/undef or number
          ret == null ? "" : ret;
      }

      return;
    }

    isFunction = jQuery.isFunction( value );

    return this.each(function( i ) {
      var self = jQuery(this), val;

      if ( this.nodeType !== 1 ) {
        return;
      }

      if ( isFunction ) {
        val = value.call( this, i, self.val() );
      } else {
        val = value;
      }

      // Treat null/undefined as ""; convert numbers to string
      if ( val == null ) {
        val = "";
      } else if ( typeof val === "number" ) {
        val += "";
      } else if ( jQuery.isArray( val ) ) {
        val = jQuery.map(val, function ( value ) {
          return value == null ? "" : value + "";
        });
      }

      hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

      // If set returns undefined, fall back to normal setting
      if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
        this.value = val;
      }
    });
  }
});

jQuery.extend({
  valHooks: {
    option: {
      get: function( elem ) {
        // attributes.value is undefined in Blackberry 4.7 but
        // uses .value. See #6932
        var val = elem.attributes.value;
        return !val || val.specified ? elem.value : elem.text;
      }
    },
    select: {
      get: function( elem ) {
        var value, i, max, option,
          index = elem.selectedIndex,
          values = [],
          options = elem.options,
          one = elem.type === "select-one";

        // Nothing was selected
        if ( index < 0 ) {
          return null;
        }

        // Loop through all the selected options
        i = one ? index : 0;
        max = one ? index + 1 : options.length;
        for ( ; i < max; i++ ) {
          option = options[ i ];

          // Don't return options that are disabled or in a disabled optgroup
          if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
              (!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

            // Get the specific value for the option
            value = jQuery( option ).val();

            // We don't need an array for one selects
            if ( one ) {
              return value;
            }

            // Multi-Selects return an array
            values.push( value );
          }
        }

        // Fixes Bug #2551 -- select.val() broken in IE after form.reset()
        if ( one && !values.length && options.length ) {
          return jQuery( options[ index ] ).val();
        }

        return values;
      },

      set: function( elem, value ) {
        var values = jQuery.makeArray( value );

        jQuery(elem).find("option").each(function() {
          this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
        });

        if ( !values.length ) {
          elem.selectedIndex = -1;
        }
        return values;
      }
    }
  },

  attrFn: {
    val: true,
    css: true,
    html: true,
    text: true,
    data: true,
    width: true,
    height: true,
    offset: true
  },

  attr: function( elem, name, value, pass ) {
    var ret, hooks, notxml,
      nType = elem.nodeType;

    // don't get/set attributes on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    if ( pass && name in jQuery.attrFn ) {
      return jQuery( elem )[ name ]( value );
    }

    // Fallback to prop when attributes are not supported
    if ( typeof elem.getAttribute === "undefined" ) {
      return jQuery.prop( elem, name, value );
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    // All attributes are lowercase
    // Grab necessary hook if one is defined
    if ( notxml ) {
      name = name.toLowerCase();
      hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
    }

    if ( value !== undefined ) {

      if ( value === null ) {
        jQuery.removeAttr( elem, name );
        return;

      } else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        elem.setAttribute( name, "" + value );
        return value;
      }

    } else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
      return ret;

    } else {

      ret = elem.getAttribute( name );

      // Non-existent attributes return null, we normalize to undefined
      return ret === null ?
        undefined :
        ret;
    }
  },

  removeAttr: function( elem, value ) {
    var propName, attrNames, name, l, isBool,
      i = 0;

    if ( value && elem.nodeType === 1 ) {
      attrNames = value.toLowerCase().split( rspace );
      l = attrNames.length;

      for ( ; i < l; i++ ) {
        name = attrNames[ i ];

        if ( name ) {
          propName = jQuery.propFix[ name ] || name;
          isBool = rboolean.test( name );

          // See #9699 for explanation of this approach (setting first, then removal)
          // Do not do this for boolean attributes (see #10870)
          if ( !isBool ) {
            jQuery.attr( elem, name, "" );
          }
          elem.removeAttribute( getSetAttribute ? name : propName );

          // Set corresponding property to false for boolean attributes
          if ( isBool && propName in elem ) {
            elem[ propName ] = false;
          }
        }
      }
    }
  },

  attrHooks: {
    type: {
      set: function( elem, value ) {
        // We can't allow the type property to be changed (since it causes problems in IE)
        if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
          jQuery.error( "type property can't be changed" );
        } else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
          // Setting the type on a radio button after the value resets the value in IE6-9
          // Reset value to it's default in case type is set after value
          // This is for element creation
          var val = elem.value;
          elem.setAttribute( "type", value );
          if ( val ) {
            elem.value = val;
          }
          return value;
        }
      }
    },
    // Use the value property for back compat
    // Use the nodeHook for button elements in IE6/7 (#1954)
    value: {
      get: function( elem, name ) {
        if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
          return nodeHook.get( elem, name );
        }
        return name in elem ?
          elem.value :
          null;
      },
      set: function( elem, value, name ) {
        if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
          return nodeHook.set( elem, value, name );
        }
        // Does not return so that setAttribute is also used
        elem.value = value;
      }
    }
  },

  propFix: {
    tabindex: "tabIndex",
    readonly: "readOnly",
    "for": "htmlFor",
    "class": "className",
    maxlength: "maxLength",
    cellspacing: "cellSpacing",
    cellpadding: "cellPadding",
    rowspan: "rowSpan",
    colspan: "colSpan",
    usemap: "useMap",
    frameborder: "frameBorder",
    contenteditable: "contentEditable"
  },

  prop: function( elem, name, value ) {
    var ret, hooks, notxml,
      nType = elem.nodeType;

    // don't get/set properties on text, comment and attribute nodes
    if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
      return;
    }

    notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

    if ( notxml ) {
      // Fix name and attach hooks
      name = jQuery.propFix[ name ] || name;
      hooks = jQuery.propHooks[ name ];
    }

    if ( value !== undefined ) {
      if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
        return ret;

      } else {
        return ( elem[ name ] = value );
      }

    } else {
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
        return ret;

      } else {
        return elem[ name ];
      }
    }
  },

  propHooks: {
    tabIndex: {
      get: function( elem ) {
        // elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
        // http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
        var attributeNode = elem.getAttributeNode("tabindex");

        return attributeNode && attributeNode.specified ?
          parseInt( attributeNode.value, 10 ) :
          rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
            0 :
            undefined;
      }
    }
  }
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
  get: function( elem, name ) {
    // Align boolean attributes with corresponding properties
    // Fall back to attribute presence where some booleans are not supported
    var attrNode,
      property = jQuery.prop( elem, name );
    return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
      name.toLowerCase() :
      undefined;
  },
  set: function( elem, value, name ) {
    var propName;
    if ( value === false ) {
      // Remove boolean attributes when set to false
      jQuery.removeAttr( elem, name );
    } else {
      // value is true since we know at this point it's type boolean and not false
      // Set boolean attributes to the same name and set the DOM property
      propName = jQuery.propFix[ name ] || name;
      if ( propName in elem ) {
        // Only set the IDL specifically if it already exists on the element
        elem[ propName ] = true;
      }

      elem.setAttribute( name, name.toLowerCase() );
    }
    return name;
  }
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

  fixSpecified = {
    name: true,
    id: true,
    coords: true
  };

  // Use this for any attribute in IE6/7
  // This fixes almost every IE6/7 issue
  nodeHook = jQuery.valHooks.button = {
    get: function( elem, name ) {
      var ret;
      ret = elem.getAttributeNode( name );
      return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
        ret.nodeValue :
        undefined;
    },
    set: function( elem, value, name ) {
      // Set the existing or create a new attribute node
      var ret = elem.getAttributeNode( name );
      if ( !ret ) {
        ret = document.createAttribute( name );
        elem.setAttributeNode( ret );
      }
      return ( ret.nodeValue = value + "" );
    }
  };

  // Apply the nodeHook to tabindex
  jQuery.attrHooks.tabindex.set = nodeHook.set;

  // Set width and height to auto instead of 0 on empty string( Bug #8150 )
  // This is for removals
  jQuery.each([ "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      set: function( elem, value ) {
        if ( value === "" ) {
          elem.setAttribute( name, "auto" );
          return value;
        }
      }
    });
  });

  // Set contenteditable to false on removals(#10429)
  // Setting to empty string throws an error as an invalid value
  jQuery.attrHooks.contenteditable = {
    get: nodeHook.get,
    set: function( elem, value, name ) {
      if ( value === "" ) {
        value = "false";
      }
      nodeHook.set( elem, value, name );
    }
  };
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
  jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
    jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
      get: function( elem ) {
        var ret = elem.getAttribute( name, 2 );
        return ret === null ? undefined : ret;
      }
    });
  });
}

if ( !jQuery.support.style ) {
  jQuery.attrHooks.style = {
    get: function( elem ) {
      // Return undefined in the case of empty string
      // Normalize to lowercase since IE uppercases css property names
      return elem.style.cssText.toLowerCase() || undefined;
    },
    set: function( elem, value ) {
      return ( elem.style.cssText = "" + value );
    }
  };
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
  jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
    get: function( elem ) {
      var parent = elem.parentNode;

      if ( parent ) {
        parent.selectedIndex;

        // Make sure that it also works with optgroups, see #5701
        if ( parent.parentNode ) {
          parent.parentNode.selectedIndex;
        }
      }
      return null;
    }
  });
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
  jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
  jQuery.each([ "radio", "checkbox" ], function() {
    jQuery.valHooks[ this ] = {
      get: function( elem ) {
        // Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
        return elem.getAttribute("value") === null ? "on" : elem.value;
      }
    };
  });
}
jQuery.each([ "radio", "checkbox" ], function() {
  jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
    set: function( elem, value ) {
      if ( jQuery.isArray( value ) ) {
        return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
      }
    }
  });
});




var rformElems = /^(?:textarea|input|select)$/i,
  rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
  rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
  rkeyEvent = /^key/,
  rmouseEvent = /^(?:mouse|contextmenu)|click/,
  rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
  rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
  quickParse = function( selector ) {
    var quick = rquickIs.exec( selector );
    if ( quick ) {
      //   0  1    2   3
      // [ _, tag, id, class ]
      quick[1] = ( quick[1] || "" ).toLowerCase();
      quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
    }
    return quick;
  },
  quickIs = function( elem, m ) {
    var attrs = elem.attributes || {};
    return (
      (!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
      (!m[2] || (attrs.id || {}).value === m[2]) &&
      (!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
    );
  },
  hoverHack = function( events ) {
    return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
  };

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

  add: function( elem, types, handler, data, selector ) {

    var elemData, eventHandle, events,
      t, tns, type, namespaces, handleObj,
      handleObjIn, quick, handlers, special;

    // Don't attach events to noData or text/comment nodes (allow plain objects tho)
    if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
      return;
    }

    // Caller can pass in an object of custom data in lieu of the handler
    if ( handler.handler ) {
      handleObjIn = handler;
      handler = handleObjIn.handler;
      selector = handleObjIn.selector;
    }

    // Make sure that the handler has a unique ID, used to find/remove it later
    if ( !handler.guid ) {
      handler.guid = jQuery.guid++;
    }

    // Init the element's event structure and main handler, if this is the first
    events = elemData.events;
    if ( !events ) {
      elemData.events = events = {};
    }
    eventHandle = elemData.handle;
    if ( !eventHandle ) {
      elemData.handle = eventHandle = function( e ) {
        // Discard the second event of a jQuery.event.trigger() and
        // when an event is called after a page has unloaded
        return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
          jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
          undefined;
      };
      // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
      eventHandle.elem = elem;
    }

    // Handle multiple events separated by a space
    // jQuery(...).bind("mouseover mouseout", fn);
    types = jQuery.trim( hoverHack(types) ).split( " " );
    for ( t = 0; t < types.length; t++ ) {

      tns = rtypenamespace.exec( types[t] ) || [];
      type = tns[1];
      namespaces = ( tns[2] || "" ).split( "." ).sort();

      // If event changes its type, use the special event handlers for the changed type
      special = jQuery.event.special[ type ] || {};

      // If selector defined, determine special event api type, otherwise given type
      type = ( selector ? special.delegateType : special.bindType ) || type;

      // Update special based on newly reset type
      special = jQuery.event.special[ type ] || {};

      // handleObj is passed to all event handlers
      handleObj = jQuery.extend({
        type: type,
        origType: tns[1],
        data: data,
        handler: handler,
        guid: handler.guid,
        selector: selector,
        quick: selector && quickParse( selector ),
        namespace: namespaces.join(".")
      }, handleObjIn );

      // Init the event handler queue if we're the first
      handlers = events[ type ];
      if ( !handlers ) {
        handlers = events[ type ] = [];
        handlers.delegateCount = 0;

        // Only use addEventListener/attachEvent if the special events handler returns false
        if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
          // Bind the global event handler to the element
          if ( elem.addEventListener ) {
            elem.addEventListener( type, eventHandle, false );

          } else if ( elem.attachEvent ) {
            elem.attachEvent( "on" + type, eventHandle );
          }
        }
      }

      if ( special.add ) {
        special.add.call( elem, handleObj );

        if ( !handleObj.handler.guid ) {
          handleObj.handler.guid = handler.guid;
        }
      }

      // Add to the element's handler list, delegates in front
      if ( selector ) {
        handlers.splice( handlers.delegateCount++, 0, handleObj );
      } else {
        handlers.push( handleObj );
      }

      // Keep track of which events have ever been used, for event optimization
      jQuery.event.global[ type ] = true;
    }

    // Nullify elem to prevent memory leaks in IE
    elem = null;
  },

  global: {},

  // Detach an event or set of events from an element
  remove: function( elem, types, handler, selector, mappedTypes ) {

    var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
      t, tns, type, origType, namespaces, origCount,
      j, events, special, handle, eventType, handleObj;

    if ( !elemData || !(events = elemData.events) ) {
      return;
    }

    // Once for each type.namespace in types; type may be omitted
    types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
    for ( t = 0; t < types.length; t++ ) {
      tns = rtypenamespace.exec( types[t] ) || [];
      type = origType = tns[1];
      namespaces = tns[2];

      // Unbind all events (on this namespace, if provided) for the element
      if ( !type ) {
        for ( type in events ) {
          jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
        }
        continue;
      }

      special = jQuery.event.special[ type ] || {};
      type = ( selector? special.delegateType : special.bindType ) || type;
      eventType = events[ type ] || [];
      origCount = eventType.length;
      namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

      // Remove matching events
      for ( j = 0; j < eventType.length; j++ ) {
        handleObj = eventType[ j ];

        if ( ( mappedTypes || origType === handleObj.origType ) &&
           ( !handler || handler.guid === handleObj.guid ) &&
           ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
           ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
          eventType.splice( j--, 1 );

          if ( handleObj.selector ) {
            eventType.delegateCount--;
          }
          if ( special.remove ) {
            special.remove.call( elem, handleObj );
          }
        }
      }

      // Remove generic event handler if we removed something and no more handlers exist
      // (avoids potential for endless recursion during removal of special event handlers)
      if ( eventType.length === 0 && origCount !== eventType.length ) {
        if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
          jQuery.removeEvent( elem, type, elemData.handle );
        }

        delete events[ type ];
      }
    }

    // Remove the expando if it's no longer used
    if ( jQuery.isEmptyObject( events ) ) {
      handle = elemData.handle;
      if ( handle ) {
        handle.elem = null;
      }

      // removeData also checks for emptiness and clears the expando if empty
      // so use it instead of delete
      jQuery.removeData( elem, [ "events", "handle" ], true );
    }
  },

  // Events that are safe to short-circuit if no handlers are attached.
  // Native DOM events should not be added, they may have inline handlers.
  customEvent: {
    "getData": true,
    "setData": true,
    "changeData": true
  },

  trigger: function( event, data, elem, onlyHandlers ) {
    // Don't do events on text and comment nodes
    if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
      return;
    }

    // Event object or event type
    var type = event.type || event,
      namespaces = [],
      cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

    // focus/blur morphs to focusin/out; ensure we're not firing them right now
    if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
      return;
    }

    if ( type.indexOf( "!" ) >= 0 ) {
      // Exclusive events trigger only for the exact event (no namespaces)
      type = type.slice(0, -1);
      exclusive = true;
    }

    if ( type.indexOf( "." ) >= 0 ) {
      // Namespaced trigger; create a regexp to match event type in handle()
      namespaces = type.split(".");
      type = namespaces.shift();
      namespaces.sort();
    }

    if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
      // No jQuery handlers for this event type, and it can't have inline handlers
      return;
    }

    // Caller can pass in an Event, Object, or just an event type string
    event = typeof event === "object" ?
      // jQuery.Event object
      event[ jQuery.expando ] ? event :
      // Object literal
      new jQuery.Event( type, event ) :
      // Just the event type (string)
      new jQuery.Event( type );

    event.type = type;
    event.isTrigger = true;
    event.exclusive = exclusive;
    event.namespace = namespaces.join( "." );
    event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
    ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

    // Handle a global trigger
    if ( !elem ) {

      // TODO: Stop taunting the data cache; remove global events and always attach to document
      cache = jQuery.cache;
      for ( i in cache ) {
        if ( cache[ i ].events && cache[ i ].events[ type ] ) {
          jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
        }
      }
      return;
    }

    // Clean up the event in case it is being reused
    event.result = undefined;
    if ( !event.target ) {
      event.target = elem;
    }

    // Clone any incoming data and prepend the event, creating the handler arg list
    data = data != null ? jQuery.makeArray( data ) : [];
    data.unshift( event );

    // Allow special events to draw outside the lines
    special = jQuery.event.special[ type ] || {};
    if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
      return;
    }

    // Determine event propagation path in advance, per W3C events spec (#9951)
    // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    eventPath = [[ elem, special.bindType || type ]];
    if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

      bubbleType = special.delegateType || type;
      cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
      old = null;
      for ( ; cur; cur = cur.parentNode ) {
        eventPath.push([ cur, bubbleType ]);
        old = cur;
      }

      // Only add window if we got to document (e.g., not plain obj or detached DOM)
      if ( old && old === elem.ownerDocument ) {
        eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
      }
    }

    // Fire handlers on the event path
    for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

      cur = eventPath[i][0];
      event.type = eventPath[i][1];

      handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
      if ( handle ) {
        handle.apply( cur, data );
      }
      // Note that this is a bare JS function and not a jQuery handler
      handle = ontype && cur[ ontype ];
      if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
        event.preventDefault();
      }
    }
    event.type = type;

    // If nobody prevented the default action, do it now
    if ( !onlyHandlers && !event.isDefaultPrevented() ) {

      if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
        !(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

        // Call a native DOM method on the target with the same name name as the event.
        // Can't use an .isFunction() check here because IE6/7 fails that test.
        // Don't do default actions on window, that's where global variables be (#6170)
        // IE<9 dies on focus/blur to hidden element (#1486)
        if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

          // Don't re-trigger an onFOO event when we call its FOO() method
          old = elem[ ontype ];

          if ( old ) {
            elem[ ontype ] = null;
          }

          // Prevent re-triggering of the same event, since we already bubbled it above
          jQuery.event.triggered = type;
          elem[ type ]();
          jQuery.event.triggered = undefined;

          if ( old ) {
            elem[ ontype ] = old;
          }
        }
      }
    }

    return event.result;
  },

  dispatch: function( event ) {

    // Make a writable jQuery.Event from the native event object
    event = jQuery.event.fix( event || window.event );

    var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
      delegateCount = handlers.delegateCount,
      args = [].slice.call( arguments, 0 ),
      run_all = !event.exclusive && !event.namespace,
      special = jQuery.event.special[ event.type ] || {},
      handlerQueue = [],
      i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

    // Use the fix-ed jQuery.Event rather than the (read-only) native event
    args[0] = event;
    event.delegateTarget = this;

    // Call the preDispatch hook for the mapped type, and let it bail if desired
    if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
      return;
    }

    // Determine handlers that should run if there are delegated events
    // Avoid non-left-click bubbling in Firefox (#3861)
    if ( delegateCount && !(event.button && event.type === "click") ) {

      // Pregenerate a single jQuery object for reuse with .is()
      jqcur = jQuery(this);
      jqcur.context = this.ownerDocument || this;

      for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

        // Don't process events on disabled elements (#6911, #8165)
        if ( cur.disabled !== true ) {
          selMatch = {};
          matches = [];
          jqcur[0] = cur;
          for ( i = 0; i < delegateCount; i++ ) {
            handleObj = handlers[ i ];
            sel = handleObj.selector;

            if ( selMatch[ sel ] === undefined ) {
              selMatch[ sel ] = (
                handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
              );
            }
            if ( selMatch[ sel ] ) {
              matches.push( handleObj );
            }
          }
          if ( matches.length ) {
            handlerQueue.push({ elem: cur, matches: matches });
          }
        }
      }
    }

    // Add the remaining (directly-bound) handlers
    if ( handlers.length > delegateCount ) {
      handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
    }

    // Run delegates first; they may want to stop propagation beneath us
    for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
      matched = handlerQueue[ i ];
      event.currentTarget = matched.elem;

      for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
        handleObj = matched.matches[ j ];

        // Triggered event must either 1) be non-exclusive and have no namespace, or
        // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
        if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

          event.data = handleObj.data;
          event.handleObj = handleObj;

          ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
              .apply( matched.elem, args );

          if ( ret !== undefined ) {
            event.result = ret;
            if ( ret === false ) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }
      }
    }

    // Call the postDispatch hook for the mapped type
    if ( special.postDispatch ) {
      special.postDispatch.call( this, event );
    }

    return event.result;
  },

  // Includes some event props shared by KeyEvent and MouseEvent
  // *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
  props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

  fixHooks: {},

  keyHooks: {
    props: "char charCode key keyCode".split(" "),
    filter: function( event, original ) {

      // Add which for key events
      if ( event.which == null ) {
        event.which = original.charCode != null ? original.charCode : original.keyCode;
      }

      return event;
    }
  },

  mouseHooks: {
    props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
    filter: function( event, original ) {
      var eventDoc, doc, body,
        button = original.button,
        fromElement = original.fromElement;

      // Calculate pageX/Y if missing and clientX/Y available
      if ( event.pageX == null && original.clientX != null ) {
        eventDoc = event.target.ownerDocument || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
        event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      // Add relatedTarget, if necessary
      if ( !event.relatedTarget && fromElement ) {
        event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
      }

      // Add which for click: 1 === left; 2 === middle; 3 === right
      // Note: button is not normalized, so don't use it
      if ( !event.which && button !== undefined ) {
        event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
      }

      return event;
    }
  },

  fix: function( event ) {
    if ( event[ jQuery.expando ] ) {
      return event;
    }

    // Create a writable copy of the event object and normalize some properties
    var i, prop,
      originalEvent = event,
      fixHook = jQuery.event.fixHooks[ event.type ] || {},
      copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

    event = jQuery.Event( originalEvent );

    for ( i = copy.length; i; ) {
      prop = copy[ --i ];
      event[ prop ] = originalEvent[ prop ];
    }

    // Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
    if ( !event.target ) {
      event.target = originalEvent.srcElement || document;
    }

    // Target should not be a text node (#504, Safari)
    if ( event.target.nodeType === 3 ) {
      event.target = event.target.parentNode;
    }

    // For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
    if ( event.metaKey === undefined ) {
      event.metaKey = event.ctrlKey;
    }

    return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
  },

  special: {
    ready: {
      // Make sure the ready event is setup
      setup: jQuery.bindReady
    },

    load: {
      // Prevent triggered image.load events from bubbling to window.load
      noBubble: true
    },

    focus: {
      delegateType: "focusin"
    },
    blur: {
      delegateType: "focusout"
    },

    beforeunload: {
      setup: function( data, namespaces, eventHandle ) {
        // We only want to do this special case on windows
        if ( jQuery.isWindow( this ) ) {
          this.onbeforeunload = eventHandle;
        }
      },

      teardown: function( namespaces, eventHandle ) {
        if ( this.onbeforeunload === eventHandle ) {
          this.onbeforeunload = null;
        }
      }
    }
  },

  simulate: function( type, elem, event, bubble ) {
    // Piggyback on a donor event to simulate a different one.
    // Fake originalEvent to avoid donor's stopPropagation, but if the
    // simulated event prevents default then we do the same on the donor.
    var e = jQuery.extend(
      new jQuery.Event(),
      event,
      { type: type,
        isSimulated: true,
        originalEvent: {}
      }
    );
    if ( bubble ) {
      jQuery.event.trigger( e, null, elem );
    } else {
      jQuery.event.dispatch.call( elem, e );
    }
    if ( e.isDefaultPrevented() ) {
      event.preventDefault();
    }
  }
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
  function( elem, type, handle ) {
    if ( elem.removeEventListener ) {
      elem.removeEventListener( type, handle, false );
    }
  } :
  function( elem, type, handle ) {
    if ( elem.detachEvent ) {
      elem.detachEvent( "on" + type, handle );
    }
  };

jQuery.Event = function( src, props ) {
  // Allow instantiation without the 'new' keyword
  if ( !(this instanceof jQuery.Event) ) {
    return new jQuery.Event( src, props );
  }

  // Event object
  if ( src && src.type ) {
    this.originalEvent = src;
    this.type = src.type;

    // Events bubbling up the document may have been marked as prevented
    // by a handler lower down the tree; reflect the correct value.
    this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
      src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

  // Event type
  } else {
    this.type = src;
  }

  // Put explicitly provided properties onto the event object
  if ( props ) {
    jQuery.extend( this, props );
  }

  // Create a timestamp if incoming event doesn't have one
  this.timeStamp = src && src.timeStamp || jQuery.now();

  // Mark it as fixed
  this[ jQuery.expando ] = true;
};

function returnFalse() {
  return false;
}
function returnTrue() {
  return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
  preventDefault: function() {
    this.isDefaultPrevented = returnTrue;

    var e = this.originalEvent;
    if ( !e ) {
      return;
    }

    // if preventDefault exists run it on the original event
    if ( e.preventDefault ) {
      e.preventDefault();

    // otherwise set the returnValue property of the original event to false (IE)
    } else {
      e.returnValue = false;
    }
  },
  stopPropagation: function() {
    this.isPropagationStopped = returnTrue;

    var e = this.originalEvent;
    if ( !e ) {
      return;
    }
    // if stopPropagation exists run it on the original event
    if ( e.stopPropagation ) {
      e.stopPropagation();
    }
    // otherwise set the cancelBubble property of the original event to true (IE)
    e.cancelBubble = true;
  },
  stopImmediatePropagation: function() {
    this.isImmediatePropagationStopped = returnTrue;
    this.stopPropagation();
  },
  isDefaultPrevented: returnFalse,
  isPropagationStopped: returnFalse,
  isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
  mouseenter: "mouseover",
  mouseleave: "mouseout"
}, function( orig, fix ) {
  jQuery.event.special[ orig ] = {
    delegateType: fix,
    bindType: fix,

    handle: function( event ) {
      var target = this,
        related = event.relatedTarget,
        handleObj = event.handleObj,
        selector = handleObj.selector,
        ret;

      // For mousenter/leave call the handler if related is outside the target.
      // NB: No relatedTarget if the mouse left/entered the browser window
      if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
        event.type = handleObj.origType;
        ret = handleObj.handler.apply( this, arguments );
        event.type = fix;
      }
      return ret;
    }
  };
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

  jQuery.event.special.submit = {
    setup: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Lazy-add a submit handler when a descendant form may potentially be submitted
      jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
        // Node name check avoids a VML-related crash in IE (#9807)
        var elem = e.target,
          form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
        if ( form && !form._submit_attached ) {
          jQuery.event.add( form, "submit._submit", function( event ) {
            event._submit_bubble = true;
          });
          form._submit_attached = true;
        }
      });
      // return undefined since we don't need an event listener
    },
    
    postDispatch: function( event ) {
      // If form was submitted by the user, bubble the event up the tree
      if ( event._submit_bubble ) {
        delete event._submit_bubble;
        if ( this.parentNode && !event.isTrigger ) {
          jQuery.event.simulate( "submit", this.parentNode, event, true );
        }
      }
    },

    teardown: function() {
      // Only need this for delegated form submit events
      if ( jQuery.nodeName( this, "form" ) ) {
        return false;
      }

      // Remove delegated handlers; cleanData eventually reaps submit handlers attached above
      jQuery.event.remove( this, "._submit" );
    }
  };
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

  jQuery.event.special.change = {

    setup: function() {

      if ( rformElems.test( this.nodeName ) ) {
        // IE doesn't fire change on a check/radio until blur; trigger it on click
        // after a propertychange. Eat the blur-change in special.change.handle.
        // This still fires onchange a second time for check/radio after blur.
        if ( this.type === "checkbox" || this.type === "radio" ) {
          jQuery.event.add( this, "propertychange._change", function( event ) {
            if ( event.originalEvent.propertyName === "checked" ) {
              this._just_changed = true;
            }
          });
          jQuery.event.add( this, "click._change", function( event ) {
            if ( this._just_changed && !event.isTrigger ) {
              this._just_changed = false;
              jQuery.event.simulate( "change", this, event, true );
            }
          });
        }
        return false;
      }
      // Delegated event; lazy-add a change handler on descendant inputs
      jQuery.event.add( this, "beforeactivate._change", function( e ) {
        var elem = e.target;

        if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
          jQuery.event.add( elem, "change._change", function( event ) {
            if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
              jQuery.event.simulate( "change", this.parentNode, event, true );
            }
          });
          elem._change_attached = true;
        }
      });
    },

    handle: function( event ) {
      var elem = event.target;

      // Swallow native change events from checkbox/radio, we already triggered them above
      if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
        return event.handleObj.handler.apply( this, arguments );
      }
    },

    teardown: function() {
      jQuery.event.remove( this, "._change" );

      return rformElems.test( this.nodeName );
    }
  };
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
  jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    // Attach a single capturing handler while someone wants focusin/focusout
    var attaches = 0,
      handler = function( event ) {
        jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
      };

    jQuery.event.special[ fix ] = {
      setup: function() {
        if ( attaches++ === 0 ) {
          document.addEventListener( orig, handler, true );
        }
      },
      teardown: function() {
        if ( --attaches === 0 ) {
          document.removeEventListener( orig, handler, true );
        }
      }
    };
  });
}

jQuery.fn.extend({

  on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
    var origFn, type;

    // Types can be a map of types/handlers
    if ( typeof types === "object" ) {
      // ( types-Object, selector, data )
      if ( typeof selector !== "string" ) { // && selector != null
        // ( types-Object, data )
        data = data || selector;
        selector = undefined;
      }
      for ( type in types ) {
        this.on( type, selector, data, types[ type ], one );
      }
      return this;
    }

    if ( data == null && fn == null ) {
      // ( types, fn )
      fn = selector;
      data = selector = undefined;
    } else if ( fn == null ) {
      if ( typeof selector === "string" ) {
        // ( types, selector, fn )
        fn = data;
        data = undefined;
      } else {
        // ( types, data, fn )
        fn = data;
        data = selector;
        selector = undefined;
      }
    }
    if ( fn === false ) {
      fn = returnFalse;
    } else if ( !fn ) {
      return this;
    }

    if ( one === 1 ) {
      origFn = fn;
      fn = function( event ) {
        // Can use an empty set, since event contains the info
        jQuery().off( event );
        return origFn.apply( this, arguments );
      };
      // Use same guid so caller can remove using origFn
      fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    }
    return this.each( function() {
      jQuery.event.add( this, types, fn, data, selector );
    });
  },
  one: function( types, selector, data, fn ) {
    return this.on( types, selector, data, fn, 1 );
  },
  off: function( types, selector, fn ) {
    if ( types && types.preventDefault && types.handleObj ) {
      // ( event )  dispatched jQuery.Event
      var handleObj = types.handleObj;
      jQuery( types.delegateTarget ).off(
        handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
        handleObj.selector,
        handleObj.handler
      );
      return this;
    }
    if ( typeof types === "object" ) {
      // ( types-object [, selector] )
      for ( var type in types ) {
        this.off( type, selector, types[ type ] );
      }
      return this;
    }
    if ( selector === false || typeof selector === "function" ) {
      // ( types [, fn] )
      fn = selector;
      selector = undefined;
    }
    if ( fn === false ) {
      fn = returnFalse;
    }
    return this.each(function() {
      jQuery.event.remove( this, types, fn, selector );
    });
  },

  bind: function( types, data, fn ) {
    return this.on( types, null, data, fn );
  },
  unbind: function( types, fn ) {
    return this.off( types, null, fn );
  },

  live: function( types, data, fn ) {
    jQuery( this.context ).on( types, this.selector, data, fn );
    return this;
  },
  die: function( types, fn ) {
    jQuery( this.context ).off( types, this.selector || "**", fn );
    return this;
  },

  delegate: function( selector, types, data, fn ) {
    return this.on( types, selector, data, fn );
  },
  undelegate: function( selector, types, fn ) {
    // ( namespace ) or ( selector, types [, fn] )
    return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
  },

  trigger: function( type, data ) {
    return this.each(function() {
      jQuery.event.trigger( type, data, this );
    });
  },
  triggerHandler: function( type, data ) {
    if ( this[0] ) {
      return jQuery.event.trigger( type, data, this[0], true );
    }
  },

  toggle: function( fn ) {
    // Save reference to arguments for access in closure
    var args = arguments,
      guid = fn.guid || jQuery.guid++,
      i = 0,
      toggler = function( event ) {
        // Figure out which function to execute
        var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
        jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

        // Make sure that clicks stop
        event.preventDefault();

        // and execute the function
        return args[ lastToggle ].apply( this, arguments ) || false;
      };

    // link all the functions, so any of them can unbind this click handler
    toggler.guid = guid;
    while ( i < args.length ) {
      args[ i++ ].guid = guid;
    }

    return this.click( toggler );
  },

  hover: function( fnOver, fnOut ) {
    return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
  }
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
  "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
  "change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

  // Handle event binding
  jQuery.fn[ name ] = function( data, fn ) {
    if ( fn == null ) {
      fn = data;
      data = null;
    }

    return arguments.length > 0 ?
      this.on( name, null, data, fn ) :
      this.trigger( name );
  };

  if ( jQuery.attrFn ) {
    jQuery.attrFn[ name ] = true;
  }

  if ( rkeyEvent.test( name ) ) {
    jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
  }

  if ( rmouseEvent.test( name ) ) {
    jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
  }
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
  expando = "sizcache" + (Math.random() + '').replace('.', ''),
  done = 0,
  toString = Object.prototype.toString,
  hasDuplicate = false,
  baseHasDuplicate = true,
  rBackslash = /\\/g,
  rReturn = /\r\n/g,
  rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
  baseHasDuplicate = false;
  return 0;
});

var Sizzle = function( selector, context, results, seed ) {
  results = results || [];
  context = context || document;

  var origContext = context;

  if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
    return [];
  }

  if ( !selector || typeof selector !== "string" ) {
    return results;
  }

  var m, set, checkSet, extra, ret, cur, pop, i,
    prune = true,
    contextXML = Sizzle.isXML( context ),
    parts = [],
    soFar = selector;

  // Reset the position of the chunker regexp (start from head)
  do {
    chunker.exec( "" );
    m = chunker.exec( soFar );

    if ( m ) {
      soFar = m[3];

      parts.push( m[1] );

      if ( m[2] ) {
        extra = m[3];
        break;
      }
    }
  } while ( m );

  if ( parts.length > 1 && origPOS.exec( selector ) ) {

    if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
      set = posProcess( parts[0] + parts[1], context, seed );

    } else {
      set = Expr.relative[ parts[0] ] ?
        [ context ] :
        Sizzle( parts.shift(), context );

      while ( parts.length ) {
        selector = parts.shift();

        if ( Expr.relative[ selector ] ) {
          selector += parts.shift();
        }

        set = posProcess( selector, set, seed );
      }
    }

  } else {
    // Take a shortcut and set the context if the root selector is an ID
    // (but not if it'll be faster if the inner selector is an ID)
    if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
        Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

      ret = Sizzle.find( parts.shift(), context, contextXML );
      context = ret.expr ?
        Sizzle.filter( ret.expr, ret.set )[0] :
        ret.set[0];
    }

    if ( context ) {
      ret = seed ?
        { expr: parts.pop(), set: makeArray(seed) } :
        Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

      set = ret.expr ?
        Sizzle.filter( ret.expr, ret.set ) :
        ret.set;

      if ( parts.length > 0 ) {
        checkSet = makeArray( set );

      } else {
        prune = false;
      }

      while ( parts.length ) {
        cur = parts.pop();
        pop = cur;

        if ( !Expr.relative[ cur ] ) {
          cur = "";
        } else {
          pop = parts.pop();
        }

        if ( pop == null ) {
          pop = context;
        }

        Expr.relative[ cur ]( checkSet, pop, contextXML );
      }

    } else {
      checkSet = parts = [];
    }
  }

  if ( !checkSet ) {
    checkSet = set;
  }

  if ( !checkSet ) {
    Sizzle.error( cur || selector );
  }

  if ( toString.call(checkSet) === "[object Array]" ) {
    if ( !prune ) {
      results.push.apply( results, checkSet );

    } else if ( context && context.nodeType === 1 ) {
      for ( i = 0; checkSet[i] != null; i++ ) {
        if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
          results.push( set[i] );
        }
      }

    } else {
      for ( i = 0; checkSet[i] != null; i++ ) {
        if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
          results.push( set[i] );
        }
      }
    }

  } else {
    makeArray( checkSet, results );
  }

  if ( extra ) {
    Sizzle( extra, origContext, results, seed );
    Sizzle.uniqueSort( results );
  }

  return results;
};

Sizzle.uniqueSort = function( results ) {
  if ( sortOrder ) {
    hasDuplicate = baseHasDuplicate;
    results.sort( sortOrder );

    if ( hasDuplicate ) {
      for ( var i = 1; i < results.length; i++ ) {
        if ( results[i] === results[ i - 1 ] ) {
          results.splice( i--, 1 );
        }
      }
    }
  }

  return results;
};

Sizzle.matches = function( expr, set ) {
  return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
  return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
  var set, i, len, match, type, left;

  if ( !expr ) {
    return [];
  }

  for ( i = 0, len = Expr.order.length; i < len; i++ ) {
    type = Expr.order[i];

    if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
      left = match[1];
      match.splice( 1, 1 );

      if ( left.substr( left.length - 1 ) !== "\\" ) {
        match[1] = (match[1] || "").replace( rBackslash, "" );
        set = Expr.find[ type ]( match, context, isXML );

        if ( set != null ) {
          expr = expr.replace( Expr.match[ type ], "" );
          break;
        }
      }
    }
  }

  if ( !set ) {
    set = typeof context.getElementsByTagName !== "undefined" ?
      context.getElementsByTagName( "*" ) :
      [];
  }

  return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
  var match, anyFound,
    type, found, item, filter, left,
    i, pass,
    old = expr,
    result = [],
    curLoop = set,
    isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

  while ( expr && set.length ) {
    for ( type in Expr.filter ) {
      if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
        filter = Expr.filter[ type ];
        left = match[1];

        anyFound = false;

        match.splice(1,1);

        if ( left.substr( left.length - 1 ) === "\\" ) {
          continue;
        }

        if ( curLoop === result ) {
          result = [];
        }

        if ( Expr.preFilter[ type ] ) {
          match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

          if ( !match ) {
            anyFound = found = true;

          } else if ( match === true ) {
            continue;
          }
        }

        if ( match ) {
          for ( i = 0; (item = curLoop[i]) != null; i++ ) {
            if ( item ) {
              found = filter( item, match, i, curLoop );
              pass = not ^ found;

              if ( inplace && found != null ) {
                if ( pass ) {
                  anyFound = true;

                } else {
                  curLoop[i] = false;
                }

              } else if ( pass ) {
                result.push( item );
                anyFound = true;
              }
            }
          }
        }

        if ( found !== undefined ) {
          if ( !inplace ) {
            curLoop = result;
          }

          expr = expr.replace( Expr.match[ type ], "" );

          if ( !anyFound ) {
            return [];
          }

          break;
        }
      }
    }

    // Improper expression
    if ( expr === old ) {
      if ( anyFound == null ) {
        Sizzle.error( expr );

      } else {
        break;
      }
    }

    old = expr;
  }

  return curLoop;
};

Sizzle.error = function( msg ) {
  throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
    nodeType = elem.nodeType,
    ret = "";

  if ( nodeType ) {
    if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
      // Use textContent || innerText for elements
      if ( typeof elem.textContent === 'string' ) {
        return elem.textContent;
      } else if ( typeof elem.innerText === 'string' ) {
        // Replace IE's carriage returns
        return elem.innerText.replace( rReturn, '' );
      } else {
        // Traverse it's children
        for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
          ret += getText( elem );
        }
      }
    } else if ( nodeType === 3 || nodeType === 4 ) {
      return elem.nodeValue;
    }
  } else {

    // If no nodeType, this is expected to be an array
    for ( i = 0; (node = elem[i]); i++ ) {
      // Do not traverse comment nodes
      if ( node.nodeType !== 8 ) {
        ret += getText( node );
      }
    }
  }
  return ret;
};

var Expr = Sizzle.selectors = {
  order: [ "ID", "NAME", "TAG" ],

  match: {
    ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
    CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
    NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
    ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
    TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
    CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
    POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
    PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
  },

  leftMatch: {},

  attrMap: {
    "class": "className",
    "for": "htmlFor"
  },

  attrHandle: {
    href: function( elem ) {
      return elem.getAttribute( "href" );
    },
    type: function( elem ) {
      return elem.getAttribute( "type" );
    }
  },

  relative: {
    "+": function(checkSet, part){
      var isPartStr = typeof part === "string",
        isTag = isPartStr && !rNonWord.test( part ),
        isPartStrNotTag = isPartStr && !isTag;

      if ( isTag ) {
        part = part.toLowerCase();
      }

      for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
        if ( (elem = checkSet[i]) ) {
          while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

          checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
            elem || false :
            elem === part;
        }
      }

      if ( isPartStrNotTag ) {
        Sizzle.filter( part, checkSet, true );
      }
    },

    ">": function( checkSet, part ) {
      var elem,
        isPartStr = typeof part === "string",
        i = 0,
        l = checkSet.length;

      if ( isPartStr && !rNonWord.test( part ) ) {
        part = part.toLowerCase();

        for ( ; i < l; i++ ) {
          elem = checkSet[i];

          if ( elem ) {
            var parent = elem.parentNode;
            checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
          }
        }

      } else {
        for ( ; i < l; i++ ) {
          elem = checkSet[i];

          if ( elem ) {
            checkSet[i] = isPartStr ?
              elem.parentNode :
              elem.parentNode === part;
          }
        }

        if ( isPartStr ) {
          Sizzle.filter( part, checkSet, true );
        }
      }
    },

    "": function(checkSet, part, isXML){
      var nodeCheck,
        doneName = done++,
        checkFn = dirCheck;

      if ( typeof part === "string" && !rNonWord.test( part ) ) {
        part = part.toLowerCase();
        nodeCheck = part;
        checkFn = dirNodeCheck;
      }

      checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
    },

    "~": function( checkSet, part, isXML ) {
      var nodeCheck,
        doneName = done++,
        checkFn = dirCheck;

      if ( typeof part === "string" && !rNonWord.test( part ) ) {
        part = part.toLowerCase();
        nodeCheck = part;
        checkFn = dirNodeCheck;
      }

      checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
    }
  },

  find: {
    ID: function( match, context, isXML ) {
      if ( typeof context.getElementById !== "undefined" && !isXML ) {
        var m = context.getElementById(match[1]);
        // Check parentNode to catch when Blackberry 4.6 returns
        // nodes that are no longer in the document #6963
        return m && m.parentNode ? [m] : [];
      }
    },

    NAME: function( match, context ) {
      if ( typeof context.getElementsByName !== "undefined" ) {
        var ret = [],
          results = context.getElementsByName( match[1] );

        for ( var i = 0, l = results.length; i < l; i++ ) {
          if ( results[i].getAttribute("name") === match[1] ) {
            ret.push( results[i] );
          }
        }

        return ret.length === 0 ? null : ret;
      }
    },

    TAG: function( match, context ) {
      if ( typeof context.getElementsByTagName !== "undefined" ) {
        return context.getElementsByTagName( match[1] );
      }
    }
  },
  preFilter: {
    CLASS: function( match, curLoop, inplace, result, not, isXML ) {
      match = " " + match[1].replace( rBackslash, "" ) + " ";

      if ( isXML ) {
        return match;
      }

      for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
        if ( elem ) {
          if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
            if ( !inplace ) {
              result.push( elem );
            }

          } else if ( inplace ) {
            curLoop[i] = false;
          }
        }
      }

      return false;
    },

    ID: function( match ) {
      return match[1].replace( rBackslash, "" );
    },

    TAG: function( match, curLoop ) {
      return match[1].replace( rBackslash, "" ).toLowerCase();
    },

    CHILD: function( match ) {
      if ( match[1] === "nth" ) {
        if ( !match[2] ) {
          Sizzle.error( match[0] );
        }

        match[2] = match[2].replace(/^\+|\s*/g, '');

        // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
        var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
          match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
          !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

        // calculate the numbers (first)n+(last) including if they are negative
        match[2] = (test[1] + (test[2] || 1)) - 0;
        match[3] = test[3] - 0;
      }
      else if ( match[2] ) {
        Sizzle.error( match[0] );
      }

      // TODO: Move to normal caching system
      match[0] = done++;

      return match;
    },

    ATTR: function( match, curLoop, inplace, result, not, isXML ) {
      var name = match[1] = match[1].replace( rBackslash, "" );

      if ( !isXML && Expr.attrMap[name] ) {
        match[1] = Expr.attrMap[name];
      }

      // Handle if an un-quoted value was used
      match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

      if ( match[2] === "~=" ) {
        match[4] = " " + match[4] + " ";
      }

      return match;
    },

    PSEUDO: function( match, curLoop, inplace, result, not ) {
      if ( match[1] === "not" ) {
        // If we're dealing with a complex expression, or a simple one
        if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
          match[3] = Sizzle(match[3], null, null, curLoop);

        } else {
          var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

          if ( !inplace ) {
            result.push.apply( result, ret );
          }

          return false;
        }

      } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
        return true;
      }

      return match;
    },

    POS: function( match ) {
      match.unshift( true );

      return match;
    }
  },

  filters: {
    enabled: function( elem ) {
      return elem.disabled === false && elem.type !== "hidden";
    },

    disabled: function( elem ) {
      return elem.disabled === true;
    },

    checked: function( elem ) {
      return elem.checked === true;
    },

    selected: function( elem ) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if ( elem.parentNode ) {
        elem.parentNode.selectedIndex;
      }

      return elem.selected === true;
    },

    parent: function( elem ) {
      return !!elem.firstChild;
    },

    empty: function( elem ) {
      return !elem.firstChild;
    },

    has: function( elem, i, match ) {
      return !!Sizzle( match[3], elem ).length;
    },

    header: function( elem ) {
      return (/h\d/i).test( elem.nodeName );
    },

    text: function( elem ) {
      var attr = elem.getAttribute( "type" ), type = elem.type;
      // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
      // use getAttribute instead to test this case
      return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
    },

    radio: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
    },

    checkbox: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
    },

    file: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
    },

    password: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
    },

    submit: function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return (name === "input" || name === "button") && "submit" === elem.type;
    },

    image: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
    },

    reset: function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return (name === "input" || name === "button") && "reset" === elem.type;
    },

    button: function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && "button" === elem.type || name === "button";
    },

    input: function( elem ) {
      return (/input|select|textarea|button/i).test( elem.nodeName );
    },

    focus: function( elem ) {
      return elem === elem.ownerDocument.activeElement;
    }
  },
  setFilters: {
    first: function( elem, i ) {
      return i === 0;
    },

    last: function( elem, i, match, array ) {
      return i === array.length - 1;
    },

    even: function( elem, i ) {
      return i % 2 === 0;
    },

    odd: function( elem, i ) {
      return i % 2 === 1;
    },

    lt: function( elem, i, match ) {
      return i < match[3] - 0;
    },

    gt: function( elem, i, match ) {
      return i > match[3] - 0;
    },

    nth: function( elem, i, match ) {
      return match[3] - 0 === i;
    },

    eq: function( elem, i, match ) {
      return match[3] - 0 === i;
    }
  },
  filter: {
    PSEUDO: function( elem, match, i, array ) {
      var name = match[1],
        filter = Expr.filters[ name ];

      if ( filter ) {
        return filter( elem, i, match, array );

      } else if ( name === "contains" ) {
        return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

      } else if ( name === "not" ) {
        var not = match[3];

        for ( var j = 0, l = not.length; j < l; j++ ) {
          if ( not[j] === elem ) {
            return false;
          }
        }

        return true;

      } else {
        Sizzle.error( name );
      }
    },

    CHILD: function( elem, match ) {
      var first, last,
        doneName, parent, cache,
        count, diff,
        type = match[1],
        node = elem;

      switch ( type ) {
        case "only":
        case "first":
          while ( (node = node.previousSibling) ) {
            if ( node.nodeType === 1 ) {
              return false;
            }
          }

          if ( type === "first" ) {
            return true;
          }

          node = elem;

          /* falls through */
        case "last":
          while ( (node = node.nextSibling) ) {
            if ( node.nodeType === 1 ) {
              return false;
            }
          }

          return true;

        case "nth":
          first = match[2];
          last = match[3];

          if ( first === 1 && last === 0 ) {
            return true;
          }

          doneName = match[0];
          parent = elem.parentNode;

          if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
            count = 0;

            for ( node = parent.firstChild; node; node = node.nextSibling ) {
              if ( node.nodeType === 1 ) {
                node.nodeIndex = ++count;
              }
            }

            parent[ expando ] = doneName;
          }

          diff = elem.nodeIndex - last;

          if ( first === 0 ) {
            return diff === 0;

          } else {
            return ( diff % first === 0 && diff / first >= 0 );
          }
      }
    },

    ID: function( elem, match ) {
      return elem.nodeType === 1 && elem.getAttribute("id") === match;
    },

    TAG: function( elem, match ) {
      return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
    },

    CLASS: function( elem, match ) {
      return (" " + (elem.className || elem.getAttribute("class")) + " ")
        .indexOf( match ) > -1;
    },

    ATTR: function( elem, match ) {
      var name = match[1],
        result = Sizzle.attr ?
          Sizzle.attr( elem, name ) :
          Expr.attrHandle[ name ] ?
          Expr.attrHandle[ name ]( elem ) :
          elem[ name ] != null ?
            elem[ name ] :
            elem.getAttribute( name ),
        value = result + "",
        type = match[2],
        check = match[4];

      return result == null ?
        type === "!=" :
        !type && Sizzle.attr ?
        result != null :
        type === "=" ?
        value === check :
        type === "*=" ?
        value.indexOf(check) >= 0 :
        type === "~=" ?
        (" " + value + " ").indexOf(check) >= 0 :
        !check ?
        value && result !== false :
        type === "!=" ?
        value !== check :
        type === "^=" ?
        value.indexOf(check) === 0 :
        type === "$=" ?
        value.substr(value.length - check.length) === check :
        type === "|=" ?
        value === check || value.substr(0, check.length + 1) === check + "-" :
        false;
    },

    POS: function( elem, match, i, array ) {
      var name = match[2],
        filter = Expr.setFilters[ name ];

      if ( filter ) {
        return filter( elem, i, match, array );
      }
    }
  }
};

var origPOS = Expr.match.POS,
  fescape = function(all, num){
    return "\\" + (num - 0 + 1);
  };

for ( var type in Expr.match ) {
  Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
  Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
  array = Array.prototype.slice.call( array, 0 );

  if ( results ) {
    results.push.apply( results, array );
    return results;
  }

  return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
  Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
  makeArray = function( array, results ) {
    var i = 0,
      ret = results || [];

    if ( toString.call(array) === "[object Array]" ) {
      Array.prototype.push.apply( ret, array );

    } else {
      if ( typeof array.length === "number" ) {
        for ( var l = array.length; i < l; i++ ) {
          ret.push( array[i] );
        }

      } else {
        for ( ; array[i]; i++ ) {
          ret.push( array[i] );
        }
      }
    }

    return ret;
  };
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
  sortOrder = function( a, b ) {
    if ( a === b ) {
      hasDuplicate = true;
      return 0;
    }

    if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
      return a.compareDocumentPosition ? -1 : 1;
    }

    return a.compareDocumentPosition(b) & 4 ? -1 : 1;
  };

} else {
  sortOrder = function( a, b ) {
    // The nodes are identical, we can exit early
    if ( a === b ) {
      hasDuplicate = true;
      return 0;

    // Fallback to using sourceIndex (in IE) if it's available on both nodes
    } else if ( a.sourceIndex && b.sourceIndex ) {
      return a.sourceIndex - b.sourceIndex;
    }

    var al, bl,
      ap = [],
      bp = [],
      aup = a.parentNode,
      bup = b.parentNode,
      cur = aup;

    // If the nodes are siblings (or identical) we can do a quick check
    if ( aup === bup ) {
      return siblingCheck( a, b );

    // If no parents were found then the nodes are disconnected
    } else if ( !aup ) {
      return -1;

    } else if ( !bup ) {
      return 1;
    }

    // Otherwise they're somewhere else in the tree so we need
    // to build up a full list of the parentNodes for comparison
    while ( cur ) {
      ap.unshift( cur );
      cur = cur.parentNode;
    }

    cur = bup;

    while ( cur ) {
      bp.unshift( cur );
      cur = cur.parentNode;
    }

    al = ap.length;
    bl = bp.length;

    // Start walking down the tree looking for a discrepancy
    for ( var i = 0; i < al && i < bl; i++ ) {
      if ( ap[i] !== bp[i] ) {
        return siblingCheck( ap[i], bp[i] );
      }
    }

    // We ended someplace up the tree so do a sibling check
    return i === al ?
      siblingCheck( a, bp[i], -1 ) :
      siblingCheck( ap[i], b, 1 );
  };

  siblingCheck = function( a, b, ret ) {
    if ( a === b ) {
      return ret;
    }

    var cur = a.nextSibling;

    while ( cur ) {
      if ( cur === b ) {
        return -1;
      }

      cur = cur.nextSibling;
    }

    return 1;
  };
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
  // We're going to inject a fake input element with a specified name
  var form = document.createElement("div"),
    id = "script" + (new Date()).getTime(),
    root = document.documentElement;

  form.innerHTML = "<a name='" + id + "'/>";

  // Inject it into the root element, check its status, and remove it quickly
  root.insertBefore( form, root.firstChild );

  // The workaround has to do additional checks after a getElementById
  // Which slows things down for other browsers (hence the branching)
  if ( document.getElementById( id ) ) {
    Expr.find.ID = function( match, context, isXML ) {
      if ( typeof context.getElementById !== "undefined" && !isXML ) {
        var m = context.getElementById(match[1]);

        return m ?
          m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
            [m] :
            undefined :
          [];
      }
    };

    Expr.filter.ID = function( elem, match ) {
      var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

      return elem.nodeType === 1 && node && node.nodeValue === match;
    };
  }

  root.removeChild( form );

  // release memory in IE
  root = form = null;
})();

(function(){
  // Check to see if the browser returns only elements
  // when doing getElementsByTagName("*")

  // Create a fake element
  var div = document.createElement("div");
  div.appendChild( document.createComment("") );

  // Make sure no comments are found
  if ( div.getElementsByTagName("*").length > 0 ) {
    Expr.find.TAG = function( match, context ) {
      var results = context.getElementsByTagName( match[1] );

      // Filter out possible comments
      if ( match[1] === "*" ) {
        var tmp = [];

        for ( var i = 0; results[i]; i++ ) {
          if ( results[i].nodeType === 1 ) {
            tmp.push( results[i] );
          }
        }

        results = tmp;
      }

      return results;
    };
  }

  // Check to see if an attribute returns normalized href attributes
  div.innerHTML = "<a href='#'></a>";

  if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
      div.firstChild.getAttribute("href") !== "#" ) {

    Expr.attrHandle.href = function( elem ) {
      return elem.getAttribute( "href", 2 );
    };
  }

  // release memory in IE
  div = null;
})();

if ( document.querySelectorAll ) {
  (function(){
    var oldSizzle = Sizzle,
      div = document.createElement("div"),
      id = "__sizzle__";

    div.innerHTML = "<p class='TEST'></p>";

    // Safari can't handle uppercase or unicode characters when
    // in quirks mode.
    if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
      return;
    }

    Sizzle = function( query, context, extra, seed ) {
      context = context || document;

      // Only use querySelectorAll on non-XML documents
      // (ID selectors don't work in non-HTML documents)
      if ( !seed && !Sizzle.isXML(context) ) {
        // See if we find a selector to speed up
        var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

        if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
          // Speed-up: Sizzle("TAG")
          if ( match[1] ) {
            return makeArray( context.getElementsByTagName( query ), extra );

          // Speed-up: Sizzle(".CLASS")
          } else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
            return makeArray( context.getElementsByClassName( match[2] ), extra );
          }
        }

        if ( context.nodeType === 9 ) {
          // Speed-up: Sizzle("body")
          // The body element only exists once, optimize finding it
          if ( query === "body" && context.body ) {
            return makeArray( [ context.body ], extra );

          // Speed-up: Sizzle("#ID")
          } else if ( match && match[3] ) {
            var elem = context.getElementById( match[3] );

            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            if ( elem && elem.parentNode ) {
              // Handle the case where IE and Opera return items
              // by name instead of ID
              if ( elem.id === match[3] ) {
                return makeArray( [ elem ], extra );
              }

            } else {
              return makeArray( [], extra );
            }
          }

          try {
            return makeArray( context.querySelectorAll(query), extra );
          } catch(qsaError) {}

        // qSA works strangely on Element-rooted queries
        // We can work around this by specifying an extra ID on the root
        // and working up from there (Thanks to Andrew Dupont for the technique)
        // IE 8 doesn't work on object elements
        } else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
          var oldContext = context,
            old = context.getAttribute( "id" ),
            nid = old || id,
            hasParent = context.parentNode,
            relativeHierarchySelector = /^\s*[+~]/.test( query );

          if ( !old ) {
            context.setAttribute( "id", nid );
          } else {
            nid = nid.replace( /'/g, "\\$&" );
          }
          if ( relativeHierarchySelector && hasParent ) {
            context = context.parentNode;
          }

          try {
            if ( !relativeHierarchySelector || hasParent ) {
              return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
            }

          } catch(pseudoError) {
          } finally {
            if ( !old ) {
              oldContext.removeAttribute( "id" );
            }
          }
        }
      }

      return oldSizzle(query, context, extra, seed);
    };

    for ( var prop in oldSizzle ) {
      Sizzle[ prop ] = oldSizzle[ prop ];
    }

    // release memory in IE
    div = null;
  })();
}

(function(){
  var html = document.documentElement,
    matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

  if ( matches ) {
    // Check to see if it's possible to do matchesSelector
    // on a disconnected node (IE 9 fails this)
    var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
      pseudoWorks = false;

    try {
      // This should fail with an exception
      // Gecko does not error, returns false instead
      matches.call( document.documentElement, "[test!='']:sizzle" );

    } catch( pseudoError ) {
      pseudoWorks = true;
    }

    Sizzle.matchesSelector = function( node, expr ) {
      // Make sure that attribute selectors are quoted
      expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

      if ( !Sizzle.isXML( node ) ) {
        try {
          if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
            var ret = matches.call( node, expr );

            // IE 9's matchesSelector returns false on disconnected nodes
            if ( ret || !disconnectedMatch ||
                // As well, disconnected nodes are said to be in a document
                // fragment in IE 9, so check for that
                node.document && node.document.nodeType !== 11 ) {
              return ret;
            }
          }
        } catch(e) {}
      }

      return Sizzle(expr, null, null, [node]).length > 0;
    };
  }
})();

(function(){
  var div = document.createElement("div");

  div.innerHTML = "<div class='test e'></div><div class='test'></div>";

  // Opera can't find a second classname (in 9.6)
  // Also, make sure that getElementsByClassName actually exists
  if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
    return;
  }

  // Safari caches class attributes, doesn't catch changes (in 3.2)
  div.lastChild.className = "e";

  if ( div.getElementsByClassName("e").length === 1 ) {
    return;
  }

  Expr.order.splice(1, 0, "CLASS");
  Expr.find.CLASS = function( match, context, isXML ) {
    if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
      return context.getElementsByClassName(match[1]);
    }
  };

  // release memory in IE
  div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
  for ( var i = 0, l = checkSet.length; i < l; i++ ) {
    var elem = checkSet[i];

    if ( elem ) {
      var match = false;

      elem = elem[dir];

      while ( elem ) {
        if ( elem[ expando ] === doneName ) {
          match = checkSet[elem.sizset];
          break;
        }

        if ( elem.nodeType === 1 && !isXML ){
          elem[ expando ] = doneName;
          elem.sizset = i;
        }

        if ( elem.nodeName.toLowerCase() === cur ) {
          match = elem;
          break;
        }

        elem = elem[dir];
      }

      checkSet[i] = match;
    }
  }
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
  for ( var i = 0, l = checkSet.length; i < l; i++ ) {
    var elem = checkSet[i];

    if ( elem ) {
      var match = false;

      elem = elem[dir];

      while ( elem ) {
        if ( elem[ expando ] === doneName ) {
          match = checkSet[elem.sizset];
          break;
        }

        if ( elem.nodeType === 1 ) {
          if ( !isXML ) {
            elem[ expando ] = doneName;
            elem.sizset = i;
          }

          if ( typeof cur !== "string" ) {
            if ( elem === cur ) {
              match = true;
              break;
            }

          } else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
            match = elem;
            break;
          }
        }

        elem = elem[dir];
      }

      checkSet[i] = match;
    }
  }
}

if ( document.documentElement.contains ) {
  Sizzle.contains = function( a, b ) {
    return a !== b && (a.contains ? a.contains(b) : true);
  };

} else if ( document.documentElement.compareDocumentPosition ) {
  Sizzle.contains = function( a, b ) {
    return !!(a.compareDocumentPosition(b) & 16);
  };

} else {
  Sizzle.contains = function() {
    return false;
  };
}

Sizzle.isXML = function( elem ) {
  // documentElement is verified for cases where it doesn't yet exist
  // (such as loading iframes in IE - #4833)
  var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

  return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
  var match,
    tmpSet = [],
    later = "",
    root = context.nodeType ? [context] : context;

  // Position selectors must be done after the filter
  // And so must :not(positional) so we move all PSEUDOs to the end
  while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
    later += match[0];
    selector = selector.replace( Expr.match.PSEUDO, "" );
  }

  selector = Expr.relative[selector] ? selector + "*" : selector;

  for ( var i = 0, l = root.length; i < l; i++ ) {
    Sizzle( selector, root[i], tmpSet, seed );
  }

  return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
  rparentsprev = /^(?:parents|prevUntil|prevAll)/,
  // Note: This RegExp should be improved, or likely pulled from Sizzle
  rmultiselector = /,/,
  isSimple = /^.[^:#\[\.,]*$/,
  slice = Array.prototype.slice,
  POS = jQuery.expr.match.globalPOS,
  // methods guaranteed to produce a unique set when starting from a unique set
  guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };

jQuery.fn.extend({
  find: function( selector ) {
    var self = this,
      i, l;

    if ( typeof selector !== "string" ) {
      return jQuery( selector ).filter(function() {
        for ( i = 0, l = self.length; i < l; i++ ) {
          if ( jQuery.contains( self[ i ], this ) ) {
            return true;
          }
        }
      });
    }

    var ret = this.pushStack( "", "find", selector ),
      length, n, r;

    for ( i = 0, l = this.length; i < l; i++ ) {
      length = ret.length;
      jQuery.find( selector, this[i], ret );

      if ( i > 0 ) {
        // Make sure that the results are unique
        for ( n = length; n < ret.length; n++ ) {
          for ( r = 0; r < length; r++ ) {
            if ( ret[r] === ret[n] ) {
              ret.splice(n--, 1);
              break;
            }
          }
        }
      }
    }

    return ret;
  },

  has: function( target ) {
    var targets = jQuery( target );
    return this.filter(function() {
      for ( var i = 0, l = targets.length; i < l; i++ ) {
        if ( jQuery.contains( this, targets[i] ) ) {
          return true;
        }
      }
    });
  },

  not: function( selector ) {
    return this.pushStack( winnow(this, selector, false), "not", selector);
  },

  filter: function( selector ) {
    return this.pushStack( winnow(this, selector, true), "filter", selector );
  },

  is: function( selector ) {
    return !!selector && (
      typeof selector === "string" ?
        // If this is a positional selector, check membership in the returned set
        // so $("p:first").is("p:last") won't return true for a doc with two "p".
        POS.test( selector ) ?
          jQuery( selector, this.context ).index( this[0] ) >= 0 :
          jQuery.filter( selector, this ).length > 0 :
        this.filter( selector ).length > 0 );
  },

  closest: function( selectors, context ) {
    var ret = [], i, l, cur = this[0];

    // Array (deprecated as of jQuery 1.7)
    if ( jQuery.isArray( selectors ) ) {
      var level = 1;

      while ( cur && cur.ownerDocument && cur !== context ) {
        for ( i = 0; i < selectors.length; i++ ) {

          if ( jQuery( cur ).is( selectors[ i ] ) ) {
            ret.push({ selector: selectors[ i ], elem: cur, level: level });
          }
        }

        cur = cur.parentNode;
        level++;
      }

      return ret;
    }

    // String
    var pos = POS.test( selectors ) || typeof selectors !== "string" ?
        jQuery( selectors, context || this.context ) :
        0;

    for ( i = 0, l = this.length; i < l; i++ ) {
      cur = this[i];

      while ( cur ) {
        if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
          ret.push( cur );
          break;

        } else {
          cur = cur.parentNode;
          if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
            break;
          }
        }
      }
    }

    ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

    return this.pushStack( ret, "closest", selectors );
  },

  // Determine the position of an element within
  // the matched set of elements
  index: function( elem ) {

    // No argument, return index in parent
    if ( !elem ) {
      return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
    }

    // index in selector
    if ( typeof elem === "string" ) {
      return jQuery.inArray( this[0], jQuery( elem ) );
    }

    // Locate the position of the desired element
    return jQuery.inArray(
      // If it receives a jQuery object, the first element is used
      elem.jquery ? elem[0] : elem, this );
  },

  add: function( selector, context ) {
    var set = typeof selector === "string" ?
        jQuery( selector, context ) :
        jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
      all = jQuery.merge( this.get(), set );

    return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
      all :
      jQuery.unique( all ) );
  },

  andSelf: function() {
    return this.add( this.prevObject );
  }
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
  return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
  parent: function( elem ) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },
  parents: function( elem ) {
    return jQuery.dir( elem, "parentNode" );
  },
  parentsUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "parentNode", until );
  },
  next: function( elem ) {
    return jQuery.nth( elem, 2, "nextSibling" );
  },
  prev: function( elem ) {
    return jQuery.nth( elem, 2, "previousSibling" );
  },
  nextAll: function( elem ) {
    return jQuery.dir( elem, "nextSibling" );
  },
  prevAll: function( elem ) {
    return jQuery.dir( elem, "previousSibling" );
  },
  nextUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "nextSibling", until );
  },
  prevUntil: function( elem, i, until ) {
    return jQuery.dir( elem, "previousSibling", until );
  },
  siblings: function( elem ) {
    return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
  },
  children: function( elem ) {
    return jQuery.sibling( elem.firstChild );
  },
  contents: function( elem ) {
    return jQuery.nodeName( elem, "iframe" ) ?
      elem.contentDocument || elem.contentWindow.document :
      jQuery.makeArray( elem.childNodes );
  }
}, function( name, fn ) {
  jQuery.fn[ name ] = function( until, selector ) {
    var ret = jQuery.map( this, fn, until );

    if ( !runtil.test( name ) ) {
      selector = until;
    }

    if ( selector && typeof selector === "string" ) {
      ret = jQuery.filter( selector, ret );
    }

    ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

    if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
      ret = ret.reverse();
    }

    return this.pushStack( ret, name, slice.call( arguments ).join(",") );
  };
});

jQuery.extend({
  filter: function( expr, elems, not ) {
    if ( not ) {
      expr = ":not(" + expr + ")";
    }

    return elems.length === 1 ?
      jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
      jQuery.find.matches(expr, elems);
  },

  dir: function( elem, dir, until ) {
    var matched = [],
      cur = elem[ dir ];

    while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
      if ( cur.nodeType === 1 ) {
        matched.push( cur );
      }
      cur = cur[dir];
    }
    return matched;
  },

  nth: function( cur, result, dir, elem ) {
    result = result || 1;
    var num = 0;

    for ( ; cur; cur = cur[dir] ) {
      if ( cur.nodeType === 1 && ++num === result ) {
        break;
      }
    }

    return cur;
  },

  sibling: function( n, elem ) {
    var r = [];

    for ( ; n; n = n.nextSibling ) {
      if ( n.nodeType === 1 && n !== elem ) {
        r.push( n );
      }
    }

    return r;
  }
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

  // Can't pass null or undefined to indexOf in Firefox 4
  // Set to 0 to skip string check
  qualifier = qualifier || 0;

  if ( jQuery.isFunction( qualifier ) ) {
    return jQuery.grep(elements, function( elem, i ) {
      var retVal = !!qualifier.call( elem, i, elem );
      return retVal === keep;
    });

  } else if ( qualifier.nodeType ) {
    return jQuery.grep(elements, function( elem, i ) {
      return ( elem === qualifier ) === keep;
    });

  } else if ( typeof qualifier === "string" ) {
    var filtered = jQuery.grep(elements, function( elem ) {
      return elem.nodeType === 1;
    });

    if ( isSimple.test( qualifier ) ) {
      return jQuery.filter(qualifier, filtered, !keep);
    } else {
      qualifier = jQuery.filter( qualifier, filtered );
    }
  }

  return jQuery.grep(elements, function( elem, i ) {
    return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
  });
}




function createSafeFragment( document ) {
  var list = nodeNames.split( "|" ),
  safeFrag = document.createDocumentFragment();

  if ( safeFrag.createElement ) {
    while ( list.length ) {
      safeFrag.createElement(
        list.pop()
      );
    }
  }
  return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
    "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
  rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
  rleadingWhitespace = /^\s+/,
  rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
  rtagName = /<([\w:]+)/,
  rtbody = /<tbody/i,
  rhtml = /<|&#?\w+;/,
  rnoInnerhtml = /<(?:script|style)/i,
  rnocache = /<(?:script|object|embed|option|style)/i,
  rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
  // checked="checked" or checked
  rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
  rscriptType = /\/(java|ecma)script/i,
  rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
  wrapMap = {
    option: [ 1, "<select multiple='multiple'>", "</select>" ],
    legend: [ 1, "<fieldset>", "</fieldset>" ],
    thead: [ 1, "<table>", "</table>" ],
    tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
    col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
    area: [ 1, "<map>", "</map>" ],
    _default: [ 0, "", "" ]
  },
  safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
  wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
  text: function( value ) {
    return jQuery.access( this, function( value ) {
      return value === undefined ?
        jQuery.text( this ) :
        this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
    }, null, value, arguments.length );
  },

  wrapAll: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapAll( html.call(this, i) );
      });
    }

    if ( this[0] ) {
      // The elements to wrap the target around
      var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

      if ( this[0].parentNode ) {
        wrap.insertBefore( this[0] );
      }

      wrap.map(function() {
        var elem = this;

        while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
          elem = elem.firstChild;
        }

        return elem;
      }).append( this );
    }

    return this;
  },

  wrapInner: function( html ) {
    if ( jQuery.isFunction( html ) ) {
      return this.each(function(i) {
        jQuery(this).wrapInner( html.call(this, i) );
      });
    }

    return this.each(function() {
      var self = jQuery( this ),
        contents = self.contents();

      if ( contents.length ) {
        contents.wrapAll( html );

      } else {
        self.append( html );
      }
    });
  },

  wrap: function( html ) {
    var isFunction = jQuery.isFunction( html );

    return this.each(function(i) {
      jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
    });
  },

  unwrap: function() {
    return this.parent().each(function() {
      if ( !jQuery.nodeName( this, "body" ) ) {
        jQuery( this ).replaceWith( this.childNodes );
      }
    }).end();
  },

  append: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 ) {
        this.appendChild( elem );
      }
    });
  },

  prepend: function() {
    return this.domManip(arguments, true, function( elem ) {
      if ( this.nodeType === 1 ) {
        this.insertBefore( elem, this.firstChild );
      }
    });
  },

  before: function() {
    if ( this[0] && this[0].parentNode ) {
      return this.domManip(arguments, false, function( elem ) {
        this.parentNode.insertBefore( elem, this );
      });
    } else if ( arguments.length ) {
      var set = jQuery.clean( arguments );
      set.push.apply( set, this.toArray() );
      return this.pushStack( set, "before", arguments );
    }
  },

  after: function() {
    if ( this[0] && this[0].parentNode ) {
      return this.domManip(arguments, false, function( elem ) {
        this.parentNode.insertBefore( elem, this.nextSibling );
      });
    } else if ( arguments.length ) {
      var set = this.pushStack( this, "after", arguments );
      set.push.apply( set, jQuery.clean(arguments) );
      return set;
    }
  },

  // keepData is for internal use only--do not document
  remove: function( selector, keepData ) {
    for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
      if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
        if ( !keepData && elem.nodeType === 1 ) {
          jQuery.cleanData( elem.getElementsByTagName("*") );
          jQuery.cleanData( [ elem ] );
        }

        if ( elem.parentNode ) {
          elem.parentNode.removeChild( elem );
        }
      }
    }

    return this;
  },

  empty: function() {
    for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
      // Remove element nodes and prevent memory leaks
      if ( elem.nodeType === 1 ) {
        jQuery.cleanData( elem.getElementsByTagName("*") );
      }

      // Remove any remaining nodes
      while ( elem.firstChild ) {
        elem.removeChild( elem.firstChild );
      }
    }

    return this;
  },

  clone: function( dataAndEvents, deepDataAndEvents ) {
    dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    return this.map( function () {
      return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    });
  },

  html: function( value ) {
    return jQuery.access( this, function( value ) {
      var elem = this[0] || {},
        i = 0,
        l = this.length;

      if ( value === undefined ) {
        return elem.nodeType === 1 ?
          elem.innerHTML.replace( rinlinejQuery, "" ) :
          null;
      }


      if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
        ( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
        !wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

        value = value.replace( rxhtmlTag, "<$1></$2>" );

        try {
          for (; i < l; i++ ) {
            // Remove element nodes and prevent memory leaks
            elem = this[i] || {};
            if ( elem.nodeType === 1 ) {
              jQuery.cleanData( elem.getElementsByTagName( "*" ) );
              elem.innerHTML = value;
            }
          }

          elem = 0;

        // If using innerHTML throws an exception, use the fallback method
        } catch(e) {}
      }

      if ( elem ) {
        this.empty().append( value );
      }
    }, null, value, arguments.length );
  },

  replaceWith: function( value ) {
    if ( this[0] && this[0].parentNode ) {
      // Make sure that the elements are removed from the DOM before they are inserted
      // this can help fix replacing a parent with child elements
      if ( jQuery.isFunction( value ) ) {
        return this.each(function(i) {
          var self = jQuery(this), old = self.html();
          self.replaceWith( value.call( this, i, old ) );
        });
      }

      if ( typeof value !== "string" ) {
        value = jQuery( value ).detach();
      }

      return this.each(function() {
        var next = this.nextSibling,
          parent = this.parentNode;

        jQuery( this ).remove();

        if ( next ) {
          jQuery(next).before( value );
        } else {
          jQuery(parent).append( value );
        }
      });
    } else {
      return this.length ?
        this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
        this;
    }
  },

  detach: function( selector ) {
    return this.remove( selector, true );
  },

  domManip: function( args, table, callback ) {
    var results, first, fragment, parent,
      value = args[0],
      scripts = [];

    // We can't cloneNode fragments that contain checked, in WebKit
    if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
      return this.each(function() {
        jQuery(this).domManip( args, table, callback, true );
      });
    }

    if ( jQuery.isFunction(value) ) {
      return this.each(function(i) {
        var self = jQuery(this);
        args[0] = value.call(this, i, table ? self.html() : undefined);
        self.domManip( args, table, callback );
      });
    }

    if ( this[0] ) {
      parent = value && value.parentNode;

      // If we're in a fragment, just use that instead of building a new one
      if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
        results = { fragment: parent };

      } else {
        results = jQuery.buildFragment( args, this, scripts );
      }

      fragment = results.fragment;

      if ( fragment.childNodes.length === 1 ) {
        first = fragment = fragment.firstChild;
      } else {
        first = fragment.firstChild;
      }

      if ( first ) {
        table = table && jQuery.nodeName( first, "tr" );

        for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
          callback.call(
            table ?
              root(this[i], first) :
              this[i],
            // Make sure that we do not leak memory by inadvertently discarding
            // the original fragment (which might have attached data) instead of
            // using it; in addition, use the original fragment object for the last
            // item instead of first because it can end up being emptied incorrectly
            // in certain situations (Bug #8070).
            // Fragments from the fragment cache must always be cloned and never used
            // in place.
            results.cacheable || ( l > 1 && i < lastIndex ) ?
              jQuery.clone( fragment, true, true ) :
              fragment
          );
        }
      }

      if ( scripts.length ) {
        jQuery.each( scripts, function( i, elem ) {
          if ( elem.src ) {
            jQuery.ajax({
              type: "GET",
              global: false,
              url: elem.src,
              async: false,
              dataType: "script"
            });
          } else {
            jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
          }

          if ( elem.parentNode ) {
            elem.parentNode.removeChild( elem );
          }
        });
      }
    }

    return this;
  }
});

function root( elem, cur ) {
  return jQuery.nodeName(elem, "table") ?
    (elem.getElementsByTagName("tbody")[0] ||
    elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
    elem;
}

function cloneCopyEvent( src, dest ) {

  if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
    return;
  }

  var type, i, l,
    oldData = jQuery._data( src ),
    curData = jQuery._data( dest, oldData ),
    events = oldData.events;

  if ( events ) {
    delete curData.handle;
    curData.events = {};

    for ( type in events ) {
      for ( i = 0, l = events[ type ].length; i < l; i++ ) {
        jQuery.event.add( dest, type, events[ type ][ i ] );
      }
    }
  }

  // make the cloned public data object a copy from the original
  if ( curData.data ) {
    curData.data = jQuery.extend( {}, curData.data );
  }
}

function cloneFixAttributes( src, dest ) {
  var nodeName;

  // We do not need to do anything for non-Elements
  if ( dest.nodeType !== 1 ) {
    return;
  }

  // clearAttributes removes the attributes, which we don't want,
  // but also removes the attachEvent events, which we *do* want
  if ( dest.clearAttributes ) {
    dest.clearAttributes();
  }

  // mergeAttributes, in contrast, only merges back on the
  // original attributes, not the events
  if ( dest.mergeAttributes ) {
    dest.mergeAttributes( src );
  }

  nodeName = dest.nodeName.toLowerCase();

  // IE6-8 fail to clone children inside object elements that use
  // the proprietary classid attribute value (rather than the type
  // attribute) to identify the type of content to display
  if ( nodeName === "object" ) {
    dest.outerHTML = src.outerHTML;

  } else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
    // IE6-8 fails to persist the checked state of a cloned checkbox
    // or radio button. Worse, IE6-7 fail to give the cloned element
    // a checked appearance if the defaultChecked value isn't also set
    if ( src.checked ) {
      dest.defaultChecked = dest.checked = src.checked;
    }

    // IE6-7 get confused and end up setting the value of a cloned
    // checkbox/radio button to an empty string instead of "on"
    if ( dest.value !== src.value ) {
      dest.value = src.value;
    }

  // IE6-8 fails to return the selected option to the default selected
  // state when cloning options
  } else if ( nodeName === "option" ) {
    dest.selected = src.defaultSelected;

  // IE6-8 fails to set the defaultValue to the correct value when
  // cloning other types of input fields
  } else if ( nodeName === "input" || nodeName === "textarea" ) {
    dest.defaultValue = src.defaultValue;

  // IE blanks contents when cloning scripts
  } else if ( nodeName === "script" && dest.text !== src.text ) {
    dest.text = src.text;
  }

  // Event data gets referenced instead of copied if the expando
  // gets copied too
  dest.removeAttribute( jQuery.expando );

  // Clear flags for bubbling special change/submit events, they must
  // be reattached when the newly cloned events are first activated
  dest.removeAttribute( "_submit_attached" );
  dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
  var fragment, cacheable, cacheresults, doc,
  first = args[ 0 ];

  // nodes may contain either an explicit document object,
  // a jQuery collection or context object.
  // If nodes[0] contains a valid object to assign to doc
  if ( nodes && nodes[0] ) {
    doc = nodes[0].ownerDocument || nodes[0];
  }

  // Ensure that an attr object doesn't incorrectly stand in as a document object
  // Chrome and Firefox seem to allow this to occur and will throw exception
  // Fixes #8950
  if ( !doc.createDocumentFragment ) {
    doc = document;
  }

  // Only cache "small" (1/2 KB) HTML strings that are associated with the main document
  // Cloning options loses the selected state, so don't cache them
  // IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
  // Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
  // Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
  if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
    first.charAt(0) === "<" && !rnocache.test( first ) &&
    (jQuery.support.checkClone || !rchecked.test( first )) &&
    (jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

    cacheable = true;

    cacheresults = jQuery.fragments[ first ];
    if ( cacheresults && cacheresults !== 1 ) {
      fragment = cacheresults;
    }
  }

  if ( !fragment ) {
    fragment = doc.createDocumentFragment();
    jQuery.clean( args, doc, fragment, scripts );
  }

  if ( cacheable ) {
    jQuery.fragments[ first ] = cacheresults ? fragment : 1;
  }

  return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
  appendTo: "append",
  prependTo: "prepend",
  insertBefore: "before",
  insertAfter: "after",
  replaceAll: "replaceWith"
}, function( name, original ) {
  jQuery.fn[ name ] = function( selector ) {
    var ret = [],
      insert = jQuery( selector ),
      parent = this.length === 1 && this[0].parentNode;

    if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
      insert[ original ]( this[0] );
      return this;

    } else {
      for ( var i = 0, l = insert.length; i < l; i++ ) {
        var elems = ( i > 0 ? this.clone(true) : this ).get();
        jQuery( insert[i] )[ original ]( elems );
        ret = ret.concat( elems );
      }

      return this.pushStack( ret, name, insert.selector );
    }
  };
});

function getAll( elem ) {
  if ( typeof elem.getElementsByTagName !== "undefined" ) {
    return elem.getElementsByTagName( "*" );

  } else if ( typeof elem.querySelectorAll !== "undefined" ) {
    return elem.querySelectorAll( "*" );

  } else {
    return [];
  }
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
  if ( elem.type === "checkbox" || elem.type === "radio" ) {
    elem.defaultChecked = elem.checked;
  }
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
  var nodeName = ( elem.nodeName || "" ).toLowerCase();
  if ( nodeName === "input" ) {
    fixDefaultChecked( elem );
  // Skip scripts, get other children
  } else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
    jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
  }
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
  var div = document.createElement( "div" );
  safeFragment.appendChild( div );

  div.innerHTML = elem.outerHTML;
  return div.firstChild;
}

jQuery.extend({
  clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    var srcElements,
      destElements,
      i,
      // IE<=8 does not properly clone detached, unknown element nodes
      clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
        elem.cloneNode( true ) :
        shimCloneNode( elem );

    if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
        (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
      // IE copies events bound via attachEvent when using cloneNode.
      // Calling detachEvent on the clone will also remove the events
      // from the original. In order to get around this, we use some
      // proprietary methods to clear the events. Thanks to MooTools
      // guys for this hotness.

      cloneFixAttributes( elem, clone );

      // Using Sizzle here is crazy slow, so we use getElementsByTagName instead
      srcElements = getAll( elem );
      destElements = getAll( clone );

      // Weird iteration because IE will replace the length property
      // with an element if you are cloning the body and one of the
      // elements on the page has a name or id of "length"
      for ( i = 0; srcElements[i]; ++i ) {
        // Ensure that the destination node is not null; Fixes #9587
        if ( destElements[i] ) {
          cloneFixAttributes( srcElements[i], destElements[i] );
        }
      }
    }

    // Copy the events from the original to the clone
    if ( dataAndEvents ) {
      cloneCopyEvent( elem, clone );

      if ( deepDataAndEvents ) {
        srcElements = getAll( elem );
        destElements = getAll( clone );

        for ( i = 0; srcElements[i]; ++i ) {
          cloneCopyEvent( srcElements[i], destElements[i] );
        }
      }
    }

    srcElements = destElements = null;

    // Return the cloned set
    return clone;
  },

  clean: function( elems, context, fragment, scripts ) {
    var checkScriptType, script, j,
        ret = [];

    context = context || document;

    // !context.createElement fails in IE with an error but returns typeof 'object'
    if ( typeof context.createElement === "undefined" ) {
      context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
    }

    for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
      if ( typeof elem === "number" ) {
        elem += "";
      }

      if ( !elem ) {
        continue;
      }

      // Convert html string into DOM nodes
      if ( typeof elem === "string" ) {
        if ( !rhtml.test( elem ) ) {
          elem = context.createTextNode( elem );
        } else {
          // Fix "XHTML"-style tags in all browsers
          elem = elem.replace(rxhtmlTag, "<$1></$2>");

          // Trim whitespace, otherwise indexOf won't work as expected
          var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
            wrap = wrapMap[ tag ] || wrapMap._default,
            depth = wrap[0],
            div = context.createElement("div"),
            safeChildNodes = safeFragment.childNodes,
            remove;

          // Append wrapper element to unknown element safe doc fragment
          if ( context === document ) {
            // Use the fragment we've already created for this document
            safeFragment.appendChild( div );
          } else {
            // Use a fragment created with the owner document
            createSafeFragment( context ).appendChild( div );
          }

          // Go to html and back, then peel off extra wrappers
          div.innerHTML = wrap[1] + elem + wrap[2];

          // Move to the right depth
          while ( depth-- ) {
            div = div.lastChild;
          }

          // Remove IE's autoinserted <tbody> from table fragments
          if ( !jQuery.support.tbody ) {

            // String was a <table>, *may* have spurious <tbody>
            var hasBody = rtbody.test(elem),
              tbody = tag === "table" && !hasBody ?
                div.firstChild && div.firstChild.childNodes :

                // String was a bare <thead> or <tfoot>
                wrap[1] === "<table>" && !hasBody ?
                  div.childNodes :
                  [];

            for ( j = tbody.length - 1; j >= 0 ; --j ) {
              if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
                tbody[ j ].parentNode.removeChild( tbody[ j ] );
              }
            }
          }

          // IE completely kills leading whitespace when innerHTML is used
          if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
            div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
          }

          elem = div.childNodes;

          // Clear elements from DocumentFragment (safeFragment or otherwise)
          // to avoid hoarding elements. Fixes #11356
          if ( div ) {
            div.parentNode.removeChild( div );

            // Guard against -1 index exceptions in FF3.6
            if ( safeChildNodes.length > 0 ) {
              remove = safeChildNodes[ safeChildNodes.length - 1 ];

              if ( remove && remove.parentNode ) {
                remove.parentNode.removeChild( remove );
              }
            }
          }
        }
      }

      // Resets defaultChecked for any radios and checkboxes
      // about to be appended to the DOM in IE 6/7 (#8060)
      var len;
      if ( !jQuery.support.appendChecked ) {
        if ( elem[0] && typeof (len = elem.length) === "number" ) {
          for ( j = 0; j < len; j++ ) {
            findInputs( elem[j] );
          }
        } else {
          findInputs( elem );
        }
      }

      if ( elem.nodeType ) {
        ret.push( elem );
      } else {
        ret = jQuery.merge( ret, elem );
      }
    }

    if ( fragment ) {
      checkScriptType = function( elem ) {
        return !elem.type || rscriptType.test( elem.type );
      };
      for ( i = 0; ret[i]; i++ ) {
        script = ret[i];
        if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
          scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

        } else {
          if ( script.nodeType === 1 ) {
            var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

            ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
          }
          fragment.appendChild( script );
        }
      }
    }

    return ret;
  },

  cleanData: function( elems ) {
    var data, id,
      cache = jQuery.cache,
      special = jQuery.event.special,
      deleteExpando = jQuery.support.deleteExpando;

    for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
      if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
        continue;
      }

      id = elem[ jQuery.expando ];

      if ( id ) {
        data = cache[ id ];

        if ( data && data.events ) {
          for ( var type in data.events ) {
            if ( special[ type ] ) {
              jQuery.event.remove( elem, type );

            // This is a shortcut to avoid jQuery.event.remove's overhead
            } else {
              jQuery.removeEvent( elem, type, data.handle );
            }
          }

          // Null the DOM reference to avoid IE6/7/8 leak (#7054)
          if ( data.handle ) {
            data.handle.elem = null;
          }
        }

        if ( deleteExpando ) {
          delete elem[ jQuery.expando ];

        } else if ( elem.removeAttribute ) {
          elem.removeAttribute( jQuery.expando );
        }

        delete cache[ id ];
      }
    }
  }
});




var ralpha = /alpha\([^)]*\)/i,
  ropacity = /opacity=([^)]*)/,
  // fixed for IE9, see #8346
  rupper = /([A-Z]|^ms)/g,
  rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
  rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
  rrelNum = /^([\-+])=([\-+.\de]+)/,
  rmargin = /^margin/,

  cssShow = { position: "absolute", visibility: "hidden", display: "block" },

  // order is important!
  cssExpand = [ "Top", "Right", "Bottom", "Left" ],

  curCSS,

  getComputedStyle,
  currentStyle;

jQuery.fn.css = function( name, value ) {
  return jQuery.access( this, function( elem, name, value ) {
    return value !== undefined ?
      jQuery.style( elem, name, value ) :
      jQuery.css( elem, name );
  }, name, value, arguments.length > 1 );
};

jQuery.extend({
  // Add in style property hooks for overriding the default
  // behavior of getting and setting a style property
  cssHooks: {
    opacity: {
      get: function( elem, computed ) {
        if ( computed ) {
          // We should always get a number back from opacity
          var ret = curCSS( elem, "opacity" );
          return ret === "" ? "1" : ret;

        } else {
          return elem.style.opacity;
        }
      }
    }
  },

  // Exclude the following css properties to add px
  cssNumber: {
    "fillOpacity": true,
    "fontWeight": true,
    "lineHeight": true,
    "opacity": true,
    "orphans": true,
    "widows": true,
    "zIndex": true,
    "zoom": true
  },

  // Add in properties whose names you wish to fix before
  // setting or getting the value
  cssProps: {
    // normalize float css property
    "float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
  },

  // Get and set the style property on a DOM Node
  style: function( elem, name, value, extra ) {
    // Don't set styles on text and comment nodes
    if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
      return;
    }

    // Make sure that we're working with the right name
    var ret, type, origName = jQuery.camelCase( name ),
      style = elem.style, hooks = jQuery.cssHooks[ origName ];

    name = jQuery.cssProps[ origName ] || origName;

    // Check if we're setting a value
    if ( value !== undefined ) {
      type = typeof value;

      // convert relative number strings (+= or -=) to relative numbers. #7345
      if ( type === "string" && (ret = rrelNum.exec( value )) ) {
        value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
        // Fixes bug #9237
        type = "number";
      }

      // Make sure that NaN and null values aren't set. See: #7116
      if ( value == null || type === "number" && isNaN( value ) ) {
        return;
      }

      // If a number was passed in, add 'px' to the (except for certain CSS properties)
      if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
        value += "px";
      }

      // If a hook was provided, use that value, otherwise just set the specified value
      if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
        // Wrapped to prevent IE from throwing errors when 'invalid' values are provided
        // Fixes bug #5509
        try {
          style[ name ] = value;
        } catch(e) {}
      }

    } else {
      // If a hook was provided get the non-computed value from there
      if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
        return ret;
      }

      // Otherwise just get the value from the style object
      return style[ name ];
    }
  },

  css: function( elem, name, extra ) {
    var ret, hooks;

    // Make sure that we're working with the right name
    name = jQuery.camelCase( name );
    hooks = jQuery.cssHooks[ name ];
    name = jQuery.cssProps[ name ] || name;

    // cssFloat needs a special treatment
    if ( name === "cssFloat" ) {
      name = "float";
    }

    // If a hook was provided get the computed value from there
    if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
      return ret;

    // Otherwise, if a way to get the computed value exists, use that
    } else if ( curCSS ) {
      return curCSS( elem, name );
    }
  },

  // A method for quickly swapping in/out CSS properties to get correct calculations
  swap: function( elem, options, callback ) {
    var old = {},
      ret, name;

    // Remember the old values, and insert the new ones
    for ( name in options ) {
      old[ name ] = elem.style[ name ];
      elem.style[ name ] = options[ name ];
    }

    ret = callback.call( elem );

    // Revert the old values
    for ( name in options ) {
      elem.style[ name ] = old[ name ];
    }

    return ret;
  }
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
  getComputedStyle = function( elem, name ) {
    var ret, defaultView, computedStyle, width,
      style = elem.style;

    name = name.replace( rupper, "-$1" ).toLowerCase();

    if ( (defaultView = elem.ownerDocument.defaultView) &&
        (computedStyle = defaultView.getComputedStyle( elem, null )) ) {

      ret = computedStyle.getPropertyValue( name );
      if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
        ret = jQuery.style( elem, name );
      }
    }

    // A tribute to the "awesome hack by Dean Edwards"
    // WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
    // which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
    if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
      width = style.width;
      style.width = ret;
      ret = computedStyle.width;
      style.width = width;
    }

    return ret;
  };
}

if ( document.documentElement.currentStyle ) {
  currentStyle = function( elem, name ) {
    var left, rsLeft, uncomputed,
      ret = elem.currentStyle && elem.currentStyle[ name ],
      style = elem.style;

    // Avoid setting ret to empty string here
    // so we don't default to auto
    if ( ret == null && style && (uncomputed = style[ name ]) ) {
      ret = uncomputed;
    }

    // From the awesome hack by Dean Edwards
    // http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

    // If we're not dealing with a regular pixel number
    // but a number that has a weird ending, we need to convert it to pixels
    if ( rnumnonpx.test( ret ) ) {

      // Remember the original values
      left = style.left;
      rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

      // Put in the new values to get a computed value out
      if ( rsLeft ) {
        elem.runtimeStyle.left = elem.currentStyle.left;
      }
      style.left = name === "fontSize" ? "1em" : ret;
      ret = style.pixelLeft + "px";

      // Revert the changed values
      style.left = left;
      if ( rsLeft ) {
        elem.runtimeStyle.left = rsLeft;
      }
    }

    return ret === "" ? "auto" : ret;
  };
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

  // Start with offset property
  var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
    i = name === "width" ? 1 : 0,
    len = 4;

  if ( val > 0 ) {
    if ( extra !== "border" ) {
      for ( ; i < len; i += 2 ) {
        if ( !extra ) {
          val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
        }
        if ( extra === "margin" ) {
          val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
        } else {
          val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
        }
      }
    }

    return val + "px";
  }

  // Fall back to computed then uncomputed css if necessary
  val = curCSS( elem, name );
  if ( val < 0 || val == null ) {
    val = elem.style[ name ];
  }

  // Computed unit is not pixels. Stop here and return.
  if ( rnumnonpx.test(val) ) {
    return val;
  }

  // Normalize "", auto, and prepare for extra
  val = parseFloat( val ) || 0;

  // Add padding, border, margin
  if ( extra ) {
    for ( ; i < len; i += 2 ) {
      val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
      if ( extra !== "padding" ) {
        val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
      }
      if ( extra === "margin" ) {
        val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
      }
    }
  }

  return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
  jQuery.cssHooks[ name ] = {
    get: function( elem, computed, extra ) {
      if ( computed ) {
        if ( elem.offsetWidth !== 0 ) {
          return getWidthOrHeight( elem, name, extra );
        } else {
          return jQuery.swap( elem, cssShow, function() {
            return getWidthOrHeight( elem, name, extra );
          });
        }
      }
    },

    set: function( elem, value ) {
      return rnum.test( value ) ?
        value + "px" :
        value;
    }
  };
});

if ( !jQuery.support.opacity ) {
  jQuery.cssHooks.opacity = {
    get: function( elem, computed ) {
      // IE uses filters for opacity
      return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
        ( parseFloat( RegExp.$1 ) / 100 ) + "" :
        computed ? "1" : "";
    },

    set: function( elem, value ) {
      var style = elem.style,
        currentStyle = elem.currentStyle,
        opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
        filter = currentStyle && currentStyle.filter || style.filter || "";

      // IE has trouble with opacity if it does not have layout
      // Force it by setting the zoom level
      style.zoom = 1;

      // if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
      if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

        // Setting style.filter to null, "" & " " still leave "filter:" in the cssText
        // if "filter:" is present at all, clearType is disabled, we want to avoid this
        // style.removeAttribute is IE Only, but so apparently is this code path...
        style.removeAttribute( "filter" );

        // if there there is no filter style applied in a css rule, we are done
        if ( currentStyle && !currentStyle.filter ) {
          return;
        }
      }

      // otherwise, set new filter values
      style.filter = ralpha.test( filter ) ?
        filter.replace( ralpha, opacity ) :
        filter + " " + opacity;
    }
  };
}

jQuery(function() {
  // This hook cannot be added until DOM ready because the support test
  // for it is not run until after DOM ready
  if ( !jQuery.support.reliableMarginRight ) {
    jQuery.cssHooks.marginRight = {
      get: function( elem, computed ) {
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        // Work around by temporarily setting element display to inline-block
        return jQuery.swap( elem, { "display": "inline-block" }, function() {
          if ( computed ) {
            return curCSS( elem, "margin-right" );
          } else {
            return elem.style.marginRight;
          }
        });
      }
    };
  }
});

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.hidden = function( elem ) {
    var width = elem.offsetWidth,
      height = elem.offsetHeight;

    return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
  };

  jQuery.expr.filters.visible = function( elem ) {
    return !jQuery.expr.filters.hidden( elem );
  };
}

// These hooks are used by animate to expand properties
jQuery.each({
  margin: "",
  padding: "",
  border: "Width"
}, function( prefix, suffix ) {

  jQuery.cssHooks[ prefix + suffix ] = {
    expand: function( value ) {
      var i,

        // assumes a single number if not a string
        parts = typeof value === "string" ? value.split(" ") : [ value ],
        expanded = {};

      for ( i = 0; i < 4; i++ ) {
        expanded[ prefix + cssExpand[ i ] + suffix ] =
          parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
      }

      return expanded;
    }
  };
});




var r20 = /%20/g,
  rbracket = /\[\]$/,
  rCRLF = /\r?\n/g,
  rhash = /#.*$/,
  rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
  rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
  // #7653, #8125, #8152: local protocol detection
  rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
  rnoContent = /^(?:GET|HEAD)$/,
  rprotocol = /^\/\//,
  rquery = /\?/,
  rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  rselectTextarea = /^(?:select|textarea)/i,
  rspacesAjax = /\s+/,
  rts = /([?&])_=[^&]*/,
  rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

  // Keep a copy of the old load method
  _load = jQuery.fn.load,

  /* Prefilters
   * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
   * 2) These are called:
   *    - BEFORE asking for a transport
   *    - AFTER param serialization (s.data is a string if s.processData is true)
   * 3) key is the dataType
   * 4) the catchall symbol "*" can be used
   * 5) execution will start with transport dataType and THEN continue down to "*" if needed
   */
  prefilters = {},

  /* Transports bindings
   * 1) key is the dataType
   * 2) the catchall symbol "*" can be used
   * 3) selection will start with transport dataType and THEN go to "*" if needed
   */
  transports = {},

  // Document location
  ajaxLocation,

  // Document location segments
  ajaxLocParts,

  // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
  allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
  ajaxLocation = location.href;
} catch( e ) {
  // Use the href attribute of an A element
  // since IE will modify it given document.location
  ajaxLocation = document.createElement( "a" );
  ajaxLocation.href = "";
  ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

  // dataTypeExpression is optional and defaults to "*"
  return function( dataTypeExpression, func ) {

    if ( typeof dataTypeExpression !== "string" ) {
      func = dataTypeExpression;
      dataTypeExpression = "*";
    }

    if ( jQuery.isFunction( func ) ) {
      var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
        i = 0,
        length = dataTypes.length,
        dataType,
        list,
        placeBefore;

      // For each dataType in the dataTypeExpression
      for ( ; i < length; i++ ) {
        dataType = dataTypes[ i ];
        // We control if we're asked to add before
        // any existing element
        placeBefore = /^\+/.test( dataType );
        if ( placeBefore ) {
          dataType = dataType.substr( 1 ) || "*";
        }
        list = structure[ dataType ] = structure[ dataType ] || [];
        // then we add to the structure accordingly
        list[ placeBefore ? "unshift" : "push" ]( func );
      }
    }
  };
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
    dataType /* internal */, inspected /* internal */ ) {

  dataType = dataType || options.dataTypes[ 0 ];
  inspected = inspected || {};

  inspected[ dataType ] = true;

  var list = structure[ dataType ],
    i = 0,
    length = list ? list.length : 0,
    executeOnly = ( structure === prefilters ),
    selection;

  for ( ; i < length && ( executeOnly || !selection ); i++ ) {
    selection = list[ i ]( options, originalOptions, jqXHR );
    // If we got redirected to another dataType
    // we try there if executing only and not done already
    if ( typeof selection === "string" ) {
      if ( !executeOnly || inspected[ selection ] ) {
        selection = undefined;
      } else {
        options.dataTypes.unshift( selection );
        selection = inspectPrefiltersOrTransports(
            structure, options, originalOptions, jqXHR, selection, inspected );
      }
    }
  }
  // If we're only executing or nothing was selected
  // we try the catchall dataType if not done already
  if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
    selection = inspectPrefiltersOrTransports(
        structure, options, originalOptions, jqXHR, "*", inspected );
  }
  // unnecessary when only executing (prefilters)
  // but it'll be ignored by the caller in that case
  return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
  var key, deep,
    flatOptions = jQuery.ajaxSettings.flatOptions || {};
  for ( key in src ) {
    if ( src[ key ] !== undefined ) {
      ( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    }
  }
  if ( deep ) {
    jQuery.extend( true, target, deep );
  }
}

jQuery.fn.extend({
  load: function( url, params, callback ) {
    if ( typeof url !== "string" && _load ) {
      return _load.apply( this, arguments );

    // Don't do a request if no elements are being requested
    } else if ( !this.length ) {
      return this;
    }

    var off = url.indexOf( " " );
    if ( off >= 0 ) {
      var selector = url.slice( off, url.length );
      url = url.slice( 0, off );
    }

    // Default to a GET request
    var type = "GET";

    // If the second parameter was provided
    if ( params ) {
      // If it's a function
      if ( jQuery.isFunction( params ) ) {
        // We assume that it's the callback
        callback = params;
        params = undefined;

      // Otherwise, build a param string
      } else if ( typeof params === "object" ) {
        params = jQuery.param( params, jQuery.ajaxSettings.traditional );
        type = "POST";
      }
    }

    var self = this;

    // Request the remote document
    jQuery.ajax({
      url: url,
      type: type,
      dataType: "html",
      data: params,
      // Complete callback (responseText is used internally)
      complete: function( jqXHR, status, responseText ) {
        // Store the response as specified by the jqXHR object
        responseText = jqXHR.responseText;
        // If successful, inject the HTML into all the matched elements
        if ( jqXHR.isResolved() ) {
          // #4825: Get the actual response in case
          // a dataFilter is present in ajaxSettings
          jqXHR.done(function( r ) {
            responseText = r;
          });
          // See if a selector was specified
          self.html( selector ?
            // Create a dummy div to hold the results
            jQuery("<div>")
              // inject the contents of the document in, removing the scripts
              // to avoid any 'Permission Denied' errors in IE
              .append(responseText.replace(rscript, ""))

              // Locate the specified elements
              .find(selector) :

            // If not, just inject the full result
            responseText );
        }

        if ( callback ) {
          self.each( callback, [ responseText, status, jqXHR ] );
        }
      }
    });

    return this;
  },

  serialize: function() {
    return jQuery.param( this.serializeArray() );
  },

  serializeArray: function() {
    return this.map(function(){
      return this.elements ? jQuery.makeArray( this.elements ) : this;
    })
    .filter(function(){
      return this.name && !this.disabled &&
        ( this.checked || rselectTextarea.test( this.nodeName ) ||
          rinput.test( this.type ) );
    })
    .map(function( i, elem ){
      var val = jQuery( this ).val();

      return val == null ?
        null :
        jQuery.isArray( val ) ?
          jQuery.map( val, function( val, i ){
            return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
          }) :
          { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    }).get();
  }
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
  jQuery.fn[ o ] = function( f ){
    return this.on( o, f );
  };
});

jQuery.each( [ "get", "post" ], function( i, method ) {
  jQuery[ method ] = function( url, data, callback, type ) {
    // shift arguments if data argument was omitted
    if ( jQuery.isFunction( data ) ) {
      type = type || callback;
      callback = data;
      data = undefined;
    }

    return jQuery.ajax({
      type: method,
      url: url,
      data: data,
      success: callback,
      dataType: type
    });
  };
});

jQuery.extend({

  getScript: function( url, callback ) {
    return jQuery.get( url, undefined, callback, "script" );
  },

  getJSON: function( url, data, callback ) {
    return jQuery.get( url, data, callback, "json" );
  },

  // Creates a full fledged settings object into target
  // with both ajaxSettings and settings fields.
  // If target is omitted, writes into ajaxSettings.
  ajaxSetup: function( target, settings ) {
    if ( settings ) {
      // Building a settings object
      ajaxExtend( target, jQuery.ajaxSettings );
    } else {
      // Extending ajaxSettings
      settings = target;
      target = jQuery.ajaxSettings;
    }
    ajaxExtend( target, settings );
    return target;
  },

  ajaxSettings: {
    url: ajaxLocation,
    isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
    global: true,
    type: "GET",
    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
    processData: true,
    async: true,
    /*
    timeout: 0,
    data: null,
    dataType: null,
    username: null,
    password: null,
    cache: null,
    traditional: false,
    headers: {},
    */

    accepts: {
      xml: "application/xml, text/xml",
      html: "text/html",
      text: "text/plain",
      json: "application/json, text/javascript",
      "*": allTypes
    },

    contents: {
      xml: /xml/,
      html: /html/,
      json: /json/
    },

    responseFields: {
      xml: "responseXML",
      text: "responseText"
    },

    // List of data converters
    // 1) key format is "source_type destination_type" (a single space in-between)
    // 2) the catchall symbol "*" can be used for source_type
    converters: {

      // Convert anything to text
      "* text": window.String,

      // Text to html (true = no transformation)
      "text html": true,

      // Evaluate text as a json expression
      "text json": jQuery.parseJSON,

      // Parse text as xml
      "text xml": jQuery.parseXML
    },

    // For options that shouldn't be deep extended:
    // you can add your own custom options here if
    // and when you create one that shouldn't be
    // deep extended (see ajaxExtend)
    flatOptions: {
      context: true,
      url: true
    }
  },

  ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
  ajaxTransport: addToPrefiltersOrTransports( transports ),

  // Main method
  ajax: function( url, options ) {

    // If url is an object, simulate pre-1.5 signature
    if ( typeof url === "object" ) {
      options = url;
      url = undefined;
    }

    // Force options to be an object
    options = options || {};

    var // Create the final options object
      s = jQuery.ajaxSetup( {}, options ),
      // Callbacks context
      callbackContext = s.context || s,
      // Context for global events
      // It's the callbackContext if one was provided in the options
      // and if it's a DOM node or a jQuery collection
      globalEventContext = callbackContext !== s &&
        ( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
            jQuery( callbackContext ) : jQuery.event,
      // Deferreds
      deferred = jQuery.Deferred(),
      completeDeferred = jQuery.Callbacks( "once memory" ),
      // Status-dependent callbacks
      statusCode = s.statusCode || {},
      // ifModified key
      ifModifiedKey,
      // Headers (they are sent all at once)
      requestHeaders = {},
      requestHeadersNames = {},
      // Response headers
      responseHeadersString,
      responseHeaders,
      // transport
      transport,
      // timeout handle
      timeoutTimer,
      // Cross-domain detection vars
      parts,
      // The jqXHR state
      state = 0,
      // To know if global events are to be dispatched
      fireGlobals,
      // Loop variable
      i,
      // Fake xhr
      jqXHR = {

        readyState: 0,

        // Caches the header
        setRequestHeader: function( name, value ) {
          if ( !state ) {
            var lname = name.toLowerCase();
            name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
            requestHeaders[ name ] = value;
          }
          return this;
        },

        // Raw string
        getAllResponseHeaders: function() {
          return state === 2 ? responseHeadersString : null;
        },

        // Builds headers hashtable if needed
        getResponseHeader: function( key ) {
          var match;
          if ( state === 2 ) {
            if ( !responseHeaders ) {
              responseHeaders = {};
              while( ( match = rheaders.exec( responseHeadersString ) ) ) {
                responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
              }
            }
            match = responseHeaders[ key.toLowerCase() ];
          }
          return match === undefined ? null : match;
        },

        // Overrides response content-type header
        overrideMimeType: function( type ) {
          if ( !state ) {
            s.mimeType = type;
          }
          return this;
        },

        // Cancel the request
        abort: function( statusText ) {
          statusText = statusText || "abort";
          if ( transport ) {
            transport.abort( statusText );
          }
          done( 0, statusText );
          return this;
        }
      };

    // Callback for when everything is done
    // It is defined here because jslint complains if it is declared
    // at the end of the function (which would be more logical and readable)
    function done( status, nativeStatusText, responses, headers ) {

      // Called once
      if ( state === 2 ) {
        return;
      }

      // State is "done" now
      state = 2;

      // Clear timeout if it exists
      if ( timeoutTimer ) {
        clearTimeout( timeoutTimer );
      }

      // Dereference transport for early garbage collection
      // (no matter how long the jqXHR object will be used)
      transport = undefined;

      // Cache response headers
      responseHeadersString = headers || "";

      // Set readyState
      jqXHR.readyState = status > 0 ? 4 : 0;

      var isSuccess,
        success,
        error,
        statusText = nativeStatusText,
        response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
        lastModified,
        etag;

      // If successful, handle type chaining
      if ( status >= 200 && status < 300 || status === 304 ) {

        // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
        if ( s.ifModified ) {

          if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
            jQuery.lastModified[ ifModifiedKey ] = lastModified;
          }
          if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
            jQuery.etag[ ifModifiedKey ] = etag;
          }
        }

        // If not modified
        if ( status === 304 ) {

          statusText = "notmodified";
          isSuccess = true;

        // If we have data
        } else {

          try {
            success = ajaxConvert( s, response );
            statusText = "success";
            isSuccess = true;
          } catch(e) {
            // We have a parsererror
            statusText = "parsererror";
            error = e;
          }
        }
      } else {
        // We extract error from statusText
        // then normalize statusText and status for non-aborts
        error = statusText;
        if ( !statusText || status ) {
          statusText = "error";
          if ( status < 0 ) {
            status = 0;
          }
        }
      }

      // Set data for the fake xhr object
      jqXHR.status = status;
      jqXHR.statusText = "" + ( nativeStatusText || statusText );

      // Success/Error
      if ( isSuccess ) {
        deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
      } else {
        deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
      }

      // Status-dependent callbacks
      jqXHR.statusCode( statusCode );
      statusCode = undefined;

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
            [ jqXHR, s, isSuccess ? success : error ] );
      }

      // Complete
      completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
        // Handle the global AJAX counter
        if ( !( --jQuery.active ) ) {
          jQuery.event.trigger( "ajaxStop" );
        }
      }
    }

    // Attach deferreds
    deferred.promise( jqXHR );
    jqXHR.success = jqXHR.done;
    jqXHR.error = jqXHR.fail;
    jqXHR.complete = completeDeferred.add;

    // Status-dependent callbacks
    jqXHR.statusCode = function( map ) {
      if ( map ) {
        var tmp;
        if ( state < 2 ) {
          for ( tmp in map ) {
            statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
          }
        } else {
          tmp = map[ jqXHR.status ];
          jqXHR.then( tmp, tmp );
        }
      }
      return this;
    };

    // Remove hash character (#7531: and string promotion)
    // Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
    // We also use the url parameter if available
    s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

    // Extract dataTypes list
    s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

    // Determine if a cross-domain request is in order
    if ( s.crossDomain == null ) {
      parts = rurl.exec( s.url.toLowerCase() );
      s.crossDomain = !!( parts &&
        ( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
          ( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
            ( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
      );
    }

    // Convert data if not already a string
    if ( s.data && s.processData && typeof s.data !== "string" ) {
      s.data = jQuery.param( s.data, s.traditional );
    }

    // Apply prefilters
    inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    // If request was aborted inside a prefilter, stop there
    if ( state === 2 ) {
      return false;
    }

    // We can fire global events as of now if asked to
    fireGlobals = s.global;

    // Uppercase the type
    s.type = s.type.toUpperCase();

    // Determine if request has content
    s.hasContent = !rnoContent.test( s.type );

    // Watch for a new set of requests
    if ( fireGlobals && jQuery.active++ === 0 ) {
      jQuery.event.trigger( "ajaxStart" );
    }

    // More options handling for requests with no content
    if ( !s.hasContent ) {

      // If data is available, append data to url
      if ( s.data ) {
        s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
        // #9682: remove data so that it's not used in an eventual retry
        delete s.data;
      }

      // Get ifModifiedKey before adding the anti-cache parameter
      ifModifiedKey = s.url;

      // Add anti-cache in url if needed
      if ( s.cache === false ) {

        var ts = jQuery.now(),
          // try replacing _= if it is there
          ret = s.url.replace( rts, "$1_=" + ts );

        // if nothing was replaced, add timestamp to the end
        s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
      }
    }

    // Set the correct header, if data is being sent
    if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
      jqXHR.setRequestHeader( "Content-Type", s.contentType );
    }

    // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    if ( s.ifModified ) {
      ifModifiedKey = ifModifiedKey || s.url;
      if ( jQuery.lastModified[ ifModifiedKey ] ) {
        jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
      }
      if ( jQuery.etag[ ifModifiedKey ] ) {
        jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
      }
    }

    // Set the Accepts header for the server, depending on the dataType
    jqXHR.setRequestHeader(
      "Accept",
      s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
        s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
        s.accepts[ "*" ]
    );

    // Check for headers option
    for ( i in s.headers ) {
      jqXHR.setRequestHeader( i, s.headers[ i ] );
    }

    // Allow custom headers/mimetypes and early abort
    if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
        // Abort if not done already
        jqXHR.abort();
        return false;

    }

    // Install callbacks on deferreds
    for ( i in { success: 1, error: 1, complete: 1 } ) {
      jqXHR[ i ]( s[ i ] );
    }

    // Get transport
    transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    // If no transport, we auto-abort
    if ( !transport ) {
      done( -1, "No Transport" );
    } else {
      jqXHR.readyState = 1;
      // Send global event
      if ( fireGlobals ) {
        globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
      }
      // Timeout
      if ( s.async && s.timeout > 0 ) {
        timeoutTimer = setTimeout( function(){
          jqXHR.abort( "timeout" );
        }, s.timeout );
      }

      try {
        state = 1;
        transport.send( requestHeaders, done );
      } catch (e) {
        // Propagate exception as error if not done
        if ( state < 2 ) {
          done( -1, e );
        // Simply rethrow otherwise
        } else {
          throw e;
        }
      }
    }

    return jqXHR;
  },

  // Serialize an array of form elements or a set of
  // key/values into a query string
  param: function( a, traditional ) {
    var s = [],
      add = function( key, value ) {
        // If value is a function, invoke it and return its value
        value = jQuery.isFunction( value ) ? value() : value;
        s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
      };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if ( traditional === undefined ) {
      traditional = jQuery.ajaxSettings.traditional;
    }

    // If an array was passed in, assume that it is an array of form elements.
    if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
      // Serialize the form elements
      jQuery.each( a, function() {
        add( this.name, this.value );
      });

    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for ( var prefix in a ) {
        buildParams( prefix, a[ prefix ], traditional, add );
      }
    }

    // Return the resulting serialization
    return s.join( "&" ).replace( r20, "+" );
  }
});

function buildParams( prefix, obj, traditional, add ) {
  if ( jQuery.isArray( obj ) ) {
    // Serialize array item.
    jQuery.each( obj, function( i, v ) {
      if ( traditional || rbracket.test( prefix ) ) {
        // Treat each array item as a scalar.
        add( prefix, v );

      } else {
        // If array item is non-scalar (array or object), encode its
        // numeric index to resolve deserialization ambiguity issues.
        // Note that rack (as of 1.0.0) can't currently deserialize
        // nested arrays properly, and attempting to do so may cause
        // a server error. Possible fixes are to modify rack's
        // deserialization algorithm or to provide an option or flag
        // to force array serialization to be shallow.
        buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
      }
    });

  } else if ( !traditional && jQuery.type( obj ) === "object" ) {
    // Serialize object item.
    for ( var name in obj ) {
      buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    }

  } else {
    // Serialize scalar item.
    add( prefix, obj );
  }
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

  // Counter for holding the number of active queries
  active: 0,

  // Last-Modified header cache for next request
  lastModified: {},
  etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

  var contents = s.contents,
    dataTypes = s.dataTypes,
    responseFields = s.responseFields,
    ct,
    type,
    finalDataType,
    firstDataType;

  // Fill responseXXX fields
  for ( type in responseFields ) {
    if ( type in responses ) {
      jqXHR[ responseFields[type] ] = responses[ type ];
    }
  }

  // Remove auto dataType and get content-type in the process
  while( dataTypes[ 0 ] === "*" ) {
    dataTypes.shift();
    if ( ct === undefined ) {
      ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
    }
  }

  // Check if we're dealing with a known content-type
  if ( ct ) {
    for ( type in contents ) {
      if ( contents[ type ] && contents[ type ].test( ct ) ) {
        dataTypes.unshift( type );
        break;
      }
    }
  }

  // Check to see if we have a response for the expected dataType
  if ( dataTypes[ 0 ] in responses ) {
    finalDataType = dataTypes[ 0 ];
  } else {
    // Try convertible dataTypes
    for ( type in responses ) {
      if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
        finalDataType = type;
        break;
      }
      if ( !firstDataType ) {
        firstDataType = type;
      }
    }
    // Or just use first one
    finalDataType = finalDataType || firstDataType;
  }

  // If we found a dataType
  // We add the dataType to the list if needed
  // and return the corresponding response
  if ( finalDataType ) {
    if ( finalDataType !== dataTypes[ 0 ] ) {
      dataTypes.unshift( finalDataType );
    }
    return responses[ finalDataType ];
  }
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

  // Apply the dataFilter if provided
  if ( s.dataFilter ) {
    response = s.dataFilter( response, s.dataType );
  }

  var dataTypes = s.dataTypes,
    converters = {},
    i,
    key,
    length = dataTypes.length,
    tmp,
    // Current and previous dataTypes
    current = dataTypes[ 0 ],
    prev,
    // Conversion expression
    conversion,
    // Conversion function
    conv,
    // Conversion functions (transitive conversion)
    conv1,
    conv2;

  // For each dataType in the chain
  for ( i = 1; i < length; i++ ) {

    // Create converters map
    // with lowercased keys
    if ( i === 1 ) {
      for ( key in s.converters ) {
        if ( typeof key === "string" ) {
          converters[ key.toLowerCase() ] = s.converters[ key ];
        }
      }
    }

    // Get the dataTypes
    prev = current;
    current = dataTypes[ i ];

    // If current is auto dataType, update it to prev
    if ( current === "*" ) {
      current = prev;
    // If no auto and dataTypes are actually different
    } else if ( prev !== "*" && prev !== current ) {

      // Get the converter
      conversion = prev + " " + current;
      conv = converters[ conversion ] || converters[ "* " + current ];

      // If there is no direct converter, search transitively
      if ( !conv ) {
        conv2 = undefined;
        for ( conv1 in converters ) {
          tmp = conv1.split( " " );
          if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
            conv2 = converters[ tmp[1] + " " + current ];
            if ( conv2 ) {
              conv1 = converters[ conv1 ];
              if ( conv1 === true ) {
                conv = conv2;
              } else if ( conv2 === true ) {
                conv = conv1;
              }
              break;
            }
          }
        }
      }
      // If we found no converter, dispatch an error
      if ( !( conv || conv2 ) ) {
        jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
      }
      // If found converter is not an equivalence
      if ( conv !== true ) {
        // Convert with 1 or 2 converters accordingly
        response = conv ? conv( response ) : conv2( conv1(response) );
      }
    }
  }
  return response;
}




var jsc = jQuery.now(),
  jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
  jsonp: "callback",
  jsonpCallback: function() {
    return jQuery.expando + "_" + ( jsc++ );
  }
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

  var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

  if ( s.dataTypes[ 0 ] === "jsonp" ||
    s.jsonp !== false && ( jsre.test( s.url ) ||
        inspectData && jsre.test( s.data ) ) ) {

    var responseContainer,
      jsonpCallback = s.jsonpCallback =
        jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
      previous = window[ jsonpCallback ],
      url = s.url,
      data = s.data,
      replace = "$1" + jsonpCallback + "$2";

    if ( s.jsonp !== false ) {
      url = url.replace( jsre, replace );
      if ( s.url === url ) {
        if ( inspectData ) {
          data = data.replace( jsre, replace );
        }
        if ( s.data === data ) {
          // Add callback manually
          url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
        }
      }
    }

    s.url = url;
    s.data = data;

    // Install callback
    window[ jsonpCallback ] = function( response ) {
      responseContainer = [ response ];
    };

    // Clean-up function
    jqXHR.always(function() {
      // Set callback back to previous value
      window[ jsonpCallback ] = previous;
      // Call if it was a function and we have a response
      if ( responseContainer && jQuery.isFunction( previous ) ) {
        window[ jsonpCallback ]( responseContainer[ 0 ] );
      }
    });

    // Use data converter to retrieve json after script execution
    s.converters["script json"] = function() {
      if ( !responseContainer ) {
        jQuery.error( jsonpCallback + " was not called" );
      }
      return responseContainer[ 0 ];
    };

    // force json dataType
    s.dataTypes[ 0 ] = "json";

    // Delegate to script
    return "script";
  }
});




// Install script dataType
jQuery.ajaxSetup({
  accepts: {
    script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
  },
  contents: {
    script: /javascript|ecmascript/
  },
  converters: {
    "text script": function( text ) {
      jQuery.globalEval( text );
      return text;
    }
  }
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
  if ( s.cache === undefined ) {
    s.cache = false;
  }
  if ( s.crossDomain ) {
    s.type = "GET";
    s.global = false;
  }
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

  // This transport only deals with cross domain requests
  if ( s.crossDomain ) {

    var script,
      head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

    return {

      send: function( _, callback ) {

        script = document.createElement( "script" );

        script.async = "async";

        if ( s.scriptCharset ) {
          script.charset = s.scriptCharset;
        }

        script.src = s.url;

        // Attach handlers for all browsers
        script.onload = script.onreadystatechange = function( _, isAbort ) {

          if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;

            // Remove the script
            if ( head && script.parentNode ) {
              head.removeChild( script );
            }

            // Dereference the script
            script = undefined;

            // Callback if not abort
            if ( !isAbort ) {
              callback( 200, "success" );
            }
          }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        // This arises when a base node is used (#2709 and #4378).
        head.insertBefore( script, head.firstChild );
      },

      abort: function() {
        if ( script ) {
          script.onload( 0, 1 );
        }
      }
    };
  }
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
  xhrOnUnloadAbort = window.ActiveXObject ? function() {
    // Abort all pending requests
    for ( var key in xhrCallbacks ) {
      xhrCallbacks[ key ]( 0, 1 );
    }
  } : false,
  xhrId = 0,
  xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
  try {
    return new window.XMLHttpRequest();
  } catch( e ) {}
}

function createActiveXHR() {
  try {
    return new window.ActiveXObject( "Microsoft.XMLHTTP" );
  } catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
  /* Microsoft failed to properly
   * implement the XMLHttpRequest in IE7 (can't request local files),
   * so we use the ActiveXObject when it is available
   * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
   * we need a fallback.
   */
  function() {
    return !this.isLocal && createStandardXHR() || createActiveXHR();
  } :
  // For all other browsers, use the standard XMLHttpRequest object
  createStandardXHR;

// Determine support properties
(function( xhr ) {
  jQuery.extend( jQuery.support, {
    ajax: !!xhr,
    cors: !!xhr && ( "withCredentials" in xhr )
  });
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

  jQuery.ajaxTransport(function( s ) {
    // Cross domain only allowed if supported through XMLHttpRequest
    if ( !s.crossDomain || jQuery.support.cors ) {

      var callback;

      return {
        send: function( headers, complete ) {

          // Get a new xhr
          var xhr = s.xhr(),
            handle,
            i;

          // Open the socket
          // Passing null username, generates a login popup on Opera (#2865)
          if ( s.username ) {
            xhr.open( s.type, s.url, s.async, s.username, s.password );
          } else {
            xhr.open( s.type, s.url, s.async );
          }

          // Apply custom fields if provided
          if ( s.xhrFields ) {
            for ( i in s.xhrFields ) {
              xhr[ i ] = s.xhrFields[ i ];
            }
          }

          // Override mime type if needed
          if ( s.mimeType && xhr.overrideMimeType ) {
            xhr.overrideMimeType( s.mimeType );
          }

          // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.
          if ( !s.crossDomain && !headers["X-Requested-With"] ) {
            headers[ "X-Requested-With" ] = "XMLHttpRequest";
          }

          // Need an extra try/catch for cross domain requests in Firefox 3
          try {
            for ( i in headers ) {
              xhr.setRequestHeader( i, headers[ i ] );
            }
          } catch( _ ) {}

          // Do send the request
          // This may raise an exception which is actually
          // handled in jQuery.ajax (so no try/catch here)
          xhr.send( ( s.hasContent && s.data ) || null );

          // Listener
          callback = function( _, isAbort ) {

            var status,
              statusText,
              responseHeaders,
              responses,
              xml;

            // Firefox throws exceptions when accessing properties
            // of an xhr when a network error occured
            // http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
            try {

              // Was never called and is aborted or complete
              if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

                // Only called once
                callback = undefined;

                // Do not keep as active anymore
                if ( handle ) {
                  xhr.onreadystatechange = jQuery.noop;
                  if ( xhrOnUnloadAbort ) {
                    delete xhrCallbacks[ handle ];
                  }
                }

                // If it's an abort
                if ( isAbort ) {
                  // Abort it manually if needed
                  if ( xhr.readyState !== 4 ) {
                    xhr.abort();
                  }
                } else {
                  status = xhr.status;
                  responseHeaders = xhr.getAllResponseHeaders();
                  responses = {};
                  xml = xhr.responseXML;

                  // Construct response list
                  if ( xml && xml.documentElement /* #4958 */ ) {
                    responses.xml = xml;
                  }

                  // When requesting binary data, IE6-9 will throw an exception
                  // on any attempt to access responseText (#11426)
                  try {
                    responses.text = xhr.responseText;
                  } catch( _ ) {
                  }

                  // Firefox throws an exception when accessing
                  // statusText for faulty cross-domain requests
                  try {
                    statusText = xhr.statusText;
                  } catch( e ) {
                    // We normalize with Webkit giving an empty statusText
                    statusText = "";
                  }

                  // Filter status for non standard behaviors

                  // If the request is local and we have data: assume a success
                  // (success with no data won't get notified, that's the best we
                  // can do given current implementations)
                  if ( !status && s.isLocal && !s.crossDomain ) {
                    status = responses.text ? 200 : 404;
                  // IE - #1450: sometimes returns 1223 when it should be 204
                  } else if ( status === 1223 ) {
                    status = 204;
                  }
                }
              }
            } catch( firefoxAccessException ) {
              if ( !isAbort ) {
                complete( -1, firefoxAccessException );
              }
            }

            // Call complete if needed
            if ( responses ) {
              complete( status, statusText, responses, responseHeaders );
            }
          };

          // if we're in sync mode or it's in cache
          // and has been retrieved directly (IE6 & IE7)
          // we need to manually fire the callback
          if ( !s.async || xhr.readyState === 4 ) {
            callback();
          } else {
            handle = ++xhrId;
            if ( xhrOnUnloadAbort ) {
              // Create the active xhrs callbacks list if needed
              // and attach the unload handler
              if ( !xhrCallbacks ) {
                xhrCallbacks = {};
                jQuery( window ).unload( xhrOnUnloadAbort );
              }
              // Add to list of active xhrs callbacks
              xhrCallbacks[ handle ] = callback;
            }
            xhr.onreadystatechange = callback;
          }
        },

        abort: function() {
          if ( callback ) {
            callback(0,1);
          }
        }
      };
    }
  });
}




var elemdisplay = {},
  iframe, iframeDoc,
  rfxtypes = /^(?:toggle|show|hide)$/,
  rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
  timerId,
  fxAttrs = [
    // height animations
    [ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
    // width animations
    [ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
    // opacity animations
    [ "opacity" ]
  ],
  fxNow;

jQuery.fn.extend({
  show: function( speed, easing, callback ) {
    var elem, display;

    if ( speed || speed === 0 ) {
      return this.animate( genFx("show", 3), speed, easing, callback );

    } else {
      for ( var i = 0, j = this.length; i < j; i++ ) {
        elem = this[ i ];

        if ( elem.style ) {
          display = elem.style.display;

          // Reset the inline display of this element to learn if it is
          // being hidden by cascaded rules or not
          if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
            display = elem.style.display = "";
          }

          // Set elements which have been overridden with display: none
          // in a stylesheet to whatever the default browser style is
          // for such an element
          if ( (display === "" && jQuery.css(elem, "display") === "none") ||
            !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
            jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
          }
        }
      }

      // Set the display of most of the elements in a second loop
      // to avoid the constant reflow
      for ( i = 0; i < j; i++ ) {
        elem = this[ i ];

        if ( elem.style ) {
          display = elem.style.display;

          if ( display === "" || display === "none" ) {
            elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
          }
        }
      }

      return this;
    }
  },

  hide: function( speed, easing, callback ) {
    if ( speed || speed === 0 ) {
      return this.animate( genFx("hide", 3), speed, easing, callback);

    } else {
      var elem, display,
        i = 0,
        j = this.length;

      for ( ; i < j; i++ ) {
        elem = this[i];
        if ( elem.style ) {
          display = jQuery.css( elem, "display" );

          if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
            jQuery._data( elem, "olddisplay", display );
          }
        }
      }

      // Set the display of the elements in a second loop
      // to avoid the constant reflow
      for ( i = 0; i < j; i++ ) {
        if ( this[i].style ) {
          this[i].style.display = "none";
        }
      }

      return this;
    }
  },

  // Save the old toggle function
  _toggle: jQuery.fn.toggle,

  toggle: function( fn, fn2, callback ) {
    var bool = typeof fn === "boolean";

    if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
      this._toggle.apply( this, arguments );

    } else if ( fn == null || bool ) {
      this.each(function() {
        var state = bool ? fn : jQuery(this).is(":hidden");
        jQuery(this)[ state ? "show" : "hide" ]();
      });

    } else {
      this.animate(genFx("toggle", 3), fn, fn2, callback);
    }

    return this;
  },

  fadeTo: function( speed, to, easing, callback ) {
    return this.filter(":hidden").css("opacity", 0).show().end()
          .animate({opacity: to}, speed, easing, callback);
  },

  animate: function( prop, speed, easing, callback ) {
    var optall = jQuery.speed( speed, easing, callback );

    if ( jQuery.isEmptyObject( prop ) ) {
      return this.each( optall.complete, [ false ] );
    }

    // Do not change referenced properties as per-property easing will be lost
    prop = jQuery.extend( {}, prop );

    function doAnimation() {
      // XXX 'this' does not always have a nodeName when running the
      // test suite

      if ( optall.queue === false ) {
        jQuery._mark( this );
      }

      var opt = jQuery.extend( {}, optall ),
        isElement = this.nodeType === 1,
        hidden = isElement && jQuery(this).is(":hidden"),
        name, val, p, e, hooks, replace,
        parts, start, end, unit,
        method;

      // will store per property easing and be used to determine when an animation is complete
      opt.animatedProperties = {};

      // first pass over propertys to expand / normalize
      for ( p in prop ) {
        name = jQuery.camelCase( p );
        if ( p !== name ) {
          prop[ name ] = prop[ p ];
          delete prop[ p ];
        }

        if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
          replace = hooks.expand( prop[ name ] );
          delete prop[ name ];

          // not quite $.extend, this wont overwrite keys already present.
          // also - reusing 'p' from above because we have the correct "name"
          for ( p in replace ) {
            if ( ! ( p in prop ) ) {
              prop[ p ] = replace[ p ];
            }
          }
        }
      }

      for ( name in prop ) {
        val = prop[ name ];
        // easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
        if ( jQuery.isArray( val ) ) {
          opt.animatedProperties[ name ] = val[ 1 ];
          val = prop[ name ] = val[ 0 ];
        } else {
          opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
        }

        if ( val === "hide" && hidden || val === "show" && !hidden ) {
          return opt.complete.call( this );
        }

        if ( isElement && ( name === "height" || name === "width" ) ) {
          // Make sure that nothing sneaks out
          // Record all 3 overflow attributes because IE does not
          // change the overflow attribute when overflowX and
          // overflowY are set to the same value
          opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

          // Set display property to inline-block for height/width
          // animations on inline elements that are having width/height animated
          if ( jQuery.css( this, "display" ) === "inline" &&
              jQuery.css( this, "float" ) === "none" ) {

            // inline-level elements accept inline-block;
            // block-level elements need to be inline with layout
            if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
              this.style.display = "inline-block";

            } else {
              this.style.zoom = 1;
            }
          }
        }
      }

      if ( opt.overflow != null ) {
        this.style.overflow = "hidden";
      }

      for ( p in prop ) {
        e = new jQuery.fx( this, opt, p );
        val = prop[ p ];

        if ( rfxtypes.test( val ) ) {

          // Tracks whether to show or hide based on private
          // data attached to the element
          method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
          if ( method ) {
            jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
            e[ method ]();
          } else {
            e[ val ]();
          }

        } else {
          parts = rfxnum.exec( val );
          start = e.cur();

          if ( parts ) {
            end = parseFloat( parts[2] );
            unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

            // We need to compute starting value
            if ( unit !== "px" ) {
              jQuery.style( this, p, (end || 1) + unit);
              start = ( (end || 1) / e.cur() ) * start;
              jQuery.style( this, p, start + unit);
            }

            // If a +=/-= token was provided, we're doing a relative animation
            if ( parts[1] ) {
              end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
            }

            e.custom( start, end, unit );

          } else {
            e.custom( start, val, "" );
          }
        }
      }

      // For JS strict compliance
      return true;
    }

    return optall.queue === false ?
      this.each( doAnimation ) :
      this.queue( optall.queue, doAnimation );
  },

  stop: function( type, clearQueue, gotoEnd ) {
    if ( typeof type !== "string" ) {
      gotoEnd = clearQueue;
      clearQueue = type;
      type = undefined;
    }
    if ( clearQueue && type !== false ) {
      this.queue( type || "fx", [] );
    }

    return this.each(function() {
      var index,
        hadTimers = false,
        timers = jQuery.timers,
        data = jQuery._data( this );

      // clear marker counters if we know they won't be
      if ( !gotoEnd ) {
        jQuery._unmark( true, this );
      }

      function stopQueue( elem, data, index ) {
        var hooks = data[ index ];
        jQuery.removeData( elem, index, true );
        hooks.stop( gotoEnd );
      }

      if ( type == null ) {
        for ( index in data ) {
          if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
            stopQueue( this, data, index );
          }
        }
      } else if ( data[ index = type + ".run" ] && data[ index ].stop ){
        stopQueue( this, data, index );
      }

      for ( index = timers.length; index--; ) {
        if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
          if ( gotoEnd ) {

            // force the next step to be the last
            timers[ index ]( true );
          } else {
            timers[ index ].saveState();
          }
          hadTimers = true;
          timers.splice( index, 1 );
        }
      }

      // start the next in the queue if the last step wasn't forced
      // timers currently will call their complete callbacks, which will dequeue
      // but only if they were gotoEnd
      if ( !( gotoEnd && hadTimers ) ) {
        jQuery.dequeue( this, type );
      }
    });
  }

});

// Animations created synchronously will run synchronously
function createFxNow() {
  setTimeout( clearFxNow, 0 );
  return ( fxNow = jQuery.now() );
}

function clearFxNow() {
  fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
  var obj = {};

  jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
    obj[ this ] = type;
  });

  return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
  slideDown: genFx( "show", 1 ),
  slideUp: genFx( "hide", 1 ),
  slideToggle: genFx( "toggle", 1 ),
  fadeIn: { opacity: "show" },
  fadeOut: { opacity: "hide" },
  fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
  jQuery.fn[ name ] = function( speed, easing, callback ) {
    return this.animate( props, speed, easing, callback );
  };
});

jQuery.extend({
  speed: function( speed, easing, fn ) {
    var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
      complete: fn || !fn && easing ||
        jQuery.isFunction( speed ) && speed,
      duration: speed,
      easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
    };

    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
      opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

    // normalize opt.queue - true/undefined/null -> "fx"
    if ( opt.queue == null || opt.queue === true ) {
      opt.queue = "fx";
    }

    // Queueing
    opt.old = opt.complete;

    opt.complete = function( noUnmark ) {
      if ( jQuery.isFunction( opt.old ) ) {
        opt.old.call( this );
      }

      if ( opt.queue ) {
        jQuery.dequeue( this, opt.queue );
      } else if ( noUnmark !== false ) {
        jQuery._unmark( this );
      }
    };

    return opt;
  },

  easing: {
    linear: function( p ) {
      return p;
    },
    swing: function( p ) {
      return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
    }
  },

  timers: [],

  fx: function( elem, options, prop ) {
    this.options = options;
    this.elem = elem;
    this.prop = prop;

    options.orig = options.orig || {};
  }

});

jQuery.fx.prototype = {
  // Simple function for setting a style value
  update: function() {
    if ( this.options.step ) {
      this.options.step.call( this.elem, this.now, this );
    }

    ( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
  },

  // Get the current size
  cur: function() {
    if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
      return this.elem[ this.prop ];
    }

    var parsed,
      r = jQuery.css( this.elem, this.prop );
    // Empty strings, null, undefined and "auto" are converted to 0,
    // complex values such as "rotate(1rad)" are returned as is,
    // simple values such as "10px" are parsed to Float.
    return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
  },

  // Start an animation from one number to another
  custom: function( from, to, unit ) {
    var self = this,
      fx = jQuery.fx;

    this.startTime = fxNow || createFxNow();
    this.end = to;
    this.now = this.start = from;
    this.pos = this.state = 0;
    this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

    function t( gotoEnd ) {
      return self.step( gotoEnd );
    }

    t.queue = this.options.queue;
    t.elem = this.elem;
    t.saveState = function() {
      if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
        if ( self.options.hide ) {
          jQuery._data( self.elem, "fxshow" + self.prop, self.start );
        } else if ( self.options.show ) {
          jQuery._data( self.elem, "fxshow" + self.prop, self.end );
        }
      }
    };

    if ( t() && jQuery.timers.push(t) && !timerId ) {
      timerId = setInterval( fx.tick, fx.interval );
    }
  },

  // Simple 'show' function
  show: function() {
    var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

    // Remember where we started, so that we can go back to it later
    this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
    this.options.show = true;

    // Begin the animation
    // Make sure that we start at a small width/height to avoid any flash of content
    if ( dataShow !== undefined ) {
      // This show is picking up where a previous hide or show left off
      this.custom( this.cur(), dataShow );
    } else {
      this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
    }

    // Start by showing the element
    jQuery( this.elem ).show();
  },

  // Simple 'hide' function
  hide: function() {
    // Remember where we started, so that we can go back to it later
    this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
    this.options.hide = true;

    // Begin the animation
    this.custom( this.cur(), 0 );
  },

  // Each step of an animation
  step: function( gotoEnd ) {
    var p, n, complete,
      t = fxNow || createFxNow(),
      done = true,
      elem = this.elem,
      options = this.options;

    if ( gotoEnd || t >= options.duration + this.startTime ) {
      this.now = this.end;
      this.pos = this.state = 1;
      this.update();

      options.animatedProperties[ this.prop ] = true;

      for ( p in options.animatedProperties ) {
        if ( options.animatedProperties[ p ] !== true ) {
          done = false;
        }
      }

      if ( done ) {
        // Reset the overflow
        if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

          jQuery.each( [ "", "X", "Y" ], function( index, value ) {
            elem.style[ "overflow" + value ] = options.overflow[ index ];
          });
        }

        // Hide the element if the "hide" operation was done
        if ( options.hide ) {
          jQuery( elem ).hide();
        }

        // Reset the properties, if the item has been hidden or shown
        if ( options.hide || options.show ) {
          for ( p in options.animatedProperties ) {
            jQuery.style( elem, p, options.orig[ p ] );
            jQuery.removeData( elem, "fxshow" + p, true );
            // Toggle data is no longer needed
            jQuery.removeData( elem, "toggle" + p, true );
          }
        }

        // Execute the complete function
        // in the event that the complete function throws an exception
        // we must ensure it won't be called twice. #5684

        complete = options.complete;
        if ( complete ) {

          options.complete = false;
          complete.call( elem );
        }
      }

      return false;

    } else {
      // classical easing cannot be used with an Infinity duration
      if ( options.duration == Infinity ) {
        this.now = t;
      } else {
        n = t - this.startTime;
        this.state = n / options.duration;

        // Perform the easing function, defaults to swing
        this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
        this.now = this.start + ( (this.end - this.start) * this.pos );
      }
      // Perform the next step of the animation
      this.update();
    }

    return true;
  }
};

jQuery.extend( jQuery.fx, {
  tick: function() {
    var timer,
      timers = jQuery.timers,
      i = 0;

    for ( ; i < timers.length; i++ ) {
      timer = timers[ i ];
      // Checks the timer has not already been removed
      if ( !timer() && timers[ i ] === timer ) {
        timers.splice( i--, 1 );
      }
    }

    if ( !timers.length ) {
      jQuery.fx.stop();
    }
  },

  interval: 13,

  stop: function() {
    clearInterval( timerId );
    timerId = null;
  },

  speeds: {
    slow: 600,
    fast: 200,
    // Default speed
    _default: 400
  },

  step: {
    opacity: function( fx ) {
      jQuery.style( fx.elem, "opacity", fx.now );
    },

    _default: function( fx ) {
      if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
        fx.elem.style[ fx.prop ] = fx.now + fx.unit;
      } else {
        fx.elem[ fx.prop ] = fx.now;
      }
    }
  }
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
  // exclude marginTop, marginLeft, marginBottom and marginRight from this list
  if ( prop.indexOf( "margin" ) ) {
    jQuery.fx.step[ prop ] = function( fx ) {
      jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
    };
  }
});

if ( jQuery.expr && jQuery.expr.filters ) {
  jQuery.expr.filters.animated = function( elem ) {
    return jQuery.grep(jQuery.timers, function( fn ) {
      return elem === fn.elem;
    }).length;
  };
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

  if ( !elemdisplay[ nodeName ] ) {

    var body = document.body,
      elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
      display = elem.css( "display" );
    elem.remove();

    // If the simple way fails,
    // get element's real default display by attaching it to a temp iframe
    if ( display === "none" || display === "" ) {
      // No iframe to use yet, so create it
      if ( !iframe ) {
        iframe = document.createElement( "iframe" );
        iframe.frameBorder = iframe.width = iframe.height = 0;
      }

      body.appendChild( iframe );

      // Create a cacheable copy of the iframe document on first call.
      // IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
      // document to it; WebKit & Firefox won't allow reusing the iframe document.
      if ( !iframeDoc || !iframe.createElement ) {
        iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
        iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
        iframeDoc.close();
      }

      elem = iframeDoc.createElement( nodeName );

      iframeDoc.body.appendChild( elem );

      display = jQuery.css( elem, "display" );
      body.removeChild( iframe );
    }

    // Store the correct default display
    elemdisplay[ nodeName ] = display;
  }

  return elemdisplay[ nodeName ];
}




var getOffset,
  rtable = /^t(?:able|d|h)$/i,
  rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
  getOffset = function( elem, doc, docElem, box ) {
    try {
      box = elem.getBoundingClientRect();
    } catch(e) {}

    // Make sure we're not dealing with a disconnected DOM node
    if ( !box || !jQuery.contains( docElem, elem ) ) {
      return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
    }

    var body = doc.body,
      win = getWindow( doc ),
      clientTop  = docElem.clientTop  || body.clientTop  || 0,
      clientLeft = docElem.clientLeft || body.clientLeft || 0,
      scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
      scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
      top  = box.top  + scrollTop  - clientTop,
      left = box.left + scrollLeft - clientLeft;

    return { top: top, left: left };
  };

} else {
  getOffset = function( elem, doc, docElem ) {
    var computedStyle,
      offsetParent = elem.offsetParent,
      prevOffsetParent = elem,
      body = doc.body,
      defaultView = doc.defaultView,
      prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
      top = elem.offsetTop,
      left = elem.offsetLeft;

    while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
      if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
        break;
      }

      computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
      top  -= elem.scrollTop;
      left -= elem.scrollLeft;

      if ( elem === offsetParent ) {
        top  += elem.offsetTop;
        left += elem.offsetLeft;

        if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
          top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
          left += parseFloat( computedStyle.borderLeftWidth ) || 0;
        }

        prevOffsetParent = offsetParent;
        offsetParent = elem.offsetParent;
      }

      if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
        top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
        left += parseFloat( computedStyle.borderLeftWidth ) || 0;
      }

      prevComputedStyle = computedStyle;
    }

    if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
      top  += body.offsetTop;
      left += body.offsetLeft;
    }

    if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
      top  += Math.max( docElem.scrollTop, body.scrollTop );
      left += Math.max( docElem.scrollLeft, body.scrollLeft );
    }

    return { top: top, left: left };
  };
}

jQuery.fn.offset = function( options ) {
  if ( arguments.length ) {
    return options === undefined ?
      this :
      this.each(function( i ) {
        jQuery.offset.setOffset( this, options, i );
      });
  }

  var elem = this[0],
    doc = elem && elem.ownerDocument;

  if ( !doc ) {
    return null;
  }

  if ( elem === doc.body ) {
    return jQuery.offset.bodyOffset( elem );
  }

  return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

  bodyOffset: function( body ) {
    var top = body.offsetTop,
      left = body.offsetLeft;

    if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
      top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
      left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
    }

    return { top: top, left: left };
  },

  setOffset: function( elem, options, i ) {
    var position = jQuery.css( elem, "position" );

    // set position first, in-case top/left are set even on static elem
    if ( position === "static" ) {
      elem.style.position = "relative";
    }

    var curElem = jQuery( elem ),
      curOffset = curElem.offset(),
      curCSSTop = jQuery.css( elem, "top" ),
      curCSSLeft = jQuery.css( elem, "left" ),
      calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
      props = {}, curPosition = {}, curTop, curLeft;

    // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
    if ( calculatePosition ) {
      curPosition = curElem.position();
      curTop = curPosition.top;
      curLeft = curPosition.left;
    } else {
      curTop = parseFloat( curCSSTop ) || 0;
      curLeft = parseFloat( curCSSLeft ) || 0;
    }

    if ( jQuery.isFunction( options ) ) {
      options = options.call( elem, i, curOffset );
    }

    if ( options.top != null ) {
      props.top = ( options.top - curOffset.top ) + curTop;
    }
    if ( options.left != null ) {
      props.left = ( options.left - curOffset.left ) + curLeft;
    }

    if ( "using" in options ) {
      options.using.call( elem, props );
    } else {
      curElem.css( props );
    }
  }
};


jQuery.fn.extend({

  position: function() {
    if ( !this[0] ) {
      return null;
    }

    var elem = this[0],

    // Get *real* offsetParent
    offsetParent = this.offsetParent(),

    // Get correct offsets
    offset       = this.offset(),
    parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

    // Subtract element margins
    // note: when an element has margin: auto the offsetLeft and marginLeft
    // are the same in Safari causing offset.left to incorrectly be 0
    offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
    offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

    // Add offsetParent borders
    parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
    parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

    // Subtract the two offsets
    return {
      top:  offset.top  - parentOffset.top,
      left: offset.left - parentOffset.left
    };
  },

  offsetParent: function() {
    return this.map(function() {
      var offsetParent = this.offsetParent || document.body;
      while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent;
    });
  }
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
  var top = /Y/.test( prop );

  jQuery.fn[ method ] = function( val ) {
    return jQuery.access( this, function( elem, method, val ) {
      var win = getWindow( elem );

      if ( val === undefined ) {
        return win ? (prop in win) ? win[ prop ] :
          jQuery.support.boxModel && win.document.documentElement[ method ] ||
            win.document.body[ method ] :
          elem[ method ];
      }

      if ( win ) {
        win.scrollTo(
          !top ? val : jQuery( win ).scrollLeft(),
           top ? val : jQuery( win ).scrollTop()
        );

      } else {
        elem[ method ] = val;
      }
    }, method, val, arguments.length, null );
  };
});

function getWindow( elem ) {
  return jQuery.isWindow( elem ) ?
    elem :
    elem.nodeType === 9 ?
      elem.defaultView || elem.parentWindow :
      false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
  var clientProp = "client" + name,
    scrollProp = "scroll" + name,
    offsetProp = "offset" + name;

  // innerHeight and innerWidth
  jQuery.fn[ "inner" + name ] = function() {
    var elem = this[0];
    return elem ?
      elem.style ?
      parseFloat( jQuery.css( elem, type, "padding" ) ) :
      this[ type ]() :
      null;
  };

  // outerHeight and outerWidth
  jQuery.fn[ "outer" + name ] = function( margin ) {
    var elem = this[0];
    return elem ?
      elem.style ?
      parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
      this[ type ]() :
      null;
  };

  jQuery.fn[ type ] = function( value ) {
    return jQuery.access( this, function( elem, type, value ) {
      var doc, docElemProp, orig, ret;

      if ( jQuery.isWindow( elem ) ) {
        // 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
        doc = elem.document;
        docElemProp = doc.documentElement[ clientProp ];
        return jQuery.support.boxModel && docElemProp ||
          doc.body && doc.body[ clientProp ] || docElemProp;
      }

      // Get document width or height
      if ( elem.nodeType === 9 ) {
        // Either scroll[Width/Height] or offset[Width/Height], whichever is greater
        doc = elem.documentElement;

        // when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
        // so we can't use max, as it'll choose the incorrect offset[Width/Height]
        // instead we use the correct client[Width/Height]
        // support:IE6
        if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
          return doc[ clientProp ];
        }

        return Math.max(
          elem.body[ scrollProp ], doc[ scrollProp ],
          elem.body[ offsetProp ], doc[ offsetProp ]
        );
      }

      // Get width or height on the element
      if ( value === undefined ) {
        orig = jQuery.css( elem, type );
        ret = parseFloat( orig );
        return jQuery.isNumeric( ret ) ? ret : orig;
      }

      // Set the width or height on the element
      jQuery( elem ).css( type, value );
    }, type, value, arguments.length, null );
  };
});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
  define( "jquery", [], function () { return jQuery; } );
}



})( window );

//     Underscore.js 1.3.3
//     (c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Underscore is freely distributable under the MIT license.
//     Portions of Underscore are inspired or borrowed from Prototype,
//     Oliver Steele's Functional, and John Resig's Micro-Templating.
//     For all details and documentation:
//     http://documentcloud.github.com/underscore

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var slice            = ArrayProto.slice,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) { return new wrapper(obj); };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root['_'] = _;
  }

  // Current version.
  _.VERSION = '1.3.3';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, l = obj.length; i < l; i++) {
        if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      for (var key in obj) {
        if (_.has(obj, key)) {
          if (iterator.call(context, obj[key], key, obj) === breaker) return;
        }
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results[results.length] = iterator.call(context, value, index, list);
    });
    if (obj.length === +obj.length) results.length = obj.length;
    return results;
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError('Reduce of empty array with no initial value');
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var reversed = _.toArray(obj).reverse();
    if (context && !initial) iterator = _.bind(iterator, context);
    return initial ? _.reduce(reversed, iterator, memo, context) : _.reduce(reversed, iterator);
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    each(obj, function(value, index, list) {
      if (!iterator.call(context, value, index, list)) results[results.length] = value;
    });
    return results;
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if a given value is included in the array or object using `===`.
  // Aliased as `contains`.
  _.include = _.contains = function(obj, target) {
    var found = false;
    if (obj == null) return found;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    found = any(obj, function(value) {
      return value === target;
    });
    return found;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    return _.map(obj, function(value) {
      return (_.isFunction(method) ? method || value : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Return the maximum element or (element-based computation).
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.max.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed >= result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0]) return Math.min.apply(Math, obj);
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array.
  _.shuffle = function(obj) {
    var shuffled = [], rand;
    each(obj, function(value, index, list) {
      rand = Math.floor(Math.random() * (index + 1));
      shuffled[index] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, val, context) {
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value : value,
        criteria : iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      if (a === void 0) return 1;
      if (b === void 0) return -1;
      return a < b ? -1 : a > b ? 1 : 0;
    }), 'value');
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = function(obj, val) {
    var result = {};
    var iterator = _.isFunction(val) ? val : function(obj) { return obj[val]; };
    each(obj, function(value, index) {
      var key = iterator(value, index);
      (result[key] || (result[key] = [])).push(value);
    });
    return result;
  };

  // Use a comparator function to figure out at what index an object should
  // be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator) {
    iterator || (iterator = _.identity);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >> 1;
      iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely convert anything iterable into a real, live array.
  _.toArray = function(obj) {
    if (!obj)                                     return [];
    if (_.isArray(obj))                           return slice.call(obj);
    if (_.isArguments(obj))                       return slice.call(obj);
    if (obj.toArray && _.isFunction(obj.toArray)) return obj.toArray();
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    return _.isArray(obj) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
  };

  // Returns everything but the last entry of the array. Especcialy useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if ((n != null) && !guard) {
      return slice.call(array, Math.max(array.length - n, 0));
    } else {
      return array[array.length - 1];
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail`.
  // Especially useful on the arguments object. Passing an **index** will return
  // the rest of the values in the array from that index onward. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = function(array, index, guard) {
    return slice.call(array, (index == null) || guard ? 1 : index);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, function(value){ return !!value; });
  };

  // Return a completely flattened version of an array.
  _.flatten = function(array, shallow) {
    return _.reduce(array, function(memo, value) {
      if (_.isArray(value)) return memo.concat(shallow ? value : _.flatten(value));
      memo[memo.length] = value;
      return memo;
    }, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator) {
    var initial = iterator ? _.map(array, iterator) : array;
    var results = [];
    // The `isSorted` flag is irrelevant if the array only contains two elements.
    if (array.length < 3) isSorted = true;
    _.reduce(initial, function (memo, value, index) {
      if (isSorted ? _.last(memo) !== value || !memo.length : !_.include(memo, value)) {
        memo.push(value);
        results.push(array[index]);
      }
      return memo;
    }, []);
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays. (Aliased as "intersect" for back-compat.)
  _.intersection = _.intersect = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = _.flatten(slice.call(arguments, 1), true);
    return _.filter(array, function(value){ return !_.include(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var args = slice.call(arguments);
    var length = _.max(_.pluck(args, 'length'));
    var results = new Array(length);
    for (var i = 0; i < length; i++) results[i] = _.pluck(args, "" + i);
    return results;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i, l;
    if (isSorted) {
      i = _.sortedIndex(array, item);
      return array[i] === item ? i : -1;
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
    for (i = 0, l = array.length; i < l; i++) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item) {
    if (array == null) return -1;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) return array.lastIndexOf(item);
    var i = array.length;
    while (i--) if (i in array && array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var len = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(len);

    while(idx < len) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length == 0) funcs = _.functions(obj);
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  _.throttle = function(func, wait) {
    var context, args, timeout, throttling, more, result;
    var whenDone = _.debounce(function(){ more = throttling = false; }, wait);
    return function() {
      context = this; args = arguments;
      var later = function() {
        timeout = null;
        if (more) func.apply(context, args);
        whenDone();
      };
      if (!timeout) timeout = setTimeout(later, wait);
      if (throttling) {
        more = true;
      } else {
        result = func.apply(context, args);
      }
      whenDone();
      throttling = true;
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      if (immediate && !timeout) func.apply(context, args);
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      return memo = func.apply(this, arguments);
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func].concat(slice.call(arguments, 0));
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    if (times <= 0) return func();
    return function() {
      if (--times < 1) { return func.apply(this, arguments); }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    return _.map(obj, _.identity);
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var result = {};
    each(_.flatten(slice.call(arguments, 1)), function(key) {
      if (key in obj) result[key] = obj[key];
    });
    return result;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (obj[prop] == null) obj[prop] = source[prop];
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function.
  function eq(a, b, stack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a._chain) a = a._wrapped;
    if (b._chain) b = b._wrapped;
    // Invoke a custom `isEqual` method if one is provided.
    if (a.isEqual && _.isFunction(a.isEqual)) return a.isEqual(b);
    if (b.isEqual && _.isFunction(b.isEqual)) return b.isEqual(a);
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = stack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (stack[length] == a) return true;
    }
    // Add the first object to the stack of traversed objects.
    stack.push(a);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          // Ensure commutative equality for sparse arrays.
          if (!(result = size in a == size in b && eq(a[size], b[size], stack))) break;
        }
      }
    } else {
      // Objects with different constructors are not equivalent.
      if ('constructor' in a != 'constructor' in b || a.constructor != b.constructor) return false;
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], stack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    stack.pop();
    return result;
  }

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType == 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Is a given variable an arguments object?
  _.isArguments = function(obj) {
    return toString.call(obj) == '[object Arguments]';
  };
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Is a given value a function?
  _.isFunction = function(obj) {
    return toString.call(obj) == '[object Function]';
  };

  // Is a given value a string?
  _.isString = function(obj) {
    return toString.call(obj) == '[object String]';
  };

  // Is a given value a number?
  _.isNumber = function(obj) {
    return toString.call(obj) == '[object Number]';
  };

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return _.isNumber(obj) && isFinite(obj);
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    // `NaN` is the only value for which `===` is not reflexive.
    return obj !== obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value a date?
  _.isDate = function(obj) {
    return toString.call(obj) == '[object Date]';
  };

  // Is the given value a regular expression?
  _.isRegExp = function(obj) {
    return toString.call(obj) == '[object RegExp]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Has own property?
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function (n, iterator, context) {
    for (var i = 0; i < n; i++) iterator.call(context, i);
  };

  // Escape a string for HTML interpolation.
  _.escape = function(string) {
    return (''+string).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;');
  };

  // If the value of the named property is a function then invoke it;
  // otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return null;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object, ensuring that
  // they're correctly added to the OOP wrapper as well.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name){
      addToWrapper(name, _[name] = obj[name]);
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = idCounter++;
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /.^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    '\\': '\\',
    "'": "'",
    'r': '\r',
    'n': '\n',
    't': '\t',
    'u2028': '\u2028',
    'u2029': '\u2029'
  };

  for (var p in escapes) escapes[escapes[p]] = p;
  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  var unescaper = /\\(\\|'|r|n|t|u2028|u2029)/g;

  // Within an interpolation, evaluation, or escaping, remove HTML escaping
  // that had been previously added.
  var unescape = function(code) {
    return code.replace(unescaper, function(match, escape) {
      return escapes[escape];
    });
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    settings = _.defaults(settings || {}, _.templateSettings);

    // Compile the template source, taking care to escape characters that
    // cannot be included in a string literal and then unescape them in code
    // blocks.
    var source = "__p+='" + text
      .replace(escaper, function(match) {
        return '\\' + escapes[match];
      })
      .replace(settings.escape || noMatch, function(match, code) {
        return "'+\n_.escape(" + unescape(code) + ")+\n'";
      })
      .replace(settings.interpolate || noMatch, function(match, code) {
        return "'+\n(" + unescape(code) + ")+\n'";
      })
      .replace(settings.evaluate || noMatch, function(match, code) {
        return "';\n" + unescape(code) + "\n;__p+='";
      }) + "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __p='';" +
      "var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n" +
      source + "return __p;\n";

    var render = new Function(settings.variable || 'obj', '_', source);
    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for build time
    // precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' +
      source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // The OOP Wrapper
  // ---------------

  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.
  var wrapper = function(obj) { this._wrapped = obj; };

  // Expose `wrapper.prototype` as `_.prototype`
  _.prototype = wrapper.prototype;

  // Helper function to continue chaining intermediate results.
  var result = function(obj, chain) {
    return chain ? _(obj).chain() : obj;
  };

  // A method to easily add functions to the OOP wrapper.
  var addToWrapper = function(name, func) {
    wrapper.prototype[name] = function() {
      var args = slice.call(arguments);
      unshift.call(args, this._wrapped);
      return result(func.apply(_, args), this._chain);
    };
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      var wrapped = this._wrapped;
      method.apply(wrapped, arguments);
      var length = wrapped.length;
      if ((name == 'shift' || name == 'splice') && length === 0) delete wrapped[0];
      return result(wrapped, this._chain);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    wrapper.prototype[name] = function() {
      return result(method.apply(this._wrapped, arguments), this._chain);
    };
  });

  // Start chaining a wrapped Underscore object.
  wrapper.prototype.chain = function() {
    this._chain = true;
    return this;
  };

  // Extracts the result from a wrapped and chained object.
  wrapper.prototype.value = function() {
    return this._wrapped;
  };

}).call(this);

//     Backbone.js 0.9.2

//     (c) 2010-2012 Jeremy Ashkenas, DocumentCloud Inc.
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(){

  // Initial Setup
  // -------------

  // Save a reference to the global object (`window` in the browser, `global`
  // on the server).
  var root = this;

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create a local reference to slice/splice.
  var slice = Array.prototype.slice;
  var splice = Array.prototype.splice;

  // The top-level namespace. All public Backbone classes and modules will
  // be attached to this. Exported for both CommonJS and the browser.
  var Backbone;
  if (typeof exports !== 'undefined') {
    Backbone = exports;
  } else {
    Backbone = root.Backbone = {};
  }

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '0.9.2';

  // Require Underscore, if we're on the server, and it's not already present.
  var _ = root._;
  if (!_ && (typeof require !== 'undefined')) _ = require('underscore');

  // For Backbone's purposes, jQuery, Zepto, or Ender owns the `$` variable.
  var $ = root.jQuery || root.Zepto || root.ender;

  // Set the JavaScript library that will be used for DOM manipulation and
  // Ajax calls (a.k.a. the `$` variable). By default Backbone will use: jQuery,
  // Zepto, or Ender; but the `setDomLibrary()` method lets you inject an
  // alternate JavaScript library (or a mock library for testing your views
  // outside of a browser).
  Backbone.setDomLibrary = function(lib) {
    $ = lib;
  };

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // -----------------

  // Regular expression used to split event strings
  var eventSplitter = /\s+/;

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback functions
  // to an event; trigger`-ing an event fires all callbacks in succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    on: function(events, callback, context) {

      var calls, event, node, tail, list;
      if (!callback) return this;
      events = events.split(eventSplitter);
      calls = this._callbacks || (this._callbacks = {});

      // Create an immutable callback list, allowing traversal during
      // modification.  The tail is an empty object that will always be used
      // as the next node.
      while (event = events.shift()) {
        list = calls[event];
        node = list ? list.tail : {};
        node.next = tail = {};
        node.context = context;
        node.callback = callback;
        calls[event] = {tail: tail, next: list ? list.next : node};
      }

      return this;
    },

    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    off: function(events, callback, context) {
      var event, calls, node, tail, cb, ctx;

      // No events, or removing *all* events.
      if (!(calls = this._callbacks)) return;
      if (!(events || callback || context)) {
        delete this._callbacks;
        return this;
      }

      // Loop through the listed events and contexts, splicing them out of the
      // linked list of callbacks if appropriate.
      events = events ? events.split(eventSplitter) : _.keys(calls);
      while (event = events.shift()) {
        node = calls[event];
        delete calls[event];
        if (!node || !(callback || context)) continue;
        // Create a new list, omitting the indicated callbacks.
        tail = node.tail;
        while ((node = node.next) !== tail) {
          cb = node.callback;
          ctx = node.context;
          if ((callback && cb !== callback) || (context && ctx !== context)) {
            this.on(event, cb, ctx);
          }
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(events) {
      var event, node, calls, tail, args, all, rest;
      if (!(calls = this._callbacks)) return this;
      all = calls.all;
      events = events.split(eventSplitter);
      rest = slice.call(arguments, 1);

      // For each event, walk through the linked list of callbacks twice,
      // first to trigger the event, then to trigger any `"all"` callbacks.
      while (event = events.shift()) {
        if (node = calls[event]) {
          tail = node.tail;
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, rest);
          }
        }
        if (node = all) {
          tail = node.tail;
          args = [event].concat(rest);
          while ((node = node.next) !== tail) {
            node.callback.apply(node.context || this, args);
          }
        }
      }

      return this;
    }

  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Backbone.Model
  // --------------

  // Create a new model, with defined attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var defaults;
    attributes || (attributes = {});
    if (options && options.parse) attributes = this.parse(attributes);
    if (defaults = getValue(this, 'defaults')) {
      attributes = _.extend({}, defaults, attributes);
    }
    if (options && options.collection) this.collection = options.collection;
    this.attributes = {};
    this._escapedAttributes = {};
    this.cid = _.uniqueId('c');
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this.set(attributes, {silent: true});
    // Reset change tracking.
    this.changed = {};
    this._silent = {};
    this._pending = {};
    this._previousAttributes = _.clone(this.attributes);
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // A hash of attributes that have silently changed since the last time
    // `change` was called.  Will become pending attributes on the next call.
    _silent: null,

    // A hash of attributes that have changed since the last `'change'` event
    // began.
    _pending: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      var html;
      if (html = this._escapedAttributes[attr]) return html;
      var val = this.get(attr);
      return this._escapedAttributes[attr] = _.escape(val == null ? '' : '' + val);
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    set: function(key, value, options) {
      var attrs, attr, val;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }

      // Extract attributes and options.
      options || (options = {});
      if (!attrs) return this;
      if (attrs instanceof Model) attrs = attrs.attributes;
      if (options.unset) for (attr in attrs) attrs[attr] = void 0;

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      var changes = options.changes = {};
      var now = this.attributes;
      var escaped = this._escapedAttributes;
      var prev = this._previousAttributes || {};

      // For each `set` attribute...
      for (attr in attrs) {
        val = attrs[attr];

        // If the new and current value differ, record the change.
        if (!_.isEqual(now[attr], val) || (options.unset && _.has(now, attr))) {
          delete escaped[attr];
          (options.silent ? this._silent : changes)[attr] = true;
        }

        // Update or delete the current value.
        options.unset ? delete now[attr] : now[attr] = val;

        // If the new and previous value differ, record the change.  If not,
        // then remove changes for this attribute.
        if (!_.isEqual(prev[attr], val) || (_.has(now, attr) != _.has(prev, attr))) {
          this.changed[attr] = val;
          if (!options.silent) this._pending[attr] = true;
        } else {
          delete this.changed[attr];
          delete this._pending[attr];
        }
      }

      // Fire the `"change"` events.
      if (!options.silent) this.change(options);
      return this;
    },

    // Remove an attribute from the model, firing `"change"` unless you choose
    // to silence it. `unset` is a noop if the attribute doesn't exist.
    unset: function(attr, options) {
      (options || (options = {})).unset = true;
      return this.set(attr, null, options);
    },

    // Clear all attributes on the model, firing `"change"` unless you choose
    // to silence it.
    clear: function(options) {
      (options || (options = {})).unset = true;
      return this.set(_.clone(this.attributes), options);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overriden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        if (!model.set(model.parse(resp, xhr), options)) return false;
        if (success) success(model, resp);
      };
      options.error = Backbone.wrapError(options.error, model, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, value, options) {
      var attrs, current;

      // Handle both `("key", value)` and `({key: value})` -style calls.
      if (_.isObject(key) || key == null) {
        attrs = key;
        options = value;
      } else {
        attrs = {};
        attrs[key] = value;
      }
      options = options ? _.clone(options) : {};

      // If we're "wait"-ing to set changed attributes, validate early.
      if (options.wait) {
        if (!this._validate(attrs, options)) return false;
        current = _.clone(this.attributes);
      }

      // Regular saves `set` attributes before persisting to the server.
      var silentOptions = _.extend({}, options, {silent: true});
      if (attrs && !this.set(attrs, options.wait ? silentOptions : options)) {
        return false;
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      var model = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        var serverAttrs = model.parse(resp, xhr);
        if (options.wait) {
          delete options.wait;
          serverAttrs = _.extend(attrs || {}, serverAttrs);
        }
        if (!model.set(serverAttrs, options)) return false;
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      // Finish configuring and sending the Ajax request.
      options.error = Backbone.wrapError(options.error, model, options);
      var method = this.isNew() ? 'create' : 'update';
      var xhr = (this.sync || Backbone.sync).call(this, method, this, options);
      if (options.wait) this.set(current, silentOptions);
      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var triggerDestroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      if (this.isNew()) {
        triggerDestroy();
        return false;
      }

      options.success = function(resp) {
        if (options.wait) triggerDestroy();
        if (success) {
          success(model, resp);
        } else {
          model.trigger('sync', model, resp, options);
        }
      };

      options.error = Backbone.wrapError(options.error, model, options);
      var xhr = (this.sync || Backbone.sync).call(this, 'delete', this, options);
      if (!options.wait) triggerDestroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base = getValue(this, 'urlRoot') || getValue(this.collection, 'url') || urlError();
      if (this.isNew()) return base;
      return base + (base.charAt(base.length - 1) == '/' ? '' : '/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, xhr) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return this.id == null;
    },

    // Call this method to manually fire a `"change"` event for this model and
    // a `"change:attribute"` event for each changed attribute.
    // Calling this will cause all objects observing the model to update.
    change: function(options) {
      options || (options = {});
      var changing = this._changing;
      this._changing = true;

      // Silent changes become pending changes.
      for (var attr in this._silent) this._pending[attr] = true;

      // Silent changes are triggered.
      var changes = _.extend({}, options.changes, this._silent);
      this._silent = {};
      for (var attr in changes) {
        this.trigger('change:' + attr, this, this.get(attr), options);
      }
      if (changing) return this;

      // Continue firing `"change"` events while there are pending changes.
      while (!_.isEmpty(this._pending)) {
        this._pending = {};
        this.trigger('change', this, options);
        // Pending and silent changes still remain.
        for (var attr in this.changed) {
          if (this._pending[attr] || this._silent[attr]) continue;
          delete this.changed[attr];
        }
        this._previousAttributes = _.clone(this.attributes);
      }

      this._changing = false;
      return this;
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (!arguments.length) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false, old = this._previousAttributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (!arguments.length || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Check if the model is currently in a valid state. It's only possible to
    // get into an *invalid* state if you're using silent changes.
    isValid: function() {
      return !this.validate(this.attributes);
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. If a specific `error` callback has
    // been passed, call that instead of firing the general `"error"` event.
    _validate: function(attrs, options) {
      if (options.silent || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validate(attrs, options);
      if (!error) return true;
      if (options && options.error) {
        options.error(this, error, options);
      } else {
        this.trigger('error', this, error, options);
      }
      return false;
    }

  });

  // Backbone.Collection
  // -------------------

  // Provides a standard collection class for our sets of models, ordered
  // or unordered. If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, {silent: true, parse: options.parse});
  };

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Add a model, or list of models to the set. Pass **silent** to avoid
    // firing the `add` event for every new model.
    add: function(models, options) {
      var i, index, length, model, cid, id, cids = {}, ids = {}, dups = [];
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];

      // Begin by turning bare objects into model references, and preventing
      // invalid models or duplicate models from being added.
      for (i = 0, length = models.length; i < length; i++) {
        if (!(model = models[i] = this._prepareModel(models[i], options))) {
          throw new Error("Can't add an invalid model to a collection");
        }
        cid = model.cid;
        id = model.id;
        if (cids[cid] || this._byCid[cid] || ((id != null) && (ids[id] || this._byId[id]))) {
          dups.push(i);
          continue;
        }
        cids[cid] = ids[id] = model;
      }

      // Remove duplicates.
      i = dups.length;
      while (i--) {
        models.splice(dups[i], 1);
      }

      // Listen to added models' events, and index models for lookup by
      // `id` and by `cid`.
      for (i = 0, length = models.length; i < length; i++) {
        (model = models[i]).on('all', this._onModelEvent, this);
        this._byCid[model.cid] = model;
        if (model.id != null) this._byId[model.id] = model;
      }

      // Insert models into the collection, re-sorting if needed, and triggering
      // `add` events unless silenced.
      this.length += length;
      index = options.at != null ? options.at : this.models.length;
      splice.apply(this.models, [index, 0].concat(models));
      if (this.comparator) this.sort({silent: true});
      if (options.silent) return this;
      for (i = 0, length = this.models.length; i < length; i++) {
        if (!cids[(model = this.models[i]).cid]) continue;
        options.index = i;
        model.trigger('add', model, this, options);
      }
      return this;
    },

    // Remove a model, or a list of models from the set. Pass silent to avoid
    // firing the `remove` event for every model removed.
    remove: function(models, options) {
      var i, l, index, model;
      options || (options = {});
      models = _.isArray(models) ? models.slice() : [models];
      for (i = 0, l = models.length; i < l; i++) {
        model = this.getByCid(models[i]) || this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byCid[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model);
      }
      return this;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, options);
      return model;
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      model = this._prepareModel(model, options);
      this.add(model, _.extend({at: 0}, options));
      return model;
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Get a model from the set by id.
    get: function(id) {
      if (id == null) return void 0;
      return this._byId[id.id != null ? id.id : id];
    },

    // Get a model from the set by client id.
    getByCid: function(cid) {
      return cid && this._byCid[cid.cid || cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of `filter`.
    where: function(attrs) {
      if (_.isEmpty(attrs)) return [];
      return this.filter(function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      options || (options = {});
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      var boundComparator = _.bind(this.comparator, this);
      if (this.comparator.length == 1) {
        this.models = this.sortBy(boundComparator);
      } else {
        this.models.sort(boundComparator);
      }
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.map(this.models, function(model){ return model.get(attr); });
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any `add` or `remove` events. Fires `reset` when finished.
    reset: function(models, options) {
      models  || (models = []);
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i]);
      }
      this._reset();
      this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return this;
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `add: true` is passed, appends the
    // models to the collection instead of resetting.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === undefined) options.parse = true;
      var collection = this;
      var success = options.success;
      options.success = function(resp, status, xhr) {
        collection[options.add ? 'add' : 'reset'](collection.parse(resp, xhr), options);
        if (success) success(collection, resp);
      };
      options.error = Backbone.wrapError(options.error, collection, options);
      return (this.sync || Backbone.sync).call(this, 'read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      var coll = this;
      options = options ? _.clone(options) : {};
      model = this._prepareModel(model, options);
      if (!model) return false;
      if (!options.wait) coll.add(model, options);
      var success = options.success;
      options.success = function(nextModel, resp, xhr) {
        if (options.wait) coll.add(nextModel, options);
        if (success) {
          success(nextModel, resp);
        } else {
          nextModel.trigger('sync', model, resp, options);
        }
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, xhr) {
      return resp;
    },

    // Proxy to _'s chain. Can't be proxied the same way the rest of the
    // underscore methods are proxied because it relies on the underscore
    // constructor.
    chain: function () {
      return _(this.models).chain();
    },

    // Reset all internal state. Called when the collection is reset.
    _reset: function(options) {
      this.length = 0;
      this.models = [];
      this._byId  = {};
      this._byCid = {};
    },

    // Prepare a model or hash of attributes to be added to this collection.
    _prepareModel: function(model, options) {
      options || (options = {});
      if (!(model instanceof Model)) {
        var attrs = model;
        options.collection = this;
        model = new this.model(attrs, options);
        if (!model._validate(model.attributes, options)) model = false;
      } else if (!model.collection) {
        model.collection = this;
      }
      return model;
    },

    // Internal method to remove a model's ties to a collection.
    _removeReference: function(model) {
      if (this == model.collection) {
        delete model.collection;
      }
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event == 'add' || event == 'remove') && collection != this) return;
      if (event == 'destroy') {
        this.remove(model, options);
      }
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  var methods = ['forEach', 'each', 'map', 'reduce', 'reduceRight', 'find',
    'detect', 'filter', 'select', 'reject', 'every', 'all', 'some', 'any',
    'include', 'contains', 'invoke', 'max', 'min', 'sortBy', 'sortedIndex',
    'toArray', 'size', 'first', 'initial', 'rest', 'last', 'without', 'indexOf',
    'shuffle', 'lastIndexOf', 'isEmpty', 'groupBy'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      return _[method].apply(_, [this.models].concat(_.toArray(arguments)));
    };
  });

  // Backbone.Router
  // -------------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var namedParam    = /:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[-[\]{}()+?.,\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      return this;
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      var routes = [];
      for (var route in this.routes) {
        routes.unshift([route, this.routes[route]]);
      }
      for (var i = 0, l = routes.length; i < l; i++) {
        this.route(routes[i][0], routes[i][1], this[routes[i][1]]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(namedParam, '([^\/]+)')
                   .replace(splatParam, '(.*?)');
      return new RegExp('^' + route + '$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted parameters.
    _extractParameters: function(route, fragment) {
      return route.exec(fragment).slice(1);
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on URL fragments. If the
  // browser does not support `onhashchange`, falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');
  };

  // Cached regex for cleaning leading hashes and slashes .
  var routeStripper = /^[#\/]/;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(windowOverride) {
      var loc = windowOverride ? windowOverride.location : window.location;
      var match = loc.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || forcePushState) {
          fragment = window.location.pathname;
          var search = window.location.search;
          if (search) fragment += search;
        } else {
          fragment = this.getHash();
        }
      }
      if (!fragment.indexOf(this.options.root)) fragment = fragment.substr(this.options.root.length);
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({}, {root: '/'}, this.options, options);
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && window.history && window.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      if (oldIE) {
        this.iframe = $('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        $(window).bind('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        $(window).bind('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = window.location;
      var atRoot  = loc.pathname == this.options.root;

      // If we've started off with a route from a `pushState`-enabled browser,
      // but we're currently in a browser that doesn't support it...
      if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot) {
        this.fragment = this.getFragment(null, true);
        window.location.replace(this.options.root + '#' + this.fragment);
        // Return immediately as browser will do redirect to new url
        return true;

      // Or if we've started out with a hash-based route, but we're currently
      // in a browser where it could be `pushState`-based instead...
      } else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash) {
        this.fragment = this.getHash().replace(routeStripper, '');
        window.history.replaceState({}, document.title, loc.protocol + '//' + loc.host + this.options.root + this.fragment);
      }

      if (!this.options.silent) {
        return this.loadUrl();
      }
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      $(window).unbind('popstate', this.checkUrl).unbind('hashchange', this.checkUrl);
      clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current == this.fragment && this.iframe) current = this.getFragment(this.getHash(this.iframe));
      if (current == this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl() || this.loadUrl(this.getHash());
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragmentOverride) {
      var fragment = this.fragment = this.getFragment(fragmentOverride);
      var matched = _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
      return matched;
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: options};
      var frag = (fragment || '').replace(routeStripper, '');
      if (this.fragment == frag) return;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        if (frag.indexOf(this.options.root) != 0) frag = this.options.root + frag;
        this.fragment = frag;
        window.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, frag);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this.fragment = frag;
        this._updateHash(window.location, frag, options.replace);
        if (this.iframe && (frag != this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a history entry on hash-tag change.
          // When replace is true, we don't want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, frag, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        window.location.assign(this.options.root + fragment);
      }
      if (options.trigger) this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        location.replace(location.toString().replace(/(javascript:|#).*$/, '') + '#' + fragment);
      } else {
        location.hash = fragment;
      }
    }
  });

  // Backbone.View
  // -------------

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    this._configure(options || {});
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be prefered to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view from the DOM. Note that the view isn't present in the
    // DOM by default, so calling this method may be a no-op.
    remove: function() {
      this.$el.remove();
      return this;
    },

    // For small amounts of DOM Elements, where a full-blown template isn't
    // needed, use **make** to manufacture elements, one at a time.
    //
    //     var el = this.make('li', {'class': 'row'}, this.model.escape('title'));
    //
    make: function(tagName, attributes, content) {
      var el = document.createElement(tagName);
      if (attributes) $(el).attr(attributes);
      if (content) $(el).html(content);
      return el;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = (element instanceof $) ? element : $(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save'
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = getValue(this, 'events')))) return;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) throw new Error('Method "' + events[key] + '" does not exist');
        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.bind(eventName, method);
        } else {
          this.$el.delegate(selector, eventName, method);
        }
      }
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.unbind('.delegateEvents' + this.cid);
    },

    // Performs the initial configuration of a View with a set of options.
    // Keys with special meaning *(model, collection, id, className)*, are
    // attached directly to the view.
    _configure: function(options) {
      if (this.options) options = _.extend({}, this.options, options);
      for (var i = 0, l = viewOptions.length; i < l; i++) {
        var attr = viewOptions[i];
        if (options[attr]) this[attr] = options[attr];
      }
      this.options = options;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = getValue(this, 'attributes') || {};
        if (this.id) attrs.id = this.id;
        if (this.className) attrs['class'] = this.className;
        this.setElement(this.make(this.tagName, attrs), false);
      } else {
        this.setElement(this.el, false);
      }
    }

  });

  // The self-propagating extend function that Backbone classes use.
  var extend = function (protoProps, classProps) {
    var child = inherits(this, protoProps, classProps);
    child.extend = this.extend;
    return child;
  };

  // Set up inheritance for the model, collection, and view.
  Model.extend = Collection.extend = Router.extend = View.extend = extend;

  // Backbone.sync
  // -------------

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    options || (options = {});

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = getValue(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (!options.data && model && (method == 'create' || method == 'update')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(model.toJSON());
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (Backbone.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (Backbone.emulateHTTP) {
      if (type === 'PUT' || type === 'DELETE') {
        if (Backbone.emulateJSON) params.data._method = type;
        params.type = 'POST';
        params.beforeSend = function(xhr) {
          xhr.setRequestHeader('X-HTTP-Method-Override', type);
        };
      }
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !Backbone.emulateJSON) {
      params.processData = false;
    }

    // Make the request, allowing the user to override any Ajax options.
    return $.ajax(_.extend(params, options));
  };

  // Wrap an optional error callback with a fallback error event.
  Backbone.wrapError = function(onError, originalModel, options) {
    return function(model, resp) {
      resp = model === originalModel ? resp : model;
      if (onError) {
        onError(originalModel, resp, options);
      } else {
        originalModel.trigger('error', originalModel, resp, options);
      }
    };
  };

  // Helpers
  // -------

  // Shared empty constructor function to aid in prototype-chain creation.
  var ctor = function(){};

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var inherits = function(parent, protoProps, staticProps) {
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && protoProps.hasOwnProperty('constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ parent.apply(this, arguments); };
    }

    // Inherit class (static) properties from parent.
    _.extend(child, parent);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Add static properties to the constructor function, if supplied.
    if (staticProps) _.extend(child, staticProps);
    // Correctly set child's `prototype.constructor`.
    child.prototype.constructor = child;

    // Set a convenience property in case the parent's prototype is needed later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

}).call(this);

// lib/handlebars/base.js
var Handlebars = {};

Handlebars.VERSION = "1.0.beta.6";

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      for(var i=0, j=context.length; i<j; i++) {
        ret = ret + fn(context[i]);
      }
    } else {
      ret = inverse(this);
    }
    return ret;
  } else {
    return fn(context);
  }
});

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var ret = "";

  if(context && context.length > 0) {
    for(var i=0, j=context.length; i<j; i++) {
      ret = ret + fn(context[i]);
    }
  } else {
    ret = inverse(this);
  }
  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context) {
  Handlebars.log(context);
});
;
// lib/handlebars/compiler/parser.js
/* Jison generated parser */
var handlebars = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"program":4,"EOF":5,"statements":6,"simpleInverse":7,"statement":8,"openInverse":9,"closeBlock":10,"openBlock":11,"mustache":12,"partial":13,"CONTENT":14,"COMMENT":15,"OPEN_BLOCK":16,"inMustache":17,"CLOSE":18,"OPEN_INVERSE":19,"OPEN_ENDBLOCK":20,"path":21,"OPEN":22,"OPEN_UNESCAPED":23,"OPEN_PARTIAL":24,"params":25,"hash":26,"param":27,"STRING":28,"INTEGER":29,"BOOLEAN":30,"hashSegments":31,"hashSegment":32,"ID":33,"EQUALS":34,"pathSegments":35,"SEP":36,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",14:"CONTENT",15:"COMMENT",16:"OPEN_BLOCK",18:"CLOSE",19:"OPEN_INVERSE",20:"OPEN_ENDBLOCK",22:"OPEN",23:"OPEN_UNESCAPED",24:"OPEN_PARTIAL",28:"STRING",29:"INTEGER",30:"BOOLEAN",33:"ID",34:"EQUALS",36:"SEP"},
productions_: [0,[3,2],[4,3],[4,1],[4,0],[6,1],[6,2],[8,3],[8,3],[8,1],[8,1],[8,1],[8,1],[11,3],[9,3],[10,3],[12,3],[12,3],[13,3],[13,4],[7,2],[17,3],[17,2],[17,2],[17,1],[25,2],[25,1],[27,1],[27,1],[27,1],[27,1],[26,1],[31,2],[31,1],[32,3],[32,3],[32,3],[32,3],[21,1],[35,3],[35,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return $$[$0-1] 
break;
case 2: this.$ = new yy.ProgramNode($$[$0-2], $$[$0]) 
break;
case 3: this.$ = new yy.ProgramNode($$[$0]) 
break;
case 4: this.$ = new yy.ProgramNode([]) 
break;
case 5: this.$ = [$$[$0]] 
break;
case 6: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 7: this.$ = new yy.InverseNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 8: this.$ = new yy.BlockNode($$[$0-2], $$[$0-1], $$[$0]) 
break;
case 9: this.$ = $$[$0] 
break;
case 10: this.$ = $$[$0] 
break;
case 11: this.$ = new yy.ContentNode($$[$0]) 
break;
case 12: this.$ = new yy.CommentNode($$[$0]) 
break;
case 13: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 14: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 15: this.$ = $$[$0-1] 
break;
case 16: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1]) 
break;
case 17: this.$ = new yy.MustacheNode($$[$0-1][0], $$[$0-1][1], true) 
break;
case 18: this.$ = new yy.PartialNode($$[$0-1]) 
break;
case 19: this.$ = new yy.PartialNode($$[$0-2], $$[$0-1]) 
break;
case 20: 
break;
case 21: this.$ = [[$$[$0-2]].concat($$[$0-1]), $$[$0]] 
break;
case 22: this.$ = [[$$[$0-1]].concat($$[$0]), null] 
break;
case 23: this.$ = [[$$[$0-1]], $$[$0]] 
break;
case 24: this.$ = [[$$[$0]], null] 
break;
case 25: $$[$0-1].push($$[$0]); this.$ = $$[$0-1]; 
break;
case 26: this.$ = [$$[$0]] 
break;
case 27: this.$ = $$[$0] 
break;
case 28: this.$ = new yy.StringNode($$[$0]) 
break;
case 29: this.$ = new yy.IntegerNode($$[$0]) 
break;
case 30: this.$ = new yy.BooleanNode($$[$0]) 
break;
case 31: this.$ = new yy.HashNode($$[$0]) 
break;
case 32: $$[$0-1].push($$[$0]); this.$ = $$[$0-1] 
break;
case 33: this.$ = [$$[$0]] 
break;
case 34: this.$ = [$$[$0-2], $$[$0]] 
break;
case 35: this.$ = [$$[$0-2], new yy.StringNode($$[$0])] 
break;
case 36: this.$ = [$$[$0-2], new yy.IntegerNode($$[$0])] 
break;
case 37: this.$ = [$$[$0-2], new yy.BooleanNode($$[$0])] 
break;
case 38: this.$ = new yy.IdNode($$[$0]) 
break;
case 39: $$[$0-2].push($$[$0]); this.$ = $$[$0-2]; 
break;
case 40: this.$ = [$$[$0]] 
break;
}
},
table: [{3:1,4:2,5:[2,4],6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{1:[3]},{5:[1,16]},{5:[2,3],7:17,8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,19],20:[2,3],22:[1,13],23:[1,14],24:[1,15]},{5:[2,5],14:[2,5],15:[2,5],16:[2,5],19:[2,5],20:[2,5],22:[2,5],23:[2,5],24:[2,5]},{4:20,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{4:21,6:3,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,4],22:[1,13],23:[1,14],24:[1,15]},{5:[2,9],14:[2,9],15:[2,9],16:[2,9],19:[2,9],20:[2,9],22:[2,9],23:[2,9],24:[2,9]},{5:[2,10],14:[2,10],15:[2,10],16:[2,10],19:[2,10],20:[2,10],22:[2,10],23:[2,10],24:[2,10]},{5:[2,11],14:[2,11],15:[2,11],16:[2,11],19:[2,11],20:[2,11],22:[2,11],23:[2,11],24:[2,11]},{5:[2,12],14:[2,12],15:[2,12],16:[2,12],19:[2,12],20:[2,12],22:[2,12],23:[2,12],24:[2,12]},{17:22,21:23,33:[1,25],35:24},{17:26,21:23,33:[1,25],35:24},{17:27,21:23,33:[1,25],35:24},{17:28,21:23,33:[1,25],35:24},{21:29,33:[1,25],35:24},{1:[2,1]},{6:30,8:4,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],22:[1,13],23:[1,14],24:[1,15]},{5:[2,6],14:[2,6],15:[2,6],16:[2,6],19:[2,6],20:[2,6],22:[2,6],23:[2,6],24:[2,6]},{17:22,18:[1,31],21:23,33:[1,25],35:24},{10:32,20:[1,33]},{10:34,20:[1,33]},{18:[1,35]},{18:[2,24],21:40,25:36,26:37,27:38,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,38],28:[2,38],29:[2,38],30:[2,38],33:[2,38],36:[1,46]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],36:[2,40]},{18:[1,47]},{18:[1,48]},{18:[1,49]},{18:[1,50],21:51,33:[1,25],35:24},{5:[2,2],8:18,9:5,11:6,12:7,13:8,14:[1,9],15:[1,10],16:[1,12],19:[1,11],20:[2,2],22:[1,13],23:[1,14],24:[1,15]},{14:[2,20],15:[2,20],16:[2,20],19:[2,20],22:[2,20],23:[2,20],24:[2,20]},{5:[2,7],14:[2,7],15:[2,7],16:[2,7],19:[2,7],20:[2,7],22:[2,7],23:[2,7],24:[2,7]},{21:52,33:[1,25],35:24},{5:[2,8],14:[2,8],15:[2,8],16:[2,8],19:[2,8],20:[2,8],22:[2,8],23:[2,8],24:[2,8]},{14:[2,14],15:[2,14],16:[2,14],19:[2,14],20:[2,14],22:[2,14],23:[2,14],24:[2,14]},{18:[2,22],21:40,26:53,27:54,28:[1,41],29:[1,42],30:[1,43],31:39,32:44,33:[1,45],35:24},{18:[2,23]},{18:[2,26],28:[2,26],29:[2,26],30:[2,26],33:[2,26]},{18:[2,31],32:55,33:[1,56]},{18:[2,27],28:[2,27],29:[2,27],30:[2,27],33:[2,27]},{18:[2,28],28:[2,28],29:[2,28],30:[2,28],33:[2,28]},{18:[2,29],28:[2,29],29:[2,29],30:[2,29],33:[2,29]},{18:[2,30],28:[2,30],29:[2,30],30:[2,30],33:[2,30]},{18:[2,33],33:[2,33]},{18:[2,40],28:[2,40],29:[2,40],30:[2,40],33:[2,40],34:[1,57],36:[2,40]},{33:[1,58]},{14:[2,13],15:[2,13],16:[2,13],19:[2,13],20:[2,13],22:[2,13],23:[2,13],24:[2,13]},{5:[2,16],14:[2,16],15:[2,16],16:[2,16],19:[2,16],20:[2,16],22:[2,16],23:[2,16],24:[2,16]},{5:[2,17],14:[2,17],15:[2,17],16:[2,17],19:[2,17],20:[2,17],22:[2,17],23:[2,17],24:[2,17]},{5:[2,18],14:[2,18],15:[2,18],16:[2,18],19:[2,18],20:[2,18],22:[2,18],23:[2,18],24:[2,18]},{18:[1,59]},{18:[1,60]},{18:[2,21]},{18:[2,25],28:[2,25],29:[2,25],30:[2,25],33:[2,25]},{18:[2,32],33:[2,32]},{34:[1,57]},{21:61,28:[1,62],29:[1,63],30:[1,64],33:[1,25],35:24},{18:[2,39],28:[2,39],29:[2,39],30:[2,39],33:[2,39],36:[2,39]},{5:[2,19],14:[2,19],15:[2,19],16:[2,19],19:[2,19],20:[2,19],22:[2,19],23:[2,19],24:[2,19]},{5:[2,15],14:[2,15],15:[2,15],16:[2,15],19:[2,15],20:[2,15],22:[2,15],23:[2,15],24:[2,15]},{18:[2,34],33:[2,34]},{18:[2,35],33:[2,35]},{18:[2,36],33:[2,36]},{18:[2,37],33:[2,37]}],
defaultActions: {16:[2,1],37:[2,23],53:[2,21]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                var errStr = "";
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + this.terminals_[symbol] + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(), 
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START
switch($avoiding_name_collisions) {
case 0:
                                   if(yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                                   if(yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0,yy_.yyleng-1), this.begin("emu");
                                   if(yy_.yytext) return 14;
                                 
break;
case 1: return 14; 
break;
case 2: this.popState(); return 14; 
break;
case 3: return 24; 
break;
case 4: return 16; 
break;
case 5: return 20; 
break;
case 6: return 19; 
break;
case 7: return 19; 
break;
case 8: return 23; 
break;
case 9: return 23; 
break;
case 10: yy_.yytext = yy_.yytext.substr(3,yy_.yyleng-5); this.popState(); return 15; 
break;
case 11: return 22; 
break;
case 12: return 34; 
break;
case 13: return 33; 
break;
case 14: return 33; 
break;
case 15: return 36; 
break;
case 16: /*ignore whitespace*/ 
break;
case 17: this.popState(); return 18; 
break;
case 18: this.popState(); return 18; 
break;
case 19: yy_.yytext = yy_.yytext.substr(1,yy_.yyleng-2).replace(/\\"/g,'"'); return 28; 
break;
case 20: return 30; 
break;
case 21: return 30; 
break;
case 22: return 29; 
break;
case 23: return 33; 
break;
case 24: yy_.yytext = yy_.yytext.substr(1, yy_.yyleng-2); return 33; 
break;
case 25: return 'INVALID'; 
break;
case 26: return 5; 
break;
}
};
lexer.rules = [/^[^\x00]*?(?=(\{\{))/,/^[^\x00]+/,/^[^\x00]{2,}?(?=(\{\{))/,/^\{\{>/,/^\{\{#/,/^\{\{\//,/^\{\{\^/,/^\{\{\s*else\b/,/^\{\{\{/,/^\{\{&/,/^\{\{![\s\S]*?\}\}/,/^\{\{/,/^=/,/^\.(?=[} ])/,/^\.\./,/^[\/.]/,/^\s+/,/^\}\}\}/,/^\}\}/,/^"(\\["]|[^"])*"/,/^true(?=[}\s])/,/^false(?=[}\s])/,/^[0-9]+(?=[}\s])/,/^[a-zA-Z0-9_$-]+(?=[=}\s\/.])/,/^\[[^\]]*\]/,/^./,/^$/];
lexer.conditions = {"mu":{"rules":[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"INITIAL":{"rules":[0,1,26],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = handlebars;
exports.parse = function () { return handlebars.parse.apply(handlebars, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
};
;
// lib/handlebars/compiler/base.js
Handlebars.Parser = handlebars;

Handlebars.parse = function(string) {
  Handlebars.Parser.yy = Handlebars.AST;
  return Handlebars.Parser.parse(string);
};

Handlebars.print = function(ast) {
  return new Handlebars.PrintVisitor().accept(ast);
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  // override in the host environment
  log: function(level, str) {}
};

Handlebars.log = function(level, str) { Handlebars.logger.log(level, str); };
;
// lib/handlebars/compiler/ast.js
(function() {

  Handlebars.AST = {};

  Handlebars.AST.ProgramNode = function(statements, inverse) {
    this.type = "program";
    this.statements = statements;
    if(inverse) { this.inverse = new Handlebars.AST.ProgramNode(inverse); }
  };

  Handlebars.AST.MustacheNode = function(params, hash, unescaped) {
    this.type = "mustache";
    this.id = params[0];
    this.params = params.slice(1);
    this.hash = hash;
    this.escaped = !unescaped;
  };

  Handlebars.AST.PartialNode = function(id, context) {
    this.type    = "partial";

    // TODO: disallow complex IDs

    this.id      = id;
    this.context = context;
  };

  var verifyMatch = function(open, close) {
    if(open.original !== close.original) {
      throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
    }
  };

  Handlebars.AST.BlockNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "block";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.InverseNode = function(mustache, program, close) {
    verifyMatch(mustache.id, close);
    this.type = "inverse";
    this.mustache = mustache;
    this.program  = program;
  };

  Handlebars.AST.ContentNode = function(string) {
    this.type = "content";
    this.string = string;
  };

  Handlebars.AST.HashNode = function(pairs) {
    this.type = "hash";
    this.pairs = pairs;
  };

  Handlebars.AST.IdNode = function(parts) {
    this.type = "ID";
    this.original = parts.join(".");

    var dig = [], depth = 0;

    for(var i=0,l=parts.length; i<l; i++) {
      var part = parts[i];

      if(part === "..") { depth++; }
      else if(part === "." || part === "this") { this.isScoped = true; }
      else { dig.push(part); }
    }

    this.parts    = dig;
    this.string   = dig.join('.');
    this.depth    = depth;
    this.isSimple = (dig.length === 1) && (depth === 0);
  };

  Handlebars.AST.StringNode = function(string) {
    this.type = "STRING";
    this.string = string;
  };

  Handlebars.AST.IntegerNode = function(integer) {
    this.type = "INTEGER";
    this.integer = integer;
  };

  Handlebars.AST.BooleanNode = function(bool) {
    this.type = "BOOLEAN";
    this.bool = bool;
  };

  Handlebars.AST.CommentNode = function(comment) {
    this.type = "comment";
    this.comment = comment;
  };

})();;
// lib/handlebars/utils.js
Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  for (var p in tmp) {
    if (tmp.hasOwnProperty(p)) { this[p] = tmp[p]; }
  }

  this.message = tmp.message;
};
Handlebars.Exception.prototype = new Error;

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /&(?!\w+;)|[<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (typeof value === "undefined") {
        return true;
      } else if (value === null) {
        return true;
      } else if (value === false) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/compiler/compiler.js
Handlebars.Compiler = function() {};
Handlebars.JavaScriptCompiler = function() {};

(function(Compiler, JavaScriptCompiler) {
  Compiler.OPCODE_MAP = {
    appendContent: 1,
    getContext: 2,
    lookupWithHelpers: 3,
    lookup: 4,
    append: 5,
    invokeMustache: 6,
    appendEscaped: 7,
    pushString: 8,
    truthyOrFallback: 9,
    functionOrFallback: 10,
    invokeProgram: 11,
    invokePartial: 12,
    push: 13,
    assignToHash: 15,
    pushStringParam: 16
  };

  Compiler.MULTI_PARAM_OPCODES = {
    appendContent: 1,
    getContext: 1,
    lookupWithHelpers: 2,
    lookup: 1,
    invokeMustache: 3,
    pushString: 1,
    truthyOrFallback: 1,
    functionOrFallback: 1,
    invokeProgram: 3,
    invokePartial: 1,
    push: 1,
    assignToHash: 1,
    pushStringParam: 1
  };

  Compiler.DISASSEMBLE_MAP = {};

  for(var prop in Compiler.OPCODE_MAP) {
    var value = Compiler.OPCODE_MAP[prop];
    Compiler.DISASSEMBLE_MAP[value] = prop;
  }

  Compiler.multiParamSize = function(code) {
    return Compiler.MULTI_PARAM_OPCODES[Compiler.DISASSEMBLE_MAP[code]];
  };

  Compiler.prototype = {
    compiler: Compiler,

    disassemble: function() {
      var opcodes = this.opcodes, opcode, nextCode;
      var out = [], str, name, value;

      for(var i=0, l=opcodes.length; i<l; i++) {
        opcode = opcodes[i];

        if(opcode === 'DECLARE') {
          name = opcodes[++i];
          value = opcodes[++i];
          out.push("DECLARE " + name + " = " + value);
        } else {
          str = Compiler.DISASSEMBLE_MAP[opcode];

          var extraParams = Compiler.multiParamSize(opcode);
          var codes = [];

          for(var j=0; j<extraParams; j++) {
            nextCode = opcodes[++i];

            if(typeof nextCode === "string") {
              nextCode = "\"" + nextCode.replace("\n", "\\n") + "\"";
            }

            codes.push(nextCode);
          }

          str = str + " " + codes.join(" ");

          out.push(str);
        }
      }

      return out.join("\n");
    },

    guid: 0,

    compile: function(program, options) {
      this.children = [];
      this.depths = {list: []};
      this.options = options;

      // These changes will propagate to the other compiler components
      var knownHelpers = this.options.knownHelpers;
      this.options.knownHelpers = {
        'helperMissing': true,
        'blockHelperMissing': true,
        'each': true,
        'if': true,
        'unless': true,
        'with': true,
        'log': true
      };
      if (knownHelpers) {
        for (var name in knownHelpers) {
          this.options.knownHelpers[name] = knownHelpers[name];
        }
      }

      return this.program(program);
    },

    accept: function(node) {
      return this[node.type](node);
    },

    program: function(program) {
      var statements = program.statements, statement;
      this.opcodes = [];

      for(var i=0, l=statements.length; i<l; i++) {
        statement = statements[i];
        this[statement.type](statement);
      }
      this.isSimple = l === 1;

      this.depths.list = this.depths.list.sort(function(a, b) {
        return a - b;
      });

      return this;
    },

    compileProgram: function(program) {
      var result = new this.compiler().compile(program, this.options);
      var guid = this.guid++;

      this.usePartial = this.usePartial || result.usePartial;

      this.children[guid] = result;

      for(var i=0, l=result.depths.list.length; i<l; i++) {
        depth = result.depths.list[i];

        if(depth < 2) { continue; }
        else { this.addDepth(depth - 1); }
      }

      return guid;
    },

    block: function(block) {
      var mustache = block.mustache;
      var depth, child, inverse, inverseGuid;

      var params = this.setupStackForMustache(mustache);

      var programGuid = this.compileProgram(block.program);

      if(block.program.inverse) {
        inverseGuid = this.compileProgram(block.program.inverse);
        this.declare('inverse', inverseGuid);
      }

      this.opcode('invokeProgram', programGuid, params.length, !!mustache.hash);
      this.declare('inverse', null);
      this.opcode('append');
    },

    inverse: function(block) {
      var params = this.setupStackForMustache(block.mustache);

      var programGuid = this.compileProgram(block.program);

      this.declare('inverse', programGuid);

      this.opcode('invokeProgram', null, params.length, !!block.mustache.hash);
      this.declare('inverse', null);
      this.opcode('append');
    },

    hash: function(hash) {
      var pairs = hash.pairs, pair, val;

      this.opcode('push', '{}');

      for(var i=0, l=pairs.length; i<l; i++) {
        pair = pairs[i];
        val  = pair[1];

        this.accept(val);
        this.opcode('assignToHash', pair[0]);
      }
    },

    partial: function(partial) {
      var id = partial.id;
      this.usePartial = true;

      if(partial.context) {
        this.ID(partial.context);
      } else {
        this.opcode('push', 'depth0');
      }

      this.opcode('invokePartial', id.original);
      this.opcode('append');
    },

    content: function(content) {
      this.opcode('appendContent', content.string);
    },

    mustache: function(mustache) {
      var params = this.setupStackForMustache(mustache);

      this.opcode('invokeMustache', params.length, mustache.id.original, !!mustache.hash);

      if(mustache.escaped && !this.options.noEscape) {
        this.opcode('appendEscaped');
      } else {
        this.opcode('append');
      }
    },

    ID: function(id) {
      this.addDepth(id.depth);

      this.opcode('getContext', id.depth);

      this.opcode('lookupWithHelpers', id.parts[0] || null, id.isScoped || false);

      for(var i=1, l=id.parts.length; i<l; i++) {
        this.opcode('lookup', id.parts[i]);
      }
    },

    STRING: function(string) {
      this.opcode('pushString', string.string);
    },

    INTEGER: function(integer) {
      this.opcode('push', integer.integer);
    },

    BOOLEAN: function(bool) {
      this.opcode('push', bool.bool);
    },

    comment: function() {},

    // HELPERS
    pushParams: function(params) {
      var i = params.length, param;

      while(i--) {
        param = params[i];

        if(this.options.stringParams) {
          if(param.depth) {
            this.addDepth(param.depth);
          }

          this.opcode('getContext', param.depth || 0);
          this.opcode('pushStringParam', param.string);
        } else {
          this[param.type](param);
        }
      }
    },

    opcode: function(name, val1, val2, val3) {
      this.opcodes.push(Compiler.OPCODE_MAP[name]);
      if(val1 !== undefined) { this.opcodes.push(val1); }
      if(val2 !== undefined) { this.opcodes.push(val2); }
      if(val3 !== undefined) { this.opcodes.push(val3); }
    },

    declare: function(name, value) {
      this.opcodes.push('DECLARE');
      this.opcodes.push(name);
      this.opcodes.push(value);
    },

    addDepth: function(depth) {
      if(depth === 0) { return; }

      if(!this.depths[depth]) {
        this.depths[depth] = true;
        this.depths.list.push(depth);
      }
    },

    setupStackForMustache: function(mustache) {
      var params = mustache.params;

      this.pushParams(params);

      if(mustache.hash) {
        this.hash(mustache.hash);
      }

      this.ID(mustache.id);

      return params;
    }
  };

  JavaScriptCompiler.prototype = {
    // PUBLIC API: You can override these methods in a subclass to provide
    // alternative compiled forms for name lookup and buffering semantics
    nameLookup: function(parent, name, type) {
      if (/^[0-9]+$/.test(name)) {
        return parent + "[" + name + "]";
      } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
        return parent + "." + name;
      }
      else {
        return parent + "['" + name + "']";
      }
    },

    appendToBuffer: function(string) {
      if (this.environment.isSimple) {
        return "return " + string + ";";
      } else {
        return "buffer += " + string + ";";
      }
    },

    initializeBuffer: function() {
      return this.quotedString("");
    },

    namespace: "Handlebars",
    // END PUBLIC API

    compile: function(environment, options, context, asObject) {
      this.environment = environment;
      this.options = options || {};

      this.name = this.environment.name;
      this.isChild = !!context;
      this.context = context || {
        programs: [],
        aliases: { self: 'this' },
        registers: {list: []}
      };

      this.preamble();

      this.stackSlot = 0;
      this.stackVars = [];

      this.compileChildren(environment, options);

      var opcodes = environment.opcodes, opcode;

      this.i = 0;

      for(l=opcodes.length; this.i<l; this.i++) {
        opcode = this.nextOpcode(0);

        if(opcode[0] === 'DECLARE') {
          this.i = this.i + 2;
          this[opcode[1]] = opcode[2];
        } else {
          this.i = this.i + opcode[1].length;
          this[opcode[0]].apply(this, opcode[1]);
        }
      }

      return this.createFunctionContext(asObject);
    },

    nextOpcode: function(n) {
      var opcodes = this.environment.opcodes, opcode = opcodes[this.i + n], name, val;
      var extraParams, codes;

      if(opcode === 'DECLARE') {
        name = opcodes[this.i + 1];
        val  = opcodes[this.i + 2];
        return ['DECLARE', name, val];
      } else {
        name = Compiler.DISASSEMBLE_MAP[opcode];

        extraParams = Compiler.multiParamSize(opcode);
        codes = [];

        for(var j=0; j<extraParams; j++) {
          codes.push(opcodes[this.i + j + 1 + n]);
        }

        return [name, codes];
      }
    },

    eat: function(opcode) {
      this.i = this.i + opcode.length;
    },

    preamble: function() {
      var out = [];

      // this register will disambiguate helper lookup from finding a function in
      // a context. This is necessary for mustache compatibility, which requires
      // that context functions in blocks are evaluated by blockHelperMissing, and
      // then proceed as if the resulting value was provided to blockHelperMissing.
      this.useRegister('foundHelper');

      if (!this.isChild) {
        var namespace = this.namespace;
        var copies = "helpers = helpers || " + namespace + ".helpers;";
        if(this.environment.usePartial) { copies = copies + " partials = partials || " + namespace + ".partials;"; }
        out.push(copies);
      } else {
        out.push('');
      }

      if (!this.environment.isSimple) {
        out.push(", buffer = " + this.initializeBuffer());
      } else {
        out.push("");
      }

      // track the last context pushed into place to allow skipping the
      // getContext opcode when it would be a noop
      this.lastContext = 0;
      this.source = out;
    },

    createFunctionContext: function(asObject) {
      var locals = this.stackVars;
      if (!this.isChild) {
        locals = locals.concat(this.context.registers.list);
      }

      if(locals.length > 0) {
        this.source[1] = this.source[1] + ", " + locals.join(", ");
      }

      // Generate minimizer alias mappings
      if (!this.isChild) {
        var aliases = []
        for (var alias in this.context.aliases) {
          this.source[1] = this.source[1] + ', ' + alias + '=' + this.context.aliases[alias];
        }
      }

      if (this.source[1]) {
        this.source[1] = "var " + this.source[1].substring(2) + ";";
      }

      // Merge children
      if (!this.isChild) {
        this.source[1] += '\n' + this.context.programs.join('\n') + '\n';
      }

      if (!this.environment.isSimple) {
        this.source.push("return buffer;");
      }

      var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];

      for(var i=0, l=this.environment.depths.list.length; i<l; i++) {
        params.push("depth" + this.environment.depths.list[i]);
      }

      if (asObject) {
        params.push(this.source.join("\n  "));

        return Function.apply(this, params);
      } else {
        var functionSource = 'function ' + (this.name || '') + '(' + params.join(',') + ') {\n  ' + this.source.join("\n  ") + '}';
        Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
        return functionSource;
      }
    },

    appendContent: function(content) {
      this.source.push(this.appendToBuffer(this.quotedString(content)));
    },

    append: function() {
      var local = this.popStack();
      this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
      if (this.environment.isSimple) {
        this.source.push("else { " + this.appendToBuffer("''") + " }");
      }
    },

    appendEscaped: function() {
      var opcode = this.nextOpcode(1), extra = "";
      this.context.aliases.escapeExpression = 'this.escapeExpression';

      if(opcode[0] === 'appendContent') {
        extra = " + " + this.quotedString(opcode[1][0]);
        this.eat(opcode);
      }

      this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")" + extra));
    },

    getContext: function(depth) {
      if(this.lastContext !== depth) {
        this.lastContext = depth;
      }
    },

    lookupWithHelpers: function(name, isScoped) {
      if(name) {
        var topStack = this.nextStack();

        this.usingKnownHelper = false;

        var toPush;
        if (!isScoped && this.options.knownHelpers[name]) {
          toPush = topStack + " = " + this.nameLookup('helpers', name, 'helper');
          this.usingKnownHelper = true;
        } else if (isScoped || this.options.knownHelpersOnly) {
          toPush = topStack + " = " + this.nameLookup('depth' + this.lastContext, name, 'context');
        } else {
          this.register('foundHelper', this.nameLookup('helpers', name, 'helper'));
          toPush = topStack + " = foundHelper || " + this.nameLookup('depth' + this.lastContext, name, 'context');
        }

        toPush += ';';
        this.source.push(toPush);
      } else {
        this.pushStack('depth' + this.lastContext);
      }
    },

    lookup: function(name) {
      var topStack = this.topStack();
      this.source.push(topStack + " = (" + topStack + " === null || " + topStack + " === undefined || " + topStack + " === false ? " +
        topStack + " : " + this.nameLookup(topStack, name, 'context') + ");");
    },

    pushStringParam: function(string) {
      this.pushStack('depth' + this.lastContext);
      this.pushString(string);
    },

    pushString: function(string) {
      this.pushStack(this.quotedString(string));
    },

    push: function(name) {
      this.pushStack(name);
    },

    invokeMustache: function(paramSize, original, hasHash) {
      this.populateParams(paramSize, this.quotedString(original), "{}", null, hasHash, function(nextStack, helperMissingString, id) {
        if (!this.usingKnownHelper) {
          this.context.aliases.helperMissing = 'helpers.helperMissing';
          this.context.aliases.undef = 'void 0';
          this.source.push("else if(" + id + "=== undef) { " + nextStack + " = helperMissing.call(" + helperMissingString + "); }");
          if (nextStack !== id) {
            this.source.push("else { " + nextStack + " = " + id + "; }");
          }
        }
      });
    },

    invokeProgram: function(guid, paramSize, hasHash) {
      var inverse = this.programExpression(this.inverse);
      var mainProgram = this.programExpression(guid);

      this.populateParams(paramSize, null, mainProgram, inverse, hasHash, function(nextStack, helperMissingString, id) {
        if (!this.usingKnownHelper) {
          this.context.aliases.blockHelperMissing = 'helpers.blockHelperMissing';
          this.source.push("else { " + nextStack + " = blockHelperMissing.call(" + helperMissingString + "); }");
        }
      });
    },

    populateParams: function(paramSize, helperId, program, inverse, hasHash, fn) {
      var needsRegister = hasHash || this.options.stringParams || inverse || this.options.data;
      var id = this.popStack(), nextStack;
      var params = [], param, stringParam, stringOptions;

      if (needsRegister) {
        this.register('tmp1', program);
        stringOptions = 'tmp1';
      } else {
        stringOptions = '{ hash: {} }';
      }

      if (needsRegister) {
        var hash = (hasHash ? this.popStack() : '{}');
        this.source.push('tmp1.hash = ' + hash + ';');
      }

      if(this.options.stringParams) {
        this.source.push('tmp1.contexts = [];');
      }

      for(var i=0; i<paramSize; i++) {
        param = this.popStack();
        params.push(param);

        if(this.options.stringParams) {
          this.source.push('tmp1.contexts.push(' + this.popStack() + ');');
        }
      }

      if(inverse) {
        this.source.push('tmp1.fn = tmp1;');
        this.source.push('tmp1.inverse = ' + inverse + ';');
      }

      if(this.options.data) {
        this.source.push('tmp1.data = data;');
      }

      params.push(stringOptions);

      this.populateCall(params, id, helperId || id, fn, program !== '{}');
    },

    populateCall: function(params, id, helperId, fn, program) {
      var paramString = ["depth0"].concat(params).join(", ");
      var helperMissingString = ["depth0"].concat(helperId).concat(params).join(", ");

      var nextStack = this.nextStack();

      if (this.usingKnownHelper) {
        this.source.push(nextStack + " = " + id + ".call(" + paramString + ");");
      } else {
        this.context.aliases.functionType = '"function"';
        var condition = program ? "foundHelper && " : ""
        this.source.push("if(" + condition + "typeof " + id + " === functionType) { " + nextStack + " = " + id + ".call(" + paramString + "); }");
      }
      fn.call(this, nextStack, helperMissingString, id);
      this.usingKnownHelper = false;
    },

    invokePartial: function(context) {
      params = [this.nameLookup('partials', context, 'partial'), "'" + context + "'", this.popStack(), "helpers", "partials"];

      if (this.options.data) {
        params.push("data");
      }

      this.pushStack("self.invokePartial(" + params.join(", ") + ");");
    },

    assignToHash: function(key) {
      var value = this.popStack();
      var hash = this.topStack();

      this.source.push(hash + "['" + key + "'] = " + value + ";");
    },

    // HELPERS

    compiler: JavaScriptCompiler,

    compileChildren: function(environment, options) {
      var children = environment.children, child, compiler;

      for(var i=0, l=children.length; i<l; i++) {
        child = children[i];
        compiler = new this.compiler();

        this.context.programs.push('');     // Placeholder to prevent name conflicts for nested children
        var index = this.context.programs.length;
        child.index = index;
        child.name = 'program' + index;
        this.context.programs[index] = compiler.compile(child, options, this.context);
      }
    },

    programExpression: function(guid) {
      if(guid == null) { return "self.noop"; }

      var child = this.environment.children[guid],
          depths = child.depths.list;
      var programParams = [child.index, child.name, "data"];

      for(var i=0, l = depths.length; i<l; i++) {
        depth = depths[i];

        if(depth === 1) { programParams.push("depth0"); }
        else { programParams.push("depth" + (depth - 1)); }
      }

      if(depths.length === 0) {
        return "self.program(" + programParams.join(", ") + ")";
      } else {
        programParams.shift();
        return "self.programWithDepth(" + programParams.join(", ") + ")";
      }
    },

    register: function(name, val) {
      this.useRegister(name);
      this.source.push(name + " = " + val + ";");
    },

    useRegister: function(name) {
      if(!this.context.registers[name]) {
        this.context.registers[name] = true;
        this.context.registers.list.push(name);
      }
    },

    pushStack: function(item) {
      this.source.push(this.nextStack() + " = " + item + ";");
      return "stack" + this.stackSlot;
    },

    nextStack: function() {
      this.stackSlot++;
      if(this.stackSlot > this.stackVars.length) { this.stackVars.push("stack" + this.stackSlot); }
      return "stack" + this.stackSlot;
    },

    popStack: function() {
      return "stack" + this.stackSlot--;
    },

    topStack: function() {
      return "stack" + this.stackSlot;
    },

    quotedString: function(str) {
      return '"' + str
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r') + '"';
    }
  };

  var reservedWords = (
    "break else new var" +
    " case finally return void" +
    " catch for switch while" +
    " continue function this with" +
    " default if throw" +
    " delete in try" +
    " do instanceof typeof" +
    " abstract enum int short" +
    " boolean export interface static" +
    " byte extends long super" +
    " char final native synchronized" +
    " class float package throws" +
    " const goto private transient" +
    " debugger implements protected volatile" +
    " double import public let yield"
  ).split(" ");

  var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};

  for(var i=0, l=reservedWords.length; i<l; i++) {
    compilerWords[reservedWords[i]] = true;
  }

  JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
    if(!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
      return true;
    }
    return false;
  }

})(Handlebars.Compiler, Handlebars.JavaScriptCompiler);

Handlebars.precompile = function(string, options) {
  options = options || {};

  var ast = Handlebars.parse(string);
  var environment = new Handlebars.Compiler().compile(ast, options);
  return new Handlebars.JavaScriptCompiler().compile(environment, options);
};

Handlebars.compile = function(string, options) {
  options = options || {};

  var compiled;
  function compile() {
    var ast = Handlebars.parse(string);
    var environment = new Handlebars.Compiler().compile(ast, options);
    var templateSpec = new Handlebars.JavaScriptCompiler().compile(environment, options, undefined, true);
    return Handlebars.template(templateSpec);
  }

  // Template is only compiled on first use and cached after that point.
  return function(context, options) {
    if (!compiled) {
      compiled = compile();
    }
    return compiled.call(this, context, options);
  };
};
;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop
    };

    return function(context, options) {
      options = options || {};
      return templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial);
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;

/* ===================================================
 * bootstrap-transition.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd'
            ,  'msTransition'     : 'MSTransitionEnd'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);/* ==========================================================
 * bootstrap-alert.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);/* ============================================================
 * bootstrap-button.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);/* ==========================================================
 * bootstrap-carousel.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide')

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (typeof option == 'string' || (option = options.slide)) data[option]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-collapse.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function ( e ) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $(target).collapse(option)
    })
  })

}(window.jQuery);/* ============================================================
 * bootstrap-dropdown.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle="dropdown"]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , selector
        , isActive

      if ($this.is('.disabled, :disabled')) return

      selector = $this.attr('data-target')

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      $parent = $(selector)
      $parent.length || ($parent = $this.parent())

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) $parent.toggleClass('open')

      return false
    }

  }

  function clearMenus() {
    $(toggle).parent().removeClass('open')
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html').on('click.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown', '.dropdown form', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
  })

}(window.jQuery);/* =========================================================
 * bootstrap-modal.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */


!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (content, options) {
    this.options = options
    this.$element = $(content)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        escape.call(this)
        backdrop.call(this, function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element.addClass('in')

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        escape.call(this)

        this.$element.removeClass('in')

        $.support.transition && this.$element.hasClass('fade') ?
          hideWithTransition.call(this) :
          hideModal.call(this)
      }

  }


 /* MODAL PRIVATE METHODS
  * ===================== */

  function hideWithTransition() {
    var that = this
      , timeout = setTimeout(function () {
          that.$element.off($.support.transition.end)
          hideModal.call(that)
        }, 500)

    this.$element.one($.support.transition.end, function () {
      clearTimeout(timeout)
      hideModal.call(that)
    })
  }

  function hideModal(that) {
    this.$element
      .hide()
      .trigger('hidden')

    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this
      , animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      if (this.options.backdrop != 'static') {
        this.$backdrop.click($.proxy(this.hide, this))
      }

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      doAnimate ?
        this.$backdrop.one($.support.transition.end, callback) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop.one($.support.transition.end, $.proxy(removeBackdrop, this)) :
        removeBackdrop.call(this)

    } else if (callback) {
      callback()
    }
  }

  function removeBackdrop() {
    this.$backdrop.remove()
    this.$backdrop = null
  }

  function escape() {
    var that = this
    if (this.isShown && this.options.keyboard) {
      $(document).on('keyup.dismiss.modal', function ( e ) {
        e.which == 27 && that.hide()
      })
    } else if (!this.isShown) {
      $(document).off('keyup.dismiss.modal')
    }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      e.preventDefault()
      $target.modal(option)
    })
  })

}(window.jQuery);/* ===========================================================
 * bootstrap-tooltip.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger != 'manual') {
        eventIn  = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , isHTML: function(text) {
      // html string detection logic adapted from jQuery
      return typeof text != 'string'
        || ( text.charAt(0) === "<"
          && text.charAt( text.length - 1 ) === ">"
          && text.length >= 3
        ) || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(text)
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function ( element, options ) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.isHTML(title) ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.isHTML(content) ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);/* =============================================================
 * bootstrap-scrollspy.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */


!function ($) {

  "use strict"; // jshint ;_;


  /* SCROLLSPY CLASS DEFINITION
   * ========================== */

  function ScrollSpy( element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu'))  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);/* ========================================================
 * bootstrap-tab.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */


!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function ( element ) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);/* =============================================================
 * bootstrap-typeahead.js v2.0.4
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */


!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var that = this
        , items
        , q

      this.query = this.$element.val()

      if (!this.query) {
        return this.shown ? this.hide() : this
      }

      items = $.grep(this.source, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keypress, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , keypress: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          if (e.type != 'keydown') break
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  }

  $.fn.typeahead.Constructor = Typeahead


 /* TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
(function(){
  if (typeof this.$ === 'undefined') {
    throw new Error('jquery.js/zepto.js required to run Thorax');
  } else {
    if (!$.fn.forEach) {
      // support jquery/zepto iterators
      $.fn.forEach = $.fn.each;
     }
  }

  if (typeof this._ === 'undefined') {
    throw new Error('Underscore.js required to run Thorax');
  }

  if (typeof this.Backbone === 'undefined') {
    throw new Error('Backbone.js required to run Thorax');
  }

var handlebarsExtension = 'handlebars',
    handlebarsExtensionRegExp = new RegExp('\\.' + handlebarsExtension + '$'),
    layoutCidAttributeName = 'data-layout-cid',
    viewNameAttributeName = 'data-view-name',
    viewCidAttributeName = 'data-view-cid',
    callMethodAttributeName = 'data-call-method',
    viewPlaceholderAttributeName = 'data-view-tmp',
    modelCidAttributeName = 'data-model-cid',
    modelNameAttributeName = 'data-model-name',
    collectionCidAttributeName = 'data-collection-cid',
    collectionNameAttributeName = 'data-collection-name',
    collectionEmptyAttributeName = 'data-collection-empty',
    partialCidAttributeName = 'data-partial-cid',
    partialPlaceholderAttributeName = 'data-partial-tmp',
    oldBackboneView = Backbone.View,
    //android scrollTo(0, 0) shows url bar, scrollTo(0, 1) hides it
    minimumScrollYOffset = (navigator.userAgent.toLowerCase().indexOf("android") > -1) ? 1 : 0,
    ELEMENT_NODE_TYPE = 1;
function getValue(object, prop) {
  if (!(object && object[prop])) {
    return null;
  }
  return _.isFunction(object[prop]) ? object[prop]() : object[prop];
}

//'selector' is not present in $('<p></p>')
//TODO: investigage a better detection method
function is$(obj) {
  return typeof obj === 'object' && ('length' in obj);
}
//Backbone.View constructor doesn't provide everything we need
//so create a new one
var _viewsIndexedByCid = {};
var View = function(options) {
  this.cid = _.uniqueId('view');
  _viewsIndexedByCid[this.cid] = this;
  this._boundCollectionsByCid = {};
  this._views = {};
  this._partials = {};
  this._renderCount = 0;
  this._configure(options || {});
  this._ensureElement();
  this.delegateEvents();
  this.trigger('initialize:before', options);
  this.initialize.apply(this, arguments);
  this.trigger('initialize:after', options);
};

View.extend = function() {
  var child = Backbone.View.extend.apply(this, arguments);
  child.mixins = _.clone(this.mixins);
  cloneEvents(this, child, 'events');
  cloneEvents(this.events, child.events, 'model');
  cloneEvents(this.events, child.events, 'collection');
  child.instance = (function() {
    var instance;
    return function(options) {
      if (!instance) {
        instance = new child(options);
      } else if (options) {
        _.extend(instance, options);
        if (options.model) {
          instance.setModel(model);
        }
      }
      return instance;
    };
  })();
  return child;
};

View.create = function(options) {
  return new this(options);
};

function cloneEvents(source, target, key) {
  source[key] = _.clone(target[key]);
  //need to deep clone events array
  _.each(source[key], function(value, _key) {
    if (_.isArray(value)) {
      target[key][_key] = _.clone(value);
    }
  });
}

_.extend(View.prototype, Backbone.View.prototype, {
  _configure: function(options) {
    //this.options is removed in Thorax.View, we merge passed
    //properties directly with the view and template context
    _.extend(this, options || {});

    //compile a string if it is set as this.template
    if (typeof this.template === 'string') {
      this.template = Handlebars.compile(this.template);
    } else if (this.name && !this.template) {
      //fetch the template 
      this.template = Thorax.registry.template(this.name, null, true);
    }
        
    //will be called again by Backbone.View(), after _configure() is complete but safe to call twice
    this._ensureElement();

    //model and collection events
    bindModelAndCollectionEvents.call(this, this.constructor.events);
    if (this.events) {
      bindModelAndCollectionEvents.call(this, this.events);
    }

    //mixins
    for (var i = 0; i < this.constructor.mixins.length; ++i) {
      applyMixin.call(this, this.constructor.mixins[i]);
    }
    if (this.mixins) {
      for (var i = 0; i < this.mixins.length; ++i) {
        applyMixin.call(this, this.mixins[i]);
      }
    }
  },

  _ensureElement : function() {
    Backbone.View.prototype._ensureElement.call(this);
    (this.el[0] || this.el).setAttribute(viewNameAttributeName, this.name || this.cid);
    (this.el[0] || this.el).setAttribute(viewCidAttributeName, this.cid);      
  },

  _shouldFetch: function(model_or_collection, options) {
    var url = (
      (!model_or_collection.collection && getValue(model_or_collection, 'urlRoot')) ||
      (model_or_collection.collection && getValue(model_or_collection.collection, 'url')) ||
      (!model_or_collection.collection && model_or_collection._byCid && model_or_collection._byId && getValue(model_or_collection, 'url'))
    );
    return url && options.fetch && (
      typeof model_or_collection.isPopulated === 'undefined' || !model_or_collection.isPopulated()
    );
  },

  destroy: function() {
    this.freeze();
    this.trigger('destroyed');
    this.off();
    this._events = {};
    this._boundCollectionsByCid = {};
    this.el = null;
    this.collection = null;
    this.model = null;
    delete _viewsIndexedByCid[this.cid];
    //destroy child views
    for (var id in this._views || {}) {
      if (this._views[id].destroy) {
        this._views[id].destroy();
      }
      this._views[id] = null;
    }
  }
});

View.prototype.mixin = function(name) {
  if (!this._appliedMixins) {
    this._appliedMixins = [];
  }
  if (this._appliedMixins.indexOf(name) == -1) {
    this._appliedMixins.push(name);
    if (typeof name === 'function') {
      name.call(this);
    } else {
      var mixin = Thorax.registry.Mixins[name];
      _.extend(this, mixin[1]);
      //mixin callback may be an array of [callback, arguments]
      if (_.isArray(mixin[0])) {
        mixin[0][0].apply(this, mixin[0][1]);
      } else {
        mixin[0].apply(this, _.toArray(arguments).slice(1));
      }
    }
  }
};

_.extend(View, {
  registerMixin: function(name, callback, methods) {
    Thorax.registry.Mixins[name] = [callback, methods];
  },
  mixins: [],
  mixin: function(mixin) {
    this.mixins.push(mixin);
  }
});

function applyMixin(mixin) {
  if (_.isArray(mixin)) {
    this.mixin.apply(this, mixin);
  } else {
    this.mixin(mixin);
  }
}

var internalViewEvents = {};

_.extend(View.prototype, {
  //allow events hash to specify view, collection and model events
  //as well as DOM events. Merges Thorax.View.events with this.events
  delegateEvents: function(events) {
    this.undelegateEvents && this.undelegateEvents();
    //bindModelAndCollectionEvents on this.constructor.events and this.events
    //done in _configure
    this.registerEvents(this.constructor.events);
    if (this.events) {
      this.registerEvents(this.events);
    }
    if (events) {
      this.registerEvents(events);
      bindModelAndCollectionEvents.call(this, events);
    }
  },

  registerEvents: function(events) {
    processEvents.call(this, events).forEach(this._addEvent, this);
  },

  //params may contain:
  //- name
  //- originalName
  //- selector
  //- type "view" || "DOM"
  //- handler
  _addEvent: function(params) {
    if (params.type === 'view') {
      this.on(params.name, params.handler, this);
    } else {
      var boundHandler = containHandlerToCurentView(bindEventHandler.call(this, params.handler), this.cid);
      if (params.selector) {
        //TODO: determine why collection views and some nested views
        //need defered event delegation 
        if (typeof jQuery !== 'undefined' && $ === jQuery) {
          _.defer(_.bind(function() {
            this.$el.delegate(params.selector, params.name, boundHandler);
          }, this));
        } else {
          this.$el.delegate(params.selector, params.name, boundHandler);
        }
      } else {
        this.$el.on(params.name, boundHandler);
      }
    }
  },

  freeze: function(options) {
    this._frozen = true;
    options = _.extend({
      dom: true,
      model: true,
      partials: true
    }, options || {});
    if (options.model && this.model) {
      this._events.model.forEach(function(event) {
        this.model.off(event[0], event[1]);
      }, this);
    }
    if (options.partials) {
      _.each(this._partials, function(partial, cid) {
        partial.freeze();
      });
    }
    if (options.dom) {
      this.undelegateEvents();
    }
  }
});

_.extend(View, {
  //events for all views
  events: {
    model: {},
    collection: {}
  },
  registerEvents: function(events) {
    for(var name in events) {
      if (name === 'model' || name === 'collection') {
        for (var _name in events[name]) {
          addEvent(this.events[name], _name, events[name][_name]);
        }
      } else {
        addEvent(this.events, name, events[name]);
      }
    }
  }
});

function containHandlerToCurentView(handler, cid) {
  return function(event) {
    if ($(event.target).closest('[' + viewNameAttributeName + ']').attr(viewCidAttributeName) == cid) {
      handler(event);
    }
  }
}

var domEvents = [
  'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout',
  'touchstart', 'touchend', 'touchmove',
  'click', 'dblclick',
  'keyup', 'keydown', 'keypress',
  'submit', 'change',
  'focus', 'blur'
];

function bindEventHandler(callback) {
  var method = typeof callback === 'function' ? callback : this[callback];
  if (!method) {
    throw new Error('Event "' + callback + '" does not exist');
  }
  return _.bind(method, this);
}

function processEvents(events) {
  if (_.isFunction(events)) {
    events = events.call(this);
  }
  var processedEvents = [];
  for (var name in events) {
    if (name !== 'model' && name !== 'collection') {
      if (name.match(/,/)) {
        name.split(/,/).forEach(function(fragment) {
          processEventItem.call(this, fragment.replace(/(^[\s]+|[\s]+$)/g, ''), events[name], processedEvents);
        }, this);
      } else {
        processEventItem.call(this, name, events[name], processedEvents);
      }
    }
  }
  return processedEvents;
}

function processEventItem(name, handler, target) {
  if (_.isArray(handler)) {
    for (var i = 0; i < handler.length; ++i) {
      target.push(eventParamsFromEventItem.call(this, name, handler[i]));
    }
  } else {
    target.push(eventParamsFromEventItem.call(this, name, handler));
  }
}

function addEvent(target, name, handler) {
  if (!target[name]) {
    target[name] = [];
  }
  if (_.isArray(handler)) {
    for (var i = 0; i < handler.length; ++i) {
      target[name].push(handler[i]);
    }
  } else {
    target[name].push(handler);
  }
}

var eventSplitter = /^(\S+)(?:\s+(.+))?/;

function eventParamsFromEventItem(name, handler) {
  var params = {
    originalName: name,
    handler: typeof handler === 'string' ? this[handler] : handler
  };
  var match = eventSplitter.exec(name);
  params.name = match[1];
  if (isDOMEvent(params.name)) {
    params.type = 'DOM';
    params.name += '.delegateEvents' + this.cid;
    params.selector = match[2];
  } else {
    params.type = 'view';
  }
  return params;
}

function isDOMEvent(name) {
  return !(!name.match(/\s+/) && domEvents.indexOf(name) === -1);
}

//model/collection events, to be bound/unbound on setModel/setCollection
function processModelOrCollectionEvent(events, type) {
  for (var _name in events[type] || {}) {
    if (_.isArray(events[type][_name])) {
      for (var i = 0; i < events[type][_name].length; ++i) {
        this._events[type].push([_name, bindEventHandler.call(this, events[type][_name][i])]);
      }
    } else {
      this._events[type].push([_name, bindEventHandler.call(this, events[type][_name])]);
    }
  }
}

function bindModelAndCollectionEvents(events) {
  if (!this._events) {
    this._events = {
      model: [],
      collection: []
    };
  }
  processModelOrCollectionEvent.call(this, events, 'model');
  processModelOrCollectionEvent.call(this, events, 'collection');
}


internalViewEvents.model = {
  error: function(model, errors){
    if (this._modelOptions.errors) {
      this.trigger('error', errors);
    }
  },
  change: function() {
    this._onModelChange();
  }
};

_.extend(View.prototype, {
  setModel: function(model, options) {
    var oldModel = this.model;

    if (oldModel) {
      this._events.model.forEach(function(event) {
        oldModel.off(event[0], event[1]);
      }, this);
    }

    if (model) {
      this.$el.attr(modelCidAttributeName, model.cid);
      if (model.name) {
        this.$el.attr(modelNameAttributeName, model.name);
      }
      this.model = model;
      this.setModelOptions(options);
      if (this._frozen) {
        return this;
      }
      this._events.model.forEach(function(event) {
        this.model.on(event[0], event[1]);
      }, this);

      this.model.trigger('set', this.model, oldModel);
  
      if (this._shouldFetch(this.model, this._modelOptions)) {
        var success = this._modelOptions.success;
        this._loadModel(this.model, this._modelOptions);
      } else {
        //want to trigger built in event handler (render() + populate())
        //without triggering event on model
        this._onModelChange();
      }
    } else {
      this._modelOptions = false;
      this.model = false;
      this._onModelChange();
      this.$el.removeAttr(modelCidAttributeName);
      this.$el.attr(modelNameAttributeName);
    }

    return this;
  },

  _onModelChange: function() {
    if (!this._modelOptions || (this._modelOptions && this._modelOptions.render)) {
      this.render();
    }
  },

  _loadModel: function(model, options) {
    model.fetch(options);
  },

  setModelOptions: function(options) {
    if (!this._modelOptions) {
      this._modelOptions = {
        fetch: true,
        success: false,
        render: true,
        populate: true,
        errors: true
      };
    }
    _.extend(this._modelOptions, options || {});
    return this._modelOptions;
  }
});

_.extend(View.prototype, {
  render: function(output) {
    destroyPartials.call(this);
    if (typeof output === 'undefined' || (!_.isElement(output) && !is$(output) && !(output && output.el) && typeof output !== 'string' && typeof output !== 'function')) {
      if (!this.template) {
        //if the name was set after the view was created try one more time to fetch a template
        if (this.name) {
          this.template = Thorax.registry.template(this.name, null, true);
        }
        if (!this.template) {
          throw new Error('View ' + (this.name || this.cid) + '.render() was called with no content and no template set on the view.');
        }
      }
      output = this.renderTemplate(this.template, this._getContext(this.model));
    } else if (typeof output === 'function') {
      output = this.renderTemplate(output, this._getContext(this.model));
    }
    //accept a view, string, Handlebars.SafeString or DOM element
    this.html((output && output.el) || (output && output.string) || output);
    ++this._renderCount;
    this.trigger('rendered');
    return output;
  },

  context: function(model) {
    return model ? model.attributes : {};
  },

  _getContext: function(model) {
    if (typeof this.context === 'function') {
      return this.context(model);
    } else {
      var context = _.extend({}, (model && model.attributes) || {});
      _.each(this.context, function(value, key) {
        context[key] = value;
      }, this);
      return context;
    }
  },

  renderTemplate: function(file, data, ignoreErrors) {
    var template;
    data = getTemplateContext.call(this, data);
    if (typeof file === 'function') {
      template = file;
    } else {
      template = this._loadTemplate(file);
    }
    if (!template) {
      if (ignoreErrors) {
        return ''
      } else {
        throw new Error('Unable to find template ' + file);
      }
    } else {
      return template(data);
    }
  },

  _loadTemplate: function(file, ignoreErrors) {
    return Thorax.registry.template(file, null, ignoreErrors);
  },

  html: function(html) {
    if (typeof html === 'undefined') {
      return this.el.innerHTML;
    } else {
      var element = this.$el.html(html);
      //TODO: find better solution for problem of partials embedding views embedding partials embedding....
      appendPartials.call(this);
      appendViews.call(this);
      appendPartials.call(this);
      return element;
    }
  }
});

function ensureRendered() {
  !this._renderCount && this.render();
}

function getTemplateContext(data) {
  return _.extend({}, this, data || {}, {
    cid: _.uniqueId('t'),
    _view: this
  });
}

var Partial = function(cid, view, options) {
  this.cid = cid;
  this.view = view;
  this.fn = options.fn;
  this.inverse = options.inverse;
  this.options = options.hash || {};
  this._eventArguments = [];
  this._ensureElement();
};

_.extend(Partial.prototype, Backbone.Events, {
  _ensureElement: function() {
    var htmlAttributes = View.htmlAttributesFromOptions(this.options);
    delete htmlAttributes.tag;
    delete htmlAttributes.tagName;
    htmlAttributes[partialCidAttributeName] = this.cid;
    this.el = Backbone.View.prototype.make.call(this, this.options.tagName || this.options.tag || 'div', htmlAttributes);
    this.$el = $(this.el);
  },
  html: function(html) {
    if (typeof html === 'undefined') {
      return this.el.innerHTML;
    } else {
      //html may be a SafeString, so call toString()
      var element = this.$el.html(html.toString());
      //TODO: find better solution for problem of partials embedding views embedding partials embedding....
      appendPartials.call(this.view, this.el);
      appendViews.call(this.view, this.el);
      appendPartials.call(this.view, this.el);
      return element;
    }
  },
  addEvent: function(target, eventName, handler, context) {
    this._eventArguments.push([target, eventName, handler, context]);
    return target.on(eventName, handler, context);
  },
  render: function(options) {
    this.html(this.fn(this.context(options)));
  },
  freeze: function() {
    this.trigger('freeze');
    this._eventArguments.forEach(function(args) {
      args[0].off(args[1], args[2], args[3]);
    });
  },
  destroy: function() {
    this.freeze();
    this.trigger('destroyed');
    this.off();
  },
  context: function(options) {
    return getTemplateContext.call(this.view, _.extend(this.view._getContext(this.view.model), options || {}));
  }
});

_.extend(View.prototype, {
  partial: function(options) {
    var cid = _.uniqueId('partial');
    return new Partial(cid, this, options || {});
  }
});

View.registerPartialHelper = function(name, callback) {
  var callbacks = [];
  var helper = View.registerHelper(name, function() {
    var args = _.toArray(arguments),
        options = args.pop(),
        partial = this._view.partial(options);
    args.push(partial);
    this._view._partials[partial.cid] = partial;
    callbacks.forEach(function(injectedCallback) {
      injectedCallback.apply(this, args);
    }, this);
    var htmlAttributes = View.htmlAttributesFromOptions(options.hash);;
    htmlAttributes[partialPlaceholderAttributeName] = partial.cid;
    callback.apply(this, args);
    return new Handlebars.SafeString(View.tag(htmlAttributes, ''));
  });
  helper.addCallback = function(injectedCallback) {
    callbacks.push(injectedCallback);
  }
  return helper;
};

//called from View.prototype.html()
function appendPartials(scope) {
  _.toArray($(scope || this.el).find('[' + partialPlaceholderAttributeName + ']')).forEach(function(el) {
    var cid = el.getAttribute(partialPlaceholderAttributeName),
        partial = this._partials[cid];
    if (partial) {
      el.parentNode.insertBefore(partial.el, el);
      el.parentNode.removeChild(el);
    }
  }, this);
}

function destroyPartials() {
  _.each(this._partials, function(partial, cid) {
    partial.destroy();
  });
  this._partials = {};
}

_.extend(View, {
  registerHelper: function(name, callback) {
    Handlebars.registerHelper(name, callback);
    return callback;
  },
  expandToken: function(input, scope) {
    if (input && input.indexOf && input.indexOf('{{') >= 0) {
      var re = /(?:\{?[^{]+)|(?:\{\{([^}]+)\}\})/g,
          match,
          ret = [];
      function deref(token, scope) {
        var segments = token.split('.'),
            len = segments.length;
        for (var i = 0; scope && i < len; i++) {
          if (segments[i] !== 'this') {
            scope = scope[segments[i]];
          }
        }
        return scope;
      }
      while (match = re.exec(input)) {
        if (match[1]) {
          var params = match[1].split(/\s+/);
          if (params.length > 1) {
            var helper = params.shift();
            params = params.map(function(param) { return deref(param, scope); });
            if (Handlebars.helpers[helper]) {
              ret.push(Handlebars.helpers[helper].apply(scope, params));
            } else {
              // If the helper is not defined do nothing
              ret.push(match[0]);
            }
          } else {
            ret.push(deref(params[0], scope));
          }
        } else {
          ret.push(match[0]);
        }
      }
      input = ret.join('');
    }
    return input;
  },
  tag: function(attributes, content, scope) {
    var htmlAttributes = _.clone(attributes),
        tag = htmlAttributes.tag || htmlAttributes.tagName || 'div';
    if (htmlAttributes.tag) {
      delete htmlAttributes.tag;
    }
    if (htmlAttributes.tagName) {
      delete htmlAttributes.tagName;
    }
    if (htmlAttributes.call) {
      htmlAttributes[callMethodAttributeName] = htmlAttributes.call;
      delete htmlAttributes.tagName;
    }
    return '<' + tag + ' ' + _.map(htmlAttributes, function(value, key) {
      if (typeof value === 'undefined') {
        return '';
      }
      var formattedValue = value;
      if (scope) {
        formattedValue = View.expandToken(value, scope);
      }
      return key + '="' + Handlebars.Utils.escapeExpression(formattedValue) + '"';
    }).join(' ') + '>' + (content || '') + '</' + tag + '>';
  },
  htmlAttributesFromOptions: function(options) {
    var htmlAttributes = {};
    if (options.tag) {
      htmlAttributes.tag = options.tag;
    }
    if (options.tagName) {
      htmlAttributes.tagName = options.tagName;
    }
    if (options['class']) {
      htmlAttributes['class'] = options['class'];
    }
    if (options.id) {
      htmlAttributes.id = options.id;
    }
    return htmlAttributes
  }
});

View.registerHelper('super', function() {
  var parent = this._view.constructor && this._view.constructor.__super__;
  if (parent) {
    var template = parent.template;
    if (!template) { 
      if (!parent.name) {
        throw new Error('Cannot use super helper when parent has no name or template.');
      }
      template = Thorax.registry.template(parent.name);
    }
    if (typeof template === 'string') {
      template = Handlebars.compile(template);
    }
    return new Handlebars.SafeString(template(this));
  } else {
    return '';
  }
});

View.registerHelper('template', function(name, options) {
  var context = _.extend({}, this, options ? options.hash : {});
  var output = View.prototype.renderTemplate.call(this._view, name, context);
  return new Handlebars.SafeString(output);
});

View.registerHelper('layout', function(options) {
  options.hash[layoutCidAttributeName] = this._view.cid;
  return new Handlebars.SafeString(View.tag.call(this, options.hash, null, this));
});

var paramMatcher = /:(\w+)/g;
View.registerHelper('url', function(url) {
  var matches = url.match(paramMatcher),
      context = this;
  if (matches) {
    url = url.replace(paramMatcher, function(match, key) {
      return context[key] ? getValue(context, key) : match;
    });
  }
  url = View.expandToken(url, context);
  return (Backbone.history._hasPushState ? Backbone.history.options.root : '#') + url;
});

View.registerHelper('button', function(method, options) {
  options.hash.tag = options.hash.tag || options.hash.tagName || 'button';
  options.hash[callMethodAttributeName] = method;
  return new Handlebars.SafeString(View.tag.call(this, options.hash, options.fn ? options.fn(this) : '', this));
});

View.registerHelper('link', function(url, options) {
  options.hash.tag = options.hash.tag || options.hash.tagName || 'a';
  options.hash.href = Handlebars.helpers.url.call(this, url);
  options.hash[callMethodAttributeName] = '_anchorClick';
  return new Handlebars.SafeString(View.tag.call(this, options.hash, options.fn ? options.fn(this) : '', this));
});

internalViewEvents['click [' + callMethodAttributeName + ']'] = function(event) {
  var methodName = $(event.target).attr(callMethodAttributeName);
  this[methodName].call(this, event);
};

View.prototype._anchorClick = function(event) {
  var target = $(event.currentTarget),
      href = target.attr('href');
  // Route anything that starts with # or / (excluding //domain urls)
  if (href && (href[0] === '#' || (href[0] === '/' && href[1] !== '/'))) {
    Backbone.history.navigate(href, {
      trigger: true
    });
    event.preventDefault();
  }
};
var viewTemplateOverrides = {};
View.registerHelper('view', function(view, options) {
  if (!view) {
    return '';
  }
  var instance = getViewInstance(view, options ? options.hash : {}),
      placeholder_id = instance.cid + '-' + _.uniqueId('placeholder');
  this._view._views[instance.cid] = instance;
  if (options.fn) {
    viewTemplateOverrides[placeholder_id] = options.fn;
  }
  var htmlAttributes = View.htmlAttributesFromOptions(options.hash);
  htmlAttributes[viewPlaceholderAttributeName] = placeholder_id;
  return new Handlebars.SafeString(View.tag.call(this, htmlAttributes));
});

function getViewInstance(name, attributes) {
  if (typeof name === 'string') {
    var klass = Thorax.registry.view(name);
    return klass.cid ? _.extend(klass, attributes || {}) : new klass(attributes);
  } else if (typeof name === 'function') {
    return new name(attributes);
  } else {
    return name;
  }
}

//called from View.prototype.html()
function appendViews(scope) {
  if (!this._views) {
    return;
  }
  _.toArray($(scope || this.el).find('[' + viewPlaceholderAttributeName + ']')).forEach(function(el) {
    var placeholder_id = el.getAttribute(viewPlaceholderAttributeName),
        cid = placeholder_id.replace(/\-placeholder\d+$/, ''),
        view = this._views[cid];
    if (view) {
      //see if the {{#view}} helper declared an override for the view
      //if not, ensure the view has been rendered at least once
      if (viewTemplateOverrides[placeholder_id]) {
        view.render(viewTemplateOverrides[placeholder_id](getTemplateContext.call(view)));
      } else {
        ensureRendered.call(view);
      }
      el.parentNode.insertBefore(view.el, el);
      el.parentNode.removeChild(el);
    }
  }, this);
}


internalViewEvents.collection = {
  add: function(partial, model, collection) {
    var collectionElement = partial.$el,
        collectionOptions = partial.options;
    if (collection.length === 1) {
      if(collectionElement.length) {
        //note that this is $.empty() and not renderEmpty or other collection functionality
        collectionElement.removeAttr(collectionEmptyAttributeName);
        collectionElement.empty();
      }
    }
    if (collectionElement.length) {
      var index = collection.indexOf(model);
      if (!collectionOptions.filter || collectionOptions.filter &&
        (typeof collectionOptions.filter === 'string'
            ? this[collectionOptions.filter]
            : collectionOptions.filter).call(this, model, index)
        ) {
        this.appendItem(partial, collection, model, index);
      }
    }
  },
  remove: function(partial, model, collection) {
    var collectionElement = partial.$el;
    collectionElement.find('[' + modelCidAttributeName + '="' + model.cid + '"]').remove();
    for (var cid in this._views) {
      if (this._views[cid].model && this._views[cid].model.cid === model.cid) {
        this._views[cid].destroy();
        delete this._views[cid];
        break;
      }
    }
    if (collection.length === 0) {
      if (collectionElement.length) {
        collectionElement.attr(collectionEmptyAttributeName, true);
        appendEmpty.call(this, partial, collection);
      }
    }
  },
  reset: function(partial, collection) {
    onCollectionReset.call(this, partial, collection);
  },
  error: function(partial, collection, message) {
    if (partial.options.errors) {
      this.trigger('error', message);
    }
  }
};

View.registerPartialHelper('collection', function(collection, partial) {
  //DEPRECATION: backwards compatibility with < 1.3
  if (arguments.length === 1) {
    partial = collection;
    collection = this._view.collection;
  }
  //end DEPRECATION
  if (collection) {
    _.extend(partial.options, {
      'item-template': partial.fn && partial.fn !== Handlebars.VM.noop ? partial.fn : partial.options['item-template'],
      'empty-template': partial.inverse && partial.inverse !== Handlebars.VM.noop ? partial.inverse : partial.options['empty-template'],
      'item-view': partial.options['item-view'],
      'empty-view': partial.options['empty-view'],
      filter: partial.options['filter']
    });
    this._view._bindCollection(collection, partial);
    partial.$el.attr(collectionCidAttributeName, collection.cid);
    if (collection.name) {
      partial.$el.attr(collectionNameAttributeName, collection.name);
    }
  }
});

_.extend(View.prototype, {
  setCollectionOptions: function(collection, options) {
    return _.extend({
      fetch: true,
      success: false,
      errors: true
    }, options || {});
  },

  _bindCollection: function(collection, partial) {
    if (this._frozen) {
      return this;
    }
    if (collection) {
      collection.cid = collection.cid || _.uniqueId('collection');
      if (!this._boundCollectionsByCid[collection.cid]) {
        this._boundCollectionsByCid[collection.cid] = collection;
      }
      partial.options = this.setCollectionOptions(collection, partial.options);
      var collectionEvents = this._events.collection;
      collectionEvents.forEach(function(event) {
        function collectionEventCallback() {
          var args = _.toArray(arguments);
          args.unshift(partial);
          return event[1].apply(this, args);
        }
        partial.addEvent(collection, event[0], collectionEventCallback);
      });
      collection.trigger('set', collection);
  
      if (this._shouldFetch(collection, partial.options)) {
        this._loadCollection(collection, partial.options);
      } else {
        //want to trigger built in event handler (render())
        //without triggering event on collection
        onCollectionReset.call(this, partial, collection);
      }

      //if we rendered with item views model changes will be observed
      //by the generated item view but if we rendered with templates
      //then model changes need to be bound as nothing is watching
      if (!partial.options['item-view']) {
        partial.addEvent(collection, 'change', function(model) {
          partial.$el.find('[' + modelCidAttributeName + '="' + model.cid +'"]').remove();
          this.appendItem(partial, collection, model, collection.indexOf(model));
        }, this);
      }
    }
  
    return this;
  },

  _loadCollection: function(collection, options) {
    collection.fetch(options);
  },

  //appendItem(partial, collection, model [,index])
  //appendItem(partial, collection, html_string, index)
  //appendItem(partial, collection, view, index)
  appendItem: function(partial, collection, model, index, options) {
    //empty item
    if (!model) {
      return;
    }

    var item_view, collectionElement = partial.$el;

    options = options || {};

    //if index argument is a view
    if (index && index.el) {
      index = collectionElement.children().indexOf(index.el) + 1;
    }

    //if argument is a view, or html string
    if (model.el || typeof model === 'string') {
      item_view = model;
      model = false;
    } else {
      index = index || collection.indexOf(model) || 0;
      item_view = (this.renderItem || renderItem).call(this, partial, model, index, collection);
    }

    if (item_view) {

      if (item_view.cid) {
        this._views[item_view.cid] = item_view;
      }

      //if the renderer's output wasn't contained in a tag, wrap it in a div
      //plain text, or a mixture of top level text nodes and element nodes
      //will get wrapped
      if (typeof item_view === 'string' && !item_view.match(/^\s*\</m)) {
        item_view = '<div>' + item_view + '</div>'
      }

      var item_element = item_view.el ? [item_view.el] : _.filter($(item_view), function(node) {
        //filter out top level whitespace nodes
        return node.nodeType === ELEMENT_NODE_TYPE;
      });

      if (model) {
        $(item_element).attr(modelCidAttributeName, model.cid);
      }

      var previous_model = index > 0 ? collection.at(index - 1) : false;
      if (!previous_model) {
        collectionElement.prepend(item_element);
      } else {
        //use last() as appendItem can accept multiple nodes from a template
        collectionElement.find('[' + modelCidAttributeName + '="' + previous_model.cid + '"]').last().after(item_element);
      }

      appendViews.call(this, item_element);

      if (!options.silent) {
        this.trigger('rendered:item', partial, collection, model, item_element, index);
      }
    }
    return item_view;
  }
});

function onCollectionReset(partial, collection) {
  (this.renderCollection || renderCollection).call(this, partial, collection);
}

function renderCollection(partial, collection) {
  //DEPRECATION: backwards compatibility with < 1.3
  if (!collection) {
    collection = this.collection;
  }
  //end DEPRECATION
  var collectionElement = partial.$el;
  collectionElement.empty();
  if (collection.isEmpty()) {
    collectionElement.attr(collectionEmptyAttributeName, true);
    appendEmpty.call(this, partial, collection);
  } else {
    var collectionOptions = partial.options;
    collectionElement.removeAttr(collectionEmptyAttributeName);
    collection.forEach(function(item, i) {
      if (!collectionOptions.filter || collectionOptions.filter &&
        (typeof collectionOptions.filter === 'string'
            ? this[collectionOptions.filter]
            : collectionOptions.filter).call(this, item, i)
        ) {
        this.appendItem(partial, collection, item, i);
      }
    }, this);
  }
  this.trigger('rendered:collection', partial, collection);
}

function renderEmpty(partial, collection) {
  if (!collection) {
    collection = this.collection;
  }
  var collectionOptions = partial.options,
      context = (this.emptyContext && this.emptyContext()) || {};
  if (collectionOptions['empty-view']) {
    var view = getViewInstance(collectionOptions['empty-view'], context);
    if (collectionOptions['empty-template']) {
      view.render(view.renderTemplate(collectionOptions['empty-template'], context));
    } else {
      view.render();
    }
    return view;
  } else {
    var emptyTemplate = collectionOptions['empty-template'] || (this.name && this._loadTemplate(this.name + '-empty', true));
    return emptyTemplate && this.renderTemplate(emptyTemplate, context);
  }
}

function renderItem(partial, model, i, collection) {
  if (!collection) {
    collection = this.collection;
  }
  var collectionOptions = partial.options;
  if (collectionOptions['item-view']) {
    var viewOptions = {
      model: model
    };
    //itemContext deprecated
    if (this.itemContext) {
      viewOptions.context = this.itemContext;
    }
    if (collectionOptions['item-template']) {
      viewOptions.template = collectionOptions['item-template'];
    }
    var view = getViewInstance(collectionOptions['item-view'], viewOptions);
    ensureRendered.call(view);
    return view;
  } else {
    var itemTemplate = collectionOptions['item-template'] || (this.name && this._loadTemplate(this.name + '-item', true));
    if (!itemTemplate) {
      throw new Error('collection helper in View: ' + (this.name || this.cid) + ' requires an item template.');
    }
    return this.renderTemplate(itemTemplate, (this.itemContext && this.itemContext(model, i)) || model.attributes)
  }
}

function appendEmpty(partial, collection) {
  var collectionElement = partial.$el;
  collectionElement.empty();
  var emptyContent = (this.renderEmpty || renderEmpty).call(this, partial, collection);
  emptyContent && this.appendItem(partial, collection, emptyContent, 0, {
    silent: true
  });
  this.trigger('rendered:empty', partial, collection);
}

View.registerPartialHelper('empty', function(collection, partial) {
  var empty, noArgument;
  if (arguments.length === 1) {
    partial = collection;
    collection = false;
    noArgument = true;
  }

  function callback(context) {
    if (noArgument) {
      empty = !partial.view.model || (partial.view.model && !partial.view.model.isEmpty());
    } else if (!collection) {
      empty = true;
    } else {
      empty = collection.isEmpty();
    }
    if (empty) {
      partial.view.trigger('rendered:empty', collection);
      return partial.fn(context);
    } else {
      return partial.inverse(context);
    }
  }

  //no model binding is necessary as model.set() will cause re-render
  if (collection) {
    function collectionRemoveCallback() {
      if (collection.length === 0) {
        partial.html(callback(partial.context()));
      }
    }
    function collectionAddCallback() {
      if (collection.length === 1) {
        partial.html(callback(partial.context()));
      }
    }
    function collectionResetCallback() {
      partial.html(callback(partial.context()));
    }

    partial.addEvent(collection, 'remove', collectionRemoveCallback);
    partial.addEvent(collection, 'add', collectionAddCallback);
    partial.addEvent(collection, 'reset', collectionResetCallback);
  }

  partial.html(callback(this));
});

internalViewEvents['initialize:after'] = function(options) {
  //bind model or collection if passed to constructor
  if (options && options.model) {
    this.setModel(options.model);
  }
};

View.registerEvents(internalViewEvents);

_.extend(View.prototype, {
  scrollTo: function(x, y) {
    y = y || minimumScrollYOffset;
    function _scrollTo() {
      window.scrollTo(x, y);
    }
    if ($.os && $.os.ios) {
      // a defer is required for ios
      _.defer(_scrollTo);
    } else {
      _scrollTo();
    }
    return [x, y];
  },

  scrollToTop: function() {
    // android will use height of 1 because of minimumScrollYOffset
    return this.scrollTo(0, 0);
  }
});

function generateRenderLayout(templateAttributeName) {
  templateAttributeName = templateAttributeName || 'template';
  return function(output) {
    //TODO: fixme, lumbar inserts templates after JS, most of the time this is fine
    //but Application will be created in init.js (unlike most views)
    //so need to put this here so the template will be picked up
    var layoutTemplate;
    if (this.name) {
      layoutTemplate = Thorax.registry.template(this.name, null, true);
    }
    //a template is optional in a layout
    if (output || this[templateAttributeName] || layoutTemplate) {
      //but if present, it must have embedded an element containing layoutCidAttributeName 
      var response = View.prototype.render.call(this, output || this[templateAttributeName] || layoutTemplate);
      ensureLayoutViewsTargetElement.call(this);
      return response;
    } else {
      ensureLayoutCid.call(this);
    }
  }
}

var Layout = View.extend({
  render: generateRenderLayout(),
  setView: function(view, options) {
    options = _.extend({
      scroll: true,
      destroy: true
    }, options || {});
    if (typeof view === 'string') {
      view = new (Thorax.registry.view(view));
    }
    ensureRendered.call(this);
    var old_view = this._view;
    if (view == old_view){
      return false;
    }
    if (options.destroy) {
      view._shouldDestroyOnNextSetView = true;
    }
    this.trigger('change:view:start', view, old_view, options);
    old_view && old_view.trigger('deactivated', options);
    view && view.trigger('activated', options);
    if (old_view && old_view.el && old_view.el.parentNode) {
      old_view.$el.remove();
    }
    //make sure the view has been rendered at least once
    view && ensureRendered.call(view);
    view && getLayoutViewsTargetElement.call(this).appendChild(view.el);
    options.scroll && window.scrollTo(0, minimumScrollYOffset);
    this._view = view;
    old_view && old_view._shouldDestroyOnNextSetView && old_view.destroy();
    this._view && this._view.trigger('ready', options);
    this.trigger('change:view:end', view, old_view, options);
    return view;
  },

  getView: function() {
    return this._view;
  }
});

function ensureLayoutCid() {
  ++this._renderCount;
  //set the layoutCidAttributeName on this.$el if there was no template
  this.$el.attr(layoutCidAttributeName, this.cid);
}

function ensureLayoutViewsTargetElement() {
  if (!this.$('[' + layoutCidAttributeName + '="' + this.cid + '"]')[0]) {
    throw new Error();
  }
}

function getLayoutViewsTargetElement() {
  return this.$('[' + layoutCidAttributeName + '="' + this.cid + '"]')[0] || this.el[0] || this.el;
}

var Router = Backbone.Router.extend({
  initialize: function() {
    Backbone.history.on('route', onRoute, this);
    this.on('destroy', function() {
      Backbone.history.off('route', onRoute, this);
    });
  },
  route: function(route, name, callback) {
    //add a route:before event that is fired before the callback is called
    return Backbone.Router.prototype.route.call(this, route, name, function() {
      this.trigger.apply(this, ['route:before', name].concat(Array.prototype.slice.call(arguments)));
      return callback.apply(this, arguments);
    });
  }
});

function onRoute(router, name) {
  if (this === router) {
    this.trigger.apply(this, ['route'].concat(Array.prototype.slice.call(arguments, 1)));
  }
}

var ViewController = Layout.extend();
_.extend(ViewController.prototype, Router.prototype, {
  initialize: function() {
    Router.prototype.initialize.call(this);
    //set the ViewController as the view on the parent
    //if a parent was specified
    this.on('route:before', function(router, name) {
      if (this.parent) {
        if (this.parent.getView() !== this) {
          this.parent.setView(this, {
            destroy: false
          });
        }
      }
    }, this);
    this._bindRoutes();
  }
});

var Application = ViewController.extend({
  name: 'application',
  initialize: function(options) {
    //ensure backbone history has started
    Backbone.history || (Backbone.history = new Backbone.History);

    //"template" method has special meaning on application object
    //as it is a registry provider
    if (this.template != Application.prototype.template) {
      this._template = this.template;
      this.template = Application.prototype.template;
      if (typeof this._template === 'string') {
        this._template = Handlebars.compile(this._template);
      }
    }
    this.template = Application.prototype.template;

    _.extend(this, options || {}, {
      Layout: Layout.extend({}),
      View: View.extend({}),
      Model: Model.extend({}),
      Collection: Collection.extend({}),
      Router: Router.extend({}),
      ViewController: ViewController.extend({})
    });
  },
  //model also has special meaning to the Application object
  //don't bind it as it is the registry function
  setModel:function(){},
  render: generateRenderLayout('_template'),
  start: function(options) {
    //if this is a lumbar app, setup the module loader
    this.initBackboneLoader && this.initBackboneLoader();
    //application and other templates included by the base
    //application may want to use the link and url helpers
    //which use hasPushstate, etc. so setup history, then
    //render, then dispatch
    if (!Backbone.History.started) {
      Backbone.history.start(_.extend({
        silent: true
      }, options || {}));
    }
    this.render();
    this.trigger('ready', options);
    Backbone.history.loadUrl();
  }
});

var Model = Backbone.Model.extend({
  isEmpty: function() {
    return this.isPopulated();
  },
  isPopulated: function() {
    // We are populated if we have attributes set
    var attributes = _.clone(this.attributes);
    var defaults = _.isFunction(this.defaults) ? this.defaults() : (this.defaults || {});
    for (var default_key in defaults) {
      if (attributes[default_key] != defaults[default_key]) {
        return true;
      }
      delete attributes[default_key];
    }
    var keys = _.keys(attributes);
    return keys.length > 1 || (keys.length === 1 && keys[0] !== 'id');
  }
}, {
  create: function(options) {
    return new this(options);
  }
});

Model.extend = function() {
  var child = Backbone.Model.extend.apply(this, arguments);
  child.instance = (function() {
    var instance;
    return function(options) {
      if (!instance) {
        instance = new child(options);
      } else if (options) {
        instance.set(options);
      }
      return instance;
    };
  })();
  return child;
};

var Collection = Backbone.Collection.extend({
  model: Model,
  isEmpty: function() {
    if (this.length > 0) {
      return false;
    } else {
      return this.length === 0 && this.isPopulated();
    }
  },
  isPopulated: function() {
    return this._fetched || this.length > 0 || (!this.length && !getValue(this, 'url'));
  },
  fetch: function(options) {
    options = options || {};
    var success = options.success;
    options.success = function(collection, response) {
      collection._fetched = true;
      success && success(collection, response);
    };
    return Backbone.Collection.prototype.fetch.apply(this, arguments);
  },
  reset: function(models, options) {
    this._fetched = !!models;
    return Backbone.Collection.prototype.reset.call(this, models, options);
  }
}, {
  create: function(models, options) {
    return new this(models, options);
  }
});

Collection.extend = function() {
  var child = Backbone.Collection.extend.apply(this, arguments);
  child.instance = (function() {
    var instance;
    return function(models, options) {
      if (!instance) {
        instance = new child(models, options);
      } else {
        if (models) {
          instance.reset(models);
        }
        if (options) {
          _.extend(instance, options);
        }
      }
      return instance;
    };
  })();
  return child;
};
//create the Thorax object
var Thorax;
this.Thorax = Thorax = {
  Layout: Layout,
  View: View,
  Model: Model,
  Collection: Collection,
  Router: Router,
  Application: Application,
  templatePathPrefix: ''
};

Thorax.registry = {
  templates: {},
  Views: {},
  Mixins: {},
  Models: {},
  Collections: {},
  Routers: {}
};

_.each({
  view: 'Views',
  model: 'Models',
  collection: 'Collections',
  template: 'templates',
  router: 'Routers'
}, function(registryName, methodName) {
  var registry = Thorax.registry[registryName];
  Thorax.registry[methodName] = function(name, value, ignoreErrors) {
    if (methodName === 'template') {
      //append templatePathPrefix if getting
      if (!value) {
        name = Thorax.templatePathPrefix + name;
      }
      //always remove handlebars extension wether setting or getting
      name = name.replace(handlebarsExtensionRegExp, '');
      //append the template path prefix if it is missing
      if (Thorax.templatePathPrefix && Thorax.templatePathPrefix.length && name && name.substr(0, Thorax.templatePathPrefix.length) !== Thorax.templatePathPrefix) {
        name = Thorax.templatePathPrefix + name;
      }
    }
    if (typeof value !== 'string' && !value) {
      if (!registry[name] && !ignoreErrors) {
        throw new Error(methodName + ': ' + name + ' does not exist.');
      }
      return registry[name];
    } else {
      if (methodName === 'template' && typeof value === 'string') {
        return registry[name] = Handlebars.compile(value);
      } else {
        return registry[name] = value;
      }
    }
  };
});

Thorax.registry.view('application', Application);

_.each({
  view: 'View',
  model: 'Model',
  collection: 'Collection',
  router: 'Router'
}, function(className, methodName) {
  Application.prototype[methodName] = function(name, protoProps, classProps) {
    var _name = String(name);
    if (arguments.length === 1) {
      return Thorax.registry[methodName](name);
    } else {
      var existing = Thorax.registry[methodName](name, null, true);
      if (!existing) {
        if (protoProps.prototype) {
          protoProps.prototype.name = name;
          return Thorax.registry[methodName](name, className === 'Router' ? new protoProps : protoProps);
        } else if (protoProps.cid) {
          if (!protoProps.name) {
            protoProps.name = name;
          }
          return Thorax.registry[methodName](name, protoProps);
        } else {
          protoProps.name = name;
          var klass = this[className].extend(protoProps, classProps);
          return Thorax.registry[methodName](name, className === 'Router' ? new klass : klass);
        }
      } else {
        if (protoProps.prototype) {
          existing = protoProps;
          Thorax.registry[methodName](name, existing);
        } else if (protoProps) {
          _.extend(existing.prototype, protoProps);
        }
        if (classProps) {
          _.extend(exisitng, classProps);
        }
        return existing;
      }
    }
  };
}, this);

Application.prototype.template = Thorax.registry.template;

Thorax.addModuleMethods = function(module, application) {
  module.router = function(protoProps) {
    var router = Thorax.registry.router(module.name, null, true);
    if (arguments.length === 0) {
      return router;
    }
    if (!router) {
      if (protoProps.prototype) {
        protoProps.prototype.name = module.name;
        protoProps.prototype.routes = module.routes;
        protoProps = new protoProps;
      } else {
        protoProps.name = module.name;
        protoProps.routes = module.routes;
      }
      return application.router(module.name, protoProps);
    } else {
      _.extend(router, protoProps);
      return router;
    }
  };
};

//jquery and zepto plugins
_.extend($.fn, {
  view: function() {
    var el = $(this).closest('[' + viewCidAttributeName + ']');
    return (el && _viewsIndexedByCid[el.attr(viewCidAttributeName)]) || false;
  },
  model: function() {
    var $this = $(this),
        modelElement = $this.closest('[' + modelCidAttributeName + ']'),
        modelCid = modelElement && modelElement.attr(modelCidAttributeName);
    if (modelCid) {
      var view = $this.view();
      if (view && view.model && view.model.cid === modelCid) {
        return view.model || false;
      }
      var collection = $this.collection(view);
      if (collection) {
        return collection._byCid[modelCid] || false;
      }
    }
    return false;
  },
  collection: function(view) {
    var $this = $(this),
        collectionElement = $this.closest('[' + collectionCidAttributeName + ']'),
        collectionCid = collectionElement && collectionElement.attr(collectionCidAttributeName);
    if (collectionCid) {
      view = view || $this.view();
      if (view) {
        return view._boundCollectionsByCid[collectionCid];
      }
    }
    return false;
  }
});

}).call(this);

(function() {

var loadStart = 'load:start',
    loadEnd = 'load:end',
    rootObject;

var $superInitialize = Thorax.Application.prototype.initialize;
Thorax.Application.prototype.initialize = function() {
  rootObject = this;
  return $superInitialize.apply(this, arguments);
};

/**
 * load:start / load:end handler.
 *
 * Generates an load:start event handler that when triggered will
 * then monitor the associated object for a load:end event. If the
 * duration between the start and and the end events exceed
 * `_loadingTimeoutDuration` then the `start` and `end` callbacks
 * will be triggered at the appropriate times to allow the display
 * of a loading UI.
 *
 * Example:
 *    object.bind('load:start', Thorax.loadHandler(
 *      function(message, background, object) {
 *        element.addClass('loading');
 *      },
 *      function(background, object) {
 *        element.removeClass('loading');
 *      }));
 *
 */
Thorax.loadHandler = function(start, end) {
  return function(message, background, object) {
    var self = this;

    function startLoadTimeout() {
      clearTimeout(self._loadStart.timeout);
      self._loadStart.timeout = setTimeout(function() {
          self._loadStart.run = true;
          start.call(self, self._loadStart.message, self._loadStart.background, self._loadStart);
        },
        loadingTimeout*1000);
    }

    if (!self._loadStart) {
      var loadingTimeout = self._loadingTimeoutDuration;
      if (loadingTimeout === void 0) {
        // If we are running on a non-view object pull the default timeout
        loadingTimeout = Thorax.View.prototype._loadingTimeoutDuration;
      }

      self._loadStart = _.extend({
        events: [],
        timeout: 0,
        message: message,
        background: !!background
      }, Backbone.Events);
      startLoadTimeout();
    } else {
      clearTimeout(self._loadStart.endTimeout);

      self._loadStart.message = message;
      if (!background && self._loadStart.background) {
        self._loadStart.background = false;
        startLoadTimeout();
      }
    }

    self._loadStart.events.push(object);
    object.bind(loadEnd, function endCallback() {
      object.unbind(loadEnd, endCallback);

      var loadingEndTimeout = self._loadingTimeoutEndDuration;
      if (loadingEndTimeout === void 0) {
        // If we are running on a non-view object pull the default timeout
        loadingEndTimeout = Thorax.View.prototype._loadingTimeoutEndDuration;
      }

      var events = self._loadStart.events,
          index = events.indexOf(object);
      if (index >= 0) {
        events.splice(index, 1);
      }
      if (!events.length) {
        self._loadStart.endTimeout = setTimeout(function(){
          if (!events.length) {
            var run = self._loadStart.run;

            if (run) {
              // Emit the end behavior, but only if there is a paired start
              end.call(self, self._loadStart.background, self._loadStart);
              self._loadStart.trigger(loadEnd, self._loadStart);
            }

            // If stopping make sure we don't run a start
            clearTimeout(self._loadStart.timeout);
            self._loadStart = undefined;
          }
        }, loadingEndTimeout * 1000);
      }
    });
  };
};

/**
 * Helper method for propagating load:start events to other objects.
 *
 * Forwards load:start events that occur on `source` to `dest`.
 */
Thorax.forwardLoadEvents = function(source, dest, once) {
  function load(message, backgound, object) {
    if (once) {
      source.unbind(loadStart, load);
    }
    dest.trigger(loadStart, message, backgound, object);
  }
  source.bind(loadStart, load);
  return {
    unbind: function() {
      source.unbind(loadStart, load);
    }
  };
};

//
// Data load event generation
//

/**
 * Mixing for generating load:start and load:end events.
 */
Thorax.LoadableMixin = {
  loadStart: function(message, background) {
    this.trigger(loadStart, message, background, this);
  },
  loadEnd: function() {
    this.trigger(loadEnd, this);
  }
};

_.extend(Thorax.View.prototype, Thorax.LoadableMixin);

Thorax.sync = function(method, dataObj, options) {
  var self = this,
      complete = options.complete;

  options.complete = function() {
    self._request = undefined;
    self._aborted = false;

    complete && complete.apply(this, arguments);
  };
  this._request = Backbone.sync.apply(this, arguments);

  // TODO : Reevaluate this event... Seems too indepth to expose as an API
  this.trigger('request', this._request);
  return this._request;
};

function bindToRoute(callback, failback) {
  var fragment = Backbone.history.getFragment(),
      completed;

  function finalizer(isCanceled) {
    var same = fragment === Backbone.history.getFragment();

    if (completed) {
      // Prevent multiple execution, i.e. we were canceled but the success callback still runs
      return;
    }

    if (isCanceled && same) {
      // Ignore the first route event if we are running in newer versions of backbone
      // where the route operation is a postfix operation.
      return;
    }

    completed = true;
    Backbone.history.unbind('route', resetLoader);

    var args = Array.prototype.slice.call(arguments, 1);
    if (!isCanceled && same) {
      callback.apply(this, args);
    } else {
      failback && failback.apply(this, args);
    }
  }

  var resetLoader = _.bind(finalizer, this, true);
  Backbone.history.bind('route', resetLoader);

  return _.bind(finalizer, this, false);
}

function loadData(callback, failback, options) {
  if (this.isPopulated()) {
    return callback(this);
  }

  if (arguments.length === 2 && typeof failback !== 'function' && _.isObject(failback)) {
    options = failback;
    failback = false;
  }

  this.fetch(_.defaults({
    success: bindToRoute(callback, failback && _.bind(failback, this, false)),
    error: failback && _.bind(failback, this, true)
  }, options));
}

function fetchQueue(options, $super) {
  if (options.resetQueue) {
    // WARN: Should ensure that loaders are protected from out of band data
    //    when using this option
    this.fetchQueue = undefined;
  }

  if (!this.fetchQueue) {
    // Kick off the request
    this.fetchQueue = [options];
    options = _.defaults({
      success: flushQueue(this, this.fetchQueue, 'success'),
      error: flushQueue(this, this.fetchQueue, 'error'),
      complete: flushQueue(this, this.fetchQueue, 'complete')
    }, options);
    $super.call(this, options);
  } else {
    // Currently fetching. Queue and process once complete
    this.fetchQueue.push(options);
  }
}

function flushQueue(self, fetchQueue, handler) {
  return function() {
    var args = arguments;

    // Flush the queue. Executes any callback handlers that
    // may have been passed in the fetch options.
    fetchQueue.forEach(function(options) {
      if (options[handler]) {
        options[handler].apply(this, args);
      }
    }, this);

    // Reset the queue if we are still the active request
    if (self.fetchQueue === fetchQueue) {
      self.fetchQueue = undefined;
    }
  }
}

_.each([Thorax.Collection, Thorax.Model], function(DataClass) {
  var $fetch = DataClass.prototype.fetch;

  _.extend(DataClass.prototype, Thorax.LoadableMixin, {
    sync: Thorax.sync,

    fetch: function(options) {
      options = options || {};

      var self = this,
          complete = options.complete;

      options.complete = function() {
        complete && complete.apply(this, arguments);
        self.loadEnd();
      };
      self.loadStart(undefined, options.background);
      return fetchQueue.call(this, options || {}, $fetch);
    },

    load: function(callback, failback, options) {
      if (arguments.length === 2 && typeof failback !== 'function') {
        options = failback;
        failback = false;
      }
      options = options || {};

      if (!options.background && !this.isPopulated()) {
        // Make sure that the global scope sees the proper load events here
        // if we are loading in standalone mode
        Thorax.forwardLoadEvents(this, rootObject, true);
      }

      var self = this;
      loadData.call(this, callback,
        function(isError) {
          // Route changed, kill it
          if (!isError) {
            if (self._request) {
              self._aborted = true;
              self._request.abort();
            }
          }

          failback && failback.apply && failback.apply(this, arguments);
        },
        options);
    }
  });
});

Thorax.Model.prototype._loadModel = function(model, options) {
  model.load(function(){
    options.success && options.success(model);
  }, options);
};

Thorax.Model.prototype._loadCollection = function(collection, options) {
  collection.load(function(){
    options.success && options.success(collection);
  }, options);
};

Thorax.Router.prototype.bindToRoute = bindToRoute;
Thorax.Router.bindToRoute = bindToRoute;

//
// View load event handling
//
var superSetModelOptions = Thorax.View.prototype.setModelOptions,
    superSetCollectionOptions = Thorax.View.prototype.setCollectionOptions;

_.extend(Thorax.View.prototype, {
  //loading config
  _loadingClassName: 'loading',
  _loadingTimeoutDuration: 0.33,
  _loadingTimeoutEndDuration: 0.10,

  // Propagates loading view parameters to the AJAX layer
  setCollectionOptions: function(collection, options) {
    return superSetCollectionOptions.call(this, collection, _.defaults({
      ignoreErrors: this.ignoreFetchError,
      background: this.nonBlockingLoad
    }, options || {}));
  },
  setModelOptions: function(options) {
    return superSetModelOptions.call(this, _.defaults({
      ignoreErrors: this.ignoreFetchError,
      background: this.nonBlockingLoad
    }, options || {}));
  },

  onLoadStart: function(message, background, object) {
    if (!this.nonBlockingLoad && !background) {
      rootObject.trigger(loadStart, message, background, object);
    }
    $(this.el).addClass(this._loadingClassName);
    if (this._loadingCallbacks) {
      this._loadingCallbacks.forEach(function(callback) {
        callback();
      });
    }
  },
  onLoadEnd: function(background, object) {
    $(this.el).removeClass(this._loadingClassName);
    if (this._loadingCallbacks) {
      this._loadingCallbacks.forEach(function(callback) {
        callback();
      });
    }
  }
});

Thorax.View.registerEvents({
  'load:start': Thorax.loadHandler(
      function(message, background, object) {
        this.onLoadStart(message, background, object);
      },
      function(background, object) {
        this.onLoadEnd(object);
      }),

  collection: {
    'load:start': function(partial, message, background, object) {
      this.trigger(loadStart, message, background, object);
    }
  },
  model: {
    'load:start': function(message, background, object) {
      this.trigger(loadStart, message, background, object);
    }
  }
});

})();

Thorax.View.registerPartialHelper('loading', function(collectionOrModel, partial) {
  if (arguments.length === 1) {
    partial = collectionOrModel;
    collectionOrModel = false;
  }

  function callback(scope) {
    var content;
    if (partial.view.$el.hasClass(partial.view._loadingClassName)) {
      content = partial.fn(scope || partial.context());
    } else {
      content = partial.inverse(scope || partial.context());
    }
    partial.html(content);
  }

  this._view._loadingCallbacks = this._view._loadingCallbacks || [];
  this._view._loadingCallbacks.push(callback);
  partial.on('destroyed', function() {
    this._view._loadingCallbacks = _.without(this._view._loadingCallbacks, callback);
  }, this);

  callback(this);
});

Handlebars.helpers.collection.addCallback(function(collection, partial) {
  if (arguments.length === 1) {
    partial = collection;
    collection = this._view.collection;
  }
  var collectionElement = partial.$el;
  if (partial.options['loading-view'] || partial.options['loading-template']) {
    var item;
    var callback = Thorax.loadHandler(_.bind(function() {
      if (collection.length === 0) {
        collectionElement.empty();
      }
      if (partial.options['loading-view']) {
        var view = this.view(partial.options['loading-view'], this);
        if (partial.options['loading-template']) {
          view.render(this.renderTemplate(partial.options['loading-template'], this));
        } else {
          view.render();
        }
        item = view;
      } else {
        item = this.renderTemplate(partial.options['loading-template'], this);
      }
      this._view.appendItem(partial, collection, item, collection.length);
      collectionElement.children().last().attr('data-loading-element', collection.cid);
    }, this), _.bind(function() {
      collectionElement.find('[data-loading-element="' + collection.cid + '"]').remove();
    }, this));
    collection.on('load:start', callback);
    partial.on('freeze', function() {
      collection.off('load:start', callback);
    });
  }
}); 

(function(){
  var _onModelChange = Thorax.View.prototype._onModelChange,
      _setModelOptions = Thorax.View.prototype.setModelOptions;

  _.extend(Thorax.View.prototype, {
    //serializes a form present in the view, returning the serialized data
    //as an object
    //pass {set:false} to not update this.model if present
    //can pass options, callback or event in any order
    serialize: function() {
      var callback, options, event;
      //ignore undefined arguments in case event was null
      for (var i = 0; i < arguments.length; ++i) {
        if (typeof arguments[i] === 'function') {
          callback = arguments[i];
        } else if (typeof arguments[i] === 'object') {
          if ('stopPropagation' in arguments[i] && 'preventDefault' in arguments[i]) {
            event = arguments[i];
          } else {
            options = arguments[i];
          }
        }
      }

      if (event && !this._preventDuplicateSubmission(event)) {
        return;
      }

      options = _.extend({
        set: true,
        validate: true
      },options || {});
  
      var attributes = options.attributes || {};
      
      //callback has context of element
      var view = this;
      var errors = [];
      eachNamedInput.call(this, options, function() {
        var value = view._getInputValue(this, options, errors);
        if (typeof value !== 'undefined') {
          objectAndKeyFromAttributesAndName.call(this, attributes, this.name, {mode: 'serialize'}, function(object, key) {
            if (!object[key]) {
              object[key] = value;
            } else if (_.isArray(object[key])) {
              object[key].push(value);
            } else {
              object[key] = [object[key], value];
            }
          });
        }
      });
  
      this.trigger('serialize', attributes, options);

      if (options.validate) {
        var validateInputErrors = this.validateInput(attributes);
        if (validateInputErrors && validateInputErrors.length) {
          errors = errors.concat(validateInputErrors);
        }
        this.trigger('validate', attributes, errors, options);
        if (errors.length) {
          this.trigger('error', errors);
          return;
        }
      }
  
      if (options.set && this.model) {
        if (!this.model.set(attributes, {silent: true})) {
          return false;
        };
      }
      
      callback && callback.call(this, attributes, _.bind(resetSubmitState, this));
      return attributes;
    },

    _preventDuplicateSubmission: function(event, callback) {
      event.preventDefault();

      var form = $(event.target);
      if ((event.target.tagName || '').toLowerCase() !== 'form') {
        // Handle non-submit events by gating on the form
        form = $(event.target).closest('form');
      }

      if (!form.attr('data-submit-wait')) {
        form.attr('data-submit-wait', 'true');
        if (callback) {
          callback.call(this, event);
        }
        return true;
      } else {
        return false;
      }
    },

    //populate a form from the passed attributes or this.model if present
    populate: function(attributes) {
      if (!this.$('form').length) {
        return;
      }
      var value, attributes = attributes || this._getContext(this.model);
      //callback has context of element
      eachNamedInput.call(this, {}, function() {
        objectAndKeyFromAttributesAndName.call(this, attributes, this.name, {mode: 'populate'}, function(object, key) {
          if (object && typeof (value = object[key]) !== 'undefined') {
            //will only execute if we have a name that matches the structure in attributes
            if (this.type === 'checkbox' && _.isBoolean(value)) {
              this.checked = value;
            } else if (this.type === 'checkbox' || this.type === 'radio') {
              this.checked = value == this.value;
            } else {
              this.value = value;
            }
          }
        });
      });

      this.trigger('populate', attributes);
    },

    _onModelChange: function() {
      var response = _onModelChange.call(this);
      if (this._modelOptions.populate) {
        this.populate(this.model.attributes);
      }
      return response;
    },

    setModelOptions: function(options) {
      if (!options) {
        options = {};
      }
      if (!('populate' in options)) {
        options.populate = true;
      }
      return _setModelOptions.call(this, options);
    },

    //perform form validation, implemented by child class
    validateInput: function(attributes, options, errors) {},

    _getInputValue: function(input, options, errors) {
      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.checked) {
          return input.value;
        }
      } else if (input.multiple === true) {
        var values = [];
        $('option',input).each(function(){
          if (this.selected) {
            values.push(this.value);
          }
        });
        return values;
      } else {
        return input.value;
      }
    }
  });

  Thorax.View.registerEvents({
    error: function() {  
      resetSubmitState.call(this);
    
      // If we errored with a model we want to reset the content but leave the UI
      // intact. If the user updates the data and serializes any overwritten data
      // will be restored.
      if (this.model && this.model.previousAttributes) {
        this.model.set(this.model.previousAttributes(), {
          silent: true
        });
      }
    },
    deactivated: function() {
      resetSubmitState.call(this);
    }
  })

  function eachNamedInput(options, iterator, context) {
    var i = 0;
    this.$('select,input,textarea', options.root || this.el).each(function() {
      if (this.type !== 'button' && this.type !== 'cancel' && this.type !== 'submit' && this.name && this.name !== '') {
        iterator.call(context || this, i, this);
        ++i;
      }
    });
  }

  //calls a callback with the correct object fragment and key from a compound name
  function objectAndKeyFromAttributesAndName(attributes, name, options, callback) {
    var key, i, object = attributes, keys = name.split('['), mode = options.mode;
    for(i = 0; i < keys.length - 1; ++i) {
      key = keys[i].replace(']','');
      if (!object[key]) {
        if (mode == 'serialize') {
          object[key] = {};
        } else {
          return callback.call(this, false, key);
        }
      }
      object = object[key];
    }
    key = keys[keys.length - 1].replace(']', '');
    callback.call(this, object, key);
  }

  function resetSubmitState() {
    this.$('form').removeAttr('data-submit-wait');
  }

})();

/*

based on https://github.com/rickharrison/validate.js

*/
(function(){
  var validationAttributeNamePrefix = 'data-validate-',
    errorMessageAttributeName = 'data-error-message',
    numericRegex = /^[0-9]+$/,
    integerRegex = /^\-?[0-9]+$/,
    decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
    emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
    alphaRegex = /^[a-z]+$/i,
    alphaNumericRegex = /^[a-z0-9]+$/i,
    alphaNumericDashRegex = /^[a-z0-9_-]+$/i;

  Thorax.Validations = {
    regex: function(pattern, value) {
      var regex = new RegExp(pattern);
      return Boolean(regex.exec(value));
    },
    method: function(methodName, value) {
      return this[methodName].call(this, value);
    },
    required: function(shouldValidate, value) {
      return Boolean(shouldValidate) ? trim(value) !== '' : true;
    },
    email: function(shouldValidate, value) {
      return Boolean(shouldValidate) ? Boolean(value.match(emailRegex)) : true;
    },
    matches: function(matchingFieldName, value) {
      var matchingValue = this.$('input[name="' + matchingFieldName + '"]').val();
      return matchingValue === value;
    },
    length: function(length, value) {
      return value.length === length;
    },
    'min-length': function(minLength, value) {
      return value.length >= minLength;
    },
    'max-length': function(maxLength, value) {
      return value.length <= maxLength;
    },
    min: function(minValue, value) {
      return parseInt(value, 10) >= minValue;
    },
    max: function(maxValue, value) {
      return parseInt(value, 10) <= maxValue;
    },
    alpha: function(shouldValidate, value) {
      return Boolean(shouldValidate) ? Boolean(value.match(alphaRegex)) : true;
    },
    'alpha-numeric': function(shouldValidate, value) {
      return Boolean(shouldValidate) ? Boolean(value.match(alphaNumericRegex)) : true;
    },
    'alpha-numeric-dash': function(shouldValidate, value) {
      return Boolean(shouldValidate) ? Boolean(value.match(alphaNumericDashRegex)) : true;
    },
    numeric: function(shouldValidate, value) {
      return Boolean(shouldValidate) ? Boolean(value.match(numericRegex)) : true;
    },
    integer: function(shouldValidate, value) {
      return Boolean(shouldValidate) ? Boolean(value.match(integerRegex)) : true;
    }
  };
  var Validations = Thorax.Validations;

  Validations.regex.message = 'Did not match the required pattern';
  Validations.method.message = 'Did not match the required pattern';
  Validations.required.message = 'Required';
  Validations.matches.message = 'Must match {{validation}}';
  Validations.email.message = 'Must contain a valid email address';
  Validations['min-length'].message = 'Must be at least {{validation}} characters in length';
  Validations['max-length'].message = 'Must not exceed {{validation}} characters in length';
  Validations.length = 'Must be exactly {{validation}} characters in length';
  Validations.min.message = 'Must contain a number greater than {{validation}}';
  Validations.max.message = 'Must contain a number less than {{validation}}';
  Validations.alpha.message = 'Must only contain alphabetical characters';
  Validations['alpha-numeric'].message = 'Must only contain alpha-numeric characters';
  Validations['alpha-numeric-dash'].message = 'Must only contain alpha-numeric characters, underscores, and dashes';
  Validations.numeric.message = 'Must contain only numbers';
  Validations.integer.message = 'Must contain an integer'

  var _getInputValue = Thorax.View.prototype._getInputValue;
  _.extend(Thorax.View.prototype, {
    _getInputValue: function(input, options, errors) {
      var $input = $(input);
      if (options && options.validate) {
        _.each(Validations, function(validation, attributeName) {
          var validationValue = $input.attr(validationAttributeNamePrefix + attributeName);
          if (validationValue) {
            var valid = Validations[attributeName].call(this, validationValue, input.value),
                message,
                label,
                id;
            if (typeof valid === 'string') {
              message = valid;
              valid = false;
            }
            if (!valid) {
              message = message || $input.attr(errorMessageAttributeName) || Validations[attributeName].message;
              label = labelNameFromInput.call(this, $input);
              id = $input.attr('id');
              errors.push({
                element: $input,
                name: $input.attr('name'),
                label: label,
                id: id,
                message: Thorax.View.expandToken(message, {
                  label: label,
                  id: id,
                  validation: validationValue,
                  value: input.value
                })
              });
            }
          }
        }, this);
      }
      return _getInputValue.call(this, input, options, errors);
    }
  });
  
  var trimRegex = /^s+|s+$/g;
  function trim(str) {
    return str.replace(trimRegex, '');
  }

  function labelNameFromInput($input) {
    var id = $input.attr('id');
    if (id) {
      var label = this.$('label[for="' + id + '"]');
      if (label) {
        return label.text();
      }
    }
    return $input.attr('name');
  }

})();

var errorClassName = 'error',
    errorAttributeName = 'data-view-error',
    inputErrorAttributeName = 'data-input-error-id';

Thorax.View.registerPartialHelper('error', function(partial) {
  if (!partial.el.className || partial.el.className === '') {
    partial.$el.addClass('alert alert-error');
  }
  partial.$el.attr(errorAttributeName, 'true');

  function invokeFn(errors) {
    partial.html(partial.fn(partial.context({
      errors: errors
    })));
    partial.$el.show();
  }

  function invokeInverse(scope) {
    partial.html(partial.inverse(scope || partial.context()));
    partial.$el.hide();
  }

  partial.addEvent(partial.view, 'error', invokeFn);
  partial.addEvent(partial.view, 'serialize', invokeInverse);

  invokeInverse(this);
});

Thorax.View.registerHelper('input-error', function(forInputId, options) {
  options.hash.tag = options.hash.tag || 'span';
  options.hash['class'] = options.hash['class'] || 'help-inline';
  options.hash[inputErrorAttributeName] = forInputId;
  return new Handlebars.SafeString(Thorax.View.tag(options.hash));
});

Thorax.View.registerHelper('input', function(options) {
  var content = null,
      inputGenerator,
      labelGenerator,
      inputErrorMessageGenerator,
      id;
  options.hash.tag = 'input';
  id = options.hash.id = options.hash.id || ((options.hash.name || _.uniqueId('input')) + '-' + this.cid);

  if (options.hash.label && !options.hash.placeholder) {
    options.hash.placeholder = options.hash.label;
  }
  
  if (options.hash.label) {
    var label = options.hash.label;
    labelGenerator = function(generatorOptions) {
      return Thorax.View.tag(_.extend({
        tag: 'label',
        'for': options.hash.id,
        'class': 'control-label'
      }, generatorOptions ? generatorOptions.hash : {}), label, this);
    };
    delete options.hash.label;
  }

  inputErrorMessageGenerator = function(generatorOptions) {
    var inputErrorMessageOptions = {
      tag: 'p',
      'class': 'help-block',
    };
    inputErrorMessageOptions[inputErrorAttributeName] = id;
    return Thorax.View.tag(_.extend(inputErrorMessageOptions, generatorOptions ? generatorOptions.hash : {}));
  };

  if (options.hash.type === 'textarea') {
    content = options.hash.value || '';
    options.hash.tag = 'textarea';
    delete options.hash.value;
    delete options.hash.type;
  } else if (options.hash.type === 'select') {
    options.hash.tag = 'select';
    var selectOptions = options.hash.options || [];
    if (!_.isArray(selectOptions)) {
      selectOptions = _.map(selectOptions, function(label, value) {
        return {
          value: value,
          label: label,
          selected: value == options.hash.selected
        }
      }, this);
    }
    content = _.map(selectOptions, function(option) {
      var tagOptions = {
        tag: 'option',
        value: option[0] || option.value
      };
      if (option.selected) {
        tagOptions.selected = selected;
      }
      return Thorax.View.tag(tagOptions, option[1] || option.label, this);
    }, this).join('');
    delete options.hash.type;
    delete options.hash.options;
    delete options.hash.selected;
  } else if (!options.hash.type) {
    options.hash.type = 'text';
  }
  inputGenerator = function(generatorOptions) {
    var output = Thorax.View.tag(_.extend({}, options.hash, generatorOptions ? generatorOptions.hash : {}), content, this);
    return output;
  };

  var returnObjects = options.hash['return-objects'];
  delete options.hash['return-objects'];

  if (returnObjects) {
    return {
      'control-input': function() {
        return new Handlebars.SafeString(inputGenerator.apply(this, arguments));
      },
      'control-label': function() {
        if (!labelGenerator) {
          return '';
        }
        return new Handlebars.SafeString(labelGenerator.apply(this, arguments));
      },
      'control-error': function() {
        return new Handlebars.SafeString(inputErrorMessageGenerator.apply(this, arguments));
      }
    };
  } else {
    return new Handlebars.SafeString(
      (labelGenerator ? labelGenerator.call(this) : '') +
      (inputErrorMessageGenerator ? inputErrorMessageGenerator.call(this) : '') +
      (inputGenerator ? inputGenerator.call(this) : '')
    );
  }
});

Thorax.View.registerHelper('control-group', function(options) {
  var generators = Handlebars.helpers.input.call(this, {
    hash: {
      'return-objects': true,
      name: options.hash.name,
      label: options.hash.label
    }
  });
  delete options.hash.name;
  delete options.hash.label;
  options.hash['class'] = options.hash['class'] || 'control-group';
  var context = _.extend({}, this, generators);
  return new Handlebars.SafeString(Thorax.View.tag(options.hash, options.fn(context), this));
});

function resetErrorState() {
  this.$('[' + inputErrorAttributeName + ']').empty().hide();
  this.$('.control-group.' + errorClassName).removeClass(errorClassName);
}

_.extend(Thorax.View.prototype, {
  reset: function() {
    _.each(this.$('form'), function(form) {
      form.reset();
    });
    resetErrorState.call(this);
  }
});

Thorax.View.registerEvents({
  rendered: resetErrorState,
  serialize: resetErrorState,
  error: function(errors) {
    errors.forEach(function(error) {
      var errorAttributeEl = this.$('[' + inputErrorAttributeName + '="' + error.id + '"]');
      errorAttributeEl.html(error.message);
      errorAttributeEl.show();
      if (error && error.element) {
        error.element.closest('.control-group').addClass(errorClassName);
      }
    }, this);
  }
});
