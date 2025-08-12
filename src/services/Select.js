import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Obtiene los últimos 3 registros de una tabla
 * @param {string} tableName - Nombre de la tabla a consultar
 * @param {string} orderBy - Campo por el cual ordenar (por defecto 'created_at')
 * @returns {Promise<Array>} - Array con los últimos 3 registros
 */
export const getLastThreeRecords = async (
  tableName,
  orderBy = "fecha_creacion"
) => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order(orderBy, { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error al obtener los datos:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error en la consulta:", error);
    throw error;
  }
};
