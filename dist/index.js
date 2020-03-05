"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Emit event - wrapper around CustomEvent API
 * @param {string} handle - a string representing the name of the event
 * @param {object} payload - data to be passed via the event to listening functions
 * @param {EventTarget} target - target to emit/broadcast event to
 */
function emit(handle, payload) {
  var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  var event = new CustomEvent(eventHandle, {
    detail: payload
  });
  target.dispatchEvent(event);
}
/**
 * Listen for custom event and execute callback on EventTarget
 * @param {string} handle - a string representing the name of the event
 * @param {function} cb - function to call w/ event argument when event is emitted
 * @param {EventTarget} target - target to attach listener to
 */


function on(handle, cb) {
  var target = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
  target.addEventListener(handle, cb);
}
/**
 * Pop off and instantiate any components pushed onto global components array
 * @rparam {object} scaffold - Case scaffold where components and state are initialized by markup
 * @rparam {object} classMap - Object mapping component handles to corresponding classes
 * @rparam {object} actions - Object defining actions/commands that components will pub/sub
 * @rparam {Function} cb - Callback function once all components have been initialized
 * @return {void}
 */


function pop(_ref) {
  var _ref$scaffold = _ref.scaffold,
      scaffold = _ref$scaffold === void 0 ? {} : _ref$scaffold,
      _ref$classMap = _ref.classMap,
      classMap = _ref$classMap === void 0 ? {} : _ref$classMap,
      _ref$actions = _ref.actions,
      actions = _ref$actions === void 0 ? {} : _ref$actions,
      _ref$cb = _ref.cb,
      cb = _ref$cb === void 0 ? null : _ref$cb;
  // Get order of instantiation from storage key in scaffold
  var _scaffold$storage = scaffold.storage,
      storage = _scaffold$storage === void 0 ? 'queue' : _scaffold$storage; // Create events object to wrap methods to send and receive events (messages) between components

  var events = {
    emit: emit,
    on: on
  };
  /**
   * Function to allow component classes to repop components inside dynamically set markup
   * @param {Element}
   */

  function refresh() {
    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (container === null) {
      return;
    } // Get all scripts from markup set in container


    var scripts = container.querySelectorAll('script');

    if (scripts.length === 0) {
      return;
    } // Evaluate scripts returned from component markup if for new component


    scripts.forEach(function (script) {
      eval(script.textContent);
    }); // Instantiate components

    pop({
      scaffold: scaffold,
      classMap: classMap,
      actions: actions,
      cb: cb
    });
  } // Pop component configs from global array and construct instances


  while ((scaffold.components || []).length > 0) {
    var _scaffold$components = scaffold.components,
        components = _scaffold$components === void 0 ? [] : _scaffold$components,
        _scaffold$state = scaffold.state,
        state = _scaffold$state === void 0 ? {} : _scaffold$state;
    var config = storage === 'stack' ? components.pop() : components.shift();
    var Class = classMap[config.handle];

    if (typeof Class === 'function') {
      try {
        new Class(_objectSpread({}, config, {
          state: state,
          actions: actions,
          events: events,
          refresh: refresh
        }));
      } catch (error) {
        console.error(error);
      }
    }
  }

  if (cb) {
    cb();
  }
}

var _default = pop;
exports["default"] = _default;