<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Gudang</h4>
            <p class="mb-6">
            List warehouse yang terdaftar di sistem
            </p>
            <!-- warehouse cards -->
            <div class="row g-6 mb-6">
                <!-- Card untuk Tambah Pegawai -->                
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Gudang"
                    :total="(stats.total !== undefined ? stats.total + ' Gudang' : 'Memuat...')"
                    :column-class="cardBoxColumnClass"
                />
                <CardBox
                    v-if="userHasRole('superadmin') || userHasPermission('create_gudang')"
                    :isAddButtonCard="true"
                    image-src="/img/illustrations/add-new-role-illustration.png"
                    image-alt="Tambah Gudang"
                    button-text="Tambah Gudang"
                    modal-target="#Modal" 
                    @button-click="warehouseStore.openModal()"
                    :column-class="cardBoxColumnClass"
                />
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Gudang</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Gudang.</p>
                </div>
                <div class="col-12">
                    <!-- warehouse Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
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
                                            placeholder="Cari Gudang..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="warehouses" 
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
                                <Column field="code" header="Kode Gudang" :sortable="true"></Column>
                                <Column field="name" header="Nama Gudang" :sortable="true"></Column>
                                <Column field="address" header="Alamat Gudang" :sortable="true"></Column>
                                <Column field="phone" header="No. Telepon Gudang" :sortable="true"></Column>
                                <Column field="email" header="Email Gudang" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button v-if="userHasRole('superadmin') || userHasPermission('edit_gudang')" @click="warehouseStore.openModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button v-if="userHasRole('superadmin') || userHasPermission('delete_gudang')" @click="warehouseStore.deleteWarehouse(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ warehouse Table -->
                </div>
            </div>
            <!--/ warehouse cards -->

            <!-- Placeholder untuk WarehouseModal component -->
            <Modal 
                id="Modal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="warehouseStore.saveWarehouse()">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="kodeGudang" 
                                        v-model="form.code" 
                                        placeholder="Masukkan kode gudang"
                                        required
                                    >
                                    <label for="kodeGudang">Kode Gudang</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="nmGudang" 
                                        v-model="form.name" 
                                        placeholder="Masukkan nama gudang"
                                        required
                                    >
                                    <label for="nmGudang">Nama Gudang</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="emailGudang" 
                                        v-model="form.email" 
                                        placeholder="Masukkan email gudang"
                                        required
                                    >
                                    <label for="emailGudang">Email Gudang</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="phoneGudang" 
                                        v-model="form.phone" 
                                        placeholder="Masukkan no. telepon gudang"
                                        required
                                    >
                                    <label for="phoneGudang">No. Telepon Gudang</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <textarea
                                        class="form-control h-px-100"
                                        id="alamatGudang"
                                        placeholder="Masukkan alamat gudang"
                                        v-model="form.address">
                                    </textarea>
                                    <label for="alamatGudang">Alamat Gudang</label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="warehouseStore.closeModal()">Tutup</button>
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
import { storeToRefs } from 'pinia'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import { useWarehouseStore } from '~/stores/warehouse'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import { useDebounceFn } from '@vueuse/core'
import { usePermissions } from '~/composables/usePermissions'
import { usePermissionsStore } from '~/stores/permissions'
import { useUserStore } from '~/stores/user'

const { userHasPermission, userHasRole } = usePermissions();

const myDataTableRef = ref(null)
const warehouseStore = useWarehouseStore()
const permissionStore = usePermissionsStore()
const userStore = useUserStore()
const { warehouses, loading, stats, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(warehouseStore)

const globalFilterValue = ref('')

const cardBoxColumnClass = computed(() => {
  return stats.value.total !== undefined ? 'col-6' : 'col-xl-4 col-lg-6 col-md-6';
});

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Gudang' : 'Tambah Gudang');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data gudang di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan gudang baru.');

let modalInstance = null
onMounted(() => {
    warehouseStore.fetchWarehouses()
    warehouseStore.fetchStats()
    permissionStore.fetchPermissions()
    userStore.loadUser()

    const modalElement = document.getElementById('Modal')
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
    warehouseStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch)

const onPage = (event) => warehouseStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0;
    warehouseStore.fetchWarehouses();
};

const onSort = (event) => warehouseStore.setSort(event);

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        // Implement PDF export if needed
    }
};
</script>