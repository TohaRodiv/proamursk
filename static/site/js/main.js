"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
(function () {
  'use strict'; // Exit early if we're not running in a browser.

  if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object') {
    return;
  } // Exit early if all IntersectionObserver and IntersectionObserverEntry
  // features are natively supported.


  if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
      Object.defineProperty(window.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function get() {
          return this.intersectionRatio > 0;
        }
      });
    }

    return;
  }
  /**
   * A local reference to the document.
   */


  var document = window.document;
  /**
   * An IntersectionObserver registry. This registry exists to hold a strong
   * reference to IntersectionObserver instances currently observing a target
   * element. Without this registry, instances without another reference may be
   * garbage collected.
   */

  var registry = [];
  /**
   * Creates the global IntersectionObserverEntry constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
   * @param {Object} entry A dictionary of instance properties.
   * @constructor
   */

  function IntersectionObserverEntry(entry) {
    this.time = entry.time;
    this.target = entry.target;
    this.rootBounds = entry.rootBounds;
    this.boundingClientRect = entry.boundingClientRect;
    this.intersectionRect = entry.intersectionRect || getEmptyRect();
    this.isIntersecting = !!entry.intersectionRect; // Calculates the intersection ratio.

    var targetRect = this.boundingClientRect;
    var targetArea = targetRect.width * targetRect.height;
    var intersectionRect = this.intersectionRect;
    var intersectionArea = intersectionRect.width * intersectionRect.height; // Sets intersection ratio.

    if (targetArea) {
      // Round the intersection ratio to avoid floating point math issues:
      // https://github.com/w3c/IntersectionObserver/issues/324
      this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
    } else {
      // If area is zero and is intersecting, sets to 1, otherwise to 0
      this.intersectionRatio = this.isIntersecting ? 1 : 0;
    }
  }
  /**
   * Creates the global IntersectionObserver constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
   * @param {Function} callback The function to be invoked after intersection
   *     changes have queued. The function is not invoked if the queue has
   *     been emptied by calling the `takeRecords` method.
   * @param {Object=} opt_options Optional configuration options.
   * @constructor
   */


  function IntersectionObserver(callback, opt_options) {
    var options = opt_options || {};

    if (typeof callback != 'function') {
      throw new Error('callback must be a function');
    }

    if (options.root && options.root.nodeType != 1) {
      throw new Error('root must be an Element');
    } // Binds and throttles `this._checkForIntersections`.


    this._checkForIntersections = throttle(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT); // Private properties.

    this._callback = callback;
    this._observationTargets = [];
    this._queuedEntries = [];
    this._rootMarginValues = this._parseRootMargin(options.rootMargin); // Public properties.

    this.thresholds = this._initThresholds(options.threshold);
    this.root = options.root || null;
    this.rootMargin = this._rootMarginValues.map(function (margin) {
      return margin.value + margin.unit;
    }).join(' ');
  }
  /**
   * The minimum interval within which the document will be checked for
   * intersection changes.
   */


  IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;
  /**
   * The frequency in which the polyfill polls for intersection changes.
   * this can be updated on a per instance basis and must be set prior to
   * calling `observe` on the first target.
   */

  IntersectionObserver.prototype.POLL_INTERVAL = null;
  /**
   * Use a mutation observer on the root element
   * to detect intersection changes.
   */

  IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;
  /**
   * Starts observing a target element for intersection changes based on
   * the thresholds values.
   * @param {Element} target The DOM element to observe.
   */

  IntersectionObserver.prototype.observe = function (target) {
    var isTargetAlreadyObserved = this._observationTargets.some(function (item) {
      return item.element == target;
    });

    if (isTargetAlreadyObserved) {
      return;
    }

    if (!(target && target.nodeType == 1)) {
      throw new Error('target must be an Element');
    }

    this._registerInstance();

    this._observationTargets.push({
      element: target,
      entry: null
    });

    this._monitorIntersections();

    this._checkForIntersections();
  };
  /**
   * Stops observing a target element for intersection changes.
   * @param {Element} target The DOM element to observe.
   */


  IntersectionObserver.prototype.unobserve = function (target) {
    this._observationTargets = this._observationTargets.filter(function (item) {
      return item.element != target;
    });

    if (!this._observationTargets.length) {
      this._unmonitorIntersections();

      this._unregisterInstance();
    }
  };
  /**
   * Stops observing all target elements for intersection changes.
   */


  IntersectionObserver.prototype.disconnect = function () {
    this._observationTargets = [];

    this._unmonitorIntersections();

    this._unregisterInstance();
  };
  /**
   * Returns any queue entries that have not yet been reported to the
   * callback and clears the queue. This can be used in conjunction with the
   * callback to obtain the absolute most up-to-date intersection information.
   * @return {Array} The currently queued entries.
   */


  IntersectionObserver.prototype.takeRecords = function () {
    var records = this._queuedEntries.slice();

    this._queuedEntries = [];
    return records;
  };
  /**
   * Accepts the threshold value from the user configuration object and
   * returns a sorted array of unique threshold values. If a value is not
   * between 0 and 1 and error is thrown.
   * @private
   * @param {Array|number=} opt_threshold An optional threshold value or
   *     a list of threshold values, defaulting to [0].
   * @return {Array} A sorted list of unique and valid threshold values.
   */


  IntersectionObserver.prototype._initThresholds = function (opt_threshold) {
    var threshold = opt_threshold || [0];
    if (!Array.isArray(threshold)) threshold = [threshold];
    return threshold.sort().filter(function (t, i, a) {
      if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
        throw new Error('threshold must be a number between 0 and 1 inclusively');
      }

      return t !== a[i - 1];
    });
  };
  /**
   * Accepts the rootMargin value from the user configuration object
   * and returns an array of the four margin values as an object containing
   * the value and unit properties. If any of the values are not properly
   * formatted or use a unit other than px or %, and error is thrown.
   * @private
   * @param {string=} opt_rootMargin An optional rootMargin value,
   *     defaulting to '0px'.
   * @return {Array<Object>} An array of margin objects with the keys
   *     value and unit.
   */


  IntersectionObserver.prototype._parseRootMargin = function (opt_rootMargin) {
    var marginString = opt_rootMargin || '0px';
    var margins = marginString.split(/\s+/).map(function (margin) {
      var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);

      if (!parts) {
        throw new Error('rootMargin must be specified in pixels or percent');
      }

      return {
        value: parseFloat(parts[1]),
        unit: parts[2]
      };
    }); // Handles shorthand.

    margins[1] = margins[1] || margins[0];
    margins[2] = margins[2] || margins[0];
    margins[3] = margins[3] || margins[1];
    return margins;
  };
  /**
   * Starts polling for intersection changes if the polling is not already
   * happening, and if the page's visibility state is visible.
   * @private
   */


  IntersectionObserver.prototype._monitorIntersections = function () {
    if (!this._monitoringIntersections) {
      this._monitoringIntersections = true; // If a poll interval is set, use polling instead of listening to
      // resize and scroll events or DOM mutations.

      if (this.POLL_INTERVAL) {
        this._monitoringInterval = setInterval(this._checkForIntersections, this.POLL_INTERVAL);
      } else {
        addEvent(window, 'resize', this._checkForIntersections, true);
        addEvent(document, 'scroll', this._checkForIntersections, true);

        if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in window) {
          this._domObserver = new MutationObserver(this._checkForIntersections);

          this._domObserver.observe(document, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        }
      }
    }
  };
  /**
   * Stops polling for intersection changes.
   * @private
   */


  IntersectionObserver.prototype._unmonitorIntersections = function () {
    if (this._monitoringIntersections) {
      this._monitoringIntersections = false;
      clearInterval(this._monitoringInterval);
      this._monitoringInterval = null;
      removeEvent(window, 'resize', this._checkForIntersections, true);
      removeEvent(document, 'scroll', this._checkForIntersections, true);

      if (this._domObserver) {
        this._domObserver.disconnect();

        this._domObserver = null;
      }
    }
  };
  /**
   * Scans each observation target for intersection changes and adds them
   * to the internal entries queue. If new entries are found, it
   * schedules the callback to be invoked.
   * @private
   */


  IntersectionObserver.prototype._checkForIntersections = function () {
    var rootIsInDom = this._rootIsInDom();

    var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();

    this._observationTargets.forEach(function (item) {
      var target = item.element;
      var targetRect = getBoundingClientRect(target);

      var rootContainsTarget = this._rootContainsTarget(target);

      var oldEntry = item.entry;

      var intersectionRect = rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, rootRect);

      var newEntry = item.entry = new IntersectionObserverEntry({
        time: now(),
        target: target,
        boundingClientRect: targetRect,
        rootBounds: rootRect,
        intersectionRect: intersectionRect
      });

      if (!oldEntry) {
        this._queuedEntries.push(newEntry);
      } else if (rootIsInDom && rootContainsTarget) {
        // If the new entry intersection ratio has crossed any of the
        // thresholds, add a new entry.
        if (this._hasCrossedThreshold(oldEntry, newEntry)) {
          this._queuedEntries.push(newEntry);
        }
      } else {
        // If the root is not in the DOM or target is not contained within
        // root but the previous entry for this target had an intersection,
        // add a new record indicating removal.
        if (oldEntry && oldEntry.isIntersecting) {
          this._queuedEntries.push(newEntry);
        }
      }
    }, this);

    if (this._queuedEntries.length) {
      this._callback(this.takeRecords(), this);
    }
  };
  /**
   * Accepts a target and root rect computes the intersection between then
   * following the algorithm in the spec.
   * TODO(philipwalton): at this time clip-path is not considered.
   * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
   * @param {Element} target The target DOM element
   * @param {Object} rootRect The bounding rect of the root after being
   *     expanded by the rootMargin value.
   * @return {?Object} The final intersection rect object or undefined if no
   *     intersection is found.
   * @private
   */


  IntersectionObserver.prototype._computeTargetAndRootIntersection = function (target, rootRect) {
    // If the element isn't displayed, an intersection can't happen.
    if (window.getComputedStyle(target).display == 'none') return;
    var targetRect = getBoundingClientRect(target);
    var intersectionRect = targetRect;
    var parent = getParentNode(target);
    var atRoot = false;

    while (!atRoot) {
      var parentRect = null;
      var parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {}; // If the parent isn't displayed, an intersection can't happen.

      if (parentComputedStyle.display == 'none') return;

      if (parent == this.root || parent == document) {
        atRoot = true;
        parentRect = rootRect;
      } else {
        // If the element has a non-visible overflow, and it's not the <body>
        // or <html> element, update the intersection rect.
        // Note: <body> and <html> cannot be clipped to a rect that's not also
        // the document rect, so no need to compute a new intersection.
        if (parent != document.body && parent != document.documentElement && parentComputedStyle.overflow != 'visible') {
          parentRect = getBoundingClientRect(parent);
        }
      } // If either of the above conditionals set a new parentRect,
      // calculate new intersection data.


      if (parentRect) {
        intersectionRect = computeRectIntersection(parentRect, intersectionRect);
        if (!intersectionRect) break;
      }

      parent = getParentNode(parent);
    }

    return intersectionRect;
  };
  /**
   * Returns the root rect after being expanded by the rootMargin value.
   * @return {Object} The expanded root rect.
   * @private
   */


  IntersectionObserver.prototype._getRootRect = function () {
    var rootRect;

    if (this.root) {
      rootRect = getBoundingClientRect(this.root);
    } else {
      // Use <html>/<body> instead of window since scroll bars affect size.
      var html = document.documentElement;
      var body = document.body;
      rootRect = {
        top: 0,
        left: 0,
        right: html.clientWidth || body.clientWidth,
        width: html.clientWidth || body.clientWidth,
        bottom: html.clientHeight || body.clientHeight,
        height: html.clientHeight || body.clientHeight
      };
    }

    return this._expandRectByRootMargin(rootRect);
  };
  /**
   * Accepts a rect and expands it by the rootMargin value.
   * @param {Object} rect The rect object to expand.
   * @return {Object} The expanded rect.
   * @private
   */


  IntersectionObserver.prototype._expandRectByRootMargin = function (rect) {
    var margins = this._rootMarginValues.map(function (margin, i) {
      return margin.unit == 'px' ? margin.value : margin.value * (i % 2 ? rect.width : rect.height) / 100;
    });

    var newRect = {
      top: rect.top - margins[0],
      right: rect.right + margins[1],
      bottom: rect.bottom + margins[2],
      left: rect.left - margins[3]
    };
    newRect.width = newRect.right - newRect.left;
    newRect.height = newRect.bottom - newRect.top;
    return newRect;
  };
  /**
   * Accepts an old and new entry and returns true if at least one of the
   * threshold values has been crossed.
   * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
   *    particular target element or null if no previous entry exists.
   * @param {IntersectionObserverEntry} newEntry The current entry for a
   *    particular target element.
   * @return {boolean} Returns true if a any threshold has been crossed.
   * @private
   */


  IntersectionObserver.prototype._hasCrossedThreshold = function (oldEntry, newEntry) {
    // To make comparing easier, an entry that has a ratio of 0
    // but does not actually intersect is given a value of -1
    var oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
    var newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1; // Ignore unchanged ratios

    if (oldRatio === newRatio) return;

    for (var i = 0; i < this.thresholds.length; i++) {
      var threshold = this.thresholds[i]; // Return true if an entry matches a threshold or if the new ratio
      // and the old ratio are on the opposite sides of a threshold.

      if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
        return true;
      }
    }
  };
  /**
   * Returns whether or not the root element is an element and is in the DOM.
   * @return {boolean} True if the root element is an element and is in the DOM.
   * @private
   */


  IntersectionObserver.prototype._rootIsInDom = function () {
    return !this.root || containsDeep(document, this.root);
  };
  /**
   * Returns whether or not the target element is a child of root.
   * @param {Element} target The target element to check.
   * @return {boolean} True if the target element is a child of root.
   * @private
   */


  IntersectionObserver.prototype._rootContainsTarget = function (target) {
    return containsDeep(this.root || document, target);
  };
  /**
   * Adds the instance to the global IntersectionObserver registry if it isn't
   * already present.
   * @private
   */


  IntersectionObserver.prototype._registerInstance = function () {
    if (registry.indexOf(this) < 0) {
      registry.push(this);
    }
  };
  /**
   * Removes the instance from the global IntersectionObserver registry.
   * @private
   */


  IntersectionObserver.prototype._unregisterInstance = function () {
    var index = registry.indexOf(this);
    if (index != -1) registry.splice(index, 1);
  };
  /**
   * Returns the result of the performance.now() method or null in browsers
   * that don't support the API.
   * @return {number} The elapsed time since the page was requested.
   */


  function now() {
    return window.performance && performance.now && performance.now();
  }
  /**
   * Throttles a function and delays its execution, so it's only called at most
   * once within a given time period.
   * @param {Function} fn The function to throttle.
   * @param {number} timeout The amount of time that must pass before the
   *     function can be called again.
   * @return {Function} The throttled function.
   */


  function throttle(fn, timeout) {
    var timer = null;
    return function () {
      if (!timer) {
        timer = setTimeout(function () {
          fn();
          timer = null;
        }, timeout);
      }
    };
  }
  /**
   * Adds an event handler to a DOM node ensuring cross-browser compatibility.
   * @param {Node} node The DOM node to add the event handler to.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to add.
   * @param {boolean} opt_useCapture Optionally adds the even to the capture
   *     phase. Note: this only works in modern browsers.
   */


  function addEvent(node, event, fn, opt_useCapture) {
    if (typeof node.addEventListener == 'function') {
      node.addEventListener(event, fn, opt_useCapture || false);
    } else if (typeof node.attachEvent == 'function') {
      node.attachEvent('on' + event, fn);
    }
  }
  /**
   * Removes a previously added event handler from a DOM node.
   * @param {Node} node The DOM node to remove the event handler from.
   * @param {string} event The event name.
   * @param {Function} fn The event handler to remove.
   * @param {boolean} opt_useCapture If the event handler was added with this
   *     flag set to true, it should be set to true here in order to remove it.
   */


  function removeEvent(node, event, fn, opt_useCapture) {
    if (typeof node.removeEventListener == 'function') {
      node.removeEventListener(event, fn, opt_useCapture || false);
    } else if (typeof node.detatchEvent == 'function') {
      node.detatchEvent('on' + event, fn);
    }
  }
  /**
   * Returns the intersection between two rect objects.
   * @param {Object} rect1 The first rect.
   * @param {Object} rect2 The second rect.
   * @return {?Object} The intersection rect or undefined if no intersection
   *     is found.
   */


  function computeRectIntersection(rect1, rect2) {
    var top = Math.max(rect1.top, rect2.top);
    var bottom = Math.min(rect1.bottom, rect2.bottom);
    var left = Math.max(rect1.left, rect2.left);
    var right = Math.min(rect1.right, rect2.right);
    var width = right - left;
    var height = bottom - top;
    return width >= 0 && height >= 0 && {
      top: top,
      bottom: bottom,
      left: left,
      right: right,
      width: width,
      height: height
    };
  }
  /**
   * Shims the native getBoundingClientRect for compatibility with older IE.
   * @param {Element} el The element whose bounding rect to get.
   * @return {Object} The (possibly shimmed) rect of the element.
   */


  function getBoundingClientRect(el) {
    var rect;

    try {
      rect = el.getBoundingClientRect();
    } catch (err) {// Ignore Windows 7 IE11 "Unspecified error"
      // https://github.com/w3c/IntersectionObserver/pull/205
    }

    if (!rect) return getEmptyRect(); // Older IE

    if (!(rect.width && rect.height)) {
      rect = {
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      };
    }

    return rect;
  }
  /**
   * Returns an empty rect object. An empty rect is returned when an element
   * is not in the DOM.
   * @return {Object} The empty rect.
   */


  function getEmptyRect() {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: 0,
      height: 0
    };
  }
  /**
   * Checks to see if a parent element contains a child element (including inside
   * shadow DOM).
   * @param {Node} parent The parent element.
   * @param {Node} child The child element.
   * @return {boolean} True if the parent node contains the child node.
   */


  function containsDeep(parent, child) {
    var node = child;

    while (node) {
      if (node == parent) return true;
      node = getParentNode(node);
    }

    return false;
  }
  /**
   * Gets the parent node of an element or its host element if the parent node
   * is a shadow root.
   * @param {Node} node The node whose parent to get.
   * @return {Node|null} The parent node or null if no parent exists.
   */


  function getParentNode(node) {
    var parent = node.parentNode;

    if (parent && parent.nodeType == 11 && parent.host) {
      // If the parent is a shadow root, return the host element.
      return parent.host;
    }

    if (parent && parent.assignedSlot) {
      // If the parent is distributed in a <slot>, return the parent of a slot.
      return parent.assignedSlot.parentNode;
    }

    return parent;
  } // Exposes the constructors globally.


  window.IntersectionObserver = IntersectionObserver;
  window.IntersectionObserverEntry = IntersectionObserverEntry;
})();
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*! jQuery v3.4.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function (e, t) {
  "use strict";

  "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) && "object" == _typeof(module.exports) ? module.exports = e.document ? t(e, !0) : function (e) {
    if (!e.document) throw new Error("jQuery requires a window with a document");
    return t(e);
  } : t(e);
}("undefined" != typeof window ? window : void 0, function (C, e) {
  "use strict";

  var t = [],
      E = C.document,
      r = Object.getPrototypeOf,
      s = t.slice,
      g = t.concat,
      u = t.push,
      i = t.indexOf,
      n = {},
      o = n.toString,
      v = n.hasOwnProperty,
      a = v.toString,
      l = a.call(Object),
      y = {},
      m = function m(e) {
    return "function" == typeof e && "number" != typeof e.nodeType;
  },
      x = function x(e) {
    return null != e && e === e.window;
  },
      c = {
    type: !0,
    src: !0,
    nonce: !0,
    noModule: !0
  };

  function b(e, t, n) {
    var r,
        i,
        o = (n = n || E).createElement("script");
    if (o.text = e, t) for (r in c) {
      (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
    }
    n.head.appendChild(o).parentNode.removeChild(o);
  }

  function w(e) {
    return null == e ? e + "" : "object" == _typeof(e) || "function" == typeof e ? n[o.call(e)] || "object" : _typeof(e);
  }

  var f = "3.4.1",
      k = function k(e, t) {
    return new k.fn.init(e, t);
  },
      p = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  function d(e) {
    var t = !!e && "length" in e && e.length,
        n = w(e);
    return !m(e) && !x(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e);
  }

  k.fn = k.prototype = {
    jquery: f,
    constructor: k,
    length: 0,
    toArray: function toArray() {
      return s.call(this);
    },
    get: function get(e) {
      return null == e ? s.call(this) : e < 0 ? this[e + this.length] : this[e];
    },
    pushStack: function pushStack(e) {
      var t = k.merge(this.constructor(), e);
      return t.prevObject = this, t;
    },
    each: function each(e) {
      return k.each(this, e);
    },
    map: function map(n) {
      return this.pushStack(k.map(this, function (e, t) {
        return n.call(e, t, e);
      }));
    },
    slice: function slice() {
      return this.pushStack(s.apply(this, arguments));
    },
    first: function first() {
      return this.eq(0);
    },
    last: function last() {
      return this.eq(-1);
    },
    eq: function eq(e) {
      var t = this.length,
          n = +e + (e < 0 ? t : 0);
      return this.pushStack(0 <= n && n < t ? [this[n]] : []);
    },
    end: function end() {
      return this.prevObject || this.constructor();
    },
    push: u,
    sort: t.sort,
    splice: t.splice
  }, k.extend = k.fn.extend = function () {
    var e,
        t,
        n,
        r,
        i,
        o,
        a = arguments[0] || {},
        s = 1,
        u = arguments.length,
        l = !1;

    for ("boolean" == typeof a && (l = a, a = arguments[s] || {}, s++), "object" == _typeof(a) || m(a) || (a = {}), s === u && (a = this, s--); s < u; s++) {
      if (null != (e = arguments[s])) for (t in e) {
        r = e[t], "__proto__" !== t && a !== r && (l && r && (k.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t], o = i && !Array.isArray(n) ? [] : i || k.isPlainObject(n) ? n : {}, i = !1, a[t] = k.extend(l, o, r)) : void 0 !== r && (a[t] = r));
      }
    }

    return a;
  }, k.extend({
    expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
    isReady: !0,
    error: function error(e) {
      throw new Error(e);
    },
    noop: function noop() {},
    isPlainObject: function isPlainObject(e) {
      var t, n;
      return !(!e || "[object Object]" !== o.call(e)) && (!(t = r(e)) || "function" == typeof (n = v.call(t, "constructor") && t.constructor) && a.call(n) === l);
    },
    isEmptyObject: function isEmptyObject(e) {
      var t;

      for (t in e) {
        return !1;
      }

      return !0;
    },
    globalEval: function globalEval(e, t) {
      b(e, {
        nonce: t && t.nonce
      });
    },
    each: function each(e, t) {
      var n,
          r = 0;

      if (d(e)) {
        for (n = e.length; r < n; r++) {
          if (!1 === t.call(e[r], r, e[r])) break;
        }
      } else for (r in e) {
        if (!1 === t.call(e[r], r, e[r])) break;
      }

      return e;
    },
    trim: function trim(e) {
      return null == e ? "" : (e + "").replace(p, "");
    },
    makeArray: function makeArray(e, t) {
      var n = t || [];
      return null != e && (d(Object(e)) ? k.merge(n, "string" == typeof e ? [e] : e) : u.call(n, e)), n;
    },
    inArray: function inArray(e, t, n) {
      return null == t ? -1 : i.call(t, e, n);
    },
    merge: function merge(e, t) {
      for (var n = +t.length, r = 0, i = e.length; r < n; r++) {
        e[i++] = t[r];
      }

      return e.length = i, e;
    },
    grep: function grep(e, t, n) {
      for (var r = [], i = 0, o = e.length, a = !n; i < o; i++) {
        !t(e[i], i) !== a && r.push(e[i]);
      }

      return r;
    },
    map: function map(e, t, n) {
      var r,
          i,
          o = 0,
          a = [];
      if (d(e)) for (r = e.length; o < r; o++) {
        null != (i = t(e[o], o, n)) && a.push(i);
      } else for (o in e) {
        null != (i = t(e[o], o, n)) && a.push(i);
      }
      return g.apply([], a);
    },
    guid: 1,
    support: y
  }), "function" == typeof Symbol && (k.fn[Symbol.iterator] = t[Symbol.iterator]), k.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function (e, t) {
    n["[object " + t + "]"] = t.toLowerCase();
  });

  var h = function (n) {
    var e,
        d,
        b,
        o,
        i,
        h,
        f,
        g,
        w,
        u,
        l,
        T,
        C,
        a,
        E,
        v,
        s,
        c,
        y,
        k = "sizzle" + 1 * new Date(),
        m = n.document,
        S = 0,
        r = 0,
        p = ue(),
        x = ue(),
        N = ue(),
        A = ue(),
        D = function D(e, t) {
      return e === t && (l = !0), 0;
    },
        j = {}.hasOwnProperty,
        t = [],
        q = t.pop,
        L = t.push,
        H = t.push,
        O = t.slice,
        P = function P(e, t) {
      for (var n = 0, r = e.length; n < r; n++) {
        if (e[n] === t) return n;
      }

      return -1;
    },
        R = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        M = "[\\x20\\t\\r\\n\\f]",
        I = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
        W = "\\[" + M + "*(" + I + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + I + "))|)" + M + "*\\]",
        $ = ":(" + I + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + W + ")*)|.*)\\)|)",
        F = new RegExp(M + "+", "g"),
        B = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"),
        _ = new RegExp("^" + M + "*," + M + "*"),
        z = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"),
        U = new RegExp(M + "|>"),
        X = new RegExp($),
        V = new RegExp("^" + I + "$"),
        G = {
      ID: new RegExp("^#(" + I + ")"),
      CLASS: new RegExp("^\\.(" + I + ")"),
      TAG: new RegExp("^(" + I + "|[*])"),
      ATTR: new RegExp("^" + W),
      PSEUDO: new RegExp("^" + $),
      CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)", "i"),
      bool: new RegExp("^(?:" + R + ")$", "i"),
      needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i")
    },
        Y = /HTML$/i,
        Q = /^(?:input|select|textarea|button)$/i,
        J = /^h\d$/i,
        K = /^[^{]+\{\s*\[native \w/,
        Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        ee = /[+~]/,
        te = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"),
        ne = function ne(e, t, n) {
      var r = "0x" + t - 65536;
      return r != r || n ? t : r < 0 ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320);
    },
        re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
        ie = function ie(e, t) {
      return t ? "\0" === e ? "\uFFFD" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e;
    },
        oe = function oe() {
      T();
    },
        ae = be(function (e) {
      return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase();
    }, {
      dir: "parentNode",
      next: "legend"
    });

    try {
      H.apply(t = O.call(m.childNodes), m.childNodes), t[m.childNodes.length].nodeType;
    } catch (e) {
      H = {
        apply: t.length ? function (e, t) {
          L.apply(e, O.call(t));
        } : function (e, t) {
          var n = e.length,
              r = 0;

          while (e[n++] = t[r++]) {
            ;
          }

          e.length = n - 1;
        }
      };
    }

    function se(t, e, n, r) {
      var i,
          o,
          a,
          s,
          u,
          l,
          c,
          f = e && e.ownerDocument,
          p = e ? e.nodeType : 9;
      if (n = n || [], "string" != typeof t || !t || 1 !== p && 9 !== p && 11 !== p) return n;

      if (!r && ((e ? e.ownerDocument || e : m) !== C && T(e), e = e || C, E)) {
        if (11 !== p && (u = Z.exec(t))) if (i = u[1]) {
          if (9 === p) {
            if (!(a = e.getElementById(i))) return n;
            if (a.id === i) return n.push(a), n;
          } else if (f && (a = f.getElementById(i)) && y(e, a) && a.id === i) return n.push(a), n;
        } else {
          if (u[2]) return H.apply(n, e.getElementsByTagName(t)), n;
          if ((i = u[3]) && d.getElementsByClassName && e.getElementsByClassName) return H.apply(n, e.getElementsByClassName(i)), n;
        }

        if (d.qsa && !A[t + " "] && (!v || !v.test(t)) && (1 !== p || "object" !== e.nodeName.toLowerCase())) {
          if (c = t, f = e, 1 === p && U.test(t)) {
            (s = e.getAttribute("id")) ? s = s.replace(re, ie) : e.setAttribute("id", s = k), o = (l = h(t)).length;

            while (o--) {
              l[o] = "#" + s + " " + xe(l[o]);
            }

            c = l.join(","), f = ee.test(t) && ye(e.parentNode) || e;
          }

          try {
            return H.apply(n, f.querySelectorAll(c)), n;
          } catch (e) {
            A(t, !0);
          } finally {
            s === k && e.removeAttribute("id");
          }
        }
      }

      return g(t.replace(B, "$1"), e, n, r);
    }

    function ue() {
      var r = [];
      return function e(t, n) {
        return r.push(t + " ") > b.cacheLength && delete e[r.shift()], e[t + " "] = n;
      };
    }

    function le(e) {
      return e[k] = !0, e;
    }

    function ce(e) {
      var t = C.createElement("fieldset");

      try {
        return !!e(t);
      } catch (e) {
        return !1;
      } finally {
        t.parentNode && t.parentNode.removeChild(t), t = null;
      }
    }

    function fe(e, t) {
      var n = e.split("|"),
          r = n.length;

      while (r--) {
        b.attrHandle[n[r]] = t;
      }
    }

    function pe(e, t) {
      var n = t && e,
          r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
      if (r) return r;
      if (n) while (n = n.nextSibling) {
        if (n === t) return -1;
      }
      return e ? 1 : -1;
    }

    function de(t) {
      return function (e) {
        return "input" === e.nodeName.toLowerCase() && e.type === t;
      };
    }

    function he(n) {
      return function (e) {
        var t = e.nodeName.toLowerCase();
        return ("input" === t || "button" === t) && e.type === n;
      };
    }

    function ge(t) {
      return function (e) {
        return "form" in e ? e.parentNode && !1 === e.disabled ? "label" in e ? "label" in e.parentNode ? e.parentNode.disabled === t : e.disabled === t : e.isDisabled === t || e.isDisabled !== !t && ae(e) === t : e.disabled === t : "label" in e && e.disabled === t;
      };
    }

    function ve(a) {
      return le(function (o) {
        return o = +o, le(function (e, t) {
          var n,
              r = a([], e.length, o),
              i = r.length;

          while (i--) {
            e[n = r[i]] && (e[n] = !(t[n] = e[n]));
          }
        });
      });
    }

    function ye(e) {
      return e && "undefined" != typeof e.getElementsByTagName && e;
    }

    for (e in d = se.support = {}, i = se.isXML = function (e) {
      var t = e.namespaceURI,
          n = (e.ownerDocument || e).documentElement;
      return !Y.test(t || n && n.nodeName || "HTML");
    }, T = se.setDocument = function (e) {
      var t,
          n,
          r = e ? e.ownerDocument || e : m;
      return r !== C && 9 === r.nodeType && r.documentElement && (a = (C = r).documentElement, E = !i(C), m !== C && (n = C.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", oe, !1) : n.attachEvent && n.attachEvent("onunload", oe)), d.attributes = ce(function (e) {
        return e.className = "i", !e.getAttribute("className");
      }), d.getElementsByTagName = ce(function (e) {
        return e.appendChild(C.createComment("")), !e.getElementsByTagName("*").length;
      }), d.getElementsByClassName = K.test(C.getElementsByClassName), d.getById = ce(function (e) {
        return a.appendChild(e).id = k, !C.getElementsByName || !C.getElementsByName(k).length;
      }), d.getById ? (b.filter.ID = function (e) {
        var t = e.replace(te, ne);
        return function (e) {
          return e.getAttribute("id") === t;
        };
      }, b.find.ID = function (e, t) {
        if ("undefined" != typeof t.getElementById && E) {
          var n = t.getElementById(e);
          return n ? [n] : [];
        }
      }) : (b.filter.ID = function (e) {
        var n = e.replace(te, ne);
        return function (e) {
          var t = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
          return t && t.value === n;
        };
      }, b.find.ID = function (e, t) {
        if ("undefined" != typeof t.getElementById && E) {
          var n,
              r,
              i,
              o = t.getElementById(e);

          if (o) {
            if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
            i = t.getElementsByName(e), r = 0;

            while (o = i[r++]) {
              if ((n = o.getAttributeNode("id")) && n.value === e) return [o];
            }
          }

          return [];
        }
      }), b.find.TAG = d.getElementsByTagName ? function (e, t) {
        return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : d.qsa ? t.querySelectorAll(e) : void 0;
      } : function (e, t) {
        var n,
            r = [],
            i = 0,
            o = t.getElementsByTagName(e);

        if ("*" === e) {
          while (n = o[i++]) {
            1 === n.nodeType && r.push(n);
          }

          return r;
        }

        return o;
      }, b.find.CLASS = d.getElementsByClassName && function (e, t) {
        if ("undefined" != typeof t.getElementsByClassName && E) return t.getElementsByClassName(e);
      }, s = [], v = [], (d.qsa = K.test(C.querySelectorAll)) && (ce(function (e) {
        a.appendChild(e).innerHTML = "<a id='" + k + "'></a><select id='" + k + "-\r\\' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && v.push("[*^$]=" + M + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || v.push("\\[" + M + "*(?:value|" + R + ")"), e.querySelectorAll("[id~=" + k + "-]").length || v.push("~="), e.querySelectorAll(":checked").length || v.push(":checked"), e.querySelectorAll("a#" + k + "+*").length || v.push(".#.+[+~]");
      }), ce(function (e) {
        e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
        var t = C.createElement("input");
        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && v.push("name" + M + "*[*^$|!~]?="), 2 !== e.querySelectorAll(":enabled").length && v.push(":enabled", ":disabled"), a.appendChild(e).disabled = !0, 2 !== e.querySelectorAll(":disabled").length && v.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), v.push(",.*:");
      })), (d.matchesSelector = K.test(c = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.msMatchesSelector)) && ce(function (e) {
        d.disconnectedMatch = c.call(e, "*"), c.call(e, "[s!='']:x"), s.push("!=", $);
      }), v = v.length && new RegExp(v.join("|")), s = s.length && new RegExp(s.join("|")), t = K.test(a.compareDocumentPosition), y = t || K.test(a.contains) ? function (e, t) {
        var n = 9 === e.nodeType ? e.documentElement : e,
            r = t && t.parentNode;
        return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)));
      } : function (e, t) {
        if (t) while (t = t.parentNode) {
          if (t === e) return !0;
        }
        return !1;
      }, D = t ? function (e, t) {
        if (e === t) return l = !0, 0;
        var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
        return n || (1 & (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !d.sortDetached && t.compareDocumentPosition(e) === n ? e === C || e.ownerDocument === m && y(m, e) ? -1 : t === C || t.ownerDocument === m && y(m, t) ? 1 : u ? P(u, e) - P(u, t) : 0 : 4 & n ? -1 : 1);
      } : function (e, t) {
        if (e === t) return l = !0, 0;
        var n,
            r = 0,
            i = e.parentNode,
            o = t.parentNode,
            a = [e],
            s = [t];
        if (!i || !o) return e === C ? -1 : t === C ? 1 : i ? -1 : o ? 1 : u ? P(u, e) - P(u, t) : 0;
        if (i === o) return pe(e, t);
        n = e;

        while (n = n.parentNode) {
          a.unshift(n);
        }

        n = t;

        while (n = n.parentNode) {
          s.unshift(n);
        }

        while (a[r] === s[r]) {
          r++;
        }

        return r ? pe(a[r], s[r]) : a[r] === m ? -1 : s[r] === m ? 1 : 0;
      }), C;
    }, se.matches = function (e, t) {
      return se(e, null, null, t);
    }, se.matchesSelector = function (e, t) {
      if ((e.ownerDocument || e) !== C && T(e), d.matchesSelector && E && !A[t + " "] && (!s || !s.test(t)) && (!v || !v.test(t))) try {
        var n = c.call(e, t);
        if (n || d.disconnectedMatch || e.document && 11 !== e.document.nodeType) return n;
      } catch (e) {
        A(t, !0);
      }
      return 0 < se(t, C, null, [e]).length;
    }, se.contains = function (e, t) {
      return (e.ownerDocument || e) !== C && T(e), y(e, t);
    }, se.attr = function (e, t) {
      (e.ownerDocument || e) !== C && T(e);
      var n = b.attrHandle[t.toLowerCase()],
          r = n && j.call(b.attrHandle, t.toLowerCase()) ? n(e, t, !E) : void 0;
      return void 0 !== r ? r : d.attributes || !E ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null;
    }, se.escape = function (e) {
      return (e + "").replace(re, ie);
    }, se.error = function (e) {
      throw new Error("Syntax error, unrecognized expression: " + e);
    }, se.uniqueSort = function (e) {
      var t,
          n = [],
          r = 0,
          i = 0;

      if (l = !d.detectDuplicates, u = !d.sortStable && e.slice(0), e.sort(D), l) {
        while (t = e[i++]) {
          t === e[i] && (r = n.push(i));
        }

        while (r--) {
          e.splice(n[r], 1);
        }
      }

      return u = null, e;
    }, o = se.getText = function (e) {
      var t,
          n = "",
          r = 0,
          i = e.nodeType;

      if (i) {
        if (1 === i || 9 === i || 11 === i) {
          if ("string" == typeof e.textContent) return e.textContent;

          for (e = e.firstChild; e; e = e.nextSibling) {
            n += o(e);
          }
        } else if (3 === i || 4 === i) return e.nodeValue;
      } else while (t = e[r++]) {
        n += o(t);
      }

      return n;
    }, (b = se.selectors = {
      cacheLength: 50,
      createPseudo: le,
      match: G,
      attrHandle: {},
      find: {},
      relative: {
        ">": {
          dir: "parentNode",
          first: !0
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: !0
        },
        "~": {
          dir: "previousSibling"
        }
      },
      preFilter: {
        ATTR: function ATTR(e) {
          return e[1] = e[1].replace(te, ne), e[3] = (e[3] || e[4] || e[5] || "").replace(te, ne), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4);
        },
        CHILD: function CHILD(e) {
          return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || se.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && se.error(e[0]), e;
        },
        PSEUDO: function PSEUDO(e) {
          var t,
              n = !e[6] && e[2];
          return G.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && X.test(n) && (t = h(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3));
        }
      },
      filter: {
        TAG: function TAG(e) {
          var t = e.replace(te, ne).toLowerCase();
          return "*" === e ? function () {
            return !0;
          } : function (e) {
            return e.nodeName && e.nodeName.toLowerCase() === t;
          };
        },
        CLASS: function CLASS(e) {
          var t = p[e + " "];
          return t || (t = new RegExp("(^|" + M + ")" + e + "(" + M + "|$)")) && p(e, function (e) {
            return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "");
          });
        },
        ATTR: function ATTR(n, r, i) {
          return function (e) {
            var t = se.attr(e, n);
            return null == t ? "!=" === r : !r || (t += "", "=" === r ? t === i : "!=" === r ? t !== i : "^=" === r ? i && 0 === t.indexOf(i) : "*=" === r ? i && -1 < t.indexOf(i) : "$=" === r ? i && t.slice(-i.length) === i : "~=" === r ? -1 < (" " + t.replace(F, " ") + " ").indexOf(i) : "|=" === r && (t === i || t.slice(0, i.length + 1) === i + "-"));
          };
        },
        CHILD: function CHILD(h, e, t, g, v) {
          var y = "nth" !== h.slice(0, 3),
              m = "last" !== h.slice(-4),
              x = "of-type" === e;
          return 1 === g && 0 === v ? function (e) {
            return !!e.parentNode;
          } : function (e, t, n) {
            var r,
                i,
                o,
                a,
                s,
                u,
                l = y !== m ? "nextSibling" : "previousSibling",
                c = e.parentNode,
                f = x && e.nodeName.toLowerCase(),
                p = !n && !x,
                d = !1;

            if (c) {
              if (y) {
                while (l) {
                  a = e;

                  while (a = a[l]) {
                    if (x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType) return !1;
                  }

                  u = l = "only" === h && !u && "nextSibling";
                }

                return !0;
              }

              if (u = [m ? c.firstChild : c.lastChild], m && p) {
                d = (s = (r = (i = (o = (a = c)[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]) && r[2], a = s && c.childNodes[s];

                while (a = ++s && a && a[l] || (d = s = 0) || u.pop()) {
                  if (1 === a.nodeType && ++d && a === e) {
                    i[h] = [S, s, d];
                    break;
                  }
                }
              } else if (p && (d = s = (r = (i = (o = (a = e)[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] || [])[0] === S && r[1]), !1 === d) while (a = ++s && a && a[l] || (d = s = 0) || u.pop()) {
                if ((x ? a.nodeName.toLowerCase() === f : 1 === a.nodeType) && ++d && (p && ((i = (o = a[k] || (a[k] = {}))[a.uniqueID] || (o[a.uniqueID] = {}))[h] = [S, d]), a === e)) break;
              }

              return (d -= v) === g || d % g == 0 && 0 <= d / g;
            }
          };
        },
        PSEUDO: function PSEUDO(e, o) {
          var t,
              a = b.pseudos[e] || b.setFilters[e.toLowerCase()] || se.error("unsupported pseudo: " + e);
          return a[k] ? a(o) : 1 < a.length ? (t = [e, e, "", o], b.setFilters.hasOwnProperty(e.toLowerCase()) ? le(function (e, t) {
            var n,
                r = a(e, o),
                i = r.length;

            while (i--) {
              e[n = P(e, r[i])] = !(t[n] = r[i]);
            }
          }) : function (e) {
            return a(e, 0, t);
          }) : a;
        }
      },
      pseudos: {
        not: le(function (e) {
          var r = [],
              i = [],
              s = f(e.replace(B, "$1"));
          return s[k] ? le(function (e, t, n, r) {
            var i,
                o = s(e, null, r, []),
                a = e.length;

            while (a--) {
              (i = o[a]) && (e[a] = !(t[a] = i));
            }
          }) : function (e, t, n) {
            return r[0] = e, s(r, null, n, i), r[0] = null, !i.pop();
          };
        }),
        has: le(function (t) {
          return function (e) {
            return 0 < se(t, e).length;
          };
        }),
        contains: le(function (t) {
          return t = t.replace(te, ne), function (e) {
            return -1 < (e.textContent || o(e)).indexOf(t);
          };
        }),
        lang: le(function (n) {
          return V.test(n || "") || se.error("unsupported lang: " + n), n = n.replace(te, ne).toLowerCase(), function (e) {
            var t;

            do {
              if (t = E ? e.lang : e.getAttribute("xml:lang") || e.getAttribute("lang")) return (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-");
            } while ((e = e.parentNode) && 1 === e.nodeType);

            return !1;
          };
        }),
        target: function target(e) {
          var t = n.location && n.location.hash;
          return t && t.slice(1) === e.id;
        },
        root: function root(e) {
          return e === a;
        },
        focus: function focus(e) {
          return e === C.activeElement && (!C.hasFocus || C.hasFocus()) && !!(e.type || e.href || ~e.tabIndex);
        },
        enabled: ge(!1),
        disabled: ge(!0),
        checked: function checked(e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && !!e.checked || "option" === t && !!e.selected;
        },
        selected: function selected(e) {
          return e.parentNode && e.parentNode.selectedIndex, !0 === e.selected;
        },
        empty: function empty(e) {
          for (e = e.firstChild; e; e = e.nextSibling) {
            if (e.nodeType < 6) return !1;
          }

          return !0;
        },
        parent: function parent(e) {
          return !b.pseudos.empty(e);
        },
        header: function header(e) {
          return J.test(e.nodeName);
        },
        input: function input(e) {
          return Q.test(e.nodeName);
        },
        button: function button(e) {
          var t = e.nodeName.toLowerCase();
          return "input" === t && "button" === e.type || "button" === t;
        },
        text: function text(e) {
          var t;
          return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase());
        },
        first: ve(function () {
          return [0];
        }),
        last: ve(function (e, t) {
          return [t - 1];
        }),
        eq: ve(function (e, t, n) {
          return [n < 0 ? n + t : n];
        }),
        even: ve(function (e, t) {
          for (var n = 0; n < t; n += 2) {
            e.push(n);
          }

          return e;
        }),
        odd: ve(function (e, t) {
          for (var n = 1; n < t; n += 2) {
            e.push(n);
          }

          return e;
        }),
        lt: ve(function (e, t, n) {
          for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r;) {
            e.push(r);
          }

          return e;
        }),
        gt: ve(function (e, t, n) {
          for (var r = n < 0 ? n + t : n; ++r < t;) {
            e.push(r);
          }

          return e;
        })
      }
    }).pseudos.nth = b.pseudos.eq, {
      radio: !0,
      checkbox: !0,
      file: !0,
      password: !0,
      image: !0
    }) {
      b.pseudos[e] = de(e);
    }

    for (e in {
      submit: !0,
      reset: !0
    }) {
      b.pseudos[e] = he(e);
    }

    function me() {}

    function xe(e) {
      for (var t = 0, n = e.length, r = ""; t < n; t++) {
        r += e[t].value;
      }

      return r;
    }

    function be(s, e, t) {
      var u = e.dir,
          l = e.next,
          c = l || u,
          f = t && "parentNode" === c,
          p = r++;
      return e.first ? function (e, t, n) {
        while (e = e[u]) {
          if (1 === e.nodeType || f) return s(e, t, n);
        }

        return !1;
      } : function (e, t, n) {
        var r,
            i,
            o,
            a = [S, p];

        if (n) {
          while (e = e[u]) {
            if ((1 === e.nodeType || f) && s(e, t, n)) return !0;
          }
        } else while (e = e[u]) {
          if (1 === e.nodeType || f) if (i = (o = e[k] || (e[k] = {}))[e.uniqueID] || (o[e.uniqueID] = {}), l && l === e.nodeName.toLowerCase()) e = e[u] || e;else {
            if ((r = i[c]) && r[0] === S && r[1] === p) return a[2] = r[2];
            if ((i[c] = a)[2] = s(e, t, n)) return !0;
          }
        }

        return !1;
      };
    }

    function we(i) {
      return 1 < i.length ? function (e, t, n) {
        var r = i.length;

        while (r--) {
          if (!i[r](e, t, n)) return !1;
        }

        return !0;
      } : i[0];
    }

    function Te(e, t, n, r, i) {
      for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++) {
        (o = e[s]) && (n && !n(o, r, i) || (a.push(o), l && t.push(s)));
      }

      return a;
    }

    function Ce(d, h, g, v, y, e) {
      return v && !v[k] && (v = Ce(v)), y && !y[k] && (y = Ce(y, e)), le(function (e, t, n, r) {
        var i,
            o,
            a,
            s = [],
            u = [],
            l = t.length,
            c = e || function (e, t, n) {
          for (var r = 0, i = t.length; r < i; r++) {
            se(e, t[r], n);
          }

          return n;
        }(h || "*", n.nodeType ? [n] : n, []),
            f = !d || !e && h ? c : Te(c, s, d, n, r),
            p = g ? y || (e ? d : l || v) ? [] : t : f;

        if (g && g(f, p, n, r), v) {
          i = Te(p, u), v(i, [], n, r), o = i.length;

          while (o--) {
            (a = i[o]) && (p[u[o]] = !(f[u[o]] = a));
          }
        }

        if (e) {
          if (y || d) {
            if (y) {
              i = [], o = p.length;

              while (o--) {
                (a = p[o]) && i.push(f[o] = a);
              }

              y(null, p = [], i, r);
            }

            o = p.length;

            while (o--) {
              (a = p[o]) && -1 < (i = y ? P(e, a) : s[o]) && (e[i] = !(t[i] = a));
            }
          }
        } else p = Te(p === t ? p.splice(l, p.length) : p), y ? y(null, t, p, r) : H.apply(t, p);
      });
    }

    function Ee(e) {
      for (var i, t, n, r = e.length, o = b.relative[e[0].type], a = o || b.relative[" "], s = o ? 1 : 0, u = be(function (e) {
        return e === i;
      }, a, !0), l = be(function (e) {
        return -1 < P(i, e);
      }, a, !0), c = [function (e, t, n) {
        var r = !o && (n || t !== w) || ((i = t).nodeType ? u(e, t, n) : l(e, t, n));
        return i = null, r;
      }]; s < r; s++) {
        if (t = b.relative[e[s].type]) c = [be(we(c), t)];else {
          if ((t = b.filter[e[s].type].apply(null, e[s].matches))[k]) {
            for (n = ++s; n < r; n++) {
              if (b.relative[e[n].type]) break;
            }

            return Ce(1 < s && we(c), 1 < s && xe(e.slice(0, s - 1).concat({
              value: " " === e[s - 2].type ? "*" : ""
            })).replace(B, "$1"), t, s < n && Ee(e.slice(s, n)), n < r && Ee(e = e.slice(n)), n < r && xe(e));
          }

          c.push(t);
        }
      }

      return we(c);
    }

    return me.prototype = b.filters = b.pseudos, b.setFilters = new me(), h = se.tokenize = function (e, t) {
      var n,
          r,
          i,
          o,
          a,
          s,
          u,
          l = x[e + " "];
      if (l) return t ? 0 : l.slice(0);
      a = e, s = [], u = b.preFilter;

      while (a) {
        for (o in n && !(r = _.exec(a)) || (r && (a = a.slice(r[0].length) || a), s.push(i = [])), n = !1, (r = z.exec(a)) && (n = r.shift(), i.push({
          value: n,
          type: r[0].replace(B, " ")
        }), a = a.slice(n.length)), b.filter) {
          !(r = G[o].exec(a)) || u[o] && !(r = u[o](r)) || (n = r.shift(), i.push({
            value: n,
            type: o,
            matches: r
          }), a = a.slice(n.length));
        }

        if (!n) break;
      }

      return t ? a.length : a ? se.error(e) : x(e, s).slice(0);
    }, f = se.compile = function (e, t) {
      var n,
          v,
          y,
          m,
          x,
          r,
          i = [],
          o = [],
          a = N[e + " "];

      if (!a) {
        t || (t = h(e)), n = t.length;

        while (n--) {
          (a = Ee(t[n]))[k] ? i.push(a) : o.push(a);
        }

        (a = N(e, (v = o, m = 0 < (y = i).length, x = 0 < v.length, r = function r(e, t, n, _r, i) {
          var o,
              a,
              s,
              u = 0,
              l = "0",
              c = e && [],
              f = [],
              p = w,
              d = e || x && b.find.TAG("*", i),
              h = S += null == p ? 1 : Math.random() || .1,
              g = d.length;

          for (i && (w = t === C || t || i); l !== g && null != (o = d[l]); l++) {
            if (x && o) {
              a = 0, t || o.ownerDocument === C || (T(o), n = !E);

              while (s = v[a++]) {
                if (s(o, t || C, n)) {
                  _r.push(o);

                  break;
                }
              }

              i && (S = h);
            }

            m && ((o = !s && o) && u--, e && c.push(o));
          }

          if (u += l, m && l !== u) {
            a = 0;

            while (s = y[a++]) {
              s(c, f, t, n);
            }

            if (e) {
              if (0 < u) while (l--) {
                c[l] || f[l] || (f[l] = q.call(_r));
              }
              f = Te(f);
            }

            H.apply(_r, f), i && !e && 0 < f.length && 1 < u + y.length && se.uniqueSort(_r);
          }

          return i && (S = h, w = p), c;
        }, m ? le(r) : r))).selector = e;
      }

      return a;
    }, g = se.select = function (e, t, n, r) {
      var i,
          o,
          a,
          s,
          u,
          l = "function" == typeof e && e,
          c = !r && h(e = l.selector || e);

      if (n = n || [], 1 === c.length) {
        if (2 < (o = c[0] = c[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && E && b.relative[o[1].type]) {
          if (!(t = (b.find.ID(a.matches[0].replace(te, ne), t) || [])[0])) return n;
          l && (t = t.parentNode), e = e.slice(o.shift().value.length);
        }

        i = G.needsContext.test(e) ? 0 : o.length;

        while (i--) {
          if (a = o[i], b.relative[s = a.type]) break;

          if ((u = b.find[s]) && (r = u(a.matches[0].replace(te, ne), ee.test(o[0].type) && ye(t.parentNode) || t))) {
            if (o.splice(i, 1), !(e = r.length && xe(o))) return H.apply(n, r), n;
            break;
          }
        }
      }

      return (l || f(e, c))(r, t, !E, n, !t || ee.test(e) && ye(t.parentNode) || t), n;
    }, d.sortStable = k.split("").sort(D).join("") === k, d.detectDuplicates = !!l, T(), d.sortDetached = ce(function (e) {
      return 1 & e.compareDocumentPosition(C.createElement("fieldset"));
    }), ce(function (e) {
      return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href");
    }) || fe("type|href|height|width", function (e, t, n) {
      if (!n) return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
    }), d.attributes && ce(function (e) {
      return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value");
    }) || fe("value", function (e, t, n) {
      if (!n && "input" === e.nodeName.toLowerCase()) return e.defaultValue;
    }), ce(function (e) {
      return null == e.getAttribute("disabled");
    }) || fe(R, function (e, t, n) {
      var r;
      if (!n) return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null;
    }), se;
  }(C);

  k.find = h, k.expr = h.selectors, k.expr[":"] = k.expr.pseudos, k.uniqueSort = k.unique = h.uniqueSort, k.text = h.getText, k.isXMLDoc = h.isXML, k.contains = h.contains, k.escapeSelector = h.escape;

  var T = function T(e, t, n) {
    var r = [],
        i = void 0 !== n;

    while ((e = e[t]) && 9 !== e.nodeType) {
      if (1 === e.nodeType) {
        if (i && k(e).is(n)) break;
        r.push(e);
      }
    }

    return r;
  },
      S = function S(e, t) {
    for (var n = []; e; e = e.nextSibling) {
      1 === e.nodeType && e !== t && n.push(e);
    }

    return n;
  },
      N = k.expr.match.needsContext;

  function A(e, t) {
    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
  }

  var D = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

  function j(e, n, r) {
    return m(n) ? k.grep(e, function (e, t) {
      return !!n.call(e, t, e) !== r;
    }) : n.nodeType ? k.grep(e, function (e) {
      return e === n !== r;
    }) : "string" != typeof n ? k.grep(e, function (e) {
      return -1 < i.call(n, e) !== r;
    }) : k.filter(n, e, r);
  }

  k.filter = function (e, t, n) {
    var r = t[0];
    return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? k.find.matchesSelector(r, e) ? [r] : [] : k.find.matches(e, k.grep(t, function (e) {
      return 1 === e.nodeType;
    }));
  }, k.fn.extend({
    find: function find(e) {
      var t,
          n,
          r = this.length,
          i = this;
      if ("string" != typeof e) return this.pushStack(k(e).filter(function () {
        for (t = 0; t < r; t++) {
          if (k.contains(i[t], this)) return !0;
        }
      }));

      for (n = this.pushStack([]), t = 0; t < r; t++) {
        k.find(e, i[t], n);
      }

      return 1 < r ? k.uniqueSort(n) : n;
    },
    filter: function filter(e) {
      return this.pushStack(j(this, e || [], !1));
    },
    not: function not(e) {
      return this.pushStack(j(this, e || [], !0));
    },
    is: function is(e) {
      return !!j(this, "string" == typeof e && N.test(e) ? k(e) : e || [], !1).length;
    }
  });
  var q,
      L = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
  (k.fn.init = function (e, t, n) {
    var r, i;
    if (!e) return this;

    if (n = n || q, "string" == typeof e) {
      if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : L.exec(e)) || !r[1] && t) return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);

      if (r[1]) {
        if (t = t instanceof k ? t[0] : t, k.merge(this, k.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : E, !0)), D.test(r[1]) && k.isPlainObject(t)) for (r in t) {
          m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
        }
        return this;
      }

      return (i = E.getElementById(r[2])) && (this[0] = i, this.length = 1), this;
    }

    return e.nodeType ? (this[0] = e, this.length = 1, this) : m(e) ? void 0 !== n.ready ? n.ready(e) : e(k) : k.makeArray(e, this);
  }).prototype = k.fn, q = k(E);
  var H = /^(?:parents|prev(?:Until|All))/,
      O = {
    children: !0,
    contents: !0,
    next: !0,
    prev: !0
  };

  function P(e, t) {
    while ((e = e[t]) && 1 !== e.nodeType) {
      ;
    }

    return e;
  }

  k.fn.extend({
    has: function has(e) {
      var t = k(e, this),
          n = t.length;
      return this.filter(function () {
        for (var e = 0; e < n; e++) {
          if (k.contains(this, t[e])) return !0;
        }
      });
    },
    closest: function closest(e, t) {
      var n,
          r = 0,
          i = this.length,
          o = [],
          a = "string" != typeof e && k(e);
      if (!N.test(e)) for (; r < i; r++) {
        for (n = this[r]; n && n !== t; n = n.parentNode) {
          if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && k.find.matchesSelector(n, e))) {
            o.push(n);
            break;
          }
        }
      }
      return this.pushStack(1 < o.length ? k.uniqueSort(o) : o);
    },
    index: function index(e) {
      return e ? "string" == typeof e ? i.call(k(e), this[0]) : i.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
    },
    add: function add(e, t) {
      return this.pushStack(k.uniqueSort(k.merge(this.get(), k(e, t))));
    },
    addBack: function addBack(e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    }
  }), k.each({
    parent: function parent(e) {
      var t = e.parentNode;
      return t && 11 !== t.nodeType ? t : null;
    },
    parents: function parents(e) {
      return T(e, "parentNode");
    },
    parentsUntil: function parentsUntil(e, t, n) {
      return T(e, "parentNode", n);
    },
    next: function next(e) {
      return P(e, "nextSibling");
    },
    prev: function prev(e) {
      return P(e, "previousSibling");
    },
    nextAll: function nextAll(e) {
      return T(e, "nextSibling");
    },
    prevAll: function prevAll(e) {
      return T(e, "previousSibling");
    },
    nextUntil: function nextUntil(e, t, n) {
      return T(e, "nextSibling", n);
    },
    prevUntil: function prevUntil(e, t, n) {
      return T(e, "previousSibling", n);
    },
    siblings: function siblings(e) {
      return S((e.parentNode || {}).firstChild, e);
    },
    children: function children(e) {
      return S(e.firstChild);
    },
    contents: function contents(e) {
      return "undefined" != typeof e.contentDocument ? e.contentDocument : (A(e, "template") && (e = e.content || e), k.merge([], e.childNodes));
    }
  }, function (r, i) {
    k.fn[r] = function (e, t) {
      var n = k.map(this, i, e);
      return "Until" !== r.slice(-5) && (t = e), t && "string" == typeof t && (n = k.filter(t, n)), 1 < this.length && (O[r] || k.uniqueSort(n), H.test(r) && n.reverse()), this.pushStack(n);
    };
  });
  var R = /[^\x20\t\r\n\f]+/g;

  function M(e) {
    return e;
  }

  function I(e) {
    throw e;
  }

  function W(e, t, n, r) {
    var i;

    try {
      e && m(i = e.promise) ? i.call(e).done(t).fail(n) : e && m(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r));
    } catch (e) {
      n.apply(void 0, [e]);
    }
  }

  k.Callbacks = function (r) {
    var e, n;
    r = "string" == typeof r ? (e = r, n = {}, k.each(e.match(R) || [], function (e, t) {
      n[t] = !0;
    }), n) : k.extend({}, r);

    var i,
        t,
        o,
        a,
        s = [],
        u = [],
        l = -1,
        c = function c() {
      for (a = a || r.once, o = i = !0; u.length; l = -1) {
        t = u.shift();

        while (++l < s.length) {
          !1 === s[l].apply(t[0], t[1]) && r.stopOnFalse && (l = s.length, t = !1);
        }
      }

      r.memory || (t = !1), i = !1, a && (s = t ? [] : "");
    },
        f = {
      add: function add() {
        return s && (t && !i && (l = s.length - 1, u.push(t)), function n(e) {
          k.each(e, function (e, t) {
            m(t) ? r.unique && f.has(t) || s.push(t) : t && t.length && "string" !== w(t) && n(t);
          });
        }(arguments), t && !i && c()), this;
      },
      remove: function remove() {
        return k.each(arguments, function (e, t) {
          var n;

          while (-1 < (n = k.inArray(t, s, n))) {
            s.splice(n, 1), n <= l && l--;
          }
        }), this;
      },
      has: function has(e) {
        return e ? -1 < k.inArray(e, s) : 0 < s.length;
      },
      empty: function empty() {
        return s && (s = []), this;
      },
      disable: function disable() {
        return a = u = [], s = t = "", this;
      },
      disabled: function disabled() {
        return !s;
      },
      lock: function lock() {
        return a = u = [], t || i || (s = t = ""), this;
      },
      locked: function locked() {
        return !!a;
      },
      fireWith: function fireWith(e, t) {
        return a || (t = [e, (t = t || []).slice ? t.slice() : t], u.push(t), i || c()), this;
      },
      fire: function fire() {
        return f.fireWith(this, arguments), this;
      },
      fired: function fired() {
        return !!o;
      }
    };

    return f;
  }, k.extend({
    Deferred: function Deferred(e) {
      var o = [["notify", "progress", k.Callbacks("memory"), k.Callbacks("memory"), 2], ["resolve", "done", k.Callbacks("once memory"), k.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", k.Callbacks("once memory"), k.Callbacks("once memory"), 1, "rejected"]],
          i = "pending",
          a = {
        state: function state() {
          return i;
        },
        always: function always() {
          return s.done(arguments).fail(arguments), this;
        },
        "catch": function _catch(e) {
          return a.then(null, e);
        },
        pipe: function pipe() {
          var i = arguments;
          return k.Deferred(function (r) {
            k.each(o, function (e, t) {
              var n = m(i[t[4]]) && i[t[4]];
              s[t[1]](function () {
                var e = n && n.apply(this, arguments);
                e && m(e.promise) ? e.promise().progress(r.notify).done(r.resolve).fail(r.reject) : r[t[0] + "With"](this, n ? [e] : arguments);
              });
            }), i = null;
          }).promise();
        },
        then: function then(t, n, r) {
          var u = 0;

          function l(i, o, a, s) {
            return function () {
              var n = this,
                  r = arguments,
                  e = function e() {
                var e, t;

                if (!(i < u)) {
                  if ((e = a.apply(n, r)) === o.promise()) throw new TypeError("Thenable self-resolution");
                  t = e && ("object" == _typeof(e) || "function" == typeof e) && e.then, m(t) ? s ? t.call(e, l(u, o, M, s), l(u, o, I, s)) : (u++, t.call(e, l(u, o, M, s), l(u, o, I, s), l(u, o, M, o.notifyWith))) : (a !== M && (n = void 0, r = [e]), (s || o.resolveWith)(n, r));
                }
              },
                  t = s ? e : function () {
                try {
                  e();
                } catch (e) {
                  k.Deferred.exceptionHook && k.Deferred.exceptionHook(e, t.stackTrace), u <= i + 1 && (a !== I && (n = void 0, r = [e]), o.rejectWith(n, r));
                }
              };

              i ? t() : (k.Deferred.getStackHook && (t.stackTrace = k.Deferred.getStackHook()), C.setTimeout(t));
            };
          }

          return k.Deferred(function (e) {
            o[0][3].add(l(0, e, m(r) ? r : M, e.notifyWith)), o[1][3].add(l(0, e, m(t) ? t : M)), o[2][3].add(l(0, e, m(n) ? n : I));
          }).promise();
        },
        promise: function promise(e) {
          return null != e ? k.extend(e, a) : a;
        }
      },
          s = {};
      return k.each(o, function (e, t) {
        var n = t[2],
            r = t[5];
        a[t[1]] = n.add, r && n.add(function () {
          i = r;
        }, o[3 - e][2].disable, o[3 - e][3].disable, o[0][2].lock, o[0][3].lock), n.add(t[3].fire), s[t[0]] = function () {
          return s[t[0] + "With"](this === s ? void 0 : this, arguments), this;
        }, s[t[0] + "With"] = n.fireWith;
      }), a.promise(s), e && e.call(s, s), s;
    },
    when: function when(e) {
      var n = arguments.length,
          t = n,
          r = Array(t),
          i = s.call(arguments),
          o = k.Deferred(),
          a = function a(t) {
        return function (e) {
          r[t] = this, i[t] = 1 < arguments.length ? s.call(arguments) : e, --n || o.resolveWith(r, i);
        };
      };

      if (n <= 1 && (W(e, o.done(a(t)).resolve, o.reject, !n), "pending" === o.state() || m(i[t] && i[t].then))) return o.then();

      while (t--) {
        W(i[t], a(t), o.reject);
      }

      return o.promise();
    }
  });
  var $ = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  k.Deferred.exceptionHook = function (e, t) {
    C.console && C.console.warn && e && $.test(e.name) && C.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t);
  }, k.readyException = function (e) {
    C.setTimeout(function () {
      throw e;
    });
  };
  var F = k.Deferred();

  function B() {
    E.removeEventListener("DOMContentLoaded", B), C.removeEventListener("load", B), k.ready();
  }

  k.fn.ready = function (e) {
    return F.then(e)["catch"](function (e) {
      k.readyException(e);
    }), this;
  }, k.extend({
    isReady: !1,
    readyWait: 1,
    ready: function ready(e) {
      (!0 === e ? --k.readyWait : k.isReady) || (k.isReady = !0) !== e && 0 < --k.readyWait || F.resolveWith(E, [k]);
    }
  }), k.ready.then = F.then, "complete" === E.readyState || "loading" !== E.readyState && !E.documentElement.doScroll ? C.setTimeout(k.ready) : (E.addEventListener("DOMContentLoaded", B), C.addEventListener("load", B));

  var _ = function _(e, t, n, r, i, o, a) {
    var s = 0,
        u = e.length,
        l = null == n;
    if ("object" === w(n)) for (s in i = !0, n) {
      _(e, t, s, n[s], !0, o, a);
    } else if (void 0 !== r && (i = !0, m(r) || (a = !0), l && (a ? (t.call(e, r), t = null) : (l = t, t = function t(e, _t2, n) {
      return l.call(k(e), n);
    })), t)) for (; s < u; s++) {
      t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
    }
    return i ? e : l ? t.call(e) : u ? t(e[0], n) : o;
  },
      z = /^-ms-/,
      U = /-([a-z])/g;

  function X(e, t) {
    return t.toUpperCase();
  }

  function V(e) {
    return e.replace(z, "ms-").replace(U, X);
  }

  var G = function G(e) {
    return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
  };

  function Y() {
    this.expando = k.expando + Y.uid++;
  }

  Y.uid = 1, Y.prototype = {
    cache: function cache(e) {
      var t = e[this.expando];
      return t || (t = {}, G(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
        value: t,
        configurable: !0
      }))), t;
    },
    set: function set(e, t, n) {
      var r,
          i = this.cache(e);
      if ("string" == typeof t) i[V(t)] = n;else for (r in t) {
        i[V(r)] = t[r];
      }
      return i;
    },
    get: function get(e, t) {
      return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][V(t)];
    },
    access: function access(e, t, n) {
      return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n), void 0 !== n ? n : t);
    },
    remove: function remove(e, t) {
      var n,
          r = e[this.expando];

      if (void 0 !== r) {
        if (void 0 !== t) {
          n = (t = Array.isArray(t) ? t.map(V) : (t = V(t)) in r ? [t] : t.match(R) || []).length;

          while (n--) {
            delete r[t[n]];
          }
        }

        (void 0 === t || k.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando]);
      }
    },
    hasData: function hasData(e) {
      var t = e[this.expando];
      return void 0 !== t && !k.isEmptyObject(t);
    }
  };
  var Q = new Y(),
      J = new Y(),
      K = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
      Z = /[A-Z]/g;

  function ee(e, t, n) {
    var r, i;
    if (void 0 === n && 1 === e.nodeType) if (r = "data-" + t.replace(Z, "-$&").toLowerCase(), "string" == typeof (n = e.getAttribute(r))) {
      try {
        n = "true" === (i = n) || "false" !== i && ("null" === i ? null : i === +i + "" ? +i : K.test(i) ? JSON.parse(i) : i);
      } catch (e) {}

      J.set(e, t, n);
    } else n = void 0;
    return n;
  }

  k.extend({
    hasData: function hasData(e) {
      return J.hasData(e) || Q.hasData(e);
    },
    data: function data(e, t, n) {
      return J.access(e, t, n);
    },
    removeData: function removeData(e, t) {
      J.remove(e, t);
    },
    _data: function _data(e, t, n) {
      return Q.access(e, t, n);
    },
    _removeData: function _removeData(e, t) {
      Q.remove(e, t);
    }
  }), k.fn.extend({
    data: function data(n, e) {
      var t,
          r,
          i,
          o = this[0],
          a = o && o.attributes;

      if (void 0 === n) {
        if (this.length && (i = J.get(o), 1 === o.nodeType && !Q.get(o, "hasDataAttrs"))) {
          t = a.length;

          while (t--) {
            a[t] && 0 === (r = a[t].name).indexOf("data-") && (r = V(r.slice(5)), ee(o, r, i[r]));
          }

          Q.set(o, "hasDataAttrs", !0);
        }

        return i;
      }

      return "object" == _typeof(n) ? this.each(function () {
        J.set(this, n);
      }) : _(this, function (e) {
        var t;
        if (o && void 0 === e) return void 0 !== (t = J.get(o, n)) ? t : void 0 !== (t = ee(o, n)) ? t : void 0;
        this.each(function () {
          J.set(this, n, e);
        });
      }, null, e, 1 < arguments.length, null, !0);
    },
    removeData: function removeData(e) {
      return this.each(function () {
        J.remove(this, e);
      });
    }
  }), k.extend({
    queue: function queue(e, t, n) {
      var r;
      if (e) return t = (t || "fx") + "queue", r = Q.get(e, t), n && (!r || Array.isArray(n) ? r = Q.access(e, t, k.makeArray(n)) : r.push(n)), r || [];
    },
    dequeue: function dequeue(e, t) {
      t = t || "fx";

      var n = k.queue(e, t),
          r = n.length,
          i = n.shift(),
          o = k._queueHooks(e, t);

      "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, function () {
        k.dequeue(e, t);
      }, o)), !r && o && o.empty.fire();
    },
    _queueHooks: function _queueHooks(e, t) {
      var n = t + "queueHooks";
      return Q.get(e, n) || Q.access(e, n, {
        empty: k.Callbacks("once memory").add(function () {
          Q.remove(e, [t + "queue", n]);
        })
      });
    }
  }), k.fn.extend({
    queue: function queue(t, n) {
      var e = 2;
      return "string" != typeof t && (n = t, t = "fx", e--), arguments.length < e ? k.queue(this[0], t) : void 0 === n ? this : this.each(function () {
        var e = k.queue(this, t, n);
        k._queueHooks(this, t), "fx" === t && "inprogress" !== e[0] && k.dequeue(this, t);
      });
    },
    dequeue: function dequeue(e) {
      return this.each(function () {
        k.dequeue(this, e);
      });
    },
    clearQueue: function clearQueue(e) {
      return this.queue(e || "fx", []);
    },
    promise: function promise(e, t) {
      var n,
          r = 1,
          i = k.Deferred(),
          o = this,
          a = this.length,
          s = function s() {
        --r || i.resolveWith(o, [o]);
      };

      "string" != typeof e && (t = e, e = void 0), e = e || "fx";

      while (a--) {
        (n = Q.get(o[a], e + "queueHooks")) && n.empty && (r++, n.empty.add(s));
      }

      return s(), i.promise(t);
    }
  });

  var te = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
      ne = new RegExp("^(?:([+-])=|)(" + te + ")([a-z%]*)$", "i"),
      re = ["Top", "Right", "Bottom", "Left"],
      ie = E.documentElement,
      oe = function oe(e) {
    return k.contains(e.ownerDocument, e);
  },
      ae = {
    composed: !0
  };

  ie.getRootNode && (oe = function oe(e) {
    return k.contains(e.ownerDocument, e) || e.getRootNode(ae) === e.ownerDocument;
  });

  var se = function se(e, t) {
    return "none" === (e = t || e).style.display || "" === e.style.display && oe(e) && "none" === k.css(e, "display");
  },
      ue = function ue(e, t, n, r) {
    var i,
        o,
        a = {};

    for (o in t) {
      a[o] = e.style[o], e.style[o] = t[o];
    }

    for (o in i = n.apply(e, r || []), t) {
      e.style[o] = a[o];
    }

    return i;
  };

  function le(e, t, n, r) {
    var i,
        o,
        a = 20,
        s = r ? function () {
      return r.cur();
    } : function () {
      return k.css(e, t, "");
    },
        u = s(),
        l = n && n[3] || (k.cssNumber[t] ? "" : "px"),
        c = e.nodeType && (k.cssNumber[t] || "px" !== l && +u) && ne.exec(k.css(e, t));

    if (c && c[3] !== l) {
      u /= 2, l = l || c[3], c = +u || 1;

      while (a--) {
        k.style(e, t, c + l), (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0), c /= o;
      }

      c *= 2, k.style(e, t, c + l), n = n || [];
    }

    return n && (c = +c || +u || 0, i = n[1] ? c + (n[1] + 1) * n[2] : +n[2], r && (r.unit = l, r.start = c, r.end = i)), i;
  }

  var ce = {};

  function fe(e, t) {
    for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++) {
      (r = e[c]).style && (n = r.style.display, t ? ("none" === n && (l[c] = Q.get(r, "display") || null, l[c] || (r.style.display = "")), "" === r.style.display && se(r) && (l[c] = (u = a = o = void 0, a = (i = r).ownerDocument, s = i.nodeName, (u = ce[s]) || (o = a.body.appendChild(a.createElement(s)), u = k.css(o, "display"), o.parentNode.removeChild(o), "none" === u && (u = "block"), ce[s] = u)))) : "none" !== n && (l[c] = "none", Q.set(r, "display", n)));
    }

    for (c = 0; c < f; c++) {
      null != l[c] && (e[c].style.display = l[c]);
    }

    return e;
  }

  k.fn.extend({
    show: function show() {
      return fe(this, !0);
    },
    hide: function hide() {
      return fe(this);
    },
    toggle: function toggle(e) {
      return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
        se(this) ? k(this).show() : k(this).hide();
      });
    }
  });
  var pe = /^(?:checkbox|radio)$/i,
      de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
      he = /^$|^module$|\/(?:java|ecma)script/i,
      ge = {
    option: [1, "<select multiple='multiple'>", "</select>"],
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""]
  };

  function ve(e, t) {
    var n;
    return n = "undefined" != typeof e.getElementsByTagName ? e.getElementsByTagName(t || "*") : "undefined" != typeof e.querySelectorAll ? e.querySelectorAll(t || "*") : [], void 0 === t || t && A(e, t) ? k.merge([e], n) : n;
  }

  function ye(e, t) {
    for (var n = 0, r = e.length; n < r; n++) {
      Q.set(e[n], "globalEval", !t || Q.get(t[n], "globalEval"));
    }
  }

  ge.optgroup = ge.option, ge.tbody = ge.tfoot = ge.colgroup = ge.caption = ge.thead, ge.th = ge.td;
  var me,
      xe,
      be = /<|&#?\w+;/;

  function we(e, t, n, r, i) {
    for (var o, a, s, u, l, c, f = t.createDocumentFragment(), p = [], d = 0, h = e.length; d < h; d++) {
      if ((o = e[d]) || 0 === o) if ("object" === w(o)) k.merge(p, o.nodeType ? [o] : o);else if (be.test(o)) {
        a = a || f.appendChild(t.createElement("div")), s = (de.exec(o) || ["", ""])[1].toLowerCase(), u = ge[s] || ge._default, a.innerHTML = u[1] + k.htmlPrefilter(o) + u[2], c = u[0];

        while (c--) {
          a = a.lastChild;
        }

        k.merge(p, a.childNodes), (a = f.firstChild).textContent = "";
      } else p.push(t.createTextNode(o));
    }

    f.textContent = "", d = 0;

    while (o = p[d++]) {
      if (r && -1 < k.inArray(o, r)) i && i.push(o);else if (l = oe(o), a = ve(f.appendChild(o), "script"), l && ye(a), n) {
        c = 0;

        while (o = a[c++]) {
          he.test(o.type || "") && n.push(o);
        }
      }
    }

    return f;
  }

  me = E.createDocumentFragment().appendChild(E.createElement("div")), (xe = E.createElement("input")).setAttribute("type", "radio"), xe.setAttribute("checked", "checked"), xe.setAttribute("name", "t"), me.appendChild(xe), y.checkClone = me.cloneNode(!0).cloneNode(!0).lastChild.checked, me.innerHTML = "<textarea>x</textarea>", y.noCloneChecked = !!me.cloneNode(!0).lastChild.defaultValue;
  var Te = /^key/,
      Ce = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
      Ee = /^([^.]*)(?:\.(.+)|)/;

  function ke() {
    return !0;
  }

  function Se() {
    return !1;
  }

  function Ne(e, t) {
    return e === function () {
      try {
        return E.activeElement;
      } catch (e) {}
    }() == ("focus" === t);
  }

  function Ae(e, t, n, r, i, o) {
    var a, s;

    if ("object" == _typeof(t)) {
      for (s in "string" != typeof n && (r = r || n, n = void 0), t) {
        Ae(e, s, n, r, t[s], o);
      }

      return e;
    }

    if (null == r && null == i ? (i = n, r = n = void 0) : null == i && ("string" == typeof n ? (i = r, r = void 0) : (i = r, r = n, n = void 0)), !1 === i) i = Se;else if (!i) return e;
    return 1 === o && (a = i, (i = function i(e) {
      return k().off(e), a.apply(this, arguments);
    }).guid = a.guid || (a.guid = k.guid++)), e.each(function () {
      k.event.add(this, t, i, r, n);
    });
  }

  function De(e, i, o) {
    o ? (Q.set(e, i, !1), k.event.add(e, i, {
      namespace: !1,
      handler: function handler(e) {
        var t,
            n,
            r = Q.get(this, i);

        if (1 & e.isTrigger && this[i]) {
          if (r.length) (k.event.special[i] || {}).delegateType && e.stopPropagation();else if (r = s.call(arguments), Q.set(this, i, r), t = o(this, i), this[i](), r !== (n = Q.get(this, i)) || t ? Q.set(this, i, !1) : n = {}, r !== n) return e.stopImmediatePropagation(), e.preventDefault(), n.value;
        } else r.length && (Q.set(this, i, {
          value: k.event.trigger(k.extend(r[0], k.Event.prototype), r.slice(1), this)
        }), e.stopImmediatePropagation());
      }
    })) : void 0 === Q.get(e, i) && k.event.add(e, i, ke);
  }

  k.event = {
    global: {},
    add: function add(t, e, n, r, i) {
      var o,
          a,
          s,
          u,
          l,
          c,
          f,
          p,
          d,
          h,
          g,
          v = Q.get(t);

      if (v) {
        n.handler && (n = (o = n).handler, i = o.selector), i && k.find.matchesSelector(ie, i), n.guid || (n.guid = k.guid++), (u = v.events) || (u = v.events = {}), (a = v.handle) || (a = v.handle = function (e) {
          return "undefined" != typeof k && k.event.triggered !== e.type ? k.event.dispatch.apply(t, arguments) : void 0;
        }), l = (e = (e || "").match(R) || [""]).length;

        while (l--) {
          d = g = (s = Ee.exec(e[l]) || [])[1], h = (s[2] || "").split(".").sort(), d && (f = k.event.special[d] || {}, d = (i ? f.delegateType : f.bindType) || d, f = k.event.special[d] || {}, c = k.extend({
            type: d,
            origType: g,
            data: r,
            handler: n,
            guid: n.guid,
            selector: i,
            needsContext: i && k.expr.match.needsContext.test(i),
            namespace: h.join(".")
          }, o), (p = u[d]) || ((p = u[d] = []).delegateCount = 0, f.setup && !1 !== f.setup.call(t, r, h, a) || t.addEventListener && t.addEventListener(d, a)), f.add && (f.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)), i ? p.splice(p.delegateCount++, 0, c) : p.push(c), k.event.global[d] = !0);
        }
      }
    },
    remove: function remove(e, t, n, r, i) {
      var o,
          a,
          s,
          u,
          l,
          c,
          f,
          p,
          d,
          h,
          g,
          v = Q.hasData(e) && Q.get(e);

      if (v && (u = v.events)) {
        l = (t = (t || "").match(R) || [""]).length;

        while (l--) {
          if (d = g = (s = Ee.exec(t[l]) || [])[1], h = (s[2] || "").split(".").sort(), d) {
            f = k.event.special[d] || {}, p = u[d = (r ? f.delegateType : f.bindType) || d] || [], s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = p.length;

            while (o--) {
              c = p[o], !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1), c.selector && p.delegateCount--, f.remove && f.remove.call(e, c));
            }

            a && !p.length && (f.teardown && !1 !== f.teardown.call(e, h, v.handle) || k.removeEvent(e, d, v.handle), delete u[d]);
          } else for (d in u) {
            k.event.remove(e, d + t[l], n, r, !0);
          }
        }

        k.isEmptyObject(u) && Q.remove(e, "handle events");
      }
    },
    dispatch: function dispatch(e) {
      var t,
          n,
          r,
          i,
          o,
          a,
          s = k.event.fix(e),
          u = new Array(arguments.length),
          l = (Q.get(this, "events") || {})[s.type] || [],
          c = k.event.special[s.type] || {};

      for (u[0] = s, t = 1; t < arguments.length; t++) {
        u[t] = arguments[t];
      }

      if (s.delegateTarget = this, !c.preDispatch || !1 !== c.preDispatch.call(this, s)) {
        a = k.event.handlers.call(this, s, l), t = 0;

        while ((i = a[t++]) && !s.isPropagationStopped()) {
          s.currentTarget = i.elem, n = 0;

          while ((o = i.handlers[n++]) && !s.isImmediatePropagationStopped()) {
            s.rnamespace && !1 !== o.namespace && !s.rnamespace.test(o.namespace) || (s.handleObj = o, s.data = o.data, void 0 !== (r = ((k.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, u)) && !1 === (s.result = r) && (s.preventDefault(), s.stopPropagation()));
          }
        }

        return c.postDispatch && c.postDispatch.call(this, s), s.result;
      }
    },
    handlers: function handlers(e, t) {
      var n,
          r,
          i,
          o,
          a,
          s = [],
          u = t.delegateCount,
          l = e.target;
      if (u && l.nodeType && !("click" === e.type && 1 <= e.button)) for (; l !== this; l = l.parentNode || this) {
        if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
          for (o = [], a = {}, n = 0; n < u; n++) {
            void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? -1 < k(i, this).index(l) : k.find(i, this, null, [l]).length), a[i] && o.push(r);
          }

          o.length && s.push({
            elem: l,
            handlers: o
          });
        }
      }
      return l = this, u < t.length && s.push({
        elem: l,
        handlers: t.slice(u)
      }), s;
    },
    addProp: function addProp(t, e) {
      Object.defineProperty(k.Event.prototype, t, {
        enumerable: !0,
        configurable: !0,
        get: m(e) ? function () {
          if (this.originalEvent) return e(this.originalEvent);
        } : function () {
          if (this.originalEvent) return this.originalEvent[t];
        },
        set: function set(e) {
          Object.defineProperty(this, t, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: e
          });
        }
      });
    },
    fix: function fix(e) {
      return e[k.expando] ? e : new k.Event(e);
    },
    special: {
      load: {
        noBubble: !0
      },
      click: {
        setup: function setup(e) {
          var t = this || e;
          return pe.test(t.type) && t.click && A(t, "input") && De(t, "click", ke), !1;
        },
        trigger: function trigger(e) {
          var t = this || e;
          return pe.test(t.type) && t.click && A(t, "input") && De(t, "click"), !0;
        },
        _default: function _default(e) {
          var t = e.target;
          return pe.test(t.type) && t.click && A(t, "input") && Q.get(t, "click") || A(t, "a");
        }
      },
      beforeunload: {
        postDispatch: function postDispatch(e) {
          void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result);
        }
      }
    }
  }, k.removeEvent = function (e, t, n) {
    e.removeEventListener && e.removeEventListener(t, n);
  }, k.Event = function (e, t) {
    if (!(this instanceof k.Event)) return new k.Event(e, t);
    e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? ke : Se, this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target, this.currentTarget = e.currentTarget, this.relatedTarget = e.relatedTarget) : this.type = e, t && k.extend(this, t), this.timeStamp = e && e.timeStamp || Date.now(), this[k.expando] = !0;
  }, k.Event.prototype = {
    constructor: k.Event,
    isDefaultPrevented: Se,
    isPropagationStopped: Se,
    isImmediatePropagationStopped: Se,
    isSimulated: !1,
    preventDefault: function preventDefault() {
      var e = this.originalEvent;
      this.isDefaultPrevented = ke, e && !this.isSimulated && e.preventDefault();
    },
    stopPropagation: function stopPropagation() {
      var e = this.originalEvent;
      this.isPropagationStopped = ke, e && !this.isSimulated && e.stopPropagation();
    },
    stopImmediatePropagation: function stopImmediatePropagation() {
      var e = this.originalEvent;
      this.isImmediatePropagationStopped = ke, e && !this.isSimulated && e.stopImmediatePropagation(), this.stopPropagation();
    }
  }, k.each({
    altKey: !0,
    bubbles: !0,
    cancelable: !0,
    changedTouches: !0,
    ctrlKey: !0,
    detail: !0,
    eventPhase: !0,
    metaKey: !0,
    pageX: !0,
    pageY: !0,
    shiftKey: !0,
    view: !0,
    "char": !0,
    code: !0,
    charCode: !0,
    key: !0,
    keyCode: !0,
    button: !0,
    buttons: !0,
    clientX: !0,
    clientY: !0,
    offsetX: !0,
    offsetY: !0,
    pointerId: !0,
    pointerType: !0,
    screenX: !0,
    screenY: !0,
    targetTouches: !0,
    toElement: !0,
    touches: !0,
    which: function which(e) {
      var t = e.button;
      return null == e.which && Te.test(e.type) ? null != e.charCode ? e.charCode : e.keyCode : !e.which && void 0 !== t && Ce.test(e.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : e.which;
    }
  }, k.event.addProp), k.each({
    focus: "focusin",
    blur: "focusout"
  }, function (e, t) {
    k.event.special[e] = {
      setup: function setup() {
        return De(this, e, Ne), !1;
      },
      trigger: function trigger() {
        return De(this, e), !0;
      },
      delegateType: t
    };
  }), k.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout",
    pointerenter: "pointerover",
    pointerleave: "pointerout"
  }, function (e, i) {
    k.event.special[e] = {
      delegateType: i,
      bindType: i,
      handle: function handle(e) {
        var t,
            n = e.relatedTarget,
            r = e.handleObj;
        return n && (n === this || k.contains(this, n)) || (e.type = r.origType, t = r.handler.apply(this, arguments), e.type = i), t;
      }
    };
  }), k.fn.extend({
    on: function on(e, t, n, r) {
      return Ae(this, e, t, n, r);
    },
    one: function one(e, t, n, r) {
      return Ae(this, e, t, n, r, 1);
    },
    off: function off(e, t, n) {
      var r, i;
      if (e && e.preventDefault && e.handleObj) return r = e.handleObj, k(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;

      if ("object" == _typeof(e)) {
        for (i in e) {
          this.off(i, t, e[i]);
        }

        return this;
      }

      return !1 !== t && "function" != typeof t || (n = t, t = void 0), !1 === n && (n = Se), this.each(function () {
        k.event.remove(this, e, n, t);
      });
    }
  });
  var je = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
      qe = /<script|<style|<link/i,
      Le = /checked\s*(?:[^=]|=\s*.checked.)/i,
      He = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

  function Oe(e, t) {
    return A(e, "table") && A(11 !== t.nodeType ? t : t.firstChild, "tr") && k(e).children("tbody")[0] || e;
  }

  function Pe(e) {
    return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e;
  }

  function Re(e) {
    return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"), e;
  }

  function Me(e, t) {
    var n, r, i, o, a, s, u, l;

    if (1 === t.nodeType) {
      if (Q.hasData(e) && (o = Q.access(e), a = Q.set(t, o), l = o.events)) for (i in delete a.handle, a.events = {}, l) {
        for (n = 0, r = l[i].length; n < r; n++) {
          k.event.add(t, i, l[i][n]);
        }
      }
      J.hasData(e) && (s = J.access(e), u = k.extend({}, s), J.set(t, u));
    }
  }

  function Ie(n, r, i, o) {
    r = g.apply([], r);
    var e,
        t,
        a,
        s,
        u,
        l,
        c = 0,
        f = n.length,
        p = f - 1,
        d = r[0],
        h = m(d);
    if (h || 1 < f && "string" == typeof d && !y.checkClone && Le.test(d)) return n.each(function (e) {
      var t = n.eq(e);
      h && (r[0] = d.call(this, e, t.html())), Ie(t, r, i, o);
    });

    if (f && (t = (e = we(r, n[0].ownerDocument, !1, n, o)).firstChild, 1 === e.childNodes.length && (e = t), t || o)) {
      for (s = (a = k.map(ve(e, "script"), Pe)).length; c < f; c++) {
        u = e, c !== p && (u = k.clone(u, !0, !0), s && k.merge(a, ve(u, "script"))), i.call(n[c], u, c);
      }

      if (s) for (l = a[a.length - 1].ownerDocument, k.map(a, Re), c = 0; c < s; c++) {
        u = a[c], he.test(u.type || "") && !Q.access(u, "globalEval") && k.contains(l, u) && (u.src && "module" !== (u.type || "").toLowerCase() ? k._evalUrl && !u.noModule && k._evalUrl(u.src, {
          nonce: u.nonce || u.getAttribute("nonce")
        }) : b(u.textContent.replace(He, ""), u, l));
      }
    }

    return n;
  }

  function We(e, t, n) {
    for (var r, i = t ? k.filter(t, e) : e, o = 0; null != (r = i[o]); o++) {
      n || 1 !== r.nodeType || k.cleanData(ve(r)), r.parentNode && (n && oe(r) && ye(ve(r, "script")), r.parentNode.removeChild(r));
    }

    return e;
  }

  k.extend({
    htmlPrefilter: function htmlPrefilter(e) {
      return e.replace(je, "<$1></$2>");
    },
    clone: function clone(e, t, n) {
      var r,
          i,
          o,
          a,
          s,
          u,
          l,
          c = e.cloneNode(!0),
          f = oe(e);
      if (!(y.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || k.isXMLDoc(e))) for (a = ve(c), r = 0, i = (o = ve(e)).length; r < i; r++) {
        s = o[r], u = a[r], void 0, "input" === (l = u.nodeName.toLowerCase()) && pe.test(s.type) ? u.checked = s.checked : "input" !== l && "textarea" !== l || (u.defaultValue = s.defaultValue);
      }
      if (t) if (n) for (o = o || ve(e), a = a || ve(c), r = 0, i = o.length; r < i; r++) {
        Me(o[r], a[r]);
      } else Me(e, c);
      return 0 < (a = ve(c, "script")).length && ye(a, !f && ve(e, "script")), c;
    },
    cleanData: function cleanData(e) {
      for (var t, n, r, i = k.event.special, o = 0; void 0 !== (n = e[o]); o++) {
        if (G(n)) {
          if (t = n[Q.expando]) {
            if (t.events) for (r in t.events) {
              i[r] ? k.event.remove(n, r) : k.removeEvent(n, r, t.handle);
            }
            n[Q.expando] = void 0;
          }

          n[J.expando] && (n[J.expando] = void 0);
        }
      }
    }
  }), k.fn.extend({
    detach: function detach(e) {
      return We(this, e, !0);
    },
    remove: function remove(e) {
      return We(this, e);
    },
    text: function text(e) {
      return _(this, function (e) {
        return void 0 === e ? k.text(this) : this.empty().each(function () {
          1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e);
        });
      }, null, e, arguments.length);
    },
    append: function append() {
      return Ie(this, arguments, function (e) {
        1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || Oe(this, e).appendChild(e);
      });
    },
    prepend: function prepend() {
      return Ie(this, arguments, function (e) {
        if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
          var t = Oe(this, e);
          t.insertBefore(e, t.firstChild);
        }
      });
    },
    before: function before() {
      return Ie(this, arguments, function (e) {
        this.parentNode && this.parentNode.insertBefore(e, this);
      });
    },
    after: function after() {
      return Ie(this, arguments, function (e) {
        this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
      });
    },
    empty: function empty() {
      for (var e, t = 0; null != (e = this[t]); t++) {
        1 === e.nodeType && (k.cleanData(ve(e, !1)), e.textContent = "");
      }

      return this;
    },
    clone: function clone(e, t) {
      return e = null != e && e, t = null == t ? e : t, this.map(function () {
        return k.clone(this, e, t);
      });
    },
    html: function html(e) {
      return _(this, function (e) {
        var t = this[0] || {},
            n = 0,
            r = this.length;
        if (void 0 === e && 1 === t.nodeType) return t.innerHTML;

        if ("string" == typeof e && !qe.test(e) && !ge[(de.exec(e) || ["", ""])[1].toLowerCase()]) {
          e = k.htmlPrefilter(e);

          try {
            for (; n < r; n++) {
              1 === (t = this[n] || {}).nodeType && (k.cleanData(ve(t, !1)), t.innerHTML = e);
            }

            t = 0;
          } catch (e) {}
        }

        t && this.empty().append(e);
      }, null, e, arguments.length);
    },
    replaceWith: function replaceWith() {
      var n = [];
      return Ie(this, arguments, function (e) {
        var t = this.parentNode;
        k.inArray(this, n) < 0 && (k.cleanData(ve(this)), t && t.replaceChild(e, this));
      }, n);
    }
  }), k.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function (e, a) {
    k.fn[e] = function (e) {
      for (var t, n = [], r = k(e), i = r.length - 1, o = 0; o <= i; o++) {
        t = o === i ? this : this.clone(!0), k(r[o])[a](t), u.apply(n, t.get());
      }

      return this.pushStack(n);
    };
  });

  var $e = new RegExp("^(" + te + ")(?!px)[a-z%]+$", "i"),
      Fe = function Fe(e) {
    var t = e.ownerDocument.defaultView;
    return t && t.opener || (t = C), t.getComputedStyle(e);
  },
      Be = new RegExp(re.join("|"), "i");

  function _e(e, t, n) {
    var r,
        i,
        o,
        a,
        s = e.style;
    return (n = n || Fe(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || oe(e) || (a = k.style(e, t)), !y.pixelBoxStyles() && $e.test(a) && Be.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + "" : a;
  }

  function ze(e, t) {
    return {
      get: function get() {
        if (!e()) return (this.get = t).apply(this, arguments);
        delete this.get;
      }
    };
  }

  !function () {
    function e() {
      if (u) {
        s.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0", u.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%", ie.appendChild(s).appendChild(u);
        var e = C.getComputedStyle(u);
        n = "1%" !== e.top, a = 12 === t(e.marginLeft), u.style.right = "60%", o = 36 === t(e.right), r = 36 === t(e.width), u.style.position = "absolute", i = 12 === t(u.offsetWidth / 3), ie.removeChild(s), u = null;
      }
    }

    function t(e) {
      return Math.round(parseFloat(e));
    }

    var n,
        r,
        i,
        o,
        a,
        s = E.createElement("div"),
        u = E.createElement("div");
    u.style && (u.style.backgroundClip = "content-box", u.cloneNode(!0).style.backgroundClip = "", y.clearCloneStyle = "content-box" === u.style.backgroundClip, k.extend(y, {
      boxSizingReliable: function boxSizingReliable() {
        return e(), r;
      },
      pixelBoxStyles: function pixelBoxStyles() {
        return e(), o;
      },
      pixelPosition: function pixelPosition() {
        return e(), n;
      },
      reliableMarginLeft: function reliableMarginLeft() {
        return e(), a;
      },
      scrollboxSize: function scrollboxSize() {
        return e(), i;
      }
    }));
  }();
  var Ue = ["Webkit", "Moz", "ms"],
      Xe = E.createElement("div").style,
      Ve = {};

  function Ge(e) {
    var t = k.cssProps[e] || Ve[e];
    return t || (e in Xe ? e : Ve[e] = function (e) {
      var t = e[0].toUpperCase() + e.slice(1),
          n = Ue.length;

      while (n--) {
        if ((e = Ue[n] + t) in Xe) return e;
      }
    }(e) || e);
  }

  var Ye = /^(none|table(?!-c[ea]).+)/,
      Qe = /^--/,
      Je = {
    position: "absolute",
    visibility: "hidden",
    display: "block"
  },
      Ke = {
    letterSpacing: "0",
    fontWeight: "400"
  };

  function Ze(e, t, n) {
    var r = ne.exec(t);
    return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t;
  }

  function et(e, t, n, r, i, o) {
    var a = "width" === t ? 1 : 0,
        s = 0,
        u = 0;
    if (n === (r ? "border" : "content")) return 0;

    for (; a < 4; a += 2) {
      "margin" === n && (u += k.css(e, n + re[a], !0, i)), r ? ("content" === n && (u -= k.css(e, "padding" + re[a], !0, i)), "margin" !== n && (u -= k.css(e, "border" + re[a] + "Width", !0, i))) : (u += k.css(e, "padding" + re[a], !0, i), "padding" !== n ? u += k.css(e, "border" + re[a] + "Width", !0, i) : s += k.css(e, "border" + re[a] + "Width", !0, i));
    }

    return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0), u;
  }

  function tt(e, t, n) {
    var r = Fe(e),
        i = (!y.boxSizingReliable() || n) && "border-box" === k.css(e, "boxSizing", !1, r),
        o = i,
        a = _e(e, t, r),
        s = "offset" + t[0].toUpperCase() + t.slice(1);

    if ($e.test(a)) {
      if (!n) return a;
      a = "auto";
    }

    return (!y.boxSizingReliable() && i || "auto" === a || !parseFloat(a) && "inline" === k.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === k.css(e, "boxSizing", !1, r), (o = s in e) && (a = e[s])), (a = parseFloat(a) || 0) + et(e, t, n || (i ? "border" : "content"), o, r, a) + "px";
  }

  function nt(e, t, n, r, i) {
    return new nt.prototype.init(e, t, n, r, i);
  }

  k.extend({
    cssHooks: {
      opacity: {
        get: function get(e, t) {
          if (t) {
            var n = _e(e, "opacity");

            return "" === n ? "1" : n;
          }
        }
      }
    },
    cssNumber: {
      animationIterationCount: !0,
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      gridArea: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnStart: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowStart: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0
    },
    cssProps: {},
    style: function style(e, t, n, r) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var i,
            o,
            a,
            s = V(t),
            u = Qe.test(t),
            l = e.style;
        if (u || (t = Ge(s)), a = k.cssHooks[t] || k.cssHooks[s], void 0 === n) return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
        "string" === (o = _typeof(n)) && (i = ne.exec(n)) && i[1] && (n = le(e, t, i), o = "number"), null != n && n == n && ("number" !== o || u || (n += i && i[3] || (k.cssNumber[s] ? "" : "px")), y.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n));
      }
    },
    css: function css(e, t, n, r) {
      var i,
          o,
          a,
          s = V(t);
      return Qe.test(t) || (t = Ge(s)), (a = k.cssHooks[t] || k.cssHooks[s]) && "get" in a && (i = a.get(e, !0, n)), void 0 === i && (i = _e(e, t, r)), "normal" === i && t in Ke && (i = Ke[t]), "" === n || n ? (o = parseFloat(i), !0 === n || isFinite(o) ? o || 0 : i) : i;
    }
  }), k.each(["height", "width"], function (e, u) {
    k.cssHooks[u] = {
      get: function get(e, t, n) {
        if (t) return !Ye.test(k.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? tt(e, u, n) : ue(e, Je, function () {
          return tt(e, u, n);
        });
      },
      set: function set(e, t, n) {
        var r,
            i = Fe(e),
            o = !y.scrollboxSize() && "absolute" === i.position,
            a = (o || n) && "border-box" === k.css(e, "boxSizing", !1, i),
            s = n ? et(e, u, n, a, i) : 0;
        return a && o && (s -= Math.ceil(e["offset" + u[0].toUpperCase() + u.slice(1)] - parseFloat(i[u]) - et(e, u, "border", !1, i) - .5)), s && (r = ne.exec(t)) && "px" !== (r[3] || "px") && (e.style[u] = t, t = k.css(e, u)), Ze(0, t, s);
      }
    };
  }), k.cssHooks.marginLeft = ze(y.reliableMarginLeft, function (e, t) {
    if (t) return (parseFloat(_e(e, "marginLeft")) || e.getBoundingClientRect().left - ue(e, {
      marginLeft: 0
    }, function () {
      return e.getBoundingClientRect().left;
    })) + "px";
  }), k.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function (i, o) {
    k.cssHooks[i + o] = {
      expand: function expand(e) {
        for (var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e]; t < 4; t++) {
          n[i + re[t] + o] = r[t] || r[t - 2] || r[0];
        }

        return n;
      }
    }, "margin" !== i && (k.cssHooks[i + o].set = Ze);
  }), k.fn.extend({
    css: function css(e, t) {
      return _(this, function (e, t, n) {
        var r,
            i,
            o = {},
            a = 0;

        if (Array.isArray(t)) {
          for (r = Fe(e), i = t.length; a < i; a++) {
            o[t[a]] = k.css(e, t[a], !1, r);
          }

          return o;
        }

        return void 0 !== n ? k.style(e, t, n) : k.css(e, t);
      }, e, t, 1 < arguments.length);
    }
  }), ((k.Tween = nt).prototype = {
    constructor: nt,
    init: function init(e, t, n, r, i, o) {
      this.elem = e, this.prop = n, this.easing = i || k.easing._default, this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (k.cssNumber[n] ? "" : "px");
    },
    cur: function cur() {
      var e = nt.propHooks[this.prop];
      return e && e.get ? e.get(this) : nt.propHooks._default.get(this);
    },
    run: function run(e) {
      var t,
          n = nt.propHooks[this.prop];
      return this.options.duration ? this.pos = t = k.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : nt.propHooks._default.set(this), this;
    }
  }).init.prototype = nt.prototype, (nt.propHooks = {
    _default: {
      get: function get(e) {
        var t;
        return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = k.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0;
      },
      set: function set(e) {
        k.fx.step[e.prop] ? k.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !k.cssHooks[e.prop] && null == e.elem.style[Ge(e.prop)] ? e.elem[e.prop] = e.now : k.style(e.elem, e.prop, e.now + e.unit);
      }
    }
  }).scrollTop = nt.propHooks.scrollLeft = {
    set: function set(e) {
      e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
    }
  }, k.easing = {
    linear: function linear(e) {
      return e;
    },
    swing: function swing(e) {
      return .5 - Math.cos(e * Math.PI) / 2;
    },
    _default: "swing"
  }, k.fx = nt.prototype.init, k.fx.step = {};
  var rt,
      it,
      ot,
      at,
      st = /^(?:toggle|show|hide)$/,
      ut = /queueHooks$/;

  function lt() {
    it && (!1 === E.hidden && C.requestAnimationFrame ? C.requestAnimationFrame(lt) : C.setTimeout(lt, k.fx.interval), k.fx.tick());
  }

  function ct() {
    return C.setTimeout(function () {
      rt = void 0;
    }), rt = Date.now();
  }

  function ft(e, t) {
    var n,
        r = 0,
        i = {
      height: e
    };

    for (t = t ? 1 : 0; r < 4; r += 2 - t) {
      i["margin" + (n = re[r])] = i["padding" + n] = e;
    }

    return t && (i.opacity = i.width = e), i;
  }

  function pt(e, t, n) {
    for (var r, i = (dt.tweeners[t] || []).concat(dt.tweeners["*"]), o = 0, a = i.length; o < a; o++) {
      if (r = i[o].call(n, t, e)) return r;
    }
  }

  function dt(o, e, t) {
    var n,
        a,
        r = 0,
        i = dt.prefilters.length,
        s = k.Deferred().always(function () {
      delete u.elem;
    }),
        u = function u() {
      if (a) return !1;

      for (var e = rt || ct(), t = Math.max(0, l.startTime + l.duration - e), n = 1 - (t / l.duration || 0), r = 0, i = l.tweens.length; r < i; r++) {
        l.tweens[r].run(n);
      }

      return s.notifyWith(o, [l, n, t]), n < 1 && i ? t : (i || s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l]), !1);
    },
        l = s.promise({
      elem: o,
      props: k.extend({}, e),
      opts: k.extend(!0, {
        specialEasing: {},
        easing: k.easing._default
      }, t),
      originalProperties: e,
      originalOptions: t,
      startTime: rt || ct(),
      duration: t.duration,
      tweens: [],
      createTween: function createTween(e, t) {
        var n = k.Tween(o, l.opts, e, t, l.opts.specialEasing[e] || l.opts.easing);
        return l.tweens.push(n), n;
      },
      stop: function stop(e) {
        var t = 0,
            n = e ? l.tweens.length : 0;
        if (a) return this;

        for (a = !0; t < n; t++) {
          l.tweens[t].run(1);
        }

        return e ? (s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l, e])) : s.rejectWith(o, [l, e]), this;
      }
    }),
        c = l.props;

    for (!function (e, t) {
      var n, r, i, o, a;

      for (n in e) {
        if (i = t[r = V(n)], o = e[n], Array.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), (a = k.cssHooks[r]) && ("expand" in a)) for (n in o = a.expand(o), delete e[r], o) {
          (n in e) || (e[n] = o[n], t[n] = i);
        } else t[r] = i;
      }
    }(c, l.opts.specialEasing); r < i; r++) {
      if (n = dt.prefilters[r].call(l, o, c, l.opts)) return m(n.stop) && (k._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)), n;
    }

    return k.map(c, pt, l), m(l.opts.start) && l.opts.start.call(o, l), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always), k.fx.timer(k.extend(u, {
      elem: o,
      anim: l,
      queue: l.opts.queue
    })), l;
  }

  k.Animation = k.extend(dt, {
    tweeners: {
      "*": [function (e, t) {
        var n = this.createTween(e, t);
        return le(n.elem, e, ne.exec(t), n), n;
      }]
    },
    tweener: function tweener(e, t) {
      m(e) ? (t = e, e = ["*"]) : e = e.match(R);

      for (var n, r = 0, i = e.length; r < i; r++) {
        n = e[r], dt.tweeners[n] = dt.tweeners[n] || [], dt.tweeners[n].unshift(t);
      }
    },
    prefilters: [function (e, t, n) {
      var r,
          i,
          o,
          a,
          s,
          u,
          l,
          c,
          f = "width" in t || "height" in t,
          p = this,
          d = {},
          h = e.style,
          g = e.nodeType && se(e),
          v = Q.get(e, "fxshow");

      for (r in n.queue || (null == (a = k._queueHooks(e, "fx")).unqueued && (a.unqueued = 0, s = a.empty.fire, a.empty.fire = function () {
        a.unqueued || s();
      }), a.unqueued++, p.always(function () {
        p.always(function () {
          a.unqueued--, k.queue(e, "fx").length || a.empty.fire();
        });
      })), t) {
        if (i = t[r], st.test(i)) {
          if (delete t[r], o = o || "toggle" === i, i === (g ? "hide" : "show")) {
            if ("show" !== i || !v || void 0 === v[r]) continue;
            g = !0;
          }

          d[r] = v && v[r] || k.style(e, r);
        }
      }

      if ((u = !k.isEmptyObject(t)) || !k.isEmptyObject(d)) for (r in f && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY], null == (l = v && v.display) && (l = Q.get(e, "display")), "none" === (c = k.css(e, "display")) && (l ? c = l : (fe([e], !0), l = e.style.display || l, c = k.css(e, "display"), fe([e]))), ("inline" === c || "inline-block" === c && null != l) && "none" === k.css(e, "float") && (u || (p.done(function () {
        h.display = l;
      }), null == l && (c = h.display, l = "none" === c ? "" : c)), h.display = "inline-block")), n.overflow && (h.overflow = "hidden", p.always(function () {
        h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2];
      })), u = !1, d) {
        u || (v ? "hidden" in v && (g = v.hidden) : v = Q.access(e, "fxshow", {
          display: l
        }), o && (v.hidden = !g), g && fe([e], !0), p.done(function () {
          for (r in g || fe([e]), Q.remove(e, "fxshow"), d) {
            k.style(e, r, d[r]);
          }
        })), u = pt(g ? v[r] : 0, r, p), r in v || (v[r] = u.start, g && (u.end = u.start, u.start = 0));
      }
    }],
    prefilter: function prefilter(e, t) {
      t ? dt.prefilters.unshift(e) : dt.prefilters.push(e);
    }
  }), k.speed = function (e, t, n) {
    var r = e && "object" == _typeof(e) ? k.extend({}, e) : {
      complete: n || !n && t || m(e) && e,
      duration: e,
      easing: n && t || t && !m(t) && t
    };
    return k.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in k.fx.speeds ? r.duration = k.fx.speeds[r.duration] : r.duration = k.fx.speeds._default), null != r.queue && !0 !== r.queue || (r.queue = "fx"), r.old = r.complete, r.complete = function () {
      m(r.old) && r.old.call(this), r.queue && k.dequeue(this, r.queue);
    }, r;
  }, k.fn.extend({
    fadeTo: function fadeTo(e, t, n, r) {
      return this.filter(se).css("opacity", 0).show().end().animate({
        opacity: t
      }, e, n, r);
    },
    animate: function animate(t, e, n, r) {
      var i = k.isEmptyObject(t),
          o = k.speed(e, n, r),
          a = function a() {
        var e = dt(this, k.extend({}, t), o);
        (i || Q.get(this, "finish")) && e.stop(!0);
      };

      return a.finish = a, i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a);
    },
    stop: function stop(i, e, o) {
      var a = function a(e) {
        var t = e.stop;
        delete e.stop, t(o);
      };

      return "string" != typeof i && (o = e, e = i, i = void 0), e && !1 !== i && this.queue(i || "fx", []), this.each(function () {
        var e = !0,
            t = null != i && i + "queueHooks",
            n = k.timers,
            r = Q.get(this);
        if (t) r[t] && r[t].stop && a(r[t]);else for (t in r) {
          r[t] && r[t].stop && ut.test(t) && a(r[t]);
        }

        for (t = n.length; t--;) {
          n[t].elem !== this || null != i && n[t].queue !== i || (n[t].anim.stop(o), e = !1, n.splice(t, 1));
        }

        !e && o || k.dequeue(this, i);
      });
    },
    finish: function finish(a) {
      return !1 !== a && (a = a || "fx"), this.each(function () {
        var e,
            t = Q.get(this),
            n = t[a + "queue"],
            r = t[a + "queueHooks"],
            i = k.timers,
            o = n ? n.length : 0;

        for (t.finish = !0, k.queue(this, a, []), r && r.stop && r.stop.call(this, !0), e = i.length; e--;) {
          i[e].elem === this && i[e].queue === a && (i[e].anim.stop(!0), i.splice(e, 1));
        }

        for (e = 0; e < o; e++) {
          n[e] && n[e].finish && n[e].finish.call(this);
        }

        delete t.finish;
      });
    }
  }), k.each(["toggle", "show", "hide"], function (e, r) {
    var i = k.fn[r];

    k.fn[r] = function (e, t, n) {
      return null == e || "boolean" == typeof e ? i.apply(this, arguments) : this.animate(ft(r, !0), e, t, n);
    };
  }), k.each({
    slideDown: ft("show"),
    slideUp: ft("hide"),
    slideToggle: ft("toggle"),
    fadeIn: {
      opacity: "show"
    },
    fadeOut: {
      opacity: "hide"
    },
    fadeToggle: {
      opacity: "toggle"
    }
  }, function (e, r) {
    k.fn[e] = function (e, t, n) {
      return this.animate(r, e, t, n);
    };
  }), k.timers = [], k.fx.tick = function () {
    var e,
        t = 0,
        n = k.timers;

    for (rt = Date.now(); t < n.length; t++) {
      (e = n[t])() || n[t] !== e || n.splice(t--, 1);
    }

    n.length || k.fx.stop(), rt = void 0;
  }, k.fx.timer = function (e) {
    k.timers.push(e), k.fx.start();
  }, k.fx.interval = 13, k.fx.start = function () {
    it || (it = !0, lt());
  }, k.fx.stop = function () {
    it = null;
  }, k.fx.speeds = {
    slow: 600,
    fast: 200,
    _default: 400
  }, k.fn.delay = function (r, e) {
    return r = k.fx && k.fx.speeds[r] || r, e = e || "fx", this.queue(e, function (e, t) {
      var n = C.setTimeout(e, r);

      t.stop = function () {
        C.clearTimeout(n);
      };
    });
  }, ot = E.createElement("input"), at = E.createElement("select").appendChild(E.createElement("option")), ot.type = "checkbox", y.checkOn = "" !== ot.value, y.optSelected = at.selected, (ot = E.createElement("input")).value = "t", ot.type = "radio", y.radioValue = "t" === ot.value;
  var ht,
      gt = k.expr.attrHandle;
  k.fn.extend({
    attr: function attr(e, t) {
      return _(this, k.attr, e, t, 1 < arguments.length);
    },
    removeAttr: function removeAttr(e) {
      return this.each(function () {
        k.removeAttr(this, e);
      });
    }
  }), k.extend({
    attr: function attr(e, t, n) {
      var r,
          i,
          o = e.nodeType;
      if (3 !== o && 8 !== o && 2 !== o) return "undefined" == typeof e.getAttribute ? k.prop(e, t, n) : (1 === o && k.isXMLDoc(e) || (i = k.attrHooks[t.toLowerCase()] || (k.expr.match.bool.test(t) ? ht : void 0)), void 0 !== n ? null === n ? void k.removeAttr(e, t) : i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""), n) : i && "get" in i && null !== (r = i.get(e, t)) ? r : null == (r = k.find.attr(e, t)) ? void 0 : r);
    },
    attrHooks: {
      type: {
        set: function set(e, t) {
          if (!y.radioValue && "radio" === t && A(e, "input")) {
            var n = e.value;
            return e.setAttribute("type", t), n && (e.value = n), t;
          }
        }
      }
    },
    removeAttr: function removeAttr(e, t) {
      var n,
          r = 0,
          i = t && t.match(R);
      if (i && 1 === e.nodeType) while (n = i[r++]) {
        e.removeAttribute(n);
      }
    }
  }), ht = {
    set: function set(e, t, n) {
      return !1 === t ? k.removeAttr(e, n) : e.setAttribute(n, n), n;
    }
  }, k.each(k.expr.match.bool.source.match(/\w+/g), function (e, t) {
    var a = gt[t] || k.find.attr;

    gt[t] = function (e, t, n) {
      var r,
          i,
          o = t.toLowerCase();
      return n || (i = gt[o], gt[o] = r, r = null != a(e, t, n) ? o : null, gt[o] = i), r;
    };
  });
  var vt = /^(?:input|select|textarea|button)$/i,
      yt = /^(?:a|area)$/i;

  function mt(e) {
    return (e.match(R) || []).join(" ");
  }

  function xt(e) {
    return e.getAttribute && e.getAttribute("class") || "";
  }

  function bt(e) {
    return Array.isArray(e) ? e : "string" == typeof e && e.match(R) || [];
  }

  k.fn.extend({
    prop: function prop(e, t) {
      return _(this, k.prop, e, t, 1 < arguments.length);
    },
    removeProp: function removeProp(e) {
      return this.each(function () {
        delete this[k.propFix[e] || e];
      });
    }
  }), k.extend({
    prop: function prop(e, t, n) {
      var r,
          i,
          o = e.nodeType;
      if (3 !== o && 8 !== o && 2 !== o) return 1 === o && k.isXMLDoc(e) || (t = k.propFix[t] || t, i = k.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t];
    },
    propHooks: {
      tabIndex: {
        get: function get(e) {
          var t = k.find.attr(e, "tabindex");
          return t ? parseInt(t, 10) : vt.test(e.nodeName) || yt.test(e.nodeName) && e.href ? 0 : -1;
        }
      }
    },
    propFix: {
      "for": "htmlFor",
      "class": "className"
    }
  }), y.optSelected || (k.propHooks.selected = {
    get: function get(e) {
      var t = e.parentNode;
      return t && t.parentNode && t.parentNode.selectedIndex, null;
    },
    set: function set(e) {
      var t = e.parentNode;
      t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
    }
  }), k.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
    k.propFix[this.toLowerCase()] = this;
  }), k.fn.extend({
    addClass: function addClass(t) {
      var e,
          n,
          r,
          i,
          o,
          a,
          s,
          u = 0;
      if (m(t)) return this.each(function (e) {
        k(this).addClass(t.call(this, e, xt(this)));
      });
      if ((e = bt(t)).length) while (n = this[u++]) {
        if (i = xt(n), r = 1 === n.nodeType && " " + mt(i) + " ") {
          a = 0;

          while (o = e[a++]) {
            r.indexOf(" " + o + " ") < 0 && (r += o + " ");
          }

          i !== (s = mt(r)) && n.setAttribute("class", s);
        }
      }
      return this;
    },
    removeClass: function removeClass(t) {
      var e,
          n,
          r,
          i,
          o,
          a,
          s,
          u = 0;
      if (m(t)) return this.each(function (e) {
        k(this).removeClass(t.call(this, e, xt(this)));
      });
      if (!arguments.length) return this.attr("class", "");
      if ((e = bt(t)).length) while (n = this[u++]) {
        if (i = xt(n), r = 1 === n.nodeType && " " + mt(i) + " ") {
          a = 0;

          while (o = e[a++]) {
            while (-1 < r.indexOf(" " + o + " ")) {
              r = r.replace(" " + o + " ", " ");
            }
          }

          i !== (s = mt(r)) && n.setAttribute("class", s);
        }
      }
      return this;
    },
    toggleClass: function toggleClass(i, t) {
      var o = _typeof(i),
          a = "string" === o || Array.isArray(i);

      return "boolean" == typeof t && a ? t ? this.addClass(i) : this.removeClass(i) : m(i) ? this.each(function (e) {
        k(this).toggleClass(i.call(this, e, xt(this), t), t);
      }) : this.each(function () {
        var e, t, n, r;

        if (a) {
          t = 0, n = k(this), r = bt(i);

          while (e = r[t++]) {
            n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
          }
        } else void 0 !== i && "boolean" !== o || ((e = xt(this)) && Q.set(this, "__className__", e), this.setAttribute && this.setAttribute("class", e || !1 === i ? "" : Q.get(this, "__className__") || ""));
      });
    },
    hasClass: function hasClass(e) {
      var t,
          n,
          r = 0;
      t = " " + e + " ";

      while (n = this[r++]) {
        if (1 === n.nodeType && -1 < (" " + mt(xt(n)) + " ").indexOf(t)) return !0;
      }

      return !1;
    }
  });
  var wt = /\r/g;
  k.fn.extend({
    val: function val(n) {
      var r,
          e,
          i,
          t = this[0];
      return arguments.length ? (i = m(n), this.each(function (e) {
        var t;
        1 === this.nodeType && (null == (t = i ? n.call(this, e, k(this).val()) : n) ? t = "" : "number" == typeof t ? t += "" : Array.isArray(t) && (t = k.map(t, function (e) {
          return null == e ? "" : e + "";
        })), (r = k.valHooks[this.type] || k.valHooks[this.nodeName.toLowerCase()]) && "set" in r && void 0 !== r.set(this, t, "value") || (this.value = t));
      })) : t ? (r = k.valHooks[t.type] || k.valHooks[t.nodeName.toLowerCase()]) && "get" in r && void 0 !== (e = r.get(t, "value")) ? e : "string" == typeof (e = t.value) ? e.replace(wt, "") : null == e ? "" : e : void 0;
    }
  }), k.extend({
    valHooks: {
      option: {
        get: function get(e) {
          var t = k.find.attr(e, "value");
          return null != t ? t : mt(k.text(e));
        }
      },
      select: {
        get: function get(e) {
          var t,
              n,
              r,
              i = e.options,
              o = e.selectedIndex,
              a = "select-one" === e.type,
              s = a ? null : [],
              u = a ? o + 1 : i.length;

          for (r = o < 0 ? u : a ? o : 0; r < u; r++) {
            if (((n = i[r]).selected || r === o) && !n.disabled && (!n.parentNode.disabled || !A(n.parentNode, "optgroup"))) {
              if (t = k(n).val(), a) return t;
              s.push(t);
            }
          }

          return s;
        },
        set: function set(e, t) {
          var n,
              r,
              i = e.options,
              o = k.makeArray(t),
              a = i.length;

          while (a--) {
            ((r = i[a]).selected = -1 < k.inArray(k.valHooks.option.get(r), o)) && (n = !0);
          }

          return n || (e.selectedIndex = -1), o;
        }
      }
    }
  }), k.each(["radio", "checkbox"], function () {
    k.valHooks[this] = {
      set: function set(e, t) {
        if (Array.isArray(t)) return e.checked = -1 < k.inArray(k(e).val(), t);
      }
    }, y.checkOn || (k.valHooks[this].get = function (e) {
      return null === e.getAttribute("value") ? "on" : e.value;
    });
  }), y.focusin = "onfocusin" in C;

  var Tt = /^(?:focusinfocus|focusoutblur)$/,
      Ct = function Ct(e) {
    e.stopPropagation();
  };

  k.extend(k.event, {
    trigger: function trigger(e, t, n, r) {
      var i,
          o,
          a,
          s,
          u,
          l,
          c,
          f,
          p = [n || E],
          d = v.call(e, "type") ? e.type : e,
          h = v.call(e, "namespace") ? e.namespace.split(".") : [];

      if (o = f = a = n = n || E, 3 !== n.nodeType && 8 !== n.nodeType && !Tt.test(d + k.event.triggered) && (-1 < d.indexOf(".") && (d = (h = d.split(".")).shift(), h.sort()), u = d.indexOf(":") < 0 && "on" + d, (e = e[k.expando] ? e : new k.Event(d, "object" == _typeof(e) && e)).isTrigger = r ? 2 : 3, e.namespace = h.join("."), e.rnamespace = e.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, e.result = void 0, e.target || (e.target = n), t = null == t ? [e] : k.makeArray(t, [e]), c = k.event.special[d] || {}, r || !c.trigger || !1 !== c.trigger.apply(n, t))) {
        if (!r && !c.noBubble && !x(n)) {
          for (s = c.delegateType || d, Tt.test(s + d) || (o = o.parentNode); o; o = o.parentNode) {
            p.push(o), a = o;
          }

          a === (n.ownerDocument || E) && p.push(a.defaultView || a.parentWindow || C);
        }

        i = 0;

        while ((o = p[i++]) && !e.isPropagationStopped()) {
          f = o, e.type = 1 < i ? s : c.bindType || d, (l = (Q.get(o, "events") || {})[e.type] && Q.get(o, "handle")) && l.apply(o, t), (l = u && o[u]) && l.apply && G(o) && (e.result = l.apply(o, t), !1 === e.result && e.preventDefault());
        }

        return e.type = d, r || e.isDefaultPrevented() || c._default && !1 !== c._default.apply(p.pop(), t) || !G(n) || u && m(n[d]) && !x(n) && ((a = n[u]) && (n[u] = null), k.event.triggered = d, e.isPropagationStopped() && f.addEventListener(d, Ct), n[d](), e.isPropagationStopped() && f.removeEventListener(d, Ct), k.event.triggered = void 0, a && (n[u] = a)), e.result;
      }
    },
    simulate: function simulate(e, t, n) {
      var r = k.extend(new k.Event(), n, {
        type: e,
        isSimulated: !0
      });
      k.event.trigger(r, null, t);
    }
  }), k.fn.extend({
    trigger: function trigger(e, t) {
      return this.each(function () {
        k.event.trigger(e, t, this);
      });
    },
    triggerHandler: function triggerHandler(e, t) {
      var n = this[0];
      if (n) return k.event.trigger(e, t, n, !0);
    }
  }), y.focusin || k.each({
    focus: "focusin",
    blur: "focusout"
  }, function (n, r) {
    var i = function i(e) {
      k.event.simulate(r, e.target, k.event.fix(e));
    };

    k.event.special[r] = {
      setup: function setup() {
        var e = this.ownerDocument || this,
            t = Q.access(e, r);
        t || e.addEventListener(n, i, !0), Q.access(e, r, (t || 0) + 1);
      },
      teardown: function teardown() {
        var e = this.ownerDocument || this,
            t = Q.access(e, r) - 1;
        t ? Q.access(e, r, t) : (e.removeEventListener(n, i, !0), Q.remove(e, r));
      }
    };
  });
  var Et = C.location,
      kt = Date.now(),
      St = /\?/;

  k.parseXML = function (e) {
    var t;
    if (!e || "string" != typeof e) return null;

    try {
      t = new C.DOMParser().parseFromString(e, "text/xml");
    } catch (e) {
      t = void 0;
    }

    return t && !t.getElementsByTagName("parsererror").length || k.error("Invalid XML: " + e), t;
  };

  var Nt = /\[\]$/,
      At = /\r?\n/g,
      Dt = /^(?:submit|button|image|reset|file)$/i,
      jt = /^(?:input|select|textarea|keygen)/i;

  function qt(n, e, r, i) {
    var t;
    if (Array.isArray(e)) k.each(e, function (e, t) {
      r || Nt.test(n) ? i(n, t) : qt(n + "[" + ("object" == _typeof(t) && null != t ? e : "") + "]", t, r, i);
    });else if (r || "object" !== w(e)) i(n, e);else for (t in e) {
      qt(n + "[" + t + "]", e[t], r, i);
    }
  }

  k.param = function (e, t) {
    var n,
        r = [],
        i = function i(e, t) {
      var n = m(t) ? t() : t;
      r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n);
    };

    if (null == e) return "";
    if (Array.isArray(e) || e.jquery && !k.isPlainObject(e)) k.each(e, function () {
      i(this.name, this.value);
    });else for (n in e) {
      qt(n, e[n], t, i);
    }
    return r.join("&");
  }, k.fn.extend({
    serialize: function serialize() {
      return k.param(this.serializeArray());
    },
    serializeArray: function serializeArray() {
      return this.map(function () {
        var e = k.prop(this, "elements");
        return e ? k.makeArray(e) : this;
      }).filter(function () {
        var e = this.type;
        return this.name && !k(this).is(":disabled") && jt.test(this.nodeName) && !Dt.test(e) && (this.checked || !pe.test(e));
      }).map(function (e, t) {
        var n = k(this).val();
        return null == n ? null : Array.isArray(n) ? k.map(n, function (e) {
          return {
            name: t.name,
            value: e.replace(At, "\r\n")
          };
        }) : {
          name: t.name,
          value: n.replace(At, "\r\n")
        };
      }).get();
    }
  });
  var Lt = /%20/g,
      Ht = /#.*$/,
      Ot = /([?&])_=[^&]*/,
      Pt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
      Rt = /^(?:GET|HEAD)$/,
      Mt = /^\/\//,
      It = {},
      Wt = {},
      $t = "*/".concat("*"),
      Ft = E.createElement("a");

  function Bt(o) {
    return function (e, t) {
      "string" != typeof e && (t = e, e = "*");
      var n,
          r = 0,
          i = e.toLowerCase().match(R) || [];
      if (m(t)) while (n = i[r++]) {
        "+" === n[0] ? (n = n.slice(1) || "*", (o[n] = o[n] || []).unshift(t)) : (o[n] = o[n] || []).push(t);
      }
    };
  }

  function _t(t, i, o, a) {
    var s = {},
        u = t === Wt;

    function l(e) {
      var r;
      return s[e] = !0, k.each(t[e] || [], function (e, t) {
        var n = t(i, o, a);
        return "string" != typeof n || u || s[n] ? u ? !(r = n) : void 0 : (i.dataTypes.unshift(n), l(n), !1);
      }), r;
    }

    return l(i.dataTypes[0]) || !s["*"] && l("*");
  }

  function zt(e, t) {
    var n,
        r,
        i = k.ajaxSettings.flatOptions || {};

    for (n in t) {
      void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
    }

    return r && k.extend(!0, e, r), e;
  }

  Ft.href = Et.href, k.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
      url: Et.href,
      type: "GET",
      isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Et.protocol),
      global: !0,
      processData: !0,
      async: !0,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      accepts: {
        "*": $t,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },
      contents: {
        xml: /\bxml\b/,
        html: /\bhtml/,
        json: /\bjson\b/
      },
      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },
      converters: {
        "* text": String,
        "text html": !0,
        "text json": JSON.parse,
        "text xml": k.parseXML
      },
      flatOptions: {
        url: !0,
        context: !0
      }
    },
    ajaxSetup: function ajaxSetup(e, t) {
      return t ? zt(zt(e, k.ajaxSettings), t) : zt(k.ajaxSettings, e);
    },
    ajaxPrefilter: Bt(It),
    ajaxTransport: Bt(Wt),
    ajax: function ajax(e, t) {
      "object" == _typeof(e) && (t = e, e = void 0), t = t || {};
      var c,
          f,
          p,
          n,
          d,
          r,
          h,
          g,
          i,
          o,
          v = k.ajaxSetup({}, t),
          y = v.context || v,
          m = v.context && (y.nodeType || y.jquery) ? k(y) : k.event,
          x = k.Deferred(),
          b = k.Callbacks("once memory"),
          w = v.statusCode || {},
          a = {},
          s = {},
          u = "canceled",
          T = {
        readyState: 0,
        getResponseHeader: function getResponseHeader(e) {
          var t;

          if (h) {
            if (!n) {
              n = {};

              while (t = Pt.exec(p)) {
                n[t[1].toLowerCase() + " "] = (n[t[1].toLowerCase() + " "] || []).concat(t[2]);
              }
            }

            t = n[e.toLowerCase() + " "];
          }

          return null == t ? null : t.join(", ");
        },
        getAllResponseHeaders: function getAllResponseHeaders() {
          return h ? p : null;
        },
        setRequestHeader: function setRequestHeader(e, t) {
          return null == h && (e = s[e.toLowerCase()] = s[e.toLowerCase()] || e, a[e] = t), this;
        },
        overrideMimeType: function overrideMimeType(e) {
          return null == h && (v.mimeType = e), this;
        },
        statusCode: function statusCode(e) {
          var t;
          if (e) if (h) T.always(e[T.status]);else for (t in e) {
            w[t] = [w[t], e[t]];
          }
          return this;
        },
        abort: function abort(e) {
          var t = e || u;
          return c && c.abort(t), l(0, t), this;
        }
      };

      if (x.promise(T), v.url = ((e || v.url || Et.href) + "").replace(Mt, Et.protocol + "//"), v.type = t.method || t.type || v.method || v.type, v.dataTypes = (v.dataType || "*").toLowerCase().match(R) || [""], null == v.crossDomain) {
        r = E.createElement("a");

        try {
          r.href = v.url, r.href = r.href, v.crossDomain = Ft.protocol + "//" + Ft.host != r.protocol + "//" + r.host;
        } catch (e) {
          v.crossDomain = !0;
        }
      }

      if (v.data && v.processData && "string" != typeof v.data && (v.data = k.param(v.data, v.traditional)), _t(It, v, t, T), h) return T;

      for (i in (g = k.event && v.global) && 0 == k.active++ && k.event.trigger("ajaxStart"), v.type = v.type.toUpperCase(), v.hasContent = !Rt.test(v.type), f = v.url.replace(Ht, ""), v.hasContent ? v.data && v.processData && 0 === (v.contentType || "").indexOf("application/x-www-form-urlencoded") && (v.data = v.data.replace(Lt, "+")) : (o = v.url.slice(f.length), v.data && (v.processData || "string" == typeof v.data) && (f += (St.test(f) ? "&" : "?") + v.data, delete v.data), !1 === v.cache && (f = f.replace(Ot, "$1"), o = (St.test(f) ? "&" : "?") + "_=" + kt++ + o), v.url = f + o), v.ifModified && (k.lastModified[f] && T.setRequestHeader("If-Modified-Since", k.lastModified[f]), k.etag[f] && T.setRequestHeader("If-None-Match", k.etag[f])), (v.data && v.hasContent && !1 !== v.contentType || t.contentType) && T.setRequestHeader("Content-Type", v.contentType), T.setRequestHeader("Accept", v.dataTypes[0] && v.accepts[v.dataTypes[0]] ? v.accepts[v.dataTypes[0]] + ("*" !== v.dataTypes[0] ? ", " + $t + "; q=0.01" : "") : v.accepts["*"]), v.headers) {
        T.setRequestHeader(i, v.headers[i]);
      }

      if (v.beforeSend && (!1 === v.beforeSend.call(y, T, v) || h)) return T.abort();

      if (u = "abort", b.add(v.complete), T.done(v.success), T.fail(v.error), c = _t(Wt, v, t, T)) {
        if (T.readyState = 1, g && m.trigger("ajaxSend", [T, v]), h) return T;
        v.async && 0 < v.timeout && (d = C.setTimeout(function () {
          T.abort("timeout");
        }, v.timeout));

        try {
          h = !1, c.send(a, l);
        } catch (e) {
          if (h) throw e;
          l(-1, e);
        }
      } else l(-1, "No Transport");

      function l(e, t, n, r) {
        var i,
            o,
            a,
            s,
            u,
            l = t;
        h || (h = !0, d && C.clearTimeout(d), c = void 0, p = r || "", T.readyState = 0 < e ? 4 : 0, i = 200 <= e && e < 300 || 304 === e, n && (s = function (e, t, n) {
          var r,
              i,
              o,
              a,
              s = e.contents,
              u = e.dataTypes;

          while ("*" === u[0]) {
            u.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
          }

          if (r) for (i in s) {
            if (s[i] && s[i].test(r)) {
              u.unshift(i);
              break;
            }
          }
          if (u[0] in n) o = u[0];else {
            for (i in n) {
              if (!u[0] || e.converters[i + " " + u[0]]) {
                o = i;
                break;
              }

              a || (a = i);
            }

            o = o || a;
          }
          if (o) return o !== u[0] && u.unshift(o), n[o];
        }(v, T, n)), s = function (e, t, n, r) {
          var i,
              o,
              a,
              s,
              u,
              l = {},
              c = e.dataTypes.slice();
          if (c[1]) for (a in e.converters) {
            l[a.toLowerCase()] = e.converters[a];
          }
          o = c.shift();

          while (o) {
            if (e.responseFields[o] && (n[e.responseFields[o]] = t), !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), u = o, o = c.shift()) if ("*" === o) o = u;else if ("*" !== u && u !== o) {
              if (!(a = l[u + " " + o] || l["* " + o])) for (i in l) {
                if ((s = i.split(" "))[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
                  !0 === a ? a = l[i] : !0 !== l[i] && (o = s[0], c.unshift(s[1]));
                  break;
                }
              }
              if (!0 !== a) if (a && e["throws"]) t = a(t);else try {
                t = a(t);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: a ? e : "No conversion from " + u + " to " + o
                };
              }
            }
          }

          return {
            state: "success",
            data: t
          };
        }(v, s, T, i), i ? (v.ifModified && ((u = T.getResponseHeader("Last-Modified")) && (k.lastModified[f] = u), (u = T.getResponseHeader("etag")) && (k.etag[f] = u)), 204 === e || "HEAD" === v.type ? l = "nocontent" : 304 === e ? l = "notmodified" : (l = s.state, o = s.data, i = !(a = s.error))) : (a = l, !e && l || (l = "error", e < 0 && (e = 0))), T.status = e, T.statusText = (t || l) + "", i ? x.resolveWith(y, [o, l, T]) : x.rejectWith(y, [T, l, a]), T.statusCode(w), w = void 0, g && m.trigger(i ? "ajaxSuccess" : "ajaxError", [T, v, i ? o : a]), b.fireWith(y, [T, l]), g && (m.trigger("ajaxComplete", [T, v]), --k.active || k.event.trigger("ajaxStop")));
      }

      return T;
    },
    getJSON: function getJSON(e, t, n) {
      return k.get(e, t, n, "json");
    },
    getScript: function getScript(e, t) {
      return k.get(e, void 0, t, "script");
    }
  }), k.each(["get", "post"], function (e, i) {
    k[i] = function (e, t, n, r) {
      return m(t) && (r = r || n, n = t, t = void 0), k.ajax(k.extend({
        url: e,
        type: i,
        dataType: r,
        data: t,
        success: n
      }, k.isPlainObject(e) && e));
    };
  }), k._evalUrl = function (e, t) {
    return k.ajax({
      url: e,
      type: "GET",
      dataType: "script",
      cache: !0,
      async: !1,
      global: !1,
      converters: {
        "text script": function textScript() {}
      },
      dataFilter: function dataFilter(e) {
        k.globalEval(e, t);
      }
    });
  }, k.fn.extend({
    wrapAll: function wrapAll(e) {
      var t;
      return this[0] && (m(e) && (e = e.call(this[0])), t = k(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
        var e = this;

        while (e.firstElementChild) {
          e = e.firstElementChild;
        }

        return e;
      }).append(this)), this;
    },
    wrapInner: function wrapInner(n) {
      return m(n) ? this.each(function (e) {
        k(this).wrapInner(n.call(this, e));
      }) : this.each(function () {
        var e = k(this),
            t = e.contents();
        t.length ? t.wrapAll(n) : e.append(n);
      });
    },
    wrap: function wrap(t) {
      var n = m(t);
      return this.each(function (e) {
        k(this).wrapAll(n ? t.call(this, e) : t);
      });
    },
    unwrap: function unwrap(e) {
      return this.parent(e).not("body").each(function () {
        k(this).replaceWith(this.childNodes);
      }), this;
    }
  }), k.expr.pseudos.hidden = function (e) {
    return !k.expr.pseudos.visible(e);
  }, k.expr.pseudos.visible = function (e) {
    return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
  }, k.ajaxSettings.xhr = function () {
    try {
      return new C.XMLHttpRequest();
    } catch (e) {}
  };
  var Ut = {
    0: 200,
    1223: 204
  },
      Xt = k.ajaxSettings.xhr();
  y.cors = !!Xt && "withCredentials" in Xt, y.ajax = Xt = !!Xt, k.ajaxTransport(function (i) {
    var _o, a;

    if (y.cors || Xt && !i.crossDomain) return {
      send: function send(e, t) {
        var n,
            r = i.xhr();
        if (r.open(i.type, i.url, i.async, i.username, i.password), i.xhrFields) for (n in i.xhrFields) {
          r[n] = i.xhrFields[n];
        }

        for (n in i.mimeType && r.overrideMimeType && r.overrideMimeType(i.mimeType), i.crossDomain || e["X-Requested-With"] || (e["X-Requested-With"] = "XMLHttpRequest"), e) {
          r.setRequestHeader(n, e[n]);
        }

        _o = function o(e) {
          return function () {
            _o && (_o = a = r.onload = r.onerror = r.onabort = r.ontimeout = r.onreadystatechange = null, "abort" === e ? r.abort() : "error" === e ? "number" != typeof r.status ? t(0, "error") : t(r.status, r.statusText) : t(Ut[r.status] || r.status, r.statusText, "text" !== (r.responseType || "text") || "string" != typeof r.responseText ? {
              binary: r.response
            } : {
              text: r.responseText
            }, r.getAllResponseHeaders()));
          };
        }, r.onload = _o(), a = r.onerror = r.ontimeout = _o("error"), void 0 !== r.onabort ? r.onabort = a : r.onreadystatechange = function () {
          4 === r.readyState && C.setTimeout(function () {
            _o && a();
          });
        }, _o = _o("abort");

        try {
          r.send(i.hasContent && i.data || null);
        } catch (e) {
          if (_o) throw e;
        }
      },
      abort: function abort() {
        _o && _o();
      }
    };
  }), k.ajaxPrefilter(function (e) {
    e.crossDomain && (e.contents.script = !1);
  }), k.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /\b(?:java|ecma)script\b/
    },
    converters: {
      "text script": function textScript(e) {
        return k.globalEval(e), e;
      }
    }
  }), k.ajaxPrefilter("script", function (e) {
    void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
  }), k.ajaxTransport("script", function (n) {
    var r, _i;

    if (n.crossDomain || n.scriptAttrs) return {
      send: function send(e, t) {
        r = k("<script>").attr(n.scriptAttrs || {}).prop({
          charset: n.scriptCharset,
          src: n.url
        }).on("load error", _i = function i(e) {
          r.remove(), _i = null, e && t("error" === e.type ? 404 : 200, e.type);
        }), E.head.appendChild(r[0]);
      },
      abort: function abort() {
        _i && _i();
      }
    };
  });
  var Vt,
      Gt = [],
      Yt = /(=)\?(?=&|$)|\?\?/;
  k.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function jsonpCallback() {
      var e = Gt.pop() || k.expando + "_" + kt++;
      return this[e] = !0, e;
    }
  }), k.ajaxPrefilter("json jsonp", function (e, t, n) {
    var r,
        i,
        o,
        a = !1 !== e.jsonp && (Yt.test(e.url) ? "url" : "string" == typeof e.data && 0 === (e.contentType || "").indexOf("application/x-www-form-urlencoded") && Yt.test(e.data) && "data");
    if (a || "jsonp" === e.dataTypes[0]) return r = e.jsonpCallback = m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback, a ? e[a] = e[a].replace(Yt, "$1" + r) : !1 !== e.jsonp && (e.url += (St.test(e.url) ? "&" : "?") + e.jsonp + "=" + r), e.converters["script json"] = function () {
      return o || k.error(r + " was not called"), o[0];
    }, e.dataTypes[0] = "json", i = C[r], C[r] = function () {
      o = arguments;
    }, n.always(function () {
      void 0 === i ? k(C).removeProp(r) : C[r] = i, e[r] && (e.jsonpCallback = t.jsonpCallback, Gt.push(r)), o && m(i) && i(o[0]), o = i = void 0;
    }), "script";
  }), y.createHTMLDocument = ((Vt = E.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>", 2 === Vt.childNodes.length), k.parseHTML = function (e, t, n) {
    return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t, t = !1), t || (y.createHTMLDocument ? ((r = (t = E.implementation.createHTMLDocument("")).createElement("base")).href = E.location.href, t.head.appendChild(r)) : t = E), o = !n && [], (i = D.exec(e)) ? [t.createElement(i[1])] : (i = we([e], t, o), o && o.length && k(o).remove(), k.merge([], i.childNodes)));
    var r, i, o;
  }, k.fn.load = function (e, t, n) {
    var r,
        i,
        o,
        a = this,
        s = e.indexOf(" ");
    return -1 < s && (r = mt(e.slice(s)), e = e.slice(0, s)), m(t) ? (n = t, t = void 0) : t && "object" == _typeof(t) && (i = "POST"), 0 < a.length && k.ajax({
      url: e,
      type: i || "GET",
      dataType: "html",
      data: t
    }).done(function (e) {
      o = arguments, a.html(r ? k("<div>").append(k.parseHTML(e)).find(r) : e);
    }).always(n && function (e, t) {
      a.each(function () {
        n.apply(this, o || [e.responseText, t, e]);
      });
    }), this;
  }, k.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
    k.fn[t] = function (e) {
      return this.on(t, e);
    };
  }), k.expr.pseudos.animated = function (t) {
    return k.grep(k.timers, function (e) {
      return t === e.elem;
    }).length;
  }, k.offset = {
    setOffset: function setOffset(e, t, n) {
      var r,
          i,
          o,
          a,
          s,
          u,
          l = k.css(e, "position"),
          c = k(e),
          f = {};
      "static" === l && (e.style.position = "relative"), s = c.offset(), o = k.css(e, "top"), u = k.css(e, "left"), ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto") ? (a = (r = c.position()).top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(u) || 0), m(t) && (t = t.call(e, n, k.extend({}, s))), null != t.top && (f.top = t.top - s.top + a), null != t.left && (f.left = t.left - s.left + i), "using" in t ? t.using.call(e, f) : c.css(f);
    }
  }, k.fn.extend({
    offset: function offset(t) {
      if (arguments.length) return void 0 === t ? this : this.each(function (e) {
        k.offset.setOffset(this, t, e);
      });
      var e,
          n,
          r = this[0];
      return r ? r.getClientRects().length ? (e = r.getBoundingClientRect(), n = r.ownerDocument.defaultView, {
        top: e.top + n.pageYOffset,
        left: e.left + n.pageXOffset
      }) : {
        top: 0,
        left: 0
      } : void 0;
    },
    position: function position() {
      if (this[0]) {
        var e,
            t,
            n,
            r = this[0],
            i = {
          top: 0,
          left: 0
        };
        if ("fixed" === k.css(r, "position")) t = r.getBoundingClientRect();else {
          t = this.offset(), n = r.ownerDocument, e = r.offsetParent || n.documentElement;

          while (e && (e === n.body || e === n.documentElement) && "static" === k.css(e, "position")) {
            e = e.parentNode;
          }

          e && e !== r && 1 === e.nodeType && ((i = k(e).offset()).top += k.css(e, "borderTopWidth", !0), i.left += k.css(e, "borderLeftWidth", !0));
        }
        return {
          top: t.top - i.top - k.css(r, "marginTop", !0),
          left: t.left - i.left - k.css(r, "marginLeft", !0)
        };
      }
    },
    offsetParent: function offsetParent() {
      return this.map(function () {
        var e = this.offsetParent;

        while (e && "static" === k.css(e, "position")) {
          e = e.offsetParent;
        }

        return e || ie;
      });
    }
  }), k.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function (t, i) {
    var o = "pageYOffset" === i;

    k.fn[t] = function (e) {
      return _(this, function (e, t, n) {
        var r;
        if (x(e) ? r = e : 9 === e.nodeType && (r = e.defaultView), void 0 === n) return r ? r[i] : e[t];
        r ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset) : e[t] = n;
      }, t, e, arguments.length);
    };
  }), k.each(["top", "left"], function (e, n) {
    k.cssHooks[n] = ze(y.pixelPosition, function (e, t) {
      if (t) return t = _e(e, n), $e.test(t) ? k(e).position()[n] + "px" : t;
    });
  }), k.each({
    Height: "height",
    Width: "width"
  }, function (a, s) {
    k.each({
      padding: "inner" + a,
      content: s,
      "": "outer" + a
    }, function (r, o) {
      k.fn[o] = function (e, t) {
        var n = arguments.length && (r || "boolean" != typeof e),
            i = r || (!0 === e || !0 === t ? "margin" : "border");
        return _(this, function (e, t, n) {
          var r;
          return x(e) ? 0 === o.indexOf("outer") ? e["inner" + a] : e.document.documentElement["client" + a] : 9 === e.nodeType ? (r = e.documentElement, Math.max(e.body["scroll" + a], r["scroll" + a], e.body["offset" + a], r["offset" + a], r["client" + a])) : void 0 === n ? k.css(e, t, i) : k.style(e, t, n, i);
        }, s, n ? e : void 0, n);
      };
    });
  }), k.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function (e, n) {
    k.fn[n] = function (e, t) {
      return 0 < arguments.length ? this.on(n, null, e, t) : this.trigger(n);
    };
  }), k.fn.extend({
    hover: function hover(e, t) {
      return this.mouseenter(e).mouseleave(t || e);
    }
  }), k.fn.extend({
    bind: function bind(e, t, n) {
      return this.on(e, null, t, n);
    },
    unbind: function unbind(e, t) {
      return this.off(e, null, t);
    },
    delegate: function delegate(e, t, n, r) {
      return this.on(t, e, n, r);
    },
    undelegate: function undelegate(e, t, n) {
      return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n);
    }
  }), k.proxy = function (e, t) {
    var n, r, i;
    if ("string" == typeof t && (n = e[t], t = e, e = n), m(e)) return r = s.call(arguments, 2), (i = function i() {
      return e.apply(t || this, r.concat(s.call(arguments)));
    }).guid = e.guid = e.guid || k.guid++, i;
  }, k.holdReady = function (e) {
    e ? k.readyWait++ : k.ready(!0);
  }, k.isArray = Array.isArray, k.parseJSON = JSON.parse, k.nodeName = A, k.isFunction = m, k.isWindow = x, k.camelCase = V, k.type = w, k.now = Date.now, k.isNumeric = function (e) {
    var t = k.type(e);
    return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
  }, "function" == typeof define && define.amd && define("jquery", [], function () {
    return k;
  });
  var Qt = C.jQuery,
      Jt = C.$;
  return k.noConflict = function (e) {
    return C.$ === k && (C.$ = Jt), e && C.jQuery === k && (C.jQuery = Qt), k;
  }, e || (C.jQuery = C.$ = k), k;
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * jquery.mask.js
 * @version: v1.14.16
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at github.com/igorescobar/jQuery-Mask-Plugin
 *
 * Copyright (c) 2012 Igor Escobar http://igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */

