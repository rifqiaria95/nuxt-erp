<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Jabatan</h4>
            <p class="mb-6">
            List jabatan yang terdaftar di sistem
            </p>
            <!-- jabatan cards -->
            <div class="row g-6 mb-6">
                <!-- Card untuk Tambah Pegawai -->
                    <!-- Cards untuk Statistik Pegawai -->
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Jabatan"
                    :total="stats.total + ' Jabatan'"
                />
                <CardBox
                    v-if="stats.direktur_utama !== undefined"
                    title="Direktur Utama"
                    :total="stats.direktur_utama + ' Orang'"
                />
                <CardBox
                    v-if="stats.direktur_keuangan !== undefined"
                    title="Direktur Keuangan"
                    :total="stats.direktur_keuangan + ' Orang'"
                />
                <CardBox
                    v-if="stats.direktur_operasional !== undefined"
                    title="Direktur Operasional"
                    :total="stats.direktur_operasional + ' Orang'"
                />
                <CardBox
                    v-if="stats.general_manager !== undefined"
                    title="General Manager"
                    :total="stats.general_manager + ' Orang'"
                />
                <CardBox
                    :isAddButtonCard="true"
                    image-src="/img/illustrations/add-new-role-illustration.png"
                    image-alt="Tambah Jabatan"
                    button-text="Tambah Jabatan"
                    modal-target="#Modal" 
                    @button-click="openAddJabatanModal"
                />
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Jabatan</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Jabatan.</p>
                </div>
                <div class="col-12">
                    <!-- jabatan Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="lazyParams.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="p-input-icon-left">
                                    <InputText v-model="lazyParams.search" placeholder="Cari Jabatan..." @keyup.enter="handleSearch" style="width: 20rem;" />
                                </span>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            :data="jabatan" 
                            :rows="lazyParams.rows" 
                            :loading="loading"
                            :totalRecords="totalRecords"
                            :lazy="true"
                            @page="onPage($event)"
                            @sort="onSort($event)"
                            responsiveLayout="scroll" 
                            paginatorPosition="bottom"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
                            >
                            <Column field="idJabatan" header="#" :sortable="true"></Column> 
                                <Column field="nmJabatan" header="Nama Jabatan" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button @click="openEditJabatanModal(slotProps.data)" class="btn btn-sm btn-icon      btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button @click="deleteJabatan(slotProps.data.idJabatan)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ jabatan Table -->
                </div>
            </div>
            <!--/ jabatan cards -->

            <!-- Placeholder untuk JabatanModal component -->
            <Modal 
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedJabatan="selectedJabatan"
            >
                <template #default>
                    <form @submit.prevent="handleSubmit">
                        <div class="row g-6">
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="name" 
                                        v-model="formJabatan.nm_jabatan" 
                                        placeholder="Masukkan nama jabatan"
                                        required
                                    >
                                    <label for="name">Nama Jabatan</label>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    class="btn btn-primary me-2"
                                    @click="handleSaveJabatan"
                                >
                                    {{ isEditMode ? 'Update' : 'Simpan' }}
                                </button>
                                <button type="button" class="btn btn-secondary" @click="handleCloseModal">
                                    Batal
                                </button>
                            </div>
                        </div>
                    </form>
                </template>
            </Modal>
        </div>
         <!-- / Content -->
 
         <div class="content-backdrop fade"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Swal from 'sweetalert2'
import { useJabatanStore } from '~/stores/jabatan'

const { $api } = useNuxtApp()

const jabatanStore      = useJabatanStore()
const selectedJabatan  = ref(null);
const jabatan          = ref([])
const loading          = ref(false);
const isEditMode       = ref(false);
const totalRecords     = ref(0);
const lazyParams        = ref({
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    draw: 1,
    search: '',
});

const formJabatan = ref({
  nm_jabatan: '',
});

const stats = ref({
  direktur_utama: undefined,
  direktur_keuangan: undefined,
  direktur_operasional: undefined,
  general_manager: undefined,
  total: undefined
})

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Jabatan' : 'Tambah Jabatan');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data jabatan di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan jabatan baru.');

// Fungsi untuk menangani event close dari modal
const handleCloseModal = () => {
    const modalEl = document.getElementById('Modal'); 
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    resetParentFormState(); 
};

// Tambahkan state untuk error validasi agar bisa digunakan di modal
const validationErrors = ref([]);

