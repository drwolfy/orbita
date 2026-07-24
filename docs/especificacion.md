# ÓRBITA — especificación

> Documento de referencia del proyecto.
> Juego social de deducción para navegador (PWA, mobile-first, español).

> **Estado: construido y en marcha.** Los §1–§4 describen el juego **tal y como
> es hoy**, no el plan original: se actualizaron tras la primera noche de
> partidas de verdad, que obligó a acortar la ronda y a callar la revelación.
> Los §5–§8 son las fases de construcción y se dejan como registro histórico.
> El porqué de cada cambio está en [`notas.md`](notas.md).

---

## 0. Antes de empezar

Respeta las convenciones del proyecto (estructura, linting, entornos, commits).

Las fases de construcción (§5 en adelante) ya están cumplidas: la validación en
papel se hizo, el pipeline generó los datos y la app está desplegada. Para
cambios nuevos, manda lo que digan §1–§4.

### Lo que manda por encima de todo: el ritmo

Aprendido jugando, y es el criterio con el que se resuelve cualquier duda de
diseño que este documento no cubra:

1. **Una ronda son ~15 toques, no 40.** Si una pantalla no aporta una decisión,
   sobra. Ante la duda, se quita.
2. **La app no destapa a nadie más de lo imprescindible.** Si al acabar la ronda
   la mesa sabe quién era quién, la noche se acaba ahí — y el juego vive de
   encadenar rondas con la duda puesta.

---

## 1. Qué es el juego

Una evolución del clásico "juego del impostor" con una diferencia central:

> **No hay impostor. Nadie miente. Todos reciben una palabra, pero no todos
> reciben la misma — y nadie sabe si le ha tocado la rara.**

En el impostor clásico hay un culpable que sabe que lo es y que miente a
conciencia. Aquí el jugador desviado da pistas **con total sinceridad**, porque
cree que está en el centro. No se trata de pillar a un mentiroso, sino de
detectar a alguien que mira el mismo objeto desde otra posición.

La emoción que perseguimos no es *"¿quién miente?"* sino *"¿y si el raro soy yo?"*.

### Vocabulario

| Término | Significado |
|---|---|
| **Astro** | El concepto secreto de la ronda. Nadie lo ve hasta el final. |
| **Núcleo** | Jugador que ha recibido la palabra del Astro. |
| **Satélite** | Jugador que ha recibido una palabra cercana, pero distinta. |
| **Señal** | La pista de una palabra que dice cada jugador en su turno. |
| **Amplitud** | Ajuste de dificultad (ver §2, modo avanzado). |
| **Maniobra** | Objetivo secreto que recibe cada jugador (ver §3). |
| **Alineación** | La pantalla de revelación final. |

Nadie sabe su propio rol. Núcleo y Satélite son **etiquetas de la revelación**,
nunca se muestran al repartir.

---

## 2. Reglas de una ronda

### 2.1 Reparto

- 4 a 10 jugadores. Pasa-y-juega en un único dispositivo.
- La app elige un Astro y reparte: **todos reciben la palabra del Astro excepto
  uno o dos, que reciben una palabra cercana.** Número de satélites configurable
  (por defecto: 1 hasta 6 jugadores, 2 a partir de 7).
- Cada jugador ve, en la misma pantalla privada: **su palabra** y **su maniobra**
  (si están activadas; ver §3).
- Pantalla de traspaso obligatoria entre jugadores ("pasa el móvil a Marta").
- **Soltar el pulsado pasa al siguiente**, sin botón de confirmar. Se exige un
  mínimo de 600 ms pulsando para que un roce no salte el turno de nadie.
- Al terminar el reparto se va **directo a las señales**: es esa pantalla la que
  canta quién abre, no una pantalla propia.

### 2.1b La pista del impostor (solo modo clásico)

El impostor no conoce la palabra. El ajuste **«El impostor ve…»** decide cuánta
ayuda tiene:

