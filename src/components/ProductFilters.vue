<template>
  <div
    class="bg-white border border-gray-200 rounded-lg p-3 mb-4 flex flex-wrap items-center gap-3"
  >
    <div class="flex-1 min-w-[240px]">
      <input
        v-model="localSearch"
        :placeholder="resolvedSearchPlaceholder"
        class="input-field"
        @input="emitChange"
      />
    </div>

    <select
      v-if="categories?.length"
      v-model="localCategory"
      class="input-field w-44 capitalize"
      @change="emitChange"
    >
      <option value="">{{ resolvedAllCategoriesLabel }}</option>
      <option v-for="c in categories" :key="c" :value="c" class="capitalize">
        {{ c }}
      </option>
    </select>

    <select v-model="localSort" class="input-field w-44" @change="emitChange">
      <option
        v-for="opt in resolvedSortOptions"
        :key="opt.value"
        :value="opt.value"
      >
        {{ opt.label }}
      </option>
    </select>

    <select
      v-if="showSortDir"
      v-model="localSortDir"
      class="input-field w-28"
      @change="emitChange"
    >
      <option value="asc">{{ dirAsc }}</option>
      <option value="desc">{{ dirDesc }}</option>
    </select>
  </div>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      search: "",
      category: "",
      sort: "popular",
      sortDir: "asc",
    }),
  },
  categories: { type: Array, default: () => [] },
  // Choose preset to determine internal sort options
  preset: { type: String, default: "user" }, // 'user' | 'admin'
  showSortDir: { type: Boolean, default: false },
  // i18n labels
  searchPlaceholder: { type: String, default: "" },
  allCategoriesLabel: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue", "change"]);
const { t } = useI18n();

const localSearch = ref(props.modelValue.search || "");
const localCategory = ref(props.modelValue.category || "");
const localSort = ref(props.modelValue.sort || "popular");
const localSortDir = ref(props.modelValue.sortDir || "asc");

watch(
  () => props.modelValue,
  (val) => {
    if (!val) return;
    localSearch.value = val.search ?? "";
    localCategory.value = val.category ?? "";
    localSort.value = val.sort ?? "popular";
    localSortDir.value = val.sortDir ?? "asc";
  },
  { deep: true }
);

const resolvedSearchPlaceholder = computed(
  () => props.searchPlaceholder || t("filters.searchPlaceholder")
);
const resolvedAllCategoriesLabel = computed(
  () => props.allCategoriesLabel || t("filters.allCategories")
);

const resolvedSortOptions = computed(() => {
  if (props.preset === "admin") {
    // Admin: title, price, category, rating
    const label = (key, fallback) => {
      const res = t(key);
      return res === key ? fallback : res;
    };
    return [
      { value: "title", label: label("admin.sort.title", "Title") },
      { value: "price", label: label("admin.sort.price", "Price") },
      { value: "category", label: label("admin.sort.category", "Category") },
      { value: "rating", label: label("admin.sort.rating", "Rating") },
    ];
  }
  // User default
  return [
    { value: "popular", label: t("list.sort.popular") },
    { value: "price-asc", label: t("list.sort.priceAsc") },
    { value: "price-desc", label: t("list.sort.priceDesc") },
    { value: "name", label: t("list.sort.name") },
  ];
});

const dirAsc = computed(() => t("filters.dir.asc", 1));
const dirDesc = computed(() => t("filters.dir.desc", 1));

const emitChange = () => {
  const next = {
    search: localSearch.value,
    category: localCategory.value,
    sort: localSort.value,
    sortDir: localSortDir.value,
  };
  emit("update:modelValue", next);
  emit("change", next);
};
</script>
