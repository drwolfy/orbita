import type { ReactNode } from 'react'

/** Marco común: columna vertical, ancho de móvil, respetando notch y gestos. */
export function Pantalla({
  titulo,
  children,
  pie,
}: {
  titulo?: string
  children: ReactNode
  pie?: ReactNode
}) {
  return (
    <div className="zona-segura mx-auto flex min-h-[100svh] w-full max-w-md flex-col">
      {titulo ? (
        <h1 className="mb-4 text-center text-sm tracking-[0.34em] text-tenue uppercase">
          {titulo}
        </h1>
      ) : null}
      {/* `flex flex-col` para que los hijos puedan estirarse y centrarse: sin
          esto, un `h-full` interior no tiene contra qué resolverse y todo se
          pega arriba. */}
      <div className="aparece flex flex-1 flex-col">{children}</div>
      {pie ? <div className="mt-6 flex flex-col gap-3">{pie}</div> : null}
    </div>
  )
}

/** Bloque de contenido sobre superficie translúcida. */
export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-suave border border-borde/70 bg-superficie/45 p-4 backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  )
}
