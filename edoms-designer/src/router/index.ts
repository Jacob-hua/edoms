import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '',
        redirect: '/app',
      },
      {
        path: '/app',
        name: 'app',
        component: () => import('@/views/application/index.vue'),
      },
      {
        path: '/app/setting',
        name: 'appSetting',
        component: () => import('@/views/applicationSetting/index.vue'),
      },
      {
        path: 'test',
        name: 'test',
        component: () => import('@/views/TestPage.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('@/layout/EditorLayout.vue'),
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/layout/404.vue'),
    meta: {
      title: '404',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  console.log(to.path);
  console.log(from.path);
  next();
});

export default router;
