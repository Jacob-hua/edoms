<template>
  <div class="wrapper">
    <section v-show="loginFormVisible" class="form-section">
      <div class="title">E-DOMs</div>
      <div class="body">
        <el-form
          ref="loginFormRef"
          size="large"
          label-width="80px"
          label-position="left"
          :model="loginFormModel"
          :rules="loginFormRules"
        >
          <el-form-item :label="t('login.用户名')" prop="username">
            <el-input
              v-model="loginFormModel.username"
              type="text"
              name="username"
              oninvalid="setCustomValidity('请输入用户名');"
            />
          </el-form-item>

          <el-form-item :label="t('login.密码')" prop="password">
            <el-input
              v-model="loginFormModel.password"
              type="password"
              name="password"
              oninvalid="setCustomValidity('请输入登陆密码');"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button :disabled="nextStepDisabled" type="primary" @click="nextStep">{{ t('login.下一步') }}</el-button>
      </div>
    </section>
    <section v-show="tenantFormVisible" class="form-section">
      <div class="title">E-DOMs</div>
      <div class="body">
        <el-form
          ref="tenantFormRef"
          size="large"
          label-width="80px"
          label-position="left"
          :model="tenantFormModel"
          :rules="tenantFormRules"
        >
          <el-form-item :label="t('login.项目')" prop="tenantId">
            <el-select v-model="tenantFormModel.tenantId">
              <el-option
                v-for="{ dataCode, proName } in accountStore.tenants"
                :key="dataCode"
                :value="dataCode"
                :label="proName"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" @click="backPreStep">{{ t('login.上一步') }}</el-button>
        <el-button :disabled="loginDisabled" type="primary" @click="login">{{ t('login.登录') }}</el-button>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { FormInstance, FormRules } from 'element-plus';

import useAccountStore from '@/store/account';
const { t } = useI18n();

const router = useRouter();

const loginFormVisible = ref<boolean>(true);

const tenantFormVisible = ref<boolean>(false);

const loginFormModel = reactive({
  username: '',
  password: '',
});

const nextStepDisabled = computed<boolean>(() => !loginFormModel.username || !loginFormModel.password);

const loginFormRules = ref<FormRules>({
  username: [{ required: true, message: t('login.rules.用户名不能为空'), trigger: 'blur' }],
  password: [{ required: true, message: t('login.rules.密码不能为空'), trigger: 'blur' }],
});

const loginFormRef = ref<FormInstance>();

const tenantFormModel = reactive({
  tenantId: '',
});

const tenantFormRules = ref<FormRules>({
  tenantId: [{ required: true, message: t('login.rules.租户不能为空'), trigger: 'blur' }],
});

const loginDisabled = computed<boolean>(() => !tenantFormModel.tenantId);

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
      loginFormVisible.value = false;
      tenantFormVisible.value = true;
    });
};

const backPreStep = () => {
  loginFormVisible.value = true;
  tenantFormVisible.value = false;
  tenantFormRef.value && tenantFormRef.value.resetFields();
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
  width: 100%;
  height: 100%;
  background-image: linear-gradient(to bottom right, #1ccdbb, #1254b9);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}
.form-section {
  background-color: aliceblue;
  width: 500px;
  height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .title {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    font-weight: 400;
  }

  .body {
    flex: 1;
    padding: 20px;
    .el-select--large {
      line-height: 40px;
      width: 100%;
    }
  }

  .footer {
    height: 60px;
    display: flex;
    flex-direction: row;
    & > button {
      flex: 1;
      height: 100%;
      border-radius: 0;
    }
    .el-button + .el-button {
      margin-left: 5px;
    }
  }
}
</style>
