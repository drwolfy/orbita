# Órbita

### ▶ [Jugar ahora](https://orbita.imadcomputers.com) · [orbita.imadcomputers.com](https://orbita.imadcomputers.com)

Juego social de deducción para jugar alrededor de una mesa, pasando un solo
móvil. Es una evolución del clásico juego del impostor con una diferencia:

> **No hay impostor. Nadie miente. Todos recibís una palabra, pero no todos la
> misma — y nadie sabe si le ha tocado la rara.**

Quien recibe la palabra desviada da su pista **con total sinceridad**, porque
cree que está en el centro. No se trata de pillar a un mentiroso, sino de
detectar a alguien que mira el mismo objeto desde otra posición.

También trae el **modo clásico** (con impostor de toda la vida), elegible en
ajustes.

De 4 a 10 jugadores. Interfaz en español, vertical, pensada para usarse con una
mano y de noche.

La especificación completa del juego está en
[`docs/especificacion.md`](docs/especificacion.md).

## Cómo se juega

1. **Reparto** — el móvil va de mano en mano. Cada uno ve su palabra
   manteniendo el dedo pulsado (nunca con un toque, para que nadie la pille de
   reojo). Al soltar pasa solo al siguiente.
2. **Señales** — por turnos, cada uno dice en voz alta UNA palabra asociada a la
   suya. La app solo lleva el turno; no se escribe nada.
3. **Debate** — 90 segundos por defecto, configurable.
4. **Votación** — a mano alzada: alguien toca al señalado y listo.
5. **Segunda oportunidad** — si cae el desviado, todavía puede robar la ronda
   adivinando la palabra del centro. La dice en voz alta y la mesa juzga. Por
   eso no conviene ser demasiado preciso al dar la señal.
6. **Alineación** — una pantalla: quién cayó y si le habéis dado o no. Si
   fallasteis, el caído queda eliminado y **se sigue con la misma palabra**
   hasta que acertéis o lo deis por ganado.

Hay dos marcadores separados: puntos de ronda y puntos de maniobra. Se puede
perder la ronda y ganar la noche.

### El ritmo manda

La ronda está apretada a propósito, para encadenar partidas sin que decaiga:
una ronda de seis son unos **15 toques**, no cuarenta.

**La revelación contesta a una sola pregunta: ¿le habéis dado?** Sí o no, y ahí
se acaba. No se enseña la palabra del centro, ni qué palabra tenía cada uno, ni
el rol de nadie más. Si fallasteis, seguís sin saber quién era: la duda
sobrevive a la ronda y por eso apetece jugar otra.

**Por eso el marcador no sale entre rondas.** La tabla de puntos destapa lo que
la revelación se ha callado —con pocas rondas, el que va distinto es el que
era—, así que al cerrar solo se ofrece otra ronda. Los puntos se siguen sumando;
el marcador se consulta cuando queráis, con un aviso delante.

### El modo imágenes

En vez de palabras, **tríos de fotos casi iguales**: casi todos ven la textura
de una cáscara de naranja y alguien ve la de un balón de baloncesto. Nadie
miente, nadie sabe si la suya es la rara, y el grupo se confía diciendo
«rugoso», «redondo», «se agarra»… hasta que alguien suelta *«a mi mujer le gusta
el zumo»* y a uno se le cae la cara.

Arregla de paso el problema de las palabras de doble sentido: una foto no se
parte en dos lecturas: todos ven lo mismo y la duda está en de qué forma parte.

Son **tríos y no parejas** porque con 7 jugadores o más hay dos satélites y
reciben cosas distintas a propósito. Se elige en la portada: es la tercera
tarjeta, **Fotos**, junto a Órbita y Clásico, con un interruptor debajo para
mezclar rondas de fotos y de palabras. Las fotos solo se reparten en Órbita; en
clásico el impostor no tendría de dónde agarrarse, así que ahí no existe.

La regla que lo sostiene todo: **cada foto tiene que dar una sola palabra.** Si
admite dos, el núcleo se parte solo y os señaláis entre vosotros sin que nadie
sea el satélite — el mismo veneno que una palabra de doble sentido sin sentido
dominante. Por eso cada foto lleva su palabra apuntada en el JSON: es una
casilla de control al curar, **nunca se enseña ni se escribe en la partida**.

