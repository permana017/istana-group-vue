<script setup>
import { RouterView } from "vue-router";
import ToastContainer from "@/components/ToastContainer.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <ToastContainer>
      <RouterView />
    </ToastContainer>
  </div>
</template>

<style scoped></style>