/* jshint maxcomplexity:17 */

/* global define */
// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
(function (factory, jQuery, Zepto) {
  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof Meteor === 'undefined') {
    module.exports = factory(require('jquery'));
  } else {
    factory(jQuery || Zepto);
  }
})(function ($) {
  'use strict';

  var Mask = function Mask(el, mask, options) {
    var p = {
      invalid: [],
      getCaret: function getCaret() {
        try {
          var sel,
              pos = 0,
              ctrl = el.get(0),
              dSel = document.selection,
              cSelStart = ctrl.selectionStart; // IE Support

          if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
            sel = dSel.createRange();
            sel.moveStart('character', -p.val().length);
            pos = sel.text.length;
          } // Firefox support
          else if (cSelStart || cSelStart === '0') {
              pos = cSelStart;
            }

          return pos;
        } catch (e) {}
      },
      setCaret: function setCaret(pos) {
        try {
          if (el.is(':focus')) {
            var range,
                ctrl = el.get(0); // Firefox, WebKit, etc..

            if (ctrl.setSelectionRange) {
              ctrl.setSelectionRange(pos, pos);
            } else {
              // IE
              range = ctrl.createTextRange();
              range.collapse(true);
              range.moveEnd('character', pos);
              range.moveStart('character', pos);
              range.select();
            }
          }
        } catch (e) {}
      },
      events: function events() {
        el.on('keydown.mask', function (e) {
          el.data('mask-keycode', e.keyCode || e.which);
          el.data('mask-previus-value', el.val());
          el.data('mask-previus-caret-pos', p.getCaret());
          p.maskDigitPosMapOld = p.maskDigitPosMap;
        }).on($.jMaskGlobals.useInput ? 'input.mask' : 'keyup.mask', p.behaviour).on('paste.mask drop.mask', function () {
          setTimeout(function () {
            el.keydown().keyup();
          }, 100);
        }).on('change.mask', function () {
          el.data('changed', true);
        }).on('blur.mask', function () {
          if (oldValue !== p.val() && !el.data('changed')) {
            el.trigger('change');
          }

          el.data('changed', false);
        }) // it's very important that this callback remains in this position
        // otherwhise oldValue it's going to work buggy
        .on('blur.mask', function () {
          oldValue = p.val();
        }) // select all text on focus
        .on('focus.mask', function (e) {
          if (options.selectOnFocus === true) {
            $(e.target).select();
          }
        }) // clear the value if it not complete the mask
        .on('focusout.mask', function () {
          if (options.clearIfNotMatch && !regexMask.test(p.val())) {
            p.val('');
          }
        });
      },
      getRegexMask: function getRegexMask() {
        var maskChunks = [],
            translation,
            pattern,
            optional,
            recursive,
            oRecursive,
            r;

        for (var i = 0; i < mask.length; i++) {
          translation = jMask.translation[mask.charAt(i)];

          if (translation) {
            pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
            optional = translation.optional;
            recursive = translation.recursive;

            if (recursive) {
              maskChunks.push(mask.charAt(i));
              oRecursive = {
                digit: mask.charAt(i),
                pattern: pattern
              };
            } else {
              maskChunks.push(!optional && !recursive ? pattern : pattern + '?');
            }
          } else {
            maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
          }
        }

        r = maskChunks.join('');

        if (oRecursive) {
          r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?').replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
        }

        return new RegExp(r);
      },
      destroyEvents: function destroyEvents() {
        el.off(['input', 'keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
      },
      val: function val(v) {
        var isInput = el.is('input'),
            method = isInput ? 'val' : 'text',
            r;

        if (arguments.length > 0) {
          if (el[method]() !== v) {
            el[method](v);
          }

          r = el;
        } else {
          r = el[method]();
        }

        return r;
      },
      calculateCaretPosition: function calculateCaretPosition(oldVal) {
        var newVal = p.getMasked(),
            caretPosNew = p.getCaret();

        if (oldVal !== newVal) {
          var caretPosOld = el.data('mask-previus-caret-pos') || 0,
              newValL = newVal.length,
              oldValL = oldVal.length,
              maskDigitsBeforeCaret = 0,
              maskDigitsAfterCaret = 0,
              maskDigitsBeforeCaretAll = 0,
              maskDigitsBeforeCaretAllOld = 0,
              i = 0;

          for (i = caretPosNew; i < newValL; i++) {
            if (!p.maskDigitPosMap[i]) {
              break;
            }

            maskDigitsAfterCaret++;
          }

          for (i = caretPosNew - 1; i >= 0; i--) {
            if (!p.maskDigitPosMap[i]) {
              break;
            }

            maskDigitsBeforeCaret++;
          }

          for (i = caretPosNew - 1; i >= 0; i--) {
            if (p.maskDigitPosMap[i]) {
              maskDigitsBeforeCaretAll++;
            }
          }

          for (i = caretPosOld - 1; i >= 0; i--) {
            if (p.maskDigitPosMapOld[i]) {
              maskDigitsBeforeCaretAllOld++;
            }
          } // if the cursor is at the end keep it there


          if (caretPosNew > oldValL) {
            caretPosNew = newValL * 10;
          } else if (caretPosOld >= caretPosNew && caretPosOld !== oldValL) {
            if (!p.maskDigitPosMapOld[caretPosNew]) {
              var caretPos = caretPosNew;
              caretPosNew -= maskDigitsBeforeCaretAllOld - maskDigitsBeforeCaretAll;
              caretPosNew -= maskDigitsBeforeCaret;

              if (p.maskDigitPosMap[caretPosNew]) {
                caretPosNew = caretPos;
              }
            }
          } else if (caretPosNew > caretPosOld) {
            caretPosNew += maskDigitsBeforeCaretAll - maskDigitsBeforeCaretAllOld;
            caretPosNew += maskDigitsAfterCaret;
          }
        }

        return caretPosNew;
      },
      behaviour: function behaviour(e) {
        e = e || window.event;
        p.invalid = [];
        var keyCode = el.data('mask-keycode');

        if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
          var newVal = p.getMasked(),
              caretPos = p.getCaret(),
              oldVal = el.data('mask-previus-value') || ''; // this is a compensation to devices/browsers that don't compensate
          // caret positioning the right way

          setTimeout(function () {
            p.setCaret(p.calculateCaretPosition(oldVal));
          }, $.jMaskGlobals.keyStrokeCompensation);
          p.val(newVal);
          p.setCaret(caretPos);
          return p.callbacks(e);
        }
      },
      getMasked: function getMasked(skipMaskChars, val) {
        var buf = [],
            value = val === undefined ? p.val() : val + '',
            m = 0,
            maskLen = mask.length,
            v = 0,
            valLen = value.length,
            offset = 1,
            addMethod = 'push',
            resetPos = -1,
            maskDigitCount = 0,
            maskDigitPosArr = [],
            lastMaskChar,
            check;

        if (options.reverse) {
          addMethod = 'unshift';
          offset = -1;
          lastMaskChar = 0;
          m = maskLen - 1;
          v = valLen - 1;

          check = function check() {
            return m > -1 && v > -1;
          };
        } else {
          lastMaskChar = maskLen - 1;

          check = function check() {
            return m < maskLen && v < valLen;
          };
        }

        var lastUntranslatedMaskChar;

        while (check()) {
          var maskDigit = mask.charAt(m),
              valDigit = value.charAt(v),
              translation = jMask.translation[maskDigit];

          if (translation) {
            if (valDigit.match(translation.pattern)) {
              buf[addMethod](valDigit);

              if (translation.recursive) {
                if (resetPos === -1) {
                  resetPos = m;
                } else if (m === lastMaskChar && m !== resetPos) {
                  m = resetPos - offset;
                }

                if (lastMaskChar === resetPos) {
                  m -= offset;
                }
              }

              m += offset;
            } else if (valDigit === lastUntranslatedMaskChar) {
              // matched the last untranslated (raw) mask character that we encountered
              // likely an insert offset the mask character from the last entry; fall
              // through and only increment v
              maskDigitCount--;
              lastUntranslatedMaskChar = undefined;
            } else if (translation.optional) {
              m += offset;
              v -= offset;
            } else if (translation.fallback) {
              buf[addMethod](translation.fallback);
              m += offset;
              v -= offset;
            } else {
              p.invalid.push({
                p: v,
                v: valDigit,
                e: translation.pattern
              });
            }

            v += offset;
          } else {
            if (!skipMaskChars) {
              buf[addMethod](maskDigit);
            }

            if (valDigit === maskDigit) {
              maskDigitPosArr.push(v);
              v += offset;
            } else {
              lastUntranslatedMaskChar = maskDigit;
              maskDigitPosArr.push(v + maskDigitCount);
              maskDigitCount++;
            }

            m += offset;
          }
        }

        var lastMaskCharDigit = mask.charAt(lastMaskChar);

        if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
          buf.push(lastMaskCharDigit);
        }

        var newVal = buf.join('');
        p.mapMaskdigitPositions(newVal, maskDigitPosArr, valLen);
        return newVal;
      },
      mapMaskdigitPositions: function mapMaskdigitPositions(newVal, maskDigitPosArr, valLen) {
        var maskDiff = options.reverse ? newVal.length - valLen : 0;
        p.maskDigitPosMap = {};

        for (var i = 0; i < maskDigitPosArr.length; i++) {
          p.maskDigitPosMap[maskDigitPosArr[i] + maskDiff] = 1;
        }
      },
      callbacks: function callbacks(e) {
        var val = p.val(),
            changed = val !== oldValue,
            defaultArgs = [val, e, el, options],
            callback = function callback(name, criteria, args) {
          if (typeof options[name] === 'function' && criteria) {
            options[name].apply(this, args);
          }
        };

        callback('onChange', changed === true, defaultArgs);
        callback('onKeyPress', changed === true, defaultArgs);
        callback('onComplete', val.length === mask.length, defaultArgs);
        callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
      }
    };
    el = $(el);
    var jMask = this,
        oldValue = p.val(),
        regexMask;
    mask = typeof mask === 'function' ? mask(p.val(), undefined, el, options) : mask; // public methods

    jMask.mask = mask;
    jMask.options = options;

    jMask.remove = function () {
      var caret = p.getCaret();

      if (jMask.options.placeholder) {
        el.removeAttr('placeholder');
      }

      if (el.data('mask-maxlength')) {
        el.removeAttr('maxlength');
      }

      p.destroyEvents();
      p.val(jMask.getCleanVal());
      p.setCaret(caret);
      return el;
    }; // get value without mask


    jMask.getCleanVal = function () {
      return p.getMasked(true);
    }; // get masked value without the value being in the input or element


    jMask.getMaskedVal = function (val) {
      return p.getMasked(false, val);
    };

    jMask.init = function (onlyMask) {
      onlyMask = onlyMask || false;
      options = options || {};
      jMask.clearIfNotMatch = $.jMaskGlobals.clearIfNotMatch;
      jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
      jMask.translation = $.extend({}, $.jMaskGlobals.translation, options.translation);
      jMask = $.extend(true, {}, jMask, options);
      regexMask = p.getRegexMask();

      if (onlyMask) {
        p.events();
        p.val(p.getMasked());
      } else {
        if (options.placeholder) {
          el.attr('placeholder', options.placeholder);
        } // this is necessary, otherwise if the user submit the form
        // and then press the "back" button, the autocomplete will erase
        // the data. Works fine on IE9+, FF, Opera, Safari.


        if (el.data('mask')) {
          el.attr('autocomplete', 'off');
        } // detect if is necessary let the user type freely.
        // for is a lot faster than forEach.


        for (var i = 0, maxlength = true; i < mask.length; i++) {
          var translation = jMask.translation[mask.charAt(i)];

          if (translation && translation.recursive) {
            maxlength = false;
            break;
          }
        }

        if (maxlength) {
          el.attr('maxlength', mask.length).data('mask-maxlength', true);
        }

        p.destroyEvents();
        p.events();
        var caret = p.getCaret();
        p.val(p.getMasked());
        p.setCaret(caret);
      }
    };

    jMask.init(!el.is('input'));
  };

  $.maskWatchers = {};

  var HTMLAttributes = function HTMLAttributes() {
    var input = $(this),
        options = {},
        prefix = 'data-mask-',
        mask = input.attr('data-mask');

    if (input.attr(prefix + 'reverse')) {
      options.reverse = true;
    }

    if (input.attr(prefix + 'clearifnotmatch')) {
      options.clearIfNotMatch = true;
    }

    if (input.attr(prefix + 'selectonfocus') === 'true') {
      options.selectOnFocus = true;
    }

    if (notSameMaskObject(input, mask, options)) {
      return input.data('mask', new Mask(this, mask, options));
    }
  },
      notSameMaskObject = function notSameMaskObject(field, mask, options) {
    options = options || {};
    var maskObject = $(field).data('mask'),
        stringify = JSON.stringify,
        value = $(field).val() || $(field).text();

    try {
      if (typeof mask === 'function') {
        mask = mask(value);
      }

      return _typeof(maskObject) !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
    } catch (e) {}
  },
      eventSupported = function eventSupported(eventName) {
    var el = document.createElement('div'),
        isSupported;
    eventName = 'on' + eventName;
    isSupported = eventName in el;

    if (!isSupported) {
      el.setAttribute(eventName, 'return;');
      isSupported = typeof el[eventName] === 'function';
    }

    el = null;
    return isSupported;
  };

  $.fn.mask = function (mask, options) {
    options = options || {};

    var selector = this.selector,
        globals = $.jMaskGlobals,
        interval = globals.watchInterval,
        watchInputs = options.watchInputs || globals.watchInputs,
        maskFunction = function maskFunction() {
      if (notSameMaskObject(this, mask, options)) {
        return $(this).data('mask', new Mask(this, mask, options));
      }
    };

    $(this).each(maskFunction);

    if (selector && selector !== '' && watchInputs) {
      clearInterval($.maskWatchers[selector]);
      $.maskWatchers[selector] = setInterval(function () {
        $(document).find(selector).each(maskFunction);
      }, interval);
    }

    return this;
  };

  $.fn.masked = function (val) {
    return this.data('mask').getMaskedVal(val);
  };

  $.fn.unmask = function () {
    clearInterval($.maskWatchers[this.selector]);
    delete $.maskWatchers[this.selector];
    return this.each(function () {
      var dataMask = $(this).data('mask');

      if (dataMask) {
        dataMask.remove().removeData('mask');
      }
    });
  };

  $.fn.cleanVal = function () {
    return this.data('mask').getCleanVal();
  };

  $.applyDataMask = function (selector) {
    selector = selector || $.jMaskGlobals.maskElements;
    var $selector = selector instanceof $ ? selector : $(selector);
    $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
  };

  var globals = {
    maskElements: 'input,td,span,div',
    dataMaskAttr: '*[data-mask]',
    dataMask: true,
    watchInterval: 300,
    watchInputs: true,
    keyStrokeCompensation: 10,
    // old versions of chrome dont work great with input event
    useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && eventSupported('input'),
    watchDataMask: false,
    byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
    translation: {
      '0': {
        pattern: /\d/
      },
      '9': {
        pattern: /\d/,
        optional: true
      },
      '#': {
        pattern: /\d/,
        recursive: true
      },
      'A': {
        pattern: /[a-zA-Z0-9]/
      },
      'S': {
        pattern: /[a-zA-Z]/
      }
    }
  };
  $.jMaskGlobals = $.jMaskGlobals || {};
  globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals); // looking for inputs with data-mask attribute

  if (globals.dataMask) {
    $.applyDataMask();
  }

  setInterval(function () {
    if ($.jMaskGlobals.watchDataMask) {
      $.applyDataMask();
    }
  }, globals.watchInterval);
}, window.jQuery, window.Zepto);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (i) {
  "use strict";

  "function" == typeof define && define.amd ? define(["jquery"], i) : "undefined" != typeof exports ? module.exports = i(require("jquery")) : i(jQuery);
}(function (i) {
  "use strict";

  var e = window.Slick || {};
  (e = function () {
    var e = 0;
    return function (t, o) {
      var s,
          n = this;
      n.defaults = {
        accessibility: !0,
        adaptiveHeight: !1,
        appendArrows: i(t),
        appendDots: i(t),
        arrows: !0,
        asNavFor: null,
        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
        autoplay: !1,
        autoplaySpeed: 3e3,
        centerMode: !1,
        centerPadding: "50px",
        cssEase: "ease",
        customPaging: function customPaging(e, t) {
          return i('<button type="button" />').text(t + 1);
        },
        dots: !1,
        dotsClass: "slick-dots",
        draggable: !0,
        easing: "linear",
        edgeFriction: .35,
        fade: !1,
        focusOnSelect: !1,
        focusOnChange: !1,
        infinite: !0,
        initialSlide: 0,
        lazyLoad: "ondemand",
        mobileFirst: !1,
        pauseOnHover: !0,
        pauseOnFocus: !0,
        pauseOnDotsHover: !1,
        respondTo: "window",
        responsive: null,
        rows: 1,
        rtl: !1,
        slide: "",
        slidesPerRow: 1,
        slidesToShow: 1,
        slidesToScroll: 1,
        speed: 500,
        swipe: !0,
        swipeToSlide: !1,
        touchMove: !0,
        touchThreshold: 5,
        useCSS: !0,
        useTransform: !0,
        variableWidth: !1,
        vertical: !1,
        verticalSwiping: !1,
        waitForAnimate: !0,
        zIndex: 1e3
      }, n.initials = {
        animating: !1,
        dragging: !1,
        autoPlayTimer: null,
        currentDirection: 0,
        currentLeft: null,
        currentSlide: 0,
        direction: 1,
        $dots: null,
        listWidth: null,
        listHeight: null,
        loadIndex: 0,
        $nextArrow: null,
        $prevArrow: null,
        scrolling: !1,
        slideCount: null,
        slideWidth: null,
        $slideTrack: null,
        $slides: null,
        sliding: !1,
        slideOffset: 0,
        swipeLeft: null,
        swiping: !1,
        $list: null,
        touchObject: {},
        transformsEnabled: !1,
        unslicked: !1
      }, i.extend(n, n.initials), n.activeBreakpoint = null, n.animType = null, n.animProp = null, n.breakpoints = [], n.breakpointSettings = [], n.cssTransitions = !1, n.focussed = !1, n.interrupted = !1, n.hidden = "hidden", n.paused = !0, n.positionProp = null, n.respondTo = null, n.rowCount = 1, n.shouldClick = !0, n.$slider = i(t), n.$slidesCache = null, n.transformType = null, n.transitionType = null, n.visibilityChange = "visibilitychange", n.windowWidth = 0, n.windowTimer = null, s = i(t).data("slick") || {}, n.options = i.extend({}, n.defaults, o, s), n.currentSlide = n.options.initialSlide, n.originalSettings = n.options, void 0 !== document.mozHidden ? (n.hidden = "mozHidden", n.visibilityChange = "mozvisibilitychange") : void 0 !== document.webkitHidden && (n.hidden = "webkitHidden", n.visibilityChange = "webkitvisibilitychange"), n.autoPlay = i.proxy(n.autoPlay, n), n.autoPlayClear = i.proxy(n.autoPlayClear, n), n.autoPlayIterator = i.proxy(n.autoPlayIterator, n), n.changeSlide = i.proxy(n.changeSlide, n), n.clickHandler = i.proxy(n.clickHandler, n), n.selectHandler = i.proxy(n.selectHandler, n), n.setPosition = i.proxy(n.setPosition, n), n.swipeHandler = i.proxy(n.swipeHandler, n), n.dragHandler = i.proxy(n.dragHandler, n), n.keyHandler = i.proxy(n.keyHandler, n), n.instanceUid = e++, n.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/, n.registerBreakpoints(), n.init(!0);
    };
  }()).prototype.activateADA = function () {
    this.$slideTrack.find(".slick-active").attr({
      "aria-hidden": "false"
    }).find("a, input, button, select").attr({
      tabindex: "0"
    });
  }, e.prototype.addSlide = e.prototype.slickAdd = function (e, t, o) {
    var s = this;
    if ("boolean" == typeof t) o = t, t = null;else if (t < 0 || t >= s.slideCount) return !1;
    s.unload(), "number" == typeof t ? 0 === t && 0 === s.$slides.length ? i(e).appendTo(s.$slideTrack) : o ? i(e).insertBefore(s.$slides.eq(t)) : i(e).insertAfter(s.$slides.eq(t)) : !0 === o ? i(e).prependTo(s.$slideTrack) : i(e).appendTo(s.$slideTrack), s.$slides = s.$slideTrack.children(this.options.slide), s.$slideTrack.children(this.options.slide).detach(), s.$slideTrack.append(s.$slides), s.$slides.each(function (e, t) {
      i(t).attr("data-slick-index", e);
    }), s.$slidesCache = s.$slides, s.reinit();
  }, e.prototype.animateHeight = function () {
    var i = this;

    if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
      var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
      i.$list.animate({
        height: e
      }, i.options.speed);
    }
  }, e.prototype.animateSlide = function (e, t) {
    var o = {},
        s = this;
    s.animateHeight(), !0 === s.options.rtl && !1 === s.options.vertical && (e = -e), !1 === s.transformsEnabled ? !1 === s.options.vertical ? s.$slideTrack.animate({
      left: e
    }, s.options.speed, s.options.easing, t) : s.$slideTrack.animate({
      top: e
    }, s.options.speed, s.options.easing, t) : !1 === s.cssTransitions ? (!0 === s.options.rtl && (s.currentLeft = -s.currentLeft), i({
      animStart: s.currentLeft
    }).animate({
      animStart: e
    }, {
      duration: s.options.speed,
      easing: s.options.easing,
      step: function step(i) {
        i = Math.ceil(i), !1 === s.options.vertical ? (o[s.animType] = "translate(" + i + "px, 0px)", s.$slideTrack.css(o)) : (o[s.animType] = "translate(0px," + i + "px)", s.$slideTrack.css(o));
      },
      complete: function complete() {
        t && t.call();
      }
    })) : (s.applyTransition(), e = Math.ceil(e), !1 === s.options.vertical ? o[s.animType] = "translate3d(" + e + "px, 0px, 0px)" : o[s.animType] = "translate3d(0px," + e + "px, 0px)", s.$slideTrack.css(o), t && setTimeout(function () {
      s.disableTransition(), t.call();
    }, s.options.speed));
  }, e.prototype.getNavTarget = function () {
    var e = this,
        t = e.options.asNavFor;
    return t && null !== t && (t = i(t).not(e.$slider)), t;
  }, e.prototype.asNavFor = function (e) {
    var t = this.getNavTarget();
    null !== t && "object" == _typeof(t) && t.each(function () {
      var t = i(this).slick("getSlick");
      t.unslicked || t.slideHandler(e, !0);
    });
  }, e.prototype.applyTransition = function (i) {
    var e = this,
        t = {};
    !1 === e.options.fade ? t[e.transitionType] = e.transformType + " " + e.options.speed + "ms " + e.options.cssEase : t[e.transitionType] = "opacity " + e.options.speed + "ms " + e.options.cssEase, !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
  }, e.prototype.autoPlay = function () {
    var i = this;
    i.autoPlayClear(), i.slideCount > i.options.slidesToShow && (i.autoPlayTimer = setInterval(i.autoPlayIterator, i.options.autoplaySpeed));
  }, e.prototype.autoPlayClear = function () {
    var i = this;
    i.autoPlayTimer && clearInterval(i.autoPlayTimer);
  }, e.prototype.autoPlayIterator = function () {
    var i = this,
        e = i.currentSlide + i.options.slidesToScroll;
    i.paused || i.interrupted || i.focussed || (!1 === i.options.infinite && (1 === i.direction && i.currentSlide + 1 === i.slideCount - 1 ? i.direction = 0 : 0 === i.direction && (e = i.currentSlide - i.options.slidesToScroll, i.currentSlide - 1 == 0 && (i.direction = 1))), i.slideHandler(e));
  }, e.prototype.buildArrows = function () {
    var e = this;
    !0 === e.options.arrows && (e.$prevArrow = i(e.options.prevArrow).addClass("slick-arrow"), e.$nextArrow = i(e.options.nextArrow).addClass("slick-arrow"), e.slideCount > e.options.slidesToShow ? (e.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"), e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.prependTo(e.options.appendArrows), e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.appendTo(e.options.appendArrows), !0 !== e.options.infinite && e.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : e.$prevArrow.add(e.$nextArrow).addClass("slick-hidden").attr({
      "aria-disabled": "true",
      tabindex: "-1"
    }));
  }, e.prototype.buildDots = function () {
    var e,
        t,
        o = this;

    if (!0 === o.options.dots) {
      for (o.$slider.addClass("slick-dotted"), t = i("<ul />").addClass(o.options.dotsClass), e = 0; e <= o.getDotCount(); e += 1) {
        t.append(i("<li />").append(o.options.customPaging.call(this, o, e)));
      }

      o.$dots = t.appendTo(o.options.appendDots), o.$dots.find("li").first().addClass("slick-active");
    }
  }, e.prototype.buildOut = function () {
    var e = this;
    e.$slides = e.$slider.children(e.options.slide + ":not(.slick-cloned)").addClass("slick-slide"), e.slideCount = e.$slides.length, e.$slides.each(function (e, t) {
      i(t).attr("data-slick-index", e).data("originalStyling", i(t).attr("style") || "");
    }), e.$slider.addClass("slick-slider"), e.$slideTrack = 0 === e.slideCount ? i('<div class="slick-track"/>').appendTo(e.$slider) : e.$slides.wrapAll('<div class="slick-track"/>').parent(), e.$list = e.$slideTrack.wrap('<div class="slick-list"/>').parent(), e.$slideTrack.css("opacity", 0), !0 !== e.options.centerMode && !0 !== e.options.swipeToSlide || (e.options.slidesToScroll = 1), i("img[data-lazy]", e.$slider).not("[src]").addClass("slick-loading"), e.setupInfinite(), e.buildArrows(), e.buildDots(), e.updateDots(), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), !0 === e.options.draggable && e.$list.addClass("draggable");
  }, e.prototype.buildRows = function () {
    var i,
        e,
        t,
        o,
        s,
        n,
        r,
        l = this;

    if (o = document.createDocumentFragment(), n = l.$slider.children(), l.options.rows > 1) {
      for (r = l.options.slidesPerRow * l.options.rows, s = Math.ceil(n.length / r), i = 0; i < s; i++) {
        var d = document.createElement("div");

        for (e = 0; e < l.options.rows; e++) {
          var a = document.createElement("div");

          for (t = 0; t < l.options.slidesPerRow; t++) {
            var c = i * r + (e * l.options.slidesPerRow + t);
            n.get(c) && a.appendChild(n.get(c));
          }

          d.appendChild(a);
        }

        o.appendChild(d);
      }

      l.$slider.empty().append(o), l.$slider.children().children().children().css({
        width: 100 / l.options.slidesPerRow + "%",
        display: "inline-block"
      });
    }
  }, e.prototype.checkResponsive = function (e, t) {
    var o,
        s,
        n,
        r = this,
        l = !1,
        d = r.$slider.width(),
        a = window.innerWidth || i(window).width();

    if ("window" === r.respondTo ? n = a : "slider" === r.respondTo ? n = d : "min" === r.respondTo && (n = Math.min(a, d)), r.options.responsive && r.options.responsive.length && null !== r.options.responsive) {
      s = null;

      for (o in r.breakpoints) {
        r.breakpoints.hasOwnProperty(o) && (!1 === r.originalSettings.mobileFirst ? n < r.breakpoints[o] && (s = r.breakpoints[o]) : n > r.breakpoints[o] && (s = r.breakpoints[o]));
      }

      null !== s ? null !== r.activeBreakpoint ? (s !== r.activeBreakpoint || t) && (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : (r.activeBreakpoint = s, "unslick" === r.breakpointSettings[s] ? r.unslick(s) : (r.options = i.extend({}, r.originalSettings, r.breakpointSettings[s]), !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e)), l = s) : null !== r.activeBreakpoint && (r.activeBreakpoint = null, r.options = r.originalSettings, !0 === e && (r.currentSlide = r.options.initialSlide), r.refresh(e), l = s), e || !1 === l || r.$slider.trigger("breakpoint", [r, l]);
    }
  }, e.prototype.changeSlide = function (e, t) {
    var o,
        s,
        n,
        r = this,
        l = i(e.currentTarget);

    switch (l.is("a") && e.preventDefault(), l.is("li") || (l = l.closest("li")), n = r.slideCount % r.options.slidesToScroll != 0, o = n ? 0 : (r.slideCount - r.currentSlide) % r.options.slidesToScroll, e.data.message) {
      case "previous":
        s = 0 === o ? r.options.slidesToScroll : r.options.slidesToShow - o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide - s, !1, t);
        break;

      case "next":
        s = 0 === o ? r.options.slidesToScroll : o, r.slideCount > r.options.slidesToShow && r.slideHandler(r.currentSlide + s, !1, t);
        break;

      case "index":
        var d = 0 === e.data.index ? 0 : e.data.index || l.index() * r.options.slidesToScroll;
        r.slideHandler(r.checkNavigable(d), !1, t), l.children().trigger("focus");
        break;

      default:
        return;
    }
  }, e.prototype.checkNavigable = function (i) {
    var e, t;
    if (e = this.getNavigableIndexes(), t = 0, i > e[e.length - 1]) i = e[e.length - 1];else for (var o in e) {
      if (i < e[o]) {
        i = t;
        break;
      }

      t = e[o];
    }
    return i;
  }, e.prototype.cleanUpEvents = function () {
    var e = this;
    e.options.dots && null !== e.$dots && (i("li", e.$dots).off("click.slick", e.changeSlide).off("mouseenter.slick", i.proxy(e.interrupt, e, !0)).off("mouseleave.slick", i.proxy(e.interrupt, e, !1)), !0 === e.options.accessibility && e.$dots.off("keydown.slick", e.keyHandler)), e.$slider.off("focus.slick blur.slick"), !0 === e.options.arrows && e.slideCount > e.options.slidesToShow && (e.$prevArrow && e.$prevArrow.off("click.slick", e.changeSlide), e.$nextArrow && e.$nextArrow.off("click.slick", e.changeSlide), !0 === e.options.accessibility && (e.$prevArrow && e.$prevArrow.off("keydown.slick", e.keyHandler), e.$nextArrow && e.$nextArrow.off("keydown.slick", e.keyHandler))), e.$list.off("touchstart.slick mousedown.slick", e.swipeHandler), e.$list.off("touchmove.slick mousemove.slick", e.swipeHandler), e.$list.off("touchend.slick mouseup.slick", e.swipeHandler), e.$list.off("touchcancel.slick mouseleave.slick", e.swipeHandler), e.$list.off("click.slick", e.clickHandler), i(document).off(e.visibilityChange, e.visibility), e.cleanUpSlideEvents(), !0 === e.options.accessibility && e.$list.off("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().off("click.slick", e.selectHandler), i(window).off("orientationchange.slick.slick-" + e.instanceUid, e.orientationChange), i(window).off("resize.slick.slick-" + e.instanceUid, e.resize), i("[draggable!=true]", e.$slideTrack).off("dragstart", e.preventDefault), i(window).off("load.slick.slick-" + e.instanceUid, e.setPosition);
  }, e.prototype.cleanUpSlideEvents = function () {
    var e = this;
    e.$list.off("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.off("mouseleave.slick", i.proxy(e.interrupt, e, !1));
  }, e.prototype.cleanUpRows = function () {
    var i,
        e = this;
    e.options.rows > 1 && ((i = e.$slides.children().children()).removeAttr("style"), e.$slider.empty().append(i));
  }, e.prototype.clickHandler = function (i) {
    !1 === this.shouldClick && (i.stopImmediatePropagation(), i.stopPropagation(), i.preventDefault());
  }, e.prototype.destroy = function (e) {
    var t = this;
    t.autoPlayClear(), t.touchObject = {}, t.cleanUpEvents(), i(".slick-cloned", t.$slider).detach(), t.$dots && t.$dots.remove(), t.$prevArrow && t.$prevArrow.length && (t.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.prevArrow) && t.$prevArrow.remove()), t.$nextArrow && t.$nextArrow.length && (t.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""), t.htmlExpr.test(t.options.nextArrow) && t.$nextArrow.remove()), t.$slides && (t.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function () {
      i(this).attr("style", i(this).data("originalStyling"));
    }), t.$slideTrack.children(this.options.slide).detach(), t.$slideTrack.detach(), t.$list.detach(), t.$slider.append(t.$slides)), t.cleanUpRows(), t.$slider.removeClass("slick-slider"), t.$slider.removeClass("slick-initialized"), t.$slider.removeClass("slick-dotted"), t.unslicked = !0, e || t.$slider.trigger("destroy", [t]);
  }, e.prototype.disableTransition = function (i) {
    var e = this,
        t = {};
    t[e.transitionType] = "", !1 === e.options.fade ? e.$slideTrack.css(t) : e.$slides.eq(i).css(t);
  }, e.prototype.fadeSlide = function (i, e) {
    var t = this;
    !1 === t.cssTransitions ? (t.$slides.eq(i).css({
      zIndex: t.options.zIndex
    }), t.$slides.eq(i).animate({
      opacity: 1
    }, t.options.speed, t.options.easing, e)) : (t.applyTransition(i), t.$slides.eq(i).css({
      opacity: 1,
      zIndex: t.options.zIndex
    }), e && setTimeout(function () {
      t.disableTransition(i), e.call();
    }, t.options.speed));
  }, e.prototype.fadeSlideOut = function (i) {
    var e = this;
    !1 === e.cssTransitions ? e.$slides.eq(i).animate({
      opacity: 0,
      zIndex: e.options.zIndex - 2
    }, e.options.speed, e.options.easing) : (e.applyTransition(i), e.$slides.eq(i).css({
      opacity: 0,
      zIndex: e.options.zIndex - 2
    }));
  }, e.prototype.filterSlides = e.prototype.slickFilter = function (i) {
    var e = this;
    null !== i && (e.$slidesCache = e.$slides, e.unload(), e.$slideTrack.children(this.options.slide).detach(), e.$slidesCache.filter(i).appendTo(e.$slideTrack), e.reinit());
  }, e.prototype.focusHandler = function () {
    var e = this;
    e.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function (t) {
      t.stopImmediatePropagation();
      var o = i(this);
      setTimeout(function () {
        e.options.pauseOnFocus && (e.focussed = o.is(":focus"), e.autoPlay());
      }, 0);
    });
  }, e.prototype.getCurrent = e.prototype.slickCurrentSlide = function () {
    return this.currentSlide;
  }, e.prototype.getDotCount = function () {
    var i = this,
        e = 0,
        t = 0,
        o = 0;
    if (!0 === i.options.infinite) {
      if (i.slideCount <= i.options.slidesToShow) ++o;else for (; e < i.slideCount;) {
        ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
      }
    } else if (!0 === i.options.centerMode) o = i.slideCount;else if (i.options.asNavFor) for (; e < i.slideCount;) {
      ++o, e = t + i.options.slidesToScroll, t += i.options.slidesToScroll <= i.options.slidesToShow ? i.options.slidesToScroll : i.options.slidesToShow;
    } else o = 1 + Math.ceil((i.slideCount - i.options.slidesToShow) / i.options.slidesToScroll);
    return o - 1;
  }, e.prototype.getLeft = function (i) {
    var e,
        t,
        o,
        s,
        n = this,
        r = 0;
    return n.slideOffset = 0, t = n.$slides.first().outerHeight(!0), !0 === n.options.infinite ? (n.slideCount > n.options.slidesToShow && (n.slideOffset = n.slideWidth * n.options.slidesToShow * -1, s = -1, !0 === n.options.vertical && !0 === n.options.centerMode && (2 === n.options.slidesToShow ? s = -1.5 : 1 === n.options.slidesToShow && (s = -2)), r = t * n.options.slidesToShow * s), n.slideCount % n.options.slidesToScroll != 0 && i + n.options.slidesToScroll > n.slideCount && n.slideCount > n.options.slidesToShow && (i > n.slideCount ? (n.slideOffset = (n.options.slidesToShow - (i - n.slideCount)) * n.slideWidth * -1, r = (n.options.slidesToShow - (i - n.slideCount)) * t * -1) : (n.slideOffset = n.slideCount % n.options.slidesToScroll * n.slideWidth * -1, r = n.slideCount % n.options.slidesToScroll * t * -1))) : i + n.options.slidesToShow > n.slideCount && (n.slideOffset = (i + n.options.slidesToShow - n.slideCount) * n.slideWidth, r = (i + n.options.slidesToShow - n.slideCount) * t), n.slideCount <= n.options.slidesToShow && (n.slideOffset = 0, r = 0), !0 === n.options.centerMode && n.slideCount <= n.options.slidesToShow ? n.slideOffset = n.slideWidth * Math.floor(n.options.slidesToShow) / 2 - n.slideWidth * n.slideCount / 2 : !0 === n.options.centerMode && !0 === n.options.infinite ? n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2) - n.slideWidth : !0 === n.options.centerMode && (n.slideOffset = 0, n.slideOffset += n.slideWidth * Math.floor(n.options.slidesToShow / 2)), e = !1 === n.options.vertical ? i * n.slideWidth * -1 + n.slideOffset : i * t * -1 + r, !0 === n.options.variableWidth && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, !0 === n.options.centerMode && (o = n.slideCount <= n.options.slidesToShow || !1 === n.options.infinite ? n.$slideTrack.children(".slick-slide").eq(i) : n.$slideTrack.children(".slick-slide").eq(i + n.options.slidesToShow + 1), e = !0 === n.options.rtl ? o[0] ? -1 * (n.$slideTrack.width() - o[0].offsetLeft - o.width()) : 0 : o[0] ? -1 * o[0].offsetLeft : 0, e += (n.$list.width() - o.outerWidth()) / 2)), e;
  }, e.prototype.getOption = e.prototype.slickGetOption = function (i) {
    return this.options[i];
  }, e.prototype.getNavigableIndexes = function () {
    var i,
        e = this,
        t = 0,
        o = 0,
        s = [];

    for (!1 === e.options.infinite ? i = e.slideCount : (t = -1 * e.options.slidesToScroll, o = -1 * e.options.slidesToScroll, i = 2 * e.slideCount); t < i;) {
      s.push(t), t = o + e.options.slidesToScroll, o += e.options.slidesToScroll <= e.options.slidesToShow ? e.options.slidesToScroll : e.options.slidesToShow;
    }

    return s;
  }, e.prototype.getSlick = function () {
    return this;
  }, e.prototype.getSlideCount = function () {
    var e,
        t,
        o = this;
    return t = !0 === o.options.centerMode ? o.slideWidth * Math.floor(o.options.slidesToShow / 2) : 0, !0 === o.options.swipeToSlide ? (o.$slideTrack.find(".slick-slide").each(function (s, n) {
      if (n.offsetLeft - t + i(n).outerWidth() / 2 > -1 * o.swipeLeft) return e = n, !1;
    }), Math.abs(i(e).attr("data-slick-index") - o.currentSlide) || 1) : o.options.slidesToScroll;
  }, e.prototype.goTo = e.prototype.slickGoTo = function (i, e) {
    this.changeSlide({
      data: {
        message: "index",
        index: parseInt(i)
      }
    }, e);
  }, e.prototype.init = function (e) {
    var t = this;
    i(t.$slider).hasClass("slick-initialized") || (i(t.$slider).addClass("slick-initialized"), t.buildRows(), t.buildOut(), t.setProps(), t.startLoad(), t.loadSlider(), t.initializeEvents(), t.updateArrows(), t.updateDots(), t.checkResponsive(!0), t.focusHandler()), e && t.$slider.trigger("init", [t]), !0 === t.options.accessibility && t.initADA(), t.options.autoplay && (t.paused = !1, t.autoPlay());
  }, e.prototype.initADA = function () {
    var e = this,
        t = Math.ceil(e.slideCount / e.options.slidesToShow),
        o = e.getNavigableIndexes().filter(function (i) {
      return i >= 0 && i < e.slideCount;
    });
    e.$slides.add(e.$slideTrack.find(".slick-cloned")).attr({
      "aria-hidden": "true",
      tabindex: "-1"
    }).find("a, input, button, select").attr({
      tabindex: "-1"
    }), null !== e.$dots && (e.$slides.not(e.$slideTrack.find(".slick-cloned")).each(function (t) {
      var s = o.indexOf(t);
      i(this).attr({
        role: "tabpanel",
        id: "slick-slide" + e.instanceUid + t,
        tabindex: -1
      }), -1 !== s && i(this).attr({
        "aria-describedby": "slick-slide-control" + e.instanceUid + s
      });
    }), e.$dots.attr("role", "tablist").find("li").each(function (s) {
      var n = o[s];
      i(this).attr({
        role: "presentation"
      }), i(this).find("button").first().attr({
        role: "tab",
        id: "slick-slide-control" + e.instanceUid + s,
        "aria-controls": "slick-slide" + e.instanceUid + n,
        "aria-label": s + 1 + " of " + t,
        "aria-selected": null,
        tabindex: "-1"
      });
    }).eq(e.currentSlide).find("button").attr({
      "aria-selected": "true",
      tabindex: "0"
    }).end());

    for (var s = e.currentSlide, n = s + e.options.slidesToShow; s < n; s++) {
      e.$slides.eq(s).attr("tabindex", 0);
    }

    e.activateADA();
  }, e.prototype.initArrowEvents = function () {
    var i = this;
    !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.off("click.slick").on("click.slick", {
      message: "previous"
    }, i.changeSlide), i.$nextArrow.off("click.slick").on("click.slick", {
      message: "next"
    }, i.changeSlide), !0 === i.options.accessibility && (i.$prevArrow.on("keydown.slick", i.keyHandler), i.$nextArrow.on("keydown.slick", i.keyHandler)));
  }, e.prototype.initDotEvents = function () {
    var e = this;
    !0 === e.options.dots && (i("li", e.$dots).on("click.slick", {
      message: "index"
    }, e.changeSlide), !0 === e.options.accessibility && e.$dots.on("keydown.slick", e.keyHandler)), !0 === e.options.dots && !0 === e.options.pauseOnDotsHover && i("li", e.$dots).on("mouseenter.slick", i.proxy(e.interrupt, e, !0)).on("mouseleave.slick", i.proxy(e.interrupt, e, !1));
  }, e.prototype.initSlideEvents = function () {
    var e = this;
    e.options.pauseOnHover && (e.$list.on("mouseenter.slick", i.proxy(e.interrupt, e, !0)), e.$list.on("mouseleave.slick", i.proxy(e.interrupt, e, !1)));
  }, e.prototype.initializeEvents = function () {
    var e = this;
    e.initArrowEvents(), e.initDotEvents(), e.initSlideEvents(), e.$list.on("touchstart.slick mousedown.slick", {
      action: "start"
    }, e.swipeHandler), e.$list.on("touchmove.slick mousemove.slick", {
      action: "move"
    }, e.swipeHandler), e.$list.on("touchend.slick mouseup.slick", {
      action: "end"
    }, e.swipeHandler), e.$list.on("touchcancel.slick mouseleave.slick", {
      action: "end"
    }, e.swipeHandler), e.$list.on("click.slick", e.clickHandler), i(document).on(e.visibilityChange, i.proxy(e.visibility, e)), !0 === e.options.accessibility && e.$list.on("keydown.slick", e.keyHandler), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), i(window).on("orientationchange.slick.slick-" + e.instanceUid, i.proxy(e.orientationChange, e)), i(window).on("resize.slick.slick-" + e.instanceUid, i.proxy(e.resize, e)), i("[draggable!=true]", e.$slideTrack).on("dragstart", e.preventDefault), i(window).on("load.slick.slick-" + e.instanceUid, e.setPosition), i(e.setPosition);
  }, e.prototype.initUI = function () {
    var i = this;
    !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.show(), i.$nextArrow.show()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.show();
  }, e.prototype.keyHandler = function (i) {
    var e = this;
    i.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === i.keyCode && !0 === e.options.accessibility ? e.changeSlide({
      data: {
        message: !0 === e.options.rtl ? "next" : "previous"
      }
    }) : 39 === i.keyCode && !0 === e.options.accessibility && e.changeSlide({
      data: {
        message: !0 === e.options.rtl ? "previous" : "next"
      }
    }));
  }, e.prototype.lazyLoad = function () {
    function e(e) {
      i("img[data-lazy]", e).each(function () {
        var e = i(this),
            t = i(this).attr("data-lazy"),
            o = i(this).attr("data-srcset"),
            s = i(this).attr("data-sizes") || n.$slider.attr("data-sizes"),
            r = document.createElement("img");
        r.onload = function () {
          e.animate({
            opacity: 0
          }, 100, function () {
            o && (e.attr("srcset", o), s && e.attr("sizes", s)), e.attr("src", t).animate({
              opacity: 1
            }, 200, function () {
              e.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
            }), n.$slider.trigger("lazyLoaded", [n, e, t]);
          });
        }, r.onerror = function () {
          e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), n.$slider.trigger("lazyLoadError", [n, e, t]);
        }, r.src = t;
      });
    }

    var t,
        o,
        s,
        n = this;
    if (!0 === n.options.centerMode ? !0 === n.options.infinite ? s = (o = n.currentSlide + (n.options.slidesToShow / 2 + 1)) + n.options.slidesToShow + 2 : (o = Math.max(0, n.currentSlide - (n.options.slidesToShow / 2 + 1)), s = n.options.slidesToShow / 2 + 1 + 2 + n.currentSlide) : (o = n.options.infinite ? n.options.slidesToShow + n.currentSlide : n.currentSlide, s = Math.ceil(o + n.options.slidesToShow), !0 === n.options.fade && (o > 0 && o--, s <= n.slideCount && s++)), t = n.$slider.find(".slick-slide").slice(o, s), "anticipated" === n.options.lazyLoad) for (var r = o - 1, l = s, d = n.$slider.find(".slick-slide"), a = 0; a < n.options.slidesToScroll; a++) {
      r < 0 && (r = n.slideCount - 1), t = (t = t.add(d.eq(r))).add(d.eq(l)), r--, l++;
    }
    e(t), n.slideCount <= n.options.slidesToShow ? e(n.$slider.find(".slick-slide")) : n.currentSlide >= n.slideCount - n.options.slidesToShow ? e(n.$slider.find(".slick-cloned").slice(0, n.options.slidesToShow)) : 0 === n.currentSlide && e(n.$slider.find(".slick-cloned").slice(-1 * n.options.slidesToShow));
  }, e.prototype.loadSlider = function () {
    var i = this;
    i.setPosition(), i.$slideTrack.css({
      opacity: 1
    }), i.$slider.removeClass("slick-loading"), i.initUI(), "progressive" === i.options.lazyLoad && i.progressiveLazyLoad();
  }, e.prototype.next = e.prototype.slickNext = function () {
    this.changeSlide({
      data: {
        message: "next"
      }
    });
  }, e.prototype.orientationChange = function () {
    var i = this;
    i.checkResponsive(), i.setPosition();
  }, e.prototype.pause = e.prototype.slickPause = function () {
    var i = this;
    i.autoPlayClear(), i.paused = !0;
  }, e.prototype.play = e.prototype.slickPlay = function () {
    var i = this;
    i.autoPlay(), i.options.autoplay = !0, i.paused = !1, i.focussed = !1, i.interrupted = !1;
  }, e.prototype.postSlide = function (e) {
    var t = this;
    t.unslicked || (t.$slider.trigger("afterChange", [t, e]), t.animating = !1, t.slideCount > t.options.slidesToShow && t.setPosition(), t.swipeLeft = null, t.options.autoplay && t.autoPlay(), !0 === t.options.accessibility && (t.initADA(), t.options.focusOnChange && i(t.$slides.get(t.currentSlide)).attr("tabindex", 0).focus()));
  }, e.prototype.prev = e.prototype.slickPrev = function () {
    this.changeSlide({
      data: {
        message: "previous"
      }
    });
  }, e.prototype.preventDefault = function (i) {
    i.preventDefault();
  }, e.prototype.progressiveLazyLoad = function (e) {
    e = e || 1;
    var t,
        o,
        s,
        n,
        r,
        l = this,
        d = i("img[data-lazy]", l.$slider);
    d.length ? (t = d.first(), o = t.attr("data-lazy"), s = t.attr("data-srcset"), n = t.attr("data-sizes") || l.$slider.attr("data-sizes"), (r = document.createElement("img")).onload = function () {
      s && (t.attr("srcset", s), n && t.attr("sizes", n)), t.attr("src", o).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading"), !0 === l.options.adaptiveHeight && l.setPosition(), l.$slider.trigger("lazyLoaded", [l, t, o]), l.progressiveLazyLoad();
    }, r.onerror = function () {
      e < 3 ? setTimeout(function () {
        l.progressiveLazyLoad(e + 1);
      }, 500) : (t.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"), l.$slider.trigger("lazyLoadError", [l, t, o]), l.progressiveLazyLoad());
    }, r.src = o) : l.$slider.trigger("allImagesLoaded", [l]);
  }, e.prototype.refresh = function (e) {
    var t,
        o,
        s = this;
    o = s.slideCount - s.options.slidesToShow, !s.options.infinite && s.currentSlide > o && (s.currentSlide = o), s.slideCount <= s.options.slidesToShow && (s.currentSlide = 0), t = s.currentSlide, s.destroy(!0), i.extend(s, s.initials, {
      currentSlide: t
    }), s.init(), e || s.changeSlide({
      data: {
        message: "index",
        index: t
      }
    }, !1);
  }, e.prototype.registerBreakpoints = function () {
    var e,
        t,
        o,
        s = this,
        n = s.options.responsive || null;

    if ("array" === i.type(n) && n.length) {
      s.respondTo = s.options.respondTo || "window";

      for (e in n) {
        if (o = s.breakpoints.length - 1, n.hasOwnProperty(e)) {
          for (t = n[e].breakpoint; o >= 0;) {
            s.breakpoints[o] && s.breakpoints[o] === t && s.breakpoints.splice(o, 1), o--;
          }

          s.breakpoints.push(t), s.breakpointSettings[t] = n[e].settings;
        }
      }

      s.breakpoints.sort(function (i, e) {
        return s.options.mobileFirst ? i - e : e - i;
      });
    }
  }, e.prototype.reinit = function () {
    var e = this;
    e.$slides = e.$slideTrack.children(e.options.slide).addClass("slick-slide"), e.slideCount = e.$slides.length, e.currentSlide >= e.slideCount && 0 !== e.currentSlide && (e.currentSlide = e.currentSlide - e.options.slidesToScroll), e.slideCount <= e.options.slidesToShow && (e.currentSlide = 0), e.registerBreakpoints(), e.setProps(), e.setupInfinite(), e.buildArrows(), e.updateArrows(), e.initArrowEvents(), e.buildDots(), e.updateDots(), e.initDotEvents(), e.cleanUpSlideEvents(), e.initSlideEvents(), e.checkResponsive(!1, !0), !0 === e.options.focusOnSelect && i(e.$slideTrack).children().on("click.slick", e.selectHandler), e.setSlideClasses("number" == typeof e.currentSlide ? e.currentSlide : 0), e.setPosition(), e.focusHandler(), e.paused = !e.options.autoplay, e.autoPlay(), e.$slider.trigger("reInit", [e]);
  }, e.prototype.resize = function () {
    var e = this;
    i(window).width() !== e.windowWidth && (clearTimeout(e.windowDelay), e.windowDelay = window.setTimeout(function () {
      e.windowWidth = i(window).width(), e.checkResponsive(), e.unslicked || e.setPosition();
    }, 50));
  }, e.prototype.removeSlide = e.prototype.slickRemove = function (i, e, t) {
    var o = this;
    if (i = "boolean" == typeof i ? !0 === (e = i) ? 0 : o.slideCount - 1 : !0 === e ? --i : i, o.slideCount < 1 || i < 0 || i > o.slideCount - 1) return !1;
    o.unload(), !0 === t ? o.$slideTrack.children().remove() : o.$slideTrack.children(this.options.slide).eq(i).remove(), o.$slides = o.$slideTrack.children(this.options.slide), o.$slideTrack.children(this.options.slide).detach(), o.$slideTrack.append(o.$slides), o.$slidesCache = o.$slides, o.reinit();
  }, e.prototype.setCSS = function (i) {
    var e,
        t,
        o = this,
        s = {};
    !0 === o.options.rtl && (i = -i), e = "left" == o.positionProp ? Math.ceil(i) + "px" : "0px", t = "top" == o.positionProp ? Math.ceil(i) + "px" : "0px", s[o.positionProp] = i, !1 === o.transformsEnabled ? o.$slideTrack.css(s) : (s = {}, !1 === o.cssTransitions ? (s[o.animType] = "translate(" + e + ", " + t + ")", o.$slideTrack.css(s)) : (s[o.animType] = "translate3d(" + e + ", " + t + ", 0px)", o.$slideTrack.css(s)));
  }, e.prototype.setDimensions = function () {
    var i = this;
    !1 === i.options.vertical ? !0 === i.options.centerMode && i.$list.css({
      padding: "0px " + i.options.centerPadding
    }) : (i.$list.height(i.$slides.first().outerHeight(!0) * i.options.slidesToShow), !0 === i.options.centerMode && i.$list.css({
      padding: i.options.centerPadding + " 0px"
    })), i.listWidth = i.$list.width(), i.listHeight = i.$list.height(), !1 === i.options.vertical && !1 === i.options.variableWidth ? (i.slideWidth = Math.ceil(i.listWidth / i.options.slidesToShow), i.$slideTrack.width(Math.ceil(i.slideWidth * i.$slideTrack.children(".slick-slide").length))) : !0 === i.options.variableWidth ? i.$slideTrack.width(5e3 * i.slideCount) : (i.slideWidth = Math.ceil(i.listWidth), i.$slideTrack.height(Math.ceil(i.$slides.first().outerHeight(!0) * i.$slideTrack.children(".slick-slide").length)));
    var e = i.$slides.first().outerWidth(!0) - i.$slides.first().width();
    !1 === i.options.variableWidth && i.$slideTrack.children(".slick-slide").width(i.slideWidth - e);
  }, e.prototype.setFade = function () {
    var e,
        t = this;
    t.$slides.each(function (o, s) {
      e = t.slideWidth * o * -1, !0 === t.options.rtl ? i(s).css({
        position: "relative",
        right: e,
        top: 0,
        zIndex: t.options.zIndex - 2,
        opacity: 0
      }) : i(s).css({
        position: "relative",
        left: e,
        top: 0,
        zIndex: t.options.zIndex - 2,
        opacity: 0
      });
    }), t.$slides.eq(t.currentSlide).css({
      zIndex: t.options.zIndex - 1,
      opacity: 1
    });
  }, e.prototype.setHeight = function () {
    var i = this;

    if (1 === i.options.slidesToShow && !0 === i.options.adaptiveHeight && !1 === i.options.vertical) {
      var e = i.$slides.eq(i.currentSlide).outerHeight(!0);
      i.$list.css("height", e);
    }
  }, e.prototype.setOption = e.prototype.slickSetOption = function () {
    var e,
        t,
        o,
        s,
        n,
        r = this,
        l = !1;
    if ("object" === i.type(arguments[0]) ? (o = arguments[0], l = arguments[1], n = "multiple") : "string" === i.type(arguments[0]) && (o = arguments[0], s = arguments[1], l = arguments[2], "responsive" === arguments[0] && "array" === i.type(arguments[1]) ? n = "responsive" : void 0 !== arguments[1] && (n = "single")), "single" === n) r.options[o] = s;else if ("multiple" === n) i.each(o, function (i, e) {
      r.options[i] = e;
    });else if ("responsive" === n) for (t in s) {
      if ("array" !== i.type(r.options.responsive)) r.options.responsive = [s[t]];else {
        for (e = r.options.responsive.length - 1; e >= 0;) {
          r.options.responsive[e].breakpoint === s[t].breakpoint && r.options.responsive.splice(e, 1), e--;
        }

        r.options.responsive.push(s[t]);
      }
    }
    l && (r.unload(), r.reinit());
  }, e.prototype.setPosition = function () {
    var i = this;
    i.setDimensions(), i.setHeight(), !1 === i.options.fade ? i.setCSS(i.getLeft(i.currentSlide)) : i.setFade(), i.$slider.trigger("setPosition", [i]);
  }, e.prototype.setProps = function () {
    var i = this,
        e = document.body.style;
    i.positionProp = !0 === i.options.vertical ? "top" : "left", "top" === i.positionProp ? i.$slider.addClass("slick-vertical") : i.$slider.removeClass("slick-vertical"), void 0 === e.WebkitTransition && void 0 === e.MozTransition && void 0 === e.msTransition || !0 === i.options.useCSS && (i.cssTransitions = !0), i.options.fade && ("number" == typeof i.options.zIndex ? i.options.zIndex < 3 && (i.options.zIndex = 3) : i.options.zIndex = i.defaults.zIndex), void 0 !== e.OTransform && (i.animType = "OTransform", i.transformType = "-o-transform", i.transitionType = "OTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.MozTransform && (i.animType = "MozTransform", i.transformType = "-moz-transform", i.transitionType = "MozTransition", void 0 === e.perspectiveProperty && void 0 === e.MozPerspective && (i.animType = !1)), void 0 !== e.webkitTransform && (i.animType = "webkitTransform", i.transformType = "-webkit-transform", i.transitionType = "webkitTransition", void 0 === e.perspectiveProperty && void 0 === e.webkitPerspective && (i.animType = !1)), void 0 !== e.msTransform && (i.animType = "msTransform", i.transformType = "-ms-transform", i.transitionType = "msTransition", void 0 === e.msTransform && (i.animType = !1)), void 0 !== e.transform && !1 !== i.animType && (i.animType = "transform", i.transformType = "transform", i.transitionType = "transition"), i.transformsEnabled = i.options.useTransform && null !== i.animType && !1 !== i.animType;
  }, e.prototype.setSlideClasses = function (i) {
    var e,
        t,
        o,
        s,
        n = this;

    if (t = n.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true"), n.$slides.eq(i).addClass("slick-current"), !0 === n.options.centerMode) {
      var r = n.options.slidesToShow % 2 == 0 ? 1 : 0;
      e = Math.floor(n.options.slidesToShow / 2), !0 === n.options.infinite && (i >= e && i <= n.slideCount - 1 - e ? n.$slides.slice(i - e + r, i + e + 1).addClass("slick-active").attr("aria-hidden", "false") : (o = n.options.slidesToShow + i, t.slice(o - e + 1 + r, o + e + 2).addClass("slick-active").attr("aria-hidden", "false")), 0 === i ? t.eq(t.length - 1 - n.options.slidesToShow).addClass("slick-center") : i === n.slideCount - 1 && t.eq(n.options.slidesToShow).addClass("slick-center")), n.$slides.eq(i).addClass("slick-center");
    } else i >= 0 && i <= n.slideCount - n.options.slidesToShow ? n.$slides.slice(i, i + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : t.length <= n.options.slidesToShow ? t.addClass("slick-active").attr("aria-hidden", "false") : (s = n.slideCount % n.options.slidesToShow, o = !0 === n.options.infinite ? n.options.slidesToShow + i : i, n.options.slidesToShow == n.options.slidesToScroll && n.slideCount - i < n.options.slidesToShow ? t.slice(o - (n.options.slidesToShow - s), o + s).addClass("slick-active").attr("aria-hidden", "false") : t.slice(o, o + n.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));

    "ondemand" !== n.options.lazyLoad && "anticipated" !== n.options.lazyLoad || n.lazyLoad();
  }, e.prototype.setupInfinite = function () {
    var e,
        t,
        o,
        s = this;

    if (!0 === s.options.fade && (s.options.centerMode = !1), !0 === s.options.infinite && !1 === s.options.fade && (t = null, s.slideCount > s.options.slidesToShow)) {
      for (o = !0 === s.options.centerMode ? s.options.slidesToShow + 1 : s.options.slidesToShow, e = s.slideCount; e > s.slideCount - o; e -= 1) {
        t = e - 1, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t - s.slideCount).prependTo(s.$slideTrack).addClass("slick-cloned");
      }

      for (e = 0; e < o + s.slideCount; e += 1) {
        t = e, i(s.$slides[t]).clone(!0).attr("id", "").attr("data-slick-index", t + s.slideCount).appendTo(s.$slideTrack).addClass("slick-cloned");
      }

      s.$slideTrack.find(".slick-cloned").find("[id]").each(function () {
        i(this).attr("id", "");
      });
    }
  }, e.prototype.interrupt = function (i) {
    var e = this;
    i || e.autoPlay(), e.interrupted = i;
  }, e.prototype.selectHandler = function (e) {
    var t = this,
        o = i(e.target).is(".slick-slide") ? i(e.target) : i(e.target).parents(".slick-slide"),
        s = parseInt(o.attr("data-slick-index"));
    s || (s = 0), t.slideCount <= t.options.slidesToShow ? t.slideHandler(s, !1, !0) : t.slideHandler(s);
  }, e.prototype.slideHandler = function (i, e, t) {
    var o,
        s,
        n,
        r,
        l,
        d = null,
        a = this;
    if (e = e || !1, !(!0 === a.animating && !0 === a.options.waitForAnimate || !0 === a.options.fade && a.currentSlide === i)) if (!1 === e && a.asNavFor(i), o = i, d = a.getLeft(o), r = a.getLeft(a.currentSlide), a.currentLeft = null === a.swipeLeft ? r : a.swipeLeft, !1 === a.options.infinite && !1 === a.options.centerMode && (i < 0 || i > a.getDotCount() * a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function () {
      a.postSlide(o);
    }) : a.postSlide(o));else if (!1 === a.options.infinite && !0 === a.options.centerMode && (i < 0 || i > a.slideCount - a.options.slidesToScroll)) !1 === a.options.fade && (o = a.currentSlide, !0 !== t ? a.animateSlide(r, function () {
      a.postSlide(o);
    }) : a.postSlide(o));else {
      if (a.options.autoplay && clearInterval(a.autoPlayTimer), s = o < 0 ? a.slideCount % a.options.slidesToScroll != 0 ? a.slideCount - a.slideCount % a.options.slidesToScroll : a.slideCount + o : o >= a.slideCount ? a.slideCount % a.options.slidesToScroll != 0 ? 0 : o - a.slideCount : o, a.animating = !0, a.$slider.trigger("beforeChange", [a, a.currentSlide, s]), n = a.currentSlide, a.currentSlide = s, a.setSlideClasses(a.currentSlide), a.options.asNavFor && (l = (l = a.getNavTarget()).slick("getSlick")).slideCount <= l.options.slidesToShow && l.setSlideClasses(a.currentSlide), a.updateDots(), a.updateArrows(), !0 === a.options.fade) return !0 !== t ? (a.fadeSlideOut(n), a.fadeSlide(s, function () {
        a.postSlide(s);
      })) : a.postSlide(s), void a.animateHeight();
      !0 !== t ? a.animateSlide(d, function () {
        a.postSlide(s);
      }) : a.postSlide(s);
    }
  }, e.prototype.startLoad = function () {
    var i = this;
    !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && (i.$prevArrow.hide(), i.$nextArrow.hide()), !0 === i.options.dots && i.slideCount > i.options.slidesToShow && i.$dots.hide(), i.$slider.addClass("slick-loading");
  }, e.prototype.swipeDirection = function () {
    var i,
        e,
        t,
        o,
        s = this;
    return i = s.touchObject.startX - s.touchObject.curX, e = s.touchObject.startY - s.touchObject.curY, t = Math.atan2(e, i), (o = Math.round(180 * t / Math.PI)) < 0 && (o = 360 - Math.abs(o)), o <= 45 && o >= 0 ? !1 === s.options.rtl ? "left" : "right" : o <= 360 && o >= 315 ? !1 === s.options.rtl ? "left" : "right" : o >= 135 && o <= 225 ? !1 === s.options.rtl ? "right" : "left" : !0 === s.options.verticalSwiping ? o >= 35 && o <= 135 ? "down" : "up" : "vertical";
  }, e.prototype.swipeEnd = function (i) {
    var e,
        t,
        o = this;
    if (o.dragging = !1, o.swiping = !1, o.scrolling) return o.scrolling = !1, !1;
    if (o.interrupted = !1, o.shouldClick = !(o.touchObject.swipeLength > 10), void 0 === o.touchObject.curX) return !1;

    if (!0 === o.touchObject.edgeHit && o.$slider.trigger("edge", [o, o.swipeDirection()]), o.touchObject.swipeLength >= o.touchObject.minSwipe) {
      switch (t = o.swipeDirection()) {
        case "left":
        case "down":
          e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide + o.getSlideCount()) : o.currentSlide + o.getSlideCount(), o.currentDirection = 0;
          break;

        case "right":
        case "up":
          e = o.options.swipeToSlide ? o.checkNavigable(o.currentSlide - o.getSlideCount()) : o.currentSlide - o.getSlideCount(), o.currentDirection = 1;
      }

      "vertical" != t && (o.slideHandler(e), o.touchObject = {}, o.$slider.trigger("swipe", [o, t]));
    } else o.touchObject.startX !== o.touchObject.curX && (o.slideHandler(o.currentSlide), o.touchObject = {});
  }, e.prototype.swipeHandler = function (i) {
    var e = this;
    if (!(!1 === e.options.swipe || "ontouchend" in document && !1 === e.options.swipe || !1 === e.options.draggable && -1 !== i.type.indexOf("mouse"))) switch (e.touchObject.fingerCount = i.originalEvent && void 0 !== i.originalEvent.touches ? i.originalEvent.touches.length : 1, e.touchObject.minSwipe = e.listWidth / e.options.touchThreshold, !0 === e.options.verticalSwiping && (e.touchObject.minSwipe = e.listHeight / e.options.touchThreshold), i.data.action) {
      case "start":
        e.swipeStart(i);
        break;

      case "move":
        e.swipeMove(i);
        break;

      case "end":
        e.swipeEnd(i);
    }
  }, e.prototype.swipeMove = function (i) {
    var e,
        t,
        o,
        s,
        n,
        r,
        l = this;
    return n = void 0 !== i.originalEvent ? i.originalEvent.touches : null, !(!l.dragging || l.scrolling || n && 1 !== n.length) && (e = l.getLeft(l.currentSlide), l.touchObject.curX = void 0 !== n ? n[0].pageX : i.clientX, l.touchObject.curY = void 0 !== n ? n[0].pageY : i.clientY, l.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(l.touchObject.curX - l.touchObject.startX, 2))), r = Math.round(Math.sqrt(Math.pow(l.touchObject.curY - l.touchObject.startY, 2))), !l.options.verticalSwiping && !l.swiping && r > 4 ? (l.scrolling = !0, !1) : (!0 === l.options.verticalSwiping && (l.touchObject.swipeLength = r), t = l.swipeDirection(), void 0 !== i.originalEvent && l.touchObject.swipeLength > 4 && (l.swiping = !0, i.preventDefault()), s = (!1 === l.options.rtl ? 1 : -1) * (l.touchObject.curX > l.touchObject.startX ? 1 : -1), !0 === l.options.verticalSwiping && (s = l.touchObject.curY > l.touchObject.startY ? 1 : -1), o = l.touchObject.swipeLength, l.touchObject.edgeHit = !1, !1 === l.options.infinite && (0 === l.currentSlide && "right" === t || l.currentSlide >= l.getDotCount() && "left" === t) && (o = l.touchObject.swipeLength * l.options.edgeFriction, l.touchObject.edgeHit = !0), !1 === l.options.vertical ? l.swipeLeft = e + o * s : l.swipeLeft = e + o * (l.$list.height() / l.listWidth) * s, !0 === l.options.verticalSwiping && (l.swipeLeft = e + o * s), !0 !== l.options.fade && !1 !== l.options.touchMove && (!0 === l.animating ? (l.swipeLeft = null, !1) : void l.setCSS(l.swipeLeft))));
  }, e.prototype.swipeStart = function (i) {
    var e,
        t = this;
    if (t.interrupted = !0, 1 !== t.touchObject.fingerCount || t.slideCount <= t.options.slidesToShow) return t.touchObject = {}, !1;
    void 0 !== i.originalEvent && void 0 !== i.originalEvent.touches && (e = i.originalEvent.touches[0]), t.touchObject.startX = t.touchObject.curX = void 0 !== e ? e.pageX : i.clientX, t.touchObject.startY = t.touchObject.curY = void 0 !== e ? e.pageY : i.clientY, t.dragging = !0;
  }, e.prototype.unfilterSlides = e.prototype.slickUnfilter = function () {
    var i = this;
    null !== i.$slidesCache && (i.unload(), i.$slideTrack.children(this.options.slide).detach(), i.$slidesCache.appendTo(i.$slideTrack), i.reinit());
  }, e.prototype.unload = function () {
    var e = this;
    i(".slick-cloned", e.$slider).remove(), e.$dots && e.$dots.remove(), e.$prevArrow && e.htmlExpr.test(e.options.prevArrow) && e.$prevArrow.remove(), e.$nextArrow && e.htmlExpr.test(e.options.nextArrow) && e.$nextArrow.remove(), e.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "");
  }, e.prototype.unslick = function (i) {
    var e = this;
    e.$slider.trigger("unslick", [e, i]), e.destroy();
  }, e.prototype.updateArrows = function () {
    var i = this;
    Math.floor(i.options.slidesToShow / 2), !0 === i.options.arrows && i.slideCount > i.options.slidesToShow && !i.options.infinite && (i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"), 0 === i.currentSlide ? (i.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - i.options.slidesToShow && !1 === i.options.centerMode ? (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : i.currentSlide >= i.slideCount - 1 && !0 === i.options.centerMode && (i.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"), i.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")));
  }, e.prototype.updateDots = function () {
    var i = this;
    null !== i.$dots && (i.$dots.find("li").removeClass("slick-active").end(), i.$dots.find("li").eq(Math.floor(i.currentSlide / i.options.slidesToScroll)).addClass("slick-active"));
  }, e.prototype.visibility = function () {
    var i = this;
    i.options.autoplay && (document[i.hidden] ? i.interrupted = !0 : i.interrupted = !1);
  }, i.fn.slick = function () {
    var i,
        t,
        o = this,
        s = arguments[0],
        n = Array.prototype.slice.call(arguments, 1),
        r = o.length;

    for (i = 0; i < r; i++) {
      if ("object" == _typeof(s) || void 0 === s ? o[i].slick = new e(o[i], s) : t = o[i].slick[s].apply(o[i].slick, n), void 0 !== t) return t;
    }

    return o;
  };
});
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var images = _toConsumableArray(document.querySelectorAll('.lazyload'));

