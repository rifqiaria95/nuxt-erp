import { defineStore } from 'pinia'

export interface Permission {
    id: number
    name: string
    description?: string
}

interface PermissionsState {
    permissions: Permission[]
    loading: boolean
}

export const usePermissionsStore = defineStore('permissions', {
    state: (): PermissionsState => ({
        permissions: [],
        loading: false,
    }),
    actions: {
        async fetchPermissions() {
            this.loading = true
            try {
                const { $api } = useNuxtApp()
                const token = localStorage.getItem('token')

                const response = await fetch($api.permissions(), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    credentials: 'include',
                })

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} saat mengambil permissions`)
                }

                const data = await response.json()
                this.permissions = data?.data ?? []
            } catch (error) {
                console.error('Failed to fetch permissions:', error)
            } finally {
                this.loading = false
            }
        },
        addPermission(permission: Permission) {
            this.permissions.push(permission) 
        },
        removePermission(permissionId: number) {
            this.permissions = this.permissions.filter(permission => permission.id !== permissionId)
        },
        updatePermission(updatedPermission: Permission) {
            const index = this.permissions.findIndex(permission => permission.id === updatedPermission.id)
            if (index !== -1) {
                this.permissions[index] = updatedPermission
            }
        }
    },
})