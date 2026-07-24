import { useRef, useState, type ReactNode } from 'react'
import { T } from '../textos/es'
import { Marco } from './Marco'

/**
 * Un toque de refilón no cuenta como haber leído la palabra: por debajo de este
 * tiempo se vuelve a tapar sin dar por visto el turno, para que un resbalón no
 * le pase el móvil al siguiente.
 */
const MINIMO_LEIDO = 600

/**
 * La palabra se ve manteniendo pulsado, nunca con un toque (§7): así nadie la
 * pilla de reojo ni se queda en pantalla si sueltas el móvil. Al levantar el
 * dedo —o al salirse del área, o si el sistema cancela el gesto— se tapa sola.
 *
 * Si le pasan `onLeido`, soltar después de haberla mirado de verdad avanza solo:
 * es un toque menos por jugador y el gesto sale natural (miro, suelto, paso).
 *
 * Ocupa todo el alto que le den: es el elemento importante de su pantalla y no
 * tiene sentido dejarlo pequeño con media pantalla vacía debajo.
 */
export function RevelarPulsando({
  children,
  onLeido,
  ayuda = T.reparto.paraVer,
}: {
  children: ReactNode
  onLeido?: () => void
  /** «para ver tu palabra», o «tu imagen» cuando la ronda va de fotos. */
  ayuda?: string
}) {
  const [pulsando, setPulsando] = useState(false)
  const desde = useRef(0)

  const abrir = () => {
    desde.current = performance.now()
    setPulsando(true)
  }

  const tapar = () => {
    if (!pulsando) return
    setPulsando(false)
    if (onLeido && performance.now() - desde.current >= MINIMO_LEIDO) onLeido()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${T.reparto.manten} ${ayuda}`}
      onPointerDown={abrir}
      onPointerUp={tapar}
      onPointerCancel={tapar}
      onPointerLeave={tapar}
      onContextMenu={(e) => e.preventDefault()}
      className="flex w-full flex-1 touch-none flex-col select-none"
      style={{ WebkitTouchCallout: 'none' }}
    >
      <Marco
        tono={pulsando ? 'cian' : 'tenue'}
        intenso={pulsando}
        claseExterior="flex flex-1"
        className="flex flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-8 text-center">
          {pulsando ? (
            children
          ) : (
            <>
              <HuellaDedo />
              <span className="text-xl font-semibold tracking-[0.2em] text-cian uppercase">
                {T.reparto.manten}
              </span>
              <span className="text-base text-tenue">{ayuda}</span>
            </>
          )}
        </div>
      </Marco>

      <p className="mt-2 h-5 shrink-0 text-center text-xs tracking-widest text-tenue uppercase">
        {pulsando ? (onLeido ? T.reparto.sueltaYPasa : T.reparto.suelta) : ''}
      </p>
    </div>
  )
}

/** Marca de dedo: deja claro que hay que apoyar y aguantar, no tocar. */
function HuellaDedo() {
  return (
    <svg width="56" height="56" viewBox="0 0 48 48" aria-hidden className="late text-cian">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" opacity="0.9">
        <path d="M24 8 C31 8 36 13.5 36 21 v6" />
        <path d="M18 12 C20 9.5 22 8.5 24 8.5" />
        <path d="M30 15 C31.5 17 32 19 32 21 v10" />
        <path d="M20 16 C20 13.5 22 12 24 12 C26.5 12 28 14 28 16.5 v14" />
        <path d="M24 20 v12" />
        <path d="M16 20 C16 18 16.5 16.5 17.5 15" />
        <path d="M15.5 26 C15.5 23 16 22 16 22" />
      </g>
      <circle cx="24" cy="38" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  )
}
