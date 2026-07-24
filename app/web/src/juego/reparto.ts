import { barajar, elegir, elegirVarios } from './azar'
import { asignarManiobras } from './maniobras'
import type { Ajustes, Asignacion, Familia, Jugador, PlantillaManiobra, Ronda } from './tipos'

export const MIN_JUGADORES = 4
export const MAX_JUGADORES = 10

/**
 * Por defecto: 1 desviado hasta 6 jugadores, 2 a partir de 7 (§2.1).
 * Siempre dejamos al menos 3 en el centro; si no, no hay consenso contra el
 * que contrastar y la ronda deja de tener deducción.
 */
export function numeroDesviados(ajustes: Ajustes, total: number): number {
  if (ajustes.modo === 'clasico') return 1
  const deseado = ajustes.satelites === 'auto' ? (total >= 7 ? 2 : 1) : ajustes.satelites
  return Math.max(1, Math.min(deseado, total - 3))
}

interface Catalogo {
  plantillas: PlantillaManiobra[]
  palabras: string[]
}

export function repartir(
  jugadores: Jugador[],
  familias: Familia[],
  ajustes: Ajustes,
  catalogo: Catalogo,
  /** Ids de familias de rondas recientes, para no repetir palabra enseguida. */
  evitar: string[] = [],
): Ronda {
  const disponibles = familias.filter((f) => !evitar.includes(f.id))
  const familia = elegir(disponibles.length > 0 ? disponibles : familias)

  const cuantos = numeroDesviados(ajustes, jugadores.length)
  const desviados = new Set(elegirVarios(jugadores, cuantos).map((j) => j.id))

  const maniobras = asignarManiobras(jugadores, catalogo, ajustes)

  // Los satélites reciben palabras DISTINTAS entre sí cuando la banda da para
  // ello: si compartieran palabra se reconocerían al oírse, y la gracia del
  // juego es que nadie sepa si el raro es él.
  const vecinas = barajar(familia.bandas['1'])
  let siguienteVecina = 0

  const asignaciones: Asignacion[] = jugadores.map((jugador) => {
    const esDesviado = desviados.has(jugador.id)
    const maniobra = maniobras.get(jugador.id) ?? null

    if (!esDesviado) {
      return {
        jugadorId: jugador.id,
        palabra: familia.astro,
        pista: null,
        rol: ajustes.modo === 'clasico' ? 'ciudadano' : 'nucleo',
        maniobra,
      }
    }

    if (ajustes.modo === 'clasico') {
      return {
        jugadorId: jugador.id,
        palabra: null,
        pista: ajustes.pistaImpostor === 'pista' ? familia.pista : null,
        rol: 'impostor',
        maniobra,
      }
    }

    const vecina = vecinas[siguienteVecina % vecinas.length] ?? familia.astro
    siguienteVecina += 1
    return {
      jugadorId: jugador.id,
      palabra: vecina,
      pista: null,
      rol: 'satelite',
      maniobra,
    }
  })

  const publica = [...maniobras.values()].find((m) => m.publica)

  return {
    familia,
    asignaciones,
    orden: barajar(jugadores).map((j) => j.id),
    maniobraPublica: publica ? publica.texto : null,
  }
}