- **Nada** — improvisa a ciegas escuchando a los demás.
- **Una pista** — recibe el campo **`pista`** de su familia: una sola palabra,
  fija, escrita a mano para esto.

**La pista es una asociación oblicua, no el atrezo.** Para `perro` no es
`correa` ni `veterinario`, es **`cartero`**. La regla al escribirlas:

> Una **consecuencia**, una **sensación** o un **dicho**. Nunca una pieza de la
> cosa ni un objeto que salga en la foto.

| | Vale | No vale |
|---|---|---|
| perro | `cartero` | `correa` *(atrezo)* |
| café | `insomnio` | `taza` *(atrezo)* |
| silla | `musical` *(el juego)* | `respaldo` *(una pieza)* |
| judo | `caída` | `tatami` *(atrezo)* |
| ópera | `gorda` *(hasta que canta la…)* | `telón` |

El impostor tiene que **deducir** de qué va, no leerlo. Con `cartero` puede
hablar de casa, de ladridos o de miedo sin saber si le ha tocado perro, buzón o
vecindario.

**No sale de las bandas.** Se probó con la banda 3 y quedaba demasiado clara:
esas palabras son buenas *señales* del juego, y como pista se leen casi como la
respuesta. La banda 2 (`gato`, `hámster`) es aún peor: son hermanas y mandarían
al impostor al dominio equivocado. Las bandas siguen intactas y sin usar más
allá de la 1.

**Al añadir o cambiar familias**, el campo `pista` es obligatorio y debe
cumplir: una sola palabra, que no sea el Astro, que no comparta raíz con él
(`hormiga`/`hormiguero` delata) y que no coincida con ninguna palabra de la
banda 1 (que es la que recibe el Satélite en modo Órbita).

**No puede decir su pista tal cual.** Si pudiera, lo rentable sería soltarla y
volverse invisible, que es precisamente lo contrario de improvisar. Es la misma
regla de la señal («ni tu palabra, ni derivados, ni sinónimos») aplicada a lo
único que él tiene.

> La opción «la categoría» existió y se retiró: saber que va de animales no
> ayuda a decir nada concreto, solo a no meter la pata. Aburría.

### 2.2 Señales

Orden de turno aleatorio, mostrado en pantalla. Cada jugador dice en voz alta
**una palabra asociada a la suya**. La app solo lleva el turno y el temporizador;
no captura texto.

Reglas de la señal, que deben aparecer literalmente en la pantalla de
instrucciones (son cuatro líneas, no las alargues):

1. Una sola palabra.
2. Ni tu palabra, ni derivados, ni sinónimos.
3. Nada de gestos ni de señalar.
4. No se repite una señal ya dicha.

**Ejemplo canónico** (úsalo en el tutorial de la app):

> Astro: `perro`. Cuatro jugadores tienen `perro`, uno tiene `lobo`.
> Ana → correa · Bruno → ladrido · **Clara → manada** · David → veterinario ·
> Eva → paseo.
> "Manada" no es absurdo, pero desafina: los demás huelen a animal doméstico.

La fase de señales se enseña **entera en una pantalla** y se pasa al debate de un
toque. El paso a paso turno por turno solo aparece si hay cronómetro por señal
activado: sin cuenta atrás no hay nada que la app tenga que llevar.

### 2.3 Debate y votación

- Temporizador de debate configurable (por defecto 90 s).
- Tres métodos de votación, elegibles en ajustes:
  - **Directa (por defecto)** — se vota a mano alzada y alguien toca al
    señalado. Una pantalla, un toque. No hay recuento, y por tanto tampoco
    pantalla de empate: si lo hay, lo deshace la mesa hablando.
  - **Pasando el móvil** — cada uno vota en secreto. Cuesta dar la vuelta a la
    mesa por segunda vez; está para quien quiera la versión larga.
  - **Con recuento** — uno anota cuántos votos saca cada jugador.

### 2.4 La regla de la segunda oportunidad

**Crítica para el equilibrio. No la omitas.**

