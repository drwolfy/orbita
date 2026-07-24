import { Boton } from '../componentes/Marco'
import { Pantalla } from '../componentes/Pantalla'
import { Traspaso } from '../componentes/Traspaso'
import { usePartida, useNombres } from '../estado/usePartida'
import { adivinadorDe, lienzoActual } from '../juego/relevo'
import { T } from '../textos/es'

/**
 * El último de la vuelta. Es el único que no ha visto las palabras: solo el
 * dibujo terminado.
 *
 * Lo dice en voz alta y ya está: no hay botones de acertó/falló ni recuento.
 * En esta mesa no se juega a ganar, así que un veredicto sería una pantalla de
 * más y una discusión sobre si «casi» lo dijo. El remate es destapar.
 */
export function RelevoAdivinar() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const relevo = estado.relevo
  if (!relevo) return null

  const adivinaId = adivinadorDe(relevo)
  if (!adivinaId) return null

  if (estado.enTraspaso) {
    return (
      <Traspaso
        nombre={nombreDe(adivinaId)}
        progreso={T.relevo.tuTurnoAdivinar}
        onListo={() => despachar({ tipo: 'relevo/turno-listo' })}
      />
    )
  }

  const dibujo = lienzoActual(relevo)

  return (
    <Pantalla
      titulo={T.relevo.adivinaTitulo}
      pie={
        <Boton tono="magenta" intenso onClick={() => despachar({ tipo: 'relevo/destapar' })}>
          {T.relevo.destapar}
        </Boton>
      }
    >
      <div className="flex flex-1 flex-col gap-3">
        {dibujo ? (
          <img src={dibujo} alt="" className="w-full flex-1 rounded-suave object-contain" />
        ) : null}
        <p className="shrink-0 text-center text-sm text-tenue">{T.relevo.adivinaAyuda}</p>
      </div>
    </Pantalla>
  )
}
