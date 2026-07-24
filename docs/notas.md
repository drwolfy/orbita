# Notas de trabajo

## Ronda corta y revelación muda

La v1 seguía la especificación al pie de la letra y salía una ronda de **unos 40
toques** con seis jugadores. Jugando se vio que el problema no era ninguna
pantalla en concreto, sino la suma: entre ronda y ronda la mesa se enfriaba y no
apetecía repetir. El objetivo pasó a ser el ritmo de *El Impostor*: **~15
toques**.

Lo que se recortó, y por qué:

- **Votación directa** (nueva, y ahora la de por defecto). Pasar el móvil para
  votar era dar la vuelta a la mesa por segunda vez: 12 toques de los 40. Se
  vota a mano alzada y alguien toca al señalado. No hay recuento, así que
  tampoco hay pantalla de empate: si lo hay, lo deshacen hablando. El voto
  secreto y el recuento siguen en ajustes para quien los quiera.
- **Reparto sin «Listo»**. Al soltar el pulsado se pasa al siguiente. Se exige
  un mínimo de 600 ms pulsando (`MINIMO_LEIDO`) para que un roce no le pase el
  móvil al siguiente sin haber leído nada.
- **Fuera la pantalla «Comienzo»**. Existía solo para cantar quién abre; ahora
  eso lo dice la propia pantalla de señales, que ya lista el orden.
- **Señales de un vistazo**. Ir tocando «Siguiente» solo tiene sentido si hay
  cuenta atrás por turno. Sin cronómetro (el valor por defecto) se enseña la
  lista entera y se va al debate de un toque.
- **Segunda oportunidad sin teclado**. Escribir la palabra sacaba el teclado a
  mitad de partida. Se dice en voz alta y la mesa toca ACERTÓ o FALLÓ, que
  además zanja sola la discusión de si «can» vale por «perro» (por eso se pudo
  borrar `juego/texto.ts`).
- **Maniobras apagadas por defecto**. Son una buena variante, pero su
  verificación a mano al cerrar la ronda es justo lo que corta el ritmo.

### La revelación: una pregunta y una respuesta

La Alineación pasó de cinco pantallas encadenadas a una sola, y de contarlo todo
a contestar solo **¿le habéis dado?** — sí o no.

Se llegó ahí en dos pasos. Primero se quitó todo: ni rol, ni palabras, solo el
más votado y la palabra del centro. Pero eso dejaba la ronda sin cierre —la mesa
se quedaba sin saber si había acertado— y encima la palabra del centro seguía
siendo un dato de más. La versión buena es la intermedia: **se dice si el
señalado era o no el desviado, y nada más**.

Lo que se calla, y por qué:

- **El Astro.** Si se enseña, el desviado descubre que lo era aunque no le hayan
  pillado, y la duda se evapora.
- **Qué palabra tenía cada uno.** Destapa el reparto entero de un golpe.
- **El rol de los demás.** Solo se habla del señalado.

El resultado: si acertáis, hay cierre y aplauso. Si falláis, os quedáis sin
saber quién era —y esa es exactamente la sensación que hace que se pida otra
ronda.

### El marcador era la fuga, y esconder el «+N» no bastaba

Primer intento: quitar el `+N` de la última ronda y enseñar solo acumulados.
**No servía de nada.** Con una sola ronda jugada, la columna Ronda *es* el `+N`:

```
Ronda 1 →  Ana:1  Bruno:1  Clara:0  David:1  Eva:1  Fran:1
```

Simulando 200 partidas de tres rondas, el marcador seguía señalando al desviado
sin ambigüedad en **108 de 200 (54%)**: son pocos puntos y se agrupan demasiado
limpio. La fuga no estaba en cómo se pintaba la tabla, sino en enseñar puntos
por jugador entre rondas — cualquier desglose por persona destapa el reparto.

Solución: **entre rondas no hay marcador**. Al cerrar se va a `Cierre`, que solo
dice que la ronda ha terminado y ofrece OTRA RONDA. Los puntos se siguen
acumulando igual, solo se dejan de mirar.

Consultarlo sigue siendo posible —desde el menú de inicio, o desde el propio
cierre— pero con un aviso delante que explica qué se va a destapar. La idea es
que destaparse la noche sea una decisión de la mesa y no un accidente por ir
tocando botones.

### Fallar ya no acaba la ronda

