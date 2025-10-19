<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="w-full max-w-4xl grid md:grid-cols-2 gap-6">
      <!-- Demo User -->
      <BaseCard class="h-full flex flex-col">
        <h2 class="text-xl font-semibold">Demo User</h2>
        <p class="mt-2 text-gray-600 text-sm font-medium">Produk</p>
        <ul class="mt-2 text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>User dapat melihat list produk.</li>
          <li>User dapat melihat detail produk.</li>
        </ul>

        <p class="mt-3 text-gray-600 text-sm font-medium">Cart</p>
        <ul class="mt-2 text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>User dapat menambahkan produk ke keranjang.</li>
          <li>User dapat menghapus produk dari keranjang.</li>
        </ul>

        <p class="mt-3 text-gray-600 text-sm font-medium">Checkout</p>
        <ul class="mt-2 text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>
            User dapat melakukan simulasi alur checkout minimal (misalnya pilih
            produk → masuk ke keranjang → lanjut ke checkout → konfirmasi
            pesanan).
          </li>
        </ul>
        <RouterLink
          class="btn-primary mt-auto w-full block text-center"
          to="/user/products"
          @click="setUserMode"
          >Masuk</RouterLink
        >
      </BaseCard>

      <!-- Demo Admin -->
      <BaseCard class="h-full flex flex-col">
        <h2 class="text-xl font-semibold">Demo Admin</h2>
        <p class="mt-2 text-gray-600 text-sm font-medium">CRUD Products</p>
        <ul class="mt-2 text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>Admin dapat membuat produk baru.</li>
          <li>Admin dapat melihat daftar produk.</li>
          <li>Admin dapat mengubah/mengedit produk.</li>
          <li>Admin dapat menghapus produk.</li>
        </ul>

        <p class="mt-3 text-gray-600 text-sm font-medium">CRUD Users</p>
        <ul class="mt-2 text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>Admin dapat menambahkan user baru.</li>
          <li>Admin dapat melihat daftar user.</li>
          <li>Admin dapat mengedit data user.</li>
          <li>Admin dapat menghapus user.</li>
        </ul>
        <RouterLink
          class="btn-secondary mt-4 w-full block text-center"
          to="/admin"
          @click="setAdminMode"
          >Masuk</RouterLink
        >
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import BaseCard from "@/components/BaseCard.vue";
import { useModeStore } from "@/stores/mode";

const mode = useModeStore();
const setUserMode = () => mode.setMode("user");
const setAdminMode = () => mode.setMode("admin");
</script>
