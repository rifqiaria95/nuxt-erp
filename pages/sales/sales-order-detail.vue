<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div v-if="loading" class="text-center py-5">
                <div class="d-flex flex-column align-items-center">
                    <div class="spinner-border text-primary mb-3" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <h6 class="text-muted">Memuat detail Sales Order...</h6>
                    <small class="text-muted">Mohon tunggu sebentar</small>
                </div>
            </div>
            <template v-else-if="salesOrder">
                <!-- ✅ STATUS ALERT untuk DELIVERED -->
                <div v-if="isDelivered" class="alert alert-success d-flex align-items-center mb-4" role="alert">
                    <i class="ri-check-circle-fill me-2"></i>
                    <div>
                        <strong>Status: DELIVERED</strong> - Sales Order ini sudah selesai dan tidak dapat diubah lagi.
                        Jika ada perubahan yang diperlukan, silakan buat Sales Return.
                    </div>
                </div>
                
                <div class="row invoice-preview">
                <!-- Invoice -->
                <div class="col-xl-9 col-md-8 col-12 mb-md-0 mb-6">
                    <div class="card invoice-preview-card p-sm-12 p-6">
                        <div class="card-body invoice-preview-header rounded-4 p-6">
                            <div
                            class="d-flex justify-content-between flex-xl-row flex-md-column flex-sm-row flex-column text-heading align-items-xl-center align-items-md-start align-items-sm-center flex-wrap gap-6">
                            <div>
                                <div class="d-flex svg-illustration align-items-center gap-2 mb-6">
                                <span class="app-brand-logo demo">
                                    <span style="color: var(--bs-primary)">
                                        <img src="~/public/img/branding/andara.png" alt="logo" width="200">
                                    </span>
                                </span>
                                </div>
                                <p class="mb-1">{{ salesOrder.perusahaan?.alamatPerusahaan || '-' }}</p>
                                <p class="mb-1">{{ salesOrder.perusahaan?.kodePerusahaan || '-' }}</p>
                                <p class="mb-0">{{ salesOrder.perusahaan?.npwpPerusahaan || '-' }}</p>
                            </div>
                            <div>
                                <div class="d-flex align-items-center gap-3 mb-6">
                                    <h6 class="mb-0">Sales Number : {{ salesOrder.noSo || '-' }}</h6>
                                    <!-- ✅ STATUS BADGE -->
                                    <span :class="getStatusBadgeClass(salesOrder.status || 'draft')">
                                        {{ getStatusText(salesOrder.status || 'draft') }}
                                    </span>
                                </div>
                                <div class="d-flex align-items-center gap-3 mb-6">
                                    <h6 class="mb-0">
                                        Quotation Number : 
                                        {{ salesOrder.quotation?.noQuotation ? salesOrder.quotation.noQuotation : '-' }}
                                    </h6>
                                </div>
                                <div class="mb-1">
                                <span>Date Issues: </span>
                                <span>{{ salesOrder.date ? new Date(salesOrder.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' }}</span>
                                </div>
                                <div>
                                <span>Date Due: </span>
                                <span>{{ salesOrder.dueDate ? new Date(salesOrder.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' }}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="card-body py-6 px-0">
                            <div class="d-flex justify-content-between flex-wrap gap-6">
                            <div>
                                <h6>Invoice To:</h6>
                                <p class="mb-1">{{ salesOrder.up || '-' }}</p>
                                <p class="mb-1">{{ salesOrder.customer?.name || '-' }}</p>
                                <p class="mb-1">{{ salesOrder.customer?.address || '-' }}</p>
                                <p class="mb-1">{{ salesOrder.customer?.phone || '-' }}</p>
                                <p class="mb-0">{{ salesOrder.customer?.email || '-' }}</p>
                            </div>
                            <div>
                                <h6>Bill To:</h6>
                                <p class="mb-1">{{ salesOrder.perusahaan?.nmPerusahaan || '-' }}</p>
                                <p class="mb-1">{{ salesOrder.perusahaan?.alamatPerusahaan || '-' }}</p>
                            </div>
                            </div>
                        </div>
                        <div class="table-responsive border rounded-4 border-bottom-0">
                            <table class="table m-0">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Description</th>
                                    <th>Cost</th>
                                    <th>Qty</th>
                                    <th>Delivered Qty</th>
                                    <th>Total Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in (salesOrder.salesOrderItems || [])" :key="item.id" class="position-relative">
                                    <td class="text-nowrap text-heading">{{ item.product?.name || '-' }}</td>
                                    <td class="text-nowrap">{{ item.description || '-' }}</td>
                                    <td>{{ formatRupiah(item.price) }}</td>
                                    <td>{{ item.quantity }}</td>
                                    <td>
                                        <div class="d-flex align-items-center justify-content-center" style="width: 130px;">
                                            <button 
                                                class="btn btn-sm btn-outline-danger me-1 qty-btn" 
                                                type="button"
                                                @click="decreaseDeliveredQty(item)"
                                                :disabled="isReturned(item) || isDelivered || (item.deliveredQty || 0) <= 0"
                                                title="Kurangi quantity"
                                            >
                                                <i class="ri-subtract-line"></i>
                                            </button>
                                            <input
                                                type="number"
                                                class="form-control mx-1 delivered-qty-input"
                                                :value="Math.floor(item.deliveredQty || 0)"
                                                @input="(e) => { 
                                                    const intValue = Math.floor(parseInt(e.target.value) || 0);
                                                    item.deliveredQty = intValue;
                                                    e.target.value = intValue;
                                                    updateDeliveredQty(item);
                                                }"
                                                @keydown="(e) => {
                                                    // Mencegah input desimal (titik dan koma)
                                                    if (e.key === '.' || e.key === ',') {
                                                        e.preventDefault();
                                                    }
                                                }"
                                                @blur="updateDeliveredQty(item)"
                                                :disabled="isReturned(item) || isDelivered"
                                                min="0"
                                                :max="item.quantity"
                                                step="1"
                                                placeholder="0"
                                                :title="`Delivered: ${Math.floor(item.deliveredQty || 0)} / ${item.quantity}`"
                                            />
                                            <button 
                                                class="btn btn-sm btn-outline-success ms-1 qty-btn" 
                                                type="button"
                                                @click="increaseDeliveredQty(item)"
                                                :disabled="isReturned(item) || isDelivered || (item.deliveredQty || 0) >= item.quantity"
                                                title="Tambah quantity"
                                            >
                                                <i class="ri-add-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td>{{ formatRupiah(item.subtotal) }}</td>
                                    <td>
                                        <span v-if="!isReturned(item)" :class="getDeliveryStatusBadge(item).class">
                                            {{ getDeliveryStatusBadge(item).text }}
                                        </span>
                                        <span v-else class="badge bg-danger">RETURNED</span>
                                    </td>
                                    <!-- ✅ OVERLAY untuk RETURNED items -->
                                    <div v-if="isReturned(item)" class="returned-overlay">
                                        RETURNED
                                    </div>
                                    <!-- ✅ OVERLAY untuk DELIVERED status -->
                                    <div v-if="isDelivered && !isReturned(item)" class="delivered-overlay">
                                        <i class="ri-lock-line me-1"></i>
                                        DELIVERED - LOCKED
                                    </div>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        <div class="table-responsive">
                            <table class="table m-0 table-borderless">
                            <tbody>
                                <tr>
                                <td class="align-top px-0 py-6">
                                    <p class="mb-1">
                                    <span class="me-2 fw-medium text-heading">Created by:</span>
                                    <span>{{ salesOrder.createdByUser?.fullName || salesOrder.createdBy || '-' }}</span>
                                    </p>
                                    <span>Thanks for your business</span>
                                </td>
                                <td class="pe-0 py-6 w-px-100">
                                    <p class="mb-1">Discount:</p>
                                    <p class="mb-1">Subtotal:</p>
                                    <p class="mb-1 border-bottom pb-2">Tax:</p>
                                    <p class="mb-0 pt-2">Total:</p>
                                </td>
                                <td class="text-end px-0 py-6 w-px-100">
                                    <p class="fw-medium mb-1">{{ salesOrder.discountPercent || 0 }}%</p>
                                    <p class="fw-medium mb-1">{{ formatRupiah(totalBeforeTax) }}</p>
                                    <p class="fw-medium mb-1 border-bottom pb-2">{{ salesOrder.taxPercent || 0 }}%</p>
                                    <p class="fw-medium mb-0 pt-2">{{ formatRupiah(salesOrder.total || 0) }}</p>
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </div>

                        <hr class="mt-0 mb-6" />
                        <div class="card-body p-0">
                            <div class="row">
                                <div class="col-12">
                                    <span class="fw-medium text-heading">Note: </span>
                                    <span
                                    >{{ salesOrder.description || '-' }}</span
                                    >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /Invoice -->

                <!-- Invoice Actions -->
                <div class="col-xl-3 col-md-4 col-12 invoice-actions">
                    <div class="card">
                    <div class="card-body">
                        <button
                        class="btn btn-primary d-grid w-100 mb-4"
                        @click="printSuratJalan(salesOrder.id)"
                        >
                        <span class="d-flex align-items-center justify-content-center text-nowrap"
                            ><i class="ri-printer-line ri-16px scaleX-n1-rtl me-2"></i>Print Sales Order</span
                        >
                        </button>
                        <button class="btn btn-outline-secondary d-grid w-100 mb-4">Download</button>
                        <div class="d-flex mb-4">
                        <a
                            class="btn btn-outline-secondary d-grid w-100 me-4"
                            target="_blank"
                            href="./app-invoice-print.html">
                            Print
                        </a>
                        <a href="./app-invoice-edit.html" class="btn btn-outline-secondary d-grid w-100"> Edit </a>
                        </div>
                        <button
                        class="btn btn-success d-grid w-100"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#addPaymentOffcanvas">
                        <span class="d-flex align-items-center justify-content-center text-nowrap"
                            ><i class="ri-money-dollar-circle-line ri-16px me-2"></i>Add Payment</span
                        >
                        </button>
                    </div>
                    </div>
                </div>
                <!-- /Invoice Actions -->
                </div>

                <!-- Offcanvas -->
                <!-- Send Invoice Sidebar -->
                <div class="offcanvas offcanvas-end" id="sendInvoiceOffcanvas" aria-hidden="true">
                <div class="offcanvas-header border-bottom">
                    <h5 class="offcanvas-title">Send Invoice</h5>
                    <button
                    type="button"
                    class="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close">
                    </button>
                </div>
                <div class="offcanvas-body flex-grow-1">
                    <form>
                    <div class="form-floating form-floating-outline mb-5">
                        <input
                        type="text"
                        class="form-control"
                        id="invoice-from"
                        value="shelbyComapny@email.com"
                        placeholder="company@email.com" />
                        <label for="invoice-from">From</label>
                    </div>
                    <div class="form-floating form-floating-outline mb-5">
                        <input
                        type="text"
                        class="form-control"
                        id="invoice-to"
                        value="qConsolidated@email.com"
                        placeholder="company@email.com" />
                        <label for="invoice-to">To</label>
                    </div>
                    <div class="form-floating form-floating-outline mb-5">
                        <input
                        type="text"
                        class="form-control"
                        id="invoice-subject"
                        value="Invoice of purchased Admin Templates"
                        placeholder="Invoice regarding goods" />
                        <label for="invoice-subject">Subject</label>
                    </div>
                    <div class="form-floating form-floating-outline mb-5">
                        <textarea class="form-control" name="invoice-message" id="invoice-message" style="height: 190px">
    Dear Queen Consolidated,
            Thank you for your business, always a pleasure to work with you!
            We have generated a new invoice in the amount of $95.59
            We would appreciate payment of this invoice by 05/11/2021</textarea
                        >
                        <label for="invoice-message">Message</label>
                    </div>
                    <div class="mb-5">
                        <span class="badge bg-label-primary rounded-pill">
                        <i class="ri-links-line ri-14px me-1"></i>
                        <span class="align-middle">Invoice Attached</span>
                        </span>
                    </div>
                    <div class="mb-4 d-flex flex-wrap">
                        <button type="button" class="btn btn-primary me-4" data-bs-dismiss="offcanvas">Send</button>
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                        Cancel
                        </button>
                    </div>
                    </form>
                </div>
                </div>
                <!-- /Send Invoice Sidebar -->

                <!-- Add Payment Sidebar -->
                <div class="offcanvas offcanvas-end" id="addPaymentOffcanvas" aria-hidden="true">
                <div class="offcanvas-header border-bottom">
                    <h5 class="offcanvas-title">Add Payment</h5>
                    <button
                    type="button"
                    class="btn-close text-reset"
                    data-bs-dismiss="offcanvas"
                    aria-label="Close"></button>
                </div>
                <div class="offcanvas-body flex-grow-1">
                    <div class="d-flex justify-content-between bg-lighter p-2 mb-5">
                    <p class="mb-0">Invoice Balance:</p>
                    <p class="fw-medium mb-0">$5000.00</p>
                    </div>
                    <form>
                    <div class="input-group input-group-merge mb-5">
                        <span class="input-group-text">$</span>
                        <div class="form-floating form-floating-outline">
                        <input
                            type="text"
                            id="invoiceAmount"
                            name="invoiceAmount"
                            class="form-control invoice-amount"
                            placeholder="100" />
                        <label for="invoiceAmount">Payment Amount</label>
                        </div>
                    </div>
                    <div class="form-floating form-floating-outline mb-5">
                        <input id="payment-date" class="form-control invoice-date" type="text" />
                        <label for="payment-date">Payment Date</label>
                    </div>
                    <div class="form-floating form-floating-outline mb-5">
                        <select class="form-select" id="payment-method">
                        <option value="" selected disabled>Select payment method</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Paypal">Paypal</option>
                        </select>
                        <label for="payment-method">Payment Method</label>
                    </div>
                    <div class="form-floating form-floating-outline mb-5">
                        <textarea class="form-control" id="payment-note" style="height: 62px"></textarea>
                        <label for="payment-note">Internal Payment Note</label>
                    </div>
                    <div class="d-flex flex-wrap">
                        <button type="button" class="btn btn-primary me-4" data-bs-dismiss="offcanvas">Send</button>
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                        Cancel
                        </button>
                    </div>
                    </form>
                </div>
                </div>
                <!-- /Add Payment Sidebar -->

                <!-- /Offcanvas -->
            </template>
            <div v-else class="text-center py-5">
                <div class="alert alert-warning" role="alert">
                    <i class="ri-error-warning-line me-2"></i>
                    <strong>Sales Order tidak ditemukan</strong>
                    <br>
                    <small>Data Sales Order dengan ID tersebut tidak dapat ditemukan atau tidak tersedia. Anda akan dialihkan ke halaman daftar Sales Order.</small>
                </div>
            </div>
        </div>
        <!-- / Content -->
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSalesOrderStore } from '~/stores/sales-order'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setDetailTitle } = useDynamicTitle()

const salesOrderStore = useSalesOrderStore()
const route           = useRoute()
const router          = useRouter()
const toast           = useToast();
const formatRupiah    = useFormatRupiah()

const { salesOrder, loading } = storeToRefs(salesOrderStore)
const soId = route.query.id

// ✅ ACTION METHODS
const printSuratJalan = (id) => {
  router.push({
    path: '/sales/cetak-surat-jalan',
    query: { id: id, print: true }
  })
}

const isReturned = (item) => {
    // Add safety check for salesReturnItems availability
    if (!item.salesReturnItems || !Array.isArray(item.salesReturnItems)) {
        return false;
    }
    // An item is returned if it's part of any sales return that has been approved.
    return item.salesReturnItems.some(ri => ri.salesReturn && ri.salesReturn.status === 'approved');
}

// ✅ FUNCTION untuk mendapatkan status badge delivery
const getDeliveryStatusBadge = (item) => {
    const deliveredQty = Math.floor(Number(item.deliveredQty) || 0)
    const totalQty = Math.floor(Number(item.quantity) || 0)
    
    if (deliveredQty === 0) {
        return { text: 'Pending', class: 'badge bg-secondary' }
    } else if (deliveredQty < totalQty) {
        return { text: `Partial (${deliveredQty}/${totalQty})`, class: 'badge bg-warning' }
    } else if (deliveredQty === totalQty) {
        return { text: 'Done', class: 'badge bg-success' }
    }
    return { text: 'Error', class: 'badge bg-danger' }
}

// ✅ FUNCTION untuk increase delivered quantity
const increaseDeliveredQty = (item) => {
    if (isReturned(item) || isDelivered.value) return
    
    const currentQty = Math.floor(Number(item.deliveredQty) || 0)
    const maxQty = Math.floor(Number(item.quantity) || 0)
    
    if (currentQty < maxQty) {
        item.deliveredQty = currentQty + 1
        updateDeliveredQty(item)
    }
}

// ✅ FUNCTION untuk decrease delivered quantity
const decreaseDeliveredQty = (item) => {
    if (isReturned(item) || isDelivered.value) return
    
    const currentQty = Math.floor(Number(item.deliveredQty) || 0)
    
    if (currentQty > 0) {
        item.deliveredQty = currentQty - 1
        updateDeliveredQty(item)
    }
}

// ✅ FUNCTION untuk update delivered quantity ke backend
const updateDeliveredQty = async (item) => {
    if (isReturned(item) || isDelivered.value) return
    
    // Pastikan deliveredQty memiliki nilai default dan bulatkan ke bawah
    if (item.deliveredQty === null || item.deliveredQty === undefined || item.deliveredQty === '') {
        item.deliveredQty = 0
    }
    
    // Bulatkan ke bilangan bulat terdekat
    const deliveredQty = Math.floor(Number(item.deliveredQty) || 0)
    const maxQty = Math.floor(Number(item.quantity) || 0)
    
    // Update nilai di item agar konsisten
    item.deliveredQty = deliveredQty
    
    // Validasi
    if (deliveredQty < 0) {
        item.deliveredQty = 0
        return
    }
    
    if (deliveredQty > maxQty) {
        item.deliveredQty = maxQty
        toast.warning({
            title: 'Peringatan',
            message: `Quantity tidak boleh melebihi ${maxQty}`,
            color: 'orange'
        })
        return
    }
    
    try {
        await salesOrderStore.updateStatusPartial(item.id, false, deliveredQty)
        await refreshSalesOrderDetails()
        
        // Check if all items are now done
        checkAllItemsStatus()
        
    } catch (error) {
        console.error('Failed to update delivered quantity:', error)
        toast.error({
            title: 'Update Gagal',
            message: 'Terjadi kesalahan saat memperbarui quantity.',
            color: 'red'
        })
    }
}

// ✅ FUNCTION untuk check status semua items
const checkAllItemsStatus = () => {
    if (!salesOrder.value || !salesOrder.value.salesOrderItems) return
    
    const allItemsDone = salesOrder.value.salesOrderItems.every(item => {
        if (isReturned(item)) return true // Skip returned items
        return Math.floor(Number(item.deliveredQty || 0)) === Math.floor(Number(item.quantity || 0))
    })
    
    if (allItemsDone && salesOrder.value.status !== 'delivered') {
        toast.success({
            title: 'Semua Item Selesai!',
            message: 'Semua item telah diterima sepenuhnya. Status berubah menjadi Done.',
            color: 'green'
        })
    }
}

// ✅ COMPUTED PROPERTY untuk mengecek apakah sales order sudah delivered
const isDelivered = computed(() => {
    return salesOrder.value?.status === 'delivered'
})

// ✅ FUNCTION untuk mendapatkan status badge class
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'draft': return 'badge bg-secondary'
        case 'approved': return 'badge bg-primary'
        case 'partial': return 'badge bg-warning'
        case 'delivered': return 'badge bg-success'
        case 'rejected': return 'badge bg-danger'
        default: return 'badge bg-light'
    }
}

