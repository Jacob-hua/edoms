import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

import useAccountStore, { AccountStore } from '@/store/account';
import useRouterStore from '@/store/router';

let accountStore: AccountStore | null = null;

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: () => import('@/layout/index.vue'),
    redirect: '/application',
    children: [
      {
        path: '/application',
        name: 'Application',
        component: () => import('@/views/application/index.vue'),
      },
      {
        path: '/application/setting',
        name: 'ApplicationSetting',
        component: () => import('@/views/application-setting/index.vue'),
        beforeEnter: (to, from, next) => {
          if (objectHasProperties(to.query, ['applicationId'])) {
            next();
          } else {
            next('/application');
          }
        },
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
        beforeEnter: (to, from, next) => {
          if (objectHasProperties(to.query, ['applicationId'])) {
            next();
          } else {
            next('/application');
          }
        },
        meta: {
          leaveCaches: ['/editor'],
        },
      },
      {
        path: '/version',
        name: 'Version',
        component: () => import('@/views/version/index.vue'),
        meta: {
          leaveCaches: ['/editor'],
        },
      },
      {
        path: '/editor',
        name: 'Editor',
        component: () => import('@/views/page-editor/index.vue'),
        beforeEnter: (to, from, next) => {
          if (objectHasProperties(to.query, ['pageId', 'versionId'])) {
            next();
          } else {
            next('/application');
          }
        },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('../views/login/index.vue'),
  },
  {
    path: '/preview/:address',
    component: () => import('../views/preview/index.vue'),
  },
  {
    path: '/404',
    component: () => import('../layout/404.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
];

function objectHasProperties(object: Record<string | symbol | number, any>, properties: string[]): boolean {
  return [...properties].some(Object.prototype.hasOwnProperty.bind(object));
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (['/login', '/404'].includes(to.path)) {
    next();
    return;
  }
  const { cacheRouter } = useRouterStore();
  cacheRouter(from, to);
  if (!accountStore) {
    accountStore = useAccountStore();
  }
  if (!accountStore.token) {
    router.replace({
      path: 'login',
    });
    return;
  }
  next();
});

export default router;
