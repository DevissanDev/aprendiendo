import style from "./titulo.module.css";

export function Titulo({ titulo, copy }) {
  return (
    <div className={style.titulo}>
      <h1>{titulo}</h1>
      <p>{copy}</p>
    </div>
  );
}
