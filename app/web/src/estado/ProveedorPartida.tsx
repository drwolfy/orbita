import { useEffect, useReducer, type ReactNode } from 'react'
import { cargar, guardar } from './almacenamiento'
import { ContextoPartida } from './usePartida'
import { ESTADO_INICIAL, reducir, type Estado } from './partida'

/**
 * Envuelve la app y guarda la partida en cada cambio. Separado de los hooks
 * (usePartida.tsx) porque un archivo con Fast Refresh no puede mezclar un
 * componente con hooks exportados.
 */
function inicializar(): Estado {
  const guardado = cargar()
  return {
    ...ESTADO_INICIAL,
    jugadores: guardado.jugadores,
    ajustes: guardado.ajustes,
    marcador: guardado.marcador,
    historialFamilias: guardado.historialFamilias,
    album: guardado.album,
  }
}

export function ProveedorPartida({ children }: { children: ReactNode }) {
  const [estado, despachar] = useReducer(reducir, undefined, inicializar)

  useEffect(() => {
    guardar({
      jugadores: estado.jugadores,
      ajustes: estado.ajustes,
      marcador: estado.marcador,
      historialFamilias: estado.historialFamilias,
      album: estado.album,
    })
  }, [
    estado.jugadores,
    estado.ajustes,
    estado.marcador,
    estado.historialFamilias,
    estado.album,
  ])

  return <ContextoPartida.Provider value={{ estado, despachar }}>{children}</ContextoPartida.Provider>
}
