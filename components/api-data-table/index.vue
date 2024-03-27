<template>
  <a-button
    v-if="props.groupActions.filter((item) => item.name === TABLE_ADD_ITEM).length"
    id="employees-add"
    :icon="h(PlusOutlined)"
    :disabled="disableAdd"
    @click="handleAddClicked"
  >
    {{ $t('add') }}
  </a-button>
  <a-table
    id="ant-table-striped"
    :columns="props.columns"
    :data-source="getTableDatas"
    :pagination="state.pagination"
    :scroll="props.scroll"
    :loading="state.loading"
    @change="hanlePageData"
  >
    <template v-for="(_, slotName) of $slots" #[slotName]="slotData" :key="slotName">
      <slot :name="slotName" v-bind="slotData"></slot>
    </template>
    <template #bodyCell="slotData">
      <slot name="bodyCell" v-bind="slotData"></slot>
    </template>
    <template #emptyText>
      <div class="ant-empty ant-empty-normal">
        <div class="ant-empty-image">
          <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
              <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7"></ellipse>
              <g fill-rule="nonzero" stroke="#d9d9d9">
                <path
                  d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
                ></path>
                <path
                  d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                  fill="#fafafa"
                ></path>
              </g>
            </g>
          </svg>
        </div>
        <p class="ant-empty-description">データがありません</p>
      </div>
    </template>
  </a-table>
  <a-pagination
    v-if="!getTableDatas.length"
    id="pagination-custom"
    v-model:current="state.pagination.defaultCurrent"
    :total="1"
    :page-size="10"
    :show-size-changer="true"
    :class="{ 'float-right': true, 'display-none': state.loading }"
    :locale="state.pagination.locale"
  />
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { composableRepository } from '~/composables/useRepository';
import { LOCAL_STORAGE_EMAIL, TABLE_ADD_ITEM, TABLE_EDIT_ITEM } from '@/constants/axios';
import { globalDataStore } from '@/stores/globalData';
import { setKeylocalStorage, getKeylocalStorage } from '@/utils/storage';
import { LOGIN } from '~/constants/router';

