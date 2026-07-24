/**
 * Aspecto de los bichos de los jugadores. Lógica pura, sin React: la usan tanto
 * el componente Avatar como el estado de la partida, y tenerla aquí evita que
 * esos dos módulos se importen en círculo.
 */

/** Hash pequeño y estable (djb2). No necesita ser criptográfico, solo repetible. */
function hash(texto: string): number {
  let h = 5381
  for (let i = 0; i < texto.length; i++) {
    h = ((h << 5) + h + texto.charCodeAt(i)) >>> 0
  }
  return h
}

interface Rasgos {
  tono: number
  ojos: 1 | 2 | 3
  antenas: 0 | 1 | 2
  boca: 0 | 1 | 2 | 3
  cuerpo: 0 | 1 | 2
}

export function rasgosDe(nombre: string): Rasgos {
  const h = hash(nombre.trim().toLowerCase())
  return {
    tono: h % 360,
    ojos: (((h >> 13) % 3) + 1) as 1 | 2 | 3,
    antenas: ((h >> 16) % 3) as 0 | 1 | 2,
    boca: ((h >> 18) % 4) as 0 | 1 | 2 | 3,
    cuerpo: ((h >> 21) % 3) as 0 | 1 | 2,
  }
}

/** Dos tonos separados por menos de esto se confunden de un vistazo. */
const SEPARACION_MINIMA = 40

/**
 * Reparte los tonos de la mesa evitando que dos bichos se parezcan: el hash del
 * nombre puede mandar a Ana y a Bruno al mismo verde, y entonces te equivocas al
 * votar.
 *
 * El reparto recorre la mesa por orden alfabético, NO por orden de asiento ni
 * por id. Alfabético es lo único estable: el asiento cambia cuando reordenas y
 * el id es un UUID distinto en cada móvil, así que con cualquiera de los dos la
 * misma peña tendría colores diferentes cada noche.
 */
export function paletaDe(nombres: Array<{ id: string; nombre: string }>): Map<string, number> {
  const paleta = new Map<string, number>()
  const usados: number[] = []

  const distancia = (a: number, b: number) => {
    const d = Math.abs(a - b) % 360
    return d > 180 ? 360 - d : d
  }

  const alfabetico = (a: { nombre: string }, b: { nombre: string }) =>
    a.nombre.localeCompare(b.nombre, 'es')

  for (const jugador of [...nombres].sort(alfabetico)) {
    let tono = rasgosDe(jugador.nombre).tono
    // Desplazamiento por el ángulo áureo: recorre el círculo sin volver atrás.
    for (let intento = 0; intento < 12; intento++) {
      if (usados.every((u) => distancia(u, tono) >= SEPARACION_MINIMA)) break
      tono = (tono + 137) % 360
    }
    usados.push(tono)
    paleta.set(jugador.nombre, tono)
  }

  return paleta
}
