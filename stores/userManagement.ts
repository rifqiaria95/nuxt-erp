import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

export interface Permission {
  id: number;
  name: string;
}

export interface Role {
  id: number
  name: string
  permissions?: Permission[];
}

export interface User {
  id: number
  fullName: string
  email: string
  isActive: boolean
  roles: Role[]
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number | undefined
  aktif: number | undefined
  tidakAktif: number | undefined
  totalSuperadmin: number | undefined
  totalAdmin: number | undefined
}

interface UserState {
  users: User[]
  roles: Role[]
  loading: boolean
  error: any
  stats: Stats
  totalRecords: number
  params: {
    first: number
    rows: number
    sortField: string | null
    sortOrder: number | null
    search: string
  }
  form: any
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useUserManagementStore = defineStore('user-management', {
  state: (): UserState => ({
    users: [],
    roles: [],
    loading: false,
    error: null,
    stats: {
      total: undefined,
      aktif: undefined,
      tidakAktif: undefined,
      totalSuperadmin: undefined,
      totalAdmin: undefined,
    },
    totalRecords: 0,
    params: {
      first: 0,
      rows: 10,
      sortField: 'id',
      sortOrder: 1,
      search: '',
    },
    form: {},
    isEditMode: false,
    showModal: false,
    validationErrors: [],
  }),
  actions: {
    async fetchUsers() {
        const toast = useToast();
        this.loading = true;
        const { $api } = useNuxtApp();
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: ((this.params.first / this.params.rows) + 1).toString(),
                rows: this.params.rows.toString(),
                sortField: this.params.sortField || '',
                sortOrder: (this.params.sortOrder || 1) > 0 ? 'asc' : 'desc',
                search: this.params.search || '',
            });

            const response = await fetch(`${$api.users()}?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Gagal memuat data user');
            }

            const result = await response.json();
            this.users = result.data || [];
            this.totalRecords = parseInt(result.meta.total) || 0;

        } catch (error: any) {
            this.error = error.message;
            toast.error({
              title: 'Error',
              message: `Tidak dapat memuat data user: ${error.message}`,
              color: 'red'
            });
        } finally {
            this.loading = false;
        }
    },
    async fetchRoles() {
        const toast = useToast();
        const { $api } = useNuxtApp();
        try {
            const token = localStorage.getItem('token')
            const response = await fetch($api.roles(), {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            
            if (!response.ok) throw new Error('Gagal mengambil data role')
            
            const data = await response.json()
            this.roles = data.data || data
        } catch (error: any) {
            console.error('Error fetching role:', error)
            toast.error({
              title: 'Error',
              message: `Tidak dapat memuat data role: ${error.message}`,
              color: 'red'
            });
        }
    },
    async fetchStats() {
        const toast = useToast();
        const { $api } = useNuxtApp();
        const defaultStats = {
            total: undefined,
            aktif: undefined,
            tidakAktif: undefined,
            totalSuperadmin: undefined,
            totalAdmin: undefined
        };
        try {
            const token = localStorage.getItem('token');
            const response = await fetch($api.countTotalUsers(), {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                const result = await response.json();
                this.stats = result;
            } else {
                this.stats = defaultStats;
            }
        } catch (error) {
            console.error('Gagal mengambil data statistik (exception):', error);
            this.stats = defaultStats;
        }
    },
    async saveUser() {
        const toast = useToast();
        this.loading = true;
        this.validationErrors = [];
        const { $api } = useNuxtApp();

        try {
            const token = localStorage.getItem('token');
            let url = $api.users();
            let method = 'POST';

            const payload: any = {
                full_name: this.form.full_name,
                email: this.form.email,
                isActive: this.form.isActive,
                role_ids: this.form.role_ids,
            };

            if (this.isEditMode && this.form.id) {
                url = `${$api.users()}/${this.form.id}`;
                method = 'PUT';
                if (this.form.password) {
                    payload.password = this.form.password;
                }
            } else {
                 payload.password = this.form.password;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                credentials: 'include'
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 if (errorData.errors) {
                    this.validationErrors = Object.values(errorData.errors).flat();
                 }
                throw new Error(errorData.message || 'Gagal menyimpan data user');
            }

            this.closeModal();
            await this.fetchUsers();
            await this.fetchStats();
            toast.success({
              title: 'Success',
              message: `User berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`,
              color: 'green'
            });

        } catch (error: any) {
            toast.error({
              title: 'Error',
              message: error.message || 'Operasi gagal',
              color: 'red'
            });
        } finally {
            this.loading = false;
        }
    },
    async deleteUser(id: number) {
      const toast = useToast();
      this.loading = true;
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data yang dihapus tidak dapat dikembalikan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) {
          this.loading = false;
          return;
      }

      try {
          const token = localStorage.getItem('token');

          const response = await fetch(`${$api.users()}/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
              },
              credentials: 'include',
          });

          if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message || 'Gagal menghapus user');
          }

          await this.fetchUsers();
          await this.fetchStats();
          toast.success({
            title: 'Success',
            message: 'User berhasil dihapus.',
            color: 'green'
          });
      } catch (error: any) {
        toast.error({
          title: 'Error',
          message: error.message || 'Gagal menghapus user',
          color: 'red'
        });
      } finally {
          this.loading = false;
      }
    },
    openModal(user: User | null = null) {
        this.isEditMode = !!user;
        this.validationErrors = [];
        if (user) {
            this.form = { 
              ...user,
              full_name: user.fullName,
              role_ids: user.roles.map(role => role.id)
            };
        } else {
            this.form = {
                full_name: '',
                email: '',
                password: '',
                isActive: true,
                role_ids: []
            };
        }
        this.showModal = true;
    },
    closeModal() {
        this.showModal = false;
        this.isEditMode = false;
        this.form = {};
        this.validationErrors = [];
    },
    setPagination(event: any) {
        this.params.first = event.first;
        this.params.rows = event.rows;
        this.fetchUsers();
    },
    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.params.first = 0;
        this.fetchUsers();
    },
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchUsers();
    },
  }
}) 