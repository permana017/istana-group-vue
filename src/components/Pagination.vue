<template>
  <div class="mt-6 flex items-center justify-between">
    <!-- Optional: per-page selector (hidden by default) -->
    <div v-if="showPageSize" class="flex items-center gap-2 mr-4">
      <span class="text-sm text-gray-600 text-nowrap">{{
        resolvedLabels.perPage
      }}</span>
      <select
        :value="pageSize"
        @change="onPageSizeChange"
        class="border rounded-md px-2 py-1 text-sm"
      >
        <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
          {{ opt }}
        </option>
      </select>
    </div>

    <!-- Simple Pager: Prev / Page X / Y / Next -->
    <div class="flex items-center gap-3">
      <button
        class="btn-secondary"
        :disabled="isFirstPage"
        @click="goToPage(currentPage - 1)"
      >
        {{ resolvedLabels.prev }}
      </button>
      <span v-if="showPageInfo" class="text-sm text-gray-700">
        {{ resolvedLabels.page }} {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        class="btn-secondary"
        :disabled="isLastPage"
        @click="goToPage(currentPage + 1)"
      >
        {{ resolvedLabels.next }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps({
  modelValue: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  showPageSize: { type: Boolean, default: true },
  pageSize: { type: Number, default: 12 },
  pageSizeOptions: { type: Array, default: () => [8, 12, 16] },
  showPageInfo: { type: Boolean, default: true },
});

const emit = defineEmits(["update:modelValue", "update:pageSize"]);
const { t } = useI18n();

const currentPage = computed(() =>
  Math.min(Math.max(props.modelValue, 1), Math.max(props.totalPages, 1))
);
const isFirstPage = computed(() => currentPage.value <= 1);
const isLastPage = computed(
  () => currentPage.value >= Math.max(props.totalPages, 1)
);

const resolvedLabels = computed(() => ({
  prev: t("pagination.prev"),
  next: t("pagination.next"),
  page: t("pagination.page"),
  perPage: t("pagination.perPage"),
}));

function goToPage(p) {
  const page = Math.min(Math.max(p, 1), Math.max(props.totalPages, 1));
  emit("update:modelValue", page);
}

function onPageSizeChange(e) {
  emit("update:pageSize", Number(e.target.value));
}
</script>
