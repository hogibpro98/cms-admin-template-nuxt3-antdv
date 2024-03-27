<template>
  <div>
    <a-spin :spinning="spinning">
      <a-col id="employees-table">
        <api-data-table
            ref="tableRef"
            :columns="columns"
            :resource="resource"
            :patch="patch"
            :is-unmatched="true"
            :scroll="{ y: 800 }"
            :group-actions="groupActions"
            :zoom-scroll="zoomScroll"
            @on-add-clicked="addNewItem"
            @on-reset-action="resetAction"
        >
          <template #bodyCell="{ column, record }">
            <a-form ref="formRef" :key="record.id" :model="record" name="dynamic_rule">
              <template v-if="column.key === 'user_id'">
                <a-form-item v-if="editableData[record.id]" name="user_id">
                  <a-input
                      v-model:value="inputValue"
                      :status="inputValue ? '' : 'error'"
                      type="text"
                      :maxlength="6"
                      :min="0"
                      @blur="onBlur"
                  />
                  <div v-if="!inputValue && inputValue !== 0" class="ant-form-item-explain-error">必須項目です。</div>
                </a-form-item>
                <span v-else>{{
                    ((inputValue && !record.user_id && record.user_id !== 0) ||
                        states.currentUserId === record.user_id) &&
                    states.action !== TABLE_CANCEL_ITEM
                        ? inputValue.toString().padStart(6, '0')
                        : record.user_id.toString().padStart(6, '0')
                  }}</span>
              </template>
              <template v-if="column.key === 'user_role_id'">
                <a-form-item
                    v-if="editableData[record.id]"
                    name="user_role_id"
                    :rules="[{ required: true, message: '必須項目です。', trigger: 'change' }]"
                >
                  <a-select v-model:value="record.user_role_id" class="full-width">
                    <a-select-option v-for="role in roles" :key="role.value" :value="role.value"
                    >{{ $t(role.label) }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
                <span v-else>{{ $t(displayRoleName(record.user_role_id)) }}</span>
              </template>
              <template v-if="column.key === 'name'">
                <a-form-item
                    v-if="editableData[record.id]"
                    name="name"
                    :rules="[{ required: true, message: '必須項目です。', trigger: 'change' }]"
                >
                  <a-input v-model:value="record.name" :status="record.name ? '' : 'error'" type="text" />
                  <div v-if="!record.name" class="ant-form-item-explain-error">必須項目です。</div>
                </a-form-item>
                <span v-else>{{ record.name }}</span>
              </template>
              <template v-if="column.key === 'user_emails'">
                <a-form-item
                    v-if="editableData[record.id]"
                    name="user_emails"
                    :rules="[
                    { required: true, message: '必須項目です。', trigger: 'change' },
                    { validator: checkDuplicateEmail(), trigger: 'change' }
                  ]"
                >
                  <a-select
                      v-model:value="record.user_emails"
                      :status="record.user_emails.length ? '' : 'error'"
                      mode="tags"
                      style="width: 100%"
                      :token-separators="[',']"
                      :options="optionsEmployeeEmails"
                      menu-item-selected-icon=""
                      remove-icon="X"
                      :max-tag-count="2"
                  />
                  <div v-if="!record.user_emails.length" class="ant-form-item-explain-error">必須項目です。</div>
                </a-form-item>
                <span v-else>{{
                    record.user_emails.length ? record.user_emails.join(', ').replace(/,/g, ', ') : ''
                  }}</span>
              </template>
              <template v-if="column.key === 'is_switch_private_mode_enabled'">
                <a-form-item
                    v-if="editableData[record.id]"
                    name="is_switch_private_mode_enabled"
                    :rules="[{ required: true, message: '必須項目です。', trigger: 'change' }]"
                >
                  <a-switch v-model:checked="record.is_switch_private_mode_enabled" />
                </a-form-item>
                <a-switch
                    v-if="!editableData[record.id]"
                    v-model:checked="record.is_switch_private_mode_enabled"
                    :disabled="!editableData[record.id]"
                />
              </template>
              <template v-if="column.key === 'action'">
                <a-form-item>
                  <div class="editable-row-operations" :style="{ marginTop: '6px', marginBottom: editableData[record.id] ? '10px' : '0px' }">
                    <span v-if="editableData[record.id]">
                      <span class="submit-text" style="color: #8b4483" @click="save(record)">確定</span>
                      <a-divider type="vertical" />
                      <span class="submit-text" style="color: #80747b" @click="cancel(record.id, states.action, record)"
                      >中止</span
                      >
                    </span>
                    <span v-else>
                      <a-button
                          :disabled="states.isProcessing || globalData.getGlobalStatus[resource] === TABLE_ADD_ITEM"
                          class="edit-button"
                          @click="edit(record)"
                      >
                        edit
                      </a-button>
                    </span>
                  </div>
                </a-form-item>
              </template>
            </a-form>
          </template>
        </api-data-table>
      </a-col>
    </a-spin>
  </div>
