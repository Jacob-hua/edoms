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
        <div class="item" @click="handleChangeName(item)">{{ item.name }}</div>
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

import { RequestMethod } from '@edoms/utils';

import { getDicData, getTableApi, saveApi, simulation } from '@/api/cim-model';
import GridList from '@/components/GridList.vue';
import { Mark } from '@/const/model-mark';

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
const parameterData = ref([
  {
    name: 'Params',
    tableData: [] as any[],
  },
  {
    name: 'Body',
    tableData: [] as any[],
  },
  {
    name: 'Header',
    tableData: [] as any[],
  },
  {
    name: 'Cookie',
    tableData: [] as any[],
  },
]);
const handleAdd = (type: string) => {
  parameterData.value
    .find(({ name }) => name === type)
    ?.tableData.push({
      id: Math.random(),
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
        placeholder: '',
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
  const data = parameterData.value.find(({ name }) => name === tabActive.value)?.tableData;
  data?.splice(
    data.findIndex(({ id }) => row.id === id),
    1
  );
};

const requestMethods = [
  {
    label: RequestMethod.GET,
    value: RequestMethod.GET,
  },
  {
    label: RequestMethod.POST,
    value: RequestMethod.POST,
  },
];

const gridList = ref(null);
const firstData = ref({
  name: '',
  id: null,
});
const loadData = async () => {
  const result: any = await getDicData({
    mark: Mark.CIM_URL as string,
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
const getApiInfo = async () => {
  const result = await getTableApi({
    dicCimId: Number(firstData.value.id),
  });
  console.log(result);
  path.value = result?.path ?? '';
  method.value = result?.method ?? '';
  parameterData.value[0].tableData = result.params?.map(convertData) ?? [];
  parameterData.value[1].tableData = result.body?.map(convertData) ?? [];
  parameterData.value[2].tableData = result.header?.map(convertData) ?? [];
  parameterData.value[3].tableData = result.cookie?.map(convertData) ?? [];
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
      delete data.id;
      delete data.btnText;
      delete data.isEdit;
      delete data.readOnly;
    });
  });
  const { result } = await saveApi({
    body: copyData[1].tableData,
    cookie: copyData[3].tableData,
    dicCimId: firstData.value.id!,
    header: copyData[2].tableData,
    params: copyData[0].tableData,
    path: path.value,
    method: method.value,
  });
  console.log(result);
};
const handleSimulation = async () => {
  const copyData = [...parameterData.value];
  copyData.forEach((parameter) => {
    parameter.tableData.forEach((data) => {
      delete data.id;
      delete data.btnText;
      delete data.isEdit;
      delete data.readOnly;
    });
  });
  try {
    const { result } = await simulation({
      body: copyData[1].tableData,
      cookie: copyData[3].tableData,
      header: copyData[2].tableData,
      params: copyData[0].tableData,
      path: path.value,
      method: method.value,
    });
    jsonData.value = result ?? {};
  } catch (e) {
    console.log(e, '-----------');
  }
};
</script>

<style lang="scss" scoped>
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
