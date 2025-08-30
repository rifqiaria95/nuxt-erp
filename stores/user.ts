import { defineStore } from 'pinia'
import type { User } from './userManagement'
import type { Permission } from './permissions'
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
      return state.user.roles.flatMap(role => {
        if (!role.permissions) return []
        return role.permissions.map(p => {
          if (typeof p === 'object' && p !== null && 'name' in p) {
            return (p as Permission).name
          }
          return null
        }).filter(Boolean)
      })
    },
    
    // Fungsi untuk mengecek apakah user memiliki permission tertentu
    hasPermission: (state) => (permissionName: string) => {
      if (!state.user || !state.user.roles) return false
      return state.user.roles.some(role => 
        role.permissions?.some(permission => {
          if (typeof permission === 'object' && permission !== null && 'name' in permission) {
            return (permission as Permission).name === permissionName
          }
          return false
        })
      )
    },
    
    // Fungsi untuk mengecek apakah user memiliki salah satu dari permission yang diberikan
    hasAnyPermission: (state) => (permissionNames: string[]) => {
      if (!state.user || !state.user.roles) return false
      return permissionNames.some(permissionName => 
        state.user!.roles.some(role => 
          role.permissions?.some(permission => {
            if (typeof permission === 'object' && permission !== null && 'name' in permission) {
              return (permission as Permission).name === permissionName
            }
            return false
          })
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
      // Hapus kredensial yang tersimpan untuk remember me
      localStorage.removeItem('rememberedCredentials')
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