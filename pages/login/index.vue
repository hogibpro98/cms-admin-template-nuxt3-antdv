<template>
  <a-layout>
    <div class="login-box">
<!--      <div class="login-logo">-->
<!--        <img src="@/assets/images/logo.png" alt="" width="100%" />-->
<!--      </div>-->
      <a-form ref="formRef" layout="horizontal" :model="state" name="dynamic_rule" :rules="rules">
        <a-form-item name="username">
          <span class="label_custom">{{ $t('lable_email_address') }}</span>
          <a-input v-model:value="state.username" size="large" :placeholder="$t('placeholder_email')" />
        </a-form-item>
        <a-form-item name="password">
          <span class="label_custom">{{ $t('label_password') }}</span>
          <a-input-password v-model:value="state.password" type="password" :placeholder="$t('placeholder_password')">
<!--            <template #iconRender="slotData">-->
<!--              <img v-if="!slotData" src="@/assets/images/icon_sleep.png" width="100%" alt="sleep" />-->
<!--              <img v-if="slotData" src="@/assets/images/icon_show_password.png" width="100%" alt="show" />-->
<!--            </template>-->
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="none" html-type="submit" :loading="state.loading" @click="handleSubmit">
            {{ $t('login') }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <Popup v-if="userStore.getIsAuthenticated">
      <span class="content-error">{{ userStore.getMessageError }}</span>
    </Popup>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useUserStore } from '@/stores/user';
import Popup from '@/components/popup/message.vue';
import { EMAIL_PATTERN, NO_SPACE_PATTERN } from '@/constants/regex';
// import { ERROR_EMAIL_REGEX, REQUIRED } from '@/constants/message';
import { DASHBOARD } from '@/constants/router';
import { LOCAL_STORAGE_EMAIL } from '@/constants/axios';

interface State {
  loading: boolean;
  username: string;
  password: string;
}

definePageMeta({
  middleware: 'is-logged-in'
});
const formRef = ref<FormInstance>();
const userStore = useUserStore();
const state = ref<State>({
  loading: false,
  username: '',
  password: ''
});
const rules: Record<string, Rule[]> = {
  username: [
    { type: 'email', message: 'ERROR_EMAIL_REGEX', trigger: 'change' },
    { pattern: EMAIL_PATTERN, message: 'ERROR_EMAIL_REGEX', trigger: 'change' },
    { required: true, message: 'REQUIRED', trigger: 'change' }
  ],
  password: [{ required: true, message: 'REQUIRED', trigger: 'change' }]
};
const handleSubmit = () => {
  formRef.value
      .validate()
      .then(async () => {
        state.value.loading = true;
        try {
          await userStore.login(
              state.value.username,
              NO_SPACE_PATTERN.test(state.value.password) ? state.value.password : 1
          );
        } catch (e: any) {
          state.value.loading = false;
          console.log(e.message);
        }
        state.value.loading = false;
      })
      .catch((error) => {
        console.log(error);
      });
};
onMounted(async () => {
  const email = await localStorage.getItem(LOCAL_STORAGE_EMAIL);
  if (email) {
    const router = useRouter();
    router.push(DASHBOARD);
  } else {
    window.history.pushState(null, 'null', window.location.href);
    window.onpopstate = function () {
      window.history.pushState(null, 'null', window.location.href);
    };
  }
});
</script>
<style lang="scss" scoped>
@import '@/assets/style/login';
</style>
