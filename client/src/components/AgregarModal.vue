    //src/components/AgregarModal.vue
<template>
  <div class="add-container">

    <el-button type="primary" plain @click="dialogFormVisible = true">
      Agregar nuevo medicamento
    </el-button>

    <el-dialog
      v-model="dialogFormVisible"
      title="Agregar medicamento"
      width="500px"
      :destroy-on-close="true"
    >
      <el-form :model="form" @submit.prevent="EnviarMedicamento()">
        <el-form-item label="Nombre" :label-width="formLabelWidth">
          <el-input v-model="form.nombre" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Precio" :label-width="formLabelWidth">
          <el-input v-model="form.precio" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Stock" :label-width="formLabelWidth">
          <el-input v-model="form.stock" autocomplete="off" />
        </el-form-item>
        <template #footer>
          <el-button @click="dialogFormVisible = false">Cancelar</el-button>
          <el-button type="primary" native-type="submit">Confirmar</el-button>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { AgregarMedicamento } from '../apis/api.js'

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'
const emit = defineEmits(['medicamento-agregado'])

const form = reactive({
  nombre: '',
  precio: '',
  stock: ''
})

const EnviarMedicamento = async () => {
  try {
    const payload = {
      ...form,
      precio: parseFloat(form.precio),
      stock: Number(form.stock)
    }
    await AgregarMedicamento(payload)
    dialogFormVisible.value = false
    emit('medicamento-agregado')
    ElMessage({
      message: 'Se agregó correctamente',
      type: 'success',
      center: true,
      duration: 3000
    })
    // reset del form
    form.nombre = ''
    form.precio = ''
    form.stock = ''
  } catch (error) {
    console.error(error)
    ElMessage({
      message: 'Error al agregar',
      type: 'error',
      center: true
    })
  }
}
</script>

<style scoped>
.add-container {
  text-align: center;       /* centra el botón */
  margin-bottom: 1.5rem;    /* espacio bajo el botón */
}
</style>