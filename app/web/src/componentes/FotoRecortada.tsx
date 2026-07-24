import { rutaImagen, recorteDe } from '../juego/parejas'
import type { Familia } from '../juego/tipos'

/**
 * La foto tal y como la ve la mesa durante la ronda: solo el trozo que dice
 * `recortes`, ampliado hasta llenar el hueco.
 *
 * El recorte va como dato y no como fichero aparte a propósito. Se guarda UNA
 * foto por imagen; la ronda enseña un cuadradito y el álbum del final enseña la
 * misma foto entera. Reencuadrar es cambiar tres números en el JSON, no volver
 * a exportar nada.
 *
 * La cuenta del `background-position` no es evidente: con `background-size`
 * mayor que el contenedor, un `p%` alinea el punto p% de la imagen con el punto
 * p% del hueco, así que el borde izquierdo visible cae en
 * `(anchoImagen - anchoHueco) · p/100`. Queriendo que ese borde sea `x`, y
 * sabiendo que `anchoHueco = lado · anchoImagen`, sale `p = 100x / (1 - lado)`.
 */
export function FotoRecortada({
  familia,
  id,
  className = '',
}: {
  familia: Familia
  id: string
  className?: string
}) {
  const { x, y, lado } = recorteDe(familia, id)

  // Con `lado: 1` (foto entera) la fórmula divide por cero y además no hay nada
  // que encuadrar: se centra y punto.
  const posicion = (inicio: number) =>
    lado >= 1 ? '50%' : `${(100 * inicio) / (1 - lado)}%`

  return (
    <div
      /* Sin texto alternativo a propósito: nombrar la foto sería cantar la
         respuesta. El modo imágenes no se puede jugar sin ver. */
      aria-hidden
      className={`bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${rutaImagen(familia, id)})`,
        backgroundSize: `${100 / lado}%`,
        backgroundPositionX: posicion(x),
        backgroundPositionY: posicion(y),
      }}
    />
  )
}
