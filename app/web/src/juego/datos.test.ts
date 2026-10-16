import { describe, expect, it } from 'vitest'
import frasesJson from '../datos/frases.json'
import { FAMILIAS } from './catalogo'
import { PAREJAS_INCOMPLETAS } from './parejas'

/**
 * El catálogo es lo que más se toca y lo que nadie revisa al jugar: una pista
 * que delata o una banda corta se nota en la mesa, no al compilar. Estas son
 * las reglas de la especificación (§2.1b) puestas donde saltan solas.
 */

const PALABRAS = FAMILIAS.filter((f) => f.tipo !== 'imagen')

/** Raíz aproximada: con cinco letras comunes, `hormiga`/`hormiguero` delata. */
const raiz = (palabra: string) => palabra.toLowerCase().slice(0, 5)

describe('familias.json', () => {
  it('no repite astros', () => {
    const astros = PALABRAS.map((f) => f.astro)
    expect(astros.filter((a, i) => astros.indexOf(a) !== i)).toEqual([])
  })

  it('todas tienen pista de una sola palabra', () => {
    const malas = PALABRAS.filter((f) => !f.pista || /\s/.test(f.pista.trim()))
    expect(malas.map((f) => f.astro)).toEqual([])
  })

  it('la pista no es el astro ni comparte raíz con él', () => {
    const malas = PALABRAS.filter(
      (f) => f.pista === f.astro || (f.astro.length >= 5 && raiz(f.pista) === raiz(f.astro)),
    )
    expect(malas.map((f) => `${f.astro} → ${f.pista}`)).toEqual([])
  })

  it('la pista no está en la banda 1 (es lo que recibe el satélite)', () => {
    const malas = PALABRAS.filter((f) => f.bandas['1'].includes(f.pista))
    expect(malas.map((f) => `${f.astro} → ${f.pista}`)).toEqual([])
  })

  it('la banda 1 da para dos satélites distintos y no contiene el astro', () => {
    const malas = PALABRAS.filter(
      (f) => new Set(f.bandas['1']).size < 2 || f.bandas['1'].includes(f.astro),
    )
    expect(malas.map((f) => f.astro)).toEqual([])
  })
})

describe('parejas.json', () => {
  it('ningún trío queda fuera del sorteo por estar a medias', () => {
    expect(PAREJAS_INCOMPLETAS).toEqual([])
  })
})

describe('frases.json', () => {
  it.each(['sujetos', 'acciones', 'lugares'] as const)('%s: no vacío y sin repetidos', (pieza) => {
    const lista = frasesJson[pieza]
    expect(lista.length).toBeGreaterThan(0)
    expect(new Set(lista).size).toBe(lista.length)
  })
})
