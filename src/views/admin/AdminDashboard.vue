<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-semibold">Admin Dashboard</h1>
    <div class="flex gap-3">
      <RouterLink to="/admin/products" class="btn-primary"
        >Manage Products</RouterLink
      >
      <RouterLink to="/admin/users" class="btn-secondary"
        >Manage Users</RouterLink
      >
      <RouterLink to="/admin/orders" class="btn-secondary"
        >View Orders</RouterLink
      >
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>
