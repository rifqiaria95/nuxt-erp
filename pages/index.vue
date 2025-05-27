<script setup>
import { useRouter } from '#app'

const router = useRouter()
const token = process.client ? localStorage.getItem('token') : null

if (process.client) {
  if (token) {
    router.push('/dashboard')
  } else {
    router.push('/auth/login')
  }
}
</script>