var fadeBlocks = _toConsumableArray(document.querySelectorAll('.js-fade'));

var IntersectionObserverOptions = {
  root: document.querySelector('body')[0] // threshold: 0.5,

};

var IntersectionObserverImageCallback = function IntersectionObserverImageCallback(entries) {
  entries.forEach(function (item) {
    var entry = item;

    if (entry && entry.isIntersecting) {
      var image = entry.target;

      image.onload = function () {
        return imageOnLoad(image);
      };

      if (image.classList.contains('lazyload-inline-bg')) {
        image.style.backgroundImage = 'url(' + image.getAttribute('data-src') + ')';
        setTimeout(function () {
          image.classList.remove('lazyload', 'js-fade', 'js-fade_animate');
        }, 300);
      } else if (image.getAttribute('srcset')) {
        image.srcset = image.getAttribute('data-src');
      } else {
        image.src = image.getAttribute('data-src');
      }
    }
  });
};

var imageObserver = new IntersectionObserver(IntersectionObserverImageCallback, IntersectionObserverOptions);
images.forEach(function (item) {
  imageObserver.observe(item);
});

var IntersectionObserverBlockCallback = function IntersectionObserverBlockCallback(entries) {
  entries.forEach(function (item) {
    var entry = item;

    if (entry && entry.isIntersecting) {
      var fadeBlock = entry.target;
      showWithFade(fadeBlock);
    }
  });
};

