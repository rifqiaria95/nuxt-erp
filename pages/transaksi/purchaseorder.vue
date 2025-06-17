<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Purchase Order</h4>
            <p class="mb-6">
            List purchaseOrder yang terdaftar di sistem
            </p>
            <!-- purchaseOrder cards -->
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
                            alt="attachment"
                            width="68" />
                        </div>
                        </div>
                        <div class="col-7">
                        <div class="card-body text-sm-end text-center ps-sm-0">
                            <button
                            data-bs-target="#Modal"
                            data-bs-toggle="modal"
                            class="btn btn-sm btn-primary mb-4 ml-5 textwrap add-new-pegawai"
                            @click="openAddPurchaseOrderModal"
                            >
                            Tambah Purchase Order
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Purchase Order</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Purchase Order.</p>
                </div>
                <div class="col-12">
                    <!-- purchaseOrder Table -->
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
                            <div class="d-flex align-items-center me-3 mb-2 mb-md-0">
                                <span class="me-2">Baris:</span>
                                <Dropdown v-model="lazyParams.rows" :options="rowsPerPageOptionsArray" @change="handleRowsChange" placeholder="Jumlah" style="width: 8rem;" />
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
                                            placeholder="Cari purchaseOrder..."
                                            class="w-full md:w-20rem"
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                        <MyDataTable 
                            ref="myDataTableRef"
                            :data="purchaseOrder" 
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
                                <Column header="#" :sortable="false">
                                    <template #body="slotProps">
                                        {{
                                            Number.isFinite(lazyParams.page) && Number.isFinite(lazyParams.rows)
                                            ? ((lazyParams.page - 1) * lazyParams.rows + slotProps.index + 1)
                                            : (slotProps.index + 1)
                                        }}
                                    </template>
                                </Column>
                                <Column field="noPo" header="No. PO" :sortable="true"></Column>
                                <Column field="vendor.name" header="Nama Vendor" :sortable="true"></Column>
                                <Column field="status" header="Status PO" :sortable="true">
                                    <template #body="slotProps">
                                        <span :class="getStatusBadge(slotProps.data.status).class">
                                            {{ getStatusBadge(slotProps.data.status).text }}
                                        </span>
                                    </template>
                                </Column>
                                <Column field="up" header="Untuk Perhatian" :sortable="true"></Column>
                                <Column field="date" header="Tanggal PO" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.date ? new Date(slotProps.data.date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                    </template>
                                </Column>
                                <Column field="dueDate" header="Jatuh Tempo" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.dueDate ? new Date(slotProps.data.dueDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-' }}
                                    </template>
                                </Column>
                                <Column field="perusahaan.nmPerusahaan" header="Perusahaan" :sortable="true"></Column>
                                <Column field="cabang.nmCabang" header="Cabang" :sortable="true"></Column>
                                <Column field="attachment" header="Nama File" :sortable="true">
                                    <template #body="slotProps">
                                        <div v-if="slotProps.data.attachment">
                                            <span>
                                                <a
                                                    v-if="typeof slotProps.data.attachment === 'string'"
                                                    :href="slotProps.data.attachment"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style="text-decoration: underline; color: #007bff;"
                                                >
                                                    {{ slotProps.data.attachment.split('/').pop() }}
                                                </a>
                                                <span v-else>
                                                    {{ slotProps.data.attachment.name }}
                                                </span>
                                            </span>
                                        </div>
                                        <div v-else>
                                            <span class="text-muted">Tidak ada file</span>
                                        </div>
                                    </template>
                                </Column>
                                <Column header="Actions" :exportable="false" style="min-width:8rem">
                                    <template #body="slotProps">
                                        <div class="d-inline-block">
                                            <a href="javascript:;" class="btn btn-sm btn-text-secondary rounded-pill btn-icon dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="ri-more-2-fill"></i>
                                            </a>
                                            <ul class="dropdown-menu">
                                                <li>
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="viewPurchaseOrderDetails(slotProps.data.id)">
                                                        <i class="ri-eye-line me-2"></i> Lihat Detail
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="javascript:void(0)" @click="openEditPurchaseOrderModal(slotProps.data)">
                                                        <i class="ri-edit-box-line me-2"></i> Edit
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item text-danger" href="javascript:void(0)" @click="deletePurchaseOrder(slotProps.data.id)">
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
                    <!--/ purchaseOrder Table -->
                </div>
            </div>
            <!--/ purchaseOrder cards -->

            <!-- Placeholder untuk MenuModal component -->
            <Modal 
                :isEditMode="isEditMode"
                :validationErrorsFromParent="validationErrors"
                :title="modalTitle" 
                :description="modalDescription"
                :selectedPurchaseOrder="selectedPurchaseOrder"
            >
                <template #default>
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
                                        <span class="d-none d-sm-block">Informasi Purchase Order</span>
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
                                        <span class="d-none d-sm-block">List Product</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <form @submit.prevent="handleSubmit">
                        <div class="tab-content">
                            <!-- Tab Personal Info -->
                            <div class="tab-pane fade active show" id="form-tabs-personal" role="tabpanel">
                                <div class="row g-6">
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                id="noPoPurchaseOrder" 
                                                v-model="formPurchaseOrder.noPo" 
                                                placeholder="Masukkan no po purchaseOrder"
                                                required
                                            >
                                            <label for="noPoPurchaseOrder">No Purchase Order</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="formPurchaseOrder.vendorId"
                                                :options="vendor"
                                                label="name"
                                                :reduce="vendor => vendor.id"
                                                placeholder="-- Pilih Vendor --"
                                                id="vendor"
                                                class="vendor"
                                            />
                                            <div v-if="!vendor || vendor.length === 0" class="text-danger mt-1">
                                                Data vendor belum tersedia.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="text" 
                                                class="form-control" 
                                                id="upPurchaseOrder" 
                                                v-model="formPurchaseOrder.up" 
                                                placeholder="Masukkan up purchaseOrder"
                                                required
                                            >
                                            <label for="upPurchaseOrder">Untuk Perhatian</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                            type="date" 
                                            class="form-control" 
                                            id="datePurchaseOrder" 
                                            v-model="formPurchaseOrder.date" 
                                            placeholder="Masukkan tanggal purchaseOrder"
                                            required
                                            >
                                            <label for="datePurchaseOrder">Tanggal PO</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                            type="date" 
                                            class="form-control" 
                                            id="dueDatePurchaseOrder" 
                                            v-model="formPurchaseOrder.dueDate" 
                                            placeholder="Masukkan tanggal due date"
                                            required
                                            >
                                            <label for="dueDatePurchaseOrder">Jatuh Tempo</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="formPurchaseOrder.perusahaanId"
                                                :options="perusahaan"
                                                label="nmPerusahaan"
                                                :reduce="perusahaan => perusahaan.id"
                                                placeholder="-- Pilih Perusahaan --"
                                                id="perusahaan"
                                                class="perusahaan"
                                            />
                                            <div v-if="!perusahaan || perusahaan.length === 0" class="text-danger mt-1">
                                                Data perusahaan belum tersedia.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="formPurchaseOrder.cabangId"
                                                :options="cabang"
                                                label="nmCabang"
                                                :reduce="cabang => cabang.id"
                                                placeholder="-- Pilih Cabang --"
                                                id="cabang"
                                                class="cabang"
                                            />
                                            <div v-if="!cabang || cabang.length === 0" class="text-danger mt-1">
                                                Data cabang belum tersedia.
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="number" 
                                                class="form-control" 
                                                id="discountPurchaseOrder" 
                                                v-model="formPurchaseOrder.discountPercent" 
                                                placeholder="Masukkan discount purchaseOrder"
                                            >
                                            <label for="discountPurchaseOrder">Discount</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="number" 
                                                class="form-control" 
                                                id="taxPurchaseOrder" 
                                                v-model="formPurchaseOrder.taxPercent" 
                                                placeholder="Masukkan tax purchaseOrder"
                                            >
                                            <label for="taxPurchaseOrder">Tax</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <v-select
                                                v-model="formPurchaseOrder.status"
                                                :options="status"
                                                label="label"
                                                :reduce="status => status.value"
                                                placeholder="-- Pilih Status --"
                                                id="status"
                                                class="status"
                                                :disabled="!isEditMode"
                                            />   
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="file" 
                                                class="form-control" 
                                                id="attachmentPurchaseOrder" 
                                                @change="onFileChange"
                                                placeholder="Masukkan attachment purchaseOrder"
                                                :required="!isEditMode"
                                            >
                                            <label for="attachmentPurchaseOrder">Attachment</label>
                                        </div>
                                    </div>
                                     <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <textarea
                                                class="form-control h-px-100"
                                                id="descriptionPurchaseOrder"
                                                placeholder="Deskripsi Purchase Order"
                                                v-model="formPurchaseOrder.description">
                                            </textarea>
                                            <label for="descriptionPurchaseOrder">Deskripsi Purchase Order</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- Tab Account Details -->
                            <div class="tab-pane fade" id="form-tabs-perusahaan" role="tabpanel">
                                <div class="row g-6">
                                    <div v-for="(item, index) in formPurchaseOrder.purchaseOrderItems" :key="index" class="repeater-item">
                                        <div class="row">
                                            <div class="mb-6 col-lg-6 col-xl-6 col-12 mb-0">
                                                <div class="form-floating form-floating-outline">
                                                    <v-select
                                                        v-model="item.productId"
                                                        :options="products"
                                                        :get-option-label="product => `${product.name} (${product.unit?.name || 'N/A'})`"
                                                        :reduce="product => product.id"
                                                        placeholder="-- Pilih Produk --"
                                                        :id="`product-${index}`"
                                                        class="product-select"
                                                        @update:modelValue="onProductChange(index)"
                                                    />
                                                    <div v-if="!products || products.length === 0" class="text-danger mt-1">
                                                        Data produk belum tersedia.
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="mb-6 col-lg-6 col-xl-3 col-12 mb-0">
                                                <div class="form-floating form-floating-outline">
                                                    <input
                                                        type="number"
                                                        :id="`quantity-${index}`"
                                                        class="form-control"
                                                        placeholder="Jumlah"
                                                        v-model.number="item.quantity"
                                                        @input="onQuantityChange(index)" />
                                                    <label :for="`quantity-${index}`">Jumlah</label>
                                                </div>
                                            </div>
                                            <div class="mb-6 col-lg-6 col-xl-3 col-12 mb-0">
                                                <div class="form-floating form-floating-outline">
                                                    <input
                                                        type="text"
                                                        :id="`price-${index}`"
                                                        class="form-control"
                                                        placeholder="Harga"
                                                        v-model="item.price"
                                                        readonly
                                                    />
                                                    <label :for="`price-${index}`">Harga</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="mb-6 col-lg-6 col-xl-6 col-12 mb-0">
                                                <div class="form-floating form-floating-outline">
                                                    <input
                                                        type="text"
                                                        :id="`description-${index}`"
                                                        class="form-control"
                                                        placeholder="Deskripsi"
                                                        v-model="item.description" />
                                                    <label :for="`description-${index}`">Deskripsi</label>
                                                </div>
                                            </div>
                                            <div class="mb-6 col-lg-6 col-xl-3 col-12 mb-0">
                                                <div class="form-floating form-floating-outline">
                                                    <input
                                                        type="text"
                                                        :id="`subtotal-${index}`"
                                                        class="form-control"
                                                        placeholder="Subtotal"
                                                        v-model="item.subtotal"
                                                        readonly />
                                                    <label :for="`subtotal-${index}`">Subtotal</label>
                                                </div>
                                            </div>
                                            <div class="mb-6 col-lg-2 col-xl-3 col-2 d-flex align-items-center mb-0">
                                                <button type="button" class="btn btn-secondary" @click.prevent="removeItem(index)" style="width: 100%;">
                                                    <span class="tf-icons ri-delete-bin-7-line ri-16px me-2"></span> Hapus
                                                </button>
                                            </div>
                                        </div>
                                        <hr class="mt-0" />
                                    </div>
                                    <div class="mb-0">
                                        <button class="btn btn-primary" @click.prevent="addItem">
                                            <i class="ri-add-line me-1"></i>
                                            <span class="align-middle">Tambah Item</span>
                                        </button>
                                    </div>                                    
                                    <div class="mb-8 mt-0 col-12 mb-0 d-flex justify-content-end">
                                        <span class="fw-bold text-end">Grand Total: {{ formatRupiah(grandTotal) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-end mt-6">
                            <button
                                type="submit"
                                class="btn btn-primary me-2"
                                @click="handleSavePurchaseOrder"
                            >
                                {{ isEditMode ? 'Update' : 'Simpan' }}
                            </button>
                            <button type="button" class="btn btn-secondary" @click="handleCloseModal">
                                Batal
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
import { ref, computed, onMounted, watch, onBeforeUnmount, nextTick } from 'vue'
import { usePurchaseOrderStore } from '~/stores/purchaseOrder'
import { useVendorStore } from '~/stores/vendor'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { useCabangStore } from '~/stores/cabang'
import { useProductStore } from '~/stores/product'
import { useUserStore } from '~/stores/user'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Swal from 'sweetalert2'
import vSelect from 'vue-select'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import 'vue-select/dist/vue-select.css'

const config   = useRuntimeConfig();
const { $api } = useNuxtApp()

// Store
const myDataTableRef        = ref(null)
const purchaseOrderStore    = usePurchaseOrderStore()
const vendorStore           = useVendorStore()
const perusahaanStore       = usePerusahaanStore()
const cabangStore           = useCabangStore()
const productStore          = useProductStore()
const userStore             = useUserStore()
const formatRupiah          = useFormatRupiah()

// State
const selectedPurchaseOrder = ref(null);
const purchaseOrder         = ref([])
const vendor                = ref([])
const cabang                = ref([])
const perusahaan            = ref([])
const products              = ref([])
const loading               = ref(false);
const isEditMode            = ref(false);
const totalRecords          = ref(0);
const globalFilterValue     = ref('');
const lazyParams            = ref({
    first    : 0,
    rows     : 10,
    sortField: null,
    sortOrder: null,
    draw     : 1,
    search   : '',
});

const status       = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Partial', value: 'partial' },
    { label: 'Received', value: 'received' },
]);

// Form
const formPurchaseOrder = ref({
  noPo           : '',
  up             : '',
  vendorId       : null,
  perusahaanId   : null,
  cabangId       : null,
  date           : '',
  dueDate        : '',
  discountPercent: 0,
  taxPercent     : 0,
  description    : '',
  attachment     : null,
  status         : 'draft',
  purchaseOrderItems: [
    {
      productId: null,
      quantity: 0,
      unitPrice: 0,
      price: '',
      description: '',
      subtotal: '',
    }
  ],
});

const grandTotal = computed(() => {
  const totalItems = formPurchaseOrder.value.purchaseOrderItems.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    return total + (quantity * unitPrice);
  }, 0);

  const discountPercent = Number(formPurchaseOrder.value.discountPercent) || 0;
  const taxPercent = Number(formPurchaseOrder.value.taxPercent) || 0;

  const discountAmount = totalItems * (discountPercent / 100);
  const totalAfterDiscount = totalItems - discountAmount;
  const taxAmount = totalAfterDiscount * (taxPercent / 100);

  return totalAfterDiscount + taxAmount;
});

