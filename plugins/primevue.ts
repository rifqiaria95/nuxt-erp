import PrimeVue from 'primevue/config';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';

// Konfigurasi tema PrimeVue dengan preset Aura agar tabel PrimeVue menggunakan tema tersebut
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: Aura,
      options: {
        prefix: 'p',
        darkModeSelector: '.app-light',
        cssLayer: false
      }
    }
  });
  nuxtApp.vueApp.component('DataTable', DataTable);
  nuxtApp.vueApp.component('Column', Column);
  nuxtApp.vueApp.component('Dropdown', Dropdown);
  nuxtApp.vueApp.component('InputText', InputText);
});
