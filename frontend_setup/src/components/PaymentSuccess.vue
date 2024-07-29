<script setup>
import { onMounted } from 'vue';

onMounted(async() => {
  try {
    const data = await fetch(`http://localhost:3000/success/`)
  } catch (error) {
    console.error("some error Occured.." , error);
  }
});

</script>

<template>
  <div>
    <h1 class="text-green">Payment Successful!</h1>
    <p class="text-green">Thank you for Completing Payment.</p>
  </div>
</template>

<style scoped>

</style>