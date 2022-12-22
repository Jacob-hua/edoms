<template>
  <div class="wrapper">
    <section v-show="loginFormVisible" class="form-section">
      <h2>登录</h2>
      <el-form ref="loginFormRef" :model="loginFormModel" :rules="loginFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginFormModel.username"
            type="text"
            name="username"
            oninvalid="setCustomValidity('请输入用户名');"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginFormModel.password"
            type="password"
            name="password"
            oninvalid="setCustomValidity('请输入登陆密码');"
          />
        </el-form-item>

        <el-button type="primary" @click="nextStep">下一步</el-button>
      </el-form>
    </section>
    <section v-show="tenantFormVisible" class="form-section">
      <h2>选择租户</h2>
      <el-form ref="tenantFormRef" :model="tenantFormModel" :rules="tenantFormRules">
        <el-form-item label="租户" prop="tenantId">
          <el-select v-model="tenantFormModel.tenantId">
            <el-option
              v-for="{ tenantId, tenantName } in accountStore.tenants"
              :key="tenantId"
              :value="tenantId"
              :label="tenantName"
            />
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="backPreStep">上一步</el-button>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FormInstance, FormRules } from 'element-plus';

import useAccountStore from '@/store/account';

const router = useRouter();

const loginFormVisible = ref<boolean>(true);

const tenantFormVisible = ref<boolean>(false);

const loginFormModel = reactive({
  username: '',
  password: '',
});

const loginFormRules = ref<FormRules>({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
});

const loginFormRef = ref<FormInstance>();

const tenantFormModel = reactive({
  tenantId: '',
});

const tenantFormRules = ref<FormRules>({
  tenantId: [{ required: true, message: '租户不能为空', trigger: 'blur' }],
});

const tenantFormRef = ref<FormInstance>();

const accountStore = useAccountStore();

const nextStep = () => {
  loginFormRef.value &&
    loginFormRef.value.validate(async (validated) => {
      if (!validated) {
        return;
      }
      await accountStore.login({
        username: loginFormModel.username,
        password: loginFormModel.password,
      });
      if (!accountStore.currentTenant) {
        loginFormVisible.value = false;
        tenantFormVisible.value = true;
      }
    });
};

const backPreStep = () => {
  loginFormVisible.value = true;
  tenantFormVisible.value = false;
};

const login = () => {
  tenantFormRef.value &&
    tenantFormRef.value.validate((validated) => {
      if (!validated) {
        return;
      }
      accountStore.triggerTenant(tenantFormModel.tenantId);
      router.push({
        path: '/',
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
