<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Departemen</h4>
            <p class="mb-6">
            List departemen yang terdaftar di sistem
            </p>
            <!-- departemen cards -->
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
                                    <button v-if="userHasRole('superadmin') || userHasPermission('create_departemen')" @click="departemenStore.openModal()" class="btn btn-primary mb-2 text-nowrap add-new-role">
                                        Tambah Departemen
                                    </button>
                                    <p class="mb-0 mt-1">Buat Departemen baru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Departemen</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Departemen.</p>
                </div>
                <div class="col-12">
                    <!-- departemen Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="p-input-icon-left">
                                    <i class="ri-search-line"></i>
                                    <InputText v-model="globalFilterValue" placeholder="Cari Departemen..." class="w-full md:w-20rem" />
                                </span>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="departemens" 
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
                            <Column field="nmDepartemen" header="Nama Departemen" :sortable="true"></Column>
                            <Column field="divisi.nmDivisi" header="Divisi" :sortable="true"></Column>
                            <Column header="Actions" :exportable="false" style="min-width:8rem">
                                <template #body="slotProps">
                                    <div class="d-inline-block">
                                        <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li v-if="userHasRole('superadmin') || userHasPermission('edit_departemen')">
                                                <a class="dropdown-item" href="javascript:void(0)" @click="departemenStore.openModal(slotProps.data, 'admin')">
                                                    <i class="ri-edit-box-line me-2"></i> Edit
                                                </a>
                                            </li>
                                            <li v-if="userHasRole('superadmin') || userHasPermission('delete_departemen')">
                                                <a class="dropdown-item text-danger" href="javascript:void(0)" @click="departemenStore.deleteDepartemen(slotProps.data.id)">
                                                    <i class="ri-delete-bin-7-line me-2"></i> Hapus
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </template>
                            </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ departemen Table -->
                </div>
            </div>
            <!--/ departemen cards -->

            <!-- Placeholder untuk DepartemenModal component -->
            <Modal 
                id="DepartemenModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="departemenStore.saveDepartemen()">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control"
                                        v-model="form.nmDepartemen" 
                                        placeholder="Masukkan nama departemen"
                                        required
                                    >
                                    <label>Nama Departemen</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <v-select
                                        v-model="form.divisiId"
                                        :options="divisis"
                                        label="nmDivisi"
                                        :reduce="divisi => divisi.id"
                                        placeholder="-- Pilih Divisi --"
                                        class="select-divisi"
                                    />   
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="departemenStore.closeModal()">Tutup</button>
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
import { useDepartemenStore } from '~/stores/departemen'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { useDebounceFn } from '@vueuse/core'
import { useUserStore } from '~/stores/user'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()

const myDataTableRef = ref(null)
const departemenStore = useDepartemenStore()
const permissionStore = usePermissionsStore()
const userStore = useUserStore()
const { userHasPermission, userHasRole } = usePermissions();

const { departemens, divisis, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(departemenStore)

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Departemen' : 'Tambah Departemen');
const modalDescription = computed(() => isEditMode.value ? 'Ubah detail departemen.' : 'Isi untuk menambah departemen baru.');

let modalInstance = null
onMounted(() => {
    departemenStore.fetchDepartemens();
    permissionStore.fetchPermissions()
    userStore.loadUser()

    const modalElement = document.getElementById('DepartemenModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
    setListTitle('Departemen', departemens.value.length)
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
    } else {
        modalInstance?.hide()
    }
})

const debouncedSearch = useDebounceFn(() => {
    departemenStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);


const onPage = (event) => departemenStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0; // Reset to first page
    departemenStore.fetchDepartemens();
};

const onSort = (event) => departemenStore.setSort(event);
</script>

<style scoped>
    :deep(.select-divisi .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>

