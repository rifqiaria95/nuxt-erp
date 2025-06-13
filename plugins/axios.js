import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBase || 'http://localhost:3333';

  // Konfigurasi instance Axios
  const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  // Interceptor Request: Tambahkan header CSRF token otomatis
  axiosInstance.interceptors.request.use((config) => {
    // Hanya tambahkan header untuk method non-GET (POST/PUT/DELETE)
    if (['post', 'put', 'delete'].includes(config.method?.toLowerCase())) {
      const csrfToken = useCookie('XSRF-TOKEN').value;
      if (csrfToken) {
        config.headers['X-XSRF-TOKEN'] = csrfToken;
      }
    }
    return config;
  });

  // Interceptor Response: Handle error CSRF (419) dan 401 (Unauthorized)
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle CSRF Token Expired (419)
      if (error.response?.status === 419 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          // Gunakan apiFetch untuk mendapatkan CSRF token
          const response = await $fetch('/auth/api/csrf-token', {
            baseURL,
            credentials: 'include'
          });
          
          if (response && response.token) {
            const csrfToken = response.token;
            useCookie('XSRF-TOKEN').value = csrfToken;
            originalRequest.headers['X-XSRF-TOKEN'] = csrfToken;
          }
          return axiosInstance(originalRequest);
        } catch (csrfError) {
          console.error('Gagal mendapatkan CSRF token:', csrfError);
          return Promise.reject(csrfError);
        }
      }

      // Handle Unauthorized (401)
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        const router = useRouter();
        await router.push('/auth/login');
      }

      return Promise.reject(error);
    }
  );

  // Inject instance Axios ke Nuxt context (nuxtApp.$axios)
  nuxtApp.provide('axios', axiosInstance);
});