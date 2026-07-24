import { Actualizacion } from './componentes/Actualizacion'
import { Fondo } from './componentes/Fondo'
import { ReiniciarRonda } from './componentes/ReiniciarRonda'
import { usePartida } from './estado/usePartida'
import { prepararSonido } from './juego/sonido'
import { useEffect } from 'react'
import { Album } from './pantallas/Album'
import { Alineacion } from './pantallas/Alineacion'
import { Cierre } from './pantallas/Cierre'
import { Debate } from './pantallas/Debate'
import { Desempate } from './pantallas/Desempate'
import { Inicio } from './pantallas/Inicio'
import { Jugadores } from './pantallas/Jugadores'
import { MarcadorPantalla } from './pantallas/MarcadorPantalla'
import { RelevoAdivinar } from './pantallas/RelevoAdivinar'
import { RelevoDibujo } from './pantallas/RelevoDibujo'
import { RelevoFinal } from './pantallas/RelevoFinal'
import { Reparto } from './pantallas/Reparto'
import { Segunda } from './pantallas/Segunda'
import { Senales } from './pantallas/Senales'
import { Tutorial } from './pantallas/Tutorial'
import { Votacion } from './pantallas/Votacion'

export function App() {
  const { estado } = usePartida()

  // iOS no deja sonar nada hasta que hay un gesto del usuario, así que el
  // primer toque en cualquier sitio despierta el audio.
  useEffect(() => {
    const despertar = () => prepararSonido()
    document.addEventListener('pointerdown', despertar, { once: true })
    return () => document.removeEventListener('pointerdown', despertar)
  }, [])

  return (
    <>
      <Fondo />
      <Actualizacion />
      <ReiniciarRonda />
      {/* La `key` remonta el contenedor en cada cambio de fase, y eso vuelve a
          disparar la animación de entrada. */}
      <main key={estado.fase} className="entra px-4">
        {pantallaDe(estado.fase)}
      </main>
    </>
  )
}

function pantallaDe(fase: ReturnType<typeof usePartida>['estado']['fase']) {
  switch (fase) {
    case 'inicio':
      return <Inicio />
    case 'jugadores':
      return <Jugadores />
    case 'tutorial':
      return <Tutorial />
    case 'reparto':
      return <Reparto />
    case 'senales':
      return <Senales />
    case 'debate':
      return <Debate />
    case 'votacion':
      return <Votacion />
    case 'desempate':
      return <Desempate />
    case 'segunda':
      return <Segunda />
    case 'alineacion':
      return <Alineacion />
    case 'cierre':
      return <Cierre />
    case 'marcador':
      return <MarcadorPantalla />
    case 'album':
      return <Album />
    case 'relevo':
      return <RelevoDibujo />
    case 'relevo-adivinar':
      return <RelevoAdivinar />
    case 'relevo-final':
      return <RelevoFinal />
  }
}
