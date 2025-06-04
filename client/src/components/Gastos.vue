<template>
  <div class="gastos-page">
    <h2>Control de Gastos</h2>

    <!-- ==== Gráfico: le pasamos "gastos" como prop ==== -->
    <div class="chart-wrapper">
      <ExpenseChart :gastos="gastos" />
    </div>

    <!-- ==== Botones ==== -->
    <div class="actions" style="margin: 1rem 0">
      <el-button type="primary" @click="openCat()">+ Categoría</el-button>
      <el-button type="primary" @click="openGasto()">+ Gasto</el-button>
    </div>

    <!-- ==== Tabla de Gastos ==== -->
    <el-table :data="gastos" stripe style="margin-top:1rem">
      <el-table-column prop="id_gasto"    label="ID"       width="80" />
      <el-table-column prop="descripcion" label="Desc."            />
      <el-table-column prop="monto"       label="Monto"    width="100"/>
      <el-table-column prop="fecha"       label="Fecha"    width="120"/>
      <el-table-column prop="categoria"   label="Categoría"       />
      <el-table-column label="Acciones"   width="200">
        <template #default="scope">
          <el-button size="mini" @click="openGasto(scope.row)">Editar</el-button>
          <el-button size="mini" type="danger" @click="confirmDelGasto(scope.row.id_gasto)">
            Eliminar
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- ==== Modal Categoría ==== -->
    <el-dialog
      title="Categoría"
      v-model="showCat"
      width="400px"
      @close="onCatDialogClose"
    >
      <el-form :model="catForm" ref="fCat" :rules="rulesCat" label-width="100px">
        <el-form-item label="Nombre" prop="nombre">
          <el-input v-model="catForm.nombre" placeholder="Ingresa nombre" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCat = false">Cancelar</el-button>
        <el-button type="primary" @click="saveCat()">Guardar</el-button>
      </template>
    </el-dialog>

    <!-- ==== Modal Gasto ==== -->
    <el-dialog
      title="Gasto"
      v-model="showGasto"
      width="500px"
      @close="onGastoDialogClose"
    >
      <el-form :model="gForm" ref="fG" :rules="rulesG" label-width="100px">
        <el-form-item label="Desc." prop="descripcion">
          <el-input v-model="gForm.descripcion" placeholder="Descripción" />
        </el-form-item>

        <el-form-item label="Monto" prop="monto">
          <el-input
            type="number"
            v-model="gForm.monto"
            placeholder="Monto (€)"
            min="0"
          />
        </el-form-item>

        <el-form-item label="Fecha" prop="fecha">
          <el-date-picker
            v-model="gForm.fecha"
            type="date"
            placeholder="Selecciona fecha"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item label="Categoría" prop="id_categoria">
          <el-select v-model="gForm.id_categoria" placeholder="Selecciona">
            <el-option
              v-for="c in cats"
              :key="c.id_categoria"
              :label="c.nombre"
              :value="c.id_categoria"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showGasto = false">Cancelar</el-button>
        <el-button type="primary" @click="saveGasto()">Guardar</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import ExpenseChart from './ExpenseChart.vue';
import * as api from '../apis/api.js';

/* ——— Datos Reactivos ——— */
const cats = ref([]);
const gastos = ref([]);

/* ——— Modal Categoría ——— */
const showCat = ref(false);
const catForm = ref({ id_categoria: null, nombre: '' });
const fCat = ref(null);
const rulesCat = {
  nombre: [{ required: true, message: 'Requerido', trigger: 'blur' }]
};

/* ——— Modal Gasto ——— */
const showGasto = ref(false);
const gForm = ref({
  id_gasto: null,
  descripcion: '',
  monto: 0,
  fecha: null,
  id_categoria: null
});
const fG = ref(null);
const rulesG = {
  descripcion: [{ required: true, message: 'Requerido', trigger: 'blur' }],
  monto: [{ required: true, message: 'Requerido', trigger: 'blur' }],
  fecha: [{ required: true, message: 'Requerido', trigger: 'change' }],
  id_categoria: [{ required: true, message: 'Requerido', trigger: 'change' }]
};

/** 
 * Carga inicial de categorías y gastos 
 */
async function load() {
  try {
    const [catsRes, gastosRes] = await Promise.all([api.getCategorias(), api.getGastos()]);

    cats.value = catsRes.data || [];

    // Mapear cada gasto para añadir propiedad “categoria” si no viene
    gastos.value = (gastosRes.data || []).map(g => {
      const nombreCat = g.categoria
        ? g.categoria
        : (catsRes.data.find(c => c.id_categoria === g.id_categoria)?.nombre || '—');
      return { ...g, categoria: nombreCat };
    });
  } catch (error) {
    console.error('Error en load() de Gastos.vue:', error);
    ElMessage.error('No se pudieron cargar categorías o gastos');
  }
}

/** 
 * Abre el modal de Categoría (crear o editar) 
 */
