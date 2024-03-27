<template>
  <div id="user-logout">
    <div v-show="visible" id="action-logout">
      <a-button type="none" @click="logout">
<!--        <img src="@/assets/svg/icon_logout.svg" alt="log out" />-->
        <span>{{ $t('logout') }}</span>
      </a-button>
    </div>
    <div id="user-logout-button">
      <div class="img-account">{{ 'sdasdasdas@gmail.com'.substring(0, 2).toLowerCase() }}</div>
      <a-button type="none" @click="visible = !visible">
        {{ 'sdasdasdas@gmail.com'.split('@')[0].toLowerCase() }}
        <UpOutlined v-if="visible" />
        <DownOutlined v-else />
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { LOGIN } from '@/constants/router';
import { LOCAL_STORAGE_EMAIL } from '@/constants/axios';
// is login
const email = computed(async () =>
  'default'
);
const router = useRouter();
const userStore = useUserStore();
const visible = ref<boolean>(false);
const logout = async () => {
  visible.value = false;
  try {
    await userStore.logout();
    router.push(LOGIN);
  } catch (error) {
    console.log(error);
  }
};
onMounted(() => {
  const email = 'sdasdasdas@gmail.com';
  if (!email) {
    const router = useRouter();
    router.push(LOGIN);
  }
});
</script>
