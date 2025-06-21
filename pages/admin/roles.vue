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
            <div v-else>
                <h4 class="mb-1">Roles List</h4>
                <p class="mb-6">
                A role provided access to predefined menus and features so that depending on assigned role an
                administrator can have access to what user needs.
                </p>
                <!-- Role cards -->
                <div class="row g-6 mb-6">
                    <div class="col-xl-4 col-lg-6 col-md-6">
                        <div class="card h-100">
                        <div class="row h-100">
                            <div class="col-sm-5">
                            <div class="d-flex align-items-end h-100 justify-content-center">
                                <img
                                src="/img/illustrations/add-new-role-illustration.png"
                                class="img-fluid"
                                alt="Image"
                                width="70" />
                            </div>
                            </div>
                            <div class="col-sm-7">
                            <div class="card-body text-sm-end text-center ps-sm-0">
                                <button
                                @click="rolesStore.openModal()"
                                class="btn btn-primary mb-2 text-nowrap add-new-role">
                                Tambah Role
                                </button>
                                <p class="mb-0 mt-1">Buat role baru beserta hak aksesnya</p>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                
                <div class="row g-6">
                    <div class="col-12">
                        <h4 class="mt-6 mb-1">Total users with their roles</h4>
                        <p class="mb-0">Find all of your company's administrator accounts and their associate roles.</p>
                    </div>
                    <div class="col-12">
                        <!-- Role Table -->
                        <div class="card">
                             <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                                <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                    <span class="me-2">Baris:</span>
                                    <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                                </div>
                                <div class="d-flex align-items-center">
                                    <span class="p-input-icon-left">
                                        <InputText v-model="globalFilterValue" placeholder="Cari Role..." class="w-full md:w-20rem" />
                                    </span>
                                </div>
                            </div>
                            <div class="card-datatable table-responsive py-3 px-3">
                                 <MyDataTable 
                                    ref="myDataTableRef"
                                    :data="roles" 
                                    :rows="params.rows" 
                                    :loading="loading"
                                    :totalRecords="totalRecords"
                                    :lazy="true"
                                    @page="onPage($event)"
                                    @sort="onSort($event)"
                                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
                                    >
                                        <Column field="id" header="#" :sortable="true"></Column> 
                                        <Column field="name" header="Nama Role" :sortable="true"></Column>
                                        <Column header="Actions" :exportable="false" style="min-width:8rem">
                                            <template #body="slotProps">
                                                <div class="d-flex align-items-center">
                                                    <button @click="rolesStore.openModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line ri-20px"></i></button>
                                                    <button @click="rolesStore.deleteRole(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line ri-20px"></i></button>
                                                </div>
                                            </template>
                                        </Column>
                                </MyDataTable>
                            </div>
                        </div>
                        <!--/ Role Table -->
                    </div>
                </div>
                <!--/ Role cards -->
            </div>

            <!-- Add Role Modal -->
            <Modal 
                id="RolesModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
              <template #default>
                <form @submit.prevent="rolesStore.saveRole()">
                    <div class="row g-3 p-3">
                        <div class="col-12 mb-3">
                            <div class="form-floating form-floating-outline">
                            <input
                                type="text"
                                id="modalRoleName"
                                name="modalRoleName"
                                class="form-control"
                                placeholder="Enter a role name"
                                tabindex="-1"
                                v-model="form.name"
                                required
                                />
                            <label for="modalRoleName">Role Name</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <h5 class="mb-6">Role Permissions</h5>

                            <div class="table-responsive">
                            <table class="table table-flush-spacing">
                                <tbody>
                                    <tr>
                                        <td>
                                            <p class="mb-1 fw-bold">Super Admin Access</p>
                                        </td>
                                        <td>
                                            <div class="d-flex justify-content-end flex-wrap">
                                                <div class="form-check mb-1 me-4">
                                                    <input class="form-check-input" type="checkbox" id="selectAll" v-model="selectAll" />
                                                    <label class="form-check-label" for="selectAll">Select All</label>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <template v-if="menuDetailsWithPermissions.length > 0">
                                        <tr v-for="menuDetail in menuDetailsWithPermissions" :key="menuDetail.id">
                                        <td class="text-nowrap fw-medium">{{ menuDetail.name }}</td>
                                        <td>
                                            <div class="d-flex justify-content-end flex-wrap">
                                                <div
                                                    v-for="perm in menuDetail.permissions"
                                                    :key="perm.id"
                                                    class="form-check mb-1 me-4"
                                                >
                                                    <input
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        :id="`perm_${menuDetail.id}_${perm.id}`"
                                                        :value="perm.id"
                                                        v-model="form.permissionIds"
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        :for="`perm_${menuDetail.id}_${perm.id}`"
                                                    >
                                                        {{ perm.name }}
                                                    </label>
                                                </div>
                                            </div>
                                        </td>
                                        </tr>
                                    </template>

                                    <tr v-else>
                                        <td colspan="2" class="text-center py-4">
                                        <div class="text-muted">No permissions data available</div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer mt-6">
                        <button type="button" class="btn btn-outline-secondary" @click="rolesStore.closeModal()">Tutup</button>
                        <button type="submit" class="btn btn-primary" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Simpan
                        </button>
                    </div>
                </form>
               </template>
            </Modal>
            <!--/ Add Role Modal -->
        </div>
        <!-- / Content -->

        <div class="content-backdrop fade"></div>
    </div>
     <!-- Content wrapper -->
    </div>
 </template>
 
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRolesStore } from '~/stores/roles'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { useDebounceFn } from '@vueuse/core'

