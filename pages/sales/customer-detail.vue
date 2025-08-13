<template>
  <div class="content-wrapper">
    <!-- Content -->
    <div class="container-xxl flex-grow-1 container-p-y">
      <div v-if="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="customer" class="row g-6">
        <div class="col-12">
          <div class="card mb-4">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h4 class="mt-6 mb-1">Detail Customer: {{ customer.name }}</h4>
                  <p class="mb-0">
                    Berikut adalah detail informasi untuk customer {{ customer.name }}.
                  </p>
                </div>
                <img 
                  :src="getCustomerLogo(customer.logo)" 
                  alt="Logo Customer" 
                  class="mt-8 ml-3 img-fluid" 
                  style="max-width: 200px; object-fit: contain;"
                  @error="(e) => handleImageError(e, '/img/default-customer-logo.png')"
                >
              </div>
              <div class="row mt-4">
                <div class="col-md-6">
                  <ul class="list-unstyled">
                    <li class="mb-2"><strong>Email:</strong> {{ customer.email }}</li>
                    <li class="mb-2"><strong>Telepon:</strong> {{ customer.phone }}</li>
                  </ul>
                </div>
                <div class="col-md-6">
                  <ul class="list-unstyled">
                    <li class="mb-2"><strong>Alamat:</strong> {{ customer.address }}</li>
                    <li class="mb-2"><strong>NPWP:</strong> {{ customer.npwp }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <!-- customer Products Table -->
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center flex-wrap">
              <h5 class="mb-0">Produk untuk {{ customer.name }}</h5>
            </div>
            <div class="card-datatable table-responsive py-3 px-3">
              <MyDataTable :data="customer.customerProducts" :loading="loading">
                <Column field="id" header="#" :sortable="true"></Column>
                <Column field="name" header="Nama Produk" :sortable="true"></Column>
                <Column field="priceSell" header="Harga Jual" :sortable="true">
                  <template #body="slotProps">
                    {{ formatRupiah(slotProps.data.priceSell) }}
                  </template>
                </Column>
              </MyDataTable>
            </div>
          </div>
          <!--/ customer Products Table -->
        </div>
      </div>
      <div v-else class="alert alert-danger" role="alert">
        Customer tidak ditemukan.
      </div>
    </div>
    <!-- / Content -->

    <div class="content-backdrop fade"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MyDataTable from '~/components/table/MyDataTable.vue'
import Column from 'primevue/column'
import { useCustomerStore } from '~/stores/customer'
import { storeToRefs } from 'pinia'
import { useDynamicTitle } from '~/composables/useDynamicTitle'
import { useImageUrl } from '~/composables/useImageUrl'
import { useFormatRupiah } from '~/composables/formatRupiah'

// Composables
const { setDetailTitle } = useDynamicTitle()
const { getCustomerLogo, handleImageError } = useImageUrl();

const route         = useRoute()
const formatRupiah  = useFormatRupiah()
const customerStore = useCustomerStore()
const customerId    = route.query.id

const { selectedCustomer: customer, loading } = storeToRefs(customerStore)



onMounted(async () => {
  if (customerId) {
    await customerStore.getCustomerDetails(customerId)
  }
  setDetailTitle('Customer', customer.value.name)
})
</script>