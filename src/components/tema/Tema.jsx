import style from "./tema.module.css";

export function Tema({ tema, nombre_tema, explicacion_tema }) {
  return (
    <div className={style.estudio}>
      <div className={style.tema}>
        <span>{tema}</span>
      </div>
      <div className={style.nombre}>
        <h3>{nombre_tema}</h3>
      </div>
      <div className={style.explicacion}>
        <p>{explicacion_tema}</p>
      </div>
    </div>
  );
}
