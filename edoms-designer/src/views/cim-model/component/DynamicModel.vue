<template>
  <div class="dynamic">
    <GridList
      ref="gridList"
      class="grid-list"
      column-gap="20px"
      row-gap="20px"
      :page-size="9999999"
      item-min-width="200px"
      :request="loadData"
    >
      <template #default="{ item }">
        <div :class="['item', item.id === firstData.id ? 'active' : '']" @click="handleChangeName(item)">
          {{ item.name }}
        </div>
      </template>
      <template #noMore>
        <div></div>
      </template>
    </GridList>
    <div class="right-section">
      <div class="section-top">
        <span class="name">{{ firstData.name }}</span>
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
  </div>
</template>

<script lang="ts" setup name="DynamicModel">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

import { getApi, getDicData, saveApi, simulationApi } from '@/api/model';
import GridList from '@/components/GridList.vue';
import { ModelMark } from '@/const/model';
import { KVStruct } from '@/const/struct';

import EditorTable from './Table.vue';

const jsonData = ref({});
const path = ref<string>('');
const method = ref<string>('');

const tabActive = ref<string>('Params');
const table = ref();
onMounted(() => {
  if (table.value) {
    table.value.showTable = true;
  }
});
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
type KeyType = 'params' | 'body' | 'header' | 'cookie';
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
        data.findIndex(({ mark }) => row.mark === mark),
        1
      );
    })
    .catch(() => {});
};

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

const gridList = ref(null);
const firstData = ref({
  name: '',
  id: null,
});
const loadData = async () => {
  const result: any = await getDicData({
    mark: ModelMark.CIM_URL as string,
  });
  firstData.value = result[0];
  await getApiInfo();
  return {
    data: result,
    total: result.length,
  };
};
const convertData = (data: any) => {
  return {
    ...data,
    isEdit: false,
    readOnly: true,
    btnText: operateType[OperateType.EDIT],
  };
};
const apiInfo = ref();
const initialToLowerCase = (name: string): string => {
  return `${name.charAt(0).toLowerCase()}${name.slice(1)}`;
};
const getApiInfo = async () => {
  const result = await getApi({
    dicCimId: Number(firstData.value.id),
  });
  apiInfo.value = result;
  path.value = result?.path ?? '';
  method.value = result?.method ?? '';
  parameterData.value.forEach((parameter) => {
    const key: KeyType = initialToLowerCase(parameter.name) as KeyType;
    parameter.tableData = result[key]?.map(convertData) ?? [];
  });
};
const handleChangeName = (model: any) => {
  firstData.value = model;
  jsonData.value = {};
  getApiInfo();
};

const handleSave = async () => {
  const copyData = [...parameterData.value];
  copyData.forEach((parameter) => {
    parameter.tableData.forEach((data) => {
      delete data.btnText;
      delete data.isEdit;
      delete data.readOnly;
    });
  });
  await saveApi({
    id: apiInfo.value.id,
    body: copyData[1].tableData,
    cookie: copyData[3].tableData,
    dicCimId: firstData.value.id!,
    header: copyData[2].tableData,
    params: copyData[0].tableData,
    path: path.value,
    method: method.value,
  });
  ElMessage.success('保存成功');
};
const handleSimulation = async () => {
  const copyData = [...parameterData.value];
  copyData.forEach((parameter) => {
    parameter.tableData.forEach((data) => {
      data.mark && delete data.mark;
      data.isEdit && delete data.isEdit;
      data.readOnly && delete data.readOnly;
    });
  });
  try {
    const responseData = await simulationApi({
      body: copyData[1].tableData,
      cookie: copyData[3].tableData,
      header: copyData[2].tableData,
      params: copyData[0].tableData,
      path: path.value,
      method: method.value,
    });
    jsonData.value = responseData ?? {};
  } catch (e) {
    jsonData.value = {};
  }
};
</script>

<style lang="scss" scoped>
.active {
  background-color: #409eff;
}
.json {
  background-color: #e0e0e0;
  margin-top: 20px;
}
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
.item {
  cursor: pointer;
  border-bottom: 1px solid #e1e1e1;
}
.select {
  width: 115px;
}
.dynamic {
  height: 700px;
  overflow-y: auto;
  display: flex;
  .grid-list {
    width: 15%;
    text-align: left;
    height: 700px;
    border-right: 1px solid #e1e1e1;
  }
  .right-section {
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
}
</style>
