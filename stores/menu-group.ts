import { defineStore } from 'pinia'

export const useMenuGroupsStore = defineStore('menuGroups', {
  state: () => ({
    menuGroups: [] as Array<any>,
    loading: false,
    error: null as string | null,
    meta: null as any,
  }),
  actions: {
    async fetchMenuGroups() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('token')
        const response = await $fetch('http://localhost:3333/api/menu-groups', {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }) as any
        // Ambil array menu group dari response.data
        this.menuGroups = response.data
        this.meta = response.meta
      } catch (e: any) {
        this.error = e?.data?.message || e.message || 'Gagal mengambil data menu groups'
      } finally {
        this.loading = false
      }
    },
    setMenuGroups(menuGroups: any[]) {
      this.menuGroups = menuGroups
    },
    clearMenuGroups() {
      this.menuGroups = []
    }
  }
})