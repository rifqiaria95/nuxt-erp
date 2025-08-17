import { defineStore } from 'pinia'

type UserSession = {
  id: number
  userId: number
  sessionId: string
  ipAddress: string
  userAgent: string
  deviceType: string
  isActive: boolean
  lastActivity: string
  loginAt: string
  logoutAt: string | null
  user: {
    id: number
    email: string
    fullName: string
  }
}

export const useUserSessionStore = defineStore('userSession', {
  state: () => ({
    activeUsers: [] as UserSession[],
    loading: false,
    error: null as string | null,
    // Pagination state
    displayedCount: 3, // Jumlah user yang ditampilkan
    showLoadMore: false, // Apakah tombol load more ditampilkan
    isExpanded: false, // Apakah data sudah di-expand semua
  }),

  getters: {
    totalActiveUsers: (state) => state.activeUsers.length,
    
    activeUsersByDevice: (state) => {
      const deviceCount = {
        desktop: 0,
        mobile: 0,
        tablet: 0,
      }
      
      state.activeUsers.forEach(session => {
        if (deviceCount[session.deviceType as keyof typeof deviceCount] !== undefined) {
          deviceCount[session.deviceType as keyof typeof deviceCount]++
        }
      })
      
      return deviceCount
    },

    recentActiveUsers: (state) => {
      const sortedUsers = state.activeUsers
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
      
      // Update showLoadMore berdasarkan jumlah data
      state.showLoadMore = sortedUsers.length > state.displayedCount
      
      // Update isExpanded jika semua data sudah ditampilkan
      state.isExpanded = state.displayedCount >= sortedUsers.length
      
      return sortedUsers.slice(0, state.displayedCount)
    },

    hasMoreUsers: (state) => {
      return state.activeUsers.length > state.displayedCount
    },

    isFullyExpanded: (state) => {
      return state.displayedCount >= state.activeUsers.length
    }
  },

  actions: {
    // Load more users
    loadMoreUsers() {
      this.displayedCount += 3
    },

    // Show less users (collapse back to initial state)
    showLessUsers() {
      this.displayedCount = 3
    },

    // Reset pagination
    resetPagination() {
      this.displayedCount = 3
    },

    async fetchActiveUsers() {
      this.loading = true
      this.error = null
      
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        console.log('Fetching from API:', $api.userSessionsActiveUsers())
        console.log('Token:', token ? 'Available' : 'Not available')

        const response = await $fetch<{ success: boolean; data: UserSession[] }>($api.userSessionsActiveUsers(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
        })

        console.log('Raw API Response:', response)

        if (response.success) {
          console.log('API Response success:', response)
          console.log('Active users data:', response.data)
          console.log('Data length:', response.data?.length || 0)
          
          this.activeUsers = response.data || []
          console.log('Store activeUsers after update:', this.activeUsers)
          console.log('Store activeUsers length:', this.activeUsers.length)
          
          // Reset pagination saat refresh data
          this.resetPagination()
        } else {
          console.error('API Response not successful:', response)
          this.error = 'Response tidak berhasil'
        }
      } catch (error: any) {
        console.error('Error fetching active users:', error)
        console.error('Error details:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          data: error.data
        })
        this.error = error.message || 'Gagal mengambil data user aktif'
      } finally {
        this.loading = false
      }
    },

    async forceLogoutUser(sessionId: string) {
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        await $fetch($api.userSessionsForceLogout(sessionId), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
        })

        // Refresh data setelah force logout
        await this.fetchActiveUsers()
      } catch (error: any) {
        console.error('Error force logout user:', error)
        throw error
      }
    },

    async cleanupExpiredSessions() {
      try {
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token')

        await $fetch($api.userSessionsCleanupExpired(), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
        })

        // Refresh data setelah cleanup
        await this.fetchActiveUsers()
      } catch (error: any) {
        console.error('Error cleanup expired sessions:', error)
        throw error
      }
    }
  },
})
