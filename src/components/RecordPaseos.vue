<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'

const props = defineProps({
  userId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['cerrar'])

const totalSegundosMes = ref(0)
const paseosRealizados = ref([])
const cargando = ref(true)

const cargarHistorial = async () => {
  cargando.value = true
  const { data, error } = await supabase
    .from('paseos_historial')
    .select('*')
    .eq('user_id', props.userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error al cargar el récord de paseos:', error)
  } else if (data) {
    paseosRealizados.value = data
    totalSegundosMes.value = data.reduce((acc, curr) => acc + (curr.segundos_totales || 0), 0)
  }
  cargando.value = false
}

onMounted(() => {
  cargarHistorial()
})

const formatearTiempo = (segTotal) => {
  const hrs = Math.floor(segTotal / 3600).toString().padStart(2, '0')
  const mins = Math.floor((segTotal % 3600) / 60).toString().padStart(2, '0')
  const secs = (segTotal % 60).toString().padStart(2, '0')
  return `${hrs}h ${mins}m ${secs}s`
}
</script>

<template>
  <div class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center p-4">
    <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
      
      <div class="flex justify-between items-center border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">📊</span>
          <h3 class="text-2xl font-extrabold text-stone-800">Récord de Paseos</h3>
        </div>
        <button @click="$emit('cerrar')" class="text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full">
          ✕
        </button>
      </div>

      <!-- Resumen del Mes -->
      <div class="bg-stone-900 text-white p-5 rounded-3xl flex flex-col gap-2 shadow-inner">
        <span class="text-xs font-bold text-stone-400 uppercase tracking-wider">Suma total acumulada</span>
        <div class="text-3xl font-extrabold tracking-tight font-mono">
          {{ formatearTiempo(totalSegundosMes) }}
        </div>
      </div>

      <!-- Listado de Historial -->
      <div class="flex flex-col gap-2 max-h-60 overflow-y-auto">
        <h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Historial reciente</h4>
        
        <div v-if="cargando" class="text-sm text-stone-400 text-center py-4">
          Cargando registros...
        </div>

        <div v-else-if="paseosRealizados.length === 0" class="text-sm text-stone-400 text-center py-4 italic">
          No hay paseos registrados todavía.
        </div>

        <div v-for="paseo in paseosRealizados" :key="paseo.id" class="bg-stone-50 border border-stone-200/80 p-3.5 rounded-2xl flex justify-between items-center">
          <div>
            <p class="font-bold text-stone-800 text-sm">🐶 {{ paseo.mascotas || 'Paseo general' }}</p>
            <p class="text-xs text-stone-400">{{ paseo.fecha }} • Fin: {{ paseo.fin }}</p>
          </div>
          <div class="text-sm font-extrabold text-orange-600 font-mono">
            {{ paseo.duracion }}
          </div>
        </div>
      </div>

      <button @click="$emit('cerrar')" class="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-3.5 rounded-2xl font-bold transition-all">
        Cerrar
      </button>

    </div>
  </div>
</template>