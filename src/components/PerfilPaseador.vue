<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'

const emit = defineEmits(['cerrar', 'mostrarAviso'])

const formPerfil = ref({
  nombre: '',
  celular: '',
  edad: '',
  direccion: ''
})

const cargando = ref(false)

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data } = await supabase
    .from('perfil')
    .select('nombre, celular, edad, direccion')
    .eq('user_id', user.id)
    .limit(1)

  if (data && data.length > 0) {
    formPerfil.value = {
      nombre: data[0].nombre || '',
      celular: data[0].celular || '',
      edad: data[0].edad || '',
      direccion: data[0].direccion || ''
    }
  } else {
    formPerfil.value.nombre = user.user_metadata?.nombre || ''
  }
})

const guardarPerfil = async () => {
  cargando.value = true
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    emit('mostrarAviso', {
      titulo: 'Sesión expirada',
      mensaje: 'No hay una sesión activa.',
      tipo: 'error'
    })
    cargando.value = false
    return
  }

  const { data: perfilExistente } = await supabase
    .from('perfil')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  let errorSupabase = null

  if (perfilExistente && perfilExistente.length > 0) {
    const { error } = await supabase
      .from('perfil')
      .update({
        nombre: formPerfil.value.nombre,
        celular: formPerfil.value.celular,
        edad: formPerfil.value.edad ? parseInt(formPerfil.value.edad) : null,
        direccion: formPerfil.value.direccion
      })
      .eq('user_id', user.id)
    errorSupabase = error
  } else {
    const { error } = await supabase
      .from('perfil')
      .insert([{
        user_id: user.id,
        nombre: formPerfil.value.nombre,
        celular: formPerfil.value.celular,
        edad: formPerfil.value.edad ? parseInt(formPerfil.value.edad) : null,
        direccion: formPerfil.value.direccion
      }])
    errorSupabase = error
  }

  cargando.value = false

  if (errorSupabase) {
    console.error('Error detallado de Supabase:', errorSupabase)
    emit('mostrarAviso', {
      titulo: 'Error de Supabase',
      mensaje: errorSupabase.message,
      tipo: 'error'
    })
  } else {
    await supabase.auth.updateUser({
      data: { nombre: formPerfil.value.nombre }
    })

    emit('mostrarAviso', {
      titulo: '¡Perfil guardado!',
      mensaje: 'Tus datos se actualizaron con éxito en la nube.',
      tipo: 'exito'
    })
    emit('cerrar')
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-stone-900/65 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center">
    <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up flex flex-col gap-5">
      
      <div class="flex justify-between items-center border-b border-stone-100 pb-3">
        <div class="flex items-center gap-2">
          <span class="text-xl">👤</span>
          <h3 class="text-2xl font-extrabold text-stone-800">Mi Perfil</h3>
        </div>
        <button @click="$emit('cerrar')" class="text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="flex flex-col gap-4">
        
        <div>
          <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Nombre Completo</label>
          <input v-model="formPerfil.nombre" type="text" placeholder="Ej. Maria" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none font-medium text-stone-700" />
        </div>

        <div class="flex gap-3">
          <div class="flex-1">
            <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Celular</label>
            <input v-model="formPerfil.celular" type="tel" placeholder="987 654 321" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none font-medium text-stone-700" />
          </div>
          <div class="w-1/3">
            <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Edad</label>
            <input v-model="formPerfil.edad" type="number" placeholder="28" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none font-medium text-stone-700" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Dirección / Zona</label>
          <input v-model="formPerfil.direccion" type="text" placeholder="Av. Los Olivos 123" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none font-medium text-stone-700" />
        </div>

        <button @click="guardarPerfil" :disabled="cargando" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-md mt-2 disabled:opacity-50">
          {{ cargando ? 'Guardando...' : 'Guardar Cambios' }}
        </button>

      </div>

    </div>
  </div>
</template>