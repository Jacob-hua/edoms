<template>
  <div class="right-section">
    <div class="section-top">
      <span class="name">{{ data.name }}</span>
      <div>
        <el-button type="primary" size="large" @click="handleSave">保存</el-button>
        <el-button type="primary" size="large" @click="handleSimulation">测试</el-button>
      </div>
    </div>
    <el-input v-model="path" placeholder="请输入请求路径" class="input-with-select" size="large">
      <template #prepend>
        <el-select v-model="method" placeholder="请求方式" class="select" size="large">
          <el-option v-for="{ label, value } in requestMethods" :key="value" :label="label" :value="value" />
        </el-select>
      </template>
    </el-input>
    <p class="title">请求参数</p>
    <el-tabs v-model="tabActive" class="demo-tabs">
      <el-tab-pane v-for="({ name, tableData }, index) in parameterData" :key="index" :label="name" :name="name">
        <EditorTable ref="table" border :ignore="['el-input']" :columns="column" :data="tableData">
          <template #operate="scope">
            <el-button type="primary" @click="handleEditClick(scope)"> {{ scope.operate.row.btnText }}</el-button>
            <el-button type="danger" @click="handleDelete(scope)"> 删除</el-button>
          </template>
          <template #bottom>
            <div class="bottom" @click="handleAdd(name)">+新增</div>
          </template>
        </EditorTable>
      </el-tab-pane>
    </el-tabs>
    <json-viewer class="json" :value="jsonData" copyable boxed sort />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { ApiStruct, Dic, getApi, saveApi, simulationApi } from '@/api/model';
import { KVStruct } from '@/const/struct';

import EditorTable from './Table.vue';

const props = defineProps<{
  data: Dic;
}>();

type KeyType = 'params' | 'body' | 'header' | 'cookie';
enum OperateType {
  EDIT = 'edit',
  SAVE = 'save',
  DELETE = 'delete',
}
const operateType = {
  [OperateType.EDIT]: '编辑',
  [OperateType.SAVE]: '保存',
  [OperateType.DELETE]: '删除',
};

const { data } = toRefs(props);
const jsonData = ref({});
const path = ref<string>('');
const method = ref<string>('');

const tabActive = ref<string>('Params');
const table = ref();
const apiInfo = ref();

onMounted(() => {
  if (table.value) {
    table.value.showTable = true;
    getApiInfo();
  }
});

const requestMethods = [
  {
    label: 'GET',
    value: 'GET',
  },
  {
    label: 'POST',
    value: 'POST',
  },
];
const parameterData = ref([
  {
    name: 'Params',
    tableData: [] as KVStruct[],
  },
  {
    name: 'Body',
    tableData: [] as KVStruct[],
  },
  {
    name: 'Header',
    tableData: [] as KVStruct[],
  },
  {
    name: 'Cookie',
    tableData: [] as KVStruct[],
  },
]);

const column = ref([
  {
    colAttr: {
      type: 'index',
      width: '100',
      label: '序号',
    },
  },
  {
    colAttr: {
      prop: 'key',
      label: 'key',
    },
    component: {
      name: 'el-input',
      compProps: {
        placeholder: '请输入key',
      },
    },
  },
  {
    colAttr: {
      prop: 'value',
      label: 'value',
    },
    component: {
      name: 'el-input',
      compProps: {
        placeholder: '请输入value',
      },
    },
  },
  {
    colAttr: {
      prop: 'isUse',
      label: '是否可用',
    },
    component: {
      name: 'el-switch',
      compProps: {
        // 添加 表格插入的组件属性 defaultProps 属性
        placeholder: '',
        activeValue: '1',
        inactiveValue: '0',
      },
    },
  },
]);

const initialToLowerCase = (name: string): string => {
  return `${name.charAt(0).toLowerCase()}${name.slice(1)}`;
};

const convertData = (data: any) => {
  return {
    ...data,
    isEdit: false,
    readOnly: true,
    btnText: operateType[OperateType.EDIT],
  };
};

const getApiInfo = async () => {
  const result = await getApi({
    dicCimId: data.value.id,
  });
  apiInfo.value = result;
  path.value = result?.path ?? '';
  method.value = result?.method ?? '';
  parameterData.value.forEach((parameter) => {
    const key: KeyType = initialToLowerCase(parameter.name) as KeyType;
    parameter.tableData = result[key]?.map(convertData) ?? [];
  });
};

const handleAdd = (type: string) => {
  parameterData.value
    .find(({ name }) => name === type)
    ?.tableData.push({
      remark: String(Math.random()),
      key: '',
      isUse: false,
      value: '',
      isEdit: true,
      readOnly: false,
      btnText: operateType[OperateType.SAVE],
    });
  table.value.showTable = true;
};

const handleEditClick = ({ operate }: any) => {
  operate.row.readOnly = false;
  if (operate.row.btnText === operateType[OperateType.EDIT]) {
    operate.row.isEdit = true;
    operate.row.btnText = operateType[OperateType.SAVE];
  } else {
    operate.row.btnText = operateType[OperateType.EDIT];
    operate.row.isEdit = false;
    operate.row.readOnly = true;
  }
  table.value.showTable = true;
};
const handleDelete = ({ operate: { row } }: any) => {
  ElMessageBox.confirm('此操作将永久删除此行记录, 是否继续?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const data = parameterData.value.find(({ name }) => name === tabActive.value)?.tableData;
      data?.splice(
        data.findIndex(({ remark }) => row.remark === remark),
        1
      );
    })
    .catch(() => {});
};

const deleteKeys = (table: any, isDeleteBtnText = true) => {
  if (isDeleteBtnText) {
    delete table.btnText;
  }
  delete table.isEdit;
  delete table.readOnly;
  delete table.mark;
  return table;
};

const parameterFactory = (paramsData: any[], isDeleteBtnText = true) => {
  const parameter = paramsData.reduce((parameter: ApiStruct, metaData) => {
    const key: KeyType = initialToLowerCase(metaData.name) as KeyType;
    parameter[key] = metaData.tableData.map((table: any) => deleteKeys(table, isDeleteBtnText));
    return parameter;
  }, {});
  if (isDeleteBtnText) {
    return {
      id: apiInfo.value.id,
      dicCimId: data.value.id!,
      method: method.value,
      path: path.value,
      ...parameter,
    };
  }
  return {
    method: method.value,
    path: path.value,
    ...parameter,
  };
};
const handleSave = async () => {
  await saveApi(parameterFactory([...parameterData.value]));
  ElMessage.success('保存成功');
};
const handleSimulation = async () => {
  try {
    jsonData.value = (await simulationApi(parameterFactory([...parameterData.value], false))) ?? {};
  } catch (e) {
    jsonData.value = {};
  }
};
</script>

<style lang="scss" scoped>
.right-section {
  .bottom {
    cursor: pointer;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    border-radius: 20px;
    background-color: #409eff;
    margin-top: 15px;
  }
  width: 85%;
  padding: 0 60px;
  .title {
    font-size: 26px;
    font-weight: 500;
    margin: 20px 0;
  }
  .section-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .name {
      font-size: 24px;
      font-weight: 500;
    }
  }
}
</style>
