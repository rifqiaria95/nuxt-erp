import { useLayoutStore } from '~/stores/layout'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.beforeEach((to, from, next) => {
    const layoutStore = useLayoutStore()
    layoutStore.setLoading(true)
    next()
  })

  nuxtApp.$router.afterEach(() => {
    const layoutStore = useLayoutStore()
    layoutStore.setLoading(false)
  })
}) 