<template>
  <a-col>
    <template v-for="item in filterMenus" :key="item.name || item.fullPath">
      <!-- sub menu -->
      <template v-if="isShowSubMenu(item)">
        <a-sub-menu :key="item?.name" v-bind="$attrs">
          <template #title>
            <MenuItemContent :item="item" />
          </template>
          <template v-if="item.children">
            <MyMenuItem :menus="item.children" />
          </template>
        </a-sub-menu>
      </template>
      <!-- menu -->
      <template v-else>
        <MenuItemContent :item="item" />
      </template>
    </template>
  </a-col>
</template>

<script setup lang="ts">
import { type PropType, computed } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import MenuItemContent from '@/components/layouts/app-drawer/menu-item-content.vue';

defineOptions({
  name: 'MyMenuItem'
});

const props = defineProps({
  menus: {
    type: Array as PropType<RouteRecordRaw[]>,
    default: () => []
  }
});

const filterMenus = computed(() => {
  return [...props.menus]
    .filter((n) => !n?.hideInMenu)
    .sort((a, b) => (a?.meta?.orderNum || 0) - (b?.meta?.orderNum || 0));
});

const isShowSubMenu = (menuItem: RouteRecordRaw) => {
  return menuItem?.children?.length;
};
</script>
