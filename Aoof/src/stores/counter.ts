import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false
  }),
  actions: {
    setLoggedIn(value: boolean) {
      this.isLoggedIn = value
    }
  }
})