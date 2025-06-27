<template>
    <div>
        <!-- Content wrapper -->
        <div class="content-wrapper">
            <!-- Content -->
            <div class="container-xxl flex-grow-1 container-p-y">
                <div v-if="loading" class="text-center">
                    <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <template v-else>
                    <div v-if="permissions.length > 0">
                        <h4 class="mb-1">List Permissions</h4>
                        <p class="mb-6">
                            List permissions yang terdaftar di sistem
                        </p>
                        <div class="row g-6 mb-6">
                            <!-- Card total permission -->
                            <CardBox
                                v-if="stats.total !== undefined"
                                title="Total Permission"
                                :total="stats.total + ' Permission'"
                            />
                            <!-- Card statistik per role, dinamis sesuai data dari backend -->
                            <CardBox
                                v-for="role in stats.roles"
                                :key="role.id"
                                :title="role.name.charAt(0).toUpperCase() + role.name.slice(1)"
                                :total="role.total + ' Permission'"
                            />
                            <CardBox
                                :isAddButtonCard="true"
                                image-src="/img/illustrations/add-new-role-illustration.png"
                                image-alt="Tambah Permission"
                                button-text="Tambah Permission"
                                modal-target="#PermissionModal" 
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
                                            <Dropdown v-model="lazyParams.rows" :options="rowsPerPageOptionsArray" optionLabel="label" optionValue="value" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
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
                    </div>
                    <div v-else class="text-center">
                        <div class="d-flex flex-column align-items-center">
                            <img src="/img/illustrations/misc-under-maintenance-illustration.png" alt="page-misc-under-maintenance" width="300" class="img-fluid" />
                            <h4 class="mt-4">Tidak ada data Permission</h4>
                            <p class="mb-4">
                                Saat ini belum ada data permission yang tersedia.<br />
                                Silakan buat permission baru untuk memulai.
                            </p>
                            <button @click="permissionsStore.openModal()" class="btn btn-primary">
                                <i class="ri-add-line me-1"></i>
                                Tambah Permission
                            </button>
                        </div>
                    </div>
                    <!-- Placeholder untuk MenuModal component -->
                    <Modal 
                        id="PermissionModal"
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
                </template>
            </div>
            <!-- / Content -->
 
            <div class="content-backdrop fade"></div>
        </div>
        <!-- Content wrapper -->
    </div>
</template>
 
<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import { usePermissionsStore } from '~/stores/permissions'
import { useLayoutStore } from '~/stores/layout'
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
const layoutStore = useLayoutStore()
const permissions = ref([])
const totalRecords = ref(0)
const loading = ref(false)
const lazyParams = ref({
    first: 0,
    rows: 10,
    sortField: 'id',
    sortOrder: 'desc',
    search: '',
    draw: 1,
})

const stats = ref({
  total : undefined,
  roles: []
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
        fetchAllPageData();
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

const rowsPerPageOptionsArray = ref([
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 }
]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Permission' : 'Tambah Permission');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data permission di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan permission baru.');

const handleCloseModal = () => {
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
    try {
        const params = new URLSearchParams({
            draw: lazyParams.value.draw.toString(),
            start: lazyParams.value.first.toString(),
            length: lazyParams.value.rows.toString(),
            search: lazyParams.value.search || '',
            sortField: lazyParams.value.sortField || 'id',
            sortOrder: lazyParams.value.sortOrder || 'desc',
        });

        const response = await fetch(`${$api.permissions()}?${params.toString()}`, {
             headers: {
                 'Authorization': `Bearer ${localStorage.getItem('token')}`,
                 'Content-Type': 'application/json',
                 'Accept': 'application/json',
             },
             credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Gagal mengambil data permissions');
        }
        const result = await response.json();
        permissions.value = result.data || []; 
        totalRecords.value = parseInt(result.recordsFiltered ?? result.recordsTotal ?? 0, 10);
        
        if (result.draw) {
            lazyParams.value.draw = parseInt(result.draw);
        }
    } catch (error) {
        console.error('Gagal mengambil data permissions:', error);
        permissions.value = [];
        totalRecords.value = 0;
        throw error;
    }
};

const fetchStats = async () => {
  const defaultStats = {
    total: undefined,
    roles: []
  };
  try {
    const response = await fetch($api.getTotalPermission(), {
        headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
      const result = await response.json();
      if (result && typeof result === 'object' && result !== null) {
        stats.value = {
            total: result.total,
            roles: result.roles
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

const handleSavePermission = async () => {
    layoutStore.setLoading(true);
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
            await fetchAllPageData();
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
        layoutStore.setLoading(false);
    }
};

const onPage = (event) => {
    lazyParams.value.first = event.first;
    lazyParams.value.rows = event.rows;
    fetchAllPageData();
};

const handleRowsChange = () => {
    lazyParams.value.first = 0;
    fetchAllPageData();
};

const handleSearch = () => {
    lazyParams.value.first = 0;
    fetchAllPageData();
};

const onSort = (event) => {
    lazyParams.value.sortField = event.sortField;
    lazyParams.value.sortOrder = event.sortOrder === 1 ? 'asc' : 'desc';
    fetchAllPageData();
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

onMounted(() => {
    fetchAllPageData();
});

const fetchAllPageData = async () => {
    layoutStore.setLoading(true);
    try {
        await loadLazyData();
        fetchStats();
        fetchMenuGroupsAndDetails();
    } catch (error) {
        console.error("Gagal memuat data halaman:", error);
        Swal.fire('Error', 'Gagal memuat data halaman.', 'error');
    } finally {
        layoutStore.setLoading(false);
    }
};

function openAddPermissionModal() {
    isEditMode.value = false;
    resetFormState();
    const modalEl = document.getElementById('PermissionModal');
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
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

    const modalEl = document.getElementById('PermissionModal');
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
        layoutStore.setLoading(true);
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
            
            await fetchAllPageData();

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
        } finally {
            layoutStore.setLoading(false);
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

const fetchMenuGroupsAndDetails = async () => {
    await Promise.all([
        fetchMenuGroups(),
        fetchMenuDetails()
    ]);
};

</script>
 
<style scoped>
    :deep(.menu-group .vs__dropdown-toggle),
    :deep(.menu-detail .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>