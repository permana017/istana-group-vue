<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Orders</h1>
      <button class="btn-danger" @click="clearAll" v-if="orders.length">Clear All</button>
    </div>

    <div v-if="!orders.length" class="p-4">Belum ada order.</div>

    <div class="grid gap-4">
      <BaseCard v-for="o in orders" :key="o.id" padded>
        <div class="flex items-center justify-between">
          <div>
            <div class="font-semibold">Order #{{ o.id }}</div>
            <div class="text-sm text-gray-500">{{ new Date(o.createdAt).toLocaleString() }}</div>
          </div>
          <div class="text-sm text-gray-600">
            Total: <span class="font-semibold">${{ o.total.toFixed(2) }}</span>
          </div>
        </div>
        <ul class="mt-3 text-sm text-gray-700 space-y-1">
          <li v-for="item in o.items" :key="item.id" class="flex justify-between">
            <span>{{ item.title }} x {{ item.quantity }}</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </li>
        </ul>
        <div class="mt-3 text-xs text-gray-500">
          Submitted by: {{ o.user?.username || 'guest' }}
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useOrdersStore } from '@/stores/orders'
import Swal from 'sweetalert2'
import BaseCard from '@/components/BaseCard.vue'

const ordersStore = useOrdersStore()
const { orders } = storeToRefs(ordersStore)

const clearAll = async () => {
  const res = await Swal.fire({
    title: 'Hapus semua order?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus'
  })
  if (!res.isConfirmed) return
  ordersStore.clear()
  await Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Semua order dihapus' })
}
</script>
