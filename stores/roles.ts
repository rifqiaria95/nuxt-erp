import { defineStore } from 'pinia'

export interface Role {
    id: number
    name: string
    description?: string
}

interface RolesState {
    roles: Role[]
    loading: boolean
}

export const useRolesStore = defineStore('roles', {
    state: (): RolesState => ({
        roles: [],
        loading: false,
    }),
    actions: {
        async fetchRoles() {
            this.loading = true
            try {
                const response = await fetch('http://localhost:3333/api/roles')
                const data = await response.json()
                this.roles = data.data // Ambil array data saja
            } catch (error) {
                console.error('Failed to fetch roles:', error)
            } finally {
                this.loading = false
            }
        },
        addRole(role: Role) {
            this.roles.push(role)
        },
        removeRole(roleId: number) {
            this.roles = this.roles.filter(role => role.id !== roleId)
        },
        updateRole(updatedRole: Role) {
            const index = this.roles.findIndex(role => role.id === updatedRole.id)
            if (index !== -1) {
                this.roles[index] = updatedRole
            }
        }
    },
})