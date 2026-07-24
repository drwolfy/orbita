import { barajar, elegir } from './azar'
import type {
  Ajustes,
  Jugador,
  ManiobraAsignada,
  PlantillaManiobra,
  ResultadoVotacion,
} from './tipos'

interface Catalogo {
  plantillas: PlantillaManiobra[]
  palabras: string[]
}

/**
 * Reparte una maniobra a CADA jugador (§3.1b): si solo la tuviera uno, se le
 * vería venir. Con todas repartidas, el comportamiento raro deja de ser prueba
 * de nada y eso da coartada al Satélite.
 */
export function asignarManiobras(
  jugadores: Jugador[],
  catalogo: Catalogo,
  ajustes: Ajustes,
): Map<string, ManiobraAsignada> {
  const asignadas = new Map<string, ManiobraAsignada>()
  if (!ajustes.maniobrasActivas || jugadores.length < 2) return asignadas

  let pendientes = [...jugadores]

  // Variante «enfrentadas»: dos jugadores reciben objetivos opuestos sobre la
  // misma persona, y ninguno sabe que el otro existe.
  if (ajustes.maniobrasEnfrentadas && jugadores.length >= 4) {
    const par = crearParEnfrentado(jugadores, catalogo)
    if (par) {
      for (const [jugadorId, maniobra] of par) asignadas.set(jugadorId, maniobra)
      pendientes = pendientes.filter((j) => !asignadas.has(j.id))
    }
  }

  // Baraja el catálogo y lo recorre, para repetir plantilla lo menos posible.
  const usadas = new Set([...asignadas.values()].map((m) => m.plantillaId))
  let baraja = barajar(catalogo.plantillas).filter((p) => !usadas.has(p.id))

  for (const jugador of pendientes) {
    if (baraja.length === 0) baraja = barajar(catalogo.plantillas)
    const plantilla = baraja.shift() as PlantillaManiobra
    asignadas.set(jugador.id, resolver(plantilla, jugador, jugadores, catalogo))
  }

  // Variante «maniobra pública»: la mesa sabe el qué, nadie el quién.
  if (ajustes.maniobraPublica && asignadas.size > 0) {
    const elegida = elegir([...asignadas.keys()])
    const maniobra = asignadas.get(elegida) as ManiobraAsignada
    asignadas.set(elegida, { ...maniobra, publica: true })
  }

  return asignadas
}

function crearParEnfrentado(
  jugadores: Jugador[],
  catalogo: Catalogo,
): Array<[string, ManiobraAsignada]> | null {
  const dirigida = catalogo.plantillas.find((p) => p.regla === 'objetivo-mas-votado')
  const blindaje = catalogo.plantillas.find((p) => p.regla === 'objetivo-sin-votos')
  if (!dirigida || !blindaje) return null

  const objetivo = elegir(jugadores)
  const candidatos = barajar(jugadores.filter((j) => j.id !== objetivo.id))
  const uno = candidatos[0]
  const otro = candidatos[1]
  if (!uno || !otro) return null

  return [
    [uno.id, conObjetivo(dirigida, objetivo)],
    [otro.id, conObjetivo(blindaje, objetivo)],
  ]
}

function conObjetivo(plantilla: PlantillaManiobra, objetivo: Jugador): ManiobraAsignada {
  return {
    plantillaId: plantilla.id,
    texto: plantilla.texto.replace('{jugador}', objetivo.nombre),
    tipo: plantilla.tipo,
    verificacion: plantilla.verificacion,
    ...(plantilla.regla ? { regla: plantilla.regla } : {}),
    objetivoId: objetivo.id,
    publica: false,
  }
}

function resolver(
  plantilla: PlantillaManiobra,
  jugador: Jugador,
  jugadores: Jugador[],
  catalogo: Catalogo,
): ManiobraAsignada {
  if (plantilla.parametro === 'otro') {
    const otros = jugadores.filter((j) => j.id !== jugador.id)
    // Con un solo jugador más no hay «otro» posible; no debería ocurrir con 4+.
    if (otros.length > 0) return conObjetivo(plantilla, elegir(otros))
  }

  const texto =
    plantilla.parametro === 'palabra'
      ? plantilla.texto.replace('{palabra}', elegir(catalogo.palabras))
      : plantilla.texto

  return {
    plantillaId: plantilla.id,
    texto,
    tipo: plantilla.tipo,
    verificacion: plantilla.verificacion,
    ...(plantilla.regla ? { regla: plantilla.regla } : {}),
    publica: false,
  }
}

/**
 * Verificación automática de las maniobras de voto: la app ya tiene el
 * recuento, así que no hace falta molestar a la mesa.
 */
export function cumpleAuto(
  maniobra: ManiobraAsignada,
  jugadorId: string,
  votacion: ResultadoVotacion,
): boolean {
  switch (maniobra.regla) {
    case 'objetivo-mas-votado':
      return maniobra.objetivoId ? votacion.maximos.includes(maniobra.objetivoId) : false
    case 'objetivo-sin-votos':
      return maniobra.objetivoId ? (votacion.recuento[maniobra.objetivoId] ?? 0) === 0 : false
    case 'yo-mas-votado':
      return votacion.maximos.includes(jugadorId)
    case 'hay-empate':
      return votacion.hayEmpate
    default:
      return false
  }
}
