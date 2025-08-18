<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">List Purchase Order</h4>
            <p class="mb-6">
            List purchaseOrder yang terdaftar di sistem
            </p>
            <!-- purchaseOrder cards -->
            <div class="row g-6 mb-6">
                <!-- Static cards for display, can be made dynamic later -->
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="mb-1">Total Orders</h5>
                                <span class="badge bg-label-primary rounded-pill">Yearly</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <h1 class="mb-0 display-4">15</h1>
                                <i class="ri-arrow-up-s-line ri-24px text-success"></i>
                                <span class="fw-medium text-success">15.8%</span>
                            </div>
                            <p class="mb-0 mt-2">Analytics for last year</p>
                        </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h5 class="mb-1">Pending Orders</h5>
                                <span class="badge bg-label-warning rounded-pill">Weekly</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <h1 class="mb-0 display-4">5</h1>
                                <i class="ri-arrow-down-s-line ri-24px text-danger"></i>
                                <span class="fw-medium text-danger">8.2%</span>
                            </div>
                            <p class="mb-0 mt-2">Analytics for last week</p>
                        </div>
                    </div>
                </div>
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
                                    <button v-if="userHasRole('superadmin') || userHasPermission('create_purchase_order')" @click="purchaseOrderStore.openModal()" class="btn btn-primary mb-2 text-wrap add-new-role">
                                        Tambah Purchase Order
                                    </button>
                                    <p class="mb-0 mt-1">Buat Purchase Order baru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row g-6">
                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total Purchase Order</h4>
                    <p class="mb-0">Find all of your company's administrator accounts and their associate Purchase Order.</p>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <v-select v-model="filters.vendorId" :options="vendors || []" :get-option-label="v => v.name" :reduce="v => v.id" placeholder="Pilih Vendor" class="v-select-style"/>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <v-select v-model="filters.poType" :options="poTypeOptions" :get-option-label="option => option.label" :reduce="option => option.value" placeholder="Pilih Tipe PO" class="v-select-style"/>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <v-select v-model="filters.status" :options="statusOptions" :get-option-label="option => option.label" :reduce="option => option.value" placeholder="Pilih Status" class="v-select-style"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <!-- purchaseOrder Table -->
                    <div class="card">
                        <div class="card-header">
                            <TableControls
                                v-model="tableControls"
                                :rows-per-page-options="rowsPerPageOptionsArray"
                                search-placeholder="Cari Sales Order..."
                                @rows-change="handleRowsChange"
                                @search="handleSearch"
                                @export="exportData"
                            />
                        </div>
                        <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable 
                                ref="myDataTableRef"
                                :data="purchaseOrders" 
                                :rows="Number(params.rows)" 
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
                                            {{ params.first + slotProps.index + 1 }}
                                        </template>
                                    </Column>
                                    <Column field="noPo" header="No. PO" :sortable="true"></Column>
                                    <Column field="vendor.name" header="Nama Vendor" :sortable="true"></Column>
                                    <Column field="poType" header="Tipe PO" :sortable="true">
                                        <template #body="slotProps">
                                            <span :class="getPoTypeBadge(slotProps.data.poType).class">
                                                {{ getPoTypeBadge(slotProps.data.poType).text }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="status" header="Status PO" :sortable="true">
                                        <template #body="slotProps">
                                            <span :class="getStatusBadge(slotProps.data.status).class">
                                                {{ getStatusBadge(slotProps.data.status).text }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="createdByUser.fullName" header="Dibuat Oleh" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.createdByUser?.fullName || '-' }}
                                            </span>
                                        </template>
                                    </Column>
                                    <Column field="approvedByUser.fullName" header="Approved By" :sortable="true">
                                        <template #body="slotProps">
                                            <span>
                                                {{ slotProps.data.approvedByUser?.fullName || '-' }}
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
                                    <Column field="perusahaan.nmPerusahaan" header="Perusahaan" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.perusahaan?.nmPerusahaan || '-' }}
                                        </template>
                                    </Column>
                                    <Column field="cabang.nmCabang" header="Cabang" :sortable="true">
                                        <template #body="slotProps">
                                            {{ slotProps.data.cabang?.nmCabang || '-' }}
                                        </template>
                                    </Column>
                                    <Column field="attachment" header="Attachment" :sortable="true">
                                        <template #body="slotProps">
                                            <div v-if="slotProps.data.attachment">
                                                <a 
                                                    :href="getAttachmentUrl(slotProps.data.attachment)" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    download
                                                    class="badge rounded-pill bg-label-primary"
                                                    style="text-decoration: none;"
                                                >
                                                    <i class="ri-file-line me-2"></i>
                                                    Download File
                                                </a>
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
                                                    <li v-if="userHasPermission('approve_purchase_order') && slotProps.data.status == 'draft'">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="purchaseOrderStore.approvePurchaseOrder(slotProps.data.id)">
                                                            <i class="ri-check-line me-2"></i> Approve
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('reject_purchase_order') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="purchaseOrderStore.rejectPurchaseOrder(slotProps.data.id)">
                                                            <i class="ri-close-line me-2"></i> Reject
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('view_purchase_order'))">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="viewPurchaseOrderDetails(slotProps.data.id)">
                                                            <i class="ri-eye-line me-2"></i> Lihat Detail
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('edit_purchase_order') && slotProps.data.status == 'draft')">
                                                        <a class="dropdown-item" href="javascript:void(0)" @click="purchaseOrderStore.fetchPurchaseOrderForEdit(slotProps.data.id)">
                                                            <i class="ri-edit-box-line me-2"></i> Edit
                                                        </a>
                                                    </li>
                                                    <li v-if="userHasRole('superadmin') || (userHasPermission('delete_purchase_order') && (slotProps.data.status == 'draft'))">
                                                        <a class="dropdown-item text-danger" href="javascript:void(0)" @click="purchaseOrderStore.deletePurchaseOrder(slotProps.data.id)">
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

            <Modal 
                id="PurchaseOrderModal"
                :title="modalTitle" 
                :description="modalDescription"
                :validation-errors-from-parent="validationErrors"
            >
                <template #default>
                    <form @submit.prevent="purchaseOrderStore.savePurchaseOrder()">
                         <div class="row">
                            <div class="col">
                                <ul class="nav nav-tabs" role="tablist">
                                    <li class="nav-item">
                                        <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#form-tabs-info" role="tab" aria-selected="true" type="button">
                                            <span class="ri-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">Informasi Purchase Order</span>
                                        </button>
                                    </li>
                                    <li class="nav-item">
                                        <button class="nav-link" data-bs-toggle="tab" data-bs-target="#form-tabs-items" role="tab" aria-selected="false" type="button">
                                            <span class="ri-folder-user-line ri-20px d-sm-none"></span>
                                            <span class="d-none d-sm-block">List Product</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="tab-content pt-4">
                            <div class="tab-pane fade active show" id="form-tabs-info" role="tabpanel">
                                <div class="row g-4">
                                    <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <input type="hidden" v-model="form.noPo" class="form-control" placeholder="No PO" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Tipe Purchase Order</label>
                                        <div class="d-flex gap-5">
                                            <div class="form-check">
                                                <input 
                                                    class="form-check-input" 
                                                    type="checkbox" 
                                                    id="poType_internal" 
                                                    :checked="form.poType === 'internal'"
                                                    @change="handlePoTypeChange('internal')"
                                                >
                                                <label class="form-check-label" for="poType_internal">
                                                    Internal
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input 
                                                    class="form-check-input" 
                                                    type="checkbox" 
                                                    id="poType_external" 
                                                    :checked="form.poType === 'external'"
                                                    @change="handlePoTypeChange('external')"
                                                >
                                                <label class="form-check-label" for="poType_external">
                                                    External
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-4">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="text" 
                                                v-model="form.extNamaPerusahaan" 
                                                class="form-control" 
                                                placeholder="Nama Perusahaan External"
                                                :disabled="!isExternalPO"
                                            >
                                            <label>Nama Perusahaan External</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select 
                                            v-model="form.vendorId" 
                                            :options="vendors || []" 
                                            :get-option-label="v => v.name" 
                                            :reduce="v => v.id" 
                                            placeholder="Pilih Vendor" 
                                            class="v-select-style"
                                            :loading="vendorStore.loading"
                                        />
                                        <small class="text-muted">Vendor tersedia: {{ vendors?.length || 0 }}</small>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="text" v-model="form.up" class="form-control" placeholder="Untuk Perhatian" required>
                                            <label>Untuk Perhatian</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.date" class="form-control" required>
                                            <label>Tanggal PO</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input type="date" v-model="form.dueDate" class="form-control" required>
                                            <label>Jatuh Tempo</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select 
                                            v-model="form.perusahaanId" 
                                            :options="perusahaans || []" 
                                            :get-option-label="p => p.nmPerusahaan" 
                                            :reduce="p => p.id" 
                                            placeholder="Pilih Perusahaan" 
                                            class="v-select-style"
                                            :disabled="isExternalPO"
                                            :loading="perusahaanStore.loading"
                                        />
                                        <small class="text-muted">Perusahaan tersedia: {{ perusahaans?.length || 0 }}</small>
                                    </div>
                                    <div class="col-md-6">
                                        <v-select 
                                            v-model="form.cabangId" 
                                            :options="filteredCabangs" 
                                            :get-option-label="c => c.nmCabang" 
                                            :reduce="c => c.id" 
                                            placeholder="Pilih Cabang" 
                                            class="v-select-style"
                                            :disabled="isExternalPO"
                                            :loading="cabangStore.loading"
                                        />
                                        <small class="text-muted">Cabang tersedia: {{ filteredCabangs?.length || 0 }}</small>
                                    </div>

                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="number" v-model="form.discountPercent" class="form-control" placeholder="Discount (%)">
                                            <label>Discount (%)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="form-floating form-floating-outline">
                                            <input type="number" v-model="form.taxPercent" class="form-control" placeholder="Tax (%)">
                                            <label>Tax (%)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-floating form-floating-outline">
                                            <input 
                                                type="file" 
                                                @change="onFileChange" 
                                                class="form-control"
                                                accept=".pdf,.xlsx,.xls,.jpg,.jpeg,.png,.gif,.webp,.svg"
                                            >
                                            <label>Attachment (PDF, Excel, Image)</label>
                                            
                                            <div v-if="form.attachmentPreview" class="mt-2">
                                                <div class="d-flex align-items-center mb-2">
                                                    <i :class="getFileIcon(form.attachmentPreview)" style="font-size: 1.2rem; margin-right: 0.5rem;"></i>
                                                    <a :href="form.attachmentPreview" target="_blank" rel="noopener noreferrer" class="d-block">Lihat Attachment</a>
                                                </div>
                                                <div v-if="isImageFile(form.attachmentPreview)" class="mt-2">
                                                    <img 
                                                        :src="form.attachmentPreview" 
                                                        alt="Attachment Preview" 
                                                        class="attachment-preview"
                                                        style="height: 60px; max-width: 120px; object-fit: contain; border: 2px solid #ddd; border-radius: 8px;"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-floating form-floating-outline">
                                            <textarea v-model="form.description" class="form-control" placeholder="Deskripsi"></textarea>
                                            <label>Deskripsi</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="form-tabs-items" role="tabpanel">
                                <div class="alert alert-info mb-4">
                                    <i class="ri-information-line me-2"></i>
                                    <strong>Info:</strong> 
                                    <ul class="mb-0 mt-2">
                                        <li>Anda dapat <strong>mencari produk berdasarkan part number (SKU) atau nama produk</strong></li>
                                        <li>Format tampilan: <strong>Part Number | Nama Produk</strong></li>
                                        <li>Pencarian bersifat <strong>case-insensitive</strong> dan mendukung <strong>partial match</strong></li>
                                        <li><strong>💡 Tips:</strong> Ketik untuk mencari berdasarkan SKU atau nama produk</li>
                                        <li><strong>🔧 Debug:</strong> Buka console browser untuk melihat log data produk</li>
                                    </ul>
                                </div>
                                <div v-for="(item, index) in form.purchaseOrderItems" :key="index" class="repeater-item mb-4">
                                    <div class="row g-3">
                                        <div class="col-12">
                                            <label class="form-label">Gudang</label>
                                            <v-select 
                                                v-model="item.warehouseId" 
                                                :options="warehouses || []" 
                                                :get-option-label="w => `${w.name} (${w.code})`" 
                                                :reduce="w => w.id" 
                                                placeholder="Pilih Gudang" 
                                                class="v-select-style"
                                                :loading="warehouseStore.loading"
                                            />
                                            <small class="text-muted">Gudang tersedia: {{ warehouses?.length || 0 }}</small>
                                        </div>
                                        <div class="col-md-4">
                                            <v-select 
                                                v-model="item.productId" 
                                                :options="filteredProducts" 
                                                label="displayName"
                                                :reduce="p => p.id" 
                                                placeholder="Cari berdasarkan SKU atau nama produk..." 
                                                @update:modelValue="onProductChange(index)" 
                                                class="v-select-style"
                                                :loading="productStore.loading"
                                                :searchable="true"
                                                :clearable="true"
                                                :close-on-select="true"
                                                :preserve-search="false"
                                            >
                                                <template #option="option">
                                                    <div class="d-flex justify-content-between align-items-center w-100">
                                                        <div>
                                                            <div class="fw-bold">{{ option.sku }} | {{ option.name }}</div>
                                                            <small class="text-muted">{{ option.unit?.name || 'No Unit' }} - {{ formatRupiah(option.priceBuy) }}</small>
                                                        </div>
                                                    </div>
                                                </template>
                                            </v-select>
                                            <small class="text-muted">Produk tersedia: {{ filteredProducts?.length || 0 }} | Selected: {{ item.productId }}</small>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="form-floating form-floating-outline">
                                                <input type="number" v-model.number="item.quantity" @input="onQuantityChange(index)" class="form-control" placeholder="Qty">
                                                <label>Jumlah</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" :value="formatRupiah(item.price)" class="form-control" placeholder="Harga" readonly>
                                                <label>Harga</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3">
                                            <div class="form-floating form-floating-outline">
                                                <input type="text" :value="formatRupiah(item.subtotal)" class="form-control" placeholder="Subtotal" readonly>
                                                <label>Subtotal</label>
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                             <div class="form-floating form-floating-outline">
                                                <input type="text" v-model="item.description" class="form-control" placeholder="Deskripsi item">
                                                <label>Deskripsi</label>
                                            </div>
                                        </div>
                                        <div class="col-md-3 d-flex align-items-center">
                                            <button @click.prevent="purchaseOrderStore.removeItem(index)" class="btn btn-outline-danger w-100">Hapus</button>
                                        </div>
                                    </div>
                                    <hr class="my-4">
                                </div>
                                <div class="mt-4">
                                    <button @click.prevent="purchaseOrderStore.addItem()" class="btn btn-primary">Tambah Item</button>
                                </div>
                                <div class="d-flex justify-content-end mt-4">
                                    <span class="fw-bold fs-5">Grand Total: {{ formatRupiah(grandTotal) }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer mt-6">
                             <button type="button" class="btn btn-outline-secondary" @click="purchaseOrderStore.closeModal()">Tutup</button>
                            <button type="submit" class="btn btn-primary" :disabled="loading">
                                <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                Simpan
                            </button>
                        </div>
                    </form>
                </template>
            </Modal>
        </div>
         <div class="content-backdrop fade"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePurchaseOrderStore } from '~/stores/purchaseOrder'