// Get Logo Url
const getAttachmentUrl = (attachmentPath) => {
    if (!attachmentPath || typeof attachmentPath !== 'string') {
        return null;
    }
    if (attachmentPath.startsWith('http')) {
        return attachmentPath;
    }
    if (!config.public.apiBase) {
        return attachmentPath;
    }
    const origin = new URL(config.public.apiBase).origin;
    const attachmentUrl = `${origin}/${attachmentPath}`;
    return attachmentUrl;
};

// Rows Per Page Options Array
const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);

// Modal Title
const modalTitle = computed(() => isEditMode.value ? 'Edit Purchase Order' : 'Tambah Purchase Order');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data purchaseOrder di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan purchaseOrder baru.');

// Handle Close Modal
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

// Search Debounce Timer
let searchDebounceTimer = null;
watch(globalFilterValue, (newValue) => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
        lazyParams.value.search = newValue;
        lazyParams.value.first = 0;
        loadLazyData();
    }, 500);
});

// Watch Perusahaan Id
watch(() => formPurchaseOrder.value.perusahaanId, (newPerusahaanId) => {
    formPurchaseOrder.value.cabangId = null; 
    cabang.value = [];
    if (newPerusahaanId) {
        fetchCabang(newPerusahaanId);
    }
});

// On Before Unmount
onBeforeUnmount(() => {
    if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
    }
});

