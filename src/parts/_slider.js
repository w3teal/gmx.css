export function initSlider() {
  const run = () => {
    document.querySelectorAll('.slider input[type="range"]').forEach(slider => {
      const update = () => {
        const value = parseFloat(slider.value);
        const min = parseFloat(slider.min || 0);
        const max = parseFloat(slider.max || 100);
        const percent = ((value - min) / (max - min)) * 100;

        const container = slider.closest('.slider');
        const thumb = container?.querySelector('.thumb');

        container?.style.setProperty('--percent', `${percent}%`);
        if (thumb) thumb.dataset.percent = value;
      };

      slider.addEventListener('input', update);
      update();
    });
  };

  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
}