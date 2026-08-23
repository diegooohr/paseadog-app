<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import logo from '../assets/logo.png' // Importamos tu logo

const emit = defineEmits(['loginExitoso'])

const esRegistro = ref(false)
const email = ref('')
const password = ref('')
const nombrePaseador = ref('')
const recordarDatos = ref(true) // Checkbox para inicio rápido
const errorMsg = ref('')
const cargando = ref(false)

// Al cargar el componente, recuperamos los datos guardados para un inicio rápido
onMounted(() => {
  const datosGuardados = localStorage.getItem('paseadog_recuerdame')
  if (datosGuardados) {
    const creds = JSON.parse(datosGuardados)
    email.value = creds.email || ''
    password.value = creds.password || ''
    recordarDatos.value = true
  }
})

const handleSubmit = async () => {
  errorMsg.value = ''
  cargando.value = true

  if (esRegistro.value) {
    // Registro de nuevo usuario en español
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: { nombre: nombrePaseador.value || 'Paseador' }
      }
    })

    if (error) {
      // Traducimos los errores comunes de Supabase al español
      if (error.message.includes('Password should be at least')) {
        errorMsg.value = 'La contraseña debe tener al menos 6 caracteres.'
      } else if (error.message.includes('already registered')) {
        errorMsg.value = 'Este correo electrónico ya está registrado.'
      } else {
        errorMsg.value = 'Ocurrió un error al registrarse. Inténtalo de nuevo.'
      }
    } else {
      alert('¡Cuenta creada con éxito! Ya puedes iniciar sesión.')
      esRegistro.value = false
    }
  } else {
    // Inicio de sesión
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) {
      errorMsg.value = 'Correo o contraseña incorrectos, o usuario no encontrado.'
    } else {
      // Si el usuario marcó "Recordar datos", los guardamos en LocalStorage
      if (recordarDatos.value) {
        localStorage.setItem('paseadog_recuerdame', JSON.stringify({
          email: email.value,
          password: password.value
        }))
      } else {
        localStorage.removeItem('paseadog_recuerdame')
      }

      emit('loginExitoso', data.user)
    }
  }
  cargando.value = false
}
</script>

<template>
  <div class="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 flex justify-center items-center p-5">
    <div class="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl flex flex-col gap-6 animate-fade-in">
      
      <div class="text-center flex flex-col items-center">
        <!-- Logo integrado -->
        <img :src="logo" alt="Logo PaseaDog" class="w-16 h-16 object-cover rounded-2xl shadow-md mb-2" />
        <h2 class="text-3xl font-extrabold text-stone-800 tracking-tight">PaseaDog</h2>
        <p class="text-stone-500 text-sm mt-1">
          {{ esRegistro ? 'Crea tu cuenta de paseador independiente' : 'Inicia sesión en tu cuenta' }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        
        <div v-if="esRegistro">
          <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Nombre del Paseador</label>
          <input v-model="nombrePaseador" type="text" placeholder="Ej. Carlos Pérez" required class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
          <input v-model="email" type="email" placeholder="correo@ejemplo.com" required class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" />
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Contraseña</label>
          <input v-model="password" type="password" placeholder="••••••••" required class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none" />
        </div>

        <!-- Opción para recordar datos -->
        <div class="flex items-center gap-2 pt-1">
          <input type="checkbox" id="recordar" v-model="recordarDatos" class="w-4 h-4 text-orange-500 rounded border-stone-300 focus:ring-orange-400 cursor-pointer" />
          <label for="recordar" class="text-xs font-medium text-stone-600 cursor-pointer select-none">Recordar mis datos para inicio rápido</label>
        </div>

        <p v-if="errorMsg" class="text-red-500 text-xs font-bold text-center bg-red-50 p-3 rounded-xl">{{ errorMsg }}</p>

        <button type="submit" :disabled="cargando" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-md mt-1 disabled:opacity-50">
          {{ cargando ? 'Procesando...' : (esRegistro ? 'Registrarse' : 'Iniciar Sesión') }}
        </button>

      </form>

      <div class="text-center text-sm text-stone-500">
        <button @click="esRegistro = !esRegistro" class="text-orange-500 font-bold hover:underline">
          {{ esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí' }}
        </button>
      </div>

    </div>
  </div>
</template>