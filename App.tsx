
import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ChevronLeft, FileText, Play, Tag, Mic, Search } from 'lucide-react';

// --- Types & Content ---

type Language = 'es' | 'ca';
type View = 'home' | 'historia' | 'fundamentos' | 'formacion' | 'escuela' | 'videos' | 'textos' | 'comunidad' | 'en_que_estamos';
type EscuelaSection = 'intro' | 'aprendizaje' | 'acompanamiento' | 'equipo' | 'familias' | 'etapas' | '3-6' | '6-12' | '12-16';

// --- IMAGE CONFIGURATION ---
// Use static public `/images/*` paths so images are available in both dev
// and production without relying on bundler-specific runtime helpers.
// Ensure you have copied the source images into `public/images/`.
const IMAGES = {
  logo: '/images/logo_roure.png', // Spanish/Castellano
  logo_ca: '/images/logo_roure_ca.png', // Catalan
  homeMain: '/images/wood_sprout_oak2.png',
  sections: {
    historia: "https://picsum.photos/seed/history/800/1000",
    fundamentos: "https://picsum.photos/seed/foundations/800/1000",
    formacion: "https://picsum.photos/seed/formacion/800/1000",
  },
  historiaPhotos_es: [
    { src: '/images/1_el_viejo_roble.webp', caption: '' },
    { src: '/images/1_2_las_cuadras_antes_de_reformar.webp', caption: '' },
    { src: '/images/1_3_obras_primer_edificio.webp', caption: '' },
    { src: '/images/2_begona_cristobal.webp', caption: '' },
    { src: '/images/2_2_subiendo_viga.webp', caption: '' },
    { src: '/images/2_3_pintando.webp', caption: '' },
    { src: '/images/2_4_los_4_descansando.webp', caption: '' },
    { src: '/images/3_escuela_el_roure.webp', caption: '' },
    { src: '/images/4_maquina_del_tiempo.webp', caption: '' },
    { src: '/images/5_familias_el_roure.webp', caption: '' },
    { src: '/images/5_obras.webp', caption: '' },
    { src: '/images/5_2_hormigon.webp', caption: '' },
    { src: '/images/5_2_finca.webp', caption: '' },
    { src: '/images/5_3_ninos_estanteria.webp', caption: '' },
    { src: '/images/5_4_ordenando_nueva_sala.webp', caption: '' },
    { src: '/images/6_inauguracion_edificio_ginesta.webp', caption: '' },
    { src: '/images/7_inauguracion_edificio_ginesta_2.webp', caption: '' },
    { src: '/images/8_paso_de_manos.webp', caption: '' },
    { src: '/images/9_heura_adolescents_escola_el_roure.webp', caption: '' },
    { src: '/images/10_el_viejo_roble_talado.webp', caption: '' },
    { src: '/images/11_reunion_escuela_el_roure.webp', caption: '' },
  ],
  historiaPhotos_ca: [
    { src: '/images/1_el_viejo_roble.webp', caption: '' },
    { src: '/images/1_2_las_cuadras_antes_de_reformar.webp', caption: '' },
    { src: '/images/1_3_obras_primer_edificio.webp', caption: '' },
    { src: '/images/2_begona_cristobal.webp', caption: '' },
    { src: '/images/2_2_subiendo_viga.webp', caption: '' },
    { src: '/images/2_3_pintando.webp', caption: '' },
    { src: '/images/2_4_los_4_descansando.webp', caption: '' },
    { src: '/images/3_escuela_el_roure.webp', caption: '' },
    { src: '/images/4_maquina_del_tiempo.webp', caption: '' },
    { src: '/images/5_familias_el_roure.webp', caption: '' },
    { src: '/images/5_obras.webp', caption: '' },
    { src: '/images/5_2_hormigon.webp', caption: '' },
    { src: '/images/5_2_finca.webp', caption: '' },
    { src: '/images/5_3_ninos_estanteria.webp', caption: '' },
    { src: '/images/5_4_ordenando_nueva_sala.webp', caption: '' },
    { src: '/images/6_inauguracion_edificio_ginesta.webp', caption: '' },
    { src: '/images/7_inauguracion_edificio_ginesta_2.webp', caption: '' },
    { src: '/images/8_paso_de_manos.webp', caption: '' },
    { src: '/images/9_heura_adolescents_escola_el_roure.webp', caption: '' },
    { src: '/images/10_el_viejo_roble_talado.webp', caption: '' },
    { src: '/images/11_reunion_escuela_el_roure.webp', caption: '' },
  ],
  videoPlaceholder: "https://picsum.photos/seed/video/600/400",
  escuela: {
    intro: "https://picsum.photos/seed/intro/800/400",
    aprendizaje: "https://picsum.photos/seed/aprendizaje/800/400",
    acompanamiento: "https://picsum.photos/seed/acompanamiento/800/400",
    equipo: "https://picsum.photos/seed/equipo/800/400",
    familias: "https://picsum.photos/seed/familias/800/400",
    etapas: "https://picsum.photos/seed/etapas/800/400",
    '3-6': "https://picsum.photos/seed/3-6/800/400",
    '6-12': "https://picsum.photos/seed/6-12/800/400",
    '12-16': "https://picsum.photos/seed/12-16/800/400",
  } as Record<EscuelaSection, string>,
  people: [
    '/images/bego.webp',
    '/images/paco.webp',
    '/images/clara.webp',
  ]
};

  // Fundamentos carousels (images already in public folder). Captions intentionally empty for now.
  const fundamentosAutorr = [
    { src: '/images/fundamentos/webp_autorr_1.webp', caption: '' },
    { src: '/images/fundamentos/webp_autorr_2.webp', caption: '' },
    { src: '/images/fundamentos/webp_autorr_3.webp', caption: '' },
    { src: '/images/fundamentos/webp_autorr_4.webp', caption: '' },
    { src: '/images/fundamentos/webp_autorr_5.webp', caption: '' },
    { src: '/images/fundamentos/webp_autorr_6.webp', caption: '' },
    { src: '/images/fundamentos/webp_autorr_11.webp', caption: '' },
    { src: '/images/fundamentos/webp_autorr_22.webp', caption: '' },
  ];

  const fundamentosAcompa = [
    { src: '/images/fundamentos/webp_acompa_1.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_2.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_3.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_4.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_5.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_6.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_7.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_8.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_9.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_10.webp', caption: '' },
    { src: '/images/fundamentos/webp_acompa_11.webp', caption: '' },
  ];

  const fundamentosApren = [
    { src: '/images/fundamentos/webp_apren_2.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_3.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_4.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_5.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_6.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_7.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_8.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_9.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_10.webp', caption: '' },
    { src: '/images/fundamentos/webp_apren_12.webp', caption: '' },
  ];

interface PersonProfile {
  name: string;
  paragraphs: string[];
}

interface ContentSection {
  title?: string;
  paragraphs: string[];
}

interface Article {
    title: string;
    author: string;
    tags: string[]; // Array of tags for each article
    file?: string; // optional path to a PDF file under `public/pdfs/` or an external URL
    link?: string; // external link
    additionalInfo?: string; // additional info like magazine name and number
}interface VideoItem {
  title: string;
  description: string;
  link?: string;
  embedId?: string;
  type?: 'vimeo' | 'youtube' | 'spotify' | 'other';
}

