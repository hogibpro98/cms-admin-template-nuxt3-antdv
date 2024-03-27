import { defineStore } from 'pinia';

export const globalDataStore = defineStore('globalDataStore', {
  state: () => ({
    globalData: {},
    globalStatus: {},
    globalId: {},
    currentZoom: 0
  }),
  actions: {
    setGlobalData(data, key) {
      this.globalData[key] = data;
    },
    setGlobalStatus(data, key) {
      this.globalStatus[key] = data;
    },
    setGlobalId(data, key) {
      this.globalId[key] = data;
    },
    setCurrentZoom(data) {
      this.currentZoom = data;
    }
  },
  getters: {
    getGlobalData: (state) => state.globalData,
    getGlobalStatus: (state) => state.globalStatus,
    getGlobalId: (state) => state.globalId,
    getCurrentZoom: (state) => state.currentZoom
  },
  persist: true
});
