import { useRef } from "react";
import html2canvas from "html2canvas";
import style from "./Tema.module.css";

export function Tema({ tema, nombre_tema, explicacion_tema }) {
  const componenteRef = useRef(null);

  const descargarImagen = async () => {
    if (componenteRef.current) {
      try {
        // Capturar el componente como canvas
        const canvas = await html2canvas(componenteRef.current, {
          backgroundColor: "#ffffff",
          scale: 2, // Mayor calidad
          useCORS: true,
          allowTaint: true,
        });

        // Convertir a imagen y descargar
        const enlace = document.createElement("a");
        enlace.download = `tema-${tema}-${new Date().getTime()}.png`;
        enlace.href = canvas.toDataURL("image/png");
        enlace.click();
      } catch (error) {
        console.error("Error al generar la imagen:", error);
        alert("Hubo un error al generar la imagen. Inténtalo de nuevo.");
      }
    }
  };
  const compartirLinkedIn = async () => {
    if (componenteRef.current) {
      try {
        // Capturar el componente como canvas
        const canvas = await html2canvas(componenteRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        // Convertir a blob para compartir
        canvas.toBlob((blob) => {
          const file = new File([blob], `tema-${tema}.png`, {
            type: "image/png",
          });

          // Verificar si el navegador soporta Web Share API
          if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
          ) {
            navigator.share({
              title: `${nombre_tema}`,
              text: `${explicacion_tema}`,
              files: [file],
            });
          } else {
            // Fallback: abrir LinkedIn con texto
            const texto = encodeURIComponent(
              `${nombre_tema}\n\n${explicacion_tema}`
            );
            const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
              window.location.href
            )}&summary=${texto}`;
            window.open(url, "_blank");
          }
        });
      } catch (error) {
        console.error("Error al compartir:", error);
        alert("Hubo un error al compartir. Inténtalo de nuevo.");
      }
    }
  };

  return (
    <div>
      <div className={style.estudio} ref={componenteRef}>
        <div className={style.contema}>
          <span className={style.tema}>{tema}</span>
          <span className={style.copy}>Generado íntegramente por IA.</span>
        </div>
        <div className={style.nombre}>
          <h3>{nombre_tema}</h3>
        </div>
        <div className={style.explicacion}>
          <p>{explicacion_tema}</p>
        </div>
      </div>
      <div className={style.botones}>
        <button className={style.botonDescarga} onClick={descargarImagen}>
          Descargar
        </button>
        <button className={style.botonDescarga} onClick={compartirLinkedIn}>
          Compartir{" "}
        </button>
      </div>
    </div>
  );
}
