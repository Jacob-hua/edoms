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
        meta: {
          params: {
            required: ['applicationId'],
          },
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
        meta: {
          leaveCaches: ['/editor'],
          params: {
            required: ['applicationId'],
          },
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
        meta: {
          params: {
            required: ['pageId', 'versionId'],
          },
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

function handleRequiredParams(to: RouteLocationNormalized, next: NavigationGuardNext) {
  if (!to.meta.params || !Array.isArray(to.meta.params.required)) {
    next();
    return;
  }
  if (objectHasProperties(to.query, to.meta.params.required)) {
    next();
    return;
  }
  if (to.meta.params.catchPath) {
    next(to.meta.params.catchPath);
    return;
  }
  next('/');
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_BASE_URL),
  routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  handleRequiredParams(to, next);
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
