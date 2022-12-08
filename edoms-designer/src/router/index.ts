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
      },
    ],
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404',
  },
  {
    path: '/test',
    component: () => import('../views/TestTable.vue'),
  },
  {
    path: '/scroll',
    component: () => import('../views/scroll.vue'),
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
  console.log(to.path);
  console.log(from.path);
  next();
});

export default router;
