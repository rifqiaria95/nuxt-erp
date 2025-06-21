import { defineStore } from 'pinia'
import type { User } from './userManagement'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as null | User
  }),
  actions: {
    setUser(user: any) {
      this.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearUser() {
      this.user = null
      localStorage.removeItem('user')
    },
    loadUser() {
      const userStr = localStorage.getItem('user')
      this.user = userStr ? JSON.parse(userStr) : null
    }
  }
})