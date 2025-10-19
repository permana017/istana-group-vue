import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let idSeq = 1

  const remove = (id) => {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  const show = (message, { type = 'info', duration = 3000 } = {}) => {
    const id = idSeq++
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => remove(id), duration)
    }
    return id
  }

  const success = (message, opts = {}) => show(message, { type: 'success', ...opts })
  const error = (message, opts = {}) => show(message, { type: 'error', ...opts })
  const info = (message, opts = {}) => show(message, { type: 'info', ...opts })
  const warn = (message, opts = {}) => show(message, { type: 'warn', ...opts })

  return { toasts, show, success, error, info, warn, remove }
})