Si el más votado resulta ser un Satélite, se le dice, y **tiene una oportunidad
de adivinar el Astro. Si acierta, gana él la ronda.**

La palabra **se dice en voz alta y la juzga la mesa** con un botón (ACERTÓ /
FALLÓ). No se escribe: sacar el teclado a mitad de partida rompe el ritmo, y de
paso se acabó la discusión de si «can» vale por «perro».

Por qué existe: sin ella, a los Núcleos les conviene ser lo más precisos posible
y exponen al Satélite en la primera vuelta siempre. Con ella, una señal demasiado
específica regala la palabra. Los Núcleos deben ser lo bastante concretos para
reconocerse entre ellos y lo bastante ambiguos para no servir el Astro en bandeja.
**Esa cuerda floja es el juego.**

### 2.4b Fallar no acaba la ronda

Si el señalado **no** era el desviado, la ronda **no se cierra**: se sigue con la
**misma palabra**.

- El señalado por error queda **eliminado**: ni debate, ni voto, ni se le puede
  volver a señalar. Sigue puntuando si al final la mesa acierta.
- Se vuelve al debate con los que quedan y se vota otra vez, tantas veces como
  haga falta.
- La mesa puede **darlo por ganado** en cualquier momento: el desviado se lleva
  la ronda y se pasa a otra palabra.
- **Suelo de tres.** Si eliminar dejaría menos de tres en pie, la ronda se acaba
  y gana el desviado: con dos, la votación ya no decide nada.

**Con dos satélites (7+ jugadores) hay que cazar a los DOS.** Pillar a uno no
cierra la ronda: se sigue buscando al que queda. La excepción es la segunda
oportunidad — si un cazado adivina el Astro, roba la ronda y se acaba ahí aunque
el otro siga suelto.

**Puntos, cada uno por su cuenta:**

| Situación | Núcleos | Satélite cazado | Satélite vivo |
|---|---|---|---|
| Cazáis a todos | +1 | 0 | — |
| Cazáis a uno y os rendís | 0 | 0 | +2 |
| Un cazado adivina el Astro | 0 | +2 | +2 |

Al Núcleo le da igual cuántos intentos gaste: cazarlos vale 1 punto tarde lo que
tarde. Un Núcleo eliminado por error **sigue cobrando** si la mesa acaba
acertando.

### 2.5 Alineación (revelación)

**Una sola pantalla, y contesta a una sola pregunta: ¿le habéis dado?**

1. Quién fue el más votado.
2. **Sí o no**: si era o no el desviado. En modo clásico, si era o no el
   impostor.
3. Si lo era: en qué quedó su intento de adivinar el Astro (la mesa acaba de
   verlo, así que no destapa nada nuevo).
4. Las maniobras, si están activadas **y la ronda acaba aquí**: mientras se
   pueda seguir buscando (§2.4b) todavía están en juego y no se verifican.

Si no le habéis dado, esta pantalla es también donde se decide seguir buscando o
darlo por ganado.

**Lo que NO se enseña, y es deliberado:**

- **El Astro.** Ni la palabra del centro, ni qué palabra tenía cada jugador.
- **El rol de los demás.** Solo se dice del señalado, y solo en binario.

El diseño original revelaba todo esto por partes, con ritmo, como momento
culminante de la ronda. Jugando se vio que era justo lo que mataba la noche: una
vez la mesa sabe el reparto completo, la ronda siguiente empieza emocionalmente
de cero. Callándolo, quien tenía la palabra rara se queda con la duda —«¿era yo
el raro?»— y esa duda es lo que hace que apetezca otra ronda.

---

## 3. Maniobras

Cada jugador recibe una **maniobra**: un objetivo secreto que cumplir durante la
partida.

> **Apagadas por defecto.** Se implementaron enteras y funcionan, pero son una
> **variante opcional**, no el juego base. El motivo es de ritmo: las maniobras
> verbales y de comportamiento las verifica el grupo, y esa ronda de preguntas
> («¿lo cumplió?», jugador por jugador) al cerrar cada partida es justo lo que
> corta el enganche. Quien las quiera, las enciende en ajustes.

