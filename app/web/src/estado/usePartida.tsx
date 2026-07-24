import { createContext, useContext, useMemo } from 'react'
import { paletaDe } from '../juego/bichos'
import type { Accion, Estado } from './partida'

// El Provider vive en ProveedorPartida.tsx: un archivo con hooks NO puede
// exportar también un componente sin romper el Fast Refresh de Vite (regla
// react-refresh). Aquí quedan el contexto y los hooks; allí, el componente.
export const ContextoPartida = createContext<{
  estado: Estado
  despachar: (a: Accion) => void
} | null>(null)

export function usePartida() {
  const valor = useContext(ContextoPartida)
  if (!valor) throw new Error('usePartida se usa dentro de ProveedorPartida')
  return valor
}

/**
 * Tonos de los bichos de la mesa, ya separados entre sí. Se recalcula solo
 * cuando cambia quién juega.
 */
export function usePaleta(): Map<string, number> {
  const { estado } = usePartida()
  return useMemo(() => paletaDe(estado.jugadores), [estado.jugadores])
}

/** Atajo para buscar el nombre de un jugador por id. */
export function useNombres(): (id: string) => string {
  const { estado } = usePartida()
  return (id: string) => estado.jugadores.find((j) => j.id === id)?.nombre ?? '¿?'
}
