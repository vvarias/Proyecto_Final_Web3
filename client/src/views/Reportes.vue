//src/views/Reportes.vue
<template>
  <div class="reportes-page">
    <h2>Reportes PDF</h2>
    <el-button type="primary" @click="generarPDF">Descargar Reporte de Gastos</el-button>
  </div>
</template>

<script setup>
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as api from '../apis/api.js'

async function generarPDF() {
  const { data: gastos } = await api.getGastos()
  const doc = new jsPDF()
  doc.text('Reporte de Gastos', 14, 20)
  doc.autoTable({
    head: [['ID', 'Descripción', 'Monto', 'Fecha', 'Categoría']],
    body: gastos.map(g => [g.id_gasto, g.descripcion, g.monto, g.fecha, g.categoria])
  })
  doc.save('reporte_gastos.pdf')
}
</script>

<style scoped>
.reportes-page {
  padding: 1rem;
}
</style>