// ✅ FUNCTION untuk mendapatkan status text
const getStatusText = (status) => {
    switch (status) {
        case 'draft': return 'DRAFT'
        case 'approved': return 'APPROVED'
        case 'partial': return 'PARTIAL'
        case 'delivered': return 'DELIVERED'
        case 'rejected': return 'REJECTED'
        default: return 'UNKNOWN'
    }
}

async function refreshSalesOrderDetails() {
    const soIdToFetch = Array.isArray(soId) ? soId[0] : soId;
    
    if (!soIdToFetch || (typeof soIdToFetch === 'string' && soIdToFetch.trim() === '')) {
        console.error('❌ Invalid soId:', soIdToFetch);
        toast.error({
            title: 'Parameter Tidak Valid',
            message: 'ID Sales Order tidak valid atau kosong.',
            color: 'red'
        })
        loading.value = false
        return
    }
    
    loading.value = true
    try {
        await salesOrderStore.getSalesOrderDetails(soIdToFetch)
        
        // Validasi apakah data berhasil dimuat
        if (!salesOrder.value) {
            throw new Error('Data Sales Order tidak ditemukan atau kosong')
        }
    } catch (error) {
        console.error("❌ Failed to refresh SO details:", error)
        
        // Clear salesOrder state jika ada error
        salesOrderStore.salesOrder = null
        
        // Show user-friendly error message
        toast.error({
            title: 'Gagal Memuat Data',
            message: `Tidak dapat memuat detail Sales Order dengan ID: ${soIdToFetch}. ${error.message || 'Silakan coba lagi.'}`,
            color: 'red'
        })
        
        // Redirect ke halaman sales order list setelah 3 detik
        setTimeout(() => {
            router.push('/sales/sales-order')
        }, 3000)
    } finally {
        loading.value = false
    }
}

