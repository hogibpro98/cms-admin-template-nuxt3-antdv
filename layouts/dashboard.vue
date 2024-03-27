<template>
  <a-layout class="layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :trigger="null"
      collapsible
      :theme="getTheme"
      class="layout-sider"
    >
      <Logo :collapsed="collapsed" />
      <AppDrawer :collapsed="collapsed" :theme="getTheme" />
      <user-info v-if="isLoggedIn" />
    </a-layout-sider>
    <a-layout id="layout-slot">
      <a-layout-content id="layout-slot-content">
        <a-config-provider
          :theme="{
            token: {
              colorPrimary: '#FFD7F4'
            }
          }"
        >
          <slot />
          <Popup v-if="userStore.getIsAuthenticated">
            <span class="content-error">{{ userStore.getMessageError }}</span>
          </Popup>
        </a-config-provider>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue';
import AppDrawer from '~/components/layouts/app-drawer/index.vue';
import UserInfo from '~/components/layouts/user-info/index.vue';
import Logo from '@/components/layouts/logo/index.vue';
import { getKeylocalStorage } from '@/utils/storage';
import { LOCAL_STORAGE_TOKEN } from '@/constants/axios';
import Popup from '~/components/popup/message.vue';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
// is login
const isLoggedIn = computed(() => getKeylocalStorage(LOCAL_STORAGE_TOKEN, false));
const collapsed = ref<boolean>(false);
// Custom width of the sidebar menu when collapsed and expanded
const asiderWidth = computed(() => 300);
const getTheme = computed(() => 'dark');
</script>
<style lang="scss">
@import 'assets/style/layout';
</style>