import { useVendorStore } from '~/stores/vendor'
import { usePerusahaanStore } from '~/stores/perusahaan'
import { useCabangStore } from '~/stores/cabang'
import { useProductStore } from '~/stores/product'
import { useWarehouseStore } from '~/stores/warehouse'
import { useUserStore } from '~/stores/user'
import { usePermissionsStore } from '~/stores/permissions'
import { usePermissions } from '~/composables/usePermissions'
import Modal from '~/components/modal/Modal.vue'
import MyDataTable from '~/components/table/MyDataTable.vue'
import TableControls from '~/components/table/TableControls.vue'
import vSelect from 'vue-select'
import Dropdown from 'primevue/dropdown'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import 'vue-select/dist/vue-select.css'
import { useDebounceFn } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useDynamicTitle } from '~/composables/useDynamicTitle'
import { useImageUrl } from '~/composables/useImageUrl'
import Swal from 'sweetalert2'

// Composables
const { setListTitle, setFormTitle } = useDynamicTitle()
const { getAttachmentUrl, getFileIcon, isImageFile, isPdfFile, isExcelFile } = useImageUrl()

const config = useRuntimeConfig();
const router = useRouter();

// Store
const myDataTableRef        = ref(null)
const purchaseOrderStore    = usePurchaseOrderStore()
const vendorStore           = useVendorStore()
const perusahaanStore       = usePerusahaanStore()
const warehouseStore        = useWarehouseStore()
const cabangStore           = useCabangStore()
const productStore          = useProductStore()
const userStore             = useUserStore()
const formatRupiah          = useFormatRupiah()
const { userHasPermission, userHasRole } = usePermissions();
const permissionStore       = usePermissionsStore()

