<template>
  <div class="flex items-center gap-1" aria-label="rating">
    <div class="flex items-center">
      <component
        v-for="n in 5"
        :key="n"
        :is="n <= full ? SolidStar : OutlineStar"
        class="w-4 h-4"
        :class="n <= full ? 'text-yellow-500' : 'text-gray-300'"
      />
    </div>
    <span v-if="showValue" class="ml-1 text-xs text-gray-600">{{
      value.toFixed(1)
    }}</span>
    <span v-if="count" class="ml-1 text-xs text-gray-500">({{ count }})</span>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { StarIcon as SolidStar } from "@heroicons/vue/24/solid";
import { StarIcon as OutlineStar } from "@heroicons/vue/24/outline";

const props = defineProps({
  value: { type: Number, default: 0 },
  count: { type: Number, default: 0 },
  showValue: { type: Boolean, default: false },
});

const full = computed(() =>
  Math.round(Math.max(0, Math.min(5, props.value || 0)))
);
</script>
