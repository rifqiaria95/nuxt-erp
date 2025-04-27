export default defineNuxtConfig({
  devtools: {
    enabled: true
  },

  app: {
    head: {
      link: [
        { rel: "stylesheet", href: "/vendors/feather/feather.css" },
        { rel: "stylesheet", href: "/vendors/mdi/css/materialdesignicons.min.css" },
        { rel: "stylesheet", href: "/vendors/ti-icons/css/themify-icons.css" },
        { rel: "stylesheet", href: "/vendors/font-awesome/css/font-awesome.min.css" },
        { rel: "stylesheet", href: "/vendors/typicons/typicons.css" },
        { rel: "stylesheet", href: "/vendors/simple-line-icons/css/simple-line-icons.css" },
        { rel: "stylesheet", href: "/vendors/css/vendor.bundle.base.css" },
        { rel: "stylesheet", href: "/vendors/bootstrap-datepicker/bootstrap-datepicker.min.css" },
        { rel: "stylesheet", href: "/vendors/datatables.net-bs4/dataTables.bootstrap4.css" },
        { rel: "stylesheet", type: "text/css", href: "/js/select.dataTables.min.css" },
        { rel: "stylesheet", href: "/css/style.css" }
      ],
      script: [
    // @ts-ignore
    { src: "/vendors/js/vendor.bundle.base.js", body: true },
    // @ts-ignore
    { src: "/vendors/bootstrap-datepicker/bootstrap-datepicker.min.js", body: true },
    // @ts-ignore
    { src: "/vendors/chart.js/chart.umd.js", body: true },
    // @ts-ignore
    { src: "/vendors/progressbar.js/progressbar.min.js", body: true },
    // @ts-ignore
    { src: "/js/off-canvas.js", body: true },
    // @ts-ignore
    { src: "/js/template.js", body: true },
    // @ts-ignore
    { src: "/js/settings.js", body: true },
    // @ts-ignore
    { src: "/js/hoverable-collapse.js", body: true },
    // @ts-ignore
    { src: "/js/todolist.js", body: true },
    // @ts-ignore
    { src: "/js/jquery.cookie.js", type: "text/javascript", body: true },
    // @ts-ignore
    { src: "/js/dashboard.js", body: true }
      ]
    }
  },

  compatibilityDate: "2025-02-01",
})
