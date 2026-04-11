export interface ModalityData {
    id: string;
    title: string;
    description: string[];
    color: {
        light: string;
        dark: string;
    };
    photos: string[];
}

export const MODALITIES_DATA: ModalityData[] = [
    {
        id: "acrobatica",
        title: "Gimnasia Acrobática",
        color: { light: "#fb923c", dark: "#f97316" },
        description: [
            "En la gimnasia Acrobática se compite en 5 categorías: 1.pareja varonil, 2. pareja femenil, 3. pareja mixta, 4. grupo femenil y 5. grupo varonil En Mexico existe programa de desarrollo con niveles obligatorios hasta el nivel 5, nivel 6 y 7 la coreografía es libre con requerimientos específicos el nivel 8 es transición a FIG. Dentro de la FIG se compite con dos rutinas: Balance y Dinamic. Los gimnastas son juzgados por la dificultad del elemento, la estabilidad, ejecución, conexiones y mérito artístico"
        ],
        photos: []
    },
    {
        id: "aerobica",
        title: "Gimnasia Aeróbica",
        color: { light: "#f87171", dark: "#ef4444" },
        description: [
            "En los años ochenta surgen los ejercicios aeróbicos como rutinas de conservación principalmente practicadas por mujeres y masificada por la televisión. Pocos años después se convierte en una disciplina deportiva que mas tarde se incorpora al programa de modalidades técnicas de la Asociación Internacional de Gimnasia.",
            "La Gimnasia Aeróbica es una disciplina que trabaja en el umbral aeróbico dentro de presentaciones dinámicas que cuentan con una base coreográfica acompañada de música y complementada con patrones de movimientos tanto estéticos como acrobáticos. Ha dado a México tres medallas mundiales y ocho campeonatos panamericanos."
        ],
        photos: []
    },
    {
        id: "artistica-femenil",
        title: "Gimnasia Artística Femenil",
        color: { light: "#facc15", dark: "#eab308" },
        description: [
            "La Gimnasia Artística Femenil, es la modalidad de gimnasia mas practicada en el mundo y actualmente el tercer deporte mas seguido en los Juegos Olímpicos. Se basa en la ejecución de rutinas sobre aparatos: Salto, Barras Asimétricas, Viga de Equilibrio y Piso.",
            "Las rutinas forman un mosaico de elegancia artística en armonía con fuerza, agilidad, fluidez, gran potencia y estética. México ha tenido representación olímpica y ha conseguido finales olímpicas y una medalla mundial en esta modalidad."
        ],
        photos: []
    },
    {
        id: "artistica-varonil",
        title: "Gimnasia Artística Varonil",
        color: { light: "#60a5fa", dark: "#3b82f6" },
        description: [
            "La modalidad original dentro de la gimnasia mundial, con participación desde la primera edición de los Juegos Olímpicos modernos. Se ejecuta en seis aparatos: Piso, Caballo con Arzones, Anillos, Salto, Barras Paralelas y Barra Fija.",
            "Exige el desarrollo de la mayoría de las capacidades físicas. México cuenta con dos finales olímpicas y una medalla mundial en esta disciplina, siendo una de las modalidades con mejores resultados históricos para el país."
        ],
        photos: []
    },
    {
        id: "trampolin",
        title: "Gimnasia de Trampolín",
        color: { light: "#4ade80", dark: "#22c55e" },
        description: [
            "Incluye trampolín individual, sincronizado, doble mini trampolín y tumbling. Se constituye por elementos enteramente acrobáticos y mayormente aéreos con giros y rotaciones en todos los ejes del cuerpo que muestran extensa plasticidad y espectacularidad.",
            "Aunque existía su práctica desde hace años, recientemente se integró formalmente. Implica un alto grado de riesgo y es sumamente vistosa por la altura y complejidad de los saltos realizados."
        ],
        photos: []
    },
    {
        id: "ritmica",
        title: "Gimnasia Rítmica",
        color: { light: "#f472b6", dark: "#ec4899" },
        description: [
            "Modalidad cien por cien femenina donde la elasticidad y flexibilidad se unen al ballet y la expresión corporal. Se utilizan implementos: cuerda, aro, pelota, clavas y cinta.",
            "Puede ser individual o in conjunto (cinco gimnastas). En México ha tenido un alto desarrollo reciente, situándose en la antesala de su primera participación olímpica tras grandes logros continentales."
        ],
        photos: []
    },
    {
        id: "para-todos",
        title: "Gimnasia para todos",
        color: { light: "#a78bfa", dark: "#8b5cf6" },
        description: [
            "Modalidad base y genérica, totalmente incluyente. Puede ser practicada por cualquier person sin importar edad, sexo o biotipo. Su formato consiste en presentaciones de grupos con fines de recreación y convivencia.",
            "La FIG celebra cada cuatro años la Gymnaestrada Mundial, el evento deportivo más grande del mundo en participación, superando los 40,000 deportistas en una sola edición."
        ],
        photos: []
    },
    {
        id: "parkour",
        title: "Parkour",
        color: { light: "#9ca3af", dark: "#6b7280" },
        description: [
            "Nacida en Francia con una filosofía de libertad de movimiento. Incorporada recientemente a la FIG, México ha iniciado con éxito la cosecha de logros internacionales en copas y campeonatos mundiales.",
            "Se encuentra en pleno crecimiento en México. Los practicantes son denominados 'traceurs' y la disciplina destaca por su dinamismo tanto en estilo libre como en velocidad."
        ],
        photos: []
    }
];
