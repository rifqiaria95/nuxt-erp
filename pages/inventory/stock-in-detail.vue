<template>
    <div class="content-wrapper">
        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">Detail Stock in</h4>
            <p class="mb-6">
            Berikut di bawah ini data detail stock in
            </p>
            <div v-if="loading" class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else-if="error" class="alert alert-danger">{{ error.message }}</div>
            <div v-else-if="stockIn" class="row g-6">
                <div class="col-4">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h5 class="mb-1">
                                        Detail Stock In
                                    </h5>
                                </div>
                            </div>
                             <div class="row mt-4">
                                <div class="col-md-6">
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><strong>Tanggal:</strong> {{ new Date(stockIn.date).toLocaleDateString() }}</li>
                                        <li class="mb-2"><strong>Gudang:</strong> {{ stockIn.warehouse?.name }}</li>
                                        <li class="mb-2"><strong>No. Purchase Order:</strong> {{ stockIn.purchaseOrder?.noPo || '-' }}</li>
                                        <li class="mb-2"><strong>Status:</strong> <span :class="['badge', getStatusClass(stockIn.status)]">{{ stockIn.status }}</span></li>
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
                                    <h4 class="mb-1">Nomor Stock In: {{ stockIn.noSi }}</h4>
                                    <p class="text-muted mb-0" style="font-size: 0.95em;">
                                        Berikut adalah informasi singkat mengenai dokumen Stock In ini, termasuk nomor SI, tanggal, gudang tujuan, dan status terkini. Pastikan data sudah sesuai sebelum melakukan proses lebih lanjut.
                                    </p>
                                </div>
                                <NuxtLink to="/inventory/stock-in" class="btn btn-sm btn-primary">
                                    <i class="ri-arrow-left-line me-1"></i>
                                </NuxtLink>
                            </div>
                             <div class="row mt-4">
                                <div class="col-md-6">
                                    <ul class="list-unstyled">
                                        <li class="mb-2"><strong>Posted by:</strong> {{ stockIn.postedByUser?.fullName || '-' }}</li>
                                        <li class="mb-2"><strong>Description:</strong> {{ stockIn.description || '-' }}</li>
                                        <li class="mb-2"><strong>Posted At:</strong> {{ new Date(stockIn.postedAt).toLocaleDateString() }}</li>
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
                            <MyDataTable :data="stockIn.stockInDetails || []" :loading="loading">
                                <Column field="product.name" header="Produk" :sortable="true"></Column>
                                <Column field="description" header="Deskripsi" :sortable="true"></Column>
                                <Column field="quantity" header="Quantity Stock In" :sortable="true">
                                    <template #body="slotProps">
                                        {{ slotProps.data.quantity || 0 }}
                                    </template>
                                </Column>
                            </MyDataTable>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="alert alert-danger" role="alert">
                Stock In tidak ditemukan.
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
import { useStockStore } from '~/stores/stockin'
import Swal from 'sweetalert2'
import { useDynamicTitle } from '~/composables/useDynamicTitle'

// Composables
const { setDetailTitle } = useDynamicTitle()

const route = useRoute()
const stockInStore = useStockStore()
const { selectedStockIn: stockIn, loading, error } = storeToRefs(stockInStore)

onMounted(async () => {
  const stockInId = route.query.id;
  if (stockInId) {
    try {
      await stockInStore.fetchStockInById(stockInId);
      setDetailTitle('Stock In', stockIn.value.noSi)
    } catch (e) {
      Swal.fire('Error', e.message || 'Gagal memuat detail stock in.', 'error');
    }
  } else {
    Swal.fire('Error', 'ID Stock In tidak ditemukan di URL.', 'error');
  }
});

onBeforeUnmount(() => {
    stockInStore.resetStockIn();
});

const getStatusClass = (status) => {
    const statusMap = {
        draft: 'bg-label-secondary',
        posted: 'bg-label-success',
    }
    return statusMap[status] || 'bg-label-info'
}
</script> 