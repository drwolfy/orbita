import { describe, expect, it } from 'vitest'
import { PUNTOS, acumular, puntuar } from './puntuacion'
import type { ResultadoRonda } from './puntuacion'
import type { Asignacion, Familia, Rol, Ronda } from './tipos'
import { recuentoVacio, resolver, sumarVoto } from './votacion'

const FAMILIA: Familia = {
  id: 'perro',
  astro: 'perro',
  categoria: 'animales',
  pista: 'cartero',
  bandas: { '1': ['lobo', 'zorro'], '2': [], '3': [] },
}

/** Una ronda con los roles dados, en orden: j0, j1, j2… */
function ronda(roles: Rol[]): Ronda {
  const asignaciones: Asignacion[] = roles.map((rol, i) => ({
    jugadorId: `j${i}`,
    palabra: rol === 'satelite' ? 'lobo' : 'perro',
    pista: null,
    rol,
    maniobra: null,
  }))
  return {
    familia: FAMILIA,
    asignaciones,
    orden: asignaciones.map((a) => a.jugadorId),
    maniobraPublica: null,
  }
}

const VOTACION = resolver({})

const resultado = (cazados: string[], adivinadorId: string | null = null): ResultadoRonda => ({
  cazados,
  adivinadorId,
  maniobrasDelGrupo: {},
})

describe('puntuar', () => {
  it('cazan al satélite: el centro suma y el satélite no', () => {
    const r = ronda(['nucleo', 'nucleo', 'nucleo', 'satelite'])
    const { ronda: puntos } = puntuar(r, VOTACION, resultado(['j3']))
    expect(puntos).toEqual({ j0: 1, j1: 1, j2: 1, j3: 0 })
  })

  it('echan a un inocente: el satélite sobrevive y suma', () => {
    const r = ronda(['nucleo', 'nucleo', 'nucleo', 'satelite'])
    const { ronda: puntos } = puntuar(r, VOTACION, resultado(['j0']))
    expect(puntos).toEqual({ j0: 0, j1: 0, j2: 0, j3: PUNTOS.desviadoSobrevive })
  })

  it('con dos satélites hay que cazar a los dos para que gane el centro', () => {
    const r = ronda(['nucleo', 'nucleo', 'nucleo', 'nucleo', 'nucleo', 'satelite', 'satelite'])

    const uno = puntuar(r, VOTACION, resultado(['j5'])).ronda
    expect(uno.j0).toBe(0)
    expect(uno.j5).toBe(0)
    expect(uno.j6).toBe(PUNTOS.desviadoSobrevive)

    const dos = puntuar(r, VOTACION, resultado(['j5', 'j6'])).ronda
    expect(dos.j0).toBe(PUNTOS.centroAcierta)
    expect(dos.j5).toBe(0)
    expect(dos.j6).toBe(0)
  })

  it('la segunda oportunidad: si el cazado adivina, roba la ronda', () => {
    const r = ronda(['nucleo', 'nucleo', 'nucleo', 'satelite'])
    const { ronda: puntos } = puntuar(r, VOTACION, resultado(['j3'], 'j3'))
    expect(puntos).toEqual({ j0: 0, j1: 0, j2: 0, j3: PUNTOS.desviadoAdivina })
  })

  it('en clásico puntúa igual: ciudadanos como centro, impostor como desviado', () => {
    const r = ronda(['ciudadano', 'ciudadano', 'ciudadano', 'impostor'])
    expect(puntuar(r, VOTACION, resultado(['j3'])).ronda).toEqual({ j0: 1, j1: 1, j2: 1, j3: 0 })
  })

  it('sin maniobras, el marcador de maniobra queda a cero', () => {
    const r = ronda(['nucleo', 'nucleo', 'nucleo', 'satelite'])
    expect(puntuar(r, VOTACION, resultado(['j3'])).maniobra).toEqual({ j0: 0, j1: 0, j2: 0, j3: 0 })
  })
})

describe('acumular', () => {
  it('suma ronda a ronda y admite a quien llega tarde', () => {
    const tras1 = acumular({ ronda: {}, maniobra: {} }, { ronda: { j0: 1 }, maniobra: { j0: 0 } })
    const tras2 = acumular(tras1, { ronda: { j0: 2, j9: 1 }, maniobra: { j0: 1, j9: 0 } })
    expect(tras2).toEqual({ ronda: { j0: 3, j9: 1 }, maniobra: { j0: 1, j9: 0 } })
  })
})

describe('votación', () => {
  it('el más votado sale sin empate', () => {
    let recuento = recuentoVacio(['j0', 'j1', 'j2'])
    recuento = sumarVoto(sumarVoto(sumarVoto(recuento, 'j1'), 'j1'), 'j2')
    expect(resolver(recuento)).toMatchObject({ maximos: ['j1'], hayEmpate: false })
  })

  it('detecta el empate', () => {
    const recuento = sumarVoto(sumarVoto(recuentoVacio(['j0', 'j1', 'j2']), 'j0'), 'j1')
    expect(resolver(recuento)).toMatchObject({ maximos: ['j0', 'j1'], hayEmpate: true })
  })

  it('sin votos no hay nadie señalado', () => {
    expect(resolver(recuentoVacio(['j0', 'j1']))).toMatchObject({ maximos: [], hayEmpate: false })
  })
})
