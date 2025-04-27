<script setup>
import { navigateTo } from '#app'

const token = process.client ? localStorage.getItem('token') : null

if (token) {
  navigateTo('/dashboard')
} else {
  navigateTo('/auth/login')
}
</script>