const globalData = globalDataStore();
const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  datas: {
    type: Array,
    default: () => []
  },
  scroll: {
    type: Object,
    default: () => {}
  },
  editRows: {
    type: Array,
    default: () => []
  },
  pagination: {
    type: Array,
    default: () => []
  },
  resource: {
    type: String,
    default: () => ''
  },
  patch: {
    type: String,
    default: () => ''
  },
  isUnmatched: {
    type: Boolean,
    default: () => false
  },
  groupActions: {
    type: Array,
    default: () => []
  },
  isSharing: {
    type: Boolean,
    default: () => false
  },
  zoomScroll: {
    type: Object,
    default: () => {}
  }
});
const state = reactive({
  currentAction: '',
  isAction: false,
  loading: false,
  startIndex: 0,
  pagination: {
    defaultCurrent: 1,
    current: 1,
    pageSize: 10,
    total: 100,
    showSizeChanger: true,
    locale: {
      items_per_page: '/ ページ',
      prev_page: '前のページ',
      next_page: '次のページ',
      prev_5: '前の5つ',
      next_5: '次の5つ',
      prev_3: '前の3つ',
      next_3: '前の3つ'
    }
  },
  employee_info: []
});
const $repository = composableRepository(props.resource);
// get datas
const tableDatas = ref([]);
const fetchDatas = async (params: object) => {
  try {
    const { data, status } = await $repository.get(props.patch, params);

    if (status === 200) {
      const { items, pagination } = data.data;
      tableDatas.value = items;
      state.pagination.current = pagination.current_page;
      state.pagination.total = pagination.total;
      state.startIndex = (state.pagination.current - 1) * state.pagination.pageSize || 0;

      if (state.startIndex > state.pagination.total && state.pagination.current > 1) {
        state.pagination.current = Math.ceil(state.pagination.total / state.pagination.pageSize);
        await fetchDatas(state.pagination);
      }
      setKeylocalStorage(props.resource, items);
      state.loading = false;
    }
  } catch (e: any) {
    resetStateOnError();
    console.log(e.message);
  }
};
const resetStateOnError = () => {
  state.pagination.current = 1;
  state.pagination.total = 10;
  state.pagination.pageSize = 10;
  tableDatas.value = [];
  state.loading = false;
};
const hanlePageData = (event: any) => {
  if (state.currentAction === 'ADD') {
    event.pageSize--;
    state.currentAction = '';
    getTableDatas.value.splice(0, 1);
  }
  state.pagination.pageSize = event.pageSize;
  const params = {
    ...router.currentRoute.value.query,
    ...{
      page: parseInt(event.current),
      per_page: parseInt(event.pageSize)
    }
  };
  router.push({ query: params });
};
const router = useRouter();
watchEffect(() => {
  state.loading = true;
  state.pagination.current = parseInt(router.currentRoute.value.query?.page) || 1;
  state.pagination.pageSize = parseInt(router.currentRoute.value.query?.per_page) || 10;
  const params = { ...router.currentRoute.value.query };
  setTimeout(() => {
    state.isAction = false;
    emit('onResetAction');
    fetchDatas(params);
  }, 1000);
  const email = async () => await localStorage.getItem(LOCAL_STORAGE_EMAIL);
  if (!email) {
    const router = useRouter();
    router.push(LOGIN);
  }
});
const getTableDatas = computed(() => tableDatas.value);
// group action crud
const emit = defineEmits(['onAddClicked', 'onResetAction']);
const setActions = (status: any) => {
  state.isAction = status;
};
const setPageSize = (type: any) => {
  if (type === 'ADD') {
    state.currentAction = 'ADD';
    state.pagination.pageSize++;
  } else {
    state.pagination.pageSize--;
    state.currentAction = '';
  }
};
const handleAddClicked = () => {
  state.isAction = true;
  const newItems = {
    id: TABLE_ADD_ITEM,
    user_id: null,
    user_role_id: 1,
    user_emails: [],
    name: '',
    is_switch_private_mode_enabled: true,
    user_role_name: 'user'
  };
  setPageSize('ADD');
  getTableDatas.value.unshift(newItems);
  emit('onAddClicked');
};
const backupDatas = async () => {
  const backupData = await getKeylocalStorage(props.resource, {});
  getTableDatas.value.splice(0, getTableDatas.value.length, ...backupData);
};
const handleCancel = (type: any) => {
  state.isAction = false;
  if (type === TABLE_ADD_ITEM) {
    setPageSize('REMOVE');
    getTableDatas.value.splice(0, 1);
  }
  if (type === TABLE_EDIT_ITEM) {
    backupDatas();
  }
};
const refresh = () => {
  state.loading = true;
  const params = { ...router.currentRoute.value.query };
  setTimeout(() => {
    fetchDatas(params);
    state.isAction = false;
  }, 1000);
};
const disableAdd = computed(() => {
  return state.isAction || state.loading;
});
// Event handler to update background color based on window width
// const windowWidth = ref(1880);
// const myEventHandler = () => {
//   windowWidth.value = window.innerWidth;
// };
// const zoomScroll = computed(() => {
//   windowWidth.value = window.innerWidth;
//   globalData.setCurrentZoom(windowWidth.value);
//   if (!getTableDatas.value.length) {
//     return { y: 20000 };
//   }
//   if (windowWidth.value <= 1540) {
//     return props.zoomScroll;
//   }
//   if (getTableDatas.value.length) {
//     return props.scroll;
//   }
// });
// // Add event listener on component mount
// onMounted(() => {
//   window.addEventListener('resize', myEventHandler);
// });
// // Remove event listener on component unmount
// onBeforeUnmount(() => {
//   window.removeEventListener('resize', myEventHandler);
// });
// public properties
defineExpose({
  refresh,
  handleCancel,
  setActions,
  setPageSize
});
</script>
