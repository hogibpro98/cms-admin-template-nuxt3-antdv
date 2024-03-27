# Nuxt 3

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Nuxt3 x ESlint + Prettier + Husky

Look at the [Nuxt3 x ESlint + Prettier + Husky](https://ithelp.ithome.com.tw/articles/10301702) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# install package need
npm i -D eslint-plugin-nuxt@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest
```

nano .eslintrc and past contents:
```text
{
  "env": {
    "browser": true,
    "es2022": true
  },
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "plugin:nuxt/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "parser": "@typescript-eslint/parser"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    //
  }
}
```

update package.json :
```text
{
  //,,,
  "scripts": {
    // ...
    "lint": "eslint . --ext .ts,.vue",
    "lint:fix": "eslint . --ext .ts,.vue --fix"
  },
  // ...
}
```

Step2: prettier
```bash
#npm
npm i -D prettier eslint-plugin-prettier eslint-config-prettier
```

update .eslintrc
```text
{
  "env": {
    "browser": true,
    "es2022": true
  },
  "extends": [
+   "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:nuxt/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "parser": "@typescript-eslint/parser"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
+   "prettier/prettier": [
+     "error",
+     {
+       // .....
+     }
+   ]
  }
}
#some common rule

  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": 0,
    "camelcase": 0,
    "no-explicit-any": 0,
    "vue/multi-word-component-names": 0,
    "vue/singleline-html-element-content-newline": 0,
    "vue/require-default-prop": 0,
    "prettier/prettier": [
      "error",
      {
        "printWidth": 120, // Depending on the screen size provided by the company
        "tabWidth": 2, // Tabs are recommended to be 2 spaces wide
        "singleQuote": true, // Double quotes were common in the past, but now single quotes are preferred
        "semi": true, // Depends on personal or team preference; in the past, JavaScript always required semicolons at the end
        "trailingComma": "none", // Trailing comma preference
        "endOfLine": "auto"
      }
    ]
  }
```
Step3: Husky + Lint-staged
```bash
#npm
npm i -D husky lint-staged
```

nano .huskyrc.json and past
```text
{
  "hooks": {
    "pre-commit": "lint-staged"
  }
}
```

nano .lintstagedrc.json
```text
{
  "*.+(vue|js|jsx|ts|tsx)": [
    "eslint --fix",
    "git add"
  ],
  "*.+(json|css|md)": [
    "prettier --write",
    "git add"
  ]
}
```

# Pinia & vue-i18n

Look at the [Nuxt3 x ESlint + Prettier + Husky](https://ithelp.ithome.com.tw/articles/10297733) to learn more.

## Setup

Make sure to install the dependencies:

Pinina

```bash
#npm
npm install pinia @pinia/nuxt --legacy-peer-deps
```

update nuxt.config
```text
export default defineNuxtConfig({
  modules: [
    // ...
    '@pinia/nuxt',
  ],
})
```

vue-i18n
```bash
#npm
npm install --save-dev vue-i18n
```
mkdir plugins and nano i18n.ts past contents:
```text
# create: locales/en/index.ts
export default { 
    test: 'Test' 
};

# create: locales/en/index.ts
export default {
  test: '加入以下設定'
};

# create: locales/index.ts
import en from '~/locales/en/index';
import ja from '~/locales/ja/index';

export default {
  en: {
    ...en
  },
  ja: {
    ...ja
  }
};
# create: plugins/i18n.ts
import { createI18n } from 'vue-i18n';
import cloneDepp from 'lodash/cloneDeep';
// Add language support below
import index from '~/locales/index';
export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'ja',
    // Importing language files
    messages: cloneDepp(index)
  });

  vueApp.use(i18n);
});

# npm
npm i --save-dev @types/lodash
```
# Pinia & vue-i18n

Look at the [Nuxt3 x Axios](https://axios.nuxtjs.org/) to learn more.

## Setup

Make sure to install the dependencies:

```bash
#npm
npm install @nuxtjs/axios

#this source develop axios by repository design pattern:
- plugins/axios.ts
- api/repository.ts
- composables/useRepository.ts
#how to use:
import { composableRepository } from '~/composables/useRepository';
...
const $repository = composableRepository(props.resource);
...
on component

```

# That all thanks for watch my git, in here you can add more packages, libraries ...

# For example you can add  Antdv design library for app

Look at the [Ant Design Vue Nuxt](https://nuxt.com/modules/ant-design-vue) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# Using pnpm
pnpm add -D @ant-design-vue/nuxt

# Using yarn
yarn add --dev @ant-design-vue/nuxt

# Using npm
npm install --save-dev @ant-design-vue/nuxt
```

Add @ant-design-vue/nuxt to the modules section of nuxt.config.ts
```text
export default defineNuxtConfig({
  modules: [...,'@ant-design-vue/nuxt'],
  antd:{
    extractStyle: true
  },
  ...
});

```

update App.vue
```text
<template>
  <a-extract-style>
    <NuxtLayout>
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </a-extract-style>
</template>
```
and more ...
