<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Kategori</h4>
            <p class="mb-6">
            List category yang terdaftar di sistem
            </p>
            <!-- category cards -->
            <div class="row g-6 mb-6">
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Kategori"
                    :total="stats.total + ' Kategori'"
                />
                <CardBox
                    v-if="stats.sparepart !== undefined"
                    title="Sparepart"
                    :total="stats.sparepart + ' Produk'"
                />
                <CardBox
                    v-if="stats.oli !== undefined"
                    title="Oli"
                    :total="stats.oli + ' Produk'"
                />
                <CardBox
                    v-if="stats.alat_berat !== undefined"
                    title="Alat Berat"
                    :total="stats.alat_berat + ' Produk'"
                />
                <CardBox
                    v-if="stats.tooling !== undefined"
                    title="Tooling"
                    :total="stats.tooling + ' Produk'"
                />
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
                                    <button v-if="userHasRole('superadmin') || userHasPermission('create_kategori')" @click="kategoriStore.openModal()" class="btn btn-primary mb-2 text-nowrap add-new-role">
                                        Tambah Kategori
                                    </button>
                                    <p class="mb-0 mt-1">Buat Kategori baru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Kategori</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Kategori.</p>
                </div>
                <div class="col-12">
                    <!-- category Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="params.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="p-input-icon-left">
                                    <i class="ri-search-line"></i>
                                    <InputText v-model="globalFilterValue" placeholder="Cari Kategori..." class="w-full md:w-20rem" />
                                </span>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="kategori" 
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
                                <Column field="name" header="Nama Category" :sortable="true"></Column>
                                <Column field="description" header="Deskripsi" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button v-if="userHasRole('superadmin') || userHasPermission('edit_kategori')" @click="kategoriStore.openModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line ri-20px"></i></button>
                                        <button v-if="userHasRole('superadmin') || userHasPermission('delete_kategori')" @click="kategoriStore.deleteKategori(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line ri-20px"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ category Table -->
                </div>
            </div>
            <!--/ category cards -->

            <!-- Placeholder untuk CategoryModal component -->
            <Modal 
                id="KategoriModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="kategoriStore.saveKategori()">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="form.name" 
                                        placeholder="Masukkan nama category"
                                        required
                                    >
                                    <label>Nama Category</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        v-model="form.description" 
                                        placeholder="Masukkan deskripsi category"
                                        required
                                    >
                                    <label>Deskripsi Category</label>
                                </div>
                            </div>
                        </div>
                         <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="kategoriStore.closeModal()">Tutup</button>
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
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import { useKategoriStore } from '~/stores/kategori'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import { useDebounceFn } from '@vueuse/core'
import { usePermissions } from '~/composables/usePermissions'
import { usePermissionsStore } from '~/stores/permissions'
import { useUserStore } from '~/stores/user'

const { userHasPermission, userHasRole } = usePermissions();

const myDataTableRef  = ref(null)
const kategoriStore   = useKategoriStore()
const permissionStore = usePermissionsStore()
const userStore       = useUserStore()
const { kategori, loading, stats, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(kategoriStore)

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Kategori' : 'Tambah Kategori');
const modalDescription = computed(() => isEditMode.value ? 'Ubah detail kategori.' : 'Isi untuk menambah kategori baru.');

let modalInstance = null
onMounted(() => {
    kategoriStore.fetchKategori()
    kategoriStore.fetchStats()
    permissionStore.fetchPermissions()
    userStore.loadUser()
    const modalElement = document.getElementById('KategoriModal')
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
    kategoriStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);


const onPage = (event) => kategoriStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0; // Reset to first page
    kategoriStore.fetchKategori();
};

const onSort = (event) => kategoriStore.setSort(event);

</script>