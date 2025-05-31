<template>
    <!-- Content wrapper -->
    <div class="content-wrapper">
         <!-- Content -->
 
         <div class="container-xxl flex-grow-1 container-p-y">
             <h4 class="mb-1">Permissions List</h4>
             <p class="mb-6">
             A permission provided access to predefined menus and features so that depending on assigned permission an
             administrator can have access to what user needs.
             </p>
             <!-- permission cards -->
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
                         <div class="permission-heading">
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
                         <div class="permission-heading">
                             <h5 class="mb-1">Admin</h5>
                             <a
                             href="javascript:;"
                             data-bs-toggle="modal"
                             data-bs-target="#PermissionModal"
                             class="permission-edit-modal">
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
                         <div class="permission-heading">
                             <h5 class="mb-1">Users</h5>
                             <a
                             href="javascript:;"
                             data-bs-toggle="modal"
                             data-bs-target="#PermissionModal"
                             class="permission-edit-modal">
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
                         <div class="permission-heading">
                             <h5 class="mb-1">Support</h5>
                             <a
                             href="javascript:;"
                             data-bs-toggle="modal"
                             data-bs-target="#PermissionModal"
                             class="permission-edit-modal">
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
                         <div class="permission-heading">
                             <h5 class="mb-1">Restricted User</h5>
                             <a
                             href="javascript:;"
                             data-bs-toggle="modal"
                             data-bs-target="#PermissionModal"
                             class="permission-edit-modal">
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
                             data-bs-target="#PermissionModal"
                             data-bs-toggle="modal"
                             class="btn btn-sm btn-primary mb-4 text-nowrap add-new-permission"
                             @click="openAddPermissionModal"
                             >
                             Add permission
                             </button>
                         </div>
                         </div>
                     </div>
                     </div>
                 </div>
 
                 <div class="col-12">
                     <h4 class="mt-6 mb-1">Total Roles with their Permissions</h4>
                     <p class="mb-0">Find all of your company's administrator accounts and their associate Permissions.</p>
                 </div>
                 <div class="col-12">
                     <!-- permission Table -->
                     <div class="card">
                         <div class="card-datatable table-responsive py-5 px-3">
                             <table id="table-permissions" class="table">
                             <thead>
                                 <tr>
                                 <th>#</th>
                                 <th>Name</th>
                                 <th>Menu Group</th>
                                 <th>Menu Details</th>
                                 <th>Assigned To</th>
                                 <th>Actions</th>
                                 </tr>
                             </thead>
                             </table>
                         </div>
                     </div>
                     <!--/ permission Table -->
                 </div>
             </div>
             <!--/ permission cards -->
 
             <!-- Add permission Modal -->
             <div class="modal fade" id="PermissionModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-simple modal-dialog-centered modal-add-new-permission">
                    <div class="modal-content">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div class="modal-body p-0">
                            <div class="text-center mb-6">
                            <h4 class="permission-title mb-2 pb-0">Add New Permission</h4>
                            <p>Set Permissions</p>
                            </div>
                            <div v-if="validationErrors.length" class="alert alert-danger">
                                <ul>
                                    <li v-for="err in validationErrors" :key="err.message || err">
                                    {{ typeof err === 'string' ? err : err.message }}
                                    </li>
                                </ul>
                            </div>
                            <!-- Add permission form -->
                            <form id="addPermissionForm" class="row g-3" onsubmit="return false">
                                <div class="col-4 mb-3">
                                    <label for="modalPermissionName">Permission Name</label>
                                    <input
                                        type="text"
                                        id="modalPermissionName"
                                        name="modalPermissionName"
                                        class="form-control"
                                        placeholder="Enter a permission name"
                                        tabindex="-1"
                                        required
                                    />
                                </div>
                                <div class="col-4 mb-3">
                                    <label for="menuGroup">Menu Group</label>
                                    <v-select
                                        v-model="selectedMenuGroup"
                                        :options="menuGroups"
                                        label="name"
                                        :reduce="group => group.id"
                                        placeholder="-- Pilih Menu Group --"
                                        id="menuGroup"
                                        class="menu-group"
                                    />                                    
                                </div>
                                <div class="col-4 mb-3">
                                    <label for="menuDetail">Menu Detail</label>
                                    <v-select
                                        v-model="selectedMenuDetail"
                                        :options="filteredMenuDetails"
                                        label="name"
                                        :reduce="detail => detail.id"
                                        placeholder="-- Pilih Menu Detail --"
                                        id="menuDetail"
                                        class="menu-detail"
                                    />                                    
                                </div>
                                <div class="col-12 d-flex flex-wrap justify-content-center gap-4 row-gap-4">
                                    <button class="btn btn-primary"
                                        @click="selectedRole && selectedRole.id ? submitUpdatedPermissions() : submitNewPermission()">
                                        Submit
                                    </button>
                                    <button
                                    type="reset"
                                    class="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                    Cancel
                                    </button>
                                </div>
                            </form>
                            <!--/ Add permission form -->
                        </div>
                    </div>
                </div>
             </div>
             <!--/ Add permission Modal -->
         </div>
         <!-- / Content -->
 
         <div class="content-backdrop fade"></div>
     </div>
     <!-- Content wrapper -->
 </template>
 
 <script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePermissionsStore } from '~/stores/permissions'
