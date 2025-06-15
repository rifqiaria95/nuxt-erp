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

export interface Product {
  id: number
  sku: string
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
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/product')
        const data = await response.json()
        this.product = (data.data || data).map((item: any) => ({
          id: item.id,
          sku: item.sku,
          unitId: item.unitId,
          stockMin: item.stockMin,
          priceBuy: item.priceBuy,
          priceSell: item.priceSell,
          isService: item.isService,
          categoryId: item.categoryId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          category: item.category
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
