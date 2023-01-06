import { defineStore, StoreDefinition } from 'pinia';

interface State {
  keepAliveCompList: string[];
}
interface Getters {
  getKeepAliveComps: (state: State) => string[];
}
interface Action {
  updateKeepAliveCompList: (comp: string[]) => void;
  removeKeepAliveComp: (comps: string[]) => void;
}

type KeepAliveStoreType = StoreDefinition<string, State, Getters, Action>;

const useKeepAliveStore: KeepAliveStoreType = defineStore('keepAliveStore', {
  state: (): State => ({
    keepAliveCompList: ['Page'],
  }),
  actions: {
    updateKeepAliveCompList(comps) {
      this.keepAliveCompList = comps;
    },
    removeKeepAliveComp(comps) {
      this.keepAliveCompList = this.keepAliveCompList.filter(
        (compName) => !comps.some((remove) => compName === remove)
      );
    },
  },
  getters: {
    getKeepAliveComps: (state: State) => state.keepAliveCompList,
  },
});

export default useKeepAliveStore;
