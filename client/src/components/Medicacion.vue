    //src/components/Medicacion.vue
<template>
  <h2>Recordatorio de Medicamentos</h2>
  <el-button type="primary" @click="openMed()">+ Nuevo Medicamento</el-button>
  <el-table :data="meds" style="margin-top:1rem" stripe>
    <el-table-column prop="id_medicamento" label="ID" width="80"/>
    <el-table-column prop="nombre"      label="Nombre"/>
    <el-table-column prop="dosis"       label="Dosis"/>
    <el-table-column prop="frecuencia"  label="Frecuencia"/>
    <el-table-column prop="hora_inicio" label="Hora Inicio" width="120"/>
    <el-table-column label="Acciones" width="240">
      <template #default="r">
        <el-button size="mini" @click="openMed(r.row)">Editar</el-button>
        <el-button size="mini" type="danger" @click="confirmDelMed(r.row.id_medicamento)">
          Eliminar
        </el-button>
        <el-button size="mini" type="success" @click="verReg(r.row.id_medicamento)">
          Ver Registros
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- Modal Medicamento -->
  <el-dialog :title="medForm.id_medicamento?'Editar':'Nuevo'" v-model="showMed">
    <el-form :model="medForm" ref="fMed" :rules="rulesMed">
      <el-form-item label="Nombre" prop="nombre"><el-input v-model="medForm.nombre"/></el-form-item>
      <el-form-item label="Dosis" prop="dosis"><el-input v-model="medForm.dosis"/></el-form-item>
      <el-form-item label="Frecuencia" prop="frecuencia"><el-input v-model="medForm.frecuencia"/></el-form-item>
      <el-form-item label="Hora" prop="hora_inicio"><el-time-picker v-model="medForm.hora_inicio" /></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showMed=false">Cancelar</el-button>
      <el-button type="primary" @click="saveMed()">Guardar</el-button>
    </template>
  </el-dialog>

  <!-- Modal Registros -->
  <el-dialog title="Registros" v-model="showReg">
    <el-table :data="regs" stripe>
      <el-table-column prop="id_registro" label="ID" width="80"/>
      <el-table-column prop="fecha_hora" label="Fecha/Hora"/>
      <el-table-column prop="tomado" label="Tomado?" width="100">
        <template #default="r">{{ r.row.tomado? 'Sí':'No' }}</template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as api from '../apis/api.js';

const meds    = ref([]);
const showMed = ref(false);
const medForm = ref({ id_medicamento:null, nombre:'', dosis:'', frecuencia:'', hora_inicio:null });
const fMed    = ref(null);
const rulesMed = {
  nombre: [{ required:true }], dosis:[{ required:true }], frecuencia:[{ required:true }],
  hora_inicio:[{ required:true, message:'Selecciona hora', trigger:'change' }]
};

const regs    = ref([]);
const showReg = ref(false);

async function loadMed(){
  meds.value = (await api.getMedicamentos()).data;
}
onMounted(loadMed);

function openMed(r){
  if(r) medForm.value={ ...r };
  else medForm.value={ id_medicamento:null, nombre:'', dosis:'', frecuencia:'', hora_inicio:null };
  showMed.value=true;
}

async function saveMed(){
  await fMed.value.validate();
  if(medForm.value.id_medicamento) await api.updateMedicamento(medForm.value);
  else await api.createMedicamento(medForm.value);
  ElMessage.success('Guardado');
  showMed.value=false; loadMed();
}

function confirmDelMed(id){
  ElMessageBox.confirm('¿Eliminar?','Eliminar',{ type:'warning', confirmButtonText:'Sí', cancelButtonText:'No' })
    .then(async()=>{ await api.deleteMedicamento(id); ElMessage.success('Eliminado'); loadMed(); });
}

async function verReg(id){
  regs.value = (await api.getRegistros(id)).data;
  showReg.value=true;
}
</script>