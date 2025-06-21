import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'
import Swal from 'sweetalert2'

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
  customers: Customer[]
  selectedCustomer: Customer | null
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
  form: Partial<Customer>
  isEditMode: boolean
  showModal: boolean
  validationErrors: any[]
}

export const useCustomerStore = defineStore('customer', {
    state: (): CustomerState => ({
    customers: [],
    selectedCustomer: null,
    loading: false,
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
      address: '',
      email: '',
      phone: '',
      npwp: '',
      logo: '',
      customerProducts: []
    },
    isEditMode: false,
    showModal: false,
    validationErrors: [],
  }),
  actions: {
    async fetchCustomers() {
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()
      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            page: ((this.params.first / this.params.rows) + 1).toString(),
            rows: this.params.rows.toString(),
            sortField: this.params.sortField || '',
            sortOrder: (this.params.sortOrder || 1) > 0 ? 'asc' : 'desc',
            search: this.params.search || '',
        });

        const response = await fetch(`${$api.customer()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data pelanggan.' }));
            throw new Error(errorData.message || 'Gagal memuat data pelanggan.');
        }

        const result = await response.json()
        this.customers = result.data
        this.totalRecords = result.meta.total
      } catch (e: any) {
        this.error = e.message
        Swal.fire('Error', `Tidak dapat memuat data pelanggan: ${e.message}`, 'error');
      } finally {
        this.loading = false
      }
    },
    async prefetchCustomers() {
      if (this.customers.length > 0 || this.loading) {
        return;
      }
      await this.fetchCustomers();
    },
    async saveCustomer() {
      this.loading = true
      this.validationErrors = [];
      const { $api } = useNuxtApp()

      try {
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' })
        const csrfData     = await csrfResponse.json()
        const csrfToken    = csrfData.token
        const token        = localStorage.getItem('token')

        if (!token || !csrfToken) {
          throw new Error('Otentikasi tidak valid. Silakan login kembali.');
        }
        
        const formData = new FormData()
        Object.keys(this.form).forEach(key => {
            const value = this.form[key as keyof typeof this.form];
            if (key === 'logo' && value instanceof File) {
                formData.append(key, value);
            } else if (key === 'customerProducts' && Array.isArray(value)) {
                 value.forEach((item, index) => {
                    if (item.productId) {
                    formData.append(`customerProducts[${index}][productId]`, String(item.productId))
                    }
                    formData.append(`customerProducts[${index}][priceSell]`, String(item.priceSell))
                })
            }
            else if (value !== null && value !== undefined && key !== 'logo') {
                formData.append(key, String(value));
            }
        });

        let url = $api.customer()
        if (this.isEditMode && this.form.id) {
          url = `${$api.customer()}/${this.form.id}`
          formData.append('_method', 'PUT'); // AdonisJS needs this for FormData PUT requests
        }

        const response = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
          },
          credentials: 'include',
        })

        const result = await response.json();

        if (!response.ok) {
            if (result.errors) {
                this.validationErrors = Object.values(result.errors).flat();
            }
            throw new Error(result.message || 'Gagal menyimpan data pelanggan');
        }
        
        this.closeModal();
        await this.fetchCustomers();
        Swal.fire('Berhasil!', `Pelanggan berhasil ${this.isEditMode ? 'diperbarui' : 'disimpan'}.`, 'success');

      } catch (error: any) {
        Swal.fire('Error', error.message || 'Operasi gagal', 'error');
      } finally {
        this.loading = false
      }
    },
    async deleteCustomer(id: number) {
      const { $api } = useNuxtApp();

      const result = await Swal.fire({
          title: 'Apakah Anda yakin?',
          text: "Data pelanggan yang dihapus tidak dapat dikembalikan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
      });

      if (!result.isConfirmed) return;

      this.loading = true;
      try {
          const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
          const csrfData = await csrfResponse.json();
          const csrfToken = csrfData.token;
          const token = localStorage.getItem('token');

          if (!csrfToken || !token) {
              throw new Error('Otentikasi tidak valid. Silakan login kembali.');
          }

          const response = await fetch($api.customer() + `/${id}`, {
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
              throw new Error(errorData.message || 'Gagal menghapus pelanggan');
          }

          await this.fetchCustomers();
          Swal.fire('Berhasil!', 'Pelanggan berhasil dihapus.', 'success');
      } catch (error: any) {
          Swal.fire('Error', error.message || 'Gagal menghapus pelanggan', 'error');
      } finally {
          this.loading = false;
      }
    },

    async getCustomerDetails(customerId: string) {
      this.loading = true;
      this.error = null;
      const { $api } = useNuxtApp();
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${$api.customer()}/${customerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat detail pelanggan.' }));
            throw new Error(errorData.message || 'Gagal memuat detail pelanggan.');
        }

        const result = await response.json();
        this.selectedCustomer = result;

      } catch (e: any) {
        this.error = e.message;
        this.selectedCustomer = null;
        Swal.fire('Error', `Tidak dapat memuat detail pelanggan: ${e.message}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async openModal(customer: Customer | null = null) {
        this.isEditMode = !!customer;
        this.validationErrors = [];
        if (customer && customer.id) {
            // Fetch complete data for editing
            this.loading = true;
            const { $api } = useNuxtApp();
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${$api.customer()}/${customer.id}`, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
                    credentials: 'include'
                });
                if (!response.ok) throw new Error('Gagal mengambil detail data pelanggan.');
                const data = await response.json();
                this.form = { 
                    ...data,
                    customerProducts: data.customerProducts && data.customerProducts.length > 0 ? data.customerProducts: [{ productId: null, priceSell: 0 }]
                };
            } catch (error: any) {
                Swal.fire('Error', error.message, 'error');
            } finally {
                this.loading = false;
            }
        } else {
            // New customer
            this.form = {
                name: '',
                address: '',
                email: '',
                phone: '',
                npwp: '',
                logo: '',
                customerProducts: [{ productId: null, priceSell: 0 }]
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
        this.fetchCustomers();
    },

    setSort(event: any) {
        this.params.sortField = event.sortField;
        this.params.sortOrder = event.sortOrder;
        this.fetchCustomers();
    },
        
    setSearch(value: string) {
        this.params.search = value;
        this.params.first = 0;
        this.fetchCustomers();
    },

    handleLogoChange(file: File) {
        if (file) {
            this.form.logo = file;
        }
    },

    addItem() {
        if (!this.form.customerProducts) {
            this.form.customerProducts = [];
        }
        this.form.customerProducts.push({
            productId: null,
            priceSell: 0
        });
    },

    removeItem(index: number) {
        if (this.form.customerProducts) {
            this.form.customerProducts.splice(index, 1);
        }
    }
  }
})
