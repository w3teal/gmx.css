export function initDialog() {
    document.addEventListener('keydown', ({ key }) => {
        if (key === 'Escape') {
            document.querySelectorAll('.dialog-trigger')
                    .forEach(el => el.checked = false);
        }
    });

    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('mousedown', (e) => {
            if (e.button === 0 && e.target === dialog) {
                dialog.close();
            }
        });
    });
}