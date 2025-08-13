<template>
  <div>
    <Head>
      <Title>{{ title ? title + ' - Kainnova Digital Solutions' : 'Kainnova Digital Solutions' }}</Title>
      <Meta name="description" :content="description" />
      <Meta name="keywords" :content="keywords" />
      <Meta name="author" :content="author" />
      <Meta name="robots" :content="robots" />
      <Meta name="viewport" :content="viewport" />
      <Meta name="generator" :content="generator" />
      <Link rel="stylesheet" href="/vendor/css/pages/page-auth.css" />
      <Link rel="stylesheet" href="/vendor/css/pages/page-misc.css" />
    </Head>

    <slot />
  </div>
</template>

<script setup>
  const route = useRoute();
  const title = route.meta.title;
  const description = route.meta.description;
  const keywords = route.meta.keywords;
  const author = route.meta.author;
  const robots = route.meta.robots;
  const viewport = route.meta.viewport;
</script>

<style>

</style>