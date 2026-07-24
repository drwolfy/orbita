import type { ReactNode } from 'react'
import { Boton } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { jugadoresVivos, MIN_PARA_SEGUIR } from '../estado/partida'
import { usePartida, useNombres } from '../estado/usePartida'
import { cumpleAuto } from '../juego/maniobras'
import { esDesviado } from '../juego/puntuacion'
import { cuentaVotos } from '../juego/tipos'
import { resolver } from '../juego/votacion'
import { T } from '../textos/es'

/**
 * El cierre de la ronda, de un vistazo. Se responde a la única pregunta que
 * importa —¿le habéis dado o no?— y nada más: ni qué palabra tenía cada uno, ni
 * cuál era la del centro. Quien tuviera la rara se queda con su duda y la mesa
 * encadena rondas sin que la partida se descosa.
 */
export function Alineacion() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const { ronda, votacion, expulsadoId } = estado
  if (!ronda) return null

  // Rendirse en mitad del debate llega aquí sin votación ni expulsado: no hay
  // veredicto que dar, solo cerrar la ronda. Las maniobras automáticas siguen
  // necesitando un recuento con el que contrastar, aunque esté a cero.
  const sinVotar = !expulsadoId
  const recuento = votacion ?? resolver(estado.recuento)

  const expulsado = ronda.asignaciones.find((a) => a.jugadorId === expulsadoId)
  const acertaron = expulsado ? esDesviado(expulsado) : false
  const esClasico = estado.ajustes.modo === 'clasico'

  const veredicto = esClasico
    ? acertaron
      ? T.alineacion.siImpostor
      : T.alineacion.noImpostor
    : acertaron
      ? T.alineacion.siDesviado
      : T.alineacion.noDesviado

  const conManiobra = ronda.asignaciones.filter((a) => a.maniobra)

  // Se sigue con la MISMA palabra mientras quede algún desviado suelto y haya
  // bastantes en pie. Ojo: con dos satélites, cazar a uno NO acaba la ronda.
  const cazados = new Set(expulsadoId ? [...estado.eliminados, expulsadoId] : estado.eliminados)
  const quedanDesviados = ronda.asignaciones
    .filter(esDesviado)
    .some((a) => !cazados.has(a.jugadorId))

  const quedarian = jugadoresVivos(estado).length - 1
  const puedeSeguir =
    quedanDesviados &&
    !estado.rendido &&
    !estado.acertoElAstro &&
    quedarian >= MIN_PARA_SEGUIR

  return (
    <Pantalla
      titulo={T.alineacion.titulo}
      pie={
        puedeSeguir ? (
          <>
            {/* Cazasteis a uno pero queda otro: hay que decirlo o la mesa no
                entiende por qué sigue la ronda. */}
            {acertaron ? (
              <p className="text-center text-sm text-magenta">{T.alineacion.quedaOtro}</p>
            ) : null}
            <Boton tono="cian" intenso onClick={() => despachar({ tipo: 'ronda/continuar' })}>
              {T.alineacion.seguir}
            </Boton>
            <Boton
              tono="tenue"
              pequeno
              nota={T.alineacion.rendirseNota}
              onClick={() => despachar({ tipo: 'ronda/rendirse' })}
            >
              {T.alineacion.rendirse}
            </Boton>
          </>
        ) : (
          <>
            {/* Dos motivos distintos para no poder seguir: os habéis rendido, o
                se ha quedado la mesa sin gente. No los confundas. */}
            {quedanDesviados && !estado.acertoElAstro ? (
              <p className="text-center text-sm text-magenta">
                {estado.rendido ? T.alineacion.rendido : T.alineacion.sinGente}
              </p>
            ) : null}
            <Boton tono="cian" intenso onClick={() => despachar({ tipo: 'ronda/cerrar' })}>
              {T.alineacion.alMarcador}
            </Boton>
          </>
        )
      }
    >
      <div className="flex flex-col gap-3">
        {sinVotar ? (
          <Bloque titulo={T.alineacion.pasos.sinVotar}>
            <p className="text-2xl font-semibold text-magenta">{T.alineacion.toallaTitulo}</p>
            <p className="mt-2 text-sm text-tenue">{T.alineacion.toallaAyuda}</p>
          </Bloque>
        ) : (
          <>
            <Bloque titulo={T.alineacion.pasos.votado}>
              <p className="text-3xl font-semibold text-texto">{nombreDe(expulsadoId)}</p>
              {/* En votación directa no hay recuento que enseñar: el «1 voto»
                  que guarda el estado es solo la marca del señalado. */}
              {cuentaVotos(estado.ajustes.metodoVotacion) && votacion ? (
                <p className="mt-1 text-sm text-tenue">
                  {T.votacion.votos(votacion.recuento[expulsadoId] ?? 0)}
                </p>
              ) : null}
            </Bloque>

            {/* Sí o no, y punto. La palabra del centro no se enseña: es lo que
                deja viva la duda de «¿y si el raro era yo?» para la siguiente. */}
            <Bloque titulo={T.alineacion.pasos.quienEra}>
              <p
                className={`text-3xl font-bold ${acertaron ? 'text-magenta' : 'text-cian-claro'}`}
                style={{
                  textShadow: acertaron
                    ? '0 0 20px rgba(244,63,110,0.4)'
                    : '0 0 20px rgba(34,211,238,0.4)',
                }}
              >
                {veredicto}
              </p>
            </Bloque>
          </>
        )}

        {/* Solo si cayó el desviado: la mesa ya vio su intento en la pantalla
            anterior, así que decir en qué quedó no destapa nada nuevo. */}
        {acertaron ? (
          <Bloque titulo={T.alineacion.pasos.intento}>
            <p
              className={`text-lg font-semibold ${estado.acertoElAstro ? 'text-magenta' : 'text-tenue'}`}
            >
              {estado.acertoElAstro ? T.alineacion.acerto : T.alineacion.fallo}
            </p>
          </Bloque>
        ) : null}

        {/* Las maniobras solo se verifican cuando la ronda se acaba de verdad:
            si se sigue jugando, todavía están en juego. */}
        {!puedeSeguir && conManiobra.length > 0 ? (
          <Bloque titulo={T.alineacion.pasos.maniobras}>
            <ul className="flex flex-col gap-3">
              {conManiobra.map((a) => {
                const maniobra = a.maniobra
                if (!maniobra) return null
                const auto = maniobra.verificacion === 'auto'
                const cumplida = auto
                  ? cumpleAuto(maniobra, a.jugadorId, recuento)
                  : (estado.maniobrasDelGrupo[a.jugadorId] ?? false)

                return (
                  <li
                    key={a.jugadorId}
                    className="border-t border-borde/50 pt-3 first:border-0 first:pt-0"
                  >
                    <p className="text-sm text-tenue">{nombreDe(a.jugadorId)}</p>
                    <p className="mt-0.5 text-[1.02rem]">{maniobra.texto}</p>

                    {auto ? (
                      <p className={`mt-1.5 text-sm ${cumplida ? 'text-cian' : 'text-tenue'}`}>
                        {cumplida ? T.alineacion.cumplida : T.alineacion.noCumplida} ·{' '}
                        {T.alineacion.automatica}
                      </p>
                    ) : (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="flex-1 text-sm text-tenue">
                          {T.alineacion.verificaGrupo}
                        </span>
                        <Marca
                          activa={cumplida}
                          texto={T.alineacion.cumplida}
                          onClick={() =>
                            despachar({
                              tipo: 'maniobra/grupo',
                              jugadorId: a.jugadorId,
                              cumplida: true,
                            })
                          }
                        />
                        <Marca
                          activa={!cumplida}
                          texto={T.alineacion.noCumplida}
                          onClick={() =>
                            despachar({
                              tipo: 'maniobra/grupo',
                              jugadorId: a.jugadorId,
                              cumplida: false,
                            })
                          }
                        />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Bloque>
        ) : null}
      </div>
    </Pantalla>
  )
}

function Bloque({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <Panel>
      <p className="mb-2 text-xs tracking-[0.24em] text-tenue uppercase">{titulo}</p>
      {children}
    </Panel>
  )
}

function Marca({
  activa,
  texto,
  onClick,
}: {
  activa: boolean
  texto: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activa}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        activa ? 'border-cian bg-cian/15 text-cian' : 'border-borde text-tenue'
      }`}
    >
      {texto}
    </button>
  )
}
