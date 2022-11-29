<template>
  <div class="right-section">
    <div class="section-top">
      <span class="name">{{ data.name }}</span>
      <div>
        <el-button type="primary" size="large" @click="handleSaveApi">保存</el-button>
        <el-button type="primary" size="large" @click="handleSimulation">测试</el-button>
      </div>
    </div>
    <el-input v-model="apiInfo.path" placeholder="请输入请求路径" class="input-with-select" size="large">
      <template #prepend>
        <el-select v-model="apiInfo.method" placeholder="请求方式" class="select" size="large">
          <el-option v-for="{ label, value } in requestMethods" :key="value" :label="label" :value="value" />
        </el-select>
      </template>
    </el-input>
    <p class="title">请求参数</p>
    <el-tabs v-model="tabActive" class="demo-tabs">
      <el-tab-pane
        v-for="({ name, tableData, instanceKey }, index) in parameterData"
        :key="index"
        :label="name"
        :name="name"
      >
        <EditTable :ref="(el) => setRef(el, instanceKey)" :data-source="tableData">
          <EditTableColumn
            prop="key"
            label="key"
            :rules="[{ required: true, message: '请输入key值', trigger: 'blur' }]"
          >
            <template #edit="{ row }">
              <el-input v-model="row.key" />
            </template>
          </EditTableColumn>
          <EditTableColumn
            prop="value"
            label="value"
            :rules="[{ required: true, message: '请输入value值', trigger: 'blur' }]"
          >
            <template #edit="{ row }">
              <el-input v-model="row.value" />
            </template>
          </EditTableColumn>
          <EditTableColumn prop="isUse" label="是否可用" :rules="[]">
            <template #edit="{ row }">
              <el-switch v-model="row.isUse" inactive-value="0" active-value="1" />
            </template>
            <template #default="{ row }">
              <el-switch v-model="row.isUse" inactive-value="0" active-value="1" disabled />
            </template>
          </EditTableColumn>
          <EditTableColumn label="操作">
            <template #default="{ actions, $index }">
              <el-button type="primary" @click="handleEdit(actions, $index)">编辑</el-button>
              <el-button type="danger" @click="handleDelete(actions, $index)">删除</el-button>
            </template>
            <template #edit="{ $index, actions }">
              <el-button type="primary" @click="handleSave(actions, $index)">保存</el-button>
              <el-button type="danger" @click="handleCancel(actions, $index)">取消</el-button>
            </template>
          </EditTableColumn>
        </EditTable>
        <div class="bottom" @click="handleAdd(instanceKey)">新增</div>
      </el-tab-pane>
    </el-tabs>
    <json-viewer class="json" :value="jsonData" copyable boxed sort />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, toRefs } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { ApiStruct, Dic, getApi, saveApi, simulationApi } from '@/api/model';
import EditTable from '@/components/EditTable.vue';
import EditTableColumn from '@/components/EditTableColumn.vue';
import { KVStruct } from '@/const/struct';

const props = defineProps<{
  data: Dic;
}>();
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
    instanceKey: 'params',
    tableData: [] as KVStruct[],
  },
  {
    name: 'Body',
    instanceKey: 'body',
    tableData: [] as KVStruct[],
  },
  {
    name: 'Header',
    instanceKey: 'header',
    tableData: [] as KVStruct[],
  },
  {
    name: 'Cookie',
    instanceKey: 'cookie',
    tableData: [] as KVStruct[],
  },
]);
const tabActive = ref<string>('Params');
const tableInstance: Record<string, any> = {};
const setRef = (el: any, instanceKey: string) => {
  tableInstance[instanceKey] = el;
};

const handleEdit = (actions: any, index: number) => {
  actions.startEditable(index);
};
const handleDelete = (actions: any, index: number) => {
  ElMessageBox.confirm('此操作将永久删除此行记录, 是否继续?', '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      actions.deleteRow(index);
    })
    .catch(() => {});
};
const handleCancel = (actions: any, index: number) => {
  actions.cancelEditable(index);
};
const handleSave = (actions: any, index: number) => {
  actions.saveEditable(index);
};
const handleAdd = (instanceKey: any) => {
  if (!tableInstance[instanceKey]) {
    return;
  }
  tableInstance[instanceKey].editActions.addRow({
    key: '',
    value: '',
    isUse: '0',
  });
};
const jsonData = ref({});
const apiInfo = ref<ApiStruct>({
  body: [],
  cookie: [],
  dicCimId: 0,
  header: [],
  id: 0,
  method: '',
  params: [],
  path: '',
});
const { data } = toRefs(props);
const assignment = (metaData: typeof parameterData, api: typeof apiInfo) => {
  metaData.value.forEach((parameter: any) => {
    parameter.tableData = api.value?.[parameter.instanceKey];
  });
};

const parameterFactory = (paramsData: any[], isSimulation = true, { id, dicCimId, method, path } = apiInfo.value) => {
  return paramsData.reduce((parameter: ApiStruct, metaData) => {
    parameter[metaData.instanceKey] = metaData.tableData ?? [];
    return isSimulation
      ? { ...parameter, id, dicCimId, method, path }
      : {
          ...parameter,
          method,
          path,
        };
  }, {});
};
const handleSaveApi = async () => {
  await saveApi(parameterFactory(getNewResult([...parameterData.value])));
  ElMessage.success('保存成功');
};
const handleSimulation = async () => {
  try {
    jsonData.value = (await simulationApi(parameterFactory(getNewResult([...parameterData.value]), false))) ?? {};
  } catch (e) {
    jsonData.value = {};
  }
};

const getNewResult = (metaData: any[]) => {
  return metaData.reduce((result: any, newData) => {
    newData.tableData = tableInstance[newData.instanceKey].resultData;
    return [newData, ...result];
  }, []);
};

onMounted(async () => {
  apiInfo.value = await getApi({
    dicCimId: data.value.id,
  });
  assignment(parameterData, apiInfo);
});
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
