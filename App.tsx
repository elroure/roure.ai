
import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ChevronLeft, FileText, Play, Tag, Mic } from 'lucide-react';

// --- Types & Content ---

type Language = 'es' | 'ca';
type View = 'home' | 'historia' | 'fundamentos' | 'escuela' | 'videos' | 'textos' | 'comunidad' | 'en_que_estamos';
type EscuelaSection = 'intro' | 'aprendizaje' | 'acompanamiento' | 'equipo' | 'familias' | 'etapas' | '3-6' | '6-12' | '12-16';

// --- IMAGE CONFIGURATION ---
// Use static public `/images/*` paths so images are available in both dev
// and production without relying on bundler-specific runtime helpers.
// Ensure you have copied the source images into `public/images/`.
const IMAGES = {
  logo: '/images/logo_roure.png', // Spanish/Castellano
  logo_ca: '/images/logo_roure_ca.png', // Catalan
  homeMain: '/images/home_main.png',
  sections: {
    historia: "https://picsum.photos/seed/history/800/1000",
    fundamentos: "https://picsum.photos/seed/foundations/800/1000",
  },
  historiaPhotos: [
    '/images/begona_cristobal.webp',
    '/images/el_viejo_roble_talado.webp',
    '/images/el_viejo_roble.webp',
    '/images/escuela_el_roure.webp',
    '/images/evento_especial.webp',
    '/images/familias_el_roure.webp',
    '/images/heura_adolescents_escola_el_roure.webp',
    '/images/hormigon.webp',
    '/images/inauguracion.webp',
    '/images/los_4_descansando.webp',
    '/images/maquina_del_tiempo.webp',
    '/images/ninos_estanteria.webp',
    '/images/ordenando_nueva _sala.webp',
    '/images/paso_de_manos.webp',
    '/images/pintando.webp',
    '/images/reunion_escuela_el_roure.webp',
    '/images/subiendo_viga.webp',
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
    topic: string;
    file?: string; // optional path to a PDF file under `public/pdfs/` or an external URL
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
        intro: 'Introducción a nuestra escuela',
        aprendizaje: 'Nuestra visión del aprendizaje',
        acompanamiento: 'El arte de acompañar',
        equipo: 'Nuestro equipo pedagógico',
        familias: 'Las familias en el centro',
        etapas: 'Los espacios y los ritmos',
        '3-6': 'La etapa Infantil (3-6)',
        '6-12': 'La etapa Primaria (6-12)',
        '12-16': 'La etapa Secundaria (12-16)',
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
                "La escuela El Roure nació en 2001 en una finca rústica del municipio de Mediona (Barcelona). La fundamos Begoña González y Cristóbal Gutiérrez, como un paso más en la evolución de la experiencia en La Casita, que fundamos en 1996, en Barcelona.",
                "La llamamos escuela viva El Roure. Sus raíces son la experiencia de crianza, el Seitai y la Sistémica y algunas inspiraciones de pedagogías innovadoras del s. XX (Montessori, Freinet, Neill, Malaguzzi, etc.). La línea pedagógica se fue concretando y desarrollando a través de la práctica cotidiana con los niños y niñas, con las madres y padres, en la relación de equipo. A partir de muchas preguntas, la observación y la reflexión, algunos criterios se fueron clarificando y confirmando.",
                "El apoyo, la confianza y la implicación de las primeras familias y miembros del equipo fueron decisivos.",
                "La semilla de El Roure encontró las condiciones más favorables para germinar y crecer. Una persona cercana hizo de mecenas ofreciéndose a comprar la preciosa finca que elegimos para ubicar el proyecto. Empezamos con 6 criaturas que venían desde Barcelona y se quedaban a dormir en la masía tres días a la semana. Poco a poco el grupo fue creciendo y las familias participantes realizaron todo un cambio de vida trasladándose a la zona.",
                "Fue una época de trabajo exhaustivo, tanto en la reforma y adecuación del espacio y en la preparación de materiales educativos como en la reflexión y evolución de la metodología, la organización y la explicación de la línea educativa que estábamos creando.",
                "Como todo comienzo, se vivió en un ambiente de ilusión y de implicación muy intenso entre el equipo, familias, amigos y profesionales que colaboraban de forma desinteresada. Compartimos sudor entre cemento, escombros y pintura, horas de cocina, tertulias pedagógicas, sueños, incertidumbres y mucha confianza.",
                "En 2009 pasamos de asociación a cooperativa de trabajo sin ánimo de lucro: Experiencia educativa El Roure SCCL.",
                "En aquel momento también ampliamos nuestra presencia en el panorama educativo, compartiendo con más frecuencia nuestra experiencia a través de charlas, artículos en publicaciones educativas, colaboraciones en formaciones, y además empezamos a ofrecer nuestras propias formacions y acompañamientos a familias y profesionales.",
                "La escuela creció hasta llegar a acoger 90 niñas, niños y adolescentes. Siempre tuvimos vocación de escuela pequeña, para poder hacer el trabajo con la profundidad que queríamos y esta dimensión se convirtió en el límite.",
                "En 2017, después de un enorme esfuerzo económico y organizativo por parte de toda la comunidad (que incluyó un micromecenazgo impulsado por las familias), conseguimos la autorización como escuela de primaria, por parte del Departament d'Educació de la Generalitat de Catalunya.",
                "Después del confinamiento por el coronavirus de 2020, la escuela fue decreciendo. El mundo era otro al de los inicios; las familias tendían más a la escolarización pública gratuita y cercana a su vivienda, las escuelas públicas habían ido poco a poco abriéndose hacia la creación de ambientes con materiales manipulatius, etc.",
                "A raíz de serias dificultades en la finca, la disminución del número de familias y la falta de relevo en la coordinación de la escuela, decidimos el cierre."
            ]
        }
    ],
    fundamentosContent: [
        {
            title: "La autorregulación espontánea. El contacto con la naturaleza propia.",
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
            title: "El acompañamiento respetuoso; el marco necesario para el crecimiento.",
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
        "Aquí podréis encontrar una herramienta para que las personas de la comunidad histórica de El Roure podáis encontraros y poneros en contacto, dejando vuestro datos voluntariamente, y una selección de fotos que hemos hecho de los 24 años de escuela (en las que aparecen personas que lo han autorizado).",
        "Para acceder os facilitaremos una contraseña que podéis pedir en el correo.",
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
        title: "(clicar en más información para ver) Conversación del proyecto Ametxe con Begoña González. JolasBIDE 2024.",
        description: "\"Entrevista a Begoña González, fundadora de la escuela viva El Roure de Cataluña, en su visita a Euskadi para el curso que se desarrolla entre las escuelas de Landabaso en Zalla (Bizkaia) y Bizilore en Azpeitia (Gipuzkoa). Entrevista realizada en el proyecto Ametxe, una comunidad generada en una vivienda cooperativa en cesión de uso en ámbito rural en Gordexola, Bizkaia. JolasBIDE 2024.\"",
        link: "https://vimeo.com/1046320608",
        embedId: "1046320608",
        type: "vimeo"
      }
    ] as VideoItem[],
    articles: [
        { title: "Amigos y amigas por carta", topic: "Escritura", file: "/pdfs/AMIGOS-Y-AMIGAS-POR-CARTA.pdf" },
        { title: "Celebrando el milagro de la vida", topic: "Aprendizaje", file: "/pdfs/CELEBRANDO-EL-MILAGRO-DE-LA-VIDA.pdf" },
        { title: "Cines, bebés y sensibilidad", topic: "Aprendizaje", file: "/pdfs/CINES-BEBES-Y-SENSIBILIDAD.pdf" },
        { title: "Cosas que pasan", topic: "Eventualidades", file: "/pdfs/COSAS-QUE-PASAN.pdf" },
        { title: "Cris se va (2007)", topic: "Eventualidades", file: "/pdfs/CRIS-SE-VA-2007.pdf" },
        { title: "Cristóbal trajo el Seitai a El Roure", topic: "Aprendizaje", file: "/pdfs/CRISTOBAL-TRAJO-EL-SEITAI-A-EL-ROURE.pdf" },
        { title: "Despedida", topic: "Eventualidades", file: "/pdfs/DESPEDIDA.pdf" },
        { title: "Despiértate papá y mamá", topic: "Aprendizaje", file: "/pdfs/DESPIERTATE-PAPA-Y-MAMA.pdf" },
        { title: "Divídete y sufrirás", topic: "Aprendizaje", file: "/pdfs/DIVIDETE-Y-SUFIRAS.pdf" },
        { title: "Dues experiències de restauració", topic: "Eventualidades", file: "/pdfs/DUES-EXPERIENCIES-DE-RESTAURACIO.pdf" },
        { title: "El consumismo que enturbia el alma", topic: "Aprendizaje", file: "/pdfs/EL-CONSUMISMO-QUE-ENTURBIA-EL-ALMA.pdf" },
        { title: "El Roure Boletín 13", topic: "Eventualidades", file: "/pdfs/EL-ROURE-BOLETIN-13_MOVIL.pdf" },
        { title: "En busca de una feminidad y masculinidad naturales", topic: "Género", file: "/pdfs/EN-BUSCA-DE-UNA-FEMINIDAD-Y-MASCULINIDAD-NATURALES.pdf" },
        { title: "Escritor Roures", topic: "Escritura", file: "/pdfs/ESCRITORROURES.pdf" },
        { title: "Escrito a mano", topic: "Escritura", file: "/pdfs/ESCRITO-A-MANO.pdf" },
        { title: "¿Estamos o no haciendo matemáticas?", topic: "Matemáticas", file: "/pdfs/ESTAMOS-O-NO-HACIENDO-MATEMATICAS.pdf" },
        { title: "Feminidad y masculinidad", topic: "Género", file: "/pdfs/FEMINIDAD-Y-MASCULINIDAD.pdf" },
        { title: "Habitar el espacio y el tiempo en la escuela alternativa", topic: "Aprendizaje", file: "/pdfs/Habitar-el-espacio-y-el-tiempo-en-la-escuela-alternativa.pdf" },
        { title: "Hora de marcharme de El Roure", topic: "Eventualidades", file: "/pdfs/HORA-DE-MARCHARME-DE-EL-ROURE.pdf" },
        { title: "In Memoriam", topic: "Eventualidades", file: "/pdfs/IN-MEMORIAM.pdf" },
        { title: "La mirada amorosa", topic: "Aprendizaje", file: "/pdfs/LA-MIRADA-AMOROSA.pdf" },
        { title: "La muerte de cada día", topic: "Eventualidades", file: "/pdfs/LA-MUERTE-DE-CADA-DIA.pdf" },
        { title: "Límites y limitaciones", topic: "Límites", file: "/pdfs/LIMITES-Y-LIMITACIONES.pdf" },
        { title: "Que la vida sea el eje de la educación", topic: "Aprendizaje", file: "/pdfs/QUE-LA-VIDA-SEA-EL-EJE-DE-LA-EDUCACION.pdf" },
        { title: "Que ser valiente no salga tan caro", topic: "Aprendizaje", file: "/pdfs/QUE-SER-VALIENTE-NO-SALGA-TAN-CARO.pdf" },
        { title: "Taller d'Andromines", topic: "Eventualidades", file: "/pdfs/TALLER-D-ANDROMINES.pdf" },
        { title: "Un bañador con bolsillos", topic: "Eventualidades", file: "/pdfs/UN-BAÑADOR-CON-BOLSILLOS.pdf" },
        { title: "Una pedagogía de la relación", topic: "Aprendizaje", file: "/pdfs/UNA-PEDAGOGIA-DE-LA-RELACIO.pdf" },
    ]
  },
  ca: {
    nav: {
      historia: 'Història',
      fundamentos: 'Fonaments',
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
        intro: 'Introducció a la nostra escola',
        aprendizaje: 'La nostra visió de l\'aprenentatge',
        acompanamiento: 'L\'art d\'acompanyar',
        equipo: 'El nostre equip pedagògic',
        familias: 'Les famílies al centre',
        etapas: 'Els espais i els ritmes',
        '3-6': 'L\'etapa Infantil (3-6)',
        '6-12': 'L\'etapa Primària (6-12)',
        '12-16': 'L\'etapa Secundària (12-16)',
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
                "L'escola El Roure va néixer el 2001 en una finca rústica del municipi de Mediona (Barcelona). La vam fundar Begoña González i Cristóbal Gutiérrez, com un pas més en l'evolució de l'experiència a La Casita, que vam fundar el 1996, a Barcelona.",
                "L'anomenem escola viva El Roure. Les seves arrels són l'experiència de criança, el Seitai i la Sistèmica i algunes inspiracions de pedagogies innovadores del s. XX (Montessori, Freinet, Neill, Malaguzzi, etc.). La línia pedagògica es va anar concretant i desenvolupant a través de la pràctica quotidiana amb els nens i nenes, amb les mares i pares, en la relació d'equip. A partir de moltes preguntes, l'observació i la reflexió, alguns criteris es van anar clarificant i confirmant. El procés de descobriment i aprenentatge ha seguit fins al final.",
                "El suport, la confiança i la implicació de les primeres famílies i membres de l'equip van ser decisius.",
                "La llavor d'El Roure va trobar les condicions més favorables per germinar i créixer. Una persona propera va fer de mecenas oferint-se a comprar la preciosa finca que vam triar per ubicar el projecte. Vam començar amb 6 criatures que venien des de Barcelona i es quedaven a dormir a la masia tres días a la setmana. A poc a poc el grup va anar creixent i les famílies participants van realitzar tot un canvi de vida traslladant-se a la zona. Aquestes primeres famílies es van entregar en cos i ànima a la reforma de les edificacions i van implicar familiars i amics.",
                "Va ser una època de treball exhaust, tant en la reforma i adequació de l'espai i en la preparació de materials educatius com en la reflexió i evolució de la metodologia, l'organització i l'explicació de la línia educativa que estàvem creant.",
                "Com tot començament, es va viure en un ambient d'il·lusió i d'implicació molt intens entre l'equip, famílies, amics i professionals que col·laboraven de forma desinteressada. Vam compartir suor entre ciment, runa i pintura, hores de cuina, tertulias pedagògiques en sobretaules de grup, somnis, incerteses i molta confiança. Van ser temps de mancances econòmiques i dificultats constants, en les que no existien les vacances…y nos empujaba una força immensa.",
                "El 2009 vam passar d'associació a cooperativa de treball sense ànim de lucre: Experiència educativa El Roure SCCL.",
                "En aquell moment també vam ampliar la nostra presència en el panorama educatiu, compartint amb més freqüència la nostra experiència a través de xerrades, articles en publicacions educatives, col·laboracions en formacions, i a més vam començar a oferir les nostres pròpies formacions i acompanyaments a famílies i professionals.",
                "L'escola va créixer fins a arribar a acollir 90 nenes, nens i adolescents. Sempre vam tenir vocació d'escola petita, per poder fer la feina amb la profunditat que volíem i aquesta dimensió es va convertir en el límit.",
                "El 2017, després d'un enorme esforç econòmic i organitzatiu per part de tota la comunitat (que va incloure un micromecenatge impulsat per les famílies), vam aconseguir l'autorització com a escola de primària, per part del Departament d'Educació de la Generalitat de Catalunya.",
                "Després del confinament pel coronavirus del 2020, l'escola va anar decreixent. El món era un altre al dels inicis; les famílies tendien més a l'escolarització pública gratuïta i propera al seu habitatge, les escoles públiques havien anat de mica en mica obrint-se cap a la creació d'ambients amb materials manipulatius i l'anomenada \"lliure circulació\", etc.",
                "Arran de serioses dificultats a la finca, la disminució del nombre de famílies i la manca de relleu en la coordinació de l'escola, la manca de relleu en la coordinació de l'escola, vam decidir el tancament."
            ]
        }
    ],
    fundamentosContent: [
        {
            title: "L'autoregulació espontània. El contacte amb la naturalesa pròpia.",
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
            title: "L'acompanyament respectuós; el marc necessari per al creixement.",
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
        "Aquí podreu trobar una eina perquè les persones de la comunitat històrica d'El Roure us pugueu trobar i posar-vos en contacte, deixant les vostres dades voluntàriament, i una selecció de fotos que hem fet dels 24 anys d'escola (en les quals apareixen persones que ho han autoritzat).",
        "Per accedir us facilitarem una contrasenya que podeu demanar al correu.",
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
        { title: "Amigos y amigas por carta", topic: "Escriptura", file: "/pdfs/AMIGOS-Y-AMIGAS-POR-CARTA.pdf" },
        { title: "Celebrando el milagro de la vida", topic: "Aprenentatge", file: "/pdfs/CELEBRANDO-EL-MILAGRO-DE-LA-VIDA.pdf" },
        { title: "Cines, bebés y sensibilidad", topic: "Aprenentatge", file: "/pdfs/CINES-BEBES-Y-SENSIBILIDAD.pdf" },
        { title: "Cosas que pasan", topic: "Eventualitats", file: "/pdfs/COSAS-QUE-PASAN.pdf" },
        { title: "Cris se va (2007)", topic: "Eventualitats", file: "/pdfs/CRIS-SE-VA-2007.pdf" },
        { title: "Cristóbal trajo el Seitai a El Roure", topic: "Aprenentatge", file: "/pdfs/CRISTOBAL-TRAJO-EL-SEITAI-A-EL-ROURE.pdf" },
        { title: "Despedida", topic: "Eventualitats", file: "/pdfs/DESPEDIDA.pdf" },
        { title: "Despiértate papá y mamá", topic: "Aprenentatge", file: "/pdfs/DESPIERTATE-PAPA-Y-MAMA.pdf" },
        { title: "Divídete y sufrirás", topic: "Aprenentatge", file: "/pdfs/DIVIDETE-Y-SUFIRAS.pdf" },
        { title: "Dues experiències de restauració", topic: "Eventualitats", file: "/pdfs/DUES-EXPERIENCIES-DE-RESTAURACIO.pdf" },
        { title: "El consumismo que enturbia el alma", topic: "Aprenentatge", file: "/pdfs/EL-CONSUMISMO-QUE-ENTURBIA-EL-ALMA.pdf" },
        { title: "En busca de una feminidad y masculinidad naturales", topic: "Gènere", file: "/pdfs/EN-BUSCA-DE-UNA-FEMINIDAD-Y-MASCULINIDAD-NATURALES.pdf" },
        { title: "Escritor Roures", topic: "Escriptura", file: "/pdfs/ESCRITORROURES.pdf" },
        { title: "Escrito a mano", topic: "Escriptura", file: "/pdfs/ESCRITO-A-MANO.pdf" },
        { title: "¿Estamos o no haciendo matemáticas?", topic: "Matemàtiques", file: "/pdfs/ESTAMOS-O-NO-HACIENDO-MATEMATICAS.pdf" },
        { title: "Feminidad y masculinidad", topic: "Gènere", file: "/pdfs/FEMINIDAD-Y-MASCULINIDAD.pdf" },
        { title: "Habitar el espacio y el tiempo en la escuela alternativa", topic: "Aprenentatge", file: "/pdfs/Habitar-el-espacio-y-el-tiempo-en-la-escuela-alternativa.pdf" },
        { title: "Hora de marcharme de El Roure", topic: "Eventualitats", file: "/pdfs/HORA-DE-MARCHARME-DE-EL-ROURE.pdf" },
        { title: "In Memoriam", topic: "Eventualitats", file: "/pdfs/IN-MEMORIAM.pdf" },
        { title: "La mirada amorosa", topic: "Aprenentatge", file: "/pdfs/LA-MIRADA-AMOROSA.pdf" },
        { title: "La muerte de cada día", topic: "Eventualitats", file: "/pdfs/LA-MUERTE-DE-CADA-DIA.pdf" },
        { title: "Límites y limitaciones", topic: "Límits", file: "/pdfs/LIMITES-Y-LIMITACIONES.pdf" },
        { title: "Que la vida sea el eje de la educación", topic: "Aprenentatge", file: "/pdfs/QUE-LA-VIDA-SEA-EL-EJE-DE-LA-EDUCACION.pdf" },
        { title: "Que ser valiente no salga tan caro", topic: "Aprenentatge", file: "/pdfs/QUE-SER-VALIENTE-NO-SALGA-TAN-CARO.pdf" },
        { title: "Taller d'Andromines", topic: "Eventualitats", file: "/pdfs/TALLER-D-ANDROMINES.pdf" },
        { title: "Un bañador con bolsillos", topic: "Eventualitats", file: "/pdfs/UN-BAÑADOR-CON-BOLSILLOS.pdf" },
        { title: "Una pedagogía de la relación", topic: "Aprenentatge", file: "/pdfs/UNA-PEDAGOGIA-DE-LA-RELACIO.pdf" },
    ]
  }
};

