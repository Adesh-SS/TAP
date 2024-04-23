import { createRouter, createWebHistory } from 'vue-router'
import landingPagee from '@/views/landingPage/landingPagee.vue'
import studentPage from '@/views/studentPage/studentPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: landingPagee
    },
    {
      path: '/student',
      name: 'student',
      component: studentPage
    }
  ]
})

export default router
