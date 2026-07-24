# Cómo se escribe un trío de imágenes

El código del modo imágenes está hecho y no hay que volver a tocarlo. Lo que
decide si el modo tiene gracia es **este documento**: qué fotos entran.

## La regla número uno: una foto, UNA palabra

Todos los del núcleo tienen que pensar **exactamente la misma palabra**. Con
palabras escritas eso sale gratis: reciben `naranja` y piensan «naranja». Con
una foto no, porque una foto puede dar pie a varias.

Es el mismo problema que las palabras de doble sentido sin sentido dominante
—`planta`, `corte`, `medio`— colado por la puerta de atrás: si la mitad de la
mesa lee una cosa y la otra mitad otra, se señalan entre ellos sin que ninguno
sea el satélite, y la ronda es un sorteo.

**«Bosque desde el aire» se descartó por esto.** Uno piensa *bosque*, otro
*árboles*, otro *copas*, otro *selva*. Ninguno miente y todos desafinan. La piel
de naranja y el balón de baloncesto no tienen ese problema: todo el mundo dice
*naranja*, todo el mundo dice *balón*.

Por eso cada foto lleva su palabra en `palabras` dentro del JSON. **No se enseña
nunca ni se escribe en la partida** —el juego sigue siendo todo en voz alta—: es
una casilla de control al curar. Si al rellenarla dudas entre dos palabras, ese
trío está descartado antes de generar nada.

Ampliar ayuda a fijar la palabra: la piel de naranja a sangre es *naranja*; la
naranja entera sobre una mesa podría ser *fruta*, *cítrico* o *desayuno*.

## Y que se reconozca sola

**Quien tiene la foto tiene que saber lo que tiene.** Igual que con las palabras:
recibes `perro` y sabes perfectamente sobre qué estás dando tu pista.

Esto se aprendió fallando. La primera tanda eran polvos —café, tierra, cacao,
sal, azúcar, coco— ampliados hasta que la textura llenaba el cuadro. En la mesa
nadie sabía qué tenía, así que nadie podía dar una pista sincera de nada: cinco
personas mirando una papilla y diciendo «blanco». No había deducción posible
porque no había nada que deducir.

El error de fondo fue perseguir que las tres fueran indistinguibles **entre sí**
y acabar haciéndolas indistinguibles **a secas**.

Lo que sí funciona son **cosas distintas que se parecen**, y las dos se
reconocen: piel de naranja contra balón de baloncesto. Tú *sabes* que tienes una
naranja, y por eso puedes decir «a mi mujer le gusta el zumo» y por eso tiene
gracia.

### Los satélites, tan icónicos como el centro

Segunda vez que se falló lo mismo, y por eso va aparte. Un trío puede tener el
centro perfecto y morirse igual si el satélite es **un objeto que la gente no
sabe nombrar**.

Pasó con una *pelota de masaje* (una goma naranja con tetones) y con un
*romanesco*. Las dos texturas casaban de maravilla con su trío… y quien las
recibía se quedaba mudo, porque no sabía qué tenía. Un balón de baloncesto
funciona justamente porque lo reconoce todo el mundo al instante.

La prueba: **¿lo nombraría cualquiera de la mesa en dos segundos?** Si hay que
explicarlo, fuera. Y esto vale sobre todo para los satélites, porque son los que
más veces le tocan a alguien que no está sobre aviso.

### Acercarse mucho está bien; elegir mal el material, no

No es cuestión de cuánto amplías. Es de si esa textura **tiene firma propia**:

- La piel de una naranja ampliada al máximo sigue siendo inconfundible.
- La sal ampliada al máximo no es nada. Ni la harina, ni el azúcar, ni la nieve.

Si al mirar el recorte tú mismo no sabrías qué es, ese material no vale para el
juego por muy bonito que quede.

### La distancia se elige por objeto, no por regla fija

**Los objetos piden distancia; los materiales piden cercanía.**

Un césped, un musgo, una piel de naranja o una pared de ladrillos son
*superficie*: no tienen forma que enseñar y funcionan pegadísimos. Un balón de
baloncesto, un brócoli o una coliflor son *objetos*: su identidad está en la
silueta, y de cerca no son más que goma naranja o grumos verdes.

La regla es **lo más cerca posible sin dejar de reconocerse**, y eso se decide
foto a foto. Se probó a rajatabla con el macro extremo y falló: el balón y el
brócoli no había quien los nombrara.

