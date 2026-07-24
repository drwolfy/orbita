import { Version } from '../componentes/Actualizacion'
import { Anillos } from '../componentes/Anillos'
import { Boton } from '../componentes/Marco'
import { Pantalla } from '../componentes/Pantalla'
import { SelectorModo } from '../componentes/SelectorModo'
import { MIN_JUGADORES } from '../juego/reparto'
import { usePartida } from '../estado/usePartida'
import { T } from '../textos/es'

export function Inicio() {
  const { estado, despachar } = usePartida()
  const faltan = MIN_JUGADORES - estado.jugadores.length
  const listos = faltan <= 0

  return (
    <Pantalla>
      <div className="flex flex-col items-center gap-6 pt-4">
        <Anillos tam={160} />

        <div className="text-center">
          <h1
            className="text-5xl font-bold tracking-[0.22em] text-cian-claro"
            style={{ textShadow: '0 0 24px rgba(34,211,238,0.55), 0 0 60px rgba(34,211,238,0.25)' }}
          >
            {T.titulo}
          </h1>
          <p className="mt-3 text-sm tracking-[0.16em] text-tenue uppercase">{T.lema}</p>
        </div>

        {/* El modo se elige aquí mismo: es lo que más se cambia de una partida
            a otra y no tiene por qué estar escondido en un menú. */}
        <SelectorModo />

        <div className="flex w-full flex-col gap-3">
          <Boton
            tono="cian"
            intenso
            disabled={!listos}
            nota={listos ? undefined : T.inicio.faltanJugadores(faltan)}
            onClick={() =>
              despachar(
                estado.ajustes.juego === 'relevo'
                  ? { tipo: 'relevo/empezar' }
                  : { tipo: 'ronda/repartir' },
              )
            }
          >
            {T.inicio.jugar}
          </Boton>

          <Boton
            tono="magenta"
            nota={T.inicio.enLaMesa(estado.jugadores.length)}
            onClick={() => despachar({ tipo: 'ir', fase: 'jugadores' })}
          >
            {T.inicio.jugadores}
          </Boton>

          <div className="grid grid-cols-2 gap-3">
            <Boton
              tono="violeta"
              pequeno
              onClick={() => despachar({ tipo: 'ir', fase: 'tutorial' })}
            >
              {T.inicio.comoSeJuega}
            </Boton>
            <Boton tono="tenue" pequeno onClick={() => despachar({ tipo: 'ir', fase: 'marcador' })}>
              {T.inicio.marcador}
            </Boton>
          </div>
        </div>

        <Version />
      </div>
    </Pantalla>
  )
}
