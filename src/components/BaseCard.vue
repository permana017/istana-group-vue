<template>
  <component
    :is="asTag"
    v-bind="$attrs"
    :class="[
      'bg-white border border-gray-200 rounded-2xl',
      paddingClass,
      shadow ? 'shadow-sm' : '',
      className,
    ]"
  >
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  as: { type: String, default: "div" },
  padded: { type: Boolean, default: true },
  shadow: { type: Boolean, default: false },
  class: { type: String, default: "" },
});

const asTag = props.as;
const paddingClass = props.padded ? "p-6" : "";
const className = props.class;
</script>
