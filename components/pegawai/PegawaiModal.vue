<template>
    <div class="modal fade" id="PegawaiModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row">
                        <div class="text-center mb-6">
                        <h4 class="pegawai-title mb-2 pb-0">{{ isEditMode ? 'Edit Pegawai' : 'Tambah Pegawai baru' }}</h4>
                        <p>Atur Informasi Pegawai</p>
                        </div>
                        <div v-if="validationErrors.length" class="alert alert-danger">
                            <ul>
                                <li v-for="err in validationErrors" :key="err.message || err">
                                {{ typeof err === 'string' ? err : err.message }}
                                </li>
                            </ul>
                        </div>
                        <!-- Add pegawai form -->
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
                        
                        <form id="addPegawaiForm" class="row g-3" @submit.prevent="submitPegawai">
                            <div class="tab-content">
                                <!-- Tab Personal Info -->
                                <div class="tab-pane fade active show" id="form-tabs-personal" role="tabpanel">
                                    <div class="row g-6">
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" id="nm_pegawai" class="form-control" placeholder="Nama Lengkap" name="nm_pegawai" v-model="nmPegawai" />
                                                <label for="nm_pegawai">Nama Lengkap</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" id="no_tlp_pegawai" class="form-control" placeholder="No. Tlp/HP Pegawai" name="no_tlp_pegawai" v-model="noTlpPegawai" />
                                                <label for="no_tlp_pegawai">No. Tlp/HP Pegawai</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" id="tmp_lahir_pegawai" class="form-control" placeholder="Tempat Lahir" name="tmp_lahir_pegawai" v-model="tmpLahirPegawai" />
                                                <label for="tmp_lahir_pegawai">Tempat Lahir</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="date" id="tgl_lahir_pegawai" class="form-control" placeholder="YYYY-MM-DD" name="tgl_lahir_pegawai" v-model="tglLahirPegawai" />
                                                <label for="tgl_lahir_pegawai">Tanggal Lahir</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <v-select
                                                    v-model="selectedPendidikanPegawai"
                                                    :options="[
                                                        { label: 'SD', value: 0 },
                                                        { label: 'SMP', value: 1 },
                                                        { label: 'SMA', value: 2 },
                                                        { label: 'S1', value: 3 },
                                                        { label: 'S2', value: 4 },
                                                        { label: 'S3', value: 5 },
                                                    ]"
                                                    label="label"
                                                    :reduce="option => Number(option.value)"
                                                    placeholder="-- Pilih Pendidikan --"
                                                    id="select-pendidikan"
                                                    class="select-pendidikan"
                                                />
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" id="no_ktp_pegawai" class="form-control" placeholder="No. KTP Pegawai" name="no_ktp_pegawai" v-model="noKtpPegawai" />
                                                <label for="no_ktp_pegawai">No. KTP Pegawai</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" id="no_npwp_pegawai" class="form-control" placeholder="No. NPWP Pegawai" name="no_npwp_pegawai" v-model="npwpPegawai" />
                                                <label for="no_npwp_pegawai">No. NPWP Pegawai</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <v-select
                                                    v-model="selectedJenisKelaminPegawai"
                                                    :options="[
                                                        { label: 'Perempuan', value: 0 },
                                                        { label: 'Laki-Laki', value: 1 }
                                                    ]"
                                                    label="label"
                                                    :reduce="option => option.value"
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
                                                
                                                <div v-if="avatarPreview" class="mt-2">
                                                    <a :href="avatarPreview" target="_blank" rel="noopener noreferrer" class="d-block mt-1">Lihat Avatar</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-12">
                                            <div class="form-floating form-floating-outline">
                                                <textarea
                                                class="form-control h-px-100"
                                                id="alamat_pegawai"
                                                placeholder="Alamat Pegawai"
                                                v-model="alamatPegawai"></textarea>
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
                                                <input type="text" id="full_name" class="form-control" placeholder="Full Name" v-model="fullName" />
                                                <label for="full_name">Full Name</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="input-group input-group-merge">
                                                <div class="form-floating form-floating-outline">
                                                    <input
                                                        type="text"
                                                        id="formtabs-email"
                                                        class="form-control"
                                                        v-model="email"
                                                        placeholder="email"
                                                        aria-label="email"
                                                        aria-describedby="formtabs-email2"
                                                        :readonly="isEditMode" />
                                                    <label for="formtabs-email">Email</label>
                                                </div>
                                                <span class="input-group-text" id="formtabs-email2">@example.com</span>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" id="nik_pegawai" class="form-control" placeholder="NIK Pegawai" name="nik_pegawai" v-model="nikPegawai" />
                                                <label for="nik_pegawai">NIK Pegawai</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <v-select
                                                v-model="selectedJabatan"
                                                :options="jabatan"
                                                label="nmJabatan"
                                                :reduce="jabatan => jabatan.idJabatan"
                                                placeholder="-- Pilih Jabatan --"
                                                id="jabatan"
                                                class="jabatan"
                                            />    
                                        </div>
                                        <div class="col-md-6">
                                            <v-select
                                                v-model="selectedPerusahaan"
                                                :options="perusahaan"
                                                label="nmPerusahaan"
                                                :reduce="perusahaan => perusahaan.id"
                                                placeholder="-- Pilih Perusahaan --"
                                                id="perusahaan"
                                                class="perusahaan"
                                            />    
                                        </div>
                                        <div class="col-md-6">
                                            <v-select
                                                v-model="selectedCabang"
                                                :options="filteredCabang"
                                                label="nmCabang"
                                                :reduce="cabang => cabang.id"
                                                placeholder="-- Pilih Cabang --"
                                                id="cabang"
                                                class="cabang"
                                            />    
                                        </div>
                                        <div class="col-md-6">
                                            <v-select
                                                v-model="selectedDivisi"
                                                :options="divisi"
                                                label="nmDivisi"
                                                :reduce="divisi => divisi.id"
                                                placeholder="-- Pilih Divisi --"
                                                id="divisi"
                                                class="divisi"
                                            />    
                                        </div>
                                        <div class="col-md-6">
                                            <v-select
                                                v-model="selectedDepartemen"
                                                :options="filteredDepartemen"
                                                label="nmDepartemen"
                                                :reduce="departemen => departemen.id"
                                                placeholder="-- Pilih Departemen --"
                                                id="departemen"
                                                class="departemen"
                                            />    
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="date" id="tgl_masuk_pegawai" class="form-control" placeholder="YYYY-MM-DD" name="tgl_masuk_pegawai" v-model="tglMasukPegawai" />
                                                <label for="tgl_masuk_pegawai">Tanggal Masuk Pegawai</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="date" id="tgl_keluar_pegawai" class="form-control" placeholder="YYYY-MM-DD" name="tgl_keluar_pegawai" v-model="tglKeluarPegawai" />
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
                                                    v-model="selectedStatusPegawai"
                                                    :options="[
                                                        { label: 'PKWTT', value: 1 },
                                                        { label: 'PKWT', value: 2 },
                                                        { label: 'Outsource', value: 3 },
                                                        { label: 'Resign', value: 4 },
                                                        { label: 'Tidak diketahui', value: 5 },
                                                    ]"
                                                    label="label"
                                                    :reduce="option => option.value"
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
                                                <input type="text" id="istri_suami_pegawai" class="form-control" placeholder="Istri/Suami Pegawai" v-model="istriSuamiPegawai" />
                                                <label for="istri_suami_pegawai">Istri/Suami Pegawai</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" id="anak_1" class="form-control" placeholder="Anak 1" v-model="anak1" />
                                                <label for="anak_1">Anak 1</label>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" id="anak_2" class="form-control" placeholder="Anak 2" v-model="anak2" />
                                                <label for="anak_2">Anak 2</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Tombol Submit dan Cancel hanya satu kali di luar tab -->
                            <div class="pt-6 d-flex gap-3 justify-content-end">
                                    <button class="btn btn-primary me-2"
                                    @click="isEditMode ? submitUpdatedPegawai() : submitNewPegawai()">
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    class="btn btn-outline-secondary"
                                    data-bs-dismiss="modal"
                                    aria-label="Close">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps, defineEmits } from 'vue'