// Fetch Perusahaan
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

// Fetch Cabang
const fetchCabang = async (perusahaanId) => {
    if (!perusahaanId) {
        cabang.value = [];
        return;
    }
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
        if (Array.isArray(data)) {
            cabang.value = data;
        } else if (data && Array.isArray(data.data)) {
            cabang.value = data.data;
        } else {
            cabang.value = []; 
        }
    } catch (error) {
        console.error('Error fetching cabang:', error);
        cabang.value = [];
    }
};

// Fetch Vendor
const fetchVendor = async () => {
    try {
        const token = localStorage.getItem('token')
        const response = await fetch($api.vendor(), {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        
        if (!response.ok) throw new Error('Gagal mengambil data vendor')
        
        const data = await response.json()
        vendor.value = data.data;
    } catch (error) {
        console.error('Error fetching vendor:', error)
    }
}

// Fetch Products
const fetchProducts = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch($api.product(), {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Gagal mengambil data produk');
        }

        const result = await response.json();
        products.value = result.data || result;
    } catch (error) {
        console.error('Error fetching products:', error);
        products.value = [];
        Swal.fire('Error', `Tidak dapat memuat data produk: ${error.message}`, 'error');
    }
};

// Validation Errors
const validationErrors = ref([]);

// Handle Save Purchase Order
const handleSavePurchaseOrder = async () => {
    loading.value = true;
    validationErrors.value = []; // reset error sebelum submit
    try {
        // Ambil CSRF token
        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData     = await csrfResponse.json();
        const csrfToken    = csrfData.token || document.querySelector('meta[name="csrf-token"]')?.content;
        const token        = localStorage.getItem('token');

        // Validasi form sederhana
        if (!formPurchaseOrder.value.noPo || !formPurchaseOrder.value.up) {
            Swal.fire('Validasi', 'No PO dan Untuk Perhatian wajib diisi.', 'warning');
            loading.value = false;
            return;
        }

        const formData = new FormData()
        formData.append('no_po', formPurchaseOrder.value.noPo)
        formData.append('up', formPurchaseOrder.value.up)
        formData.append('vendor_id', formPurchaseOrder.value.vendorId)
        formData.append('perusahaan_id', formPurchaseOrder.value.perusahaanId)
        formData.append('cabang_id', formPurchaseOrder.value.cabangId)
        formData.append('date', formPurchaseOrder.value.date)
        formData.append('due_date', formPurchaseOrder.value.dueDate)
        formData.append('discount_percent', formPurchaseOrder.value.discountPercent)
        formData.append('tax_percent', formPurchaseOrder.value.taxPercent)
        formData.append('description', formPurchaseOrder.value.description)
        formData.append('status', formPurchaseOrder.value.status)
        if (userStore.user && userStore.user.id) {
            formData.append('created_by', userStore.user.id.toString())
        }
        if (formPurchaseOrder.value.attachment) {
            formData.append('attachment', formPurchaseOrder.value.attachment)
        }
        
        // Loop item
        formPurchaseOrder.value.purchaseOrderItems.forEach((item, i) => {
            if (item.productId && item.quantity > 0) { // Basic validation
                const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
                formData.append(`purchase_order_items[${i}][product_id]`, item.productId)
                formData.append(`purchase_order_items[${i}][quantity]`, item.quantity)
                formData.append(`purchase_order_items[${i}][price]`, item.unitPrice)
                formData.append(`purchase_order_items[${i}][subtotal]`, subtotal.toString())
                formData.append(`purchase_order_items[${i}][description]`, item.description || '')
            }
        })
        
        const headers = {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken || '',
            'Accept': 'application/json',
        };

        let url;
        let response;

        if (isEditMode.value) {
            // Cari ID perusahaan dari form atau selectedPerusahaan
            let poIdToUpdate = formPurchaseOrder.value?.id;
            if (!poIdToUpdate && selectedPurchaseOrder.value) {
                poIdToUpdate = selectedPurchaseOrder.value.id;
            }
            if (!poIdToUpdate) {
                Swal.fire('Error', 'ID Purchase Order tidak ditemukan untuk update.', 'error');
                loading.value = false;
                return;
            }
            url = `${$api.purchaseOrder()}/${poIdToUpdate}`;
            console.log('Updating purchaseOrder with ID:', poIdToUpdate, 'URL:', url);

            response = await fetch(url, {
                method: 'POST', // Menggunakan POST untuk mengirim FormData untuk pembaruan
                body: formData,
                headers: headers,
                credentials: 'include'
            });
        } else {
            // Create baru
            url = $api.purchaseOrder();
            response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: headers,
                credentials: 'include'
            });
        }

        if (response.ok) {
            await loadLazyData();
            handleCloseModal();
            await Swal.fire(
                'Berhasil!',
                `Purchase Order berhasil ${isEditMode.value ? 'diperbarui' : 'dibuat'}.`,
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
                Swal.fire('Gagal', errorData.message || `Gagal ${isEditMode.value ? 'memperbarui' : 'membuat'} purchaseOrder`, 'error');
            }
        }
    } catch (error) {
        Swal.fire('Error', error.message || 'Terjadi kesalahan saat menyimpan data purchaseOrder.', 'error');
    } finally {
        loading.value = false;
    }
};

