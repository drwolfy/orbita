import { useState } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Boton, BotonPlano } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { BarraTiempo } from '../componentes/Temporizador'
import { useCuentaAtras } from '../componentes/useCuentaAtras'
import { usePartida, useNombres } from '../estado/usePartida'
import { cambioDeTurno } from '../juego/sonido'
import { T } from '../textos/es'

/**
 * La app solo lleva el turno: no captura las señales, que se dicen en voz alta
 * (§2.2). Por eso aquí no hay ningún campo de texto.
 *
 * Sin cronómetro por señal no hay nada que la app tenga que llevar —la lista de
 * orden ya está a la vista—, así que se enseña entera y se va al debate de un
 * toque. El paso a paso solo aparece cuando hay tiempo que contar.
 */
export function Senales() {
  const { estado } = usePartida()
  return estado.ajustes.segundosSenal > 0 ? <SenalesPorTurnos /> : <SenalesDeUnVistazo />
}

/** Sin cronómetro: la ronda de señales entera en una pantalla. */
function SenalesDeUnVistazo() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const orden = estado.ronda?.orden ?? []

  return (
    <Pantalla
      titulo={T.senal.orden}
      pie={
        <Boton tono="magenta" intenso onClick={() => despachar({ tipo: 'senales/terminadas' })}>
          {T.senal.aDebatir}
        </Boton>
      }
    >
      <div className="flex flex-col gap-4">
        <Abre nombre={nombreDe(orden[0] ?? '')} />
        <ManiobraPublica />
        <Reglas />
        <ListaOrden orden={orden} />
      </div>
    </Pantalla>
  )
}

/** Con cronómetro: un turno cada vez, con su cuenta atrás. */
function SenalesPorTurnos() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const [turno, setTurno] = useState(0)
  const orden = estado.ronda?.orden ?? []
  const ultimo = turno >= orden.length - 1

  // La cuenta se reinicia sola en cada turno gracias a `clave`.
  const { restan, activa } = useCuentaAtras(estado.ajustes.segundosSenal, {
    clave: turno,
    sonido: estado.ajustes.sonido,
  })

  const avanzar = () => {
    if (estado.ajustes.sonido) cambioDeTurno()
    setTurno((t) => t + 1)
  }

  return (
    <Pantalla
      titulo={T.senal.orden}
      pie={
        ultimo ? (
          <Boton tono="magenta" intenso onClick={() => despachar({ tipo: 'senales/terminadas' })}>
            {T.senal.aDebatir}
          </Boton>
        ) : (
          <Boton tono="cian" onClick={avanzar}>
            {T.senal.siguiente}
          </Boton>
        )
      }
    >
      <div className="flex flex-col gap-4">
        <Panel className={activa && restan === 0 ? 'border-magenta/60 bg-magenta/5' : ''}>
          <div className="flex items-center gap-3">
            <Avatar nombre={nombreDe(orden[turno] ?? '')} tam={46} />
            <div className="flex-1">
              <p className="text-xs tracking-[0.2em] text-tenue uppercase">
                {T.senal.turnoDe(nombreDe(orden[turno] ?? ''))}
              </p>
              {activa ? (
                <div className="mt-2">
                  <BarraTiempo restan={restan} total={estado.ajustes.segundosSenal} />
                </div>
              ) : null}
            </div>
          </div>
          {activa && restan === 0 ? (
            <p className="mt-2 text-sm text-magenta">{T.senal.tiempoAgotado}</p>
          ) : null}
        </Panel>

        <ManiobraPublica />
        <Reglas />
        <ListaOrden orden={orden} turno={turno} />

        {turno > 0 ? (
          <BotonPlano className="self-center" onClick={() => setTurno((t) => t - 1)}>
            {T.traspaso.atras}
          </BotonPlano>
        ) : null}
      </div>
    </Pantalla>
  )
}

/**
 * Al salir del reparto el móvil está en manos del último jugador y nadie sabe a
 * quién le toca abrir: esto lo canta sin gastar una pantalla propia.
 */
function Abre({ nombre }: { nombre: string }) {
  return (
    <Panel className="border-cian/40 bg-cian/5">
      <div className="flex items-center gap-4">
        <Avatar nombre={nombre} tam={56} />
        <div className="min-w-0">
          <p className="text-xs tracking-[0.28em] text-tenue uppercase">{T.senal.abre}</p>
          <p
            className="truncate text-3xl font-bold text-cian-claro"
            style={{ textShadow: '0 0 18px rgba(34,211,238,0.45)' }}
          >
            {nombre}
          </p>
        </div>
      </div>
    </Panel>
  )
}

function ManiobraPublica() {
  const { estado } = usePartida()
  if (!estado.ronda?.maniobraPublica) return null

  return (
    <Panel className="border-violeta/40 bg-violeta/5">
      <p className="mb-1 text-xs tracking-[0.2em] text-violeta uppercase">
        {T.reparto.maniobraPublica}
      </p>
      <p className="text-[1.05rem]">{estado.ronda.maniobraPublica}</p>
    </Panel>
  )
}

function Reglas() {
  return (
    <Panel>
      <ol className="flex flex-col gap-1">
        {T.senal.reglas.map((regla, i) => (
          <li key={regla} className="flex gap-3 text-sm">
            <span className="text-cian tabular-nums">{i + 1}</span>
            <span>{regla}</span>
          </li>
        ))}
      </ol>
    </Panel>
  )
}

/** Sin `turno` la lista es solo referencia: no hay nada «en curso» que marcar. */
function ListaOrden({ orden, turno }: { orden: string[]; turno?: number }) {
  const nombreDe = useNombres()

  return (
    <ul className="flex flex-col gap-2">
      {orden.map((id, i) => {
        const actual = turno !== undefined && i === turno
        const pasado = turno !== undefined && i < turno
        return (
          <li
            key={id}
            className={`flex items-center gap-3 rounded-suave border px-4 py-3 transition ${
              actual
                ? 'border-cian bg-cian/10'
                : pasado
                  ? 'border-borde/50 opacity-45'
                  : 'border-borde/70'
            }`}
          >
            <span className="w-6 text-center text-sm tabular-nums text-tenue">{i + 1}</span>
            <span className={`flex-1 text-lg ${actual ? 'text-cian-claro' : 'text-texto'}`}>
              {nombreDe(id)}
            </span>
            {actual ? (
              <span className="text-xs tracking-[0.18em] text-cian uppercase">ahora</span>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