import vSelect from 'vue-select'
import Swal from 'sweetalert2'
import 'vue-select/dist/vue-select.css'

// Props - Nama disesuaikan dengan yang di-pass dari parent
const props = defineProps({
  isEditMode: Boolean,
  selectedPegawaiData: Object, 
  validationErrorsFromParent: Array, 
  jabatanOptions: Array,
  perusahaanOptions: Array,
  cabangOptions: Array,
  divisiOptions: Array,
  departemenOptions: Array,
});

// Emits
const emit = defineEmits(['save', 'close', 'company-selected', 'division-selected']);

// Refs untuk form state
const jabatan = ref(props.jabatanOptions || [])
const perusahaan = ref(props.perusahaanOptions || [])
const cabang = ref(props.cabangOptions || [])
const divisi = ref(props.divisiOptions || [])
const departemen = ref(props.departemenOptions || [])

const selectedJabatan = ref(null)
const selectedPerusahaan = ref(null)
const selectedCabang = ref(null)
const selectedDivisi = ref(null)
const selectedDepartemen = ref(null)
const selectedStatusPegawai = ref(null)
const selectedPendidikanPegawai = ref(null) 
const selectedJenisKelaminPegawai = ref(null)
const validationErrors = ref(props.validationErrorsFromParent || []);

