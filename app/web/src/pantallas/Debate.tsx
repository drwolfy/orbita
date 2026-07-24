import { Avatar } from '../componentes/Avatar'
import { Boton, BotonPlano } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { AnilloTiempo } from '../componentes/Temporizador'
import { useCuentaAtras } from '../componentes/useCuentaAtras'
import { usePartida, useNombres } from '../estado/usePartida'
import { T } from '../textos/es'

export function Debate() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const total = estado.ajustes.segundosDebate
  const { restan, corriendo, alternar } = useCuentaAtras(total, { sonido: estado.ajustes.sonido })
  const seAcabo = restan === 0

  return (
    <Pantalla
      titulo={T.debate.titulo}
      pie={
        <>
          <Boton
            tono={seAcabo ? 'magenta' : 'cian'}
            intenso={seAcabo}
            onClick={() => despachar({ tipo: 'debate/terminado' })}
          >
            {T.debate.votar}
          </Boton>
          {!seAcabo ? (
            <BotonPlano onClick={alternar}>
              {corriendo ? T.debate.pausar : T.debate.seguir}
            </BotonPlano>
          ) : null}
        </>
      }
    >
      <div className="flex flex-col items-center justify-center gap-6 pt-6">
        <AnilloTiempo restan={restan} total={total} />
        <p className={`text-lg ${seAcabo ? 'text-magenta' : 'text-tenue'}`}>
          {seAcabo ? T.debate.seAcabo : T.debate.ayuda}
        </p>

        {/* Quién ha caído ya: la mesa no tiene por qué acordarse, y deja claro
            que se sigue con la misma palabra. */}
        {estado.eliminados.length > 0 ? (
          <Panel className="w-full">
            <p className="mb-2 text-xs tracking-[0.2em] text-tenue uppercase">
              {T.debate.siguenBuscando}
            </p>
            <ul className="flex flex-wrap gap-2">
              {estado.eliminados.map((id) => (
                <li
                  key={id}
                  className="flex items-center gap-2 rounded-full border border-borde/70 py-1 pr-3 pl-1 opacity-50"
                >
                  <Avatar nombre={nombreDe(id)} tam={24} />
                  <span className="text-sm line-through">{nombreDe(id)}</span>
                  <span className="text-xs tracking-[0.14em] text-tenue uppercase">
                    {T.debate.fuera}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}

        {estado.ronda?.maniobraPublica ? (
          <Panel className="w-full border-violeta/40 bg-violeta/5">
            <p className="mb-1 text-xs tracking-[0.2em] text-violeta uppercase">
              {T.reparto.maniobraPublica}
            </p>
            <p className="text-[1.05rem]">{estado.ronda.maniobraPublica}</p>
          </Panel>
        ) : null}
      </div>
    </Pantalla>
  )
}
