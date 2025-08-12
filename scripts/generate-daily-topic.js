import { createClient } from "@supabase/supabase-js";

/**
 * Script para generar temas diarios de programación
 * 
 * Funcionalidad:
 * - Selecciona aleatoriamente una tecnología (React, JavaScript, HTML, CSS, Express)
 * - Genera un tema específico usando IA (hooks, funciones, nuevas funcionalidades, etc.)
 * - Guarda el tema en la base de datos con la estructura:
 *   - id (auto)
 *   - tema (tecnología: react/javascript/html/css/express)
 *   - nombre_tema (nombre específico del tema)
 *   - explicacion_tema (explicación detallada)
 *   - fecha_creacion (timestamp)
 * - Crea un archivo JSON local con el tema del día
 */

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

    // Obtener tema de programación de la API de Groq
    console.log("🤖 Obteniendo tema de programación de IA...");
    
    // Definir las tecnologías disponibles
    const tecnologias = ["react", "javascript", "html", "css", "express"];
    const tecnologiaSeleccionada = tecnologias[Math.floor(Math.random() * tecnologias.length)];
    
    console.log(`🎯 Tecnología seleccionada: ${tecnologiaSeleccionada}`);
    
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
            content: `Genera un tema de estudio específico sobre ${tecnologiaSeleccionada} para programadores. Puede ser:
- Un hook específico (si es React)
- Una función útil (si es JavaScript)
- Una nueva funcionalidad o característica
- Una técnica avanzada
- Un concepto importante

Responde SOLAMENTE en formato JSON con esta estructura exacta:
{
  "nombre_tema": "Nombre específico del tema (máximo 50 caracteres)",
  "explicacion_tema": "Explicación detallada del tema, qué es, para qué sirve y cómo se usa (entre 100-300 caracteres)"
}

No incluyas texto adicional, solo el JSON.`,
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error(`❌ Error en la API de Groq: ${response.status}`);
    }

    const data = await response.json();
    let temaContent = data.choices[0].message.content.trim();
    
    // Limpiar la respuesta para obtener solo el JSON
    if (temaContent.includes('```json')) {
      temaContent = temaContent.split('```json')[1].split('```')[0].trim();
    } else if (temaContent.includes('```')) {
      temaContent = temaContent.split('```')[1].split('```')[0].trim();
    }
    
    let temaData;
    try {
      temaData = JSON.parse(temaContent);
    } catch (parseError) {
      console.error("❌ Error al parsear JSON:", parseError);
      console.log("Respuesta recibida:", temaContent);
      // Fallback con tema predefinido
      temaData = {
        nombre_tema: `Concepto avanzado de ${tecnologiaSeleccionada}`,
        explicacion_tema: `Explorar características avanzadas y mejores prácticas en ${tecnologiaSeleccionada} para mejorar tus habilidades de desarrollo.`
      };
    }

    console.log("🎯 Tema generado:", temaData);

    // Verificar si ya existe un tema para hoy
    const today = new Date().toISOString().split("T")[0];
    const { data: existingTopic } = await supabase
      .from("temas_estudio")
      .select("*")
      .gte("fecha_creacion", today + "T00:00:00.000Z")
      .lt("fecha_creacion", today + "T23:59:59.999Z")
      .limit(1);

    if (existingTopic && existingTopic.length > 0) {
      console.log("ℹ️ Ya existe un tema para hoy:", existingTopic[0].nombre_tema);
      return existingTopic[0];
    }

    // Guardar en Supabase con la nueva estructura
    console.log("💾 Guardando en Supabase...");
    const { data: temaGuardado, error } = await supabase
      .from("temas_estudio")
      .insert([
        {
          tema: tecnologiaSeleccionada,
          nombre_tema: temaData.nombre_tema,
          explicacion_tema: temaData.explicacion_tema,
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
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const temaDelDia = {
      fecha: new Date().toISOString().split("T")[0],
      tecnologia: tecnologiaSeleccionada,
      nombre_tema: temaData.nombre_tema,
      explicacion_tema: temaData.explicacion_tema,
      generadoEn: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(__dirname, "..", "tema-del-dia.json"),
      JSON.stringify(temaDelDia, null, 2)
    );

    console.log("📄 Archivo tema-del-dia.json actualizado");

    return temaGuardado[0];
  } catch (error) {
    console.error("💥 Error completo:", error);
    process.exit(1);
  }
}

// Ejecutar la función
generateDailyTopic();
