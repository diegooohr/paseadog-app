<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './supabase'

import AppHeader from './components/AppHeader.vue'
import ListaMascotas from './components/ListaMascotas.vue'
import DetallesMascota from './components/DetallesMascota.vue'
import ControlPaseo from './components/ControlPaseo.vue'
import PerfilPaseador from './components/PerfilPaseador.vue'
import RecordPaseos from './components/RecordPaseos.vue'
import AuthLogin from './components/AuthLogin.vue'
import AppAjustes from './components/AppAjustes.vue'
import AlertaNotificacion from './components/AlertaNotificacion.vue'

const usuarioActual = ref(null)
const cargandoSesion = ref(true)

const modalDetallesAbierto = ref(false)
const modalPerfilAbierto = ref(false)
const modalRecordAbierto = ref(false)
const modalAjustesAbierto = ref(false)

const mascotaSeleccionada = ref(null)
const nombrePaseador = ref('Paseador')
const mascotas = ref([])

// Sistema global de alertas flotantes
const alertaGlobal = ref({
  mostrar: false,
  titulo: '',
  mensaje: '',
  tipo: 'advertencia'
})

const mostrarAlerta = (titulo, mensaje, tipo = 'advertencia') => {
  alertaGlobal.value = {
    mostrar: true,
    titulo,
    mensaje,
    tipo
  }
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    usuarioActual.value = session.user
    await cargarPerfilUsuario(session.user.id)
    await cargarDatosUsuario(session.user.id)
  }
  cargandoSesion.value = false

  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      usuarioActual.value = session.user
      await cargarPerfilUsuario(session.user.id)
      await cargarDatosUsuario(session.user.id)
    } else {
      usuarioActual.value = null
      mascotas.value = []
    }
  })
})

const cargarPerfilUsuario = async (userId) => {
  const { data } = await supabase
    .from('perfil')
    .select('nombre')
    .eq('user_id', userId)
    .limit(1)

  if (data && data.length > 0 && data[0].nombre) {
    nombrePaseador.value = data[0].nombre
  } else {
    nombrePaseador.value = usuarioActual.value?.user_metadata?.nombre || 'Paseador'
  }
}

const cargarDatosUsuario = async (userId) => {
  const { data, error } = await supabase
    .from('mascotas')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error al cargar mascotas de Supabase:', error)
  }

  if (data && data.length > 0) {
    mascotas.value = data
  } else {
    mascotas.value = []
  }
}

const actualizarPerfil = async () => {
  modalPerfilAbierto.value = false
  if (usuarioActual.value) {
    await cargarPerfilUsuario(usuarioActual.value.id)
  }
}

const gestionarMascota = async ({ mascota, esEdicion, index }) => {
  if (!usuarioActual.value) {
    mostrarAlerta('Sesión requerida', 'Debe iniciar sesión para gestionar mascotas.', 'error')
    return
  }

  if (esEdicion && mascota.id) {
    const { error } = await supabase
      .from('mascotas')
      .update({
        nombre: mascota.nombre,
        raza: mascota.raza,
        tamano: mascota.tamano,
        edad: mascota.edad,
        caracteristicas: mascota.caracteristicas
      })
      .eq('id', mascota.id)
      .eq('user_id', usuarioActual.value.id)

    if (error) {
      console.error('Error al editar la mascota:', error)
      mostrarAlerta('Error', 'No se pudo actualizar: ' + error.message, 'error')
    } else {
      await cargarDatosUsuario(usuarioActual.value.id)
      mostrarAlerta('¡Éxito!', 'Los cambios se guardaron correctamente.', 'exito')
    }
  } else {
    const { data, error } = await supabase
      .from('mascotas')
      .insert([{
        nombre: mascota.nombre,
        raza: mascota.raza,
        tamano: mascota.tamano,
        edad: mascota.edad,
        caracteristicas: mascota.caracteristicas,
        user_id: usuarioActual.value.id
      }])
      .select()

    if (error) {
      console.error('Error al insertar la mascota en Supabase:', error)
      mostrarAlerta('Error de base de datos', error.message, 'error')
    } else if (data && data.length > 0) {
      mascotas.value.push(data[0])
      mostrarAlerta('¡Mascota añadida!', 'La mascota se registró con éxito en la nube.', 'exito')
    }
  }
}

