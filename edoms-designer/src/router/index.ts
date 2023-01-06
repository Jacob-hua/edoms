import {
  createRouter,
  createWebHashHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from 'vue-router';

import useAccountStore, { AccountStore } from '@/store/account';
import useKeepAliveStore from '@/store/keepAliveStore';

let accountStore: AccountStore | null = null;

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
      },
      {
        path: '/version',
        name: 'Version',
        component: () => import('@/views/version/index.vue'),
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
        meta: {
          toPath: '/editor',
          fromPath: '/page,/version',
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
const cacheBill = ['/page', '/version'];
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  console.log(to.path, from.path);
  if (['/login', '/404'].includes(to.path)) {
    next();
    return;
  }
  const { updateKeepAliveCompList, removeKeepAliveComp } = useKeepAliveStore();
  if (cacheBill.includes(from.path) && to.path === '/editor') {
    updateKeepAliveCompList([from.name as string]);
  }
  if (cacheBill.includes(to.path) && from.path !== '/editor') {
    removeKeepAliveComp([to.name as string]);
  }
  if (!accountStore) {
    accountStore = useAccountStore();
  }
  if (!accountStore.token) {
    router.push({
      path: '/login',
    });
    return;
  }
  next();
});

export default router;
