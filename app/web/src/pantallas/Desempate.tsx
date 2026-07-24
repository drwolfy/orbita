import { Avatar } from '../componentes/Avatar'
import { Marco } from '../componentes/Marco'
import { Pantalla } from '../componentes/Pantalla'
import { usePartida, useNombres } from '../estado/usePartida'
import { T } from '../textos/es'

/** Empate en la votación: lo deshace la mesa, no la app. */
export function Desempate() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const empatados = estado.votacion?.maximos ?? []

  return (
    <Pantalla titulo={T.desempate.titulo}>
      <p className="mb-5 text-center text-tenue">{T.desempate.ayuda}</p>
      <ul className="flex flex-col gap-3">
        {empatados.map((id) => (
          <li key={id}>
            <button
              className="w-full text-left active:scale-[0.985]"
              onClick={() => despachar({ tipo: 'desempate/elegir', jugadorId: id })}
            >
              <Marco tono="magenta">
                <div className="flex items-center gap-3 px-4 py-4">
                  <Avatar nombre={nombreDe(id)} tam={44} />
                  <span className="flex-1 text-xl">{nombreDe(id)}</span>
                  <span className="text-sm text-tenue">
                    {T.votacion.votos(estado.recuento[id] ?? 0)}
                  </span>
                </div>
              </Marco>
            </button>
          </li>
        ))}
      </ul>
    </Pantalla>
  )
}
