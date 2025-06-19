import { defineStore } from 'pinia'

export interface Divisi {
  id: number
  nmDivisi: string
  createdAt: string
  updatedAt: string
}

interface DivisiState {
  divisis: Divisi[]
  loading: boolean
}

export const useDivisiStore = defineStore('divisi', {
  state: (): DivisiState => ({
    divisis: [],
    loading: false,
  }),
  actions: {
    async fetchDivisis() {
      if (this.divisis.length > 0) return;

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
        const response = await fetch($api.divisi(), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
          },
        })
        const result = await response.json()
        this.divisis = result.data || []
      } catch (error) {
        console.error('Gagal mengambil data divisi:', error)
      } finally {
        this.loading = false
      }
    },

    addDivisi(divisi: Divisi) {
        this.divisis.push(divisi) 
    },
    removeDivisi(divisiId: number) {
        this.divisis = this.divisis.filter(divisi => divisi.id !== divisiId)
    },
    updateDivisi(updatedDivisi: Divisi) {
        const index = this.divisis.findIndex(divisi => divisi.id === updatedDivisi.id)
        if (index !== -1) {
            this.divisis[index] = updatedDivisi
        }
    },
    getDivisiByName(name: string): Divisi | undefined {
      return this.divisis.find(divisi => divisi.nmDivisi.toLowerCase() === name.toLowerCase())
    },
    getDivisiById(id: number): Divisi | undefined {
      return this.divisis.find(divisi => divisi.id === id)
    }
  }
})
