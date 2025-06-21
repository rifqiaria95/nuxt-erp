<template>
    <div class="modal fade" :id="id" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="row">
                        <div class="text-center mb-6">
                        <h4 class="modal-title mb-2 pb-0">{{ title }}</h4>
                        <p>{{ description }}</p>
                        </div>
                        <div v-if="validationErrors.length" class="alert alert-danger">
                            <ul>
                                <li v-for="err in validationErrors" :key="err.message || err">
                                {{ typeof err === 'string' ? err : err.message }}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Judul Modal Default'
  },
  description: {
    type: String,
    default: 'Deskripsi Modal Default'
  },
  validationErrorsFromParent: {
    type: Array,
    default: () => []
  }
});

const validationErrors = ref([]); 

// Watch for changes in the prop and update the local ref
watch(() => props.validationErrorsFromParent, (newVal) => {
  validationErrors.value = newVal;
});
</script>

<style scoped>

</style>