const { purchaseOrders, loading, totalRecords, params, form, isEditMode, showModal, validationErrors } = storeToRefs(purchaseOrderStore)
const { vendors }     = storeToRefs(vendorStore)
const { perusahaans } = storeToRefs(perusahaanStore)
const { cabangs }     = storeToRefs(cabangStore)
const { warehouses }  = storeToRefs(warehouseStore)
const { products }    = storeToRefs(productStore)
const { user }        = storeToRefs(userStore)
const { permissions } = storeToRefs(permissionStore)





// State
const globalFilterValue = ref('');
const tableControls = ref({
    rows: 10,
    search: '',
});
const filters = ref({
    search: '',
    vendorId: null,
    poType: null,
    status: null,
});

const rowsPerPageOptionsArray = ref([10, 25, 50, 100]);
const modalTitle = computed(() => isEditMode.value ? 'Edit Purchase Order' : 'Tambah Purchase Order');
const modalDescription = computed(() => isEditMode.value ? 'Silakan ubah data purchaseOrder di bawah ini.' : 'Silakan isi form di bawah ini untuk menambahkan purchaseOrder baru.');

const grandTotal = computed(() => {
  if (!form.value || !form.value.purchaseOrderItems) return 0;

  const totalItems = (form.value.purchaseOrderItems || []).reduce((total, item) => {
    return total + (Number(item.subtotal) || 0);
  }, 0);

  const discountPercent = Number(form.value.discountPercent) || 0;
  const taxPercent = Number(form.value.taxPercent) || 0;

  const discountAmount = totalItems * (discountPercent / 100);
  const totalAfterDiscount = totalItems - discountAmount;
  const taxAmount = totalAfterDiscount * (taxPercent / 100);

  return totalAfterDiscount + taxAmount;
});



