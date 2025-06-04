    //src/App.vue
<template>
  <router-view/>
</template>

<script setup>
// Nada que importar aquí: todo se hace vía router-view
</script>

<style>
/* Opcional: estilos globales para el body */
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
  color: #2c3e50;
  min-height: 100vh;
}
.auth-page {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>