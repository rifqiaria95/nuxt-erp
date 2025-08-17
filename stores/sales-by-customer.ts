import { defineStore } from 'pinia'

interface CustomerSales {
  customer: string
  sales: number
  color: string
  percentage: string
}

interface SalesByCustomerData {
  totalSales: number
  customers: CustomerSales[]
}

interface SalesByCustomerState {
  data: SalesByCustomerData | null
  loading: boolean
  error: string | null
}

export const useSalesByCustomerStore = defineStore('salesByCustomer', {
  state: (): SalesByCustomerState => ({
    data: null,
    loading: false,
    error: null
  }),

  getters: {
    formattedTotalSales: (state) => {
      if (!state.data) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(state.data.totalSales)
    },

    chartData: (state) => {
      if (!state.data?.customers) return []
      return state.data.customers.map(customer => ({
        label: customer.customer,
        value: customer.sales,
        color: customer.color,
        percentage: customer.percentage
      }))
    },

    maxSales: (state) => {
      if (!state.data?.customers || state.data.customers.length === 0) return 0
      return Math.max(...state.data.customers.map(c => c.sales))
    }
  },

  actions: {
    async fetchSalesByCustomer() {
      this.loading = true
      this.error = null
      
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')
        
        const response = await fetch($api.salesOrderSalesByCustomer(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data penjualan berdasarkan customer')
        }

        const result = await response.json()
        this.data = result
      } catch (error: any) {
        console.error('Error fetching sales by customer:', error)
        this.error = error.message || 'Gagal mengambil data penjualan berdasarkan customer'
        const toast = useToast()
        toast.error({
          title: 'Error',
          message: this.error,
          color: 'red'
        })
      } finally {
        this.loading = false
      }
    },

    async refreshData() {
      await this.fetchSalesByCustomer()
    }
  }
})