// Content dictionary
const content = {
  es: {
    nav: {
      historia: 'Historia',
      fundamentos: 'Fundamentos',
      formacion: 'Formación',
      escuela: 'Escuela',
      videos: 'Audiovisuales',
      textos: 'Artículos',
      comunidad: 'Comunidad Roure',
      en_que_estamos: '¿En qué estamos?',
      back: 'Volver',
      top: 'Subir'
    },
    header: {
        left: "El Roure. Educación Viva.",
        right: "Lo que fue."
    },
    home: {
      text1: 'Del 2001 al 2025 hicimos un viaje fascinante: una escuela para familias con criaturas de 3 a 16 años.',
      text2: '¿Cuál ha sido el norte de ese viaje?',
      highlight: 'Cada criatura es una semilla.',
      text3: 'La fuerza y la inteligencia de la vida se ocupan de que se manifieste y se desarrolle. Queremos sintonizar con este latido, apoyarlo y dejar atrás lo que nos limita, para acompañarlos, para acompañarnos, desde el respeto y la consciencia de la naturaleza de cada cual.',
      footer: 'web creada por'
    },
    escuela: {
      menu: {
        intro: 'Introducción',
        aprendizaje: 'Aprendizaje',
        acompanamiento: 'Acompañamiento',
        equipo: 'El equipo',
        familias: 'Las familias',
        etapas: 'Etapas, tiempos y espacios',
        '3-6': 'De 3 a 6 años',
        '6-12': 'De 6 a 12 años',
        '12-16': 'De 12 a 16 años',
      },
      titles: {
        
      }
    },
    escuelaContent: {
        intro: [
            "La escuela El Roure nació en 2001, con el concepto de escuela viva. Ha sido una comunidad de aprendizaje unida por una visión de la educación inspirada por el Seitai, la Sistémica y la experiencia cotidiana entre familias, profesionales y criaturas. El propósito fue acompañar a las criaturas en su crecimiento y a las madres y padres en su función."
        ],
        aprendizaje: [
            "El aprendizaje es una experiencia vital ineludible porque es la dinámica de desarrollo del potencial particular que cada criatura. De forma natural siempre estem aprenent, en todo lugar y momento y de una manera global, con todo nuestro organismo implicado; nuestra capacidad física-energética, emocional, intelectual y trascendente.",
            "El verdadero aprendizaje se da a partir del impulso vital de cada niño y es el fruto del diálogo continuado entre su interior y el exterior. Aunque es una dinámica intrínseca al hecho de estar vivos, puede ser favorecida y alimentada o dificultada y dormida.",
            "En El Roure hemos buscado una experiencia de aprendizaje sólida, arraigada, viva. Para que se dé ese nivel de aprendizaje, el proceso debe tener como eje el deseo y la necesidad propia y el respeto al ritmo y recorrido peculiares de cada cual.",
            "Esos procesos individuales estaban enmarcados en un contexto amplio, en el que tratamos de acompañar la globalidad del crecimiento de cada criatura sin sobrevalorar ningún aspecto sobre otro: su mundo emocional, sus aprendizajes culturales, su capacidad de reflexión, de expresión y comunicación con los otros, la conciencia de sí mismos, su desarrollo motriz, su creatividad, etc.",
            "Consideramos artificial y limitadora la separación, respecto al aprendizaje, entre familia y escuela. El aprendizaje se da de forma contínua y sus contenidos forman parte de un único proceso en el que todo está conectado. Por eso proponíamos que la madre y el padre asuman el derecho y la responsabilidad básica en este acompañamiento, en lugar de la actitud de delegar en los profesionales de la educación y en la escuela una parte fundamental de su función. El Roure era un espacio pedagógico cotidiano en el que madres y padres querían y podían participar. La relación entre casa y escuela se trataba de favorecer a través de actividades llevadas por madres, padres y otros adultos afines o donde los materiales o procesos de aprendizaje iban y venían de un lugar a otro.",
            "¿Qué aprenden los niños y niñas?",
            "Cuando se habla de aprendizaje, a menudo se limita este concepto al aprendizaje de conocimientos. Incluso suele quedar aún más reducido al entender que se refiere a los conocimientos intelectuales. El aprendizaje, por el contrario, es una experiencia ilimitada; no sólo porque es imposible dejar de aprender mientras existe vida, sino porque los objetos del aprendizaje son infinitos.",
            "Cada niño y niña debe aprender a andar, a hablar, a tolerar la frustración, a tener en cuenta a los demás, a entenderse, a conocer el lenguaje de las emociones, a conocer su cultura y la de los demás, a conocer su cuerpo y sus capacidades, a elaborar pensamientos propios, etc. Es todo el ser el que aprende y los aprendizajes no están parcelados ni aislados unos de otros. En el aprender todo el organismo está implicado: el aspecto físico al actuar y percibir el propio cuerpo, el emocional al sentir y relacionarse, el intelectual al asimilar información y procesarla, forman parte de un todo indisociable.",
            "En El Roure todo ha estado al servicio del aprendizaje a partir de las realidades individuales y grupales que se iban dando. Hemos contemplado un currículum abierto, dinámico y flexible, materiales, espacios, actividades, metodologías, situaciones y posibilidades en continuo movimiento.",
            "Posiblemente, uno de los aprendizajes más interesantes que se han podido llevar los niños y niñas (y madres y padres) es que el presente genera continuamente posibilidades de aprendizaje realmente interesantes y valiosas. Si respetamos este continuo y poderoso devenir, los aprendizajes tendrán el valor y la intensidad de lo que está vivo.",
            "¿Cómo aprenden los niños?",
            "El aprendizaje no es un proceso lineal, progresivo y rítmico, tampoco está ligado continuamente a la consciencia. Está más bien ligado al bienestar vital y, consecuentemente, al ambiente, a la calidad de la vivencia y la comunicación. Por este motivo, es posible observar tanto recorridos con carácter constante y gradual, como repentinos y con avances sorprendentes. De una forma u otra, estamos convencidos de que lo que determina la solidez de lo aprendido no es el tiempo invertido, la hipotética adecuación del contenido a la edad, ni siquiera la metodología escogida. Nuestra atención no podía centrarse en programaciones cerradas y tiempos predeterminados, sino en actividades abiertas y flexibles que se adaptan a las necesidades de cada criatura.",
            "Creemos que es urgente desterrar la idea de entrenamiento, del valor de lo cuantitativo en el aprendizaje. En la práctica, hacer con sentido (leer, escribir, hablar, moverse, relacionarse, crear, etc.) significa que todo el organismo está activo, implicado en la vivencia, y eso es lo que permite que el aprendizaje sedimente. Todas las capacidades intelectuales, la afectividad, la creatividad, la imaginación, los sentidos, etc. están participando, y esta implicación es lo que permite asimilar, privilegiar en la memoria, asociar con otros aprendizajes, y transformarse, crecer.",
            "Ofrecer la posibilidad a los niños y niñas de seguir su impulso vital y explorar, no es sólo priorizar su bienestar, sino también apostar por una relación de amistad con el aprendizaje.",
            "Actividad autónoma y actividad estructurada",
            "En El Roure, los niños y niñas se han movido constantemente, de forma fluida y voluntaria entre dos experiencias de aprendizaje y relación: la actividad autónoma y la actividad estructurada.",
            "En cada etapa la proporción entre actividad estructurada y autónoma iba cambiando; de 3 a 6 años la actividad prioritaria era la autónoma y había una sesión de actividad estructurada diaria, según entendemos las necesidades y capacidades evolutivas. En Primaria la actividad estructurada y autónoma estaban bastante equilibradas y en el grupo adolescente la actividad estructurada era prioritaria.",
            "La actividad autónoma y espontánea es la natural y necesaria fundamentalmente en la infancia. Es a través de esta actividad que el niño busca y encuentra lo necesario para su bienestar más íntimo, según una sensible guía innata. A lo largo de toda la infancia, esta actividad consiste principalmente en el juego, que es la vía de la experimentación imprescindible para el aprendizaje, es decir, para la comprensión de sí mismo en el mundo que le rodea.",
            "Este tipo de actividad está vinculada a la guía interna innata de cada criatura hacia el desarrollo de su potencial y además es la que permite y hace madurar la autonomía en cuanto a los intereses y necesidades propias. Cada criatura se dirige hacia aquellos materiales, relaciones y espacios, que más le llaman en cada momento, según su estado, sus capacidades naturales y sus intereses estables o presentes."
        ],
        acompanamiento: [
            "Hay un eje y una dirección en el camino de búsqueda de nuestra experiencia de acompañamiento: cuidar la esencia del espíritu infantil. La mirada original de los niños está iluminada por el deseo de ser y aprender; eso pide un amplio margen de autonomía y una estrecha relación con los adultos. El Roure ha sido un espacio de encuentro y acompañamiento entre familias y equipo pedagógico en torno a la experiencia de la crianza infantil. Este acompañamiento tiene dos vertientes: por un lado, el acompañamiento a niños y niñas en un ambiente respetuoso y rico en vivencias individuales y colectivas. Por otro lado, un acompañamiento a madres y padres que invite a la observación, la percepción sensible y la reflexión, para apoyar y enriquecer la experiencia de crianza de los hijos e hijas.",
            "La ratio que hemos tenido y consideramos conveniente, fue de entre 8 y 12 criaturas por adulto, dependiendo de la etapa evolutiva."
        ],
        equipo: [
            "En el equipo, siempre hemos reconocido que las familias depositan una gran confianza en nuestra tarea, simplemente por el hecho de dejar a los hijos e hijas a nuestro cargo. Recogimos esa responsabilidad, aceptando que somos acompañantes secundarios y que les aportamos algo que complementa la función de madres y padres.",
            "Las personas que formamos el equipo pedagógico nos propusimos desarrollar nuestra sensibilidad hacia la escucha, la observación y la percepción, así como la capacidad de analizar, interpretar y reflexionar sobre lo que cada niño y niña manifiestan. Necesitamos tener iniciativa propia para reaccionar y responder en cada momento y situación con una determinada intervención con cada niño y niña. Nuestra función incluía el soporte y el acompañamiento, tanto a nivel afectivo como en la búsqueda de nuevas posibilidades de aprendizaje. Constituimos un referente continuo que siempre debía saber dejar espacio para la autonomía, en todos los aspectos. También se daba un espacio en el que las diferentes miradas de cada miembro del equipo establecían un diálogo intenso y vivo.",
            "La otra parte de la labor del equipo pedagógico era la aportación a madres y padres de nuestra visión de los hijos e hijas, y de su acompañamiento en cada momento del proceso de crecimiento. Partimos de la base de que es posible un diálogo activo, compartiendo informaciones, percepciones, interpretaciones y reflexiones, que no pretendían llegar a respuestas cerradas sino a claves para continuar el camino."
        ],
        familias: [
            "Cada niña y cada niño se sostiene sobre su familia, de donde nace su confianza, seguridad y referencia necesarias para crecer. La madre y el padre representan el eje vital en la infancia y es el vínculo de amor entre los miembros de la familia lo que permite que el niño o la niña vivan y se desarrollen de forma sana. Por eso consideramos que las madres y padres son los primeros y principales responsables del acompañamiento durante el crecimiento.",
            "En la escuela hablamos de Comunidad. La relación que hemos querido plantear a madres y padres no es la de delegar en la escuela el cuidado y aprendizaje de los hijos e hijas, sino la de formar parte y participar de forma activa.",
            "Eso requería un nivel alto de sintonía entre las familias y el equipo pedagógico. El punto de encuentro y de referencia era el desarrollo de la línea educativa del proyecto. Respetando esta base, tanto desde la coordinación del equipo como cooperativa que gestionó la escuela, fuimos construyendo la forma, modificando o consolidando aspectos en función de la realidad que se iba dando como comunidad.",
            "Vimos que era importante que las familias tuvieran una comprensión profunda de las bases pedagógicas y que la comunicación se diera a diferentes niveles y en formatos diversos. Éramos conscientes de estar en un proceso personal de aprendizaje y de estar reinventando un nuevo modelo de escuela. Lo que era importante, en todo caso, era la voluntad de andar en la dirección que proponía el proyecto y de compartir el viaje.",
            "La comprensión del proyecto y el acompañamiento a las familias se realizaba a través de los canales de formación, comunicación y participación integrados en la vida cotidiana de la escuela: reuniones con cada familia, correspondencia electrónica, encuentros pedagógicos periódicos con el grupo de familias de cada etapa, comisiones familiares, la revista anual, los eventos de Puertas Abiertas o las celebraciones estacionales. Además hemos ofrecido una formación anual propia de 70 horas, desde el 2008 al 2025, también abiertos a familias y profesionales externos y talleres para la elaboración y uso de materiales (especialmente de matemáticas), o talleres puntuales por parte de otras profesionales afines."
        ],
        etapas: [
            "En El Roure teníamos dos etapas estables, diferenciadas y en relación: Els Cirerers, para niños y niñas entre 3 y 6 años y La Ginesta y La Arbreda, para niñas y niños entre 7 y 12 años. También tuvimos, durante unos años, un grupo de 13 a 16 años que llamamos L’Heura.",
            "Consideramos que cada etapa requiere un espacio y un ambiente propios, pero encontramos enriquecedora la convivencia de edades. Por eso favorecemos formas y situaciones de intercambio entre los grupos.",
            "Entre el final de una etapa y el comienzo de la siguiente había un tiempo de transición flexible que permitía conocer el ambiente y el grupo de la nueva etapa y hacerse consciente del cambio. Tanto al entrar a la escuela como al cambiar de etapa o al marchar de ella, celebrábamos rituales de paso.",
            "La organización del tiempo era simple y flexible, en la que los diferentes elementos se combinaban en proporciones diferentes en cada etapa: actividad autónoma y estructurada, almuerzo colectivo, recogida de espacios y reunión grupal diarias al final del día.",
            "Tanto el espacio interior como el exterior de cada etapa eran habitados libremente como espacios de aprendizaje y exploración. El espacio exterior nos venía dado por una finca extensa rodeada de bosque en un entorno rural; la fauna y la flora y el ecosistema natural ofrecían continuamente ocasiones para el asombro y la investigación. Los espacios interiores estaban preparados en función de los diferentes tipos de actividad: una sala motriz y polivalente, una zona con rincones con materiales de matemáticas, geografía e historia, biblioteca, lenguas, medio natural, un taller de plástica y carpintería, una sala de música, etc."
        ],
        '3-6': [
            "Las niñas y niños más pequeños exploran constantemente de una manera global y enormemente eficaz. En esta etapa es especialmente relevante el vínculo afectivo con el adulto, la experimentación a través del juego sensorial, psicomotriz y simbólico, por eso la experimentación corporal, la manipulación de materiales y objetos concretos, los cuentos y el juego simbólico son fundamentales.",
            "Cualquiera de sus actividades lúdicas, de relación, de expresión, de motricidad, lleva implícita una gran cantidad y variedad de aprendizajes: cuando un niño juega en el arenero traspasando agua de un recipiente a otro y la mezcla con la arena para hacer una pasta; cuando construye torres con piezas de madera o circuitos con rampas, rectas y desniveles para hacer pasar pelotas; cuando estira la cuerda de una carretilla vacía, primero, y después con dos amigos que se han encaramado y comprueba la diferencia, está comprendiendo vivencialmente leyes de la física, lo que le permitirá comprenderlas posteriormente de manera intelectual.",
            "La actividad básica en esta etapa era totalmente espontánea. Los diferentes materiales están al alcance de los niños y niñas para ser empleados en los espacios destinados a ellos: rincones de juego simbólico, de construcciones, de matemáticas y de lectoescritura, sala de movimiento y música, talleres de plástica y ciencias naturales, arenero exterior, etc. Existía, además, una programación interna del equipo con la que cada día de la semana se proponía una actividad estructurada acompañada por un adulto en relación con diferentes campos del aprendizaje: las matemáticas, la lectoescritura, la plástica, la música, el juego simbólico y la psicomotricidad, la naturaleza, etc."
        ],
        '6-12': [
            "Empieza una etapa en la que los niños y niñas ya pueden estar preparados para iniciar el camino de un aprendizaje más abstracto. Se empieza a hacer consciente el deseo de aprender y se puede enfocarlo voluntariamente en una dirección determinada. Se van interesando más por los conocimientos relacionados con el mundo adulto y va creciendo la capacidad y el interés por las actividades en grupo.",
            "La actividad autónoma sigue siendo fundamental y se desarrolla en los diferentes espacios disponibles. La actividad estructurada tiene un papel más importante en esta etapa. Los niños están cada vez más interesados ​​en actividades más abstractas, organizadas, estructuradas y vinculades al adulto y al grupo. A partir de esa edad hemos establecido una estructura de actividades visible y voluntaria con la mediación del adulto.",
            "Entendemos que existe diversas formas de desarrollar un aprendizaje estructurado y se trata de ofrecer puntos de partida para que cada niño y niña pueda moverse en esta diversidad según su particular sensibilidad y naturaleza. Por eso existen formas individuales o de grupo, autónomas o acompañadas por los adultos, concretas o abstractas, temáticas o interdisciplinarias, etc. El objetivo de la actividad estructurada es abrir nuevos horizontes, mostrar nuevas experiencias y posibilidades de aprendizaje en un contexto de grupo.",
            "Hay niños y niñas con necesidades de un acompañamiento más cercano y continuado o cualquiera puede tener momentos puntuales de dificultad, rechazo, resistencia o bloqueo en relación con cualquier tipo de aprendizaje. En esos casos establecíamos un proceso de observación, seguimiento y acompañamiento más cercano de lo habitual."
        ],
        '12-16': [
            "Del curso 2014/15 al curso 2020/21 acogimos a un grupo de adolescentes. La adolescencia es una etapa especialmente sensible y significativa en el crecimiento. El inicio de la fertilidad y la transformación del cuerpo marca la entrada en una nueva etapa evolutiva, se deja la infancia y todo el organismo se enfoca hacia la edad adulta. Todo es cambio, movimiento, a nivel emocional, biológico, social, intelectual; el mundo y la mirada infantil va cayendo y es imprescindible reconstruir uno de nuevo con una nueva mirada, esta vez con el eje en el propio sentir, pensar y hacer. Es necesario darle tiempo y espacio a este proceso fundamental a través de la comunicación (la escucha y la expresión), y el vínculo, las herramientas básicas que los adolescentes tienen y reclaman.",
            "Es la etapa de la inmersión en la investigación de quién soy, de la conciencia de sí. Incluye la construcción del pensamiento crítico hacia el mundo adulto y la investigación del modelo del mundo que quiero. Es el tiempo para conquistar la plena autonomia, la expresión de las capacidades individuales y de grupo, así como el descubrimiento de la potencia transformadora del ser humano.",
            "Las capacidades de decisión, autonomía, responsabilidad y compromiso se amplían notablemente y es importante activarlas en esta etapa, permiten desenvolupar potencialidad y canalizar energías."
        ]
    },
    sections: {
      historia: 'Nuestra Historia',
      fundamentos: 'Fundamentos Pedagógicos',
      videos: 'Audiovisuales',
      textos: 'Artículos Publicados',
      comunidad: 'Comunidad Roure',
      en_que_estamos: '¿En qué estamos?'
    },
    historiaContent: [
        {
            paragraphs: [
                "La escuela El Roure nació en 2001 en una finca rústica del municipio de Mediona (Barcelona). La fundaron Begoña González y Cristóbal Gutiérrez, como un paso más en la evolución de la experiencia en La Casita (2 a 6 años), que crearon en 1996, en Barcelona.",
                "La llamamos escuela viva El Roure. Sus raíces son la experiencia de crianza, el Seitai y la Sistémica y algunas inspiraciones de pedagogías innovadoras del s. XX (Montessori, Freinet, Neill, Malaguzzi, etc.). La línea pedagógica se fue concretando y desarrollando a través de la práctica cotidiana con los niños y niñas, con las madres y padres, en la relación de equipo. A partir de muchas preguntas, la observación y la reflexión, algunos criterios se fueron clarificando y confirmando. El proceso de descubrimiento y aprendizaje ha seguido hasta el final.",
                "El apoyo, la confianza y la implicación de las primeras familias y miembros del equipo fueron decisivos. La semilla de El Roure encontró las condiciones más favorables para germinar y crecer. Una persona cercana hizo de mecenas ofreciéndose a comprar la preciosa finca que elegimos para ubicar el proyecto. Empezamos con 6 criaturas que venían desde Barcelona y se quedaban a dormir en la masía tres días a la semana. Poco a poco el grupo fue creciendo y las familias participantes realizaron todo un cambio de vida trasladándose a la zona. Estas primeras familias se entregaron en cuerpo y alma a la reforma de las edificaciones e implicaron a familiares y amigos.",
                "Fue una época de trabajo exhausto, tanto en la reforma y adecuación del espacio y en la preparación de materiales educativos como en la reflexión y evolución de la metodología, la organización y la explicación de la línea educativa que estábamos creando.",
                "Como todo comienzo, se vivió en un ambiente de ilusión y de implicación muy intenso entre el equipo, familias, amigos y profesionales que colaboraban de forma desinteresada. Compartimos sudor entre cemento, escombros y pintura, horas de cocina, tertulias pedagógicas en sobremesas de grupo, sueños, incertidumbres y mucha confianza. Fueron tiempos de carencias económicas y dificultades constantes, en las que no existían las vacaciones…y nos empujaba una fuerza inmensa."
            ]
        },
        {
            paragraphs: [
                "Desde el 2001 al 2009 realizamos la gestión de la escuela a través de la asociación AFER (Asociación de Familias para una Educación Responsable), creada con las primeras familias de La Casita en 1996. En el 2009 pasamos de asociación a cooperativa de trabajo sin ánimo de lucro: Experiència educativa El Roure SCCL., que ha gestionado el proyecto hasta el 2025, año en el que se cierra. Como cooperativa hemos pertenecido a la Federació de Cooperatives de Treball de Catalunya y a EscolesCoop (Federació de Cooperatives d'Ensenyament de Catalunya).",
                "Tuvimos la fortuna de que, desde el primer momento, el Ayuntamiento de Mediona nos dió la bienvenida y se mostró colaborador. Se ha mantenido una muy buena relación con los dos alcaldes y equipos que han gobernado el municipio durante estos 24 años.",
                "La etapa de Infantil fue autorizada por la Generalitat como \"esplai\" (centro de ocio) de funcionamiento diario.",
                "La autorización de la etapa de Primaria fue mucho más complicada. La normativa de espacios educativos de la Generalitat, está pensada para grandes escuelas y para la separación en aulas de los grupos-clase (según el curso que corresponde a cada edad). Nos requerían seis aulas de primaria, además de espacios comunes diversos. La normativa también requería un titulado en magisterio por grupo-clase (que por la dimensión de la escuela era en nuestro caso de entre 3 y 7 criaturas de la misma edad), además de las especialidades necesarias."
            ]
        },
        {
            paragraphs: [
                "En nuestro caso, los grupos estaban definidos por la etapa evolutiva (3-6, 7-11 y 12-16 años), priorizando la riqueza de la convivencia de esta pluralidad de edades. Los espacios estaban preparados según las actividades y materiales que acogían y los niños, niñas y adolescentes se movían libremente por los espacios.",
                "En 2017, tras un enorme esfuerzo económico y organizativo por parte de toda la comunidad (que incluyó un micromecenazgo impulsado por las familias), se pudo potabilizar el agua del pozo que suministraba la finca y reformar los edificios de forma que se cumpliera la normativa. Así conseguimos la autorización como escuela de primaria por parte del Departament d'Educació de la Generalitat de Catalunya.",
                "La etapa de Secundaria, nació en el curso 2014/15, a petición de un grupo de familias de la escuela que querían continuar más allá de los 12 años. Esta etapa no pudo ser autorizada por las condiciones que la Generalitat requería a nivel de espacios y titulaciones del profesorado. Ante la imposibilidad de autorizar la etapa de Secundaria y las dificultades generadas por la normativa especial en las escuelas a raíz del Covid-19, decidimos cerrar el grupo de adolescentes.",
                "La escuela creció hasta llegar a acoger a 90 niñas, niños y adolescentes. Siempre tuvimos vocación de escuela pequeña, lo que nos permitía hacer el trabajo con la profundidad que pretendíamos. Esa dimensión se convirtió en el límite máximo que queríamos asumir."
            ]
        },
        {
            paragraphs: [
                "Desde el 2001 fuimos participando en algunos eventos educativos, presentando la experiencia de La Casita y el incipiente proyecto de El Roure. Gradualmente ampliamos nuestra presencia en el panorama educativo, compartiendo con más frecuencia nuestra experiencia a través de charlas, artículos en publicaciones educativas, colaboraciones en formaciones, y además, a partir del 2009, comenzamos a ofrecer nuestras propias formaciones y acompañamientos a familias y profesionales.",
                "Después del confinamiento por el coronavirus del 2020, la escuela fue decreciendo. El mundo era otro al de los inicios; las familias tendían más a la escolarización pública gratuita y cercana a su vivienda, algunas escuelas públicas habían ido paulatinamente abriéndose hacia la creación de ambientes con materiales manipulativos, la llamada \"libre circulación\", la integración de la pedagogía sistémica y un cuidado mayor del aspecto emocional.",
                "A raíz de serias dificultades en la finca, la disminución del número de familias y la falta de relevo en la coordinación de la escuela, decidimos el cierre definitivo."
            ]
        }
    ],
    fundamentosContent: [
        {
            title: "La autorregulación espontánea.\nEl contacto con la naturaleza propia.",
            paragraphs: [
                "El organismo humano, como cualquier otro organismo vivo, dispone de una gran capacidad esencial para la vida: satisfacer sus necesidades fundamentales. La principal necesidad es desarrollar el propio potencial.",
                "Existe un diálogo entre la necesidad propia y el entorno, de modo que sea posible optar por lo más adecuado para mantener la vitalidad y hacer crecer el potencial interno.",
                "Esa vitalidad es un movimiento entre la tensión y la distensión; de manera autónoma e involuntaria, el organismo se contrae y después busca la relajación. Así se autorregula, tanto a nivel psíquico como físico.",
                "El organismo forma una auténtica unidad con diferentes dimensiones: la físico-energética, emocional, mental y trascendente.",
                "Existe un impulso vital íntimo e involuntario que regula la vida en nuestro organismo; este impulso ajusta instintivamente nuestras necesidades internas con la realidad externa que vamos viviendo. Para que este diálogo surja de una manera fluida, es necesario que nuestro organismo esté sensible y flexible, tanto a nivel físico como psíquico.",
                "Cada uno de nosotros es único; tiene sus propias capacidades y dificultades, necesidades y prioridades, tiene una mirada, una forma de relacionarse, una manera de aprender, un ritmo vital particular. Todos tenemos capacidad intelectual, emocional y física, pero en cada cual, unas predominan sobre las otras. Es esta peculiar combinación de capacidades y sus matices lo que nos define como personas únicas; constituyen nuestra naturaleza peculiar.",
                "Hay un impulso vital involuntario que indica a cada niña y niño qué necesita en cada momento y cómo moverse hacia ello. Es el que nos muestra si tenemos necesidad de llorar o de reír, de estar solos o acompañados, de comer o ayunar, de estar activos o pasivos, de compartir o defender lo nuestro, de emprender nuevos aprendizajes o consolidar otros, de interesarnos por nuevas amistades o buscar la compañía de los conocidos, etc. Es un impulso que incluye todo aquello físico y psíquico, y se expresa en múltiples lenguajes. Es el indicador de un mecanismo de autorregulación que nos permite mantener y cuidar nuestra vitalidad. En la medida que se da esa autorregulación y la satisfacción de las necesidades íntimas, la criatura se mantiene con capacidad para abordar con apertura y flexibilidad las situaciones que se presentan; la resolución de conflictos, la liberación de las tensiones acumuladas o la exploración de nuevos aprendizajes."
            ]
        },
        {
            title: "El acompañamiento respetuoso;\nel marco necesario para el crecimiento.",
            paragraphs: [
                "Los niños, niñas y adolescentes necesitan un marco de confianza, referencia y seguridad emocional de los adultos para poder ser felices y hacer crecer su potencial vital.",
                "La relación entre los adultos y las niñas, niños o adolescentes, requiere presencia y disponibilidad. También un especial cuidado de la comunicación: saber escuchar y saber expresar nuestra sana autoridad como adultos.",
                "El adulto es el encargado de cuidar el ambiente que rodea a cada criatura para que pueda desarrollar su potencial interno. El lugar del adulto representa un espacio de escucha y acogida, de confianza y fiabilidad, en el que la criatura puede madurar aprendiendo a dialogar entre su necesidad interna y la circunstancia externa.",
                "Es una relación enmarcada en un orden sistémico, en la que el adulto tiene una perspectiva mayor y por tanto la responsabilidad de las decisiones que escapan a la visión y capacidad de la criatura. Se trata de una sana autoridad, que surge de un estado de presencia y de conexión con la sabiduría innata del adulto cuidador. La criatura a su vez, necesita dedicarse con toda amplitud, autonomía e intensidad a su exploración de sí mismo y del mundo y para ello necesita adultos maduros y sólidos en los que confiar, a los que seguir.",
                "Es el amor bien entendido, en toda su dimensión de aceptación incondicional y de límite natural, lo que facilita traspasar la dificultad. En esta relación entre el adulto y la criatura, la verdadera clave es la auténtica comunicación; no es una comunicación entre iguales, sino entre el que cuida y el que es cuidado. En la medida que se da esa relación, se genera el vínculo afectivo y la sana autoridad adulta, que proporciona seguridad y la confianza para que la criatura siga su guía cuando es necesario.",
                "Ese ambiente amoroso, necesario para que las criaturas crezcan, tiene dos vertientes: la libertad para moverse según su impulso vital y sus intereses, y los límites naturales, que le proporcionan la seguridad necesaria para hacerlo. El límite natural es una indicación que muestra y señala hasta dónde se puede llegar cuando la criatura no tiene capacidad para verlo o hacerlo. El límite va mostrando lo que es necesario tener en cuenta dentro y fuera de sí misma; así contribuye a integrar la consciencia de sí, de los demás y del mundo que le rodea."
            ]
        },
        {
            title: "Cuidar el deseo innato de aprender.",
            paragraphs: [
                "Como seres humanos disponemos de una inmensa capacidad innata de aprendizaje autónomo que se activa a través de la curiosidad y el diálogo permanente entre el deseo interno y el entorno, y que es posible mantener a lo largo de toda la vida. Cada cual tiene una manera y un ritmo de aprendizaje que nos es propio, en comunicación permanente con nuestra naturaleza y nuestro momento vital. Es fundamental respetar y cuidar este impulso interno en un ambiente rico en situaciones y experiencias de aprendizaje.",
                "Tenemos la capacidad de desarrollar lo que ya somos como potencial y de autorregular el intercambio con el entorno, es decir, de discernir el contenido, el momento y la medida de un determinado aprendizaje. Esta capacidad se manifiesta desde el nacimiento y de forma innata, como una gran curiosidad y ganas de aprender, que permite que los niños conquisten aprendizajes de gran complejidad de una manera autónoma. Es una cuestión de supervivencia, porque es la que surge del mismo hecho de crecer y de la necesidad de acoplamiento al entorno. Por eso es fundamental un ambiente rico y próximo, que cubra las necesidades de la criatura con posibilidades de vivencias diversas y rodeadas de un afecto incondicional.",
                "Apoyamos las ganas de autonomía que se manifiestan desde las primeras edades y que consideramos la vía natural, valiosa y eficaz que tienen las niñas y los niños para desarrollar sus capacidades. Este hecho implica dejar un espacio para que las criaturas encuentren sus propias soluciones en las situaciones que se les presentan, ya sea un conflicto en las relaciones, una caída, una dificultad en la experimentación, etc. También implica reconocer el valor del fracaso o de la frustración.",
                "En todo caso, nuestro papel como adultos no es el de evitar o solucionar problemas, sino el de acompañar las dificultades que puedan surgir porque las resuelvan con sus propios recursos; de este modo serán aprovechadas para avanzar. Nuestro papel no pasa por dar respuestas cerradas y directas a sus preguntas, sino por servir de eco y de interlocutores para que surja y se construya una respuesta propia."
            ]
        }
    ],
    formacionContent: [
        {
            title: "Formación y acompañamiento",
            paragraphs: [
                "A lo largo de estos años, desde El Roure hemos compartido nuestra experiencia y nuestra mirada sobre la educación y el crecimiento a través de diferentes espacios de formación.",
                "Hemos ofrecido talleres, cursos y acompañamiento tanto para familias como para profesionales de la educación, compartiendo herramientas y reflexiones que puedan ayudar en el camino de acompañar a las criaturas desde el respeto a su naturaleza y ritmo.",
                "Nuestros espacios de formación han abordado temas como la autorregulación, el acompañamiento respetuoso, los límites naturales, la gestión emocional, y la importancia del vínculo en los procesos de aprendizaje.",
                "Creemos en la importancia de que los adultos que acompañan a las criaturas dispongan de espacios propios de reflexión, crecimiento personal y apoyo mutuo, para poder sostener con presencia y consciencia su función."
            ]
        }
    ],
    people: [
        {
            name: "Begoña González",
            paragraphs: [
                "He sido co-fundadora, coordinadora y acompañante del espacio educativo La Casita y de la escuela viva El Roure. Soy madre, maestra, formadora, orientadora y articulista, me he formado en diferentes disciplinas corporales, espirituales, artísticas, psicológicas y educativas, en Comunicación consciente (CNV) y en facilitación de grupos.",
                "En este momento me dedico al acompañamiento a madres, padres y profesionales, a partir de las diferentes situaciones y dificultades cotidianas que comporta la relación con niñas, niños y adolescentes. Por otro lado, facilito formaciones adaptadas a las necesidades de colectivos educativos interesados en el enfoque de la educación viva y la comunicación consciente.",
                "Puedes contactar conmigo al 645 611 824 o a begona.gomi@gmail.com"
            ]
        },
        {
            name: "Paco Robles",
            paragraphs: [
                "Soy padre, educador, formador y asesor pedagógico. He estado vinculada profesionalmente a la Escuela Viva El Roure desde el 2009 hasta su cierre (2025), desarrollando múltiples roles como acompañante, coordinador de ciclo, formador y director.",
                "Antes de El Roure, mi trayectoria se centró en la educación social y la educación en el tiempo libre.",
                "Actualmente, colaboro con el Departament d'Educació de la Generalitat de Catalunya, con el rol de formador pedagógico para claustros y docentes de centros educativos, dentro de programas de innovación educativa. También asesoro a algunas familias en el acompañamiento de sus hijos e hijas, sobre todo durante la etapa adolescente.",
                "La manera más sencilla y directa de contactar conmigo es a través del correo electrónico: frobles5@xtec.cat"
            ]
        },
        {
            name: "Clara Jiménez Rodríguez",
            paragraphs: [
                "He estado vinculada profesionalment a la Escuela Viva El Roure desde el 2011 hasta su cierre como acompañante, coordinadora y directora. Mi formación básica es Educación Social y mi formación complementaria es Intervenció Sistémica con infancia y familia, Pedagogía Sistémica y Posgrado en Práctica Psicomotriz Aucouturier, entre otras.",
                "Actualmente, me dedico a acabar la formación de Terapia en Integración Psico-corporal. Al mismo tiempo, acompaño familias que tienen ganas de indagar y generar un crecimiento personal-familiar y/o encuentran dificultades en su dinámica relacional.",
                "Me puedes contactar en: clarajiro@gmail.com o al 670 204 009"
            ]
        }
    ],
    comunidadText: [
        "Hemos creado este espacio para las personas que habéis formado parte de la Comunidad de la escuela.",
        "SUBTITLE:Fotos y Contactos",
        "Querida comunidad,",
        "Después de mucho trabajo, hemos conseguido hacer una selección de fotos desde el 2001 al 2025, para que podáis descargar las que queráis y tener un recuerdo de vuestro paso por El Roure. No ha sido fácil; partíamos de un archivo de 21.700 fotos, que durante estos años, y a pesar de algunos intentos generosos, no tuvimos ocasión de ordenar. En esta selección ha sido necesario poner únicamente  fotos de las personas que habéis enviado vuestra autorización de imagen. En ella están las fotos que se pueden ver en esta web memoria que de lo que fue nuestro proyecto y otras más.",
        "En el caso de que alguna persona tenga inconveniente en salir en alguna de las fotos de los apartados del menú de la web, nos lo podéis comunicar y la retiraremos. Igualmente, si habéis enviado la autorización de imagen y no encontráis en la selección ninguna foto de vuestra familia, os podéis poner en contacto con nosotros y trataremos de buscar alguna en el archivo.",
        "Esperemos que las disfrutéis. Un gran abrazo,",
        "Además, miembros de la comunidad han creado un documento donde las personas que queráis manteneros en contacto o bien organizar algún encuentro, podéis dejar vuestro datos y acceder a los de los demás.",
        "Para acceder os facilitaremos una contraseña que podéis pedir en el correo:",
        "experienciaroure@proton.me"
    ],
    videosList: [
      {
        title: "El Roure, una escuela viva - Documental de Antonio Laforgia",
        description: "\"¿Es posible una escuela diferente a la de aulas grises, notas en el libro de escolaridad y nociones aprendidas de memoria tal como la mayoría de nosotros la ha experimentado? ¿Y es posible imaginar una sociedad diferente a la actual sin reexaminar el modelo de educación en el que está basada?\"",
        link: "https://vimeo.com/115516270?fl=pl&fe=vl",
        embedId: "115516270",
        type: "vimeo"
      },
      {
        title: "Conversación de Antonio Laforgia con Begoña González",
        description: "Una conversiación de Antonio Laforgia, creador del documental sobre el roure \"El Roure, una escuela viva\" con Begoña González, cofundadora de El Roure.",
        link: "https://youtu.be/KjIFGiM6P7U",
        embedId: "KjIFGiM6P7U",
        type: "youtube"
      },
      {
        title: "Explorando la escuela El Roure, de Baobab.",
        description: "\"En nuestra visita a El Roure, en la provincia de Barcelona, Begoña nos regaló esta entrevista/conversación donde de manera clara y profunda nos compartió su visión sobre la educación y el enfoque de la escuela. Toda nuestra gratitud por acogernos y por la generosidad de compartir su experiencia y comprensión.\"",
        link: "https://www.youtube.com/watch?v=wnhU8cmO1i0",
        embedId: "wnhU8cmO1i0",
        type: "youtube"
      },
      {
        title: "Conversación de Baobab con Begoña González.",
        description: "\"En nuestra visita a El Roure, en la provincia de Barcelona, Begoña nos regaló esta entrevista/conversación donde de manera clara y profunda nos compartió su visión sobre la educación y el enfoque de la escuela. Toda nuestra gratitud por acogernos y por la generosidad de compartir su experiencia y comprensión.\"",
        link: "https://www.youtube.com/watch?v=XMepo_l0JC4",
        embedId: "XMepo_l0JC4",
        type: "youtube"
      },
      {
        title: "Participación de Paco Robles en el Podcast En Crisis",
        description: "Participación de Paco Robles en el Podcast En Crisis \"No tenía ni idea de que podías educar a niños de esta manera y me ha encantado. Paco Robles nos cuenta cómo educan en una escuela muy distinta a la que yo fui. Cómo los niños y niñas planifican sus viajes, eligen qué aprender y consensúan casi todas las decisiones. Da que pensar, eh.\"",
        link: "https://open.spotify.com/episode/6F43jd5ZbYQKnKpAo9NGCy",
        embedId: "6F43jd5ZbYQKnKpAo9NGCy",
        type: "spotify"
      },
      {
        title: "(clicar en más información, o \"Learn More\", para ver) Conversación del proyecto Ametxe con Begoña González. JolasBIDE 2024.",
        description: "\"Entrevista a Begoña González, fundadora de la escuela viva El Roure de Cataluña, en su visita a Euskadi para el curso que se desarrolla entre las escuelas de Landabaso en Zalla (Bizkaia) y Bizilore en Azpeitia (Gipuzkoa). Entrevista realizada en el proyecto Ametxe, una comunidad generada en una vivienda cooperativa en cesión de uso en ámbito rural en Gordexola, Bizkaia. JolasBIDE 2024.\"",
        link: "https://vimeo.com/1046320608",
        embedId: "1046320608",
        type: "vimeo"
      },
      {
        title: "Somos Naturaleza - El Roure",
        description: "Un video realizado para promocionar la antigua formación Savia, que recoge la esencia de El Roure y su mirada sobre la educación, el acompañamiento y la crianza.",
        link: "https://www.youtube.com/watch?v=f5bQT8VZTpA",
        embedId: "f5bQT8VZTpA",
        type: "youtube"
      }
    ] as VideoItem[],
    articles: [
        // Revista Roure (con PDF)
        { title: "ESCRIPTORROURES", author: "Paco Robles", tags: ["Escritura", "Revista Roure"], file: "/pdfs/ESCRITORROURES.pdf" },
        { title: "Amigos y amigas por carta", author: "Mercè de la Cruz", tags: ["Escritura", "Revista Roure"], file: "/pdfs/AMIGOS-Y-AMIGAS-POR-CARTA.pdf" },
        { title: "Celebrando el milagro de la vida", author: "Mercè de la Cruz", tags: ["Aprendizaje"], file: "/pdfs/CELEBRANDO-EL-MILAGRO-DE-LA-VIDA.pdf" },
        { title: "Cris se va (2007)", author: "Begoña González", tags: ["Sistémica", "Revista Roure", "Cristóbal Gutiérrez"], file: "/pdfs/CRIS-SE-VA-2007.pdf" },
        { title: "Cristóbal trajo el Seitai a El Roure", author: "Begoña González", tags: ["Fundamentos", "Revista Roure", "Cristóbal Gutiérrez"], file: "/pdfs/CRISTOBAL-TRAJO-EL-SEITAI-A-EL-ROURE.pdf" },
        { title: "Divídete y sufrirás", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Fundamentos", "Revista Roure"], file: "/pdfs/DIVIDETE-Y-SUFIRAS.pdf" },
        { title: "Dues experiències de restauració", author: "Paco Robles", tags: ["Actividad", "Revista Roure"], file: "/pdfs/DUES-EXPERIENCIES-DE-RESTAURACIO.pdf" },
        { title: "El consumismo que enturbia el alma", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Familia", "Revista Roure"], file: "/pdfs/EL-CONSUMISMO-QUE-ENTURBIA-EL-ALMA.pdf" },
        { title: "El Roure Boletín 13", author: "Varios", tags: ["Boletín Roure"], file: "/pdfs/EL-ROURE-BOLETIN-13.pdf" },
        { title: "Intros Boletín El Roure", author: "Varios", tags: ["Boletín Roure"], file: "/pdfs/Intros Boletín El Roure.pdf" },
        { title: "En busca de una feminidad y masculinidad naturales", author: "Begoña González", tags: ["Género", "Revista Roure"], file: "/pdfs/EN-BUSCA-DE-UNA-FEMINIDAD-Y-MASCULINIDAD-NATURALES.pdf" },
        { title: "¿Estamos o no haciendo matemáticas?", author: "Lara Jiménez", tags: ["Matemáticas", "Revista Roure"], file: "/pdfs/ESTAMOS-O-NO-HACIENDO-MATEMATICAS.pdf" },
        { title: "Hora de marcharme de El Roure", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Sistémica", "Revista Roure"], file: "/pdfs/HORA-DE-MARCHARME-DE-EL-ROURE.pdf" },
        { title: "In Memoriam", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Sistémica", "Revista Roure"], file: "/pdfs/IN-MEMORIAM.pdf" },
        { title: "La mirada amorosa", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Familia", "Revista Roure"], file: "/pdfs/LA-MIRADA-AMOROSA.pdf" },
        { title: "Límites y limitaciones", author: "Begoña González", tags: ["Límites", "Revista Roure"], file: "/pdfs/LIMITES-Y-LIMITACIONES.pdf" },
        { title: "Que la vida sea el eje de la educación", author: "Ulrike Kaesse y Begoña González", tags: ["Fundamentos", "Revista Roure"], file: "/pdfs/QUE-LA-VIDA-SEA-EL-EJE-DE-LA-EDUCACION.pdf" },
        { title: "Que ser valiente no salga tan caro", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Fundamentos", "Revista Roure"], file: "/pdfs/QUE-SER-VALIENTE-NO-SALGA-TAN-CARO.pdf" },
        { title: "Taller d'Andromines", author: "Montse Bertran", tags: ["Actividad", "Revista Roure"], file: "/pdfs/TALLER-D-ANDROMINES.pdf" },
        
        // Revistas con enlace
        { title: "El flux de l'apendre", author: "Begoña González", tags: ["Aprendizaje"], link: "https://www.iquiosc.cat/publicacions/viure-en-familia/97", additionalInfo: "Viure en familia Nº 97 (Gener 2023)" },
        { title: "El auge de la escuela libre", author: "Claudina Navarro y Manuel Núñez", tags: ["Fundamentos"], link: "https://dialnet.unirioja.es/ejemplar/186802", additionalInfo: "Integral, Nº 340 (2008)" },
        { title: "El Roure, una escuela para cuidar el alma infantil", author: "Begoña González", tags: ["Fundamentos"], link: "https://dialnet.unirioja.es/servlet/articulo?codigo=1037096", additionalInfo: "Cuadernos de pedagogía, Nº 341, pp. 30-34 (2004)" },
        { title: "Escuela El Roure; materializar una ilusión", author: "Begoña González", tags: ["Fundamentos"], link: "https://dialnet.unirioja.es/servlet/articulo?codigo=684601", additionalInfo: "Cooperación educativa - Kikirikí, Nº 70 pp.21-26 (2003)" },
        { title: "El Roure, escuela viva", author: "Begoña González", tags: ["Fundamentos"], link: "https://dialnet.unirioja.es/servlet/articulo?codigo=768515", additionalInfo: "Cooperación educativa - Kikirikí, Nº 71-72, pp. 92-99 (2003)" },
        { title: "Diario de La Casita: África", author: "Begoña González", tags: ["La Casita"], link: "https://dialnet.unirioja.es/ejemplar/40146", additionalInfo: "Cooperación educativa - Kikirikí, Nº 62-63, pp.104-105 (2001-02)" },
        { title: "La Casita, un proyecto alternativo en la primera infancia", author: "Cuadernos de pedagogía", tags: ["La Casita", "Fundamentos"], link: "https://dialnet.unirioja.es/ejemplar/4051", additionalInfo: "Cuadernos de pedagogía. Nº 283, pp. 28-36 (1999)" },
        { title: "Habitar el espacio y el tiempo en la escuela alternativa: recorridos y relatos Universitat de Barcelona", author: "José Contreras y Begoña González", tags: ["Fundamentos"], link: "https://www.academia.edu/40107171/Habitar_el_espacio_y_el_tiempo_en_la_escuela_alternativa_recorridos_y_relatos_Universitat_de_Barcelona" },
        { title: "Qué sentido tiene la navidad en la escuela", author: "Begoña González", tags: ["Cultura"], link: "https://viureenfamilia.wordpress.com/2019/12/12/quin-sentit-te-el-nadal-a-lescola/", additionalInfo: "Revista Viure en familia. Nº 76 12 Desembre 2019" },
        { title: "Hacia el encuentro", author: "Begoña González", tags: ["Grupo"], link: "https://diarieducacio.cat/cap-a-la-trobada/?hilite=trobada", additionalInfo: "El diari de l'educació. Juny 27, 2022" },
        { title: "Cuidar la vida que somos", author: "Begoña González", tags: ["Fundamentos"], link: "https://www.grao.com/revistas/renaturalizar-los-espacios-y-los-tiempos-educativos-42841", additionalInfo: "Renaturalizar los espacios y los tiempos educativos. Revista Dosier - Número: 7 (gener 22)" },
        { title: "Acompanyament i solituds necessàries", author: "Begoña González", tags: ["Acompañamiento"], link: "https://revistaaula.com/", additionalInfo: "Revista Aula de Innovación Educativa (2021)" },
        { title: "El canvi de mirada", author: "Begoña González", tags: ["Fundamentos"], link: "https://revistaaula.com/", additionalInfo: "Revista Aula de Innovación Educativa (2020)" },
        { title: "Acompanyar el moviment intern i la relació", author: "Begoña González", tags: ["Acompañamiento"], link: "https://revistaaula.com/", additionalInfo: "Revista Aula de Innovación Educativa (2019)" },
        
        // Revistas sin enlace
        { title: "El Roure, un espacio para crecer", author: "Begoña González", tags: ["Fundamentos"], additionalInfo: "Senderi, butlletí nº 24 (Gener 2006) - www.senderi.org (sin enlace)" },
        { title: "Escola El Roure. Un model de comunitat d'aprenentatge per a cuidar la vida", author: "Begoña González", tags: ["Fundamentos"], additionalInfo: "Fòrum. Revista d'organització i gestió educativa. L'educació alternativa, Nº 45 (2018) (sin enlace)" },
        { title: "El Roure, escola viva", author: "Begoña González", tags: ["Fundamentos"], additionalInfo: "Viure en familia, Nº 50 (2013) (sin enlace)" },
        { title: "El Roure, escuela viva", author: "Begoña González", tags: ["Fundamentos"], additionalInfo: "Crecer en familia, Nº 25 (2013) (sin enlace)" },
        { title: "La casita: nens i nenes creixent lliures", author: "Begoña González", tags: ["La Casita", "Fundamentos"], additionalInfo: "Viure en família Nº 1, pp.42-43 (2000) (sin enlace)" },
        
        // Revista La Casita (con PDF)
        { title: "Cosas que pasan", author: "Begoña González", tags: ["Actividad", "Revista La Casita"], file: "/pdfs/COSAS-QUE-PASAN.pdf" },
        { title: "Despedida", author: "Begoña González y Cristóbal Gutiérrez", tags: ["Sistémica", "Revista La Casita", "Cristóbal Gutiérrez", "Duelo"], file: "/pdfs/DESPEDIDA.pdf" },
        { title: "Despiértate papá y mamá", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Familia", "Revista La Casita"], file: "/pdfs/DESPIERTATE-PAPA-Y-MAMA.pdf" },
        { title: "La muerte de cada día", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Duelo", "Fundamentos", "Revista La Casita"], file: "/pdfs/LA-MUERTE-DE-CADA-DIA.pdf" },
        
        // Otros con PDF
        { title: "Cines, bebés y sensibilidad", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Familia"], file: "/pdfs/CINES-BEBES-Y-SENSIBILIDAD.pdf" },
        { title: "Boletin Roure - Especial Cristobal", author: "Varios", tags: ["Cristóbal Gutiérrez", "Duelo"], file: "/pdfs/Boletin Roure - Especial Cristobal.pdf" },
        { title: "Habitar el espacio y el tiempo en la escuela alternativa", author: "José Contreras Domingo y Begoña González", tags: ["Aprendizaje"], file: "/pdfs/Habitar-el-espacio-y-el-tiempo-en-la-escuela-alternativa.pdf" },
    ]
  },
  ca: {
    nav: {
      historia: 'Història',
      fundamentos: 'Fonaments',
      formacion: 'Formació',
      escuela: 'Escola',
      videos: 'Audiovisuals',
      textos: 'Artícles',
      comunidad: 'Comunitat Roure',
      en_que_estamos: 'En què estem?',
      back: 'Tornar',
      top: 'Pujar'
    },
    header: {
        left: "El Roure. Educació Viva.",
        right: "El que va ser."
    },
    home: {
      text1: 'Del 2001 al 2025 vam fer un viatge fascinant: una escola per a famílies amb criatures de 3 a 16 anys.',
      text2: 'Quin ha estat el nord d\'aquest viatge?',
      highlight: 'Cada criatura és una llavor.',
      text3: 'La força i la intel·ligència de la vida s\'ocupen que es manifesti i es desenvolupi. Volem sintonitzar amb aquest batec, recolzar-lo i deixar enrere el que ens limita, per acompanyar-los, per acompanyar-nos, des del respecte i la consciència de la naturalesa de cadascú.',
      footer: 'web creada per'
    },
    escuela: {
      menu: {
        intro: 'Introducció',
        aprendizaje: 'Aprenentatge',
        acompanamiento: 'Acompañamiento',
        equipo: 'L\'equip',
        familias: 'Les famílies',
        etapas: 'Etapas, temps i espais',
        '3-6': 'De 3 a 6 anys',
        '6-12': 'De 6 a 12 anys',
        '12-16': 'De 12 a 16 anys',
      },
      titles: {
        
      }
    },
    escuelaContent: {
        intro: [
            "L'escola El Roure va néixer el 2001, amb el concepte d'escola viva. Ha estat una comunitat d'aprenentatge unida per una visió de l'educació inspirada pel Seitai, la Sistèmica i l'experiència quotidiana entre famílies, professionals i criatures. El propòsit va ser acompanyar les criatures en el seu creixement i les mares i pares en su funció."
        ],
        aprendizaje: [
            "L'aprenentatge és una experiència vital ineludible perquè és la dinàmica de desenvolupament del potencial particular que cada criatura. De forma natural sempre estem aprenent, en tot lloc i moment i d'una manera global, amb tot el nostre organisme implicat; la nostra capacitat física-energètica, emocional, intel·lectual i transcendent.",
            "El veritable aprenentatge es dóna a partir de l'impuls vital de cada nen i és el fruit del diàleg continuat entre el seu interior i l'exterior. Tot i que és una dinàmica intrínseca al fet d'estar vius, pot ser afavorida i alimentada o dificultada i adormida.",
            "A El Roure hem buscat una experiència d'aprenentatge sòlida, arrelada, viva. Perquè es doni aquest nivell d'aprenentatge, el procés ha de tenir com a eix el desig i la necessitat pròpia i el respecte al ritme i recorregut peculiars de cadascú.",
            "Aquests processos individuals estaven emmarcats en un context ampli, en el qual tractem d'acompanyar la globalitat del creixement de cada criatura sense sobrevalorar cap aspecte sobre un altre: el seu món emocional, els seus aprenentatges culturals, la seva capacitat de reflexió, d'expressió i comunicació amb els altres, la consciència de si mateixos, el seu desenvolupament motriu, la seva creativitat, etc.",
            "Considerem artificial i limitadora la separació, respecte a l'aprenentatge, entre família i escola. L'aprenentatge es dóna de forma contínua i els seus continguts formen part d'un únic procés en què tot està connectat. Per això proposàvem que la mare i el pare assumeixin el dret i la responsabilitat bàsica en aquest acompanyament, en lloc de l'actitud de delegar en els professionals de l'educació i a l'escola una part fonamental de la seva funció.",
            "Què aprenen els nens i nenes?",
            "Quan es parla d'aprenentatge, sovint es limita aquest concepte a l'aprenentatge de coneixements. Fins i tot sol quedar encara més reduït en entendre que es refereix als coneixements intel·lectuals. L'aprenentatge, per contra, és una experiència il·limitada; no només perquè és impossible deixar d'aprendre mentre existeix vida, sino perquè els objectes de l'aprenentatge són infinits.",
            "Cada nen i nena ha d'aprendre a caminar, a parlar, a tolerar la frustración, a tenir en compte els altres, a entendre's, a conèixer el llenguatge de les emocions, a conèixer la seva cultura i la de los altres, a conèixer el seu cos i les seves capacitats, a elaborar pensaments propis, etc. És tot l'ésser el que aprèn i els aprenentatges no estan parcel·lats ni aislados uns de d'altres.",
            "A El Roure tot ha estat al servei de l'aprenentatge a partir de les realidades individuals i grupals que s'anaven donant. Hem contemplat un currículum obert, dinàmic i flexible, materials, espais, activitats, metodologies, situacions i possibilitats en continu moviment.",
            "Com aprenen els nens?",
            "L'aprenentatge no és un procés lineal, progressiu i rítmic, tampoc està lligat contínuament a la consciència. Està més aviat lligat al benestar vital i, consecuentment, a l'ambient, a la qualitat de la vivencia i la comunicació. Per aquest motiu, és possible observar tanto recorreguts amb caràcter constant i gradual, com sobtats i amb avenços sorprenents.",
            "Creiem que és urgent desterrar la idea d'entrenament, del valor d'allò quantitatiu en l'aprenentatge. A la pràctica, fer amb sentit (llegir, escriure, parlar, moure's, relacionar-se, crear, etc.) significa que tot l'organisme està actiu, implicat en la vivència, i això és el que permet que l'aprenentatge sedimenti.",
            "Activitats autònoma i estructurada",
            "A El Roure, els nens i nenes s'han mogut constantment, de forma fluida i voluntària entre dues experiències d'aprenentatge i relació: l'activitat autònoma i l'activitat estructurada.",
            "L'activitat autònoma i espontània és la natural i necessària fonamentalment en la infància. És a través d'aquesta activitat que el nen busca i troba el necessari per al seu benestar més íntim, segons una sensible guia innata. Al llarg de tota la infància, aquesta activitat consisteix principalment en el joc, que és la via de l'experimentació imprescindible per a l'aprenentatge."
        ],
        acompanamiento: [
            "Hi ha un eix i una direcció en el camí de recerca de la nostra experiència d'acompanyament: cuidar l'essència de l'esperit infantil. La mirada original dels nens està il·luminada pel desig de ser i aprendre; això demana un ampli marge d'autonomia i una estreta relació amb els adults. El Roure ha estat un espai de trobada i acompanyament entre famílies i equip pedagógico al voltant de l'experiència de la criança infantil.",
            "Aquest acompanyament té dos vessants: d'una banda, l'acompanyament a nens i nenes en un ambient respectuós i ric en vivències individuals i col·lectives. D'altra banda, un acompanyament a mares i pares que convidi a l'observació, la percepció sensible i la reflexió, per donar suport i enriquir l'experiència de criança dels fills i filles."
        ],
        equipo: [
            "A l'equip, sempre hem reconegut que les famílies dipositen una gran confiança en la nostra tasca, simplement pel fet de deixar els fills i filles al nostre càrrec. Vam recollir aquesta responsabilitat, acceptant que som acompanyants secundaris i que els aportem alguna cosa que complementa la funció de mares i pares.",
            "Les persones que formem l'equip pedagògic ens vam proposar desenvolupar la nostra sensibilitat cap a l'escolta, l'observació i la percepció, així com la capacitat d'analitzar, interpretar i reflexionar sobre el que cada nen i nena manifesten. Necessitem tenir iniciativa pròpia per reaccionar i respondre en cada moment i situació amb una determinada intervenció amb cada nen i nena.",
            "L'altra part de la tasca de l'equip pedagògic era l'aportació a mares i pares de la nostra visió dels fills i filles, i del seu acompanyament en cada moment del procés de creixement."
        ],
        familias: [
            "Cada nena i cada nen se sosté sobre la seva família, d'on neix la seva confiança, seguretat i referència necessàries per créixer. La mare i el pare representen l'eix vital en la infància i és el vincle d'amor entre els membres de la família el que permet que el nen o la nena visquin i es desenvolupin de forma sana. Per això considerem que les mares i pares són els primers i principals responsables de l'acompanyament durant el creixement.",
            "A l'escola parlem de Comunitat. La relació que hem volgut plantejar a mares i pares no és la de delegar a l'escola la cura i aprenentatge dels fills i filles, sinó la de formar part i participar de forma activa.",
            "Això requeria un nivell alt de sintonia entre les famílies i l'equip pedagògic. El punt de trobada i de referència era el desenvolupament de la línia educativa del projecte. Respectant aquesta base, tant des de la coordinació de l'equip com cooperativa que va gestionar l'escola, vam anar construint la forma, modificant o consolidant aspectes en funció de la realitat que s'anava donant com a comunitat.",
            "Vam veure que era important que les famílies tinguessin una comprensió profunda de les bases pedagògiques i que la comunicació es donés a diferents nivells i en formats diversos."
        ],
        etapas: [
            "A El Roure teníem dues etapes estables, diferenciades i en relació: Els Cirerers, per a nens i nenes entre 3 y 6 anys i La Ginesta i L'Arbreda, per a nenes i nens entre 7 i 12 anys. També vam tenir, durant uns anys, un grup de 13 a 16 anys que vam anomenar L'Heura.",
            "Considerem que cada etapa requereix un espai i un ambient propis, però trobem enriquidora la convivència d'edats. Per això afavorim formes i situacions d'intercanvi entre els grups.",
            "Entre el final d'una etapa i el començament de la següent hi havia un temps de transició flexible que permetia conèixer l'ambient i el grup de la nova etapa i fer-se conscient del canvi.",
            "Tant l'espai interior com l'exterior de cada etapa eren habitats lliurement com a espais d'aprenentatge i exploració. L'espai exterior ens venia donat per una finca extensa envoltada de bosc en un entorn rural."
        ],
        '3-6': [
            "Les nenes i nens més petits exploren constantment d'una manera global i enormement eficaç. En aquesta etapa és especialment rellevant el vincle afectiu amb l'adult, l'experimentació a través del joc sensorial, psicomotriu i simbòlic, per això l'experimentació corporal, la manipulació de materials i objectes concrets, els contes i el joc simbòlic són fonamentals.",
            "Qualsevol de les seves activitats lúdiques, de relació, de expressió, de motricitat, porta implícita una gran quantitat i varietat d'aprenentatges: quan un nen juga al sorral traspassant aigua d'un recipient a un altre i la barreja amb la sorra per fer una pasta; quan construeix torres amb peces de fusta o circuits amb rampes, rectas y desnivells per fer passar pilotes; quan estira la corda d'un carretó buit, primer, i després amb dos amics que s'hi han enfilat i comprova la diferència, està comprenent vivencialment lleis de la física.",
            "L'activitat bàsica en aquesta etapa era totalment espontània. Els diferents materials estan a l'abast dels nens i nenes per ser empleats en els espais destinats a els: racons de joc simbòlic, de construccions, de matemàtiques i de lectoescriptura, sala de moviment i música, talleres de plàstica i ciències naturals, sorral exterior, etc."
        ],
        '6-12': [
            "Comença una etapa en què els nens i nenes ja poden estar preparats per iniciar el camí d'un aprenentatge més abstracte. Es comença a fer conscient el desig d'aprendre i es pot enfocar voluntàriament en una direcció determinada. Es van interessant més pels coneixements relacionats amb el món adult i va creixent la capacitat i l'interès per les activitats en grup.",
            "L'activitat autònoma segueix sent fonamental i es desenvolupa en els diferents espais disponibles. L'activitat estructurada té un paper més important en aquesta etapa. Els nens estan cada vegada més interessats en activitats més abstractes, organitzades, estructurades i vinculades a l'adult i al grup.",
            "Entenem que existeixen diverses formes de desenvolupar un aprenentatge estructurat i es tracta d'oferir punts de partida perquè cada nen i nena pugui moure's en aquesta diversitat segons la seva particular sensibilitat i naturalesa. Per això existeixen formes individuals o de grup, autònomes o acompanyades pels adults, concretes o abstractes.",
            "Hi ha nens i nenes amb necessitats d'un acompanyament més proper i continuat o qualsevol pot tenir moments puntuals de dificultat, rebuig, resistència o bloqueig en relació amb qualsevol tipus d'aprenentatge. En aquests casos establíem un procés d'observació, seguiment i acompanyament més proper de l'habitual."
        ],
        '12-16': [
            "Del curs 2014/15 al curs 2020/21 vam acollir un grup d'adolescents. L'adolescència és una etapa especialment sensible i significativa en el creixement. L'inici de la fertilitat i la transformació del cos marca l'entrada en una nova etapa evolutiva, es deixa la infància i tot l'organisme s'enfoca cap a l'edat adulta.",
            "És l'etapa de la immersió en la recerca de qui sóc, de la consciència de si mateix. Inclou la construcció del pensament crític cap al món adult i la recerca del model del món que vull. És el temps per conquerir la plena autonomia, l'expressió de les capacitats individuals i de grup.",
            "Les capacitats de decisió, autonomia, responsabilitat i compromís s'amplien notablement i és important activar-les en aquesta etapa, permeten desenvolupar potencialitat i canalitzar energies."
        ]
    },
    sections: {
      historia: 'La Nostra Història',
      fundamentos: 'Fonaments Pedagògics',
      videos: 'Audiovisuals',
      textos: 'Artícles Publicats',
      comunidad: 'Comunitat Roure',
      en_que_estamos: 'En què estem ara?'
    },
    historiaContent: [
        {
            paragraphs: [
                "L'escola El Roure va néixer en 2001 en una finca rústica del municipi de Mediona (Barcelona). La van fundar Begoña González i Cristóbal Gutiérrez, com un pas més en l'evolució de l'experiència en La Caseta (2 a 6 anys), que van crear en 1996, a Barcelona.",
                "La vam anomenar escola viva El Roure. Les seves arrels són l'experiència de criança, el Seitai i la Sistèmica i algunes inspiracions de pedagogies innovadores del s. XX (Montessori, Freinet, Neill, Malaguzzi, etc.). La línia pedagògica es va anar concretant i desenvolupant a través de la pràctica quotidiana amb els nens i nenes, amb les mares i pares, en la relació d'equip. A partir de moltes preguntes, l'observació i la reflexió, alguns criteris es van anar aclarint i confirmant. El procés de descobriment i aprenentatge ha seguit fins al final. El suport, la confiança i la implicació de les primeres famílies i membres de l'equip van ser decisius. La llavor del Roure va trobar les condicions més favorables per a germinar i créixer. Una persona pròxima va fer de mecenes oferint-se a comprar la preciosa finca que triem per a situar el projecte. Comencem amb 6 criatures que venien des de Barcelona i es quedaven a dormir en la masia tres dies a la setmana. A poc a poc el grup va anar creixent i les famílies participants van realitzar tot un canvi de vida traslladant-se a la zona. Aquestes primeres famílies es van lliurar en cos i ànima a la reforma de les edificacions i van implicar familiars i amics.",
                "Va ser una època de treball exhaust, tant en la reforma i adequació de l'espai i en la preparació de materials educatius com en la reflexió i evolució de la metodologia, l'organització i l'explicació de la línia educativa que estàvem creant.",
                "Com tot començament, es va viure en un ambient d'il·lusió i d'implicació molt intens entre l'equip, famílies, amics i professionals que col·laboraven de manera desinteressada. Compartim suor entre ciment, enderrocs i pintura, hores de cuina, tertúlies pedagògiques en sobretaules de grup, somnis, incerteses i molta confiança. Van ser temps de mancances econòmiques i dificultats constants, en les quals no existien les vacances… I ens empenyia una força immensa."
            ]
        },
        {
            paragraphs: [
                "Des del 2001 al 2009 gestionem l'escola a través de l'associació AFER (Associació de Famílies per a una Educació Responsable), creada amb les primeres famílies de La Caseta en 1996. En el 2009 passem d'associació a cooperativa de treball sense ànim de lucre: Experiència educativa El Roure SCCL., que ha gestionat el projecte fins al 2025, any en què es tanca. Com a cooperativa hem pertangut a la Federació de Cooperatives de Treball de Catalunya i a EscolesCoop (Federació de Cooperatives d'Ensenyament de Catalunya).",
                "Vam tenir la fortuna que, des del primer moment, l'Ajuntament de Mediona ens va donar la benvinguda i es va mostrar col·laborador. S'ha mantingut una molt bona relació amb els dos alcaldes i equips que han governat el municipi durant aquests 24 anys.",
                "L'etapa d'Infantil va ser autoritzada per la Generalitat com \"esplai\" (centre d'oci) de funcionament diari.",
                "L'autorització de l'etapa de Primària va ser molt més complicada. La normativa d'espais educatius de la Generalitat, està pensada per a grans escoles i per a la separació en aules dels grups-classe (segons el curs que correspon a cada edat). Ens requerien sis aules de primària, a més d'espais comuns diversos. La normativa també requeria un titulat en magisteri per grup-classe (que per la dimensió de l'escola era en el nostre cas d'entre 3 i 7 criatures de la mateixa edat), a més de les especialitats necessàries."
            ]
        },
        {
            paragraphs: [
                "En el nostre cas, els grups estaven definits per l'etapa evolutiva (3-6, 7-11 i 12-16 anys), prioritzant la riquesa de la convivència d'aquesta pluralitat d'edats. Els espais estaven preparats segons les activitats i materials que acollien i els nens, nenes i adolescents es movien lliurement pels espais. En 2017, després d'un enorme esforç econòmic i organitzatiu per part de tota la comunitat (que va incloure un micromecenatge impulsat per les famílies), es va poder potabilitzar l'aigua del pou que subministrava la finca i reformar els edificis de manera que es complís la normativa. Així aconseguim l'autorització com a escola de primària per part del Departament d'Educació de la Generalitat de Catalunya.",
                "L'etapa de Secundària, va néixer en el curs 2014/15, a petició d'un grup de famílies de l'escola que volien continuar més enllà dels 12 anys. Aquesta etapa no va poder ser autoritzada per les condicions que la Generalitat requeria pel que fa a espais i titulacions del professorat. Davant la impossibilitat d'autoritzar l'etapa de Secundària i les dificultats generades per la normativa especial a les escoles arran del COVID-19, decidim tancar el grup d'adolescents.",
                "L'escola va créixer fins a arribar a acollir a 90 nenes, nens i adolescents. Sempre vam tenir vocació d'escola petita, la qual cosa ens permetia fer el treball amb la profunditat que preteníem. Aquesta dimensió es va convertir en el límit màxim que volíem assumir."
            ]
        },
        {
            paragraphs: [
                "Des del 2001 vam anar participant en alguns esdeveniments educatius, presentant l'experiència de La Caseta i l'incipient projecte del Roure. Gradualment, ampliem la nostra presència en el panorama educatiu, compartint amb més freqüència la nostra experiència a través de xerrades, articles en publicacions educatives, col·laboracions en formacions, i a més, a partir del 2009, comencem a oferir les nostres pròpies formacions i acompanyaments a famílies i professionals.",
                "Després del confinament pel coronavirus del 2020, l'escola va anar decreixent. El món era un altre al dels inicis; les famílies tendien més a l'escolarització pública gratuïta i pròxima al seu habitatge, algunes escoles públiques havien anat gradualment obrint-se cap a la creació d'ambients amb materials manipulatius, l'anomenada \"lliure circulació\", la integració de la pedagogia sistèmica i una cura major de l'aspecte emocional.",
                "Arran de serioses dificultats en la finca, la disminució del nombre de famílies i la falta de relleu en la coordinació de l'escola, decidim el tancament definitiu."
            ]
        }
    ],
    fundamentosContent: [
        {
            title: "L'autoregulació espontània.\nEl contacte amb la naturalesa pròpia.",
            paragraphs: [
                "L'organisme humà, com qualsevol altre organisme viu, disposa d'una gran capacitat essencial per a la vida: satisfer les seves necessitats fonamentals. La principal necessitat és desenvolupar el propi potencial.",
                "Existeix un diàleg entre la necessitat pròpia i l'entorn, de manera que sigui possible optar pel més adequat per a mantenir la vitalitat i fer créixer el potencial intern.",
                "Aquesta vitalitat és un moviment entre la tensió i la distensió; de manera autònoma i involuntària, l'organisme es contreu i després busca la relaxació. Així s'autoregula, tant a nivell psíquic com físic.",
                "L'organisme forma una autèntica unitat amb diferents dimensions: la físic-energètica, emocional, mental i transcendent.",
                "Existeix un impuls vital íntim i involuntari que regula la vida en el nostre organisme; aquest impuls ajusta instintivament les nostres necessitats internes amb la realitat externa que anem vivint. Perquè aquest diàleg sorgeixi d'una manera fluida, és necessari que el nostre organisme estigui sensible i flexible, tant a nivell físic com psíquic.",
                "Cadascun de nosaltres és únic; té les seves pròpies capacitats i dificultats, necessitats i prioritats, té una mirada, una manera de relacionar-se, una manera d'aprendre, un ritme vital particular. Tots tenim capacitat intel·lectual, emocional i física, però en cadascú, unes predominen sobre les altres. És aquesta peculiar combinació de capacitats i els seus matisos el que ens defineix com a persones úniques; constitueixen la nostra naturalesa peculiar.",
                "Hi ha un impuls vital involuntari que indica a cada nena i nen què necessita a cada moment i com moure's cap a això. És el que ens mostra si tenim necessitat de plorar o de riure, d'estar sols o acompanyats, de menjar o dejunar, d'estar actius o passius, de compartir o defensar el nostre, d'emprendre nous aprenentatges o consolidar uns altres, d'interessar-nos per noves amistats o buscar la companyia dels coneguts, etc. És un impuls que inclou tot allò físic i psíquic, i s'expressa en múltiples llenguatges. És l'indicador d'un mecanisme d'autoregulació que ens permet mantenir i cuidar la nostra vitalitat. En la mesura que es dona aquesta autoregulació i la satisfacció de les necessitats íntimes, la criatura es manté amb capacitat per a abordar amb obertura i flexibilitat les situacions que es presenten; la resolució de conflictes, l'alliberament de les tensions acumulades o l'exploració de nous aprenentatges."
            ]
        },
        {
            title: "L'acompanyament respectuós;\nel marc necessari per al creixement.",
            paragraphs: [
                "Els nens, nenes i adolescents necessiten un marc de confiança, referència i seguretat emocional dels adults per a poder ser feliços i fer créixer el seu potencial vital.",
                "La relació entre els adults i les nenes, nens o adolescents, requereix presència i disponibilitat. També una especial cura de la comunicació: saber escoltar i saber expressar la nostra sana autoritat com a adults.",
                "L'adult és l'encarregat de cuidar l'ambient que envolta a cada criatura perquè pugui desenvolupar el seu potencial intern. El lloc de l'adult representa un espai d'escolta i acolliment, de confiança i fiabilitat, en el qual la criatura pot madurar aprenent a dialogar entre la seva necessitat interna i la circumstància externa.",
                "És una relació emmarcada en un ordre sistèmic, en la qual l'adult té una perspectiva major i per tant la responsabilitat de les decisions que escapen a la visió i capacitat de la criatura. Es tracta d'una sana autoritat, que sorgeix d'un estat de presència i de connexió amb la saviesa innata de l'adult cuidador. La criatura al seu torn, necessita dedicar-se amb tota amplitud, autonomia i intensitat a la seva exploració de si mateix i del món i per a això necessita adults madurs i sòlids en els quals confiar, als quals seguir.",
                "És l'amor ben entès, en tota la seva dimensió d'acceptació incondicional i de límit natural, la qual cosa facilita traspassar la dificultat. En aquesta relació entre l'adult i la criatura, la veritable clau és l'autèntica comunicació; no és una comunicació entre iguals, sinó entre el que cuida i el que és cuidat. En la mesura que es dona aquesta relació, es genera el vincle afectiu i la sana autoritat adulta, que proporciona seguretat i la confiança perquè la criatura segueixi el seu guia quan és necessari.",
                "Aquest ambient amorós, necessari perquè les criatures creixin, té dos vessants: la llibertat per a moure's segons el seu impuls vital i els seus interessos, i els límits naturals, que li proporcionen la seguretat necessària per a fer-ho. El límit natural és una indicació que mostra i assenyala fins a on es pot arribar quan la criatura no té capacitat per a veure'l o fer-ho. El límit va mostrant el que és necessari tenir en compte dins i fora de si mateixa; així contribueix a integrar la consciència de si, dels altres i del món que li envolta."
            ]
        },
        {
            title: "Cuidar el desig innat d'aprendre.",
            paragraphs: [
                "Com a éssers humans disposem d'una immensa capacitat innata d'aprenentatge autònom que s'activa a través de la curiositat i el diàleg permanent entre el desig intern i l'entorn, i que és possible mantenir al llarg de tota la vida. Cadascú té una manera i un ritme d'aprenentatge que ens és propi, en comunicació permanent amb la nostra naturalesa i el nostre moment vital. És fonamental respectar i cuidar aquest impuls intern en un ambient ric en situacions i experiències d'aprenentatge.",
                "Tenim la capacitat de desenvolupar el que ja som com a potencial i d'autoregular l'intercanvi amb l'entorn, és a dir, de discernir el contingut, el moment i la mesura d'un determinat aprenentatge. Aquesta capacitat es manifesta des del naixement i de manera innata, com una gran curiositat i ganes d'aprendre, que permet que els nens conquistin aprenentatges de gran complexitat d'una manera autònoma. És una qüestió de supervivència, perquè és la que sorgeix del mateix fet de créixer i de la necessitat d'acoblament a l'entorn. Per això és fonamental un ambient ric i pròxim, que cobreixi les necessitats de la criatura amb possibilitats de vivències diverses i envoltades d'un afecte incondicional.",
                "Donem suport a les ganes d'autonomia que es manifesten des de les primeres edats i que considerem la via natural, valuosa i eficaç que tenen les nenes i els nens per a desenvolupar les seves capacitats. Aquest fet implica deixar un espai perquè les criatures trobin les seves pròpies solucions en les situacions que se'ls presenten, ja sigui un conflicte en les relacions, una caiguda, una dificultat en l'experimentació, etc. També implica reconèixer el valor del fracàs o de la frustració.",
                "En tot cas, el nostre paper com a adults no és el d'evitar o solucionar problemes, sinó el d'acompanyar les dificultats que puguin sorgir perquè les resolguin amb els seus propis recursos; d'aquesta manera seran aprofitades per a avançar. El nostre paper no passa per donar respostes tancades i directes a les seves preguntes, sinó per servir de ressò i d'interlocutors perquè sorgeixi i es construeixi una resposta pròpia."
            ]
        }
    ],
    formacionContent: [
        {
            title: "Formació i acompanyament",
            paragraphs: [
                "Al llarg d'aquests anys, des d'El Roure hem compartit la nostra experiència i la nostra mirada sobre l'educació i el creixement a través de diferents espais de formació.",
                "Hem oferit tallers, cursos i acompanyament tant per a famílies com per a professionals de l'educació, compartint eines i reflexions que puguin ajudar en el camí d'acompanyar a les criatures des del respecte a la seva naturalesa i ritme.",
                "Els nostres espais de formació han abordat temes com l'autoregulació, l'acompanyament respectuós, els límits naturals, la gestió emocional, i la importància del vincle en els processos d'aprenentatge.",
                "Creiem en la importància que els adults que acompanyen a les criatures disposin d'espais propis de reflexió, creixement personal i suport mutu, per a poder sostenir amb presència i consciència la seva funció."
            ]
        }
    ],
    people: [
        {
            name: "Begoña González",
            paragraphs: [
                "He estat co-fundadora, coordinadora i acompanyant de l'espai educatiu La Casita i de l'escola viva El Roure. Sóc mare, mestra, formadora, orientadora i articulista, m'he format en diferents disciplines corporals, espirituals, artístiques, psicològiques i educatives, en Comunicació conscient (CNV) i en facilitació de grups.",
                "En aquest moment em dedico a l'acompanyament a mares, pares i professionals, a partir de les diferents situacions i dificultats quotidianes que comporta la relació amb nenes, nens i adolescents. D'altra banda, facilito formacions adaptades a les necessitats de col·lectius educatius interessats en l'enfocament de l'educació viva i la comunicació conscient.",
                "Pots contactar amb mi al 645 611 824 o a begona.gomi@gmail.com"
            ]
        },
        {
            name: "Paco Robles",
            paragraphs: [
                "Sóc pare, educador, formador i assessor pedagògic. He estat vinculat professionalment a l'Escola Viva El Roure des del 2009 fins al seu tancament (2025), desenvolupant múltiples rols com a acompanyant, coordinador de cicle, formador y director. En l'àmbit de la gestió, he estat soci secretari de la cooperativa que sostenía l'escola des del 2011 fins al final.",
                "Abans d'El Roure, la meva trajectòria es va centrar en l'educació social i l'educació en el lleure.",
                "Actualment, col·laboro amb el Departament d'Educació de la Generalitat de Catalunya, amb el rol de formador pedagògic per a claustres i docents de centres educativos, dins de programes d'innovació educativa, especialment en la prevenció de l'assetjament escolar i en la transició cap a estructures, metodologies i pràctiques orientades al benestar de la comunitat educativa. També assessoro algunes famílies en l'acompanyament dels seus fills i filles, sobretot durant l'etapa adolescent.",
                "La manera més sencilla i directa de contactar amb mi és a través del correu electrònic: frobles5@xtec.cat"
            ]
        },
        {
            name: "Clara Jiménez Rodríguez",
            paragraphs: [
                "He estat vinculada professionalment a l'Escola Viva El Roure des del 2011 fins al seu tancament com a acompanyant, coordinadora i directora. La meva formació bàsica és Educació Social i la meva formació complementària és Intervenció Sistèmica amb infància i família, Pedagogía Sistèmica i Postgrau en Pràctica Psicomotriu Aucouturier, entre d'altres de caire més relacionat amb el moviment lliure i la permacultura.",
                "Actualment, em dedico a acabar la formació de Teràpia en Integració Psico-corporal. Al mateix temps, acompanyo famílies que tenen ganes d'indagar i generar un creixement personal-familiar i/o troben dificultats en la seva dinàmica relacional.",
                "Em pots contactar a: clarajiro@gmail.com o al 670 204 009"
            ]
        }
    ],
    comunidadText: [
        "Hem creat aquest espai per a les persones que heu format part de la Comunitat de l'escola.",
        "SUBTITLE:Fotos i Contactes",
        "Aquí podreu trobar una selecció de fotos que hem fet dels 24 anys d'escola (en les quals apareixen persones que ho han autoritzat).",
        "A més, membres de la comunitat han creat un document on les persones que vulgueu mantenir-vos en contacte o bé organitzar alguna trobada, podeu deixar les vostres dades i accedir a les dels altres.",
        "Per accedir us facilitarem una contrasenya que podeu demanar al correu:",
        "experienciaroure@proton.me"
    ],
    videosList: [
      {
        title: "El Roure, una escola viva - Documental d'Antonio Laforgia",
        description: "\"És possible una escola diferent de la de les aules grises, notes en el llibre d'escolaritat i nocions apreses de memòria tal com la majoria de nosaltres l'hem experimentat? I és possible imaginar una societat diferent de l'actual sin reexaminar el model d'educació en què es basa?\"",
        link: "https://vimeo.com/115516270?fl=pl&fe=vl",
        embedId: "115516270",
        type: "vimeo"
      },
      {
        title: "Conversa d'Antonio Laforgia amb Begoña González",
        description: "Una conversa d'Antonio Laforgia, creador del documental sobre el roure \"El Roure, una escola viva\" amb Begoña González, cofundadora d'El Roure.",
        link: "https://youtu.be/KjIFGiM6P7U",
        embedId: "KjIFGiM6P7U",
        type: "youtube"
      },
      {
        title: "Explorant l'escola El Roure, de Baobab.",
        description: "\"En la nostra visita a El Roure, a la província de Barcelona, la Begoña ens va regalar aquesta entrevista/conversa on de manera clara i profunda ens va compartir la seva visió sobre l'educació i l'enfocament de l'escola. Tota la nostra gratitud per acollir-nos i per la generositat de compartir la seva experiència i comprensió.\"",
        link: "https://www.youtube.com/watch?v=wnhU8cmO1i0",
        embedId: "wnhU8cmO1i0",
        type: "youtube"
      },
      {
        title: "Conversa de Baobab amb Begoña González.",
        description: "\"En la nostra visita a El Roure, a la província de Barcelona, la Begoña ens va regalar aquesta entrevista/conversa on de manera clara i profunda ens va compartir la seva visió sobre l'educació i l'enfocament de l'escola. Tota la nostra gratitud per acollir-nos i per la generositat de compartir la seva experiència i comprensió.\"",
        link: "https://www.youtube.com/watch?v=XMepo_l0JC4",
        embedId: "XMepo_l0JC4",
        type: "youtube"
      },
      {
        title: "Participació de Paco Robles al Podcast En Crisis",
        description: "Participació de Paco Robles al Podcast En Crisis \"No tenia ni idea que podies educar nens d'aquesta manera i m'ha encantat. Paco Robles ens explica com eduquen en una escola molt diferent de la que jo vaig anar. Com els nens i nenes planifiquen els seus viatges, trien què aprendre i consensuen gairebé totes les decisions. Fa pensar, eh.\"",
        link: "https://open.spotify.com/episode/6F43jd5ZbYQKnKpAo9NGCy",
        embedId: "6F43jd5ZbYQKnKpAo9NGCy",
        type: "spotify"
      },
      {
        title: "(clicar a més informació per veure) Conversa del projecte Ametxe amb Begoña González. JolasBIDE 2024.",
        description: "\"Entrevista a Begoña González, fundadora de l'escola viva El Roure de Catalunya, en la seva visita a Euskadi per al curs que es desenvolupa entre les escoles de Landabaso a Zalla (Biscaia) i Bizilore a Azpeitia (Guipúscoa). Entrevista realitzada en el projecte Ametxe, una comunitat generada en un habitatge cooperatiu en cessió d'ús en àmbit rural a Gordexola, Biscaia. JolasBIDE 2024.\"",
        link: "https://vimeo.com/1046320608",
        embedId: "1046320608",
        type: "vimeo"
      }
    ] as VideoItem[],
    articles: [
        // Revista Roure (amb PDF)
        { title: "ESCRIPTORROURES", author: "Paco Robles", tags: ["Escriptura", "Revista Roure"], file: "/pdfs/ESCRITORROURES.pdf" },
        { title: "Amigos y amigas por carta", author: "Mercè de la Cruz", tags: ["Escriptura", "Revista Roure"], file: "/pdfs/AMIGOS-Y-AMIGAS-POR-CARTA.pdf" },
        { title: "Celebrando el milagro de la vida", author: "Mercè de la Cruz", tags: ["Aprenentatge"], file: "/pdfs/CELEBRANDO-EL-MILAGRO-DE-LA-VIDA.pdf" },
        { title: "Cris se va (2007)", author: "Begoña González", tags: ["Sistèmica", "Revista Roure", "Cristóbal Gutiérrez"], file: "/pdfs/CRIS-SE-VA-2007.pdf" },
        { title: "Cristóbal trajo el Seitai a El Roure", author: "Begoña González", tags: ["Fonaments", "Revista Roure", "Cristóbal Gutiérrez"], file: "/pdfs/CRISTOBAL-TRAJO-EL-SEITAI-A-EL-ROURE.pdf" },
        { title: "Divídete y sufrirás", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Fonaments", "Revista Roure"], file: "/pdfs/DIVIDETE-Y-SUFIRAS.pdf" },
        { title: "Dues experiències de restauració", author: "Paco Robles", tags: ["Activitat", "Revista Roure"], file: "/pdfs/DUES-EXPERIENCIES-DE-RESTAURACIO.pdf" },
        { title: "El consumismo que enturbia el alma", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Família", "Revista Roure"], file: "/pdfs/EL-CONSUMISMO-QUE-ENTURBIA-EL-ALMA.pdf" },
        { title: "El Roure Boletín 13", author: "Varios", tags: ["Butlletí Roure"], file: "/pdfs/EL-ROURE-BOLETIN-13.pdf" },
          { title: "Intros Boletín El Roure", author: "Varios", tags: ["Butlletí Roure"], file: "/pdfs/Intros Boletín El Roure.pdf" },
        { title: "En busca de una feminidad y masculinidad naturales", author: "Begoña González", tags: ["Gènere", "Revista Roure"], file: "/pdfs/EN-BUSCA-DE-UNA-FEMINIDAD-Y-MASCULINIDAD-NATURALES.pdf" },
        { title: "¿Estamos o no haciendo matemáticas?", author: "Lara Jiménez", tags: ["Matemàtiques", "Revista Roure"], file: "/pdfs/ESTAMOS-O-NO-HACIENDO-MATEMATICAS.pdf" },
        { title: "Hora de marcharme de El Roure", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Sistèmica", "Revista Roure"], file: "/pdfs/HORA-DE-MARCHARME-DE-EL-ROURE.pdf" },
        { title: "In Memoriam", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Sistèmica", "Revista Roure"], file: "/pdfs/IN-MEMORIAM.pdf" },
        { title: "La mirada amorosa", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Família", "Revista Roure"], file: "/pdfs/LA-MIRADA-AMOROSA.pdf" },
        { title: "Límites y limitaciones", author: "Begoña González", tags: ["Límits", "Revista Roure"], file: "/pdfs/LIMITES-Y-LIMITACIONES.pdf" },
        { title: "Que la vida sea el eje de la educación", author: "Ulrike Kaesse y Begoña González", tags: ["Fonaments", "Revista Roure"], file: "/pdfs/QUE-LA-VIDA-SEA-EL-EJE-DE-LA-EDUCACION.pdf" },
        { title: "Que ser valiente no salga tan caro", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Fonaments", "Revista Roure"], file: "/pdfs/QUE-SER-VALIENTE-NO-SALGA-TAN-CARO.pdf" },
        { title: "Taller d'Andromines", author: "Montse Bertran", tags: ["Activitat", "Revista Roure"], file: "/pdfs/TALLER-D-ANDROMINES.pdf" },
        
        // Revistes amb enllaç
        { title: "El flux de l'apendre", author: "Begoña González", tags: ["Aprenentatge"], link: "https://www.iquiosc.cat/publicacions/viure-en-familia/97", additionalInfo: "Viure en familia Nº 97 (Gener 2023)" },
        { title: "El auge de la escuela libre", author: "Claudina Navarro y Manuel Núñez", tags: ["Fonaments"], link: "https://dialnet.unirioja.es/ejemplar/186802", additionalInfo: "Integral, Nº 340 (2008)" },
        { title: "El Roure, una escuela para cuidar el alma infantil", author: "Begoña González", tags: ["Fonaments"], link: "https://dialnet.unirioja.es/servlet/articulo?codigo=1037096", additionalInfo: "Cuadernos de pedagogía, Nº 341, pp. 30-34 (2004)" },
        { title: "Escuela El Roure; materializar una ilusión", author: "Begoña González", tags: ["Fonaments"], link: "https://dialnet.unirioja.es/servlet/articulo?codigo=684601", additionalInfo: "Cooperación educativa - Kikirikí, Nº 70 pp. 21-26 (2003)" },
        { title: "El Roure, escuela viva", author: "Begoña González", tags: ["Fonaments"], link: "https://dialnet.unirioja.es/servlet/articulo?codigo=768515", additionalInfo: "Cooperación educativa - Kikirikí, Nº 71-72, pp. 92-99 (2003)" },
        { title: "Diario de La Casita: África", author: "Begoña González", tags: ["La Casita"], link: "https://dialnet.unirioja.es/ejemplar/40146", additionalInfo: "Cooperación educativa - Kikirikí, Nº 62-63, pp. 104-105 (2001-02)" },
        { title: "La Casita, un proyecto alternativo en la primera infancia", author: "Cuadernos de pedagogía", tags: ["La Casita", "Fonaments"], link: "https://dialnet.unirioja.es/ejemplar/4051", additionalInfo: "Cuadernos de pedagogía. Nº 283, pp. 28-36 (1999)" },
        { title: "Habitar el espacio y el tiempo en la escuela alternativa: recorridos y relatos Universitat de Barcelona", author: "José Contreras y Begoña González", tags: ["Fonaments"], link: "https://www.academia.edu/40107171/Habitar_el_espacio_y_el_tiempo_en_la_escuela_alternativa_recorridos_y_relatos_Universitat_de_Barcelona" },
        { title: "Qué sentido tiene la navidad en la escuela", author: "Begoña González", tags: ["Cultura"], link: "https://viureenfamilia.wordpress.com/2019/12/12/quin-sentit-te-el-nadal-a-lescola/", additionalInfo: "Revista Viure en familia. Nº 76 12 Desembre 2019" },
        { title: "Hacia el encuentro", author: "Begoña González", tags: ["Grup"], link: "https://diarieducacio.cat/cap-a-la-trobada/?hilite=trobada", additionalInfo: "El diari de l'educació. Juny 27, 2022" },
        { title: "Cuidar la vida que somos", author: "Begoña González", tags: ["Fonaments"], link: "https://www.grao.com/revistas/renaturalizar-los-espacios-y-los-tiempos-educativos-42841", additionalInfo: "Renaturalizar los espacios y los tiempos educativos. Revista Dosier - Número: 7 (gener 22)" },
        { title: "Acompanyament i solituds necessàries", author: "Begoña González", tags: ["Acompanyament"], link: "https://revistaaula.com/", additionalInfo: "Revista Aula de Innovación Educativa (2021)" },
        { title: "El canvi de mirada", author: "Begoña González", tags: ["Fonaments"], link: "https://revistaaula.com/", additionalInfo: "Revista Aula de Innovación Educativa (2020)" },
        { title: "Acompanyar el moviment intern i la relació", author: "Begoña González", tags: ["Acompanyament"], link: "https://revistaaula.com/", additionalInfo: "Revista Aula de Innovación Educativa (2019)" },
        
        // Revistes sense enllaç
        { title: "El Roure, un espacio para crecer", author: "Begoña González", tags: ["Fonaments"], additionalInfo: "Senderi, butlletí nº 24 (Gener 2006) - www.senderi.org (sense enllaç)" },
        { title: "Escola El Roure. Un model de comunitat d'aprenentatge per a cuidar la vida", author: "Begoña González", tags: ["Fonaments"], additionalInfo: "Fòrum. Revista d'organització i gestió educativa. L'educació alternativa, Nº 45 (2018) (sense enllaç)" },
        { title: "El Roure, escola viva", author: "Begoña González", tags: ["Fonaments"], additionalInfo: "Viure en familia, Nº 50 (2013) (sense enllaç)" },
        { title: "El Roure, escuela viva", author: "Begoña González", tags: ["Fonaments"], additionalInfo: "Crecer en familia, Nº 25 (2013) (sense enllaç)" },
        { title: "La casita: nens i nenes creixent lliures", author: "Begoña González", tags: ["La Casita", "Fonaments"], additionalInfo: "Viure en família Nº 1, pp. 42-43 (2000) (sense enllaç)" },
        
        // Revista La Casita (amb PDF)
        { title: "Cosas que pasan", author: "Begoña González", tags: ["Activitat", "Revista La Casita"], file: "/pdfs/COSAS-QUE-PASAN.pdf" },
        { title: "Despedida", author: "Begoña González y Cristóbal Gutiérrez", tags: ["Sistèmica", "Revista La Casita", "Cristóbal Gutiérrez", "Dol"], file: "/pdfs/DESPEDIDA.pdf" },
        { title: "Despiértate papá y mamá", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Família", "Revista La Casita"], file: "/pdfs/DESPIERTATE-PAPA-Y-MAMA.pdf" },
        { title: "La muerte de cada día", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Dol", "Fonaments", "Revista La Casita"], file: "/pdfs/LA-MUERTE-DE-CADA-DIA.pdf" },
        
        // Altres amb PDF
        { title: "Cines, bebés y sensibilidad", author: "Cristóbal Gutiérrez", tags: ["Cristóbal Gutiérrez", "Família"], file: "/pdfs/CINES-BEBES-Y-SENSIBILIDAD.pdf" },
        { title: "Boletin Roure - Especial Cristobal", author: "Varios", tags: ["Cristóbal Gutiérrez", "Dol"], file: "/pdfs/Boletin Roure - Especial Cristobal.pdf" },
        { title: "Habitar el espacio y el tiempo en la escuela alternativa", author: "José Contreras Domingo y Begoña González", tags: ["Aprenentatge"], file: "/pdfs/Habitar-el-espacio-y-el-tiempo-en-la-escuela-alternativa.pdf" },
    ]
  }
};

// --- Components ---

const App: React.FC = () => {
  const ALLOWED_VIEWS: View[] = ['home','historia','fundamentos','formacion','escuela','videos','textos','comunidad','en_que_estamos'];
  const [currentView, setCurrentView] = useState<View>(() => {
    try {
      const h = window.location.hash.replace('#','');
      return (h && ALLOWED_VIEWS.includes(h as View)) ? (h as View) : 'home';
    } catch (e) {
      return 'home';
    }
  });
  const [language, setLanguage] = useState<Language>('es');
  const [escuelaSection, setEscuelaSection] = useState<EscuelaSection>('intro');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // State for Menu Interaction
  const [menuHasInteracted, setMenuHasInteracted] = useState(false);

  const brandColor = "text-[#c1562e]";
  const hoverBrandColor = "hover:text-[#c1562e]";
  const t = content[language];

  // Load background image after component mounts
  useEffect(() => {
    document.body.style.backgroundImage = "url('/images/main_bg.webp')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    // Some Safari builds have issues with `background-attachment: fixed` causing
    // strange repaint/scroll behaviour. Use `scroll` for Safari and `fixed`
    // elsewhere.
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    document.body.style.backgroundAttachment = isSafari ? 'scroll' : 'fixed';
    document.body.style.backgroundRepeat = "no-repeat";
    // Try to reduce pull-to-refresh / overscroll navigation on Safari
    try {
      if (isSafari) {
        document.documentElement.style.overscrollBehavior = 'none';
        document.body.style.overscrollBehavior = 'none';
      }
    } catch (e) {}
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.backgroundRepeat = '';
      try {
        document.documentElement.style.overscrollBehavior = '';
        document.body.style.overscrollBehavior = '';
      } catch (e) {}
    };
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setShowScrollTop(scrollPercentage > 0.2);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hash-based navigation: update state when the hash changes
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h && ALLOWED_VIEWS.includes(h as View) && h !== currentView) {
        setCurrentView(h as View);
        window.scrollTo(0,0);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [currentView]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Common Logo for header - Clickable
  const LogoImg = ({ className }: { className?: string }) => (
    <button 
        onClick={() => navigateTo('home')}
        className={`block hover:opacity-80 transition-opacity focus:outline-none ${className}`}
        aria-label="Go to Home"
    >
        <SafeImage 
        src={language === 'ca' ? IMAGES.logo_ca : IMAGES.logo} 
        alt="Roure Logo" 
        className="w-full h-auto object-contain" 
        />
    </button>
  );

  const normalizeImageSrc = (rawSrc?: string) => {
    if (!rawSrc) return rawSrc;
    try {
      return encodeURI(rawSrc.normalize('NFD'));
    } catch {
      return rawSrc;
    }
  };

  // Safe image with fallback (transparent pixel) to avoid broken icons
  const SafeImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, ...rest }) => {
    const normalizedSrc = typeof src === 'string' ? normalizeImageSrc(src) : (src as string | undefined);
    const [imgSrc, setImgSrc] = useState<string | undefined>(normalizedSrc);
    useEffect(() => {
      setImgSrc(normalizedSrc);
    }, [normalizedSrc]);
    // 1x1 transparent GIF
    const fallback = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';
    return (
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (imgSrc !== fallback) {
            console.warn('Image failed to load:', src);
            setImgSrc(fallback);
          }
        }}
        {...rest}
      />
    );
  };

  // Footer Component
  const Footer = ({ compact = false }: { compact?: boolean }) => (
    <div className={`w-full flex justify-center ${compact ? 'pb-4 pt-2' : 'pb-6 pt-8 md:pb-6 md:pt-4'}`}>
      <div className="flex flex-col items-center gap-1 md:gap-2">
        
        {/* Email */}
        <a 
          href="mailto:experienciaroure@proton.me" 
          className={`font-serif ${compact ? 'text-sm' : 'text-base md:text-sm'} text-stone-600 ${hoverBrandColor} transition-colors block text-center`}
        >
          experienciaroure@proton.me
        </a>

        {/* Language Switcher */}
        <div className={`flex items-center justify-between text-xs md:text-xs font-bold uppercase text-stone-400 font-serif`} style={{ letterSpacing: '0.3em', lineHeight: '1.4' }}>
          <button 
            onClick={() => setLanguage('es')}
            className={`${language === 'es' ? 'text-stone-800 border-b-2 border-[#c1562e]' : 'text-stone-400 hover:text-stone-600'} transition-colors py-0.5`}
            style={{ marginRight: '-0.3em' }}
          >
            castellano
          </button>
          <span className="text-stone-300 px-1.5">|</span>
          <button 
            onClick={() => setLanguage('ca')}
            className={`${language === 'ca' ? 'text-stone-800 border-b-2 border-[#c1562e]' : 'text-stone-400 hover:text-stone-600'} transition-colors py-0.5`}
            style={{ marginLeft: '-0.3em' }}
          >
            català
          </button>
        </div>

        {/* Credits */}
        <div className={`flex items-center justify-between ${compact ? 'text-xs' : 'text-sm md:text-xs'} text-stone-400 font-serif gap-2`}>
          <span>{t.home.footer}</span>
          <a href="https://rcrear.com" className={`hover:text-stone-600 transition-colors`}>rcrear.com</a>
        </div>
      </div>
    </div>
  );

  // Utility to linkify emails and phones
  const LinkifyText = ({ text }: { text: string }) => {
    const regex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+|\b\d{3}[ -]?\d{3}[ -]?\d{3}\b)/g;
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, i) => {
          if (part.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+$/)) {
            return <a key={i} href={`mailto:${part}`} className="text-[#c1562e] hover:underline font-medium">{part}</a>;
          }
          if (part.match(/^\b\d{3}[ -]?\d{3}[ -]?\d{3}\b$/)) {
            const cleanNum = part.replace(/\s/g, '').replace(/-/g, '');
            return <a key={i} href={`tel:${cleanNum}`} className="text-[#c1562e] hover:underline font-medium">{part}</a>;
          }
          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  // Navigation Helper
  // Lightweight navigation helper that updates the hash (creates history entries)
  const navigateTo = (view: View) => {
    if (!ALLOWED_VIEWS.includes(view)) return;
    if (view === currentView) return;
    // immediate UI update
    setCurrentView(view);
    // update hash (this also allows back/forward navigation)
    try {
      window.location.hash = view;
      window.scrollTo(0,0);
    } catch (e) {
      // fallback
    }
  };

  const handleNav = (view: View) => navigateTo(view);

  // --- Views ---

  const HomeView = () => {
    const menuItems = [
        { key: 'historia', label: t.nav.historia },
        { key: 'fundamentos', label: t.nav.fundamentos },
        { key: 'formacion', label: t.nav.formacion },
        { key: 'escuela', label: t.nav.escuela },
        { key: 'videos', label: t.nav.videos },
        { key: 'textos', label: t.nav.textos },
        { key: 'comunidad', label: t.nav.comunidad },
        { key: 'en_que_estamos', label: t.nav.en_que_estamos },
      ];

    return (
      // Always use min-h-screen, allow scroll on any screen size if content overflows
      <div className="w-full min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Logo Header Area - Centered at top */}
        <div style={{ paddingTop: 'var(--padding-top)', paddingLeft: 'var(--padding-x)', paddingRight: 'var(--padding-x)' }} className="w-full flex flex-col justify-center items-center z-20 -translate-x-2 flex-shrink-0">
             <div className="relative flex flex-col items-center justify-center">
                <div style={{ width: 'var(--logo-width)' }} className="shrink-0 relative flex items-center justify-center">
                  <LogoImg />
                </div>
                {/* Phrase below logo */}
                <span style={{ fontSize: 'var(--phrase-text-size)', marginTop: 'var(--phrase-margin)' }} className="font-serif italic tracking-wide whitespace-nowrap text-[#c1562e]">
                  {t.header?.right}
                </span>
             </div>
        </div>

        {/* Main Content - Flex Centered */}
        <div style={{ paddingLeft: 'var(--padding-x)', paddingRight: 'var(--padding-x)', paddingTop: 'var(--padding-y)', paddingBottom: 'var(--padding-y)' }} className="flex-1 flex items-center justify-center w-full min-h-0">
            <div style={{ gap: 'var(--gap-base)' }} className="flex flex-col md:flex-row items-center justify-between w-full">
            
                {/* Left: Text */}
                <div className="w-full md:w-1/3 order-2 md:order-1 px-4 md:px-0 text-center md:text-right flex flex-col items-center md:items-end" style={{ paddingLeft: 'var(--left-text-margin)' }}>
                    <div style={{ fontSize: 'var(--body-text-size)', gap: 'var(--menu-spacing)' }} className="max-w-lg font-serif text-stone-700 leading-relaxed flex flex-col">
                    <p>{t.home.text1}</p>
                    <p>{t.home.text2}</p>
                    <p className={`${brandColor} font-bold`}>
                        {t.home.highlight}
                    </p>
                    <p>{t.home.text3}</p>
                    </div>
                </div>

                {/* Center: Video */}
                <div className="order-1 md:order-2 shrink-0 relative z-10">
                    <div style={{ width: 'var(--main-image-size)', height: 'var(--main-image-size)' }} className="rounded-3xl overflow-hidden relative group">
                    <img 
                      src={IMAGES.homeMain} 
                      alt="Home"
                      className="w-full h-full object-contain transition-all duration-1000"
                    />
                    </div>
                </div>

                {/* Right: Menu */}
                <div className="w-full md:w-1/3 order-3 px-4 md:px-0 flex justify-center md:justify-start mt-8 md:mt-0 pt-6 pb-8 md:pt-0 md:pb-0 flex-shrink-0">
                  <div className="flex flex-col items-start">
                    {/* Menu Label - commented out, uncomment to show */}
                    {/* <div className="flex items-center text-sm font-bold uppercase text-stone-400 font-serif mb-4" style={{ letterSpacing: '0.4em' }}>
                      <span className={`${language === 'es' ? 'text-stone-800 border-b-2 border-[#c1562e]' : language === 'ca' ? 'text-stone-800 border-b-2 border-[#c1562e]' : 'text-stone-400'} transition-colors pb-0.5`}>
                        {language === 'es' ? 'MENÚ' : 'MENÚ'}
                      </span>
                    </div> */}
                    <nav 
                        onMouseEnter={() => setMenuHasInteracted(true)}
                    >
                    <ul style={{ gap: 'var(--menu-spacing)' }} className="flex flex-col">
                        {menuItems.map((item) => {
                        return (
                            <li key={item.key}>
                            <button 
                              onClick={() => handleNav(item.key as View)}
                              className="font-serif font-medium flex items-center gap-2 relative group text-left text-stone-600 hover:text-[#c1562e] transition-all duration-300 ease-in-out hover:scale-105 text-2xl md:text-base"
                            >
                                <SafeImage 
                                  src="/images/menu_icon.png" 
                                  alt="" 
                                  className={`w-3 h-3 opacity-60 transition-transform duration-300 ease-in-out group-hover:rotate-90`} 
                                />
                                {item.label}
                                <span className={`absolute left-0 -bottom-1 h-[1px] bg-[#c1562e] transition-all duration-300 ease-in-out origin-left w-0 group-hover:w-full`}></span>
                            </button>
                            </li>
                        )
                        })}
                    </ul>
                    </nav>
                  </div>
                </div>
            </div>
        </div>

        {/* Footer inside Home - always visible at bottom */}
        <div className="mt-2 md:mt-1 flex-shrink-0">
          <Footer compact={false} />
        </div>
      </div>
    );
  };

  const InternalPageLayout = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div style={{ paddingLeft: 'var(--padding-x)', paddingRight: 'var(--padding-x)' }} className="w-full min-h-screen flex flex-col pt-32 xl:pt-36 2xl:pt-40 pb-20 xl:pb-24 2xl:pb-28 max-w-6xl xl:max-w-7xl 2xl:max-w-6xl mx-auto">
      {/* Sticky Header Area for Internal Pages */}
      <div style={{ paddingLeft: 'var(--padding-x)', paddingRight: 'var(--padding-x)' }} className="fixed top-0 left-0 w-full bg-[#f7f5e6]/95 z-40 py-4 xl:py-5 2xl:py-6 border-b border-stone-200/50">
         <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-6xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => navigateTo('home')}
              className={`flex items-center gap-2 font-serif text-base md:text-lg xl:text-lg 2xl:text-xl ${brandColor} hover:opacity-80 transition-opacity`}
            >
              <ChevronLeft size={20} className="xl:w-5 xl:h-5 2xl:w-6 2xl:h-6" />
              {t.nav.back}
            </button>
            <div className="w-24 xl:w-28 2xl:w-32 opacity-80">
               <LogoImg />
            </div>
            <div className="w-20 xl:w-24 2xl:w-28"></div> {/* Spacer for balance */}
         </div>
      </div>

      <h1 className="font-serif font-bold text-stone-800 mb-12 xl:mb-14 2xl:mb-16 mt-2 xl:mt-2 2xl:mt-3 border-b border-stone-300 pb-6 xl:pb-7 2xl:pb-8 text-2xl xl:text-2xl 2xl:text-3xl">
        {title}
      </h1>
      <div className="animate-fade-in flex-1">
        {children}
      </div>
      
      <div className="mt-20 xl:mt-24 2xl:mt-28 pt-10 xl:pt-12 2xl:pt-14 border-t border-stone-200/50">
        <Footer compact={false} />
      </div>
    </div>
  );

  // Image Carousel Component
  const ImageCarousel = ({ images, autoPlayInterval = 2000, aspectClass = "aspect-[4/3]" }: { images: Array<{src: string, caption: string}>, autoPlayInterval?: number, aspectClass?: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [nextImageLoaded, setNextImageLoaded] = useState(true);
    const [opacity, setOpacity] = useState(1);
    const carouselRef = useRef<HTMLDivElement>(null);
    const nextImageRef = useRef<HTMLImageElement>(null);
    const prevIndexRef = useRef(0);

    // Safety check for empty images array
    if (!images || images.length === 0) {
      return <div className={`${aspectClass} bg-stone-200 rounded-lg flex items-center justify-center`}>
        <p className="text-stone-500">No images available</p>
      </div>;
    }

    // Intersection Observer to detect visibility
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.25 }
      );

      if (carouselRef.current) {
        observer.observe(carouselRef.current);
      }

      return () => {
        if (carouselRef.current) {
          observer.unobserve(carouselRef.current);
        }
      };
    }, [carouselRef]);

    // Start autoplay when visible, stop when not visible
    useEffect(() => {
      setIsPlaying(isVisible);
    }, [isVisible]);

    // Preload next image continuously
    useEffect(() => {
      setNextImageLoaded(false);
      const nextIdx = (currentIndex + 1) % images.length;
      const img = new Image();
      img.onload = () => setNextImageLoaded(true);
      img.onerror = () => setNextImageLoaded(true);
      img.src = normalizeImageSrc(images[nextIdx].src) || images[nextIdx].src;
    }, [currentIndex, images.length]);

    // Autoplay only when next image is ready
    useEffect(() => {
      if (!isPlaying || !nextImageLoaded) return;
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }, [isPlaying, nextImageLoaded, images.length, autoPlayInterval]);

    // Fade transition effect when image changes
    useEffect(() => {
      if (prevIndexRef.current !== currentIndex) {
        // Image changed, fade out
        setOpacity(0);
        prevIndexRef.current = currentIndex;
        
        // Fade back in after brief delay
        const timer = setTimeout(() => {
          setOpacity(1);
        }, 50);
        
        return () => clearTimeout(timer);
      }
    }, [currentIndex]);

    const goToPrevious = () => {
      setIsPlaying(false);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
      setIsPlaying(false);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const currentImage = images[currentIndex];
    const prevImage = images[(currentIndex - 1 + images.length) % images.length];
    const nextImage = images[(currentIndex + 1) % images.length];

    return (
      <div ref={carouselRef} className={`relative overflow-hidden group ${aspectClass} rounded-lg bg-[#f7f5e6]`} style={{ margin: 0, padding: 0, display: 'block' }}>
        {/* Main image display */}
        <div className="absolute inset-0" style={{ transition: 'opacity 0.4s ease-in-out', opacity: opacity }}>
          <SafeImage 
            src={currentImage.src} 
            alt={currentImage.caption} 
            className="w-full h-full object-contain"
            style={{ objectPosition: 'center bottom' }}
          />
        </div>
        
        {/* Preload next image invisibly */}
        <img 
          ref={nextImageRef}
          src={normalizeImageSrc(nextImage.src) || nextImage.src}
          alt=""
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }}
          onLoad={() => setNextImageLoaded(true)}
          onError={() => setNextImageLoaded(true)}
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-stone-800/50 hover:bg-stone-800/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-stone-800/50 hover:bg-stone-800/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <ChevronLeft size={20} className="rotate-180" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-2 left-2 bg-stone-800/50 text-white text-xs px-2 py-1 rounded z-10">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-2 right-2 bg-stone-800/50 hover:bg-stone-800/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          {isPlaying ? (
            <div className="w-4 h-4 flex gap-1">
              <div className="w-1.5 h-4 bg-white"></div>
              <div className="w-1.5 h-4 bg-white"></div>
            </div>
          ) : (
            <Play size={16} fill="white" />
          )}
        </button>

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/80 via-stone-900/60 to-transparent pt-8 pb-3 px-4">
          <p className="text-white text-sm font-serif italic text-center drop-shadow-lg">
            {currentImage.caption}
          </p>
        </div>
      </div>
    );
  };

  // Text Carousel Component (for testimonials)
  const TextCarousel = ({ items, autoPlayInterval = 4000 }: { items: Array<{ text: string; author?: string }>, autoPlayInterval?: number }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
      if (!isPlaying || items.length <= 1) return;
      const id = setInterval(() => setCurrentIndex((i) => (i + 1) % items.length), autoPlayInterval);
      return () => clearInterval(id);
    }, [isPlaying, items.length, autoPlayInterval]);

    const goPrev = () => { setIsPlaying(false); setCurrentIndex((i) => (i - 1 + items.length) % items.length); };
    const goNext = () => { setIsPlaying(false); setCurrentIndex((i) => (i + 1) % items.length); };

    const it = items[currentIndex];
    return (
      <div className="relative bg-white rounded-xl border border-stone-200 p-6 xl:p-7 2xl:p-8 shadow-sm min-h-[280px] flex flex-col">
        <div className="font-serif text-stone-700 leading-relaxed italic whitespace-pre-line pr-12 pl-12 md:pr-16 md:pl-16 flex-1">{it.text}</div>
        {it.author && <div className="mt-3 text-right font-serif font-semibold text-stone-800 pr-12 md:pr-16">{it.author}</div>}
        <button onClick={goPrev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-stone-800/50 hover:bg-stone-800/80 text-white p-1.5 rounded-full">
          <ChevronLeft size={16} />
        </button>
        <button onClick={goNext} className="absolute right-3 top-1/2 -translate-y-1/2 bg-stone-800/50 hover:bg-stone-800/80 text-white p-1.5 rounded-full">
          <ChevronLeft size={16} className="rotate-180" />
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-stone-500 font-serif">
          {currentIndex + 1} / {items.length}
        </div>
      </div>
    );
  };

  const HistoriaView = ({ title, contentData }: { title: string, contentData: ContentSection[] }) => {
    // Select the correct photo array based on language
    const historiaPhotos = language === 'es' ? IMAGES.historiaPhotos_es : IMAGES.historiaPhotos_ca;
    
    // Split the 21 images into 4 carousels: 5+5+5+6
    const carousel1Images = historiaPhotos.slice(0, 5);
    const carousel2Images = historiaPhotos.slice(5, 10);
    const carousel3Images = historiaPhotos.slice(10, 15);
    const carousel4Images = historiaPhotos.slice(15, 21);

    const sections = contentData || [];
    const allCarousels = [carousel1Images, carousel2Images, carousel3Images, carousel4Images];

    return (
      <InternalPageLayout title={title}>
        <div className="flex flex-col gap-12 xl:gap-14 2xl:gap-16">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="flex flex-col lg:flex-row gap-8 xl:gap-10 2xl:gap-12 items-start">
              {/* Paragraphs */}
              <div style={{ fontSize: 'var(--internal-body-text)' }} className="flex-1 font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className={pIdx === 0 ? "font-bold" : ""}>
                    {p}
                  </p>
                ))}
              </div>
              
              {/* Carousel alongside if available */}
              {sectionIdx < allCarousels.length && (
                <div className="w-full lg:w-[min(34rem,90vw)]">
                  <ImageCarousel images={allCarousels[sectionIdx]} autoPlayInterval={3000} />
                </div>
              )}
            </div>
          ))}
        </div>
      </InternalPageLayout>
    );
  };

  const FundamentosView = () => {
    const sections = t.fundamentosContent || [];
    // Match carousels to sections: autorr (autorregulación), acompa (acompañamiento), apren (aprendizaje)
    const fundamentosCarousels = [fundamentosAutorr, fundamentosAcompa, fundamentosApren];

    return (
      <InternalPageLayout title={t.nav.fundamentos}>
        <div className="flex flex-col gap-12 xl:gap-14 2xl:gap-16">
          {sections.map((section, idx) => (
            <div key={idx}>
              {section.title && (
                <h3 className="text-2xl xl:text-2xl 2xl:text-3xl font-bold text-stone-800 mb-4 xl:mb-5 2xl:mb-6 text-[#c1562e]">
                  {section.title}
                </h3>
              )}
              <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 2xl:gap-12 items-start">
                <div style={{ fontSize: 'var(--internal-body-text)' }} className="flex-1 font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={pIdx === 0 ? 'font-bold' : ''}>
                      {p}
                    </p>
                  ))}
                </div>

                {/* Carousel alongside */}
                {fundamentosCarousels[idx] && (
                  <div className="w-full lg:w-[min(34rem,90vw)]">
                    <ImageCarousel images={fundamentosCarousels[idx]} autoPlayInterval={3000} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </InternalPageLayout>
    );
  };

  const FormacionView = () => {
    // Formaciones carousel images
    const formacionesPhotos = [
      { src: '/images/formaciones/webp_formaciones_01.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_03.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_04.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_05.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_06.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_07.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_08.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_09.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_10.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_11.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_12.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_13.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_14.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_15.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_17.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_19.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_20.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_21.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_22.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_23.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_24.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_25.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_26.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_27.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_28.webp', caption: '' },
      { src: '/images/formaciones/webp_formaciones_30.webp', caption: '' },
    ];

    // Split into 3 carousels: 10+10+10
    const fCarousel1 = formacionesPhotos.slice(0, 10);
    const fCarousel2 = formacionesPhotos.slice(10, 20);
    const fCarousel3 = formacionesPhotos.slice(20, 30);

    // Asesoramientos: paragraphs (ES provided) and a 3-photo carousel (last 3)
    const asesoramientosParagraphs: string[] = [
      'El proyecto de la escuela siempre ha incluido el acompañamiento a las madres y padres. Además de esa experiencia, a partir del curso 2021-2022 empezamos a ofrecer asesoramientos a personas ajenas a la escuela: madres, padres, profesionales y proyectos educativos (que iniciaban su andadura o que, siendo consolidados, valoraban una mirada externa como la nuestra).',
      'A familias',
      'Es una forma de acompañamiento a madres y padres sobre cualquier aspecto del proceso familiar de crianza de vuestros hijos e hijas. Por un lado, miramos las soluciones que necesitas a las situaciones cotidianas actuales y, por otro lado, miramos el origen de estas señales que manifiestan que algo no va bien.',
      'La realidad cotidiana de relación con el hijos e hijas nos puede generar dudas, preocupación, conflictos e interrogantes. Las dificultades se pueden manifestar en cualquier aspecto de la vida familiar: las relaciones entre hermanos/se, con la madre y el padre o con las amistades, el proceso de aprendizaje, la gestión emocional, los hábitos domésticos, la imagen de sí mismo, etc.',
      'Para poder explorar una relación cuidadosa y sensible con los hijos e hijas, necesitamos observarlos y observarnos: los pensamientos y creencias, las emociones, las necesidades, y reflexionar desde la conexión con ellas y ellos. Se trata,en definitiva, de acceder a la sabiduría innata que tenemos como madres y padres.',
      'Apoyábamos esa función de madres y padres en aspectos como, por ejemplo:',
      '• La observación, seguimiento, reflexión e intervención sobre el proceso integral de maduración de cada criatura, la autoregulación, las tensiones, dificultades y bloqueos que se manifiestan en los aspectos físico, emocional e intelectual.',
      '• La atención a las dinámicas de relación entre madres/paras e hijas/hijos, y entre todos los miembros de la familia, esenciales por el bienestar individual y familiar.',
      '• Los procesos de aprendizaje: el acompañamiento de actividades a casa, la adecuación de espacios y materiales pedagógicos a casa, el acompañamiento en la propia organización y gestión del tiempo por parte de los niños/niñas y adolescentes, la propia responsabilidad y autonomía, etc.',
      '• El acompañamiento en la etapa adolescente: entender las características de esta delicada etapa, como establecer la comunicación y relación con el/la adolescente, los grados de libertad y límites, la gestión del uso de las nuevas tecnologías y redes sociales, la gestión del dinero, la participación a las tareas de casa, la gestión de responsabilidades y compromisos, las formas de descarga de tensiones, etc.',
      'A profesionales',
      'En la práctica pedagógica de cualquier profesional hay que hacer frente a situaciones nuevas, a veces difíciles o conflictivas, tanto con una criatura determinada como con el grupo. A menudo las herramientas que tenemos no son suficientes y necesitamos ampliar nuestra mirada y desarrollar más nuestra percepción de las verdaderas necesidades de las criaturas, y el grupo, más allá de formas "correctas" de intervención.',
      'También podemos revisar la metodología, las actividades, los espacios y materiales, el funcionamiento del equipo, la comunicación con madres y padres, etc. Acompañábamos a los profesionales, tanto individualmente como en colectivo, a partir de su realidad educativa y teniendo presentes sus necesidades.',
      'Partíamos de sus interrogantes cotidianos y revisábamos con ellos y ellas los aspectos que pedían cambios en la práctica educativa a través de la observación y la reflexión. Quizás había que mirar las formas de acompañamiento y las intervenciones, la tensión excesiva que dificulta la autorregulación en las criaturas, la relación entre libertad y límites, la conciencia sistémica, la metodología y los formatos de actividad, el uso de espacios y de materiales, la gestión y la organización de equipos, las formaciones, la organización del equipo educativo, la comunicación entre equipo y familias, las herramientas de observación y registro del procesos de aprendizaje, etc.',
      'El propósito era fortalecer el vínculo de seguridad y confianza con cada criatura que permite hacer un acompañamiento consciente y respetuoso.',
      'A nuevos proyectos',
      'Cada día son más las familias y profesionales que se plantean crear escuelas o espacios de educación viva para niñas, niños o adolescentes. A menudo tenemos claro lo que no queremos, pero no es tan fácil concretar lo que queremos.',
      'Por otro lado, un espacio educativo implica atender aspectos diversos, como por ejemplo la gestión, la organización interna, la adecuación de espacios y materiales, la dinámica de actividades y la metodología, la observación y acompañamiento de procesos de aprendizaje, la comunicación interna y externa, la participación y apoyo a madres y padres en su función, la observación individual y colectiva de las criaturas y su registro, la relación con la administración educativa, etc.',
      'Nos ofrecíamos a apoyar este proceso apasionante y creativo; sabíamos por experiencia que requiere mucha energía individual y colectiva, tiempo y sobre todo determinación en el propósito de materializar nuevas realidades para una educación cada vez más sintonizada con la vida.'
    ];
    const asesoraPhotos = [
      { src: '/images/formaciones/webp_asesoramientos_01.webp', caption: '' },
      { src: '/images/formaciones/webp_asesoramientos_02.webp', caption: '' },
      { src: '/images/formaciones/webp_asesoramientos_03.webp', caption: '' },
    ];

    const formacionesParagraphs: string[] = [
      'Aunque desde el 2002 participamos en algunos eventos educativos, es a partir del 2008 cuando comenzamos verdaderamente la etapa de las formaciones. Por una parte hemos organizado una formación anual que llamamos Savia y talleres monográficos, y por otra parte hemos participado en formaciones organizadas por otras entidades educativas (proyectos de educación viva y activa, IES, Universidades, etc.). La formación Savia se ha desarrollado, de forma presencial, desde el curso 2008-2009 hasta el curso 2025-2026, dirigida a madres, padres, docentes, estudiantes o a toda persona interesada en la relación con niñas/os y adolescentes.',
      'Por otra parte hemos ofrecido la posibilidad de hacer formaciones a medida, adaptando el formato, la duración y los contenidos a las necesidades de cada entidad, escuela, institución, proyecto educativo o grupo de familias y/o profesionales.',
      'También hemos acogido en el espacio de la escuela talleres llevados por otros profesionales afines (destacan los talleres anuales de Rebeca y Mauricio Wild, de la escuela Pestalozzi de Ecuador).',
      'Este aspecto del proyecto educativo lo hemos desarrollado Begoña González (del 2008 al 2025) y Paco Robles (del 2014 al 2021).',
      'El propósito de todas nuestras formaciones ha sido invitar a ver nuevas perspectivas, comprensiones y soluciones a las dificultades y conflictos que surgen en el día a día en la relación con los niños, niñas y adolescentes, tanto seamos madres o padres como profesionales de la educación. El eje de la formación ha sido siempre el de los fundamentos y la experiencia de la escuela y la metodología una combinación de dinámicas vivenciales con la reflexión individual y grupal.',
      'Esa realidad cotidiana con las criaturas nos genera interrogantes y nos invita a abrirnos a aquello que se da, tanto fuera como dentro nuestro; a veces nos surgen dudas, nos pueden desbordar situaciones, reproducimos reacciones que no queremos tener... acudir a fórmulas “correctas” según las ideas de una nueva pedagogía no parece la solución. A menudo las herramientas que tenemos no son suficientes y necesitamos revisar los patrones y formas de funcionamiento que no son coherentes con lo que verdaderamente queremos.',
      'Necesitamos explorar y aprender a acompañar desde nuestro propio talento innato, de una forma más centrada, abierta y respetuosa.',
      '¿Qué significa una educación conectada con la vida? ¿Cómo podemos percibir y acompañar lo que realmente necesitan las niñas, niños y adolescentes? ¿Cómo establecemos una comunicación respetuosa y auténtica entre adultos y criaturas? ¿Cómo ponemos límites naturales desde una sana autoridad? ¿Cómo apoyamos a los procesos de aprendizaje de manera respetuosa y eficaz?',
      'Planteábamos observar y reflexionar en profundidad sobre los temas clave implicados en el desarrollo y maduración de las criaturas. También proponíamos revisar las creencias limitadoras y los patrones internos que nos desconectan de nuestra propia capacidad para percibir las verdaderas necesidades de las niñas, niños y adolescentes.'
    ];
    const testimonios: Array<{ text: string; author?: string }> = [
      { text: 'Una experiencia donde he podido poner atención en cómo aprendemos, a través de la observación y reflexión pedagógica. / \nEUn espacio y tiempo acompañado para poder sintonizar con el diálogo interno en las relaciones. / \nEUna propuesta en la que he podido abrir los sentidos a la comunicación humana para que el acompañamiento se dé desde la mirada consciente como adulta y el respeto de las necesidades y procesos de las criaturas, tanto en el acompañamiento individual como en el grupal.', author: 'Bibi' },
      { text: 'Aquesta formació va suposar un punt d’inflexió vital en la meva trajectòria docent. Em va canviar la mirada cap a la infància i els seus processos d’aprenentatge, em va oferir un espai vivencial, de recerca i reflexió grupal que em va ajudar a replantejar la meva manera de cuidar i acompanyar de forma holística als nens i nenes. L’escola, els seus espais, envoltats de natura i aquesta formació, avui en dia encara són una inspiració i un dels pilars que sustenten la meva feina com a mestra.\n\n', author: 'Mercè' },
      { text: 'Em va connectar amb parts meves que, tot i ser essencials, no miraba ni tenia presents. / \nEs mostrava amb claredat la meva essència i era precisament el que ocultava als demés i a mi mateix.', author: 'Marc' },
      { text: 'Sentir cómo a través de la formación nacen y se nutren nuevas experiencias sobre cómo vivimos la educación. Ver, escuchar y experimentar desde una voz que para mí tiene luz y experiencia.', author: language === 'es' ? 'Anónimo' : 'Anònim' },
      { text: 'Una formació que m’ha endinsat a conèixer-me i a connectar amb l’essència del projecte El Roure. Un aprofundiment en com acompanyar als infants i a les seves famílies, tot compartint en grup. La tornaria a fer 50 vegades perquè crec que s’apren molt i et fa replantejar-te moltes coses.', author: 'Sandra' },
      { text: 'Una formació molt enriquidora que em va aportar molt com a persona, com a mare i mare que educa a casa i com a professional d’acompanyament a infants i famílies en el marc escolar.', author: 'Blanca' },
      { text: 'En la formación de El Roure aprendí que de una misma actividad en grupo cada una tiene diferentes aprendizajes igual de importantes, valiosos y respetables, poniéndole dimensión al significado de diversidad.', author: 'Sergio' },
      { text: 'Una manera conocerme a mí misma, a los demás y a lo que me rodea, más abierta, más paciente, más profunda y más respetuosa. Me llevo el conocimiento de que nada está escrito, que cada uno aprende con la su mirada y que la fuerza del grupo es necesaria. Este curso me ha ayudado a perder miedos ya romper barreras.El hecho de experimentar en grupo e individualmente cada uno de los apartados hace que no olvides la experiencia y quede grabada en tu interior.', author: 'Josep' },
      { text: 'Para mí esta formación ha sido clave en el camino de autoconocimiento de mí misma como persona, como mujer y como madre. Valoro muy positivamente el hecho de experimentar lo que se habla en cada sesión y de abordarlo desde las diferentes dinámicas. También me resulta muy útil el material complementario que recibimos.', author: 'Oliver' }
    ];
    // Collaborator logos organized by category
    const otrosLogos = [
      '/images/logos/otros_sergi-1.png',
      '/images/logos/otros_economia_social.png',
      '/images/logos/otros_escolescoop.jpg',
      '/images/logos/otros_cooperativesdetreball.jpg',
    ];

    const educacionLogos = [
      '/images/logos/educacion_alaire.jpg',
      '/images/logos/educacion_caiev.png',
      '/images/logos/educacion_creixementribu.jpg',
      '/images/logos/educacion_hazizhazi.jpg',
      '/images/logos/educacion_jacintverdaguer.png',
      '/images/logos/educacion_semillavioleta.png',
      '/images/logos/educacion_submarilila.jpg',
      '/images/logos/educacion_xell.jpg',
      '/images/logos/educacion_corriols.jpg',
      '/images/logos/educacion_lesgarrofes.jpg',
      '/images/logos/educacion_bizilore.jpg',
    ];

    const universidadLogos = [
      '/images/logos/universidad_andalucia.svg',
      '/images/logos/universidad_reyjuancarlos.jpg',
      '/images/logos/universidad_girona.png',
      '/images/logos/universidad_manresa.png',
      '/images/logos/universidad_ub.jpg',
      '/images/logos/universidad_valencia.jpg',
    ];

    return (
      <InternalPageLayout title={language === 'es' ? 'Formaciones y asesoramientos' : 'Formacions i assessoraments'}>
        {/* Formaciones Section - Two Column */}
        <div className="mb-12 xl:mb-14 2xl:mb-16">
          <h3 className="text-2xl xl:text-2xl 2xl:text-3xl font-bold text-stone-800 mb-4 xl:mb-5 2xl:mb-6 text-[#c1562e] font-serif">{language === 'es' ? 'Formaciones' : 'Formacions'}</h3>
          
          {/* First paragraph group with carousel 1 */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 2xl:gap-12 items-start mb-8">
            <div style={{ fontSize: 'var(--internal-body-text)' }} className="flex-1 font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6">
              <p className="font-bold">{formacionesParagraphs[0]}</p>
              <p>{formacionesParagraphs[1]}</p>
            </div>
            <div className="w-full lg:w-[min(34rem,90vw)]">
              <ImageCarousel images={fCarousel1} autoPlayInterval={3000} />
            </div>
          </div>

          {/* Second paragraph group with carousel 2 */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 2xl:gap-12 items-start mb-8">
            <div style={{ fontSize: 'var(--internal-body-text)' }} className="flex-1 font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6">
              <p>{formacionesParagraphs[2]}</p>
              <p>{formacionesParagraphs[3]}</p>
              <p>{formacionesParagraphs[4]}</p>
              <p>{formacionesParagraphs[5]}</p>
            </div>
            <div className="w-full lg:w-[min(34rem,90vw)]">
              <ImageCarousel images={fCarousel2} autoPlayInterval={3000} />
            </div>
          </div>

          {/* Third paragraph group with carousel 3 */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 2xl:gap-12 items-start mb-8">
            <div style={{ fontSize: 'var(--internal-body-text)' }} className="flex-1 font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6">
              <p>{formacionesParagraphs[6]}</p>
              <p>{formacionesParagraphs[7]}</p>
              <p>{formacionesParagraphs[8]}</p>
            </div>
            <div className="w-full lg:w-[min(34rem,90vw)]">
              <ImageCarousel images={fCarousel3} autoPlayInterval={3000} />
            </div>
          </div>

          {/* Formaciones video at the end */}
          <div className="mt-16 xl:mt-20 2xl:mt-24 flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative shadow-lg">
                <VideoFrame video={{ title: 'Formaciones', description: '', embedId: 'GK4JmYqqk8Q', type: 'youtube' }} deferred={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials - moved before Asesoramientos */}
        <div className="mt-16 xl:mt-20 2xl:mt-24 mb-16 xl:mb-20 2xl:mb-24">
          <h4 className="text-xl xl:text-xl 2xl:text-2xl font-bold text-stone-800 mb-12 xl:mb-14 2xl:mb-16 text-[#c1562e] font-serif">{language === 'es' ? 'Testimonios de formación' : 'Testimonis de formació'}</h4>
          <TextCarousel items={testimonios} />
        </div>

        {/* Asesoramientos Section - with extra space above */}
        <div className="mt-20 xl:mt-24 2xl:mt-28">
          <h3 className="text-2xl xl:text-2xl 2xl:text-3xl font-bold text-stone-800 mb-4 xl:mb-5 2xl:mb-6 text-[#c1562e] font-serif">{language === 'es' ? 'Asesoramientos' : 'Assessoraments'}</h3>
          
          {/* First paragraph (intro) with carousel */}
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10 2xl:gap-12 items-start mb-8">
            <div style={{ fontSize: 'var(--internal-body-text)' }} className="flex-1 font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6">
              <p>{asesoramientosParagraphs[0]}</p>
            </div>
            <div className="w-full lg:w-[min(34rem,90vw)]">
              <ImageCarousel images={asesoraPhotos} autoPlayInterval={3000} aspectClass="aspect-[5/3]" />
            </div>
          </div>

          {/* A familias section */}
          <div style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6 mb-8">
            {asesoramientosParagraphs.slice(1, 10).map((p, idx) => (
              <p key={idx} className={p === 'A familias' || p === 'A profesionales' || p === 'A nuevos proyectos' ? 'font-bold text-stone-800' : ''}>{p}</p>
            ))}
          </div>

          {/* A profesionales section */}
          <div style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6 mb-8">
            {asesoramientosParagraphs.slice(10, 15).map((p, idx) => (
              <p key={idx} className={p === 'A familias' || p === 'A profesionales' || p === 'A nuevos proyectos' ? 'font-bold text-stone-800' : ''}>{p}</p>
            ))}
          </div>

          {/* A nuevos proyectos section */}
          <div style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif leading-relaxed text-stone-700 space-y-4 xl:space-y-5 2xl:space-y-6">
            {asesoramientosParagraphs.slice(15).map((p, idx) => (
              <p key={idx} className={p === 'A familias' || p === 'A profesionales' || p === 'A nuevos proyectos' ? 'font-bold text-stone-800' : ''}>{p}</p>
            ))}
          </div>
        </div>

        {/* Collaborators logos section - Desktop and Mobile (full width below text) */}
        <div className="mt-16">
          <h3 className="text-xl xl:text-xl 2xl:text-2xl font-bold text-stone-800 mb-6 xl:mb-7 2xl:mb-8 text-[#c1562e] font-serif text-center">
            {language === 'es' ? 'Hemos colaborado con:' : 'Hem col·laborat amb:'}
          </h3>
          
          {/* Education - First */}
          <div className="mb-6">
            <h4 className="text-sm font-serif text-stone-600 mb-3 text-center">
              {language === 'es' ? 'Educación' : 'Educació'}
            </h4>
            <div className="grid grid-cols-3 gap-3 md:flex md:flex-wrap md:justify-center md:gap-3">
              {educacionLogos.map((logo, i) => (
                <div key={`educacion-${i}`} className="aspect-square bg-white rounded-lg flex items-center justify-center border border-stone-200 p-2 md:w-[calc((100%-6*0.75rem)/7)]">
                  <SafeImage src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Universities - Second */}
          <div className="mb-6">
            <h4 className="text-sm font-serif text-stone-600 mb-3 text-center">
              {language === 'es' ? 'Universidades' : 'Universitats'}
            </h4>
            <div className="grid grid-cols-3 gap-3 md:flex md:flex-wrap md:justify-center md:gap-3">
              {universidadLogos.map((logo, i) => (
                <div key={`universidad-${i}`} className="aspect-square bg-white rounded-lg flex items-center justify-center border border-stone-200 p-2 md:w-[calc((100%-6*0.75rem)/7)]">
                  <SafeImage src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Other entities - Third */}
          <div className="mb-6">
            <h4 className="text-sm font-serif text-stone-600 mb-3 text-center">
              {language === 'es' ? 'Otras entidades' : 'Altres entitats'}
            </h4>
            <div className="grid grid-cols-3 gap-3 md:flex md:flex-wrap md:justify-center md:gap-3">
              {otrosLogos.map((logo, i) => (
                <div key={`otros-${i}`} className="aspect-square bg-white rounded-lg flex items-center justify-center border border-stone-200 p-2 md:w-[calc((100%-6*0.75rem)/7)]">
                  <SafeImage src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </InternalPageLayout>
    );
  };

  const StructuredTextView = ({ title, contentData, imageSrc }: { title: string, contentData: ContentSection[], imageSrc: string }) => (
    <InternalPageLayout title={title}>
      <div style={{ gap: 'var(--gap-base)' }} className="flex flex-col md:flex-row items-start">
        <div style={{ fontSize: 'var(--internal-body-text)' }} className="w-full md:w-1/2 font-serif leading-relaxed text-stone-700 space-y-8 xl:space-y-9 2xl:space-y-10">
          {contentData.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4 xl:space-y-5 2xl:space-y-6">
                  {section.title && (
                      <h3 className="text-2xl xl:text-2xl 2xl:text-3xl font-bold text-stone-800 mb-2 xl:mb-2 2xl:mb-3 text-[#c1562e]">{section.title}</h3>
                  )}
                  {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className={pIdx === 0 ? "font-bold" : ""}>
                          {p}
                      </p>
                  ))}
              </div>
          ))}
        </div>
        <div className="w-full md:w-1/2">
           <div style={{ width: 'var(--main-image-size)', height: 'calc(var(--main-image-size) * 1.25)' }} className="bg-stone-200 rounded-lg overflow-hidden shadow-lg sticky top-32 xl:top-36 2xl:top-40 mx-auto">
             <SafeImage 
               src={imageSrc} 
               alt={title} 
               className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
             />
           </div>
        </div>
      </div>
    </InternalPageLayout>
  );

  const EscuelaView = () => {
    const sections: EscuelaSection[] = ['intro', 'aprendizaje', 'acompanamiento', 'equipo', 'familias', 'etapas', '3-6', '6-12', '12-16'];
    const [escuelaImages, setEscuelaImages] = useState<Record<string, { src: string; caption: string }[]>>({});
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
      const loadImages = async () => {
        try {
          const manifestUrl = '/images/Escuela/escuela-manifest.json?v=20260203';
          const response = await fetch(manifestUrl, { cache: 'no-store' });
          if (!response.ok) {
            setEscuelaImages({});
            setImagesLoaded(true);
            return;
          }
          const data = await response.json();
          const mapped: Record<string, { src: string; caption: string }[]> = {};
          Object.entries(data || {}).forEach(([key, list]) => {
            const images = (list as string[]).map((src) => {
              const normalizedSrc = src.replace(/^\/images\/escuela\//i, '/images/Escuela/');
              return { src: normalizedSrc, caption: '' };
            });
            mapped[key] = images;
          });
          setEscuelaImages(mapped);
          setImagesLoaded(true);
        } catch {
          setEscuelaImages({});
          setImagesLoaded(true);
        }
      };
      loadImages();
    }, []);
    
    // Get content from state based on current section
    const activeContent = t.escuelaContent?.[escuelaSection] || ["Contenido no disponible."];
    
    // Helper function to distribute images evenly throughout paragraphs
    const distributeImages = (paragraphs: string[], images: { src: string; caption: string }[]) => {
      if (!images || images.length === 0) {
        return { sections: [{ paragraphs, images: [] }] };
      }

      const totalParagraphs = paragraphs.length;
      const totalImages = images.length;
      
      // Calculate how many carousel sections we need
      // We want to distribute images evenly, ensuring all images are included
      const numCarousels = Math.min(totalImages, Math.ceil(totalParagraphs / 3));
      
      // Calculate images per carousel (distribute evenly)
      const imagesPerCarousel: number[] = [];
      let remainingImages = totalImages;
      for (let i = 0; i < numCarousels; i++) {
        const imgsInThisCarousel = Math.ceil(remainingImages / (numCarousels - i));
        imagesPerCarousel.push(imgsInThisCarousel);
        remainingImages -= imgsInThisCarousel;
      }
      
      // Calculate paragraphs per section
      const paragraphsPerSection: number[] = [];
      let remainingParagraphs = totalParagraphs;
      for (let i = 0; i < numCarousels; i++) {
        const parasInThisSection = Math.ceil(remainingParagraphs / (numCarousels - i));
        paragraphsPerSection.push(parasInThisSection);
        remainingParagraphs -= parasInThisSection;
      }
      
      // Build sections
      const result: Array<{ paragraphs: string[]; images: { src: string; caption: string }[] }> = [];
      let paraIndex = 0;
      let imgIndex = 0;
      
      for (let i = 0; i < numCarousels; i++) {
        const sectionParas = paragraphs.slice(paraIndex, paraIndex + paragraphsPerSection[i]);
        const sectionImgs = images.slice(imgIndex, imgIndex + imagesPerCarousel[i]);
        result.push({ paragraphs: sectionParas, images: sectionImgs });
        paraIndex += paragraphsPerSection[i];
        imgIndex += imagesPerCarousel[i];
      }
      
      return { sections: result };
    };
    
    const currentImages = escuelaImages[escuelaSection] || [];
    const { sections: contentSections } = distributeImages(activeContent, currentImages);

    return (
      <InternalPageLayout title={t.nav.escuela}>
        <div className="flex flex-col md:flex-row gap-12 xl:gap-13 2xl:gap-16">
          {/* Sidebar Menu */}
          <div className="w-full md:w-1/4 shrink-0">
            <div className="sticky top-32 xl:top-36 2xl:top-40 pl-2">
              <ul className="space-y-3 xl:space-y-3 2xl:space-y-4 font-serif">
                {sections.map((s) => {
                  const isActive = escuelaSection === s;
                  return (
                  <li key={s}>
                    <button 
                      onClick={() => setEscuelaSection(s)}
                      style={{ fontSize: 'var(--internal-body-text)' }}
                      className={`font-serif font-medium transition-colors duration-300 block relative group text-left
                        ${isActive ? 'text-[#c1562e]' : 'text-stone-600 hover:text-[#c1562e]'}
                      `}
                    >
                      {t.escuela.menu[s]}
                      <span className={`absolute left-0 -bottom-1 h-[1px] bg-[#c1562e] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </button>
                  </li>
                )})}
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4 min-h-[500px] md:-mt-[0.75rem] xl:md:-mt-[0.75rem] 2xl:md:-mt-[1rem]">
            <h2 style={{ fontSize: 'var(--menu-text-size)' }} className="font-serif mb-8 xl:mb-10 2xl:mb-12 text-stone-800">{t.escuela.titles[escuelaSection]}</h2>
            
            <div className="flex flex-col gap-8 xl:gap-10 2xl:gap-12">
              {imagesLoaded && contentSections.map((section, sectionIdx) => (
                <React.Fragment key={sectionIdx}>
                  {/* Paragraphs */}
                  <div style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif leading-relaxed text-stone-700 space-y-6 xl:space-y-7 2xl:space-y-8 max-w-prose xl:max-w-full">
                    {section.paragraphs.map((text, idx) => {
                      const globalIdx = contentSections.slice(0, sectionIdx).reduce((acc, s) => acc + s.paragraphs.length, 0) + idx;
                      return (
                        <p key={idx} className={globalIdx === 0 ? "font-bold" : ""}>
                          {text}
                        </p>
                      );
                    })}
                  </div>
                  
                  {/* Image display - carousel for multiple images, simple image for single */}
                  {section.images.length === 1 ? (
                    <div className="w-full lg:w-3/4 mt-4">
                      <SafeImage 
                        src={section.images[0].src}
                        alt={section.images[0].caption || "Image"}
                        className="w-full h-auto object-contain rounded-lg shadow-md"
                      />
                    </div>
                  ) : section.images.length > 1 && (
                    <div className="w-full lg:w-2/3">
                      <ImageCarousel images={section.images} autoPlayInterval={3000} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </InternalPageLayout>
    );
  };

  const getThumbnailUrl = (video: VideoItem): string => {
    if (video.type === 'youtube' && video.embedId) {
      return `https://img.youtube.com/vi/${video.embedId}/maxresdefault.jpg`;
    }
    if (video.type === 'vimeo' && video.embedId) {
      // Vimeo thumbnail: use thumbnail URL from CDN (more reliable format)
      return `https://i.vimeocdn.com/video/${video.embedId}_1280.jpg`;
    }
    return IMAGES.videoPlaceholder;
  };

  // Fetch Vimeo thumbnail from API for better reliability
  const useVimeoThumbnail = (videoId: string) => {
    const [thumbnail, setThumbnail] = useState<string>('');
    
    useEffect(() => {
      const fetchThumbnail = async () => {
        try {
          const response = await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`);
          const data = await response.json();
          if (data[0]?.thumbnail_large) {
            setThumbnail(data[0].thumbnail_large);
          }
        } catch (error) {
          // Fallback to standard CDN URL
          setThumbnail(`https://i.vimeocdn.com/video/${videoId}_1280.jpg`);
        }
      };
      
      if (videoId) {
        fetchThumbnail();
      }
    }, [videoId]);
    
    return thumbnail;
  };

  const VideoFrame: React.FC<{ video: VideoItem, deferred?: boolean }> = ({ video, deferred = false }) => {
    const vimeoThumbnail = useVimeoThumbnail(video.type === 'vimeo' ? video.embedId || '' : '');
    
    if (video.type === 'vimeo' && video.embedId) {
      if (deferred) {
        const thumbUrl = vimeoThumbnail || getThumbnailUrl(video);
        return (
          <>
            <div className="absolute inset-0 opacity-60 bg-cover bg-center" style={{ backgroundImage: `url(${thumbUrl})` }}></div>
            <Play className="text-white w-16 h-16 relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="currentColor" />
          </>
        );
      }
      return (
        <iframe 
          src={`https://player.vimeo.com/video/${video.embedId}?title=0&byline=0&portrait=0`} 
          className="w-full h-full z-20" 
          frameBorder="0" 
          allow="autoplay; fullscreen; picture-in-picture" 
          allowFullScreen
          loading="lazy"
          title={video.title}
        ></iframe>
      );
    }

    if (video.type === 'youtube' && video.embedId) {
      if (deferred) {
        return (
          <>
            <div className="absolute inset-0 opacity-60 bg-cover bg-center" style={{ backgroundImage: `url(${getThumbnailUrl(video)})` }}></div>
            <Play className="text-white w-16 h-16 relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="currentColor" />
          </>
        );
      }
      return (
        <iframe
            src={`https://www.youtube.com/embed/${video.embedId}`}
            className="w-full h-full z-20"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={video.title}
        ></iframe>
      );
    }

    if (video.type === 'spotify' && video.embedId) {
      if (deferred) {
        return (
          <>
            <div className="absolute inset-0 opacity-60 bg-cover bg-center bg-black flex items-center justify-center">
              <Mic className="text-white w-16 h-16 opacity-60" />
            </div>
            <Play className="text-white w-16 h-16 relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="currentColor" />
          </>
        );
      }
      return (
        <iframe 
            style={{borderRadius: '12px'}} 
            src={`https://open.spotify.com/embed/episode/${video.embedId}?utm_source=generator&theme=0`} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allowFullScreen 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="eager"
            className="z-20 p-2 bg-black/10"
            title={video.title}
        ></iframe>
      );
    }

    return (
      <>
        <div className="absolute inset-0 opacity-60 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.videoPlaceholder})` }}></div>
        <Play className="text-white w-16 h-16 relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="currentColor" />
      </>
    );
  };

  const VideosView = () => {
    // Fallback to empty array if undefined to prevent crashes
    const videos: VideoItem[] = t.videosList || [];
    const [loadedEmbeds, setLoadedEmbeds] = useState<Record<string, boolean>>({});
    const markLoaded = (embedId?: string) => {
      if (!embedId) return;
      setLoadedEmbeds(prev => ({ ...prev, [embedId]: true }));
    };

    return (
      <InternalPageLayout title={t.nav.videos}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-14 2xl:gap-16">
                {videos.map((video, i) => {
                  const isLoaded = !!(video.embedId && loadedEmbeds[video.embedId]);
                  return (
            <div key={video.embedId || video.link || i} className="flex flex-col gap-3 xl:gap-3 2xl:gap-4 group cursor-pointer" onClick={() => { 
              if (video.embedId && !isLoaded) { markLoaded(video.embedId); }
              else if(video.link && video.link !== '#' && !video.embedId) { window.open(video.link, '_blank'); }
            }}>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center shadow-lg">
                <VideoFrame video={video} deferred={!isLoaded} />
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif font-bold text-stone-800 mt-2 xl:mt-2 2xl:mt-3 group-hover:text-[#c1562e] transition-colors">{video.title}</h3>
                <p style={{ fontSize: 'calc(var(--internal-body-text) * 0.9)' }} className="font-serif text-stone-600 mt-1 xl:mt-1 2xl:mt-2 leading-relaxed">{video.description}</p>
              </div>
            </div>
          )})}
        </div>
      </InternalPageLayout>
    );
  };

  // State for TextosView filtering - moved outside to persist across renders
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const TextosView = () => {
    // All articles data structure
    const allArticles: Article[] = t.articles;

    // Get all unique tags from all articles - memoize to prevent re-renders
    const topics = React.useMemo(() => {
      return Array.from(new Set(allArticles.flatMap(a => a.tags)));
    }, [allArticles]);

    // Filter articles by both topic and search query
    const filteredArticles = React.useMemo(() => {
      return allArticles.filter(article => {
        const matchesTopic = activeTopic ? article.tags.includes(activeTopic) : true;
        const matchesSearch = searchQuery.trim() === '' || 
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTopic && matchesSearch;
      });
    }, [allArticles, activeTopic, searchQuery]);

    return (
      <InternalPageLayout title={t.nav.textos}>
        {/* Search Bar and Filter Tags */}
        <div className="flex flex-wrap gap-3 xl:gap-3 2xl:gap-4 mb-10 xl:mb-12 2xl:mb-14">
            {/* Search Bar */}
            <div className="relative" style={{ fontSize: 'var(--internal-body-text)' }}>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'es' ? 'Buscar...' : 'Cercar...'}
                style={{ 
                  fontSize: 'var(--internal-body-text)', 
                  padding: 'calc(var(--internal-body-text) * 0.5) calc(var(--internal-body-text) * 1.2) calc(var(--internal-body-text) * 0.5) calc(var(--internal-body-text) * 2.5)'
                }}
                className="rounded-full font-serif font-medium border border-stone-300 bg-white text-stone-600 hover:border-[#c1562e] focus:border-[#c1562e] focus:outline-none transition-all"
              />
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
                style={{ width: 'calc(var(--internal-body-text) * 0.9)', height: 'calc(var(--internal-body-text) * 0.9)' }}
              />
            </div>
            
            <button 
                onClick={() => setActiveTopic(null)}
                style={{ fontSize: 'var(--internal-body-text)', padding: 'calc(var(--internal-body-text) * 0.5) calc(var(--internal-body-text) * 1.2)' }}
                className={`rounded-full font-serif font-medium border transition-all
                    ${activeTopic === null 
                        ? 'bg-[#c1562e] text-white border-[#c1562e]' 
                        : 'bg-white text-stone-600 border-stone-300 hover:border-[#c1562e] hover:text-[#c1562e]'}
                `}
            >
                {language === 'es' ? 'Todos' : 'Tots'} ({allArticles.length})
            </button>
            {topics.map(topic => (
                <button 
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    style={{ fontSize: 'var(--internal-body-text)', padding: 'calc(var(--internal-body-text) * 0.5) calc(var(--internal-body-text) * 1.2)' }}
                    className={`rounded-full font-serif font-medium border transition-all
                        ${activeTopic === topic
                            ? 'bg-[#c1562e] text-white border-[#c1562e]' 
                            : 'bg-white text-stone-600 border-stone-300 hover:border-[#c1562e] hover:text-[#c1562e]'}
                    `}
                >
                    {topic}
                </button>
            ))}
        </div>

        {/* Grid of Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7 2xl:gap-8">
          {filteredArticles.map((article, idx) => {
            const hasLink = !!article.link;
            const hasPdf = !!article.file;
            const hasAdditionalInfo = !!article.additionalInfo;
            
            const CardContent = () => (
              <>
                <div className="flex items-start justify-between mb-4 xl:mb-4 2xl:mb-5">
                  <div className="flex flex-wrap gap-1.5 justify-start w-full">
                    {article.tags.map((tag, i) => (
                      <span key={i} className="text-xs md:text-sm xl:text-sm 2xl:text-base font-bold text-[#c1562e] bg-[#c1562e]/10 px-2 xl:px-2.5 2xl:px-3 py-1 xl:py-1 2xl:py-1.5 rounded whitespace-nowrap">{tag}</span>
                    ))}
                  </div>
                </div>
                <h3 style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif font-bold text-stone-800 mb-2 xl:mb-2 2xl:mb-3 group-hover:text-[#c1562e] transition-colors leading-tight">
                  {article.title}
                </h3>
                <p style={{ fontSize: 'calc(var(--internal-body-text) * 0.85)' }} className="text-stone-500 mb-2 xl:mb-2 2xl:mb-3 font-serif italic">
                  {article.author}
                </p>
                <div className="flex items-center gap-2 mt-4 xl:mt-4 2xl:mt-5 text-sm md:text-base xl:text-base 2xl:text-lg text-stone-500">
                  {hasPdf && (
                    <>
                      <FileText size={16} />
                      <span className="hover:underline">
                        PDF • {language === 'es' ? 'Descargar' : 'Descarregar'}
                      </span>
                    </>
                  )}
                  {hasAdditionalInfo && !hasPdf && (
                    <>
                      <FileText size={16} />
                      <span className="text-xs md:text-sm">
                        {article.additionalInfo}
                      </span>
                    </>
                  )}
                </div>
              </>
            );
            
            return hasLink ? (
              <a 
                key={idx} 
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 xl:p-7 2xl:p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all group cursor-pointer block"
              >
                <CardContent />
              </a>
            ) : hasPdf ? (
              <a
                key={idx}
                href={article.file}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-6 xl:p-7 2xl:p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all group cursor-pointer block"
              >
                <CardContent />
              </a>
            ) : (
              <div key={idx} className="bg-white p-6 xl:p-7 2xl:p-8 rounded-xl border border-stone-200 shadow-sm transition-all group">
                <CardContent />
              </div>
            );
          })}
        </div>

        {/* Magazines logos section */}
        <div className="mt-16">
          <h3 className="text-xl xl:text-xl 2xl:text-2xl font-bold text-stone-800 mb-6 xl:mb-7 2xl:mb-8 text-[#c1562e] font-serif text-center">
            {language === 'es' ? 'Hemos publicado en:' : 'Hem publicat a:'}
          </h3>
          
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-3 md:flex md:flex-wrap md:justify-center md:gap-3">
              {[
                '/images/logos/revista_elviure.jpg',
                '/images/logos/revista_integral2.jpg',
                '/images/logos/revista_cuadernosdepedagogia.jpg',
                '/images/logos/revista_grao.png',
                '/images/logos/revista_kikirikicooperacioneducativa.png',
              ].map((logo, i) => (
                <div key={`revista-${i}`} className="aspect-square bg-white rounded-lg flex items-center justify-center border border-stone-200 p-2 md:w-[calc((100%-6*0.75rem)/7)]">
                  <SafeImage src={logo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </InternalPageLayout>
    );
  };

  const EnQueEstamosView = () => (
      <InternalPageLayout title={t.nav.en_que_estamos}>
          <div className="flex flex-col gap-16 md:gap-24 xl:gap-32 2xl:gap-40">
            {t.people.map((person, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-8 md:gap-12 xl:gap-16 2xl:gap-20 items-start">
                    {/* Image Left/Right Alternating could be nice, but let's stick to Left for consistency or standard readable layout */}
                    <div className="w-full md:w-1/3 shrink-0 flex justify-center md:justify-start">
                        <div className="w-56 h-56 md:w-72 md:h-72 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-xl overflow-hidden shadow-lg relative group">
                             <div className="absolute inset-0 bg-[#c1562e]/10 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
                             <SafeImage 
                              src={IMAGES.people[index] || IMAGES.homeMain} 
                              alt={person.name} 
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                        <h3 style={{ fontSize: 'var(--menu-text-size)' }} className="font-serif font-bold text-stone-800 mb-6 xl:mb-8 2xl:mb-10 border-l-4 xl:border-l-6 2xl:border-l-8 border-[#c1562e] pl-4 xl:pl-6 2xl:pl-8 text-center md:text-left md:border-l-4">
                            {person.name}
                        </h3>
                        <div style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif text-stone-700 leading-relaxed space-y-4 xl:space-y-6 2xl:space-y-8">
                            {person.paragraphs.map((p, pIdx) => (
                                <p key={pIdx}>
                                    {/* Apply linkify logic to each paragraph */}
                                    <LinkifyText text={p} />
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
          </div>
      </InternalPageLayout>
  );

  const ComunidadView = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleLogin = () => {
      if (password === 'R196r3-') {
        window.open('https://drive.google.com/drive/folders/1BfLzFsw4C6WDcIL9gOO-3TDDavWQpsv1?usp=share_link', '_blank'); 
        setError(false);
      } else {
        setError(true);
      }
    };

    return (
      <InternalPageLayout title={t.nav.comunidad}>
         <div className="flex flex-col items-center max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto">
            <div style={{ fontSize: 'var(--internal-body-text)' }} className="text-center space-y-4 xl:space-y-6 2xl:space-y-8 font-serif leading-relaxed text-stone-700 mb-10 xl:mb-14 2xl:mb-20">
                {t.comunidadText.map((p, idx) => {
                    // Handle subtitle
                    if (p.startsWith('SUBTITLE:')) {
                        const subtitle = p.replace('SUBTITLE:', '');
                        return (
                            <h3 key={idx} className="text-2xl xl:text-2xl 2xl:text-3xl font-bold text-stone-800 mb-2 xl:mb-2 2xl:mb-3 text-[#c1562e]">
                                {subtitle}
                            </h3>
                        );
                    }
                    // Handle inline link within text
                    if (p.includes('LINK_ACCEDER') || p.includes('LINK_ACCEDIR')) {
                        const parts = p.split(/LINK_ACCEDER|LINK_ACCEDIR/);
                        return (
                            <p key={idx}>
                                {parts[0]}
                                <a 
                                    href="https://docs.google.com/spreadsheets/d/1rpDdtjJwXMMhVI3UcWvfjP5AHJEpSOAwU-LmI6xy3SI/edit?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#c1562e] hover:underline font-medium"
                                >
                                    Clica aquí
                                </a>
                                {parts[1] || ''}
                            </p>
                        );
                    }
                    return (
                        <p key={idx}>
                            <LinkifyText text={p} />
                        </p>
                    );
                })}
            </div>
            
            <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl">
                <div className="flex flex-col gap-4 xl:gap-5 2xl:gap-6">
                    <input 
                        type="password" 
                        style={{ fontSize: 'var(--internal-body-text)' }}
                        className="w-full bg-transparent border-b-2 border-stone-800 focus:border-[#c1562e] outline-none transition-all py-2 text-center font-serif text-stone-800 placeholder:text-stone-400"
                        placeholder={language === 'es' ? 'Escribe aquí' : 'Escriu aquí'}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    {error && (
                        <span style={{ fontSize: 'calc(var(--internal-body-text) * 0.9)' }} className="text-[#c1562e] font-serif text-center">
                            {language === 'es' ? 'Contraseña incorrecta' : 'Contrasenya incorrecta'}
                        </span>
                    )}
                </div>
            </div>
         </div>
      </InternalPageLayout>
    );
  };

  // --- Main Render ---

  return (
    <div className="min-h-screen w-full text-stone-800 font-sans overflow-x-hidden selection:bg-[#c1562e] selection:text-white relative" style={{ backgroundImage: 'url(/images/main_bg.webp)', backgroundAttachment: 'fixed', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      
      {/* Content wrapper */}
      <div className="relative z-10">
      
      {/* Render View Based on State */}
      {currentView === 'home' && <HomeView />}
      {currentView === 'historia' && <HistoriaView title={t.nav.historia} contentData={t.historiaContent} />}
      {currentView === 'fundamentos' && <FundamentosView />}
      {currentView === 'formacion' && <FormacionView />}
      {currentView === 'escuela' && <EscuelaView />}
      {currentView === 'videos' && <VideosView />}
      {currentView === 'textos' && <TextosView />}
      {currentView === 'comunidad' && <ComunidadView />}
      {currentView === 'en_que_estamos' && <EnQueEstamosView />}

      {/* Scroll to Top Button (Only if NOT Home) */}
      {currentView !== 'home' && (
        <button
            onClick={scrollToTop}
            style={{ fontSize: 'calc(var(--footer-text-size) * 0.9)', padding: 'calc(var(--scroll-button-size) * 0.3) calc(var(--scroll-button-size) * 0.5)' }}
            className={`fixed bottom-8 xl:bottom-12 2xl:bottom-16 right-8 xl:right-12 2xl:right-16 z-50 bg-[#c1562e] text-white rounded-full shadow-lg flex items-center gap-2 transition-all duration-500 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
        >
            <span className="font-serif font-medium uppercase tracking-wider">{t.nav.top}</span>
            <ArrowUp style={{ width: 'var(--scroll-button-size)', height: 'var(--scroll-button-size)' }} />
        </button>
      )}

      </div>
    </div>
  );
};

export default App;
