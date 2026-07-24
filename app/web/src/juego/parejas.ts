import parejasJson from '../datos/parejas.json'
import type { Familia, Recorte } from './tipos'

/**
 * El modo imágenes. La idea es la misma que con palabras —casi todos ven lo
 * mismo, alguien ve algo muy parecido— pero la ambigüedad está en de qué forma
 * parte la foto, no en qué es. Una textura no se parte en dos lecturas como se
 * parte «planta».
 *
 * Cada entrada es un TRÍO, no una pareja: con 7 jugadores o más el reparto usa
 * dos satélites y les da cosas distintas a propósito (ver reparto.ts), así que
 * hacen falta dos alternativas al astro o los dos raros se reconocen al oírse.
 */

/**
 * Las fotos viven en `src/assets/` y NO en `public/` a propósito: así Vite les
 * pone un hash de contenido en el nombre y cada cambio estrena URL.
 *
 * Con nombre fijo el despliegue no se notaba: Cloudflare cachea la foto, y como
 * `balon-basket.webp` seguía llamándose igual seguía sirviendo la vieja durante
 * horas —comprobado, 82 minutos sirviendo la anterior mientras el contenedor ya
 * tenía la nueva—. Lo mismo haría el service worker con su precache. Con hash
 * eso es imposible por construcción, sin purgar nada a mano.
 */
const ARCHIVOS = import.meta.glob('../assets/parejas/*.{webp,png,jpg,jpeg,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

/** id de la foto (el nombre del fichero, sin extensión) → URL ya con hash. */
const POR_ID = new Map<string, string>(
  Object.entries(ARCHIVOS).map(([ruta, url]) => {
    const fichero = ruta.split('/').pop() ?? ''
    return [fichero.replace(/\.[^.]+$/, ''), url]
  }),
)

/** Ruta final de una foto. Cadena vacía si el fichero no está. */
export function rutaImagen(_familia: Familia, id: string): string {
  return POR_ID.get(id) ?? ''
}

/**
 * El recorte que ve la mesa. Sin recorte declarado se enseña la foto entera,
 * que es lo que hacen las texturas de prueba.
 */
export function recorteDe(familia: Familia, id: string): Recorte {
  return familia.recortes?.[id] ?? { x: 0, y: 0, lado: 1 }
}

/**
 * Un trío incompleto no se puede repartir: si la banda 1 se queda corta, los
 * dos satélites reciben la misma foto y se delatan entre ellos en la primera
 * vuelta. Antes que jugar una ronda rota, la familia no entra en el sorteo.
 */
function completa(familia: Familia): boolean {
  const satelites = familia.bandas['1'] ?? []
  if (satelites.length < 2) return false
  if (!familia.astro) return false
  const titulos = familia.titulos ?? {}
  return [familia.astro, ...satelites].every(
    (id) =>
      // El fichero tiene que existir de verdad: una foto que falta se repartiría
      // como un hueco en blanco, y quien la recibiera no tendría nada que decir.
      POR_ID.has(id) &&
      // El título es lo único que se enseña en el álbum: sin él la ronda se
      // juega bien pero luego no hay remate.
      Boolean(titulos[id]),
  )
}

/*
 * Doble conversión a propósito: TypeScript deduce del JSON un `titulos` con las
 * claves exactas de cada trío, y esos objetos no encajan en `Record<string,
 * string>` porque las claves del otro trío le salen `undefined`. Es ruido de la
 * deducción, no un dato mal escrito — lo que sí importa lo comprueba `completa`
 * en tiempo de ejecución.
 */
const TODAS = (parejasJson.familias as unknown as Familia[]).map((f) => ({
  ...f,
  tipo: 'imagen' as const,
}))

export const PAREJAS: Familia[] = TODAS.filter(completa)

/** Tríos escritos a medias, para avisar en desarrollo en vez de callárselo. */
export const PAREJAS_INCOMPLETAS: string[] = TODAS.filter((f) => !completa(f)).map((f) => f.id)

if (import.meta.env.DEV && PAREJAS_INCOMPLETAS.length > 0) {
  console.warn(
    `[órbita] tríos de imagen incompletos, fuera del sorteo: ${PAREJAS_INCOMPLETAS.join(', ')}`,
  )
}

/** ¿Hay fotos suficientes para ofrecer el modo? Sin esto el ajuste no aparece. */
export const HAY_PAREJAS = PAREJAS.length > 0

/** Nombre de una foto dentro de su trío. Para el álbum, nunca durante la ronda. */
export function tituloImagen(familia: Familia, id: string): string {
  return familia.titulos?.[id] ?? id
}

/** Las tres fotos de un trío, la del centro primero. */
export function fotosDe(familia: Familia): string[] {
  return [familia.astro, ...(familia.bandas['1'] ?? [])]
}