const totalBeforeTax = computed(() => {
    if (salesOrder.value && salesOrder.value.salesOrderItems) {
        const subtotal = salesOrder.value.salesOrderItems.reduce((sum, item) => sum + Number(item.subtotal), 0)
        const discount = subtotal * (Number(salesOrder.value.discountPercent) / 100)
        return subtotal - discount
    }
    return 0
})

onMounted(async () => {
    await refreshSalesOrderDetails()
    // Set title setelah data berhasil dimuat
    if (salesOrder.value && salesOrder.value.noSo) {
        setDetailTitle('Sales Order - ' + salesOrder.value.noSo)
    } else {
        setDetailTitle('Sales Order - Detail')
    }
})
</script>

<style scoped>
    .invoice-preview-header {
        background-color: #F2F3F4;
    }
    .position-relative {
        position: relative;
    }
    .returned-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
        color: red;
        z-index: 10;
        border-radius: 0.5rem;
    }
    
    /* ✅ CSS untuk DELIVERED overlay */
    .delivered-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(40, 199, 111, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        font-weight: bold;
        color: #28c76f;
        z-index: 10;
        border-radius: 0.5rem;
        border: 2px solid #28c76f;
    }
    
    /* ✅ CSS untuk disabled checkbox styling */
    .switch.switch-success input:disabled + .switch-toggle-slider {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    /* ✅ CSS untuk disabled input styling */
    input:disabled {
        background-color: #f8f9fa !important;
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    /* ✅ CSS untuk master checkbox yang disabled */
    .form-check-input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    /* ✅ CSS untuk disabled switch label */
    .switch input:disabled + .switch-toggle-slider + .switch-label {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .delivered-qty-input:focus {
        border-color: #007bff !important;
        box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25), inset 0 1px 2px rgba(0, 0, 0, 0.075) !important;
        color: #212529 !important;
        background-color: #ffffff !important;
        outline: none !important;
    }
    
    .delivered-qty-input:disabled {
        background-color: #e9ecef !important;
        opacity: 1 !important;
        color: #495057 !important;
        cursor: not-allowed !important;
        border-color: #ced4da !important;
    }
    
    /* Pastikan placeholder terlihat */
    .delivered-qty-input::placeholder {
        color: #6c757d !important;
        opacity: 1 !important;
        font-weight: 400 !important;
    }
    
    /* Hilangkan spinner pada input number */
    .delivered-qty-input::-webkit-outer-spin-button,
    .delivered-qty-input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
    }
    
    /* Firefox */
    .delivered-qty-input[type=number] {
        -moz-appearance: textfield !important;
        appearance: textfield !important;
    }
    
    /* ✅ CSS untuk tombol +/- */
    .qty-btn {
        width: 30px !important;
        height: 30px !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 12px !important;
        line-height: 1 !important;
    }
    
    .qty-btn:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
    }
</style>