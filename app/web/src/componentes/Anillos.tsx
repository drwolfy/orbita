/**
 * El motivo de la marca: anillos concéntricos con cuerpos que orbitan de
 * verdad. Uno de ellos va por fuera del resto y a otro ritmo — es el chiste
 * visual del juego.
 *
 * La animación es SVG puro (animateTransform), sin JavaScript: no cuesta
 * repintados de React y sigue funcionando con la pestaña en segundo plano.
 */
/**
 * Las animaciones SMIL del SVG no las frena el CSS de `prefers-reduced-motion`,
 * así que hay que consultarlo a mano y apagarlas.
 */
function prefiereQuietud(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
  )
}

export function Anillos({ tam = 180, animado = true }: { tam?: number; animado?: boolean }) {
  const anima = animado && !prefiereQuietud()
  return (
    <svg width={tam} height={tam} viewBox="0 0 200 200" aria-hidden className="anillos">
      <defs>
        <radialGradient id="nucleo">
          <stop offset="0%" stopColor="var(--color-cian-claro)" />
          <stop offset="100%" stopColor="var(--color-cian)" />
        </radialGradient>
        <radialGradient id="halo">
          <stop offset="0%" stopColor="var(--color-cian)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-cian)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="86" fill="none" stroke="var(--color-violeta)" strokeWidth="0.6" opacity="0.3" />
      <circle cx="100" cy="100" r="62" fill="none" stroke="var(--color-cian)" strokeWidth="0.8" opacity="0.45" />
      <circle cx="100" cy="100" r="38" fill="none" stroke="var(--color-cian)" strokeWidth="1" opacity="0.7" />

      {/* Astro: el centro, con un halo que respira. */}
      <circle cx="100" cy="100" r="30" fill="url(#halo)">
        {anima ? (
          <animate attributeName="r" values="26;32;26" dur="4.5s" repeatCount="indefinite" />
        ) : null}
      </circle>
      <circle cx="100" cy="100" r="11" fill="url(#nucleo)" />
      <circle cx="100" cy="100" r="17" fill="none" stroke="var(--color-cian)" strokeWidth="0.8" opacity="0.55" />

      {/* Tres cuerpos en la órbita media, girando juntos. */}
      <g>
        {anima ? (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="34s"
            repeatCount="indefinite"
          />
        ) : null}
        <circle cx="162" cy="100" r="3.4" fill="var(--color-cian)" />
        <circle cx="69" cy="153.7" r="3.4" fill="var(--color-cian)" />
        <circle cx="69" cy="46.3" r="3.4" fill="var(--color-cian)" />
      </g>

      {/* …y el que orbita más lejos, más despacio y al revés. */}
      <g>
        {anima ? (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 100 100"
            to="0 100 100"
            dur="52s"
            repeatCount="indefinite"
          />
        ) : null}
        <circle cx="100" cy="14" r="4.6" fill="var(--color-magenta)" />
        <circle cx="100" cy="14" r="9" fill="none" stroke="var(--color-magenta)" strokeWidth="0.7" opacity="0.5">
          {anima ? (
            <animate attributeName="opacity" values="0.25;0.7;0.25" dur="3.2s" repeatCount="indefinite" />
          ) : null}
        </circle>
      </g>
    </svg>
  )
}
