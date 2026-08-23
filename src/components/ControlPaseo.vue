<script setup>
import { ref, onUnmounted } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
  mascotas: {
    type: Array,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['mostrarAviso'])

const mascotasSeleccionadas = ref([])
const segundos = ref(0)
const paseEnCurso = ref(false)
const cronometroInterval = ref(null)
const notasPaseo = ref('')

const toggleSeleccionMascota = (mascotaId) => {
  if (paseEnCurso.value) return
  
  const index = mascotasSeleccionadas.value.indexOf(mascotaId)
  if (index > -1) {
    mascotasSeleccionadas.value.splice(index, 1)
  } else {
    mascotasSeleccionadas.value.push(mascotaId)
  }
}

const formatearTiempo = (segTotal) => {
  const hrs = Math.floor(segTotal / 3600).toString().padStart(2, '0')
  const mins = Math.floor((segTotal % 3600) / 60).toString().padStart(2, '0')
  const secs = (segTotal % 60).toString().padStart(2, '0')
  return `${hrs}:${mins}:${secs}`
}

const iniciarPaseo = () => {
  if (mascotasSeleccionadas.value.length === 0) {
    emit('mostrarAviso', {
      titulo: 'Selección vacía',
      mensaje: 'Por favor, selecciona al menos una mascota para iniciar el paseo.',
      tipo: 'advertencia'
    })
    return
  }

  paseEnCurso.value = true
  segundos.value = 0
  
  cronometroInterval.value = setInterval(() => {
    segundos.value++
  }, 1000)
}

const finalizarPaseo = async () => {
  if (!paseEnCurso.value) return

  clearInterval(cronometroInterval.value)

  const fechaActual = new Date().toLocaleDateString()
  const horaFin = new Date().toLocaleTimeString()
  const duracionTexto = formatearTiempo(segundos.value)

  // Creamos un texto limpio con los nombres de las mascotas seleccionadas
  const nombresMascotas = props.mascotas
    .filter(m => mascotasSeleccionadas.value.includes(m.id || m.nombre))
    .map(m => m.nombre)
    .join(', ')

  // Guardar historial en Supabase adaptado a la tabla de texto
  const { error } = await supabase
    .from('paseos_historial')
    .insert([{
      user_id: props.userId,
      fecha: fechaActual,
      inicio: 'Iniciado',
      fin: horaFin,
      duracion: duracionTexto,
      segundos_totales: segundos.value,
      mascotas: nombresMascotas,
      notas: notasPaseo.value || 'Sin notas'
    }])

  if (error) {
    console.error('Error detallado al guardar historial:', error)
    emit('mostrarAviso', {
      titulo: 'Error de guardado',
      mensaje: 'Detalle: ' + error.message,
      tipo: 'error'
    })
  } else {
    emit('mostrarAviso', {
      titulo: '¡Paseo finalizado!',
      mensaje: `Has completado un paseo exitoso de ${duracionTexto}.`,
      tipo: 'exito'
    })
    
    // Reiniciar estado
    paseEnCurso.value = false
    segundos.value = 0
    mascotasSeleccionadas.value = []
    notasPaseo.value = ''
  }
}

onUnmounted(() => {
  if (cronometroInterval.value) clearInterval(cronometroInterval.value)
})
</script>

<template>
  <section class="flex flex-col gap-4 bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
    
    <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Selecciona los perros para este paseo</h3>

    <!-- Selector de Mascotas -->
    <div v-if="mascotas.length === 0" class="text-sm text-stone-400 italic py-2">
      No hay mascotas agregadas aún.
    </div>

    <div v-else class="flex flex-wrap gap-2">
      <button 
        v-for="mascota in mascotas" 
        :key="mascota.id || mascota.nombre"
        @click="toggleSeleccionMascota(mascota.id || mascota.nombre)"
        :disabled="paseEnCurso"
        class="px-4 py-2 rounded-2xl font-bold text-sm transition-all border flex items-center gap-2"
        :class="mascotasSeleccionadas.includes(mascota.id || mascota.nombre) 
          ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'"
      >
        <span>🐶</span>
        <span>{{ mascota.nombre }}</span>
      </button>
    </div>

    <!-- Cronómetro -->
    <div class="flex flex-col items-center justify-center py-6 bg-stone-50 border border-stone-100 rounded-3xl gap-4">
      <div class="text-5xl font-extrabold text-stone-800 tracking-wider font-mono">
        {{ formatearTiempo(segundos) }}
      </div>

      <div class="flex gap-3 w-full px-4">
        <button 
          v-if="!paseEnCurso"
          @click="iniciarPaseo" 
          class="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-md"
        >
          Iniciar Paseo
        </button>

        <button 
          v-else
          @click="finalizarPaseo" 
          class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-base transition-all shadow-md animate-pulse"
        >
          Finalizar Paseo
        </button>
      </div>
    </div>

    <!-- Bitácora del paseo -->
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-bold text-stone-400 uppercase tracking-wider">Bitácora del paseo</label>
      <textarea 
        v-model="notasPaseo" 
        placeholder="Ej: Hicieron sus necesidades, jugaron en el parque..." 
        rows="2" 
        class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
      ></textarea>
    </div>

  </section>
</template>