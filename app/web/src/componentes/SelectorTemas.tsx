import { usePartida } from '../estado/usePartida'
import { FAMILIAS, TEMAS, familiasDeTemas } from '../juego/catalogo'
import { T } from '../textos/es'

/** Por debajo de esto las palabras se repiten demasiado pronto. */
const POCAS = 12

/**
 * Elegir de qué van las palabras. Sin nada marcado entran los trece temas, que
 * es el modo aleatorio y el que viene puesto de fábrica.
 */
export function SelectorTemas() {
  const { estado, despachar } = usePartida()
  const elegidos = estado.ajustes.temas
  const todos = elegidos.length === 0

  const alternar = (tema: string) => {
    const temas = elegidos.includes(tema)
      ? elegidos.filter((t) => t !== tema)
      : [...elegidos, tema]
    despachar({ tipo: 'ajustes/cambiar', parcial: { temas } })
  }

  const disponibles = familiasDeTemas(elegidos).length
  const pocas = !todos && disponibles < POCAS

  return (
    <div className="flex flex-col gap-3">
      <button onClick={() => despachar({ tipo: 'ajustes/cambiar', parcial: { temas: [] } })}>
        <div
          className={`rounded-suave border px-4 py-3 text-left transition ${
            todos ? 'border-cian/70 bg-cian/10' : 'border-borde/70'
          }`}
        >
          <span className={`block ${todos ? 'text-texto' : 'text-tenue'}`}>{T.temas.todos}</span>
          <span className="mt-0.5 block text-xs text-tenue">
            {T.temas.todosAyuda(FAMILIAS.length)}
          </span>
        </div>
      </button>

      <div className="flex flex-wrap gap-2">
        {TEMAS.map((tema) => {
          const activo = elegidos.includes(tema.nombre)
          return (
            <button
              key={tema.nombre}
              onClick={() => alternar(tema.nombre)}
              aria-pressed={activo}
              className={`rounded-full border px-3.5 py-2 text-sm transition ${
                activo
                  ? 'border-cian bg-cian/15 text-cian'
                  : 'border-borde text-tenue active:text-texto'
              }`}
            >
              {tema.nombre}
              <span className="ml-1.5 text-xs opacity-60 tabular-nums">{tema.cuantas}</span>
            </button>
          )
        })}
      </div>

      {!todos ? (
        <p className={`text-xs ${pocas ? 'text-magenta' : 'text-tenue'}`}>
          {T.temas.elegidos(elegidos.length, disponibles)}
          {pocas ? ` · ${T.temas.pocasAviso}` : ''}
        </p>
      ) : null}
    </div>
  )
}
