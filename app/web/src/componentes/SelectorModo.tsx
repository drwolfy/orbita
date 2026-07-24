import type { ReactNode } from 'react'
import { usePartida } from '../estado/usePartida'
import { HAY_PAREJAS, PAREJAS } from '../juego/parejas'
import { T } from '../textos/es'
import { Marco, type Tono } from './Marco'

/** Icono del modo Órbita: el centro y algo que orbita lejos. */
function IconoOrbita({ activo }: { activo: boolean }) {
  const c = activo ? 'var(--color-cian)' : 'var(--color-tenue)'
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="14" fill="none" stroke={c} strokeWidth="1" opacity="0.5" />
      <circle cx="20" cy="20" r="5" fill={c} />
      <circle cx="20" cy="6" r="3.2" fill={activo ? 'var(--color-magenta)' : c} />
    </svg>
  )
}

/** Icono del modo fotos: cuatro encuadres iguales… menos uno. */
function IconoFotos({ activo }: { activo: boolean }) {
  const c = activo ? 'var(--color-violeta)' : 'var(--color-tenue)'
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden>
      <rect x="6" y="6" width="12" height="12" rx="1.5" fill={c} opacity="0.85" />
      <rect x="22" y="6" width="12" height="12" rx="1.5" fill={c} opacity="0.85" />
      <rect x="6" y="22" width="12" height="12" rx="1.5" fill={c} opacity="0.85" />
      <rect
        x="22"
        y="22"
        width="12"
        height="12"
        rx="1.5"
        fill="none"
        stroke={activo ? 'var(--color-magenta)' : c}
        strokeWidth="1.4"
        strokeDasharray="2.5 2"
      />
    </svg>
  )
}

/** Icono del Relevo: un trazo que va pasando de mano en mano. */
function IconoRelevo({ activo }: { activo: boolean }) {
  const c = activo ? 'var(--color-cian-claro)' : 'var(--color-tenue)'
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden>
      <path
        d="M6 27 C12 27 12 15 18 15 C24 15 24 27 30 27"
        fill="none"
        stroke={c}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="27" r="3" fill={activo ? 'var(--color-magenta)' : c} />
    </svg>
  )
}

/** Icono del modo clásico: uno de los cuerpos no está. */
function IconoClasico({ activo }: { activo: boolean }) {
  const c = activo ? 'var(--color-magenta)' : 'var(--color-tenue)'
  return (
    <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden>
      <circle cx="12" cy="14" r="4" fill={c} />
      <circle cx="28" cy="14" r="4" fill={c} />
      <circle cx="12" cy="28" r="4" fill={c} />
      <circle cx="28" cy="28" r="4" fill="none" stroke={c} strokeWidth="1.2" strokeDasharray="2 2" />
    </svg>
  )
}

/**
 * Lo que ve la mesa son TRES modos; por debajo son dos ajustes (`modo` y
 * `catalogo`). Se juntan aquí a propósito:
 *
 * - Las fotos solo se reparten en Órbita, así que ofrecerlas como catálogo
 *   dentro del modo clásico era un interruptor que mentía: se quedaba marcado
 *   y luego repartía palabras igual.
 * - Enterradas en «Más opciones» no se jugarían nunca, que es justo lo que
 *   pasa con el selector de temas.
 */
type Eleccion = 'orbita' | 'fotos' | 'clasico' | 'relevo'

const TONO: Record<Eleccion, Tono> = {
  orbita: 'cian',
  fotos: 'violeta',
  clasico: 'magenta',
  relevo: 'cian',
}

const TEXTO: Record<Eleccion, string> = {
  orbita: 'text-cian',
  fotos: 'text-violeta',
  clasico: 'text-magenta',
  relevo: 'text-cian-claro',
}

