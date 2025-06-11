import { defineStore } from 'pinia'

export interface Category {
  id: number
  name: string
  description: string
}

interface KategoriState {
  kategori: Category[]
  loading: boolean
}

export const useKategoriStore = defineStore('kategori', {
    state: (): KategoriState => ({
    kategori: [],
    loading: false
  }),
  actions: {
    async fetchKategori() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/categories')
        const data = await response.json()
        this.kategori = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch kategori:', error)
      } finally {
        this.loading = false
      }
    },

    addKategori(kategori: Category) {
        this.kategori.push(kategori) 
    },
    removeKategori(kategoriId: number) {
        this.kategori = this.kategori.filter(kategori => kategori.id !== kategoriId)
    },
    updateKategori(updatedKategori: Category) {
        const index = this.kategori.findIndex(kategori => kategori.id === updatedKategori.id)
        if (index !== -1) {
            this.kategori[index] = updatedKategori
        }
    },
    getKategoriByName(name: string): Category | undefined {
      return this.kategori.find(kategori => kategori.name.toLowerCase() === name.toLowerCase())
    },
    getKategoriById(id: number): Category | undefined {
      return this.kategori.find(kategori => kategori.id === id)
    }
  }
})