const poTypeOptions = ref([
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
]);

const statusOptions = ref([
    { label: 'Draft', value: 'draft' },
    { label: 'Approved', value: 'approved' },
    { label: 'Received', value: 'received' },
    { label: 'Rejected', value: 'rejected' },
    { label: 'Partial', value: 'partial' },
]);


let modalInstance = null;
onMounted(async () => {
    
    // Load data menggunakan method store yang standar
    try {
        await Promise.all([
            vendorStore.fetchVendors(),
            perusahaanStore.fetchPerusahaans(),
            productStore.fetchProducts(),
            warehouseStore.fetchWarehouses(),
            userStore.loadUser(),
            permissionStore.fetchPermissions()
        ]);
        
        // Load purchase orders after other data is ready
        purchaseOrderStore.fetchPurchaseOrders();
        setListTitle('Purchase Order', purchaseOrders.value.length)
        
        // Untuk cabang, kita akan load setelah perusahaan dipilih
    } catch (error) {
        console.error('Error loading data:', error);
    }
    
    const modalElement = document.getElementById('PurchaseOrderModal')
    if (modalElement) {
        modalInstance = new bootstrap.Modal(modalElement)
    }

    // Initialize table controls
    tableControls.value.rows = Number(params.value.rows) || 10;
    tableControls.value.search = globalFilterValue.value;
});

