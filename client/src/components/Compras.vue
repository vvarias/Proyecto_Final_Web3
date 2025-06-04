    //src/components/Compras.vue
<template>
  <h2>Lista de Compras Compartida</h2>
  <el-button type="primary" @click="openLista()">+ Nueva Lista</el-button>
  <el-table :data="listas" style="margin-top:1rem" stripe>
    <el-table-column prop="id_lista" label="ID" width="80"/>
    <el-table-column prop="nombre"   label="Lista"/>
    <el-table-column prop="creado_por" label="Creado por"/>
    <el-table-column prop="fecha_crea" label="Fecha" width="160"/>
    <el-table-column label="Acciones" width="200">
      <template #default="r">
        <el-button size="mini" @click="openLista(r.row)">Editar</el-button>
        <el-button size="mini" type="danger" @click="confirmDelLista(r.row.id_lista)">
          Eliminar
        </el-button>
        <el-button size="mini" type="success" @click="verItems(r.row)">Ver Items</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- Modal Lista -->
  <el-dialog :title="formLista.id_lista ? 'Editar Lista' : 'Nueva Lista'" v-model="showLista">
    <el-form :model="formLista" ref="fLista" :rules="rulesLista">
      <el-form-item label="Nombre" prop="nombre">
        <el-input v-model="formLista.nombre"/>
      </el-form-item>
      <el-form-item label="Creado por" prop="creado_por">
        <el-input v-model="formLista.creado_por"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showLista = false">Cancelar</el-button>
      <el-button type="primary" @click="saveLista()">Guardar</el-button>
    </template>
  </el-dialog>

  <!-- Modal Items -->
  <el-dialog title="Items de la Lista" v-model="showItems">
    <el-button type="primary" @click="openItem()">+ Agregar Item</el-button>
    <el-table :data="items" style="margin-top:1rem" stripe>
      <el-table-column prop="id_item" label="ID" width="80"/>
      <el-table-column prop="descripcion" label="Descripción"/>
      <el-table-column prop="cantidad" label="Cantidad"/>
      <el-table-column prop="comprado" label="¿Comprado?" width="100">
        <template #default="r">{{ r.row.comprado ? 'Sí':'No' }}</template>
      </el-table-column>
      <el-table-column label="Acciones" width="200">
        <template #default="r">
          <el-button size="mini" @click="openItem(r.row)">Editar</el-button>
          <el-button size="mini" type="danger" @click="confirmDelItem(r.row.id_item)">
            Eliminar
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Modal Item -->
    <el-dialog :title="formItem.id_item ? 'Editar Item' : 'Nuevo Item'" v-model="showItem">
      <el-form :model="formItem" ref="fItem" :rules="rulesItem">
        <el-form-item label="Descripción" prop="descripcion">
          <el-input v-model="formItem.descripcion"/>
        </el-form-item>
        <el-form-item label="Cantidad" prop="cantidad">
          <el-input type="number" v-model="formItem.cantidad"/>
        </el-form-item>
        <el-form-item label="Comprado" prop="comprado">
          <el-switch v-model="formItem.comprado"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showItem = false">Cancelar</el-button>
        <el-button type="primary" @click="saveItem()">Guardar</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as api from '../apis/api.js';

const listas     = ref([]);
const showLista  = ref(false);
const formLista  = ref({ id_lista: null, nombre: '', creado_por: '' });
const fLista     = ref(null);
const rulesLista = {
  nombre:     [{ required:true, message:'Requerido', trigger:'blur' }],
  creado_por: [{ required:true, message:'Requerido', trigger:'blur' }]
};

const items      = ref([]);
const showItems  = ref(false);

const showItem   = ref(false);
const formItem   = ref({ id_item: null, descripcion: '', cantidad: 1, comprado: false, id_lista: null });
const fItem      = ref(null);
const rulesItem  = {
  descripcion: [{ required:true, message:'Requerido', trigger:'blur' }],
  cantidad:    [{ required:true, message:'Requerido', trigger:'blur' }]
};

async function loadListas() {
  listas.value = (await api.getListas()).data;
}

onMounted(loadListas);

// Renombrado aquí a openLista
function openLista(row) {
  if (row) {
    formLista.value = { ...row };
  } else {
    formLista.value = { id_lista: null, nombre: '', creado_por: '' };
  }
  showLista.value = true;
}

async function saveLista() {
  await fLista.value.validate();
  if (formLista.value.id_lista) {
    await api.updateLista(formLista.value);
  } else {
    await api.createLista(formLista.value);
  }
  ElMessage.success('Guardado');
  showLista.value = false;
  loadListas();
}

function confirmDelLista(id) {
  ElMessageBox.confirm('¿Eliminar lista?', 'Eliminar', {
    type: 'warning',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then(async () => {
    await api.deleteLista(id);
    ElMessage.success('Eliminada');
    loadListas();
  });
}

async function verItems(row) {
  // Aseguramos id_lista siempre presente
  formItem.value.id_lista = row.id_lista;
  items.value = (await api.getItems(row.id_lista)).data;
  showItems.value = true;
}

function openItem(row) {
  if (row) {
    formItem.value = { ...row };
  } else {
    // Usamos el id_lista que ya almacenamos en formItem.value
    formItem.value = { id_item: null, descripcion: '', cantidad: 1, comprado: false, id_lista: formItem.value.id_lista };
  }
  showItem.value = true;
}

async function saveItem() {
  await fItem.value.validate();
  if (formItem.value.id_item) {
    await api.updateItem(formItem.value);
  } else {
    await api.createItem(formItem.value);
  }
  ElMessage.success('Guardado');
  showItem.value = false;
  verItems({ id_lista: formItem.value.id_lista });
}

function confirmDelItem(id) {
  ElMessageBox.confirm('¿Eliminar item?', 'Eliminar', {
    type: 'warning',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  }).then(async () => {
    await api.deleteItem(id);
    ElMessage.success('Eliminado');
    verItems({ id_lista: formItem.value.id_lista });
  });
}
</script>