import { CATALOGO_MANIOBRAS, familiasEnJuego } from '../juego/catalogo'
import { acumular, esDesviado, puntuar } from '../juego/puntuacion'
import { nuevoRelevo, tocaAdivinar, type Relevo } from '../juego/relevo'
import { repartir } from '../juego/reparto'
import { esImagen } from '../juego/tipos'
import type {
  Ajustes,
  Familia,
  Jugador,
  Marcador,
  Recuento,
  ResultadoVotacion,
  Ronda,
} from '../juego/tipos'
import { recuentoVacio, resolver, sumarVoto, totalVotos } from '../juego/votacion'
import { AJUSTES_POR_DEFECTO, MARCADOR_VACIO } from './almacenamiento'

export type Fase =
  | 'inicio'
  | 'jugadores'
  | 'tutorial'
  | 'reparto'
  | 'senales'
  | 'debate'
  | 'votacion'
  | 'desempate'
  | 'segunda'
  | 'alineacion'
  | 'cierre'
  | 'marcador'
  | 'album'
  // El Relevo es otro juego dentro de la misma app: no comparte reparto,
  // señales, votación ni puntuación con Órbita.
  | 'relevo'
  | 'relevo-adivinar'
  | 'relevo-final'

/**
 * El historial de palabras jugadas se guarda en el móvil, así que la memoria
 * cruza noches: si el martes salió «naranja», el jueves no vuelve. Se recuerdan
 * todas hasta agotar el catálogo; en ese momento empieza un ciclo nuevo.
 *
 * El agotamiento se mide contra el catálogo EN USO, no contra el completo: si
 * juegas solo al tema «animales», el ciclo se cierra al acabarse los animales,
 * no al acabarse las 318.
 */
function historialTrasJugar(historial: string[], jugada: string, enUso: Familia[]): string[] {
  const nuevo = [jugada, ...historial.filter((id) => id !== jugada)]
  // Al cerrar el ciclo se arranca uno nuevo, pero conservando la que acaba de
  // salir: si no, podría repetirse justo en la ronda siguiente.
  const agotadas = enUso.every((f) => nuevo.includes(f.id))
  return agotadas ? [jugada] : nuevo
}

export interface Estado {
  fase: Fase
  jugadores: Jugador[]
  ajustes: Ajustes
  marcador: Marcador
  historialFamilias: string[]
  /**
   * Tríos de imagen jugados, para los créditos del final de la noche. Es lo
   * único que se destapa, y solo cuando la mesa lo pide: enseñar las fotos
   * entre rondas mataría la duda que hace que apetezca otra.
   */
  album: string[]
  /** Partida del Relevo en curso. Vive en memoria: los PNG no se guardan. */
  relevo: Relevo | null

  ronda: Ronda | null
  /** Índice del jugador al que le toca ver su palabra. */
  indiceReparto: number
  /** La pantalla de traspaso tapa la palabra hasta que el móvil cambia de manos. */
  enTraspaso: boolean

  recuento: Recuento
  indiceVotante: number
  votacion: ResultadoVotacion | null

  expulsadoId: string | null
  /** Señalados por error en esta ronda: fuera del debate y de las votaciones. */
  eliminados: string[]
  /** La mesa ha tirado la toalla: no se busca más y la ronda se cierra. */
  rendido: boolean
  /** Resultado de la última segunda oportunidad, solo para pintarlo. */
  acertoElAstro: boolean | null
  /** Quién robó la ronda adivinando el Astro. Sobrevive a las votaciones. */
  adivinadorId: string | null
  maniobrasDelGrupo: Record<string, boolean>
}

export const ESTADO_INICIAL: Estado = {
  fase: 'inicio',
  jugadores: [],
  ajustes: AJUSTES_POR_DEFECTO,
  marcador: MARCADOR_VACIO,
  historialFamilias: [],
  album: [],
  relevo: null,
  ronda: null,
  indiceReparto: 0,
  enTraspaso: true,
  recuento: {},
  indiceVotante: 0,
  votacion: null,
  expulsadoId: null,
  eliminados: [],
  rendido: false,
  acertoElAstro: null,
  adivinadorId: null,
  maniobrasDelGrupo: {},
}

