declare global {
  interface Window {
    Menu?: {
      init: () => void;
    };
  }
}

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const interval = setInterval(() => {
      // Pastikan window.Menu ada
      if (window.Menu) {
        window.Menu.init(); // Panggil init() dari menu.js
        clearInterval(interval);
      }
    }, 100);
  }
});
  