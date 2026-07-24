import familiasJson from '../datos/familias.json'
import maniobrasJson from '../datos/maniobras.json'
import { PAREJAS } from './parejas'
import type { Ajustes, Familia, PlantillaManiobra } from './tipos'

/**
 * Los datos viajan en el bundle: sin backend y sin red (§7). Cuando el
 * pipeline de la fase 1 genere su families.json, basta con sustituir el
 * archivo: el formato es el mismo.
 */
export const FAMILIAS = familiasJson.families as Familia[]

export const CATALOGO_MANIOBRAS = {
  plantillas: maniobrasJson.maniobras as PlantillaManiobra[],
  palabras: maniobrasJson.palabras as string[],
}

/** Temas disponibles con cuántas palabras tiene cada uno, de mayor a menor. */
export const TEMAS: Array<{ nombre: string; cuantas: number }> = Object.entries(
  FAMILIAS.reduce<Record<string, number>>((cuenta, f) => {
    cuenta[f.categoria] = (cuenta[f.categoria] ?? 0) + 1
    return cuenta
  }, {}),
)
  .map(([nombre, cuantas]) => ({ nombre, cuantas }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

/**
 * Familias de los temas elegidos. Sin temas elegidos entran todas, que es el
 * modo aleatorio. Si la selección se quedara sin nada (no debería), se vuelve
 * al catálogo entero antes que dejar la partida sin palabras.
 */
export function familiasDeTemas(temas: string[]): Familia[] {
  if (temas.length === 0) return FAMILIAS
  const elegidas = FAMILIAS.filter((f) => temas.includes(f.categoria))
  return elegidas.length > 0 ? elegidas : FAMILIAS
}

/**
 * El catálogo del que sale la ronda, ya con todo aplicado: modo, ajuste de
 * catálogo y temas.
 *
 * Las fotos solo se reparten en Órbita. En clásico el impostor no recibe nada
 * y su única ayuda es la `pista`, que un trío de imágenes no tiene: se quedaría
 * mirando la pantalla en blanco mientras la mesa habla de texturas. Así que ahí
 * se vuelve a palabras aunque el ajuste diga otra cosa.
 *
 * Si el catálogo elegido se quedara vacío (fotos pedidas y ninguna metida
 * todavía), se cae a las palabras antes que dejar la partida sin nada.
 */
export function familiasEnJuego(ajustes: Ajustes): Familia[] {
  const palabras = familiasDeTemas(ajustes.temas)
  if (ajustes.modo === 'clasico') return palabras

  const elegidas =
    ajustes.catalogo === 'imagenes'
      ? PAREJAS
      : ajustes.catalogo === 'mezcla'
        ? [...palabras, ...PAREJAS]
        : palabras

  return elegidas.length > 0 ? elegidas : palabras
}
