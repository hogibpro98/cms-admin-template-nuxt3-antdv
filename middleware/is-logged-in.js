import { ref } from 'vue';
import { DASHBOARD, LOGIN } from '@/constants/router.js';
import axios from 'axios';
import { LOCAL_STORAGE_TOKEN } from '@/constants/axios.js';

export function getKey(key, prefixKey) {
  return `${prefixKey ?? ''}${key}`.toUpperCase();
}

/**
 * Remove an item from local storage
 * @param {string} key - The key of the item to be removed
 */
export async function remove(key) {
  try {
    localStorage.removeItem(getKey(key));
  } catch (e) {}
}

/**
 * Clear all items from local storage
 */
export function clear() {
  let result= localStorage.clear();
  return result;
}

/**
 * Get a value from local storage based on a key
 * @param {string} key - The key of the item to retrieve
 * @param {any} [def=null] - Default value to return if the item is not found
 */
export async function getKeylocalStorage(key, def = null) {
  const item = localStorage.getItem(getKey(key));
  if (item) {
    try {
      const data = JSON.parse(item);
      const { value, expire } = data;
      // Return directly if within the validity period
      if (expire === null || expire >= Date.now()) {
        return await value;
      }
      remove(getKey(key));
    } catch (e) {
      return await def;
    }
  }
  return await def;
}
export default defineNuxtRouteMiddleware((to, from) => {
  const isLogin = ref(false);
  (async () => {
    const token = await getKeylocalStorage(LOCAL_STORAGE_TOKEN, false);console.log(1111111111111, token);
    if (token) {
      isLogin.value = true;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
    try {
      if (!isLogin.value && to.fullPath !== LOGIN) {
        return navigateTo(LOGIN);
      }
      if (isLogin.value) {
        return navigateTo(DASHBOARD);
      }
    } catch (e) {
      console.log('message', e);
      return navigateTo(LOGIN);
    }
  })();
});
