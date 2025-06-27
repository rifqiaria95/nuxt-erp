import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

export interface Permission {
  id: number
  name: string
}

export interface Role {
  id: number
  name: string
  permissions?: Permission[] | number[]
}

interface RolesState {
    roles: Role[]
    permissions: Permission[]
    loading: boolean
    error: any
    totalRecords: number
    params: {
        first: number
        rows: number
        sortField: string | null
        sortOrder: number | null
        search: string
    }
    form: {
        id?: number;
        name: string;
        permissionIds: number[];
    }
    isEditMode: boolean
    showModal: boolean
    validationErrors: any[]
}

export const useRolesStore = defineStore('roles', {
    state: (): RolesState => ({
        roles: [],
        permissions: [],
        loading: true,
        error: null,
        totalRecords: 0,
        params: {
            first: 0,
            rows: 10,
            sortField: 'id',
            sortOrder: 1,
            search: '',
        },
        form: {
            name: '',
            permissionIds: [],
        },
        isEditMode: false,
        showModal: false,
        validationErrors: [],
    }),
    actions: {
        async fetchRoles() {
            this.loading = true
            this.error = null
            const { $api } = useNuxtApp()
            try {
                const queryParams = new URLSearchParams({
                    draw: '1',
                    start: this.params.first.toString(),
                    length: this.params.rows.toString(),
                    'search[value]': this.params.search || '',
                });
                
                const token = localStorage.getItem('token');
                const response = await fetch(`${$api.roles()}?${queryParams.toString()}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Gagal mengambil data roles');
                }

                const result = await response.json();
                this.roles = result.data || [];
                this.totalRecords = Number(result.recordsFiltered) || 0;

            } catch (e: any) {
                this.error = e.message;
                Swal.fire('Error', `Tidak dapat memuat data roles: ${e.message}`, 'error');
            } finally {
                this.loading = false;
            }
        },

        async fetchPermissions() {
            const { $api } = useNuxtApp()
            const token = localStorage.getItem('token');
            try {
                const res = await fetch($api.getPermissions(), {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!res.ok) {
                    throw new Error(`HTTP Error fetching all permissions: ${res.status}`);
                }
                const apiResponse = await res.json();
                this.permissions = apiResponse.data || apiResponse || [];
            } catch (error: any) {
                this.permissions = [];
                Swal.fire('Error', `Gagal memuat permissions: ${error.message}`, 'error');
            }
        },

        async saveRole() {
            this.loading = true;
            this.validationErrors = [];
            const { $api } = useNuxtApp();

            try {
                const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
                const csrfData = await csrfResponse.json();
                const csrfToken = csrfData.token;
                const token = localStorage.getItem('token');

                if (!csrfToken) {
                    throw new Error('CSRF token tidak ditemukan.');
                }

                let url = $api.roleStore();
                let method = 'POST';

                if (this.isEditMode && this.form.id) {
                    url = $api.roleUpdate(this.form.id);
                    method = 'PUT';
                }
                
                const payload = {
                    name: this.form.name,
                    permissionIds: this.form.permissionIds.filter(id => typeof id === 'number' && id > 0),
                };

                const response = await fetch(url, {
                    method,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload),
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 422 || errorData.errors) {
                        this.validationErrors = Array.isArray(errorData.errors)
                            ? errorData.errors
                            : Object.values(errorData.errors).flat();
                        throw new Error('Data validasi tidak valid');
                    }
                    throw new Error(errorData.message || 'Gagal menyimpan data role');
                }
                
                this.closeModal();
                await this.fetchRoles();
                
                Swal.fire('Berhasil!', `Role berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

            } catch (error: any) {
                if (error.message !== 'Data validasi tidak valid') {
                    Swal.fire('Error', error.message || 'Operasi gagal', 'error');
                }
            } finally {
                this.loading = false;
            }
        },

        async deleteRole(id: number) {
            const { $api } = useNuxtApp();
            
            const result = await Swal.fire({
                title: 'Apakah Anda yakin?',
                text: "Role yang dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            });

            if (!result.isConfirmed) {
                return;
            }

            this.loading = true;
            try {
                const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
                const csrfData = await csrfResponse.json();
                const csrfToken = csrfData.token;
                const token = localStorage.getItem('token');

                if (!csrfToken) {
                    throw new Error('CSRF token tidak ditemukan.');
                }

                const response = await fetch($api.roleDelete(id), {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Gagal menghapus role');
                }

                await this.fetchRoles();
                Swal.fire('Berhasil!', 'Role berhasil dihapus.', 'success');
            } catch (error: any) {
                Swal.fire('Error', error.message || 'Gagal menghapus role', 'error');
            } finally {
                this.loading = false;
            }
        },

        async openModal(role: Role | null = null) {
            this.isEditMode = !!role;
            this.validationErrors = [];

            if (role) {
                const { $api } = useNuxtApp();
                const token = localStorage.getItem('token');
                try {
                    const response = await fetch($api.roleShow(role.id), {
                        headers: { 
                            Authorization: `Bearer ${token}`,
                            'Accept': 'application/json'
                        },
                        credentials: 'include'
                    });
                    if (!response.ok) throw new Error('Gagal memuat detail role.');
                    const roleData = await response.json();
                    
                    this.form = {
                        id: roleData.id,
                        name: roleData.name || '',
                        permissionIds: Array.isArray(roleData.permissions) ? roleData.permissions : [],
                    };

                } catch (error: any) {
                    Swal.fire('Error', error.message, 'error');
                    return; // jangan buka modal jika gagal fetch
                }
            } else {
                this.form = {
                    id: undefined,
                    name: '',
                    permissionIds: [],
                };
            }
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.isEditMode = false;
            this.form = { id: undefined, name: '', permissionIds: [] };
            this.validationErrors = [];
        },

        setPagination(event: any) {
            this.params.first = event.first;
            this.params.rows = event.rows;
            this.fetchRoles();
        },
    
        setSort(event: any) {
            this.params.sortField = event.sortField;
            this.params.sortOrder = event.sortOrder;
            this.fetchRoles();
        },
            
        setSearch(value: string) {
            this.params.search = value;
            this.params.first = 0;
            this.fetchRoles();
        },
    },
})