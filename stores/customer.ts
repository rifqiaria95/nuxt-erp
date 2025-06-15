import { defineStore } from 'pinia'

export interface Customer {
  id: number
  name: string
  address: string
  email: string
  phone: string
  npwp: string
  logo: string
}

interface CustomerState {
  customer: Customer[]
  loading: boolean
}

export const useCustomerStore = defineStore('customer', {
    state: (): CustomerState => ({
    customer: [],
    loading: false
  }),
  actions: {
    async fetchCustomer() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/customer')
        const data = await response.json()
        this.customer = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch customer:', error)
      } finally {
        this.loading = false
      }
    },
    addCustomer(customer: Customer) {
        this.customer.push(customer) 
    },
    removeCustomer(customerId: number) {
        this.customer = this.customer.filter(customer => customer.id !== customerId)
    },
    updateCustomer(updatedCustomer: Customer) {
        const index = this.customer.findIndex(customer => customer.id === updatedCustomer.id)
        if (index !== -1) {
            this.customer[index] = updatedCustomer
        }
    },
    getCustomerByName(name: string): Customer | undefined {
      return this.customer.find(customer => customer.name.toLowerCase() === name.toLowerCase())
    },
    getCustomerById(id: number): Customer | undefined {
      return this.customer.find(customer => customer.id === id)
    }
  }
})
