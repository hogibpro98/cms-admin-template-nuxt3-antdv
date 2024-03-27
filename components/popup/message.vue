<template>
  <div class="popup">
    <div class="popup-inner">
      <h2 v-if="forbidden" id="title" :style="{ color: '#1F1A1D' }">{{ $t('info') }}</h2>
      <h2 v-else id="title">{{ $t('error') }}</h2>
<!--      <img v-if="forbidden" src="@/assets/images/icon_info.png" alt="error" />-->
<!--      <img v-else src="@/assets/images/icon_error.png" alt="error" />-->
      <slot />
      <a-button type="none" class="popup-close" ref="buttonRef" @click="togglePopup">
        {{ $t('ok') }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { HTTP_NOT_FOUND } from '@/constants/axios';

const userStore = useUserStore();
const togglePopup = () => {
  userStore.setIsAuthenticated(false);
};
const forbidden = computed(() => userStore.getStatusCode === HTTP_NOT_FOUND);
const buttonRef = ref({});
onMounted(() => {
  buttonRef.value?.focus();
});
</script>

<style lang="scss" scoped>
.popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.6s;

  .popup-inner {
    /* Auto layout */
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    gap: 10px;
    width: 375px;
    min-height: 256px;
    /* material-theme/sys/light/surface-container */
    background: #f5ebef;
    box-shadow: 4px 3px 15.4px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    /* Inside auto layout */
    flex: none;
    order: 0;
    flex-grow: 0;
    font-family: 'Roboto', sans-serif;

    button {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 0 25px;
      gap: 10px;

      width: 68px;
      height: 40px;

      background: #ffdbd0;
      border-radius: 12px;

      flex: none;
      order: 5;
      flex-grow: 0;
      margin-top: 30px;
    }
  }
}
#title {
  width: 72px;
  height: 0;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 0px !important;
  color: #ba1a1a;
  flex: none;
  order: 0;
  flex-grow: 0;
}
</style>
