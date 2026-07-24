import { useEffect, useRef, useState } from 'react'
import { seAcaboElTiempo, tic } from '../juego/sonido'

/** Segundos finales en los que empieza a sonar el tic. */
const AVISO_DESDE = 5

interface Opciones {
  /** Cambiar este valor reinicia la cuenta (p. ej. al pasar de turno). */
  clave?: unknown
  /** Avisos sonoros. */
  sonido?: boolean
}

/**
 * Cuenta atrás. Con `total` a 0 se queda inactiva, que es como se representa
 * el «sin límite de tiempo» de las señales.
 *
 * En archivo propio, separado de los componentes de Temporizador.tsx: mezclar
 * un hook con componentes rompe el Fast Refresh de Vite (regla react-refresh).
 */
export function useCuentaAtras(total: number, { clave = null, sonido = false }: Opciones = {}) {
  const [restan, setRestan] = useState(total)
  const [corriendo, setCorriendo] = useState(total > 0)
  const finRef = useRef<number>(Date.now() + total * 1000)
  // Evita repetir el pitido varias veces dentro del mismo segundo.
  const ultimoAvisoRef = useRef<number>(-1)

  useEffect(() => {
    finRef.current = Date.now() + total * 1000
    ultimoAvisoRef.current = -1
    setRestan(total)
    setCorriendo(total > 0)
  }, [clave, total])

  useEffect(() => {
    if (!corriendo || total === 0) return

    const id = window.setInterval(() => {
      const quedan = Math.max(0, Math.round((finRef.current - Date.now()) / 1000))
      setRestan(quedan)

      if (sonido && quedan !== ultimoAvisoRef.current) {
        ultimoAvisoRef.current = quedan
        if (quedan === 0) seAcaboElTiempo()
        else if (quedan <= AVISO_DESDE) tic()
      }

      if (quedan === 0) setCorriendo(false)
    }, 250)

    return () => window.clearInterval(id)
  }, [corriendo, total, sonido])

  const alternar = () => {
    if (corriendo) {
      setCorriendo(false)
    } else if (restan > 0) {
      finRef.current = Date.now() + restan * 1000
      setCorriendo(true)
    }
  }

  return { restan, corriendo, alternar, activa: total > 0 }
}
