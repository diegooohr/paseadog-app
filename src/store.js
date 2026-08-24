import { ref } from 'vue'
// Asegúrate de que la ruta a tu archivo supabase.js sea correcta
import { supabase } from './supabase' 

export const historialPaseos = ref([])

// Función para descargar los paseos al iniciar sesión
export const cargarHistorial = async (userId) => {
  const { data, error } = await supabase
    .from('historial_paseos')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error("Error cargando historial:", error)
  } else if (data) {
    historialPaseos.value = data
  }
}

// Función para registrar un nuevo paseo en la nube
export const registrarPaseo = async (nombreMascota, horasPaseadas, textoBitacora = '', userId) => {
  const ahora = new Date()
  const fechaHoy = ahora.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  const mesISO = ahora.toISOString().slice(0, 7)
  
  const nuevoPaseo = {
    perro: nombreMascota,
    fecha: fechaHoy,
    mesISO: mesISO, 
    duracionHoras: horasPaseadas,
    bitacora: textoBitacora,
    user_id: userId // Vinculamos el paseo a tu cuenta
  }

  // Subimos el dato a Supabase
  const { data, error } = await supabase
    .from('historial_paseos')
    .insert([nuevoPaseo])
    .select()

  if (error) {
    console.error("Error guardando paseo en la nube:", error)
  } else if (data && data.length > 0) {
    // Si se guardó con éxito en la nube, lo mostramos en la app
    historialPaseos.value.push(data[0])
  }
}