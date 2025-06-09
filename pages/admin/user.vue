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
                    modal-target="#Modal" 
                    @button-click="openAddUserModal"
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
                                <Dropdown v-model="lazyParams.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="p-input-icon-left">
                                    <InputText v-model="lazyParams.search" placeholder="Cari user..." @keyup.enter="handleSearch" style="width: 20rem;" />
                                </span>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            :data="user" 
                            :rows="lazyParams.rows" 
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
                                        <button @click="openEditUserModal(slotProps.data)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon me-2"><i class="ri-edit-box-line"></i></button>
                                        <button @click="deleteUser(slotProps.data.id)" class="btn btn-sm btn-icon btn-text-secondary rounded-pill btn-icon"><i class="ri-delete-bin-7-line"></i></button>
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
                :selectedUser="selectedUser"
            >
                <template #default>
                    <form @submit.prevent="handleSubmit">
                        <div class="row g-6">
                            <div class="col-md-12">
                                <div class="form-floating form-floating-outline">
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="full_name" 
                                        v-model="formUser.full_name" 
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
                                    v-model="formUser.email" 
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
                                    v-model="formUser.password" 
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
                                    v-model="formUser.role_ids"
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
                                    v-model="formUser.isActive"
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
                                    @click="handleSaveUser"
                                >
                                    {{ isEditMode ? 'Update' : 'Simpan' }}
                                </button>
                                <button type="button" class="btn btn-secondary" @click="handleCloseModal">
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
import { ref, computed, onMounted, watch } from 'vue'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import CardBox from '~/components/cards/Cards.vue'
import Swal from 'sweetalert2'
import { useUserStore } from '~/stores/user'
import { useRolesStore } from '~/stores/roles'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

const { $api } = useNuxtApp()

const userStore    = useUserStore()
const rolesStore   = useRolesStore()
const selectedUser = ref(null);
const status       = ref([
    { label: 'Aktif', value: true },
    { label: 'Tidak Aktif', value: false },
]);
const user         = ref([])
const loading      = ref(false);
const isEditMode   = ref(false);
const totalRecords = ref(0);
const roles        = ref([]);
const lazyParams   = ref({
    first: 0,
    rows: 10,
    sortField: null,
    sortOrder: null,
    draw: 1,
    search: '',
});

const formUser = ref({
    full_name: '',
    email: '',
    password: '',
    isActive: true,
    role_ids: []
});

const stats = ref({
  total: undefined,
  aktif: undefined,
  tidakAktif: undefined,
  totalSuperadmin: undefined,
  totalAdmin: undefined
})

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

const validationErrors = ref([]);

const modalTitle = computed(() => isEditMode.value ? 'Edit User' : 'Tambah User');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data user di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan user baru.');

// Fungsi untuk menangani event close dari modal
const handleCloseModal = () => {
    const modalEl = document.getElementById('Modal'); 
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
    resetParentFormState(); 
};

const fetchRoles = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch($api.roles(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) throw new Error('Gagal mengambil data role')
        
        const data = await response.json()
        roles.value = data.data || data
    } catch (error) {
        console.error('Error fetching role:', error)
    }
}

