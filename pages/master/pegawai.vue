<template>
    <!-- Content wrapper -->
    <div class="content-wrapper">
         <!-- Content -->
 
         <div class="container-xxl flex-grow-1 container-p-y">
             <h4 class="mb-1">List Pegawai</h4>
             <p class="mb-6">
                List pegawai yang terdaftar di sistem
             </p>
             <!-- pegawai cards -->
             <div class="row g-6">
                 <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                            <p class="mb-0">Total 4 users</p>
                            <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                                <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Vinnie Mostowy"
                                class="avatar pull-up">
                                <img class="rounded-circle" src="/img/avatars/5.png" alt="Avatar" />
                                </li>
                                <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Allen Rieske"
                                class="avatar pull-up">
                                <img class="rounded-circle" src="/img/avatars/12.png" alt="Avatar" />
                                </li>
                                <li
                                data-bs-toggle="tooltip"
                                data-popup="tooltip-custom"
                                data-bs-placement="top"
                                title="Julee Rossignol"
                                class="avatar pull-up">
                                <img class="rounded-circle" src="/img/avatars/6.png" alt="Avatar" />
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
                                <h5 class="mb-1">Super Admin</h5>
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
                         <p class="mb-0">Total 7 users</p>
                         <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Jimmy Ressula"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/4.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="John Doe"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/1.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Kristi Lawker"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/2.png" alt="Avatar" />
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
                             <h5 class="mb-1">Admin</h5>
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
                         <p class="mb-0">Total 5 users</p>
                         <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Andrew Tye"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/6.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Rishi Swaat"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/9.png" alt="Avatar" />
                             </li>
                             <li
                             data-bs-toggle="tooltip"
                             data-popup="tooltip-custom"
                             data-bs-placement="top"
                             title="Rossie Kim"
                             class="avatar pull-up">
                             <img class="rounded-circle" src="/img/avatars/12.png" alt="Avatar" />
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
                             <h5 class="mb-1">Users</h5>
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
                             data-bs-target="#PegawaiModal"
                             data-bs-toggle="modal"
                             class="btn btn-sm btn-primary mb-4 text-nowrap add-new-pegawai"
                             @click="openAddPegawaiModal"
                             >
                             Tambah Pegawai
                             </button>
                         </div>
                         </div>
                     </div>
                     </div>
                 </div>
 
                 <div class="col-12">
                     <h4 class="mt-6 mb-1">Total Roles with their Pegawai</h4>
                     <p class="mb-0">Find all of your company's administrator accounts and their associate Pegawai.</p>
                 </div>
                 <div class="col-12">
                     <!-- pegawai Table -->
                     <div class="card">
                         <div class="card-datatable table-responsive py-5 px-3">
                             <table id="table-pegawai" class="datatables-basic table">
                             <thead>
                                 <tr>
                                 <th>#</th>
                                 <th>Name</th>
                                 <th>Email</th>
                                 <th>Date of Birth</th>
                                 <th>Place of Birth</th>
                                 <th>Address</th>
                                 <th>Status</th>
                                 <th>Actions</th>
                                 </tr>
                             </thead>
                             </table>
                         </div>
                     </div>
                     <!--/ pegawai Table -->
                 </div>
             </div>
             <!--/ pegawai cards -->
 
             <!-- Add pegawai Modal -->
             <div class="modal fade" id="PegawaiModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-body">
                            <div class="row">
                                <div class="text-center mb-6">
                                <h4 class="pegawai-title mb-2 pb-0">Tambah Pegawai baru</h4>
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
                                                            v-model="pendidikanPegawai"
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
                                                        :options="cabang"
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
                                                            v-model="gajiPegawaiFormatted"
                                                            @input="formatGajiPegawai"
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
                                                            v-model="tunjanganPegawaiFormatted"
                                                            @input="formatTunjanganPegawai"
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
             <!--/ Add pegawai Modal -->
         </div>
         <!-- / Content -->
 
         <div class="content-backdrop fade"></div>
     </div>
     <!-- Content wrapper -->
 </template>
 
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { usePegawaiStore } from '~/stores/pegawai'
import vSelect from 'vue-select'
import Swal from 'sweetalert2'
import 'vue-select/dist/vue-select.css'

