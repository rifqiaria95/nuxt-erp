<template>
  <DataTable
    :value="data"
    :paginator="true"
    :rows="rows"
    :rowsPerPageOptions="rowsPerPageOptions"
    :loading="loading"
    stripedRows
    :lazy="lazy"
    :totalRecords="totalRecords"
    responsiveLayout="scroll"
    v-bind="$attrs"
  >
    <slot></slot>

    <template #footer v-if="$slots.footer">
      <slot name="footer"></slot>
    </template>
  </DataTable>
</template>

<script setup>
import { defineProps, useAttrs } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  paginator: {
    type: Boolean,
    default: true
  },
  rows: {
    type: Number,
    default: 10
  },
  rowsPerPageOptions: {
    type: Array,
    default: () => [5, 10, 20, 50]
  },
  loading: {
    type: Boolean,
    default: false
  },
  lazy: {
    type: Boolean,
    default: false
  },
  totalRecords: {
    type: Number,
    default: 0
  }
});

const attrs = useAttrs();
</script>

<style scoped>
  

</style>