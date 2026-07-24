import type { ButtonHTMLAttributes, ReactNode } from 'react'

export type Tono = 'cian' | 'magenta' | 'violeta' | 'tenue' | 'alerta'

const COLOR: Record<Tono, string> = {
  cian: 'var(--color-cian)',
  magenta: 'var(--color-magenta)',
  violeta: 'var(--color-violeta)',
  tenue: 'var(--color-borde)',
  alerta: 'var(--color-alerta)',
}

/** El trazo de «tenue» es demasiado oscuro para leerse: el rótulo va en blanco. */
const COLOR_ROTULO: Record<Tono, string> = {
  ...COLOR,
  tenue: 'var(--color-texto)',
}

/**
 * Esquinas recortadas en diagonal. El truco de las dos capas (una del color
 * del trazo, otra oscura 1px por dentro, ambas con el mismo clip-path) es lo
 * que da borde también en la diagonal: un `border` normal ahí se recorta.
 */
const CORTE = '0.9rem'
const RECORTE = `polygon(${CORTE} 0, 100% 0, 100% calc(100% - ${CORTE}), calc(100% - ${CORTE}) 100%, 0 100%, 0 ${CORTE})`

export function Marco({
  tono = 'cian',
  intenso = false,
  className = '',
  claseExterior = '',
  children,
}: {
  tono?: Tono
  intenso?: boolean
  className?: string
  /** Para que el marco pueda estirarse dentro de un contenedor flexible. */
  claseExterior?: string
  children: ReactNode
}) {
  const color = COLOR[tono]
  return (
    <div
      className={`relative ${claseExterior}`}
      style={{
        clipPath: RECORTE,
        background: color,
        boxShadow: intenso ? `0 0 22px -4px ${color}` : `0 0 14px -6px ${color}`,
      }}
    >
      <div
        className={`relative ${className}`}
        style={{
          clipPath: RECORTE,
          margin: '1px',
          background: intenso
            ? `linear-gradient(150deg, color-mix(in srgb, ${color} 22%, var(--color-espacio-alto)), var(--color-espacio-alto))`
            : 'color-mix(in srgb, var(--color-espacio-alto) 88%, transparent)',
        }}
      >
        {children}
      </div>
    </div>
  )
}

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tono?: Tono
  intenso?: boolean
  icono?: ReactNode
  /** Línea pequeña bajo el rótulo. */
  nota?: string
  /** Para botones que van en rejilla de dos columnas. */
  pequeno?: boolean
}

/**
 * Botón grande: el móvil va de mano en mano y se usa con una sola mano, así
 * que las áreas táctiles son generosas a propósito (§7).
 */
export function Boton({
  tono = 'cian',
  intenso = false,
  icono,
  nota,
  pequeno = false,
  children,
  className = '',
  ...resto
}: BotonProps) {
  const color = COLOR[tono]
  return (
    <button
      {...resto}
      className={`group w-full text-left transition active:scale-[0.985] disabled:opacity-40 ${className}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Marco tono={tono} intenso={intenso}>
        <div
          className={`flex items-center gap-4 px-5 ${pequeno ? 'min-h-[3.5rem] py-3' : 'min-h-[4.25rem] py-4'}`}
        >
          {icono ? (
            <span className="shrink-0 opacity-90" style={{ color }}>
              {icono}
            </span>
          ) : null}
          <span className="flex-1">
            <span
              className={`block font-semibold uppercase ${pequeno ? 'text-base tracking-[0.1em]' : 'text-xl tracking-[0.14em]'}`}
              style={{ color: resto.disabled ? 'var(--color-tenue)' : COLOR_ROTULO[tono] }}
            >
              {children}
            </span>
            {nota ? <span className="mt-0.5 block text-sm text-tenue normal-case">{nota}</span> : null}
          </span>
        </div>
      </Marco>
    </button>
  )
}

/** Botón secundario, discreto, sin marco. */
export function BotonPlano({
  children,
  className = '',
  ...resto
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...resto}
      className={`px-4 py-3 text-sm tracking-[0.12em] text-tenue uppercase transition active:text-texto disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  )
}