export function SelectorModo() {
  const { estado, despachar } = usePartida()
  const { juego, modo, catalogo, relevoFrases } = estado.ajustes

  const eleccion: Eleccion =
    juego === 'relevo'
      ? 'relevo'
      : modo === 'clasico'
        ? 'clasico'
        : catalogo === 'palabras'
          ? 'orbita'
          : 'fotos'

  const elegir = (nueva: Eleccion) => {
    // Clásico no toca el catálogo: si vuelves a Fotos, sigue como lo dejaste.
    // El Relevo tampoco, para que salir y volver a Órbita lo deje todo igual.
    const parcial =
      nueva === 'relevo'
        ? { juego: 'relevo' as const }
        : nueva === 'clasico'
          ? { juego: 'orbita' as const, modo: 'clasico' as const }
          : nueva === 'orbita'
            ? { juego: 'orbita' as const, modo: 'orbita' as const, catalogo: 'palabras' as const }
            : { juego: 'orbita' as const, modo: 'orbita' as const, catalogo: 'imagenes' as const }
    despachar({ tipo: 'ajustes/cambiar', parcial })
  }

  const tarjetas: Array<{
    valor: Eleccion
    titulo: string
    ayuda: string
    icono: (activo: boolean) => ReactNode
  }> = [
    {
      valor: 'orbita',
      titulo: T.ajustes.modoOrbita,
      ayuda: T.modos.orbitaCorto,
      icono: (a) => <IconoOrbita activo={a} />,
    },
    // Sin tríos metidos, la tarjeta sería una promesa que la app no cumple.
    ...(HAY_PAREJAS
      ? [
          {
            valor: 'fotos' as const,
            titulo: T.ajustes.modoFotos,
            ayuda: T.modos.fotosCorto,
            icono: (a: boolean) => <IconoFotos activo={a} />,
          },
        ]
      : []),
    {
      valor: 'clasico',
      titulo: T.ajustes.modoClasico,
      ayuda: T.modos.clasicoCorto,
      icono: (a) => <IconoClasico activo={a} />,
    },
    {
      valor: 'relevo',
      titulo: T.relevo.nombre,
      ayuda: T.relevo.corto,
      icono: (a) => <IconoRelevo activo={a} />,
    },
  ]

  const activa = tarjetas.find((t) => t.valor === eleccion)

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        // Con 4 tarjetas (o 2) van a dos columnas; con 3, a tres.
        className={`grid w-full gap-2.5 ${tarjetas.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}
        role="radiogroup"
        aria-label={T.ajustes.modo}
      >
        {tarjetas.map((t) => {
          const activo = eleccion === t.valor
          return (
            <button
              key={t.valor}
              role="radio"
              aria-checked={activo}
              onClick={() => elegir(t.valor)}
              className="text-left transition active:scale-[0.985]"
            >
              <Marco tono={activo ? TONO[t.valor] : 'tenue'} intenso={activo}>
                <div className="flex min-h-[5.5rem] flex-col justify-between gap-2 px-3 py-3">
                  {t.icono(activo)}
                  {/* La ayuda de cada modo no cabe en tres columnas: solo va la
                      del modo elegido, debajo de la rejilla. */}
                  <span
                    className={`text-sm font-semibold tracking-[0.08em] uppercase ${
                      activo ? TEXTO[t.valor] : 'text-tenue'
                    }`}
                  >
                    {t.titulo}
                  </span>
                </div>
              </Marco>
            </button>
          )
        })}
      </div>

      {activa ? (
        <p className="text-center text-xs leading-snug text-tenue">{activa.ayuda}</p>
      ) : null}

      {eleccion === 'relevo' ? (
        <div className="aparece">
          <Alternador
            activo={relevoFrases}
            titulo={T.relevo.conFrases}
            ayuda={T.relevo.conFrasesAyuda}
            onClick={() =>
              despachar({ tipo: 'ajustes/cambiar', parcial: { relevoFrases: !relevoFrases } })
            }
          />
        </div>
      ) : null}

      {eleccion === 'fotos' ? (
        <div className="aparece flex flex-col gap-1.5">
          <Alternador
            activo={catalogo === 'mezcla'}
            titulo={T.ajustes.mezclar}
            ayuda={T.ajustes.mezclarAyuda}
            onClick={() =>
              despachar({
                tipo: 'ajustes/cambiar',
                parcial: { catalogo: catalogo === 'mezcla' ? 'imagenes' : 'mezcla' },
              })
            }
          />
          <p className="text-center text-xs text-tenue">
            {T.ajustes.catalogoCuantas(PAREJAS.length)}
          </p>
        </div>
      ) : null}
    </div>
  )
}

/** Interruptor de las variantes que cuelgan de una tarjeta. */
function Alternador({
  activo,
  titulo,
  ayuda,
  onClick,
}: {
  activo: boolean
  titulo: string
  ayuda: string
  onClick: () => void
}) {
  return (
    <button
      role="switch"
      aria-checked={activo}
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-suave border border-borde/70 px-4 py-3 text-left"
    >
      <span className="flex-1">
        <span className="block text-sm text-texto">{titulo}</span>
        <span className="mt-0.5 block text-xs text-tenue">{ayuda}</span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
          activo ? 'border-violeta bg-violeta/30' : 'border-borde bg-superficie'
        }`}
      >
        <span
          className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all ${
            activo ? 'left-6 bg-violeta' : 'left-0.5 bg-tenue'
          }`}
        />
      </span>
    </button>
  )
}
