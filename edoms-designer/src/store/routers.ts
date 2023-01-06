import { defineStore, StoreDefinition } from 'pinia';

interface State {
  RoutersCompList: Set<string>;
}
interface Getters {
  getRoutersComps: (state: State) => Set<string>;
}
interface Action {
  addRoutersComp: (comp: string) => void;
  deleteRoutersComp: (comp: string) => void;
}

type RoutersStoreType = StoreDefinition<string, State, Getters, Action>;

const useRoutersStore: RoutersStoreType = defineStore('RoutersStore', {
  state: (): State => ({
    RoutersCompList: new Set<string>(),
  }),
  actions: {
    addRoutersComp(comp) {
      this.RoutersCompList.add(comp);
    },
    deleteRoutersComp(comp) {
      this.RoutersCompList.delete(comp);
    },
  },
  getters: {
    getRoutersComps: (state: State) => [...state.RoutersCompList],
  },
});

export default useRoutersStore;
