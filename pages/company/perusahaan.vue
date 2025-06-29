<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Perusahaan</h4>
            <p class="mb-6">
            List perusahaan yang terdaftar di sistem
            </p>
            <!-- perusahaan cards -->
            <div class="row g-6">
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
                        <div class="pegawai-heading">
                            <h5 class="mb-1">Support</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#PegawaiModal"
                            class="pegawai-edit-modal">
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
                        <div class="pegawai-heading">
                            <h5 class="mb-1">Restricted User</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#PegawaiModal"
                            class="pegawai-edit-modal">
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
                    <div class="card h-100">
                    <div class="row h-100">
                        <div class="col-5">
                        <div class="d-flex align-items-end h-100 justify-content-center">
                            <img
                            src="/img/illustrations/add-new-role-illustration.png"
                            class="img-fluid"
                            alt="Image"
                            width="68" />
                        </div>
                        </div>
                        <div class="col-7">
                        <div class="card-body text-sm-end text-center ps-sm-0">
                            <button
                            data-bs-target="#PerusahaanModal"
                            data-bs-toggle="modal"
                            class="btn btn-sm btn-primary mb-4 ml-5 textwrap add-new-pegawai"
                            @click="perusahaanStore.openModal()"
                            >
                            Tambah Perusahaan
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Perusahaan</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Perusahaan.</p>
                </div>
                <div class="col-12">
                    <!-- perusahaan Table -->
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
                                            placeholder="Cari perusahaan..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="perusahaans" 
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
                                <Column field="logoPerusahaan" header="Logo" :sortable="true">
                                    <template #body="slotProps">
                                        <div v-if="slotProps.data.logoPerusahaan">
                                            <img :src="getLogoUrl(slotProps.data.logoPerusahaan)" alt="Logo" style="height: 40px; max-width: 80px; object-fit: contain;" />
                                        </div>
                                        <div v-else>
                                            <span class="text-muted">Tidak ada logo</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column field="nmPerusahaan" header="Nama Perusahaan" :sortable="true"></Column>
                                <Column field="alamatPerusahaan" header="Alamat Perusahaan" :sortable="true"></Column>
                                <Column field="tlpPerusahaan" header="No. Telp Perusahaan" :sortable="true"></Column>
                                <Column field="emailPerusahaan" header="Email Perusahaan" :sortable="true"></Column>
                                <Column field="npwpPerusahaan" header="NPWP Perusahaan" :sortable="true"></Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                <template #body="slotProps">
                                    <div class="d-inline-block">
                                        <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li v-if="userHasRole('superadmin') || userHasPermission('edit_perusahaan')">
                                                <a class="dropdown-item" href="javascript:void(0)" @click="perusahaanStore.openModal(slotProps.data, 'admin')">
                                                    <i class="ri-edit-box-line me-2"></i> Edit
                                                </a>
                                            </li>
                                            <li v-if="userHasRole('superadmin') || userHasPermission('delete_perusahaan')">
                                                <a class="dropdown-item text-danger" href="javascript:void(0)" @click="perusahaanStore.deletePerusahaan(slotProps.data.id)">
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
                    <!--/ perusahaan Table -->
                </div>
            </div>
            <!--/ perusahaan cards -->

            <!-- Placeholder untuk MenuModal component -->
            <Modal 
                id="PerusahaanModal"
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedPerusahaan="selectedPerusahaan"
            >
                <template #default>
                    <form @submit.prevent="perusahaanStore.savePerusahaan()">
                        <div class="row g-6">
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="file" 
                                        class="form-control" 
                                        id="logoPerusahaan" 
                                        @change="onLogoChange"
                                        placeholder="Masukkan logo perusahaan"
                                    >
                                    <label for="logoPerusahaan">Logo Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="kodePerusahaan" 
                                        v-model="form.kodePerusahaan" 
                                        placeholder="Masukkan kode perusahaan"
                                        required
                                    >
                                    <label for="kodePerusahaan">Kode Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="nmPerusahaan" 
                                        v-model="form.nmPerusahaan" 
                                        placeholder="Masukkan nama perusahaan"
                                        required
                                    >
                                    <label for="nmPerusahaan">Nama Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="tlpPerusahaan" 
                                        v-model="form.tlpPerusahaan" 
                                        placeholder="Masukkan no telp perusahaan"
                                        required
                                    >
                                    <label for="tlpPerusahaan">No. Telp Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    id="emailPerusahaan" 
                                    v-model="form.emailPerusahaan" 
                                    placeholder="Masukkan email perusahaan"
                                    required
                                    >
                                    <label for="emailPerusahaan">Email Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="text" 
                                    class="form-control" 
                                    id="npwpPerusahaan" 
                                    v-model="form.npwpPerusahaan" 
                                    placeholder="Masukkan npwp perusahaan"
                                    required
                                    >
                                    <label for="npwpPerusahaan">NPWP Perusahaan</label>
                                </div>
                            </div>
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <textarea
                                        class="form-control h-px-100"
                                        id="alamatPerusahaan"
                                        placeholder="Alamat Perusahaan"
                                        v-model="form.alamatPerusahaan">
                                    </textarea>
                                    <label for="alamatPerusahaan">Alamat Perusahaan</label>
                                </div>
                            </div>
                            <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="perusahaanStore.closeModal()">Tutup</button>
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Simpan
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'
import { useDebounceFn } from '@vueuse/core'
import { useUserStore } from '~/stores/user'

const config = useRuntimeConfig();
const getLogoUrl = (logoPath) => {
    if (!logoPath || typeof logoPath !== 'string') {
        return null;
    }
    if (logoPath.startsWith('http')) {
        return logoPath;
    }
    if (!config.public.apiBase) {
        return logoPath;
    }
    const origin = new URL(config.public.apiBase).origin;
    const imageUrl = `${origin}/${logoPath}`;
    return imageUrl;
};

const myDataTableRef = ref(null)
const perusahaanStore = usePerusahaanStore()
const permissionStore = usePermissionsStore()
const userStore = useUserStore()
const { userHasPermission, userHasRole } = usePermissions();

const { perusahaans, loading, totalRecords, params, form, isEditMode, showModal, validationErrors, selectedPerusahaan } = storeToRefs(perusahaanStore)

const globalFilterValue = ref('')
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Perusahaan' : 'Tambah Perusahaan');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data perusahaan di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan perusahaan baru.');

let modalInstance = null
onMounted(() => {
    perusahaanStore.fetchPerusahaans();
    permissionStore.fetchPermissions()
    userStore.loadUser()

    const modalElement = document.getElementById('PerusahaanModal')
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
    perusahaanStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);


const onPage = (event) => perusahaanStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0;
    perusahaanStore.fetchPerusahaans();
};

const onSort = (event) => perusahaanStore.setSort(event);

const onLogoChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    perusahaanStore.setLogo(file);
  }
}

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    }
};

</script>