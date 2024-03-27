import axios from 'axios';
import repository from '@/api/repository';
const $axios = axios;

export const composableRepository = (resource: string) => {
  return repository($axios)(resource);
};