// --- Components ---

const App: React.FC = () => {
  const ALLOWED_VIEWS: View[] = ['home','historia','fundamentos','escuela','videos','textos','comunidad','en_que_estamos'];
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
  const [hoveredMenuKey, setHoveredMenuKey] = useState<string | null>(null);

  const brandColor = "text-[#c1562e]";
  const hoverBrandColor = "hover:text-[#c1562e]";
  const t = content[language];

  // Load background image after component mounts
  useEffect(() => {
    document.body.style.backgroundImage = "url('/images/main_bg.webp')";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.backgroundRepeat = "no-repeat";
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
      if (h && ALLOWED_VIEWS.includes(h as View)) {
        setCurrentView(h as View);
        window.scrollTo(0,0);
      }
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

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
        <img 
        src={language === 'ca' ? IMAGES.logo_ca : IMAGES.logo} 
        alt="Roure Logo" 
        className="w-full h-auto object-contain" 
        />
    </button>
  );

  // Footer Component
  const Footer = ({ compact = false }: { compact?: boolean }) => (
    <div className={`w-full flex justify-center ${compact ? 'pb-6 pt-2' : 'pb-8 pt-12'}`}>
      <div className="flex flex-col items-center">
        
        {/* Email */}
        <a 
          href="mailto:experienciaroure@proton.me" 
          className={`font-serif ${compact ? 'text-base' : 'text-lg'} text-stone-600 ${hoverBrandColor} transition-colors block text-center mb-2`}
        >
          experienciaroure@proton.me
        </a>

        {/* Language Switcher */}
        <div className={`flex items-center justify-between text-sm font-bold uppercase text-stone-400 font-serif ${compact ? 'mt-0' : 'mt-1'}`} style={{ width: '100%', maxWidth: '100%', letterSpacing: '0.4em' }}>
          <button 
            onClick={() => setLanguage('es')}
            className={`${language === 'es' ? 'text-stone-800 border-b-2 border-[#c1562e]' : 'text-stone-400 hover:text-stone-600'} transition-colors pb-0.5`}
            style={{ marginRight: '-0.4em' }}
          >
            castellano
          </button>
          <span className="text-stone-300">|</span>
          <button 
            onClick={() => setLanguage('ca')}
            className={`${language === 'ca' ? 'text-stone-800 border-b-2 border-[#c1562e]' : 'text-stone-400 hover:text-stone-600'} transition-colors pb-0.5`}
            style={{ marginLeft: '-0.4em' }}
          >
            català
          </button>
        </div>

        {/* Credits */}
        <div className={`flex items-center justify-between ${compact ? 'text-base' : 'text-lg'} text-stone-400 mt-2 font-serif`} style={{ width: '100%', maxWidth: '100%' }}>
          <span>{t.home.footer}</span>
          <a href="https://rcrear.com" className={`hover:text-stone-600 transition-colors font-semibold`}>rcrear.com</a>
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
    // update hash (this also allows back/forward navigation)
    try {
      window.location.hash = view;
    } catch (e) {
      // fallback
      setCurrentView(view);
    }
    // immediate UI update
    setCurrentView(view);
    window.scrollTo(0,0);
  };

  const handleNav = (view: View) => navigateTo(view);

  // --- Views ---

  const HomeView = () => {
    const menuItems = [
        { key: 'historia', label: t.nav.historia },
        { key: 'fundamentos', label: t.nav.fundamentos },
        { key: 'escuela', label: t.nav.escuela },
        { key: 'videos', label: t.nav.videos },
        { key: 'textos', label: t.nav.textos },
        { key: 'comunidad', label: t.nav.comunidad },
        { key: 'en_que_estamos', label: t.nav.en_que_estamos },
      ];

    return (
      // Changed h-screen to min-h-screen and overflow-hidden only on md+ to allow scrolling on mobile
      <div className="w-full min-h-screen md:h-screen flex flex-col relative overflow-x-hidden md:overflow-hidden">
        {/* Logo Header Area - Centered at top */}
        <div style={{ paddingTop: 'var(--padding-top)', paddingLeft: 'var(--padding-x)', paddingRight: 'var(--padding-x)' }} className="w-full flex flex-col justify-center items-center z-20 -translate-x-2">
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
        <div style={{ paddingLeft: 'var(--padding-x)', paddingRight: 'var(--padding-x)', paddingTop: 'var(--padding-y)', paddingBottom: 'var(--padding-y)' }} className="flex-1 flex items-center justify-center w-full">
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

                {/* Center: Image */}
                <div className="order-1 md:order-2 shrink-0 relative z-10">
                    <div style={{ width: 'var(--main-image-size)', height: 'var(--main-image-size)' }} className="rounded-full overflow-hidden relative group">
                    <img 
                        src={IMAGES.homeMain} 
                        alt="Escuela Roure" 
                        className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-all duration-1000"
                    />
                    </div>
                </div>

                {/* Right: Menu */}
                <div className="w-full md:w-1/3 order-3 px-4 md:px-0 text-center md:text-left flex flex-col items-center md:items-start pb-8 md:pb-0">
                    <nav 
                        onMouseEnter={() => setMenuHasInteracted(true)}
                        onMouseLeave={() => setHoveredMenuKey(null)}
                    >
                    <ul style={{ gap: 'var(--menu-spacing)' }} className="flex flex-col">
                        {menuItems.map((item) => {
                        // Logic: Highlight if hovered OR (if not interacted yet AND key is historia)
                        const isHighlighted = hoveredMenuKey === item.key || (!menuHasInteracted && hoveredMenuKey === null && item.key === 'historia');
                        
                        return (
                            <li key={item.key}>
                            <button 
                                onClick={() => handleNav(item.key as View)}
                                onMouseEnter={() => setHoveredMenuKey(item.key)}
                                style={{ fontSize: 'var(--menu-text-size)' }}
                                className={`font-serif font-medium transition-colors duration-300 block relative group text-left
                                ${isHighlighted ? 'text-[#c1562e]' : 'text-stone-600'}
                                `}
                            >
                                {item.label}
                                <span className={`absolute left-0 -bottom-1 h-[1px] bg-[#c1562e] transition-all duration-300 ${isHighlighted ? 'w-full' : 'w-0'}`}></span>
                            </button>
                            </li>
                        )
                        })}
                    </ul>
                    </nav>
                </div>
            </div>
        </div>

        {/* Footer inside Home for perfect spacing */}
        <div className="mt-1 mb-2" style={{ transform: 'scale(0.75)', transformOrigin: 'center top' }}>
          <Footer compact={false} />
        </div>
      </div>
    );
  };

  const InternalPageLayout = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div style={{ paddingLeft: 'var(--padding-x)', paddingRight: 'var(--padding-x)' }} className="w-full min-h-screen flex flex-col pt-32 xl:pt-36 2xl:pt-40 pb-20 xl:pb-24 2xl:pb-28 max-w-6xl xl:max-w-7xl 2xl:max-w-6xl mx-auto">
      {/* Sticky Header Area for Internal Pages */}
      <div style={{ paddingLeft: 'var(--padding-x)', paddingRight: 'var(--padding-x)' }} className="fixed top-0 left-0 w-full bg-[#f7f5e6]/90 backdrop-blur-sm z-40 py-4 xl:py-5 2xl:py-6 border-b border-stone-200/50">
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

      <h1 className="font-serif font-bold text-stone-800 mb-12 xl:mb-14 2xl:mb-16 mt-8 xl:mt-10 2xl:mt-12 border-b border-stone-300 pb-6 xl:pb-7 2xl:pb-8 text-2xl xl:text-2xl 2xl:text-3xl">
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
  const ImageCarousel = ({ images, autoPlayInterval = 2000 }: { images: string[], autoPlayInterval?: number }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
      if (!isPlaying) return;
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }, [isPlaying, images.length, autoPlayInterval]);

    const goToPrevious = () => {
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      // Don't resume playing when using arrows
    };

    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      // Don't resume playing when using arrows
    };

    return (
      <div className="relative bg-stone-200 rounded-lg overflow-hidden shadow-lg group">
        <img 
          src={images[currentIndex]} 
          alt={`Slide ${currentIndex + 1}`} 
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-stone-800/50 hover:bg-stone-800/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-stone-800/50 hover:bg-stone-800/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft size={20} className="rotate-180" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-2 right-2 bg-stone-800/50 hover:bg-stone-800/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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

        {/* Image Counter */}
        <div className="absolute bottom-2 left-2 bg-stone-800/50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    );
  };

  const HistoriaView = ({ title, contentData }: { title: string, contentData: ContentSection[] }) => {
    // Split the 17 images into two carousels: 9 + 8
    const carousel1Images = IMAGES.historiaPhotos.slice(0, 9);
    const carousel2Images = IMAGES.historiaPhotos.slice(9, 17);

    return (
      <InternalPageLayout title={title}>
        <div style={{ gap: 'var(--gap-base)' }} className="flex flex-col md:flex-row items-start">
          <div style={{ fontSize: 'var(--internal-body-text)' }} className="w-full md:w-1/2 font-serif leading-relaxed text-stone-700 space-y-8 xl:space-y-9 2xl:space-y-10 mb-12 md:mb-0">
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
          <div className="w-full md:w-1/2 flex flex-col">
             {/* First Carousel */}
             <div style={{ width: 'var(--main-image-size)', height: 'calc(var(--main-image-size) * 1.33)' }} className="mx-auto flex-shrink-0 md:sticky md:top-32 xl:top-36 2xl:top-40">
               <ImageCarousel images={carousel1Images} autoPlayInterval={3000} />
             </div>
             {/* Second Carousel - positioned much lower */}
             <div style={{ width: 'var(--main-image-size)', height: 'calc(var(--main-image-size) * 1.33)' }} className="mx-auto flex-shrink-0 mt-8 md:mt-[350px] xl:mt-[420px] 2xl:mt-[490px]">
               <ImageCarousel images={carousel2Images} autoPlayInterval={3000} />
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
             <img 
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
    
    // Get content from state based on current section
    const activeContent = t.escuelaContent?.[escuelaSection] || ["Contenido no disponible."];

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
          <div className="w-full md:w-3/4 min-h-[500px]">
            <h2 style={{ fontSize: 'var(--menu-text-size)' }} className="font-serif mb-8 xl:mb-10 2xl:mb-12 text-stone-800">{t.escuela.titles[escuelaSection]}</h2>
            
            <div style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif leading-relaxed text-stone-700 space-y-6 xl:space-y-7 2xl:space-y-8 max-w-prose xl:max-w-full">
               <img 
                 src={IMAGES.escuela[escuelaSection]} 
                 style={{ width: 'var(--main-image-size)', height: 'calc(var(--main-image-size) * 0.7)' }}
                 className="object-cover rounded-lg mb-6 xl:mb-7 2xl:mb-8 shadow-md mx-auto"
                 alt={t.escuela.menu[escuelaSection]} 
               />
               
               {/* Render Paragraphs with first one Bold */}
               {activeContent.map((text, idx) => (
                   <p key={idx} className={idx === 0 ? "font-bold" : ""}>
                       {text}
                   </p>
               ))}
            </div>
          </div>
        </div>
      </InternalPageLayout>
    );
  };

  const VideosView = () => {
    // Fallback to empty array if undefined to prevent crashes
    const videos: VideoItem[] = t.videosList || [];

    return (
      <InternalPageLayout title={t.nav.videos}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 xl:gap-14 2xl:gap-16">
          {videos.map((video, i) => (
            <div key={i} className="flex flex-col gap-3 xl:gap-3 2xl:gap-4 group cursor-pointer" onClick={() => { if(video.link && video.link !== '#' && !video.embedId) window.open(video.link, '_blank') }}>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative flex items-center justify-center shadow-lg">
                {video.type === 'vimeo' && video.embedId ? (
                    <iframe 
                      src={`https://player.vimeo.com/video/${video.embedId}?title=0&byline=0&portrait=0`} 
                      className="w-full h-full z-20" 
                      frameBorder="0" 
                      allow="autoplay; fullscreen; picture-in-picture" 
                      allowFullScreen
                      title={video.title}
                    ></iframe>
                ) : video.type === 'youtube' && video.embedId ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${video.embedId}`}
                        className="w-full h-full z-20"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video.title}
                    ></iframe>
                ) : video.type === 'spotify' && video.embedId ? (
                    <iframe 
                        style={{borderRadius: '12px'}} 
                        src={`https://open.spotify.com/embed/episode/${video.embedId}?utm_source=generator&theme=0`} 
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        allowFullScreen 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy"
                        className="z-20 p-2 bg-black/10"
                        title={video.title}
                    ></iframe>
                ) : (
                    <>
                      <div className="absolute inset-0 opacity-60 bg-cover bg-center" style={{ backgroundImage: `url(${IMAGES.videoPlaceholder})` }}></div>
                      <Play className="text-white w-16 h-16 relative z-10 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" fill="currentColor" />
                    </>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif font-bold text-stone-800 mt-2 xl:mt-2 2xl:mt-3 group-hover:text-[#c1562e] transition-colors">{video.title}</h3>
                <p style={{ fontSize: 'calc(var(--internal-body-text) * 0.9)' }} className="font-serif text-stone-600 mt-1 xl:mt-1 2xl:mt-2 leading-relaxed">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </InternalPageLayout>
    );
  };

  const TextosView = () => {
    // All articles data structure
    const allArticles: Article[] = t.articles;

    const topics = Array.from(new Set(allArticles.map(a => a.topic)));
    const [activeTopic, setActiveTopic] = useState<string | null>(null);

    const filteredArticles = activeTopic 
        ? allArticles.filter(a => a.topic === activeTopic)
        : allArticles;

    return (
      <InternalPageLayout title={t.nav.textos}>
        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 xl:gap-3 2xl:gap-4 mb-10 xl:mb-12 2xl:mb-14">
            <button 
                onClick={() => setActiveTopic(null)}
                className={`px-4 xl:px-5 2xl:px-6 py-2 xl:py-2 2xl:py-3 rounded-full text-sm md:text-base xl:text-base 2xl:text-lg font-serif font-medium border transition-all
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
          {filteredArticles.map((article, idx) => (
            <div key={idx} className="bg-white p-6 xl:p-7 2xl:p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-4 xl:mb-4 2xl:mb-5">
                 <Tag size={16} className="text-stone-400 mt-1 xl:w-4 xl:h-4 2xl:w-5 2xl:h-5" />
                 <span className="text-xs md:text-sm xl:text-sm 2xl:text-base font-bold text-[#c1562e] bg-[#c1562e]/10 px-2 xl:px-2.5 2xl:px-3 py-1 xl:py-1 2xl:py-1.5 rounded">{article.topic}</span>
              </div>
                <h3 style={{ fontSize: 'var(--internal-body-text)' }} className="font-serif font-bold text-stone-800 mb-2 xl:mb-2 2xl:mb-3 group-hover:text-[#c1562e] transition-colors leading-tight">
                  {article.title}
                </h3>
                <p style={{ fontSize: 'calc(var(--internal-body-text) * 0.85)' }} className="text-stone-500 mb-2 xl:mb-2 2xl:mb-3 font-serif italic">{language === 'es' ? 'Equipo El Roure' : 'Equip El Roure'}</p>
                      <div className="flex items-center gap-2 mt-4 xl:mt-4 2xl:mt-5 text-sm md:text-base xl:text-base 2xl:text-lg text-stone-500">
                        <FileText size={16} />
                        {article.file ? (
                          <a
                            href={article.file}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            PDF • {language === 'es' ? 'Descargar' : 'Descarregar'}
                          </a>
                        ) : (
                          <span className="opacity-70">
                            PDF • {language === 'es' ? 'Próximamente' : 'Proximament'}
                          </span>
                        )}
                      </div>
            </div>
          ))}
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
                             <img 
                                src={IMAGES.people[index] || IMAGES.homeMain} 
                                alt={person.name} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                        <h3 style={{ fontSize: 'var(--menu-text-size)' }} className="font-serif font-bold text-stone-800 mb-6 xl:mb-8 2xl:mb-10 border-l-4 xl:border-l-6 2xl:border-l-8 border-[#c1562e] pl-4 xl:pl-6 2xl:pl-8">
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
    <div className="min-h-screen w-full text-stone-800 font-sans overflow-x-hidden selection:bg-[#c1562e] selection:text-white">
      
      {/* Render View Based on State */}
      {currentView === 'home' && <HomeView />}
      {currentView === 'historia' && <HistoriaView title={t.nav.historia} contentData={t.historiaContent} />}
      {currentView === 'fundamentos' && <StructuredTextView title={t.nav.fundamentos} contentData={t.fundamentosContent} imageSrc={IMAGES.sections.fundamentos} />}
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
  );
};

export default App;
