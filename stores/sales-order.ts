import { defineStore } from 'pinia'

export interface SalesOrder {
  id             : number
  noSo           : string
  date           : string
  dueDate        : string
  customerId     : number
  createdBy      : number
  approvedBy     : number
  rejectedBy     : number
  deliveredBy    : number
  description    : string
  taxPercent     : number
  discountPercent: number
  total          : number
  status         : 'draft' | 'approved' | 'rejected' | 'delivered'
  createdAt      : string
  updatedAt      : string
}

interface SalesOrderState {
  salesOrders: SalesOrder[]
  salesOrder: SalesOrder | null
}