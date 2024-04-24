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
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore() // Use the auth store
  const isUserAuthenticated = authStore.isLoggedIn // Use the state variable

  if (to.matched.some(record => record.meta.requiresAuth) && !isUserAuthenticated) { // Removed .value
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router