var blockObserver = new IntersectionObserver(IntersectionObserverBlockCallback, IntersectionObserverOptions);
fadeBlocks.forEach(function (item) {
  blockObserver.observe(item);
});

function imageOnLoad(image) {
  showWithFade(image);
  imageObserver.unobserve(image);
}

function showWithFade(item) {
  item.classList.add('js-fade_animate');
  setTimeout(function () {
    item.classList.remove('lazyload', 'js-fade', 'js-fade_animate');
  }, 300);
}
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ResizeObserver =
/*#__PURE__*/
function () {
  function ResizeObserver(callback) {
    _classCallCheck(this, ResizeObserver);

    this.observables = []; // Array of observed elements that looks like this:
    // [{
    //   el: domNode,
    //   size: {height: x, width: y}
    // }]

    this.boundCheck = this.check.bind(this);
    this.boundCheck();
    this.callback = callback;
  }

  _createClass(ResizeObserver, [{
    key: "observe",
    value: function observe(el) {
      if (this.observables.some(function (observable) {
        return observable.el === el;
      })) {
        return;
      }

      var newObservable = {
        el: el,
        size: {
          height: el.clientHeight,
          width: el.clientWidth
        }
      };
      this.observables.push(newObservable);
    }
  }, {
    key: "unobserve",
    value: function unobserve(el) {
      this.observables = this.observables.filter(function (obj) {
        return obj.el !== el;
      });
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.observables = [];
    }
  }, {
    key: "check",
    value: function check() {
      var changedEntries = this.observables.filter(function (obj) {
        var currentHeight = obj.el.clientHeight;
        var currentWidth = obj.el.clientWidth;

        if (obj.size.height !== currentHeight || obj.size.width !== currentWidth) {
          obj.size.height = currentHeight;
          obj.size.width = currentWidth;
          return true;
        }
      }).map(function (obj) {
        return obj.el;
      });

      if (changedEntries.length > 0) {
        this.callback(changedEntries);
      }

      window.requestAnimationFrame(this.boundCheck);
    }
  }]);

  return ResizeObserver;
}();