const eliminarMascota = async (index) => {
  const mascotaAEliminar = mascotas.value[index]
  if (mascotaAEliminar && mascotaAEliminar.id) {
    const { error } = await supabase
      .from('mascotas')
      .delete()
      .eq('id', mascotaAEliminar.id)
      .eq('user_id', usuarioActual.value.id)

    if (error) {
      console.error('Error al eliminar mascota:', error)
      mostrarAlerta('Error', 'No se pudo eliminar la mascota.', 'error')
      return
    }
  }
  mascotas.value.splice(index, 1)
  mostrarAlerta('Eliminado', 'La mascota ha sido removida de la lista.', 'advertencia')
}

const cerrarSesion = async () => {
  await supabase.auth.signOut()
  usuarioActual.value = null
}

const abrirDetalles = (mascota) => {
  mascotaSeleccionada.value = mascota
  modalDetallesAbierto.value = true
}

const cerrarDetalles = () => {
  modalDetallesAbierto.value = false
  setTimeout(() => mascotaSeleccionada.value = null, 300)
}
</script>

<template>
  <div class="flex flex-col h-screen max-w-md mx-auto bg-stone-50 font-sans text-stone-800 relative shadow-2xl">
    
    <AuthLogin v-if="!cargandoSesion && !usuarioActual" @loginExitoso="(user) => { usuarioActual = user; cargarPerfilUsuario(user.id); cargarDatosUsuario(user.id); }" />

    <template v-if="usuarioActual">
      
      <AppHeader 
        @abrirPerfil="modalPerfilAbierto = true" 
        @abrirRecord="modalRecordAbierto = true" 
        @abrirAjustes="modalAjustesAbierto = true"
        @cerrarSesion="cerrarSesion"
      />

      <main class="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
        
        <section class="pt-1">
          <h2 class="text-3xl font-extrabold text-stone-800 tracking-tight">¡Hola {{ nombrePaseador }}! 👋</h2>
          <p class="text-stone-500 font-medium mt-1 text-base">Empecemos con el paseo.</p>
        </section>

        <!-- Conectado el evento @mostrarAviso de la lista de mascotas -->
        <ListaMascotas 
          :mascotas="mascotas" 
          @guardarMascota="gestionarMascota" 
          @eliminarMascota="eliminarMascota"
          @verDetalles="abrirDetalles"
          @mostrarAviso="(aviso) => mostrarAlerta(aviso.titulo, aviso.mensaje, aviso.tipo)" 
        />

        <!-- Conectado el evento @mostrarAviso del control de paseos -->
        <ControlPaseo 
          :mascotas="mascotas" 
          :userId="usuarioActual.id" 
          @mostrarAviso="(aviso) => mostrarAlerta(aviso.titulo, aviso.mensaje, aviso.tipo)"
        />

      </main>

      <DetallesMascota 
        v-if="modalDetallesAbierto && mascotaSeleccionada" 
        :mascota="mascotaSeleccionada" 
        @cerrar="cerrarDetalles" 
      />
      
      <!-- Conectado el evento @mostrarAviso del perfil -->
      <PerfilPaseador 
        v-if="modalPerfilAbierto" 
        @cerrar="actualizarPerfil" 
        @mostrarAviso="(aviso) => mostrarAlerta(aviso.titulo, aviso.mensaje, aviso.tipo)"
      />
      
      <RecordPaseos 
        v-if="modalRecordAbierto" 
        @cerrar="modalRecordAbierto = false" 
        :userId="usuarioActual.id"
      />

      <AppAjustes 
        v-if="modalAjustesAbierto" 
        @cerrar="modalAjustesAbierto = false" 
      />

    </template>

    <!-- Componente Global de Alertas Personalizadas -->
    <AlertaNotificacion 
      :mostrar="alertaGlobal.mostrar"
      :titulo="alertaGlobal.titulo"
      :mensaje="alertaGlobal.mensaje"
      :tipo="alertaGlobal.tipo"
      @cerrar="alertaGlobal.mostrar = false"
    />

  </div>
</template>