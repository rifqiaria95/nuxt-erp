export default defineNuxtPlugin((nuxtApp) => {
  const showSessionExpiredToast = () => {
    const toast = useToast()
    toast.error({
      title: 'Sesi Berakhir',
      message: 'Sesi anda telah berakhir, silakan logout dan login kembali',
      color: 'red',
    })
  }

  // Interceptor untuk $fetch (ofetch)
  // @ts-ignore - override instance diperbolehkan
  nuxtApp.$fetch = $fetch.create({
    onResponseError({ response }) {
      const status = response?.status
      if (status === 401 || status === 419) {
        showSessionExpiredToast()
      }
    },
  }) as any

  // Interceptor untuk window.fetch
  if (process.client) {
    const originalFetch = window.fetch.bind(window)
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const res = await originalFetch(input, init)
      try {
        if (res && (res.status === 401 || res.status === 419)) {
          showSessionExpiredToast()
        }
      } catch {}
      return res
    }
  }
})


