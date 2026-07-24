import { Boton } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { usePartida, useNombres } from '../estado/usePartida'
import { esImagen } from '../juego/tipos'
import { T } from '../textos/es'

/**
 * La segunda oportunidad (§2.4). Es lo que impide que al centro le salga gratis
 * ser preciso: si la señal regala la palabra, el desviado se lleva la ronda.
 *
 * La palabra se dice en voz alta y juzga la mesa: sacar el teclado a mitad de
 * partida rompe el ritmo, y además discutir si «can» vale por «perro» lo
 * resuelven ellos mejor que cualquier comparación de la app.
 */
export function Segunda() {
  const { estado, despachar } = usePartida()
  const nombreDe = useNombres()
  const id = estado.expulsadoId
  if (!id) return null

  const esClasico = estado.ajustes.modo === 'clasico'
  const conFotos = estado.ronda ? esImagen(estado.ronda.familia) : false
  const nombre = nombreDe(id)

  return (
    <Pantalla
      titulo={T.segunda.titulo}
      pie={
        <>
          <Boton
            tono="magenta"
            intenso
            onClick={() => despachar({ tipo: 'segunda/resolver', acierto: true })}
          >
            {T.segunda.acerto}
          </Boton>
          <Boton tono="tenue" onClick={() => despachar({ tipo: 'segunda/resolver', acierto: false })}>
            {T.segunda.fallo}
          </Boton>
        </>
      }
    >
      <div className="flex flex-1 flex-col justify-center gap-5">
        <p className="text-center text-2xl font-semibold text-magenta">
          {esClasico ? T.segunda.erasClasico(nombre) : T.segunda.eras(nombre)}
        </p>

        <Panel className="border-magenta/40 bg-magenta/5">
          <p className="text-center text-[1.05rem]">
            {conFotos ? T.segunda.retoImagen : T.segunda.reto}
          </p>
        </Panel>

        <p className="text-center text-sm text-tenue">{T.segunda.enVozAlta}</p>
      </div>
    </Pantalla>
  )
}
