<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Your Cart</h1>
    <div v-if="cart.itemCount === 0" class="p-4">Your cart is empty.</div>

    <div v-else class="grid gap-4">
      <BaseCard
        v-for="item in cart.cartItems"
        :key="item.id"
        class="flex items-center justify-between bg-white border p-4 rounded-lg"
      >
        <div class="flex items-center gap-4">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-16 h-16 object-contain"
            loading="lazy"
          />
          <div>
            <h2 class="font-medium">{{ item.title }}</h2>
            <p class="text-gray-700">${{ item.price }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="number"
            min="1"
            class="w-20 input-field"
            :value="item.quantity"
            @input="(e) => cart.updateQuantity(item.id, Number(e.target.value))"
          />
          <button class="btn-danger" @click="cart.removeFromCart(item.id)">
            Remove
          </button>
        </div>
      </BaseCard>

      <BaseCard class="flex items-center justify-between p-4">
        <div class="text-lg font-semibold">
          Total: ${{ cart.totalPrice.toFixed(2) }}
        </div>
        <RouterLink to="/user/checkout" class="btn-primary"
          >Checkout</RouterLink
        >
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { useCartStore } from "@/stores/cart";
import BaseCard from "../../components/BaseCard.vue";

const cart = useCartStore();
</script>
