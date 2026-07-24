import { barajar, elegir, elegirVarios } from './azar'
import { FAMILIAS } from './catalogo'
import frasesJson from '../datos/frases.json'
import type { Jugador } from './tipos'

/**
 * El Relevo: entre todos dibujan lo mismo, quince segundos cada uno, y el
 * último —que nunca ha visto las palabras— dice qué cree que es.
 *
 * No lleva puntuación a propósito. En esta mesa no se cuenta quién gana, así
 * que un veredicto de acertó/falló sería una pantalla de más y una discusión
 * («casi lo dijo») sin premio detrás. El remate es destapar las palabras.
 */

export interface TurnoRelevo {
  jugadorId: string
  /** El lienzo COMPLETO tras este turno, no solo lo que añadió. */
  png: string
}

export interface Relevo {
  /**
   * Lo que hay que dibujar, por piezas. Las ven todos menos el último.
   * En modo frase son sujeto + acción + lugar; si no, palabras sueltas.
   */
  palabras: string[]
  /** Si las piezas forman una frase, se enseñan seguidas y no como etiquetas. */
  esFrase: boolean
  /** Ids en el orden en que circula el móvil. El último de la lista adivina. */
  orden: string[]
  /** Índice del turno en curso dentro de `orden`. */
  turno: number
  /** Un lienzo guardado por turno, para poder ver crecer el dibujo al final. */
  turnos: TurnoRelevo[]
}

/**
 * Una palabra por cada dos que dibujan: con una sola, el primero la dibuja
 * entera y los demás se quedan mirando. Con más de cuatro no da tiempo a
 * meterlas todas.
 */
export function cuantasPalabras(dibujantes: number): number {
  return Math.min(4, Math.max(2, Math.ceil(dibujantes / 2)))
}

/**
 * Las que se pueden dibujar. Fuera los `abstractos`: «libertad» o «costumbre»
 * no hay quien las dibuje en quince segundos. Fuera también los tríos de
 * imagen, que no son palabras.
 */
export function palabrasDibujables() {
  return FAMILIAS.filter((f) => f.tipo !== 'imagen' && f.categoria !== 'abstractos')
}

/**
 * Las frases se montan por piezas en vez de escribirse enteras: 15.000
 * combinaciones con 75 palabras de curación, y las absurdas —que son las
 * buenas— salen gratis. Ver `datos/frases.json` para las dos reglas que hacen
 * que casi ninguna combinación salga muerta.
 */
export function nuevaFrase(): string[] {
  return [
    elegir(frasesJson.sujetos),
    elegir(frasesJson.acciones),
    elegir(frasesJson.lugares),
  ]
}

/**
 * Empieza por alguien al azar, así que el que adivina cambia en cada ronda sin
 * tener que llevar la cuenta de a quién le tocó.
 */
export function nuevoRelevo(jugadores: Jugador[], conFrases = false): Relevo {
  const orden = barajar(jugadores).map((j) => j.id)
  const dibujantes = Math.max(1, orden.length - 1)
  const palabras = conFrases
    ? nuevaFrase()
    : elegirVarios(palabrasDibujables(), cuantasPalabras(dibujantes)).map((f) => f.astro)
  return { palabras, esFrase: conFrases, orden, turno: 0, turnos: [] }
}

/** ¿A quién le toca ahora? */
export function jugadorDelTurno(relevo: Relevo): string | undefined {
  return relevo.orden[relevo.turno]
}

/** El último de la vuelta: es el que no ve las palabras y tiene que acertarlas. */
export function adivinadorDe(relevo: Relevo): string | undefined {
  return relevo.orden[relevo.orden.length - 1]
}

/** ¿Ya han dibujado todos los que dibujan? */
export function tocaAdivinar(relevo: Relevo): boolean {
  return relevo.turno >= relevo.orden.length - 1
}

/** El dibujo tal y como va. `null` cuando todavía está en blanco. */
export function lienzoActual(relevo: Relevo): string | null {
  return relevo.turnos[relevo.turnos.length - 1]?.png ?? null
}
