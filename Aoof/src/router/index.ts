import { createRouter, createWebHistory } from 'vue-router'
import landingPagee from '@/views/landingPage/landingPagee.vue'
import studentPage from '@/views/studentPage/studentPage.vue'
import { useAuthStore } from '@/stores/counter'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: landingPagee
    },
    {
      path: '/student',
      name: 'student',
      component: studentPage,
      meta: { requiresAuth: true }
    }
  ]
})

export default router
