<template>
  <div class="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm flex flex-col items-center relative overflow-hidden mt-2">
    
    <!-- Selector Múltiple de Mascotas -->
    <div class="w-full text-left mb-6">
      <h3 class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3">Mascotas para este paseo</h3>
      
      <div v-if="mascotas && mascotas.length > 0" class="space-y-2 max-h-40 overflow-y-auto pr-1">
        <label 
          v-for="mascota in mascotas" 
          :key="mascota.id" 
          class="flex items-center justify-between p-3 border rounded-xl transition-all cursor-pointer"
          :class="mascotasSeleccionadas.includes(mascota.nombre) ? 'bg-orange-50 border-orange-500' : 'bg-stone-50 border-stone-200'"
        >
          <span class="font-bold text-stone-700" :class="{'text-orange-700': mascotasSeleccionadas.includes(mascota.nombre)}">
            🐶 {{ mascota.nombre }}
          </span>
          <input 
            type="checkbox" 
            :value="mascota.nombre" 
            v-model="mascotasSeleccionadas" 
            class="w-5 h-5 accent-orange-500" 
            :disabled="enPaseo"
          >
        </label>
      </div>
      
      <div v-else class="bg-stone-50 text-stone-500 text-sm p-3 rounded-xl border border-stone-200 text-center font-medium">
        Añade una mascota arriba primero.
      </div>
    </div>

    <!-- Cronómetro Gigante -->
    <div class="text-5xl font-black tracking-widest text-stone-800 mb-6 font-mono drop-shadow-sm">
      {{ tiempoFormateado }}
    </div>

    <!-- Caja de Bitácora -->
    <div class="w-full mb-6">
      <h3 class="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2">Bitácora del paseo (Opcional)</h3>
      <textarea 
        v-model="textoBitacora" 
        class="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none h-20"
        placeholder="Ej: Hicieron sus necesidades, jugaron en el parque..."
        :disabled="!enPaseo && segundos === 0"
      ></textarea>
    </div>

    <!-- Botón de Acción -->
    <button 
      @click="togglePaseo" 
      :disabled="mascotasSeleccionadas.length === 0"
      :class="[
        enPaseo ? 'bg-red-500 hover:bg-red-600 shadow-red-200' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200',
        (mascotasSeleccionadas.length === 0) ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'
      ]"
      class="w-full text-white font-bold py-4 rounded-2xl text-lg shadow-lg transition-all"
    >
      {{ enPaseo ? 'Finalizar Paseo' : 'Iniciar Paseo' }}
    </button>

    <!-- Modal de Resumen al Finalizar -->
    <div v-if="mostrarResumen" class="fixed inset-0 bg-black/60 z-[200] flex justify-center items-center p-5 backdrop-blur-sm">
      <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center">
        <span class="text-5xl mb-4 block">🐕‍🦺</span>
        <h2 class="text-2xl font-black text-stone-800 mb-2">¡Paseo Completado!</h2>
        
        <div class="bg-stone-50 rounded-2xl p-4 mb-5 text-left space-y-3 border border-stone-100">
          <div>
            <span class="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Mascotas paseadas</span>
            <p class="font-bold text-stone-700">{{ resumenData.mascotas.join(', ') }}</p>
          </div>
          <div>
            <!-- AQUÍ APLICAMOS LA FUNCIÓN DE FORMATO AL TIEMPO -->
            <span class="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Tiempo Total</span>
            <p class="font-bold text-stone-700">⏱️ {{ formatoTiempo(resumenData.horas) }}</p>
          </div>
          <div v-if="resumenData.bitacora">
            <span class="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Bitácora</span>
            <p class="text-sm text-stone-600 italic">"{{ resumenData.bitacora }}"</p>
          </div>
        </div>

        <button @click="cerrarResumen" class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
          Cerrar
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { registrarPaseo } from '../store.js' 

const props = defineProps({ 
  mascotas: { type: Array, required: true }, 
  userId: { type: String, required: true } 
})

const emit = defineEmits(['mostrarAviso'])

const mascotasSeleccionadas = ref([])
const enPaseo = ref(false)
const segundos = ref(0)
let intervalo = null

const textoBitacora = ref('')
const mostrarResumen = ref(false)
const resumenData = ref({ mascotas: [], horas: 0, bitacora: '' })

// --- NUEVA FUNCIÓN PARA CONVERTIR DECIMALES A HH:MM:SS EN EL MODAL ---
const formatoTiempo = (horasDecimal) => {
  if (!horasDecimal) return '00:00:00'
  const totalSegundos = Math.round(horasDecimal * 3600)
  const h = Math.floor(totalSegundos / 3600).toString().padStart(2, '0')
  const m = Math.floor((totalSegundos % 3600) / 60).toString().padStart(2, '0')
  const s = (totalSegundos % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

watch(() => props.mascotas, (nuevasMascotas) => {
  if (nuevasMascotas && nuevasMascotas.length > 0 && mascotasSeleccionadas.value.length === 0) {
    mascotasSeleccionadas.value = [nuevasMascotas[0].nombre]
  }
}, { immediate: true })

const tiempoFormateado = computed(() => {
  const h = Math.floor(segundos.value / 3600).toString().padStart(2, '0')
  const m = Math.floor((segundos.value % 3600) / 60).toString().padStart(2, '0')
  const s = (segundos.value % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
})

const togglePaseo = () => {
  if (enPaseo.value) {
    clearInterval(intervalo)
    enPaseo.value = false
    
    // Calcula el tiempo real en formato decimal para la base de datos
    let horasCalculadas = segundos.value / 3600

    mascotasSeleccionadas.value.forEach(perro => {
      registrarPaseo(perro, horasCalculadas, textoBitacora.value, props.userId)
    })
    
    // Prepara los datos para el modal de resumen
    resumenData.value = {
      mascotas: [...mascotasSeleccionadas.value],
      horas: horasCalculadas,
      bitacora: textoBitacora.value
    }
    mostrarResumen.value = true
    
  } else {
    enPaseo.value = true
    intervalo = setInterval(() => { segundos.value++ }, 1000)
  }
}

const cerrarResumen = () => {
  mostrarResumen.value = false
  segundos.value = 0
  textoBitacora.value = ''
}
</script>