Las fotos se destapan **una sola vez, al final de la noche**, en el álbum que
sale desde el marcador. No antes: ver las tres juntas le dice a cada uno si la
suya era la rara, que es justo lo que la revelación se calla.

Cómo se escribe un trío que tenga gracia —y por qué se eligen por vocabulario
compartido y no por parecido— está en [`docs/parejas.md`](docs/parejas.md).

### El Relevo (otro juego)

Además de Órbita, en la portada hay una cuarta tarjeta: **Relevo**, que no
comparte motor con el resto —ni reparto, ni señales, ni votación, ni puntos—.

Sale lo que hay que dibujar y el móvil empieza por alguien al azar. Cada uno
tiene 5 segundos para leer y **20 para dibujar con el dedo**, viendo lo que
llevan los anteriores; al llegar a cero se captura solo y se pasa. **El último
nunca ve las palabras**: recibe el dibujo terminado, dice en voz alta lo que
cree que es, y destapa. Como se empieza por otro cada vez, el que adivina
también cambia.

No hay acertó ni falló: al destapar salen las palabras y **el dibujo turno a
turno**, con quién metió cada trazo.

Dos maneras de jugarlo, con un interruptor en la tarjeta:

- **Palabras sueltas** — 2 a 4 del diccionario, una por cada dos que dibujan
  (sin `abstractos`: «libertad» no se dibuja en 20 segundos).
- **Frases** — una situación absurda montada por piezas: *«un pingüino
  planchando en la playa»*. Son 30 sujetos × 25 acciones × 20 lugares =
  **15.000 combinaciones** con 75 palabras de curación, en
  [`src/datos/frases.json`](app/web/src/datos/frases.json).

### El modo clásico y la pista

Además de Órbita está el **modo clásico**: hay un impostor y él lo sabe. Puede
jugar a ciegas o con **una pista**, que es una asociación oblicua de la palabra:
si la palabra es `perro`, el impostor ve **`cartero`**. Nunca `correa` — la
pista tiene que hacerle deducir de qué va, no decírselo. Y no puede soltarla tal
cual, o se volvería invisible sin esforzarse.

Si prefieres la versión larga, en **Jugadores y opciones** están el voto secreto
pasando el móvil, el voto con recuento, las **maniobras** (objetivos secretos
para el debate, apagadas por defecto) y el cronómetro por señal —que reactiva el
paso a paso de la fase de señales.

## Detalles que conviene saber

- **Cada jugador es un bicho.** Su aspecto sale de su nombre —color, ojos,
  antenas, boca y silueta—, así que Marta tiene siempre el mismo. Si dos nombres
  caen en colores parecidos, la app los separa para que no te equivoques al
  votar.
- **576 palabras en 13 temas.** Se puede jugar con todas al azar (lo normal) o
  elegir temas concretos: animales, comida, casa, cultura, naturaleza, objetos,
  oficios, lugares, deporte, cuerpo, abstractos, transporte y tecnología.
- **Muchas tienen doble sentido** —`clara`, `copa`, `sierra`, `partido`,
  `cura`— y salen a pelo, sin aclarar de cuál se trata. Las bandas van siempre
  por el sentido dominante, para que el núcleo converja; el segundo sentido se
  reserva para la **pista** del modo clásico, que cuando puede cae en el solape
  de los dos (`clave`→*sol*, `raíz`→*cuadrada*, `freno`→*mano*) y deja al
  impostor sin saber por cuál tirar.
- **Las palabras no se repiten.** El móvil recuerda las que ya han salido y no
  vuelven hasta agotar el catálogo; entonces empieza un ciclo nuevo. Si juegas
  con temas concretos, el ciclo se cierra al agotar esos temas, no las 576. Esa
  memoria es **de cada dispositivo** (vive en su `localStorage`): si jugáis con
  otro móvil, ese empieza de cero. Se borra desde *Jugadores → Más opciones*.
- **Tiempo por señal y avisos sonoros**, los dos opcionales.
- **El orden de la lista de jugadores es el orden en que se pasa el móvil.**
  Se reordena con las flechas si alguien se cambia de sitio.
- Entre rondas, desde el marcador, se puede meter a quien llegue tarde sin
  perder los puntos.

## Desarrollo

```bash
cd app/web
npm install
npm run dev -- --host      # http://localhost:5173
```

