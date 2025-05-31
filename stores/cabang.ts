import { defineStore } from 'pinia'

export interface Perusahaan {
  id: number
  nm_perusahaan: string
  npwp_perusahaan: string
  alamat_perusahaan: string
  createdAt: string
  updatedAt: string
}

export interface Cabang {
  id: number
  nm_cabang: string
  alamat_cabang: string
  perusahaanId: number
  createdAt: string
  updatedAt: string
  perusahaan?: Perusahaan
}

interface CabangState {
  cabang: Cabang[]
  loading: boolean
}

export const useCabangStore = defineStore('cabang', {
  state: (): CabangState => ({
    cabang: [],
    loading: false
  }),
  actions: {
    async fetchCabang() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/cabang')
        const data = await response.json()
        this.cabang = (data.data || data).map((item: any) => ({
          id: item.id,
          nm_cabang: item.nmCabang,
          alamat_cabang: item.alamatCabang,
          perusahaanId: item.perusahaanId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          perusahaan: item.perusahaan
            ? {
                id: item.perusahaan.id,
                nm_perusahaan: item.perusahaan.nmPerusahaan,
                npwp_perusahaan: item.perusahaan.npwpPerusahaan,
                alamat_perusahaan: item.perusahaan.alamatPerusahaan,
                createdAt: item.perusahaan.createdAt,
                updatedAt: item.perusahaan.updatedAt,
              }
            : undefined,
        }))
      } catch (error) {
        console.error('Gagal mengambil data cabang:', error)
      } finally {
        this.loading = false
      }
    },

    addCabang(cabang: Cabang) {
        this.cabang.push(cabang) 
    },
    removeCabang(cabangId: number) {
        this.cabang = this.cabang.filter(cabang => cabang.id !== cabangId)
    },
    updateCabang(updatedCabang: Cabang) {
        const index = this.cabang.findIndex(cabang => cabang.id === updatedCabang.id)
        if (index !== -1) {
            this.cabang[index] = updatedCabang
        }
    },
    getCabangByName(name: string): Cabang | undefined {
      return this.cabang.find(cabang => cabang.nm_cabang.toLowerCase() === name.toLowerCase())
    },
    getCabangById(id: number): Cabang | undefined {
      return this.cabang.find(cabang => cabang.id === id)
    }
  }
})
