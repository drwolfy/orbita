/** Tipos del dominio. Sin nada de React: esto es el reglamento. */

/** Órbita: nadie miente, uno tiene una palabra vecina. Clásico: hay impostor. */
export type ModoJuego = 'orbita' | 'clasico'

/**
 * Qué ve el impostor en el modo clásico. `pista` le da una palabra de la banda 3
 * —una asociación, no una hermana: «correa» para «perro»—, que es lo que un
 * jugador diría *sobre* la palabra. Le da por dónde tirar sin regalársela.
 */
export type PistaImpostor = 'nada' | 'pista'

/**
 * `directa` es la vía rápida: se vota a mano alzada y alguien toca al señalado,
 * sin recuento. `pasa` y `operador` sí cuentan votos uno a uno.
 */
export type MetodoVotacion = 'directa' | 'pasa' | 'operador'

/**
 * De qué va el sorteo: palabras del diccionario, tríos de fotos, o los dos
 * revueltos (no sabes de qué va la ronda hasta que destapas).
 *
 * Las fotos solo existen en Órbita: en clásico el impostor no ve nada y no
 * tiene de dónde agarrarse, así que ahí el catálogo vuelve a ser de palabras.
 */
export type TipoCatalogo = 'palabras' | 'imagenes' | 'mezcla'

/**
 * Qué juego se está jugando. El Relevo comparte la app y los jugadores con
 * Órbita, pero no su motor: ni reparto, ni señales, ni votación, ni puntos.
 */
export type TipoJuego = 'orbita' | 'relevo'

/** ¿Este método lleva la cuenta de los votos, o solo señala al expulsado? */
export function cuentaVotos(metodo: MetodoVotacion): boolean {
  return metodo !== 'directa'
}

export interface Jugador {
  id: string
  nombre: string
}

/**
 * Un cuadrado dentro de la foto, en fracciones del lado (0 a 1). `lado: 0.25`
 * enseña una cuarta parte: lo bastante cerca para que el objeto no se
 * reconozca, que es de lo que va el juego.
 */
export interface Recorte {
  x: number
  y: number
  lado: number
}

export interface Familia {
  id: string
  astro: string
  categoria: string
  /**
   * Pista del impostor (§2.1b): una asociación oblicua, no un objeto del
   * atrezo. «cartero» para «perro», no «correa» — tiene que deducir de qué va,
   * no leerlo.
   */
  pista: string
  /** La v1 solo consume la banda 1; las otras quedan listas para el modo avanzado. */
  bandas: Record<'1' | '2' | '3', string[]>

  /**
   * Familias de imagen: `astro` y la banda 1 guardan ids de foto en vez de
   * palabras. Todo el motor —reparto, señales, votación, segunda, puntuación—
   * funciona igual; solo cambia cómo lo pinta la pantalla de reparto.
   */
  tipo?: 'imagen'
  /** Extensión de las fotos del trío. Las de verdad van en webp. */
  formato?: 'webp' | 'jpg' | 'png' | 'svg'
  /** Nombre de cada foto, para el álbum del final. Solo en familias de imagen. */
  titulos?: Record<string, string>
  /**
   * La palabra única que tiene que pensar quien vea esa foto. NO se enseña
   * nunca ni se escribe en la partida: es la casilla de control al curar. Una
   * foto que admita dos palabras parte al núcleo en dos y mata la ronda, igual
   * que una palabra de doble sentido sin sentido dominante. Si al rellenarla
   * dudas, el trío no vale.
   */
  palabras?: Record<string, string>
  /**
   * Qué trozo de cada foto ve la mesa durante la ronda. La foto entera se
   * guarda para el álbum: es lo que hace que el remate se entienda de golpe.
   * Sin recorte se enseña completa.
   */
  recortes?: Record<string, Recorte>
  /**
   * Palabras que valen para las tres fotos. No se enseñan durante la partida:
   * están para curar. Si no salen seis, el trío no está listo (docs/parejas.md).
   */
  comunes?: string[]
  /** Palabras que delatan de cuál de las tres se está hablando. */
  minas?: string[]
}

/** ¿Esta familia se juega con fotos en vez de con palabras? */
export function esImagen(familia: Familia): boolean {
  return familia.tipo === 'imagen'
}

/**
 * Etiquetas de la revelación, nunca del reparto: nadie conoce su rol
 * mientras juega.
 */
export type Rol = 'nucleo' | 'satelite' | 'ciudadano' | 'impostor'

export type TipoManiobra = 'voto' | 'verbal' | 'comportamiento'
export type VerificacionManiobra = 'auto' | 'grupo'
export type ParametroManiobra = 'ninguno' | 'otro' | 'palabra'

export type ReglaAuto =
  | 'objetivo-mas-votado'
  | 'objetivo-sin-votos'
  | 'yo-mas-votado'
  | 'hay-empate'

export interface PlantillaManiobra {
  id: string
  texto: string
  tipo: TipoManiobra
  verificacion: VerificacionManiobra
  parametro: ParametroManiobra
  regla?: ReglaAuto
  /** Id de la plantilla contraria, para la variante de maniobras enfrentadas. */
  opuesta?: string
}

export interface ManiobraAsignada {
  plantillaId: string
  /** Texto ya resuelto, con el nombre o la palabra sustituidos. */
  texto: string
  tipo: TipoManiobra
  verificacion: VerificacionManiobra
  regla?: ReglaAuto
  objetivoId?: string
  /** Se enseña a toda la mesa (variante «maniobra pública»). */
  publica: boolean
}

export interface Asignacion {
  jugadorId: string
  /** null solo para el impostor del modo clásico. */
  palabra: string | null
  /** Solo se rellena para el impostor cuando la pista está activada. */
  pista: string | null
  rol: Rol
  maniobra: ManiobraAsignada | null
}

export interface Ronda {
  familia: Familia
  asignaciones: Asignacion[]
  /** Ids de jugador en el orden de señales (aleatorio). */
  orden: string[]
  /** Texto de la maniobra que se muestra a la mesa, si la variante está activa. */
  maniobraPublica: string | null
}

export interface Ajustes {
  /** Órbita (con sus modos) o el Relevo. */
  juego: TipoJuego
  modo: ModoJuego
  pistaImpostor: PistaImpostor
  /** «auto» = 1 satélite hasta 6 jugadores, 2 a partir de 7. */
  satelites: 'auto' | 1 | 2
  maniobrasActivas: boolean
  maniobrasEnfrentadas: boolean
  maniobraPublica: boolean
  segundosDebate: number
  /** Segundos por señal. 0 = sin límite de tiempo por turno. */
  segundosSenal: number
  /** Segundos que tiene cada uno para dibujar en el Relevo. */
  segundosTrazo: number
  /** En el Relevo, una frase absurda en vez de palabras sueltas. */
  relevoFrases: boolean
  /** Avisos sonoros cuando se acaba el tiempo. */
  sonido: boolean
  /** Temas de los que salen las palabras. Vacío = todos (aleatorio). */
  temas: string[]
  /** Palabras, fotos o los dos revueltos. Los temas solo afectan a las palabras. */
  catalogo: TipoCatalogo
  metodoVotacion: MetodoVotacion
}

/** Votos ya agregados: jugadorId → número de votos recibidos. */
export type Recuento = Record<string, number>

export interface ResultadoVotacion {
  recuento: Recuento
  /** Ids con el máximo de votos. Más de uno = empate. */
  maximos: string[]
  hayEmpate: boolean
}

export interface Marcador {
  /** jugadorId → puntos acumulados entre rondas. */
  ronda: Record<string, number>
  maniobra: Record<string, number>
}