import vSelect from 'vue-select'
import Swal from 'sweetalert2'
import 'vue-select/dist/vue-select.css'

const { $api } = useNuxtApp()

const permissions         = ref([])
const selectedRole        = ref(null)
const selectedPermissions = ref([])

// State untuk menu groups dan details
const menuGroups = ref([])
const menuDetails = ref([])
const selectedMenuGroup = ref(null)
const selectedMenuDetail = ref(null)

const validationErrors = ref([]);

const permissionsStore = usePermissionsStore()

// Fungsi untuk update opsi menu detail
const updateMenuDetailOptions = () => {
    nextTick(() => {
        const $menuDetail = $('#selectMenuDetail')
        if ($menuDetail.length) {
            $menuDetail.empty()
            $menuDetail.append('<option value="">Pilih Menu Detail</option>')
            menuDetails.value.forEach(detail => {
                $menuDetail.append(`<option value="${detail.id}">${detail.name}</option>`)
            })
            $menuDetail.trigger('change')
        }
    })
}

// Fungsi untuk mengambil data menu groups
const fetchMenuGroups = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch($api.menuGroups(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) throw new Error('Gagal mengambil data menu groups')
        
        const data = await response.json()
        menuGroups.value = data.data || data
    } catch (error) {
        console.error('Error fetching menu groups:', error)
    }
}