function openCat(row) {
  console.log('openCat llamado con row =', row);
  if (row) {
    // Si se pasó un objeto existente, es modo edición (aunque servidor no permite editar actualmente)
    catForm.value = { ...row };
  } else {
    // Modo creación
    catForm.value = { id_categoria: null, nombre: '' };
  }
  showCat.value = true;

  nextTick(() => {
    if (fCat.value) {
      // fCat.value.clearValidate();
    }
  });
}

/** 
 * Guarda (crea) la categoría 
 */
async function saveCat() {
  try {
    await fCat.value.validate();
    console.log('Guardando categoría:', catForm.value);

    // El servidor solo admite POST /categorias (no PUT), así que ignoramos id_categoria en edición
    if (catForm.value.id_categoria) {
      ElMessage.warning('Editar categorías no está disponible. Crea una nueva.');
    } else {
      await api.createCategoria({ nombre: catForm.value.nombre });
      ElMessage.success('Categoría creada correctamente');
    }

    showCat.value = false;
    await load();
  } catch (err) {
    console.error('Error en saveCat():', err);
    if (!err.errors) {
      ElMessage.error('No se pudo guardar la categoría');
    }
  }
}

/** 
 * Elimina una categoría (eliminación lógica) 
 */
function confirmDelCategoria(id) {
  console.log('confirmDelCategoria llamado con id =', id);
  ElMessageBox.confirm('¿Eliminar categoría?', 'Eliminar', {
    type: 'warning',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  })
    .then(async () => {
      try {
        await api.deleteCategoria(id);
        ElMessage.success('Categoría eliminada');
        await load();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        ElMessage.error('No se pudo eliminar la categoría');
      }
    })
    .catch(() => {
      /* Cancelado por el usuario */
    });
}

/** 
 * Abre el modal de Gasto (crear o editar) 
 */
function openGasto(row) {
  console.log('openGasto llamado con row =', row);
  if (row) {
    // Conversión de fecha string a Date para <el-date-picker>
    const fechaObj = row.fecha ? new Date(row.fecha) : null;
    gForm.value = {
      id_gasto: row.id_gasto,
      descripcion: row.descripcion,
      monto: parseFloat(row.monto),
      fecha: fechaObj,
      id_categoria: row.id_categoria
    };
  } else {
    gForm.value = {
      id_gasto: null,
      descripcion: '',
      monto: 0,
      fecha: null,
      id_categoria: null
    };
  }
  showGasto.value = true;

  nextTick(() => {
    if (fG.value) {
      // fG.value.clearValidate();
    }
  });
}

/** 
 * Guarda (crea o actualiza) un gasto 
 */
async function saveGasto() {
  try {
    await fG.value.validate();
    console.log('Guardando gasto:', gForm.value);

    // Convertimos la fecha (Date) a string YYYY-MM-DD
    const fechaISO = gForm.value.fecha
      ? gForm.value.fecha.toISOString().split('T')[0]
      : null;

    const payload = {
      ...gForm.value,
      fecha: fechaISO
    };

    if (payload.id_gasto) {
      // Llamamos a PUT /gastos/:id
      await api.updateGasto(payload);
      ElMessage.success('Gasto actualizado correctamente');
    } else {
      // Llamamos a POST /gastos
      await api.createGasto(payload);
      ElMessage.success('Gasto creado correctamente');
    }

    showGasto.value = false;
    await load();
  } catch (err) {
    console.error('Error en saveGasto():', err);
    if (!err.errors) {
      ElMessage.error('No se pudo guardar el gasto');
    }
  }
}

/** 
 * Elimina un gasto (eliminación lógica) 
 */
function confirmDelGasto(id) {
  console.log('confirmDelGasto llamado con id =', id);
  ElMessageBox.confirm('¿Eliminar gasto?', 'Eliminar', {
    type: 'warning',
    confirmButtonText: 'Sí',
    cancelButtonText: 'No'
  })
    .then(async () => {
      try {
        await api.deleteGasto(id);
        ElMessage.success('Gasto eliminado correctamente');
        await load();
      } catch (error) {
        console.error('Error al eliminar gasto:', error);
        ElMessage.error('No se pudo eliminar el gasto');
      }
    })
    .catch(() => {
      /* Cancelado por el usuario */
    });
}

/** 
 * Si el usuario cierra el diálogo de Categoría haciendo clic en la “X”,
 * limpiamos validaciones.
 */
function onCatDialogClose() {
  if (fCat.value) {
    fCat.value.clearValidate();
  }
}

/** 
 * Si el usuario cierra el diálogo de Gasto haciendo clic en la “X”,
 * limpiamos validaciones.
 */
function onGastoDialogClose() {
  if (fG.value) {
    fG.value.clearValidate();
  }
}

/** 
 * Al montar el componente, cargamos categorías y gastos 
 */
onMounted(load);
</script>

<style scoped>
.gastos-page {
  padding: 1rem;
}

/* Estilo para el contenedor del gráfico */
.chart-wrapper {
  position: relative;
  height: 350px;       /* altura fija para que no crezca indefinidamente */
  width: 100%;
  margin-bottom: 2rem;
}

/* Ajuste de los diálogos para que no sean muy anchos en pantallas pequeñas */
.el-dialog__wrapper {
  z-index: 1000;
}
</style>