
import React, { useState, useEffect } from 'react';
import { ArrowUp, ChevronLeft, FileText, Play, Tag, Mic } from 'lucide-react';

// --- Types & Content ---

type Language = 'es' | 'ca';
type View = 'home' | 'historia' | 'fundamentos' | 'escuela' | 'videos' | 'textos' | 'comunidad' | 'en_que_estamos';
type EscuelaSection = 'intro' | 'aprendizaje' | 'acompanamiento' | 'equipo' | 'familias' | 'etapas' | '3-6' | '6-12' | '12-16';

// --- IMAGE CONFIGURATION ---
// TO SWAP IMAGES: Upload your images to an 'assets' or 'images' folder in your project
// and replace the URLs below with your local paths (e.g., "./assets/logo.png").
const IMAGES = {
  logo: "./images/logo_roure.png",
  homeMain: "./images/home_main.png",
  sections: {
    historia: "https://picsum.photos/seed/history/800/1000",
    fundamentos: "https://picsum.photos/seed/foundations/800/1000",
  },
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
    "./images/bego.webp", // Begoña
    "./images/paco.webp", // Paco
    "./images/clara.webp", // Clara
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
    date: string;
}

interface VideoItem {
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
      videos: 'Videos',
      textos: 'Textos',
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
      videos: 'Galería de Videos',
      textos: 'Textos y Artículos',
      comunidad: 'Comunidad Roure',
      en_que_estamos: '¿En qué estamos?'
    },
    historiaContent: [
        {
            paragraphs: ["La escuela El Roure nació en 2001 en una finca rústica del municipio de Mediona (Barcelona). La fundamos Begoña González y Cristóbal Gutiérrez, como un paso más en la evolución de la experiencia en La Casita, que fundamos en 1996, en Barcelona."]
        },
        {
            title: "Naturaleza - Ubicación de la escuela",
            paragraphs: [
                "La llamamos escuela viva El Roure. Sus raíces son la experiencia de crianza, el Seitai y la Sistémica y algunas inspiraciones de pedagogías innovadoras del s. XX (Montessori, Freinet, Neill, Malaguzzi, etc.). La línea pedagógica se fue concretando y desarrollando a través de la práctica cotidiana con los niños y niñas, con las madres y padres, en la relación de equipo. A partir de muchas preguntas, la observación y la reflexión, algunos criterios se fueron clarificando y confirmando.",
                "El apoyo, la confianza y la implicación de las primeras familias y miembros del equipo fueron decisivos."
            ]
        },
        {
            title: "Comunidad - Crecimiento conjunto",
            paragraphs: [
                "La semilla de El Roure encontró las condiciones más favorables para germinar y crecer. Una persona cercana hizo de mecenas ofreciéndose a comprar la preciosa finca que elegimos para ubicar el proyecto. Empezamos con 6 criaturas que venían desde Barcelona y se quedaban a dormir en la masía tres días a la semana. Poco a poco el grupo fue creciendo y las familias participantes realizaron todo un cambio de vida trasladándose a la zona.",
                "Fue una época de trabajo exhaustivo, tanto en la reforma y adecuación del espacio y en la preparación de materiales educativos como en la reflexión y evolución de la metodología, la organización y la explicación de la línea educativa que estábamos creando.",
                "Como todo comienzo, se vivió en un ambiente de ilusión y de implicación muy intenso entre el equipo, familias, amigos y profesionales que colaboraban de forma desinteresada. Compartimos sudor entre cemento, escombros y pintura, horas de cocina, tertulias pedagógicas, sueños, incertidumbres y mucha confianza."
            ]
        },
        {
            title: "Educación innovadora",
            paragraphs: [
                "En 2009 pasamos de asociación a cooperativa de trabajo sin ánimo de lucro: Experiencia educativa El Roure SCCL.",
                "En aquel momento también ampliamos nuestra presencia en el panorama educativo, compartiendo con más frecuencia nuestra experiencia a través de charlas, artículos en publicaciones educativas, colaboraciones en formaciones, y además empezamos a ofrecer nuestras propias formacions y acompañamientos a familias y profesionales.",
                "La escuela creció hasta llegar a acoger 90 niñas, niños y adolescentes. Siempre tuvimos vocación de escuela pequeña, para poder hacer el trabajo con la profundidad que queríamos y esta dimensión se convirtió en el límite."
            ]
        },
        {
            title: "Ambiente educativo cálido",
            paragraphs: [
                "En 2017, después de un enorme esfuerzo económico y organizativo por parte de toda la comunidad (que incluyó un micromecenazgo impulsado por las familias), conseguimos la autorización como escuela de primaria, por parte del Departament d’Educació de la Generalitat de Catalunya.",
                "Después del confinamiento por el coronavirus de 2020, la escuela fue decreciendo. El mundo era otro al de los inicios; las familias tendían más a la escolarización pública gratuita y cercana a su vivienda, las escuelas públicas habían ido poco a poco abriéndose hacia la creación de ambientes con materiales manipulatius, etc.",
                "A raíz de serias dificultades en la finca, la disminución del número de familias y la falta de relevo en la coordinación de la escuela, decidimos el cierre."
            ]
        }
    ],
    fundamentosContent: [
        {
            paragraphs: [
                "La educación viva se basa en el respeto profundo a los procesos de vida de cada ser humano. Entendemos que el aprendizaje es un proceso intrínseco y natural que no necesita ser forzado, sino acompañado.",
                "Nuestros fundamentos se nutren de diversas fuentes pedagógicas y psicológicas, integrando una mirada sistémica que contempla al niño o niña no como un ser aislado, sino como parte de un sistema familiar y social complejo.",
                "Creemos en la autorregulación, en el juego espontáneo como motor de desarrollo y en la importancia de un entorno preparado que ofrezca seguridad, vínculo y riqueza de estímulos sin sobreestimular."
            ]
        }
    ],
    people: [
        {
            name: "Begoña González",
            paragraphs: [
                "He sido cofundadora, coordinadora y acompañante de La Casita y El Roure. Soy madre, maestra, formadora, orientadora y articulista; me he formado en diferentes disciplines corporales, artísticas, psicológicas y educativas, en Comunicación consciente (CNV) i en facilitación de grupos.",
                "En este momento me dedico al acompañamiento a madres, padres y profesionales, a partir de las diferentes situaciones y dificultats cotidianas que comporta la relación con niñas, niños y adolescentes. Por otro lado, facilito formaciones adaptadas a las necesidades de colectivos educativos interesados en el enfoque de la educación viva y la comunicación consciente.",
                "Puedes contactar conmigo al 645 611 824 o a begogm62@gmail.com"
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
        "Para pedir tu contraseña necesitas contactar por email (experienciaroure@proton.me) identificándote."
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
        { title: "Amigos y amigas por carta", topic: "Escritura", date: "" },
        { title: "Celebrando el milagro de la vida", topic: "Aprendizaje", date: "" },
        { title: "Cines, bebés y sensibilidad", topic: "Aprendizaje", date: "" },
        { title: "Cosas que pasan", topic: "Eventualidades", date: "" },
        { title: "Cris se va (2007)", topic: "Eventualidades", date: "" },
        { title: "Cristóbal trajo el Seitai a El Roure", topic: "Aprendizaje", date: "" },
        { title: "Despedida", topic: "Eventualidades", date: "" },
        { title: "Despiértate papá y mamá", topic: "Aprendizaje", date: "" },
        { title: "Divídete y sufrirás", topic: "Aprendizaje", date: "" },
        { title: "Dues experiències de restauració", topic: "Eventualidades", date: "" },
        { title: "El consumismo que enturbia el alma", topic: "Aprendizaje", date: "" },
        { title: "El Roure Boletín 13 (Móvil)", topic: "Eventualidades", date: "" },
        { title: "El Roure Boletín 13 (PC)", topic: "Eventualidades", date: "" },
        { title: "En busca de una feminidad y masculinidad naturales", topic: "Género", date: "" },
        { title: "Escritor Roures", topic: "Escritura", date: "" },
        { title: "Escrito a mano", topic: "Escritura", date: "" },
        { title: "¿Estamos o no haciendo matemáticas?", topic: "Matemáticas", date: "" },
        { title: "Feminidad y masculinidad", topic: "Género", date: "" },
        { title: "Habitar el espacio y el tiempo en la escuela alternativa", topic: "Aprendizaje", date: "" },
        { title: "Hora de marcharme de El Roure", topic: "Eventualidades", date: "" },
        { title: "In Memoriam", topic: "Eventualidades", date: "" },
        { title: "La mirada amorosa", topic: "Aprendizaje", date: "" },
        { title: "La muerte de cada día", topic: "Eventualidades", date: "" },
        { title: "Límites y limitaciones", topic: "Límites", date: "" },
        { title: "Que la vida sea el eje de la educación", topic: "Aprendizaje", date: "" },
        { title: "Que ser valiente no salga tan caro", topic: "Aprendizaje", date: "" },
        { title: "Taller d'Andromines", topic: "Eventualidades", date: "" },
        { title: "Un bañador con bolsillos", topic: "Eventualidades", date: "" },
        { title: "Una pedagogía de la relación", topic: "Aprendizaje", date: "" },
    ]
  },
  ca: {
    nav: {
      historia: 'Història',
      fundamentos: 'Fonaments',
      escuela: 'Escola',
      videos: 'Vídeos',
      textos: 'Textos',
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
      videos: 'Galeria de Vídeos',
      textos: 'Textos i Articles',
      comunidad: 'Comunitat Roure',
      en_que_estamos: 'En què estem ara?'
    },
    historiaContent: [
        {
            paragraphs: ["L'escola El Roure va néixer el 2001 en una finca rústica del municipi de Mediona (Barcelona). La vam fundar Begoña González i Cristóbal Gutiérrez, com un pas més en l'evolució de l'experiència a La Casita, que vam fundar el 1996, a Barcelona."]
        },
        {
            title: "Natura - Ubicació de l'escola",
            paragraphs: [
                "L'anomenem escola viva El Roure. Les seves arrels són l'experiència de criança, el Seitai i la Sistèmica i algunes inspiracions de pedagogies innovadores del s. XX (Montessori, Freinet, Neill, Malaguzzi, etc.). La línia pedagògica es va anar concretant i desenvolupant a través de la pràctica quotidiana amb els nens i nenes, amb les mares i pares, en la relació d'equip. A partir de moltes preguntes, l'observació i la reflexió, alguns criteris es van anar clarificant i confirmant. El procés de descobriment i aprenentatge ha seguit fins al final.",
                "El suport, la confiança i la implicació de les primeres famílies i membres de l'equip van ser decisius."
            ]
        },
        {
            title: "Comunitat - Creixement conjunt",
            paragraphs: [
                "La llavor d'El Roure va trobar les condicions més favorables per germinar i créixer. Una persona propera va fer de mecenas oferint-se a comprar la preciosa finca que vam triar per ubicar el projecte. Vam començar amb 6 criatures que venien des de Barcelona i es quedaven a dormir a la masia tres días a la setmana. A poc a poc el grup va anar creixent i les famílies participants van realitzar tot un canvi de vida traslladant-se a la zona. Aquestes primeres famílies es van entregar en cos i ànima a la reforma de les edificacions i van implicar familiars i amics.",
                "Va ser una època de treball exhaust, tant en la reforma i adequació de l'espai i en la preparació de materials educatius com en la reflexió i evolució de la metodologia, l'organització i l'explicació de la línia educativa que estàvem creant.",
                "Com tot començament, es va viure en un ambient d'il·lusió i d'implicació molt intens entre l'equip, famílies, amics i professionals que col·laboraven de forma desinteressada. Vam compartir suor entre ciment, runa i pintura, hores de cuina, tertulias pedagògiques en sobretaules de grup, somnis, incerteses i molta confiança. Van ser temps de mancances econòmiques i dificultats constants, en les que no existien les vacances…y nos empujaba una força immensa."
            ]
        },
        {
            title: "Educació innovadora",
            paragraphs: [
                "El 2009 vam passar d'associació a cooperativa de treball sense ànim de lucre: Experiència educativa El Roure SCCL.",
                "En aquell moment també vam ampliar la nostra presència en el panorama educatiu, compartint amb més freqüència la nostra experiència a través de xerrades, articles en publicacions educatives, col·laboracions en formacions, i a més vam començar a oferir les nostres pròpies formacions i acompanyaments a famílies i professionals.",
                "L'escola va créixer fins a arribar a acollir 90 nenes, nens i adolescents. Sempre vam tenir vocació d'escola petita, per poder fer la feina amb la profunditat que volíem i aquesta dimensió es va convertir en el límit."
            ]
        },
        {
            title: "Ambient educatiu càlid",
            paragraphs: [
                "El 2017, després d'un enorme esforç econòmic i organitzatiu per part de tota la comunitat (que va incloure un micromecenatge impulsat per les famílies), vam aconseguir l'autorització com a escola de primària, per part del Departament d’Educació de la Generalitat de Catalunya.",
                "Després del confinament pel coronavirus del 2020, l'escola va anar decreixent. El món era un altre al dels inicis; les famílies tendien més a l'escolarització pública gratuïta i propera al seu habitatge, les escoles públiques havien anat de mica en mica obrint-se cap a la creació d'ambients amb materials manipulatius i l'anomenada “lliure circulació”, etc.",
                "Arran de serioses dificultats a la finca, la disminució del nombre de famílies i la manca de relleu en la coordinació de l'escola, la manca de relleu en la coordinació de l'escola, vam decidir el tancament."
            ]
        }
    ],
    fundamentosContent: [
        {
            paragraphs: [
                "L'educació viva es basa en el respecte profund als processos de vida de cada ésser humà. Entenem que l'aprenentatge és un procés intrínsec i natural que no necessita ser forçat, sinó acompanyat.",
                "Els nostres fonaments es nodreixen de diverses fonts pedagògiques i psicològiques, integrant una mirada sistèmica que contempla el nen o nena no com un ésser aïllat, sinó com a part d'un sistema familiar i social complex.",
                "Creiem en l'autoregulació, en el joc espontani com a motor de desenvolupament i en la importància d'un entorn preparat que ofereixi seguretat, vincle i riquesa d'estímuls sense sobreestimular."
            ]
        }
    ],
    people: [
        {
            name: "Begoña González",
            paragraphs: [
                "He estat co-fundadora, coordinadora i acompanyant de La Casita i El Roure. Sóc mare, mestra, formadora, orientadora i articulista; m'he format en diferents disciplines corporals, artísticas, psicològiques i educatives, en Comunicació conscient (CNV) i en facilitació de grups.",
                "En aquest moment em dedico a l'acompanyament a mares, pares i professionals, a partir de les diferents situacions i dificultats quotidianes que comporta la relació amb nenes, nens i adolescents. D'altra banda, facilito formacions adaptadas a les necessitats de col·lectius educatius interessats en l'enfocament de l'educació viva i la comunicació conscient. Estic participant en un projecte de llibre juntament amb les persones fundadores d'Ojo de Agua (Alacant), A la Vida (Madrid) i Donyets (València).",
                "Pots contactar amb mi al 645 611 824 o a begogm62@gmail.com"
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
                "He estat vinculada professionalment a l'Escola Viva El Roble des del 2011 fins al seu tancament com a acompanyant, coordinadora i directora. La meva formació bàsica és Educació Social i la meva formació complementària és Intervenció Sistèmica amb infància i família, Pedagogía Sistèmica i Postgrau en Pràctica Psicomotriu Aucouturier, entre d'altres de caire més relacionat amb el moviment lliure i la permacultura.",
                "Actualment, em dedico a acabar la formació de Teràpia en Integració Psico-corporal. Al mateix temps, acompanyo famílies que tenen ganes d'indagar i generar un creixement personal-familiar i/o troben dificultats en la seva dinàmica relacional.",
                "Em pots contactar a: clarajiro@gmail.com o al 670 204 009"
            ]
        }
    ],
    comunidadText: [
        "Per demanar la teva contrasenya has de contactar per correu electrònic (experienciaroure@proton.me) identificant-te."
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
        { title: "Amigos y amigas por carta", topic: "Escriptura", date: "" },
        { title: "Celebrando el milagro de la vida", topic: "Aprenentatge", date: "" },
        { title: "Cines, bebés y sensibilidad", topic: "Aprenentatge", date: "" },
        { title: "Cosas que pasan", topic: "Eventualitats", date: "" },
        { title: "Cris se va (2007)", topic: "Eventualitats", date: "" },
        { title: "Cristóbal trajo el Seitai a El Roure", topic: "Aprenentatge", date: "" },
        { title: "Despedida", topic: "Eventualitats", date: "" },
        { title: "Despiértate papá y mamá", topic: "Aprenentatge", date: "" },
        { title: "Divídete y sufrirás", topic: "Aprenentatge", date: "" },
        { title: "Dues experiències de restauració", topic: "Eventualitats", date: "" },
        { title: "El consumismo que enturbia el alma", topic: "Aprenentatge", date: "" },
        { title: "El Roure Boletín 13 (Móvil)", topic: "Eventualitats", date: "" },
        { title: "El Roure Boletín 13 (PC)", topic: "Eventualitats", date: "" },
        { title: "En busca de una feminidad y masculinidad naturales", topic: "Gènere", date: "" },
        { title: "Escritor Roures", topic: "Escriptura", date: "" },
        { title: "Escrito a mano", topic: "Escriptura", date: "" },
        { title: "¿Estamos o no haciendo matemáticas?", topic: "Matemàtiques", date: "" },
        { title: "Feminidad y masculinidad", topic: "Gènere", date: "" },
        { title: "Habitar el espacio y el tiempo en la escuela alternativa", topic: "Aprenentatge", date: "" },
        { title: "Hora de marcharme de El Roure", topic: "Eventualitats", date: "" },
        { title: "In Memoriam", topic: "Eventualitats", date: "" },
        { title: "La mirada amorosa", topic: "Aprenentatge", date: "" },
        { title: "La muerte de cada día", topic: "Eventualitats", date: "" },
        { title: "Límites y limitaciones", topic: "Límits", date: "" },
        { title: "Que la vida sea el eje de la educación", topic: "Aprenentatge", date: "" },
        { title: "Que ser valiente no salga tan caro", topic: "Aprenentatge", date: "" },
        { title: "Taller d'Andromines", topic: "Eventualitats", date: "" },
        { title: "Un bañador con bolsillos", topic: "Eventualitats", date: "" },
        { title: "Una pedagogía de la relación", topic: "Aprenentatge", date: "" },
    ]
  }
};

