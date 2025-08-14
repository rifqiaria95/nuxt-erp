<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <template v-else-if="purchaseOrder">
                <!-- ✅ STATUS NOTIFICATION BANNER -->
                <div v-if="isReceived" class="alert alert-success d-flex align-items-center mb-4" role="alert">
                    <i class="ri-check-circle-line ri-22px me-2"></i>
                    <div>
                        <strong>Status: {{ purchaseOrder.status?.toUpperCase() }}</strong> - Purchase Order ini sudah selesai dan tidak dapat diubah lagi. Jika ada perubahan yang diperlukan, silakan buat Purchase Return.
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
                                <p class="mb-1">{{ purchaseOrder.perusahaan.alamatPerusahaan }}</p>
                                <p class="mb-1">{{ purchaseOrder.perusahaan.kodePerusahaan }}</p>
                                <p class="mb-0">{{ purchaseOrder.perusahaan.npwpPerusahaan }}</p>
                            </div>
                            <div>
                                <div class="d-flex align-items-center gap-3 mb-6">
                                    <h5 class="mb-0">Purchase Number : {{ purchaseOrder.noPo }}</h5>
                                    <!-- ✅ STATUS BADGE -->
                                    <span :class="getStatusBadgeClass(purchaseOrder.status)">
                                        {{ getStatusText(purchaseOrder.status) }}
                                    </span>
                                </div>
                                <div class="mb-1">
                                    <span>Date Issues: </span>
                                    <span>{{ new Date(purchaseOrder.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                                </div>
                                <div>
                                    <span>Date Due: </span>
                                    <span>{{ new Date(purchaseOrder.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="card-body py-6 px-0">
                            <div class="d-flex justify-content-between flex-wrap gap-6">
                            <div>
                                <h6>Invoice To:</h6>
                                <p class="mb-1">{{ purchaseOrder.up }}</p>
                                <p class="mb-1">{{ purchaseOrder.vendor.name }}</p>
                                <p class="mb-1">{{ purchaseOrder.vendor.address }}</p>
                                <p class="mb-1">{{ purchaseOrder.vendor.phone }}</p>
                                <p class="mb-0">{{ purchaseOrder.vendor.email }}</p>
                            </div>
                            <div>
                                <h6>Bill To:</h6>
                                <p class="mb-1">{{ purchaseOrder.perusahaan.nmPerusahaan }}</p>
                                <p class="mb-1">{{ purchaseOrder.perusahaan.alamatPerusahaan }}</p>
                            </div>
                            </div>
                        </div>
                        
                        <!-- ✅ TOMBOL RECEIVE ALL -->
                        <div class="d-flex justify-content-end mb-4">
                            <button 
                                type="button" 
                                class="btn btn-success btn-sm"
                                @click="receiveAllItems"
                                :disabled="loading || isAllItemsReceived"
                            >
                                <i class="ri-check-double-line me-2"></i>
                                Receive All ({{ totalPendingQuantity }} items)
                            </button>
                        </div>
                        
                        <div class="table-responsive border rounded-4 border-bottom-0">
                            <table class="table m-0">
                            <thead>
                                <tr>
                                <th>Item</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Qty</th>
                                <th>Received Qty</th>
                                <th>Price</th>
                                <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in purchaseOrder.purchaseOrderItems" :key="item.id">
                                    <td class="text-nowrap text-heading">{{ item.product.name }}</td>
                                    <td class="text-nowrap">{{ item.description }}</td>
                                    <td>{{ formatRupiah(item.price) }}</td>
                                    <td>{{ Math.floor(Number(item.quantity) || 0) }}</td>
                                    <td>
                                        <div class="d-flex align-items-center justify-content-center" style="width: 130px;">
                                            <button 
                                                class="btn btn-sm btn-outline-danger me-1 qty-btn" 
                                                type="button"
                                                @click="decreaseReceivedQty(item)"
                                                :disabled="isReceived || Math.floor(Number(item.receivedQty) || 0) <= 0"
                                                title="Kurangi quantity"
                                            >
                                                <i class="ri-subtract-line"></i>
                                            </button>
                                            <input
                                                type="number"
                                                class="form-control mx-1 received-qty-input"
                                                :value="Math.floor(item.receivedQty || 0)"
                                                @input="(e) => { 
                                                    const intValue = Math.floor(parseInt(e.target.value) || 0);
                                                    item.receivedQty = intValue;
                                                    e.target.value = intValue;
                                                    updateReceivedQty(item);
                                                }"
                                                @keydown="(e) => {
                                                    // Mencegah input desimal (titik dan koma)
                                                    if (e.key === '.' || e.key === ',') {
                                                        e.preventDefault();
                                                    }
                                                }"
                                                @blur="updateReceivedQty(item)"
                                                :disabled="isReceived"
                                                min="0"
                                                :max="item.quantity"
                                                step="1"
                                                placeholder="0"
                                                :title="`Received: ${Math.floor(item.receivedQty || 0)} / ${item.quantity}`"
                                            />
                                            <button 
                                                class="btn btn-sm btn-outline-success ms-1 qty-btn" 
                                                type="button"
                                                @click="increaseReceivedQty(item)"
                                                :disabled="isIncrementDisabled(item)"
                                                :title="`Tambah quantity - Current: ${Math.floor(Number(item.receivedQty) || 0)} / Max: ${Math.floor(Number(item.quantity) || 0)}`"
                                            >
                                                <i class="ri-add-line"></i>
                                            </button>
                                        </div>
                                    </td>
                                    <td>{{ formatRupiah(Number(item.price) * Number(item.quantity)) }}</td>
                                    <td>
                                        <span :class="getReceiveStatusBadge(item).class">
                                            {{ getReceiveStatusBadge(item).text }}
                                        </span>
                                    </td>
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
                                    <span>{{ purchaseOrder.createdBy }}</span>
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
                                    <p class="fw-medium mb-1">{{ purchaseOrder.discountPercent }}%</p>
                                    <p class="fw-medium mb-1">{{ formatRupiah(totalBeforeTax) }}</p>
                                    <p class="fw-medium mb-1 border-bottom pb-2">{{ purchaseOrder.taxPercent }}%</p>
                                    <p class="fw-medium mb-0 pt-2">{{ formatRupiah(purchaseOrder.total) }}</p>
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
                                    >{{ purchaseOrder.description }}</span
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
                        @click="printPurchaseOrder(purchaseOrder.id)"
                        >
                        <span class="d-flex align-items-center justify-content-center text-nowrap"
                            ><i class="ri-printer-line ri-16px scaleX-n1-rtl me-2"></i>Print PO</span
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
                    aria-label="Close"></button>
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
            <div v-else class="text-center">
                <p>Purchase Order not found.</p>
            </div>
        </div>
        <!-- / Content -->
    </div>
</template>

<script setup>
import { computed, onMounted, nextTick } from 'vue'
import { usePurchaseOrderStore } from '~/stores/purchaseOrder'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useDynamicTitle } from '~/composables/useDynamicTitle'
import Swal from 'sweetalert2'

// Composables
const { setDetailTitle } = useDynamicTitle()

const purchaseOrderStore = usePurchaseOrderStore()
const route              = useRoute()
const router             = useRouter()
const formatRupiah       = useFormatRupiah()
const toast              = useToast()

const { purchaseOrder, loading } = storeToRefs(purchaseOrderStore)
const poId = route.query.id

// ✅ COMPUTED untuk check apakah Purchase Order sudah received
const isReceived = computed(() => {
    return purchaseOrder.value?.status === 'received'
})

// ✅ COMPUTED untuk total pending quantity
const totalPendingQuantity = computed(() => {
    if (!purchaseOrder.value?.purchaseOrderItems) return 0
    
    return purchaseOrder.value.purchaseOrderItems.reduce((total, item) => {
        const ordered = Math.floor(Number(item.quantity) || 0)
        const received = Math.floor(Number(item.receivedQty) || 0)
        return total + (ordered - received)
    }, 0)
})

// ✅ COMPUTED untuk cek apakah semua item sudah diterima
const isAllItemsReceived = computed(() => {
    return totalPendingQuantity.value === 0
})

// ✅ ACTION METHODS
const printPurchaseOrder = (id) => {
  router.push({
    path: '/purchasing/cetak-po',
    query: { id: id, print: true }
  })
}

async function refreshPurchaseOrderDetails() {
    const poIdToFetch = Array.isArray(poId) ? poId[0] : poId;
    
    
    
    if (typeof poIdToFetch === 'string') {
        loading.value = true
        try {
            await purchaseOrderStore.getPurchaseOrderDetails(poIdToFetch)
            setDetailTitle('Purchase Order', purchaseOrder.value.noPo)
        } catch (error) {
        console.error("Failed to refresh PO details:", error)
        } finally {
            loading.value = false
        }
    } else {
        console.error('poIdToFetch is not a string:', poIdToFetch);
    }
}

// ✅ FUNCTION untuk mendapatkan status badge received
const getReceiveStatusBadge = (item) => {
    const receivedQty = Math.floor(Number(item.receivedQty) || 0)
    const totalQty = Math.floor(Number(item.quantity) || 0)
    
    if (receivedQty === 0) {
        return { text: 'Pending', class: 'badge bg-secondary' }
    } else if (receivedQty < totalQty) {
        return { text: `Partial (${receivedQty}/${totalQty})`, class: 'badge bg-warning' }
    } else if (receivedQty === totalQty) {
        return { text: 'Done', class: 'badge bg-success' }
    }
    return { text: 'Error', class: 'badge bg-danger' }
}

// ✅ FUNCTION untuk debug disable status tombol
const isIncrementDisabled = (item) => {
    const currentReceived = Math.floor(Number(item.receivedQty) || 0)
    const maxQuantity = Math.floor(Number(item.quantity) || 0)
    const disabled = isReceived.value || currentReceived >= maxQuantity
    
    return disabled
}

// ✅ FUNCTION untuk receive all items sekaligus
const receiveAllItems = async () => {
    if (isReceived.value || isAllItemsReceived.value) {
        toast.warning({
            title: 'Peringatan',
            message: `Semua item sudah diterima atau Purchase Order sudah dalam status ${purchaseOrder.value?.status?.toUpperCase()}.`,
            color: 'orange'
        })
        return
    }

    // ✅ TAMPILKAN SWEETALERT CONFIRMATION
    const result = await Swal.fire({
        title: 'Konfirmasi Receive All',
        text: `Apakah anda yakin ingin menerima semua barang? (${totalPendingQuantity.value} items akan dibuat Stock In nya)`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Ya, Receive All!',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        customClass: {
            confirmButton: 'btn btn-success me-3',
            cancelButton: 'btn btn-secondary',
            actions: 'swal-button-spacing'
        },
        buttonsStyling: false
    })

    if (!result.isConfirmed) {
        return
    }

    try {
        // ✅ CALL API untuk batch receive all
        await purchaseOrderStore.receiveAllItems(purchaseOrder.value.id)
        
        // ✅ REFRESH DATA
        await refreshPurchaseOrderDetails()
        
        // ✅ TAMPILKAN SUCCESS MESSAGE
        await Swal.fire({
            title: 'Berhasil!',
            text: `Semua barang telah diterima. ${totalPendingQuantity.value} Stock In telah dibuat.`,
            icon: 'success',
            confirmButtonColor: '#28a745',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
        })
        
    } catch (error) {
        console.error('Error receiving all items:', error)
        
        await Swal.fire({
            title: 'Error!',
            text: error.data?.message || error.message || 'Gagal menerima semua barang',
            icon: 'error',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'OK',
            customClass: {
                confirmButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })
    }
}

// ✅ FUNCTION untuk increase received quantity
const increaseReceivedQty = (item) => {
    if (isReceived.value) return
    
    const currentQty = Math.floor(Number(item.receivedQty) || 0)
    const maxQty = Math.floor(Number(item.quantity) || 0)
    
    
    
    if (currentQty < maxQty) {
        item.receivedQty = currentQty + 1
        updateReceivedQty(item)
    }
}

// ✅ FUNCTION untuk decrease received quantity
const decreaseReceivedQty = (item) => {
    if (isReceived.value) return
    
    const currentQty = Math.floor(Number(item.receivedQty) || 0)
    
    if (currentQty > 0) {
        item.receivedQty = currentQty - 1
        updateReceivedQty(item)
    }
}

// ✅ FUNCTION untuk update received quantity ke backend
const updateReceivedQty = async (item) => {
    // Validasi: Cek apakah purchase order sudah received/delivered
    if (isReceived.value) {
        toast.warning({
            title: 'Aksi Tidak Diizinkan',
            message: `Purchase Order sudah dalam status ${purchaseOrder.value?.status?.toUpperCase()} dan tidak dapat diubah lagi. Jika ada perubahan yang diperlukan, silakan buat Purchase Return.`,
            icon: 'ri-alert-line',
            timeout: 3000,
            position: 'topRight',
            layout: 2,
        })
        return
    }

    // Pastikan receivedQty memiliki nilai default dan bulatkan ke bawah
    if (item.receivedQty === null || item.receivedQty === undefined || item.receivedQty === '') {
        item.receivedQty = 0
    }
    
    // Bulatkan ke bilangan bulat terdekat
    const receivedQty = Math.floor(Number(item.receivedQty) || 0)
    const maxQty = Math.floor(Number(item.quantity) || 0)
    
    // Update nilai di item agar konsisten
    item.receivedQty = receivedQty
    
    // Validasi
    if (receivedQty < 0) {
        item.receivedQty = 0
        return
    }
    
    if (receivedQty > maxQty) {
        item.receivedQty = maxQty
        toast.warning({
            title: 'Peringatan',
            message: `Quantity tidak boleh melebihi ${maxQty}`,
            color: 'orange'
        })
        return
    }
    
    try {
        await purchaseOrderStore.updateStatusPartial(item.id, false, receivedQty)
        await refreshPurchaseOrderDetails()
        
        // Check if all items are now done
        checkAllItemsStatus()
        
    } catch (error) {
        console.error('Failed to update received quantity:', error)
        toast.error({
            title: 'Update Gagal',
            message: 'Terjadi kesalahan saat memperbarui quantity.',
            color: 'red'
        })
    }
}

// ✅ FUNCTION untuk mendapatkan status badge class
const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'draft': return 'badge bg-secondary'
        case 'approved': return 'badge bg-primary'
        case 'partial': return 'badge bg-warning'
        case 'received': return 'badge bg-success'
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
        case 'received': return 'RECEIVED'
        case 'rejected': return 'REJECTED'
        default: return 'UNKNOWN'
    }
}

// ✅ FUNCTION untuk check status semua items
const checkAllItemsStatus = () => {
    if (!purchaseOrder.value || !purchaseOrder.value.purchaseOrderItems) return
    
    const allItemsDone = purchaseOrder.value.purchaseOrderItems.every(item => {
        return Math.floor(Number(item.receivedQty || 0)) === Math.floor(Number(item.quantity || 0))
    })
    
    if (allItemsDone && purchaseOrder.value.status !== 'received') {
        toast.success({
            title: 'Semua Item Selesai!',
            message: 'Semua item telah diterima sepenuhnya. Status berubah menjadi Received.',
            color: 'green'
        })
    }
}

const totalBeforeTax = computed(() => {
    if (purchaseOrder.value && purchaseOrder.value.purchaseOrderItems) {
        const subtotal = purchaseOrder.value.purchaseOrderItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0)
        const discount = subtotal * (Number(purchaseOrder.value.discountPercent) / 100)
        return subtotal - discount
    }
    return 0
})

