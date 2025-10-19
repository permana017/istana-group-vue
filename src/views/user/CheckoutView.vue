<template>
  <div>
    <h1 class="text-2xl font-semibold mb-4">Checkout</h1>

    <div v-if="cart.itemCount === 0" class="p-4">Your cart is empty.</div>

    <div v-else class="bg-white border rounded-lg p-6">
      <h2 class="text-lg font-medium mb-4">Order Summary</h2>
      <ul class="space-y-2 mb-6">
        <li
          v-for="item in cart.cartItems"
          :key="item.id"
          class="flex justify-between"
        >
          <span>{{ item.title }} x {{ item.quantity }}</span>
          <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
        </li>
      </ul>
      <div class="flex justify-between font-semibold text-lg mb-6">
        <span>Total</span>
        <span>${{ cart.totalPrice.toFixed(2) }}</span>
      </div>

      <div class="flex gap-3">
        <button
          class="btn-primary"
          @click="confirmOrder"
          :disabled="isProcessing"
        >
          {{ isProcessing ? "Processing..." : "Confirm Order" }}
        </button>
        <RouterLink to="/user/cart" class="btn-secondary">Back to Cart</RouterLink>
      </div>

      <p v-if="message" class="mt-4 text-green-700">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useToastStore } from "@/stores/toast";
import { useOrdersStore } from "@/stores/orders";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const cart = useCartStore();
const isProcessing = ref(false);
const message = ref("");
const toast = useToastStore();
const orders = useOrdersStore();
const auth = useAuthStore();

const confirmOrder = async () => {
  isProcessing.value = true;
  message.value = "";
  // Simulasi proses checkout
  setTimeout(() => {
    message.value = "Order confirmed! Thank you.";
    // Create order for admin to review
    orders.addOrder({
      items: cart.cartItems,
      total: cart.totalPrice,
      user: { username: auth.user?.username || 'user' }
    })
    cart.clearCart();
    toast.success('Pembayaran sukses! Pesanan dikonfirmasi.');
    isProcessing.value = false;
    router.push("/user/products");
  }, 1200);
};
</script>