Otros comandos: `npm run build` (build de producción), `npm run typecheck`,
`npm run lint` (ESLint con tipos: caza promesas sin `await`), `npm run preview`
(sirve el build ya hecho).

## Desplegar

Órbita es un sitio **100 % estático**: `npm run build` deja en `app/web/dist/`
un HTML, JS y CSS que sirve cualquier servidor web u hosting estático (Netlify,
Vercel, GitHub Pages, nginx…). No hay backend ni base de datos que configurar.

El repo incluye un `Dockerfile` que construye la app y la sirve con nginx
(usuario no-root, cabeceras de seguridad y CSP incluidas) y un
[`docker-compose.example.yml`](docker-compose.example.yml) mínimo que la publica
en el puerto 8080:

```bash
docker compose -f docker-compose.example.yml up -d --build
```

## Instalarla en el móvil

Es una PWA y funciona **100 % offline**: no hay backend, ni cuentas, ni base de
datos. Los datos del juego viajan en el propio bundle y el marcador se guarda en
`localStorage` del navegador.

- **iPhone (Safari):** Compartir → *Añadir a pantalla de inicio*.
- **Android (Chrome):** menú → *Instalar aplicación*.

## Estructura

- `app/web/` — la aplicación (Vite + React + TypeScript + Tailwind).
  - `src/juego/` — las reglas, sin nada de interfaz: reparto, maniobras,
    votación y puntuación. Es donde se toca si hay que reequilibrar el juego.
  - `src/estado/` — máquina de estados de la partida y persistencia.
  - `src/pantallas/` — una pantalla por fase.
  - `src/datos/` — `familias.json` (las palabras), `parejas.json` (los tríos de
    fotos) y `maniobras.json`.
  - `public/parejas/` — las fotos del modo imágenes.
  - `src/textos/` — todas las cadenas visibles, centralizadas por si algún día
    se traduce.
- `docs/` — especificación y notas.
- `data/` — datos persistentes (ignorado por git).

## Estado actual

Se juega una partida completa de principio a fin, en los dos modos.

Las palabras de `src/datos/familias.json` son una **semilla escrita a mano**: 576
familias repartidas en 13 temas, todos con 38 palabras o más. Ya supera el
objetivo de ≥300 del criterio de aceptación 2, así que el pipeline con LLM +
embeddings de la fase 1 pasa a ser una mejora de calidad (calibrar mejor las
bandas 2 y 3) y no un bloqueo. El formato del JSON es el definitivo.

De esas 576, unas 130 son de **doble sentido** y están al final del archivo, así
que el lote se revierte de una pieza si estorba. Pendiente de playtest: las que
no tienen un sentido claramente dominante (`corte`, `medio`, `orden`, `pista`,
`campo`, `marcha`, `golpe`) pueden partir al núcleo en dos lecturas y hacer que
os señaléis entre vosotros sin que nadie sea el satélite.

El **modo imágenes** tiene **18 tríos** (50 imágenes, generadas con Nano Banana).
Doce son de «misma forma, objeto distinto» —naranja/balón/calabaza—, cinco de
«hermanos», donde las tres cosas casi son la misma (limón/lima/pomelo) y el
desviado puede defenderse casi siempre, y uno dibujado (*caca / helado /
colmena*, la misma espiral en tres mundos distintos). Ampliar el catálogo es trabajo de
curación y no de código, y las reglas —con las tandas que se descartaron y por
qué— están en [`docs/parejas.md`](docs/parejas.md).

## Licencia y créditos

Hecho por **[Imad Computers](https://imadcomputers.com)**.

**Licencia MIT** ([`LICENSE`](LICENSE)): código totalmente abierto. Cualquiera
puede usarlo, modificarlo, distribuirlo o venderlo; la única condición es
mantener el aviso de copyright.

- **Imágenes e iconos**: generados con IA (Nano Banana / `gemini-2.5-flash-image`).
  Son objetos y texturas genéricas, sin marcas ni personajes.
- **Privacidad**: la app **no recopila ningún dato**. No hay backend, ni cuentas,
  ni cookies, ni analítica: el marcador y las palabras jugadas viven solo en el
  `localStorage` del navegador. Nada sale del dispositivo.
- **Dependencias**: React, Vite, Tailwind y zod, todas con licencia MIT.