### 3.1 Dos reglas estructurales

**a) Las maniobras NO tocan la fase de señales.** Nunca condicionan la pista.
Viven exclusivamente en el debate y la votación. Si contaminan la señal,
la deducción se vuelve aleatoria y el juego se rompe.

**b) Las recibe TODO EL MUNDO.** Si solo uno tiene maniobra, se le ve venir. Si
todos tienen una, el comportamiento raro deja de ser evidencia — y eso da
coartada al Satélite. El caos tapa la señal, no la sustituye.

### 3.2 Catálogo

**Dirigidas al voto** (la app las verifica sola, ya registra los votos):

- Consigue que voten a `{jugador}`.
- Consigue que nadie vote a `{jugador}`.
- Consigue que te voten a ti.
- Consigue un empate.

**Verbales** (verificación por el grupo en la Alineación):

- Consigue que alguien diga "`{palabra}`".
- Haz que digan tu nombre tres veces.
- Que nadie te dirija la palabra en todo el debate.

**De comportamiento** (verificación por el grupo):

- No hables hasta que queden 60 segundos.
- Sé el primero en acusar a alguien.
- Contradice a la primera persona que hable.
- Defiende públicamente a `{jugador}`.

### 3.3 Tres variantes (impleméntalas como opciones activables)

- **Maniobras enfrentadas** — dos jugadores reciben objetivos opuestos sobre la
  misma persona. Ninguno sabe que el otro existe.
- **Maniobra pública** — una maniobra se muestra en pantalla a toda la mesa
  ("alguien tiene que conseguir que se diga 'lunes'"). Todos saben el qué,
  nadie el quién.
- **Maniobra heredada** — al expulsado se le transfiere la maniobra a quien le
  votó, que se entera a mitad de partida.

### 3.4 Diseño de maniobras

Una maniobra debe **estorbar** al objetivo principal del jugador. Si le ayuda a
ganar la ronda, son puntos gratis y no hay decisión que tomar.

En v1 la maniobra se entrega **junto con la palabra**, en la misma pantalla del
reparto. Las maniobras enviadas en vivo a mitad de debate requieren un
dispositivo por persona: eso es fase posterior, no lo implementes.

---

## 4. Puntuación

Dos marcadores **separados**:

- **Puntos de ronda** — Núcleos aciertan / Satélite sobrevive / Satélite adivina
  el Astro tras ser expulsado.
- **Puntos de maniobra** — independientes. Permiten perder la ronda y ganar la
  noche, lo que mantiene enganchado a quien ya no puede ganar por deducción.

Marcador acumulado entre rondas, persistente en `localStorage`.

### El marcador NO se enseña entre rondas

Los puntos se suman siempre, pero al cerrar la ronda se va a una pantalla que
solo ofrece **otra ronda**. Consultar el marcador es posible en cualquier
momento, con un aviso delante que explica lo que va a destapar.

Suena excesivo y no lo es: **la tabla de puntos destapa el reparto de la noche**
y tira por tierra todo lo que §2.5 se calla. Con una ronda jugada es evidente
—el que va distinto es el que era—:

```
Ronda 1 →  Ana:1  Bruno:1  Clara:0  David:1  Eva:1  Fran:1
```

Y no se arregla solo con el tiempo: simulando 200 partidas de tres rondas, el
marcador seguía señalando al desviado sin ambigüedad en **108 de 200 (54 %)**.
Son pocos puntos y se agrupan demasiado limpio.

**Aviso para quien toque esto:** esconder el «+N de esta ronda» y dejar solo los
acumulados **no sirve** — ya se probó. Con pocas rondas, la columna acumulada
*es* el «+N». La única solución que funciona es no enseñar puntuaciones por
jugador mientras la noche está en marcha.

---

> **§5–§8: registro histórico**, salvo §6. Se conservan porque explican por qué
> el proyecto está montado como está, pero ya no son instrucciones que seguir.
> **§6 (el pipeline de datos) sigue pendiente de verdad**: las palabras son una
> semilla escrita a mano.