// Watch untuk sinkronisasi table controls
watch(() => params.value.rows, (newValue) => {
    tableControls.value.rows = Number(newValue) || 10;
});

watch(() => globalFilterValue.value, (newValue) => {
    tableControls.value.search = newValue;
});

watch(showModal, (newValue) => {
    if (newValue) {
        modalInstance?.show()
        if (isEditMode.value && form.value?.attachment_url) {
            form.value.attachmentPreview = form.value.attachment_url
        } else if (isEditMode.value && form.value?.attachment) {
            form.value.attachmentPreview = getAttachmentUrl(form.value.attachment)
        } else {
            form.value.attachmentPreview = null
        }
    } else {
        modalInstance?.hide()
    }
})

watch(products, (newProducts) => {
    if (newProducts && newProducts.length > 0) {
    } else {
    }
})

watch(vendors, (newVendors) => {
    if (newVendors && newVendors.length > 0) {
    }
})

watch(perusahaans, (newPerusahaans) => {
    if (newPerusahaans && newPerusahaans.length > 0) {
    }
})

watch(warehouses, (newWarehouses) => {
    if (newWarehouses && newWarehouses.length > 0) {
    }
})

watch(filters, (newFilters) => {
    if (!newFilters) return;
    const { page, rows, ...restFilters } = newFilters;
    purchaseOrderStore.setFilters(restFilters);
}, { deep: true });