// Load Lazy Data
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

        const response = await fetch(`${$api.purchaseOrder()}?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Gagal memuat data purchaseOrder dengan status: ' + response.status }));
            throw new Error(errorData.message || 'Gagal memuat data purchaseOrder');
        }

        const result = await response.json();
        purchaseOrder.value = result.data || []; 
        totalRecords.value = parseInt(result.meta.total) || 0;
        if (result.draw) {
             lazyParams.value.draw = parseInt(result.draw);
        }

    } catch (error) {
        console.error('Error loading lazy data for purchaseOrder:', error);
        purchaseOrder.value = [];
        totalRecords.value = 0;
        Swal.fire('Error', `Tidak dapat memuat data purchaseOrder: ${error.message}`, 'error');
    } finally {
        loading.value = false;
    }
};

// On Mounted
onMounted(() => {
    loadLazyData();
    fetchVendor();
    fetchPerusahaan();
    fetchProducts();
    userStore.loadUser();
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

const onSort = (event) => {
    lazyParams.value.sortField = event.sortField;
    lazyParams.value.sortOrder = event.sortOrder;
    loadLazyData();
};

const exportData = (format) => {
    if (format === 'csv') {
        myDataTableRef.value.exportCSV();
    } else if (format === 'pdf') {
        myDataTableRef.value.exportPDF();
    }
};

// Definisikan attachmentPreview terlebih dahulu
const attachmentPreview = ref(null);

function onFileChange(e) {
  const file = e.target.files[0];
  formPurchaseOrder.value.attachment = file;
  if (file) {
    const objectURL = URL.createObjectURL(file);
    attachmentPreview.value = objectURL;
  } else {
    formPurchaseOrder.value.attachment = null;
    attachmentPreview.value = null;
  }
}


// On Product Change
const onProductChange = (index) => {
  const selectedProductId = formPurchaseOrder.value.purchaseOrderItems[index].productId;
  const selectedProduct = products.value.find(product => product.id === selectedProductId);

  if (selectedProduct) {
    const item = formPurchaseOrder.value.purchaseOrderItems[index];
    item.unitPrice = selectedProduct.priceBuy;
    item.price = formatRupiah(selectedProduct.priceBuy);
    // Setelah harga unit diatur, hitung subtotalnya
    calculateSubtotal(index); // Panggil fungsi baru
  } else {
    // Jika produk tidak dipilih, reset harga dan subtotal
    const item = formPurchaseOrder.value.purchaseOrderItems[index];
    item.unitPrice = 0;
    item.price = formatRupiah(0);
    calculateSubtotal(index);
  }
};

// On Quantity Change
const onQuantityChange = (index) => {
  calculateSubtotal(index);
};

// Calculate Subtotal
const calculateSubtotal = (index) => {
  const item = formPurchaseOrder.value.purchaseOrderItems[index];

  // Pastikan quantity dan unitPrice adalah angka
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;

  // Hitung subtotal
  const subtotalValue = quantity * unitPrice;

  // Update item.subtotal dengan nilai yang sudah diformat
  item.subtotal = formatRupiah(subtotalValue);
};

// View Purchase Order Details
const viewPurchaseOrderDetails = (purchaseOrderId) => {
    // Cek apakah router.push berhasil membuka halaman, jika tidak gunakan window.location
    try {
        router.push({ path: `/transaksi/purchase-detail?id=${purchaseOrderId}` });
    } catch (e) {
        window.location.href = `/transaksi/purchase-detail?id=${purchaseOrderId}`;
    }
};

// Open Add Purchase Order Modal
const openAddPurchaseOrderModal = () => {
    isEditMode.value = false;
    modalTitle.value = 'Tambah Purchase Order';
    modalDescription.value = 'Silakan isi form di bawah ini untuk menambahkan purchaseOrder baru.';
    resetParentFormState();
    formPurchaseOrder.value.status = 'draft';
    if (formPurchaseOrder.value.purchaseOrderItems.length === 0) {
        addItem();
    }
};

// Open Edit Purchase Order Modal
async function openEditPurchaseOrderModal(purchaseOrderData) {
    isEditMode.value = true;
    selectedPurchaseOrder.value = { ...purchaseOrderData };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().split('T')[0];
    };

    // Ambil perusahaanId dan cabangId dari data purchaseOrder
    const perusahaanId = purchaseOrderData.perusahaan?.id ?? purchaseOrderData.perusahaanId;
    let cabangId = purchaseOrderData.cabang?.id ?? purchaseOrderData.cabangId;

    // Jika cabangId tidak ada, coba ambil dari relasi cabang pada data purchaseOrder
    if (!cabangId && purchaseOrderData.cabang) {
        cabangId = purchaseOrderData.cabang.id;
    }

    formPurchaseOrder.value = {
        id                : purchaseOrderData.id,
        noPo              : purchaseOrderData.noPo,
        up                : purchaseOrderData.up,
        date              : formatDate(purchaseOrderData.date),
        dueDate           : formatDate(purchaseOrderData.dueDate),
        perusahaanId      : perusahaanId,
        cabangId          : cabangId,
        vendorId          : purchaseOrderData.vendor?.id ?? purchaseOrderData.vendorId,
        priceBuy          : purchaseOrderData.priceBuy ?? '',
        priceSell         : purchaseOrderData.priceSell ?? '',
        attachment        : purchaseOrderData.attachment,
        status            : purchaseOrderData.status,
        discountPercent   : purchaseOrderData.discountPercent,
        taxPercent        : purchaseOrderData.taxPercent,
        description       : purchaseOrderData.description,
        purchaseOrderItems: (purchaseOrderData.purchaseOrderItems || []).map(item => {
            const unitPrice = parseFloat(item.price) || 0; // Asumsi item.price dari API adalah harga satuan
            const subtotal = (parseFloat(item.quantity) || 0) * unitPrice;
            return {
                productId  : item.product_id || item.productId,
                quantity   : item.quantity,
                price      : formatRupiah(unitPrice),
                unitPrice  : unitPrice,
                description: item.description,
                subtotal   : formatRupiah(subtotal)
            }
        }),
    };

    if (formPurchaseOrder.value.purchaseOrderItems.length === 0) {
        addItem();
    }

    if (purchaseOrderData.attachment) {
        attachmentPreview.value = getAttachmentUrl(purchaseOrderData.attachment);
    } else {
        attachmentPreview.value = null;
    }

    validationErrors.value = [];

    // Pastikan fetchCabang dipanggil sebelum set cabangId agar data cabang tersedia
    if (formPurchaseOrder.value.perusahaanId) {
        await fetchCabang(formPurchaseOrder.value.perusahaanId);
        // Tunggu data cabang selesai di-fetch, lalu set cabangId lagi agar select cabang terisi dengan benar
        await nextTick();
        formPurchaseOrder.value.cabangId = cabangId;
    }

    // Tunggu DOM update agar binding form sudah siap sebelum show modal
    await nextTick();

    const modalEl = document.getElementById('Modal');
    if (modalEl && window.bootstrap) {
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.show();
    } else {
        console.error('PurchaseOrderModal element tidak ditemukan atau Bootstrap belum dimuat.');
    }
}

// Delete Purchase Order
const deletePurchaseOrder = async (productId) => {
    if (!productId) return;

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

            url = `${$api.purchaseOrder()}/${productId}`;

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
                throw new Error(errorData.message || 'Gagal menghapus purchaseOrder');
            }

            loadLazyData();

            await Swal.fire({
                title: 'Berhasil!',
                text: 'Purchase Order berhasil dihapus.',
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

const getStatusBadge = (status) => {
    switch (status) {
        case 'draft':
            return { text: 'Draft', class: 'badge rounded-pill bg-label-secondary' };
        case 'approved':
            return { text: 'Approved', class: 'badge rounded-pill bg-label-primary' };
        case 'received':
            return { text: 'Received', class: 'badge rounded-pill bg-label-success' };
        case 'rejected':
            return { text: 'Rejected', class: 'badge rounded-pill bg-label-danger' };
        case 'partial':
            return { text: 'Partial', class: 'badge rounded-pill bg-label-warning' };
        default:
            return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

// Reset Parent Form State
const resetParentFormState = () => {
    formPurchaseOrder.value = {
        noPo: '',
        up: '',
        date: '',
        dueDate: '',
        perusahaanId: null,
        cabangId: null,
        vendorId: null,
        priceBuy: '',
        priceSell: '',
        attachment: null,
        status: 'draft',
        description: '',
        purchaseOrderItems: [],
    };
    attachmentPreview.value = null;
};

// Add Item
const addItem = () => {
  formPurchaseOrder.value.purchaseOrderItems.push({
    productId: null,
    quantity: 1,
    price: formatRupiah(0),
    description: '',
    unitPrice: 0,
    subtotal: formatRupiah(0)
  });
};

// Remove Item
const removeItem = (index) => {
  formPurchaseOrder.value.purchaseOrderItems.splice(index, 1);
};

</script>

<style scoped>
    :deep(.perusahaan .vs__dropdown-toggle),
    :deep(.status .vs__dropdown-toggle),
    :deep(.vendor .vs__dropdown-toggle),
    :deep(.product-select .vs__dropdown-toggle),
    :deep(.cabang .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }
</style>