/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./src/parts/_dialog.js
function initDialog() {
  document.addEventListener('keydown', function (_ref) {
    var key = _ref.key;
    if (key === 'Escape') {
      document.querySelectorAll('.dialog-trigger').forEach(function (el) {
        return el.checked = false;
      });
    }
  });
  document.querySelectorAll('dialog').forEach(function (dialog) {
    dialog.addEventListener('mousedown', function (e) {
      if (e.button === 0 && e.target === dialog) {
        dialog.close();
      }
    });
  });
}
;// ./src/parts/_slider.js
function initSlider() {
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
}
;// ./src/parts/_core.js


function initCore() {
  initDialog();
  initSlider();
}
;// ./src/builds/gmx.js

initCore();
/******/ })()
;