<template>
    <!-- Content wrapper -->
    <div class="content-wrapper">
         <!-- Content -->
 
            <div class="container-xxl flex-grow-1 container-p-y">
                <h4 class="mb-1">List Pegawai</h4>
                <p class="mb-6">
                List pegawai yang terdaftar di sistem
                </p>
                <!-- pegawai cards -->
                <div class="row g-6 mb-6">
                    <!-- Card untuk Tambah Pegawai -->
                     <!-- Cards untuk Statistik Pegawai -->
                    <CardBox
                        v-if="stats.total !== undefined"
                        title="Total Pegawai"
                        :total="stats.total + ' Pegawai'"
                    />
                    <CardBox
                        v-if="stats.pkwtt !== undefined"
                        title="Pegawai PKWTT"
                        :total="stats.pkwtt + ' Pegawai'"
                    />
                    <CardBox
                        v-if="stats.pkwt !== undefined"
                        title="Pegawai PKWT"
                        :total="stats.pkwt + ' Pegawai'"
                    />
                    <CardBox
                        v-if="stats.outsource !== undefined"
                        title="Pegawai Outsource"
                        :total="stats.outsource + ' Pegawai'"
                    />
                    <CardBox
                        v-if="stats.resign !== undefined"
                        title="Pegawai Resign"
                        :total="stats.resign + ' Pegawai'"
                    />
                    <CardBox
                        :isAddButtonCard="true"
                        image-src="/img/illustrations/add-new-role-illustration.png"
                        image-alt="Tambah Pegawai"
                        button-text="Tambah Pegawai"
                        modal-target="#PegawaiModal" 
                        @button-click="openAddPegawaiModal"
                    />
                </div>
                <!--/ pegawai cards -->

                <div class="row g-6">
                    <div class="col-12">
                        <h4 class="mt-6 mb-1">Filter & Daftar Pegawai</h4>
                        <p class="mb-0">Cari dan kelola semua akun pegawai perusahaan Anda beserta detailnya.</p>
                    </div>
                    <div class="col-12">
                        <!-- pegawai Table -->
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                                <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                    <span class="me-2">Baris:</span>
                                    <Dropdown v-model="lazyParams.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                                </div>
                                <div class="d-flex align-items-center">
                                    <div class="btn-group me-2">
                                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="ri-upload-2-line me-1"></i> Export
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li><a class="dropdown-item" href="javascript:void(0)" @click="exportData('csv')">CSV</a></li>
                                            <li><a class="dropdown-item" href="javascript:void(0)" @click="exportData('pdf')">PDF</a></li>
                                        </ul>
                                    </div>
                                    <div class="input-group">
                                        <span class="p-input-icon-left">
                                            <InputText
                                                v-model="globalFilterValue"
                                                placeholder="Cari pegawai..."
                                                class="w-full md:w-20rem"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable 
                                ref="myDataTableRef"
                                :data="pegawai" 
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
                                <Column field="id_pegawai" header="#" :sortable="true" style="width:5%"></Column> 
                                <Column field="nm_pegawai" header="Nama Pegawai" :sortable="true" style="width:20%"></Column>
                                <Column field="email" header="Email" :sortable="true" style="width:20%"></Column>
                                <Column field="tmp_lahir_pegawai" header="Tempat Lahir" :sortable="true" style="width:15%"></Column>
                                <Column field="tgl_lahir_pegawai" header="Tanggal Lahir" :sortable="true" style="width:10%">
                                    <template #body="slotProps">
                                        {{ slotProps.data.tgl_lahir_pegawai ? new Date(slotProps.data.tgl_lahir_pegawai).toLocaleDateString() : '-' }}
                                    </template>
                                </Column>
                                <Column field="alamat_pegawai" header="Alamat" :sortable="true" style="width:20%"></Column>
                                <Column field="status_pegawai" header="Status" :sortable="true" style="width:10%">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.status_pegawai).class">
                                            {{ getStatusBadge(slotProps.data.status_pegawai).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem; width:10%">
                                    <template #body="slotProps">
                                        <button @click="openEditPegawaiModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button @click="deletePegawai(slotProps.data.id_pegawai)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                    </template>
                                </Column>
                            </MyDataTable>
                            </div>
                        </div>
                        <!--/ pegawai Table -->
                    </div>
                </div>
                <!--/ pegawai cards -->
 
                <!-- Placeholder untuk PegawaiModal component -->
                <PegawaiModal 
                    :isEditMode="isEditMode" 
                    :selectedPegawaiData="selectedPegawai" 
                    :validationErrorsFromParent="validationErrors"
                    :jabatanOptions="jabatan"
                    :perusahaanOptions="perusahaan"
                    :cabangOptions="cabang" 
                    :divisiOptions="divisi" 
                    :departemenOptions="departemen"
                    @save="handleSavePegawai"
                    @close="handleCloseModal" 
                    @company-selected="handleCompanySelectedInModal"
                    @division-selected="handleDivisionSelectedInModal"
                />
            </div>
            <!-- / Content -->
        <div class="content-backdrop fade"></div>
    </div>
     <!-- Content wrapper -->
 </template>
 
<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { usePegawaiStore } from '~/stores/pegawai'
import vSelect from 'vue-select'
import Swal from 'sweetalert2'
import 'vue-select/dist/vue-select.css'

// Import komponen modal
import CardBox from '~/components/cards/Cards.vue'
import PegawaiModal from '~/components/pegawai/PegawaiModal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

const { $api } = useNuxtApp()

const myDataTableRef      = ref(null)
const pegawai             = ref([])
const selectedPegawai     = ref(null)
const loading             = ref(false);
const totalRecords        = ref(0);
const globalFilterValue   = ref('');
const lazyParams          = ref({
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    draw: 1,
    search: '',
});

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

// State untuk menu groups dan details (data utama tetap di parent)
const jabatan = ref([])
const perusahaan = ref([])
const cabang = ref([])
const divisi = ref([])
const departemen = ref([])
const stats = ref({
  total: undefined,
  pkwtt: undefined,
  pkwt: undefined,
  resign: undefined,
  outsource: undefined
})

// Selected states untuk filter di parent (jika masih ada filter UI di parent)
// atau untuk trigger watch fetch data dependen.
const selectedJabatan             = ref(null)
const selectedPerusahaan          = ref(null)
const selectedCabang              = ref(null)
const selectedDivisi              = ref(null)
const selectedDepartemen          = ref(null)
const selectedStatusPegawai       = ref(null)
const selectedPendidikanPegawai   = ref(null)
const selectedJenisKelaminPegawai = ref(null)

const validationErrors = ref([]); 

const pegawaiStore    = usePegawaiStore()

const isEditMode = ref(false);

// Fungsi untuk menangani event save dari modal
const handleSavePegawai = async (pegawaiDataFromModal) => {
    const formData = new FormData();
    for (const key in pegawaiDataFromModal) {
        if (pegawaiDataFromModal[key] !== null && pegawaiDataFromModal[key] !== undefined) {
            if (key === 'avatar' && pegawaiDataFromModal[key]) {
                formData.append(key, pegawaiDataFromModal[key]);
            } else if (key !== 'avatar') {
                formData.append(key, pegawaiDataFromModal[key]);
            }
        }
    }

    try {
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token = localStorage.getItem('token');
        let response;
        let url;

        if (isEditMode.value) {
            const pegawaiIdToUpdate = selectedPegawai.value?.id_pegawai || selectedPegawai.value?.idPegawai || selectedPegawai.value?.id;
            if (!pegawaiIdToUpdate) throw new Error('ID Pegawai tidak ditemukan untuk update');
            url = $api.pegawaiUpdate(pegawaiIdToUpdate);
            console.log('Updating pegawai with ID:', pegawaiIdToUpdate, 'URL:', url);
            console.log('Form data being sent for update:', Object.fromEntries(formData));

            response = await fetch(url, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                credentials: 'include'
            });
            if (isEditMode.value) {
                formData.append('_method', 'PUT');
            }

        } else {
            url = $api.pegawai();
            console.log('Creating new pegawai. URL:', url);
            console.log('Form data being sent for create:', Object.fromEntries(formData));
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
            loadLazyData();
            fetchStats();
            Swal.fire(
                'Berhasil!',
                isEditMode.value
                    ? 'Pegawai berhasil diperbarui.'
                    : 'Pegawai berhasil dibuat.',
                'success'
            );
            handleCloseModal();
        } else {
            const errorData = await response.json();
            if (errorData.errors) {
                validationErrors.value = Array.isArray(errorData.errors)
                    ? errorData.errors
                    : Object.values(errorData.errors).flat();
            } else {
                Swal.fire('Gagal', errorData.message || (isEditMode.value ? 'Gagal memperbarui pegawai' : 'Gagal membuat pegawai'), 'error');
            }
        }
    } catch (error) {
        console.error('Save error:', error);
        Swal.fire('Error', error.message, 'error');
        validationErrors.value = [error.message];
    }
};

// Fungsi untuk menangani event close dari modal
const handleCloseModal = () => {
    const modalEl = document.getElementById('PegawaiModal'); 
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    resetParentFormState(); 
};

let searchDebounceTimer = null;
watch(globalFilterValue, (newValue) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
        lazyParams.value.search = newValue;
        lazyParams.value.first = 0;
        loadLazyData();
    }, 500);
});

