<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <template v-else>
                <div v-if="menuDetails.length > 0">
                    <h4 class="mb-1">List Menu Detail</h4>
                    <p class="mb-6">
                    List menu detail yang terdaftar di sistem
                    </p>
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
                                <button @click="menuDetailStore.openModal()" class="btn btn-primary mb-2 text-nowrap add-new-role">
                                        Tambah Menu Detail
                                    </button>
                                    <p class="mb-0 mt-1">Buat Menu Detail baru</p>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <div class="row g-6">
                        <div class="col-12">
                            <h4 class="mt-6 mb-1">Total Menu Detail</h4>
                            <p class="mb-0">Find all of your company's administrator accounts and their associate Menu Detail.</p>
                        </div>
                        <div class="col-12">
                            <!-- menu detail Table -->
                            <div class="card">
                                <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                                    <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                        <span class="me-2">Baris:</span>
                                        <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="p-input-icon-left">
                                            <InputText v-model="globalFilterValue" placeholder="Cari Menu Detail..." class="w-full md:w-20rem" />
                                        </span>
                                    </div>
                                </div>
                                <div class="card-datatable table-responsive py-3 px-3">
                                <MyDataTable 
                                    ref="myDataTableRef"
                                    :data="menuDetails" 
                                    :rows="params.rows" 
                                    :loading="loading"
                                    :totalRecords="totalRecords"
                                    :lazy="true"
                                    :sort-field="params.sortField"
                                    :sort-order="params.sortOrder"
                                    sort-mode="single"
                                    @page="onPage($event)"
                                    @sort="onSort($event)"
                                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                                    currentPageReportTemplate="Menampilkan {first} sampai {last} dari {totalRecords} data"
                                    >
                                        <Column field="id" header="#" :sortable="true"></Column> 
                                        <Column field="name" header="Nama Menu Detail" :sortable="true"></Column>
                                        <Column field="route" header="Route" :sortable="true"></Column>
                                        <Column field="order" header="Order" :sortable="true"></Column>
                                        <Column field="status" header="Status" :sortable="true">
                                            <template #body="slotProps">
                                                <span :class="getStatusBadge(slotProps.data.status).class">
                                                    {{ getStatusBadge(slotProps.data.status).text }}
                                                </span>
                                            </template>
                                        </Column>
                                        <Column field="menuGroupId" header="Menu Group" :sortable="true">
                                            <template #body="slotProps">
                                                <span>{{ slotProps.data.menuGroup?.name || '-' }}</span>
                                            </template>
                                        </Column>
                                        <Column header="Actions" :exportable="false" style="min-width:8rem">
                                            <template #body="slotProps">
                                                <div class="d-inline-block">
                                                    <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                                    </a>
                                                    <ul class="dropdown-menu">
                                                        <li v-if="userHasPermission('edit_menu_detail')">
                                                            <a class="dropdown-item" href="javascript:void(0)" @click="menuDetailStore.openModal(slotProps.data)">
                                                                <i class="ri-edit-box-line me-2"></i> Edit  
                                                            </a>
                                                        </li>
                                                        <li v-if="userHasPermission('delete_menu_detail')">
                                                            <a class="dropdown-item" href="javascript:void(0)" @click="menuDetailStore.deleteMenuDetail(slotProps.data.id)">
                                                                <i class="ri-delete-bin-7-line me-2"></i> Delete
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </template>
                                        </Column>
                                </MyDataTable>
                                </div>
                            </div>
                            <!--/ menu detail Table -->
                        </div>
                    </div>
                    <!--/ menu detail cards -->
                </div>
                <div v-else class="text-center">
                    <div class="d-flex flex-column align-items-center">
                        <img src="/img/illustrations/misc-under-maintenance-illustration.png" alt="page-misc-under-maintenance" width="300" class="img-fluid" />
                        <h4 class="mt-4">Tidak ada data Menu Detail</h4>
                        <p class="mb-4">
                            Saat ini belum ada data menu detail yang tersedia.<br />
                            Silakan buat menu detail baru untuk memulai.
                        </p>
                        <button @click="menuDetailStore.openModal()" class="btn btn-primary">
                            <i class="ri-add-line me-1"></i>
                            Tambah Menu Detail
                        </button>
                    </div>
                </div>
                <!-- Placeholder untuk MenuModal component -->
            </template>
            <Modal 
                id="MenuDetailModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="menuDetailStore.saveMenuDetail()">
                        <div class="row g-6 p-3">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control"
                                        v-model="form.name" 
                                        placeholder="Masukkan nama menu detail"
                                        required
                                    >
                                    <label>Nama Menu Detail</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.route" 
                                    placeholder="Masukkan nama route"
                                    >
                                    <label>Route</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control"
                                    v-model="form.order" 
                                    placeholder="Masukkan urutan"
                                    @input="form.order = $event.target.value.replace(/[^0-9]/g, '')"
                                    inputmode="numeric"
                                    pattern="[0-9]*"
                                    required
                                    >
                                    <label>Order</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.status"
                                        :options="statusOptions"
                                        label="label"
                                        :reduce="status => status.value"
                                        placeholder="-- Pilih Status --"
                                        class="select-status"
                                    />   
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.menuGroupId"
                                        :options="menuGroups"
                                        label="name"
                                        :reduce="menuGroup => menuGroup.id"
                                        :disabled="menuGroups.length === 0"
                                        placeholder="-- Pilih Menu Group --"
                                        class="select-menu-group"
                                    />   
                                    <p v-if="menuGroups.length === 0" class="small text-muted">Memuat data menu group...</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="menuDetailStore.closeModal()">Tutup</button>
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Simpan
                            </button>
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
import { storeToRefs } from 'pinia';
import { useMenuDetailStore } from '~/stores/menu-detail'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { useDebounceFn } from '@vueuse/core'
import { usePermissions } from '~/composables/usePermissions'

const myDataTableRef = ref(null)
const menuDetailStore = useMenuDetailStore()
const { menuDetails, menuGroups, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(menuDetailStore)
const { userHasPermission } = usePermissions();

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const statusOptions = ref([
    { label: 'Aktif', value: 1 },
    { label: 'Nonaktif', value: 0 },
]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Menu Detail' : 'Tambah Menu Detail');
const modalDescription = computed(() => isEditMode.value ? 'Ubah detail menu.' : 'Isi untuk menambah menu detail baru.');

let modalInstance = null;
onMounted(() => {
    menuDetailStore.fetchMenuDetails();
    const modalElement = document.getElementById('MenuDetailModal');
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
    menuDetailStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);


const onPage = (event) => menuDetailStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0;
    menuDetailStore.fetchMenuDetails();
};

const onSort = (event) => menuDetailStore.setSort(event);

const getStatusBadge = (status) => {
    switch (status) {
        case 1:
            return { text: 'Aktif', class: 'badge rounded-pill bg-label-primary' };
        case 0:
            return { text: 'Nonaktif', class: 'badge rounded-pill bg-label-danger' };
        default:
            return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};
</script>

<style scoped>
    :deep(.select-menu-group .vs__dropdown-toggle),
    :deep(.select-status .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>

