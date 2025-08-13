<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Satuan</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Satuan.</p>
                </div>
                <div class="col-12">
                    <!-- unit Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                            </div>
                            <div class="d-flex align-items-center">
                                <div class="btn-group me-2">
                                    <button v-if="userHasRole('superadmin') || userHasPermission('create_unit')" type="button" class="btn btn-primary" @click="unitStore.openModal()">
                                        <i class="ri-add-line me-1"></i> Tambah
                                    </button>
                                </div>
                                <div class="btn-group me-2">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="ri-upload-2-line me-1"></i> Export
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li><a class="dropdown-item" href="javascript:void(0)" @click="exportData('csv')">CSV</a></li>
                                        <li><a class="dropdown-item" href="javascript:void(0)" @click="exportData('pdf')">PDF</a></li>
                                    </ul>
                                </div>
                                <span class="p-input-icon-left">
                                    <i class="ri-search-line"></i>
                                    <InputText v-model="globalFilterValue" placeholder="Cari Satuan..." class="w-full md:w-20rem" />
                                </span>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="units" 
                            :rows="params.rows" 
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
                                <Column field="id" header="#" :sortable="true"></Column> 
                                <Column field="name" header="Nama Satuan" :sortable="true"></Column>
                                <Column field="symbol" header="Simbol" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button v-if="userHasRole('superadmin') || userHasPermission('edit_unit')" @click="unitStore.openModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line ri-20px"></i></button>
                                        <button v-if="userHasRole('superadmin') || userHasPermission('delete_unit')" @click="unitStore.deleteUnit(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line ri-20px"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ unit Table -->
                </div>
            </div>
            <!--/ unit cards -->

            <!-- Placeholder untuk UnitModal component -->
            <Modal 
                id="UnitModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="unitStore.saveUnit()">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="form.name" 
                                        placeholder="Masukkan nama unit"
                                        required
                                    >
                                    <label>Nama Satuan</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="form.symbol" 
                                        placeholder="Masukkan simbol unit"
                                        required
                                    >
                                    <label>Simbol Satuan</label>
                                </div>
                            </div>
                        </div>
                         <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="unitStore.closeModal()">Tutup</button>
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
import { useUnitStore } from '~/stores/unit'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { useDebounceFn } from '@vueuse/core'
import { usePermissions } from '~/composables/usePermissions'
import { usePermissionsStore } from '~/stores/permissions'
import { useUserStore } from '~/stores/user'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()

const { userHasPermission, userHasRole } = usePermissions();

const myDataTableRef = ref(null)
const unitStore = useUnitStore()
const permissionStore = usePermissionsStore()
const userStore = useUserStore()
const { units, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(unitStore)

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Satuan' : 'Tambah Satuan');
const modalDescription = computed(() => isEditMode.value ? 'Ubah detail satuan.' : 'Isi untuk menambah satuan baru.');

let modalInstance = null
onMounted(() => {
    unitStore.fetchUnit();
    permissionStore.fetchPermissions()
    userStore.loadUser()
    setListTitle('Satuan', units.value.length)
    const modalElement = document.getElementById('UnitModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
    } else {
        modalInstance?.hide()
    }
})

const debouncedSearch = useDebounceFn(() => {
    unitStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);


const onPage = (event) => unitStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0; // Reset to first page
    unitStore.fetchUnit();
};

const onSort = (event) => unitStore.setSort(event);

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};
</script>