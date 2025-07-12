import { initDialog } from './_dialog.js';
import { initSlider } from './_slider.js';
import { initTheme } from './_theme.js';

export function initCore() {
    initDialog();
    initSlider();
    initTheme();
}