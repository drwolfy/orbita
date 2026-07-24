/**
 * Todas las cadenas visibles, en un solo sitio (§7). Si algún día se traduce,
 * se copia este archivo y se cambia el import.
 */
export const T = {
  titulo: 'ÓRBITA',
  lema: 'Nadie miente. Alguien orbita más lejos.',

  inicio: {
    jugar: 'JUGAR',
    jugadores: 'JUGADORES',
    comoSeJuega: 'CÓMO SE JUEGA',
    marcador: 'MARCADOR',
    faltanJugadores: (n: number) => `Añade ${n} jugador${n === 1 ? '' : 'es'} más para empezar`,
    enLaMesa: (n: number) => `${n} en la mesa · toca para cambiar modo y opciones`,
  },

  // Firma del negocio, al pie de la portada y en «Cómo se juega».
  creditos: {
    hechoPor: 'Hecho por',
    negocio: 'Imad Computers',
    web: 'https://imadcomputers.com',
  },

  modos: {
    orbitaCorto: 'Nadie miente. Uno tiene la palabra vecina.',
    fotosCorto: 'Igual que Órbita, pero con fotos casi iguales en vez de palabras.',
    clasicoCorto: 'Hay un impostor y lo sabe.',
  },

  actualizacion: {
    disponible: '↻ Hay una versión nueva · tocar para cargarla',
  },

  reiniciar: {
    etiqueta: 'Reiniciar la ronda',
    titulo: '¿Reiniciar la ronda?',
    ayuda: 'Se reparten palabras nuevas y se empieza otra vez. Úsalo si alguien ha visto lo que no debía. El marcador no se toca.',
    confirmar: 'REPARTIR DE NUEVO',
    alInicio: 'Dejarlo y volver al inicio',
    cancelar: 'Seguir jugando',
    seguro: '¿Seguro?',
    seguroRepartir:
      'Se cambian todas las palabras y la ronda vuelve a empezar desde el reparto. El marcador no se toca.',
    seguroInicio: 'Se abandona la ronda en curso. El marcador y los jugadores se conservan.',
    rendirse: 'RENDIRSE',
    rendirseNota: 'No damos con él: que se lleve la ronda',
    seguroRendirse:
      'Se acaba la ronda y los puntos van para quien no hayáis pillado. Se os dirá si acertasteis con los que caísteis, pero no quién era el resto.',
    siRendirse: 'SÍ, NOS RENDIMOS',
    siRepartir: 'SÍ, REPARTIR',
    siInicio: 'SÍ, SALIR',
    atras: 'No, atrás',
    relevoTitulo: '¿Empezar otra vez?',
    relevoAyuda:
      'Si las palabras que han salido no hay quien las dibuje, se sortean otras y vuelve a empezar por alguien distinto.',
    otrasPalabras: 'OTRAS PALABRAS',
    seguroRelevo:
      'Se pierde el dibujo que lleváis y se empieza de cero con palabras nuevas y otro orden.',
    siOtrasPalabras: 'SÍ, EMPEZAR DE CERO',
  },

  partida: {
    titulo: 'La partida',
    masOpciones: 'Más opciones',
  },

  temas: {
    titulo: 'Temas',
    todos: 'Todos, al azar',
    todosAyuda: (n: number) => `Las ${n} palabras del diccionario entran en el sorteo.`,
    elegidos: (n: number, palabras: number) =>
      `${n} tema${n === 1 ? '' : 's'} · ${palabras} palabras`,
    pocasAviso: 'Con tan pocas palabras se repetirán enseguida.',
  },

  palabras: {
    titulo: 'Palabras ya jugadas',
    ayuda: (jugadas: number, total: number) =>
      `${jugadas} de ${total} han salido ya. No vuelven a repetirse mientras queden nuevas, aunque cierres la app.`,
    olvidar: 'Olvidar las jugadas',
    confirmar: '¿Olvidar las palabras ya jugadas? Podrán volver a salir.',
    ninguna: 'Todavía no ha salido ninguna.',
  },

  jugadores: {
    titulo: 'Jugadores',
    ayuda: 'De 4 a 10, en el orden en que estáis sentados.',
    nuevo: 'Nombre',
    anadir: 'Añadir',
    lleno: 'Ya sois diez: no caben más.',
    quitar: (nombre: string) => `Quitar a ${nombre}`,
    subir: (nombre: string) => `Subir a ${nombre}`,
    bajar: (nombre: string) => `Bajar a ${nombre}`,
    volver: 'Volver',
  },

  ajustes: {
    titulo: 'Ajustes',
    modo: 'Modo de juego',
    modoOrbita: 'Órbita',
    modoOrbitaAyuda: 'Nadie miente. Uno recibe una palabra vecina y no lo sabe.',
    modoClasico: 'Clásico',
    modoClasicoAyuda: 'El de siempre: hay un impostor y lo sabe.',
    pistaImpostor: 'El impostor ve…',
    pistaNada: 'Nada',
    pistaNadaAyuda: 'Improvisa a ciegas escuchando a los demás.',
    pistaUna: 'Una pista',
    pistaUnaAyuda: 'Una palabra asociada: «correa» si la palabra es «perro». No puede decirla.',
    satelites: 'Satélites por ronda',
    satelitesAuto: 'Automático',
    satelitesAutoAyuda: '1 hasta 6 jugadores, 2 a partir de 7.',
    siempre1: 'Siempre 1',
    siempre2: 'Siempre 2',
    maniobras: 'Maniobras',
    maniobrasAyuda: 'Objetivo secreto para cada jugador durante el debate.',
    enfrentadas: 'Maniobras enfrentadas',
    enfrentadasAyuda: 'Dos jugadores reciben objetivos opuestos sobre la misma persona.',
    publica: 'Maniobra pública',
    publicaAyuda: 'La mesa ve una maniobra. Todos saben el qué, nadie el quién.',
    debate: 'Duración del debate',
    senal: 'Tiempo por señal',
    senalAyuda: 'Cuenta atrás en el turno de cada uno.',
    sinLimite: 'Sin límite',
    sonido: 'Avisos sonoros',
    sonidoAyuda: 'Pitidos en los últimos segundos y al acabarse el tiempo.',
    votacion: 'Votación',
    votacionDirecta: 'Directa',
    votacionDirectaAyuda: 'A mano alzada y uno toca al señalado. La más rápida.',
    votacionPasa: 'Pasando el móvil',
    votacionPasaAyuda: 'Cada uno vota en privado, en secreto. Da la vuelta a la mesa otra vez.',
    votacionOperador: 'Con recuento',
    votacionOperadorAyuda: 'Uno anota cuántos votos saca cada uno.',
    segundos: (n: number) => `${n} s`,
    modoFotos: 'Fotos',
    mezclar: 'Mezclar con palabras',
    mezclarAyuda: 'Unas rondas de fotos y otras de palabras, al azar.',
    catalogoCuantas: (n: number) =>
      `${n} trío${n === 1 ? '' : 's'} de fotos disponible${n === 1 ? '' : 's'}.`,
  },

  tutorial: {
    titulo: 'Cómo se juega',
    elige: 'Cuatro juegos en la misma app. Toca uno para ver cómo va.',
    comun: 'En todos: el móvil va de mano en mano y no se escribe nada. Todo se dice en voz alta.',
    volver: 'Otro juego',
    entendido: 'Entendido',
    // Transparencia: contenido generado con IA, sin recogida de datos, código
    // libre. Todo lo que conviene decir al publicar en abierto, en una línea.
    legal:
      'Imágenes generadas con IA. Esta app no recopila datos: todo se guarda en tu móvil. Código libre (licencia MIT).',

    orbita: [
      'Todos recibís una palabra. Casi todos la misma… pero no todos.',
      'Nadie sabe si le ha tocado la rara, y nadie miente: tu pista es sincera.',
      'Por turnos, cada uno dice UNA palabra asociada a la suya. Luego se debate y se vota.',
    ],
    orbitaAviso:
      'Si te pillan y adivinas la palabra del centro, ganas tú. Así que no seas demasiado preciso al dar tu señal.',

    fotos: [
      'Igual que Órbita, pero con fotos en vez de palabras.',
      'Casi todos veis la misma; alguien ve otra cosa que se le parece mucho.',
      'La duda no es qué estás mirando, sino si lo tuyo es lo mismo que lo suyo.',
    ],
    fotosAviso:
      'Las tres fotos de cada ronda se destapan una sola vez, al final de la noche, en el álbum. Verlas antes te diría si eras tú el raro.',

    clasico: [
      'El de siempre: hay un impostor y él sí lo sabe.',
      'No conoce la palabra: tiene que disimular a partir de lo que oiga.',
      'Puede jugar a ciegas o con una pista oblicua: «cartero» si la palabra es «perro».',
    ],
    clasicoAviso: 'La pista no se puede soltar tal cual, o se vuelve invisible sin esforzarse.',

    relevo: [
      'Entre todos dibujáis lo mismo, con el dedo y por turnos.',
      'Ves las palabras y lo que llevan los anteriores, y añades lo que te dé tiempo.',
      'Al último no se le enseñan las palabras: solo el dibujo, y dice qué cree que es.',
    ],
    relevoAviso:
      'No hay puntos ni veredicto. Al destapar salen las palabras y el dibujo turno a turno, con quién hizo cada trazo.',

    ejemploTitulo: 'Un ejemplo',
    ejemplo: {
      astro: 'Cuatro tienen «perro». Una persona tiene «lobo».',
      senales: [
        ['Ana', 'correa'],
        ['Bruno', 'ladrido'],
        ['Clara', 'manada'],
        ['David', 'veterinario'],
        ['Eva', 'paseo'],
      ] as const,
      desviada: 'Clara',
      remate: '«Manada» no es absurdo, pero desafina: los demás huelen a animal doméstico.',
    },
  },

  senal: {
    titulo: 'Reglas de la señal',
    abre: 'Empieza',
    reglas: [
      'Una sola palabra.',
      'Ni tu palabra, ni derivados, ni sinónimos.',
      'Nada de gestos ni de señalar.',
      'No se repite una señal ya dicha.',
    ],
    orden: 'Orden de turno',
    turnoDe: (nombre: string) => `Le toca a ${nombre}`,
    siguiente: 'Siguiente',
    aDebatir: 'A DEBATIR',
    tiempoAgotado: 'Se acabó tu tiempo',
  },

  traspaso: {
    pasaA: (nombre: string) => `Pasa el móvil a ${nombre}`,
    nadieMire: 'Que nadie más mire la pantalla.',
    soy: (nombre: string) => `Soy ${nombre}`,
    atras: 'Atrás',
  },

  reparto: {
    manten: 'MANTÉN PULSADO',
    paraVer: 'para ver tu palabra',
    paraVerImagen: 'para ver tu imagen',
    suelta: 'Suelta para taparla',
    sueltaYPasa: 'Suelta para pasar al siguiente',
    tuManiobra: 'Tu maniobra',
    maniobraPublica: 'Maniobra a la vista de todos',
    impostor: 'ERES EL IMPOSTOR',
    impostorAyuda: 'No conoces la palabra. Disimula.',
    pista: 'Tu pista',
    pistaNoDecir: 'No puedes decirla tal cual',
    listo: 'Listo',
    progreso: (i: number, n: number) => `${i} de ${n}`,
  },

  debate: {
    titulo: 'Debate',
    ayuda: '¿Quién desafina?',
    pausar: 'Pausar',
    seguir: 'Seguir',
    votar: 'VOTAR',
    seAcabo: '¡Se acabó el tiempo!',
    fuera: 'Fuera',
    siguenBuscando: 'Misma palabra. Seguid buscando.',
  },

  votacion: {
    titulo: 'Votación',
    aQuien: (nombre: string) => `${nombre}, ¿a quién votas?`,
    aQuienDirecta: '¿A quién señaláis?',
    manual: 'Votos a mano alzada',
    ayudaManual: 'Anota los votos de cada uno y cierra la votación.',
    cerrar: 'CERRAR VOTACIÓN',
    sinVotos: 'Hace falta al menos un voto.',
    votos: (n: number) => `${n} voto${n === 1 ? '' : 's'}`,
  },

  desempate: {
    titulo: 'Empate',
    ayuda: 'Decidid entre vosotros a quién señaláis.',
  },

  segunda: {
    titulo: 'Segunda oportunidad',
    eras: (nombre: string) => `${nombre}, tú eras el que orbitaba lejos.`,
    erasClasico: (nombre: string) => `${nombre}, tú eras el impostor.`,
    reto: 'Última bala: si adivinas la palabra del centro, ganas tú la ronda.',
    retoImagen: 'Última bala: si dices qué era la imagen del centro, ganas tú la ronda.',
    enVozAlta: 'Dila en voz alta. Decide la mesa.',
    acerto: 'ACERTÓ',
    fallo: 'FALLÓ',
  },

  alineacion: {
    titulo: 'Alineación',
    pasos: {
      votado: 'El más votado',
      quienEra: '¿Le habéis dado?',
      intento: 'Su última bala',
      maniobras: 'Las maniobras',
      sinVotar: 'Ronda cerrada',
    },
    toallaTitulo: 'Os habéis rendido',
    toallaAyuda: 'Se lleva la ronda sin despeinarse. Y no, no se dice quién era.',
    // Solo el veredicto: ni el rol de los demás, ni la palabra de nadie.
    siImpostor: 'SÍ, era el impostor',
    noImpostor: 'NO, no era el impostor',
    siDesviado: 'SÍ, orbitaba lejos',
    noDesviado: 'NO, estaba en el centro',
    quedaOtro: 'Pero no estaba solo: queda otro ahí fuera.',
    seguir: 'SEGUIR BUSCANDO',
    rendirse: 'DARLO POR GANADO',
    rendirseNota: 'Se lleva la ronda y pasamos a otra palabra',
    sinGente: 'Ya no quedáis suficientes para otra votación: se la lleva él.',
    rendido: 'Os habéis rendido: se lleva la ronda.',
    acerto: 'Acertó. Se lleva la ronda.',
    fallo: 'Falló.',
    dijo: (palabra: string) => `Dijo «${palabra}»`,
    nadaDicho: 'No dijo nada.',
    cumplida: 'Cumplida',
    noCumplida: 'No',
    verificaGrupo: '¿Lo cumplió?',
    automatica: 'Verificada por la app',
    alMarcador: 'AL MARCADOR',
  },

  cierre: {
    titulo: 'Ronda cerrada',
    ayuda: 'Los puntos ya están sumados. Del resto no se ha dicho nada: si queréis saber quién tenía qué, seguid jugando.',
    otraRonda: 'OTRA RONDA',
    jugadores: 'JUGADORES Y OPCIONES',
    jugadoresNota: 'Añadir a quien llegue tarde o cambiar el orden',
    volverInicio: 'Inicio',
    verMarcador: 'Ver marcador',
    avisoTitulo: '¿Ver el marcador?',
    aviso: 'Los puntos destapan la noche: con pocas rondas jugadas, el que va distinto a los demás es justo el que orbitaba lejos. Si pensáis seguir, es mejor dejarlo para el final.',
    siVer: 'SÍ, VERLO',
    noVer: 'Mejor al final',
    verAlbum: 'Ver el álbum',
    albumNota: (n: number) => `${n} ronda${n === 1 ? '' : 's'} de fotos esta noche`,
  },

  relevo: {
    nombre: 'Relevo',
    corto: 'Entre todos dibujáis lo mismo. El último adivina qué era.',
    conFrases: 'Frases en vez de palabras',
    conFrasesAyuda: 'Una situación absurda: «un pingüino planchando en la playa».',
    progreso: (i: number, n: number) => `Dibujante ${i} de ${n}`,
    preparate: 'Prepárate',
    preparateAyuda: 'Mira las palabras. En cuanto llegue a cero, a dibujar.',
    tuTurnoAdivinar: 'Te toca adivinar',
    adivinaTitulo: '¿Qué han dibujado?',
    adivinaAyuda: 'Dilo en voz alta. Cuando te rindas o lo claves, destapa.',
    destapar: 'DESTAPAR',
    finalTitulo: 'Se acabó',
    eran: 'Era esto',
    dibujo: (nombre: string, i: number) => `Turno ${i} · ${nombre}`,
    verPaso: (i: number) => `Ver el turno ${i}`,
    otra: 'OTRA RONDA',
    volverInicio: 'Inicio',
    jugadores: 'Jugadores',
  },

  album: {
    titulo: 'El álbum de la noche',
    ayuda: 'Aquí es donde se ve de qué habéis estado hablando en realidad.',
    elCentro: 'El centro',
    losRaros: 'Lo que veían los otros',
    laMina: 'La palabra que delata',
    vacio: 'Todavía no habéis jugado ninguna ronda de fotos.',
    cerrar: 'CERRAR EL ÁLBUM',
    cerrarNota: 'Se vacía y empieza noche nueva',
    volver: 'Volver',
    confirmar: '¿Vaciar el álbum? Las fotos de esta noche dejan de verse aquí.',
  },

  marcador: {
    titulo: 'Marcador',
    ronda: 'Ronda',
    maniobra: 'Maniobra',
    total: 'Total',
    otraRonda: 'OTRA RONDA',
    jugadores: 'JUGADORES Y OPCIONES',
    jugadoresNota: 'Añadir a quien llegue tarde o cambiar el orden',
    reiniciar: 'Reiniciar marcador',
    confirmarReinicio: '¿Seguro? Se borran todos los puntos.',
    volverInicio: 'Inicio',
  },
} as const