## 5. Fase 0 — validación en papel (bloqueante) — ✅ hecha

**Antes de escribir una línea de código**, quiero jugar esto en papel:

- Cinco papelitos: `perro` en cuatro, `lobo` en uno.
- Seis maniobras escritas a mano.
- Dos rondas sin maniobras, dos con ellas.

Lo que estoy comprobando:

1. ¿Se entiende sin explicación larga?
2. ¿La ronda tiene un final satisfactorio, o acaba en encogimiento de hombros?
3. ¿Las maniobras animan la partida, o la mesa se olvida de deducir y se
   convierte en un circo vacío? *(Si pasa esto: dar maniobra solo a la mitad
   del grupo.)*

Genérame el material imprimible para esta prueba y **espera mis resultados antes
de continuar.** No avances a la fase 1 por tu cuenta.

---

## 6. Fase 1 — pipeline de datos (`/pipeline`) — ⚠️ pendiente

> **Ojo: esta fase NO está hecha.** La app funciona con una **semilla escrita a
> mano de 444 familias** (`app/web/src/datos/familias.json`, con
> `"origen": "semilla escrita a mano, pendiente de sustituir por el pipeline"`).
> Las tres bandas existen y son de buena calidad, pero son artesanales, no
> generadas por embeddings. Lo que sigue describe el pipeline que las
> sustituiría.

Script Python que se ejecuta **una sola vez en local, en la GPU**, y produce un
JSON estático. Nada de esto corre en el navegador.

**Objetivo:** ~300 familias de palabras en español. Cada familia: un Astro y
candidatos agrupados en bandas 1, 2 y 3 por distancia semántica.

> **Sigue siendo cierto: la app solo consume la banda 1.** La pista del impostor
> (§2.1b) no sale de las bandas, va en un campo `pista` aparte. El pipeline
> tendría que generarlo también, y no es un problema de similitud coseno: una
> pista buena es una consecuencia o un dicho, no un vecino semántico. Lo más
> probable es que haya que escribirlas o generarlas con un modelo de lenguaje,
> no con embeddings.

> La app v1 **solo consume la banda 1**. Genera igualmente las tres: el coste es
> el mismo y deja listo el modo avanzado (Cometa = banda 2, Errante = banda 3,
> ajustable con el parámetro de Amplitud).

### Enfoque híbrido — no lo simplifiques

1. **Candidatos con LLM** — para cada Astro, pide a la API de Anthropic
   (`claude-sonnet-4-6`) ~25 candidatos relacionados, cubriendo distintos grados
   de cercanía.
2. **Bandeado con embeddings** — calcula embeddings con `sentence-transformers`
   (`intfloat/multilingual-e5-large` o `paraphrase-multilingual-mpnet-base-v2`) y
   agrupa por similitud coseno en bandas, con umbrales configurables.
3. **Filtros de calidad** — descarta variantes morfológicas del Astro (plurales,
   diminutivos, misma raíz), términos de más de dos palabras, repeticiones entre
   bandas, y candidatos fuera del rango útil de similitud.

**Por qué híbrido:** los vecinos más próximos en embeddings puros devuelven basura
(plurales, coocurrencias, erratas). El LLM aporta candidatos con sentido; los
embeddings aportan la *calibración* de distancia, que el LLM no hace de forma
consistente.

### Requisitos técnicos

- GPU: RTX 5060 Ti (Blackwell, `sm_120`). **Instala PyTorch con CUDA 12.8 o
  superior** desde el índice correspondiente; el índice por defecto de pip compila
  contra targets que esta tarjeta no soporta. Verifica con
  `torch.cuda.get_device_capability()` antes de nada.
- Entorno aislado (venv o uv, según el `CLAUDE.md`).
- Clave de API desde variable de entorno, **nunca hardcodeada**.
- Cachea las respuestas del LLM en disco: regenerar no debe costar dinero dos veces.

