<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Order History</h1>

    <div v-if="myOrders.length === 0" class="bg-white border rounded p-6 text-gray-600">
      You have no past orders yet.
    </div>

    <div v-else class="space-y-6">
      <BaseCard v-for="order in myOrders" :key="order.id">
        <div class="flex items-center justify-between mb-4">
          <div class="font-medium">Order #{{ order.id }}</div>
          <div class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</div>
        </div>

        <ul class="divide-y">
          <li v-for="item in order.items" :key="item.id" class="py-3 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <img :src="item.image" alt="" class="w-12 h-12 object-contain" loading="lazy" />
              <div>
                <div class="font-medium text-sm">{{ item.title }}</div>
                <div class="text-xs text-gray-500">Qty: {{ item.quantity }}</div>
              </div>
            </div>
            <div class="text-sm font-medium">${{ (item.price * item.quantity).toFixed(2) }}</div>
          </li>
        </ul>

        <div class="flex justify-end mt-4 text-lg font-semibold">
          Total: ${{ order.total.toFixed(2) }}
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import BaseCard from '@/components/BaseCard.vue'

const orders = useOrdersStore()
const auth = useAuthStore()

// For now, we tag orders with username in CheckoutView as { user: { username } }
const myOrders = computed(() => {
  const username = auth.user?.username
  if (!username) return []
  return orders.orders.filter(o => o.user?.username === username)
})

const formatDate = iso => new Date(iso).toLocaleString()
</script>
