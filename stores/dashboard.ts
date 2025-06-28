import { defineStore } from 'pinia';

type AssociationRule = {
  antecedent: string[]
  consequent: string[]
  confidence: number
  support: number
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    supports: null as number[] | null,
    chartData: {
      labels: [] as string[],
      datasets: [
        {
          label: 'Confidence',
          backgroundColor: '#42A5F5',
          data: [] as number[],
        },
      ],
    },
  }),
  getters: {
    chartOptions(state) {
      return {
        indexAxis: 'x' as const,
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const confidenceValue = ctx.raw
                const dataIndex = ctx.dataIndex
                let supportValue: string | number = '-'
                if (Array.isArray(state.supports) && typeof state.supports[dataIndex] !== 'undefined') {
                  supportValue = state.supports[dataIndex]
                }
                return [
                  `Confidence: ${(confidenceValue * 100).toFixed(1)}%`,
                  `Support: ${supportValue}`,
                ]
              },
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 1,
          },
        },
      }
    },
  },
  actions: {
    async fetchAssociationRules() {
      const { $api } = useNuxtApp()
      const token = localStorage.getItem('token')

      try {
        const rules = await $fetch<AssociationRule[]>($api.associations(), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
        })

        if (rules) {
          const labels = rules.map(
            (rule) => `${rule.antecedent.join(', ')} → ${rule.consequent.join(', ')}`
          )
          const confidences = rules.map((rule) => rule.confidence)
          this.supports = Array.isArray(rules) ? rules.map((rule) => rule.support) : null

          this.chartData = {
            labels,
            datasets: [
              {
                label: 'Confidence',
                backgroundColor: '#42A5F5',
                data: confidences,
              },
            ],
          }
        }
      } catch (error) {
        console.error('Error fetching association rules:', error)
      }
    },
  },
})