Para los objetos, la plantilla es otra —el objeto entero llenando el cuadro, sin
recortarlo y sin fondo alrededor— y está en un script auxiliar de generación, no aquí,
pero se resume en:

```
A square photograph of {objeto}, framed so the object itself fills the entire
picture from edge to edge, with none of it cut off short and no background
around it at all. It is close enough that {el rasgo} is clearly visible, but far
enough back that the overall shape is obvious at a glance.
```

**Efecto secundario conocido:** los objetos así suelen salir con algo de fondo
liso alrededor, mientras que los materiales van a sangre. Dentro de un mismo
trío eso mezcla registros. No es grave —cada jugador ve solo la suya, así que no
le dice nada— pero se nota en el álbum del final. Lo limpio sería que un trío
fuese **todo objetos o todo materiales**; ahora mismo *naranjas* y *verdes* los
mezclan.

### Todas en el mismo registro

Las tres tienen que estar rodadas igual: **textura llenando el cuadro, sin
fondo y sin que se vea el borde del objeto**. Si una sale como foto de producto
—el objeto entero sobre fondo blanco— y otra como textura a sangre, quien tenga
cada una no está jugando al mismo juego.

## La segunda regla: el vocabulario que comparten

**No se eligen por parecerse. Se eligen por el vocabulario que comparten.**

Es el error fácil y cuesta una noche de fotos: buscas dos texturas que se vean
igual, quedan preciosas, y en la mesa nadie sabe qué decir. La ronda muere en
silencio, que es lo contrario de gracioso.

Un trío bueno tiene:

- **Ocho palabras que valen para las tres fotos.** Son las que dejan que la
  ronda dure, que la gente se confíe y que el satélite se crea a salvo.
- **Dos o tres minas.** Palabras que encajan perfectas en una foto y son
  absurdas en las otras. Son el chiste.

Si al escribir el trío no te salen las seis comunes, **el trío no está listo**.
No lo fotografíes todavía. Por eso `parejas.json` te pide `comunes` y `minas`:
no es documentación, es el filtro.

## Por qué trío y no pareja

Con 7 jugadores o más, el reparto usa dos satélites y les da cosas **distintas**
a propósito — si compartieran foto se reconocerían al oírse. Así que cada
entrada necesita el centro y **dos** alternativas.

Y encima es más divertido: no hay un raro contra el grupo, hay tres
conversaciones creyendo que son una. Alguien dice «cráteres» y dos personas
distintas asienten por motivos distintos.

## Los tres motores de humor

**Escala.** El salto bueno no es «son cosas distintas», es «son cosas que no
caben en el mismo mundo». Café molido y tierra de maceta se ven igual; uno te lo
bebes y el otro tiene lombrices.

**Dignidad.** Alguien describiendo con respeto algo asqueroso. Una toalla y la
lengua de un gato: el satélite dice «es suave, da gusto tocarlo», en serio.

**Cotidiano contra épico.** El que más se ríe. Fideos y los cables de detrás de
la tele. Sal gorda y un campo de nieve. Uno está teniendo un momento místico y
el otro describe el desorden de su salón.

## Niveles

Por orden de dificultad para fabricarlas, y de menos a más riesgo:

1. **Textura** — la más agradecida y la más fácil. Empieza por aquí.
2. **Concepto** — la punta de una cosa que forma parte de otra mayor. Funciona
   muy bien, pero necesita que la foto no destape el conjunto.
3. **Forma** — siluetas abstractas. La más difícil: si el satélite ve una mancha
   sin identidad, no tiene *nada* que decir y se delata en la primera vuelta sin
   gracia. Déjala para cuando las otras dos funcionen.

## Candidatas ya diseñadas

Todas fotografiables en casa, sin líos de derechos. La columna de la derecha es
la mina que hay que proteger al elegir el encuadre.

| Centro | Satélites | La mina |
|---|---|---|
| café molido | tierra de maceta · canela molida | *«me lo tomo por la mañana»* |
| fideos secos | cables detrás de la tele · ramas secas | *«hervir»* |
| estropajo verde | césped muy de cerca · alfombra de pelo | *«lo piso descalzo»* |
| sal gorda | nieve · azúcar | *«resbala»* |
| corcho de botella | pan de molde · esponja | *«lo mojo»* |
| papel de aluminio arrugado | mar desde el avión · papel de plata de un bombón | *«brilla»* |
| burbujas de gaseosa | estrellas · lunares de un vestido | *«suben»* |
| miel cayendo | ámbar con un bicho · resina de un pino | *«dulce»* |
| dibujo de un neumático | suela de zapatilla · rejilla del desagüe | ⚠ ver abajo |
| cremallera | raspa de pescado · columna en una radiografía | *«se abre»* |

