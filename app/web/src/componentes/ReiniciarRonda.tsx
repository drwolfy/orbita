import { useState, type ReactNode } from 'react'
import { usePartida } from '../estado/usePartida'
import type { Fase } from '../estado/partida'
import { T } from '../textos/es'
import { Boton, BotonPlano, Marco } from './Marco'

/**
 * Fases en las que tiene sentido reiniciar: hay una ronda en marcha. Una vez
 * llegas a la revelación ya no hay nada que salvar, y en el marcador o el menú
 * el botón solo estorbaría.
 */
const EN_RONDA: Fase[] = ['reparto', 'senales', 'debate', 'votacion', 'desempate']

/**
 * En el Relevo la salida sirve para otra cosa: si las palabras que han salido
 * no hay quien las dibuje, se sortean otras sin tener que acabar la vuelta.
 * En `relevo-final` no hace falta, que ahí ya hay botones para todo.
 */
const EN_RELEVO: Fase[] = ['relevo', 'relevo-adivinar']

/** Cerrado · menú de opciones · confirmación de cada opción destructiva. */
type Paso = 'cerrado' | 'menu' | 'repartir' | 'inicio' | 'rendirse' | 'relevo'

/**
 * Rendirse solo tiene sentido una vez se está jugando de verdad: en el reparto
 * todavía no hay nada que adivinar.
 */
const SE_PUEDE_RENDIR: Fase[] = ['debate', 'votacion', 'desempate']

/**
 * Salida de emergencia: alguien ha visto la pantalla de otro, o el móvil ha
 * pasado por quien no tocaba. Reparte de cero con palabras nuevas sin tener que
 * terminar la ronda.
 *
 * Las dos opciones que se cargan la ronda piden confirmación aparte; «seguir
 * jugando» sale directa, porque volver a lo que estabas haciendo no rompe nada.
 * El botón vive fijo en pantalla durante toda la ronda, así que un roce
 * accidental tiene que quedarse a dos toques de distancia del desastre.
 */
export function ReiniciarRonda() {
  const { estado, despachar } = usePartida()
  const [paso, setPaso] = useState<Paso>('cerrado')

  const enRelevo = EN_RELEVO.includes(estado.fase)
  if (!EN_RONDA.includes(estado.fase) && !enRelevo) return null

  const cerrar = () => setPaso('cerrado')

  if (paso === 'cerrado') {
    return (
      <button
        onClick={() => setPaso('menu')}
        aria-label={T.reiniciar.etiqueta}
        className="fixed top-0 right-0 z-40 flex h-12 w-12 items-center justify-center text-xl text-tenue active:text-magenta"
        style={{
          marginTop: 'max(0.5rem, env(safe-area-inset-top))',
          marginRight: 'max(0.5rem, env(safe-area-inset-right))',
        }}
      >
        ↻
      </button>
    )
  }

  return (
    <Capa>
      {paso === 'menu' && enRelevo ? (
        <Cuadro titulo={T.reiniciar.relevoTitulo} ayuda={T.reiniciar.relevoAyuda}>
          <Boton tono="magenta" intenso onClick={() => setPaso('relevo')}>
            {T.reiniciar.otrasPalabras}
          </Boton>
          <Boton tono="tenue" pequeno onClick={() => setPaso('inicio')}>
            {T.reiniciar.alInicio}
          </Boton>
          <BotonPlano onClick={cerrar}>{T.reiniciar.cancelar}</BotonPlano>
        </Cuadro>
      ) : null}

      {paso === 'relevo' ? (
        <Cuadro titulo={T.reiniciar.seguro} ayuda={T.reiniciar.seguroRelevo}>
          <Boton
            tono="magenta"
            intenso
            onClick={() => {
              cerrar()
              despachar({ tipo: 'relevo/empezar' })
            }}
          >
            {T.reiniciar.siOtrasPalabras}
          </Boton>
          <BotonPlano onClick={() => setPaso('menu')}>{T.reiniciar.atras}</BotonPlano>
        </Cuadro>
      ) : null}

      {paso === 'menu' && !enRelevo ? (
        <Cuadro titulo={T.reiniciar.titulo} ayuda={T.reiniciar.ayuda}>
          {/* Rendirse va primero: es lo que de verdad se busca a mitad de una
              ronda atascada. Repartir de nuevo es la salida de emergencia. */}
          {SE_PUEDE_RENDIR.includes(estado.fase) ? (
            <Boton
              tono="alerta"
              pequeno
              nota={T.reiniciar.rendirseNota}
              onClick={() => setPaso('rendirse')}
            >
              {T.reiniciar.rendirse}
            </Boton>
          ) : null}
          <Boton tono="magenta" intenso onClick={() => setPaso('repartir')}>
            {T.reiniciar.confirmar}
          </Boton>
          <Boton tono="tenue" pequeno onClick={() => setPaso('inicio')}>
            {T.reiniciar.alInicio}
          </Boton>
          <BotonPlano onClick={cerrar}>{T.reiniciar.cancelar}</BotonPlano>
        </Cuadro>
      ) : null}

      {paso === 'rendirse' ? (
        <Cuadro titulo={T.reiniciar.seguro} ayuda={T.reiniciar.seguroRendirse}>
          <Boton
            tono="alerta"
            intenso
            onClick={() => {
              cerrar()
              despachar({ tipo: 'ronda/rendirse' })
            }}
          >
            {T.reiniciar.siRendirse}
          </Boton>
          <BotonPlano onClick={() => setPaso('menu')}>{T.reiniciar.atras}</BotonPlano>
        </Cuadro>
      ) : null}

      {paso === 'repartir' ? (
        <Cuadro titulo={T.reiniciar.seguro} ayuda={T.reiniciar.seguroRepartir}>
          <Boton
            tono="magenta"
            intenso
            onClick={() => {
              cerrar()
              despachar({ tipo: 'ronda/repartir' })
            }}
          >
            {T.reiniciar.siRepartir}
          </Boton>
          <BotonPlano onClick={() => setPaso('menu')}>{T.reiniciar.atras}</BotonPlano>
        </Cuadro>
      ) : null}

      {paso === 'inicio' ? (
        <Cuadro titulo={T.reiniciar.seguro} ayuda={T.reiniciar.seguroInicio}>
          <Boton
            tono="alerta"
            intenso
            onClick={() => {
              cerrar()
              despachar({ tipo: 'ir', fase: 'inicio' })
            }}
          >
            {T.reiniciar.siInicio}
          </Boton>
          <BotonPlano onClick={() => setPaso('menu')}>{T.reiniciar.atras}</BotonPlano>
        </Cuadro>
      ) : null}
    </Capa>
  )
}

function Capa({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-espacio/85 px-6 backdrop-blur-sm">
      <div className="aparece w-full max-w-sm">{children}</div>
    </div>
  )
}

function Cuadro({
  titulo,
  ayuda,
  children,
}: {
  titulo: string
  ayuda: string
  children: ReactNode
}) {
  return (
    <Marco tono="magenta" intenso>
      <div className="flex flex-col gap-4 px-5 py-6 text-center">
        <p className="text-xl font-semibold">{titulo}</p>
        <p className="text-sm text-tenue">{ayuda}</p>
        <div className="mt-1 flex flex-col gap-2">{children}</div>
      </div>
    </Marco>
  )
}
