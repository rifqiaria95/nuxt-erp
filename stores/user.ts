import { defineStore } from 'pinia'
import type { User } from './userManagement'
import { useNuxtApp } from '#app'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | User,
    loading: false,
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    clearUser() {
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    async loadUser() {
      const token = localStorage.getItem('token')
      if (!token || this.user) return

      this.loading = true
      const { $api } = useNuxtApp()

      try {
        const response = await fetch($api.me(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
        if (!response.ok) {
          throw new Error('Gagal memuat data pengguna')
        }
        const userData = await response.json()
        this.setUser(userData)
      } catch (error) {
        console.error(error)
        this.clearUser()
      } finally {
        this.loading = false
      }
    },
  },
})