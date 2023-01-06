import { defineStore, StoreDefinition } from 'pinia';

interface State {
  RoutersCompList: Set<string>;
}
interface Getters {
  getRoutersComps: (state: State) => Set<string>;
}
interface Action {
  addRoutersComp: (comps: string[]) => void;
  deleteRoutersComp: (comps: string[]) => void;
}

type RoutersStoreType = StoreDefinition<string, State, Getters, Action>;

const useRoutersStore: RoutersStoreType = defineStore('RoutersStore', {
  state: (): State => ({
    RoutersCompList: new Set<string>(),
  }),
  actions: {
    addRoutersComp(comps) {
      comps.forEach((comp) => {
        this.RoutersCompList.add(comp);
      });
    },
    deleteRoutersComp(comps) {
      comps.forEach((comp) => {
        this.RoutersCompList.delete(comp);
      });
    },
  },
  getters: {
    getRoutersComps: (state: State) => [...state.RoutersCompList],
  },
});

export default useRoutersStore;
