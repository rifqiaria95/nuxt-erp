export const apiFetch = async <T = any>(endpoint: string, options: any = {}) => {
    const config = useRuntimeConfig()
    // Sinkronkan baseUrl dengan .env dan nuxt.config.ts
    const baseUrl = config.public.apiBase
    const token = useCookie('token')

    // Pastikan endpoint tidak double slash
    let url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    return await $fetch<T>(`${baseUrl}${url}`, {
      ...options,
      headers: {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...options?.headers,
      },
    })
}