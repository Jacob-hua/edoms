import { RouteLocationNormalized } from 'vue-router';
import { defineStore, StoreDefinition } from 'pinia';

interface State {
  cacheComps: Set<string>;
}
interface Getters {
  getCacheComps: (state: State) => string[];
}
interface Action {
  cacheRouter: (from: RouteLocationNormalized, to: RouteLocationNormalized) => void;
}

type RoutersStoreType = StoreDefinition<string, State, Getters, Action>;

const useRoutersStore: RoutersStoreType = defineStore('router', {
  state: (): State => ({
    cacheComps: new Set<string>(),
  }),
  actions: {
    cacheRouter(from: RouteLocationNormalized, to: RouteLocationNormalized) {
      if (Array.isArray(from.meta.leaveCaches) && from.meta.leaveCaches.includes(to.path)) {
        if (typeof from.name === 'string') {
          from.name && this.cacheComps.add(from.name);
        }
      }
      if (Array.isArray(to.meta.leaveCaches) && !to.meta.leaveCaches.includes(from.path)) {
        if (typeof to.name === 'string') {
          to.name && this.cacheComps.delete(to.name);
        }
      }
    },
  },
  getters: {
    getCacheComps: (state: State) => [...state.cacheComps],
  },
});

export default useRoutersStore;
