import { useNuxtApp } from '#app'

// Utilitas fetch terpusat yang secara otomatis menangani otentikasi (Bearer & CSRF).
export const apiFetch = async <T = any>(url: string, options: any = {}) => {
  // Gunakan localStorage token alih-alih cookie token
  const token = process.client ? localStorage.getItem('token') : null
  const { $api } = useNuxtApp()

  const customHeaders: any = {
    ...options.headers,
    Accept: 'application/json',
  }

  if (token) {
    customHeaders.Authorization = `Bearer ${token}`
  }

  const method = options.method?.toUpperCase() || 'GET'
  const writeMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

  // Untuk metode penulisan, ambil dan lampirkan token CSRF.
  // Ini hanya berjalan di sisi klien.
  if (process.client && writeMethods.includes(method)) {
    try {
      // Menggunakan fetch bawaan di sini untuk mendapatkan token CSRF 
      // untuk menghindari loop tak terbatas jika apiFetch memanggil dirinya sendiri.
      const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
      if (csrfResponse.ok) {
        const csrfData = await csrfResponse.json();
        if (csrfData.token) {
          customHeaders['X-CSRF-TOKEN'] = csrfData.token
        }
      }
    } catch (e) {
      console.error('Tidak dapat mengambil token CSRF:', e)
    }
  }

  try {
    return await $fetch<T>(url, {
      ...options,
      // credentials: 'include' penting untuk otentikasi berbasis cookie/sesi
      credentials: 'include',
      headers: customHeaders,
    })
  } catch (error: any) {
    const status = error?.response?.status ?? error?.statusCode ?? error?.status
    if (status === 401 || status === 419) {
      const toast = useToast()
      toast.error({
        title: 'Sesi Berakhir',
        message: 'Sesi anda telah berakhir, silakan logout dan login kembali',
        color: 'red',
      })
      
      // Clear user data dan redirect ke login jika session expired
      if (process.client) {
        const { useUserStore } = await import('~/stores/user')
        const userStore = useUserStore()
        userStore.clearUser()
        
        // Redirect ke login page
        const router = useRouter()
        router.push('/auth/login')
      }
    }
    throw error
  }
}