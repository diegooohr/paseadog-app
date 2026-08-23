<script setup>
import { ref } from 'vue'

const emit = defineEmits(['cerrar', 'guardar'])

const nuevaMascota = ref({
  nombre: '',
  raza: '',
  tamano: 'Pequeño (Menos de 10 kg)',
  edad: '',
  caracteristicas: ''
})

const guardar = () => {
  if (!nuevaMascota.value.nombre.trim()) return
  emit('guardar', { ...nuevaMascota.value })
  nuevaMascota.value = { nombre: '', raza: '', tamano: 'Pequeño (Menos de 10 kg)', edad: '', caracteristicas: '' }
}
</script>

<template>
  <div class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center">
    <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up flex flex-col gap-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-2xl font-extrabold text-stone-800">Añadir Mascota</h3>
        <button @click="$emit('cerrar')" class="text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <input v-model="nuevaMascota.nombre" type="text" placeholder="Nombre de la mascota *" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" />
      <div class="flex gap-3">
        <input v-model="nuevaMascota.raza" type="text" placeholder="Raza" class="flex-1 bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" />
        <input v-model="nuevaMascota.edad" type="number" placeholder="Edad (años)" class="w-1/3 bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" />
      </div>
      <select v-model="nuevaMascota.tamano" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm text-stone-600 focus:ring-2 focus:ring-orange-400 focus:outline-none appearance-none">
        <option>Pequeño (Menos de 10 kg)</option>
        <option>Mediano (10 a 25 kg)</option>
        <option>Grande (25 a 45 kg)</option>
        <option>Gigante (Más de 45 kg)</option>
      </select>
      <textarea v-model="nuevaMascota.caracteristicas" placeholder="Comportamiento, fobias..." rows="2" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none resize-none"></textarea>

      <button @click="guardar" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-md mt-2">
        Guardar Mascota
      </button>
    </div>
  </div>
</template>