var lazyImageOuter = document.querySelectorAll('.lazy-image-outer');

function setProportionalSize(item) {
  var itemWidth = item.offsetWidth;
  var itemMaxWidth = item.dataset.width;
  var itemMaxHeight = item.dataset.height;

  if (itemWidth > itemMaxWidth) {
    item.style.maxWidth = itemMaxWidth + 'px';
    item.style.height = itemMaxHeight + 'px';
  } else {
    item.style.height = itemWidth * itemMaxHeight / itemMaxWidth + 'px';
  }
}

var resizeObserver = new ResizeObserver(function (entries) {
  entries.forEach(function (item) {
    setProportionalSize(item);
  });
});
lazyImageOuter.forEach(function (item) {
  setProportionalSize(item);
  resizeObserver.observe(item);
});
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var accordionBtns = _toConsumableArray(document.querySelectorAll('.js-accordion-btn'));

if (accordionBtns.length) {
  accordionBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var currentAccordion = btn.closest('.js-accordion');
      var activeAccordionBtn = currentAccordion.querySelector('.js-accordion-btn.active');
      var activeAccordionContent = currentAccordion.querySelector('.js-accordion-content.active');
      var currentAccordionContent = btn.nextElementSibling;

      if (currentAccordionContent.classList.contains('active')) {
        btn.classList.remove('active');
        currentAccordionContent.classList.remove('active');
      } else {
        activeAccordionContent && activeAccordionContent.classList.remove('active');
        currentAccordionContent.classList.add('active');
        activeAccordionBtn && activeAccordionBtn.classList.remove('active');
        btn.classList.add('active');
      }
    });
  });
}
"use strict";

