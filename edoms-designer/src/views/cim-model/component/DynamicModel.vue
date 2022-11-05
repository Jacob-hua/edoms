<template>
  <div class="dynamic">
    <GridList
      ref="gridList"
      class="grid-list"
      column-gap="20px"
      row-gap="20px"
      item-min-width="200px"
      :request="loadData"
    >
      <template #default="{ item }">
        <div class="item">{{ item.name }}</div>
      </template>
      <template #noMore>
        <div></div>
      </template>
    </GridList>
    <div class="right-section">
      <div class="section-top">
        <span class="name">模型API-测试</span>
        <div>
          <el-button type="primary" size="large">保存</el-button>
          <el-button type="primary" size="large">测试</el-button>
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
        <el-tab-pane label="Params" name="Params"></el-tab-pane>
        <el-tab-pane label="Body" name="Body"></el-tab-pane>
        <el-tab-pane label="Header" name="Header"></el-tab-pane>
        <el-tab-pane label="Cookie" name="Cookie"></el-tab-pane>
      </el-tabs>
      <EditorTable
        ref="table"
        v-model:tableKey="tableKey"
        border
        :ignore="['el-input']"
        :columns="column"
        :data="data"
        @selection-change="handleSelectionChange"
      >
        <template #operate="scope">
          <el-button type="primary" @click="handleEditClick(scope)"> {{ scope.operate.row.btnText }}</el-button>
          <el-button type="danger" @click="handleDelete(scope)"> 删除</el-button>
        </template>
        <template #bottom>
          <div class="bottom" @click="handleAdd">+新增</div>
        </template>
      </EditorTable>
      <json-viewer class="json" :value="jsonData" copyable boxed sort />
    </div>
  </div>
</template>

<script lang="ts" setup name="DynamicModel">
import { onMounted, ref } from 'vue';

import { RequestMethod } from '@edoms/utils';

import GridList, { RequestFunc } from '@/components/GridList.vue';

import EditorTable from './Table.vue';
const jsonData = ref({
  name: '就是的', //字符串
  age: 18, //数组
  isMan: false, //布尔值
  date: new Date(),
  fn: () => {},
  arr: [1, 2, 5],
});
const path = ref<string>('');
const method = ref<string>('');

const tabActive = ref<string>('Params');
const table = ref();
onMounted(() => {
  if (table.value) {
    table.value.showTable = true;
  }
});
const tableKey = ref(Math.random());
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
const data = ref([
  {
    id: Math.random(),
    key: 'userName',
    value: 'town',
    operate: false,
    isEdit: false,
    readOnly: true,
    btnText: operateType[OperateType.EDIT],
  },
  {
    id: Math.random(),
    key: 'password',
    value: 'town',
    operate: false,
    isEdit: false,
    readOnly: true,
    btnText: operateType[OperateType.EDIT],
  },
]);
const handleAdd = () => {
  data.value.push({
    id: Math.random(),
    key: 'password',
    operate: false,
    value: 'town',
    isEdit: false,
    readOnly: true,
    btnText: operateType[OperateType.EDIT],
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
      name: 'el-select',
      compProps: {
        placeholder: '请输入key',
      },
      child: {
        name: 'el-option',
        options: () => [
          {
            label: '选项一',
            value: 1,
          },
          {
            label: '选项二',
            value: 2,
          },
        ],
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
      prop: 'operate',
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
  data.value.splice(
    data.value.findIndex(({ id }) => row.id === id),
    1
  );
};
const handleSelectionChange = (data: any) => {
  console.log('选择了', data);
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
  {
    label: RequestMethod.DELETE,
    value: RequestMethod.DELETE,
  },
  {
    label: RequestMethod.PUT,
    value: RequestMethod.PUT,
  },
  {
    label: RequestMethod.PATCH,
    value: RequestMethod.PATCH,
  },
];

const loadData: RequestFunc<{ name: string }> = async () => {
  const dataSource = [
    {
      name: '模型api-1',
    },
    {
      name: '模型api-2',
    },
    {
      name: '模型api-3',
    },
    {
      name: '模型api-4',
    },
  ];
  return {
    data: dataSource,
    total: dataSource.length,
  };
};
const gridList = ref(null);
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
