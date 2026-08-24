<template>
  <div class="absolute inset-0 bg-stone-50 z-[100] flex flex-col w-full h-full overflow-hidden" id="area-imprimir">
    
    <header class="flex justify-between items-center p-5 bg-orange-500 text-white shadow-md shrink-0 no-print">
      <div class="flex items-center space-x-2">
        <span class="text-2xl">📊</span>
        <h1 class="text-xl font-black tracking-wide">Mi Récord</h1>
      </div>
      <div class="flex items-center space-x-2">
        <button @click="exportarPDF" class="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm flex items-center gap-1">📄 PDF</button>
        <button @click="$emit('cerrar')" class="bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm">✕ Salir</button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto p-5 space-y-5 pb-24 print-p-0 relative">
      
      <!-- Buscador de Mes -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex justify-between items-center no-print">
        <span class="font-bold text-stone-700 text-sm">📅 Consultar mes:</span>
        <input type="month" v-model="mesSeleccionado" class="bg-stone-50 border border-stone-200 text-stone-700 font-bold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
      </div>

      <!-- Resumen Global -->
      <div class="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 text-center flex flex-col items-center justify-center print-border-0">
        <p class="text-[10px] text-stone-400 uppercase font-bold tracking-wider mb-2">Total Generado del Mes</p>
        <p class="text-5xl font-black text-orange-500 mb-3">S/ {{ granTotalSoles.toFixed(2) }}</p>
        <p class="text-sm font-bold text-stone-600 bg-stone-50 py-1.5 px-4 rounded-full inline-flex items-center border border-stone-100">⏱️ {{ formatoTiempo(granTotalHoras) }}</p>
      </div>

      <!-- Configuración de Tarifa -->
      <div class="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex justify-between items-center no-print">
        <div>
          <p class="font-bold text-stone-800 text-sm">Tarifa por hora</p>
        </div>
        <div class="flex items-center border border-stone-200 rounded-xl px-3 py-1.5 bg-stone-50">
          <span class="text-stone-400 font-medium text-sm mr-1">S/</span>
          <input type="number" v-model="precioPorHora" class="w-10 bg-transparent text-center text-stone-800 font-bold text-lg no-spinners">
        </div>
      </div>

      <!-- Acordeones de Mascotas -->
      <div v-for="grupo in paseosAgrupados" :key="grupo.nombre" class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden print-mb-4">
        
        <div @click="toggleMascota(grupo.nombre)" class="bg-orange-50 px-5 py-4 flex justify-between items-center border-b border-orange-100 cursor-pointer hover:bg-orange-100 transition-colors">
          <div class="flex items-center space-x-3">
            <span class="text-orange-500 text-xs transition-transform duration-300" :class="{'rotate-90': mascotasExpandidas[grupo.nombre]}">▶</span>
            <h3 class="font-bold text-stone-800 text-lg">🐶 {{ grupo.nombre }}</h3>
          </div>
          <span class="text-xs font-bold text-orange-700 bg-orange-200 px-3 py-1 rounded-full">{{ grupo.paseos.length }} paseos</span>
        </div>

        <div v-show="mascotasExpandidas[grupo.nombre] || enModoImpresion">
          <ul class="divide-y divide-stone-100">
            <li 
              v-for="paseo in grupo.paseos" 
              :key="paseo.id" 
              @click="abrirDetalle(paseo)"
              class="px-5 py-3 flex justify-between items-center cursor-pointer hover:bg-orange-50 transition-colors"
            >
              <div class="flex flex-col">
                <span class="text-sm font-bold text-stone-700">{{ paseo.fecha }}</span>
                <!-- AHORA USAMOS LA FUNCIÓN FORMATO TIEMPO -->
                <span class="text-xs text-stone-500 mt-0.5">⏱️ {{ formatoTiempo(paseo.duracionHoras) }}</span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="font-bold text-stone-800 text-sm">S/ {{ (paseo.duracionHoras * precioPorHora).toFixed(2) }}</span>
                <span class="text-stone-300 text-xs">ℹ️</span>
              </div>
            </li>
          </ul>
          <div class="bg-stone-50 p-5 border-t border-stone-100 flex justify-between items-center">
            <span class="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total de {{ grupo.nombre }}</span>
            <span class="text-xl font-black text-orange-500">S/ {{ (grupo.totalHoras * precioPorHora).toFixed(2) }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal de Detalles del Paseo Específico -->
    <div v-if="paseoSeleccionado" class="fixed inset-0 bg-black/60 z-[200] flex justify-center items-center p-5 backdrop-blur-sm no-print">
      <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
        <div class="flex justify-between items-center mb-5 border-b border-stone-100 pb-3">
          <h2 class="text-xl font-black text-stone-800">Detalle del Paseo</h2>
          <button @click="paseoSeleccionado = null" class="bg-stone-100 text-stone-500 hover:bg-stone-200 w-8 h-8 rounded-full font-bold transition-colors">✕</button>
        </div>
        
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-stone-500 font-bold">Mascota</span>
            <span class="font-bold text-stone-800">🐶 {{ paseoSeleccionado.perro }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-stone-500 font-bold">Fecha</span>
            <span class="font-bold text-stone-800">{{ paseoSeleccionado.fecha }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-stone-500 font-bold">Duración</span>
            <!-- AHORA USAMOS LA FUNCIÓN FORMATO TIEMPO -->
            <span class="font-bold text-stone-800">⏱️ {{ formatoTiempo(paseoSeleccionado.duracionHoras) }}</span>
          </div>
          <div class="flex justify-between items-center bg-orange-50 p-3 rounded-xl">
            <span class="text-sm text-orange-700 font-bold">Total Generado</span>
            <span class="font-black text-orange-500 text-lg">S/ {{ (paseoSeleccionado.duracionHoras * precioPorHora).toFixed(2) }}</span>
          </div>
          
          <div class="pt-2">
            <span class="text-[10px] text-stone-400 uppercase font-bold tracking-wider block mb-2">Bitácora registrada</span>
            <p class="text-sm text-stone-600 bg-stone-50 border border-stone-100 p-4 rounded-xl italic">
              {{ paseoSeleccionado.bitacora || 'No se escribieron notas para este paseo.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { historialPaseos } from '../store.js'

defineEmits(['cerrar'])
const precioPorHora = ref(5)
const mesSeleccionado = ref(new Date().toISOString().slice(0, 7))
const mascotasExpandidas = ref({})
const enModoImpresion = ref(false)
const paseoSeleccionado = ref(null)

// --- NUEVA FUNCIÓN PARA CONVERTIR DECIMALES A HH:MM:SS ---
const formatoTiempo = (horasDecimal) => {
  if (!horasDecimal) return '00:00:00'
  
  // Convertimos las horas a segundos totales
  const totalSegundos = Math.round(horasDecimal * 3600)
  
  // Calculamos horas, minutos y segundos exactos
  const h = Math.floor(totalSegundos / 3600).toString().padStart(2, '0')
  const m = Math.floor((totalSegundos % 3600) / 60).toString().padStart(2, '0')
  const s = (totalSegundos % 60).toString().padStart(2, '0')
  
  return `${h}:${m}:${s}`
}

const toggleMascota = (nombre) => { mascotasExpandidas.value[nombre] = !mascotasExpandidas.value[nombre] }

const abrirDetalle = (paseo) => {
  paseoSeleccionado.value = paseo
}

const exportarPDF = () => {
  enModoImpresion.value = true 
  setTimeout(() => {
    window.print()
    enModoImpresion.value = false
  }, 300)
}

const paseosAgrupados = computed(() => {
  const grupos = {}
  const paseosDelMes = historialPaseos.value.filter(paseo => paseo.mesISO === mesSeleccionado.value)
  
  paseosDelMes.forEach(paseo => {
    if (!grupos[paseo.perro]) grupos[paseo.perro] = { nombre: paseo.perro, paseos: [], totalHoras: 0 }
    grupos[paseo.perro].paseos.push(paseo)
    grupos[paseo.perro].totalHoras += paseo.duracionHoras
  })
  return Object.values(grupos)
})

const granTotalHoras = computed(() => paseosAgrupados.value.reduce((total, grupo) => total + grupo.totalHoras, 0))
const granTotalSoles = computed(() => granTotalHoras.value * precioPorHora.value)
</script>

<style scoped>
.no-spinners::-webkit-outer-spin-button, .no-spinners::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.no-spinners { -moz-appearance: textfield; }

@media print {
  .no-print { display: none !important; }
  .print-block { display: block !important; }
  .print-p-0 { padding: 0 !important; }
  .print-mb-4 { margin-bottom: 1rem !important; }
  .print-border-0 { border: none !important; box-shadow: none !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
</style>