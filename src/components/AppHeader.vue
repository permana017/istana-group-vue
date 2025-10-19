<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-6">
          <!-- User menu -->
          <template v-if="variant === 'user'">
            <RouterLink to="/user/products" v-slot="{ isActive }">
              <span :class="isActive ? activeLink : baseLink">{{
                t("nav.products")
              }}</span>
            </RouterLink>
            <RouterLink to="/user/cart" v-slot="{ isActive }">
              <span :class="isActive ? activeLink : baseLink">{{
                t("nav.cart")
              }}</span>
            </RouterLink>
            <RouterLink to="/user/orders" v-slot="{ isActive }">
              <span :class="isActive ? activeLink : baseLink">{{
                t("nav.orders")
              }}</span>
            </RouterLink>
          </template>

          <!-- Admin menu -->
          <template v-else-if="variant === 'admin'">
            <RouterLink to="/admin/products" v-slot="{ isActive }">
              <span :class="isActive ? activeLink : baseLink">{{
                t("nav.products")
              }}</span>
            </RouterLink>
            <RouterLink to="/admin/users" v-slot="{ isActive }">
              <span :class="isActive ? activeLink : baseLink">{{
                t("nav.users")
              }}</span>
            </RouterLink>
            <!-- <RouterLink to="/admin/orders" v-slot="{ isActive }">
              <span :class="isActive ? activeLink : baseLink">{{
                t("nav.orders")
              }}</span>
            </RouterLink> -->
          </template>
        </div>

        <div class="flex items-center gap-4">
          <div>
            <span
              v-if="auth.isAuthenticated"
              class="text-md text-gray-600 text-nowrap font-semibold"
              >Hi, {{ auth.user?.username }}</span
            >
            <div class="text-sm text-gray-500 text-right capitalize">{{ variant }}</div>
          </div>
          <!-- Language Switcher -->
          <select
            class="input-field w-28"
            :value="locale"
            @change="onChangeLocale"
          >
            <option value="en">EN</option>
            <option value="id">ID</option>
          </select>
          <button
            v-if="auth.isAuthenticated"
            @click="handleLogout"
            class="btn-secondary"
          >
            {{ t("app.logout") }}
          </button>
          <RouterLink v-else to="/login" class="btn-primary">{{
            t("app.login")
          }}</RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";

const props = defineProps({
  variant: { type: String, default: "user" }, // 'user' | 'admin'
});

const auth = useAuthStore();
const router = useRouter();
const { t, locale } = useI18n();

const handleLogout = () => {
  auth.logout();
  router.push("/");
};

const onChangeLocale = (e) => {
  const val = e.target.value;
  locale.value = val;
  localStorage.setItem("locale", val);
};

// Link styles
const baseLink = "px-1 text-gray-600 hover:text-gray-900";
const activeLink =
  "px-1 text-blue-600 font-semibold border-b-2 border-blue-600 pb-1";
</script>