**Ojo con la del neumático:** es *demasiado* buena. Comparten tantas palabras
que puede no explotar nunca y quedarse en tablas. Necesita al menos una mina
evidente o no vale.

**La de la cremallera** es la favorita: los tres dicen «dientes», «va por el
medio», «se abre», y los tres tienen razón.

## Los dos momentos: recorte y foto entera

Se guarda **una sola foto** por imagen, y se enseña de dos maneras distintas:

- **Durante la ronda**, solo un cuadradito de esa foto, muy ampliado. De cerca
  una textura no se reconoce, que es de lo que va el juego.
- **En el álbum del final**, la foto **entera**, con su cuchara, sus granos y
  todo lo que haga falta. Ahí se entiende de golpe qué era.

Esto resuelve la tensión que parecía irresoluble: la foto tiene que ser
ambigua para jugar pero inconfundible para el remate. No hay que elegir — van
en momentos distintos.

Y de paso hace las fotos **mucho más fáciles de hacer**: no tienes que clavar el
encuadre al disparar, porque el recorte se elige después, y se elige mirando.

## Cómo se fotografía

- **Dispara el objeto entero y bien reconocible.** Antes decía lo contrario;
  estaba equivocado. El plano cerrado lo pone el recorte, no la cámara.
- **Que la textura llene el cuadro** aunque el objeto se reconozca: hace falta
  superficie de sobra donde elegir el recorte.
- **Que el trío comparta color y tono.** Es el eje que más se olvida: si una
  sale dorada y otra gris, el satélite canta a la primera aunque el encuadre
  esté clavado.
- **Todo enfocado**, nada de desenfoque de fondo: crea un centro de atención y
  eso delata dónde mirar.
- **Cuadrada**, apaisada no: el móvil se ve en vertical.
- **WebP, lado largo 1600 px.** Pesa poco y sobra resolución para ampliar el
  recorte.
- Nada de marcas, etiquetas ni manos.

## Cómo se elige el recorte

`recortes` guarda, por foto, un cuadrado en fracciones del lado (0 a 1):

```json
"recortes": { "cafe-molido": { "x": 0.62, "y": 0.18, "lado": 0.22 } }
```

`lado: 0.22` enseña algo más de una quinta parte del ancho. Como referencia,
entre `0.15` y `0.30` suele quedar en el punto en que la textura se lee pero el
objeto no se reconoce.

Para elegirlo, mira la foto en una rejilla y busca **el trozo más aburrido**: el
que no tiene ningún elemento identificable. Si toda la foto está sembrada de
elementos que delatan —como los granos enteros de café— entonces esa foto no
sirve, por bonita que sea.

Los tríos de prueba no llevan `recortes` y se enseñan enteros; es el
comportamiento por defecto.

## Cómo se mete en el juego

1. Las fotos van a `app/web/public/parejas/`, con el id como nombre de fichero.
2. La entrada va a `app/web/src/datos/parejas.json`.
3. Si la extensión no es `.svg`, hay que pasársela a `rutaImagen()` en
   [`app/web/src/juego/parejas.ts`](../app/web/src/juego/parejas.ts).

```json
{
  "id": "img-molido",
  "tipo": "imagen",
  "formato": "webp",
  "categoria": "texturas",
  "pista": "",
  "astro": "cafe-molido",
  "bandas": { "1": ["tierra-maceta", "cacao"], "2": [], "3": [] },
  "titulos": {
    "cafe-molido": "café molido",
    "tierra-maceta": "tierra de maceta",
    "cacao": "cacao en polvo"
  },
  "recortes": {
    "cafe-molido": { "x": 0.62, "y": 0.18, "lado": 0.22 },
    "tierra-maceta": { "x": 0.30, "y": 0.55, "lado": 0.22 },
    "cacao": { "x": 0.11, "y": 0.40, "lado": 0.22 }
  },
  "comunes": ["marrón", "polvo", "seco", "montón", "granos", "huele"],
  "minas": ["cafetera", "maceta", "postre"]
}
```

Un trío al que le falte una foto de la banda 1 o un título **no entra en el
sorteo**: se avisa por consola en desarrollo y se juega sin él. Es preferible a
repartir una ronda rota.

`pista` va vacía a propósito: las imágenes solo se reparten en modo Órbita. En
clásico el impostor no recibe nada y su única ayuda sería esa pista, así que se
quedaría mirando la pantalla en blanco mientras la mesa habla de texturas — el
catálogo vuelve a palabras solo.