### Output

`data/families.json`:

```json
{
  "version": 1,
  "families": [
    {
      "id": "perro",
      "astro": "perro",
      "categoria": "animales",
      "pista": "cartero",
      "bandas": {
        "1": ["lobo", "zorro"],
        "2": ["mamífero", "veterinario"],
        "3": ["correa", "manada"]
      }
    }
  ]
}
```

El campo `pista` (§2.1b) es **obligatorio** y no se genera con embeddings: no es
un vecino semántico sino una consecuencia o un dicho. Si el pipeline lo produce,
que sea con el LLM y validando las cuatro reglas de §2.1b.

También `data/maniobras.json`, con plantillas y sus reglas de verificación
(automática por voto / manual por el grupo).

**Entregable adicional obligatorio:** un script que imprima 30 familias al azar
en formato legible, para que yo las revise a ojo.

---

## 7. Fase 2 — aplicación web (`/app`) — ✅ hecha

- **Vite + React + TypeScript + Tailwind.**
- **PWA** con `vite-plugin-pwa`: instalable, 100 % offline, manifest e iconos
  correctos. Debe funcionar en **Safari iOS**, no solo en Chrome Android.
- **Sin backend, sin cuentas, sin base de datos.** Los JSON van en el bundle.
  Marcador y ajustes en `localStorage`.
- **Mobile-first, vertical, uso con una mano** — el móvil se pasa de mano en mano.
  Áreas táctiles grandes.
- **Modo oscuro por defecto.** Se juega de noche.
- Interfaz en español, cadenas centralizadas por si luego internacionalizamos.
- Identidad visual: anillos concéntricos. Elige una dirección con intención,
  huye del aspecto de plantilla genérica.

### UX que no debes saltarte

- La palabra se revela **manteniendo pulsado**, no con un toque. Evita que la vean
  de reojo.
- Pantalla de traspaso obligatoria entre jugadores.
- Botón de deshacer en el reparto.
- Tutorial de una pantalla con el ejemplo del perro de §2.2.

---

## 8. Fase 3 — despliegue (`/deploy`) — ✅ hecha

- `Dockerfile` multi-stage: build de Vite → nginx sirviendo el estático.
- `docker-compose.yml` de ejemplo para levantarlo y probar desde el móvil.
- Cabeceras de caché correctas para el service worker — el fallo clásico de las
  PWA es servir un `sw.js` cacheado y quedarse con una versión vieja para siempre.

---

## 9. Fuera de alcance

No implementes nada de esto todavía:

- Modo avanzado con bandas 2 y 3 (Cometa, Errante) — los datos se generan, la UI no.
- Maniobras entregadas en vivo durante el debate.
- Multijugador online, salas, códigos, WebSockets.
- Cuentas, backend, base de datos.
- Monetización, anuncios, compras.
- Idiomas distintos del español.

---

## 10. Criterios de aceptación

1. La prueba en papel de la fase 0 confirma que el juego es divertido. **Si no lo
   es, paramos y rediseñamos — no seguimos.**
2. El pipeline produce `families.json` con ≥300 familias válidas, y al revisar 30
   al azar las bandas coinciden con la intuición humana de cercanía.
3. La app funciona offline en un iPhone añadida a la pantalla de inicio, y permite
   jugar una partida completa de 5 jugadores sin filtrar información.
4. Alguien que no ha jugado nunca entiende las reglas sin que yo se las explique.

---

## 11. Cómo quiero trabajar

Empieza por el material de la fase 0 y **espera mis resultados**. Después,
propón estructura de directorios y plan de la fase 1, y espera mi visto bueno
antes de escribir código. Avanza por fases, parando al final de cada una.

Si detectas un problema de diseño que yo no he visto — que con 4 jugadores se
rompe, que la banda 1 es indistinguible del ruido, que una maniobra es imposible
de verificar — **dímelo en vez de implementarlo igualmente.** Prefiero
descubrirlo ahora que dentro de dos semanas.