const gajiPegawaiAngka = ref(0);
const gajiPegawaiFormatted = ref('');
const tunjanganPegawaiAngka = ref(0);
const tunjanganPegawaiFormatted = ref('');

const nmPegawai = ref('');
const email = ref('');
const fullName = ref('');
const tglLahirPegawai = ref('');
const tmpLahirPegawai = ref('');
const noTlpPegawai = ref('');
const alamatPegawai = ref('');
const noKtpPegawai = ref('');
const nikPegawai = ref('');
const npwpPegawai = ref('');
const tglMasukPegawai = ref('');
const tglKeluarPegawai = ref('');
const istriSuamiPegawai = ref('');
const anak1 = ref('');
const anak2 = ref('');
const userId = ref(''); 
const avatarFile = ref(null);
const avatarPreview = ref('');
const avatarFileName = ref('');

const BASE_URL = 'http://localhost:3333/';

let initialHistoryCabangId = null;
let initialHistoryDepartemenId = null;

// DEKLARASI FUNGSI DIPINDAHKAN KE ATAS SEBELUM WATCH
const fillFormWithData = (pegawai) => {
    nmPegawai.value           = pegawai.nm_pegawai || ''
    email.value               = pegawai.email || ''
    fullName.value            = pegawai.nm_pegawai || ''
    tglLahirPegawai.value     = pegawai.tgl_lahir_pegawai ? pegawai.tgl_lahir_pegawai.substring(0,10) : ''
    tmpLahirPegawai.value     = pegawai.tmp_lahir_pegawai || ''
    noTlpPegawai.value        = pegawai.no_tlp_pegawai || pegawai.noTlpPegawai || pegawai.telepon || pegawai.phone || ''
    alamatPegawai.value       = pegawai.alamat_pegawai || ''
    selectedPendidikanPegawai.value = pegawai.pendidikan_pegawai ?? null;
    selectedStatusPegawai.value = pegawai.status_pegawai ?? null
    noKtpPegawai.value        = pegawai.no_ktp_pegawai || ''
    nikPegawai.value          = pegawai.nik_pegawai || ''
    npwpPegawai.value         = pegawai.npwp_pegawai || ''
    selectedJenisKelaminPegawai.value = pegawai.jenis_kelamin_pegawai ?? null
    tglMasukPegawai.value     = pegawai.tgl_masuk_pegawai ? pegawai.tgl_masuk_pegawai.substring(0,10) : ''
    tglKeluarPegawai.value    = pegawai.tgl_keluar_pegawai ? pegawai.tgl_keluar_pegawai.substring(0,10) : ''
    istriSuamiPegawai.value   = pegawai.istri_suami_pegawai || ''
    anak1.value               = pegawai.anak_1 || ''
    anak2.value               = pegawai.anak_2 || ''
    userId.value              = pegawai.user_id || ''
    avatarFile.value          = null
    
    if (pegawai.avatar) {
        const avatarPathClean = pegawai.avatar.startsWith('/') ? pegawai.avatar.slice(1) : pegawai.avatar;
        const fullPath = pegawai.avatar.startsWith('http') ? pegawai.avatar : BASE_URL + avatarPathClean;
        avatarPreview.value = fullPath;
        const fileName = pegawai.avatar.split('/').pop();
        avatarFileName.value = fileName;
    } else {
        avatarPreview.value = '';
        avatarFileName.value = '';
    }

    if (pegawai.history) {
        selectedJabatan.value        = pegawai.history.jabatan?.id_jabatan ?? pegawai.history.jabatan?.id ?? null;
        selectedPerusahaan.value   = pegawai.history.perusahaan?.id ?? null;
        selectedDivisi.value       = pegawai.history.divisi?.id ?? null;
        
        initialHistoryCabangId = pegawai.history.cabang?.id ?? null;
        initialHistoryDepartemenId = pegawai.history.departemen?.id ?? null;

        gajiPegawaiAngka.value = pegawai.history.gaji_pegawai ? parseFloat(pegawai.history.gaji_pegawai) : 0;
        tunjanganPegawaiAngka.value = pegawai.history.tunjangan_pegawai ? parseFloat(pegawai.history.tunjangan_pegawai) : 0;

    } else {
        selectedJabatan.value        = null
        selectedPerusahaan.value   = null
        selectedDivisi.value       = null
        initialHistoryCabangId = null;
        initialHistoryDepartemenId = null;
        gajiPegawaiAngka.value = 0;
        tunjanganPegawaiAngka.value = 0;
    }
};