const { $api } = useNuxtApp()

const pegawai             = ref([])
const selectedPegawai     = ref(null)

// State untuk menu groups dan details
const jabatan = ref([])
const perusahaan = ref([])
const cabang = ref([])
const divisi = ref([])
const departemen = ref([])
const selectedJabatan = ref(null)
const selectedPerusahaan = ref(null)
const selectedCabang = ref(null)
const selectedDivisi = ref(null)
const selectedDepartemen = ref(null)
const selectedStatusPegawai = ref(null)
const selectedPendidikanPegawai = ref(null)
const selectedJenisKelaminPegawai = ref(null)
const validationErrors = ref([]);

const pegawaiStore = usePegawaiStore()
const jabatanStore = useJabatanStore()
const divisiStore = useDivisiStore()
const departemenStore = useDepartemenStore()
const perusahaanStore = usePerusahaanStore()
const cabangStore = useCabangStore()

const gajiPegawaiFormatted = ref('');
const tunjanganPegawaiFormatted = ref('');

const nmPegawai = ref('');
const email = ref('');
const fullName = ref('');
const tglLahirPegawai = ref('');
const tmpLahirPegawai = ref('');
const noTlpPegawai = ref('');
const alamatPegawai = ref('');
const pendidikanPegawai = ref('');
const statusPegawai = ref('');
const noKtpPegawai = ref('');
const nikPegawai = ref('');
const npwpPegawai = ref('');
const jenisKelaminPegawai = ref('');
const tglMasukPegawai = ref('');
const tglKeluarPegawai = ref('');
const istriSuamiPegawai = ref('');
const anak1 = ref('');
const anak2 = ref('');
const userId = ref('');
const avatarFile = ref(null);
const avatarPreview = ref('');
const avatarFileName = ref('');
const isEditMode = ref(false);

// Ganti sesuai base URL backend Anda
const BASE_URL = 'http://localhost:3333/';

