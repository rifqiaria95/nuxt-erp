import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import { useNuxtApp } from '#app'

export interface Pegawai {
    id: number
    name: string
    description?: string
}

interface PegawaiState {
    pegawais: Pegawai[]
    stats: any
    loading: boolean
    totalRecords: number
    params: any
    form: any
    isEditMode: boolean
    showModal: boolean
    validationErrors: any[]
    initialHistory: any
}

export const usePegawaiStore = defineStore('pegawai', {
    state: (): PegawaiState => ({
        pegawais: [],
        stats: {
            total: undefined,
            pkwtt: undefined,
            pkwt: undefined,
            resign: undefined,
            outsource: undefined
        },
        loading: false,
        totalRecords: 0,
        params: {
            first: 0,
            rows: 10,
            sortField: 'id_pegawai' as string | null,
            sortOrder: 1 as number | null,
            draw: 1,
            search: '',
        },
        form: {},
        isEditMode: false,
        showModal: false,
        validationErrors: [],
        initialHistory: {
            cabangId: null,
            departemenId: null,
        },
    }),
    actions: {
        async fetchPegawais() {
            this.loading = true
            const { $api } = useNuxtApp()
            try {
                const token = localStorage.getItem('token');
                const params = new URLSearchParams({
                    start: this.params.first.toString(),
                    length: this.params.rows.toString(),
                    sortField: this.params.sortField || '',
                    sortOrder: this.params.sortOrder?.toString() || '',
                    draw: this.params.draw.toString(),
                    'search[value]': this.params.search || '',
                });

                const response = await fetch(`${$api.pegawai()}?${params.toString()}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data pegawai' }));
                    throw new Error(errorData.message);
                }

                const result = await response.json();
                this.pegawais = result.data || [];
                this.totalRecords = parseInt(result.recordsTotal) || 0;
                if (result.draw) {
                    this.params.draw = parseInt(result.draw);
                }

            } catch (error: any) {
                this.pegawais = [];
                this.totalRecords = 0;
                Swal.fire('Error', `Tidak dapat memuat data pegawai: ${error.message}`, 'error');
            } finally {
                this.loading = false
            }
        },

        async fetchStats() {
            const { $api } = useNuxtApp()
            const defaultStats = { total: undefined, pkwtt: undefined, pkwt: undefined, resign: undefined, outsource: undefined };
            try {
                const token = localStorage.getItem('token');
                const response = await fetch($api.pegawaiCountByStatus(), {
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
                console.error('Gagal mengambil data statistik:', error);
                this.stats = defaultStats;
            }
        },

        async savePegawai() {
            this.loading = true;
            this.validationErrors = [];
            const { $api } = useNuxtApp()

            const formData = new FormData();
            for (const key in this.form) {
                if (key === 'avatarPreview') continue;
                
                const value = this.form[key];
                if (value !== null && value !== undefined) {
                    if (key === 'avatar' && value instanceof File) {
                        formData.append(key, value);
                    } else if (key !== 'avatar') {
                        formData.append(key, value === null ? '' : value);
                    }
                }
            }
            
            try {
                const token = localStorage.getItem('token');
                const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
                const csrfData = await csrfResponse.json();
                const csrfToken = csrfData.token;

                let response;
                let url;

                if (this.isEditMode) {
                    const pegawaiId = this.form.id_pegawai;
                    url = $api.pegawaiUpdate(pegawaiId);
                    formData.append('_method', 'PUT');
                    response = await fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-CSRF-TOKEN': csrfToken || '',
                        },
                        credentials: 'include'
                    });
                } else {
                    url = $api.pegawai();
                    response = await fetch(url, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-CSRF-TOKEN': csrfToken || ''
                        },
                        credentials: 'include'
                    });
                }
                
                if (response.ok) {
                    this.closeModal();
                    await this.fetchPegawais();
                    await this.fetchStats();
                    Swal.fire('Berhasil!', `Pegawai berhasil ${this.isEditMode ? 'diperbarui' : 'dibuat'}.`, 'success');
                } else {
                    const errorData = await response.json();
                    if (errorData.errors) {
                        this.validationErrors = Object.values(errorData.errors).flat();
                    } else {
                        Swal.fire('Gagal', errorData.message || 'Operasi gagal', 'error');
                    }
                }
            } catch (error: any) {
                Swal.fire('Error', error.message, 'error');
                this.validationErrors = [error.message];
            } finally {
                this.loading = false;
            }
        },

        async deletePegawai(id: number) {
            const { $api } = useNuxtApp()
            const result = await Swal.fire({
                title: 'Anda yakin?',
                text: "Data yang dihapus tidak dapat dikembalikan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#666CFF',
                cancelButtonColor: '#A7A9B3',
                confirmButtonText: 'Ya, hapus!',
                cancelButtonText: 'Batal'
            });

            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
                    const csrfData = await csrfResponse.json();
                    const csrfToken = csrfData.token;

                    const response = await fetch($api.pegawaiDelete(id), {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-CSRF-TOKEN': csrfToken,
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include'
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || 'Gagal menghapus pegawai');
                    }

                    await this.fetchPegawais();
                    await this.fetchStats();
                    Swal.fire('Dihapus!', 'Pegawai berhasil dihapus.', 'success');
                } catch (error: any) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        },

        openModal(pegawaiData: any | null = null) {
            this.isEditMode = !!pegawaiData;
            this.validationErrors = [];
            
            if (pegawaiData) {
                this.form = JSON.parse(JSON.stringify(pegawaiData)); // Deep copy to avoid reactivity issues
                
                this.form.tgl_lahir_pegawai = pegawaiData.tgl_lahir_pegawai ? pegawaiData.tgl_lahir_pegawai.substring(0, 10) : '';
                this.form.tgl_masuk_pegawai = pegawaiData.tgl_masuk_pegawai ? pegawaiData.tgl_masuk_pegawai.substring(0, 10) : '';
                this.form.tgl_keluar_pegawai = pegawaiData.tgl_keluar_pegawai ? pegawaiData.tgl_keluar_pegawai.substring(0, 10) : null;
                this.form.full_name = pegawaiData.nm_pegawai;
                
                if (pegawaiData.history) {
                    this.form.jabatan_id = pegawaiData.history.jabatan?.id_jabatan ?? pegawaiData.history.jabatan?.id ?? null;
                    this.form.perusahaan_id = pegawaiData.history.perusahaan?.id ?? null;
                    this.form.divisi_id = pegawaiData.history.divisi?.id ?? null;
                    this.form.gaji_pegawai = pegawaiData.history.gaji_pegawai ? parseFloat(pegawaiData.history.gaji_pegawai) : 0;
                    this.form.tunjangan_pegawai = pegawaiData.history.tunjangan_pegawai ? parseFloat(pegawaiData.history.tunjangan_pegawai) : 0;
                    
                    this.initialHistory.cabangId = pegawaiData.history.cabang?.id ?? null;
                    this.initialHistory.departemenId = pegawaiData.history.departemen?.id ?? null;

                    this.form.cabang_id = this.initialHistory.cabangId;
                    this.form.departemen_id = this.initialHistory.departemenId;
                } else {
                     this.form.jabatan_id = null;
                     this.form.perusahaan_id = null;
                     this.form.divisi_id = null;
                     this.form.cabang_id = null;
                     this.form.departemen_id = null;
                     this.form.gaji_pegawai = 0;
                     this.form.tunjangan_pegawai = 0;
                }

                if (pegawaiData.avatar) {
                    const BASE_URL = 'http://localhost:3333/';
                    const avatarPathClean = pegawaiData.avatar.startsWith('/') ? pegawaiData.avatar.slice(1) : pegawaiData.avatar;
                    this.form.avatarPreview = pegawaiData.avatar.startsWith('http') ? pegawaiData.avatar : BASE_URL + avatarPathClean;
                } else {
                    this.form.avatarPreview = '';
                }
                 this.form.avatar = null;

            } else {
                this.form = {
                    nm_pegawai: '', email: '', full_name: '', tgl_lahir_pegawai: '', tmp_lahir_pegawai: '',
                    no_tlp_pegawai: '', alamat_pegawai: '', pendidikan_pegawai: null, status_pegawai: 1,
                    no_ktp_pegawai: '', nik_pegawai: '', npwp_pegawai: '', jenis_kelamin_pegawai: null,
                    tgl_masuk_pegawai: '', tgl_keluar_pegawai: null, istri_suami_pegawai: '', anak_1: '', anak_2: '',
                    user_id: '', jabatan_id: null, perusahaan_id: null, cabang_id: null, divisi_id: null,
                    departemen_id: null, gaji_pegawai: 0, tunjangan_pegawai: 0, avatar: null, avatarPreview: '',
                };
            }
            this.showModal = true;
        },

        closeModal() {
            this.showModal = false;
            this.isEditMode = false;
            this.form = {
                nm_pegawai: '', email: '', full_name: '', tgl_lahir_pegawai: '', tmp_lahir_pegawai: '',
                no_tlp_pegawai: '', alamat_pegawai: '', pendidikan_pegawai: null, status_pegawai: 1,
                no_ktp_pegawai: '', nik_pegawai: '', npwp_pegawai: '', jenis_kelamin_pegawai: null,
                tgl_masuk_pegawai: '', tgl_keluar_pegawai: null, istri_suami_pegawai: '', anak_1: '', anak_2: '',
                user_id: '', jabatan_id: null, perusahaan_id: null, cabang_id: null, divisi_id: null,
                departemen_id: null, gaji_pegawai: 0, tunjangan_pegawai: 0, avatar: null, avatarPreview: '',
            };
            this.validationErrors = [];
            this.initialHistory = { cabangId: null, departemenId: null };
        },

        setPagination(event: any) {
            this.params.first = event.first;
            this.params.rows = event.rows;
            this.fetchPegawais();
        },

        setSort(event: any) {
            this.params.sortField = event.sortField;
            this.params.sortOrder = event.sortOrder;
            this.fetchPegawais();
        },
        
        setSearch(value: string) {
            this.params.search = value;
            this.params.first = 0;
            this.fetchPegawais();
        }
    },
})