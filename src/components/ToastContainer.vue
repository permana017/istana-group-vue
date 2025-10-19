<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="t in toast.toasts"
      :key="t.id"
      class="min-w-[260px] max-w-xs rounded-lg shadow-lg text-white px-4 py-3 flex items-start gap-3"
      :class="bgClass(t.type)"
    >
      <span class="text-sm leading-5">{{ t.message }}</span>
      <button class="ml-auto text-white/80 hover:text-white" @click="toast.remove(t.id)">✕</button>
    </div>
  </div>
  
  <slot />
</template>

<script setup>
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()

const bgClass = (type) => {
  switch (type) {
    case 'success': return 'bg-emerald-600'
    case 'error': return 'bg-red-600'
    case 'warn': return 'bg-amber-600'
    default: return 'bg-gray-800'
  }
}
</script>
