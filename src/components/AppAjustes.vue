<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['cerrar'])

const temaSeleccionado = ref('predeterminado')
const notificacionesActivas = ref(true)

onMounted(() => {
  const ajustesGuardados = localStorage.getItem('paseadog_ajustes')
  if (ajustesGuardados) {
    const datos = JSON.parse(ajustesGuardados)
    temaSeleccionado.value = datos.tema || 'predeterminado'
    notificacionesActivas.value = datos.notificaciones ?? true
  }
})

const guardarAjustes = () => {
  localStorage.setItem('paseadog_ajustes', JSON.stringify({
    tema: temaSeleccionado.value,
    notificaciones: notificacionesActivas.value
  }))
  alert('¡Ajustes guardados con éxito!')
  emit('cerrar')
}
</script>

<template>
  <div class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center">
    <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up flex flex-col gap-5">
      
      <div class="flex justify-between items-center border-b border-stone-100 pb-3">
        <h3 class="text-2xl font-extrabold text-stone-800">⚙️ Ajustes de la App</h3>
        <button @click="$emit('cerrar')" class="text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Selección de Tema -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-bold text-stone-400 uppercase tracking-wider">Modo de Apariencia</label>
        <div class="grid grid-cols-3 gap-2">
          <button 
            @click="temaSeleccionado = 'claro'" 
            :class="{'bg-orange-500 text-white border-orange-500 shadow-sm': temaSeleccionado === 'claro', 'bg-stone-50 text-stone-700 border-stone-200': temaSeleccionado !== 'claro'}"
            class="py-3 rounded-2xl border text-xs font-bold transition-all"
          >
            ☀️ Claro
          </button>
          <button 
            @click="temaSeleccionado = 'oscuro'" 
            :class="{'bg-orange-500 text-white border-orange-500 shadow-sm': temaSeleccionado === 'oscuro', 'bg-stone-50 text-stone-700 border-stone-200': temaSeleccionado !== 'oscuro'}"
            class="py-3 rounded-2xl border text-xs font-bold transition-all"
          >
            🌙 Oscuro
          </button>
          <button 
            @click="temaSeleccionado = 'predeterminado'" 
            :class="{'bg-orange-500 text-white border-orange-500 shadow-sm': temaSeleccionado === 'predeterminado', 'bg-stone-50 text-stone-700 border-stone-200': temaSeleccionado !== 'predeterminado'}"
            class="py-3 rounded-2xl border text-xs font-bold transition-all"
          >
            💻 Sistema
          </button>
        </div>
      </div>

      <!-- Notificaciones -->
      <div class="flex justify-between items-center bg-stone-50 border border-stone-100 p-4 rounded-2xl">
        <div>
          <span class="block font-bold text-stone-700 text-sm">🔔 Notificaciones</span>
          <span class="text-xs text-stone-400">Alertas y recordatorios de paseos</span>
        </div>
        <input type="checkbox" v-model="notificacionesActivas" class="w-5 h-5 text-orange-500 rounded border-stone-300 focus:ring-orange-400 cursor-pointer" />
      </div>

      <button @click="guardarAjustes" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-md mt-2">
        Guardar Ajustes
      </button>

    </div>
  </div>
</template>