Antes, señalar a un inocente cerraba la partida: se repartía palabra nueva y a
otra cosa. Se sentía cortado, sobre todo cuando la mesa estaba a punto. Ahora el
caído queda **eliminado** y se sigue con la misma palabra hasta acertar o
rendirse (§2.4b de la especificación).

Dos decisiones que se tomaron a conciencia:

- **Eliminado de verdad**, no solo descartado para votar. Es lo que hace el
  clásico y tensa la ronda. El coste es que con 5 jugadores la mesa se vacía
  rápido, y de ahí el suelo de tres (`MIN_PARA_SEGUIR`).
- **La puntuación no se tocó.** Se valoró premiar al desviado por cada inocente
  que se llevara por delante, pero añadía reglas que explicar a cambio de poco:
  rendirse ya equivale a que sobreviva, que es justo lo que la puntuación
  premiaba desde el principio. `puntuacion.ts` no necesitó ni una línea.

Después se extendió a los dos satélites: con 7+ jugadores hay que cazarlos a los
dos, y cada uno se puntúa por su cuenta (el cazado no cobra, el que sobrevive
sí). Esto sí obligó a reescribir `puntuacion.ts`: pasó de razonar sobre *un*
expulsado a razonar sobre el conjunto de cazados de toda la ronda
(`ResultadoRonda.cazados`). Con un solo satélite el resultado es idéntico al de
antes, y hay tests que lo fijan.

Detalle que se escapó al primer intento y cazaron los tests: **las maniobras no
pueden verificarse mientras la ronda siga viva**. Por eso rendirse no cierra de
golpe, sino que pone `rendido: true` y deja la revelación en pantalla para
verificarlas antes de ir al marcador.

### La pista del impostor, en dos intentos

El modo clásico ofrecía «nada» o «la categoría», y la categoría aburría: saber
que va de animales no te ayuda a decir nada, solo a no meter la pata. Se retiró
en vez de dejarla como nivel intermedio — menos ajustes que explicar en la mesa.

**Primer intento: la banda 3.** Los datos parecían tener la solución sin usar.
Cada familia trae tres bandas y la app solo consumía la 1; la 3 son asociaciones
(`correa` para `perro`), no hermanas. Sobre el papel, perfecto.

Jugando no. **Eran demasiado claras.** La banda 3 es lo que un jugador *diría
como señal*, así que entregársela al impostor se lee casi como la respuesta:
`palillos` te dice «comida japonesa», `campana` te dice «iglesia».

**Segundo intento: un campo `pista` propio**, escrito a mano para las 444, con
una regla explícita:

> Una **consecuencia**, una **sensación** o un **dicho**. Nunca una pieza de la
> cosa ni un objeto que salga en la foto.

`perro → cartero` · `café → insomnio` · `ópera → gorda` · `secreto → tumba`.

La banda 3 se dejó intacta: sigue reservada al modo avanzado y no se pisa.

**El fallo que se coló y cómo apareció.** Con las 444 escritas y el auditor en
verde, la muestra aleatoria de 25 destapó un patrón que las comprobaciones
automáticas no ven: cuando la pista es *una pieza* de la cosa, delata igual.
`silla → respaldo`, `judo → tatami`, `helicóptero → aspas`, `zapato → cordón`.
Es atrezo con otro nombre. Se repasaron las 444 buscando ese fallo concreto y se
corrigieron 16.

Moraleja para la próxima: **el auditor detecta lo mecánico** (raíces comunes,
choques con la banda 1), pero el registro solo se juzga leyéndolas en fila. La
muestra aleatoria no es burocracia, es donde salió el fallo.

### Migración de ajustes

Cambiar valores por defecto no basta: `localStorage` ya tenía guardados los
viejos. `almacenamiento.ts` lleva un `VERSION` y una función `migrar` que reescribe
**una sola vez** los ajustes afectados. No toca jugadores, marcador ni historial
de palabras. A partir de ahí manda lo que el usuario elija en ajustes.

- **v2** — `metodoVotacion` y `maniobrasActivas` a los nuevos valores.
- **v3** — `pistaImpostor: 'categoria'` ya no existe. Quien la tuviera pasa a
  `'pista'`: quería ayuda, así que se le da la nueva en vez de dejarle sin nada
  (y de paso se evita un valor inválido guardado en el móvil).
