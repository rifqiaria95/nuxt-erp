<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List User</h4>
            <p class="mb-6">
            List User yang terdaftar di sistem
            </p>
            <!-- User cards -->
            <div class="row g-6 mb-6">
                <!-- Card untuk Tambah Pegawai -->
                    <!-- Cards untuk Statistik Pegawai -->
                <CardBox
                    v-if="stats.total !== undefined"
                    title="Total User"
                    :total="stats.total + ' User'"
                />
                <CardBox
                    v-if="stats.aktif !== undefined"
                    title="User Aktif"
                    :total="stats.aktif + ' User'"
                />
                <CardBox
                    v-if="stats.tidakAktif !== undefined"
                    title="User Tidak Aktif"
                    :total="stats.tidakAktif + ' User'"
                />
                <CardBox
                    v-if="stats.totalSuperadmin !== undefined"
                    title="User Superadmin"
                    :total="stats.totalSuperadmin + ' User'"
                />
                <CardBox
                    v-if="stats.totalAdmin !== undefined"
                    title="User Admin"
                    :total="stats.totalAdmin + ' User'"
                />
                <CardBox
                    :isAddButtonCard="true"
                    image-src="/img/illustrations/add-new-role-illustration.png"
                    image-alt="Tambah User"
                    button-text="Tambah User"
                    @button-click="userStore.openModal()"
                />
            </div>
            <!--/ user cards -->

            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Filter & Daftar User</h4>
                    <p class="mb-0">Cari dan kelola semua akun administrator perusahaan Anda beserta detailnya.</p>
                </div>
                <div class="col-12">
                    <!-- user Table -->
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
                                            placeholder="Cari user..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="users" 
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
                                <Column field="fullName" header="Nama Lengkap" :sortable="true"></Column>
                                <Column field="email" header="Email" :sortable="true"></Column>
                                <Column field="roles" header="Role" :sortable="true">
                                    <template #body="slotProps">
                                        <span v-for="role in slotProps.data.roles" :key="role.id">
                                            {{ role.name }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="isActive" header="Status" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.isActive).class">
                                            {{ getStatusBadge(slotProps.data.isActive).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <button @click="userStore.openModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button @click="userStore.deleteUser(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
                                    </template>
                                </Column>
                        </MyDataTable>
                        </div>
                    </div>
                    <!--/ user Table -->
                </div>
            </div>

            <!-- Placeholder untuk UserModal component -->
            <Modal 
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
            >
                <template #default>
                    <form @submit.prevent="userStore.saveUser()">
                        <div class="row g-6">
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="full_name" 
                                        v-model="form.full_name" 
                                        placeholder="Masukkan nama user"
                                        required
                                    >
                                    <label for="full_name">Nama Lengkap</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="email" 
                                    class="form-control" 
                                    id="email" 
                                    v-model="form.email" 
                                    placeholder="Masukkan email"
                                    >
                                    <label for="email">Email</label>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                    type="password" 
                                    class="form-control" 
                                    id="password" 
                                    v-model="form.password" 
                                    placeholder="Masukkan password"
                                    aria-describedby="passwordHelp"
                                    >
                                    <label for="password">Password</label>
                                </div>
                                <div v-if="isEditMode" id="passwordHelp" class="form-text">
                                    Kosongkan jika tidak ingin mengubah password.
                                </div>
                            </div>
                            <div class="col-md-6">
                                <v-select
                                    v-model="form.role_ids"
                                    :options="roles"
                                    label="name"
                                    multiple
                                    :reduce="roles => roles.id"
                                    placeholder="-- Pilih Role --"
                                    id="role_ids"
                                    class="role_ids"
                                />   
                            </div>
                            <div class="col-md-6">
                                <v-select
                                    v-model="form.isActive"
                                    :options="status"
                                    label="label"
                                    :reduce="status => status.value"
                                    placeholder="-- Pilih Status --"
                                    id="isActive"
                                    class="isActive"
                                />   
                            </div>
                            <div class="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    class="btn btn-primary me-2"
                                >
                                    {{ isEditMode ? 'Update' : 'Simpan' }}
                                </button>
                                <button type="button" class="btn btn-secondary" @click="userStore.closeModal()">
                                    Batal
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import CardBox from '~/components/cards/Cards.vue'
import { useUserManagementStore } from '~/stores/userManagement'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import { useDebounceFn } from '@vueuse/core'

const myDataTableRef = ref(null);
const userStore = useUserManagementStore()
const { 
    users, 
    roles, 
    loading, 
    stats, 
    totalRecords, 
    params, 
    form, 
    isEditMode, 
    showModal, 
    validationErrors 
} = storeToRefs(userStore)

const globalFilterValue = ref('')

const status = ref([
    { label: 'Aktif', value: true },
    { label: 'Tidak Aktif', value: false },
]);

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit User' : 'Tambah User');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data user di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan user baru.');

let modalInstance = null
onMounted(() => {
    userStore.fetchUsers()
    userStore.fetchRoles()
    userStore.fetchStats()
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
    userStore.setSearch(globalFilterValue.value)
}, 500)
watch(globalFilterValue, debouncedSearch);


const onPage = (event) => userStore.setPagination(event);

const handleRowsChange = () => {
    params.value.first = 0; // Reset to first page
    userStore.fetchUsers();
};

const onSort = (event) => userStore.setSort(event);

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    }
};

const getStatusBadge = (isActive) => {
    switch (isActive) {
        case true:
            return { text: 'Aktif', class: 'badge rounded-pill bg-label-primary' };
        case false:
            return { text: 'Tidak Aktif', class: 'badge rounded-pill bg-label-danger' };
        default:
            return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};
</script>

<style scoped>
    :deep(.isActive .vs__dropdown-toggle),
    :deep(.role_ids .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>