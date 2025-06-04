//src/components/Navbar.vue
<template>
  <el-header class="navbar">
    <div class="navbar-left">
      <el-icon><i class="el-icon-menu" /></el-icon>
      <span class="navbar-title">Mi Sistema</span>
    </div>

    <div class="navbar-right">
      <el-button type="text" @click="goTo('control')" v-if="authStore.isAuthenticated">
        Centro de Control del hogar
      </el-button>
      <el-button type="text" @click="goTo('login')" v-else>
        Iniciar Sesión
      </el-button>
      <el-button type="text" @click="goTo('register')" v-else>
        
      </el-button>
      <el-button type="danger" @click="logout" v-if="authStore.isAuthenticated">
        Cerrar Sesión
      </el-button>
    </div>
  </el-header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth';
import { ElMessage } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();

const goTo = (route) => {
  router.push({ name: route });
};

const logout = () => {
  authStore.logout();
  ElMessage.success('Sesión cerrada');
  router.push({ name: 'login' });
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409eff;
  color: white;
  padding: 0 20px;
}

.navbar-title {
  font-size: 1.5em;
  margin-left: 10px;
  font-weight: bold;
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
}

.el-button {
  margin-left: 10px;
  color: white;
}
</style>