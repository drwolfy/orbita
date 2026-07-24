// El hook useCuentaAtras vive en useCuentaAtras.ts; aquí solo los dos
// componentes que pintan el tiempo, para no mezclar hook y componente en el
// mismo archivo (rompería el Fast Refresh de Vite).

/** Últimos segundos: la barra pasa a magenta para avisar. */
const AVISO_DESDE = 5

export function AnilloTiempo({ restan, total }: { restan: number; total: number }) {
  const radio = 88
  const perimetro = 2 * Math.PI * radio
  const proporcion = total > 0 ? restan / total : 0
  const apurando = restan <= 10

  const minutos = Math.floor(restan / 60)
  const segundos = restan % 60

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[16rem]">
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={radio} fill="none" stroke="var(--color-borde)" strokeWidth="3" />
        <circle
          cx="100"
          cy="100"
          r={radio}
          fill="none"
          stroke={apurando ? 'var(--color-magenta)' : 'var(--color-cian)'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={perimetro}
          strokeDashoffset={perimetro * (1 - proporcion)}
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-5xl font-light tabular-nums ${apurando ? 'text-magenta' : 'text-texto'}`}
        >
          {minutos}:{segundos.toString().padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

/** Barra fina de tiempo, para el turno de cada señal. */
export function BarraTiempo({ restan, total }: { restan: number; total: number }) {
  const proporcion = total > 0 ? restan / total : 0
  const apurando = restan <= AVISO_DESDE

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-borde/60">
        <div
          className={`h-full rounded-full ${apurando ? 'bg-magenta' : 'bg-cian'}`}
          style={{ width: `${proporcion * 100}%`, transition: 'width 0.3s linear' }}
        />
      </div>
      <span
        className={`w-10 text-right text-sm tabular-nums ${apurando ? 'text-magenta' : 'text-tenue'}`}
      >
        {restan}s
      </span>
    </div>
  )
}
