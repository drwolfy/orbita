import { useEffect, useRef, useState } from 'react'
import { Lienzo, type LienzoRef } from '../componentes/Lienzo'
import { BarraTiempo } from '../componentes/Temporizador'
import { useCuentaAtras } from '../componentes/useCuentaAtras'
import { Pantalla } from '../componentes/Pantalla'
import { Traspaso } from '../componentes/Traspaso'
import { usePartida, useNombres } from '../estado/usePartida'
import { jugadorDelTurno, lienzoActual } from '../juego/relevo'
import { T } from '../textos/es'

/** Segundos de «prepárate» entre coger el móvil y poder dibujar. */
const PREPARACION = 5

/**
 * Lo que hay que dibujar, bien grande: se lee de reojo y con prisa.
 *
 * Una frase va seguida y en una sola caja —partirla en etiquetas rompe la
 * lectura—; las palabras sueltas, cada una en la suya, que no forman oración.
 */
function Palabras({
  palabras,
  esFrase,
  grandes = false,
}: {
  palabras: string[]
  esFrase: boolean
  grandes?: boolean
}) {
  if (esFrase) {
    return (
      <p
        className={`shrink-0 text-center leading-tight font-bold text-cian-claro ${
          grandes ? 'text-4xl' : 'text-xl'
        }`}
      >
        {palabras.join(' ')}
      </p>
    )
  }

  return (
    <div className="flex shrink-0 flex-wrap justify-center gap-2">
      {palabras.map((palabra) => (
        <span
          key={palabra}
          className={`rounded-full border border-cian/50 bg-cian/10 font-bold text-cian-claro ${
            grandes ? 'px-5 py-2 text-4xl' : 'px-3 py-1 text-xl'
          }`}
        >
          {palabra}
        </span>
      ))}
    </div>
  )
}

export function RelevoDibujo() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const [cuenta, setCuenta] = useState(PREPARACION)

  const relevo = estado.relevo
  const jugadorId = relevo ? jugadorDelTurno(relevo) : undefined

  // La cuenta de «prepárate» sirve para leer las palabras sin gastar reloj: si
  // el turno empezara al coger el móvil, los primeros segundos se irían en
  // enterarse de qué hay que dibujar.
  useEffect(() => {
    if (estado.enTraspaso) {
      setCuenta(PREPARACION)
      return
    }
    if (cuenta <= 0) return
    const id = window.setTimeout(() => setCuenta((c) => c - 1), 1000)
    return () => window.clearTimeout(id)
  }, [cuenta, estado.enTraspaso])

  if (!relevo || !jugadorId) return null

  if (estado.enTraspaso) {
    return (
      <Traspaso
        nombre={nombreDe(jugadorId)}
        progreso={T.relevo.progreso(relevo.turno + 1, relevo.orden.length - 1)}
        onListo={() => despachar({ tipo: 'relevo/turno-listo' })}
      />
    )
  }

  if (cuenta > 0) {
    return (
      <Pantalla>
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <p className="text-sm tracking-[0.3em] text-tenue uppercase">{T.relevo.preparate}</p>
          <Palabras palabras={relevo.palabras} esFrase={relevo.esFrase} grandes />
          <span
            className="text-8xl font-light tabular-nums text-magenta"
            style={{ textShadow: '0 0 30px rgba(232,121,249,0.5)' }}
          >
            {cuenta}
          </span>
          <p className="max-w-xs text-sm text-tenue">{T.relevo.preparateAyuda}</p>
        </div>
      </Pantalla>
    )
  }

  /**
   * El turno va en un componente aparte y con `key` del turno a propósito: así
   * nace con su cuenta atrás ya cargada.
   *
   * Estando todo junto, mientras duraba la preparación el reloj de dibujo valía
   * cero, y en el render en que la preparación terminaba el corte se disparaba
   * de golpe: capturaba un lienzo en blanco y saltaba al siguiente jugador sin
   * dejar dibujar.
   */
  return (
    <Turno
      key={relevo.turno}
      palabras={relevo.palabras}
      esFrase={relevo.esFrase}
      inicial={lienzoActual(relevo)}
      segundos={estado.ajustes.segundosTrazo}
      sonido={estado.ajustes.sonido}
      alAcabar={(png) => despachar({ tipo: 'relevo/trazo', png })}
    />
  )
}

function Turno({
  palabras,
  esFrase,
  inicial,
  segundos,
  sonido,
  alAcabar,
}: {
  palabras: string[]
  esFrase: boolean
  inicial: string | null
  segundos: number
  sonido: boolean
  alAcabar: (png: string) => void
}) {
  const lienzoRef = useRef<LienzoRef>(null)
  const yaEntregado = useRef(false)
  const { restan } = useCuentaAtras(segundos, { sonido })

  // El corte lo dispara la cuenta atrás; no hay botón de «listo». Si lo
  // hubiera, quien va justo de tiempo lo tocaría antes de acabar y el siguiente
  // heredaría un dibujo a medias sin saber por qué.
  useEffect(() => {
    if (restan > 0 || yaEntregado.current) return
    yaEntregado.current = true
    alAcabar(lienzoRef.current?.capturar() ?? '')
  }, [restan, alAcabar])

  return (
    <Pantalla>
      {/* Todo lo que no sea el lienzo se aprieta al mínimo: son veinte segundos
          y el sitio para dibujar es lo único que importa aquí. La ayuda de
          «dibuja con el dedo» se cayó: se entiende sola y ocupaba una línea. */}
      <div className="flex flex-1 flex-col gap-2">
        <Palabras palabras={palabras} esFrase={esFrase} />
        <Lienzo ref={lienzoRef} inicial={inicial} />
        <div className="shrink-0">
          <BarraTiempo restan={restan} total={segundos} />
        </div>
      </div>
    </Pantalla>
  )
}