const resetModalForm = () => {
    nmPegawai.value = '';
    email.value = '';
    fullName.value = '';
    tglLahirPegawai.value = '';
    tmpLahirPegawai.value = '';
    noTlpPegawai.value = '';
    alamatPegawai.value = '';
    selectedPendidikanPegawai.value = null;
    selectedStatusPegawai.value = null;
    noKtpPegawai.value = '';
    nikPegawai.value = '';
    npwpPegawai.value = '';
    selectedJenisKelaminPegawai.value = null;
    tglMasukPegawai.value = '';
    tglKeluarPegawai.value = '';
    istriSuamiPegawai.value = '';
    anak1.value = '';
    anak2.value = '';
    userId.value = ''; // userId juga direset
    selectedJabatan.value = null;
    selectedPerusahaan.value = null;
    selectedCabang.value = null;
    selectedDivisi.value = null;
    selectedDepartemen.value = null;
    gajiPegawaiAngka.value = 0;
    tunjanganPegawaiAngka.value = 0;
    avatarFile.value = null;
    avatarPreview.value = '';
    avatarFileName.value = '';
    validationErrors.value = [];
    initialHistoryCabangId = null;
    initialHistoryDepartemenId = null;
};

// Watchers
watch(() => props.selectedPegawaiData, (newData) => {
  if (newData && Object.keys(newData).length > 0 && props.isEditMode) {
    fillFormWithData(newData);
  } else if (!props.isEditMode) {
    resetModalForm();
  }
}, { immediate: true });

watch(() => props.validationErrorsFromParent, (newErrors) => {
  validationErrors.value = newErrors || [];
});

watch(() => props.jabatanOptions, (newVal) => jabatan.value = newVal || [], { deep: true });
watch(() => props.perusahaanOptions, (newVal) => perusahaan.value = newVal || [], { deep: true });
watch(() => props.cabangOptions, (newCabangOptions) => {
  cabang.value = newCabangOptions || [];
  if (initialHistoryCabangId !== null && cabang.value.some(c => c.id === initialHistoryCabangId)) {
    selectedCabang.value = initialHistoryCabangId;
  }
  initialHistoryCabangId = null; 
}, { deep: true });
watch(() => props.divisiOptions, (newVal) => divisi.value = newVal || [], { deep: true });
watch(() => props.departemenOptions, (newDepartemenOptions) => {
  departemen.value = newDepartemenOptions || [];
  if (initialHistoryDepartemenId !== null && departemen.value.some(d => d.id === initialHistoryDepartemenId)) {
    selectedDepartemen.value = initialHistoryDepartemenId;
  }
  initialHistoryDepartemenId = null;
}, { deep: true });

watch(gajiPegawaiAngka, (newAngka) => {
    gajiPegawaiFormatted.value = formatRupiah(newAngka);
});
watch(tunjanganPegawaiAngka, (newAngka) => {
    tunjanganPegawaiFormatted.value = formatRupiah(newAngka);
});

