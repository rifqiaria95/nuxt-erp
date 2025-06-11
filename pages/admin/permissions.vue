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
             <div class="row g-6 mb-6">
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
                <CardBox
                    :isAddButtonCard="true"
                    image-src="/img/illustrations/add-new-role-illustration.png"
                    image-alt="Tambah Permission"
                    button-text="Tambah Permission"
                    modal-target="#Modal" 
                    @button-click="openAddPermissionModal"
                />
             </div>
 
             <div class="row g-6">
                 <div class="col-12">
                     <h4 class="mt-6 mb-1">Total Roles with their Permissions</h4>
                     <p class="mb-0">Find all of your company's administrator accounts and their associate Permissions.</p>
                 </div>
                 <div class="col-12">
                    <!-- permission Table -->
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
                                        placeholder="Cari permission..."
                                        class="w-full md:w-20rem"
                                    />
                                </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="permissions" 
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
                            :filters="filters"
                            :globalFilterFields="['name', 'menuGroups', 'menuDetails']"
                            >
                            <Column field="id" header="#" :sortable="true" style="width: 50px;"></Column> 
                                <Column field="name" header="Nama Permission" :sortable="true"></Column>
                                
                                <Column field="menuGroups" header="Menu Group" :sortable="true">
                                    <template #body="slotProps">
                                        <span v-if="Array.isArray(slotProps.data.menuGroups) && slotProps.data.menuGroups.length > 0">
                                            {{ slotProps.data.menuGroups.map(g => g.name).join(', ') }}
                                        </span>
                                        <span v-else>-</span>
                                    </template>
                                </Column>
                                <Column field="menuDetails" header="Menu Details" :sortable="true">
                                    <template #body="slotProps">
                                        <span v-if="Array.isArray(slotProps.data.menuDetails) && slotProps.data.menuDetails.length > 0">
                                            {{ slotProps.data.menuDetails.map(d => d.name).join(', ') }}
                                        </span>
                                        <span v-else>-</span>
                                    </template>
                                </Column>
                                <Column field="assignedRoles" header="Assigned To">
                                    <template #body="slotProps">
                                        <template v-if="Array.isArray(slotProps.data.assignedRoles) && slotProps.data.assignedRoles.length > 0">
                                            <span v-for="r in slotProps.data.assignedRoles" :key="r.id" 
                                                  :class="['badge', 'rounded-pill', getBadgeClass(r.id), 'mt-1']"
                                                  style="margin-right: 5px;">
                                                {{ r.name }}
                                            </span>
                                        </template>
                                        <span v-else>-</span>
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button @click="openEditPermissionModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button @click="deletePermission(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ permission Table -->
                 </div>
             </div>
             <!--/ permission cards -->
 
            <Modal 
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
            >
                <template #default>
                    <form @submit.prevent="handleSavePermission">
                        <div class="row g-3">
                            <div class="col-12 mb-3">
                                <label for="modalPermissionName">Permission Name</label>
                                <input
                                    type="text"
                                    id="modalPermissionName"
                                    v-model="formPermission.name"
                                    class="form-control"
                                    placeholder="Enter a permission name"
                                    required
                                />
                            </div>
                            <div class="col-6 mb-3">
                                <label for="menuGroup">Menu Group</label>
                                <v-select
                                    v-model="formPermission.menuGroupId"
                                    :options="menuGroups"
                                    label="name"
                                    :reduce="group => group.id"
                                    placeholder="-- Pilih Menu Group --"
                                    id="menuGroup"
                                    class="menu-group"
                                />                                    
                            </div>
                            <div class="col-6 mb-3">
                                <label for="menuDetail">Menu Detail</label>
                                <v-select
                                    v-model="formPermission.menuDetailId"
                                    :options="filteredMenuDetails"
                                    label="name"
                                    :reduce="detail => detail.id"
                                    placeholder="-- Pilih Menu Detail --"
                                    id="menuDetail"
                                    class="menu-detail"
                                />                                    
                            </div>
                            <div class="col-12 d-flex flex-wrap justify-content-center gap-4 row-gap-4">
                                <button
                                    type="submit"
                                    class="btn btn-primary"
                                >
                                    {{ isEditMode ? 'Update' : 'Simpan' }}
                                </button>
                                <button type="button" class="btn btn-outline-secondary" @click="handleCloseModal">
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
     <!-- Content wrapper -->
 </template>
 
 <script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import { usePermissionsStore } from '~/stores/permissions'
import vSelect from 'vue-select'
import Swal from 'sweetalert2'
import 'vue-select/dist/vue-select.css'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'

const { $api } = useNuxtApp()

const myDataTableRef = ref(null)
const globalFilterValue = ref('')
const permissionsStore = usePermissionsStore()
const permissions = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const lazyParams = ref({
    first: 0,
    rows: 10,
    sortField: 'id',
    sortOrder: 'desc',
    search: '',
    draw: 1,
})

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

let searchDebounceTimer = null;
watch(globalFilterValue, (newValue) => {
    filters.value.global.value = newValue;

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

const isEditMode = ref(false)
const selectedPermission = ref(null)
const validationErrors = ref([])
const menuGroups = ref([])
const menuDetails = ref([])

const formPermission = ref({
    id: null,
    name: '',
    menuGroupId: null,
    menuDetailId: null,
})

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Permission' : 'Tambah Permission');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data permission di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan permission baru.');

const handleCloseModal = () => {
    const modalEl = document.getElementById('Modal'); 
    if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
        
        // Bersihkan backdrop setelah modal tertutup
        modalEl.addEventListener('hidden.bs.modal', () => {
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
            document.body.style.overflow = '';
        }, { once: true });
    }
    resetFormState(); 
};

const resetFormState = () => {
    formPermission.value = {
        id: null,
        name: '',
        menuGroupId: null,
        menuDetailId: null,
    };
    validationErrors.value = [];
};

const loadLazyData = async () => {
    loading.value = true;
    lazyParams.value.draw++;
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            draw: lazyParams.value.draw,
            start: lazyParams.value.first,
            length: lazyParams.value.rows,
            sortField: lazyParams.value.sortField || 'id',
            sortOrder: lazyParams.value.sortOrder || 'asc',
            search: lazyParams.value.search || '',
        });

        const response = await fetch(`${$api.permissions()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data permissions dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data permissions');
        }

        const result = await response.json();
        permissions.value = result.data || []; 
        totalRecords.value = result.recordsTotal || result.recordsFiltered || (result.meta ? result.meta.total : 0) || 0;
        
        if (result.draw) {
            lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for permissions:', error);
        permissions.value = [];
        Swal.fire('Error', `Tidak dapat memuat data permissions: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

const handleSavePermission = async () => {
    loading.value = true;
    validationErrors.value = []; 

    try {
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token = localStorage.getItem('token');
        
        let response;
        let url;

        const payload = {
            name: formPermission.value.name,
            menuGroupIds: formPermission.value.menuGroupId ? [formPermission.value.menuGroupId] : [],
            menuDetailIds: formPermission.value.menuDetailId ? [formPermission.value.menuDetailId] : [],
        };
        
        if (isEditMode.value) {
            const permissionIdToUpdate = formPermission.value.id;
            if (!permissionIdToUpdate) {
                Swal.fire('Error', 'ID Permission tidak ditemukan untuk update.', 'error');
                loading.value = false;
                return;
            }
            url = $api.permissionUpdate(permissionIdToUpdate);
            response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        } else {
            url = $api.permissionStore();
            response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(payload),
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
            permissionsStore.fetchPermissions();
            await Swal.fire(
                'Berhasil!',
                `Permission berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
                'success'
            );
        } else {
            const errorData = await response.json();
            if (errorData.errors) {
                validationErrors.value = Object.values(errorData.errors).flat();
            } else {
                Swal.fire('Gagal', errorData.message || 'Gagal menyimpan permission', 'error');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Terjadi kesalahan saat menyimpan data.', 'error');
    } finally {
        loading.value = false;
    }
};

const onPage = (event) => {
    lazyParams.value.first = event.first;
    lazyParams.value.rows = event.rows;
    loadLazyData();
};

const handleRowsChange = () => {
    lazyParams.value.first = 0;
    lazyParams.value.rows = parseInt(lazyParams.value.rows);
    loadLazyData();
};

const handleSearch = () => {
    lazyParams.value.first = 0;
    loadLazyData();
};

const onSort = (event) => {
    lazyParams.value.sortField = event.sortField;
    lazyParams.value.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    loadLazyData();
};

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

const getBadgeClass = (roleId) => {
    const classMap = {
        1: 'bg-label-primary',
        2: 'bg-label-warning',
        3: 'bg-label-success',
    };
    return classMap[roleId] || 'bg-label-info';
};

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
    if (!groupId) {
        menuDetails.value = [];
        return;
    };
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
        menuDetails.value = Array.isArray(data.menuDetails) ? data.menuDetails : [];
    } catch (error) {
        console.error('Error fetching menu details:', error);
        menuDetails.value = [];
    }
};

onMounted(async () => {
    await loadLazyData();
    await fetchMenuGroups();
});

function openAddPermissionModal() {
    isEditMode.value = false;
    resetFormState();
    const modalEl = document.getElementById('Modal');
    if (modalEl) {
        const modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.show();
    }
}

async function openEditPermissionModal(permissionData) {
    isEditMode.value = true;
    resetFormState();
    selectedPermission.value = JSON.parse(JSON.stringify(permissionData));

    formPermission.value = {
        id: permissionData.id,
        name: permissionData.name || '',
        menuGroupId: permissionData.menuGroups && permissionData.menuGroups.length > 0 ? permissionData.menuGroups[0].id : null,
        menuDetailId: permissionData.menuDetails && permissionData.menuDetails.length > 0 ? permissionData.menuDetails[0].id : null,
    };
    
    if (formPermission.value.menuGroupId) {
        await fetchMenuDetails(formPermission.value.menuGroupId);
        // Ensure menuDetailId is set after details are fetched
        formPermission.value.menuDetailId = permissionData.menuDetails && permissionData.menuDetails.length > 0 ? permissionData.menuDetails[0].id : null;
    }

    const modalEl = document.getElementById('Modal');
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    }
}


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
            const token = localStorage.getItem('token');
            const csrfResponse = await fetch($api.csrfToken(), {
                credentials: 'include'
            });
            const csrfData = await csrfResponse.json();
            const csrfToken = csrfData.token;

            const url = $api.permissionDelete(permissionId);

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
                throw new Error(errorData.message || 'Gagal menghapus permission');
            }
            
            await loadLazyData();

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Permission berhasil dihapus.',
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
    if (!formPermission.value.menuGroupId || !Array.isArray(menuDetails.value)) {
        return [];
    }
    return menuDetails.value; // details are already filtered by fetchMenuDetails
});

watch(() => formPermission.value.menuGroupId, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    formPermission.value.menuDetailId = null; // Reset detail when group changes
    fetchMenuDetails(newVal);
  }
})

 </script>
 
 <style scoped>
    :deep(.menu-group .vs__dropdown-toggle),
    :deep(.menu-detail .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
 </style>