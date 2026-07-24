import { T } from '../textos/es'
import { Avatar } from './Avatar'
import { Boton, BotonPlano } from './Marco'
import { Pantalla } from './Pantalla'

/**
 * Pantalla de traspaso obligatoria entre jugadores (§2.1). Es la que impide
 * que la palabra del anterior siga en pantalla cuando el móvil cambia de manos.
 */
export function Traspaso({
  nombre,
  progreso,
  onListo,
  onAtras,
}: {
  nombre: string
  progreso?: string
  onListo: () => void
  onAtras?: () => void
}) {
  return (
    <Pantalla
      pie={
        <>
          <Boton tono="cian" intenso onClick={onListo}>
            {T.traspaso.soy(nombre)}
          </Boton>
          {onAtras ? <BotonPlano onClick={onAtras}>{T.traspaso.atras}</BotonPlano> : null}
        </>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
        <Avatar nombre={nombre} tam={132} />
        <div>
          <p className="text-2xl font-semibold text-texto">{T.traspaso.pasaA(nombre)}</p>
          <p className="mt-3 text-sm text-tenue">{T.traspaso.nadieMire}</p>
        </div>
        {progreso ? (
          <p className="text-xs tracking-[0.3em] text-tenue uppercase">{progreso}</p>
        ) : null}
      </div>
    </Pantalla>
  )
}
