<template></template>
<script setup lang="ts">
import { LOCAL_STORAGE_EMAIL } from '@/constants/axios';
import { DASHBOARD } from '@/constants/router';

const router = useRouter();
onMounted(() => {
  const email = localStorage.getItem(LOCAL_STORAGE_EMAIL);
  if (email) {
    const router = useRouter();
    router.push(DASHBOARD);
  }
  router.push('/login');
});
</script>