function ajaxInstantSearch(q) {
  var csrfmiddlewaretoken = getCookie('csrftoken'),
      dataToSend;
  dataToSend = 'q=' + q + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken; // console.log(dataToSend);

  $.ajax({
    data: dataToSend,
    url: '/api/site/instant-search/',
    method: 'POST',
    success: function success(response) {
      var responseObj = JSON.parse(response); // console.log(responseObj);

      if (responseObj.status == true) {
        showSearchResult(responseObj.templates.search_result);
        setSearchQueryInURL(q);
      } else {
        removeSearchResult();
        if (responseObj.message) showNotification(responseObj.message, 'error');
      }
    }
  });
}

function ajaxSubscribe(jqForm) {
  var csrfmiddlewaretoken = getCookie('csrftoken'),
      dataToSend;
  trimFormFields(jqForm);
  dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken; // console.log(dataToSend);

  $.ajax({
    data: dataToSend,
    url: '/api/mailing/subscribe/',
    method: 'POST',
    success: function success(response) {
      // console.log(response);
      if (response.status == true) {
        updateSubscribeWidget();
        if (response.message) showNotification(response.message, 'success');
      } else {
        if (response.message) showNotification(response.message, 'error');
      }
    },
    complete: function complete() {
      hideBtnPreloader();
    }
  });
}

var uploadFileAjaxObj = {};

function ajaxUploadFile(file, attachmentItem) {
  var csrfmiddlewaretoken = getCookie('csrftoken'),
      formData = new FormData();
  formData.append('file', file);
  formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken); // console.log(data);

  uploadFileAjaxObj[file.name] = $.ajax({
    data: formData,
    url: '/api/site/upload-file/',
    method: 'POST',
    cache: false,
    processData: false,
    contentType: false,
    xhr: function xhr() {
      var xhr = new window.XMLHttpRequest(),
          progressBar = attachmentItem.find('.attachment-item__progress');
      xhr.upload.addEventListener("progress", function (event) {
        if (event.lengthComputable) {
          var percentComplete = event.loaded / event.total;
          percentComplete = (percentComplete * 100).toFixed();
          progressBar.text(percentComplete + '%');
        }
      }, false);
      return xhr;
    },
    success: function success(response) {
      // console.log(response);
      if (response.status == true) {
        attachmentItem.find('.js-abort-attachment-uploading').addClass('js-attachment-delete');
        attachmentItem.find('.js-abort-attachment-uploading').removeClass('js-abort-attachment-uploading');
        attachmentItem.data('id', response.data.file_id);
        attachmentItem.find('.attachment-item__progress').remove();
        filesIdToSend.push(response.data.file_id);
        if (response.message) showNotification(response.message, 'success');
      } else {
        if (response.message) showNotification(response.message, 'error');
      }
    },
    complete: function complete() {
      hideBtnPreloader();
    }
  });
}

var formsAjaxQuery;