const handleSaveUser = async () => {
    loading.value = true;
    validationErrors.value = []; // reset error sebelum submit
    try {
        // Ambil CSRF token
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token = localStorage.getItem('token');
        let response;
        let url;

        // Validasi form sederhana
        if (!formUser.value.email) {
            Swal.fire('Validasi', 'Email wajib diisi.', 'warning');
            loading.value = false;
            return;
        }

        if (!isEditMode.value && !formUser.value.password) {
            Swal.fire('Validasi', 'Password wajib diisi untuk user baru.', 'warning');
            loading.value = false;
            return;
        }

        if (isEditMode.value) {
            // Cari ID user dari form atau selectedUser
            let userIdToUpdate = formUser.value?.id || formUser.value?.idUser;
            if (!userIdToUpdate && selectedUser.value) {
                userIdToUpdate = selectedUser.value.id || selectedUser.value.idUser;
            }
            if (!userIdToUpdate) {
                Swal.fire('Error', 'ID User tidak ditemukan untuk update.', 'error');
                loading.value = false;
                return;
            }
            url = `${$api.users()}/${userIdToUpdate}`;
            console.log('Updating user with ID:', userIdToUpdate, 'URL:', url);
            
            const payload = {
                full_name: formUser.value.full_name,
                email    : formUser.value.email,
                isActive : formUser.value.isActive,
                role_ids : formUser.value.role_ids
            };
            if (formUser.value.password) {
                payload.password = formUser.value.password;
            }
            // Update data
            response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(payload),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        } else {
            // Create baru
            url = $api.users();
            response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({
                    full_name: formUser.value.full_name,
                    email    : formUser.value.email,
                    password : formUser.value.password,
                    isActive : formUser.value.isActive,
                    role_ids : formUser.value.role_ids
                }),
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
        }

        if (response.ok) {
            await loadLazyData();
            handleCloseModal();
            await Swal.fire(
                'Berhasil!',
                `User berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
                'success'
            );
        } else {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { message: 'Gagal memproses respons server.' };
            }
            if (errorData.errors) {
                validationErrors.value = Array.isArray(errorData.errors)
                    ? errorData.errors
                    : Object.values(errorData.errors).flat();
                Swal.fire('Gagal', 'Terdapat kesalahan validasi data.', 'error');
            } else {
                Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} user`, 'error');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Terjadi kesalahan saat menyimpan data user.', 'error');
    } finally {
        loading.value = false;
    }
};

const fetchTotalUsers = async () => {
  const defaultStats = {
    total: undefined,
    aktif: undefined,
    tidakAktif: undefined,
    totalSuperadmin: undefined,
    totalAdmin: undefined
  };
  try {
    const token = localStorage.getItem('token');
    const response = await fetch($api.countTotalUsers(), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
      const result = await response.json();
      if (result && typeof result === 'object' && result !== null) {
        stats.value = {
            total: result.total,
            aktif: result.aktif,
            tidakAktif: result.tidakAktif,
            totalSuperadmin: result.totalSuperadmin,
            totalAdmin: result.totalAdmin,
        };
      } else {
        stats.value = defaultStats;
        console.warn('Data statistik dari API tidak dalam format objek yang diharapkan atau null:', result);
      }
    } else {
        stats.value = defaultStats;
        console.error('Gagal mengambil data statistik, status respons:', response.status);
    }
  } catch (error) {
    console.error('Gagal mengambil data statistik (exception):', error);
    stats.value = defaultStats;
  }
};

// Fungsi untuk menangani event load lazy data dari user
const loadLazyData = async () => {
    loading.value = true;
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams({
            page     : (lazyParams.value.first / lazyParams.value.rows) + 1,
            rows     : lazyParams.value.rows,
            sortField: lazyParams.value.sortField || '',
            sortOrder: lazyParams.value.sortOrder || '',
            draw     : lazyParams.value.draw || 1,
            search   : lazyParams.value.search || '',
        });

        const response = await fetch(`${$api.users()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data user dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data user');
        }

        const result = await response.json();
        user.value = result.data || []; 
        totalRecords.value = parseInt(result.meta.total) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for user:', error);
        user.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data user: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadLazyData();
    fetchRoles();
    fetchTotalUsers();
});

const onPage = (event) => {
    lazyParams.value.first = event.first;
    lazyParams.value.rows = event.rows;
    loadLazyData();
};

const handleRowsChange = () => {
    lazyParams.value.first = 0;
    loadLazyData();
};

const handleSearch = () => {
    lazyParams.value.first = 0;
    loadLazyData();
};

const onSort = (event) => {
    lazyParams.value.sortField = event.sortField;
    lazyParams.value.sortOrder = event.sortOrder;
    loadLazyData();
};

const openAddUserModal = () => {
    isEditMode.value = false;
    modalTitle.value = 'Tambah User';
    modalDescription.value = 'Silakan isi form di bawah ini untuk menambahkan user baru.';
    resetParentFormState();
};

async function openEditUserModal(userData) {
    isEditMode.value = true;
    // Ambil data user saat modal terbuka
    selectedUser.value = JSON.parse(JSON.stringify(userData));
    formUser.value = {
        full_name: userData.fullName || '',
        email: userData.email || '',
        password: userData.password || '',
        isActive: userData.isActive || '',
        role_ids: userData.roles.map(role => role.id)
    };
    validationErrors.value = [];

    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('UserModal element tidak ditemukan atau Bootstrap belum dimuat.');
    }
}

const deleteUser = async (userId) => {
    if (!userId) return;

    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#666CFF',
        cancelButtonColor: '#A7A9B3',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            let url;

            const token = localStorage.getItem('token');
            // Ambil CSRF token
            const csrfResponse = await fetch($api.csrfToken(), {
                credentials: 'include'
            });
            const csrfData  = await csrfResponse.json();
            const csrfToken = csrfData.token;

            url = `${$api.users()}/${userId}`;

            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type' : 'application/json',
                    'X-CSRF-TOKEN' : csrfToken
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus user');
            }

            loadLazyData();

            await Swal.fire({
                title: 'Berhasil!',
                text: 'User berhasil dihapus.',
                icon: 'success'
            });

        } catch (error) {
            await Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error'
            });
        }
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

const resetParentFormState = () => {
    formUser.value = {
        full_name: '',
        email: '',
        password: '',
        isActive: true,
        role_ids: []
    };
};
</script>

<style scoped>
    :deep(.isActive .vs__dropdown-toggle),
    :deep(.role_ids .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>