## Generar las fotos con IA

Los tríos que hay ahora están generados con **Nano Banana**
(`gemini-2.5-flash-image`), usando la `GEMINI_API_KEY`. Funciona bien y
tarda unos seis segundos por foto.

**Con Flux Schnell (ComfyUI) no funcionó**, y conviene dejarlo escrito:

- Flux con `cfg 1.0` **ignora las negaciones por completo**: «no objects» no
  hace nada, porque el prompt negativo va a cero.
- Nombras el objeto y te dibuja su icono: pides café molido y te pone granos
  enteros por todo el cuadro, pides tierra y te pone piedras, y en una tirada
  apareció **un filtro de papel entero** en medio de la foto.
- Si no lo nombras, sale marrón uniforme sin identidad, y entonces el álbum del
  final se queda en «…vale, ¿y cuál era cuál?».

Nano Banana es un modelo de instrucciones, no de asociación: obedece «nada de
piezas intactas» y obedece «el contexto solo en la esquina superior izquierda».
Esa segunda instrucción es la que hace posible el truco entero.

### El prompt que funciona

```
Extreme close-up photograph of the texture of {objeto},
focused on {el rasgo que lo delata}, photorealistic.

The surface fills the entire square frame from edge to edge. The camera is so
close that no edge or outline of the object is in the picture, and there is no
background of any kind — only the surface itself.

Plain even daylight, sharp detail everywhere, no dramatic shadows, no other
objects, no hands, no text. The colour is {color}.
```

El segundo hueco es el importante: **el rasgo que permite reconocerlo**. Para el
balón, «the pebbled rubber grain, with one deep black seam groove crossing it»
—sin la costura es una goma naranja cualquiera—. Para la naranja, los poros.
Para el romanesco, las espirales.

Si no sabes decir cuál es ese rasgo, es que el material no tiene firma y no
sirve (ver la regla número uno).

El color va explícito y **el mismo para las tres**, porque es lo que más se le
va: pidiendo «tierra marrón oscura» sale gris pálida la mitad de las veces.

### Dos trampas

**`IMAGE_RECITATION`.** El modelo se niega cuando la salida se parecería
demasiado a algo memorizado, y con materiales muy fotografiados pasa a menudo.
Es intermitente: el mismo prompt falla con «tierra» y pasa con «café». Se
resuelve reintentando con el texto ligeramente reformulado. `gemini-3.1-flash-image`
y `gemini-3-pro-image` lo dan mucho más que el 2.5, así que de momento el bueno
es **`gemini-2.5-flash-image`**.

**Materiales sin grano.** La nieve sale como un cuadrado blanco liso: preciosa y
absolutamente injugable, porque el satélite no tiene nada que decir. Lo mismo el
algodón de azúcar, que queda como una nube borrosa. Si al mirarlo no sabrías
nombrarlo, no vale.

**Objetos que solo se reconocen enteros.** Pedir que una cremallera o una raspa
de pescado «llenen el cuadro repitiéndose» las convierte en tejidos grises
abstractos: irreconocibles. Hay objetos cuya identidad está en su silueta, no en
su superficie, y esos no sirven para este juego por muy buena que sea su
textura. El dedal cayó por lo mismo: sale como una bandeja metálica.

Se descartaron así los tríos de *dientes* (cremallera · raspa · peine) y el
dedal de *hoyuelos*.

## Lo que hay ahora mismo

**Diecisiete tríos.** Los diez primeros son de «misma forma, objeto distinto»:
el desviado tiene dónde agarrarse pero un resbalón lo mata. Los cinco de
*hermanos* son tres cosas casi iguales —el desviado es defendible casi siempre,
porque todo lo que diga vale también para los otros dos— y sirven para las
rondas que se ponen largas. El riesgo ahí es el contrario: que no exploten nunca
y queden en tablas.

Cuatro fotos (brócoli, coliflor, espagueti, ladrillos) se usan en dos tríos
distintos. No estorba, pero si sale la misma foto dos veces en una noche puede
dar sensación de repetido.

### De forma compartida

