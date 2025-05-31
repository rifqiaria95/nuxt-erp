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
                     <h4 class="mt-6 mb-1">Total Roles with their Pegawai</h4>
                     <p class="mb-0">Find all of your company's administrator accounts and their associate Pegawai.</p>
                 </div>
                 <div class="col-12">
                     <!-- pegawai Table -->
                     <div class="card">
                         <div class="card-datatable table-responsive py-5 px-3">
                             <table id="table-pegawai" class="datatables-basic table">
                             <thead>
                                 <tr>
                                 <th>#</th>
                                 <th>Name</th>
                                 <th>Email</th>
                                 <th>Date of Birth</th>
                                 <th>Place of Birth</th>
                                 <th>Address</th>
                                 <th>Status</th>
                                 <th>Actions</th>
                                 </tr>
                             </thead>
                             </table>
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

const { $api } = useNuxtApp()

const pegawai             = ref([])
const selectedPegawai     = ref(null)

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
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || ''
                },
                credentials: 'include'
            });

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
            $('#table-pegawai').DataTable().ajax.reload(null, false);
            pegawaiStore.fetchPegawai(); 
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

// Fungsi untuk mengambil data menu details berdasarkan group
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

// Fungsi untuk mengambil data menu details berdasarkan group
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

// Di bagian onMounted
onMounted(async () => {
try {
    await fetchJabatan()
    await fetchDivisi()
    await fetchPerusahaan()

    // Inisialisasi DataTable
    $('#table-pegawai').DataTable({
        serverSide: true,
        processing: true,
        responsive: true,
        autoWidth: true,
        order: [[0, 'desc']],
        ajax: {
            url: $api.pegawai(),
            type: 'GET',
            dataSrc: function(json) {
                return json.data || json
            },
            beforeSend: function (xhr) {
                const token = localStorage.getItem('token')
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
                }
            },
            xhrFields: {
                withCredentials: true
            },
            cache: false
        },
        columns: [
            { data: null, render: (data, type, row, meta) => meta.row + 1 + '.' },
            { data: 'nm_pegawai', defaultContent: '-' },
            { data: 'email', defaultContent: '-' },
            { 
                data: 'tgl_lahir_pegawai', 
                defaultContent: '-', 
                render: function(data, type, row) {
                    if (!data) return '-';
                    const dateObj = new Date(data);
                    if (isNaN(dateObj)) return '-';
                    // Format: DD-MM-YYYY
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    return `${day}-${month}-${year}`;
                }
            },
            { data: 'tmp_lahir_pegawai', defaultContent: '-' },
            { data: 'alamat_pegawai', defaultContent: '-' },
            { 
                data: 'status_pegawai', 
                defaultContent: '-', 
                render: function(data, type, row) {
                    if (data === 1) return '<span class="badge rounded-pill bg-label-primary">PKWTT</span>';
                    if (data === 2) return '<span class="badge rounded-pill bg-label-secondary">PKWT</span>';
                    if (data === 3) return '<span class="badge rounded-pill bg-label-warning text-dark">Outsource</span>';
                    if (data === 4) return '<span class="badge rounded-pill bg-label-warning text-danger">Resign</span>';
                    if (data === 5) return '<span class="badge rounded-pill bg-label-dark">Tidak diketahui</span>';
                    return '-';
                }
            },
            { 
                data: null, 
                render: function(data, type, row) {
                    return `
                        <div class="d-flex align-items-center">
                            <span class="text-nowrap">
                                <button 
                                    class="btn btn-icon btn-text-secondary rounded-pill edit-pegawai-btn" 
                                    data-id="${row.id_pegawai || row.idPegawai || row.id}" 
                                    aria-label="Edit Pegawai"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Edit Pegawai"
                                >
                                    <i class="icon-base ri ri-edit-box-line icon-20px"></i>
                                </button>
                                <button
                                class="btn btn-sm btn-icon btn-text-secondary rounded-pill delete-record text-body waves-effect me-1" data-id="${row.id_pegawai || row.idPegawai || row.id}"
                                aria-label="Delete Pegawai"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Delete Pegawai"
                                >
                                    <i class="icon-base ri ri-delete-bin-7-line icon-20px"></i>
                                </button>
                            </span>
                        </div>
                    `
                }
            }
        ]
    })

    // Event handlers untuk tombol edit dan delete
    $('#table-pegawai tbody').off('click', '.edit-pegawai-btn').on('click', '.edit-pegawai-btn', async function () {
        const pegawaiId = $(this).data('id')
        try {
            const response = await fetch($api.pegawai(pegawaiId), {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            })
            
            if (!response.ok) {
                throw new Error('Gagal mengambil data pegawai')
            }
            
            const pegawaiData = await response.json()
            const pegawaiRaw = pegawaiData.data || pegawaiData
            const pegawaiObj = Array.isArray(pegawaiRaw)
            ? pegawaiRaw.find(p => p.id_pegawai == pegawaiId || p.idPegawai == pegawaiId)
            : pegawaiRaw;
            openEditPegawaiModal(pegawaiObj)
        } catch (error) {
            alert('Gagal memuat data pegawai: ' + error.message)
        }
    })

    $('#table-pegawai tbody').off('click', '.delete-record').on('click', '.delete-record', async function (e) {
        e.preventDefault()
        e.stopPropagation()
        const pegawaiId = $(this).data('id')
        await deletePegawai(pegawaiId)
    })

} catch (error) {
    console.error('Error:', error)
}
})

function openAddPegawaiModal() {
    isEditMode.value = false;
    selectedPegawai.value = {};
    validationErrors.value = [];

    // Reset pilihan dan data dependen di parent saat membuka modal untuk Tambah
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

    // Untuk mode edit, kita perlu pre-fetch cabang dan departemen jika perusahaan/divisi sudah ada
    // const history = pegawai.history; // Tidak pre-fetch di sini lagi
    // if (history && history.perusahaan?.id) {
    //     await fetchCabang(history.perusahaan.id);
    // }
    // if (history && history.divisi?.id) {
    //     await fetchDepartemen(history.divisi.id);
    // }

    const modalEl = document.getElementById('PegawaiModal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('PegawaiModal element not found or Bootstrap not loaded.');
    }
}

// Fungsi untuk reset form di parent (hanya state parent)
const resetParentFormState = () => {
    selectedPegawai.value = null;
    isEditMode.value = false;
    validationErrors.value = [];
};

const deletePegawai= async (pegawaiId) => {
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

        const response = await fetch($api.pegawaiDelete(pegawaiId), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menghapus pegawai');
        }

        $('#table-pegawai').DataTable().ajax.reload(null, false);

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