const handleSaveJabatan = async () => {
    loading.value = true;
    validationErrors.value = []; // reset error sebelum submit
    try {
        // Ambil CSRF token
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token = localStorage.getItem('token');
        let response;
        let url;

        // Validasi form sederhana
        if (!formJabatan.value.nm_jabatan) {
            Swal.fire('Validasi', 'Nama jabatan wajib diisi.', 'warning');
            loading.value = false;
            return;
        }

        if (isEditMode.value) {
            // Cari ID jabatan dari form atau selectedMenuGroup
            let jabatanIdToUpdate = formJabatan.value?.idJabatan || selectedJabatan.value?.idJabatan;
            if (!jabatanIdToUpdate) {
                Swal.fire('Error', 'ID Jabatan tidak ditemukan untuk update.', 'error');
                loading.value = false;
                return;
            }
            url = `${$api.jabatan()}/${jabatanIdToUpdate}`;
            console.log('Updating jabatan with ID:', jabatanIdToUpdate, 'URL:', url);
            // Update data
            response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    nm_jabatan : formJabatan.value.nm_jabatan,
                }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        } else {
            // Create baru
            url = $api.jabatan();
            response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    nm_jabatan : formJabatan.value.nm_jabatan,
                }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        }

        if (response.ok) {
            await loadLazyData();
            handleCloseModal();
            await Swal.fire(
                'Berhasil!',
                `Jabatan berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
                'success'
            );
        } else {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: 'Gagal memproses respons server.' };
            }
            if (errorData.errors) {
                validationErrors.value = Array.isArray(errorData.errors)
                    ? errorData.errors
                    : Object.values(errorData.errors).flat();
                Swal.fire('Gagal', 'Terdapat kesalahan validasi data.', 'error');
            } else {
                Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} jabatan`, 'error');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Terjadi kesalahan saat menyimpan data jabatan.', 'error');
    } finally {
        loading.value = false;
    }
};

const fetchStats = async () => {
  const defaultStats = {
    total: undefined,
    direktur_utama: undefined,
    direktur_keuangan: undefined,
    direktur_operasional: undefined,
    general_manager: undefined,
  };
  try {
    const token = localStorage.getItem('token');
    const response = await fetch($api.countPegawaiByJabatan(), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
      const result = await response.json();
      if (result && typeof result === 'object' && result !== null) {
        stats.value = {
            total: result.total,
            direktur_utama: result.direktur_utama,
            direktur_keuangan: result.direktur_keuangan,
            direktur_operasional: result.direktur_operasional,
            general_manager: result.general_manager,
        };
      } else {
        stats.value = defaultStats;
        console.warn('Data statistik dari API tidak dalam format objek yang diharapkan atau null:', result);
      }
    } else {
        stats.value = defaultStats;
        console.error('Gagal mengambil data statistik, status respons:', response.status);
    }
  } catch (error) {
    console.error('Gagal mengambil data statistik (exception):', error);
    stats.value = defaultStats;
  }
};

// Fungsi untuk menangani event load lazy data dari jabatan
const loadLazyData = async () => {
    loading.value = true;
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            page     : (lazyParams.value.first / lazyParams.value.rows) + 1,
            rows     : lazyParams.value.rows,
            sortField: lazyParams.value.sortField || '',
            sortOrder: lazyParams.value.sortOrder || '',
            draw     : lazyParams.value.draw || 1,
            search   : lazyParams.value.search || '',
        });

        const response = await fetch(`${$api.jabatan()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data jabatan dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data jabatan');
        }

        const result = await response.json();
        jabatan.value = result.data || []; 
        totalRecords.value = parseInt(result.meta.total) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for jabatan:', error);
        jabatan.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data jabatan: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadLazyData();
    fetchStats();
});

const onPage = (event) => {
    lazyParams.value.first = event.first;
    lazyParams.value.rows = event.rows;
    loadLazyData();
};

const handleRowsChange = () => {
    lazyParams.value.first = 0;
    loadLazyData();
};

const handleSearch = () => {
    lazyParams.value.first = 0;
    loadLazyData();
};

const onSort = (event) => {
    lazyParams.value.sortField = event.sortField;
    lazyParams.value.sortOrder = event.sortOrder;
    loadLazyData();
};

const openAddJabatanModal = () => {
    isEditMode.value = false;
    modalTitle.value = 'Tambah Jabatan';
    modalDescription.value = 'Silakan isi form di bawah ini untuk menambahkan jabatan baru.';
    resetParentFormState();
};

async function openEditJabatanModal(jabatanData) {
    isEditMode.value = true;
    // Ambil data jabatan saat modal terbuka
    selectedJabatan.value = JSON.parse(JSON.stringify(jabatanData));
    formJabatan.value = {
        idJabatan: jabatanData.idJabatan,
        nm_jabatan: jabatanData.nmJabatan || ''
    };
    validationErrors.value = [];

    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('JabatanModal element tidak ditemukan atau Bootstrap belum dimuat.');
    }
}

const deleteJabatan = async (idJabatan) => {
    if (!idJabatan) return;

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#666CFF',
        cancelButtonColor: '#A7A9B3',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            let url;

            const token = localStorage.getItem('token');
            // Ambil CSRF token
            const csrfResponse = await fetch($api.csrfToken(), {
                credentials: 'include'
            });
            const csrfData  = await csrfResponse.json();
            const csrfToken = csrfData.token;

            url = `${$api.jabatan()}/${idJabatan}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type' : 'application/json',
                    'X-CSRF-TOKEN' : csrfToken
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus jabatan');
            }

            loadLazyData();

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Jabatan berhasil dihapus.',
                icon: 'success'
            });

        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
    }
};

const resetParentFormState = () => {
    formJabatan.value = {
        nm_jabatan: '',
    };
};
</script>