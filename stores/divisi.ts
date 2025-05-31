import { defineStore } from 'pinia'

export interface Divisi {
  id: number
  nm_divisi: string
}

interface DivisiState {
  divisi: Divisi[]
  loading: boolean
}

export const useDivisiStore = defineStore('divisi', {
    state: (): DivisiState => ({
    divisi: [],
    loading: false
  }),
  actions: {
    async fetchJabatan() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/divisi')
        const data = await response.json()
        this.divisi = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch divisi:', error)
      } finally {
        this.loading = false
      }
    },

    addDivisi(divisi: Divisi) {
        this.divisi.push(divisi) 
    },
    removeDivisi(divisiId: number) {
        this.divisi = this.divisi.filter(divisi => divisi.id !== divisiId)
    },
    updateDivisi(updatedDivisi: Divisi) {
        const index = this.divisi.findIndex(divisi => divisi.id === updatedDivisi.id)
        if (index !== -1) {
            this.divisi[index] = updatedDivisi
        }
    },
    getDivisiByName(name: string): Divisi | undefined {
      return this.divisi.find(divisi => divisi.nm_divisi.toLowerCase() === name.toLowerCase())
    },
    getDivisiById(id: number): Divisi | undefined {
      return this.divisi.find(divisi => divisi.id === id)
    }
  }
})
