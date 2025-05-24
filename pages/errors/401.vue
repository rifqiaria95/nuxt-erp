<template>
    <div class="misc-wrapper">
      <h1 class="mb-2 mx-2" style="font-size: 6rem; line-height: 6rem">401</h1>
      <h4 class="mb-2">Anda tidak diizinkan mengakses halaman ini! 🔐</h4>
      <p class="mb-3 mx-2">Login dulu ya!</p>
      <div class="d-flex justify-content-center mt-12">
        <img
          src="/img/illustrations/misc-not-authorized-object.png"
          alt="misc-not-authorized"
          class="img-fluid misc-object d-none d-lg-inline-block"
          width="190" />
        <img
          src="/img/illustrations/misc-bg-light.png"
          alt="misc-not-authorized"
          class="misc-bg d-none d-lg-inline-block"
          data-app-light-img="illustrations/misc-bg-light.png"
          data-app-dark-img="illustrations/misc-bg-dark.png" />
        <div class="d-flex flex-column align-items-center">
          <img
            src="/img/illustrations/misc-not-authorized-illustration.png"
            alt="misc-not-authorized"
            class="img-fluid z-1"
            width="160" />
          <div>
            <a href="/auth/login" class="btn btn-primary text-center my-10">Login</a>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'auth'
})
</script>