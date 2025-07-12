export function initDialog() {
  const get = id => document.getElementById(id);

  function toggle(id) {
    const el = get(id);
    if (el?.showModal) el.open ? el.close() : el.showModal();
  }

  document.querySelectorAll('dialog').forEach(d => {
    d.addEventListener('mousedown', e => {
      if (e.target === d) d.close();
    });
  });

  document.addEventListener('click', e => {
    const t = e.target.closest('[data-ui]');
    if (t) toggle(t.getAttribute('data-ui'));
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('dialog[open]').forEach(d => d.close());
    }
  });

  const old = window.ui || (() => {});
  window.ui = id => {
    if (get(id)?.showModal) return toggle(id);
    return old(id);
  };
}