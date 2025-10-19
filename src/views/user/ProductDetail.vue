<template>
  <div>
    <!-- Loading / Error States -->
    <div v-if="isLoading" class="p-6">{{ $t("product.loading") }}</div>
    <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>
    <div v-else-if="!product" class="p-6">{{ $t("product.notFound") }}</div>

    <div v-else class="space-y-8">
      <!-- Breadcrumb + Back -->
      <div class="flex items-center justify-between text-sm text-gray-600">
        <div class="flex items-center gap-2">
          <RouterLink to="/user/products" class="hover:underline">{{
            $t("nav.products")
          }}</RouterLink>
          <span>/</span>
          <span class="line-clamp-1 max-w-[60ch]">{{ product.title }}</span>
        </div>
        <RouterLink to="/user/products" class="hover:underline">{{
          $t("app.back")
        }}</RouterLink>
      </div>

      <!-- Main Detail -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Image -->
        <BaseCard class="flex items-center justify-center">
          <img
            :src="product.image"
            :alt="product.title"
            class="w-full max-w-lg h-auto object-contain"
            loading="lazy"
          />
        </BaseCard>

        <!-- Info -->
        <BaseCard>
          <h1 class="text-2xl sm:text-3xl font-semibold leading-snug">
            {{ product.title }}
          </h1>
          <p class="mt-6 text-gray-700 leading-relaxed">
            {{ product.description }}
          </p>

          <div class="mt-3 flex items-center gap-3 text-sm text-gray-600">
            <StarRating :rating="product.rating?.rate || 0" />
            <span
              >{{ product.rating?.count || 0 }} {{ $t("product.sold") }}</span
            >
            <span>{{ product.category }}</span>
          </div>

          <div class="mt-4">
            <div class="text-3xl font-bold">{{ formattedPrice }}</div>
          </div>

          <!-- Quantity + Actions -->
          <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
            <div
              class="flex items-center border rounded-lg overflow-hidden w-fit"
            >
              <button
                class="px-3 py-2 hover:bg-gray-50"
                @click="decrement"
                :disabled="qty <= 1"
              >
                -
              </button>
              <input
                type="number"
                v-model="qty"
                class="w-16 text-center px-2 py-2 border-0 focus:outline-none"
                min="1"
              />
              <button class="px-3 py-2 hover:bg-gray-50" @click="increment">
                +
              </button>
            </div>

            <div class="flex items-center gap-3">
              <button class="btn-primary" @click="handleAddToCart">
                {{ $t("product.addToCart") }}
              </button>
              <button class="btn-secondary" @click="handleBuyNow">
                {{ $t("product.buyNow") }}
              </button>
            </div>
          </div>

          <!-- Short description -->
          <p class="mt-6 text-gray-700 leading-relaxed">
            {{ product.description }}
          </p>
        </BaseCard>
      </div>

      <!-- Full Description -->
      <BaseCard>
        <h2 class="text-lg font-semibold mb-3">
          {{ $t("product.description") }}
        </h2>
        <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>
      </BaseCard>

      <!-- Related Products -->
      <BaseCard v-if="related.length">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold">Related Products</h3>
          <RouterLink
            :to="'/user/products'"
            class="text-sm text-blue-600 hover:underline"
            >{{ $t("product.seeAll") }}</RouterLink
          >
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <ProductCard
            v-for="rp in related"
            :key="rp.id"
            :product="rp"
            :to="'/user/products/' + rp.id"
            :dense="true"
          />
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import { productService } from "@/services/productService";
import { useCartStore } from "@/stores/cart";
import { useToastStore } from "@/stores/toast";
import StarRating from "@/components/StarRating.vue";
import BaseCard from "@/components/BaseCard.vue";
import ProductCard from "../../components/ProductCard.vue";

const route = useRoute();
const router = useRouter();
const id = computed(() => Number(route.params.id));

const isLoading = ref(false);
const error = ref(null);
const product = ref(null);
const related = ref([]);
const qty = ref(1);
const cart = useCartStore();
const toast = useToastStore();

const fetchData = async () => {
  try {
    isLoading.value = true;
    const data = await productService.getById(id.value);
    product.value = data;
    // Load related by category
    if (data?.category) {
      try {
        const byCat = await productService.getByCategory(data.category);
        related.value = byCat.filter((p) => p.id !== data.id).slice(0, 6);
      } catch (_) {
        related.value = [];
      }
    }
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

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

const formattedPrice = computed(() =>
  formatCurrency(product.value?.price || 0)
);

const increment = () => {
  qty.value += 1;
};
const decrement = () => {
  if (qty.value > 1) qty.value -= 1;
};

watch(qty, (v) => {
  if (!v || v < 1) qty.value = 1;
});

const handleAddToCart = () => {
  if (!product.value) return;
  cart.addToCart(product.value, qty.value);
  toast.success(
    `Ditambahkan ke keranjang: ${product.value.title} (x${qty.value})`
  );
};

const handleBuyNow = () => {
  if (!product.value) return;
  cart.addToCart(product.value, qty.value);
  router.push("/user/checkout");
};

// When navigating to another product detail using the same component instance,
// re-fetch data when the route param (id) changes.
watch(
  id,
  () => {
    qty.value = 1;
    fetchData();
  },
  { immediate: true }
);
</script>
