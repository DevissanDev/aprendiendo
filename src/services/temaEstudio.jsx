import { supabase } from "../lib/supabase.js";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const obtenerYGuardarTemaEstudio = async () => {
  try {
    console.log("🚀 Iniciando función...");
    console.log("📋 Variables de entorno:", {
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      hasGroqKey: !!GROQ_API_KEY,
    });

    // Obtener tema de la API de Groq
    console.log("🤖 Obteniendo tema de IA...");
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content:
              "Dame un tema de estudio interesante para hoy en español. Responde solo con el tema en español, máximo 10 palabras.",
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error en la API de Groq: ${response.status}`);
    }

    const data = await response.json();
    const tema = data.choices[0].message.content.trim();
    console.log("🎯 Tema obtenido de IA:", tema);

    // Guardar en Supabase
    console.log("� Guardando en Supabase...");
    const { data: temaGuardado, error } = await supabase
      .from("temas_estudio")
      .insert([
        {
          tema: tema,
          fecha_creacion: new Date().toISOString(),
        },
      ])
      .select();

    console.log("✅ Datos insertados:", temaGuardado);
    console.log("❌ Error:", error);

    if (error) {
      console.error("🔴 Error detallado:", error);
      throw new Error(`Error al guardar en Supabase: ${error.message}`);
    }

    console.log("🎉 ¡Tema obtenido y guardado exitosamente!");
    return tema;
  } catch (error) {
    console.error("💥 Error completo:", error);
    return "Error al obtener el tema. Intenta de nuevo.";
  }
};
