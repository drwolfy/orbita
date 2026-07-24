import { useState } from 'react'
import { Anillos } from '../componentes/Anillos'
import { Boton, BotonPlano } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { usePartida } from '../estado/usePartida'
import { T } from '../textos/es'

/**
 * Entre rondas no se enseña el marcador (§4 revisado). Con pocas rondas jugadas
 * la tabla de puntos identifica al desviado sin margen de duda —el que va
 * distinto es el que era—, y eso tira por tierra que la revelación se calle los
 * roles. Los puntos se siguen sumando; solo se dejan de mirar.
 *
 * Consultarlo sigue siendo posible, pero con un aviso delante: que destaparse
 * la noche sea una decisión de la mesa y no un accidente por ir tocando.
 */
export function Cierre() {
  const { despachar } = usePartida()
  const [avisando, setAvisando] = useState(false)

  if (avisando) {
    return (
      <Pantalla
        titulo={T.cierre.avisoTitulo}
        pie={
          <>
            <Boton
              tono="alerta"
              intenso
              onClick={() => despachar({ tipo: 'ir', fase: 'marcador' })}
            >
              {T.cierre.siVer}
            </Boton>
            <BotonPlano className="self-center" onClick={() => setAvisando(false)}>
              {T.cierre.noVer}
            </BotonPlano>
          </>
        }
      >
        <div className="flex flex-1 items-center">
          <Panel className="border-alerta/40 bg-alerta/5">
            <p className="text-[1.05rem] leading-relaxed">{T.cierre.aviso}</p>
          </Panel>
        </div>
      </Pantalla>
    )
  }

  return (
    <Pantalla
      pie={
        <>
          <Boton tono="cian" intenso onClick={() => despachar({ tipo: 'ronda/repartir' })}>
            {T.cierre.otraRonda}
          </Boton>
          {/* Entre rondas es cuando llega el que se había retrasado o cuando
              alguien se cambia de sitio: se entra a la preparación sin perder
              el marcador. */}
          <Boton
            tono="magenta"
            pequeno
            nota={T.cierre.jugadoresNota}
            onClick={() => despachar({ tipo: 'ir', fase: 'jugadores' })}
          >
            {T.cierre.jugadores}
          </Boton>
          <div className="flex justify-center gap-2">
            <BotonPlano onClick={() => despachar({ tipo: 'ir', fase: 'inicio' })}>
              {T.cierre.volverInicio}
            </BotonPlano>
            <BotonPlano onClick={() => setAvisando(true)}>{T.cierre.verMarcador}</BotonPlano>
          </div>
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <Anillos tam={140} />
        <div>
          <p
            className="text-3xl font-bold tracking-[0.14em] text-cian-claro uppercase"
            style={{ textShadow: '0 0 22px rgba(34,211,238,0.45)' }}
          >
            {T.cierre.titulo}
          </p>
          <p className="mt-3 max-w-xs text-sm text-tenue">{T.cierre.ayuda}</p>
        </div>
      </div>
    </Pantalla>
  )
}
