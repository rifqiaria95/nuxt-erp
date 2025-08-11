import { defineStore } from 'pinia'
import type { User } from './userManagement'
import { useNuxtApp } from '#app'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | User,
    loading: false,
  }),
  getters: {
    // Mendapatkan semua permission user dari semua role
    userPermissions: (state) => {
      if (!state.user || !state.user.roles) return []
      return state.user.roles.flatMap(role => role.permissions || []).map(p => p.name)
    },
    
    // Fungsi untuk mengecek apakah user memiliki permission tertentu
    hasPermission: (state) => (permissionName: string) => {
      if (!state.user || !state.user.roles) return false
      return state.user.roles.some(role => 
        role.permissions?.some(permission => permission.name === permissionName)
      )
    },
    
    // Fungsi untuk mengecek apakah user memiliki salah satu dari permission yang diberikan
    hasAnyPermission: (state) => (permissionNames: string[]) => {
      if (!state.user || !state.user.roles) return false
      return permissionNames.some(permissionName => 
        state.user!.roles.some(role => 
          role.permissions?.some(permission => permission.name === permissionName)
        )
      )
    }
  },
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