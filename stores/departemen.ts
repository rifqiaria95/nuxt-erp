import { defineStore } from 'pinia'

export interface Divisi {
  id: number
  nm_divisi: string
  createdAt: string
  updatedAt: string
}

export interface Departemen {
  id: number
  nm_departemen: string
  alamat_departemen: string
  divisiId: number
  createdAt: string
  updatedAt: string
  divisi?: Divisi
}

interface DepartemenState {
  departemen: Departemen[]
  loading: boolean
}

export const useDepartemenStore = defineStore('departemen', {
  state: (): DepartemenState => ({
    departemen: [],
    loading: false
  }),
  actions: {
    async fetchDepartemen() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/departemen')
        const data = await response.json()
        this.departemen = (data.data || data).map((item: any) => ({
          id: item.id,
          nm_departemen: item.nmDepartemen,
          alamat_departemen: item.alamatDepartemen,
          divisiId: item.divisiId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          divisi: item.divisi
            ? {
                id: item.divisi.id,
                nm_divisi: item.divisi.nmDivisi,
                createdAt: item.divisi.createdAt,
                updatedAt: item.divisi.updatedAt,
              }
            : undefined,
        }))
      } catch (error) {
        console.error('Gagal mengambil data departemen:', error)
      } finally {
        this.loading = false
      }
    },

    addDepartemen(departemen: Departemen) {
        this.departemen.push(departemen) 
    },
    removeDepartemen(departemenId: number) {
        this.departemen = this.departemen.filter(departemen => departemen.id !== departemenId)
    },
    updateDepartemen(updatedDepartemen: Departemen) {
        const index = this.departemen.findIndex(departemen => departemen.id === updatedDepartemen.id)
        if (index !== -1) {
            this.departemen[index] = updatedDepartemen
        }
    },
    getDepartemenByName(name: string): Departemen | undefined {
      return this.departemen.find(departemen => departemen.nm_departemen.toLowerCase() === name.toLowerCase())
    },
    getDepartemenById(id: number): Departemen | undefined {
      return this.departemen.find(departemen => departemen.id === id)
    }
  }
})
