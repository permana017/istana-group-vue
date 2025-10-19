<template>
  <div class="min-h-screen bg-gray-100">
    <AppHeader variant="admin" />
    <main class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <RouterView />
    </main>
  </div>
  
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
</script>
