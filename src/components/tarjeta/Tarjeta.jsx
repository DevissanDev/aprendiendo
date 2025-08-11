import style from "./tarjeta.module.css";

export function Tarjeta({ nombre, variable, color, textColor }) {
  return (
    <div
      className={style.tarjeta}
      style={{ "--color": color, "--text-color": textColor }}
    >
      <p>{`${nombre}:`}</p>
      <p>{variable}</p>
    </div>
  );
}
