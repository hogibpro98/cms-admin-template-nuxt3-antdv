import { defineStore } from 'pinia';
import axios from 'axios';
import { LOCAL_STORAGE_EMAIL, LOCAL_STORAGE_TOKEN, HTTP_OK } from '@/constants/axios.js';
import { getKeylocalStorage, remove, setKeylocalStorage } from '@/utils/storage.ts';
import { DASHBOARD } from '@/constants/router.js';

(async () => {
  const token = await getKeylocalStorage(LOCAL_STORAGE_TOKEN, false);

  if (token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }
})();
const $axios = axios;
export const useUserStore = defineStore('user', {
  state: () => ({
    id: null,
    full_name: '',
    email: '',
    api_token: '',
    isLoggedIn: false,
    isAuthenticated: false,
    messageError: '',
    statusCode: 200
  }),
  actions: {
    //example login
    async login(email, password) {
      await $axios.post('/auth/login', {
        email: email,
        password: password
      }).then((result) => {
        const { status, data } = result;
        if (status === HTTP_OK) {
          if (data.status === HTTP_OK) {
            setKeylocalStorage(LOCAL_STORAGE_TOKEN, data.data.access_token);
            localStorage.setItem(LOCAL_STORAGE_EMAIL, data.data.user.email);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.data.access_token;
            navigateTo(DASHBOARD);
          }
          if (data.status === 401) {
            this.$state.isAuthenticated = true;
          }
        }
      });
    },
    //example logout
    async logout() {
      await $axios.post('/auth/logout');
      this.resetState();
      await remove(LOCAL_STORAGE_TOKEN);
      await remove(LOCAL_STORAGE_EMAIL);
    },
    //example resetState
    resetState() {
      this.$state.id = '';
      this.$state.full_name = '';
      this.$state.email = '';
      this.$state.api_token = '';
      this.$state.isLoggedIn = false;
    },

    setIsAuthenticated(value) {
      this.isAuthenticated = value;
    },

    setMessageError(value) {
      this.messageError = value;
    },

    setStatusCode(value) {
      this.statusCode = value;
    }
  },
  getters: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getMessageError: (state) => state.messageError,
    getStatusCode: (state) => state.statusCode
  },
  persist: true
});