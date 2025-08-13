<template>
  <div class="invoice-print p-6">
    <Head>
      <Title>{{ title ? title + ' - Kainnova Digital Solutions' : 'Kainnova Digital Solutions' }}</Title>
      <Link rel="stylesheet" href="/vendor/css/pages/app-invoice-print.css" />
    </Head>
    <slot />
  </div>
</template>

<script setup>
  const route = useRoute();
  const title = route.meta.title;
</script>

<style>

</style>