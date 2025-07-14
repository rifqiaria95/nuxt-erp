<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
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
                                <p class="mb-1">{{ salesOrder.perusahaan.alamatPerusahaan }}</p>
                                <p class="mb-1">{{ salesOrder.perusahaan.kodePerusahaan }}</p>
                                <p class="mb-0">{{ salesOrder.perusahaan.npwpPerusahaan }}</p>
                            </div>
                            <div>
                                <div class="d-flex align-items-center gap-3 mb-6">
                                    <h5 class="mb-0">Sales Number : {{ salesOrder.noSo }}</h5>
                                    <!-- ✅ STATUS BADGE -->
                                    <span :class="getStatusBadgeClass(salesOrder.status)">
                                        {{ getStatusText(salesOrder.status) }}
                                    </span>
                                </div>
                                <div class="mb-1">
                                <span>Date Issues: </span>
                                <span>{{ new Date(salesOrder.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                                </div>
                                <div>
                                <span>Date Due: </span>
                                <span>{{ new Date(salesOrder.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="card-body py-6 px-0">
                            <div class="d-flex justify-content-between flex-wrap gap-6">
                            <div>
                                <h6>Invoice To:</h6>
                                <p class="mb-1">{{ salesOrder.up }}</p>
                                <p class="mb-1">{{ salesOrder.customer.name }}</p>
                                <p class="mb-1">{{ salesOrder.customer.address }}</p>
                                <p class="mb-1">{{ salesOrder.customer.phone }}</p>
                                <p class="mb-0">{{ salesOrder.customer.email }}</p>
                            </div>
                            <div>
                                <h6>Bill To:</h6>
                                <p class="mb-1">{{ salesOrder.perusahaan.nmPerusahaan }}</p>
                                <p class="mb-1">{{ salesOrder.perusahaan.alamatPerusahaan }}</p>
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
                                    <th>
                                        Status
                                        <!-- ✅ DISABLE MASTER CHECKBOX ketika DELIVERED -->
                                        <input 
                                            type="checkbox" 
                                            class="form-check-input ms-2" 
                                            :checked="allItemsCompleted"
                                            @change="toggleAllItemsStatus"
                                            :disabled="isDelivered"
                                            :title="isDelivered ? 'Tidak dapat mengubah status - Sales Order sudah delivered' : 'Toggle all items status'" 
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in salesOrder.salesOrderItems" :key="item.id" class="position-relative">
                                    <td class="text-nowrap text-heading">{{ item.product.name }}</td>
                                    <td class="text-nowrap">{{ item.description }}</td>
                                    <td>{{ formatRupiah(item.price) }}</td>
                                    <td>{{ item.quantity }}</td>
                                    <td>
                                        <input
                                          type="number"
                                          class="form-control"
                                          v-model="item.deliveredQty"
                                          style="width: 80px;"
                                          :disabled="item.statusPartial || isReturned(item) || isDelivered"
                                        />
                                    </td>
                                    <td>{{ formatRupiah(item.subtotal) }}</td>
                                    <td>
                                        <label class="switch switch-success" v-if="!isReturned(item)">
                                            <!-- ✅ DISABLE INDIVIDUAL CHECKBOX ketika DELIVERED -->
                                            <input 
                                                type="checkbox" 
                                                class="switch-input" 
                                                :checked="item.statusPartial" 
                                                @change="updateStatusPartial(item.id, !item.statusPartial, item.deliveredQty)"
                                                :disabled="isDelivered"
                                            />
                                            <span class="switch-toggle-slider">
                                            <span class="switch-on">
                                                <i class="ri-check-line"></i>
                                            </span>
                                            <span class="switch-off">
                                                <i class="ri-close-line"></i>
                                            </span>
                                            </span>
                                            <span class="switch-label">{{ item.statusPartial ? 'Done' : 'Pending' }}</span>
                                        </label>
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
                                    <span>{{ salesOrder.createdBy }}</span>
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
                                    <p class="fw-medium mb-1">{{ salesOrder.discountPercent }}%</p>
                                    <p class="fw-medium mb-1">{{ formatRupiah(totalBeforeTax) }}</p>
                                    <p class="fw-medium mb-1 border-bottom pb-2">{{ salesOrder.taxPercent }}%</p>
                                    <p class="fw-medium mb-0 pt-2">{{ formatRupiah(salesOrder.total) }}</p>
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
                                    >{{ salesOrder.description }}</span
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
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sendInvoiceOffcanvas">
                        <span class="d-flex align-items-center justify-content-center text-nowrap"
                            ><i class="ri-send-plane-line ri-16px scaleX-n1-rtl me-2"></i>Send Invoice</span
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
                <p>Sales Order not found.</p>
            </div>
        </div>
        <!-- / Content -->
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSalesOrderStore } from '~/stores/sales-order'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const salesOrderStore = useSalesOrderStore()
const route           = useRoute()
const toast           = useToast();
const formatRupiah    = useFormatRupiah()

const { salesOrder, loading } = storeToRefs(salesOrderStore)
const soId = route.query.id

const isReturned = (item) => {
    // Add safety check for salesReturnItems availability
    if (!item.salesReturnItems || !Array.isArray(item.salesReturnItems)) {
        return false;
    }
    // An item is returned if it's part of any sales return that has been approved.
    return item.salesReturnItems.some(ri => ri.salesReturn && ri.salesReturn.status === 'approved');
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
    
    if (typeof soIdToFetch === 'string' && soIdToFetch.trim() !== '') {
        loading.value = true
        try {
            await salesOrderStore.getSalesOrderDetails(soIdToFetch)
        } catch (error) {
            console.error("❌ Failed to refresh SO details:", error)
            
            // Show user-friendly error message
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memuat Data',
                text: `Tidak dapat memuat detail Sales Order dengan ID: ${soIdToFetch}. ${error.message || 'Silakan coba lagi.'}`,
                confirmButtonText: 'OK'
            })
        } finally {
            loading.value = false
        }
    } else {
        console.error('❌ Invalid soId:', soIdToFetch);
        Swal.fire({
            icon: 'error',
            title: 'Parameter Tidak Valid',
            text: 'ID Sales Order tidak valid atau kosong.',
            confirmButtonText: 'OK'
        })
    }
}

async function updateStatusPartial(itemId, status, receivedQty) {
    // Validasi: Cek apakah sales order sudah delivered
    if (isDelivered.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Aksi Tidak Diizinkan',
            text: 'Sales Order sudah dalam status DELIVERED dan tidak dapat diubah lagi. Jika ada perubahan yang diperlukan, silakan buat Sales Return.',
            confirmButtonText: 'Mengerti'
        })
        return
    }

    const item = salesOrder.value.salesOrderItems.find(i => i.id === itemId)

    if (!item) {
        console.error('Item not found!')
        return
    }

    if (receivedQty > item.quantity) {
        Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            text: 'Quantity yang diterima tidak boleh melebihi quantity yang dipesan!',
        })
        await refreshSalesOrderDetails()
        return
    }

    try {
        await salesOrderStore.updateStatusPartial(itemId, status, receivedQty)
        await refreshSalesOrderDetails()
    } catch (error) {
        console.error('Failed to update status:', error)
        Swal.fire({
            icon: 'error',
            title: 'Update Gagal',
            text: 'Terjadi kesalahan saat memperbarui status item.',
        })
    }
}

