import { useState } from "react";
import { Titulo, Tarjeta } from "../../components";
import { obtenerYGuardarTemaEstudio } from "../../services/temaEstudio";
import style from "./inicio.module.css";

export function Inicio() {
  const [tema, setTema] = useState("");
  const [cargando, setCargando] = useState(false);

  const diaComienzo = new Date("2025-08-11");
  const fechaHoy = new Date().toISOString().split("T")[0]; // formato YYYY-MM-DD
  // Calcular días transcurridos
  const fechaActual = new Date(fechaHoy);
  const diferenciaTiempo = fechaActual.getTime() - diaComienzo.getTime();
  const diasTranscurridos = Math.floor(
    diferenciaTiempo / (1000 * 60 * 60 * 24)
  );

  const manejarObtenerTema = async () => {
    setCargando(true);
    try {
      const nuevoTema = await obtenerYGuardarTemaEstudio();
      setTema(nuevoTema);
    } catch (error) {
      console.error("Error al obtener tema:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <Titulo
        titulo="📚 Aprendiendo 📚"
        copy="aprende algo nuevo de programación cada dia"
      />
      <div className={style.tarjetas}>
        <Tarjeta nombre="Día" variable={fechaHoy} color="#00C950" />
        <Tarjeta
          nombre="Aprendisaje"
          variable={`#${diasTranscurridos + 1}`}
          color="#00C950"
        />
      </div>
      
      <div style={{ textAlign: "center", margin: "2rem 0" }}>
        <button 
          onClick={manejarObtenerTema} 
          disabled={cargando}
          style={{
            backgroundColor: "#4ECDC4",
            color: "white",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "8px",
            fontSize: "1rem",
            cursor: cargando ? "not-allowed" : "pointer",
            opacity: cargando ? 0.6 : 1
          }}
        >
          {cargando ? "Generando..." : "🎲 Obtener Tema de Estudio"}
        </button>
        
        {tema && (
          <div style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "2rem auto 0"
          }}>
            <h3>📚 Tema de hoy:</h3>
            <p style={{ fontSize: "1.1rem", color: "#2c3e50" }}>{tema}</p>
          </div>
        )}
      </div>
    </div>
  );
}
