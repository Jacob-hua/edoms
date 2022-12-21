<template>
  <div class="wrapper">
    <section class="form-section">
      <h2>登录</h2>
      <el-form ref="formRef" :model="formModel" :rules="formRules">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formModel.username"
            type="text"
            name="username"
            oninvalid="setCustomValidity('请输入用户名');"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formModel.password"
            type="password"
            name="password"
            oninvalid="setCustomValidity('请输入登陆密码');"
          />
        </el-form-item>

        <el-button type="primary" @click="login">登录</el-button>
      </el-form>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { FormInstance, FormRules } from 'element-plus';

import useAccountStore from '@/store/account';

const formModel = reactive({
  username: '',
  password: '',
});

const formRules = ref<FormRules>({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
});

const formRef = ref<FormInstance>();

const accountStore = useAccountStore();

const login = () => {
  formRef.value &&
    formRef.value.validate(async (validated) => {
      if (!validated) {
        return;
      }
      accountStore.login({
        username: formModel.username,
        password: formModel.password,
      });
    });
};
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  background-image: linear-gradient(to bottom right, #1ccdbb, #1254b9);
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-section {
  background-color: aliceblue;
  width: 500px;
  height: 500px;
}
</style>
