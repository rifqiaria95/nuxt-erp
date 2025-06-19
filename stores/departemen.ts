import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

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
  departemens: Departemen[]
  loading: boolean
}

export const useDepartemenStore = defineStore('departemen', {
  state: (): DepartemenState => ({
    departemens: [],
    loading: false,
  }),
  actions: {
    async fetchDepartemens() {
        if (this.departemens.length > 0) return;

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
            const response = await fetch($api.departemen(), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            })
            const result = await response.json()
            this.departemens = result.data || []
        } catch (error) {
            console.error('Gagal mengambil data departemen:', error)
        } finally {
            this.loading = false
        }
    },
    async fetchDepartemensByDivisi(divisiId: number) {
        if (!divisiId) {
            this.departemens = [];
        return;
        }
        try {
            const { $api } = useNuxtApp()
            const token = localStorage.getItem('token');
            const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.token;

            if (!csrfToken) {
                throw new Error('CSRF token not found. Cannot proceed with request.');
            }
            const response = await fetch($api.departemen() + `?divisi_id=${divisiId}`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                }
            });
            if (!response.ok) throw new Error('Gagal mengambil data departemen');
            const data = await response.json();
            if (Array.isArray(data)) {
                this.departemens = data;
            } else if (data && Array.isArray(data.data)) {
                this.departemens = data.data;
            } else {
                this.departemens = [];
            }
        } catch (error) {
            console.error('Error fetching departemen:', error);
            this.departemens = [];
        }
    },
    addDepartemen(departemen: Departemen) {
        this.departemens.push(departemen) 
    },
    removeDepartemen(departemenId: number) {
        this.departemens = this.departemens.filter(departemen => departemen.id !== departemenId)
    },
    updateDepartemen(updatedDepartemen: Departemen) {
        const index = this.departemens.findIndex(departemen => departemen.id === updatedDepartemen.id)
        if (index !== -1) {
            this.departemens[index] = updatedDepartemen
        }
    },
    getDepartemenByName(name: string): Departemen | undefined {
      return this.departemens.find(departemen => departemen.nm_departemen.toLowerCase() === name.toLowerCase())
    },
    getDepartemenById(id: number): Departemen | undefined {
      return this.departemens.find(departemen => departemen.id === id)
    }
  }
})
