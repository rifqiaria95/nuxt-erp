<template>
  <div class="point-of-sale">
    <slot />
  </div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap'
    }
  ]
})
</script>

<style>
body {
  font-family: "Poppins", sans-serif;
  margin: auto;
}
</style>