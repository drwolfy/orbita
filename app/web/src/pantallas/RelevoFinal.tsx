import { useState } from 'react'
import { Boton, BotonPlano } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { Avatar } from '../componentes/Avatar'
import { usePartida, useNombres } from '../estado/usePartida'
import { T } from '../textos/es'

/**
 * El remate: las palabras destapadas y el dibujo creciendo turno a turno, con
 * el nombre de quien metió cada trazo. Ahí es donde se ve quién lo estropeó y
 * quién lo salvó, que es lo único que interesa saber al final.
 */
export function RelevoFinal() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const relevo = estado.relevo
  const [paso, setPaso] = useState<number | null>(null)

  if (!relevo) return null

  const total = relevo.turnos.length
  // Sin paso elegido se enseña el dibujo acabado; al tocar se recorre.
  const indice = paso ?? total - 1
  const turno = relevo.turnos[indice]

  return (
    <Pantalla
      titulo={T.relevo.finalTitulo}
      pie={
        <>
          <Boton tono="cian" intenso onClick={() => despachar({ tipo: 'relevo/empezar' })}>
            {T.relevo.otra}
          </Boton>
          <div className="flex justify-center gap-2">
            <BotonPlano onClick={() => despachar({ tipo: 'ir', fase: 'inicio' })}>
              {T.relevo.volverInicio}
            </BotonPlano>
            <BotonPlano onClick={() => despachar({ tipo: 'ir', fase: 'jugadores' })}>
              {T.relevo.jugadores}
            </BotonPlano>
          </div>
        </>
      }
    >
      <div className="flex flex-1 flex-col gap-3">
        <Panel className="shrink-0 border-cian/40 bg-cian/5">
          <p className="mb-2 text-center text-xs tracking-[0.24em] text-tenue uppercase">
            {T.relevo.eran}
          </p>
          {relevo.esFrase ? (
            <p className="text-center text-2xl leading-tight font-bold text-cian-claro">
              {relevo.palabras.join(' ')}
            </p>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
              {relevo.palabras.map((palabra) => (
                <span key={palabra} className="text-2xl font-bold text-cian-claro">
                  {palabra}
                </span>
              ))}
            </div>
          )}
        </Panel>

        {turno ? (
          <img src={turno.png} alt="" className="w-full flex-1 rounded-suave object-contain" />
        ) : null}

        {/* La repetición: un punto por turno, con la cara de quien dibujó. */}
        {total > 1 ? (
          <div className="flex shrink-0 flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {turno ? <Avatar nombre={nombreDe(turno.jugadorId)} tam={28} /> : null}
              <span className="text-sm text-texto">
                {turno ? T.relevo.dibujo(nombreDe(turno.jugadorId), indice + 1) : ''}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {relevo.turnos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPaso(i)}
                  aria-label={T.relevo.verPaso(i + 1)}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    i === indice ? 'bg-cian' : 'bg-borde'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </Pantalla>
  )
}
