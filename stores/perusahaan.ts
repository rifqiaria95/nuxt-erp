import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export interface Perusahaan {
  id: number
  nmPerusahaan: string
  npwpPerusahaan: string
  alamatPerusahaan: string
  createdAt: string
  updatedAt: string
}

interface PerusahaanState {
  perusahaans: Perusahaan[]
  loading: boolean
}

export const usePerusahaanStore = defineStore('perusahaan', {
  state: (): PerusahaanState => ({
    perusahaans: [],
    loading: false,
  }),
  actions: {
    async fetchPerusahaans() {
      if (this.perusahaans.length > 0) return; // Prevent re-fetching

      this.loading = true
      const { $api } = useNuxtApp()
      try {
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;
        const token = localStorage.getItem('token');


        if (!csrfToken) {
          throw new Error('CSRF token not found. Cannot proceed with request.');
        }

        const url = new URL($api.perusahaan())

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        const data = await response.json()
        // Pastikan data yang diterima adalah array sebelum melakukan map
        const perusahaanArr = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        this.perusahaans = perusahaanArr.map((item: any) => ({
          id              : item.id,
          nmPerusahaan    : item.nmPerusahaan,
          npwpPerusahaan  : item.npwpPerusahaan,
          alamatPerusahaan: item.alamatPerusahaan,
          createdAt       : item.createdAt,
          updatedAt       : item.updatedAt
        }))
      } catch (error) {
        console.error('Gagal mengambil data perusahaan:', error)
      } finally {
        this.loading = false
      }
    },
    getPerusahaanById(id: number): Perusahaan | undefined {
      return this.perusahaans.find(p => p.id === id)
    }
  },
})
