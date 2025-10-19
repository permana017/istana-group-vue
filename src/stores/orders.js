import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref(JSON.parse(localStorage.getItem('orders') || '[]'))

  const addOrder = (order) => {
    const id = Date.now()
    const payload = { id, createdAt: new Date().toISOString(), ...order }
    orders.value.unshift(payload)
    localStorage.setItem('orders', JSON.stringify(orders.value))
    return payload
  }

  const clear = () => {
    orders.value = []
    localStorage.setItem('orders', '[]')
  }

  return { orders, addOrder, clear }
})
