import { defineStore } from 'pinia'

export interface Pegawai {
    id: number
    name: string
    description?: string
}

interface PegawaiState {
    pegawai: Pegawai[]
    loading: boolean
}

export const usePegawaiStore = defineStore('pegawai', {
    state: (): PegawaiState => ({
        pegawai: [],
        loading: false,
    }),
    actions: {
        async fetchPegawai() {
            this.loading = true
            try {
                const response = await fetch('http://localhost:3333/api/pegawai')
                const data = await response.json()
                this.pegawai = data.data 
            } catch (error) {
                console.error('Failed to fetch pegawai:', error)
            } finally {
                this.loading = false
            }
        },
        addPegawai(pegawai: Pegawai) {
            this.pegawai.push(pegawai) 
        },
        removePegawai(pegawaiId: number) {
            this.pegawai = this.pegawai.filter(pegawai => pegawai.id !== pegawaiId)
        },
        updatePegawai(updatedPegawai: Pegawai) {
            const index = this.pegawai.findIndex(pegawai => pegawai.id === updatedPegawai.id)
            if (index !== -1) {
                this.pegawai[index] = updatedPegawai
            }
        }
    },
})