watch(() => form.value?.purchaseOrderItems, (newItems) => {
    if (newItems && newItems.length > 0) {
    }
}, { deep: true })

watch(() => form.value?.perusahaanId, async (newPerusahaanId) => {
    if (newPerusahaanId && form.value) {
        if(!isEditMode.value) {
            form.value.cabangId = null;
        }
        
        // Load cabang berdasarkan perusahaan yang dipilih
        try {
            const { $api } = useNuxtApp();
            const token = localStorage.getItem('token');
            const response = await fetch(`${$api.dataCabang()}?perusahaanId=${newPerusahaanId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                }
            });
            
            if (response.ok) {
                const cabangData = await response.json();
                cabangStore.cabangs = cabangData;
            }
        } catch (error) {
            console.error('Error loading cabang:', error);
        }
    }
});

const filteredCabangs = computed(() => {
    if (!form.value?.perusahaanId || !cabangs.value) return [];
    const filtered = (cabangs.value || []).filter(c => c.perusahaanId === form.value.perusahaanId);
    return filtered;
});

const isExternalPO = computed(() => {
    return form.value?.poType === 'external';
});

const filteredProducts = computed(() => {
    if (!products.value || !Array.isArray(products.value)) {
        return [];
    }
    
    const limited = products.value.slice(0, 100);
    
    return limited.map(product => ({
        ...product,
        displayName: `${product.sku || ''} | ${product.name || ''}`
    }));
});

const debouncedSearch = useDebounceFn(() => {
    if (globalFilterValue.value !== undefined) {
        purchaseOrderStore.setSearch(globalFilterValue.value)
    }
}, 500)
watch(globalFilterValue, (newValue) => {
    if (newValue !== undefined) {
        debouncedSearch();
    }
});

const onPage = (event) => {
    if (event) {
        // Ensure the event has valid values
        const validEvent = {
            first: Number(event.first) || 0,
            rows: Number(event.rows) || 10,
            page: Number(event.page) || 0
        };
        purchaseOrderStore.setPagination(validEvent);
    }
};
const handleRowsChange = (value) => {
    const rowsValue = Number(value) || 10;
    params.value.rows = rowsValue;
    params.value.first = 0;
    purchaseOrderStore.fetchPurchaseOrders();
};

const handleSearch = (value) => {
    globalFilterValue.value = value;
    params.value.first = 0;
    purchaseOrderStore.fetchPurchaseOrders();
};

const onSort = (event) => {
    if (event) {
        purchaseOrderStore.setSort(event);
    }
};

const exportData = (format) => {
    if (format === 'csv' && myDataTableRef.value) {
        myDataTableRef.value.exportCSV();
    }
};

function onFileChange(e) {
  if (!form.value) return;
  
  const file = e.target.files[0];
  if (file) {
    if (!file.size || file.size === 0) {
      Swal.fire('Error', 'File attachment kosong atau tidak valid', 'error');
      return;
    }

    const fileType = file.type || '';
    const fileExtension = file.name?.split('.').pop()?.toLowerCase() || '';

    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    const allowedExtensions = ['pdf', 'xlsx', 'xls', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

    const isValidMimeType = allowedMimeTypes.includes(fileType);
    const isValidExtension = allowedExtensions.includes(fileExtension);

    if (!isValidMimeType && !isValidExtension) {
      Swal.fire('Error', `File harus berupa PDF, Excel, atau gambar. Detected: MIME=${fileType}, Ext=${fileExtension}`, 'error');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      Swal.fire('Error', 'Ukuran file terlalu besar (maksimal 10MB)', 'error');
      return;
    }

    form.value.attachment = file;
    form.value.attachmentPreview = URL.createObjectURL(file);
  } else {
    form.value.attachment = null;
    form.value.attachmentPreview = null;
  }
}

const onProductChange = (index) => {
  if (!form.value || !form.value.purchaseOrderItems) return;
  
  const selectedProductId = form.value.purchaseOrderItems[index].productId;
  const selectedProduct = (filteredProducts.value || []).find(p => p.id === selectedProductId);

  if (selectedProduct) {
    const item = form.value.purchaseOrderItems[index];
    item.price = Number(selectedProduct.priceBuy) || 0;
    calculateSubtotal(index);
  }
};

const onQuantityChange = (index) => {
  if (!form.value || !form.value.purchaseOrderItems) return;
  calculateSubtotal(index);
};

const calculateSubtotal = (index) => {
  if (!form.value || !form.value.purchaseOrderItems) return;
  
  const item = form.value.purchaseOrderItems[index];
  if (!item) return;
  
  const quantity = Number(item.quantity) || 0;
  const price = Number(item.price) || 0;
  
  item.subtotal = quantity * price;
};

const viewPurchaseOrderDetails = (purchaseOrderId) => {
    if (!purchaseOrderId) return;
    router.push({ path: `/purchasing/purchase-order-detail`, query: { id: purchaseOrderId } });
};

const getStatusBadge = (status) => {
    if (!status) return { text: '-', class: 'badge rounded-pill bg-label-light' };
    
    switch (status) {
        case 'draft': return { text: 'Draft', class: 'badge rounded-pill bg-label-secondary' };
        case 'approved': return { text: 'Approved', class: 'badge rounded-pill bg-label-primary' };
        case 'received': return { text: 'Received', class: 'badge rounded-pill bg-label-success' };
        case 'rejected': return { text: 'Rejected', class: 'badge rounded-pill bg-label-danger' };
        case 'partial': return { text: 'Partial', class: 'badge rounded-pill bg-label-warning' };
        default: return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

const getPoTypeBadge = (poType) => {
    if (!poType) return { text: '-', class: 'badge rounded-pill bg-label-light' };
    
    switch (poType) {
        case 'internal': return { text: 'Internal', class: 'badge rounded-pill bg-label-info' };
        case 'external': return { text: 'External', class: 'badge rounded-pill bg-label-dark' };
        default: return { text: '-', class: 'badge rounded-pill bg-label-light' };
    }
};

const handlePoTypeChange = (selectedType) => {
    if (!form.value) return;
    
    if (form.value.poType === selectedType) {
        return;
    }
    
    form.value.poType = selectedType;
    
    if (selectedType === 'internal') {
        // Reset external fields
        form.value.extNamaPerusahaan = '';
    } else if (selectedType === 'external') {
        // Reset internal fields
        form.value.perusahaanId = null;
        form.value.cabangId = null;
    }
};

</script>

<style scoped>
    .v-select-style {
        height: 48px !important;
        border-radius: 7px;
    }
    
    .attachment-preview {
        transition: all 0.3s ease;
    }

    .attachment-preview:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    :deep(.v-select-style .vs__dropdown-toggle),
    :deep(.perusahaan .vs__dropdown-toggle),
    :deep(.warehouse-select .vs__dropdown-toggle),
    :deep(.status .vs__dropdown-toggle),
    :deep(.vendor .vs__dropdown-toggle),
    :deep(.product-select .vs__dropdown-toggle),
    :deep(.cabang .vs__dropdown-toggle) {
        height: 48px !important;
        border-radius: 7px;
    }

    /* ✅ NEW: Styling untuk search input yang lebih responsif */
    :deep(.v-select-style .vs__search) {
        padding: 8px 12px !important;
        font-size: 14px !important;
        border: none !important;
        outline: none !important;
        background: transparent !important;
        width: 100% !important;
        min-width: 0 !important;
    }

    /* ✅ NEW: Memastikan dropdown muncul dengan benar */
    :deep(.v-select-style .vs__dropdown-menu) {
        max-height: 300px !important;
        overflow-y: auto !important;
    }

    /* ✅ NEW: Styling untuk option yang dipilih */
    :deep(.v-select-style .vs__dropdown-option--highlight) {
        background-color: #696cff !important;
        color: white !important;
    }
</style>