</template>
<script setup lang="ts">
import type { TableColumnsType, SelectProps, FormInstance } from 'ant-design-vue';
import { reactive, computed, ref, watch } from 'vue';
import { EMPLOYEE, LIST_MANAGE_EMPLOYEE } from '~/constants/resource';
import { HTTP_OK, TABLE_ADD_ITEM, TABLE_CANCEL_ITEM, TABLE_EDIT_ITEM } from '@/constants/axios';
import { globalDataStore } from '@/stores/globalData';
import { composableRepository } from '~/composables/useRepository';
import { EMAIL_PATTERN } from '~/constants/regex';
// import { ERROR_EMAIL_REGEX } from '~/constants/message';
import ApiDataTable from '~/components/api-data-table/index.vue';
import { EMPLOYEE_ID } from '~/constants/common';

const globalData = globalDataStore();

definePageMeta({
  layout: 'dashboard',
  // middleware: 'is-logged-in'
});

const states = reactive({
  isProcessing: false,
  action: '',
  currentId: '',
  currentUserId: ''
});
const spinning = ref<boolean>(false);
const resource = EMPLOYEE;
const patch = LIST_MANAGE_EMPLOYEE;
const actions: TableColumnsType = [
  {
    title: '編集',
    width: '12%',
    dataIndex: 'action',
    key: 'action'
  }
];
const columns: TableColumnsType = [
  { title: EMPLOYEE_ID, width: '10%', dataIndex: 'user_id', key: 'user_id' },
  { title: 'システムアクセス権限', width: '15%', dataIndex: 'user_role_id', key: 'user_role_id' },
  { title: '名前', width: '15%', dataIndex: 'name', key: 'name' },
  { title: 'メールアドレス', width: '400px', dataIndex: 'user_emails', key: 'user_emails' },
  {
    title: 'モード切替対象',
    width: '18%',
    dataIndex: 'is_switch_private_mode_enabled',
    key: 'is_switch_private_mode_enabled'
  },
  ...actions
];
const groupActions = [
  {
    name: TABLE_ADD_ITEM,
    data: {
      id: TABLE_ADD_ITEM,
      user_id: null,
      user_role_id: 1,
      user_emails: [],
      name: '',
      is_switch_private_mode_enabled: true,
      user_role_name: 'user'
    }
  }
];

const roles = [
  {
    value: 1,
    label: 'user'
  },
  {
    value: 2,
    label: 'vendor_admin'
  }
];
const displayRoleName = (roleValue: any) => {
  return roles.find((role: any) => role.value === roleValue)?.label ?? '';
}
const optionsEmployeeEmails = ref<SelectProps['options']>([]);

interface EditableData {
  [key: string]: any;
}

