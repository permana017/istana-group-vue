import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref([])
  
  // Getters
  const cartItems = computed(() => items.value)
  const itemCount = computed(() => items.value.reduce((total, item) => total + item.quantity, 0))
  const totalPrice = computed(() => 
    items.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  )

  // Actions
  const addToCart = (product, quantity = 1) => {
    const existingItem = items.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity
      })
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  const removeFromCart = (productId) => {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
      localStorage.setItem('cart', JSON.stringify(items.value))
    }
  }

  const updateQuantity = (productId, quantity) => {
    const item = items.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
        localStorage.setItem('cart', JSON.stringify(items.value))
      }
    }
  }

  const clearCart = () => {
    items.value = []
    localStorage.removeItem('cart')
  }

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    }
  }

  return {
    // State
    items,
    // Getters
    cartItems,
    itemCount,
    totalPrice,
    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCartFromStorage
  }
})