import { cumpleAuto } from './maniobras'
import type { Asignacion, Marcador, ResultadoVotacion, Ronda } from './tipos'

/**
 * Dos marcadores separados (§4): se puede perder la ronda y ganar la noche.
 * Eso mantiene enganchado a quien ya no puede ganar por deducción.
 */
export const PUNTOS = {
  /** Cada Núcleo/Ciudadano, si el expulsado era el desviado y no adivinó. */
  centroAcierta: 1,
  /** Cada Satélite/Impostor, si expulsaron a otro. */
  desviadoSobrevive: 2,
  /** El desviado expulsado que adivina el Astro en la segunda oportunidad. */
  desviadoAdivina: 2,
  /** Por cada maniobra cumplida. */
  maniobra: 1,
} as const

export function esDesviado(asignacion: Asignacion): boolean {
  return asignacion.rol === 'satelite' || asignacion.rol === 'impostor'
}

export interface ResultadoRonda {
  /**
   * Todos los señalados a lo largo de la ronda, en orden: inocentes eliminados
   * y desviados cazados. Una ronda puede tener varias votaciones (§2.4b).
   */
  cazados: string[]
  /** El desviado cazado que acertó el Astro en su segunda oportunidad. */
  adivinadorId: string | null
  /** Maniobras de verificación manual que la mesa ha dado por cumplidas. */
  maniobrasDelGrupo: Record<string, boolean>
}

export interface PuntosRonda {
  ronda: Record<string, number>
  maniobra: Record<string, number>
}

export function puntuar(
  ronda: Ronda,
  votacion: ResultadoVotacion,
  resultado: ResultadoRonda,
): PuntosRonda {
  const puntosRonda: Record<string, number> = {}
  const puntosManiobra: Record<string, number> = {}

  const cazados = new Set(resultado.cazados)
  const desviados = ronda.asignaciones.filter(esDesviado)

  // Con dos satélites hay que cazarlos a LOS DOS: dejar uno vivo no basta.
  const todosCazados = desviados.length > 0 && desviados.every((d) => cazados.has(d.jugadorId))
  // La segunda oportunidad (§2.4): si un cazado acierta el Astro, le roba la
  // ronda al centro. Por eso una señal demasiado precisa se paga.
  const robada = resultado.adivinadorId !== null
  const ganaElCentro = todosCazados && !robada

  for (const asignacion of ronda.asignaciones) {
    let puntos = 0

    if (esDesviado(asignacion)) {
      // Cada desviado responde de lo suyo: al que sobrevive no le quita nada
      // que al otro lo hayan cazado, ni al revés.
      if (!cazados.has(asignacion.jugadorId)) puntos = PUNTOS.desviadoSobrevive
      else if (asignacion.jugadorId === resultado.adivinadorId) puntos = PUNTOS.desviadoAdivina
    } else if (ganaElCentro) {
      puntos = PUNTOS.centroAcierta
    }

    puntosRonda[asignacion.jugadorId] = puntos

    const maniobra = asignacion.maniobra
    if (!maniobra) {
      puntosManiobra[asignacion.jugadorId] = 0
      continue
    }

    const cumplida =
      maniobra.verificacion === 'auto'
        ? cumpleAuto(maniobra, asignacion.jugadorId, votacion)
        : (resultado.maniobrasDelGrupo[asignacion.jugadorId] ?? false)

    puntosManiobra[asignacion.jugadorId] = cumplida ? PUNTOS.maniobra : 0
  }

  return { ronda: puntosRonda, maniobra: puntosManiobra }
}

export function acumular(marcador: Marcador, puntos: PuntosRonda): Marcador {
  const sumar = (previo: Record<string, number>, nuevo: Record<string, number>) => {
    const total = { ...previo }
    for (const [id, n] of Object.entries(nuevo)) total[id] = (total[id] ?? 0) + n
    return total
  }

  return {
    ronda: sumar(marcador.ronda, puntos.ronda),
    maniobra: sumar(marcador.maniobra, puntos.maniobra),
  }
}
