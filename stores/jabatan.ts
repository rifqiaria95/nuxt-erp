import { defineStore } from 'pinia'
import { apiFetch } from '~/utils/apiFetch'

export interface Jabatan {
  id: number
  nmJabatan: string
  createdAt: string
  updatedAt: string
}

interface JabatanState {
  jabatans: Jabatan[]
  loading: boolean
}

export const useJabatanStore = defineStore('jabatan', {
  state: (): JabatanState => ({
    jabatans: [],
    loading: false,
  }),
  actions: {
    async fetchJabatans() {
      if (this.jabatans.length > 0) return; 

      this.loading = true
      const { $api } = useNuxtApp()
      const token = localStorage.getItem('token');
      const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
      const csrfData = await csrfResponse.json();
      const csrfToken = csrfData.token;

      if (!csrfToken) {
        throw new Error('CSRF token not found. Cannot proceed with request.');
      }
      try {
        const response = await fetch($api.jabatan(), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        })
        const result = await response.json()
        this.jabatans = result.data || []
      } catch (error) {
        console.error('Gagal mengambil data jabatan:', error)
      } finally {
        this.loading = false
      }
    },

    addJabatan(jabatan: Jabatan) {
        this.jabatans.push(jabatan) 
    },
    removeJabatan(jabatanId: number) {
        this.jabatans = this.jabatans.filter(jabatan => jabatan.id !== jabatanId)
    },
    updateJabatan(updatedJabatan: Jabatan) {
        const index = this.jabatans.findIndex(jabatan => jabatan.id === updatedJabatan.id)
        if (index !== -1) {
            this.jabatans[index] = updatedJabatan
        }
    },
    getJabatanByName(name: string): Jabatan | undefined {
      return this.jabatans.find(jabatan => jabatan.nmJabatan.toLowerCase() === name.toLowerCase())
    },
    getJabatanById(id: number): Jabatan | undefined {
      return this.jabatans.find(jabatan => jabatan.id === id)
    }
  }
})
