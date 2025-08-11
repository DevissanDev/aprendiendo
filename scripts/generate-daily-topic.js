import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuración de Groq
const GROQ_API_KEY = process.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function generateDailyTopic() {
  try {
    console.log("🚀 Iniciando generación automática de tema diario...");
    
    // Verificar variables de entorno
    if (!supabaseUrl || !supabaseKey || !GROQ_API_KEY) {
      throw new Error("❌ Faltan variables de entorno necesarias");
    }

    console.log("✅ Variables de entorno configuradas correctamente");

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
              "Dame un tema de estudio interesante para hoy en español relacionado con programación, tecnología o ciencias de la computación. Responde solo con el tema en español, máximo 10 palabras.",
          },
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`❌ Error en la API de Groq: ${response.status}`);
    }

    const data = await response.json();
    const tema = data.choices[0].message.content.trim();
    console.log("🎯 Tema obtenido de IA:", tema);

    // Verificar si ya existe un tema para hoy
    const today = new Date().toISOString().split('T')[0];
    const { data: existingTopic } = await supabase
      .from("temas_estudio")
      .select("*")
      .gte('fecha_creacion', today + 'T00:00:00.000Z')
      .lt('fecha_creacion', today + 'T23:59:59.999Z')
      .limit(1);

    if (existingTopic && existingTopic.length > 0) {
      console.log("ℹ️ Ya existe un tema para hoy:", existingTopic[0].tema);
      return existingTopic[0].tema;
    }

    // Guardar en Supabase
    console.log("💾 Guardando en Supabase...");
    const { data: temaGuardado, error } = await supabase
      .from("temas_estudio")
      .insert([
        {
          tema: tema,
          fecha_creacion: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error("🔴 Error detallado:", error);
      throw new Error(`❌ Error al guardar en Supabase: ${error.message}`);
    }

    console.log("✅ Tema guardado exitosamente:", temaGuardado[0]);
    console.log("🎉 ¡Tema del día generado y guardado correctamente!");
    
    // Opcional: Crear un archivo con el tema del día
    const fs = await import('fs');
    const path = await import('path');
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    
    const temaDelDia = {
      fecha: new Date().toISOString().split('T')[0],
      tema: tema,
      generadoEn: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(__dirname, '..', 'tema-del-dia.json'), 
      JSON.stringify(temaDelDia, null, 2)
    );
    
    console.log("📄 Archivo tema-del-dia.json actualizado");
    
    return tema;
  } catch (error) {
    console.error("💥 Error completo:", error);
    process.exit(1);
  }
}

// Ejecutar la función
generateDailyTopic();
