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
      await $fetch('/auth/api/me', {
        baseURL: 'http://localhost:3333',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
    } catch (e) {
      localStorage.removeItem('token')
      setTimeout(() => {
        document.querySelectorAll('.layout-wrapper, .layout-content-navbar').forEach(el => el.remove())
      }, 0)
      return navigateTo('/errors/401')
    }
  }
})