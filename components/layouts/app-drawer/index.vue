<template>
  <div class="menu-container" :class="{ 'is-side-menu': isSideMenu }">
    <a-menu
      v-model:selected-keys="state.selectedKeys"
      :open-keys="isSideMenu ? state.openKeys : []"
      :mode="isSideMenu ? 'inline' : 'horizontal'"
      :theme="theme"
      :collapsed="props.collapsed"
      collapsible
      @click="clickMenuItem"
    >
      <MyMenuItem :menus="menus" />
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, type PropType } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { type MenuTheme } from 'ant-design-vue';
import menu from '~/api/menu';
import MyMenuItem from '@/components/layouts/app-drawer/menu-item.vue';

const props = defineProps({
  collapsed: {
    type: Boolean
  },
  theme: {
    type: String as PropType<MenuTheme>
  }
});

const appURL = computed(() => {
  return useRuntimeConfig().public.appURL;
})
const currentRoute = useRoute();
const router = useRouter();
const state = reactive({
  openKeys: [] as string[],
  selectedKeys: [currentRoute.name] as string[]
});

const menus = computed(() => menu);
/** Sidebar Layout */
const isSideMenu = computed(() => 'sidemenu');
const getRouteByName = (name: string) => router.getRoutes().find((n) => n.name === name);
// Retrieve the currently open sub-menu
const clickMenuItem = ({ key }) => {
  if (key === currentRoute.name) return;
  const targetRoute = getRouteByName(key);
  const { isExt, openMode } = targetRoute?.meta ?? {};
  if (isExt && openMode !== 2) {
    window.open(key);
  } else {
    router.push({ name: key });
  }
};
</script>
<style lang="scss" scoped>
@import 'assets/style/menu';
</style>
