import type { Recuento, ResultadoVotacion } from './tipos'

/** Recuento vacío, con todos los jugadores a cero. */
export function recuentoVacio(jugadorIds: string[]): Recuento {
  return Object.fromEntries(jugadorIds.map((id) => [id, 0]))
}

/** Pasa-y-juega: cada voto individual suma uno al votado. */
export function sumarVoto(recuento: Recuento, votadoId: string): Recuento {
  return { ...recuento, [votadoId]: (recuento[votadoId] ?? 0) + 1 }
}

export function totalVotos(recuento: Recuento): number {
  return Object.values(recuento).reduce((suma, n) => suma + n, 0)
}

export function resolver(recuento: Recuento): ResultadoVotacion {
  const votos = Object.values(recuento)
  const tope = votos.length > 0 ? Math.max(...votos) : 0
  const maximos = tope > 0 ? Object.keys(recuento).filter((id) => recuento[id] === tope) : []

  return { recuento, maximos, hayEmpate: maximos.length > 1 }
}
