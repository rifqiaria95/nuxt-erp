export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    if (!localStorage.getItem('token')) {
      setTimeout(() => {
        document.querySelectorAll('.layout-wrapper, .layout-content-navbar').forEach(el => el.remove())
      }, 0)
      return navigateTo('/errors/401')
    }

    // Cek validitas token ke backend
    try {
      const token = localStorage.getItem('token')
      const { $api } = useNuxtApp()
      
      const response = await fetch($api.me(), {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        },
        credentials: 'include',
      })
      
      if (!response.ok) {
        throw new Error('Token tidak valid')
      }
    } catch (e) {
      const toast = useToast()
      toast.error({
        title: 'Sesi Berakhir',
        message: 'Sesi anda telah berakhir, silakan logout dan login kembali',
        color: 'red',
      })
      localStorage.removeItem('token')
      setTimeout(() => {
        document.querySelectorAll('.layout-wrapper, .layout-content-navbar').forEach(el => el.remove())
      }, 0)
      return navigateTo('/errors/401')
    }
  }
})