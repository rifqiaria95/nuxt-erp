import { defineStore } from 'pinia'

export interface Jabatan {
  id_jabatan: number
  nm_jabatan: string
}

interface JabatanState {
  jabatan: Jabatan[]
  loading: boolean
}

export const useJabatanStore = defineStore('jabatan', {
    state: (): JabatanState => ({
    jabatan: [],
    loading: false
  }),
  actions: {
    async fetchJabatan() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/jabatan')
        const data = await response.json()
        this.jabatan = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch jabatan:', error)
      } finally {
        this.loading = false
      }
    },

    addJabatan(jabatan: Jabatan) {
        this.jabatan.push(jabatan) 
    },
    removeJabatan(jabatanId: number) {
        this.jabatan = this.jabatan.filter(jabatan => jabatan.id_jabatan !== jabatanId)
    },
    updateJabatan(updatedJabatan: Jabatan) {
        const index = this.jabatan.findIndex(jabatan => jabatan.id_jabatan === updatedJabatan.id_jabatan)
        if (index !== -1) {
            this.jabatan[index] = updatedJabatan
        }
    },
    getJabatanByName(name: string): Jabatan | undefined {
      return this.jabatan.find(jabatan => jabatan.nm_jabatan.toLowerCase() === name.toLowerCase())
    },
    getJabatanById(id: number): Jabatan | undefined {
      return this.jabatan.find(jabatan => jabatan.id_jabatan === id)
    }
  }
})
