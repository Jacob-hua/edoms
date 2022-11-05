<template>
  <div class="table-container">
    <div class="top-wrapper">
      <div class="top-wrapper-left">
        <p class="name">模型表-AAAAAA</p>
        <p class="description">模型描述信息</p>
      </div>
      <div class="top-wrapper-right">
        <el-button type="danger" size="large">清空</el-button>
        <el-button type="primary" size="large">导入</el-button>
        <el-button type="primary" size="large">导出</el-button>
      </div>
    </div>
    <div class="table">
      <div class="table-top">
        <div class="table-text">操作记录</div>
        <el-button type="primary" size="large">导出操作记录</el-button>
      </div>
      <el-table :data="historyData" border>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="operate" label="操作"></el-table-column>
        <el-table-column prop="operator" label="操作人"></el-table-column>
        <el-table-column prop="fileName" label="文件名称"></el-table-column>
        <el-table-column prop="operateTime" label="操作时间"></el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next, jumper" :total="50"> </el-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup name="StaticModelTable">
const historyData = [
  {
    operate: '导入',
    operator: '张三',
    fileName: 'ab.csv',
    operateTime: '2022-11-2',
  },
  {
    operate: '清空',
    operator: '李四',
    fileName: 'ab.csv',
    operateTime: '2022-11-3',
  },
  {
    operate: '删除',
    operator: '王麻子',
    fileName: 'ab.csv',
    operateTime: '2022-11-4',
  },
];
</script>

<style lang="scss" scoped>
.table-container {
  padding: 0 60px;
  .table {
    margin-top: 60px;
    .table-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      .table-text {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }

  .top-wrapper {
    display: flex;
    justify-content: space-between;
    .top-wrapper-left {
      .name {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
  .pagination {
    float: right;
    margin-top: 40px;
  }
}
</style>
