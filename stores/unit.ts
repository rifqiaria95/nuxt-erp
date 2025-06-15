import { defineStore } from 'pinia'

export interface Unit {
  id: number
  name: string
  symbol: string
}

interface UnitState {
  unit: Unit[]
  loading: boolean
}

export const useUnitStore = defineStore('unit', {
    state: (): UnitState => ({
    unit: [],
    loading: false
  }),
  actions: {
    async fetchUnit() {
      this.loading = true
      try {
        const response = await fetch('http://localhost:3333/api/unit')
        const data = await response.json()
        this.unit = data.data // ambil dari data.data
      } catch (error) {
        console.error('Failed to fetch unit:', error)
      } finally {
        this.loading = false
      }
    },

    addUnit(unit: Unit) {
        this.unit.push(unit) 
    },
    removeUnit(unitId: number) {
        this.unit = this.unit.filter(unit => unit.id !== unitId)
    },
    updateUnit(updatedUnit: Unit) {
        const index = this.unit.findIndex(unit => unit.id === updatedUnit.id)
        if (index !== -1) {
            this.unit[index] = updatedUnit
        }
    },
    getUnitByName(name: string): Unit | undefined {
      return this.unit.find(unit => unit.name.toLowerCase() === name.toLowerCase())
    },
    getUnitById(id: number): Unit | undefined {
      return this.unit.find(unit => unit.id === id)
    }
  }
})
