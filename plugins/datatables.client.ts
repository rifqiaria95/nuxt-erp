import 'datatables.net-bs5'
import $ from 'jquery'

declare global {
  interface Window {
    $: typeof $;
    jQuery: typeof $;
  }
}

export default defineNuxtPlugin(() => {
  // jQuery dan DataTables sudah tersedia di window
  if (process.client) {
    window.$ = window.jQuery = $
  }
})