import { Avatar } from '../componentes/Avatar'
import { Boton, BotonPlano } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { usePartida } from '../estado/usePartida'
import { T } from '../textos/es'

/**
 * Dos marcadores separados y los dos a la vista (§4): se puede perder la ronda
 * y ganar la noche por maniobras.
 */
export function MarcadorPantalla() {
  const { estado, despachar } = usePartida()
  const { marcador } = estado

  const filas = estado.jugadores
    .map((j) => {
      const ronda = marcador.ronda[j.id] ?? 0
      const maniobra = marcador.maniobra[j.id] ?? 0
      return { ...j, ronda, maniobra, total: ronda + maniobra }
    })
    .sort((a, b) => b.total - a.total)

  return (
    <Pantalla
      titulo={T.marcador.titulo}
      pie={
        <>
          <Boton tono="cian" intenso onClick={() => despachar({ tipo: 'ronda/repartir' })}>
            {T.marcador.otraRonda}
          </Boton>
          {/* Entre rondas es cuando llega el que se había retrasado o cuando
              alguien se cambia de sitio: se entra a la preparación sin perder
              el marcador. */}
          <Boton
            tono="magenta"
            pequeno
            nota={T.marcador.jugadoresNota}
            onClick={() => despachar({ tipo: 'ir', fase: 'jugadores' })}
          >
            {T.marcador.jugadores}
          </Boton>
          {/* El álbum vive aquí y no en el cierre de ronda a propósito: ver las
              tres fotos juntas le dice a cada uno si la suya era la rara, que es
              justo lo que la revelación se calla. A esta pantalla solo se llega
              con el aviso de que destapa la noche, así que es el sitio. */}
          {estado.album.length > 0 ? (
            <Boton
              tono="violeta"
              pequeno
              nota={T.cierre.albumNota(estado.album.length)}
              onClick={() => despachar({ tipo: 'ir', fase: 'album' })}
            >
              {T.cierre.verAlbum}
            </Boton>
          ) : null}
          <div className="flex justify-center gap-2">
            <BotonPlano onClick={() => despachar({ tipo: 'ir', fase: 'inicio' })}>
              {T.marcador.volverInicio}
            </BotonPlano>
            <BotonPlano
              onClick={() => {
                if (confirm(T.marcador.confirmarReinicio)) {
                  despachar({ tipo: 'marcador/reiniciar' })
                }
              }}
            >
              {T.marcador.reiniciar}
            </BotonPlano>
          </div>
        </>
      }
    >
      <Panel>
        <div className="mb-2 flex items-center gap-3 text-xs tracking-[0.16em] text-tenue uppercase">
          <span className="flex-1" />
          <span className="w-12 text-center">{T.marcador.ronda}</span>
          <span className="w-12 text-center">{T.marcador.maniobra}</span>
          <span className="w-12 text-center text-cian">{T.marcador.total}</span>
        </div>

        {/* Sin el «+N» de la última ronda: quien acabara de sumar sería justo
            el que la revelación se ha callado. Solo acumulados. */}
        <ul className="flex flex-col">
          {filas.map((fila) => (
            <li
              key={fila.id}
              className="flex items-center gap-3 border-t border-borde/50 py-3 first:border-0"
            >
              <Avatar nombre={fila.nombre} tam={32} />
              <span className="flex-1 truncate">{fila.nombre}</span>
              <span className="w-12 text-center tabular-nums text-tenue">{fila.ronda}</span>
              <span className="w-12 text-center tabular-nums text-tenue">{fila.maniobra}</span>
              <span className="w-12 text-center text-lg tabular-nums text-cian">{fila.total}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </Pantalla>
  )
}
