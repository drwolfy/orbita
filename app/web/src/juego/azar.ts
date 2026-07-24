/** Utilidades de azar. Aisladas aquí para poder sustituirlas en las pruebas. */

export function entero(max: number): number {
  return Math.floor(Math.random() * max)
}

export function elegir<T>(lista: readonly T[]): T {
  const elegido = lista[entero(lista.length)]
  if (elegido === undefined) throw new Error('No se puede elegir de una lista vacía')
  return elegido
}

/** Fisher-Yates sobre una copia: nunca muta la lista que recibe. */
export function barajar<T>(lista: readonly T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = entero(i + 1)
    const a = copia[i] as T
    const b = copia[j] as T
    copia[i] = b
    copia[j] = a
  }
  return copia
}

/** n elementos distintos, en orden aleatorio. */
export function elegirVarios<T>(lista: readonly T[], n: number): T[] {
  return barajar(lista).slice(0, n)
}
