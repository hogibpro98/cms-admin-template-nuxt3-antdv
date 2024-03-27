import axios, { type AxiosError } from 'axios';
import { Modal } from 'ant-design-vue';
import {
  STATUS_TEXTS,
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_UNPROCESSABLE_ENTITY,
  HTTP_INTERNAL_SERVER_ERROR
} from '~/constants/axios';
import { useUserStore } from '~/stores/user';

export default defineNuxtPlugin(() => {
  axios.defaults.baseURL = useRuntimeConfig().public.backendURL;
  axios.defaults.withCredentials = false;
  axios.defaults.proxyHeaders = false;
  axios.interceptors.response.use(
    (response) => {
      const code = response?.data?.status;
      const error = response?.data?.data?.message_error;
      switch (code) {
        case HTTP_UNAUTHORIZED:
          hanle401Error(error);
          break;
        case HTTP_FORBIDDEN:
          hanle403Error(error);
          break;
        case HTTP_NOT_FOUND:
          hanle404Error(error);
          break;
        case HTTP_BAD_REQUEST:
          hanle400Error(error);
          break;
        case HTTP_INTERNAL_SERVER_ERROR:
          hanle500Error(error);
          break;
        case HTTP_UNPROCESSABLE_ENTITY:
          hanle422Error(error);
          break;
        default:
          break;
      }
      return response;
    },
    (e: AxiosError) => {
      if (e?.response?.code) {
        Modal.error({
          title: () => e?.response?.code ?? HTTP_INTERNAL_SERVER_ERROR,
          content: () => STATUS_TEXTS[HTTP_INTERNAL_SERVER_ERROR]
        });
      } else {
        Modal.error({
          title: () => e.code,
          content: () => e.message
        });
      }
      return Promise.reject(e);
    }
  );
  return {
    provide: {
      axios
    }
  };
});

export function message(error: any) {
  const userStore = useUserStore();
  userStore.setIsAuthenticated(true);
  userStore.setMessageError(error);
}
export function hanle500Error(error: any) {
  message(error);
}

export function hanle401Error(error: any) {
  message(error);
}

export function hanle422Error(error: any) {
  message(error);
}

export function hanle404Error(error: any) {
  message(error);
}

export function hanle400Error(error: any) {
  message(error);
}

export function hanle403Error(error: any) {
  message(error);
}
