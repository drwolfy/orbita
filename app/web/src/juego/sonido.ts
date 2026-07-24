/**
 * Avisos sonoros sintetizados con WebAudio. Nada de archivos de audio: la PWA
 * tiene que funcionar offline y pesar poco, y unos pitidos no merecen medio
 * megabyte de mp3.
 */

let contexto: AudioContext | null = null

type ConstructorAudio = new () => AudioContext

/**
 * iOS no deja sonar nada hasta que el usuario toca la pantalla, así que esto
 * hay que llamarlo desde un gesto real (ver App.tsx). Llamarlo de más no pasa
 * nada: si ya está en marcha, no hace nada.
 */
export function prepararSonido(): void {
  if (typeof window === 'undefined') return
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: ConstructorAudio }).webkitAudioContext
  if (!Ctor) return

  if (!contexto) contexto = new Ctor()
  if (contexto.state === 'suspended') void contexto.resume()
}

interface Pitido {
  frecuencia?: number
  duracion?: number
  volumen?: number
}

function pitido({ frecuencia = 880, duracion = 0.12, volumen = 0.18 }: Pitido = {}): void {
  if (!contexto || contexto.state !== 'running') return

  const osc = contexto.createOscillator()
  const ganancia = contexto.createGain()
  const ahora = contexto.currentTime

  osc.type = 'sine'
  osc.frequency.value = frecuencia

  // Ataque corto y caída exponencial: suena a aviso, no a alarma de hospital.
  ganancia.gain.setValueAtTime(0.0001, ahora)
  ganancia.gain.linearRampToValueAtTime(volumen, ahora + 0.012)
  ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + duracion)

  osc.connect(ganancia)
  ganancia.connect(contexto.destination)
  osc.start(ahora)
  osc.stop(ahora + duracion + 0.03)
}

/** Tic de la cuenta atrás, en los últimos segundos. */
export function tic(): void {
  pitido({ frecuencia: 660, duracion: 0.08, volumen: 0.14 })
}

/** Se acabó: dos tonos descendentes, inconfundible. */
export function seAcaboElTiempo(): void {
  pitido({ frecuencia: 880, duracion: 0.16, volumen: 0.22 })
  window.setTimeout(() => pitido({ frecuencia: 440, duracion: 0.4, volumen: 0.22 }), 180)
}

/** Cambio de turno en las señales. */
export function cambioDeTurno(): void {
  pitido({ frecuencia: 520, duracion: 0.09, volumen: 0.13 })
}
