<template>
  <BaseCard :class="wrapperClass" :padded="false">
    <RouterLink v-if="to" :to="to" class="block focus:outline-none">
      <div class="relative bg-gray-50" :class="imageBoxClass">
        <img
          :src="product.image"
          :alt="product.title"
          :class="imgClass"
          loading="lazy"
        />
        <slot name="badge">
          <span
            v-if="!dense"
            class="absolute left-2 top-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"
          >
            {{ $t("list.official") }}
          </span>
        </slot>
      </div>
      <div class="p-3">
        <h2 :class="titleClass">{{ product.title }}</h2>
        <div class="mt-2 flex items-center gap-2" v-if="showPrice">
          <span class="text-lg font-bold text-gray-900">{{
            formatCurrency(product.price)
          }}</span>
          <span
            v-if="!dense && product.price > 50"
            class="text-xs text-gray-500 line-through"
            >{{ formatCurrency(product.price * 1.2) }}</span
          >
          <span
            v-if="!dense && product.price > 50"
            class="text-xs text-red-600 font-semibold"
            >20% OFF</span
          >
        </div>
        <div v-if="showRating" class="mt-2 flex items-center gap-2">
          <StarRating :value="ratingValue" :count="ratingCount" />
          <span v-if="!dense" class="text-[11px] text-gray-500"
            >{{ $t("list.soldPrefix") }} {{ soldCount }}</span
          >
        </div>
        <div v-if="!dense" class="mt-2 text-[11px] text-gray-500">Jakarta</div>
        <slot name="actions" />
      </div>
    </RouterLink>
    <template v-else>
      <div class="relative bg-gray-50" :class="imageBoxClass">
        <img
          :src="product.image"
          :alt="product.title"
          :class="imgClass"
          loading="lazy"
        />
      </div>
      <div class="p-3">
        <h2 :class="titleClass">{{ product.title }}</h2>
        <div class="mt-2 flex items-center gap-2" v-if="showPrice">
          <span class="text-lg font-bold text-gray-900">{{
            formatCurrency(product.price)
          }}</span>
        </div>
        <div v-if="showRating" class="mt-2 flex items-center gap-2">
          <StarRating :value="ratingValue" :count="ratingCount" />
          <span v-if="!dense" class="text-[11px] text-gray-500"
            >{{ $t("list.soldPrefix") }} {{ soldCount }}</span
          >
        </div>
        <slot name="actions" />
      </div>
    </template>
  </BaseCard>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";
import BaseCard from "@/components/BaseCard.vue";
import StarRating from "@/components/StarRating.vue";

const props = defineProps({
  product: { type: Object, required: true },
  to: { type: [String, Object], default: null },
  showRating: { type: Boolean, default: true },
  showPrice: { type: Boolean, default: true },
  dense: { type: Boolean, default: false },
});

const wrapperClass = computed(() =>
  props.dense
    ? "rounded-xl overflow-hidden"
    : "rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
);
const imageBoxClass = computed(() =>
  props.dense
    ? "aspect-[4/3] flex items-center justify-center"
    : "aspect-[4/3] flex items-center justify-center"
);
const imgClass = computed(() =>
  props.dense
    ? "max-h-[120px] object-contain"
    : "max-h-[180px] object-contain transition-transform duration-200 group-hover:scale-105"
);
const titleClass = computed(() =>
  props.dense
    ? "text-xs font-medium text-gray-900 line-clamp-2 min-h-[32px]"
    : "text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]"
);

const ratingValue = computed(() => {
  const p = props.product;
  // Prefer real rating if available
  if (p.rating && typeof p.rating.rate === "number")
    return Math.min(5, Math.max(1, p.rating.rate));
  // Fallback heuristic for fake store
  return Math.min(5, Math.max(1, Math.round((p.price % 5) + 3 - (p.id % 2))));
});
const ratingCount = computed(
  () => props.product.rating?.count ?? 50 + ((props.product.id * 7) % 200)
);
const soldCount = computed(() => 10 + ((props.product.id * 13) % 500));

const formatCurrency = (val) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  } catch (_) {
    return `$${Number(val).toFixed(2)}`;
  }
};
</script>
