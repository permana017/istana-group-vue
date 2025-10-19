<template>
  <div>
    <div class="mb-4">
      <h1 class="text-2xl font-semibold">{{ $t("list.title") }}</h1>
      <p class="text-gray-600">{{ $t("list.subtitle") }}</p>
    </div>

    <!-- Filters Bar -->
    <ProductFilters v-model="filters" :categories="categories" preset="user" />

    <LoadingSpinner v-if="isLoading" :text="$t('list.loading')" />
    <div v-else-if="error" class="p-4 text-red-600">{{ error }}</div>
    <div v-else-if="filteredProducts.length === 0" class="p-4">
      {{ $t("list.empty") }}
    </div>

    <!-- Card Grid -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      <ProductCard
        v-for="product in pagedProducts"
        :key="product.id"
        :product="product"
        :to="`/user/products/${product.id}`"
      >
        <template #actions>
          <div class="mt-3 grid grid-cols-2 gap-2">
            <button class="text-xs btn-secondary" @click.prevent="add(product)">
              {{ $t("list.addToCartShort") }}
            </button>
            <RouterLink
              :to="`/user/products/${product.id}`"
              class="text-xs btn-primary text-center"
            >
              {{ $t("list.detail") }}
            </RouterLink>
          </div>
        </template>
      </ProductCard>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="totalPages > 1"
      v-model="page"
      :total-pages="totalPages"
      :page-size="pageSize"
      @update:pageSize="(v) => (pageSize = v)"
      :sibling-count="1"
      :boundary-count="1"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";
import { productService } from "@/services/productService";
import { useCartStore } from "@/stores/cart";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import ProductCard from "@/components/ProductCard.vue";
import ProductFilters from "@/components/ProductFilters.vue";
import Pagination from "@/components/Pagination.vue";
import { useToastStore } from "@/stores/toast";

const { t } = useI18n();

const isLoading = ref(false);
const error = ref(null);
const products = ref([]);
const categories = ref([]);
const filters = ref({
  search: "",
  category: "",
  sort: "popular",
  sortDir: "asc",
});
const cart = useCartStore();
const toast = useToastStore();
const page = ref(1);
const pageSize = ref(12);

const load = async () => {
  try {
    isLoading.value = true;
    const [data, cats] = await Promise.all([
      productService.getAll(),
      productService.getCategories(),
    ]);
    products.value = data;
    categories.value = cats;
    page.value = 1;
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

const add = (p) => {
  cart.addToCart(p, 1);
  toast.success(t("list.addedToCart", { title: p.title }));
};

const filteredProducts = computed(() => {
  let list = products.value;
  if (filters.value.category) {
    list = list.filter((p) => p.category === filters.value.category);
  }
  const q = filters.value.search.toLowerCase();
  if (q) list = list.filter((p) => p.title.toLowerCase().includes(q));

  switch (filters.value.sort) {
    case "price-asc":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "name":
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      // popular: keep original order (as API provides)
      break;
  }

  return list;
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredProducts.value.length / pageSize.value))
);

const pagedProducts = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return filteredProducts.value.slice(start, start + pageSize.value);
});

// Navigation handled by Pagination component via v-model

onMounted(load);
watch(
  filters,
  () => {
    page.value = 1;
  },
  { deep: true }
);
</script>
