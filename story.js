const storyData = {
    start: {
        character: "",
        text: "La lluvia golpea implacable contra el parabrisas. Has estado conduciendo durante dos horas hacia las afueras de la ciudad. El mensaje que recibiste esta mañana era breve: <i>'La Mansión Blackwood. Encuéntralo antes de que <span style=\"color: red; font-weight: bold;\">ellos</span> lo hagan.'</i>",
        background: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1920",
        bgm: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_8e20b332b0.mp3?filename=rain-and-thunder-16705.mp3",
        next: "arrival",
        weather: "rain",
        flash: "white"
    },
    arrival: {
        character: "Detective Arthur",
        text: "Por fin llego. Este lugar parece haber sido abandonado hace décadas... aunque las <span style=\"color: yellow;\">huellas recientes de neumáticos</span> en el barro dicen lo contrario. Es hora de entrar.",
        background: "https://images.unsplash.com/photo-1508247201083-2070e171fb27?auto=format&fit=crop&q=80&w=1920",
        weather: "rain",
        kenburns: true,
        sprite: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=600",
        choices: [
            { text: "Forzar la imponente puerta principal", next: "main_door" },
            { text: "Rodear y buscar una entrada trasera", next: "back_door" }
        ]
    },
    main_door: {
        character: "Detective Arthur",
        text: "(Empujando la puerta) Sorprendentemente, no estaba cerrada con llave. Un olor a humedad y polvo me golpea al entrar. El vestíbulo es inmenso y <i>frío</i>.",
        background: "https://images.unsplash.com/photo-1550095874-5c9c9d0d3436?auto=format&fit=crop&q=80&w=1920",
        kenburns: true,
        sfx: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_3d1a8e1008.mp3?filename=creaky-door-87588.mp3",
        bgm: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b3bb1023.mp3?filename=suspense-dark-ambient-85590.mp3",
        next: "hallway"
    },
    back_door: {
        character: "Detective Arthur",
        text: "La puerta trasera estaba atascada, pero logré forzar la cerradura. Entro por lo que parece ser una antigua cocina. Todo está en ruinas, pero noto pisadas recientes en el polvo. Sobre la mesa distingo un objeto útil: una vieja <span style=\"color: orange; font-weight: bold;\">linterna</span>.",
        background: "https://images.unsplash.com/photo-1582239457632-4740f9f30b91?auto=format&fit=crop&q=80&w=1920",
        giveItem: "linterna",
        next: "kitchen"
    },
    hallway: {
        character: "",
        text: "En el gran salón, ves caminos obvios. Una gran escalera que sube hacia la oscuridad del segundo piso, y una puerta entreabierta que conduce a un estudio iluminado por una luz parpadeante. También notas una puerta fuertemente reforzada hacia el sótano.",
        background: "https://images.unsplash.com/photo-1550095874-5c9c9d0d3436?auto=format&fit=crop&q=80&w=1920",
        kenburns: true,
        choices: [
            { text: "Subir con cautela al segundo piso", next: "second_floor" },
            { text: "Investigar la luz del estudio", next: "study" },
            { text: "Bajar al oscuro sótano <i>(Requiere Linterna)</i>", requiredItem: "linterna", next: "basement_door" }
        ]
    },
    kitchen: {
        character: "Detective Arthur",
        text: "Siguiendo las huellas desde la cocina, llego a un pasillo central. El silencio es ensordecedor.",
        background: "https://images.unsplash.com/photo-1550095874-5c9c9d0d3436?auto=format&fit=crop&q=80&w=1920",
        kenburns: true,
        choices: [
            { text: "Subir al piso de arriba", next: "second_floor" },
            { text: "Ir hacia el estudio", next: "study" },
            { text: "Bajar al oscuro sótano <i>(Requiere Linterna)</i>", requiredItem: "linterna", next: "basement_door" }
        ]
    },
    second_floor: {
        character: "Detective Arthur",
        text: "Los escalones crujen bajo mi peso. Arriba hay un largo pasillo. La primera puerta a la derecha parece ser el dormitorio principal. Está cerrada, pero noto <span style=\"color: cyan;\">algo brillante</span> atascado en una rendija.",
        background: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Examinar el objeto brillante con cuidado", next: "hidden_key_minigame" },
            { text: "Ignorarlo e intentar derribar la puerta", next: "door_kick" }
        ]
    },
    door_kick: {
        character: "Detective Arthur",
        text: "¡Maldición! Es roble macizo. Al patearla, el estruendo resuena por toda la casa. De repente, escucho pasos corriendo hacia mí desde el otro extremo del pasillo... <b>¡Alguien más está aquí!</b>",
        background: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1920",
        sfx: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_824cc491df.mp3?filename=wood-crash-78805.mp3",
        shake: true,
        next: "ambush_ending"
    },
    ambush_ending: {
        isEnding: true,
        endingId: "bad_ambush",
        endingName: "Final Malo: Emboscada",
        endingDesc: "Hiciste demasiado ruido en el segundo piso.",
        character: "Sistema",
        text: "<b>FINAL MALO</b>: Fuiste emboscado por intrusos desconocidos. La sutileza no es tu fuerte.",
        background: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1920",
        bgm: "stop",
        choices: [
            { text: "Reiniciar la historia", next: "start" }
        ]
    },
    hidden_key_minigame: {
        minigame: 'hiddenObject',
        background: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1920",
        minigamePrompt: "Busca la llave oculta cerca del centro de la puerta",
        hotspot: { x: '45%', y: '45%', w: '10%', h: '10%' },
        successNext: 'bedroom_enter'
    },
    bedroom_enter: {
        character: "Detective Arthur",
        text: "¡La tengo! Una llave antigua. La giro lentamente y la puerta cede. Entro a un dormitorio destrozado. Sobre la cama hay un maletín abierto. Dentro encuentro un <span style=\"color: orange; font-weight: bold;\">fusible intacto</span> y una pequeña nota arrugada.",
        background: "https://images.unsplash.com/photo-1522771731478-44eb10e5c655?auto=format&fit=crop&q=80&w=1920",
        giveItem: "fusible",
        next: "bedroom_search"
    },
    bedroom_search: {
        character: "Detective Arthur",
        text: "La nota escrita apresuradamente dice: <i>'El año que cayó el gran muro abrirá la verdad'</i>. Interesante.",
        background: "https://images.unsplash.com/photo-1522771731478-44eb10e5c655?auto=format&fit=crop&q=80&w=1920",
        giveItem: "codigo_secreto",
        choices: [
            { text: "Bajar e ir al estudio", next: "study" },
            { text: "Bajar al sótano <i>(Requiere Linterna)</i>", requiredItem: "linterna", next: "basement_door" }
        ]
    },
    study: {
        character: "Detective Arthur",
        text: "El estudio huele a humo de tabaco reciente. Alguien estuvo aquí hace minutos. Detrás de un cuadro sospechosamente torcido, descubro una vieja caja fuerte empotrada.",
        background: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Intentar forzar la caja fuerte a ciegas", next: "study_safe_minigame" },
            { text: "Usar la pista de la nota para abrirla <i>(Requiere Nota)</i>", requiredItem: "codigo_secreto", next: "study_safe_minigame" },
            { text: "Volver al pasillo", next: "hallway" }
        ]
    },
    study_safe_minigame: {
        minigame: 'safeCracking',
        background: "https://images.unsplash.com/photo-1616883162796-0373ab1a1236?auto=format&fit=crop&q=80&w=1920",
        minigamePrompt: "Introduce el código de 4 dígitos en la caja fuerte.",
        correctCode: '1989', // Year the Berlin Wall fell
        successNext: 'safe_opened'
    },
    safe_opened: {
        character: "Detective Arthur",
        text: "El mecanismo hace 'clic'. Dentro encuentro un disco duro portátil y una carpeta gruesa con el nombre de la víctima. <b>Las pruebas del soborno están aquí</b>.",
        background: "https://images.unsplash.com/photo-1588600878108-578307a3cc9d?auto=format&fit=crop&q=80&w=1920",
        giveItem: "documentos",
        next: "escape_choice"
    },
    basement_door: {
        character: "Detective Arthur",
        text: "Enciendo la linterna y desciendo con cuidado por las lúgubres escaleras de piedra. El aire es denso y frío. Al fondo, escucho una respiración agitada. Hay alguien aquí, atado y amordazado en una silla.",
        background: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1920",
        next: "basement_encounter"
    },
    basement_encounter: {
        character: "Desconocido",
        text: "(Con voz temblorosa) ¡Por favor, no me hagas daño! ...¿Eres de la policía? ¡Gracias a Dios! Tenemos que salir, pero la cerradura electrónica de la salida de emergencia de arriba cortó la energía.",
        background: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Inspeccionar la caja de fusibles rota", next: "fuse_box" },
            { text: "Dejarlo temporalmente y buscar ayuda", next: "coward_ending" }
        ]
    },
    fuse_box: {
        character: "Detective Arthur",
        text: "La caja eléctrica está destrozada, faltan fusibles. Puedo intentar empalmar los cables, pero es arriesgado.",
        background: "https://images.unsplash.com/photo-1621360155097-f58c7e6c1e14?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Intentar puentear los cables <i>(Minijuego)</i>", next: "wire_minigame" },
            { text: "Colocar el fusible intacto <i>(Requiere Fusible)</i>", requiredItem: "fusible", next: "true_ending" }
        ]
    },
    wire_minigame: {
        minigame: 'wirePuzzle',
        background: "https://images.unsplash.com/photo-1621360155097-f58c7e6c1e14?auto=format&fit=crop&q=80&w=1920",
        minigamePrompt: "Conecta los cables del mismo color (Clic izquierdo en uno, luego en el otro)",
        successNext: 'basement_escape'
    },
    basement_escape: {
        character: "Detective Arthur",
        text: "¡La energía volvió! La pesada puerta se abre con un fuerte siseo. Ayudo al rehén a salir hacia la noche justo cuando escucho frenazos de coches aparcando bruscamente frente a la mansión.",
        background: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Huir corriendo hacia la carretera", next: "good_ending" }
        ]
    },
    escape_choice: {
        character: "",
        text: "De repente, un ruido estremecedor. Motores rugiendo en el camino de entrada. Varios coches negros se detienen bruscamente frente a la mansión. <b>Ellos</b> han llegado.",
        background: "https://images.unsplash.com/photo-1508247201083-2070e171fb27?auto=format&fit=crop&q=80&w=1920",
        weather: "rain",
        kenburns: true,
        choices: [
            { text: "Saltar por la ventana trasera hacia el bosque", next: "good_ending_solo" },
            { text: "Intentar esconderse bajo las escaleras", next: "coward_ending" }
        ]
    },
    good_ending_solo: {
        isEnding: true,
        endingId: "good_solo",
        endingName: "Final Bueno: Superviviente",
        endingDesc: "Escapaste con pruebas, pero sin la víctima.",
        character: "Sistema",
        text: "<b>FINAL BUENO (Solo)</b>: Agarraste los documentos y escapaste por el bosque húmedo hacia tu coche. Con estas pruebas, los responsables caerán. Pero no pudiste encontrar a la víctima a tiempo...",
        background: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Volver a jugar para buscar el Final Verdadero", next: "start" }
        ]
    },
    good_ending: {
        isEnding: true,
        endingId: "good_rescue",
        endingName: "Final Alternativo: Rescatador",
        endingDesc: "Salvaste la vida de la víctima, pero perdiste las pruebas.",
        character: "Sistema",
        text: "<b>FINAL ALTERNATIVO</b>: Escapaste con la víctima sana y salva. Los matones no te vieron huir por la puerta trasera. Salvaste una vida hoy, aunque no encontraste pruebas para desmantelar la organización.",
        background: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Volver a jugar para buscar el Final Verdadero", next: "start" }
        ]
    },
    true_ending: {
        character: "Sistema",
        text: "<b>FINAL VERDADERO: EL RESCATE PERFECTO</b><br>Usaste el fusible para abrir la puerta silenciosamente. Escapaste con la víctima y los documentos incriminatorios. ¡Has resuelto el caso perfectamente!",
        background: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Continuar al Capítulo 2...", next: "ch2_start" }
        ]
    },
    coward_ending: {
        isEnding: true,
        endingId: "neutral_coward",
        endingName: "Final Neutral: Cobardía",
        endingDesc: "El miedo te paralizó y abandonaste la misión.",
        character: "Sistema",
        text: "<b>FINAL NEUTRAL</b>: Te escondiste presa del pánico. Estuvieron registrando la casa durante horas. Finalmente se fueron, pero perdiste tu oportunidad de salvar el día.",
        background: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Intentar de nuevo", next: "start" }
        ]
    },

    // ==========================================
    // CAPÍTULO 2
    // ==========================================
    ch2_start: {
        character: "",
        text: "<b>CAPÍTULO 2: LA ESTACIÓN DE TREN</b><br><br>Una hora más tarde...",
        background: "https://images.unsplash.com/photo-1473655589139-66c3ab5d0f62?auto=format&fit=crop&q=80&w=1920", // Empty road/station
        bgm: "https://cdn.pixabay.com/download/audio/2022/10/25/audio_b2f9eb8413.mp3?filename=dark-ambient-soundscape-123497.mp3",
        weather: "rain",
        next: "ch2_car"
    },
    ch2_car: {
        character: "Detective Arthur",
        text: "Conducimos en silencio. La víctima, un tal señor Vance, no deja de mirar por el retrovisor. \"No estamos a salvo,\" susurra. \"El jefe de ellos nos estará esperando en la vieja estación de tren de St. Jude.\"",
        background: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1920", // Inside car
        sprite: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=600",
        choices: [
            { text: "Preguntar sobre el 'Jefe'", next: "ch2_vance_talk" },
            { text: "Ignorarlo y acelerar hacia la estación", next: "ch2_station_arrival" }
        ]
    },
    ch2_vance_talk: {
        character: "Vance",
        text: "Lo llaman 'El Cuervo'. Él maneja todos los hilos de la corrupción en esta ciudad. Y tiene a mi hija. Por eso robé esos documentos que tienes ahí.",
        background: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1920",
        next: "ch2_station_arrival"
    },
    ch2_station_arrival: {
        character: "Detective Arthur",
        text: "Llegamos a la estación abandonada de St. Jude. Un solo tren de carga oxidado descansa en las vías. Hay luces encendidas en la oficina del jefe de estación.",
        background: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&q=80&w=1920", // Train station
        kenburns: true,
        bgm: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b3bb1023.mp3?filename=suspense-dark-ambient-85590.mp3",
        choices: [
            { text: "Dejar a Vance en el coche e ir a investigar", next: "ch2_office" },
            { text: "Llevar a Vance contigo", next: "ch2_office_together" }
        ]
    },
    ch2_office_together: {
        character: "Detective Arthur",
        text: "Avanzamos juntos hacia la oficina. De repente, un disparo atraviesa la noche. Vance cae al suelo herido.",
        background: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&q=80&w=1920",
        flash: "red",
        sfx: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_a0a736cb4e.mp3?filename=gunshot-14-100257.mp3",
        next: "ch2_fail_protect"
    },
    ch2_fail_protect: {
        isEnding: true,
        endingId: "bad_protect",
        endingName: "Final Trágico: Fuego Cruzado",
        endingDesc: "Llevaste a Vance contigo y pagó el precio.",
        character: "Sistema",
        text: "<b>FINAL TRÁGICO:</b> Vance no sobrevivió. Sin él para testificar, los documentos no fueron suficientes. El Cuervo escapó.",
        background: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Reiniciar Capítulo 2", next: "ch2_start" }
        ]
    },
    ch2_office: {
        character: "Detective Arthur",
        text: "Me acerco sigilosamente a la oficina. A través del cristal sucio, veo a un hombre alto con un abrigo oscuro apuntando a una joven atada. El Cuervo.",
        background: "https://images.unsplash.com/photo-1517594422361-5e18ad40d659?auto=format&fit=crop&q=80&w=1920", // Office interior
        choices: [
            { text: "Entrar pateando la puerta", next: "ch2_showdown" },
            { text: "Buscar una forma de cortar la luz", next: "ch2_stealth" }
        ]
    },
    ch2_stealth: {
        character: "Detective Arthur",
        text: "Encuentro el panel principal en el andén. Corto los cables. La oficina se sume en la oscuridad absoluta. Escucho gritos de pánico dentro.",
        background: "https://images.unsplash.com/photo-1621360155097-f58c7e6c1e14?auto=format&fit=crop&q=80&w=1920",
        sfx: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=power-down-7103.mp3",
        next: "ch2_arrest"
    },
    ch2_showdown: {
        character: "El Cuervo",
        text: "¿Crees que puedes detenerme, detective? Tengo a la chica y tú solo tienes un arma. Baja el arma, o ella muere.",
        background: "https://images.unsplash.com/photo-1517594422361-5e18ad40d659?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Disparar a la mano del Cuervo", next: "ch2_shootout" },
            { text: "Rendirse y entregar los documentos", next: "ch2_betrayal" }
        ]
    },
    ch2_betrayal: {
        isEnding: true,
        endingId: "bad_betrayal",
        endingName: "Final Malo: Rendición",
        endingDesc: "Entregaste las pruebas y fuiste traicionado.",
        character: "Sistema",
        text: "<b>FINAL MALO:</b> Entregaste las pruebas. El Cuervo destruyó los documentos y te dejó atado junto con la chica. Perdieron.",
        background: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Reiniciar Capítulo 2", next: "ch2_start" }
        ]
    },
    ch2_shootout: {
        character: "Detective Arthur",
        text: "Tomo aire, apunto cuidadosamente y disparo. La bala impacta directamente en su mano, obligándolo a soltar su revólver. Me abalanzo sobre él.",
        background: "https://images.unsplash.com/photo-1517594422361-5e18ad40d659?auto=format&fit=crop&q=80&w=1920",
        sfx: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_a0a736cb4e.mp3?filename=gunshot-14-100257.mp3",
        flash: "white",
        next: "ch2_arrest"
    },
    ch2_arrest: {
        character: "Detective Arthur",
        text: "Con el Cuervo inmovilizado y la hija de Vance a salvo, llamo a los refuerzos. Con los documentos que robamos en la mansión, este imperio criminal se derrumbará mañana mismo.",
        background: "https://images.unsplash.com/photo-1469041797191-50ace28483c3?auto=format&fit=crop&q=80&w=1920",
        bgm: "stop",
        choices: [
            { text: "Continuar al Capítulo 3...", next: "ch3_start" }
        ]
    },

    // ==========================================
    // CAPÍTULO 3
    // ==========================================
    ch3_start: {
        character: "",
        text: "<b>CAPÍTULO 3: EL CONTRAATAQUE</b><br><br>Tres días después. Las noticias estallan con el desmantelamiento del imperio del Cuervo.",
        background: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?auto=format&fit=crop&q=80&w=1920", // City morning
        transition: "white",
        bgm: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_651a09635b.mp3?filename=sad-piano-ambient-16629.mp3",
        weather: "none",
        next: "ch3_office"
    },
    ch3_office: {
        character: "Detective Arthur",
        text: "Estoy en mi oficina, sirviéndome el tercer café de la mañana. Vance y su hija están bajo protección de testigos, pero algo no encaja. Los documentos mencionaban un cargamento final en el muelle 4.",
        background: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1920", // Office desk
        sprite: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=600",
        choices: [
            { text: "Dar el caso por cerrado y descansar", next: "ch3_lazy_end" },
            { text: "Ir al Muelle 4 a investigar", next: "ch3_docks" }
        ]
    },
    ch3_lazy_end: {
        isEnding: true,
        endingId: "neutral_lazy",
        endingName: "Final Neutral: Trabajo Terminado",
        endingDesc: "Detuviste al Cuervo, pero un último cargamento se escapó.",
        character: "Sistema",
        text: "<b>FINAL NEUTRAL</b>: Decidiste que ya habías hecho suficiente. Eres aclamado como un héroe en la ciudad, pero en el fondo sabes que un último barco fantasma logró zarpar...",
        background: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Intentar Capítulo 3 de nuevo", next: "ch3_start" }
        ]
    },
    ch3_docks: {
        character: "Detective Arthur",
        text: "El muelle 4 está rodeado de neblina. No hay trabajadores, solo un gran contenedor con la puerta entreabierta. Escucho un ruido metálico proveniente del interior.",
        background: "https://images.unsplash.com/photo-1562234057-0b1a03e6730f?auto=format&fit=crop&q=80&w=1920", // Docks
        weather: "rain",
        bgm: "https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b3bb1023.mp3?filename=suspense-dark-ambient-85590.mp3",
        choices: [
            { text: "Entrar sigilosamente", next: "ch3_container" },
            { text: "Llamar por radio a refuerzos", next: "ch3_radio" }
        ]
    },
    ch3_radio: {
        character: "Detective Arthur",
        text: "Tomo mi radio, pero solo hay estática. Un bloqueador de señal. De repente, siento un cañón frío en mi nuca.",
        background: "https://images.unsplash.com/photo-1562234057-0b1a03e6730f?auto=format&fit=crop&q=80&w=1920",
        sfx: "https://cdn.pixabay.com/download/audio/2021/08/04/audio_3d1a8e1008.mp3?filename=creaky-door-87588.mp3",
        next: "ch3_ambush"
    },
    ch3_ambush: {
        isEnding: true,
        endingId: "bad_dock",
        endingName: "Final Malo: El Bloqueador",
        endingDesc: "Confiaste en la tecnología y te tendieron una trampa.",
        character: "Sistema",
        text: "<b>FINAL MALO</b>: El segundo al mando del Cuervo te estaba esperando. Sin forma de pedir ayuda, te convertiste en un daño colateral.",
        background: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Reiniciar Capítulo 3", next: "ch3_start" }
        ]
    },
    ch3_container: {
        character: "Detective Arthur",
        text: "Entro con el arma en alto. Dentro del contenedor hay hileras de cajas apiladas y una figura encapuchada armando un dispositivo que parpadea en rojo. ¡Es una bomba!",
        background: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=1920", // Warehouse interior
        choices: [
            { text: "Gritar '¡Alto ahí!'", next: "ch3_bomb_threat" }
        ]
    },
    ch3_bomb_threat: {
        character: "Secuaz",
        text: "¡El imperio del Cuervo no morirá! Si caemos, este puerto cae con nosotros. El dispositivo está bloqueado. Tienes 3 minutos, detective.",
        background: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=1920",
        next: "ch3_defuse_prep"
    },
    ch3_defuse_prep: {
        character: "Detective Arthur",
        text: "Lo noqueo de un golpe con la culata del arma. Me arrodillo frente al dispositivo. Tiene un complejo sistema de cables...",
        background: "https://images.unsplash.com/photo-1621360155097-f58c7e6c1e14?auto=format&fit=crop&q=80&w=1920",
        choices: [
            { text: "Cortar cables (Minijuego)", next: "ch3_defuse_minigame" }
        ]
    },
    ch3_defuse_minigame: {
        minigame: 'wirePuzzle',
        background: "https://images.unsplash.com/photo-1621360155097-f58c7e6c1e14?auto=format&fit=crop&q=80&w=1920",
        minigamePrompt: "Desactiva la bomba enlazando los nodos del mismo color",
        successNext: 'ch3_victory'
    },
    ch3_victory: {
        character: "Detective Arthur",
        text: "El temporizador se detiene a falta de 12 segundos. Me seco el sudor de la frente. Ahora sí, esto se ha acabado de verdad.",
        background: "https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?auto=format&fit=crop&q=80&w=1920",
        bgm: "stop",
        next: "ch3_true_ending"
    },
    ch3_true_ending: {
        isEnding: true,
        endingId: "true_hero",
        endingName: "Final Definitivo: La Sombra Disipada",
        endingDesc: "Derrotaste a la organización criminal por completo, salvando el muelle.",
        character: "Sistema",
        text: "<b>¡FELICIDADES! HAS COMPLETADO LA NOVELA VISUAL AL 100%.</b><br><br>Lograste desmantelar a la organización del Cuervo, rescataste a la familia Vance y evitaste la destrucción del Muelle 4. Tu nombre será leyenda en este departamento de policía.",
        background: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=1920",
        weather: "none",
        choices: [
            { text: "Jugar desde el inicio", next: "start" }
        ]
    }
};

window.storyData = storyData;

window.endingsData = [
    { id: "bad_ambush", name: "Final Malo: Emboscada" },
    { id: "neutral_coward", name: "Final Neutral: Cobardía" },
    { id: "good_solo", name: "Final Bueno: Superviviente" },
    { id: "good_rescue", name: "Final Alternativo: Rescatador" },
    { id: "bad_protect", name: "Final Trágico: Fuego Cruzado" },
    { id: "bad_betrayal", name: "Final Malo: Rendición" },
    { id: "neutral_lazy", name: "Final Neutral: Trabajo Terminado" },
    { id: "bad_dock", name: "Final Malo: El Bloqueador" },
    { id: "true_hero", name: "Final Definitivo: La Sombra Disipada" }
];
