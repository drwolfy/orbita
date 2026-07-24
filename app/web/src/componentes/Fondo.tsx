/**
 * Nebulosa y campo de estrellas, generados aquí mismo. Nada de imágenes: la
 * PWA tiene que abrir offline y al instante, y un render de espacio pesaría
 * más que toda la aplicación junta.
 */

/** Generador con semilla fija: las estrellas salen siempre iguales. */
function* aleatorioFijo(semilla: number): Generator<number> {
  let x = semilla
  while (true) {
    x = (x * 1664525 + 1013904223) % 4294967296
    yield x / 4294967296
  }
}

const ESTRELLAS = (() => {
  const azar = aleatorioFijo(20260718)
  return Array.from({ length: 140 }, () => ({
    x: (azar.next().value as number) * 100,
    y: (azar.next().value as number) * 100,
    r: 0.35 + (azar.next().value as number) * 1.1,
    o: 0.2 + (azar.next().value as number) * 0.7,
  }))
})()

export function Fondo() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-espacio">
      {/* Nebulosa: tres manchas de color muy difuminadas. */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(90% 60% at 15% 12%, rgba(167,139,250,0.30), transparent 60%),' +
            'radial-gradient(70% 55% at 88% 78%, rgba(34,211,238,0.22), transparent 62%),' +
            'radial-gradient(60% 50% at 60% 40%, rgba(232,121,249,0.16), transparent 65%)',
        }}
      />
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {ESTRELLAS.map((e, i) => {
          // Solo titila una de cada cinco: si parpadean todas, el fondo se
          // vuelve ruido y distrae de lo que importa.
          const titila = i % 5 === 0
          return (
            <circle
              key={i}
              cx={e.x}
              cy={e.y}
              r={e.r / 10}
              fill="white"
              opacity={e.o}
              {...(titila
                ? { className: 'titila', style: { animationDelay: `${(i % 13) * 0.42}s` } }
                : {})}
            />
          )
        })}
      </svg>
      {/* Viñeta: oscurece los bordes para que el contenido destaque. */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 50% 45%, transparent 40%, #05060f 100%)' }}
      />
    </div>
  )
}
