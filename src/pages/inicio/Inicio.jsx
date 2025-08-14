import { Titulo, Tarjeta, Tema } from "../../components";
import style from "./Inicio.module.css";
import { useState, useEffect } from "react";
import { getLastThreeRecords } from "../../services/Select.js";

export function Inicio() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lastThree = await getLastThreeRecords("temas_estudio");
        setData(lastThree);
        console.log("Últimos 3 registros:", lastThree);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  const diaComienzo = new Date("2025-08-11");
  const fechaHoy = new Date().toISOString().split("T")[0];
  const fechaActual = new Date(fechaHoy);
  const diferenciaTiempo = fechaActual.getTime() - diaComienzo.getTime();
  const diasTranscurridos = Math.floor(
    diferenciaTiempo / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={style.inico}>
      <Titulo
        titulo="Aprendiendo"
        copy="aprende algo nuevo de programación cada día"
      />
      <div className={style.tarjetas}>
        <Tarjeta nombre="Día" variable={fechaHoy} color="#00C950" />
        <Tarjeta
          nombre="Aprendisaje"
          variable={`#${diasTranscurridos + 1}`}
          color="#00C950"
        />
      </div>
      <Tema
        tema={data[0]?.tema}
        nombre_tema={data[0]?.nombre_tema}
        explicacion_tema={data[0]?.explicacion_tema}
      />
      <img className={style.mario} src="./img/mario.gif" alt="Mario" />
      <img
        className={`${style.arbusto} ${style.arbusto1}`}
        src="./img/arbusto.png"
        alt=""
      />
      <img
        className={`${style.arbusto} ${style.arbusto2}`}
        src="./img/arbusto.png"
        alt=""
      />
      <img
        className={`${style.arbusto} ${style.arbusto3}`}
        src="./img/arbusto.png"
        alt=""
      />
      <img
        className={`${style.nube} ${style.nube1}`}
        src="./img/nube.png"
        alt=""
      />
      <img
        className={`${style.nube} ${style.nube2}`}
        src="./img/nube.png"
        alt=""
      />
      <img className={style.tubo} src="./img/tubo.png" alt="" />
    </div>
  );
}
