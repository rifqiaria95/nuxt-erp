export default defineNuxtRouteMiddleware((to) => {
    if (import.meta.client && localStorage.getItem('token')) {
        // Jika sudah login, redirect ke halaman sebelumnya atau dashboard
        const redirect = to.query.redirect as string || '/dashboard'
        return navigateTo(redirect)
    }
})