async function toggleAllItemsStatus(event) {
    // Validasi: Cek apakah sales order sudah delivered
    if (isDelivered.value) {
        event.target.checked = allItemsCompleted.value // Reset checkbox
        Swal.fire({
            icon: 'warning',
            title: 'Aksi Tidak Diizinkan',
            text: 'Sales Order sudah dalam status DELIVERED dan tidak dapat diubah lagi. Jika ada perubahan yang diperlukan, silakan buat Sales Return.',
            confirmButtonText: 'Mengerti'
        })
        return
    }

    const isChecked = event.target.checked
    
    if (!salesOrder.value || !salesOrder.value.salesOrderItems || salesOrder.value.salesOrderItems.length === 0) {
        return
    }

    if (isChecked) {
        const result = await Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin mengubah status semua item menjadi selesai?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, ubah semua',
            cancelButtonText: 'Batal'
        })

        if (!result.isConfirmed) {
            event.target.checked = false
            return
        }
    }

    try {
        loading.value = true
        const itemsToUpdate = salesOrder.value.salesOrderItems.filter(item => !isReturned(item))
        
        for (const item of itemsToUpdate) {
            const newStatus = isChecked ? true : false
            const deliveredQty = isChecked ? item.quantity : item.deliveredQty
            
            try {
                await salesOrderStore.updateStatusPartial(item.id, newStatus, deliveredQty)
            } catch (error) {
                console.error(`Failed to update item ${item.id}:`, error)
            }
        }
        await refreshSalesOrderDetails()
        
        toast.success({
            title: 'Berhasil!',
            message: `Status semua item berhasil ${isChecked ? 'diubah menjadi selesai' : 'direset'}`,
            icon: 'ri-check-line',
            timeout: 3000,
            position: 'topRight',
            layout: 2,
        })
    } catch (error) {
        console.error('Failed to update all items status:', error)
        toast.error({
            title: 'Gagal!',
            message: 'Terjadi kesalahan saat memperbarui status semua item.',
            icon: 'ri-close-line',
            timeout: 3000,
            position: 'topRight',
            layout: 2,
        })
        // Reset checkbox pada error
        event.target.checked = !isChecked
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

// Computed property untuk mengecek apakah semua item sudah completed
const allItemsCompleted = computed(() => {
    if (!salesOrder.value || !salesOrder.value.salesOrderItems || salesOrder.value.salesOrderItems.length === 0) {
        return false
    }
    
    // Return true hanya jika semua item statusPartial = true dan tidak ada yang di-return
    return salesOrder.value.salesOrderItems.every(item => 
        item.statusPartial === true && !isReturned(item)
    )
})

onMounted(refreshSalesOrderDetails)
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
</style>