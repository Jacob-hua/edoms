import {
  createRouter,
  createWebHashHistory,
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
      {
        path: '/model',
        name: 'Model',
        component: () => import('@/views/cim-model/index.vue'),
      },
      {
        path: '/page',
        name: 'Page',
        component: () => import('@/views/page/index.vue'),
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
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
  {
    path: '/test',
    component: () => import('../views/cim-model/component/testTable.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  console.log(to.path);
  console.log(from.path);
  next();
});

export default router;