// Fungsi untuk mengambil data menu groups
const fetchJabatan = async () => {
try {
    const token = localStorage.getItem('token')
    const response = await fetch($api.jabatan(), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    
    if (!response.ok) throw new Error('Gagal mengambil data jabatan')
    
    const data = await response.json()
    jabatan.value = data.data || data
} catch (error) {
    console.error('Error fetching jabatan:', error)
}
}

const fetchPerusahaan = async () => {
try {
    const token = localStorage.getItem('token')
    const response = await fetch($api.perusahaan(), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    
    if (!response.ok) throw new Error('Gagal mengambil data perusahaan')
    
    const data = await response.json()
    perusahaan.value = data.data || data
} catch (error) {
    console.error('Error fetching perusahaan:', error)
}
}

// Fungsi untuk mengambil data menu details berdasarkan group
const fetchCabang = async (perusahaanId) => {
if (!perusahaanId) return;
try {
    const token = localStorage.getItem('token');
    const response = await fetch($api.cabang(perusahaanId), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Gagal mengambil data cabang');
    const data = await response.json();
    cabang.value = Array.isArray(data) ? data : [];
} catch (error) {
    console.error('Error fetching cabang:', error);
}
};

const fetchDivisi = async () => {
try {
    const token = localStorage.getItem('token')
    const response = await fetch($api.divisi(), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    
    if (!response.ok) throw new Error('Gagal mengambil data divisi')
    
    const data = await response.json()
    divisi.value = data.data || data
} catch (error) {
    console.error('Error fetching divisi:', error)
}
}

// Fungsi untuk mengambil data menu details berdasarkan group
const fetchDepartemen = async (divisiId) => {
if (!divisiId) return;
try {
    const token = localStorage.getItem('token');
    const response = await fetch($api.departemen(divisiId), {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Gagal mengambil data departemen');
    const data = await response.json();
    departemen.value = Array.isArray(data) ? data : [];
} catch (error) {
    console.error('Error fetching departemen:', error);
}
};

// Di bagian onMounted
onMounted(async () => {
try {
    await fetchJabatan()
    await fetchDivisi()
    await fetchDepartemen()
    await fetchPerusahaan()
    await fetchCabang()

    // Inisialisasi DataTable
    $('#table-pegawai').DataTable({
        serverSide: true,
        processing: true,
        responsive: true,
        autoWidth: true,
        order: [[0, 'desc']],
        ajax: {
            url: $api.pegawai(),
            type: 'GET',
            dataSrc: function(json) {
                return json.data || json
            },
            beforeSend: function (xhr) {
                const token = localStorage.getItem('token')
                if (token) {
                    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
                }
            },
            xhrFields: {
                withCredentials: true
            },
            cache: false
        },
        columns: [
            { data: null, render: (data, type, row, meta) => meta.row + 1 + '.' },
            { data: 'nm_pegawai', defaultContent: '-' },
            { data: 'email', defaultContent: '-' },
            { 
                data: 'tgl_lahir_pegawai', 
                defaultContent: '-', 
                render: function(data, type, row) {
                    if (!data) return '-';
                    const dateObj = new Date(data);
                    if (isNaN(dateObj)) return '-';
                    // Format: DD-MM-YYYY
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    return `${day}-${month}-${year}`;
                }
            },
            { data: 'tmp_lahir_pegawai', defaultContent: '-' },
            { data: 'alamat_pegawai', defaultContent: '-' },
            { 
                data: 'status_pegawai', 
                defaultContent: '-', 
                render: function(data, type, row) {
                    if (data === 1) return '<span class="badge rounded-pill bg-label-primary">PKWTT</span>';
                    if (data === 2) return '<span class="badge rounded-pill bg-label-secondary">PKWT</span>';
                    if (data === 3) return '<span class="badge rounded-pill bg-label-warning text-dark">Outsource</span>';
                    if (data === 4) return '<span class="badge rounded-pill bg-label-warning text-danger">Resign</span>';
                    if (data === 5) return '<span class="badge rounded-pill bg-label-dark">Tidak diketahui</span>';
                    return '-';
                }
            },
            { 
                data: null, 
                render: function(data, type, row) {
                    return `
                        <div class="d-flex align-items-center">
                            <span class="text-nowrap">
                                <button 
                                    class="btn btn-icon btn-text-secondary rounded-pill edit-pegawai-btn" 
                                    data-id="${row.id_pegawai || row.idPegawai || row.id}" 
                                    aria-label="Edit Pegawai"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Edit Pegawai"
                                >
                                    <i class="icon-base ri ri-edit-box-line icon-20px"></i>
                                </button>
                                <button
                                class="btn btn-sm btn-icon btn-text-secondary rounded-pill delete-record text-body waves-effect me-1" data-id="${row.id_pegawai || row.idPegawai || row.id}"
                                aria-label="Delete Pegawai"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Delete Pegawai"
                                >
                                    <i class="icon-base ri ri-delete-bin-7-line icon-20px"></i>
                                </button>
                            </span>
                        </div>
                    `
                }
            }
        ]
    })

    // Event handlers untuk tombol edit dan delete
    $('#table-pegawai tbody').off('click', '.edit-pegawai-btn').on('click', '.edit-pegawai-btn', async function () {
        const pegawaiId = $(this).data('id')
        try {
            const response = await fetch($api.pegawai(pegawaiId), {
                headers: { 
                    Authorization: `Bearer ${localStorage.getItem('token')}` 
                }
            })
            
            if (!response.ok) {
                throw new Error('Gagal mengambil data pegawai')
            }
            
            const pegawaiData = await response.json()
            const pegawaiRaw = pegawaiData.data || pegawaiData
            const pegawaiObj = Array.isArray(pegawaiRaw)
            ? pegawaiRaw.find(p => p.id_pegawai == pegawaiId || p.idPegawai == pegawaiId)
            : pegawaiRaw;
            await openEditPegawaiModal(pegawaiObj)
        } catch (error) {
            alert('Gagal memuat data pegawai: ' + error.message)
        }
    })

    $('#table-pegawai tbody').off('click', '.delete-record').on('click', '.delete-record', async function (e) {
        e.preventDefault()
        e.stopPropagation()
        const pegawaiId = $(this).data('id')
        await deletePegawai(pegawaiId)
    })

} catch (error) {
    console.error('Error:', error)
}
})

function openAddPegawaiModal() {
isEditMode.value = false;
selectedJabatan.value = null;
document.getElementById('modalPegawaiName').value = '';
selectedPegawai.value = [];
if (window.pegawaiModal) {
    window.pegawaiModal.show();
} else {
    const modalEl = document.getElementById('PegawaiModal');
    window.pegawaiModal = new bootstrap.Modal(modalEl);
    window.pegawaiModal.show();
}
// Bersihkan backdrop jika ada setelah modal ditutup
const modalEl = document.getElementById('PegawaiModal');
if (modalEl) {
    modalEl.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
        document.body.style.overflow = '';
    }, { once: true });
}
}

async function openEditPegawaiModal(pegawai) {
    isEditMode.value = true;
    // Deklarasikan fullPath di sini agar scope-nya luas
    let fullPath = '';
    try {
        if (!pegawai || !pegawai.id_pegawai) {
            throw new Error('pegawai tidak valid');
        }
        selectedPegawai.value = pegawai;
        selectedJabatan.value = pegawai.history?.jabatan?.id || null;
        const modalEl = document.getElementById('PegawaiModal');
        if (!window.pegawaiModal) {
            window.pegawaiModal = new bootstrap.Modal(modalEl);
        }
        window.pegawaiModal.show();
        if (modalEl) {
            modalEl.addEventListener('hidden.bs.modal', () => {
                document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                document.body.style.overflow = '';
            }, { once: true });
        }
        // Isi semua field form dengan data pegawai (ini sudah benar)
        nmPegawai.value           = pegawai.nm_pegawai || ''
        email.value               = pegawai.email || ''
        fullName.value            = pegawai.nm_pegawai || ''
        tglLahirPegawai.value     = pegawai.tgl_lahir_pegawai ? pegawai.tgl_lahir_pegawai.substring(0,10) : ''
        tmpLahirPegawai.value     = pegawai.tmp_lahir_pegawai || ''
        noTlpPegawai.value        = pegawai.no_tlp_pegawai || pegawai.noTlpPegawai || pegawai.telepon || pegawai.phone || ''
        alamatPegawai.value       = pegawai.alamat_pegawai || ''
        pendidikanPegawai.value   = pegawai.pendidikan_pegawai || ''
        selectedStatusPegawai.value = pegawai.status_pegawai || null
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
        // --- Bagian Penting untuk Preview Avatar yang sudah ada ---
        if (pegawai.avatar) {
            // Kita sudah mendefinisikan fullPath di atas, jadi ini akan mengisi nilainya
            const avatarPathClean = pegawai.avatar.startsWith('/') ? pegawai.avatar.slice(1) : pegawai.avatar;
            fullPath = pegawai.avatar.startsWith('http') ? pegawai.avatar : BASE_URL + avatarPathClean;
            // Set avatarPreview
            avatarPreview.value = fullPath;
            // Ekstrak nama file untuk tampilan
            const fileName = pegawai.avatar.split('/').pop();
            avatarFileName.value = fileName;
        } else {
            // Jika tidak ada avatar, kosongkan semua nilai terkait avatar
            avatarPreview.value = '';
            avatarFileName.value = '';
        }
        // --- Akhir Bagian Penting ---
        // Untuk relasi history (ini sudah benar)
        if (pegawai.history) {
            selectedJabatan.value        = pegawai.history.jabatan?.id || null
            selectedPerusahaan.value   = pegawai.history.perusahaan?.id || null
            selectedCabang.value       = pegawai.history.cabang?.id || null
            selectedDivisi.value       = pegawai.history.divisi?.id || null
            selectedDepartemen.value   = pegawai.history.departemen?.id || null
            gajiPegawaiFormatted.value = pegawai.history.gaji_pegawai ? formatRupiah(pegawai.history.gaji_pegawai.toString()) : ''
            tunjanganPegawaiFormatted.value = pegawai.history.tunjangan_pegawai ? formatRupiah(pegawai.history.tunjangan_pegawai.toString()) : ''
        } else {
            selectedJabatan.value        = null
            selectedPerusahaan.value   = null
            selectedCabang.value       = null
            selectedDivisi.value       = null
            selectedDepartemen.value   = null
            gajiPegawaiFormatted.value = ''
            tunjanganPegawaiFormatted.value = ''
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function submitNewPegawai() {
    try {
        // Ambil semua value dari input/ref
        const formData = new FormData();
        formData.append('nm_pegawai', nmPegawai.value);
        formData.append('email', email.value);
        formData.append('full_name', fullName.value);
        formData.append('tgl_lahir_pegawai', tglLahirPegawai.value);
        formData.append('tmp_lahir_pegawai', tmpLahirPegawai.value);
        formData.append('no_tlp_pegawai', noTlpPegawai.value);
        formData.append('alamat_pegawai', alamatPegawai.value);
        formData.append('pendidikan_pegawai', Number(selectedPendidikanPegawai.value));
        formData.append('status_pegawai', Number(selectedStatusPegawai.value));
        formData.append('no_ktp_pegawai', noKtpPegawai.value);
        formData.append('nik_pegawai', nikPegawai.value);
        formData.append('npwp_pegawai', npwpPegawai.value);
        formData.append('jenis_kelamin_pegawai', Number(selectedJenisKelaminPegawai.value));
        formData.append('tgl_masuk_pegawai', tglMasukPegawai.value);
        formData.append('tgl_keluar_pegawai', tglKeluarPegawai.value);
        formData.append('istri_suami_pegawai', istriSuamiPegawai.value);
        formData.append('anak_1', anak1.value);
        formData.append('anak_2', anak2.value);

        // Data history
        formData.append('jabatan_id', Number(selectedJabatan.value));
        formData.append('perusahaan_id', Number(selectedPerusahaan.value));
        formData.append('cabang_id', Number(selectedCabang.value));
        formData.append('divisi_id', Number(selectedDivisi.value));
        formData.append('departemen_id', Number(selectedDepartemen.value));
        console.log('gajiPegawaiFormatted:', gajiPegawaiFormatted.value);
        console.log('gaji_pegawai (number):', Number(getAngkaFromRupiah(gajiPegawaiFormatted.value)));
        const gajiValue = Number(getAngkaFromRupiah(gajiPegawaiFormatted.value));
        if (!gajiPegawaiFormatted.value || isNaN(gajiValue) || gajiValue <= 0) {
            alert('Gaji pegawai wajib diisi dan harus lebih dari 0!');
            return;
        }
        formData.append('gaji_pegawai', gajiValue);
        formData.append('tunjangan_pegawai', Number(getAngkaFromRupiah(tunjanganPegawaiFormatted.value)));

        // Jika ada file avatar
        if (avatarFile.value) formData.append('avatar', avatarFile.value);

        // CSRF token
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;

        const token = localStorage.getItem('token');

        console.log('selectedStatusPegawai:', selectedStatusPegawai.value);

        const response = await fetch($api.pegawai(), {
            method: 'POST',
            headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken || ''
            // Jangan set Content-Type, biarkan browser yang set!
            },
            credentials: 'include',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            $('#table-pegawai').DataTable().ajax.reload(null, false);

            // Reset selectedJabatan and selectedPegawai after update
            selectedDivisi.value = null;
            selectedDepartemen.value = null;
            // Optionally clear the modal input
            const modalPegawaiName = document.getElementById('modalPegawaiName');
            if (modalPegawaiName) modalPegawaiName.value = '';

            // Refresh pegawaiStore data
            pegawaiStore.fetchPegawai();

            // Tutup modal dengan benar
            const modalEl = document.getElementById('PegawaiModal');
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal.hide();

                // Bersihkan backdrop setelah modal tertutup
                modalEl.addEventListener('hidden.bs.modal', () => {
                    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                    document.body.style.overflow = '';
                }, { once: true });
            }
            await Swal.fire({
                title: 'Berhasil!',
                text: 'Pegawai berhasil dibuat.',
                icon: 'success'
            });
        } else {
            const errorData = await response.json();
            if (errorData.errors) {
            validationErrors.value = Array.isArray(errorData.errors)
                ? errorData.errors
                : Object.values(errorData.errors).flat();
            } else {
            alert(errorData.message || 'Gagal membuat pegawai');
            }
        }
    } catch (error) {
        console.error('Create error:', error);
        alert(error.message);
    }
}

const submitUpdatedPegawai = async () => {
    console.log('>>> SUBMIT FORM DIPANGGIL');
    console.log('Isi selectedPegawai.value saat submit dipanggil:', selectedPegawai.value);
    try {
        // Dapatkan ID pegawai dari data yang sedang diedit
        const pegawaiIdToUpdate = selectedPegawai.value?.id_pegawai || selectedPegawai.value?.idPegawai || selectedPegawai.value?.id;
        
        if (!pegawaiIdToUpdate) {
            console.error('ID pegawai tidak ditemukan saat update.');
            throw new Error('Pegawai yang dipilih tidak memiliki ID. Tidak dapat memperbarui.');
        }

        console.log('ID pegawai yang akan diupdate:', pegawaiIdToUpdate);

        const csrfResponse = await fetch($api.csrfToken(), {
            credentials: 'include'
        });

        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token = localStorage.getItem('token');
        const url = $api.pegawaiUpdate(pegawaiIdToUpdate);
        console.log('URL yang akan dituju:', url);

        const formData = new FormData();
        formData.append('nm_pegawai', nmPegawai.value);
        formData.append('email', email.value);
        formData.append('full_name', fullName.value);
        formData.append('tgl_lahir_pegawai', tglLahirPegawai.value);
        formData.append('tmp_lahir_pegawai', tmpLahirPegawai.value);
        formData.append('no_tlp_pegawai', noTlpPegawai.value);
        formData.append('alamat_pegawai', alamatPegawai.value);
        formData.append('pendidikan_pegawai', Number(pendidikanPegawai.value));
        formData.append('status_pegawai', Number(selectedStatusPegawai.value));
        formData.append('no_ktp_pegawai', noKtpPegawai.value);
        formData.append('nik_pegawai', nikPegawai.value);
        formData.append('npwp_pegawai', npwpPegawai.value);
        formData.append('jenis_kelamin_pegawai', Number(selectedJenisKelaminPegawai.value));
        formData.append('tgl_masuk_pegawai', tglMasukPegawai.value);
        formData.append('tgl_keluar_pegawai', tglKeluarPegawai.value);
        formData.append('istri_suami_pegawai', istriSuamiPegawai.value);
        formData.append('anak_1', anak1.value);
        formData.append('anak_2', anak2.value);

        // Data history
        formData.append('jabatan_id', Number(selectedJabatan.value));
        formData.append('perusahaan_id', Number(selectedPerusahaan.value));
        formData.append('cabang_id', Number(selectedCabang.value));
        formData.append('divisi_id', Number(selectedDivisi.value));
        formData.append('departemen_id', Number(selectedDepartemen.value));
        
        const gajiValue = Number(getAngkaFromRupiah(gajiPegawaiFormatted.value));
        if (!gajiPegawaiFormatted.value || isNaN(gajiValue) || gajiValue <= 0) {
            alert('Gaji pegawai wajib diisi dan harus lebih dari 0!');
            return;
        }
        formData.append('gaji_pegawai', gajiValue);
        
        const tunjanganValue = Number(getAngkaFromRupiah(tunjanganPegawaiFormatted.value));
        formData.append('tunjangan_pegawai', isNaN(tunjanganValue) ? 0 : tunjanganValue);

        // Jika ada file avatar
        if (avatarFile.value) formData.append('avatar', avatarFile.value);

        console.log('URL final:', url);
        console.log('Method:', 'PUT');

        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-CSRF-TOKEN': csrfToken || ''
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            $('#table-pegawai').DataTable().ajax.reload(null, false);

            // Reset form setelah update
            resetForm();

            // Tutup modal dengan benar
            const modalEl = document.getElementById('PegawaiModal');
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();

                // Bersihkan backdrop setelah modal tertutup
                modalEl.addEventListener('hidden.bs.modal', () => {
                    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                    document.body.style.overflow = '';
                }, { once: true });
            }

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Data pegawai berhasil diperbarui.',
                icon: 'success'
            });
        } else {
            const errorData = await response.json();
            if (errorData.errors) {
                // Tampilkan error validasi
                validationErrors.value = Object.values(errorData.errors).flat();
            } else {
                alert(errorData.message || 'Gagal memperbarui pegawai');
            }  
        }

    } catch (error) {
        console.error('Update error (frontend catch):', error);
        await Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error'
        });
    }
};

