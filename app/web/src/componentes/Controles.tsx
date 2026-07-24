import type { ReactNode } from 'react'
import { Panel } from './Pantalla'

export function Grupo({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="mb-5">
      <h2 className="mb-2 text-xs tracking-[0.24em] text-tenue uppercase">{titulo}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  )
}

export function Opcion({
  activa,
  titulo,
  ayuda,
  onClick,
}: {
  activa: boolean
  titulo: string
  ayuda?: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="text-left" aria-pressed={activa}>
      <Panel className={`transition ${activa ? 'border-cian/70 bg-cian/10' : 'border-borde/70'}`}>
        <div className="flex items-center gap-3">
          <span
            className={`h-3 w-3 shrink-0 rounded-full border ${activa ? 'border-cian bg-cian' : 'border-tenue'}`}
          />
          <span className="flex-1">
            <span className={`block ${activa ? 'text-texto' : 'text-tenue'}`}>{titulo}</span>
            {ayuda ? <span className="mt-0.5 block text-xs text-tenue">{ayuda}</span> : null}
          </span>
        </div>
      </Panel>
    </button>
  )
}

export function Interruptor({
  activo,
  titulo,
  ayuda,
  onClick,
}: {
  activo: boolean
  titulo: string
  ayuda?: string
  onClick: () => void
}) {
  return (
    <button onClick={onClick} className="text-left" role="switch" aria-checked={activo}>
      <Panel>
        <div className="flex items-center gap-3">
          <span className="flex-1">
            <span className="block text-texto">{titulo}</span>
            {ayuda ? <span className="mt-0.5 block text-xs text-tenue">{ayuda}</span> : null}
          </span>
          <span
            className={`relative h-7 w-12 shrink-0 rounded-full border transition ${activo ? 'border-cian bg-cian/30' : 'border-borde bg-superficie'}`}
          >
            <span
              className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all ${activo ? 'left-6 bg-cian' : 'left-0.5 bg-tenue'}`}
            />
          </span>
        </div>
      </Panel>
    </button>
  )
}
