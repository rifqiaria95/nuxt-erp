import { defineStore } from 'pinia'

export interface Vendor {
  id: number
  name: string
  address: string
  email: string
  phone: string
  npwp: string
  logo: string
}

interface VendorState {
  vendor: Vendor[]
  loading: boolean
}

export const useVendorStore = defineStore('vendor', {
    state: (): VendorState => ({
    vendor: [],
    loading: false
  }),
  actions: {
    async fetchVendor() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/vendor')
        const data = await response.json()
        this.vendor = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch vendor:', error)
      } finally {
        this.loading = false
      }
    },
    addVendor(vendor: Vendor) {
        this.vendor.push(vendor) 
    },
    removeVendor(vendorId: number) {
        this.vendor = this.vendor.filter(vendor => vendor.id !== vendorId)
    },
    updateVendor(updatedVendor: Vendor) {
        const index = this.vendor.findIndex(vendor => vendor.id === updatedVendor.id)
        if (index !== -1) {
            this.vendor[index] = updatedVendor
        }
    },
    getVendorByName(name: string): Vendor | undefined {
      return this.vendor.find(vendor => vendor.name.toLowerCase() === name.toLowerCase())
    },
    getVendorById(id: number): Vendor | undefined {
      return this.vendor.find(vendor => vendor.id === id)
    }
  }
})
