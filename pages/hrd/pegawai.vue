<template>
  <div>
    <!-- Content wrapper -->
    <div class="content-wrapper">
         <!-- Content -->
 
            <div class="container-xxl flex-grow-1 container-p-y">
                <h4 class="mb-1">List Pegawai</h4>
                <p class="mb-6">
                List pegawai yang terdaftar di sistem
                </p>
                <!-- pegawai cards -->
                <div class="row g-6 mb-6">
                    <!-- Cards untuk Statistik Pegawai -->
                    <CardBox
                        v-if="stats.total !== undefined"
                        title="Total Pegawai"
                        :total="stats.total + ' Pegawai'"
                    />
                    <CardBox
                        v-if="stats.pkwtt !== undefined"
                        title="Pegawai PKWTT"
                        :total="stats.pkwtt + ' Pegawai'"
                    />
                    <CardBox
                        v-if="stats.pkwt !== undefined"
                        title="Pegawai PKWT"
                        :total="stats.pkwt + ' Pegawai'"
                    />
                    <CardBox
                        v-if="stats.outsource !== undefined"
                        title="Pegawai Outsource"
                        :total="stats.outsource + ' Pegawai'"
                    />
                    <CardBox
                        v-if="stats.resign !== undefined"
                        title="Pegawai Resign"
                        :total="stats.resign + ' Pegawai'"
                    />
                    <CardBox
                        v-if="userHasRole('superadmin') || userHasPermission('create_pegawai')"
                        :isAddButtonCard="true"
                        image-src="/img/illustrations/add-new-role-illustration.png"
                        image-alt="Tambah Pegawai"
                        button-text="Tambah Pegawai"
                        @button-click="pegawaiStore.openModal()"
                    />
                </div>
                <!--/ pegawai cards -->

                <div class="row g-6">
                    <div class="col-12">
                        <h4 class="mt-6 mb-1">Filter & Daftar Pegawai</h4>
                        <p class="mb-0">Cari dan kelola semua akun pegawai perusahaan Anda beserta detailnya.</p>
                    </div>
                    <div class="col-12">
                        <!-- pegawai Table -->
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
                                                placeholder="Cari pegawai..."
                                                class="w-full md:w-20rem"
                                            />
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable 
                                ref="myDataTableRef"
                                :data="pegawais" 
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
                                <Column field="id_pegawai" header="#" :sortable="true" style="width:5%"></Column> 
                                <Column field="nm_pegawai" header="Nama Pegawai" :sortable="true" style="width:20%"></Column>
                                <Column field="email" sortField="users.email" header="Email" :sortable="true" style="width:20%"></Column>
                                <Column field="tmp_lahir_pegawai" header="Tempat Lahir" :sortable="true" style="width:15%"></Column>
                                <Column field="tgl_lahir_pegawai" header="Tanggal Lahir" :sortable="true" style="width:10%">
                                    <template #body="slotProps">
                                        {{ slotProps.data.tgl_lahir_pegawai ? new Date(slotProps.data.tgl_lahir_pegawai).toLocaleDateString() : '-' }}
                                    </template>
                                </Column>
                                <Column field="alamat_pegawai" header="Alamat" :sortable="true" style="width:20%"></Column>
                                <Column field="status_pegawai" header="Status" :sortable="true" style="width:10%">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.status_pegawai).class">
                                            {{ getStatusBadge(slotProps.data.status_pegawai).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                <template #body="slotProps">
                                    <div class="d-inline-block">
                                        <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                        </a>
                                        <ul class="dropdown-menu">
                                            <li v-if="userHasRole('superadmin') || userHasPermission('edit_pegawai')">
                                                <a class="dropdown-item" href="javascript:void(0)" @click="pegawaiStore.openModal(slotProps.data, 'admin')">
                                                    <i class="ri-edit-box-line me-2"></i> Edit
                                                </a>
                                            </li>
                                            <li v-if="userHasRole('superadmin') || userHasPermission('delete_pegawai')">
                                                <a class="dropdown-item text-danger" href="javascript:void(0)" @click="pegawaiStore.deletePegawai(slotProps.data.id_pegawai)">
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
                        <!--/ pegawai Table -->
                    </div>
                </div>
                <!--/ pegawai cards -->
 
                <Modal 
                    id="PegawaiModal"
                    :title="modalTitle"
                    :description="modalDescription"
                    :validation-errors-from-parent="validationErrors"
                >
                    <form @submit.prevent="pegawaiStore.savePegawai()">
                        <div class="row">
                            <div class="col">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item">
                                        <button
                                            class="nav-link active"
                                            data-bs-toggle="tab"
                                            data-bs-target="#form-tabs-personal"
                                            role="tab"
                                            aria-selected="true"
                                            type="button">
                                            <span class="ri-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">Informasi Pribadi</span>
                                        </button>
                                    </li>
                                    <li class="nav-item">
                                        <button
                                            class="nav-link"
                                            data-bs-toggle="tab"
                                            data-bs-target="#form-tabs-perusahaan"
                                            role="tab"
                                            aria-selected="false"
                                            type="button">
                                            <span class="ri-folder-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">Informasi Perusahaan</span>
                                        </button>
                                    </li>
                                    <li class="nav-item">
                                        <button
                                            class="nav-link"
                                            data-bs-toggle="tab"
                                            data-bs-target="#form-tabs-social"
                                            role="tab"
                                            aria-selected="false"
                                            type="button">
                                            <span class="ri-facebook-fill ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">Detail Keluarga</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="tab-content pt-6">
                            <!-- Tab Personal Info -->
                            <div class="tab-pane fade active show" id="form-tabs-personal" role="tabpanel">
                                <div class="row g-6">
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="nm_pegawai" class="form-control" placeholder="Nama Lengkap" name="nm_pegawai" v-model="form.nm_pegawai" />
                                            <label for="nm_pegawai">Nama Lengkap</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="no_tlp_pegawai" class="form-control" placeholder="No. Tlp/HP Pegawai" name="no_tlp_pegawai" v-model="form.no_tlp_pegawai" />
                                            <label for="no_tlp_pegawai">No. Tlp/HP Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="tmp_lahir_pegawai" class="form-control" placeholder="Tempat Lahir" name="tmp_lahir_pegawai" v-model="form.tmp_lahir_pegawai" />
                                            <label for="tmp_lahir_pegawai">Tempat Lahir</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" id="tgl_lahir_pegawai" class="form-control" placeholder="YYYY-MM-DD" name="tgl_lahir_pegawai" v-model="form.tgl_lahir_pegawai" />
                                            <label for="tgl_lahir_pegawai">Tanggal Lahir</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="form.pendidikan_pegawai"
                                                :options="pendidikanOptions"
                                                label="label"
                                                :reduce="option => Number(option.value)"
                                                :get-option-key="option => option.value"
                                                placeholder="-- Pilih Pendidikan --"
                                                id="select-pendidikan"
                                                class="select-pendidikan"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="no_ktp_pegawai" class="form-control" placeholder="No. KTP Pegawai" name="no_ktp_pegawai" v-model="form.no_ktp_pegawai" />
                                            <label for="no_ktp_pegawai">No. KTP Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="no_npwp_pegawai" class="form-control" placeholder="No. NPWP Pegawai" name="no_npwp_pegawai" v-model="form.npwp_pegawai" />
                                            <label for="no_npwp_pegawai">No. NPWP Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="form.jenis_kelamin_pegawai"
                                                :options="jenisKelaminOptions"
                                                label="label"
                                                :reduce="option => option.value"
                                                :get-option-key="option => option.value"
                                                placeholder="-- Pilih Jenis Kelamin --"
                                                id="select-jk"
                                                class="select-jenis-kelamin"
                                            />
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="file" @change="onAvatarChange" class="form-control" id="avatarFile" />
                                            <label for="avatarFile">Avatar</label>
                                            
                                            <div v-if="form.avatarPreview" class="mt-2">
                                                <a :href="form.avatarPreview" target="_blank" rel="noopener noreferrer" class="d-block mt-1">Lihat Avatar</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <textarea
                                            class="form-control h-px-100"
                                            id="alamat_pegawai"
                                            placeholder="Alamat Pegawai"
                                            v-model="form.alamat_pegawai"></textarea>
                                            <label for="alamat_pegawai">Alamat</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Tab Account Details -->
                            <div class="tab-pane fade" id="form-tabs-perusahaan" role="tabpanel">
                                <div class="row g-6">
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="full_name" class="form-control" placeholder="Full Name" v-model="form.full_name" />
                                            <label for="full_name">Full Name</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="input-group input-group-merge">
                                            <div class="form-floating form-floating-outline">
                                                <input
                                                    type="email"
                                                    id="formtabs-email"
                                                    class="form-control"
                                                    v-model="form.email"
                                                    placeholder="email"
                                                    aria-label="email"
                                                    :readonly="isEditMode" />
                                                <label for="formtabs-email">Email</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="nik_pegawai" class="form-control" placeholder="NIK Pegawai" name="nik_pegawai" v-model="form.nik_pegawai" />
                                            <label for="nik_pegawai">NIK Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select
                                            v-model="form.jabatan_id"
                                            :options="jabatans"
                                            label="nmJabatan"
                                            :reduce="jabatan => jabatan.id"
                                            :get-option-key="option => option.id"
                                            placeholder="-- Pilih Jabatan --"
                                            id="jabatan"
                                            class="jabatan"
                                        />    
                                    </div>
                                    <div class="col-md-6">
                                        <v-select
                                            v-model="form.perusahaan_id"
                                            :options="perusahaans"
                                            label="nmPerusahaan"
                                            :reduce="perusahaan => perusahaan.id"
                                            :get-option-key="option => option.id"
                                            placeholder="-- Pilih Perusahaan --"
                                            id="perusahaan"
                                            class="perusahaan"
                                            @update:modelValue="handleCompanySelectedInModal"
                                        />    
                                    </div>
                                    <div class="col-md-6">
                                        <v-select
                                            v-model="form.cabang_id"
                                            :options="filteredCabang"
                                            label="nmCabang"
                                            :reduce="cabang => cabang.id"
                                            :get-option-key="option => option.id"
                                            placeholder="-- Pilih Cabang --"
                                            id="cabang"
                                            class="cabang"
                                        />    
                                    </div>
                                    <div class="col-md-6">
                                        <v-select
                                            v-model="form.divisi_id"
                                            :options="divisis"
                                            label="nmDivisi"
                                            :reduce="divisi => divisi.id"
                                            :get-option-key="option => option.id"
                                            placeholder="-- Pilih Divisi --"
                                            id="divisi"
                                            class="divisi"
                                            @update:modelValue="handleDivisiSelected"
                                        />    
                                    </div>
                                    <div class="col-md-6">
                                        <v-select
                                            v-model="form.departemen_id"
                                            :options="filteredDepartemen"
                                            label="nmDepartemen"
                                            :reduce="departemen => departemen.id"
                                            :get-option-key="option => option.id"
                                            placeholder="-- Pilih Departemen --"
                                            id="departemen"
                                            class="departemen"
                                        />    
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" id="tgl_masuk_pegawai" class="form-control" placeholder="YYYY-MM-DD" name="tgl_masuk_pegawai" v-model="form.tgl_masuk_pegawai" />
                                            <label for="tgl_masuk_pegawai">Tanggal Masuk Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" id="tgl_keluar_pegawai" class="form-control" placeholder="YYYY-MM-DD" name="tgl_keluar_pegawai" v-model="form.tgl_keluar_pegawai" />
                                            <label for="tgl_keluar_pegawai">Tanggal Keluar Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="text" 
                                                id="gaji_pegawai" 
                                                class="form-control" 
                                                name="gaji_pegawai"
                                                placeholder="Rp 0,-"
                                                :value="gajiPegawaiFormatted"
                                                @input="handleGajiInput"
                                            />
                                            <label for="gaji_pegawai">Gaji Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="text" 
                                                id="tunjangan_pegawai" 
                                                class="form-control" 
                                                placeholder="Rp 0,-"
                                                :value="tunjanganPegawaiFormatted"
                                                @input="handleTunjanganInput"
                                            />
                                            <label for="tunjangan_pegawai">Tunjangan Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="form.status_pegawai"
                                                :options="statusPegawaiOptions"
                                                label="label"
                                                :reduce="option => option.value"
                                                :get-option-key="option => option.value"
                                                placeholder="-- Pilih Status Pegawai --"
                                                id="select-status-pegawai"
                                                class="select-status-pegawai"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Tab Social Links -->
                            <div class="tab-pane fade" id="form-tabs-social" role="tabpanel">
                                <div class="row g-6">
                                    <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="istri_suami_pegawai" class="form-control" placeholder="Istri/Suami Pegawai" v-model="form.istri_suami_pegawai" />
                                            <label for="istri_suami_pegawai">Istri/Suami Pegawai</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="anak_1" class="form-control" placeholder="Anak 1" v-model="form.anak_1" />
                                            <label for="anak_1">Anak 1</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" id="anak_2" class="form-control" placeholder="Anak 2" v-model="form.anak_2" />
                                            <label for="anak_2">Anak 2</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Tombol Submit dan Cancel -->
                        <div class="modal-footer mt-6">
                            <button type="button" class="btn btn-outline-secondary" @click="pegawaiStore.closeModal()">Tutup</button>
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
     <!-- Content wrapper -->
 </div>
 </template>
 
<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { usePegawaiStore } from '~/stores/pegawai'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { useDivisiStore } from '~/stores/divisi'
import { useDepartemenStore } from '~/stores/departemen'
import { useCabangStore } from '~/stores/cabang'
import { useJabatanStore } from '~/stores/jabatan'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { useDebounceFn } from '@vueuse/core'


// Import komponen
import CardBox from '~/components/cards/Cards.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Modal from '~/components/modal/Modal.vue'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Column from 'primevue/column'

const pegawaiStore = usePegawaiStore()
const perusahaanStore = usePerusahaanStore()
const cabangStore = useCabangStore()
const divisiStore = useDivisiStore()
const departemenStore = useDepartemenStore()
const jabatanStore = useJabatanStore()
const permissionStore = usePermissionsStore()
const userStore = useUserStore()
const { userHasPermission, userHasRole } = usePermissions();

const { pegawais, loading, totalRecords, params, form, isEditMode, showModal, validationErrors, stats } = storeToRefs(pegawaiStore)
const { perusahaans }   = storeToRefs(perusahaanStore)
const { cabangs }       = storeToRefs(cabangStore)  
const { divisis }        = storeToRefs(divisiStore)
const { departemens }   = storeToRefs(departemenStore)
const { jabatans }      = storeToRefs(jabatanStore)
const myDataTableRef    = ref(null)

const globalFilterValue = ref('');
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const modalTitle = computed(() => isEditMode.value ? 'Edit Pegawai' : 'Tambah Pegawai')
const modalDescription = computed(() => isEditMode.value ? 'Ubah detail pegawai di bawah ini.' : 'Isi detail pegawai baru di bawah ini.')

let modalInstance = null;
onMounted(() => {
    pegawaiStore.fetchPegawais()
    pegawaiStore.fetchStats()
    perusahaanStore.fetchPerusahaans()
    cabangStore.fetchCabangs()
    divisiStore.fetchDivisis()
    jabatanStore.fetchJabatans()
    permissionStore.fetchPermissions()
    userStore.loadUser()
    // Departemen & Cabang (dependent) fetched via watchers
    
    const modalElement = document.getElementById('PegawaiModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }
})

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
    } else {
        modalInstance?.hide()
    }
})

