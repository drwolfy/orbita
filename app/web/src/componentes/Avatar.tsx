import type { ReactNode } from 'react'
import { usePaleta } from '../estado/usePartida'
import { rasgosDe } from '../juego/bichos'

/**
 * Cada jugador es un bicho, deducido de su nombre: nada que guardar ni que
 * elegir a mano, y sale igual en cualquier móvil. Si dos nombres caen en tonos
 * parecidos, el reparto de la mesa (paletaDe) los separa para que no te
 * equivoques al votar.
 */
export function Avatar({ nombre, tam = 40 }: { nombre: string; tam?: number }) {
  const rasgos = rasgosDe(nombre)
  const tono = usePaleta().get(nombre) ?? rasgos.tono
  const { ojos, antenas, boca, cuerpo } = rasgos

  const claro = `hsl(${tono} 85% 68%)`
  const medio = `hsl(${tono} 70% 48%)`
  const id = `cr-${tono}-${cuerpo}`

  // Tres siluetas: gota, cuadrada y ancha. Cambian bastante la lectura.
  const silueta =
    cuerpo === 0
      ? 'M24 8 C34 8 39 17 39 26 C39 35 32 41 24 41 C16 41 9 35 9 26 C9 17 14 8 24 8 Z'
      : cuerpo === 1
        ? 'M12 12 Q12 8 16 8 L32 8 Q36 8 36 12 L36 34 Q36 41 28 41 L20 41 Q12 41 12 34 Z'
        : 'M24 9 C36 9 42 18 42 27 C42 36 34 41 24 41 C14 41 6 36 6 27 C6 18 12 9 24 9 Z'

  const posOjos: Array<[number, number]> =
    ojos === 1
      ? [[24, 24]]
      : ojos === 2
        ? [
            [18, 23],
            [30, 23],
          ]
        : [
            [17, 22],
            [24, 26],
            [31, 22],
          ]
  const radioOjo = ojos === 3 ? 3.6 : 4.6

  return (
    <Lienzo tam={tam}>
      <defs>
        <radialGradient id={`${id}-piel`} cx="35%" cy="25%">
          <stop offset="0%" stopColor={claro} />
          <stop offset="100%" stopColor={medio} />
        </radialGradient>
      </defs>

      {/* Antenas, por detrás del cuerpo. */}
      {antenas > 0 ? (
        <g stroke={medio} strokeWidth="1.6" strokeLinecap="round" fill={claro}>
          <path d="M18 11 L14 4" />
          <circle cx="14" cy="3" r="2.4" stroke="none" />
          {antenas === 2 ? (
            <>
              <path d="M30 11 L34 4" />
              <circle cx="34" cy="3" r="2.4" stroke="none" />
            </>
          ) : null}
        </g>
      ) : null}

      <path d={silueta} fill={`url(#${id}-piel)`} />

      {/* Ojos: blanco, pupila oscura y un brillo. */}
      {posOjos.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={radioOjo} fill="#f8fbff" />
          <circle cx={x} cy={y + 0.5} r={radioOjo * 0.5} fill="#10142a" />
          <circle cx={x - 1.2} cy={y - 1.2} r={radioOjo * 0.2} fill="#fff" />
        </g>
      ))}

      {/* Cuatro bocas: sonrisa, «o», línea y colmillos. */}
      <g stroke="#10142a" strokeWidth="1.5" strokeLinecap="round" fill="none">
        {boca === 0 ? <path d="M19 32 Q24 36 29 32" /> : null}
        {boca === 1 ? (
          <ellipse cx="24" cy="33" rx="3" ry="3.4" fill="#10142a" stroke="none" />
        ) : null}
        {boca === 2 ? <path d="M19 33 L29 33" /> : null}
        {boca === 3 ? (
          <>
            <path d="M19 32 Q24 35 29 32" />
            <path d="M21 33 L22 35.5 L23 33" fill="#f8fbff" stroke="none" />
            <path d="M25 33 L26 35.5 L27 33" fill="#f8fbff" stroke="none" />
          </>
        ) : null}
      </g>
    </Lienzo>
  )
}

function Lienzo({ tam, children }: { tam: number; children: ReactNode }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 48 48" aria-hidden className="shrink-0">
      {children}
    </svg>
  )
}
