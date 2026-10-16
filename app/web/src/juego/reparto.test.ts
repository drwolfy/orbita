import { describe, expect, it } from 'vitest'
import { AJUSTES_POR_DEFECTO } from '../estado/almacenamiento'
import { numeroDesviados, repartir } from './reparto'
import type { Ajustes, Familia, Jugador } from './tipos'

const FAMILIA: Familia = {
  id: 'perro',
  astro: 'perro',
  categoria: 'animales',
  pista: 'cartero',
  bandas: { '1': ['lobo', 'zorro'], '2': ['gato'], '3': ['correa'] },
}

const SIN_MANIOBRAS = { plantillas: [], palabras: [] }

const jugadores = (n: number): Jugador[] =>
  Array.from({ length: n }, (_, i) => ({ id: `j${i}`, nombre: `Jugador ${i}` }))

const ajustes = (cambios: Partial<Ajustes> = {}): Ajustes => ({
  ...AJUSTES_POR_DEFECTO,
  maniobrasActivas: false,
  ...cambios,
})

describe('numeroDesviados', () => {
  it('en automático: 1 hasta 6 jugadores y 2 a partir de 7', () => {
    expect(numeroDesviados(ajustes({ satelites: 'auto' }), 4)).toBe(1)
    expect(numeroDesviados(ajustes({ satelites: 'auto' }), 6)).toBe(1)
    expect(numeroDesviados(ajustes({ satelites: 'auto' }), 7)).toBe(2)
    expect(numeroDesviados(ajustes({ satelites: 'auto' }), 10)).toBe(2)
  })

  it('deja siempre al menos 3 en el centro', () => {
    expect(numeroDesviados(ajustes({ satelites: 2 }), 4)).toBe(1)
    expect(numeroDesviados(ajustes({ satelites: 2 }), 5)).toBe(2)
  })

  it('en clásico hay un solo impostor', () => {
    expect(numeroDesviados(ajustes({ modo: 'clasico', satelites: 2 }), 10)).toBe(1)
  })
})

describe('repartir', () => {
  it('el centro recibe el astro y el satélite una palabra de la banda 1', () => {
    const ronda = repartir(jugadores(5), [FAMILIA], ajustes({ modo: 'orbita' }), SIN_MANIOBRAS)
    const satelites = ronda.asignaciones.filter((a) => a.rol === 'satelite')
    const nucleo = ronda.asignaciones.filter((a) => a.rol === 'nucleo')

    expect(satelites).toHaveLength(1)
    expect(nucleo.every((a) => a.palabra === 'perro')).toBe(true)
    expect(FAMILIA.bandas['1']).toContain(satelites[0]?.palabra)
  })

  it('dos satélites reciben palabras distintas, para no reconocerse al oírse', () => {
    for (let i = 0; i < 20; i++) {
      const ronda = repartir(jugadores(8), [FAMILIA], ajustes({ modo: 'orbita' }), SIN_MANIOBRAS)
      const palabras = ronda.asignaciones.filter((a) => a.rol === 'satelite').map((a) => a.palabra)
      expect(palabras).toHaveLength(2)
      expect(new Set(palabras).size).toBe(2)
    }
  })

  it('el orden de señales incluye a todos una sola vez', () => {
    const ronda = repartir(jugadores(6), [FAMILIA], ajustes(), SIN_MANIOBRAS)
    expect([...ronda.orden].sort()).toEqual(jugadores(6).map((j) => j.id).sort())
  })

  it('el impostor no tiene palabra y ve la pista solo si está activada', () => {
    const conPista = repartir(
      jugadores(5),
      [FAMILIA],
      ajustes({ modo: 'clasico', pistaImpostor: 'pista' }),
      SIN_MANIOBRAS,
    )
    const impostor = conPista.asignaciones.find((a) => a.rol === 'impostor')
    expect(impostor?.palabra).toBeNull()
    expect(impostor?.pista).toBe('cartero')

    const aCiegas = repartir(
      jugadores(5),
      [FAMILIA],
      ajustes({ modo: 'clasico', pistaImpostor: 'nada' }),
      SIN_MANIOBRAS,
    )
    expect(aCiegas.asignaciones.find((a) => a.rol === 'impostor')?.pista).toBeNull()
  })

  it('no repite una familia reciente mientras queden otras', () => {
    const gato: Familia = { ...FAMILIA, id: 'gato', astro: 'gato' }
    for (let i = 0; i < 20; i++) {
      const ronda = repartir(jugadores(4), [FAMILIA, gato], ajustes(), SIN_MANIOBRAS, ['perro'])
      expect(ronda.familia.id).toBe('gato')
    }
  })

  it('si todas son recientes, juega igualmente antes que quedarse sin palabra', () => {
    const ronda = repartir(jugadores(4), [FAMILIA], ajustes(), SIN_MANIOBRAS, ['perro'])
    expect(ronda.familia.id).toBe('perro')
  })
})
