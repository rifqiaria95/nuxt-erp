import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  // Konfigurasi instance Axios
  const axiosInstance = axios.create({
    baseURL: 'http://localhost:3333',
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
        await axiosInstance.get('/csrf-token');
        return axiosInstance(originalRequest);
      }

      // Handle Unauthorized (401)
      if (error.response?.status === 401) {
        // Contoh: Redirect ke halaman login
        const router = useRouter();
        await router.push('/login');
      }

      return Promise.reject(error);
    }
  );

  // Inject instance Axios ke Nuxt context (nuxtApp.$axios)
  nuxtApp.provide('axios', axiosInstance);
});