onBeforeUnmount(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
});

const fetchStats = async () => {
  const defaultStats = {
    total: undefined,
    pkwtt: undefined,
    pkwt: undefined,
    resign: undefined,
    outsource: undefined
  };
  try {
    const token = localStorage.getItem('token');
    const response = await fetch($api.pegawaiCountByStatus(), {
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
            pkwtt: result.pkwtt,
            pkwt: result.pkwt,
            resign: result.resign,
            outsource: result.outsource,
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

// Fungsi untuk mengambil data menu groups
const fetchJabatan = async () => {
try {
    const token = localStorage.getItem('token')
    const response = await fetch($api.jabatan(), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    
    if (!response.ok) throw new Error('Gagal mengambil data jabatan')
    
    const data = await response.json()
    jabatan.value = data.data || data
} catch (error) {
    console.error('Error fetching jabatan:', error)
}
}

const fetchPerusahaan = async () => {
try {
    const token = localStorage.getItem('token')
    const response = await fetch($api.perusahaan(), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    
    if (!response.ok) throw new Error('Gagal mengambil data perusahaan')
    
    const data = await response.json()
    perusahaan.value = data.data || data
} catch (error) {
    console.error('Error fetching perusahaan:', error)
}
}

// Fungsi untuk mengambil data cabang berdasarkan perusahaan
const fetchCabang = async (perusahaanId) => {
    if (!perusahaanId) {
        cabang.value = [];
        return;
    }
    try {
        const token = localStorage.getItem('token');
        const response = await fetch($api.cabang(perusahaanId), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Gagal mengambil data cabang');
        const data = await response.json();
        if (Array.isArray(data)) {
            cabang.value = data;
        } else if (data && Array.isArray(data.data)) {
            cabang.value = data.data;
        } else {
            cabang.value = []; 
        }
    } catch (error) {
        console.error('Error fetching cabang:', error);
        cabang.value = [];
    }
};

// Fungsi untuk mengambil data divisi
const fetchDivisi = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch($api.divisi(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) throw new Error('Gagal mengambil data divisi')
        
        const data = await response.json()
        divisi.value = data.data || data
    } catch (error) {
        console.error('Error fetching divisi:', error)
    }
}

// Fungsi untuk mengambil data departemen berdasarkan divisi
const fetchDepartemen = async (divisiId) => {
    if (!divisiId) {
        departemen.value = [];
        return;
    }
    try {
        const token = localStorage.getItem('token');
        const response = await fetch($api.departemen(divisiId), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Gagal mengambil data departemen');
        const data = await response.json();
        if (Array.isArray(data)) {
            departemen.value = data;
        } else if (data && Array.isArray(data.data)) {
            departemen.value = data.data;
        } else {
            departemen.value = [];
        }
    } catch (error) {
        console.error('Error fetching departemen:', error);
        departemen.value = [];
    }
};

const loadLazyData = async () => {
    loading.value = true;
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            start    : lazyParams.value.first || 0,
            length   : lazyParams.value.rows || 10,
            sortField: lazyParams.value.sortField || '',
            sortOrder: lazyParams.value.sortOrder || '',
            draw     : lazyParams.value.draw || 1,
            'search[value]': lazyParams.value.search || '',
        });

        const response = await fetch(`${$api.pegawai()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data pegawai dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data pegawai');
        }

        const result = await response.json();
        pegawai.value = result.data || []; 
        totalRecords.value = parseInt(result.recordsTotal) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for pegawai:', error);
        pegawai.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data pegawai: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchJabatan();
    fetchPerusahaan();
    fetchDivisi();
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

const onSort = (event) => {
    lazyParams.value.sortField = event.sortField;
    lazyParams.value.sortOrder = event.sortOrder;
    loadLazyData();
};

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

function openAddPegawaiModal() {
    isEditMode.value = false;
    selectedPegawai.value = {
        // Set default values for a new employee if needed
        nm_pegawai: '',
        email: '',
        // ... other fields
    };
    validationErrors.value = [];

    selectedPerusahaan.value = null;
    selectedDivisi.value = null;
    cabang.value = [];
    departemen.value = [];

    const modalEl = document.getElementById('PegawaiModal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('PegawaiModal element not found or Bootstrap not loaded.');
    }
}

async function openEditPegawaiModal(pegawaiData) {
    isEditMode.value = true;
    selectedPegawai.value = JSON.parse(JSON.stringify(pegawaiData));
    validationErrors.value = [];

    const modalEl = document.getElementById('PegawaiModal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('PegawaiModal element not found or Bootstrap not loaded.');
    }
}

const resetParentFormState = () => {
    selectedPegawai.value = null;
    isEditMode.value = false;
    validationErrors.value = [];
};

const deletePegawai = async (pegawaiId) => {
if (!pegawaiId) return;

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
        const token = localStorage.getItem('token');

        // Ambil CSRF token
        const csrfResponse = await fetch($api.csrfToken(), {
            credentials: 'include'
        });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;

        const response = await fetch($api.pegawaiDelete(pegawaiId), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menghapus pegawai');
        }

        loadLazyData();
        fetchStats();

        await Swal.fire({
            title: 'Berhasil!',
            text: 'Pegawai berhasil dihapus.',
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

const filteredDepartemen = computed(() => {
    return Array.isArray(departemen.value)
    ? departemen.value.filter(d => d.divisiId === selectedDivisi.value)
    : [];
});

watch(selectedDivisi, (val) => {
    selectedDepartemen.value = null;
    if (!val) {
        departemen.value = []; 
    }
});

const filteredCabang = computed(() => {
    return Array.isArray(cabang.value)
    ? cabang.value.filter(c => c.perusahaanId === selectedPerusahaan.value)
    : [];
});

watch(selectedPerusahaan, (val) => {
    selectedCabang.value = null;
    if (!val) {
        cabang.value = [];
    }
});

const handleCompanySelectedInModal = (perusahaanId) => {
    fetchCabang(perusahaanId);
};

const handleDivisionSelectedInModal = (divisiId) => {
    fetchDepartemen(divisiId);
};

const getStatusBadge = (status) => {
    switch (status) {
        case 1:
            return { text: 'PKWTT', class: 'badge rounded-pill bg-label-primary' };
        case 2:
            return { text: 'PKWT', class: 'badge rounded-pill bg-label-secondary' };
        case 3:
            return { text: 'Outsource', class: 'badge rounded-pill bg-label-warning text-dark' };
        case 4:
            return { text: 'Resign', class: 'badge rounded-pill bg-label-danger' };
        case 5:
            return { text: 'Tidak Diketahui', class: 'badge rounded-pill bg-label-dark' };
        default:
            return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

</script>
 
 <style scoped>
    :deep(.divisi .vs__dropdown-toggle),
    :deep(.departemen .vs__dropdown-toggle),
    :deep(.jabatan .vs__dropdown-toggle),
    :deep(.perusahaan .vs__dropdown-toggle),
    :deep(.cabang .vs__dropdown-toggle),
    :deep(.select-jenis-kelamin .vs__dropdown-toggle),
    :deep(.select-pendidikan .vs__dropdown-toggle),
    :deep(.select-status-pegawai .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
 </style>