onMounted(async () => {
    await refreshPurchaseOrderDetails()
})
</script>

<style scoped>
        .invoice-preview-header {
        background-color: #F2F3F4;
    }
      
    .received-qty-input:focus {
        border-color: #007bff !important;
        box-shadow: 0 0 0 0.25rem rgba(0, 123, 255, 0.25), inset 0 1px 2px rgba(0, 0, 0, 0.075) !important;
        color: #212529 !important;
        background-color: #ffffff !important;
        outline: none !important;
    }
    
    .received-qty-input:disabled {
        background-color: #e9ecef !important;
        opacity: 1 !important;
        color: #495057 !important;
        cursor: not-allowed !important;
        border-color: #ced4da !important;
    }
    
    /* Pastikan placeholder terlihat */
    .received-qty-input::placeholder {
        color: #6c757d !important;
        opacity: 1 !important;
        font-weight: 400 !important;
    }
    
    /* Hilangkan spinner pada input number */
    .received-qty-input::-webkit-outer-spin-button,
    .received-qty-input::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
    }
    
    /* Firefox */
    .received-qty-input[type=number] {
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
    
    /* ✅ SweetAlert button spacing */
    :global(.swal-button-spacing) {
        gap: 1rem !important;
    }
    
    :global(.swal2-actions.swal-button-spacing .swal2-confirm) {
        margin-right: 1rem !important;
    }
</style>