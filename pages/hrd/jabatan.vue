<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Jabatan</h4>
            <p class="mb-6">
            List jabatan yang terdaftar di sistem
            </p>
            <!-- jabatan cards -->
            <div class="row g-6 mb-6">
                <!-- Card untuk Tambah Pegawai -->
                    <!-- Cards untuk Statistik Pegawai -->
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total Jabatan"
                    :total="stats.total + ' Jabatan'"
                />
                <CardBox
                    v-if="stats.direktur_utama !== undefined"
                    title="Direktur Utama"
                    :total="stats.direktur_utama + ' Orang'"
                />
                <CardBox
                    v-if="stats.direktur_keuangan !== undefined"
                    title="Direktur Keuangan"
                    :total="stats.direktur_keuangan + ' Orang'"
                />
                <CardBox
                    v-if="stats.direktur_operasional !== undefined"
                    title="Direktur Operasional"
                    :total="stats.direktur_operasional + ' Orang'"
                />
                <CardBox
                    v-if="stats.general_manager !== undefined"
                    title="General Manager"
                    :total="stats.general_manager + ' Orang'"
                />
                <CardBox
                    v-if="userHasRole('superadmin') || userHasPermission('create_jabatan')"
                    :isAddButtonCard="true"
                    image-src="/img/illustrations/add-new-role-illustration.png"
                    image-alt="Tambah Jabatan"
                    button-text="Tambah Jabatan"
                    @button-click="jabatanStore.openModal()"
                />
            </div>
            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Jabatan</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Jabatan.</p>
                </div>
                <div class="col-12">
                    <!-- jabatan Table -->
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
                                    </ul>
                                </div>
                                <div class="input-group">
                                    <span class="p-input-icon-left">
                                        <InputText
                                            v-model="globalFilterValue"
                                            placeholder="Cari Jabatan..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="jabatans" 
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
                            <Column field="nmJabatan" header="Nama Jabatan" :sortable="true"></Column>
                            <Column header="Actions" :exportable="false" style="min-width:8rem">
                                <template #body="slotProps">
                                    <div class="d-inline-block">
                                        <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li v-if="userHasRole('superadmin') || userHasPermission('edit_jabatan')">
                                                <a class="dropdown-item" href="javascript:void(0)" @click="jabatanStore.openModal(slotProps.data, 'admin')">
                                                    <i class="ri-edit-box-line me-2"></i> Edit
                                                </a>
                                            </li>
                                            <li v-if="userHasRole('superadmin') || userHasPermission('delete_jabatan')">
                                                <a class="dropdown-item text-danger" href="javascript:void(0)" @click="jabatanStore.deleteJabatan(slotProps.data.id)">
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
                    <!--/ jabatan Table -->
                </div>
            </div>
            <!--/ jabatan cards -->

            <!-- Placeholder untuk JabatanModal component -->
            <Modal 
                id="JabatanModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="jabatanStore.saveJabatan()">
                        <div class="row g-6">
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="name" 
                                        v-model="form.nmJabatan" 
                                        placeholder="Masukkan nama jabatan"
                                        required
                                    >
                                    <label for="name">Nama Jabatan</label>
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-6">
                                <button type="button" class="btn btn-outline-secondary me-2" @click="jabatanStore.closeModal()">Tutup</button>
                                <button
                                    type="submit"
                                    class="btn btn-primary"
                                    :disabled="loading"
                                >
                                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    {{ isEditMode ? 'Update' : 'Simpan' }}
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
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Modal from '~/components/modal/Modal.vue'
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import { useJabatanStore } from '~/stores/jabatan'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import { useDebounceFn } from '@vueuse/core'
import { useUserStore } from '~/stores/user'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()

const myDataTableRef = ref(null)
const jabatanStore = useJabatanStore()
const permissionStore = usePermissionsStore()
const userStore = useUserStore()
const { userHasPermission, userHasRole } = usePermissions();

const { jabatans, loading, stats, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(jabatanStore)

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Jabatan' : 'Tambah Jabatan');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data jabatan di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan jabatan baru.');

let modalInstance = null
onMounted(() => {
    jabatanStore.fetchJabatans();
    jabatanStore.fetchStats();
    permissionStore.fetchPermissions()
    userStore.loadUser()

    const modalElement = document.getElementById('JabatanModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
    setListTitle('Jabatan', jabatans.value.length)
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
    } else {
        modalInstance?.hide()
    }
})

const debouncedSearch = useDebounceFn(() => {
    jabatanStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);

const onPage = (event) => jabatanStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0;
    jabatanStore.fetchJabatans();
};

const onSort = (event) => jabatanStore.setSort(event);

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    }
};

</script>