/**
 * Con menos de tres en pie una votación ya no decide nada (uno señala al otro),
 * así que la ronda se acaba y el desviado se la lleva.
 */
export const MIN_PARA_SEGUIR = 3

/** Quien sigue en juego: los eliminados no debaten, no votan y no se les vota. */
export function jugadoresVivos(estado: Estado): Jugador[] {
  return estado.jugadores.filter((j) => !estado.eliminados.includes(j.id))
}

export type Accion =
  | { tipo: 'ir'; fase: Fase }
  | { tipo: 'jugador/anadir'; nombre: string }
  | { tipo: 'jugador/quitar'; id: string }
  | { tipo: 'jugador/mover'; id: string; direccion: -1 | 1 }
  | { tipo: 'ajustes/cambiar'; parcial: Partial<Ajustes> }
  | { tipo: 'ronda/repartir' }
  | { tipo: 'traspaso/listo' }
  | { tipo: 'reparto/revelado' }
  | { tipo: 'reparto/atras' }
  | { tipo: 'senales/terminadas' }
  | { tipo: 'debate/terminado' }
  | { tipo: 'voto/emitir'; votadoId: string }
  | { tipo: 'voto/atras' }
  | { tipo: 'voto/ajustar'; jugadorId: string; delta: number }
  | { tipo: 'voto/directo'; expulsadoId: string }
  | { tipo: 'votacion/cerrar' }
  | { tipo: 'desempate/elegir'; jugadorId: string }
  | { tipo: 'segunda/resolver'; acierto: boolean }
  | { tipo: 'ronda/continuar' }
  | { tipo: 'ronda/rendirse' }
  | { tipo: 'maniobra/grupo'; jugadorId: string; cumplida: boolean }
  | { tipo: 'ronda/cerrar' }
  | { tipo: 'marcador/reiniciar' }
  | { tipo: 'historial/olvidar' }
  | { tipo: 'album/vaciar' }
  | { tipo: 'relevo/empezar' }
  | { tipo: 'relevo/turno-listo' }
  | { tipo: 'relevo/trazo'; png: string }
  | { tipo: 'relevo/destapar' }

export function nuevoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `j${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`
}

