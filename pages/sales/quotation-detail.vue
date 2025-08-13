<template>
    <div class="content-wrapper">
        <!-- Content -->
        <div class="container-xxl flex-grow-1 container-p-y">
            <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <template v-else-if="quotation">
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
                                <p class="mb-1">{{ quotation.perusahaan.alamatPerusahaan }}</p>
                                <p class="mb-1">{{ quotation.perusahaan.kodePerusahaan }}</p>
                                <p class="mb-0">{{ quotation.perusahaan.npwpPerusahaan }}</p>
                            </div>
                            <div>
                                <h5 class="mb-6">Quotation Number : {{ quotation.noQuotation }}</h5>
                                <div class="mb-1">
                                <span>Date Issues: </span>
                                <span>{{ new Date(quotation.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                                </div>
                                <div>
                                <span>Date Due: </span>
                                <span>{{ new Date(quotation.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div class="card-body py-6 px-0">
                            <div class="d-flex justify-content-between flex-wrap gap-6">
                            <div>
                                <h6>Invoice To:</h6>
                                <p class="mb-1">{{ quotation.up }}</p>
                                <p class="mb-1">{{ quotation.customer.name }}</p>
                                <p class="mb-1">{{ quotation.customer.address }}</p>
                                <p class="mb-1">{{ quotation.customer.phone }}</p>
                                <p class="mb-0">{{ quotation.customer.email }}</p>
                            </div>
                            <div>
                                <h6>Bill To:</h6>
                                <p class="mb-1">{{ quotation.perusahaan.nmPerusahaan }}</p>
                                <p class="mb-1">{{ quotation.perusahaan.alamatPerusahaan }}</p>
                            </div>
                            </div>
                        </div>
                        <div class="table-responsive border rounded-4 border-bottom-0">
                            <table class="table m-0">
                            <thead>
                                <tr>
                                <th>Part Number</th>
                                <th>Item</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in quotation.quotationItems" :key="item.id">
                                    <td class="text-nowrap text-heading">{{ item.product.sku }}</td>
                                    <td class="text-nowrap text-heading">{{ item.product.name }}</td>
                                    <td class="text-nowrap">{{ item.description }}</td>
                                    <td>{{ formatRupiah(item.price) }}</td>
                                    <td>{{ Math.floor(Number(item.quantity) || 0) }}</td>
                                    <td>{{ formatRupiah(Number(item.price) * Number(item.quantity)) }}</td>
                                    <td>{{ formatRupiah(Number(item.subtotal)) }}</td>
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
                                    <span>{{ quotation.createdBy }}</span>
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
                                    <p class="fw-medium mb-1">{{ quotation.discountPercent }}%</p>
                                    <p class="fw-medium mb-1">{{ formatRupiah(totalBeforeTax) }}</p>
                                    <p class="fw-medium mb-1 border-bottom pb-2">{{ quotation.taxPercent }}%</p>
                                    <p class="fw-medium mb-0 pt-2">{{ formatRupiah(quotation.total) }}</p>
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
                                    >{{ quotation.description }}</span
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
                        @click="printQuotation(quotation.id)"
                        >
                        <span class="d-flex align-items-center justify-content-center text-nowrap"
                            ><i class="ri-printer-line ri-16px scaleX-n1-rtl me-2"></i>Print Quotation</span
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
                <p>Quotation not found.</p>
            </div>
        </div>
        <!-- / Content -->
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Quotation Detail',
    description: 'Quotation Detail',
    keywords: 'Quotation Detail, Kainnova Digital Solutions',
    author: 'Kainnova Digital Solutions',
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0'
})
import { computed, onMounted } from 'vue'
import { useQuotationStore } from '~/stores/quotation'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const quotationStore = useQuotationStore()
const route              = useRoute()
const router             = useRouter()
const formatRupiah       = useFormatRupiah()
const toast              = useToast()

const { quotation, loading } = storeToRefs(quotationStore)
const quotationId = route.query.id

// ✅ ACTION METHODS
const printQuotation = (id) => {
  router.push({
    path: '/sales/cetak-quotation',
    query: { id: id, print: true }
  })
}

async function refreshQuotationDetails() {
    const quotationIdToFetch = Array.isArray(quotationId) ? quotationId[0] : quotationId;
    
    
    
    if (typeof quotationIdToFetch === 'string') {
        loading.value = true
        try {
            await quotationStore.getQuotationDetails(quotationIdToFetch)
        } catch (error) {
        console.error("Failed to refresh quotation details:", error)
        } finally {
            loading.value = false
        }
    } else {
        console.error('quotationIdToFetch is not a string:', quotationIdToFetch);
    }
}

const totalBeforeTax = computed(() => {
    if (quotation.value && quotation.value.quotationItems) {
        const subtotal = quotation.value.quotationItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0)
        const discount = subtotal * (Number(quotation.value.discountPercent) / 100)
        return subtotal - discount
    }
    return 0
})

onMounted(refreshQuotationDetails)
</script>

<style scoped>
    .invoice-preview-header {
        background-color: #F2F3F4;
    }
</style>