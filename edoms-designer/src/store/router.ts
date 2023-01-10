import { RouteLocationNormalized } from 'vue-router';
import { defineStore, Store, StoreDefinition } from 'pinia';

export interface RouterState {
  cacheComps: Set<string>;
}

export interface RouterGetters {
  keepAliveComps: (state: RouterState) => string[];
}

export interface RouterAction {
  cacheRouter: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void;
}

export type RoutersStoreDefinition = StoreDefinition<string, RouterState, RouterGetters, RouterAction>;

export type RoutersStore = Store<string, RouterState, RouterGetters, RouterAction>;

const useRouterStore: RoutersStoreDefinition = defineStore('router', {
  state: (): RouterState => ({
    cacheComps: new Set<string>(),
  }),
  actions: {
    cacheRouter(from: RouteLocationNormalized, to: RouteLocationNormalized) {
      if (
        Array.isArray(from.meta.leaveCaches) &&
        from.meta.leaveCaches.includes(to.path) &&
        typeof from.name === 'string'
      ) {
        from.name && this.cacheComps.add(from.name);
      }
      if (
        Array.isArray(to.meta.leaveCaches) &&
        !to.meta.leaveCaches.includes(from.path) &&
        typeof to.name === 'string'
      ) {
        to.name && this.cacheComps.delete(to.name);
      }
    },
  },
  getters: {
    keepAliveComps: (state: RouterState) => [...state.cacheComps],
  },
});

export default useRouterStore;