// Fungsi untuk reset form
const resetForm = () => {
nmPegawai.value = '';
email.value = '';
fullName.value = '';
tglLahirPegawai.value = '';
tmpLahirPegawai.value = '';
noTlpPegawai.value = '';
alamatPegawai.value = '';
pendidikanPegawai.value = '';
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
selectedJabatan.value = null;
selectedPerusahaan.value = null;
selectedCabang.value = null;
selectedDivisi.value = null;
selectedDepartemen.value = null;
gajiPegawaiFormatted.value = '';
tunjanganPegawaiFormatted.value = '';
avatarFile.value = null;
avatarPreview.value = '';
validationErrors.value = [];
isEditMode.value = false;
};

const deletePegawai= async (pegawaiId) => {
if (!pegawaiId) return;

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
        // Validasi ID role yang akan dihapus
        if (!pegawaiId) {
            console.error('ID pegawai tidak ditemukan untuk proses hapus.');
            throw new Error('Pegawaiyang dipilih tidak memiliki ID. Tidak dapat menghapus.');
        }

        // Ambil token dari localStorage
        const token = localStorage.getItem('token');

        // Ambil CSRF token
        const csrfResponse = await fetch($api.csrfToken(), {
            credentials: 'include'
        });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;

        // Endpoint hapus role
        const url = $api.pegawaiDelete(pegawaiId);
        console.log('URL hapus pegawai:', url);

        // Request hapus role
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-CSRF-TOKEN': csrfToken
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal menghapus role');
        }

        // Reload tabel
        $('#table-pegawai').DataTable().ajax.reload(null, false);

        await Swal.fire({
            title: 'Berhasil!',
            text: 'Pegawai berhasil dihapus.',
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

const filteredDepartemen = computed(() => {
    return Array.isArray(departemen.value)
    ? departemen.value.filter(departemen => departemen.divisiId === selectedDivisi.value)
    : [];
});

watch(selectedDivisi, (val) => {
    if (val) fetchDepartemen(val)
})

const filteredCabang = computed(() => {
    return Array.isArray(cabang.value)
    ? cabang.value.filter(cabang => cabang.perusahaanId === selectedPerusahaan.value)
    : [];
});

watch(selectedPerusahaan, (val) => {
    if (val) fetchCabang(val)
})

function formatRupiah(angka) {
    // Hilangkan semua karakter selain angka
    let number_string = angka.replace(/[^,\d]/g, '').toString();
    let split = number_string.split(',');
    let sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    // Tambahkan titik jika ada ribuan
    if (ribuan) {
    let separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
    return rupiah ? 'Rp ' + rupiah : '';
}

function formatGajiPegawai(e) {
    gajiPegawaiFormatted.value = formatRupiah(e.target.value);
}

function formatTunjanganPegawai(e) {
    tunjanganPegawaiFormatted.value = formatRupiah(e.target.value);
}

function getAngkaFromRupiah(rupiahString) {
    return parseInt(rupiahString.replace(/[^0-9]/g, ''), 10) || 0;
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