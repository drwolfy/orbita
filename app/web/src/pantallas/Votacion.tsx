import { Avatar } from '../componentes/Avatar'
import { Boton, BotonPlano, Marco } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { Traspaso } from '../componentes/Traspaso'
import { jugadoresVivos } from '../estado/partida'
import { usePartida } from '../estado/usePartida'
import { totalVotos } from '../juego/votacion'
import { T } from '../textos/es'

export function Votacion() {
  const { estado } = usePartida()
  switch (estado.ajustes.metodoVotacion) {
    case 'directa':
      return <VotacionDirecta />
    case 'pasa':
      return <VotacionPasando />
    default:
      return <VotacionAMano />
  }
}

/**
 * La vía rápida: se ha votado a mano alzada, alguien toca al señalado y a la
 * revelación. Sin recuento, sin pasar el móvil y sin pantalla de empate —si lo
 * hubo, la mesa lo ha deshecho hablando, que es más rápido que teclearlo.
 */
function VotacionDirecta() {
  const { estado, despachar } = usePartida()

  return (
    <Pantalla titulo={T.votacion.titulo}>
      <p className="mb-4 text-center text-lg">{T.votacion.aQuienDirecta}</p>
      <ul className="escalonado flex flex-col gap-2">
        {jugadoresVivos(estado).map((j) => (
          <li key={j.id}>
            <button
              className="w-full text-left active:scale-[0.985]"
              onClick={() => despachar({ tipo: 'voto/directo', expulsadoId: j.id })}
            >
              <Marco tono="tenue">
                <div className="flex items-center gap-3 px-4 py-3 text-lg">
                  <Avatar nombre={j.nombre} tam={40} />
                  {j.nombre}
                </div>
              </Marco>
            </button>
          </li>
        ))}
      </ul>
    </Pantalla>
  )
}

/** Pasa-y-juega: cada uno vota en secreto y el móvil sigue su ronda. */
function VotacionPasando() {
  const { estado, despachar } = usePartida()
  const vivos = jugadoresVivos(estado)
  const votante = vivos[estado.indiceVotante]
  if (!votante) return null

  if (estado.enTraspaso) {
    return (
      <Traspaso
        nombre={votante.nombre}
        progreso={T.reparto.progreso(estado.indiceVotante + 1, vivos.length)}
        onListo={() => despachar({ tipo: 'traspaso/listo' })}
        {...(estado.indiceVotante > 0
          ? { onAtras: () => despachar({ tipo: 'voto/atras' }) }
          : {})}
      />
    )
  }

  return (
    <Pantalla titulo={T.votacion.titulo}>
      <p className="mb-4 text-center text-lg">{T.votacion.aQuien(votante.nombre)}</p>
      <ul className="escalonado flex flex-col gap-2">
        {/* Nadie se vota a sí mismo, y a los eliminados ya no se les vota. */}
        {vivos
          .filter((j) => j.id !== votante.id)
          .map((j) => (
            <li key={j.id}>
              <button
                className="w-full text-left active:scale-[0.985]"
                onClick={() => despachar({ tipo: 'voto/emitir', votadoId: j.id })}
              >
                <Marco tono="tenue">
                  <div className="flex items-center gap-3 px-4 py-3 text-lg">
                    <Avatar nombre={j.nombre} tam={40} />
                    {j.nombre}
                  </div>
                </Marco>
              </button>
            </li>
          ))}
      </ul>
    </Pantalla>
  )
}

/** A mano alzada: alguien lleva la cuenta por todos. */
function VotacionAMano() {
  const { estado, despachar } = usePartida()
  const hayVotos = totalVotos(estado.recuento) > 0

  return (
    <Pantalla
      titulo={T.votacion.manual}
      pie={
        <>
          <Boton
            tono="magenta"
            intenso
            disabled={!hayVotos}
            onClick={() => despachar({ tipo: 'votacion/cerrar' })}
          >
            {T.votacion.cerrar}
          </Boton>
          {!hayVotos ? (
            <p className="text-center text-sm text-tenue">{T.votacion.sinVotos}</p>
          ) : null}
        </>
      }
    >
      <p className="mb-4 text-center text-sm text-tenue">{T.votacion.ayudaManual}</p>
      <ul className="escalonado flex flex-col gap-2">
        {jugadoresVivos(estado).map((j) => {
          const votos = estado.recuento[j.id] ?? 0
          return (
            <li key={j.id}>
              <Panel className="flex items-center gap-3 !py-2">
                <Avatar nombre={j.nombre} tam={34} />
                <span className="flex-1 truncate text-lg">{j.nombre}</span>
                <BotonPlano
                  aria-label={`Quitar un voto a ${j.nombre}`}
                  disabled={votos === 0}
                  onClick={() => despachar({ tipo: 'voto/ajustar', jugadorId: j.id, delta: -1 })}
                  className="!px-4 !text-xl"
                >
                  −
                </BotonPlano>
                <span className="w-8 text-center text-xl tabular-nums text-cian">{votos}</span>
                <BotonPlano
                  aria-label={`Sumar un voto a ${j.nombre}`}
                  onClick={() => despachar({ tipo: 'voto/ajustar', jugadorId: j.id, delta: 1 })}
                  className="!px-4 !text-xl !text-cian"
                >
                  +
                </BotonPlano>
              </Panel>
            </li>
          )
        })}
      </ul>
    </Pantalla>
  )
}
