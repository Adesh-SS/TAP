//Dependencies

import { createRouter, createWebHistory } from 'vue-router'

//Components

import landingPage from '@/views/landingPage/landingPage.vue'
import adminPage from '@/views/adminPage/adminPage.vue'
import addStudents from '@/views/addStudents/addStudents.vue';
import showReport from '@/views/showReport/showReport.vue';

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
    {
      path: "/admin/:year",
      name: "Add Students",
      component: addStudents
    },
    {
      path: "/admin/report/:year",
      name: "Show Report",
      component: showReport
    },
  ]
})

export default router
