//Dependencies

import { createRouter, createWebHistory } from 'vue-router'

//Components

import landingPage from '@/views/landingPage/landingPage.vue'
import adminPage from '@/views/adminPage/adminPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: landingPage
    },
    {
      path: "/admin",
      name: "Admin",
      component: adminPage
    },
  ]
})

export default router
