import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { usePartida } from '../estado/usePartida'
import type { Fase } from '../estado/partida'
import { T } from '../textos/es'

/** Cada cuánto se pregunta al servidor si hay versión nueva. */
const CADA = 60_000

/**
 * Fases en las que se puede recargar sin destrozar nada. La ronda en curso no
 * se guarda a propósito, así que recargar en mitad de un reparto o de una
 * votación perdería la partida: ahí solo avisamos y esperamos.
 */
const SEGURAS: Fase[] = ['inicio', 'jugadores', 'tutorial', 'marcador']

/**
 * Gestiona la actualización de la PWA. El fallo clásico es quedarse con una
 * versión vieja para siempre; aquí se comprueba al volver a la app y cada
 * minuto, y se aplica sola en cuanto estás en una pantalla donde no molesta.
 */
export function Actualizacion() {
  const { estado } = usePartida()
  const [activadaSinEsperar, setActivadaSinEsperar] = useState(false)

  const {
    needRefresh: [hayNueva],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registro) {
      if (!registro) return

      const comprobar = () => {
        registro.update().catch(() => {
          // Sin red: no pasa nada, se reintenta en la siguiente comprobación.
        })
      }

      // Cuando la pestaña NO está controlada por un service worker (pasa en la
      // primera visita, antes de la primera recarga), la versión nueva se
      // activa de golpe sin pasar por «esperando». Entonces `needRefresh` no
      // salta nunca y la página se queda ejecutando el código viejo: hay que
      // detectarlo aparte y recargar a mano.
      registro.addEventListener('updatefound', () => {
        const entrante = registro.installing
        if (!entrante) return
        entrante.addEventListener('statechange', () => {
          if (entrante.state === 'activated' && !navigator.serviceWorker.controller) {
            setActivadaSinEsperar(true)
          }
        })
      })

      // Al volver a la app desde segundo plano: este es el momento clave en
      // iOS, donde la app queda suspendida en vez de cerrarse.
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) comprobar()
      })
      window.addEventListener('focus', comprobar)
      window.setInterval(comprobar, CADA)
    },
  })

  const seguro = SEGURAS.includes(estado.fase)
  const pendiente = hayNueva || activadaSinEsperar

  useEffect(() => {
    if (!pendiente || !seguro) return
    // Con service worker en espera hay que decirle que tome el relevo; si ya se
    // activó solo, basta con recargar para soltar el código viejo. El `void` es
    // a propósito: activar el SW recarga la página sola, no hay nada que esperar.
    if (hayNueva) void updateServiceWorker(true)
    else window.location.reload()
  }, [pendiente, seguro, hayNueva, updateServiceWorker])

  // Si hay versión nueva pero estamos en mitad de una ronda, solo se avisa.
  if (!pendiente || seguro) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex justify-center p-2">
      <button
        onClick={() => (hayNueva ? updateServiceWorker(true) : window.location.reload())}
        className="rounded-full border border-cian bg-espacio-alto/95 px-4 py-2 text-sm text-cian shadow-lg backdrop-blur"
      >
        {T.actualizacion.disponible}
      </button>
    </div>
  )
}

/**
 * Pie de la portada: el sello de compilación (para saber qué versión lleva el
 * móvil) y la firma del negocio con enlace. El enlace externo abre en pestaña
 * nueva; la CSP no bloquea la navegación, solo la carga de recursos.
 */
export function Version() {
  return (
    <div className="mt-6 flex flex-col items-center gap-1">
      <p className="text-[0.65rem] tracking-[0.2em] text-tenue/50 uppercase">{__VERSION__}</p>
      <Firma />
    </div>
  )
}

/** Firma del negocio, reutilizable en la portada y en «Cómo se juega». */
export function Firma() {
  return (
    <p className="text-center text-xs text-tenue">
      {T.creditos.hechoPor}{' '}
      <a
        href={T.creditos.web}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cian underline underline-offset-2"
      >
        {T.creditos.negocio}
      </a>
    </p>
  )
}
