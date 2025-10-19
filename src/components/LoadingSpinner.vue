<template>
  <div class="flex justify-center items-center p-4">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span v-if="text" class="ml-2 text-gray-600">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>