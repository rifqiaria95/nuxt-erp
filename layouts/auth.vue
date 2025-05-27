<template>
  <div>
    <Head>
      <Title>Login - My ERP App</Title>
      <Link rel="stylesheet" href="/vendor/css/pages/page-auth.css" />
      <Link rel="stylesheet" href="/vendor/css/pages/page-misc.css" />
      </Head>

    <slot />

    <ClientOnly>
      <Script src="/vendor/js/helpers.js" type="text/javascript" body />
      <Script src="/js/config.js" type="text/javascript" body />
      </ClientOnly>
  </div>
</template>

<script setup>

</script>

<style>

</style>