| Trío | Centro | Satélites | Minas |
|---|---|---|---|
| naranjas | naranja | balón · calabaza | zumo · canasta · halloween |
| verdes | brócoli | césped · lechuga | hervir · cortacésped · ensalada |
| celdas | panal | gofre · esponja | miel · desayuno · fregar |
| rejilla | chocolate | ladrillos · parquet | onza · obra · barrer |
| radios | kiwi | girasol · diana | batido · campo · dardos |
| blancos | palomitas | coliflor · merengue | cine · hervir · horno |
| hoyuelos | fresa | pelota de golf · burbujas | nata · hoyo · explotar |
| escamas | piña | alcachofa · cocodrilo | tropical · hervir · bolso |
| anillos | cebolla | tronco · huella | llorar · hacha · policía |
| hebras | espagueti | cables · lombrices | hervir · enchufe · tierra |
| rayas | piano | paso de cebra · código de barras | tecla · cruzar · caja |
| puntas | puercoespín | cactus · alambre de espino | animal · desierto · valla |

### De hermanos

| Trío | Centro | Satélites | Minas |
|---|---|---|---|
| hermanas | brócoli | coliflor · romanesco | árbol · blanco · espiral |
| pasta | espagueti | fideos · tallarines | boloñesa · sopa · plano |
| cítricos | limón | lima · pomelo | amarillo · mojito · desayuno |
| suelos | ladrillos | adoquines · azulejos | pared · calle · baño |
| frutos | almendras | avellanas · nueces | turrón · chocolate · arrugado |

Las 47 fotos dan una sola palabra y se nombran en dos segundos.

### Sobre personajes de anime y cine

Se descartó. No por el generador —aunque también: la claqueta salió como rayas
en el asfalto y el pelo de anime como una bola de pinchos abstracta— sino porque
Goku, Vegeta, Arale, Shin Chan o Doraemon **tienen dueño**, y Órbita está
publicada en internet por el túnel de Cloudflare. Meter recortes suyos en la app
es distribuirlos.

Lo que sí funciona es quedarse con **la forma sin el personaje**, que es donde
estaba el chiste. De ahí salió el trío **espiral**:

| Trío | Centro | Satélites | Minas |
|---|---|---|---|
| espiral | caca de dibujos | helado de soft · colmena | moscas · verano · abejas |

Los tres comparten la misma silueta —una espiral apilada que se estrecha hacia
una punta— y ninguno es de nadie. Es el **único trío dibujado** del catálogo: el
resto son fotos. Ese cambio de registro no estorba porque dentro del trío los
tres son idénticos en estilo, que es lo que importa.

Queda pendiente la otra idea de la misma familia, que era la original de Goku
contra Vegeta: *cola peluda / mechón puntiagudo / plumero*.

**Dos tandas descartadas jugando, y cada una enseñó una regla:**

1. Café/tierra/cacao y sal/azúcar/coco — polvos sin firma. Nadie sabía qué
   tenía. De ahí sale la regla número uno.
2. Pelota de masaje y romanesco — texturas que casaban pero que nadie sabe
   nombrar. De ahí sale lo de los satélites icónicos.

**Auditoría de las 54 imágenes (repaso una a una).** Cayeron cuatro y se
regeneraron:

- *merengue* parecía rosetones de plástico → se pidió «piezas sueltas con la
  punta tostada» y ya se reconocen.
- *cebolla* era una espiral blanca abstracta que podía ser nata → cortada a lo
  largo, con la piel de papel y la raíz a la vista.
- *diana* sin la corona de números no se identificaba.
- *musgo* era indistinguible del césped **y eran los dos satélites del mismo
  trío**, así que se cambió por lechuga.

**Siguen flojas, pendientes de que molesten:** el puercoespín lee más como
«pelo» que como el animal, y la alcachofa parece una crasa.
- El trío naranja puede ser *demasiado* bueno: comparten tantas palabras que
  quizá no explote nunca y quede en tablas. Hace falta que alguien pise una mina.

### Candidatos que pasan la regla de una sola palabra

Para la próxima tanda, ya filtrados: **panal, gofre, cremallera, raspa,
chocolate, ladrillos, teclado, pelota de golf, fresa, kiwi, girasol, piña,
esponja, coliflor, palomitas**.

Descartados por no tener sustantivo único: *bosque desde el aire, mar rizado,
dunas, barro seco, espuma* (¿de qué?), *corteza* (¿de árbol o de pan?).

## El álbum

Las fotos se destapan **una sola vez, al final de la noche**, desde el marcador.

No es una manía: ver las tres juntas le dice a cada uno si la suya era la rara,
y eso es justo lo que la revelación de cada ronda se calla para que la duda
sobreviva y apetezca otra. Por eso el álbum vive detrás del mismo aviso que el
marcador y no en el cierre de ronda.
