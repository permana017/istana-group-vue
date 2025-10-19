<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Products</h1>
      <button class="btn-primary" @click="openCreate()">New Product</button>
    </div>

    <!-- Controls: Sorting & Pagination -->
    <ProductFilters
      v-model="filters"
      :categories="categories"
      preset="admin"
      :show-sort-dir="true"
      class="mb-5"
    />

    <div v-if="isLoading" class="p-4">Loading...</div>
    <div v-else-if="error" class="p-4 text-red-600">{{ error }}</div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <ProductCard
        v-for="p in paginatedProducts"
        :key="p.id"
        :product="p"
        :to="`/admin/products/${p.id}`"
      >
        <template #actions>
          <div class="mt-3 flex gap-2">
            <button class="btn-secondary" @click.prevent="openEdit(p)">
              Edit
            </button>
            <button class="btn-danger" @click.prevent="remove(p.id)">
              Delete
            </button>
          </div>
        </template>
      </ProductCard>
    </div>
  </div>

  <Pagination
    class="mt-8"
    v-model="page"
    :total-pages="totalPages"
    :page-size="pageSize"
    :page-size-options="[5, 10, 15]"
    @update:pageSize="(v) => (pageSize = v)"
  />

  <div class="flex items-center gap-2 mt-4">
    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 class="text-lg font-semibold mb-4">
          {{ form.id ? "Edit" : "Create" }} Product
        </h3>
        <div class="grid gap-3">
          <input v-model="form.title" placeholder="Title" class="input-field" />
          <textarea
            v-model="form.description"
            placeholder="Description"
            class="input-field"
            rows="3"
          />
          <input
            v-model.number="form.price"
            type="number"
            placeholder="Price"
            class="input-field"
          />
          <input
            v-model="form.image"
            placeholder="Image URL"
            class="input-field"
          />
          <input
            v-model="form.category"
            placeholder="Category"
            class="input-field"
          />
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Swal from "sweetalert2";
import { productService } from "@/services/productService";
import ProductFilters from "@/components/ProductFilters.vue";
import ProductCard from "@/components/ProductCard.vue";
import Pagination from "@/components/Pagination.vue";
import { useI18n } from "vue-i18n";

const products = ref([]);
const isLoading = ref(false);
const error = ref(null);

const { t } = useI18n();

// Sorting & filter state
const filters = ref({
  search: "",
  category: "",
  sort: "title",
  sortDir: "asc",
});
// ProductFilters computes admin sort options via i18n preset

// Pagination state
const page = ref(1);
const pageSize = ref(10);

// Filters state
const categories = ref([]);

const showModal = ref(false);
const form = ref({
  id: null,
  title: "",
  description: "",
  price: 0,
  image: "",
  category: "",
});

const fetchData = async () => {
  try {
    isLoading.value = true;
    products.value = await productService.getAll();
    try {
      categories.value = await productService.getCategories();
    } catch (_) {
      categories.value = Array.from(
        new Set(products.value.map((p) => p.category).filter(Boolean))
      );
    }
    page.value = 1;
  } catch (e) {
    error.value = e.message;
  } finally {
    isLoading.value = false;
  }
};

const openCreate = () => {
  form.value = {
    id: null,
    title: "",
    description: "",
    price: 0,
    image: "",
    category: "",
  };
  showModal.value = true;
};

const openEdit = (p) => {
  form.value = { ...p };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const save = async () => {
  try {
    const isUpdate = !!form.value.id;
    if (isUpdate) {
      await productService.update(form.value.id, form.value);
    } else {
      await productService.create(form.value);
    }
    await fetchData();
    closeModal();
    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: isUpdate ? "Produk diperbarui" : "Produk ditambahkan",
    });
  } catch (e) {
    await Swal.fire({ icon: "error", title: "Gagal", text: e.message });
  }
};

const remove = async (id) => {
  const res = await Swal.fire({
    title: "Hapus produk ini?",
    text: "Tindakan ini tidak dapat dibatalkan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  });
  if (!res.isConfirmed) return;
  try {
    await productService.remove(id);
    await fetchData();
    await Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Produk dihapus",
    });
  } catch (e) {
    await Swal.fire({ icon: "error", title: "Gagal", text: e.message });
  }
};

onMounted(fetchData);

// Filtered products
const filteredProducts = computed(() => {
  let list = products.value;
  if (filters.value.category) {
    list = list.filter((p) => p.category === filters.value.category);
  }
  if (filters.value.search?.trim()) {
    const q = filters.value.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }
  return list;
});

// Derived sorted products
const sortedProducts = computed(() => {
  const list = [...filteredProducts.value];
  const dir = filters.value.sortDir === "asc" ? 1 : -1;
  return list.sort((a, b) => {
    let va, vb;
    switch (filters.value.sort) {
      case "price":
        va = a.price;
        vb = b.price;
        break;
      case "category":
        va = a.category?.toString().toLowerCase() || "";
        vb = b.category?.toString().toLowerCase() || "";
        break;
      case "rating":
        va = a.rating?.rate ?? 0;
        vb = b.rating?.rate ?? 0;
        break;
      default:
        // title
        va = a.title?.toString().toLowerCase() || "";
        vb = b.title?.toString().toLowerCase() || "";
    }
    if (va < vb) return -1 * dir;
    if (va > vb) return 1 * dir;
    return 0;
  });
});

// Pagination derived values
const totalItems = computed(() => sortedProducts.value.length);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalItems.value / pageSize.value))
);
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * pageSize.value;
  return sortedProducts.value.slice(start, start + pageSize.value);
});

// Handlers handled by Pagination via v-model

watch(
  [filters, pageSize],
  () => {
    page.value = 1;
  },
  { deep: true }
);
</script>