const editableData: EditableData = reactive({});
const tableRef = ref({});
const resetAction = () => {
  states.action = '';
  states.isProcessing = false;
  delete editableData[states.currentId];
};
const addNewItem = () => {
  states.action = TABLE_ADD_ITEM;
  states.isProcessing = true;
  editableData[TABLE_ADD_ITEM] = true;
  inputValue.value = '';
  states.currentUserId = '';
};
const edit = (record: any) => {
  tableRef.value.setActions(true);
  states.action = TABLE_EDIT_ITEM;
  states.isProcessing = true;
  states.currentId = record.id;
  states.currentUserId = record.user_id;
  editableData[record.id] = true;
  inputValue.value = record.user_id.toString().padStart(6, '0');
};
const cancel = (id: any, option: any, record: any) => {
  states.isProcessing = false;
  delete editableData[id];
  inputValue.value = '';
  states.action = TABLE_CANCEL_ITEM;
  tableRef.value.handleCancel(option);
};
const repository = composableRepository(EMPLOYEE);
const formRef = ref<FormInstance>();
const isValidation = ref(false);
const formatUserId = (input: any) => {
  let str = input.toString();
  while (str.startsWith('0')) {
    str = str.slice(1);
  }
  return str || 0;
};

const validateInput = (record: any) => {
  if (
      (!inputValue.value && inputValue.value !== 0) ||
      !record.user_emails.length ||
      !record.name ||
      isValidation.value
  ) {
    return false;
  }
  return true;
};

const createPayload = (record: any) => {
  return {
    id: record.id === TABLE_ADD_ITEM ? null : Number.parseInt(record.id),
    user_id: formatUserId(inputValue.value),
    user_role_id: record.user_role_id,
    user_emails: record.user_emails,
    name: record.name,
    is_switch_private_mode_enabled: record.is_switch_private_mode_enabled ? 1 : 0
  };
};

const handleSuccess = (res: any, payload: any, record: any) => {
  if (res.data.status === HTTP_OK) {
    message.success('成功');
    states.isProcessing = false;
    delete editableData[record.id];
    if (!payload.id) {
      tableRef.value.setPageSize('REMOVE');
    }
    tableRef.value.refresh();
  }
};

const handleError = (error: any) => {
  console.log(error.message);
  states.isProcessing = false;
};

const save = async (record: any) => {
  if (!validateInput(record)) {
    return;
  }

  try {
    await formRef.value.validate();
    const payload = createPayload(record);
    const res = ref({});

    if (!payload.id) {
      res.value = await repository.createUserInfo(payload);
    } else {
      res.value = await repository.updateUserInfo(payload);
    }

    handleSuccess(res.value, payload, record);
  } catch (e: any) {
    handleError(e);
  }
};
const checkDuplicateEmail = () => (rule: any, value: any, callback: any) => {
  const duplicateEmail = value.some((domain: any) => !EMAIL_PATTERN.test(domain));
  isValidation.value = EMAIL_PATTERN.test(value);
  if (duplicateEmail) {
    isValidation.value = true;
    return callback(new Error('ERROR_EMAIL_REGEX'));
  } else {
    console.log(rule);
    isValidation.value = false;
    return callback();
  }
};
const zoomScroll = computed(() => {
  if (globalData.getCurrentZoom < 1290) {
    return { y: 360 };
  }
  if (globalData.getCurrentZoom < 1540) {
    return { y: 500 };
  }
});
// format user number
const inputValue = ref<any>('');

const format = (val: string, preVal: string) => {
  const reg = /^\d+$/;

  if ((!isNaN(+val) && reg.test(val)) || val === '') {
    inputValue.value = val;
  } else {
    inputValue.value = preVal;
  }
};

// '.' at the end or only '-' in the input box.
const onBlur = () => {
  if (inputValue.value.endsWith('.') || inputValue.value === '-') {
    format(inputValue.value.slice(0, -1), inputValue.value);
  }
};

watch(inputValue, (val, preVal) => {
  format(val, preVal);
});
</script>
