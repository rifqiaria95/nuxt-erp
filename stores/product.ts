import { defineStore } from 'pinia'

export interface Category {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface Unit {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

export interface ProductCustomer {
  id: number
  productId: number
  customerId: number
  priceSell: number
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: number
  sku: string
  name: string
  unitId: number
  stockMin: number
  priceBuy: number
  priceSell: number
  isService: boolean
  categoryId: number
  createdAt: string
  updatedAt: string
  category?: Category
  unit?: Unit
  customer?: Customer
  productCustomer?: ProductCustomer
}

interface ProductState {
  product: Product[]
  loading: boolean
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    product: [],
    loading: false
  }),
  actions: {
    async fetchProduct() {
      try {
        this.loading = true;

        const { $api } = useNuxtApp();
        const url = `${$api.product()}`;

        const csrfResponse = await fetch($api.csrfToken(), { credentials: 'include' });
        const csrfData = await csrfResponse.json();
        const csrfToken = csrfData.token;
        const token = localStorage.getItem('token');


        if (!csrfToken) {
          throw new Error('CSRF token not found. Cannot proceed with request.');
        }

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-CSRF-TOKEN': csrfToken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        const data = await response.json()
        this.product = (data.data || data).map((item: any) => ({
          id        : item.id,
          sku       : item.sku,
          name      : item.name,
          unitId    : item.unitId,
          stockMin  : item.stockMin,
          priceBuy  : item.priceBuy,
          isService : item.isService,
          categoryId: item.categoryId,
          createdAt : item.createdAt,
          updatedAt : item.updatedAt,
          category  : item.category
            ? {
                id: item.category.id,
                name: item.category.name,
                createdAt: item.category.createdAt,
                updatedAt: item.category.updatedAt,
              }
            : undefined,
          unit: item.unit
            ? {
                id: item.unit.id,
                name: item.unit.name,
                createdAt: item.unit.createdAt,
                updatedAt: item.unit.updatedAt,
              }
            : undefined,
          customer: item.customer
            ? {
                id: item.customer.id,
                name: item.customer.name,
                createdAt: item.customer.createdAt,
                updatedAt: item.customer.updatedAt,
              }
            : undefined,
          productCustomer: item.productCustomer
            ? {
                id: item.productCustomer.id,
                productId: item.productCustomer.productId,
                customerId: item.productCustomer.customerId,
                priceSell: item.productCustomer.priceSell,
                createdAt: item.productCustomer.createdAt,
                updatedAt: item.productCustomer.updatedAt,
              }
            : undefined,
        }))
      } catch (error) {
        console.error('Gagal mengambil data product:', error)
      } finally {
        this.loading = false
      }
    },

    addProduct(product: Product) {
        this.product.push(product) 
    },
    removeProduct(productId: number) {
        this.product = this.product.filter(product => product.id !== productId)
    },
    updateProduct(updatedProduct: Product) {
        const index = this.product.findIndex(product => product.id === updatedProduct.id)
        if (index !== -1) {
            this.product[index] = updatedProduct
        }
    },
    getProductBySku(sku: string): Product | undefined {
      return this.product.find(product => product.sku.toLowerCase() === sku.toLowerCase())
    },
    getProductById(id: number): Product | undefined {
      return this.product.find(product => product.id === id)
    }
  }
})
