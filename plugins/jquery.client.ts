import jQuery from 'jquery'
import select2 from 'select2'

export default defineNuxtPlugin(() => {
  if (process.client) {
    window.$ = window.jQuery = jQuery

    if (typeof (jQuery.fn as any).select2 === 'undefined') {
      select2(jQuery)
    }
  }
})