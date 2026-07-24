import { Avatar } from '../componentes/Avatar'
import { BotonPlano } from '../componentes/Marco'
import { Pantalla } from '../componentes/Pantalla'
import { RevelarPulsando } from '../componentes/RevelarPulsando'
import { Traspaso } from '../componentes/Traspaso'
import { FotoRecortada } from '../componentes/FotoRecortada'
import { usePartida } from '../estado/usePartida'
import { esImagen } from '../juego/tipos'
import { T } from '../textos/es'

/**
 * Las palabras largas («supermercado») no caben al tamaño de las cortas, así
 * que el cuerpo se ajusta en vez de desbordarse o partirse.
 */
function tamanoPalabra(palabra: string): string {
  if (palabra.length <= 7) return 'text-6xl'
  if (palabra.length <= 10) return 'text-5xl'
  if (palabra.length <= 13) return 'text-4xl'
  return 'text-3xl'
}

export function Reparto() {
  const { estado, despachar } = usePartida()
  const { ronda, indiceReparto, jugadores } = estado
  if (!ronda) return null

  const jugador = jugadores[indiceReparto]
  if (!jugador) return null

  const asignacion = ronda.asignaciones.find((a) => a.jugadorId === jugador.id)
  if (!asignacion) return null

  const progreso = T.reparto.progreso(indiceReparto + 1, jugadores.length)
  const conFotos = esImagen(ronda.familia)

  if (estado.enTraspaso) {
    return (
      <Traspaso
        nombre={jugador.nombre}
        progreso={progreso}
        onListo={() => despachar({ tipo: 'traspaso/listo' })}
        {...(indiceReparto > 0 ? { onAtras: () => despachar({ tipo: 'reparto/atras' }) } : {})}
      />
    )
  }

  return (
    <Pantalla
      pie={
        <BotonPlano onClick={() => despachar({ tipo: 'reparto/atras' })}>
          {T.traspaso.atras}
        </BotonPlano>
      }
    >
      <div className="flex flex-1 flex-col gap-4">
        {/* Quién tiene el móvil: esto no es secreto, así que va fuera del
            pulsado y bien grande, para no equivocarse de persona. */}
        <div className="flex shrink-0 items-center gap-3">
          <Avatar nombre={jugador.nombre} tam={64} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-3xl font-semibold text-texto">{jugador.nombre}</p>
            <p className="text-xs tracking-[0.28em] text-tenue uppercase">{progreso}</p>
          </div>
        </div>

        {/* Palabra y maniobra van juntas bajo el mismo pulsado: las dos son
            información privada, y así solo hay un gesto que aprender. Al soltar
            se pasa al siguiente, sin botón de confirmar. */}
        <RevelarPulsando
          onLeido={() => despachar({ tipo: 'reparto/revelado' })}
          ayuda={conFotos ? T.reparto.paraVerImagen : T.reparto.paraVer}
        >
          {/* La palabra se centra en todo el espacio que quede por encima de la
              maniobra, en vez de quedarse pegada arriba con un hueco debajo. */}
          {/* `min-h-0`: sin esto un hijo que se estira (la foto) desborda el
              flex en vez de encogerse dentro de él. */}
          <div className="flex w-full min-h-0 flex-1 flex-col items-center justify-center gap-3">
            {asignacion.palabra === null ? (
              <>
                <span className="revela text-3xl font-bold tracking-[0.1em] text-magenta uppercase">
                  {T.reparto.impostor}
                </span>
                <span className="text-base text-tenue">{T.reparto.impostorAyuda}</span>
                {asignacion.pista ? (
                  <div className="mt-2 flex flex-col items-center gap-1.5">
                    <span className="text-xs tracking-[0.24em] text-tenue uppercase">
                      {T.reparto.pista}
                    </span>
                    <span
                      className="text-3xl font-bold text-cian-claro"
                      style={{ textShadow: '0 0 18px rgba(34,211,238,0.45)' }}
                    >
                      {asignacion.pista}
                    </span>
                    {/* Sin esto, lo rentable es soltar la pista tal cual y
                        volverse invisible. */}
                    <span className="text-sm text-magenta">{T.reparto.pistaNoDecir}</span>
                  </div>
                ) : null}
              </>
            ) : conFotos ? (
              /* Solo el recorte: de cerca, una textura no se reconoce, que es
                 justo de lo que va la ronda. La foto entera se guarda para el
                 álbum del final. */
              <FotoRecortada
                familia={ronda.familia}
                id={asignacion.palabra}
                className="revela pointer-events-none h-full w-full rounded-suave select-none"
              />
            ) : (
              <span
                className={`revela leading-tight font-bold text-cian-claro ${tamanoPalabra(asignacion.palabra)}`}
                style={{ textShadow: '0 0 28px rgba(34,211,238,0.45)' }}
              >
                {asignacion.palabra}
              </span>
            )}
          </div>

          {asignacion.maniobra ? (
            <div className="w-full shrink-0 border-t border-borde/70 pt-4">
              <p className="mb-1.5 text-xs tracking-[0.24em] text-violeta uppercase">
                {T.reparto.tuManiobra}
              </p>
              <p className="text-lg leading-snug text-texto">{asignacion.maniobra.texto}</p>
            </div>
          ) : null}
        </RevelarPulsando>
      </div>
    </Pantalla>
  )
}
