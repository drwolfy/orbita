import { z } from 'zod'
import type { Ajustes, Jugador, Marcador } from '../juego/tipos'

const CLAVE = 'orbita.v1'

/**
 * Versión de los ajustes guardados. Se sube cuando cambia un valor por defecto
 * y queremos que el cambio llegue también a quien ya tenía partidas guardadas
 * (ver `migrar`). No borra jugadores, marcador ni historial.
 */
const VERSION = 6

export const AJUSTES_POR_DEFECTO: Ajustes = {
  juego: 'orbita',
  modo: 'orbita',
  pistaImpostor: 'nada',
  satelites: 'auto',
  // Apagadas por defecto: son una variante, y su verificación a mano al cerrar
  // la ronda es justo lo que corta el ritmo entre partidas.
  maniobrasActivas: false,
  maniobrasEnfrentadas: false,
  maniobraPublica: false,
  segundosDebate: 90,
  segundosSenal: 0,
  // Con el dedo en un móvil, quince segundos dan para poco: se empieza en
  // veinte y se ajusta jugando.
  segundosTrazo: 20,
  relevoFrases: false,
  sonido: true,
  temas: [],
  // Palabras de fábrica: el modo imágenes se elige a propósito, porque no es
  // la misma partida y conviene saber a qué te sientas.
  catalogo: 'palabras',
  // Se vota a mano alzada y alguien toca al señalado: una pantalla en vez de
  // dar la vuelta a la mesa otra vez.
  metodoVotacion: 'directa',
}

export const MARCADOR_VACIO: Marcador = { ronda: {}, maniobra: {} }

export interface Guardado {
  version: number
  jugadores: Jugador[]
  ajustes: Ajustes
  marcador: Marcador
  /** Ids de las familias ya jugadas, de la más reciente a la más antigua. */
  historialFamilias: string[]
  /** Tríos de imagen de la noche en curso, para los créditos del final. */
  album: string[]
}

const VACIO: Guardado = {
  version: VERSION,
  jugadores: [],
  ajustes: AJUSTES_POR_DEFECTO,
  marcador: MARCADOR_VACIO,
  historialFamilias: [],
  album: [],
}

/**
 * El borde de la app: lo que sale del `localStorage` es un dato externo y no me
 * fío de él (guía typescript.md). En vez de `as Partial<Guardado>`, se valida
 * con zod, y cada campo cae a su valor por defecto si viene corrupto en lugar
 * de romper el arranque.
 *
 * `ajustes` se valida solo como objeto: sus valores se mezclan con
 * AJUSTES_POR_DEFECTO y pasan por `migrar`, que ya tolera valores viejos, así
 * que un ajuste desconocido no rompe nada. Lo que sí se valida estricto es lo
 * que se PINTA —jugadores y marcador—, que es donde un dato basura reventaría
 * la interfaz (un nombre que no es texto, un punto que no es número).
 */
const jugadorSchema = z.object({ id: z.string(), nombre: z.string() })
const puntosSchema = z.record(z.string(), z.number()).catch({})

const guardadoSchema = z.object({
  version: z.number().catch(1),
  jugadores: z.array(jugadorSchema).catch([]),
  ajustes: z.record(z.string(), z.unknown()).catch({}),
  marcador: z
    .object({ ronda: puntosSchema, maniobra: puntosSchema })
    .catch({ ronda: {}, maniobra: {} }),
  historialFamilias: z.array(z.string()).catch([]),
  album: z.array(z.string()).catch([]),
})

/**
 * La v2 acorta la ronda: votación de un toque y maniobras apagadas. Quien venía
 * de la v1 tiene guardados los valores viejos, así que se los reescribimos una
 * sola vez; a partir de ahí, lo que elija en ajustes manda.
 */
function migrar(ajustes: Ajustes, versionGuardada: number): Ajustes {
  let migrados = ajustes

  if (versionGuardada < 2) {
    migrados = {
      ...migrados,
      metodoVotacion: AJUSTES_POR_DEFECTO.metodoVotacion,
      maniobrasActivas: AJUSTES_POR_DEFECTO.maniobrasActivas,
    }
  }

  // La v3 cambia la pista del impostor: la categoría («animales») se sustituye
  // por una palabra asociada («correa»). Quien tuviera la categoría activada
  // quería ayuda, así que se queda con la pista nueva en vez de con nada.
  if ((migrados.pistaImpostor as string) === 'categoria') {
    migrados = { ...migrados, pistaImpostor: 'pista' }
  }

  return migrados
}

/**
 * Persistimos jugadores, ajustes, marcador (§4) e historial de palabras: si el
 * martes salió «naranja», no debería volver a salir el jueves. La ronda en
 * curso no se guarda a propósito: si se recarga el móvil a mitad de reparto, es
 * preferible repartir de nuevo antes que arriesgarse a enseñar una palabra a
 * quien no toca.
 */
export function cargar(): Guardado {
  try {
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return VACIO
    // safeParse + catch por campo: un JSON con forma rara no lanza, cae a VACIO.
    const parseado = guardadoSchema.safeParse(JSON.parse(crudo))
    if (!parseado.success) return VACIO
    const datos = parseado.data
    return {
      version: VERSION,
      jugadores: datos.jugadores,
      ajustes: migrar({ ...AJUSTES_POR_DEFECTO, ...datos.ajustes }, datos.version),
      marcador: datos.marcador,
      historialFamilias: datos.historialFamilias,
      album: datos.album,
    }
  } catch {
    // Modo privado de Safari o datos corruptos: se juega igual, sin memoria.
    return VACIO
  }
}

export function guardar(datos: Omit<Guardado, 'version'>): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ ...datos, version: VERSION }))
  } catch {
    // Sin espacio o sin permiso: no es motivo para romper la partida.
  }
}