// --- Components ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [language, setLanguage] = useState<Language>('es');
  const [escuelaSection, setEscuelaSection] = useState<EscuelaSection>('intro');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // State for Menu Interaction
  const [menuHasInteracted, setMenuHasInteracted] = useState(false);
  const [hoveredMenuKey, setHoveredMenuKey] = useState<string | null>(null);

  const brandColor = "text-[#c1562e]";
  const hoverBrandColor = "hover:text-[#c1562e]";
  const t = content[language];

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      setShowScrollTop(scrollPercentage > 0.2);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Common Logo for header - Clickable
  const LogoImg = ({ className }: { className?: string }) => (
    <button 
        onClick={() => setCurrentView('home')}
        className={`block hover:opacity-80 transition-opacity focus:outline-none ${className}`}
        aria-label="Go to Home"
    >
        <img 
        src={IMAGES.logo} 
        alt="Roure Logo" 
        className="w-full h-auto object-contain" 
        />
    </button>
  );

  // Footer Component
  const Footer = ({ compact = false }: { compact?: boolean }) => (
    <div className={`w-full flex justify-center ${compact ? 'pb-6 pt-2' : 'pb-8 pt-12'}`}>
      <div className="flex flex-col items-center w-max max-w-full">
        
        {/* Email */}
        <a 
          href="mailto:experienciaroure@proton.me" 
          className={`font-serif ${compact ? 'text-base' : 'text-lg'} text-stone-600 ${hoverBrandColor} transition-colors block text-center w-full mb-2`}
        >
          experienciaroure@proton.me
        </a>

        {/* Language Switcher */}
        <div className={`flex items-center justify-between w-full gap-6 text-sm font-bold uppercase tracking-widest text-stone-400 ${compact ? 'mt-0' : 'mt-1'}`}>
          <button 
            onClick={() => setLanguage('es')}
            className={`${language === 'es' ? 'text-stone-800 border-b-2 border-[#c1562e]' : 'text-stone-400 hover:text-stone-600'} transition-colors pb-0.5`}
          >
            castellano
          </button>
          <span className="text-stone-300">|</span>
          <button 
            onClick={() => setLanguage('ca')}
            className={`${language === 'ca' ? 'text-stone-800 border-b-2 border-[#c1562e]' : 'text-stone-400 hover:text-stone-600'} transition-colors pb-0.5`}
          >
            català
          </button>
        </div>

        {/* Credits */}
        <div className="flex items-center justify-between w-full text-[11px] tracking-widest text-stone-400 pt-2">
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
  const handleNav = (view: View) => {
    window.scrollTo(0,0);
    setCurrentView(view);
  };

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
      <div className="w-full min-h-screen md:h-screen flex flex-col relative overflow-x-hidden md:overflow-hidden bg-[#f7f5e6]">
        {/* Logo Header Area */}
        <div className="absolute top-6 md:top-8 left-0 w-full flex justify-center z-20 pointer-events-none px-4">
             <div className="relative pointer-events-auto">
                <div className="w-32 md:w-48 shrink-0 relative flex items-center justify-center">
                  <LogoImg />
                  
                  {/* Phrases to the sides of the logo using absolute positioning relative to the centered logo container */}
                  <span className="hidden md:block absolute right-[100%] top-1/2 -translate-y-1/2 mr-6 font-serif text-[#c1562e] text-lg lg:text-xl italic tracking-wide whitespace-nowrap">
                    {t.header?.left}
                  </span>

                  <span className="hidden md:block absolute left-[100%] top-1/2 -translate-y-1/2 ml-6 font-serif text-[#c1562e] text-lg lg:text-xl italic tracking-wide whitespace-nowrap">
                    {t.header?.right}
                  </span>
                </div>
             </div>
        </div>

        {/* Main Content - Flex Centered */}
        <div className="flex-1 flex items-center justify-center w-full px-6 md:px-12 mt-20 md:mt-12 mb-0 py-8 md:py-0">
            <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[90rem] gap-8 md:gap-12 lg:gap-16">
            
                {/* Left: Text */}
                <div className="w-full md:w-1/3 order-2 md:order-1 px-4 md:px-0 text-center md:text-right flex flex-col items-center md:items-end">
                    <div className="max-w-lg space-y-3 font-serif text-stone-700 text-sm md:text-lg leading-relaxed">
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
                    <div className="w-48 h-48 md:w-[24rem] md:h-[24rem] lg:w-[28rem] lg:h-[28rem] xl:w-[30rem] xl:h-[30rem] rounded-full overflow-hidden relative group">
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
                    <ul className="space-y-2 md:space-y-3 lg:space-y-4">
                        {menuItems.map((item) => {
                        // Logic: Highlight if hovered OR (if not interacted yet AND key is historia)
                        const isHighlighted = hoveredMenuKey === item.key || (!menuHasInteracted && hoveredMenuKey === null && item.key === 'historia');
                        
                        return (
                            <li key={item.key}>
                            <button 
                                onClick={() => handleNav(item.key as View)}
                                onMouseEnter={() => setHoveredMenuKey(item.key)}
                                className={`text-lg md:text-xl lg:text-2xl font-serif font-medium transition-colors duration-300 block relative group text-left
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
        <Footer compact={true} />
      </div>
    );
  };

  const InternalPageLayout = ({ title, children }: { title: string, children?: React.ReactNode }) => (
    <div className="w-full min-h-screen flex flex-col pt-32 pb-20 px-6 md:px-12 max-w-6xl mx-auto">
      {/* Sticky Header Area for Internal Pages */}
      <div className="fixed top-0 left-0 w-full bg-[#f7f5e6]/90 backdrop-blur-sm z-40 py-4 px-6 border-b border-stone-200/50">
         <div className="max-w-6xl mx-auto flex justify-between items-center">
            <button 
              onClick={() => setCurrentView('home')}
              className={`flex items-center gap-2 font-serif text-lg ${brandColor} hover:opacity-80 transition-opacity`}
            >
              <ChevronLeft size={20} />
              {t.nav.back}
            </button>
            <div className="w-24 opacity-80">
               <LogoImg />
            </div>
            <div className="w-20"></div> {/* Spacer for balance */}
         </div>
      </div>

      <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-12 mt-8 border-b border-stone-300 pb-6">
        {title}
      </h1>
      <div className="animate-fade-in flex-1">
        {children}
      </div>
      
      <div className="mt-20 pt-10 border-t border-stone-200/50">
        <Footer compact={false} />
      </div>
    </div>
  );

  const StructuredTextView = ({ title, contentData, imageSrc }: { title: string, contentData: ContentSection[], imageSrc: string }) => (
    <InternalPageLayout title={title}>
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="w-full md:w-1/2 font-serif text-lg leading-relaxed text-stone-700 space-y-8">
          {contentData.map((section, sIdx) => (
              <div key={sIdx} className="space-y-4">
                  {section.title && (
                      <h3 className="text-2xl font-bold text-stone-800 mb-2 text-[#c1562e]">{section.title}</h3>
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
           <div className="aspect-[4/5] bg-stone-200 rounded-lg overflow-hidden shadow-lg sticky top-32">
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
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar Menu */}
          <div className="w-full md:w-1/4 shrink-0">
            <div className="sticky top-32 pl-2">
              <ul className="space-y-3 font-serif">
                {sections.map((s) => {
                  const isActive = escuelaSection === s;
                  return (
                  <li key={s}>
                    <button 
                      onClick={() => setEscuelaSection(s)}
                      className={`text-base md:text-lg font-serif font-medium transition-colors duration-300 block relative group text-left
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
            <h2 className="text-3xl font-serif mb-8 text-stone-800">{t.escuela.titles[escuelaSection]}</h2>
            
            <div className="font-serif text-lg leading-relaxed text-stone-700 space-y-6 max-w-prose">
               <img 
                 src={IMAGES.escuela[escuelaSection]} 
                 className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {videos.map((video, i) => (
            <div key={i} className="flex flex-col gap-3 group cursor-pointer" onClick={() => { if(video.link && video.link !== '#' && !video.embedId) window.open(video.link, '_blank') }}>
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
                <h3 className="font-serif font-bold text-xl text-stone-800 mt-2 group-hover:text-[#c1562e] transition-colors">{video.title}</h3>
                <p className="font-serif text-stone-600 text-sm mt-1 leading-relaxed">{video.description}</p>
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
        <div className="flex flex-wrap gap-3 mb-10">
            <button 
                onClick={() => setActiveTopic(null)}
                className={`px-4 py-2 rounded-full text-sm font-serif font-medium border transition-all
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
                    className={`px-4 py-2 rounded-full text-sm font-serif font-medium border transition-all
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                 <Tag size={16} className="text-stone-400 mt-1" />
                 <span className="text-xs font-bold text-[#c1562e] bg-[#c1562e]/10 px-2 py-1 rounded">{article.topic}</span>
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-800 mb-2 group-hover:text-[#c1562e] transition-colors leading-tight">
                  {article.title}
              </h3>
              <div className="flex items-center gap-2 mt-4 text-sm text-stone-500">
                  <FileText size={16} />
                  <span>PDF {article.date ? `• ${article.date}` : ''} • {language === 'es' ? 'Descargar' : 'Descarregar'}</span>
              </div>
            </div>
          ))}
        </div>
      </InternalPageLayout>
    );
  };

  const EnQueEstamosView = () => (
      <InternalPageLayout title={t.nav.en_que_estamos}>
          <div className="flex flex-col gap-16 md:gap-24">
            {t.people.map((person, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                    {/* Image Left/Right Alternating could be nice, but let's stick to Left for consistency or standard readable layout */}
                    <div className="w-full md:w-1/3 shrink-0 flex justify-center md:justify-start">
                        <div className="w-56 h-56 md:w-72 md:h-72 rounded-xl overflow-hidden shadow-lg relative group">
                             <div className="absolute inset-0 bg-[#c1562e]/10 mix-blend-overlay group-hover:opacity-0 transition-opacity"></div>
                             <img 
                                src={IMAGES.people[index] || IMAGES.homeMain} 
                                alt={person.name} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </div>
                    
                    <div className="w-full md:w-2/3">
                        <h3 className="text-3xl font-serif font-bold text-stone-800 mb-6 border-l-4 border-[#c1562e] pl-4">
                            {person.name}
                        </h3>
                        <div className="font-serif text-lg text-stone-700 leading-relaxed space-y-4">
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
        // Placeholder link to Google Drive (Replace with actual link later)
        window.open('https://drive.google.com', '_blank'); 
        setError(false);
      } else {
        setError(true);
      }
    };

    return (
      <InternalPageLayout title={t.nav.comunidad}>
         <div className="flex flex-col items-center max-w-2xl mx-auto">
            <div className="text-center space-y-4 font-serif text-lg leading-relaxed text-stone-700 mb-10">
                {t.comunidadText.map((p, idx) => (
                    <p key={idx}>
                        <LinkifyText text={p} />
                    </p>
                ))}
            </div>
            
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-stone-200">
                <label className="block font-serif font-bold text-stone-700 mb-2">
                    {language === 'es' ? 'Contraseña:' : 'Contrasenya:'}
                </label>
                <div className="flex flex-col gap-4">
                    <input 
                        type="password" 
                        className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:border-[#c1562e] focus:ring-2 focus:ring-[#c1562e]/20 outline-none transition-all"
                        placeholder={language === 'es' ? 'Contraseña' : 'Contrasenya'}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    {error && (
                        <span className="text-red-500 text-sm font-medium animate-pulse">
                            {language === 'es' ? 'Contraseña incorrecta' : 'Contrasenya incorrecta'}
                        </span>
                    )}
                    <button 
                        onClick={handleLogin}
                        className="w-full bg-[#c1562e] hover:bg-[#a04625] text-white font-bold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98]"
                    >
                        {language === 'es' ? 'Entrar' : 'Entrar'}
                    </button>
                </div>
            </div>
         </div>
      </InternalPageLayout>
    );
  };

  // --- Main Render ---

  return (
    <div className="min-h-screen w-full bg-[#f7f5e6] text-stone-800 font-sans overflow-x-hidden selection:bg-[#c1562e] selection:text-white">
      
      {/* Render View Based on State */}
      {currentView === 'home' && <HomeView />}
      {currentView === 'historia' && <StructuredTextView title={t.sections.historia} contentData={t.historiaContent} imageSrc={IMAGES.sections.historia} />}
      {currentView === 'fundamentos' && <StructuredTextView title={t.sections.fundamentos} contentData={t.fundamentosContent} imageSrc={IMAGES.sections.fundamentos} />}
      {currentView === 'escuela' && <EscuelaView />}
      {currentView === 'videos' && <VideosView />}
      {currentView === 'textos' && <TextosView />}
      {currentView === 'comunidad' && <ComunidadView />}
      {currentView === 'en_que_estamos' && <EnQueEstamosView />}

      {/* Scroll to Top Button (Only if NOT Home) */}
      {currentView !== 'home' && (
        <button
            onClick={scrollToTop}
            className={`fixed bottom-8 right-8 z-50 bg-[#c1562e] text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-500 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
        >
            <span className="font-serif font-medium text-sm uppercase tracking-wider">{t.nav.top}</span>
            <ArrowUp size={18} />
        </button>
      )}

    </div>
  );
};

export default App;
