//Dependencies

import { createRouter, createWebHistory } from 'vue-router'

//Components

import landingPage from '@/views/landingPage/landingPage.vue'
import adminPage from '@/views/adminPage/adminPage.vue'
import addStudents from '@/views/adminPage/addStudents/addStudents.vue';
import showReport from '@/views/showReport/showReport.vue';
import studentDashboard from '@/views/studentDashboard/studentDashboard.vue';
import MentorDashboard from '@/views/mentorDashboard/mentorDashboard.vue';
import SplLabDashboard from '@/views/splLabDashboard/splLabDashboard.vue';
import AdminDashboard from '@/views/adminPage/adminDashboard.vue';

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
      path: "/adminDashboard",
      name: "Admin Dashboard",
      component: AdminDashboard
    },
    {
      path: "/adminDashboard/:year",
      name: "Add Students",
      component: addStudents
    },
    {
      path: "/admin/report/:year",
      name: "Show Report",
      component: showReport
    },
    {
      path: "/student",
      name: "Student",
      component: studentDashboard
    },
    {
      path: "/mentor",
      name: "Mentor",
      component: MentorDashboard
    },
    {
      path: "/specialLabs",
      name: "Special Labs",
      component: SplLabDashboard
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !localStorage.getItem('inutile')) next({ name: 'Login' })
  else next()
});

export default router
