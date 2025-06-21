<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Cabang</h4>
            <p class="mb-6">
            List cabang yang terdaftar di sistem
            </p>
            <!-- cabang cards -->
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
                            class="btn btn-sm btn-primary mb-4 text-nowrap"
                            @click="cabangStore.openModal()"
                            >
                            Tambah Cabang
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Cabang</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Cabang.</p>
                </div>
                <div class="col-12">
                    <!-- cabang Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="params.rows" :options="[5, 10, 20, 50]" @change="handleRowsChange" style="width: 8rem;" />
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="p-input-icon-left">
                                    <i class="ri-search-line"></i>
                                    <InputText
                                        v-model="globalFilterValue"
                                        placeholder="Cari cabang..."
                                        class="w-full md:w-20rem"
                                    />
                                </span>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="cabangs" 
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
                            <Column field="kodeCabang" header="Kode Cabang" :sortable="true"></Column>
                            <Column field="nmCabang" header="Nama Cabang" :sortable="true"></Column>
                            <Column field="alamatCabang" header="Alamat" :sortable="true"></Column>
                            <Column header="Perusahaan" :sortable="true" field="perusahaan.nmPerusahaan">
                                <template #body="slotProps">
                                    {{ slotProps.data.perusahaan?.nmPerusahaan || '-' }}
                                </template>
                            </Column>
                            <Column header="Actions" :exportable="false" style="min-width:8rem">
                                <template #body="slotProps">
                                    <button @click="cabangStore.openModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2">
                                        <i class="ri-edit-box-line ri-20px"></i>
                                    </button>
                                    <button @click="confirmDelete(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon">
                                        <i class="ri-delete-bin-7-line ri-20px"></i>
                                    </button>
                                </template>
                            </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ cabang Table -->
                </div>
            </div>
            <!--/ cabang cards -->

            <!-- Placeholder untuk CabangModal component -->
            <Modal 
                id="CabangModal"
                :title="modalTitle"
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <form @submit.prevent="handleSubmit">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="form-floating form-floating-outline">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="kodeCabang" 
                                    v-model="form.kodeCabang" 
                                    placeholder="Masukkan kode cabang"
                                    required
                                >
                                <label for="kodeCabang">Kode Cabang</label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-floating form-floating-outline">
                                <input 
                                    type="text" 
                                    class="form-control" 
                                    id="nmCabang" 
                                    v-model="form.nmCabang" 
                                    placeholder="Masukkan nama cabang"
                                    required
                                >
                                <label for="nmCabang">Nama Cabang</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-floating form-floating-outline">
                                <textarea 
                                    class="form-control h-100" 
                                    id="alamatCabang" 
                                    v-model="form.alamatCabang" 
                                    placeholder="Masukkan alamat lengkap"
                                    rows="4"
                                ></textarea>
                                <label for="alamatCabang">Alamat</label>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-floating form-floating-outline">
                                <select id="perusahaanId" class="form-select" v-model="form.perusahaanId" required>
                                    <option value="" disabled>Pilih Perusahaan</option>
                                    <option v-for="perusahaan in perusahaans" :key="perusahaan.id" :value="perusahaan.id">
                                        {{ perusahaan.nmPerusahaan }}
                                    </option>
                                </select>
                                <label for="perusahaanId">Perusahaan</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer mt-6">
                        <button type="button" class="btn btn-outline-secondary" @click="cabangStore.closeModal()">Tutup</button>
                        <button type="submit" class="btn btn-primary" :disabled="loading">
                            <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Simpan
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
         <!-- / Content -->
 
         <div class="content-backdrop fade"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCabangStore } from '~/stores/cabang'
import { usePerusahaanStore } from '~/stores/perusahaan'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Modal from '~/components/modal/Modal.vue'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Swal from 'sweetalert2'
import { useDebounceFn } from '@vueuse/core'

const { $api } = useNuxtApp()

const cabangStore = useCabangStore()
const perusahaanStore = usePerusahaanStore()

const { cabangs, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(cabangStore)
const { perusahaans } = storeToRefs(perusahaanStore)

const myDataTableRef = ref(null)
const globalFilterValue = ref('')

const modalTitle = computed(() => isEditMode.value ? 'Edit Cabang' : 'Tambah Cabang')
const modalDescription = computed(() => isEditMode.value ? 'Ubah detail cabang di bawah ini.' : 'Isi detail cabang baru di bawah ini.')

const modalInstance = ref(null)

onMounted(() => {
    cabangStore.fetchCabangs()
    perusahaanStore.fetchPerusahaans()
    
    const modalElement = document.getElementById('CabangModal')
    if (modalElement) {
        modalInstance.value = new bootstrap.Modal(modalElement)
    }
})

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance.value?.show()
    } else {
        modalInstance.value?.hide()
    }
})

const handleSubmit = async () => {
    if (isEditMode.value) {
        await cabangStore.updateCabang()
    } else {
        await cabangStore.createCabang()
    }
}

const confirmDelete = (id) => {
    Swal.fire({
        title: 'Anda yakin?',
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    }).then((result) => {
        if (result.isConfirmed) {
            cabangStore.deleteCabang(id).then(() => {
                Swal.fire(
                    'Dihapus!',
                    'Data cabang berhasil dihapus.',
                    'success'
                )
            })
        }
    })
}

const onPage = (event) => {
    params.value.page = event.page + 1
    params.value.rows = event.rows
    cabangStore.fetchCabangs()
}

const onSort = (event) => {
    params.value.sortField = event.sortField
    params.value.sortOrder = event.sortOrder
    cabangStore.fetchCabangs()
}

const handleRowsChange = () => {
    params.value.page = 1
    cabangStore.fetchCabangs()
}

const debouncedSearch = useDebounceFn(() => {
    params.value.page = 1
    params.value.filters = { global: { value: globalFilterValue.value } }
    cabangStore.setFilters(params.value.filters)
}, 500)

watch(globalFilterValue, () => {
    debouncedSearch()
})
</script>

<style scoped>
    :deep(.perusahaanId .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>

