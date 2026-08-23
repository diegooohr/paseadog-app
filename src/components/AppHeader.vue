<script setup>
import { ref } from 'vue'
import logo from '../assets/logo.png'

const emit = defineEmits(['abrirPerfil', 'abrirRecord', 'abrirAjustes', 'cerrarSesion'])
const menuAbierto = ref(false)

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value
}
</script>

<template>
  <header class="flex justify-between items-center px-5 py-4 bg-white border-b border-stone-100 relative z-40">
    <div class="flex items-center gap-2.5">
      <img :src="logo" alt="Logo PaseaDog" class="w-9 h-9 object-cover rounded-xl shadow-sm" />
      <h1 class="text-xl font-extrabold text-stone-800 tracking-tight">PaseaDog</h1>
    </div>
    
    <!-- Botón del Menú Desplegable -->
    <div class="relative">
      <button @click="toggleMenu" class="bg-stone-50 hover:bg-stone-100 p-2.5 rounded-2xl border border-stone-200 transition-colors">
        <svg class="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- Menú Desplegable -->
      <div v-if="menuAbierto" @click="menuAbierto = false" class="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 flex flex-col z-50 animate-fade-in">
        
        <button @click="$emit('abrirPerfil')" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left">
          <span>👤</span> Editar Perfil
        </button>

        <button @click="$emit('abrirRecord')" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left">
          <span>📊</span> Récord de Paseos
        </button>

        <button @click="$emit('abrirAjustes')" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-colors text-left border-t border-stone-100">
          <span>⚙️</span> Ajustes
        </button>

        <button @click="$emit('cerrarSesion')" class="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors text-left border-t border-stone-100">
          <span>🚪</span> Cerrar Sesión
        </button>

      </div>
    </div>
  </header>
</template>