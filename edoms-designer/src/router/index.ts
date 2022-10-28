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
        redirect: '/application',
      },
      {
        path: '/application',
        name: 'Application',
        component: () => import('@/views/application/index.vue'),
      },
      {
        path: '/application/setting',
        name: 'ApplicationSetting',
        component: () => import('@/views/application-setting/index.vue'),
      },
    ],
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('@/layout/EditorLayout.vue'),
    children: [
      {
        path: '',
        name: 'PageEditor',
        component: () => import('@/views/page-editor/index.vue'),
      },
    ],
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
