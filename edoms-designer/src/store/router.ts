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
        from.name && this.cacheComps.add(from.name as string);
      }
      if (Array.isArray(to.meta.leaveCaches) && !to.meta.leaveCaches.includes(from.path)) {
        to.name && this.cacheComps.delete(to.name as string);
      }
    },
  },
  getters: {
    getCacheComps: (state: State) => [...state.cacheComps],
  },
});

export default useRoutersStore;
