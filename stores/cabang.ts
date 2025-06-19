import { defineStore } from 'pinia'
// We will use native fetch as requested, so apiFetch is no longer needed here.

export interface Perusahaan {
  id: number
  nmPerusahaan: string
  npwpPerusahaan: string
  alamatPerusahaan: string
  createdAt: string
  updatedAt: string
}

export interface Cabang {
  id: number
  kode_cabang: string
  nm_cabang: string
  alamat_cabang: string
  perusahaan_id: number
  createdAt: string
  updatedAt: string
  perusahaan?: Perusahaan
}

interface CabangState {
  cabangs: Cabang[]
  loading: boolean
  totalRecords: number
  showModal: boolean
  isEditMode: boolean
  form: Partial<Cabang>
  validationErrors: any
  error: string | null
  params: {
    page: number
    rows: number
    sortField?: string
    sortOrder?: number
    filters?: any
  }
}

const initialFormState: Partial<Cabang> = {
  id: undefined,
  kode_cabang: '',
  nm_cabang: '',
  alamat_cabang: '',
  perusahaan_id: undefined,
}

export const useCabangStore = defineStore('cabang', {
  state: (): CabangState => ({
    cabangs: [],
    loading: false,
    totalRecords: 0,
    showModal: false,
    isEditMode: false,
    form: { ...initialFormState },
    validationErrors: null,
    error: null,
    params: {
      page: 1,
      rows: 10,
    },
  }),
  actions: {
    async fetchCabangs() {
      this.loading = true
      this.error = null
      const { $api } = useNuxtApp()

      try {

        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;
        const token = localStorage.getItem('token');


        if (!csrfToken) {
          throw new Error('CSRF token not found. Cannot proceed with request.');
        }

        const url = new URL($api.cabang())

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        
        url.searchParams.append('page', this.params.page.toString())
        url.searchParams.append('rows', this.params.rows.toString())
        if (this.params.sortField) {
            url.searchParams.append('sortField', this.params.sortField)
            url.searchParams.append('sortOrder', this.params.sortOrder === 1 ? 'asc' : 'desc')
        }
        if (this.params.filters?.global?.value) {
            url.searchParams.append('search', this.params.filters.global.value)
        }
        if (!response.ok) throw new Error('Gagal mengambil data cabang')

        const result = await response.json()
        this.cabangs = result.data
        this.totalRecords = result.meta.total
      } catch (e: any) {
        console.error('Gagal mengambil data cabang:', e)
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async fetchCabangByPerusahaan(perusahaanId: number) {
        if (!perusahaanId) {
            this.cabangs = []
            return
        }
        this.loading = true
        const { $api } = useNuxtApp()
        const token = localStorage.getItem('token');
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;

        if (!csrfToken) {
            throw new Error('CSRF token not found. Cannot proceed with request.');
        }
        try {
            const response = await fetch($api.cabang() + `?perusahaan_id=${perusahaanId}`, {
                 method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            })
            const result = await response.json()
            this.cabangs = result.data || []
        } catch (error) {
            console.error('Gagal mengambil data cabang by perusahaan:', error)
        } finally {
            this.loading = false
        }
    },

    async createCabang() {
      this.loading = true
      this.validationErrors = null
      const { $api } = useNuxtApp()

      try {
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData     = await csrfResponse.json();
        const csrfToken    = csrfData.token;
        const token        = localStorage.getItem('token');


        if (!csrfToken) {
          throw new Error('CSRF token not found. Cannot proceed with request.');
        }

        await fetch($api.cabang(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify(this.form),
          credentials: 'include',
        })
        this.closeModal()
        await this.fetchCabangs()
      } catch (error: any) {
        if (error.response && error.response.status === 422) {
          this.validationErrors = error.response._data.errors
        } else {
          console.error('Gagal membuat cabang:', error)
        }
      } finally {
        this.loading = false
      }
    },

    async updateCabang() {
      this.loading = true
      this.validationErrors = null
      if (!this.form.id) return
      
      const { $api } = useNuxtApp()
      const token = localStorage.getItem('token');

      try {
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;
        
        await fetch($api.cabang() + `/${this.form.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          body: JSON.stringify(this.form),
          credentials: 'include',
        })
        this.closeModal()
        await this.fetchCabangs()
      } catch (error: any) {
        if (error.response && error.response.status === 422) {
          this.validationErrors = error.response._data.errors
        } else {
          console.error('Gagal memperbarui cabang:', error)
        }
      } finally {
        this.loading = false
      }
    },

    async deleteCabang(id: number) {
      this.loading = true
      const { $api } = useNuxtApp()
      const token = localStorage.getItem('token');
      
      try {
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;

        await fetch($api.cabang() + `/${id}`, {
          method: 'DELETE',
           headers: {
            'X-CSRF-TOKEN': csrfToken,
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        })
        await this.fetchCabangs()
      } catch (error) {
        console.error('Gagal menghapus cabang:', error)
      } finally {
        this.loading = false
      }
    },

    openModal(cabang?: Cabang) {
      this.validationErrors = null
      if (cabang) {
        this.isEditMode = true
        // Pastikan form diisi dengan data yang sesuai dari object cabang
        this.form = { 
          id: cabang.id,
          kode_cabang: cabang.kode_cabang,
          nm_cabang: cabang.nm_cabang,
          alamat_cabang: cabang.alamat_cabang,
          perusahaan_id: cabang.perusahaan_id
        }
      } else {
        this.isEditMode = false
        this.form = { ...initialFormState }
      }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.isEditMode = false
      this.form = { ...initialFormState }
    },

    setPage(page: number, rows: number) {
      this.params.page = page
      this.params.rows = rows
      this.fetchCabangs()
    },

    setSort(sortField: string, sortOrder: number) {
      this.params.sortField = sortField
      this.params.sortOrder = sortOrder
      this.fetchCabangs()
    },
    
    setFilters(filters: any) {
      this.params.filters = filters;
      this.fetchCabangs();
    }
  },
})
