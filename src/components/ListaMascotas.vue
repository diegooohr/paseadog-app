<script setup>
import { ref } from 'vue'

const props = defineProps({
  mascotas: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['guardarMascota', 'eliminarMascota', 'verDetalles', 'mostrarAviso'])

const modalAbierto = ref(false)
const editando = ref(false)
const indexEdicion = ref(null)

const nuevaMascota = ref({
  nombre: '',
  raza: '',
  tamano: 'Mediano',
  edadAnios: '',
  edadMeses: '',
  caracteristicas: ''
})

const abrirModalNuevo = () => {
  editando.value = false
  indexEdicion.value = null
  nuevaMascota.value = {
    nombre: '',
    raza: '',
    tamano: 'Mediano',
    edadAnios: '',
    edadMeses: '',
    caracteristicas: ''
  }
  modalAbierto.value = true
}

const abrirModalEditar = (mascota, index) => {
  editando.value = true
  indexEdicion.value = index
  
  let anios = mascota.edadAnios ?? ''
  let meses = mascota.edadMeses ?? ''

  nuevaMascota.value = { 
    ...mascota, 
    edadAnios: anios, 
    edadMeses: meses 
  }
  modalAbierto.value = true
}

const validarYGuardarMascota = () => {
  if (!nuevaMascota.value.nombre.trim() || !nuevaMascota.value.raza.trim() || !nuevaMascota.value.tamano) {
    emit('mostrarAviso', {
      titulo: 'Campos incompletos',
      mensaje: 'Por favor, completa el nombre, la raza y el tamaño de la mascota.',
      tipo: 'advertencia'
    })
    return
  }

  if (nuevaMascota.value.edadAnios === '' && nuevaMascota.value.edadMeses === '') {
    emit('mostrarAviso', {
      titulo: 'Edad requerida',
      mensaje: 'Por favor, especifica al menos los años o los meses de edad.',
      tipo: 'advertencia'
    })
    return
  }

  const anios = nuevaMascota.value.edadAnios !== '' ? parseInt(nuevaMascota.value.edadAnios) : 0
  const meses = nuevaMascota.value.edadMeses !== '' ? parseInt(nuevaMascota.value.edadMeses) : 0

  let textoEdadFormateada = ''
  if (anios > 0) textoEdadFormateada += `${anios} ${anios === 1 ? 'año' : 'años'}`
  if (anios > 0 && meses > 0) textoEdadFormateada += ' y '
  if (meses > 0) textoEdadFormateada += `${meses} ${meses === 1 ? 'mes' : 'meses'}`
  if (anios === 0 && meses === 0) textoEdadFormateada = 'Recién nacido'

  const mascotaAProcesar = {
    ...nuevaMascota.value,
    edadAnios: anios,
    edadMeses: meses,
    edad: textoEdadFormateada
  }

  emit('guardarMascota', {
    mascota: mascotaAProcesar,
    esEdicion: editando.value,
    index: indexEdicion.value
  })

  modalAbierto.value = false
}
</script>

<template>
  <section class="flex flex-col gap-4">
    
    <div class="flex justify-between items-center">
      <h3 class="text-xs font-bold text-stone-400 uppercase tracking-wider">Mascotas Asignadas</h3>
      <button @click="abrirModalNuevo" class="text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-colors">
        + Añadir Nueva
      </button>
    </div>

    <div v-if="mascotas.length === 0" class="flex flex-col items-center justify-center p-6 bg-white border border-stone-200/80 rounded-3xl shadow-sm text-center gap-3">
      <button @click="abrirModalNuevo" class="border-2 border-dashed border-orange-300 hover:border-orange-500 text-orange-500 font-bold px-5 py-4 rounded-2xl w-full transition-all bg-orange-50/50 hover:bg-orange-50 flex items-center justify-center gap-2">
        <span>+ Añadir primera mascota</span>
      </button>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div v-for="(mascota, index) in mascotas" :key="index" class="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex justify-between items-center">
        <div class="flex items-center gap-3 cursor-pointer flex-1" @click="$emit('verDetalles', mascota)">
          <div class="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-xl font-extrabold text-orange-600 shadow-inner">
            🐶
          </div>
          <div>
            <h4 class="font-bold text-stone-800 text-base">{{ mascota.nombre }}</h4>
            <p class="text-xs font-medium text-stone-400">{{ mascota.raza }} • {{ mascota.tamano }} • {{ mascota.edad || 'Edad no especificada' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-1">
          <button @click="abrirModalEditar(mascota, index)" class="p-2 text-stone-400 hover:text-stone-700 transition-colors">
            ✏️
          </button>
          <button @click="$emit('eliminarMascota', index)" class="p-2 text-red-400 hover:text-red-600 transition-colors">
            🗑️
          </button>
        </div>
      </div>
    </div>

    <div v-if="modalAbierto" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex justify-center items-end sm:items-center">
      <div class="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up flex flex-col gap-4">
        
        <div class="flex justify-between items-center border-b border-stone-100 pb-3">
          <h3 class="text-xl font-extrabold text-stone-800">
            {{ editando ? 'Editar Mascota' : 'Nueva Mascota' }}
          </h3>
          <button @click="modalAbierto = false" class="text-stone-400 hover:text-stone-700 bg-stone-100 p-2 rounded-full">
            ✕
          </button>
        </div>

        <div class="flex flex-col gap-3">
          <div>
            <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Nombre</label>
            <input v-model="nuevaMascota.nombre" type="text" placeholder="Ej. Max" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Raza</label>
            <input v-model="nuevaMascota.raza" type="text" placeholder="Ej. Golden Retriever" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Tamaño</label>
            <select v-model="nuevaMascota.tamano" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="Pequeño">Pequeño</option>
              <option value="Mediano">Mediano</option>
              <option value="Grande">Grande</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Años</label>
              <input v-model="nuevaMascota.edadAnios" type="number" min="0" placeholder="Ej. 2" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Meses</label>
              <input v-model="nuevaMascota.edadMeses" type="number" min="0" max="11" placeholder="Ej. 6" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Características / Comportamiento</label>
            <textarea v-model="nuevaMascota.caracteristicas" placeholder="Ej. Juguetón, amigable con otros perros..." rows="2" class="w-full bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-orange-400"></textarea>
          </div>

          <button @click="validarYGuardarMascota" class="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-base transition-all shadow-md mt-2">
            {{ editando ? 'Guardar Cambios' : 'Añadir Mascota' }}
          </button>
        </div>

      </div>
    </div>

  </section>
</template>