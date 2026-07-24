import { useState } from 'react'
import { Firma } from '../componentes/Actualizacion'
import { Boton, BotonPlano, Marco } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { usePartida } from '../estado/usePartida'
import { HAY_PAREJAS } from '../juego/parejas'
import { T } from '../textos/es'

/**
 * Las instrucciones tienen la misma forma que la app: cuatro juegos, cuatro
 * tarjetas, y cada una abre su página corta.
 *
 * Antes era una sola tirada con todo seguido. Con un juego valía; con cuatro se
 * volvería un rollo que nadie lee, y encima obliga a leer lo de los tres modos
 * que no vas a jugar esta noche.
 */
type Cual = 'orbita' | 'fotos' | 'clasico' | 'relevo'

const JUEGOS: Array<{ cual: Cual; titulo: string; pasos: readonly string[]; aviso: string }> = [
  { cual: 'orbita', titulo: T.ajustes.modoOrbita, pasos: T.tutorial.orbita, aviso: T.tutorial.orbitaAviso },
  { cual: 'fotos', titulo: T.ajustes.modoFotos, pasos: T.tutorial.fotos, aviso: T.tutorial.fotosAviso },
  { cual: 'clasico', titulo: T.ajustes.modoClasico, pasos: T.tutorial.clasico, aviso: T.tutorial.clasicoAviso },
  { cual: 'relevo', titulo: T.relevo.nombre, pasos: T.tutorial.relevo, aviso: T.tutorial.relevoAviso },
]

export function Tutorial() {
  const { despachar } = usePartida()
  const [abierto, setAbierto] = useState<Cual | null>(null)

  const alInicio = () => despachar({ tipo: 'ir', fase: 'inicio' })
  // Sin fotos metidas no hay nada que explicar de ese modo.
  const juegos = JUEGOS.filter((j) => j.cual !== 'fotos' || HAY_PAREJAS)
  const juego = juegos.find((j) => j.cual === abierto)

  if (!juego) {
    return (
      <Pantalla
        titulo={T.tutorial.titulo}
        pie={
          <Boton tono="cian" intenso onClick={alInicio}>
            {T.tutorial.entendido}
          </Boton>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-tenue">{T.tutorial.elige}</p>

          <div className="grid grid-cols-2 gap-2.5">
            {juegos.map((j) => (
              <button
                key={j.cual}
                onClick={() => setAbierto(j.cual)}
                className="text-left transition active:scale-[0.985]"
              >
                <Marco tono="tenue">
                  <div className="flex min-h-[5rem] flex-col justify-between gap-2 px-4 py-3">
                    <span className="text-base font-semibold tracking-[0.08em] text-texto uppercase">
                      {j.titulo}
                    </span>
                    <span className="text-xs leading-snug text-tenue">{j.pasos[0]}</span>
                  </div>
                </Marco>
              </button>
            ))}
          </div>

          <Panel className="mt-2">
            <p className="text-sm text-texto/90">{T.tutorial.comun}</p>
          </Panel>

          {/* Nota legal discreta: transparencia de IA + privacidad + licencia. */}
          <p className="mt-2 text-center text-xs leading-relaxed text-tenue">{T.tutorial.legal}</p>
          <Firma />
        </div>
      </Pantalla>
    )
  }

  const ej = T.tutorial.ejemplo

  return (
    <Pantalla
      titulo={juego.titulo}
      pie={
        <>
          <Boton tono="cian" intenso onClick={() => setAbierto(null)}>
            {T.tutorial.volver}
          </Boton>
          <BotonPlano className="self-center" onClick={alInicio}>
            {T.tutorial.entendido}
          </BotonPlano>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <ol className="flex flex-col gap-2.5">
          {juego.pasos.map((paso, i) => (
            <li key={paso} className="flex gap-3 text-[0.95rem] leading-relaxed">
              <span className="text-cian tabular-nums">{i + 1}</span>
              <span className="text-texto/90">{paso}</span>
            </li>
          ))}
        </ol>

        <Panel className="border-magenta/40 bg-magenta/5">
          <p className="text-sm text-texto/90">{juego.aviso}</p>
        </Panel>

        {/* Las reglas de la señal y el ejemplo del perro solo pintan en Órbita:
            en Fotos se dan igual pero se entienden viendo la foto, y en el
            Relevo no hay señales que dar. */}
        {juego.cual === 'orbita' ? (
          <>
            <h2 className="mt-1 text-xs tracking-[0.24em] text-tenue uppercase">
              {T.senal.titulo}
            </h2>
            <Panel>
              <ol className="flex flex-col gap-2">
                {T.senal.reglas.map((regla, i) => (
                  <li key={regla} className="flex gap-3 text-sm">
                    <span className="text-cian tabular-nums">{i + 1}</span>
                    <span>{regla}</span>
                  </li>
                ))}
              </ol>
            </Panel>

            <h2 className="mt-1 text-xs tracking-[0.24em] text-tenue uppercase">
              {T.tutorial.ejemploTitulo}
            </h2>
            <Panel>
              <p className="mb-3 text-sm text-tenue">{ej.astro}</p>
              <ul className="flex flex-col gap-1.5">
                {ej.senales.map(([quien, senal]) => {
                  const desviada = quien === ej.desviada
                  return (
                    <li key={quien} className="flex items-baseline gap-2 text-[0.95rem]">
                      <span className={`w-16 shrink-0 ${desviada ? 'text-magenta' : 'text-tenue'}`}>
                        {quien}
                      </span>
                      <span className="text-tenue">→</span>
                      <span className={desviada ? 'font-semibold text-magenta' : 'text-texto'}>
                        {senal}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-3 border-t border-borde/60 pt-3 text-sm text-texto/90">{ej.remate}</p>
            </Panel>
          </>
        ) : null}
      </div>
    </Pantalla>
  )
}
