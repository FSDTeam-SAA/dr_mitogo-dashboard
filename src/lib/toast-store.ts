import { writable } from "svelte/store"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([])

  return {
    subscribe,
    success: (message: string, duration = 3000) => {
      const id = Math.random().toString(36).slice(2)
      update((toasts) => [...toasts, { id, message, type: "success", duration }])
      setTimeout(() => {
        update((toasts) => toasts.filter((t) => t.id !== id))
      }, duration)
    },
    error: (message: string, duration = 3000) => {
      const id = Math.random().toString(36).slice(2)
      update((toasts) => [...toasts, { id, message, type: "error", duration }])
      setTimeout(() => {
        update((toasts) => toasts.filter((t) => t.id !== id))
      }, duration)
    },
    info: (message: string, duration = 3000) => {
      const id = Math.random().toString(36).slice(2)
      update((toasts) => [...toasts, { id, message, type: "info", duration }])
      setTimeout(() => {
        update((toasts) => toasts.filter((t) => t.id !== id))
      }, duration)
    },
  }
}

export const toast = createToastStore()
