// plugins/jquery.client.ts
import jQuery from 'jquery';

export default defineNuxtPlugin(() => {
  if (process.client) {
    window.$ = window.jQuery = jQuery;
  }
});