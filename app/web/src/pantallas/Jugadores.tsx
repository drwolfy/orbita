import { useState } from 'react'
import { Avatar } from '../componentes/Avatar'
import { Grupo, Interruptor, Opcion } from '../componentes/Controles'
import { Boton, BotonPlano } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { SelectorModo } from '../componentes/SelectorModo'
import { SelectorTemas } from '../componentes/SelectorTemas'
import { usePartida } from '../estado/usePartida'
import { FAMILIAS } from '../juego/catalogo'
import { MAX_JUGADORES, MIN_JUGADORES } from '../juego/reparto'
import type { Ajustes } from '../juego/tipos'
import { T } from '../textos/es'

/**
 * Preparación de la partida en una sola pantalla: quién juega, a qué modo y con
 * qué opciones. Antes esto estaba partido en dos sitios y obligaba a ir y venir
 * para algo que se decide de una vez, antes de repartir.
 */
export function Jugadores() {
  const { estado, despachar } = usePartida()
  const [nombre, setNombre] = useState('')
  const [verOpciones, setVerOpciones] = useState(false)

  const a = estado.ajustes
  const cambiar = (parcial: Partial<Ajustes>) => despachar({ tipo: 'ajustes/cambiar', parcial })

  const lleno = estado.jugadores.length >= MAX_JUGADORES
  const faltan = MIN_JUGADORES - estado.jugadores.length
  const jugadas = estado.historialFamilias.length

  const anadir = () => {
    if (!nombre.trim() || lleno) return
    despachar({ tipo: 'jugador/anadir', nombre })
    setNombre('')
  }

  return (
    <Pantalla
      titulo={T.partida.titulo}
      pie={
        <>
          <Boton
            tono="cian"
            intenso
            disabled={faltan > 0}
            {...(faltan > 0 ? { nota: T.inicio.faltanJugadores(faltan) } : {})}
            onClick={() => despachar({ tipo: 'ronda/repartir' })}
          >
            {T.inicio.jugar}
          </Boton>
          <BotonPlano onClick={() => despachar({ tipo: 'ir', fase: 'inicio' })}>
            {T.jugadores.volver}
          </BotonPlano>
        </>
      }
    >
      <Grupo titulo={T.ajustes.modo}>
        <SelectorModo />
      </Grupo>

      <Grupo titulo={T.jugadores.titulo}>
        <p className="-mt-1 mb-1 text-sm text-tenue">{T.jugadores.ayuda}</p>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            anadir()
          }}
        >
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={T.jugadores.nuevo}
            maxLength={14}
            autoComplete="off"
            disabled={lleno}
            /* `min-w-0` es obligatorio: sin él, el ancho intrínseco del input
               impide que encoja y empuja al botón fuera de la pantalla. */
            className="min-h-[3.25rem] w-full min-w-0 flex-1 rounded-suave border border-borde bg-superficie/60 px-4 text-lg text-texto placeholder:text-tenue/70 focus:border-cian focus:outline-none"
          />
          <button
            type="submit"
            disabled={lleno || !nombre.trim()}
            className="min-h-[3.25rem] shrink-0 rounded-suave border border-cian px-5 text-sm tracking-[0.14em] text-cian uppercase disabled:opacity-40"
          >
            {T.jugadores.anadir}
          </button>
        </form>

        {lleno ? <p className="text-center text-sm text-magenta">{T.jugadores.lleno}</p> : null}

        {/* Sin `escalonado` a propósito: los retardos van por nth-child, así
            que al reordenar cambiarían y la lista entera volvería a aparecer
            desde cero. Aquí el movimiento tiene que ser instantáneo. */}
        <ul className="flex flex-col gap-2">
          {estado.jugadores.map((jugador, i) => (
            <li key={jugador.id}>
              <Panel className="flex items-center gap-1 !py-2">
                <span className="w-5 text-center text-sm tabular-nums text-tenue">{i + 1}</span>
                <Avatar nombre={jugador.nombre} tam={38} />
                <span className="flex-1 truncate px-1 text-lg">{jugador.nombre}</span>

                {/* Flechas en vez de arrastrar: el móvil va de mano en mano y a
                    media luz, y un arrastre falla más de lo que acierta. */}
                <button
                  aria-label={T.jugadores.subir(jugador.nombre)}
                  disabled={i === 0}
                  onClick={() => despachar({ tipo: 'jugador/mover', id: jugador.id, direccion: -1 })}
                  className="px-3 py-2 text-lg leading-none text-tenue active:text-cian disabled:opacity-25"
                >
                  ↑
                </button>
                <button
                  aria-label={T.jugadores.bajar(jugador.nombre)}
                  disabled={i === estado.jugadores.length - 1}
                  onClick={() => despachar({ tipo: 'jugador/mover', id: jugador.id, direccion: 1 })}
                  className="px-3 py-2 text-lg leading-none text-tenue active:text-cian disabled:opacity-25"
                >
                  ↓
                </button>
                <button
                  aria-label={T.jugadores.quitar(jugador.nombre)}
                  onClick={() => despachar({ tipo: 'jugador/quitar', id: jugador.id })}
                  className="px-3 py-2 text-xl leading-none text-tenue active:text-alerta"
                >
                  ×
                </button>
              </Panel>
            </li>
          ))}
        </ul>
      </Grupo>

      {/* Los temas solo ordenan las palabras: un trío de fotos no tiene tema.
          El modo se elige en el selector de arriba, que ya trae las fotos. */}
      {a.catalogo !== 'imagenes' || a.modo === 'clasico' ? (
        <Grupo titulo={T.temas.titulo}>
          <SelectorTemas />
        </Grupo>
      ) : null}

      {/* El resto de opciones se cambia poco: van plegadas para que la pantalla
          no abrume nada más entrar. */}
      <button
        onClick={() => setVerOpciones((v) => !v)}
        aria-expanded={verOpciones}
        className="mb-4 flex w-full items-center justify-between rounded-suave border border-borde/70 px-4 py-3 text-left"
      >
        <span className="text-sm tracking-[0.16em] text-tenue uppercase">
          {T.partida.masOpciones}
        </span>
        <span className={`text-tenue transition-transform ${verOpciones ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>

      {verOpciones ? (
        <div className="aparece">
          {a.modo === 'clasico' ? (
            <Grupo titulo={T.ajustes.pistaImpostor}>
              <Opcion
                activa={a.pistaImpostor === 'nada'}
                titulo={T.ajustes.pistaNada}
                ayuda={T.ajustes.pistaNadaAyuda}
                onClick={() => cambiar({ pistaImpostor: 'nada' })}
              />
              <Opcion
                activa={a.pistaImpostor === 'pista'}
                titulo={T.ajustes.pistaUna}
                ayuda={T.ajustes.pistaUnaAyuda}
                onClick={() => cambiar({ pistaImpostor: 'pista' })}
              />
            </Grupo>
          ) : (
            <Grupo titulo={T.ajustes.satelites}>
              <Opcion
                activa={a.satelites === 'auto'}
                titulo={T.ajustes.satelitesAuto}
                ayuda={T.ajustes.satelitesAutoAyuda}
                onClick={() => cambiar({ satelites: 'auto' })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Opcion
                  activa={a.satelites === 1}
                  titulo={T.ajustes.siempre1}
                  onClick={() => cambiar({ satelites: 1 })}
                />
                <Opcion
                  activa={a.satelites === 2}
                  titulo={T.ajustes.siempre2}
                  onClick={() => cambiar({ satelites: 2 })}
                />
              </div>
            </Grupo>
          )}

          <Grupo titulo={T.ajustes.maniobras}>
            <Interruptor
              activo={a.maniobrasActivas}
              titulo={T.ajustes.maniobras}
              ayuda={T.ajustes.maniobrasAyuda}
              onClick={() => cambiar({ maniobrasActivas: !a.maniobrasActivas })}
            />
            {a.maniobrasActivas ? (
              <>
                <Interruptor
                  activo={a.maniobrasEnfrentadas}
                  titulo={T.ajustes.enfrentadas}
                  ayuda={T.ajustes.enfrentadasAyuda}
                  onClick={() => cambiar({ maniobrasEnfrentadas: !a.maniobrasEnfrentadas })}
                />
                <Interruptor
                  activo={a.maniobraPublica}
                  titulo={T.ajustes.publica}
                  ayuda={T.ajustes.publicaAyuda}
                  onClick={() => cambiar({ maniobraPublica: !a.maniobraPublica })}
                />
              </>
            ) : null}
          </Grupo>

          <Grupo titulo={T.ajustes.debate}>
            <div className="grid grid-cols-4 gap-2">
              {[60, 90, 120, 180].map((s) => (
                <Opcion
                  key={s}
                  activa={a.segundosDebate === s}
                  titulo={T.ajustes.segundos(s)}
                  onClick={() => cambiar({ segundosDebate: s })}
                />
              ))}
            </div>
          </Grupo>

          <Grupo titulo={T.ajustes.senal}>
            <p className="-mt-1 mb-1 text-xs text-tenue">{T.ajustes.senalAyuda}</p>
            <div className="grid grid-cols-4 gap-2">
              <Opcion
                activa={a.segundosSenal === 0}
                titulo={T.ajustes.sinLimite}
                onClick={() => cambiar({ segundosSenal: 0 })}
              />
              {[10, 15, 20].map((s) => (
                <Opcion
                  key={s}
                  activa={a.segundosSenal === s}
                  titulo={T.ajustes.segundos(s)}
                  onClick={() => cambiar({ segundosSenal: s })}
                />
              ))}
            </div>
          </Grupo>

          <Grupo titulo={T.ajustes.sonido}>
            <Interruptor
              activo={a.sonido}
              titulo={T.ajustes.sonido}
              ayuda={T.ajustes.sonidoAyuda}
              onClick={() => cambiar({ sonido: !a.sonido })}
            />
          </Grupo>

          <Grupo titulo={T.ajustes.votacion}>
            <Opcion
              activa={a.metodoVotacion === 'directa'}
              titulo={T.ajustes.votacionDirecta}
              ayuda={T.ajustes.votacionDirectaAyuda}
              onClick={() => cambiar({ metodoVotacion: 'directa' })}
            />
            <Opcion
              activa={a.metodoVotacion === 'pasa'}
              titulo={T.ajustes.votacionPasa}
              ayuda={T.ajustes.votacionPasaAyuda}
              onClick={() => cambiar({ metodoVotacion: 'pasa' })}
            />
            <Opcion
              activa={a.metodoVotacion === 'operador'}
              titulo={T.ajustes.votacionOperador}
              ayuda={T.ajustes.votacionOperadorAyuda}
              onClick={() => cambiar({ metodoVotacion: 'operador' })}
            />
          </Grupo>

          <Grupo titulo={T.palabras.titulo}>
            <Panel>
              <p className="text-sm text-tenue">
                {jugadas > 0 ? T.palabras.ayuda(jugadas, FAMILIAS.length) : T.palabras.ninguna}
              </p>
              {jugadas > 0 ? (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-borde/60">
                  <div
                    className="h-full rounded-full bg-cian/70"
                    style={{ width: `${Math.round((jugadas / FAMILIAS.length) * 100)}%` }}
                  />
                </div>
              ) : null}
              {jugadas > 0 ? (
                <BotonPlano
                  className="mt-2 !px-0"
                  onClick={() => {
                    if (confirm(T.palabras.confirmar)) despachar({ tipo: 'historial/olvidar' })
                  }}
                >
                  {T.palabras.olvidar}
                </BotonPlano>
              ) : null}
            </Panel>
          </Grupo>
        </div>
      ) : null}
    </Pantalla>
  )
}
