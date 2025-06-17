import { defineStore } from 'pinia'

export interface CustomerProduct {
  productId: number | null
  priceSell: number
}

export interface Customer {
  id?: number
  name: string
  address: string
  email: string
  phone: string
  npwp: string
  logo: string | File
  customerProducts?: CustomerProduct[]
}

interface CustomerState {
  customer: Customer[]
  selectedCustomer: Customer | null
  loading: boolean
}

export const useCustomerStore = defineStore('customer', {
    state: (): CustomerState => ({
    customer: [],
    selectedCustomer: null,
    loading: false
  }),
  actions: {
    async fetchCustomer() {
      this.loading = true
      try {
        const { $api } = useNuxtApp()
        const url = `${$api.customer()}`
        const response = await fetch(url)
        const data = await response.json()
        this.customer = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch customer:', error)
      } finally {
        this.loading = false
      }
    },
    async saveUpdateCustomer(customer: Customer) {
      try {
        this.loading = true

        const { $api } = useNuxtApp()
        const url      = customer.id ? `${$api.customer()}/${customer.id}` : $api.customer()
        const method   = 'POST'

        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' })
        const csrfData     = await csrfResponse.json()
        const csrfToken    = csrfData.token
        const token        = localStorage.getItem('token')

        if (!token) {
          throw new Error('Authentication token not found.')
        }

        if (!csrfToken) {
          throw new Error('CSRF token not found. Cannot proceed with request.')
        }

        const formData = new FormData()
        formData.append('name', customer.name)
        formData.append('email', customer.email)
        formData.append('phone', customer.phone)
        formData.append('address', customer.address)
        formData.append('npwp', customer.npwp)

        if (customer.logo && customer.logo instanceof File) {
          formData.append('logo', customer.logo)
        }

        if (customer.customerProducts && customer.customerProducts.length > 0) {
          customer.customerProducts.forEach((item, index) => {
            if (item.productId) {
              formData.append(`customerProducts[${index}][productId]`, String(item.productId))
            }
            formData.append(`customerProducts[${index}][priceSell]`, String(item.priceSell))
          })
        }

        const response = await fetch(url, {
          method: method,
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken || '',
            Accept: 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw { response, errorData }
        }

        return await response.json()
      } catch (error) {
        console.error('Failed to save customer:', error)
        throw error // Re-throw to be caught in the component
      } finally {
        this.loading = false
      }
    },
    removeCustomer(customerId: number) {
        this.customer = this.customer.filter(customer => customer.id !== customerId)
    },
    async getCustomerDetails(customerId: string) {
      try {
        this.loading = true
        const { $api } = useNuxtApp()
        const url = `${$api.getCustomerDetails(customerId)}`
        const token = localStorage.getItem('token')

        const response = await fetch(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        })

        if (!response.ok) {
          const errorBody = await response.text()
          throw new Error(
            `Failed to fetch customer details! status: ${response.status}. Response: ${errorBody}`
          )
        }

        const resData = await response.json()

        if (resData) {
          this.selectedCustomer = resData
        } else {
          throw new Error('Invalid data structure received from getCustomerDetails API.')
        }
      } catch (e) {
        console.error('Error fetching customer details:', e)
      } finally {
        this.loading = false
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
