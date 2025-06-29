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
                                <h5 class="mb-6">Purchase Number : {{ purchaseOrder.noPo }}</h5>
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
                                        <input
                                          type="number"
                                          class="form-control"
                                          v-model="item.receivedQty"
                                          @input="item.receivedQty = Math.floor(Number(item.receivedQty) || 0)"
                                          style="width: 80px;"
                                          :disabled="item.statusPartial"
                                        />
                                    </td>
                                    <td>{{ formatRupiah(Number(item.price) * Number(item.quantity)) }}</td>
                                    <td>
                                        <label class="switch switch-success">
                                            <input type="checkbox" class="switch-input" :checked="item.statusPartial" @change="updateStatusPartial(item.id, !item.statusPartial, item.receivedQty)" />
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
                <p>Purchase Order not found.</p>
            </div>
        </div>
        <!-- / Content -->
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePurchaseOrderStore } from '~/stores/purchaseOrder'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const purchaseOrderStore = usePurchaseOrderStore()
const route              = useRoute()
const formatRupiah       = useFormatRupiah()

const { purchaseOrder, loading } = storeToRefs(purchaseOrderStore)
const poId = route.query.id

async function refreshPurchaseOrderDetails() {
    const poIdToFetch = Array.isArray(poId) ? poId[0] : poId;
    if (typeof poIdToFetch === 'string') {
        loading.value = true
        try {
            await purchaseOrderStore.getPurchaseOrderDetails(poIdToFetch)
        } catch (error) {
            console.error("Failed to refresh PO details:", error)
        } finally {
            loading.value = false
        }
    }
}

async function updateStatusPartial(itemId, status, receivedQty) {
    const item = purchaseOrder.value.purchaseOrderItems.find(i => i.id === itemId)

    if (!item) {
        console.error('Item not found!')
        return
    }

    if (status && (receivedQty == 0 || receivedQty == null)) {
        Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            text: 'Jumlah yang diterima tidak boleh 0!',
        })
        await refreshPurchaseOrderDetails()
        return
    }

    if (receivedQty > item.quantity) {
        Swal.fire({
            icon: 'error',
            title: 'Validasi Gagal',
            text: 'Quantity yang diterima tidak boleh melebihi quantity yang dipesan!',
        })
        await refreshPurchaseOrderDetails()
        return
    }

    try {
        await purchaseOrderStore.updateStatusPartial(itemId, status, receivedQty)
        await refreshPurchaseOrderDetails()
    } catch (error) {
        console.error('Failed to update status:', error)
        Swal.fire({
            icon: 'error',
            title: 'Update Gagal',
            text: 'Terjadi kesalahan saat memperbarui status item.',
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

onMounted(refreshPurchaseOrderDetails)
</script>

<style scoped>
    .invoice-preview-header {
        background-color: #F2F3F4;
    }
</style>