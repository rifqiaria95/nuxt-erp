// middleware/redirect-auth.ts
export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.client && ['auth-login', 'auth-register'].includes(to.name as string)) {
      if (localStorage.getItem('token')) {
        return navigateTo('/dashboard')
      }
    }
  })
  