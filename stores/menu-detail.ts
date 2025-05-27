import { defineStore } from 'pinia'

export interface MenuGroup {
  id: number
  name: string
  icon: string
  order: number
  jenisMenu: number
  createdAt: string
  updatedAt: string
}

export interface MenuDetail {
  id: number
  name: string
  route: string
  status: number
  order: number
  menuGroupId: number
  createdAt: string
  updatedAt: string
  menuGroup?: MenuGroup
}

interface MenuDetailsState {
  menuDetails: MenuDetail[]
  loading: boolean
}

export const useMenuDetailsStore = defineStore('menuDetails', {
  state: (): MenuDetailsState => ({
    menuDetails: [],
    loading: false
  }),
  actions: {
    async fetchMenuDetails() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/menu-details')
        const data = await response.json()
        this.menuDetails = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch menu details:', error)
      } finally {
        this.loading = false
      }
    },

    getMenuDetailByName(name: string): MenuDetail | undefined {
      return this.menuDetails.find(detail => detail.name.toLowerCase() === name.toLowerCase())
    },

    getMenuDetailById(id: number): MenuDetail | undefined {
      return this.menuDetails.find(detail => detail.id === id)
    }
  }
})