export function reducir(estado: Estado, accion: Accion): Estado {
  switch (accion.tipo) {
    case 'ir':
      return { ...estado, fase: accion.fase }

    case 'jugador/anadir': {
      const nombre = accion.nombre.trim()
      if (!nombre) return estado
      return { ...estado, jugadores: [...estado.jugadores, { id: nuevoId(), nombre }] }
    }

    case 'jugador/quitar':
      return { ...estado, jugadores: estado.jugadores.filter((j) => j.id !== accion.id) }

    // El orden de la lista es el orden en que se pasa el móvil, así que debe
    // poder ajustarse cuando alguien se cambia de sitio a mitad de noche.
    case 'jugador/mover': {
      const desde = estado.jugadores.findIndex((j) => j.id === accion.id)
      const hasta = desde + accion.direccion
      if (desde < 0 || hasta < 0 || hasta >= estado.jugadores.length) return estado

      const jugadores = [...estado.jugadores]
      const a = jugadores[desde] as Jugador
      const b = jugadores[hasta] as Jugador
      jugadores[desde] = b
      jugadores[hasta] = a
      return { ...estado, jugadores }
    }

    case 'ajustes/cambiar':
      return { ...estado, ajustes: { ...estado.ajustes, ...accion.parcial } }

    case 'ronda/repartir': {
      const enUso = familiasEnJuego(estado.ajustes)
      const ronda = repartir(
        estado.jugadores,
        enUso,
        estado.ajustes,
        CATALOGO_MANIOBRAS,
        estado.historialFamilias,
      )
      // El álbum se apunta al repartir, no al cerrar: una ronda abandonada a
      // medias también se jugó, y la foto sigue teniendo gracia al final.
      const album = esImagen(ronda.familia)
        ? [...estado.album.filter((id) => id !== ronda.familia.id), ronda.familia.id]
        : estado.album
      return {
        ...estado,
        fase: 'reparto',
        ronda,
        album,
        historialFamilias: historialTrasJugar(estado.historialFamilias, ronda.familia.id, enUso),
        indiceReparto: 0,
        enTraspaso: true,
        recuento: recuentoVacio(estado.jugadores.map((j) => j.id)),
        indiceVotante: 0,
        votacion: null,
        expulsadoId: null,
        eliminados: [],
        rendido: false,
        acertoElAstro: null,
        maniobrasDelGrupo: {},
      }
    }

    // El jugador confirma que tiene él el móvil: recién entonces se puede
    // desvelar nada.
    case 'traspaso/listo':
      return { ...estado, enTraspaso: false }

    case 'reparto/revelado': {
      const ultimo = estado.indiceReparto >= estado.jugadores.length - 1
      // La pantalla de señales ya canta quién abre, así que del reparto se sale
      // directo a jugar.
      if (ultimo) return { ...estado, fase: 'senales' }
      return { ...estado, indiceReparto: estado.indiceReparto + 1, enTraspaso: true }
    }

    // Deshacer del reparto (§7): alguien ha pasado el móvil sin mirar.
    case 'reparto/atras':
      return {
        ...estado,
        indiceReparto: Math.max(0, estado.indiceReparto - 1),
        enTraspaso: true,
      }

    case 'senales/terminadas':
      return { ...estado, fase: 'debate' }

    case 'debate/terminado':
      return { ...estado, fase: 'votacion', enTraspaso: true }

    case 'voto/emitir': {
      const recuento = sumarVoto(estado.recuento, accion.votadoId)
      // Los eliminados no votan, así que la vuelta a la mesa es más corta.
      const ultimo = estado.indiceVotante >= jugadoresVivos(estado).length - 1
      if (ultimo) return cerrarVotacion({ ...estado, recuento })
      return { ...estado, recuento, indiceVotante: estado.indiceVotante + 1, enTraspaso: true }
    }

    case 'voto/atras':
      return { ...estado, indiceVotante: Math.max(0, estado.indiceVotante - 1), enTraspaso: true }

    case 'voto/ajustar': {
      const actual = estado.recuento[accion.jugadorId] ?? 0
      const siguiente = Math.max(0, actual + accion.delta)
      return { ...estado, recuento: { ...estado.recuento, [accion.jugadorId]: siguiente } }
    }

    // Voto directo: la mesa ya ha decidido a mano alzada y solo señala. No hay
    // recuento que llevar, así que el señalado entra con un voto simbólico y se
    // salta el desempate: si había empate, lo han deshecho hablando.
    case 'voto/directo':
      return trasExpulsion(
        { ...estado, recuento: { ...estado.recuento, [accion.expulsadoId]: 1 } },
        accion.expulsadoId,
      )

    case 'votacion/cerrar':
      return cerrarVotacion(estado)

    case 'desempate/elegir':
      return trasExpulsion(estado, accion.jugadorId)

    // La palabra se dice en voz alta y la mesa juzga: más rápido que escribirla
    // con el teclado, y de paso acepta el «can» por «perro» sin discusión.
    // Acertar cierra la ronda aunque quede otro satélite suelto: la ronda es
    // suya y se acabó.
    case 'segunda/resolver':
      return {
        ...estado,
        acertoElAstro: accion.acierto,
        adivinadorId: accion.acierto ? estado.expulsadoId : estado.adivinadorId,
        fase: 'alineacion',
      }

    /**
     * Han señalado a un inocente y quieren seguir con la MISMA palabra. El
     * caído queda eliminado —ni debate ni voto— y se vuelve al debate con los
     * que quedan. La ronda no se cierra, así que no se puntúa nada todavía.
     */
    case 'ronda/continuar': {
      if (!estado.expulsadoId) return estado
      // `eliminados` recoge a todo el que ha caído: inocentes señalados por
      // error y satélites ya cazados. Ninguno vuelve al debate.
      const eliminados = [...estado.eliminados, estado.expulsadoId]
      const siguen = estado.jugadores.filter((j) => !eliminados.includes(j.id))

      return {
        ...estado,
        fase: 'debate',
        eliminados,
        recuento: recuentoVacio(siguen.map((j) => j.id)),
        indiceVotante: 0,
        votacion: null,
        expulsadoId: null,
        acertoElAstro: null,
      }
    }

    /**
     * Tirar la toalla. Vale tanto tras fallar un voto como en mitad del debate,
     * cuando la mesa ve que no va a ningún lado.
     *
     * No cierra la ronda de golpe: lleva a la revelación, que es donde se
     * verifican las maniobras, y ya de ahí al marcador. Los desviados que sigan
     * en pie cobran igual que si hubieran sobrevivido, que es lo que han hecho.
     */
    case 'ronda/rendirse':
      return { ...estado, rendido: true, fase: 'alineacion' }

    case 'maniobra/grupo':
      return {
        ...estado,
        maniobrasDelGrupo: {
          ...estado.maniobrasDelGrupo,
          [accion.jugadorId]: accion.cumplida,
        },
      }

    case 'ronda/cerrar': {
      // Rendirse en mitad del debate cierra la ronda sin que haya habido
      // votación ni expulsado, así que ni una cosa ni la otra pueden exigirse.
      if (!estado.ronda) return estado
      const puntos = puntuar(estado.ronda, estado.votacion ?? resolver(estado.recuento), {
        cazados: estado.expulsadoId
          ? [...estado.eliminados, estado.expulsadoId]
          : estado.eliminados,
        adivinadorId: estado.adivinadorId,
        maniobrasDelGrupo: estado.maniobrasDelGrupo,
      })
      // Al marcador NO se va sola: la tabla de puntos destapa el reparto de la
      // noche (el que va distinto es el desviado), así que entre rondas solo se
      // enseña que la ronda ha cerrado. Verlo es una decisión de la mesa.
      return { ...estado, fase: 'cierre', marcador: acumular(estado.marcador, puntos) }
    }

    case 'marcador/reiniciar':
      return { ...estado, marcador: MARCADOR_VACIO }

    case 'historial/olvidar':
      return { ...estado, historialFamilias: [] }

    case 'relevo/empezar':
      return {
        ...estado,
        fase: 'relevo',
        relevo: nuevoRelevo(estado.jugadores, estado.ajustes.relevoFrases),
        enTraspaso: true,
      }

    case 'relevo/turno-listo':
      return { ...estado, enTraspaso: false }

    /**
     * Se guarda el lienzo ENTERO de cada turno, no solo lo que añadió cada uno:
     * así al final se puede ver crecer el dibujo paso a paso, que es el remate.
     */
    case 'relevo/trazo': {
      if (!estado.relevo) return estado
      const relevo: Relevo = {
        ...estado.relevo,
        turno: estado.relevo.turno + 1,
        turnos: [
          ...estado.relevo.turnos,
          { jugadorId: estado.relevo.orden[estado.relevo.turno] ?? '', png: accion.png },
        ],
      }
      return {
        ...estado,
        relevo,
        fase: tocaAdivinar(relevo) ? 'relevo-adivinar' : 'relevo',
        enTraspaso: true,
      }
    }

    case 'relevo/destapar':
      return { ...estado, fase: 'relevo-final' }

    // Cerrar el álbum: empieza noche nueva y los créditos se ven una sola vez.
    case 'album/vaciar':
      return { ...estado, album: [], fase: 'marcador' }

    default:
      return estado
  }
}

function cerrarVotacion(estado: Estado): Estado {
  if (totalVotos(estado.recuento) === 0) return estado

  const votacion = resolver(estado.recuento)
  const conVotacion = { ...estado, votacion }

  // El empate lo deshace la mesa: la app no elige por ellos.
  if (votacion.hayEmpate) return { ...conVotacion, fase: 'desempate' }

  const expulsadoId = votacion.maximos[0]
  if (!expulsadoId) return conVotacion
  return trasExpulsion(conVotacion, expulsadoId)
}

/**
 * La regla de la segunda oportunidad (§2.4): si cae el desviado, todavía puede
 * robar la ronda adivinando el Astro. Sin esto, al centro le sale gratis ser
 * preciso y el desviado queda expuesto en la primera vuelta siempre.
 */
function trasExpulsion(estado: Estado, expulsadoId: string): Estado {
  const votacion = estado.votacion ?? resolver(estado.recuento)
  const expulsado = estado.ronda?.asignaciones.find((a) => a.jugadorId === expulsadoId)
  const cayoElDesviado = expulsado ? esDesviado(expulsado) : false

  return {
    ...estado,
    votacion,
    expulsadoId,
    fase: cayoElDesviado ? 'segunda' : 'alineacion',
  }
}
