<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div v-if="loading">
                <!-- Skeleton loader -->
                <div class="animate-pulse space-y-2">
                    <div class="h-6 bg-gray-200 rounded"></div>
                    <div class="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <template v-else>
                <div v-if="menuGroups.length > 0">
                    <h4 class="mb-1">Menu Group List</h4>
                    <p class="mb-6">
                        List menu group yang terdaftar di sistem
                    </p>
                     <div class="row g-6 mb-6">
                        <div class="col-xl-4 col-lg-6 col-md-6">
                            <div class="card h-100">
                                <div class="row h-100">
                                    <div class="col-sm-5">
                                        <div class="d-flex align-items-end h-100 justify-content-center">
                                            <img src="/img/illustrations/add-new-role-illustration.png" class="img-fluid" alt="Image" width="70">
                                        </div>
                                    </div>
                                    <div class="col-sm-7">
                                        <div class="card-body text-sm-end text-center ps-sm-0">
                                            <button @click="menuGroupStore.openModal()" class="btn btn-primary mb-2 text-nowrap add-new-role">
                                                Tambah Menu Group
                                            </button>
                                            <p class="mb-0 mt-1">Buat Menu Group baru</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row g-6">
                        <div class="col-12">
                            <h4 class="mt-6 mb-1">Total Menu Group</h4>
                            <p class="mb-0">Find all of your company's administrator accounts and their associate Menu Group.</p>
                        </div>
                        <div class="col-12">
                            <!-- menu group Table -->
                            <div class="card">
                                <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                                    <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                        <span class="me-2">Baris:</span>
                                        <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <span class="p-input-icon-left">
                                            <InputText v-model="globalFilterValue" placeholder="Cari Menu Group..." class="w-full md:w-20rem" />
                                        </span>
                                    </div>
                                </div>
                                <div class="card-datatable table-responsive py-3 px-3">
                                <MyDataTable 
                                    ref="myDataTableRef"
                                    :data="menuGroups" 
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
                                        <Column field="name" header="Nama Menu Group" :sortable="true"></Column>
                                        <Column field="icon" header="Icon" :sortable="true"></Column>
                                        <Column field="order" header="Order" :sortable="true"></Column>
                                        <Column field="jenisMenu" header="Jenis Menu" :sortable="true">
                                            <template #body="slotProps">
                                                <span :class="getStatusBadge(slotProps.data.jenisMenu).class">
                                                    {{ getStatusBadge(slotProps.data.jenisMenu).text }}
                                                </span>
                                            </template>
                                        </Column>
                                        <Column header="Actions" :exportable="false" style="min-width:8rem">
                                            <template #body="slotProps">
                                                <button @click="menuGroupStore.openModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line ri-20px"></i></button>
                                                <button @click="menuGroupStore.deleteMenuGroup(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line ri-20px"></i></button>
                                            </template>
                                        </Column>
                                </MyDataTable>
                                </div>
                            </div>
                            <!--/ menu group Table -->
                        </div>
                    </div>
                </div>
                <!--/ menu group cards -->
                <div v-else class="text-center">
                    <div class="d-flex flex-column align-items-center">
                        <img src="/img/illustrations/misc-under-maintenance-illustration.png" alt="page-misc-under-maintenance" width="300" class="img-fluid" />
                        <h4 class="mt-4">Tidak ada data Menu Group</h4>
                        <p class="mb-4">
                            Saat ini belum ada data menu group yang tersedia.<br />
                            Silakan buat menu group baru untuk memulai.
                        </p>
                        <button @click="menuGroupStore.openModal()" class="btn btn-primary">
                            <i class="ri-add-line me-1"></i>
                            Tambah Menu Group
                        </button>
                    </div>
                </div>
                <!-- Placeholder untuk MenuModal component -->
            </template>
            <Modal 
                id="MenuGroupModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="menuGroupStore.saveMenuGroup()">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="form.name" 
                                        placeholder="Masukkan nama menu group"
                                        required
                                    >
                                    <label for="name">Nama Menu Group</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    v-model="form.icon" 
                                    placeholder="Masukkan nama icon"
                                    >
                                    <label for="icon">Icon</label>
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
                                    <label for="order">Order</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.jenisMenu"
                                        :options="[
                                            { label: 'Purchasing', value: 1 },
                                            { label: 'HRD', value: 2 },
                                            { label: 'Accounting', value: 3 },
                                            { label: 'Inventory', value: 4 },
                                            { label: 'Sales', value: 5 },
                                            { label: 'Company', value: 6 },
                                            { label: 'Reports', value: 7 },
                                            { label: 'Admin', value: 8 },
                                        ]"
                                        label="label"
                                        :reduce="option => option.value"
                                        placeholder="-- Pilih Jenis Menu --"
                                        class="select-jenis-menu"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="menuGroupStore.closeModal()">Tutup</button>
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
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import { useMenuGroupStore } from '~/stores/menu-group'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { useDebounceFn } from '@vueuse/core'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()

const myDataTableRef = ref(null)
const menuGroupStore = useMenuGroupStore()
const { menuGroups, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(menuGroupStore)

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Menu Group' : 'Tambah Menu Group');
const modalDescription = computed(() => isEditMode.value ? 'Ubah detail menu group.' : 'Isi untuk menambah menu group baru.');

let modalInstance = null
onMounted(() => {
    if (menuGroupStore.menuGroups.length === 0) {
        menuGroupStore.fetchMenuGroups();
    }
    const modalElement = document.getElementById('MenuGroupModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
    setListTitle('Menu Group', menuGroups.value.length)
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
    } else {
        modalInstance?.hide()
    }
})

const debouncedSearch = useDebounceFn(() => {
    menuGroupStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);


const onPage = (event) => menuGroupStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0; // Reset to first page
    menuGroupStore.fetchMenuGroups();
};

const onSort = (event) => menuGroupStore.setSort(event);

const getStatusBadge = (jenisMenu) => {
    switch (jenisMenu) {
        case 1:
            return { text: 'Purchasing', class: 'badge rounded-pill bg-label-primary' };
        case 2:
            return { text: 'HRD', class: 'badge rounded-pill bg-label-secondary' };
        case 3:
            return { text: 'Accounting', class: 'badge rounded-pill bg-label-warning text-dark' };
        case 4:
            return { text: 'Inventory', class: 'badge rounded-pill bg-label-info' };
        case 5:
            return { text: 'Sales', class: 'badge rounded-pill bg-label-success' };
        case 6:
            return { text: 'Company', class: 'badge rounded-pill bg-label-info' };
        case 7:
            return { text: 'Reports', class: 'badge rounded-pill bg-label-danger' };
        case 8:
            return { text: 'Admin', class: 'badge rounded-pill bg-label-dark' };
        default:
            return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};
</script>

<style scoped>
    :deep(.select-jenis-menu .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>