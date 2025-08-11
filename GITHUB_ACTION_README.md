# 📚 Generador Automático de Temas de Estudio

Este proyecto genera automáticamente temas de estudio diarios usando IA y los guarda en Supabase.

## 🚀 Configuración del GitHub Action

Para que el workflow funcione automáticamente, necesitas configurar los siguientes **GitHub Secrets**:

### 1. Ve a tu repositorio en GitHub

### 2. Ve a Settings > Secrets and variables > Actions

### 3. Agrega estos secrets:

- **`VITE_GROQ_API_KEY`**: Tu clave de API de Groq
- **`VITE_SUPABASE_URL`**: La URL de tu proyecto Supabase  
- **`VITE_SUPABASE_ANON_KEY`**: La clave anónima de Supabase

### 4. El workflow se ejecutará:

- **Automáticamente** todos los días a las 8:00 AM UTC
- **Manualmente** desde la pestaña "Actions" en GitHub

## 🛠️ Ejecución manual local

También puedes ejecutar el script localmente:

```bash
npm run generate-topic
```

## 📊 Qué hace el workflow:

1. ✅ Se ejecuta diariamente de forma automática
2. 🤖 Genera un tema de estudio usando IA (Groq)
3. 💾 Lo guarda en tu base de datos Supabase
4. 📄 Crea/actualiza el archivo `tema-del-dia.json`
5. 📝 Hace commit automático si hay cambios

## 🔧 Personalización

Puedes modificar:

- **Horario**: Cambia el `cron` en `.github/workflows/daily-study-topic.yml`
- **Prompt de IA**: Edita el mensaje en `scripts/generate-daily-topic.js`
- **Frecuencia**: Ajusta la programación del workflow

## 📁 Archivos importantes:

- `.github/workflows/daily-study-topic.yml` - Configuración del GitHub Action
- `scripts/generate-daily-topic.js` - Script que genera el tema
- `tema-del-dia.json` - Archivo con el último tema generado

¡Tu bot de temas de estudio está listo! 🎉
