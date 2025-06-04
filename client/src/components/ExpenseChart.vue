<template>
  <div>
    <h3 style="text-align: center; margin-bottom: 1rem">
      Beneficio Mensual
    </h3>

    <!-- Contenedor con altura fija -->
    <div class="chart-container">
      <Bar
        v-if="barData.labels.length"
        :data="barData"
        :options="barOptions"
      />
      <p v-else style="text-align: center; padding-top: 1rem;">
        No hay datos para graficar
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement
} from 'chart.js';

// 1) Registramos los módulos necesarios para Bar chart
Chart.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement
);

// Definimos la prop "gastos" que recibiremos desde el padre
const props = defineProps({
  gastos: {
    type: Array,
    default: () => []
  }
});

// Nombres de meses en español
const nombresMes = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Datos reactivos para el Bar chart
const barData = ref({
  labels: [],
  datasets: [
    {
      label: 'Gasto',
      data: [],
      backgroundColor: []
    }
  ]
});

// Opciones de configuración
const barOptions = {
  responsive: true,
  maintainAspectRatio: false, // Rellenar el contenedor padre
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Mes'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Ganancia'
      },
      beginAtZero: true,
      ticks: {
        // Formatear ticks con separador de miles y símbolo €
        callback: value => `${value.toLocaleString('es-ES')}Bs`
      }
    }
  }
};

/**
 * Función que recalcula `barData` a partir de la prop `props.gastos`.
 * Agrupa los gastos por mes-año, ordena y genera etiquetas y valores.
 */
function recomputeChart() {
  // 2) Agrupamos los gastos por "YYYY-MM"
  const agrupadoPorMes = {};
  props.gastos.forEach(g => {
    const fechaObj = new Date(g.fecha);
    const año = fechaObj.getFullYear();
    const mesIdx = fechaObj.getMonth();
    const clave = `${año}-${(mesIdx + 1).toString().padStart(2, '0')}`;
    const valor = parseFloat(g.monto) || 0;

    if (!agrupadoPorMes[clave]) agrupadoPorMes[clave] = 0;
    agrupadoPorMes[clave] += valor;
  });

  // 3) Ordenamos las claves cronológicamente (["2025-10","2025-11",...])
  const clavesOrdenadas = Object.keys(agrupadoPorMes).sort((a, b) => a.localeCompare(b));

  // 4) Construimos arrays de etiquetas y datos
  const labelsMensuales = [];
  const valoresMensuales = [];
  const bgColors = [];

  clavesOrdenadas.forEach(clave => {
    const [anoStr, mesStr] = clave.split('-');
    const año = Number(anoStr);
    const mesIdx = Number(mesStr) - 1; // 0-based
    const nombreMes = `${nombresMes[mesIdx]} ${año}`;
    labelsMensuales.push(nombreMes);

    valoresMensuales.push(Math.round(agrupadoPorMes[clave] * 100) / 100);
    bgColors.push('rgba(54, 162, 235, 0.7)');
  });

  // 5) Asignamos a barData
  barData.value.labels = labelsMensuales;
  barData.value.datasets[0].data = valoresMensuales;
  barData.value.datasets[0].backgroundColor = bgColors;
}

// 6) Primero, ejecutamos al montar (en caso de que ya haya datos)
onMounted(() => {
  recomputeChart();
});

// 7) Luego, cuando `props.gastos` cambie, volvemos a recomputeChart()
watch(
  () => props.gastos,
  (newGastos, oldGastos) => {
    recomputeChart();
  },
  { deep: true } // en caso de mutaciones profundas
);
</script>

<style scoped>
/* Contenedor con altura fija */
.chart-container {
  position: relative;
  height: 350px;       /* altura fija para que el gráfico no crezca indefinidamente */
  width: 100%;
  margin-bottom: 2rem;
}
</style>