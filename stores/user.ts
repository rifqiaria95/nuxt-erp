import { defineStore } from 'pinia'

export interface Role {
  id: number;
  name: string;
}

export interface User {
  id        : number
  fullName  : string
  createdAt : string
  updatedAt : string
  approvedAt: string | null
  receivedAt: string | null
  roles: Role[]
}

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