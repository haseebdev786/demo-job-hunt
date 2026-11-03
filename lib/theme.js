export const THEME_KEY = "jobhunt-theme";

// Runs before the page paints, so a saved dark theme never flashes white.
export const themeScript = `(function(){var theme="light";try{if(localStorage.getItem("${THEME_KEY}")==="dark")theme="dark";}catch(e){}document.documentElement.dataset.theme=theme;})();`;
