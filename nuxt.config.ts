// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@ant-design-vue/nuxt'],
  plugins: ['~/plugins/axios'],
  css: ['@/assets/style/main.css'],
  runtimeConfig: {
    public: {
      backendURL: process.env.BACKEND_API,
      appURL: process.env.APP_URL
    }
  },
  antd: {
    extractStyle: true
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['a-extract-style'].includes(tag)
    }
  },
  ssr: false,//recommend turn off when use antd design
  devtools: { enabled: true }
});
