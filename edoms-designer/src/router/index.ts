import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/layout/index.vue'),
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/layout/404.vue'),
    },
  ],
})

export default router
