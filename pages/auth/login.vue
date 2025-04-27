<template>
    <div class="container-scroller">
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth px-0">
          <div class="row w-100 mx-0">
            <div class="col-lg-4 mx-auto">
              <div class="auth-form-light text-left py-5 px-4 px-sm-5">
                <div class="brand-logo">
                  <img src="/images/logo.png" alt="logo">
                </div>
                <h4>Hello! let's get started</h4>
                <h6 class="fw-light">Sign in to continue.</h6>
                <form @submit.prevent="handleLogin" class="pt-3">
                  <!-- Username Field -->
                  <div class="form-group">
                    <input 
                      type="text" 
                      class="form-control form-control-lg" 
                      v-model="username" 
                      placeholder="Username" 
                      required
                    >
                  </div>
                  
                  <!-- Password Field -->
                  <div class="form-group">
                    <input 
                      type="password" 
                      class="form-control form-control-lg" 
                      v-model="password" 
                      placeholder="Password" 
                      required
                    >
                  </div>
  
                  <!-- Login Button -->
                  <div class="mt-3 d-grid gap-2">
                    <button 
                      type="submit" 
                      class="btn btn-block btn-primary btn-lg fw-medium auth-form-btn"
                    >
                      SIGN IN
                    </button>
                  </div>
  
                  <!-- Other Options -->
                  <div class="my-2 d-flex justify-content-between align-items-center">
                    <div class="form-check">
                      <label class="form-check-label text-muted">
                        <input type="checkbox" class="form-check-input"> Keep me signed in
                      </label>
                    </div>
                    <a href="#" class="auth-link text-black">Forgot password?</a>
                  </div>
                </form>
  
                <!-- Social Login Option (Optional) -->
                <div class="mb-2 d-grid gap-2">
                  <button type="button" class="btn btn-block btn-facebook auth-form-btn">
                    <i class="ti-facebook me-2"></i> Connect using Facebook
                  </button>
                </div>
  
                <!-- Register Option -->
                <div class="text-center mt-4 fw-light">
                  Don't have an account? <a href="register.html" class="text-primary">Create</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>

    definePageMeta({
        layout: 'auth'
    })

    import { ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    
    // Variables for login form inputs
    const username = ref('');
    const password = ref('');
    const router = useRouter();
    
    // Handle login
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/login', {
            username: username.value,
            password: password.value,
            });

            const token = response.data.token;

            localStorage.setItem('token', token);

            router.push('/');
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            alert('Login failed. Please check your credentials.');
        }
    };

</script>
  
<style scoped>
    .auth-form-light {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 30px;
        background-color: #f9f9f9;
    }

    .auth-form-btn {
        background-color: #007bff;
        color: white;
    }

    .auth-form-btn:hover {
        background-color: #0056b3;
    }
</style>
  