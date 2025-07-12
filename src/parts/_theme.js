export function initTheme() {
  const cache = { light: "", dark: "" };
  const vars = [
    "--primary", "--on-primary", "--primary-container", "--on-primary-container",
    "--secondary", "--on-secondary", "--secondary-container", "--on-secondary-container",
    "--tertiary", "--on-tertiary", "--tertiary-container", "--on-tertiary-container",
    "--error", "--on-error", "--error-container", "--on-error-container",
    "--background", "--on-background", "--surface", "--on-surface",
    "--surface-variant", "--on-surface-variant", "--outline", "--outline-variant",
    "--shadow", "--scrim", "--inverse-surface", "--inverse-on-surface",
    "--inverse-primary", "--surface-dim", "--surface-bright",
    "--surface-container-lowest", "--surface-container-low",
    "--surface-container", "--surface-container-high", "--surface-container-highest"
  ];

  const prefersDark = () => matchMedia("(prefers-color-scheme: dark)").matches;
  const currentMode = () => document.body.classList.contains("dark") ? "dark" : "light";

  function getCache() {
    if (cache.light && cache.dark) return cache;

    const body = document.body;
    const el = mode => {
      const b = document.createElement("body");
      b.className = mode;
      body.appendChild(b);
      return getComputedStyle(b);
    };

    const light = el("light"), dark = el("dark");

    for (const v of vars) {
      cache.light += `${v}:${light.getPropertyValue(v)};`;
      cache.dark += `${v}:${dark.getPropertyValue(v)};`;
    }

    body.lastChild.remove();
    body.lastChild.remove();

    return cache;
  }

  function setTheme(theme) {
    const body = document.body;
    const mode = currentMode();

    if (!theme || !globalThis.materialDynamicColors) return getCache();

    if (theme.light && theme.dark) {
      cache.light = theme.light;
      cache.dark = theme.dark;
      body.setAttribute("style", theme[mode]);
      return theme;
    }

    return globalThis.materialDynamicColors(theme).then(colors => {
      const toCSS = o =>
        Object.entries(o).map(([k, v]) =>
          `--${k.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}:${v};`).join("");

      cache.light = toCSS(colors.light);
      cache.dark = toCSS(colors.dark);
      body.setAttribute("style", cache[mode]);

      return cache;
    });
  }

  function setMode(mode) {
    const body = document.body;
    if (!body) return mode;
    if (!mode) return currentMode();
    if (mode === "auto") mode = prefersDark() ? "dark" : "light";

    body.classList.remove("light", "dark");
    body.classList.add(mode);

    if (globalThis.materialDynamicColors)
      body.setAttribute("style", cache[mode]);

    return currentMode();
  }

  function applyDefault() {
    const mode = prefersDark() ? "dark" : "light";
    document.body.classList.add(mode);
    getCache();
    document.body.setAttribute("style", cache[mode]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyDefault);
  } else {
    applyDefault();
  }

  globalThis.ui = (action, value) => {
    if (action === "mode") return setMode(value);
    if (action === "theme") return setTheme(value);
    return null;
  };
}