function ajaxForms(jqForm) {
  var csrfmiddlewaretoken = getCookie('csrftoken'),
      dataToSend;
  trimFormFields(jqForm);
  dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;

  if (filesIdToSend.length > 0) {
    filesIdToSend.forEach(function (id) {
      dataToSend = dataToSend + '&attachments=' + id;
    });
  } // console.log(dataToSend);


  formsAjaxQuery = $.ajax({
    data: dataToSend,
    url: '/api/site/feedback/',
    method: 'POST',
    success: function success(response) {
      // console.log(response);
      if (response.status == true) {
        hidePopUps();
        if (response.message) showNotification(response.message, 'success');
      } else {
        if (response.message) showNotification(response.message, 'error');
      }
    },
    complete: function complete() {
      hideBtnPreloader();
    }
  });
}

function ajaxPlaceReview(jqForm) {
  var csrfmiddlewaretoken = getCookie('csrftoken'),
      dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;
  trimFormFields(jqForm); // console.log(dataToSend);

  $.ajax({
    data: dataToSend,
    url: '/api/site/place-review/',
    method: 'POST',
    success: function success(response) {
      // console.log(response);
      if (response.status == true) {
        hidePopUps();
        if (response.message) showNotification(response.message, 'success');
      } else {
        if (response.message) showNotification(response.message, 'error');
      }
    },
    complete: function complete() {
      hideBtnPreloader();
    }
  });
}

function ajaxBugreport(jqForm) {
  var csrfmiddlewaretoken = getCookie('csrftoken'),
      dataToSend = jqForm.serialize() + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken;
  trimFormFields(jqForm); // console.log(dataToSend);

  $.ajax({
    data: dataToSend,
    url: '/api/site/bugreport/',
    method: 'POST',
    success: function success(response) {
      // console.log(response);
      if (response.status == true) {
        hidePopUps();
        if (response.message) showNotification(response.message, 'success');
      } else {
        if (response.message) showNotification(response.message, 'error');
      }
    },
    complete: function complete() {
      hideBtnPreloader();
    }
  });
}

function ajaxInfinityLoader(url, templateName, page) {
  var csrfmiddlewaretoken = getCookie('csrftoken'),
      dataToSend;
  dataToSend = 'page=' + page + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken; // console.log(dataToSend);

  $.ajax({
    data: dataToSend,
    url: '/api/site/' + url + '/',
    method: 'POST',
    success: function success(response) {
      var responseObj = JSON.parse(response); // console.log(responseObj);

      clearInterval(preloaderId);

      if (responseObj.status == true) {
        if (responseObj.data.last) {
          $('.btn_more').addClass('hidden');
        }

        if (url === 'news') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.news);
        } else if (url === 'announcements') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.announcements);
        } else if (url === 'future-announcements') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.announcements);
        } else if (url === 'reports') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.reports);
        } else if (url === 'history') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.articles);
        } else if (url === 'places') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.places);
        } else if (url === 'persons') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.articles);
        } else if (url === 'reviews') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.reviews);
        } else if (url === 'special-projects') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.specialProjects);
        } else if (url === 'search-result') {
          $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.search_result);
        }

        var images = $('.lazyload');
        images.each(function (i, image) {
          imageObserver.observe(image);
        });
      } else {
        if (responseObj.message) showNotification(responseObj.message, 'error');
      }
    },
    complete: function complete() {
      hideBtnPreloader();
    }
  });
}

function ajaxSearchResultInfinityLoader(page, q, section) {
  var csrfmiddlewaretoken = getCookie('csrftoken'),
      dataToSend;
  dataToSend = 'page=' + page + '&q=' + q + '&section=' + section + '&csrfmiddlewaretoken=' + csrfmiddlewaretoken; // console.log(dataToSend);

  $.ajax({
    data: dataToSend,
    url: '/api/site/search-result/',
    method: 'POST',
    success: function success(response) {
      var responseObj = JSON.parse(response); // console.log(responseObj);

      clearInterval(preloaderId);

      if (responseObj.status == true) {
        if (responseObj.data.last) {
          $('.btn_more').addClass('hidden');
        }

        $('.js-infinity-loader-wrap .js-infinity-loader-grid').append(responseObj.templates.search_result);
      } else {
        if (responseObj.message) showNotification(responseObj.message, 'error');
      }
    },
    complete: function complete() {
      hideBtnPreloader();
    }
  });
}

$('body').on('click', '.js-btn_more', function () {
  var pageCount = $(this).data('page-count'),
      url,
      templateName;
  $(this).blur().addClass('btn_preloader');

  if ($(this).hasClass('js-more-search-result')) {
    var section = $('.search-result-page__btn.active').data('section'),
        q = $('.search-form .search-form__input').val();
    ajaxSearchResultInfinityLoader(pageCount, q, section);
  } else {
    if ($(this).hasClass('js-more-future-events')) {
      url = 'future-announcements';
      templateName = 'announcements';
    } else if ($(this).hasClass('js-more-past-events')) {
      url = 'announcements';
      templateName = 'announcements';
    } else if ($(this).hasClass('js-more-reportage')) {
      url = 'reports';
      templateName = 'reports';
    } else if ($(this).hasClass('js-more-history')) {
      url = 'history';
      templateName = 'articles';
    } else if ($(this).hasClass('js-more-places')) {
      url = 'places';
      templateName = 'places';
    } else if ($(this).hasClass('js-more-people')) {
      url = 'persons';
      templateName = 'articles';
    } else if ($(this).hasClass('js-more-special-projects')) {
      url = 'special-projects';
      templateName = 'special-projects';
    } else if ($(this).hasClass('js-more-news')) {
      url = 'news';
      templateName = 'news';
    } else if ($(this).hasClass('js-more-reviews')) {
      url = 'reviews';
      templateName = 'reviews';
    }

    ajaxInfinityLoader(url, templateName, pageCount);
  }

  pageCount++;
  $(this).data('page-count', pageCount);
});
$('.js-pop-up__form').submit(function (event) {
  event.preventDefault();
  var requestToDo = $(this).find('.pop-up-form__submit').data('request');
  validateFormFields($(this));

  if (validateStatus) {
    $(this).find('.pop-up-form__submit').blur().addClass('btn_preloader');

    if (requestToDo == 'to-editor') {
      ajaxForms($(this));
      return false;
    } else if (requestToDo == 'place-review') {
      ajaxPlaceReview($(this));
      return false;
    } else if (requestToDo == 'bugreport') {
      ajaxBugreport($(this));
      return false;
    }
  } else {
    showNotification('Одно или несколько полей формы содержат ошибки', 'error');
    return false;
  }
});
"use strict";

// Возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
} // Устанавливает cookie с именем name, значением value и доп. настройками в объекте options = { expires, path, domain, secure, encode} expires — количество дней


function setCookie(name, value, options) {
  options = options || {};
  var expires = options.expires,
      encode = options.encode;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 24 * 60 * 60 * 1000);
    expires = options.expires = d;
  }

  if (expires && expires.toUTCString) options.expires = expires.toUTCString();
  if (encode) value = encodeURIComponent(value);
  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];

    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
} // Удаляет cookie


function deleteCookie(name, options) {
  var options = options;
  options.expires = -1;
  setCookie(name, "", options);
}
"use strict";

var dropArea = document.getElementsByClassName('js-drop-area');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
  for (var i = 0; i < dropArea.length; i++) {
    dropArea[i].addEventListener(eventName, preventDefaults, false);
  }
});

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

;
['dragenter', 'dragover'].forEach(function (eventName) {
  for (var i = 0; i < dropArea.length; i++) {
    dropArea[i].addEventListener(eventName, function () {
      highlight(this);
    }, false);
  }
});
['dragleave', 'drop'].forEach(function (eventName) {
  for (var i = 0; i < dropArea.length; i++) {
    dropArea[i].addEventListener(eventName, function () {
      unhighlight(this);
    }, false);
  }
});

function highlight(currentDrop) {
  if (!currentDrop.classList.contains('disabledDrag')) {
    currentDrop.classList.add('highlight');
  }
}

function unhighlight(currentDrop) {
  currentDrop.classList.remove('highlight');
}

for (var i = 0; i < dropArea.length; i++) {
  dropArea[i].addEventListener('drop', handleDrop, false);
}

function handleDrop(event) {
  var dt = event.dataTransfer,
      files = dt.files;
  var filesList = $(event.target).parents('.pop-up-form-content').find('.attachment-list');
  handleFiles(files, filesList);
}
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

$('.js-dropdown-section_show').click(function () {
  var currentDropdownBlock = $(this).parents('.dropdown-section'),
      currentDropdownBlockContent = currentDropdownBlock.find('.sp-dropdown-section__dropdown-content');
  currentDropdownBlockContent.removeClass('hidden');
  $(this).addClass('hidden');
});
$('.js-dropdown-section_hide').click(function () {
  var currentDropdownBlock = $(this).parents('.dropdown-section'),
      currentDropdownBlockShowBtn = currentDropdownBlock.find('.js-dropdown-section_show'),
      currentDropdownBlockContent = currentDropdownBlock.find('.sp-dropdown-section__dropdown-content');
  currentDropdownBlockContent.addClass('hidden');
  currentDropdownBlockShowBtn.removeClass('hidden');
});

var dropdownBtns = _toConsumableArray(document.querySelectorAll('.js-dropdown-btn'));

if (dropdownBtns.length) {
  dropdownBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dropdownBlock = btn.parentNode;
      var dropdownContent = dropdownBlock.querySelector('.js-dropdown-content');
      dropdownContent.classList.toggle('visible');
    });
  });
}
"use strict";

$('.attachment-input').on('click', function () {
  $('.attachment-input').val('');
});
$('.attachment-input').change(function () {
  var filesArr = this.files,
      filesList = $(this).parents('.attachment').find('.attachment-list');
  handleFiles(filesArr, filesList);
});
var filesIdToSend = [];
$('body').on('click', '.js-attachment-delete', function () {
  var attachmentItem = $(this).parents('.attachment-item'),
      attachmentItemList = attachmentItem.parents('.attachment-list'),
      attachmentItemId = attachmentItem.data('id');
  attachmentItem.remove();
  filesIdToSend.remove(attachmentItemId);
  checkfilesListLength(attachmentItemList);
});
$('body').on('click', '.js-abort-attachment-uploading', function () {
  var attachmentItem = $(this).parents('.attachment-item'),
      attachmentItemFileName = attachmentItem.find('.attachment-item__name').text(),
      attachmentItemList = attachmentItem.parents('.attachment-list');
  abortFileUploading(attachmentItemFileName);
  attachmentItem.remove();
  checkfilesListLength(attachmentItemList);
});

function handleFiles(files, filesList) {
  var attachmentItemTemplate = $('.attachment-item_template').clone().removeClass('attachment-item_template hidden'),
      filesListLengthBefore = filesList.find('.attachment-item').length;

  if (files.length < 6 - filesListLengthBefore) {
    for (var i = 0; i < files.length; i++) {
      var currentFile = files[i];

      if (currentFile.size > 2097152) {
        showNotification('Файл ' + currentFile.name + ' больше 2 МБ', 'error');
        return false;
      } else {
        var currentAttachment = attachmentItemTemplate.clone();
        currentAttachment.find('.attachment-item__name').text(currentFile.name);
        currentAttachment.appendTo(filesList);
        ajaxUploadFile(files[i], currentAttachment);
      }
    }
  } else {
    showNotification('Можно загрузить не более ' + (5 - filesListLengthBefore) + ' файлов по 2 МБ', 'error');
    return false;
  }

  checkfilesListLength(filesList);
}

function abortFileUploading(fileName) {
  uploadFileAjaxObj[fileName].abort();
  delete uploadFileAjaxObj[fileName];
}

function abortAllFileUploading() {
  for (key in uploadFileAjaxObj) {
    uploadFileAjaxObj[key].abort();
    delete uploadFileAjaxObj[key];
  }
}

function clearFileInput() {
  $('.attachment-input').val('');
  $('.attachment-list').empty();
}

function checkfilesListLength(filesList) {
  var filesListLength = filesList.find('.attachment-item').length;

  if (filesListLength === 5) {
    filesList.siblings('.attachment-btn').find('.attachment-label').addClass('disabled');
    filesList.parents('.js-drop-area').addClass('disabledDrag');
  } else {
    filesList.siblings('.attachment-btn').find('.attachment-label').removeClass('disabled');
    filesList.parents('.js-drop-area').removeClass('disabledDrag');
  }
}
"use strict";

$('body').on('input', 'input, textarea', function () {
  if ($(this).hasClass('has-error')) {
    var form = $(this).parents('form');
    checkFormField($(this));
    if ($(this).attr('type') == 'password') isPasswordsEqual(form, true);
    if (!$(this).hasClass('has-error')) hideErrorMessage($(this));
  }
});
$('body').on('focus', 'input.has-error, textarea.has-error', function () {
  showErrorMessage($(this));
});
$('body').on('blur', 'input, textarea', function () {
  $(this).addClass('blured');
  checkFormField($(this));
  hideErrorMessage($(this));
}); // Проверяет отдельное поле формы

function checkFormField(jqField, onlyCheck) {
  var onlyCheck = onlyCheck ? onlyCheck : false,
      tagName = jqField.prop('tagName'),
      inputType = tagName == 'INPUT' ? jqField.attr('type') : undefined,
      name = jqField.attr('name'),
      val = jqField.val(),
      regExp = new RegExp(),
      errorMessage = false;

  if (!jqField.hasClass('disabled')) {
    if (tagName == 'INPUT') {
      if (inputType == 'text') {
        if (~name.indexOf('name')) {
          if (jqField.hasClass('required-input')) regExp = /^[-–—а-яё\s]+$/i;else regExp = /(^[-–—а-яё\s]*$)|(^$)/i;
          errorMessage = 'Можно использовать только буквы русского алфавита или дефис';
        }

        if (~name.indexOf('email')) {
          if (jqField.hasClass('required-input')) regExp = /^[-0-9a-zа-яё_\.]+@[-0-9a-zа-яё_\.]+\.[a-zа-яё]{2,6}$/i;else regExp = /(^[-0-9a-zа-яё_\.]+@[-0-9a-zа-яё_\.]+\.[a-zа-яё]{2,6}$)|(^$)/i;
          errorMessage = 'Email указан неверно';
        }
      } else if (inputType == 'email') {
        if (~name.indexOf('email')) {
          if (jqField.hasClass('required-input')) regExp = /^[-0-9a-zа-яё_\.]+@[-0-9a-zа-яё_\.]+\.[a-zа-яё]{2,6}$/i;else regExp = /(^[-0-9a-zа-яё_\.]+@[-0-9a-zа-яё_\.]+\.[a-zа-яё]{2,6}$)|(^$)/i;
          errorMessage = 'Email указан неверно';
        }
      } else if (inputType == 'tel') {
        if (~name.indexOf('phone')) {
          if (jqField.hasClass('required-input')) regExp = /^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/;else regExp = /(^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$)|(^\+7\s$)|(^$)/;
          errorMessage = 'Номер телефона должен быть в федеральном формате (10 цифр)';
        }
      } else if (inputType == 'checkbox' && jqField.hasClass('required-input') && !jqField.prop('checked')) {
        $('label[for="' + jqField.attr('id') + '"]').addClass('has-error');
        return false;
      }
    } else if (tagName == 'TEXTAREA') {
      if (jqField.hasClass('required-input')) regExp = /^[\w\W]+$/i;else regExp = /^[\w\W]*$/i;
    }
  }

  if (jqField.hasClass('required-input') && val == '' && !jqField.hasClass('disabled')) {
    errorMessage = 'Это поле необходимо заполнить';
    regExp = /^[-–—а-яё\s]+$/i;
  }

  if (regExp instanceof RegExp) {
    if (!regExp.test(val)) {
      if (!onlyCheck) jqField.addClass('has-error').data('error-message', errorMessage);
      return false;
    } else {
      if (!onlyCheck) jqField.removeClass('has-error').removeAttr('data-error-message');
      return true;
    }
  } else if (regExp instanceof Array) {
    var regExpStatus = true;
    $.each(regExp, function (key, value) {
      if (!value.test(val)) regExpStatus = false;
    });
    if (!regExpStatus) jqField.addClass('has-error').data('error-message', errorMessage);else jqField.removeClass('has-error').removeAttr('data-error-message');
    return regExpStatus;
  }
} // Проверяет значения полей с паролями на соответствие друг другу


function isPasswordsEqual(jqForm, checkOnlyAllBlured) {
  var passwordInputs = jqForm.find('input[type="password"]').filter('input[data-check-password-equal="true"]'),
      passwordValue = passwordInputs.eq(0).val(),
      checkOnlyAllBlured = checkOnlyAllBlured ? checkOnlyAllBlured : false,
      isEqual = true;

  if (passwordInputs.length > 1) {
    passwordInputs.each(function (i) {
      if (checkOnlyAllBlured && !$(this).hasClass('blured')) {
        isEqual = true;
        return false;
      }

      if ($(this).val() != passwordValue) {
        errorMessage = 'Пароли не совпадают';
        isEqual = false;
        return false;
      }
    });
    if (!isEqual) passwordInputs.addClass('has-error').data('error-message', errorMessage);else {
      passwordInputs.each(function () {
        if (checkFormField($(this), true)) $(this).removeClass('has-error').removeAttr('data-error-message');
      });
    }
  }

  return isEqual;
} // Скрывает сообщение об ошибке для поля jqField


function hideErrorMessage(jqField) {
  jqField.parents('.input-wrap').find('.hint').remove();
} // Показывает сообщение об ошибке для поля jqField


function showErrorMessage(jqField) {
  var parentInputWrap = jqField.parents('.input-wrap'),
      errorMessage = jqField.data('error-message'),
      hint = $('<div/>', {
    "class": 'hint hint_error hint_visible'
  }),
      hintText = $('<div/>', {
    "class": 'hint__text'
  });

  if (errorMessage) {
    parentInputWrap.find('.hint').remove();
    parentInputWrap.append(hint);
    parentInputWrap.find('.hint').append(hintText);
    parentInputWrap.find('.hint__text').html(errorMessage);
  }
} // Проверяет все поля формы на валидность


var validateStatus;

function validateFormFields(jqForm) {
  validateStatus = true;
  jqForm.find('input, textarea').not('[type="hidden"]').not('[type="submit"]').not('.disabled').each(function () {
    var fieldValidateStatus = checkFormField($(this));
    if (!fieldValidateStatus) validateStatus = fieldValidateStatus;
  });
  if (!isPasswordsEqual(jqForm)) validateStatus = false;
  return validateStatus;
}
"use strict";

// TRIM для всех полей формы
function trimFormFields(jqForm) {
  jqForm.find('input, textarea').not(':file').each(function () {
    $(this).val($.trim($(this).val()));
  });
}

$('body').keydown(function (event) {
  if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
    var currentURL = window.location,
        selection = getSelectionText();
    showPopUp('bugreport');
    $('input[name="url"]').val(currentURL);
    $('.js-error-selection-textarea').val(selection);
    $('input, textarea').addClass('fill');
    resizeTextarea($('.bugreport').find('.variable-height-textarea'), 27, 120);
  }
});

function getSelectionText() {
  return window.getSelection().toString();
}

$('body').on('change', 'input, textarea, .select__value', function () {
  if ($(this).val() === '' || $(this).val() == '+7 ') {
    $(this).removeClass('fill');
  } else {
    $(this).addClass('fill');
  }
});
$('.variable-height-textarea').on('keyup', function () {
  resizeTextarea($(this), 27, 120);
});
$('body').on('paste cut', '.variable-height-textarea', function () {
  var $this = $(this);
  setTimeout(function () {
    resizeTextarea($this, 27, 120);
  }, 0);
});

function resizeTextarea(visibleTextarea, minHeight, maxHeight) {
  if (visibleTextarea.length) {
    if (visibleTextarea.val() === '') {
      visibleTextarea.height(minHeight + 'px');
    } else {
      var variableTextareaWrap = visibleTextarea.parent('.variable-height-textarea-wrap'),
          hiddenTextarea = variableTextareaWrap.find('.variable-height-textarea_hidden'),
          text = '';
      visibleTextarea.val().replace(/[<>]/g, '_').split('\n').forEach(function (s) {
        text = text + '<div>' + s.replace(/\s\s/g, ' &nbsp;') + '&nbsp;</div>' + '\n';
      });
      hiddenTextarea.html(text);
      var hiddenTextareaHeight = hiddenTextarea.height();
      hiddenTextareaHeight = Math.max(minHeight, hiddenTextareaHeight);
      hiddenTextareaHeight = Math.min(maxHeight, hiddenTextareaHeight);
      visibleTextarea.height(hiddenTextareaHeight + 'px');
    }
  }
}

Array.prototype.remove = function (value) {
  var idx = this.indexOf(value);

  if (idx != -1) {
    return this.splice(idx, 1);
  }

  return false;
};

