/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/parts/_dialog.js
function initDialog() {
  var get = function get(id) {
    return document.getElementById(id);
  };
  function toggle(id) {
    var el = get(id);
    if (el !== null && el !== void 0 && el.showModal) el.open ? el.close() : el.showModal();
  }
  document.querySelectorAll('dialog').forEach(function (d) {
    d.addEventListener('mousedown', function (e) {
      if (e.target === d) d.close();
    });
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ui]');
    if (t) toggle(t.getAttribute('data-ui'));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('dialog[open]').forEach(function (d) {
        return d.close();
      });
    }
  });
  var old = window.ui || function () {};
  window.ui = function (id) {
    var _get;
    if ((_get = get(id)) !== null && _get !== void 0 && _get.showModal) return toggle(id);
    return old(id);
  };
}
;// ./src/parts/_slider.js
function initSlider() {
  var run = function run() {
    document.querySelectorAll('.slider input[type="range"]').forEach(function (slider) {
      var update = function update() {
        var value = parseFloat(slider.value);
        var min = parseFloat(slider.min || 0);
        var max = parseFloat(slider.max || 100);
        var percent = (value - min) / (max - min) * 100;
        var container = slider.closest('.slider');
        var thumb = container === null || container === void 0 ? void 0 : container.querySelector('.thumb');
        container === null || container === void 0 || container.style.setProperty('--percent', "".concat(percent, "%"));
        if (thumb) thumb.dataset.percent = value;
      };
      slider.addEventListener('input', update);
      update();
    });
  };
  if (document.readyState !== 'loading') run();else document.addEventListener('DOMContentLoaded', run);
}
;// ./src/parts/_theme.js
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function initTheme() {
  var cache = {
    light: "",
    dark: ""
  };
  var vars = ["--primary", "--on-primary", "--primary-container", "--on-primary-container", "--secondary", "--on-secondary", "--secondary-container", "--on-secondary-container", "--tertiary", "--on-tertiary", "--tertiary-container", "--on-tertiary-container", "--error", "--on-error", "--error-container", "--on-error-container", "--background", "--on-background", "--surface", "--on-surface", "--surface-variant", "--on-surface-variant", "--outline", "--outline-variant", "--shadow", "--scrim", "--inverse-surface", "--inverse-on-surface", "--inverse-primary", "--surface-dim", "--surface-bright", "--surface-container-lowest", "--surface-container-low", "--surface-container", "--surface-container-high", "--surface-container-highest"];
  var prefersDark = function prefersDark() {
    return matchMedia("(prefers-color-scheme: dark)").matches;
  };
  var currentMode = function currentMode() {
    return document.body.classList.contains("dark") ? "dark" : "light";
  };
  function getCache() {
    if (cache.light && cache.dark) return cache;
    var body = document.body;
    var el = function el(mode) {
      var b = document.createElement("body");
      b.className = mode;
      body.appendChild(b);
      return getComputedStyle(b);
    };
    var light = el("light"),
      dark = el("dark");
    var _iterator = _createForOfIteratorHelper(vars),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var v = _step.value;
        cache.light += "".concat(v, ":").concat(light.getPropertyValue(v), ";");
        cache.dark += "".concat(v, ":").concat(dark.getPropertyValue(v), ";");
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    body.lastChild.remove();
    body.lastChild.remove();
    return cache;
  }
  function setTheme(theme) {
    var body = document.body;
    var mode = currentMode();
    if (!theme || !globalThis.materialDynamicColors) return getCache();
    if (theme.light && theme.dark) {
      cache.light = theme.light;
      cache.dark = theme.dark;
      body.setAttribute("style", theme[mode]);
      return theme;
    }
    return globalThis.materialDynamicColors(theme).then(function (colors) {
      var toCSS = function toCSS(o) {
        return Object.entries(o).map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            k = _ref2[0],
            v = _ref2[1];
          return "--".concat(k.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), ":").concat(v, ";");
        }).join("");
      };
      cache.light = toCSS(colors.light);
      cache.dark = toCSS(colors.dark);
      body.setAttribute("style", cache[mode]);
      return cache;
    });
  }
  function setMode(mode) {
    var body = document.body;
    if (!body) return mode;
    if (!mode) return currentMode();
    if (mode === "auto") mode = prefersDark() ? "dark" : "light";
    body.classList.remove("light", "dark");
    body.classList.add(mode);
    if (globalThis.materialDynamicColors) body.setAttribute("style", cache[mode]);
    return currentMode();
  }
  function applyDefault() {
    var mode = prefersDark() ? "dark" : "light";
    document.body.classList.add(mode);
    getCache();
    document.body.setAttribute("style", cache[mode]);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyDefault);
  } else {
    applyDefault();
  }
  globalThis.ui = function (action, value) {
    if (action === "mode") return setMode(value);
    if (action === "theme") return setTheme(value);
    return null;
  };
}
;// ./src/parts/_core.js



function initCore() {
  initDialog();
  initSlider();
  initTheme();
}
;// ./src/builds/gmx.js

initCore();
/******/ })()
;