import { defineStore } from 'pinia'

export interface Perusahaan {
  id: number
  nm_perusahaan: string
  npwp_perusahaan: string
  alamat_perusahaan: string
}

interface PerusahaanState {
  perusahaan: Perusahaan[]
  loading: boolean
}

export const usePerusahaanStore = defineStore('perusahaan', {
    state: (): PerusahaanState => ({
    perusahaan: [],
    loading: false
  }),
  actions: {
    async fetchPerusahaan() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/perusahaan')
        const data = await response.json()
        this.perusahaan = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch perusahaan:', error)
      } finally {
        this.loading = false
      }
    },
    addPerusahaan(perusahaan: Perusahaan) {
        this.perusahaan.push(perusahaan) 
    },
    removePerusahaan(perusahaanId: number) {
        this.perusahaan = this.perusahaan.filter(perusahaan => perusahaan.id !== perusahaanId)
    },
    updatePerusahaan(updatedPerusahaan: Perusahaan) {
        const index = this.perusahaan.findIndex(perusahaan => perusahaan.id === updatedPerusahaan.id)
        if (index !== -1) {
            this.perusahaan[index] = updatedPerusahaan
        }
    },
    getPerusahaanByName(name: string): Perusahaan | undefined {
      return this.perusahaan.find(perusahaan => perusahaan.nm_perusahaan.toLowerCase() === name.toLowerCase())
    },
    getPerusahaanById(id: number): Perusahaan | undefined {
      return this.perusahaan.find(perusahaan => perusahaan.id === id)
    }
  }
})
