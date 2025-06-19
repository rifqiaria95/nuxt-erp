import { defineStore } from 'pinia'

export interface Warehouse {
  id: number
  name: string
  address: string
  code: string
  phone: string
  email: string
}

interface WarehouseState {
  warehouse: Warehouse[]
  loading: boolean
}

export const useWarehouseStore = defineStore('warehouse', {
    state: (): WarehouseState => ({
    warehouse: [],
    loading: false
  }),
  actions: {
    async fetchWarehouse() {
      this.loading = true
      try {
        const { $api } = useNuxtApp();
        const url = `${$api.warehouse()}`;
        const token = localStorage.getItem('token');

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include'
        });
        const data = await response.json()
        this.warehouse = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch warehouse:', error)
      } finally {
        this.loading = false
      }
    },
    addWarehouse(warehouse: Warehouse) {
        this.warehouse.push(warehouse) 
    },
    removeWarehouse(warehouseId: number) {
        this.warehouse = this.warehouse.filter(warehouse => warehouse.id !== warehouseId)
    },
    updateWarehouse(updatedWarehouse: Warehouse) {
        const index = this.warehouse.findIndex(warehouse => warehouse.id === updatedWarehouse.id)
        if (index !== -1) {
            this.warehouse[index] = updatedWarehouse
        }
    },
    getWarehouseByName(name: string): Warehouse | undefined {
      return this.warehouse.find(warehouse => warehouse.name.toLowerCase() === name.toLowerCase())
    },
    getWarehouseById(id: number): Warehouse | undefined {
      return this.warehouse.find(warehouse => warehouse.id === id)
    }
  }
})