const debouncedSearch = useDebounceFn(() => {
    pegawaiStore.setSearch(globalFilterValue.value)
}, 500)

watch(globalFilterValue, debouncedSearch);

const onPage = (event) => {
    pegawaiStore.setPagination(event);
};

const handleRowsChange = () => {
    params.value.first = 0;
    pegawaiStore.fetchPegawais();
};

const onSort = (event) => {
    pegawaiStore.setSort(event);
};

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    }
    // PDF export logic can be added here
};

const handleCompanySelectedInModal = (perusahaanId) => {
    form.value.cabang_id = null; // Reset cabang when company changes
    cabangStore.fetchCabangByPerusahaan(perusahaanId);
};

const handleDivisiSelected = (divisiId) => {
    form.value.departemen_id = null;
    if (divisiId) {
        departemenStore.fetchDepartemensByDivisi(divisiId);
    } else {
        departemenStore.departemens = [];
    }
};

// Form related computed properties and functions
const filteredCabang = computed(() => {
    if (!form.value.perusahaan_id) return [];
    return cabangs.value.filter(c => c.perusahaanId === form.value.perusahaan_id);
});

const filteredDepartemen = computed(() => {
    if (!form.value.divisi_id) return [];
    return departemens.value.filter(dep => dep.divisiId === form.value.divisi_id);
});

const onAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    form.value.avatar = file;
    form.value.avatarPreview = URL.createObjectURL(file);
  }
}

const formatRupiah = (angka) => {
    if (angka === null || angka === undefined) return '';
    let number_string = String(angka).replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return 'Rp ' + rupiah;
}

const gajiPegawaiFormatted = computed(() => formatRupiah(form.value.gaji_pegawai));
const tunjanganPegawaiFormatted = computed(() => formatRupiah(form.value.tunjangan_pegawai));

const handleGajiInput = (e) => {
    form.value.gaji_pegawai = e.target.value.replace(/[^0-9]/g, '');
};

const handleTunjanganInput = (e) => {
    form.value.tunjangan_pegawai = e.target.value.replace(/[^0-9]/g, '');
};

const pendidikanOptions = [
    { label: 'SD', value: 0 }, { label: 'SMP', value: 1 }, { label: 'SMA', value: 2 },
    { label: 'S1', value: 3 }, { label: 'S2', value: 4 }, { label: 'S3', value: 5 }
];

const jenisKelaminOptions = [
    { label: 'Perempuan', value: 0 }, { label: 'Laki-Laki', value: 1 }
];

const statusPegawaiOptions = [
    { label: 'PKWTT', value: 1 }, { label: 'PKWT', value: 2 },
    { label: 'Outsource', value: 3 }, { label: 'Resign', value: 4 },
    { label: 'Tidak diketahui', value: 5 }
];


const getStatusBadge = (status) => {
    switch (status) {
        case 1:
            return { text: 'PKWTT', class: 'badge rounded-pill bg-label-primary' };
        case 2:
            return { text: 'PKWT', class: 'badge rounded-pill bg-label-secondary' };
        case 3:
            return { text: 'Outsource', class: 'badge rounded-pill bg-label-warning text-dark' };
        case 4:
            return { text: 'Resign', class: 'badge rounded-pill bg-label-danger' };
        case 5:
            return { text: 'Tidak Diketahui', class: 'badge rounded-pill bg-label-dark' };
        default:
            return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

</script>
 
 <style scoped>
    :deep(.divisi .vs__dropdown-toggle),
    :deep(.departemen .vs__dropdown-toggle),
    :deep(.jabatan .vs__dropdown-toggle),
    :deep(.perusahaan .vs__dropdown-toggle),
    :deep(.cabang .vs__dropdown-toggle),
    :deep(.select-jenis-kelamin .vs__dropdown-toggle),
    :deep(.select-pendidikan .vs__dropdown-toggle),
    :deep(.select-status-pegawai .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
 </style>