import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'

/**
 * Ancho interno del dibujo. El alto se calcula con la forma real del hueco, así
 * que el lienzo lo llena entero sin franjas muertas y sin deformar el trazo.
 *
 * Se mide una sola vez: la partida entera se juega en el MISMO móvil, así que
 * todos los turnos salen con la misma forma y los PNG encajan entre sí.
 */
const ANCHO = 900
const PROPORCION_POR_DEFECTO = 4 / 3

/** Fondo oscuro y trazo claro: el móvil va de mano en mano de noche (§7). */
const FONDO = '#0b1024'
const TRAZO = '#eaf1ff'
const GROSOR = 7

export interface LienzoRef {
  /** El lienzo entero en PNG. Lo llama la cuenta atrás al llegar a cero. */
  capturar: () => string
}

/**
 * Lienzo de un turno del Relevo. Recibe el dibujo acumulado, deja añadir
 * encima, y devuelve el resultado para el siguiente.
 *
 * No hay capas ni deshacer a propósito: son veinte segundos con el dedo, y
 * cualquier control de más es un toque que roba tiempo de dibujar.
 */
export const Lienzo = forwardRef<LienzoRef, { inicial: string | null }>(function Lienzo(
  { inicial },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cajaRef = useRef<HTMLDivElement>(null)
  const pintando = useRef(false)
  const ultimo = useRef<{ x: number; y: number } | null>(null)
  const [alto, setAlto] = useState(Math.round(ANCHO * PROPORCION_POR_DEFECTO))

  useImperativeHandle(ref, () => ({
    capturar: () => canvasRef.current?.toDataURL('image/png') ?? '',
  }))

  // Antes de pintar nada: la resolución interna se ajusta a la forma del hueco.
  useLayoutEffect(() => {
    const caja = cajaRef.current?.getBoundingClientRect()
    if (!caja || caja.width === 0) return
    setAlto(Math.round(ANCHO * (caja.height / caja.width)))
  }, [])

  // Fondo y dibujo anterior. La imagen es asíncrona, así que el fondo se pinta
  // primero para que no se vea el lienzo en blanco ni un instante.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = FONDO
    ctx.fillRect(0, 0, ANCHO, alto)
    if (!inicial) return
    const img = new Image()
    // Se estira al tamaño actual: si el turno anterior se midió un pixel
    // distinto, encaja igual en vez de dejar un borde.
    img.onload = () => ctx.drawImage(img, 0, 0, ANCHO, alto)
    img.src = inicial
  }, [inicial, alto])

  /** Coordenadas del dedo en el sistema del canvas, no en el de la pantalla. */
  const punto = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const caja = e.currentTarget.getBoundingClientRect()
    return {
      x: ((e.clientX - caja.left) / caja.width) * ANCHO,
      y: ((e.clientY - caja.top) / caja.height) * alto,
    }
  }

  const empezar = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    pintando.current = true
    ultimo.current = punto(e)
    // Un toque sin arrastrar también deja marca: si no, tocar para poner un ojo
    // o un punto no pintaría nada y parecería que la app no responde.
    trazar(ultimo.current, ultimo.current)
  }

  const mover = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!pintando.current || !ultimo.current) return
    const actual = punto(e)
    trazar(ultimo.current, actual)
    ultimo.current = actual
  }

  const soltar = () => {
    pintando.current = false
    ultimo.current = null
  }

  const trazar = (desde: { x: number; y: number }, hasta: { x: number; y: number }) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = TRAZO
    ctx.lineWidth = GROSOR
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(desde.x, desde.y)
    ctx.lineTo(hasta.x, hasta.y)
    ctx.stroke()
  }

  return (
    <div ref={cajaRef} className="min-h-0 w-full flex-1">
      <canvas
        ref={canvasRef}
        width={ANCHO}
        height={alto}
        onPointerDown={empezar}
        onPointerMove={mover}
        onPointerUp={soltar}
        onPointerCancel={soltar}
        onContextMenu={(e) => e.preventDefault()}
        // `touch-none`: sin esto, arrastrar el dedo hace scroll de la página en
        // vez de dibujar.
        className="h-full w-full touch-none rounded-suave"
        style={{ WebkitTouchCallout: 'none' }}
      />
    </div>
  )
})