const myDataTableRef = ref(null);
const rolesStore = useRolesStore();
const { 
    roles, 
    permissions,
    loading, 
    totalRecords, 
    params, 
    form, 
    isEditMode, 
    showModal, 
    validationErrors 
} = storeToRefs(rolesStore);

const globalFilterValue = ref('');
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const selectAll = computed({
  get() {
    if (!permissions.value || permissions.value.length === 0) {
      return false;
    }
    return form.value.permissionIds.length === permissions.value.length;
  },
  set(value) {
    if (value) {
      form.value.permissionIds = permissions.value.map(p => p.id);
    } else {
      form.value.permissionIds = [];
    }
  }
});

const menuDetailsWithPermissions = computed(() => {
    const result = {};
    const masterPermissions = Array.isArray(permissions.value) ? permissions.value : [];
    const masterPermissionNames = ['View', 'Create', 'Edit', 'Delete', 'Show', 'Approve', 'Reject'];

    masterPermissions.forEach(p => {
        const permParts = p.name?.split('_');
        let menuKey = '';
        if (permParts && permParts.length > 1) {
            menuKey = permParts.slice(1).join('_');
        } else {
            menuKey = 'general';
        }

        if (menuKey.endsWith('s')) {
            menuKey = menuKey.slice(0, -1);
        }

        let displayPermissionName = '';
        const permName = p.name?.toLowerCase();

        if (permName.includes('view')) displayPermissionName = 'View';
        else if (permName.includes('create')) displayPermissionName = 'Create';
        else if (permName.includes('update') || permName.includes('edit')) displayPermissionName = 'Edit';
        else if (permName.includes('delete')) displayPermissionName = 'Delete';
        else if (permName.includes('show')) displayPermissionName = 'Show';
        else if (permName.includes('approve')) displayPermissionName = 'Approve';
        else if (permName.includes('reject')) displayPermissionName = 'Reject';

        if (!displayPermissionName) return;

        const permissionObject = {
            id: p.id,
            name: displayPermissionName,
            dbName: p.name
        };

        if (!result[menuKey]) {
            result[menuKey] = {
                id: menuKey,
                name: menuKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                order: Object.keys(result).length,
                permissions: []
            };
        }

        if (!result[menuKey].permissions.some(x => x.id === permissionObject.id)) {
            result[menuKey].permissions.push(permissionObject);
        }
    });

    const sortedMenuDetails = Object.values(result).sort((a, b) => a.order - b.order);
    sortedMenuDetails.forEach(md => {
        md.permissions.sort((a, b) => {
            const orderA = masterPermissionNames.indexOf(a.name);
            const orderB = masterPermissionNames.indexOf(b.name);
            return orderA - orderB;
        });
    });

    return sortedMenuDetails;
});

const modalTitle = computed(() => isEditMode.value ? 'Edit Role' : 'Tambah Role');
const modalDescription = computed(() => isEditMode.value ? 'Ubah detail role.' : 'Isi untuk menambah role baru.');

let modalInstance = null;
onMounted(() => {
    rolesStore.fetchRoles();
    rolesStore.fetchPermissions();
    const modalElement = document.getElementById('RolesModal');
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement);
    }
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show();
    } else {
        modalInstance?.hide();
    }
});

const debouncedSearch = useDebounceFn(() => {
    rolesStore.setSearch(globalFilterValue.value);
}, 500);
watch(globalFilterValue, debouncedSearch);

const onPage = (event) => rolesStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0; // Reset to first page
    rolesStore.fetchRoles();
};

const onSort = (event) => rolesStore.setSort(event);

</script>
 
 <style>
    
 </style>