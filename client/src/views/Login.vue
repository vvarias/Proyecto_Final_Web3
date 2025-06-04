//src/views/Login.vue
<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2>Iniciar Sesión</h2>
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>

        <el-form-item label="Contraseña" prop="password">
          <el-input v-model="form.password" type="password" autocomplete="off" />
        </el-form-item>

        <el-form-item label="Captcha" prop="captcha">
          <el-row gutter="8">
            <el-col :span="12">
              <el-input v-model="form.captcha" placeholder="Escribe el código" />
            </el-col>
            <el-col :span="12">
              <img
                :src="captchaImageUrl"
                @click="reloadCaptcha"
                alt="Captcha"
                title="Haz clic para recargar"
                style="cursor: pointer; border: 1px solid #ccc; padding: 4px;"
              />
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">Iniciar Sesión</el-button>
        </el-form-item>

        <el-form-item>
          <el-link @click="goToRegister" type="primary">¿No estás registrado?</el-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import client from '../apis/client.js';

const router = useRouter();
const formRef = ref();

const form = reactive({
  email: '',
  password: '',
  captcha: ''
});

const rules = {
  email: [
    { required: true, message: 'Por favor ingresa tu correo', trigger: 'blur' },
    { type: 'email', message: 'Formato de correo inválido', trigger: 'blur' }
  ],
  password: [{ required: true, message: 'Por favor ingresa tu contraseña', trigger: 'blur' }],
  captcha: [{ required: true, message: 'Por favor ingresa el captcha', trigger: 'blur' }]
};

const captchaImageUrl = ref('');

const reloadCaptcha = () => {
  captchaImageUrl.value = `http://localhost:3000/api/captcha?${Date.now()}`;
};

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      const response = await client.post('/auth/login', {
        email:    form.email,
        password: form.password,
        captcha:  form.captcha
      });
      ElMessage.success('¡Inicio de sesión exitoso!');

      // Guardar token y usuario en localStorage o en tu store
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('./dashboard');
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al iniciar sesión';
      ElMessage.error(msg);
      reloadCaptcha(); 
    }
  });
};

const goToRegister = () => {
  router.push('/register');
};

onMounted(() => {
  reloadCaptcha();
});
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}
.login-card {
  width: 400px;
  padding: 20px;
}
</style>