// Fungsi untuk mengambil data menu details berdasarkan group
const fetchMenuDetails = async (groupId) => {
    if (!groupId) return;
    try {
        const token = localStorage.getItem('token');
        const response = await fetch($api.getMenuDetails(groupId), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Gagal mengambil data menu details');
        const data = await response.json();
        // Ambil menuDetails dari response
        menuDetails.value = Array.isArray(data.menuDetails) ? data.menuDetails : [];
        updateMenuDetailOptions();
    } catch (error) {
        console.error('Error fetching menu details:', error);
    }
};

// Di bagian onMounted
onMounted(async () => {
    try {
        await fetchPermissionsWithRelations()
        await fetchMenuGroups()
        await fetchMenuDetails()

        // Inisialisasi DataTable
        $('#table-permissions').DataTable({
            serverSide: true,
            processing: true,
            responsive: true,
            autoWidth: true,
            order: [[0, 'desc']],
            ajax: {
                url: $api.permissions(),
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
                }
            },
            columns: [
                { data: null, render: (data, type, row, meta) => meta.row + 1 + '.' },
                { data: 'name', defaultContent: '-' },
                { 
                    data: 'menuGroups', 
                    render: function(data, type, row) {
                        if (Array.isArray(row.menuGroups) && row.menuGroups.length > 0) {
                            return row.menuGroups.map(g => g.name).join(', ')
                        }
                        return '-'
                    },
                    defaultContent: '-'
                },
                { 
                    data: 'menuDetails', 
                    render: function(data, type, row) {
                        if (Array.isArray(row.menuDetails) && row.menuDetails.length > 0) {
                            return row.menuDetails.map(d => d.name).join(', ')
                        }
                        return '-'
                    },
                    defaultContent: '-'
                },
                { 
                    data: 'assignedRoles',
                    render: function(data, type, row) {
                        if (Array.isArray(row.assignedRoles) && row.assignedRoles.length > 0) {
                            return row.assignedRoles.map(r => {
                                let badgeClass = 'bg-label-info'
                                if (r.id === 1) badgeClass = 'bg-label-primary'
                                else if (r.id === 2) badgeClass = 'bg-label-warning'
                                else if (r.id === 3) badgeClass = 'bg-label-success'
                                // Tambahkan class mt-3 di setiap badge
                                return `<span class="badge rounded-pill ${badgeClass} mt-3">${r.name}</span>`
                            }).join(' ')
                        }
                        return '-'
                    },
                    defaultContent: '-'
                },
                { 
                    data: null, 
                    render: function(data, type, row) {
                        return `
                            <div class="d-flex align-items-center">
                                <span class="text-nowrap">
                                    <button 
                                        class="btn btn-icon btn-text-secondary rounded-pill edit-permission-btn" 
                                        data-id="${row.id}" 
                                        aria-label="Edit Permission"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="top"
                                        title="Edit Permission"
                                    >
                                        <i class="icon-base ri ri-edit-box-line icon-20px"></i>
                                    </button>
                                    <button
                                    class="btn btn-sm btn-icon btn-text-secondary rounded-pill delete-record text-body waves-effect me-1" data-id="${row.id}"
                                    aria-label="Delete Permission"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Delete Permission"
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
        $('#table-permissions tbody').off('click', '.edit-permission-btn').on('click', '.edit-permission-btn', async function () {
            const permissionId = $(this).data('id')
            try {
                const response = await fetch($api.permissionShow(permissionId), {
                    headers: { 
                        Authorization: `Bearer ${localStorage.getItem('token')}` 
                    }
                })
                
                if (!response.ok) {
                    throw new Error('Gagal mengambil data permission')
                }
                
                const permissionData = await response.json()
                await openEditPermissionModal(permissionData)
            } catch (error) {
                console.error('Error:', error)
                alert('Gagal memuat data permission: ' + error.message)
            }
        })

        $('#table-permissions tbody').off('click', '.delete-record').on('click', '.delete-record', async function (e) {
            e.preventDefault()
            e.stopPropagation()
            const permissionId = $(this).data('id')
            await deletePermission(permissionId)
        })

    } catch (error) {
        console.error('Error:', error)
    }
})

function openAddPermissionModal() {
    selectedRole.value = null;
    document.getElementById('modalPermissionName').value = '';
    selectedPermissions.value = [];
    if (window.permissionModal) {
        window.permissionModal.show();
    } else {
        const modalEl = document.getElementById('PermissionModal');
        window.permissionModal = new bootstrap.Modal(modalEl);
        window.permissionModal.show();
    }
    // Bersihkan backdrop jika ada setelah modal ditutup
    const modalEl = document.getElementById('PermissionModal');
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.style.overflow = '';
        }, { once: true });
    }
}

async function openEditPermissionModal(permission) {
    try {
        if (!permission || !permission.id) {
            throw new Error('permission tidak valid');
        }

        // Debug: log permission data yang diterima
        console.log('permission data loaded (openEditPermissionModal):', permission);

        // Simpan permission yang dipilih
        selectedRole.value = permission;

        // Set nilai input
        const modalPermissionName = document.getElementById('modalPermissionName');
        if (modalPermissionName) {
            modalPermissionName.value = permission.name || '';
        }

        // Set permissions yang dipilih, pastikan selalu array baru
        selectedPermissions.value = [];
        
        // Handle both response formats (API might return permissions as array of objects or just IDs)
        if (permission.permissions && Array.isArray(permission.permissions)) {
            if (permission.permissions.length > 0) {
                if (typeof permission.permissions[0] === 'object') {
                    // Format: [{id: 1, name: 'view_user'}, ...]
                    selectedPermissions.value = permission.permissions
                        .map(p => p.id)
                        .filter(id => id && id > 0);
                } else {
                    // Format: [1, 2, 3]
                    selectedPermissions.value = permission.permissions
                        .filter(id => id && id > 0);
                }
            }
        }

        // Debug: log selectedPermissions after set
        console.log('selectedPermissions after openEditPermissionModal:', selectedPermissions.value);

        // Tampilkan modal
        if (window.permissionModal) {
            window.permissionModal.show();
        } else {
            const modalEl = document.getElementById('PermissionModal');
            window.permissionModal = new bootstrap.Modal(modalEl);
            window.permissionModal.show();
        }
        
        // Bersihkan backdrop jika ada setelah modal ditutup
        const modalEl = document.getElementById('PermissionModal');
        if (modalEl) {
            modalEl.addEventListener('hidden.bs.modal', () => {
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.style.overflow = '';
            }, { once: true });
        }

    } catch (error) {
        console.error('Error in openEditPermissionModal:', error);
        alert('Error: ' + error.message);
    }
}

const fetchPermissionsWithRelations = async () => {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch($api.getPermissions(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Gagal mengambil data permissions');
        }

        const data = await res.json();
        
        // Log data untuk debugging
        console.log('Permissions dengan relasi:', data);
        
        // Simpan data ke ref permissions
        permissions.value = data.data || data;

        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const submitNewPermission = async () => {
    console.log('Fungsi: submitNewPermission dipanggil');
    try {
        // First get the CSRF token if needed
        const csrfResponse = await fetch($api.csrfToken(), {
            credentials: 'include'
        });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;

        const token = localStorage.getItem('token');
        
        const response = await fetch($api.permissionStore(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-CSRF-TOKEN': csrfToken || ''
            },
            credentials: 'include',
            body: JSON.stringify({
                name: document.getElementById('modalPermissionName').value,
                menuGroupIds: selectedMenuGroup.value ? [selectedMenuGroup.value] : [],
                menuDetailIds: selectedMenuDetail.value ? [selectedMenuDetail.value] : [],
            })
        });

        if (response.ok) {
            const data = await response.json();
            $('#table-permissions').DataTable().ajax.reload(null, false);
            
            // Reset selectedRole and selectedPermissions after update
            selectedMenuGroup.value = null;
            selectedMenuDetail.value = null;
            // Optionally clear the modal input
            const modalPermissionName = document.getElementById('modalPermissionName');
            if (modalPermissionName) modalPermissionName.value = '';

            // Refresh permissionsStore data
            permissionsStore.fetchPermissions();

            // Tutup modal dengan benar
            const modalEl = document.getElementById('PermissionModal');
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();

                // Bersihkan backdrop setelah modal tertutup
                modalEl.addEventListener('hidden.bs.modal', () => {
                    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                    document.body.style.overflow = '';
                }, { once: true });
            }
            await Swal.fire({
                title: 'Berhasil!',
                text: 'Permission berhasil dibuat.',
                icon: 'success'
            });
        } else {
            const errorData = await response.json();
            if (errorData.errors) {
            // Jika errors adalah object, flatten ke array
            validationErrors.value = Array.isArray(errorData.errors)
                ? errorData.errors
                : Object.values(errorData.errors).flat();
            } else {
                alert(errorData.message || 'Gagal membuat permission');
            }  
        }
    } catch (error) {
        console.error('Create error:', error);
        alert(error.message);
    }
};

const submitUpdatedPermissions = async () => {
    try {
        if (!selectedRole.value || !selectedRole.value.id) {
            console.error('selectedRole atau ID-nya tidak ada saat update.');
            throw new Error('permission yang dipilih tidak memiliki ID. Tidak dapat memperbarui.');
        }

        const permissionIdToUpdate = selectedRole.value.id;
        console.log('ID permission yang akan diupdate:', permissionIdToUpdate);

        const csrfResponse = await fetch($api.csrfToken(), {
            credentials: 'include'
        });

        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token = localStorage.getItem('token');
        const url = $api.permissionUpdate(permissionIdToUpdate);
        console.log('URL yang akan dituju:', url);

        const permissionsToSend = selectedPermissions.value
        .filter(p => typeof p === 'number' && p > 0);

        console.log('Permissions yang akan dikirim (FINAL):', permissionsToSend);

        const payload = {
            name: document.getElementById('modalPermissionName').value,
            menuGroupIds: selectedMenuGroup.value ? [selectedMenuGroup.value] : [],
            menuDetailIds: selectedMenuDetail.value ? [selectedMenuDetail.value] : [],
        };
        console.log('Payload yang akan dikirim (FINAL):', payload);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-CSRF-TOKEN': csrfToken || ''
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            $('#table-permissions').DataTable().ajax.reload(null, false);

            // Reset selectedRole and selectedPermissions after update
            selectedMenuGroup.value = null;
            selectedMenuDetail.value = null;
            // Optionally clear the modal input
            const modalPermissionName = document.getElementById('modalPermissionName');
            if (modalPermissionName) modalPermissionName.value = '';

            // Refresh permissionsStore data
            permissionsStore.fetchPermissions();

            // Tutup modal dengan benar
            const modalEl = document.getElementById('PermissionModal');
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();

                // Bersihkan backdrop setelah modal tertutup
                modalEl.addEventListener('hidden.bs.modal', () => {
                    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                    document.body.style.overflow = '';
                }, { once: true });
            }

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Permission berhasil diperbarui.',
                icon: 'success'
            });
        } else {
            const errorData = await response.json();
            if (errorData.errors) {
                // Tampilkan error validasi
                validationErrors.value = Object.values(errorData.errors).flat();
            } else {
                alert(errorData.message || 'Gagal membuat permission');
            }  
        }

    } catch (error) {
        console.error('Update error (frontend catch):', error);
        alert(error.message);
    }
};


const deletePermission = async (permissionId) => {
    if (!permissionId) return;

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
            // Validasi ID role yang akan dihapus
            if (!permissionId) {
                console.error('ID permission tidak ditemukan untuk proses hapus.');
                throw new Error('Permission yang dipilih tidak memiliki ID. Tidak dapat menghapus.');
            }

            // Ambil token dari localStorage
            const token = localStorage.getItem('token');

            // Ambil CSRF token
            const csrfResponse = await fetch($api.csrfToken(), {
                credentials: 'include'
            });
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.token;

            // Endpoint hapus role
            const url = $api.permissionDelete(permissionId);
            console.log('URL hapus permission:', url);

            // Request hapus role
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus role');
            }

            // Reload tabel
            $('#table-permissions').DataTable().ajax.reload(null, false);

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Role berhasil dihapus.',
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

const filteredMenuDetails = computed(() => {
  return Array.isArray(menuDetails.value)
    ? menuDetails.value.filter(detail => detail.menuGroupId === selectedMenuGroup.value)
    : [];
});

watch(selectedMenuGroup, (val) => {
  if (val) fetchMenuDetails(val)
})

 </script>
 
 <style scoped>
    :deep(.menu-group .vs__dropdown-toggle),
    :deep(.menu-detail .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
 </style>