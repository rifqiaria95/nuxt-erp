import { useLayoutStore } from '~/stores/layout'

export default defineNuxtPlugin((nuxtApp) => {
  const layoutStore = useLayoutStore()

  nuxtApp.hook('page:start', () => {
    layoutStore.setLoading(true)
  })

  nuxtApp.hook('page:finish', () => {
    layoutStore.setLoading(false)
  })
}) 