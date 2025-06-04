    //src/views/Dashboard.vue
<template>
  <el-container style="height:100vh">
    <Navbar />
    <el-header>
      <el-button @click="logout" type="danger" style="float:right">Logout</el-button>
      <el-tabs v-model="tab" type="card" stretch>
        <el-tab-pane label="Compras"       name="compras"/>
        <el-tab-pane label="Medicamentos"  name="med"/>
        <el-tab-pane label="Gastos"        name="gastos"/>
      </el-tabs>
    </el-header>
    <el-main>
      <component :is="currentComponent"/>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import Compras    from '../components/Compras.vue';
import Medicacion from '../components/Medicacion.vue';
import Gastos     from '../components/Gastos.vue';
import { useAuthStore } from '../store/auth.js';
import { useRouter } from 'vue-router';
import Navbar from '../components/Navbar.vue'

const tab = ref('compras');
const currentComponent = computed(() => ({
  compras:    Compras,
  med:        Medicacion,
  gastos:     Gastos
})[tab.value]);

const auth = useAuthStore();
const router = useRouter();
const logout = () => {
  auth.logout();
  router.push('/login');
};
</script>