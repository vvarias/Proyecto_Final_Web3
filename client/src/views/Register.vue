//src/views/Register.vue
<template>
  <div class="auth-page">
    <h2>Registrate</h2>
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      @submit.prevent="onSubmit"
      label-width="100px"
    >
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="form.nombre" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="form.password" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Rol" prop="rol">
        <el-select v-model="form.rol" placeholder="Selecciona rol">
          <el-option label="Usuario" value="usuario" />
          <el-option label="Admin"   value="admin" />
        </el-select>
      </el-form-item>

      <el-form-item label="Captcha" prop="captcha">
        <div class="captcha-container">
          <div v-html="captchaSvg" class="captcha-image"></div>
          <el-button icon="el-icon-refresh" @click="loadCaptcha" circle />
        </div>
        <el-input v-model="form.captcha" placeholder="Ingresa el texto" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" native-type="submit">Registrar</el-button>
        <router-link to="/login" style="margin-left: 1rem;">
          ¿Ya tienes cuenta?
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../store/auth.js';
import * as api from '../apis/api.js';

const form = reactive({
  nombre:  '',
  email:   '',
  password:'',
  rol:     'usuario',
  captcha: ''
});
const captchaSvg = ref('');
const router = useRouter();
const auth = useAuthStore();

const rules = {
  nombre:  [{ required: true, message: 'Nombre es requerido', trigger: 'blur' }],
  email:   [
    { required: true, message: 'Email es requerido', trigger: 'blur' },
    { type: 'email',   message: 'Email inválido',   trigger: 'blur' }
  ],
  password:[
    { required: true, message: 'Contraseña es requerida', trigger: 'blur' },
    { min: 8, message: 'Mínimo 8 caracteres', trigger: 'blur' }
  ],
  rol:     [{ required: true, message: 'Selecciona un rol', trigger: 'change' }],
  captcha: [{ required: true, message: 'Captcha es requerido', trigger: 'blur' }]
};

async function loadCaptcha() {
  try {
    const res = await api.getCaptcha();
    captchaSvg.value = res.data;
  } catch {
    ElMessage.error('No se pudo cargar captcha');
  }
}

const onSubmit = async () => {
  try {
    await auth.register({
      nombre:   form.nombre,
      email:    form.email,
      password: form.password,
      rol:      form.rol,
      captcha:  form.captcha
    });
    ElMessage.success('Registro exitoso, ahora haz login');
    router.push('/login');
  } catch (e) {
    const msg = e.response?.data?.error || e.message || 'Error al registrar';
    ElMessage.error(msg);
    loadCaptcha();
  }
};

onMounted(loadCaptcha);
</script>

<style scoped>
.auth-page {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.captcha-container {
  display: flex;
  align-items: center;
}
.captcha-image {
  border: 1px solid #ddd;
  padding: 4px;
  margin-right: 0.5rem;
}
</style>