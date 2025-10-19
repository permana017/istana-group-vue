<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">Welcome</h1>
    <p class="text-gray-700">Browse the latest products.</p>
    <RouterLink to="/products" class="btn-primary w-fit"
      >Go to Products</RouterLink
    >
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
