<script setup>
const props = defineProps({
  mascota: { type: Object, required: true }
})
const emit = defineEmits(['cerrar'])
</script>

<template>
  <div class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
    <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-fade-in flex flex-col gap-5 relative overflow-hidden">
      <div class="absolute -right-6 -top-6 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-70"></div>
      <div class="flex justify-between items-start relative z-10">
        <div>
          <h3 class="text-3xl font-extrabold text-stone-800 tracking-tight">🐶 {{ mascota.nombre }}</h3>
          <p class="text-orange-500 font-bold text-sm mt-1 uppercase tracking-wide">{{ mascota.raza || 'Mestizo' }}</p>
        </div>
        <button @click="$emit('cerrar')" class="text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-3 relative z-10">
        <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100">
          <span class="block text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Edad</span>
          <span class="text-stone-700 font-extrabold text-lg">{{ mascota.edad ? mascota.edad + ' años' : '---' }}</span>
        </div>
        <div class="bg-stone-50 p-4 rounded-2xl border border-stone-100">
          <span class="block text-stone-400 text-xs font-bold uppercase tracking-wider mb-1">Tamaño</span>
          <span class="text-stone-700 font-extrabold text-sm leading-tight block">{{ mascota.tamano }}</span>
        </div>
      </div>

      <div v-if="mascota.caracteristicas" class="bg-orange-50/50 p-5 rounded-2xl border border-orange-100 relative z-10">
        <span class="block text-orange-500 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Perfil y Cuidados
        </span>
        <p class="text-stone-700 text-sm leading-relaxed">{{ mascota.caracteristicas }}</p>
      </div>

      <button @click="$emit('cerrar')" class="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-3.5 rounded-2xl font-bold text-sm transition-all mt-1 relative z-10 active:scale-95">
        Cerrar Perfil
      </button>
    </div>
  </div>
</template>