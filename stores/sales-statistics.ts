import { defineStore } from 'pinia'

interface SalesStatistics {
  lastMonth: {
    total: number
    performance: number
  }
  thisWeek: {
    total: number
    performance: number
  }
  today: {
    total: number
  }
  weeklyData: Array<{
    week: string
    amount: number
    dateRange: string
  }>
  performance: {
    monthly: number
    weekly: number
  }
}

interface SalesStatisticsState {
  statistics: SalesStatistics | null
  loading: boolean
  error: string | null
}

export const useSalesStatisticsStore = defineStore('salesStatistics', {
  state: (): SalesStatisticsState => ({
    statistics: null,
    loading: false,
    error: null
  }),

  getters: {
    formattedLastMonthTotal: (state) => {
      if (!state.statistics) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(state.statistics.lastMonth.total)
    },

    formattedThisWeekTotal: (state) => {
      if (!state.statistics) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(state.statistics.thisWeek.total)
    },

    formattedTodayTotal: (state) => {
      if (!state.statistics) return 'Rp 0'
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(state.statistics.today.total)
    },

    formattedLastMonthPerformance: (state) => {
      if (!state.statistics) return '0%'
      const value = state.statistics.lastMonth.performance
      const sign = value >= 0 ? '+' : ''
      return `${sign}${value.toFixed(2)}%`
    },

    formattedThisWeekPerformance: (state) => {
      if (!state.statistics) return '0%'
      const value = state.statistics.thisWeek.performance
      const sign = value >= 0 ? '+' : ''
      return `${sign}${value.toFixed(2)}%`
    },

    performanceColor: (state) => {
      if (!state.statistics) return 'text-muted'
      const value = state.statistics.performance.monthly
      if (value > 0) return 'text-success'
      if (value < 0) return 'text-danger'
      return 'text-muted'
    },

    weeklyPerformanceColor: (state) => {
      if (!state.statistics) return 'text-muted'
      const value = state.statistics.performance.weekly
      if (value > 0) return 'text-success'
      if (value < 0) return 'text-danger'
      return 'text-muted'
    }
  },

  actions: {
    async fetchSalesStatistics() {
      this.loading = true
      this.error = null
      
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')
        
        const response = await fetch($api.salesOrderStatistics(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data statistik penjualan')
        }

        const result = await response.json()
        this.statistics = result
      } catch (error: any) {
        console.error('Error fetching sales statistics:', error)
        this.error = error.message || 'Gagal mengambil data statistik penjualan'
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

    async refreshStatistics() {
      await this.fetchSalesStatistics()
    }
  }
})