// Fungsi submit dan lainnya
const submitPegawai = () => {
    const pegawaiData = {
        nm_pegawai: nmPegawai.value,
        email: email.value,
        full_name: fullName.value,
        tgl_lahir_pegawai: tglLahirPegawai.value,
        tmp_lahir_pegawai: tmpLahirPegawai.value,
        no_tlp_pegawai: noTlpPegawai.value,
        alamat_pegawai: alamatPegawai.value,
        pendidikan_pegawai: selectedPendidikanPegawai.value !== null ? Number(selectedPendidikanPegawai.value) : null,
        status_pegawai: selectedStatusPegawai.value !== null ? Number(selectedStatusPegawai.value) : null,
        no_ktp_pegawai: noKtpPegawai.value,
        nik_pegawai: nikPegawai.value,
        npwp_pegawai: npwpPegawai.value,
        jenis_kelamin_pegawai: selectedJenisKelaminPegawai.value !== null ? Number(selectedJenisKelaminPegawai.value) : null,
        tgl_masuk_pegawai: tglMasukPegawai.value,
        tgl_keluar_pegawai: tglKeluarPegawai.value || null,
        istri_suami_pegawai: istriSuamiPegawai.value,
        anak_1: anak1.value,
        anak_2: anak2.value,
        jabatan_id: selectedJabatan.value ? Number(selectedJabatan.value) : null,
        perusahaan_id: selectedPerusahaan.value ? Number(selectedPerusahaan.value) : null,
        cabang_id: selectedCabang.value ? Number(selectedCabang.value) : null,
        divisi_id: selectedDivisi.value ? Number(selectedDivisi.value) : null,
        departemen_id: selectedDepartemen.value ? Number(selectedDepartemen.value) : null,
        gaji_pegawai: gajiPegawaiAngka.value,
        tunjangan_pegawai: tunjanganPegawaiAngka.value,
        avatar: avatarFile.value,
    };

    if (pegawaiData.gaji_pegawai === undefined || pegawaiData.gaji_pegawai < 0) {
        Swal.fire('Error', 'Gaji pegawai wajib diisi dan tidak boleh negatif!', 'error');
        return;
    }

    emit('save', pegawaiData);
}

const handleSubmitClick = () => {
    submitPegawai();
}

const closeModal = () => {
  emit('close');
  // Tidak perlu reset form di sini karena watcher props.selectedPegawaiData akan handle saat isEditMode false
}

// Fungsi utilitas
function formatRupiah(angkaInput) {
    if (angkaInput === null || angkaInput === undefined) return ''; // Allow 0 to be formatted
    let number_string = String(angkaInput).replace(/[^0-9]/g, '');
    // if (number_string === '') return ''; // String kosong jadi 'Rp 0' jika angkaInput adalah 0

    if (number_string.length > 1 && number_string.startsWith('0')) {
        number_string = number_string.replace(/^0+/, '');
        if (number_string === '') number_string = '0';
    }
    if (number_string === '') number_string = '0'; // Jika input adalah string kosong atau non-numerik, default ke 0

    let split = number_string.split(',');
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    return 'Rp ' + rupiah; // Selalu tampilkan Rp, bahkan untuk Rp 0
}

function handleGajiInput(e) {
    gajiPegawaiAngka.value = getAngkaFromRupiah(e.target.value);
}

function handleTunjanganInput(e) {
    tunjanganPegawaiAngka.value = getAngkaFromRupiah(e.target.value);
}

function getAngkaFromRupiah(rupiahString) {
    if (rupiahString === null || rupiahString === undefined || String(rupiahString).trim() === '') return 0;
    const cleaned = String(rupiahString).replace(/[^0-9]/g, '');
    if (cleaned === '') return 0;
    return parseInt(cleaned, 10);
}

function onAvatarChange(e) {
  const file = e.target.files[0];
  avatarFile.value = file;
  if (file) {
    const objectURL = URL.createObjectURL(file);
    avatarPreview.value = objectURL;
    avatarFileName.value = file.name;
  } else {
    avatarPreview.value = '';
    avatarFileName.value = '';
  }
}

onMounted(() => {
    // Pengisian form awal sudah dihandle oleh watch props.selectedPegawaiData dengan immediate: true
});

// filteredDepartemen sekarang menggunakan props.departemenOptions
const filteredDepartemen = computed(() => {
    const localDepartemenList = Array.isArray(departemen.value) ? departemen.value : [];
    const currentDivisiId = selectedDivisi.value;
    const result = localDepartemenList.filter(dep => {
        return dep.divisiId === currentDivisiId;
    });
    return result;
});

// selectedDivisi di modal akan di-watch untuk me-reset selectedDepartemen jika divisi berubah
watch(selectedDivisi, (newDivisiId, oldDivisiId) => {
    selectedDepartemen.value = null; 
    if (newDivisiId !== oldDivisiId && newDivisiId !== undefined) { 
        emit('division-selected', newDivisiId);
    }
});

// filteredCabang sekarang menggunakan props.cabangOptions
const filteredCabang = computed(() => {
    const localCabangList = Array.isArray(cabang.value) ? cabang.value : [];
    const currentPerusahaanId = selectedPerusahaan.value;
    const result = localCabangList.filter(c => {
        return c.perusahaanId === currentPerusahaanId;
    });
    return result;
});

watch(selectedPerusahaan, (newPerusahaanId, oldPerusahaanId) => {
    selectedCabang.value = null; 
    if (newPerusahaanId !== oldPerusahaanId && newPerusahaanId !== undefined) { 
        emit('company-selected', newPerusahaanId);
    }
});

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