(function () {
  var throttle = function throttle(type, name, obj) {
    obj = obj || window;
    var running = false;

    var func = function func() {
      if (running) {
        return;
      }

      running = true;
      requestAnimationFrame(function () {
        obj.dispatchEvent(new CustomEvent(name));
        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  throttle('resize', 'optimizedResize');
})();
"use strict";

$(function () {
  if ($('.map').length <= 0) {
    return;
  } else {
    var initMap = function initMap() {
      if (document.querySelector('#sp-children-section_1__map')) {
        map1 = new ymaps.Map("sp-children-section_1__map", {
          center: [50.231025, 136.886119],
          zoom: 14,
          controls: ['zoomControl']
        });
        map1.behaviors.disable('scrollZoom');
        var map1Places = [{
          coords: [50.218630, 136.906322],
          title: 'МБДОУ Детский сад комбинированного вида № 9',
          address: '682640, Хабаровский край, г. Амурск, пр. Мира, 22 б',
          phone: '99-6-91',
          site: 'amurskdetsad9.ucoz.ru',
          mail: 'det_sad_9@mail.ru'
        }, {
          coords: [50.225638, 136.905845],
          title: 'МБДОУ Детский сад комбинированного вида № 14',
          address: '682640, Хабаровский край, г. Амурск, пр. Комсомольский, 13а',
          phone: '99-6-78',
          site: 'mdou14amursk.ucoz.ru',
          mail: 'mdoy_14@mail.ru'
        }, {
          coords: [50.215760, 136.894347],
          title: 'МБДОУ Детский сад комбинированного вида № 15',
          address: '682640, Хабаровский край, г. Амурск, ул. Пионерская, 8а',
          phone: '99-6-81',
          site: 'duimovochka-27.ucoz.ru',
          mail: 'mdoudskv15@mail.ru'
        }, {
          coords: [50.232283, 136.910274],
          title: 'МБДОУ Детский сад комбинированного вида № 17',
          address: '682640, Хабаровский край, г. Амурск, пр. Строителей, 18а',
          phone: '99-8-79',
          site: 'amurskdetsad17.ucoz.ru',
          mail: 'sad-17@mail.ru'
        }, {
          coords: [50.240303, 136.908504],
          title: 'МБДОУ Детский сад комбинированного вида № 21',
          address: '682640, Хабаровский край,г. Амурск, пр. Октябрьский, 16 а',
          phone: '99-7-24',
          site: 'amurskdou21.ucoz.ru',
          mail: 'dou_21@list.ru'
        }, {
          coords: [50.239490, 136.908972],
          title: 'МБДОУ Детский сад комбинированного вида № 48',
          address: '682640, Хабаровский край, г. Амурск, пр. Строителей, 40',
          phone: '99-6-48',
          site: 'amurskdetsad48.ucoz.ru',
          mail: 'sad.48@mail.ru'
        }, {
          coords: [50.232346, 136.905136],
          title: 'МБДОУ Детский сад комбинированного вида № 49',
          address: '682640, Хабаровский край, г. Амурск, пр. Строителей, 29 а',
          phone: '2-62-36',
          site: 'amurskdetsad49.ucoz.ru',
          mail: 'mdoy49amursk@mail.ru'
        }];
        var map1point = new ymaps.GeoObjectCollection({
          preset: 'islands#icon',
          iconColor: '#0073FF'
        });
        var map1pointPlacemarks = [];

        for (var i = 0; i < map1Places.length; i++) {
          var balloonContent = "<div class='balloon'><div class='balloon__title'>" + map1Places[i].title + "</div><table class='sp-place__contacts-table balloon__content'><tbody><tr><td><span class='icon-geo-stroke'></span>Адрес:</td><td>" + map1Places[i].address + "</td></tr><tr><td><span class='icon-phone'></span>Телефон:</td><td>" + map1Places[i].phone + "</td></tr>";

          if (map1Places[i].site) {
            balloonContent += "<tr><td><span class='icon-web'></span>Сайт:</td><td><a href='http://unaturalist.ucoz.com' target='_blank'>" + map1Places[i].site + "</a></td></tr>";
          }

          if (map1Places[i].mail) {
            balloonContent += "<tr><td><span class='icon-mail'></span>Почта:</td><td><a href='mailto:naturalist27@yandex.ru' target='_blank'>" + map1Places[i].mail + "</a></td></tr>";
          }

          balloonContent += "</tbody></table></div>";
          map1pointPlacemarks.push(new ymaps.Placemark(map1Places[i].coords, {
            balloonContent: balloonContent
          }));
          map1point.add(map1pointPlacemarks[i]);
        }

        map1.geoObjects.add(map1point);
      }

      if (document.querySelector('#sp-children-section_2__map')) {
        map2 = new ymaps.Map("sp-children-section_2__map", {
          center: [50.231025, 136.886119],
          zoom: 14,
          controls: ['zoomControl']
        });
        map2.behaviors.disable('scrollZoom');
        var map2Places = [{
          coords: [50.217074, 136.895659],
          title: 'МОУ СОШ № 2',
          address: 'г. Амурск, Школьная улица, 9',
          phone: '2-83-58',
          site: 'school2-amursk.ucoz.ru',
          mail: ''
        }, {
          coords: [50.230421, 136.908504],
          title: 'МОУ СОШ № 3',
          address: 'Хабаровский край, Амурский р-н, Эльбан пос., 1 мкр., 27',
          phone: '4-20-82',
          site: 'elban3s.edusite.ru',
          mail: 'elbans32006@rambler.ru'
        }, {
          coords: [50.225782, 136.904049],
          title: 'МОУ СОШ № 5',
          address: 'Хабаровский край, г. Амурск, Комсомольский просп., 7а',
          phone: '2-48-27',
          site: 'shcola5amursk.ucoz.ru',
          mail: 'amurskshkola5@rambler.ru'
        }, {
          coords: [50.236604, 136.908585],
          title: 'МБОУ СОШ № 6',
          address: 'г. Амурск, Октябрьский проспект, 2А',
          phone: '2-64-86',
          site: 'shcola6amursk.ucoz.ru',
          mail: 'shcola6amursk@rambler.ru'
        }, {
          coords: [50.242141, 136.909034],
          title: 'МОУ НОШ № 7',
          address: 'г. Амурск, Октябрьский проспект, 15',
          phone: '2-76-96',
          site: 'school7-amursk.ucoz.ru',
          mail: ''
        }, {
          coords: [50.246789, 136.920272],
          title: 'МОУ СОШ № 9',
          address: 'г. Амурск, Комсомольский проспект, 81А',
          phone: '3-28-99',
          site: 'amk-scool9.ucoz.ru',
          mail: 'scool9amk@mail.ru'
        }, {
          coords: [50.232115, 136.907804],
          title: 'Специальная коррекционная общеобразовательная школа-интернат VIII вида № 14',
          address: 'г. Амурск, просп. Строителей, 16',
          phone: '2-45-80',
          site: 'internat14.ru',
          mail: 'internat14@edu.27.ru'
        }];
        var map2point = new ymaps.GeoObjectCollection({
          preset: 'islands#icon',
          iconColor: '#0073FF'
        });
        var map2pointPlacemarks = [];

        for (var i = 0; i < map2Places.length; i++) {
          var balloonContent = "<div class='balloon'><div class='balloon__title'>" + map2Places[i].title + "</div><table class='sp-place__contacts-table balloon__content'><tbody><tr><td><span class='icon-geo-stroke'></span>Адрес:</td><td>" + map2Places[i].address + "</td></tr><tr><td><span class='icon-phone'></span>Телефон:</td><td>" + map2Places[i].phone + "</td></tr>";

          if (map2Places[i].site) {
            balloonContent += "<tr><td><span class='icon-web'></span>Сайт:</td><td><a href='http://unaturalist.ucoz.com' target='_blank'>" + map2Places[i].site + "</a></td></tr>";
          }

          if (map2Places[i].mail) {
            balloonContent += "<tr><td><span class='icon-mail'></span>Почта:</td><td><a href='mailto:naturalist27@yandex.ru' target='_blank'>" + map2Places[i].mail + "</a></td></tr>";
          }

          balloonContent += "</tbody></table></div>";
          map2pointPlacemarks.push(new ymaps.Placemark(map2Places[i].coords, {
            balloonContent: balloonContent
          }));
          map2point.add(map2pointPlacemarks[i]);
        }

        map2.geoObjects.add(map2point);
      }

      if (document.querySelector('#sp-children-section_3__map')) {
        map3 = new ymaps.Map("sp-children-section_3__map", {
          center: [50.231025, 136.886119],
          zoom: 14,
          controls: ['zoomControl']
        });
        map3.behaviors.disable('scrollZoom');
        var map3Places = [{
          coords: [50.216722, 136.902162],
          title: 'Детский оздоровительно-образовательный центр «Юность»',
          address: 'г. Амурск, ул. Лесная, 4а',
          phone: '22-49-79',
          site: 'un-amk.edu.27.ru',
          mail: 'unross@yandex.ru un_amk@edu.27.ru'
        }, {
          coords: [50.216722, 136.902162],
          title: 'Детско-юношеская спортивная школа',
          address: 'г. Амурск, ул. Лесная, 4а',
          phone: '22-49-79',
          site: 'sportschool-amursk.ru',
          mail: 'sportshkola_2@mail.ru'
        }, {
          coords: [50.244854, 136.918943],
          title: 'Клуб «Киокушин»',
          address: 'г. Амурск, Комсомолький пр-т, д. 77',
          phone: '+7 924 224-06-35',
          site: 'kyokushinkai-karate.ru',
          mail: ''
        }, {
          coords: [50.244992, 136.920668],
          title: 'Детская художественная школа',
          address: 'г. Амурск, Комсомольский пр-т, 67',
          phone: '+ 7 (4214) 29-96-32',
          site: 'art-amursk.ru',
          mail: 'artshkola@bk.ru'
        }, {
          coords: [50.218048, 136.906393],
          title: 'Детская школа искусств',
          address: 'г. Амурск, пр. Мира, 22а',
          phone: '+ 7 (4214) 29-95-76',
          site: 'dshi.ucoz.ru'
        }, {
          coords: [50.237543, 136.907058],
          title: 'Детская музыкальная школа',
          address: 'г. Амурск, Октябрьский пр-т, 6',
          phone: '+ 7 (4214) 29-95-81',
          site: 'dmsh-amur.khv.muzkult.ru',
          mail: 'schoolmusic@mail.ru'
        }, {
          coords: [50.227851, 136.911738],
          title: 'Дворец культуры',
          address: 'г. Амурск, Комсомольский пр-т, 48',
          phone: '+7 (4214) 22-67-60',
          site: 'dk-amursk.ru',
          mail: 'amursk-dk@yandex.ru'
        }, {
          coords: [50.230104, 136.909915],
          title: 'Центр творчества «Темп»',
          address: 'г. Амурск, Победы пр-т, 8а',
          phone: '+7 (4214) 22-67-05',
          site: 'cdttemp.ucoz.ru',
          mail: 'mou_temp@mail.ru'
        }, {
          coords: [50.221229, 136.906088],
          title: 'Лингвистическая школа',
          address: 'г. Амурск, Мира пр-т, 28а',
          phone: '+7 (4214) 22-42-18',
          site: 'lingschool.ucoz.org',
          mail: 'lingamursk@gmail.com'
        }, {
          coords: [50.222307, 136.907229],
          title: 'Детский эколого-биологический центр «Натуралист»',
          address: 'г. Амурск, Комсомольский пр-т, 2а',
          phone: '+7 (4214) 22-13-14',
          site: 'naturalist.ucoz.com',
          mail: 'naturalist27@yandex.ru'
        }, {
          coords: [50.242141, 136.909034],
          title: 'Центр детского и юношеского туризма и экскурсий',
          address: 'г. Амурск, Октябрьский пр-т, 22,',
          phone: '+7 (4214) 29-96-73',
          site: 'turcentr.ucoz.ru',
          mail: 'detyuntur4673.amursk@yandex.ru'
        }];
        var map3point = new ymaps.GeoObjectCollection({
          preset: 'islands#icon',
          iconColor: '#0073FF'
        });
        var map3pointPlacemarks = [];

        for (var i = 0; i < map3Places.length; i++) {
          var balloonContent = "<div class='balloon'><div class='balloon__title'>" + map3Places[i].title + "</div><table class='sp-place__contacts-table balloon__content'><tbody><tr><td><span class='icon-geo-stroke'></span>Адрес:</td><td>" + map3Places[i].address + "</td></tr><tr><td><span class='icon-phone'></span>Телефон:</td><td>" + map3Places[i].phone + "</td></tr>";

          if (map3Places[i].site) {
            balloonContent += "<tr><td><span class='icon-web'></span>Сайт:</td><td><a href='http://unaturalist.ucoz.com' target='_blank'>" + map3Places[i].site + "</a></td></tr>";
          }

          if (map3Places[i].mail) {
            balloonContent += "<tr><td><span class='icon-mail'></span>Почта:</td><td><a href='mailto:naturalist27@yandex.ru' target='_blank'>" + map3Places[i].mail + "</a></td></tr>";
          }

          balloonContent += "</tbody></table></div>";
          map3pointPlacemarks.push(new ymaps.Placemark(map3Places[i].coords, {
            balloonContent: balloonContent
          }));
          map3point.add(map3pointPlacemarks[i]);
        }

        map3.geoObjects.add(map3point);
      }

      if (document.querySelector('#sp-winter-fun__map')) {
        map4 = new ymaps.Map("sp-winter-fun__map", {
          center: [50.711165, 137.302154],
          zoom: 12,
          controls: []
        });
        map4.margin.addArea({
          top: 0,
          left: 0,
          width: '50%',
          height: '100%'
        });
        map4.controls.add(new ymaps.control.ZoomControl({
          options: {
            position: {
              right: 20,
              bottom: 72
            }
          }
        }));
        map4.behaviors.disable('scrollZoom');
        var map4Places = [{
          coords: [50.711316, 137.302480],
          title: 'Горнолыжный курорт «Альмир»',
          address: 'Добраться до горнолыжного комплекса можно на своей машине или заказать такси из Комсомольска-на-Амуре',
          phone: '8 962 501-40-61',
          site: 'almirdv.ru'
        }, {
          coords: [50.740469, 136.568572],
          title: 'Горнолыжная база «Холдоми»',
          address: 'Попасть к&nbsp;склонам курорта можно на&nbsp;машине, такси или  автобусе &#8470;&nbsp;122 из&nbsp;Комсомольска-на-Амуре. В&nbsp;сезон из  Комсомольска также ходит специальный автобус с  наклейками &laquo;Холдоми&raquo; на&nbsp;бортах (отправляется от&nbsp;площади  Кирова ежедневно в&nbsp;10:00)',
          phone: '8 (4217) 340-700',
          site: 'holdomi.ru'
        }, {
          coords: [50.819126, 136.400138],
          title: 'Туристический комплекс «Амут Сноу Лэйк»',
          address: 'Автобусы до&nbsp;&laquo;Амут Сноу Лэйк&raquo; не&nbsp;ходят, поэтому добраться сюда можно только на&nbsp;машине или заказав трансфер от&nbsp;базы',
          phone: '8&nbsp;914&nbsp;540-77-76 <br>\n' + '8&nbsp;914&nbsp;179-19-46 <br>\n' + '8 (4217) 55-00-20 <br>\n' + '8 (4217) 59-26-83',
          site: 'amutsnowlake.ru'
        }, {
          coords: [50.427673, 136.790306],
          title: 'Ферма "Мишкина берлога"',
          address: 'Добраться до&nbsp;базы можно на&nbsp;машине или такси',
          phone: '8&nbsp;914&nbsp;168-93-70',
          site: 'мишкинаберлога.рф'
        }, {
          coords: [50.729504, 136.625140],
          title: 'Дом отдыха «Пастораль»',
          address: 'Добраться в&nbsp;&laquo;Пастораль&raquo; от&nbsp;Комсомольска-на-Амуре можно на&nbsp;машине. Заехав в&nbsp;поселок Солнечный, на&nbsp;втором большом перекрестке поверните налево. Дальше езжайте прямо по&nbsp;асфальтовой дороге, перед небольшим мостиком поверните направо и&nbsp;следуйте прямо вдоль жилых домов',
          phone: '8&nbsp;963&nbsp;823-70-00 <br>\n' + '8 (4217) 33-70-00',
          site: 'pastoraldv.ru'
        }, {
          coords: [50.563005, 137.042653],
          title: 'Силинский парк',
          address: 'Добраться до&nbsp;&laquo;Силинского парка&raquo; можно на&nbsp;машине&nbsp;&mdash; дорога из&nbsp;Амурска займет чуть больше часа',
          phone: '8 (4217) 51-55-51 <br>\n' + '8&nbsp;914&nbsp;186-29-20 (WhatsApp)',
          site: 'силинка.рф'
        }, {
          coords: [50.716290, 137.321974],
          title: 'Дом отдыха «Шарголь»',
          address: 'Добраться в&nbsp;дом отдыха можно на&nbsp;машине через Комсомольск-на-Амуре. Дорога займет примерно полтора часа',
          phone: '52-61-29',
          site: 'shargol.my1.ru'
        }];
        var map4point = new ymaps.GeoObjectCollection({
          preset: 'islands#icon',
          iconColor: '#0073FF'
        });
        var map4pointPlacemarks = [];

        for (var i = 0; i < map4Places.length; i++) {
          var balloonContent = "<div class='balloon'><div class='balloon__title'>" + map4Places[i].title + "</div><table class='sp-place__contacts-table sp-place__contacts-table_mini balloon__content'><tbody><tr><td><span class='icon-path'></span></td><td>" + map4Places[i].address + "</td></tr><tr><td><span class='icon-phone'></span></td><td>" + map4Places[i].phone + "</td></tr>";

          if (map4Places[i].site) {
            balloonContent += "<tr><td><span class='icon-web'></span></td><td><a href='http://" + map4Places[i].site + "' target='_blank'>" + map4Places[i].site + "</a></td></tr>";
          }

          balloonContent += "</tbody></table></div>";
          map4pointPlacemarks.push(new ymaps.Placemark(map4Places[i].coords, {
            balloonContent: balloonContent
          }));
          map4point.add(map4pointPlacemarks[i]);
        }

        map4.geoObjects.add(map4point);
      }

      $('body').on('click', '.sp-map-points__item-btn', function () {
        var currentMapWrap = $(this).parents('.sp-map-wrap'),
            currentMap = currentMapWrap.find('.sp-map'),
            currentMapId = currentMap.attr('id');
        currentMapWrap.find('.sp-map-points__item-btn').removeClass('active');
        $(this).addClass('active');

        if (currentMapId === 'sp-children-section_1__map') {
          var coord = $(this).data('coord');
          var index = $('.sp-children-section_1__map-wrap').find('.sp-map-points__item-btn').index($(this));
          map1.panTo(coord, {
            flying: 1
          });

          for (var i = 0; i < map1Places.length; i++) {
            if (coord[0] === map1Places[i].coords[0] && coord[1] === map1Places[i].coords[1] && i === index) {
              map1pointPlacemarks[i].balloon.open();
              break;
            }
          }

          map1.container.fitToViewport();
        } else if (currentMapId === 'sp-children-section_2__map') {
          var coord = $(this).data('coord');
          var index = $('.sp-children-section_2__map-wrap').find('.sp-map-points__item-btn').index($(this));
          map2.panTo(coord, {
            flying: 1
          });

          for (var i = 0; i < map2Places.length; i++) {
            if (coord[0] === map2Places[i].coords[0] && coord[1] === map2Places[i].coords[1] && i === index) {
              map2pointPlacemarks[i].balloon.open();
              break;
            }
          }

          map2.container.fitToViewport();
        } else if (currentMapId === 'sp-children-section_3__map') {
          var coord = $(this).data('coord');
          var index = $('.sp-children-section_3__map-wrap').find('.sp-map-points__item-btn').index($(this));
          map3.panTo(coord, {
            flying: 1
          });

          for (var i = 0; i < map3Places.length; i++) {
            if (coord[0] === map3Places[i].coords[0] && coord[1] === map3Places[i].coords[1] && i === index) {
              map3pointPlacemarks[i].balloon.open();
              break;
            }
          }

          map3.container.fitToViewport();
        } else if (currentMapId === 'sp-winter-fun__map') {
          var coord = $(this).data('coord');
          var index = $('.sp-winter-fun__map-wrap').find('.sp-map-points__item-btn').index($(this));
          map4.panTo(coord, {
            flying: 1
          }, {
            useMapMargin: true
          });

          for (var i = 0; i < map4Places.length; i++) {
            if (coord[0] === map4Places[i].coords[0] && coord[1] === map4Places[i].coords[1] && i === index) {
              map4pointPlacemarks[i].balloon.open();
              break;
            }
          }
        }
      });
    };

    var map1, map2, map3, map4;
    ymaps.ready(initMap);
  }
});
"use strict";

// маска телефона
$('input[type=tel]').mask('+7 (000) 000 00 00');
$('input[name=birthday]').mask('99.99.0000');
$('input[name=date]').mask('00.00.0000');
$('input[name=buy_date]').mask('00.00.0000');
$('input[name=card_number]').mask('0000 0000 0000 0000');
$('input[type=tel]').on('keyup', function () {
  var val = $(this).val();
  if (val.length <= 3) $(this).val('+7 ');
});
$('input[type=tel]').on('focus', function () {
  var val = $(this).val();
  if (val.length == 0) $(this).val('+7 ');
});
$('input[type=tel]').on('click', function () {
  var val = $(this).val();
  if (val == '+7 ') $(this)[0].selectionStart = 3;
});
$('input[type=tel]').on('blur', function () {
  var val = $(this).val();
  if (val == '+7 ') $(this).val('');
});
"use strict";

var menuToggler = document.querySelector('.js-mobile-menu-toggler');
var menu = document.querySelector('.js-mobile-menu');

if (menuToggler) {
  menuToggler.addEventListener('click', function () {
    menuToggler.classList.toggle('icon-menu');
    menuToggler.classList.toggle('icon-close');
    menu.classList.toggle('visible');
    document.querySelector('body').classList.toggle('mobile-menu-open');
  });
}

window.addEventListener('optimizedResize', function () {
  if (window.innerWidth > 1024) {
    menuToggler.classList.add('icon-menu');
    menuToggler.classList.remove('icon-close');
    menu.classList.remove('visible');
    document.querySelector('body').classList.remove('mobile-menu-open');
  }
});
var publicationPage = document.querySelector('article.publication .publication__cover');

if (publicationPage) {
  document.querySelector('header').classList.add('no-shadow');
  document.querySelector('main').classList.add('no-offset');
}
"use strict";

$(function () {
  var contentTitles = $('.js-privacy-container').find('[class*="wysiwyg-h"]');
  contentTitles.each(function (index) {
    $(this).attr('id', 'section' + (index + 1));
    var currentItemText = $(this).text().replace(/^\d+[\.\)]/ig, "");
    $('<li/>', {
      "class": 'privacy__list-item',
      append: $('<a/>', {
        "class": 'privacy__link',
        text: currentItemText,
        href: '#section' + (index + 1)
      })
    }).appendTo('.js-privacy-nav');
  });
});
$(document).ready(function () {
  $('a[href*="#"]').on("click", function (e) {
    var anchor = $(this),
        fixedTopOffset = 40;
    $('html, body').stop().animate({
      scrollTop: $(anchor.attr('href')).offset().top - fixedTopOffset
    }, 1000);
    e.preventDefault();
    return false;
  });
});
"use strict";

var notificationHideDelay = 4000,
    notificationTimeout;
$(function () {
  if (notificationCookieDetected()) showNotificationCookie();
});
$('.notification-wrapper').on('mouseenter', function () {
  clearTimeout(notificationTimeout);
});
$('.notification-wrapper').on('mouseleave', function () {
  notificationTimeout = setTimeout(hideNotification, notificationHideDelay / 4);
});
$('body').on('click', '.show-notification', function () {
  showNotification($(this).data('notification-message'), $(this).data('notification-type'));
});
$('body').on('click', '.notification__close', function () {
  hideNotification();
}); // Показывает уведомление

function showNotification(message, type) {
  if (message && type) {
    $('.notification-wrapper .notification__message').html(message);
    $('.notification-wrapper').removeClass('success error notification-wrapper_no-animation').addClass(type).addClass('visible');
    clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(hideNotification, notificationHideDelay);
  }
} // Скрывает уведомление


function hideNotification() {
  $('.notification-wrapper').removeClass('visible');
} // Проверка на существование в куках уведомлений для отображения


function notificationCookieDetected() {
  return getCookie('notificationMessage') && getCookie('notificationType') ? true : false;
} // Записывает в куки сообщение на 10 сек, чтобы показать его после, например, после перезагрузки страницы


function setNotificationCookie(message, type) {
  setCookie('notificationMessage', message, {
    'expires': 10 / (24 * 60 * 60),
    'path': '/',
    'encode': true
  });
  setCookie('notificationType', type, {
    'expires': 10 / (24 * 60 * 60),
    'path': '/'
  });
} // Показывает сообщение из куков


function showNotificationCookie() {
  showNotification(getCookie('notificationMessage'), getCookie('notificationType'));
  deleteCookie('notificationMessage', {
    'path': '/'
  });
  deleteCookie('notificationType', {
    'path': '/'
  });
}
"use strict";

$('.show-pop-up').on('click', function () {
  var popUp = $(this).data('pop-up');
  showPopUp(popUp);
});
$('body').on('click', '.body-cover .back, .js-pop-up__close', function () {
  if (!$(this).hasClass('always-visible')) {
    hidePopUps();
  }
});

function popUpDetected() {
  return $('.body-cover').hasClass('visible') && $('.pop-up-wrapper.visible').length > 0 ? true : false;
}

function showPopUp(popUpName) {
  var popUpOuterWrap = $('.pop-up-wrapper.' + popUpName);
  hidePopUps();
  showBodyCover(popUpOuterWrap);
  popUpOuterWrap.addClass('visible');
  popUpAlwaysVisible();
  $('body').addClass('popup-open');
}

function hidePopUps() {
  $('body').removeClass('popup-open');
  hideBodyCover();
  $('.pop-up-wrapper').removeClass('visible');
  $('.pop-up-wrapper form').find('input, textarea').not('[type="hidden"]').not('[type="checkbox"]').not('[type="radio"]').not('[readonly]').not('.disabled').not('[type="submit"]').val('');
  $('.pop-up-wrapper form').find('[type="checkbox"], [type="radio"]').prop('checked', false);
  $('.pop-up-wrapper form').find('input, textarea, label').removeClass('has-error fill');
  resizeTextarea($('.variable-height-textarea'), 27, 120);
  clearAllSelect();
  clearFileInput();
  filesIdToSend.splice(0, filesIdToSend.length);
  abortAllFileUploading();
  if (formsAjaxQuery) formsAjaxQuery.abort();
}

function showBodyCover(popUpOuterWrap) {
  var cover = popUpOuterWrap.parents('.body-cover').eq(0);
  cover.addClass('visible');
}

function hideBodyCover() {
  var cover = $('.body-cover');
  cover.removeClass('visible');
  cover.find('.pop-up-wrapper').removeClass('visible');
  cover.removeClass('body-cover_img');
}

function popUpAlwaysVisible() {
  var visiblePopUp = $('.pop-up-wrapper.visible');

  if (visiblePopUp.hasClass('success-cart-constructor')) {
    $('.body-cover').addClass('always-visible');
    $('.body-cover .back').addClass('always-visible');
  }
}
"use strict";

var preloaderHideTime = 1000,
    gridPreloaderShowTime = 100,
    selectPreloaderShowTime = 300,
    preloaderId,
    selectPreloaderId;

function showLayoutPreloader() {
  preloaderId = setTimeout(function () {
    $('.products-list').addClass('loading');
    $('.preloader').addClass('visible');
  }, gridPreloaderShowTime);
}

function hideGridPreloader() {
  setTimeout(function () {
    $('.products-list').removeClass('loading');
    $('.preloader').removeClass('visible');
  }, preloaderHideTime);
}

function hideBtnPreloader() {
  setTimeout(function () {
    $('.btn_preloader').removeClass('btn_preloader');
  }, preloaderHideTime);
}
"use strict";

var scrollList = document.querySelectorAll('.js-scroll-to-active');

if (scrollList.length) {
  scrollList.forEach(function (item) {
    var activeEl = item.querySelector('.active');

    if (activeEl) {
      var activeElLeft = activeEl.offsetLeft;
      item.scrollLeft = activeElLeft - 16;
    }
  });
}
"use strict";

function hideSearch() {
  $('.js-close-search').addClass('hidden');
  $('.header__search-btn').removeClass('visually-hidden');
  clearSearch();
  hidePopUps();
}

function clearSearch() {
  $('.search-form__input').val('');
  $('.js-search__clear-btn').addClass('hidden');
  removeSearchResult();
  window.history.pushState(null, null, window.location.origin + window.location.pathname);
}

function removeSearchResult() {
  $('.search__result-block').empty();
}

function showSearchResult(template) {
  removeSearchResult();
  $('.search__result-block').append(template).removeClass('hidden');
}

function setSearchQueryInURL(q) {
  window.history.pushState(null, null, '?q=' + q);
} // переход на страницу результатов поиска


$('.instant-search-form').submit(function (event) {
  event.preventDefault();
  var q = $(this).find('.search-form__input').val();

  if (!$('.search-item').hasClass('focus')) {
    window.location.replace('/search/?q=' + q);
  }
});
$('.search-form').submit(function (event) {
  event.preventDefault();
  var q = $(this).find('.search-form__input').val();
  if (q.length > 2) window.location.replace('/search/?q=' + q);
});
$('body').on('click', '.header__search-btn', function () {
  showPopUp('search');
  $('.instant-search-form .search-form__input').focus();
  $('.js-close-search').removeClass('hidden');
  $('.header__search-btn').addClass('visually-hidden');
});
$('body').on('click', '.js-close-search, .search .back', hideSearch);
$('body').on('click', '.js-search__clear-btn', clearSearch);
$('body').on('input', '.search-form__input', function () {
  if ($(this).val() !== '') {
    $('.js-search__clear-btn').removeClass('hidden');
  } else {
    $('.js-search__clear-btn').addClass('hidden');
  }
}); // запрос и переключение между результатами поиска с помощью стрелок вверх/вниз

$('body').on('keyup', '.instant-search-form__input', function (event) {
  var keyCode = event.keyCode,
      q = $(this).val(); // навигация по результатам: 40 - вниз, 38 - вверх

  if (keyCode == 40 || keyCode == 38) {
    if ($('.search__result-block').find('.search-item')) {
      if (keyCode == 40) {
        if ($('.search-item').hasClass('focus')) {
          var focusEq = $('.search-item').index($('.search-item.focus'));

          if (focusEq == $('.search-item').length - 1) {
            $('.search-item').removeClass('focus');
            $('.search-item').eq(0).addClass('focus');
          } else {
            $('.search-item').removeClass('focus');
            $('.search-item').eq(focusEq + 1).addClass('focus');
          }
        } else {
          $('.search-item').eq(0).addClass('focus');
        }
      }

      if (keyCode == 38) {
        if ($('.search-item').hasClass('focus')) {
          var focusEq = $('.search-item').index($('.search-item.focus'));
          $('.search-item').removeClass('focus');
          $('.search-item').eq(focusEq - 1).addClass('focus');
        } else {
          $('.search-item').eq(-1).addClass('focus');
        }
      }
    }
  } // переход по ссылке на элементе по Enter
  else if (keyCode == 13) {
      if ($('.search-item').hasClass('focus')) {
        var link = $('.search-item.focus').attr('href');
        window.location.replace(link);
      }
    } // закрыть поиск по Esc
    else if (keyCode == 27) {
        hideSearch();
      } // отправление поискового запроса
      else {
          if (q.length > 2) setTimeout(ajaxInstantSearch(q), 500);
        }
});
"use strict";

$('body').on('click', '.select__arrow', function () {
  var select = $(this).parents('.select'),
      selectValue = select.find('.select__value_visible'),
      optionsList = select.find('.select__options-list');

  if (!selectValue.hasClass('focus')) {
    $('.select').find('.select__value_visible').removeClass('focus');
    $('.select__options-list').addClass('hidden');
  }

  selectValue.toggleClass('focus');
  optionsList.toggleClass('hidden');
});
$('body').on('focus', '.select__value', function () {
  var select = $(this).parents('.select'),
      selectValue = $(this).val(),
      optionsList = select.find('.select__options-list');
  $('.select').find('.select__value_visible').removeClass('focus');
  $('.select__options-list').addClass('hidden');

  if (selectValue !== '') {
    select.find('.select__clear').removeClass('hidden');
  }

  $(this).toggleClass('focus');
  optionsList.toggleClass('hidden');
}); // выбор пункта селекта

$('body').on('click', '.select__option', function () {
  var select = $(this).parents('.select'),
      optionValue = $(this).text(),
      optionDataToSend = $(this).data('value-to-send'),
      selectValueVisible = select.find('.select__value_visible'),
      selectValueHidden = select.find('.select__value_hidden'),
      optionsList = select.find('.select__options-list'),
      clearSelect = select.find('.select__clear');
  optionsList.find('.select__option').removeClass('select__option_choosen');
  $(this).addClass('select__option_choosen');
  optionsList.addClass('hidden');
  selectValueHidden.val(optionDataToSend).removeClass('has-error');

  if (selectValueVisible.prop('tagName') == 'DIV') {
    selectValueVisible.text(optionValue).removeClass('focus');
  } else if (selectValueVisible.prop('tagName') == 'INPUT') {
    selectValueVisible.val(optionValue).removeClass('has-error focus');
  }

  selectValueHidden.change();
  clearSelect.removeClass('hidden');
}); // очистка поля по клику на крестик

$('body').on('click', '.select__clear', clearSelect);
$('body').on('blur', '.select__value_visible', function () {
  $(this).addClass('blured');
  checkFormField($(this).siblings('.select__value_hidden'));
  hideErrorMessage($(this).siblings('.select__value_hidden'));
});
$('body').on('focus', '.select__value_visible', function () {
  showErrorMessage($(this).siblings('.select__value_hidden.has-error'));
});

function clearSelect() {
  var select = $(this).parents('.select'),
      selectValueVisible = select.find('.select__value_visible'),
      selectValueHidden = select.find('.select__value_hidden'),
      optionsList = select.find('.select__options-list');
  optionsList.find('.select__option').removeClass('select__option_choosen hidden');
  selectValueVisible.val('').text('').focus();
  selectValueHidden.val('');
  selectValueHidden.removeClass('fill');
  selectValueVisible.removeClass('fill');
  $(this).addClass('hidden');
}

function clearAllSelect() {
  var select = $('.select'),
      selectValueVisible = select.find('.select__value_visible'),
      selectValueHidden = select.find('.select__value_hidden'),
      optionsList = select.find('.select__options-list'),
      selectClearBtn = select.find('.select__clear');
  optionsList.find('.select__option').removeClass('select__option_choosen hidden');
  selectValueVisible.val('').text('').focus();
  selectValueHidden.val('');
  selectClearBtn.addClass('hidden');
} // закрытие select при клике в любое место


$('body').click(function (event) {
  if ($(event.target).parents('.select').length == 0 && !$(event.target).hasClass('select')) {
    $('.select__options-list').addClass('hidden');
    $('.select__value_visible').removeClass('focus');
  }
}); // закрытие select при фокусе на любом элементе

$('body').on('focus', 'button, input', function (event) {
  if ($(event.target).parents('.select').length == 0 && !$(event.target).hasClass('select')) {
    $('.select__options-list').addClass('hidden');
    $('.select__value_visible').removeClass('focus');
  }
});
"use strict";

var animateSpeed = 300;
$(function () {
  if (sliderDetect()) sliderInit();
}); // Переключение слайдов стрелками

$('.slider-arrow').on('click', function () {
  var slider = $(this).parents('.slider').eq(0),
      sliderContainer = slider.find('.slider-container').eq(0),
      slidesAmount = sliderContainer.find('.slide').length,
      sliderNavCounter = slider.find('.slide-nav-counter'),
      sliderCaption = slider.siblings('.slider-caption'),
      sliderCircles = slider.find('.slider-circles-container'),
      sliderCircleItems = sliderCircles.find('.slider-circle-item'),
      currentActiveSlideIndex = sliderContainer.find('.slide').index(sliderContainer.find('.slide.active')),
      newActiveSlideIndex = 0,
      newDescription;
  if ($(this).hasClass('slider-arrow-next')) newActiveSlideIndex = currentActiveSlideIndex < slidesAmount - 1 ? currentActiveSlideIndex + 1 : 0;else if ($(this).hasClass('slider-arrow-prev')) newActiveSlideIndex = currentActiveSlideIndex > 0 ? currentActiveSlideIndex - 1 : slidesAmount - 1;
  sliderContainer.find('.slide.active').stop().animate({
    opacity: 0
  }, animateSpeed, "linear", function () {
    $(this).removeClass('active');
  });
  sliderContainer.find('.slide').eq(newActiveSlideIndex).stop().animate({
    opacity: 1
  }, animateSpeed, "linear", function () {
    $(this).addClass('active');
  });
  newDescription = sliderContainer.find('.slide').eq(newActiveSlideIndex).data('description');

  if (newDescription) {
    sliderCaption.addClass('active');
    sliderCaption.html(newDescription);
  } else sliderCaption.removeClass('active');

  if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
    sliderNavCounter.find('span').eq(0).html(newActiveSlideIndex + 1);
  } else {
    var newActiveSlideIndexText = newActiveSlideIndex + 1 > 9 ? newActiveSlideIndex + 1 : '0' + (newActiveSlideIndex + 1);
    sliderNavCounter.find('span').eq(0).html(newActiveSlideIndexText);
  }

  sliderCircleItems.eq(currentActiveSlideIndex).removeClass('active');
  sliderCircleItems.eq(newActiveSlideIndex).addClass('active');
  setSliderTimeline(slider, newActiveSlideIndex + 1);

  if (slider.find('.preview-slider__small-img-wrap').length > 0) {
    slider.find('.preview-slider__small-img-wrap .preview-slider__mini-btn').removeClass('active');
    slider.find('.preview-slider__small-img-wrap .preview-slider__mini-btn').eq(newActiveSlideIndex).addClass('active');
  }

  if (slider.hasClass('js-sp-dance-styles-slider')) {
    $('.js-sp-dance-style-slider-item').removeClass('sp-dance-style_active');
    $('.js-sp-dance-style-slider-item').eq(newActiveSlideIndex).addClass('sp-dance-style_active');
  }
}); // Переключение слайдов по клику на слайд

$('.slider-container .slide').on('click', function () {
  var slider = $(this).parents('.slider').eq(0),
      slidesAmount = slider.find('.slide').length;

  if (slidesAmount > 1) {
    slider.find('.slider-arrow-next').trigger('click');
  }
}); // Переключение слайдов шариками

$('.slider-circles-container').on('click', '.slider-circle-item', function () {
  var slider = $(this).parents('.slider').eq(0),
      sliderContainer = slider.find('.slider-container').eq(0),
      sliderNavCounter = slider.find('.slide-nav-counter'),
      sliderCircles = slider.find('.slider-circles-container'),
      sliderCircleItems = sliderCircles.find('.slider-circle-item'),
      currentActiveSlideIndex = sliderContainer.find('.slide').index(sliderContainer.find('.slide.active')),
      newActiveSlideIndex = sliderCircleItems.index($(this));

  if (currentActiveSlideIndex != newActiveSlideIndex) {
    sliderContainer.find('.slide.active').stop().animate({
      opacity: 0
    }, animateSpeed, "linear", function () {
      $(this).removeClass('active');
    });
    sliderContainer.find('.slide').eq(newActiveSlideIndex).stop().animate({
      opacity: 1
    }, animateSpeed, "linear", function () {
      $(this).addClass('active');
    });

    if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
      sliderNavCounter.find('span').eq(0).html(newActiveSlideIndex + 1);
    } else {
      var newActiveSlideIndexText = newActiveSlideIndex + 1 > 9 ? newActiveSlideIndex + 1 : '0' + (newActiveSlideIndex + 1);
      sliderNavCounter.find('span').eq(0).html(newActiveSlideIndexText);
    }

    sliderCircleItems.eq(currentActiveSlideIndex).removeClass('active');
    sliderCircleItems.eq(newActiveSlideIndex).addClass('active');
    setSliderTimeline(slider, newActiveSlideIndex + 1);
  }
}); // Проверка на существование слайдеров на странице

function sliderDetect() {
  return $('.slider').length > 0 ? true : false;
} // Инициализация слайдеров


function sliderInit() {
  $('.slider').each(function () {
    var sliderContainer = $(this).find('.slider-container').eq(0),
        slidesAmount = sliderContainer.find('.slide').length,
        slidesAmountText = slidesAmount > 9 ? slidesAmount : '0' + slidesAmount,
        sliderCaption = $(this).siblings('.slider-caption'),
        sliderNav = $(this).find('.slider-arrow'),
        sliderNavCounter = $(this).find('.slide-nav-counter'),
        sliderCircles = $(this).find('.slider-circles-container');

    if (slidesAmount > 0) {
      var firstSlide = sliderContainer.find('.slide').eq(0);

      if (firstSlide.data('description')) {
        sliderCaption.addClass('active');
        sliderCaption.html(firstSlide.data('description'));
      } else sliderCaption.removeClass('active');

      firstSlide.addClass('active');
    }

    if (slidesAmount > 1) {
      sliderNav.addClass('active');
      sliderNavCounter.addClass('active');

      if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
        sliderNavCounter.find('span').eq(0).html('1');
        sliderNavCounter.find('span').eq(1).html(slidesAmount);
      } else {
        sliderNavCounter.find('span').eq(0).html('01');
        sliderNavCounter.find('span').eq(1).html(slidesAmountText);
      }

      sliderCircles.addClass('active');

      if (sliderCircles.length > 0 && sliderCircles.hasClass('active')) {
        for (var i = 0; i < slidesAmount; i++) {
          sliderCircles.append('<span class="slider-circle-item"></span>');
        }

        sliderCircles.find('.slider-circle-item').eq(0).addClass('active');
      }
    } else {
      sliderCircles.remove();
    }

    if ($(this).find('.preview-slider__small-img-wrap').length > 0) {
      $(this).find('.preview-slider__small-img-wrap .preview-slider__mini-btn').eq(0).addClass('active');
    }
  });
}

$('.timeline-step').click(function () {
  var timeline = $(this).parents('.sp-slider-timeline'),
      slider = timeline.siblings('.slider'),
      sliderContainer = slider.find('.slider-container').eq(0),
      sliderNavCounter = slider.find('.slide-nav-counter'),
      sliderCircles = slider.find('.slider-circles-container'),
      sliderCircleItems = sliderCircles.find('.slider-circle-item'),
      currentActiveSlideIndex = sliderContainer.find('.slide').index(sliderContainer.find('.slide.active')),
      newActiveSlideIndex = $(this).data('timeline-slide') - 1;

  if (currentActiveSlideIndex != newActiveSlideIndex) {
    sliderContainer.find('.slide.active').stop().animate({
      opacity: 0
    }, animateSpeed, "linear", function () {
      $(this).removeClass('active');
    });
    sliderContainer.find('.slide').eq(newActiveSlideIndex).stop().animate({
      opacity: 1
    }, animateSpeed, "linear", function () {
      $(this).addClass('active');
    });

    if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
      sliderNavCounter.find('span').eq(0).html(newActiveSlideIndex + 1);
    } else {
      var newActiveSlideIndexText = newActiveSlideIndex + 1 > 9 ? newActiveSlideIndex + 1 : '0' + (newActiveSlideIndex + 1);
      sliderNavCounter.find('span').eq(0).html(newActiveSlideIndexText);
    }

    sliderCircleItems.eq(currentActiveSlideIndex).removeClass('active');
    sliderCircleItems.eq(newActiveSlideIndex).addClass('active');
    setSliderTimeline(slider, newActiveSlideIndex + 1);
  }
});
$('.preview-slider__mini-btn').click(function () {
  var sliderPreviewWrap = $(this).parents('.preview-slider__small-img-wrap');
  sliderPreviewWrap.find('.preview-slider__mini-btn').removeClass('active');
  $(this).addClass('active');
  var slider = $(this).parents('.slider'),
      sliderContainer = slider.find('.slider-container').eq(0),
      sliderNavCounter = slider.find('.slide-nav-counter'),
      sliderCircles = slider.find('.slider-circles-container'),
      sliderCircleItems = sliderCircles.find('.slider-circle-item'),
      currentActiveSlideIndex = sliderContainer.find('.slide').index(sliderContainer.find('.slide.active')),
      newActiveSlideIndex = sliderPreviewWrap.find('.preview-slider__mini-btn').index($(this));

  if (currentActiveSlideIndex != newActiveSlideIndex) {
    sliderContainer.find('.slide.active').stop().animate({
      opacity: 0
    }, animateSpeed, "linear", function () {
      $(this).removeClass('active');
    });
    sliderContainer.find('.slide').eq(newActiveSlideIndex).stop().animate({
      opacity: 1
    }, animateSpeed, "linear", function () {
      $(this).addClass('active');
    });

    if (sliderNavCounter.hasClass('js-slide-nav-counter-without-zero')) {
      sliderNavCounter.find('span').eq(0).html(newActiveSlideIndex + 1);
    } else {
      var newActiveSlideIndexText = newActiveSlideIndex + 1 > 9 ? newActiveSlideIndex + 1 : '0' + (newActiveSlideIndex + 1);
      sliderNavCounter.find('span').eq(0).html(newActiveSlideIndexText);
    }

    sliderCircleItems.eq(currentActiveSlideIndex).removeClass('active');
    sliderCircleItems.eq(newActiveSlideIndex).addClass('active');
  }
});

function setSliderTimeline(slider, newActiveSlideIndex) {
  var sliderTimeline = slider.siblings('.sp-slider-timeline');
  sliderTimeline.find('.timeline-step').each(function () {
    var currentStepSlide = $(this).data('timeline-slide');

    if (currentStepSlide <= newActiveSlideIndex) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  });
}

var previewSliderThumbArrow = document.querySelectorAll('.js-preview-slider-thumb-arrow');

if (previewSliderThumbArrow) {
  previewSliderThumbArrow.forEach(function (item) {
    var slider = item.closest('.slider');
    var sliderThumbsAmount = slider.querySelectorAll('.preview-slider__small-img-wrap .preview-slider__mini-btn').length;

    if (sliderThumbsAmount > 5) {
      slider.querySelector('.preview-slider__thumbs-arrow-container').classList.remove('hidden');
      item.addEventListener('click', function (event) {
        var thumbsSliderOuter = slider.querySelector('.preview-slider__thumbs-block');
        var thumbsSliderInner = slider.querySelector('.preview-slider__small-img-wrap');
        var currentImg = slider.querySelector('.preview-slider__small-img-wrap .preview-slider__mini-btn.active');
        var thumbsSliderOuterPosition = {
          left: thumbsSliderOuter.getBoundingClientRect().left,
          right: thumbsSliderOuter.getBoundingClientRect().right
        },
            targetPosition = {
          left: currentImg.getBoundingClientRect().left,
          right: currentImg.getBoundingClientRect().right
        };

        if (targetPosition.right <= thumbsSliderOuterPosition.right && targetPosition.left >= thumbsSliderOuterPosition.left) {} else {
          if (targetPosition.left > thumbsSliderOuterPosition.left) {
            if (thumbsSliderInner.scrollLeft > currentImg.offsetLeft) {
              thumbsSliderInner.scrollLeft = currentImg.offsetLeft;
            } else {
              thumbsSliderInner.scrollLeft = currentImg.offsetLeft;
            }
          } else {
            thumbsSliderInner.scrollLeft = currentImg.offsetLeft;
          }
        }
      });
    }
  });
}

$('.sp-birthday-reviews-slider').on('init', function (event, slick) {
  if (slick.currentSlide + 1 === slick.slideCount) $('.sp-birthday-reviews-slider_outer .slide-nav-counter').html(slick.currentSlide + 1 + ' из ' + slick.slideCount);else $('.sp-birthday-reviews-slider_outer .slide-nav-counter').html(slick.currentSlide + 2 + ' из ' + slick.slideCount);
});
$('.sp-birthday-reviews-slider').on('afterChange', function (event, slick, currentSlide) {
  if (slick.currentSlide + 1 === slick.slideCount) $('.sp-birthday-reviews-slider_outer .slide-nav-counter').html(slick.currentSlide + 1 + ' из ' + slick.slideCount);else $('.sp-birthday-reviews-slider_outer .slide-nav-counter').html(slick.currentSlide + 2 + ' из ' + slick.slideCount);
});
$('.sp-birthday-reviews-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
  setTimeout(function () {
    sliderAdaptiveHeight();
  }, 50);
});
$('.sp-birthday-reviews-slider').slick({
  infinite: true,
  slidesToShow: 2,
  slidesToScroll: 2,
  arrows: true,
  lazyLoad: 'ondemand',
  prevArrow: '<button class="slider-arrow slider-arrow-prev icon-arrow-left active"></button>',
  nextArrow: '<button class="slider-arrow slider-arrow-next icon-arrow-right active"></button>'
});

var sliderAdaptiveHeight = function sliderAdaptiveHeight(showSlides) {
  var heights = [];
  var items = $('.slick-active');
  items.each(function () {
    heights.push($(this).outerHeight());
  });
  $('.slick-list').height(Math.max.apply(null, heights));
};

$('.js-cinema-widget-slider').slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: true,
  lazyLoad: 'progressive',
  dotsClass: 'slick-dots cinema-widget__dots-container',
  prevArrow: '<button class="cinema-widget__slider-arrow slider-arrow-prev icon-arrow-left"></button>',
  nextArrow: '<button class="cinema-widget__slider-arrow slider-arrow-next icon-arrow-right"></button>'
});
$('.js-specials-slider').slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: true,
  lazyLoad: 'progressive',
  dotsClass: 'slick-dots specials__dots-container',
  prevArrow: '<button class="specials__slider-arrow slider-arrow-prev icon-arrow-left"></button>',
  nextArrow: '<button class="specials__slider-arrow slider-arrow-next icon-arrow-right"></button>'
});
$('.js-post-editor-slider-block').each(function () {
  var amount = $(this).find('img').length;
  if (amount > 1) $(this).find('.post-editor-slider-block__navigation-wrap').removeClass('hidden');
  if (amount < 10) amount = '0' + amount;
  $(this).find('.js-post-editor-slider-total').text(amount);
  var slideDescriptionText = $(this).find('.post-editor-slider-block__slide')[0].dataset.description;
  $(this).find('.post-editor-slider-block__caption').text(slideDescriptionText);
});
$('.js-post-editor-slider').slick({
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  dots: false,
  fade: true,
  responsive: [{
    breakpoint: 600,
    settings: {
      fade: false
    }
  }],
  lazyLoad: 'progressive'
});
$('.js-post-editor-slider').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
  var slideDescriptionText = slick.$slides[nextSlide].dataset.description;
  $(this).parents('.js-post-editor-slider-block').find('.post-editor-slider-block__caption').text(slideDescriptionText);
  var amount = nextSlide + 1;
  if (amount < 10) amount = '0' + amount;
  $(this).parents('.js-post-editor-slider-block').find('.js-post-editor-slider-current').text(amount);
});
$('.js-post-editor-slider').on('click', '.slick-slide', function () {
  $('.js-post-editor-slider').slick('slickNext');
});
$('.js-post-editor-slider').on('click', '.post-editor-slider-block__arrow-prev', function () {
  $('.js-post-editor-slider').slick('slickPrev');
});
$('.js-post-editor-slider').on('click', '.post-editor-slider-block__arrow-next', function () {
  $('.js-post-editor-slider').slick('slickNext');
});
"use strict";

$('.js-sp-dance-style-slider-item').click(function () {
  var clickedIndex = $(this).index();
  var sliderBulletByIndex = $('.js-sp-dance-styles-slider .slider-circle-item').eq(clickedIndex);
  sliderBulletByIndex.trigger('click');
  $('.js-sp-dance-style-slider-item').removeClass('sp-dance-style_active');
  $(this).addClass('sp-dance-style_active');
});
$('.js-sp-winter-fun-event-card').click(function () {
  var clickedEventId = $(this).data('id');
  showPopUp('sp-winter-fun-city-5');
  var event = $('.js-sp-winter-fun-event-place[data-event="' + clickedEventId + '"]')[0];
  var eventPosition = event.offsetTop;
  var eventContainer = $('.js-sp-winter-fun-event-container')[0];
  eventContainer.scrollTop = eventPosition - 20;
});
$('.js-sp-winter-fun-event-date').click(function (event) {
  event.stopPropagation();
  var clickedEventId = $(this).data('id');
  showPopUp('sp-winter-fun-city-5');
  var eventItem = $('.js-sp-winter-fun-event-date[data-event="' + clickedEventId + '"]')[0];
  var eventContainer = $('.js-sp-winter-fun-event-container')[0];
  var eventPosition = eventItem.offsetTop;
  eventContainer.scrollTop = eventPosition - 20;
});
"use strict";

$('.subscribe-form').submit(function (event) {
  event.preventDefault();
  validateFormFields($(this));

  if (validateStatus) {
    ajaxSubscribe($(this));
  }
});
$('.subscribe-form__input').on('input', function () {
  $('.js-subscribe-form__submited').addClass('hidden');
  $('.js-subscribe-form__submit').removeClass('hidden');
});

function updateSubscribeWidget() {
  $('.js-subscribe-form__submited').removeClass('hidden');
  $('.subscribe-form').addClass('hidden');
  $('.subscribe-form')[0].reset();
}
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var tablesToggleClickableTd = _toConsumableArray(document.querySelectorAll('.js-table-toggle td:first-child, .js-table-toggle td:nth-child(2)'));

if (tablesToggleClickableTd.length) {
  tablesToggleClickableTd.forEach(function (td) {
    td.addEventListener('click', function () {
      var parentTr = td.parentNode;
      var thirdTd = parentTr.querySelector('td:nth-child(3)');
      var fourthTd = parentTr.querySelector('td:nth-child(4)');
      parentTr.classList.toggle('open');
      if (thirdTd) thirdTd.classList.toggle('visible');
      if (fourthTd) fourthTd.classList.toggle('visible');
    });
  });
}
"use strict";

function setFirstTabsVisible() {
  $('.tabs-wrap').each(function () {
    $(this).find('.tab__btn').eq(0).addClass('active');
    $(this).find('.tab__content').eq(0).addClass('visible');
  });
}

function switchTab(elem) {
  var parent = elem.parents('.tabs-wrap:first'),
      allTabContents = parent.find('.tab__content-wrap:first').children('.tab__content'),
      parentBtnWrap = elem.parents('.tab__btns-wrap:first'),
      allTabBtns = parentBtnWrap.children('.tab__btn'),
      clickedBtnIndex = allTabBtns.index(parent.find(elem));
  allTabContents.removeClass('visible').eq(clickedBtnIndex).addClass('visible');
  allTabBtns.removeClass('active');
  elem.addClass('active');
  $('.movie-posters-slider').slick('reinit');
}

$(function () {
  setFirstTabsVisible();
  $('.movie-posters-slider').slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    responsive: [{
      breakpoint: 1024,
      settings: {
        arrows: false,
        dots: true,
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }, {
      breakpoint: 600,
      settings: {
        arrows: false,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
  });
});
$('body').on('click', '.js-tab__btn', function () {
  switchTab($(this));
});