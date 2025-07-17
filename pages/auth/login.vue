<template>
  <div class="position-relative">
    <div class="authentication-wrapper authentication-basic container-p-y p-4 p-sm-0">
      <div class="authentication-inner py-6">
        <div class="card p-md-7 p-1">
          <div class="app-brand justify-content-center mt-5">
            <a href="/" class="app-brand-link gap-2">
              <span class="app-brand-logo demo">
                <img src="/public/img/branding/logo.png" alt="" height="40" />
              </span>
              <span class="app-brand-text demo text-heading fw-semibold">Kainnova</span>
            </a>
          </div>
          <div class="card-body mt-1">
            <h4 class="mb-1">Welcome to Kainnova! 👋</h4>
            <p class="mb-5">Please sign-in to your account and start the adventure</p>

            <form class="mb-5" @submit.prevent="handleLogin">
              <div class="form-floating form-floating-outline mb-5">
                <input
                  type="text"
                  class="form-control"
                  id="email"
                  v-model="email"
                  placeholder="Enter your email or username"
                  autofocus
                  required
                />
                <label for="email">Email or Username</label>
              </div>
              <div class="mb-5">
                <div class="form-password-toggle">
                  <div class="input-group input-group-merge">
                    <div class="form-floating form-floating-outline">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        id="password"
                        class="form-control"
                        v-model="password"
                        placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                        required
                        aria-describedby="password"
                      />
                      <label for="password">Password</label>
                    </div>
                    <span class="input-group-text cursor-pointer" @click="togglePassword">
                      <i :class="showPassword ? 'ri-eye-line' : 'ri-eye-off-line'"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div class="mb-5 d-flex justify-content-between mt-5">
                <div class="form-check mt-2">
                  <input class="form-check-input" type="checkbox" id="remember-me" />
                  <label class="form-check-label" for="remember-me"> Remember Me </label>
                </div>
                <NuxtLink to="/auth/forgot-password" class="float-end mb-1 mt-2">
                  <span>Forgot Password?</span>
                </NuxtLink>
              </div>
              <div class="mb-5">
                <button class="btn btn-primary d-grid w-100" type="submit" :disabled="pending">
                  <span v-if="pending">Signing In...</span>
                  <span v-else>Sign in</span>
                </button>
              </div>
            </form>
            <p v-if="error" class="text-danger mt-3">{{ error }}</p>
          </div>
        </div>
        <img
          alt="mask"
          src="/img/illustrations/auth-basic-login-mask-light.png"
          class="authentication-image d-none d-lg-block"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  definePageMeta({
      layout: 'auth',
      middleware: 'redirect-auth',
  })

  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '~/stores/user';

  const { $api }  = useNuxtApp()
  const toast     = useToast();
  const userStore = useUserStore();
  const router    = useRouter();

  const email      = ref('');
  const password   = ref('');
  const pending    = ref(false);
  const error      = ref(null);


  const handleLogin = async () => {
    pending.value = true;
    error.value = null;
    try {
      // console.log('Login endpoint:', $api.login());
      const response = await fetch($api.login(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch (e) {
        }
        error.value = errorData?.message || `Terjadi kesalahan (${response.status})`;
        toast.error({
          title: 'Login Gagal!',
          icon: 'ri-close-line',
          message: `Gagal login: ${error.value}`,
          timeout: 3000,
          position: 'bottomRight',
          layout: 2,
        });
        pending.value = false;
        return;
      }

      const data = await response.json();
      // console.log('Login response:', data);

      if (!data.token || !data.token.token) {
        error.value = 'Token tidak ditemukan pada response server.';
        toast.error({
          title: 'Login Gagal!',
          icon: 'ri-close-line',
          message: `Gagal login: ${error.value}`,
          timeout: 3000,
          position: 'bottomRight',
          layout: 2,
        });
        pending.value = false;
        return;
      }

      localStorage.setItem('token', data.token.token);
      userStore.setUser(data.user)
      toast.success({
        title: 'Login Berhasil!',
        icon: 'ri-check-line',
        message: 'Selamat datang',
        timeout: 3000,
        position: 'bottomRight',
        layout: 2,
      })
      router.push('/dashboard');
      // console.log('LOGIN RESPONSE', response)
    } catch (err) {
      // console.log('LOGIN ERROR', err)
      error.value = err?.data?.message || err.message || 'Terjadi kesalahan saat login.';
      toast.error({
        title: 'Login Gagal!',
        icon: 'ri-close-line',
        message: `Gagal login: ${error.value}`,
        timeout: 3000,
        position: 'bottomRight',
        layout: 2,
      });
    } finally {
      pending.value = false;
    }
  };

  const showPassword = ref(false);
  const togglePassword = () => {
    showPassword.value = !showPassword.value;
  };
</script>

<style scoped>
</style>