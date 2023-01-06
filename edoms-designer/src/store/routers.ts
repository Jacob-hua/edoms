import { defineStore, StoreDefinition } from 'pinia';

interface State {
  keepAliveCompList: Set<string>;
}
interface Getters {
  getKeepAliveComps: (state: State) => Set<string>;
}
interface Action {
  updateKeepAliveCompList: (comp: string) => void;
  removeKeepAliveComp: (comp: string) => void;
}

type KeepAliveStoreType = StoreDefinition<string, State, Getters, Action>;

const useKeepAliveStore: KeepAliveStoreType = defineStore('keepAliveStore', {
  state: (): State => ({
    keepAliveCompList: new Set<string>(),
  }),
  actions: {
    updateKeepAliveCompList(comp) {
      this.keepAliveCompList.add(comp);
    },
    removeKeepAliveComp(comp) {
      this.keepAliveCompList.delete(comp);
    },
  },
  getters: {
    getKeepAliveComps: (state: State) => [...state.keepAliveCompList],
  },
});

export default useKeepAliveStore;
