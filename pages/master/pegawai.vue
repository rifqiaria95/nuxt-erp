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
             <div class="row g-6">
                 <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                            <p class="mb-0">Total 4 users</p>
                            <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                                <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Vinnie Mostowy"
                                class="avatar pull-up">
                                <img class="rounded-circle" src="/img/avatars/5.png" alt="Avatar" />
                                </li>
                                <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Allen Rieske"
                                class="avatar pull-up">
                                <img class="rounded-circle" src="/img/avatars/12.png" alt="Avatar" />
                                </li>
                                <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Julee Rossignol"
                                class="avatar pull-up">
                                <img class="rounded-circle" src="/img/avatars/6.png" alt="Avatar" />
                                </li>
                                <li class="avatar">
                                <span
                                    class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="bottom"
                                    title="3 more"
                                    >+3</span
                                >
                                </li>
                            </ul>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                            <div class="pegawai-heading">
                                <h5 class="mb-1">Super Admin</h5>
                            </div>
                            <a href="javascript:void(0);" class="text-secondary"
                                ><i class="ri-file-copy-line ri-22px"></i
                            ></a>
                            </div>
                        </div>
                    </div>
                 </div>
                 <div class="col-xl-4 col-lg-6 col-md-6">
                     <div class="card">
                     <div class="card-body">
                         <div class="d-flex justify-content-between align-items-center mb-4">
                         <p class="mb-0">Total 7 users</p>
                         <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Jimmy Ressula"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/4.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="John Doe"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/1.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Kristi Lawker"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/2.png" alt="Avatar" />
                             </li>
                             <li class="avatar">
                             <span
                                 class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                 data-bs-toggle="tooltip"
                                 data-bs-placement="bottom"
                                 title="3 more"
                                 >+3</span
                             >
                             </li>
                         </ul>
                         </div>
                         <div class="d-flex justify-content-between align-items-center">
                         <div class="pegawai-heading">
                             <h5 class="mb-1">Admin</h5>
                             <a
                             href="javascript:;"
                             data-bs-toggle="modal"
                             data-bs-target="#PegawaiModal"
                             class="pegawai-edit-modal">
                             </a>
                         </div>
                         <a href="javascript:void(0);" class="text-secondary"
                             ><i class="ri-file-copy-line ri-22px"></i
                         ></a>
                         </div>
                     </div>
                     </div>
                 </div>
                 <div class="col-xl-4 col-lg-6 col-md-6">
                     <div class="card">
                     <div class="card-body">
                         <div class="d-flex justify-content-between align-items-center mb-4">
                         <p class="mb-0">Total 5 users</p>
                         <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Andrew Tye"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/6.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Rishi Swaat"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/9.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Rossie Kim"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/12.png" alt="Avatar" />
                             </li>
                             <li class="avatar">
                             <span
                                 class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                 data-bs-toggle="tooltip"
                                 data-bs-placement="bottom"
                                 title="3 more"
                                 >+3</span
                             >
                             </li>
                         </ul>
                         </div>
                         <div class="d-flex justify-content-between align-items-center">
                         <div class="pegawai-heading">
                             <h5 class="mb-1">Users</h5>
                             <a
                             href="javascript:;"
                             data-bs-toggle="modal"
                             data-bs-target="#PegawaiModal"
                             class="pegawai-edit-modal">
                             </a>
                         </div>
                         <a href="javascript:void(0);" class="text-secondary"
                             ><i class="ri-file-copy-line ri-22px"></i
                         ></a>
                         </div>
                     </div>
                     </div>
                 </div>
                 <div class="col-xl-4 col-lg-6 col-md-6">
                     <div class="card">
                     <div class="card-body">
                         <div class="d-flex justify-content-between align-items-center mb-4">
                         <p class="mb-0">Total 3 users</p>
                         <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Kim Karlos"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/3.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Katy Turner"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/9.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Peter Adward"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/15.png" alt="Avatar" />
                             </li>
                             <li class="avatar">
                             <span
                                 class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                 data-bs-toggle="tooltip"
                                 data-bs-placement="bottom"
                                 title="3 more"
                                 >+3</span
                             >
                             </li>
                         </ul>
                         </div>
                         <div class="d-flex justify-content-between align-items-center">
                         <div class="pegawai-heading">
                             <h5 class="mb-1">Support</h5>
                             <a
                             href="javascript:;"
                             data-bs-toggle="modal"
                             data-bs-target="#PegawaiModal"
                             class="pegawai-edit-modal">
                             </a>
                         </div>
                         <a href="javascript:void(0);" class="text-secondary"
                             ><i class="ri-file-copy-line ri-22px"></i
                         ></a>
                         </div>
                     </div>
                     </div>
                 </div>
                 <div class="col-xl-4 col-lg-6 col-md-6">
                     <div class="card">
                     <div class="card-body">
                         <div class="d-flex justify-content-between align-items-center mb-4">
                         <p class="mb-0">Total 2 users</p>
                         <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Kim Merchent"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/10.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Sam D'souza"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/13.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Nurvi Karlos"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/15.png" alt="Avatar" />
                             </li>
                             <li class="avatar">
                             <span
                                 class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                 data-bs-toggle="tooltip"
                                 data-bs-placement="bottom"
                                 title="3 more"
                                 >+3</span
                             >
                             </li>
                         </ul>
                         </div>
                         <div class="d-flex justify-content-between align-items-center">
                         <div class="pegawai-heading">
                             <h5 class="mb-1">Restricted User</h5>
                             <a
                             href="javascript:;"
                             data-bs-toggle="modal"
                             data-bs-target="#PegawaiModal"
                             class="pegawai-edit-modal">
                             </a>
                         </div>
                         <a href="javascript:void(0);" class="text-secondary"
                             ><i class="ri-file-copy-line ri-22px"></i
                         ></a>
                         </div>
                     </div>
                     </div>
                 </div>
                 <div class="col-xl-4 col-lg-6 col-md-6">
                     <div class="card h-100">
                     <div class="row h-100">
                         <div class="col-5">
                         <div class="d-flex align-items-end h-100 justify-content-center">
                             <img
                             src="/img/illustrations/add-new-role-illustration.png"
                             class="img-fluid"
                             alt="Image"
                             width="68" />
                         </div>
                         </div>
                         <div class="col-7">
                         <div class="card-body text-sm-end text-center ps-sm-0">
                             <button
                             data-bs-target="#PegawaiModal"
                             data-bs-toggle="modal"
                             class="btn btn-sm btn-primary mb-4 text-nowrap add-new-pegawai"
                             @click="openAddPegawaiModal"
                             >
                             Tambah Pegawai
                             </button>
                         </div>
                         </div>
                     </div>
                     </div>
                 </div>
 
                 <div class="col-12">
                     <h4 class="mt-6 mb-1">Total Pegawai</h4>
                     <p class="mb-0">Find all of your company's administrator accounts and their associate Pegawai.</p>
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
                                 <span class="p-input-icon-left">
                                     <InputText v-model="lazyParams.search" placeholder="Cari pegawai..." @keyup.enter="handleSearch" style="width: 20rem;" />
                                 </span>
                             </div>
                         </div>
                         <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable 
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
                                <Column field="id_pegawai" header="#" :sortable="true"></Column> 
                                <Column field="nm_pegawai" header="Nama Pegawai" :sortable="true"></Column>
                                <Column field="email" header="Email" :sortable="true"></Column>
                                <Column field="tgl_lahir_pegawai" header="Tanggal Lahir" :sortable="true">
                                    <template #body="slotProps">
                                        {{ new Date(slotProps.data.tgl_lahir_pegawai).toLocaleDateString() }}
                                    </template>
                                </Column>
                                <Column field="tmp_lahir_pegawai" header="Tempat Lahir" :sortable="true"></Column>
                                <Column field="alamat_pegawai" header="Alamat" :sortable="true"></Column>
                                <Column field="status_pegawai" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.status_pegawai).class">
                                            {{ getStatusBadge(slotProps.data.status_pegawai).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
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
import { ref, computed, onMounted, watch } from 'vue'
import { usePegawaiStore } from '~/stores/pegawai'
import vSelect from 'vue-select'
import Swal from 'sweetalert2'
import 'vue-select/dist/vue-select.css'

// Import komponen modal
import PegawaiModal from '~/components/pegawai/PegawaiModal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'

const { $api } = useNuxtApp()

const pegawai             = ref([])
const selectedPegawai     = ref(null)
const loading             = ref(false);
const totalRecords        = ref(0);
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
const jabatanStore    = useJabatanStore()
const divisiStore     = useDivisiStore()
const departemenStore = useDepartemenStore()
const perusahaanStore = usePerusahaanStore()
const cabangStore     = useCabangStore()

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
                method: 'POST',
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
            handleCloseModal();
            Swal.fire(
                'Berhasil!',
                `Pegawai berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
                'success'
            );
        } else {
            const errorData = await response.json();
            if (errorData.errors) {
                validationErrors.value = Array.isArray(errorData.errors)
                    ? errorData.errors
                    : Object.values(errorData.errors).flat();
            } else {
                Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} pegawai`, 'error');
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
            page     : (lazyParams.value.first / lazyParams.value.rows) + 1,
            rows     : lazyParams.value.rows,
            sortField: lazyParams.value.sortField || '',
            sortOrder: lazyParams.value.sortOrder || '',
            draw     : lazyParams.value.draw || 1,
            search   : lazyParams.value.search || '',
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

function openAddPegawaiModal() {
    isEditMode.value = false;
    selectedPegawai.value = {};
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

async function openEditPegawaiModal(pegawai) {
    isEditMode.value = true;
    selectedPegawai.value = JSON.parse(JSON.stringify(pegawai));
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