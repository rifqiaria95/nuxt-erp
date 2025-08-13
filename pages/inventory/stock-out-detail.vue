<template>
    <div class="content-wrapper">
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">Detail Stock Out</h4>
            <p class="mb-6">
            Berikut di bawah ini data detail stock out
            </p>
            <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else-if="error" class="alert alert-danger">{{ error.message }}</div>
            <div v-else-if="selectedStockOut" class="row g-6">
                <div class="col-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="mb-1">
                                        Detail Stock Out
                                    </h5>
                                </div>
                            </div>
                             <div class="row mt-4">
                                <div class="col-md-12">
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><strong>Tanggal:</strong> {{ selectedStockOut.date ? new Date(selectedStockOut.date).toLocaleDateString() : '-' }}</li>
                                        <li class="mb-2"><strong>Gudang:</strong> {{ selectedStockOut.warehouse?.name || '-' }}</li>
                                        <li class="mb-2"><strong>No. Sales Order:</strong> {{ selectedStockOut.salesOrder?.noSo || '-' }}</li>
                                        <li class="mb-2"><strong>Status:</strong> <span :class="['badge', getStatusClass(selectedStockOut.status)]">{{ selectedStockOut.status }}</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-8">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h4 class="mb-1">Nomor Stock Out: {{ selectedStockOut.noSo }}</h4>
                                    <p class="text-muted mb-0" style="font-size: 0.95em;">
                                        Berikut adalah informasi singkat mengenai dokumen Stock Out ini, termasuk nomor SO, tanggal, gudang asal, dan status terkini. Pastikan data sudah sesuai sebelum melakukan proses lebih lanjut.
                                    </p>
                                </div>
                                <NuxtLink to="/inventory/stock-out" class="btn btn-sm btn-primary">
                                    <i class="ri-arrow-left-line me-1"></i>
                                </NuxtLink>
                            </div>
                             <div class="row mt-4">
                                <div class="col-md-12">
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><strong>Pengirim:</strong> {{ selectedStockOut.salesOrder?.deliveredByUser?.fullName || '-' }}</li>
                                        <li class="mb-2"><strong>Customer:</strong> {{ selectedStockOut.salesOrder?.customer?.name || '-' }}</li>
                                        <li class="mb-2"><strong>Created At:</strong> {{ selectedStockOut.createdAt ? new Date(selectedStockOut.createdAt).toLocaleDateString() : '-' }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="card-title mb-0">Daftar Produk</h5>
                        </div>
                         <div class="card-datatable table-responsive py-3 px-3">
                            <MyDataTable :data="selectedStockOut.salesOrder?.salesOrderItems || []" :loading="loading">
                                <Column field="product.name" header="Produk" :sortable="true"></Column>
                                <Column field="description" header="Deskripsi" :sortable="true"></Column>
                                <Column header="Dikirim / Dipesan" :sortable="false">
                                    <template #body="slotProps">
                                        {{ (slotProps.data.deliveredQty !== null) ? String(slotProps.data.deliveredQty).replace(/\.00$/, '') : 0 }} / {{ (slotProps.data.quantity !== null) ? String(slotProps.data.quantity).replace(/\.00$/, '') : 0 }}
                                    </template>
                                </Column>
                                <Column field="unit.name" header="Satuan" :sortable="true"></Column>
                            </MyDataTable>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="alert alert-danger" role="alert">
                Stock Out tidak ditemukan.
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Column from 'primevue/column'
import { useStockOutStore } from '~/stores/stockout'
import Swal from 'sweetalert2'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setDetailTitle } = useDynamicTitle()

const route = useRoute()
const stockOutStore = useStockOutStore()
const { selectedStockOut, loading, error } = storeToRefs(stockOutStore)

onMounted(async () => {
  const stockOutId = route.query.id;
  if (stockOutId) {
    try {
      await stockOutStore.fetchStockOutById(stockOutId);
      setDetailTitle('Stock Out', stockOut.value.noSo)
    } catch (e) {
      Swal.fire('Error', e.message || 'Gagal memuat detail stock out.', 'error');
    }
  } else {
    Swal.fire('Error', 'ID Stock Out tidak ditemukan di URL.', 'error');
  }
});

onBeforeUnmount(() => {
    stockOutStore.resetStockOut();
});

const getStatusClass = (status) => {
    const statusMap = {
        draft: 'bg-label-secondary',
        posted: 'bg-label-success',
    }
    return statusMap[status] || 'bg-label-info'
}
</script>