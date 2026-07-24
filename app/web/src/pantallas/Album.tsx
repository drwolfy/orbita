import { useState } from 'react'
import { FotoRecortada } from '../componentes/FotoRecortada'
import { Boton, BotonPlano } from '../componentes/Marco'
import { Pantalla, Panel } from '../componentes/Pantalla'
import { usePartida } from '../estado/usePartida'
import { PAREJAS, rutaImagen, tituloImagen } from '../juego/parejas'
import type { Familia } from '../juego/tipos'
import { T } from '../textos/es'

/**
 * Los créditos de la noche: las tres fotos de cada trío, juntas y con nombre.
 *
 * Es el ÚNICO sitio donde se destapan, y a propósito llega al final. Enseñarlas
 * al cerrar cada ronda sería el chiste fácil: mata la duda, que es lo que hace
 * que apetezca otra ronda (ver Cierre.tsx). Aquí ya no hay partida que
 * estropear, así que sale gratis.
 */
export function Album() {
  const { estado, despachar } = usePartida()
  const [confirmando, setConfirmando] = useState(false)

  // Un trío puede desaparecer del catálogo entre noches (foto retirada); el
  // álbum guardado se limpia solo en vez de pintar huecos.
  const jugados = estado.album
    .map((id) => PAREJAS.find((f) => f.id === id))
    .filter((f): f is Familia => Boolean(f))

  return (
    <Pantalla
      titulo={T.album.titulo}
      pie={
        confirmando ? (
          <>
            <Boton tono="alerta" intenso onClick={() => despachar({ tipo: 'album/vaciar' })}>
              {T.album.cerrar}
            </Boton>
            <BotonPlano className="self-center" onClick={() => setConfirmando(false)}>
              {T.album.volver}
            </BotonPlano>
          </>
        ) : (
          <>
            <Boton tono="cian" intenso onClick={() => despachar({ tipo: 'ir', fase: 'marcador' })}>
              {T.album.volver}
            </Boton>
            {jugados.length > 0 ? (
              <BotonPlano className="self-center" onClick={() => setConfirmando(true)}>
                {T.album.cerrarNota}
              </BotonPlano>
            ) : null}
          </>
        )
      }
    >
      {confirmando ? (
        <div className="flex flex-1 items-center">
          <Panel className="border-alerta/40 bg-alerta/5">
            <p className="text-[1.05rem] leading-relaxed">{T.album.confirmar}</p>
          </Panel>
        </div>
      ) : jugados.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-center text-tenue">{T.album.vacio}</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-6">
          <p className="text-sm text-tenue">{T.album.ayuda}</p>
          {jugados.map((familia) => (
            <Trio key={familia.id} familia={familia} />
          ))}
        </div>
      )}
    </Pantalla>
  )
}

/** Un trío: el centro grande arriba, los dos satélites debajo, todos con nombre. */
function Trio({ familia }: { familia: Familia }) {
  const satelites = familia.bandas['1'] ?? []
  const mina = familia.minas?.[0]

  return (
    <Panel>
      <Foto familia={familia} id={familia.astro} etiqueta={T.album.elCentro} grande />

      <p className="mt-4 mb-2 text-xs tracking-[0.24em] text-magenta uppercase">
        {T.album.losRaros}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {satelites.map((id) => (
          <Foto key={id} familia={familia} id={id} />
        ))}
      </div>

      {mina ? (
        <p className="mt-3 text-xs text-tenue">
          {T.album.laMina}: <span className="text-texto">«{mina}»</span>
        </p>
      ) : null}
    </Panel>
  )
}

/**
 * Aquí sí va la foto ENTERA, que es todo el chiste: durante la ronda solo se vio
 * un cuadradito de grano marrón, y al verla completa se entiende de golpe qué
 * era. Al lado, en pequeño, el recorte que se enseñó, para reconocerlo.
 */
function Foto({
  familia,
  id,
  etiqueta,
  grande = false,
}: {
  familia: Familia
  id: string
  etiqueta?: string
  grande?: boolean
}) {
  return (
    <figure>
      {etiqueta ? (
        <figcaption className="mb-2 text-xs tracking-[0.24em] text-cian uppercase">
          {etiqueta}
        </figcaption>
      ) : null}
      <div className="relative">
        <img
          src={rutaImagen(familia, id)}
          alt={tituloImagen(familia, id)}
          className={`w-full rounded-suave object-cover ${grande ? 'aspect-[4/3]' : 'aspect-square'}`}
        />
        {/* El trocito que vio la mesa, encajado en una esquina. Solo cuando hay
            recorte declarado: si la ronda enseñó la foto entera, el recuadro
            sería un duplicado exacto y no dice nada. */}
        {familia.recortes?.[id] ? (
          <FotoRecortada
            familia={familia}
            id={id}
            className={`absolute right-1.5 bottom-1.5 rounded-[0.4rem] border border-texto/50 ${
              grande ? 'h-16 w-16' : 'h-10 w-10'
            }`}
          />
        ) : null}
      </div>
      <figcaption className="mt-1.5 text-sm text-texto">{tituloImagen(familia, id)}</figcaption>
    </figure>
  )
}
