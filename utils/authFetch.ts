export const authFetch = async <T = any>(endpoint: string, options: any = {}) => {
    const config = useRuntimeConfig()
    const baseUrl = config.public.authBase
    const accessToken = useCookie('token')
    const refreshToken = useCookie('refresh_token')
  
    try {
      return await $fetch<T>(`${baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...(accessToken.value ? { Authorization: `Bearer ${accessToken.value}` } : {}),
          ...options?.headers,
        },
      })
    } catch (error: any) {
      // cek kalau token expired
      if (error?.response?.status === 401 && refreshToken.value) {
        // refresh access token
        try {
          const { token: newAccessToken } = await $fetch<{ token: string }>(`${baseUrl}/refresh-token`, {
            method: 'POST',
            body: { refresh_token: refreshToken.value },
          })
  
          accessToken.value = newAccessToken
  
          // ulang request sebelumnya dengan token baru
          return await $fetch<T>(`${baseUrl}${endpoint}`, {
            ...options,
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              ...options?.headers,
            },
          })
        } catch (refreshError) {
          // Refresh gagal, paksa logout
          accessToken.value = null
          refreshToken.value = null
          throw new Error('Session expired. Please login again.')
        }
      }
  
      throw error
    }
  }
  