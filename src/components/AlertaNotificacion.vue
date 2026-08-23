<script setup>
defineProps({
  mostrar: Boolean,
  titulo: {
    type: String,
    default: 'Aviso importante'
  },
  mensaje: String,
  tipo: {
    type: String,
    default: 'advertencia' // 'advertencia', 'exito', 'error'
  }
})

defineEmits(['cerrar'])
</script>

<template>
  <div v-if="mostrar" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in">
    <div class="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4 text-center transform animate-scale-up">
      
      <!-- Icono según el tipo -->
      <div class="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
           :class="{
             'bg-orange-100 text-orange-600': tipo === 'advertencia',
             'bg-emerald-100 text-emerald-600': tipo === 'exito',
             'bg-red-100 text-red-600': tipo === 'error'
           }">
        {{ tipo === 'exito' ? '✅' : tipo === 'error' ? '❌' : '⚠️' }}
      </div>

      <div>
        <h3 class="text-xl font-extrabold text-stone-800">{{ titulo }}</h3>
        <p class="text-stone-500 text-sm mt-2 font-medium leading-relaxed">{{ mensaje }}</p>
      </div>

      <button @click="$emit('cerrar')" class="w-full py-3.5 rounded-2xl font-bold text-white transition-all shadow-md"
              :class="{
                'bg-orange-500 hover:bg-orange-600': tipo === 'advertencia',
                'bg-emerald-500 hover:bg-emerald-600': tipo === 'exito',
                'bg-red-500 hover:bg-red-600': tipo === 'error'
              }">
        Entendido
      </button>

    </div>
  </div>
</template>