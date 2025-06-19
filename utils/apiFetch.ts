import { useNuxtApp } from '#app'

// Utilitas fetch terpusat yang secara otomatis menangani otentikasi (Bearer & CSRF).
export const apiFetch = async <T = any>(url: string, options: any = {}) => {
  const token = useCookie('token')
  const { $api } = useNuxtApp()

  const customHeaders: any = {
    ...options.headers,
    Accept: 'application/json',
  }

  if (token.value) {
    customHeaders.Authorization = `Bearer ${token.value}`
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

  return await $fetch<T>(url, {
    ...options,
    // credentials: 'include' penting untuk otentikasi berbasis cookie/sesi
    credentials: 'include',
    headers: customHeaders,
  })
}