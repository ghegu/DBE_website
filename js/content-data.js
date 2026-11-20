/* ==========================================================================
   DBE 2026/2027 Structured Official University Data & Bilingual Dictionary
   Verified against corsi.unina.it/DB1 (2026/27), Application Smart Guide 26/27,
   First Semester Timetable 2026/27, and Francesco Izzo's DBE Editorial.
   ========================================================================== */

window.DBE_DATA = {
  /* ---------- 1. OFFICIAL 2026/2027 STUDY PLAN (120 ECTS) ---------- */
  courses: [
    {
      id: 'y1-ind',
      year: 1,
      track: 'y1',
      semester: 1,
      ects: 10,
      code: 'U3035 / U1076',
      ssd: 'ICAR/13',
      title: { en: 'Industrial Design Studio', it: 'Laboratorio di Industrial Design' },
      modules: [
        'Industrial Design (U3035, Prof. Alfonso Morone / Prof. Carla Langella)',
        'Graphic Design (U1076, Prof. Vincenzo Pinto / Prof. Michela Musto)'
      ],
      desc: {
        en: 'Core first year studio bridging physical product design with visual communication. Students move from user research and concept sketching to material prototyping and coordinated graphic systems.',
        it: 'Laboratorio centrale del primo anno che unisce product design e comunicazione visiva: dalla ricerca sugli utenti e dallo schizzo progettuale fino al prototipo fisico e al sistema grafico coordinato.'
      }
    },
    {
      id: 'y1-struct',
      year: 1,
      track: 'y1',
      semester: 1,
      ects: 10,
      code: 'U2995 / U2994',
      ssd: 'ING-IND/22 · ICAR/09',
      title: { en: 'Integrated Class of Structures and Materials', it: 'Corso Integrato di Strutture e Materiali' },
      modules: [
        'Innovative Materials for Design (U2995, Prof. Paolo Trucillo)',
        'Structural Design (U2994, Prof. Francesco P.A. Portioli)'
      ],
      desc: {
        en: 'Explores advanced material engineering, bio-based and composite solutions alongside structural behavior, teaching designers how form, load, and materiality work together in built artifacts.',
        it: 'Esplora ingegneria dei materiali innovativi, compositi e soluzioni sostenibili insieme al comportamento strutturale, per padroneggiare il rapporto tra forma, struttura e materia.'
      }
    },
    {
      id: 'y1-visual',
      year: 1,
      track: 'y1',
      semester: 1,
      ects: 10,
      code: 'U2990 / U2991',
      ssd: 'ICAR/17 · L-ART/03',
      title: { en: 'Integrated Class of Visual Expression', it: 'Corso Integrato di Espressione Visiva' },
      modules: [
        'Advanced Representation Techniques (U2990, Prof. Alessandra Pagliano / Prof. Carolina Spiezia)',
        'Arts, Techniques and Digital Cultures (U2991, Prof. Margherita Melani / Prof. Alessandra Veropalumbo)'
      ],
      desc: {
        en: 'Develops advanced spatial representation, digital drawing, architectural visualization, and critical literacy across contemporary art, media, and digital visual cultures.',
        it: 'Sviluppa rappresentazione avanzata dello spazio, disegno digitale, visualizzazione architettonica e lettura critica delle arti e delle culture visive digitali contemporanee.'
      }
    },
    {
      id: 'y1-circular',
      year: 1,
      track: 'y1',
      semester: 1,
      ects: 5,
      code: 'U7181',
      ssd: 'ICAR/12',
      title: { en: 'Technological Design for Circular Supply Chain', it: 'Progettazione Tecnologica per la Filiera Circolare' },
      modules: ['Technological Design for Circular Supply Chain (U7181, 5 ECTS)'],
      desc: {
        en: 'Focuses on sustainable production cycles, circular economy models, low-impact building and product systems, and responsible lifecycle design for the contemporary built environment.',
        it: 'Approfondisce cicli produttivi sostenibili, economia circolare, sistemi edilizi e di prodotto a basso impatto e progettazione responsabile del ciclo di vita.'
      }
    },
    {
      id: 'y1-history',
      year: 1,
      track: 'y1',
      semester: 2,
      ects: 5,
      code: 'U3001',
      ssd: 'ICAR/18',
      title: { en: 'History of Furniture and Design', it: 'Storia dell’Arredo e del Design' },
      modules: ['History of Furniture and Design (U3001, 5 ECTS)'],
      desc: {
        en: 'Historical and critical exploration of design and interior culture, analyzing how social transformations, industrial innovations, and artistic movements shaped modern spaces and objects.',
        it: 'Percorso storico e critico sulla cultura del design e degli interni, analizzando come società, innovazione industriale e avanguardie abbiano plasmato spazi e oggetti.'
      }
    },
    {
      id: 'y1-interior',
      year: 1,
      track: 'y1',
      semester: 2,
      ects: 10,
      code: 'U2999 / U3000',
      ssd: 'ICAR/16 · ICAR/14',
      title: { en: 'Interior Design Studio', it: 'Laboratorio di Interior Design' },
      modules: [
        'Interior Design (U2999)',
        'Architectural Design (U3000)'
      ],
      desc: {
        en: 'Hands-on spatial studio focused on interior architecture, human behavior in lived spaces, spatial sequence, materials, and adaptive reuse within contemporary urban contexts.',
        it: 'Laboratorio progettuale focalizzato sull’architettura degli interni, comportamenti d’uso, sequenze spaziali, materiali e riuso adattivo nei contesti urbani contemporanei.'
      }
    },
    {
      id: 'y1-web',
      year: 1,
      track: 'y1',
      semester: 2,
      ects: 10,
      code: 'U7180',
      ssd: 'ICAR/13 · INF/01',
      title: { en: 'Web Design Studio', it: 'Laboratorio di Web Design' },
      modules: [
        'Interface Design (U7180)',
        'Web Architecture & Digital Prototyping'
      ],
      desc: {
        en: 'Introduces human centered web systems, UI architecture, interactive prototyping, and digital communication strategies, giving every DBE student a strong digital foundation before Year 2.',
        it: 'Introduce sistemi web centrati sull’utente, architettura delle interfacce, prototipazione interattiva e strategie digitali, creando basi solide prima della scelta del secondo anno.'
      }
    },

    // YEAR 2 EXHIBIT DESIGN CURRICULUM (DB102, 40 ECTS COURSEWORK)
    {
      id: 'y2-ex-fab',
      year: 2,
      track: 'exhibit',
      semester: 1,
      ects: 10,
      code: 'U3007 / U3008',
      ssd: 'ICAR/12 · ICAR/17',
      title: { en: 'Digital Manufacturing Studio', it: 'Laboratorio di Digital Manufacturing' },
      modules: [
        'Digital Fabrication (U3007, Prof. Mattia Federico Leone)',
        'Parametric and Generative Modeling (U3008, Prof. Mara Capone)'
      ],
      desc: {
        en: 'Bridges algorithmic and parametric geometry with real fabrication: CNC, 3D printing, laser cutting, and bespoke modular exhibition components built from digital code to physical prototype.',
        it: 'Collega modellazione parametrica e generativa alla fabbricazione digitale: CNC, stampa 3D, taglio laser e prototipazione di componenti espositivi e spaziali.'
      }
    },
    {
      id: 'y2-ex-int',
      year: 2,
      track: 'exhibit',
      semester: 1,
      ects: 10,
      code: 'U3004 / U1080',
      ssd: 'ICAR/16 · ING-IND/11',
      title: { en: 'Exhibit Design for Interiors Studio', it: 'Laboratorio di Exhibit Design per gli Interni' },
      modules: [
        'Exhibit Design (U3004, Prof. Chiara Lecce)',
        'Lighting Design (U1080, Prof. Francesca Fragliasso)'
      ],
      desc: {
        en: 'Designs museum narratives, cultural heritage displays, and commercial or retail interiors, combining spatial scenography with technical and atmospheric lighting design.',
        it: 'Progettazione di percorsi museali, valorizzazione dei beni culturali e spazi retail, integrando scenografia spaziale e progetto illuminotecnico e percettivo.'
      }
    },
    {
      id: 'y2-ex-temp',
      year: 2,
      track: 'exhibit',
      semester: 2,
      ects: 15,
      code: 'U3013 / U3011',
      ssd: 'ICAR/16 · ICAR/12 · ICAR/13',
      title: { en: 'Atelier of Temporary Spaces Design', it: 'Atelier di Progettazione degli Spazi Temporanei' },
      modules: [
        'Temporary & Event Architecture Studio',
        'Technological Design Culture (U3013)',
        'Visual and Communication Design (U3011)'
      ],
      desc: {
        en: 'Flagship 15 ECTS synthesis atelier tackling pop-up installations, pavilions, cultural festivals, and urban spatial identity, integrating structures, narrative graphics, and fast assembly.',
        it: 'Atelier di sintesi da 15 CFU dedicato a padiglioni, installazioni pop-up, eventi culturali e identità visiva nello spazio: dalla tecnologia costruttiva alla grafica ambientale.'
      }
    },

    // YEAR 2 DIGITAL DESIGN CURRICULUM (DB103, 40 ECTS COURSEWORK)
    {
      id: 'y2-dig-studio',
      year: 2,
      track: 'digital',
      semester: 1,
      ects: 10,
      code: 'U3018 / U3019',
      ssd: 'ICAR/13 · M-FIL/04',
      title: { en: 'Digital Design Studio', it: 'Laboratorio di Digital Design' },
      modules: [
        'Digital Design (U3018, Prof. Pietro Nunziante)',
        'Digital Aesthetics (U3019, Prof. Lorenzo De Stefano)'
      ],
      desc: {
        en: 'Explores next generation digital products, multimedia environments, AR/VR experiences, and the aesthetic theory governing screens, interfaces, and virtualized spatial interaction.',
        it: 'Esplora prodotti digitali di nuova generazione, ambienti multimediali, scenari AR/VR ed estetica dei media digitali per interfacce e spazi aumentati.'
      }
    },
    {
      id: 'y2-dig-sys',
      year: 2,
      track: 'digital',
      semester: 1,
      ects: 10,
      code: 'U3015 / U7183',
      ssd: 'ICAR/13 · SECS-P/08',
      title: { en: 'Systemic Design Studio', it: 'Laboratorio di Systemic Design' },
      modules: [
        'Systemic Design (U3015, Prof. Ernesto Ramon Rispoli)',
        'Web Marketing and Branding (U7183, Prof. Mariarosalba Angrisani)'
      ],
      desc: {
        en: 'Moves beyond isolated artifacts to design interconnected product and service ecosystems, digital branding, market positioning, and socially sustainable urban and organizational networks.',
        it: 'Supera il singolo oggetto per progettare ecosistemi prodotto e servizio, strategie di branding digitale, comunicazione web e reti sostenibili per città e imprese.'
      }
    },
    {
      id: 'y2-dig-ixd',
      year: 2,
      track: 'digital',
      semester: 2,
      ects: 15,
      code: 'U3020 / U3021 / U3022',
      ssd: 'ICAR/13 · ING-INF/05 · ICAR/12',
      title: { en: 'Atelier of Interaction Design', it: 'Atelier di Interaction Design' },
      modules: [
        'User Centred Design (U3020)',
        'System of Data Processing (U3021)',
        'Digital and Technological Culture (U3022)'
      ],
      desc: {
        en: 'Flagship 15 ECTS synthesis atelier focused on HCI (Human Computer Interaction), UX research, connected IoT environments, data driven interfaces, and interactive prototypes tested with real users.',
        it: 'Atelier di sintesi da 15 CFU dedicato a Human Computer Interaction, UX research, ambienti connessi IoT, sistemi di elaborazione dati e prototipi testati con utenti reali.'
      }
    },

    // YEAR 2 COMMON COMPLETION COMPONENTS
    {
      id: 'y2-workshop',
      year: 2,
      track: 'common2',
      semester: 2,
      ects: 5,
      code: 'U3009',
      ssd: 'ICAR/13',
      title: { en: 'Professional Design Workshop', it: 'Workshop Professionale di Design' },
      modules: ['Intensive Applied Design Workshop (U3009, 5 ECTS, Both Curricula)'],
      desc: {
        en: 'Fast paced real world brief developed with partner companies, cultural institutions, or guest designers, simulating studio workflows from challenge discovery to final presentation.',
        it: 'Sfida progettuale intensiva in collaborazione con aziende, istituzioni culturali o designer ospiti, simulando il flusso reale di uno studio dal brief alla presentazione finale.'
      }
    },
    {
      id: 'y2-elective',
      year: 2,
      track: 'common2',
      semester: 2,
      ects: 8,
      code: 'ELECTIVE',
      ssd: 'TAF D',
      title: { en: 'Elective Activities (Student’s Choice)', it: 'Attività a Scelta dello Studente' },
      modules: ['Custom courses across DiARC / Federico II or cross-track modules (8 ECTS)'],
      desc: {
        en: 'Tailor your Master’s profile by choosing specialized seminars, cross disciplinary modules from the alternate DBE track, or international workshops across Federico II.',
        it: 'Personalizza il tuo percorso scegliendo seminari specialistici, moduli dell’altro curriculum DBE o attività trasversali offerte dall’Ateneo Federico II.'
      }
    },
    {
      id: 'y2-traineeship',
      year: 2,
      track: 'common2',
      semester: 2,
      ects: 6,
      code: 'TIROCINIO',
      ssd: 'TAF F',
      title: { en: 'Traineeship / Internship', it: 'Tirocinio Formativo e di Orientamento' },
      modules: ['Design Studio / Company / Museum / Erasmus+ Traineeship (6 ECTS)'],
      desc: {
        en: 'Mandatory hands-on professional placement in architecture and design practices, tech companies, cultural institutions, research labs, or abroad via Erasmus+ Traineeship.',
        it: 'Esperienza professionale obbligatoria in studi di design o architettura, aziende tech e manifatturiere, musei, laboratori di ricerca o all’estero tramite Erasmus+ Traineeship.'
      }
    },
    {
      id: 'y2-thesis',
      year: 2,
      track: 'common2',
      semester: 2,
      ects: 6,
      code: 'PROVA FINALE',
      ssd: 'TAF E',
      title: { en: 'Final Examination & Master’s Thesis', it: 'Prova Finale e Tesi di Laurea Magistrale' },
      modules: ['Original Experimental Design or Research Thesis (6 ECTS)'],
      desc: {
        en: 'Independent graduation project written and defended in English, demonstrating mastery of research, prototyping, critical thinking, and spatial or digital innovation.',
        it: 'Progetto di tesi originale redatto e discusso in inglese, a dimostrazione della padronanza tra ricerca, prototipazione e innovazione spaziale o digitale.'
      }
    }
  ],

  /* ---------- 2. SIX SKILLS FROM THE YELLOW FOLDOUT ---------- */
  skills: [
    {
      num: '01',
      key: 'RESEARCH',
      sub: { en: 'Understand people and contexts', it: 'Comprendere persone e contesti' },
      studio: {
        en: 'Built in: Interior Design Studio, Systemic Design Studio, History of Furniture & Design',
        it: 'Sviluppata in: Interior Design Studio, Systemic Design Studio, History of Furniture & Design'
      },
      detail: {
        en: 'Ethnographic observation, urban and cultural heritage analysis, user interviews, and critical mapping of social behaviors before drawing a single line.',
        it: 'Osservazione etnografica, analisi urbana e del patrimonio culturale, interviste agli utenti e mappatura critica dei comportamenti prima di tracciare una singola linea.'
      }
    },
    {
      num: '02',
      key: 'VISUALISE',
      sub: { en: 'Communicate complex ideas', it: 'Comunicare idee complesse' },
      studio: {
        en: 'Built in: Integrated Class of Visual Expression, Graphic Design, Communication Design',
        it: 'Sviluppata in: Integrated Class of Visual Expression, Graphic Design, Communication Design'
      },
      detail: {
        en: 'Editorial direction, architectural storytelling, parametric 3D representation, data visualization, and brand systems that make bold design visions immediately legible.',
        it: 'Direzione editoriale, storytelling spaziale, rappresentazione 3D parametrica, visualizzazione dati e sistemi visivi che rendono leggibili idee complesse.'
      }
    },
    {
      num: '03',
      key: 'CREATE',
      sub: { en: 'Develop original concepts', it: 'Sviluppare concept originali' },
      studio: {
        en: 'Built in: Industrial Design Studio, Exhibit Design Studio, Digital Design Studio',
        it: 'Sviluppata in: Industrial Design Studio, Exhibit Design Studio, Digital Design Studio'
      },
      detail: {
        en: 'Divergent ideation rooted in Italian design methodology (from Bruno Munari to contemporary speculative design), transforming constraints into memorable artifacts and environments.',
        it: 'Ideazione divergente radicata nella cultura del progetto italiana (da Bruno Munari al design speculativo), trasformando i vincoli in artefatti e spazi memorabili.'
      }
    },
    {
      num: '04',
      key: 'PROTOTYPE',
      sub: { en: 'Turn ideas into tangible solutions', it: 'Trasformare idee in soluzioni tangibili' },
      studio: {
        en: 'Built in: Digital Manufacturing Studio, Web Design Studio, Structures & Materials',
        it: 'Sviluppata in: Digital Manufacturing Studio, Web Design Studio, Structures & Materials'
      },
      detail: {
        en: 'From laser cut models, 3D printed joints, and full scale spatial mockups to interactive Figma and code prototypes and connected IoT demonstrators.',
        it: 'Dai modelli laser cut, giunti stampati in 3D e mock-up spaziali in scala reale fino a prototipi interattivi digitali e dimostratori IoT connessi.'
      }
    },
    {
      num: '05',
      key: 'TEST',
      sub: { en: 'Evaluate design decisions', it: 'Valutare le decisioni progettuali' },
      studio: {
        en: 'Built in: Atelier of Interaction Design, Lighting Design, Circular Supply Chain',
        it: 'Sviluppata in: Atelier of Interaction Design, Lighting Design, Circular Supply Chain'
      },
      detail: {
        en: 'Usability testing, photometric lighting simulation, material lifecycle checks, and iterative critiques with faculty, peers, and real end users.',
        it: 'Test di usabilità, simulazioni illuminotecniche, verifica del ciclo di vita dei materiali e revisioni iterative con docenti, colleghi e utenti reali.'
      }
    },
    {
      num: '06',
      key: 'COLLABORATE',
      sub: { en: 'Work across disciplines', it: 'Lavorare tra discipline diverse' },
      studio: {
        en: 'Built in: 15 ECTS Synthesis Ateliers, Professional Design Workshop, Traineeship',
        it: 'Sviluppata in: Atelier di Sintesi (15 CFU), Professional Design Workshop, Tirocinio'
      },
      detail: {
        en: 'International mixed teams pairing designers, architects, engineers, and fine artists, mirroring real multidisciplinary design agencies and R&D studios worldwide.',
        it: 'Team internazionali multidisciplinari che uniscono designer, architetti, ingegneri e artisti, rispecchiando il lavoro reale di agenzie e centri R&D.'
      }
    }
  ],

  /* ---------- 3. CAREERS ---------- */
  careers: [
    {
      track: 'exhibit',
      badge: { en: 'Exhibit Design', it: 'Exhibit Design' },
      title: { en: 'Museums, Culture & Heritage', it: 'Musei, Cultura e Patrimonio' },
      desc: {
        en: 'Design permanent exhibitions, temporary pavilions, archaeological staging, and narrative spatial experiences for museums, biennials, and cultural foundations.',
        it: 'Progettazione di mostre permanenti e temporanee, padiglioni, allestimenti per beni culturali e percorsi narrativi per musei, biennali e fondazioni.'
      },
      roles: 'Exhibit Designer · Museographer · Spatial Narrative Director'
    },
    {
      track: 'exhibit',
      badge: { en: 'Exhibit Design', it: 'Exhibit Design' },
      title: { en: 'Interior, Retail & Pop-Up Spaces', it: 'Interior, Retail e Spazi Pop-Up' },
      desc: {
        en: 'Shape flagship stores, hospitality interiors, lighting atmospheres, and modular installations for international architecture practices and furniture brands.',
        it: 'Progettazione di flagship store, spazi hospitality, lighting design e installazioni modulari per studi di architettura e brand di arredo.'
      },
      roles: 'Interior Designer · Retail Experience Designer · Lighting Specialist'
    },
    {
      track: 'digital',
      badge: { en: 'Digital Design', it: 'Digital Design' },
      title: { en: 'UI/UX & Interaction Systems', it: 'UI/UX e Sistemi Interattivi' },
      desc: {
        en: 'Craft human centered apps, design systems, web platforms, and connected digital products for software houses, agencies, and tech startups.',
        it: 'Progettazione di app centrate sull’utente, design system, piattaforme web e prodotti digitali connessi per agenzie, software house e startup.'
      },
      roles: 'Product Designer · UX/UI Designer · Interaction Designer (HCI)'
    },
    {
      track: 'digital',
      badge: { en: 'Digital Design', it: 'Digital Design' },
      title: { en: 'AR/VR, Smart Spaces & IoT', it: 'AR/VR, Spazi Connessi e IoT' },
      desc: {
        en: 'Merge physical architecture with responsive digital layers, creating augmented cultural installations, interactive media spaces, and smart urban services.',
        it: 'Fusione tra spazio fisico e layer digitali reattivi: installazioni aumentate, ambienti multimediali interattivi e servizi urbani intelligenti.'
      },
      roles: 'Creative Technologist · Spatial Computing Designer · Service Designer'
    },
    {
      track: 'both',
      badge: { en: 'Both Curricula', it: 'Entrambi i Percorsi' },
      title: { en: 'Manufacturing & Digital Fabrication', it: 'Manifattura e Fabbricazione Digitale' },
      desc: {
        en: 'Lead product innovation, circular materials research, and parametric prototyping inside Italian industrial companies and evolved craft ateliers.',
        it: 'Guida l’innovazione di prodotto, la ricerca sui materiali circolari e la prototipazione parametrica in aziende manifatturiere e artigianato evoluto.'
      },
      roles: 'Industrial Designer · Computational Designer · Material Researcher'
    },
    {
      track: 'both',
      badge: { en: 'Both Curricula', it: 'Entrambi i Percorsi' },
      title: { en: 'Design Management, R&D & PhD', it: 'Design Management, R&D e Dottorato' },
      desc: {
        en: 'Coordinate complex multidisciplinary processes in innovation consultancies, public institutions, brand strategy teams, or pursue doctoral research worldwide.',
        it: 'Coordinamento di processi complessi in società di consulenza, enti pubblici, team di strategia o prosecuzione verso il Dottorato di Ricerca.'
      },
      roles: 'Design Project Manager · Innovation Strategist · Design Researcher'
    }
  ],

  /* ---------- 4. FAQ ---------- */
  faqs: [
    {
      q: { en: 'Is DBE really taught 100% in English?', it: 'Il corso DBE è davvero interamente in inglese?' },
      a: {
        en: 'Yes. All lectures, design studios, reviews, exams, and your final Master’s thesis are held in English. Minimum B2 proficiency is required at admission. If you do not have a formal certificate (IELTS, TOEFL, or Cambridge), the Admissions Committee evaluates your English directly during the admission interview.',
        it: 'Sì. Tutte le lezioni, i laboratori, le revisioni, gli esami e la tesi finale si svolgono interamente in lingua inglese. È richiesto almeno il livello B2: in assenza di certificazione formale, la competenza può essere verificata tramite colloquio con la commissione.'
      }
    },
    {
      q: { en: 'Is there an enrollment cap (numero chiuso)?', it: 'Il corso è a numero chiuso?' },
      a: {
        en: 'No local numerical cap applies (eliminated by Rectoral Decree no. 2360/2017). Admission is open to all candidates who meet the academic degree requirements (at least 180 ECTS in eligible classes or equivalent foreign degree), B2 English, and pass the Admissions Committee evaluation.',
        it: 'No, il numero programmato locale è stato eliminato (D.R. 2360/2017). L’accesso è aperto a tutti i candidati in possesso dei requisiti curriculari, del livello B2 di inglese e che superano la valutazione della commissione di ammissione.'
      }
    },
    {
      q: { en: 'When do I choose between Exhibit Design and Digital Design?', it: 'Quando si sceglie tra Exhibit Design e Digital Design?' },
      a: {
        en: 'After your shared 1st year (60 ECTS). Everyone completes the same multidisciplinary foundation covering Industrial Design, Interior Design, Web Design, Visual Expression, Structures & Materials, History, and Circular Supply Chain, then specializes in Year 2.',
        it: 'Al termine del primo anno comune (60 CFU). Tutti gli studenti costruiscono le stesse basi multidisciplinari (Industrial, Interior, Web, Espressione Visiva, Materiali, Storia e Filiera Circolare) e scelgono la specializzazione al secondo anno.'
      }
    },
    {
      q: { en: 'How much are tuition fees at Federico II?', it: 'Quanto costano le tasse universitarie alla Federico II?' },
      a: {
        en: 'As an Italian public university, Federico II calculates annual tuition progressively based on family income (ISEE). Students with ISEE below the public exemption threshold (No-Tax Area) pay only the regional fee and stamp duty (around €156/year). Regional scholarships (ADISURC Campania) also cover tuition, housing, and meals for eligible Italian and international students.',
        it: 'Essendo un’università statale, la Federico II calcola le tasse in modo progressivo in base all’ISEE universitario. Gli studenti in No-Tax Area pagano solo la tassa regionale e il bollo (circa 156€/anno). Sono inoltre disponibili le borse di studio ADISURC Campania.'
      }
    },
    {
      q: { en: 'Do I need a Portfolio to apply?', it: 'Serve un Portfolio per fare domanda?' },
      a: {
        en: 'For Extra-EU international applicants, a Portfolio is mandatory alongside your Motivation Letter, CV, Academic Transcripts, Bachelor Certificate, English certificate, Passport, and a Professor’s Reference Letter. For Italian and EU graduates from directly eligible classes (L-04, L-17, and others), check the current call on Segrepass; presenting a strong portfolio is always recommended if coming from related fields.',
        it: 'Per i candidati Extra-UE il Portfolio è obbligatorio insieme a Lettera Motivazionale, CV, certificati di laurea ed esami in inglese, attestato B2, passaporto e lettera di presentazione di un docente. Per i candidati italiani o UE provenienti da classi affini è sempre consigliato prepararlo per la valutazione curriculare.'
      }
    },
    {
      q: { en: 'When do 2026/2027 classes start, and where are they held?', it: 'Quando iniziano le lezioni 2026/2027 e dove si tengono?' },
      a: {
        en: 'According to the official 2026/2027 First Semester Timetable, 1st year classes run from October 5, 2026 to January 22, 2027, and 2nd year classes run from September 14 to December 18, 2026. All DBE studios take place in historic Palazzo Gravina (Via Monteoliveto 3, 2nd floor, Rooms 18, 19, 21) in the heart of Naples.',
        it: 'Secondo il calendario ufficiale 2026/2027, le lezioni del 1° anno iniziano il 5 ottobre 2026 (fino al 22 gennaio 2027) e quelle del 2° anno il 14 settembre 2026 (fino al 18 dicembre 2026). Tutti i laboratori si svolgono a Palazzo Gravina (Via Monteoliveto 3, 2° piano, Aule 18, 19, 21) nel centro storico di Napoli.'
      }
    },
    {
      q: { en: 'Can I do an Erasmus+ exchange or international internship?', it: 'Posso fare Erasmus+ o tirocinio all’estero?' },
      a: {
        en: 'Yes! DiARC maintains dozens of active Erasmus+ partnerships with leading European architecture and design schools. You can spend a semester abroad for study or complete your mandatory 6 ECTS Traineeship in an international studio through Erasmus+ Traineeship (Erasmus referent: Prof. Cristina Mattiucci).',
        it: 'Certamente! Il DiARC ha decine di accordi Erasmus+ attivi con prestigiose scuole europee di architettura e design. Puoi svolgere un semestre di studio all’estero oppure il tirocinio obbligatorio (6 CFU) in uno studio europeo tramite Erasmus+ Traineeship (referente: Prof. Cristina Mattiucci).'
      }
    }
  ],

  /* ---------- 5. STICKER CATALOG (VERIFIED FACE-BY-FACE MATCH!) ---------- */
  stickers: [
    { id: 'eyebrow', label: { en: 'Skeptical', it: 'Scettico' }, src: 'assets/svg/sticker-eyebrow.svg', isBadge: false },
    { id: 'classic', label: { en: 'Curious', it: 'Curioso' }, src: 'assets/svg/sticker-classic.svg', isBadge: false },
    { id: 'intense', label: { en: 'Unbothered', it: 'Rilassato' }, src: 'assets/svg/sticker-intense.svg', isBadge: false },
    { id: 'wide', label: { en: 'Surprised', it: 'Sorpreso' }, src: 'assets/svg/sticker-wide.svg', isBadge: false },
    { id: 'joy', label: { en: 'Determined', it: 'Determinato' }, src: 'assets/svg/sticker-joy.svg', isBadge: false },
    { id: 'peek', label: { en: 'Peeking', it: 'Sbirciando' }, src: 'assets/svg/sticker-peek.svg', isBadge: false },
    { id: 'calm', label: { en: 'Sleepy', it: 'Assonnato' }, src: 'assets/svg/sticker-calm.svg', isBadge: false },
    { id: 'squint', label: { en: 'Suspicious', it: 'Sospettoso' }, src: 'assets/svg/sticker-squint.svg', isBadge: false },
    { id: 'shy', label: { en: 'Happy', it: 'Felice' }, src: 'assets/svg/sticker-shy.svg', isBadge: false },
    { id: 'badge-red', label: { en: 'Red Relaxed Badge', it: 'Badge Rosso Rilassato' }, src: 'assets/svg/badge-red-intense.svg', isBadge: true },
    { id: 'badge-blue', label: { en: 'Blue Skeptical Badge', it: 'Badge Blu Scettico' }, src: 'assets/svg/badge-blue-eyebrow.svg', isBadge: true },
    { id: 'badge-yellow', label: { en: 'Yellow Peeking Badge', it: 'Badge Giallo Sbirciando' }, src: 'assets/svg/badge-yellow-peek.svg', isBadge: true },
    { id: 'badge-cyan', label: { en: 'Cyan Surprised Badge', it: 'Badge Ciano Sorpreso' }, src: 'assets/svg/badge-cyan-wide.svg', isBadge: true },
    { id: 'badge-red2', label: { en: 'Red Determined Badge', it: 'Badge Rosso Determinato' }, src: 'assets/svg/badge-red-joy.svg', isBadge: true },
    { id: 'badge-blue2', label: { en: 'Blue Curious Badge', it: 'Badge Blu Curioso' }, src: 'assets/svg/badge-blue-classic.svg', isBadge: true }
  ],

  /* ---------- 6. BILINGUAL UI COPY (EN DEFAULT + IT, ZERO AI DASHES!) ---------- */
  i18n: {
    en: {
      nav_program: 'Program',
      nav_directions: 'Directions',
      nav_plan: 'Study Plan',
      nav_admissions: 'Admissions',
      nav_campus: 'Campus',
      nav_contacts: 'Contacts',
      nav_apply: 'Apply 26/27',
      hero_edition: 'A.Y. 2026 / 2027 · OPEN ACCESS (LM-12)',
      hero_subtitle: 'International Master of Science',
      hero_cta_apply: 'How to Apply 2026/27 →',
      hero_cta_plan: 'Explore 120 ECTS Study Plan',
      hero_cta_lens: 'Try Acetate Filter',
      fact_header: 'COURSE OVERVIEW · CODE DB1',
      fact_degree_k: 'Degree',
      fact_degree_v: 'MSc, Laurea Magistrale (LM-12 R)',
      fact_dur_k: 'Duration',
      fact_dur_v: '2 Years, 120 ECTS (CFU)',
      fact_lang_k: 'Language',
      fact_lang_v: '100% English (min. B2)',
      fact_tracks_k: '2nd Year',
      fact_tracks_v: 'Exhibit Design / Digital Design',
      fact_venue_k: 'Campus',
      fact_venue_v: 'Palazzo Gravina, Naples',
      fact_intake_k: '26/27 Start',
      fact_intake_v: 'Extra-EU: Feb 15 · IT: Sep 1 · Lessons: Oct 5',
      ribbon_1_k: '01 / PROSPECTIVE STUDENTS',
      ribbon_1_t: '26/27 Admissions & Checklist',
      ribbon_2_k: '02 / CURRICULA',
      ribbon_2_t: 'Exhibit vs Digital (Acetate Lens)',
      ribbon_3_k: '03 / COMPLETE MANIFESTO',
      ribbon_3_t: 'All 120 ECTS Courses & Professors',
      ribbon_4_k: '04 / PRACTICAL INFO',
      ribbon_4_t: 'Mirror Booth, Venue & Contacts',
      spread_quote: 'Here, design is not just about how things look. It’s about understanding how they work, how people interact with them and how they can be transformed.',
      spread_h2: 'A SPACE IS NEVER JUST A SPACE.',
      spread_p1: 'The world around us is constantly evolving. Spaces, objects, technologies and human behaviours shape the environments we experience every day.',
      spread_p2: 'Design for the Built Environment explores these connections through a multidisciplinary approach at DiARC, University of Naples Federico II, combining design culture with technological, social and creative knowledge.',
      pillar1_t: 'Multidisciplinary DNA',
      pillar1_d: 'Architecture, industrial design, engineering, visual arts and digital media under one roof.',
      pillar2_t: 'Studio Driven',
      pillar2_d: 'Over 60% hands-on integrated studios, workshops, prototyping and 15 ECTS synthesis ateliers.',
      pillar3_t: 'Global in Naples',
      pillar3_d: '100% English international cohort inside a 16th century palace in historic Naples.',
      acetate_kicker: '02 · INTERACTIVE EDITORIAL SPREAD (PAGES 04 & 05)',
      acetate_h2: 'ONE DEGREE. TWO DIRECTIONS.',
      acetate_lead: 'Just like the red and blue acetate sheets in our printed editorial, pick a color filter below, or drag the optical lens directly across the overlapping text and mascots, to decode Exhibit Design and Digital Design.',
      mode_both: 'Overlapped Print',
      mode_red: 'Red Acetate (Exhibit)',
      mode_blue: 'Blue Acetate (Digital)',
      pocket_red: 'PICK THE RED TO READ THE EXHIBIT PART',
      pocket_blue: 'PICK THE BLUE TO READ THE DIGITAL PART',
      pocket_click: 'Click or drag across spread',
      ana_intro: 'Your journey begins with a shared foundation in industrial design, visual communication, materials, technology and spatial thinking. After the first year, you choose between two specialised paths: Exhibit Design and Digital Design.',
      copy_exhibit: 'Choose Exhibit if design, to you, means matter, light, and stage. If you imagine environments people actually walk through, places that tell a story before a single word is read. In your second year, you dive into museum layouts, temporary and pop-up spaces, interiors, retail, and cultural heritage. You’ll work with lighting design, museography, parametric modeling, and digital manufacturing to turn bold concepts into physical installations and built spaces.',
      copy_digital: 'Choose Digital if you’re drawn to what happens between people, screens, and systems. If you want to design products and services that don’t exist yet, but everyone will use tomorrow. In your second year, you focus on Interaction Design (UI/UX), digital aesthetics, Systemic Design, branding, web communication, while exploring scenarios across AR/VR, multimedia, and connected environments (IoT). You move beyond the visual surface to build the invisible architecture of meaningful user experiences.',
      skills_kicker: '03 · DIE-CUT WINDOW & EXPANDABLE FOLDOUT (PAGES 07 TO 09)',
      skills_h2: 'KNOWLEDGE AND COMPETENCIES',
      skills_btn_fold: 'Fold Sheet',
      skills_btn_unfold: 'Unfold 6 Skills',
      skills_bm_btn: 'Open Page Index',
      yellow_h3: 'Ideas are only the beginning.',
      yellow_p: 'Design is more than creativity. It requires the ability to research, experiment, communicate and solve complex problems. Throughout the programme, you develop the knowledge and technical skills to transform concepts into tangible solutions, from early research and visualisation to prototyping, testing and implementation.',
      plan_kicker: '04 · COMPLETE 2026/2027 STUDY PLAN (120 ECTS)',
      plan_h2: 'LESS TALK. MORE MAKING.',
      plan_intro: 'At DBE, ideas move beyond the page. Through design studios, practical workshops and project based activities, students explore new materials, technologies and creative processes. From concept development to prototyping and experimentation, learning becomes an active process of making, testing and improving.',
      method_1_t: 'Concept & Research',
      method_1_d: 'Analyze spaces, materials, and human habits before designing.',
      method_2_t: 'Hands-On Prototyping',
      method_2_d: 'Build physical scale models, CNC pieces, and interactive UI systems.',
      method_3_t: 'Critique & Real Briefs',
      method_3_d: 'Weekly studio reviews, industry workshops, and a mandatory traineeship.',
      plan_note: 'Official 2026/2027 teaching plan verified against corsi.unina.it (DB101, DB102, DB103). Click any course row to inspect its integrated modules, professors, and learning outcomes.',
      adm_kicker: '05 · ADMISSIONS & REQUIREMENTS 2026/2027 (PAGE 11 + TRACING SHEET)',
      adm_h2: 'CLEAR PATH TO ENROLLMENT.',
      adm_lead: 'Peel back the translucent tracing sheet below to inspect Federico II facts and admission requirements, then select your profile to get your personalized 2026/27 checklist.',
      vellum_slider_lbl: 'PEEL TRACING SHEET:',
      vellum_hint: 'Slide or click the tracing sheet to reveal Federico II stats and core requirements',
      campus_kicker: '06 · CAREERS, PALAZZO GRAVINA & FAQ',
      campus_h2: 'FROM PALAZZO GRAVINA TO THE WORLD.',
      campus_lead: 'Where DBE graduates work, where you’ll study in Naples, who coordinates the program, and clear answers to every practical question.',
      stickers_kicker: '07 · INTERACTIVE STICKER SHEET (PAGE 06)',
      stickers_h2: 'TAKE ME WITH YOU!',
      stickers_lead: 'All 9 editorial Mascotte expressions and 6 circular @dbe_federicosecondo badges extracted directly from our print sheet. Stamp, drag, compose your Naples postcard, and download it in high resolution PNG or PDF.',
      closing_h2: 'THE FUTURE NEEDS DESIGNERS. ARE YOU IN?',
      mirror_badge: 'PAGE 12 · INTERACTIVE MIRROR CARD',
      mirror_title: 'LOOK IN THE MIRROR. ARE YOU IN?',
      mirror_sub: 'Just like the reflective mirror sheet on the last page of our printed editorial, turn on your camera (or upload a portrait) to see the next DBE designer and save your card.',
      mirror_cam_btn: 'Turn On Mirror Camera',
      mirror_upload_btn: 'Upload a Photo',
      mirror_snap_btn: 'Take Portrait',
      mirror_retake_btn: 'Retake',
      mirror_stop_btn: 'Close Camera',
      ft_office: 'Student Affairs Office',
      ft_hq: 'DiARC Headquarters',
      ft_contact: 'Contact & Official Portals',
      ft_where: 'Where?',
      ft_hours_lbl: 'Open for students:',
      ft_hours_1: 'Mon, Wed, Fri · 09:00 to 12:00',
      ft_hours_2: 'Tue and Thu · 09:00 to 12:00 and 14:30 to 16:30'
    },
    it: {
      nav_program: 'Il Corso',
      nav_directions: 'Indirizzi',
      nav_plan: 'Piano Studi',
      nav_admissions: 'Ammissione',
      nav_campus: 'Sede & Carriere',
      nav_contacts: 'Contatti',
      nav_apply: 'Iscriviti 26/27',
      hero_edition: 'A.A. 2026 / 2027 · ACCESSO LIBERO (LM-12)',
      hero_subtitle: 'Laurea Magistrale Internazionale in Inglese',
      hero_cta_apply: 'Come Iscriversi 2026/27 →',
      hero_cta_plan: 'Esplora i 120 CFU',
      hero_cta_lens: 'Usa le Carte Acetato',
      fact_header: 'SCHEDA CORSO · CODICE DB1',
      fact_degree_k: 'Titolo',
      fact_degree_v: 'Laurea Magistrale MSc (LM-12 R)',
      fact_dur_k: 'Durata',
      fact_dur_v: '2 Anni, 120 CFU (ECTS)',
      fact_lang_k: 'Lingua',
      fact_lang_v: '100% Inglese (min. B2)',
      fact_tracks_k: '2° Anno',
      fact_tracks_v: 'Exhibit Design / Digital Design',
      fact_venue_k: 'Sede',
      fact_venue_v: 'Palazzo Gravina, Napoli',
      fact_intake_k: 'Calendario',
      fact_intake_v: 'Extra-UE: 15 Feb · IT: 1 Set · Lezioni: 5 Ott',
      ribbon_1_k: '01 / FUTURI STUDENTI',
      ribbon_1_t: 'Requisiti & Checklist 26/27',
      ribbon_2_k: '02 / CURRICULA',
      ribbon_2_t: 'Exhibit vs Digital (Filtro Acetato)',
      ribbon_3_k: '03 / MANIFESTO COMPLETO',
      ribbon_3_t: 'Tutti i 120 CFU, Moduli e Docenti',
      ribbon_4_k: '04 / INFO PRATICHE',
      ribbon_4_t: 'Specchio, Sede e Contatti',
      spread_quote: 'Qui il design non riguarda solo l’aspetto delle cose. Riguarda capire come funzionano, come le persone interagiscono con esse e come possono essere trasformate.',
      spread_h2: 'UNO SPAZIO NON È MAI SOLO UNO SPAZIO.',
      spread_p1: 'Il mondo attorno a noi evolve continuamente. Spazi, oggetti, tecnologie e comportamenti umani plasmano gli ambienti che viviamo ogni giorno.',
      spread_p2: 'Design for the Built Environment esplora queste connessioni con un approccio multidisciplinare al DiARC, Università Federico II, unendo cultura del progetto, tecnologia, società e creatività.',
      pillar1_t: 'DNA Multidisciplinare',
      pillar1_d: 'Architettura, industrial design, ingegneria, arti visive e media digitali sotto lo stesso tetto.',
      pillar2_t: 'Didattica Laboratoriale',
      pillar2_d: 'Oltre il 60% in laboratori integrati, workshop, prototipazione e atelier di sintesi da 15 CFU.',
      pillar3_t: 'Internazionale a Napoli',
      pillar3_d: 'Classe internazionale 100% in inglese in un palazzo rinascimentale nel cuore di Napoli.',
      acetate_kicker: '02 · DOPPIA PAGINA INTERATTIVA (PAGINE 04 E 05)',
      acetate_h2: 'UNA LAUREA. DUE DIREZIONI.',
      acetate_lead: 'Proprio come le carte acetato rossa e blu del nostro editoriale cartaceo, scegli un filtro qui sotto, oppure trascina la lente ottica sul testo e sulle mascotte, per leggere Exhibit Design e Digital Design.',
      mode_both: 'Stampa Sovrapposta',
      mode_red: 'Acetato Rosso (Exhibit)',
      mode_blue: 'Acetato Blu (Digital)',
      pocket_red: 'SCEGLI IL ROSSO PER LEGGERE EXHIBIT',
      pocket_blue: 'SCEGLI IL BLU PER LEGGERE DIGITAL',
      pocket_click: 'Clicca o trascina sulla pagina',
      ana_intro: 'Il percorso inizia con un primo anno comune su industrial design, comunicazione visiva, materiali, tecnologia e pensiero spaziale. Al secondo anno scegli la specializzazione: Exhibit Design o Digital Design.',
      copy_exhibit: 'Scegli Exhibit se per te il design è materia, luce e scena. Se immagini ambienti che le persone attraversano davvero, luoghi che raccontano una storia prima ancora di leggere una parola. Al secondo anno approfondisci allestimenti museali, spazi temporanei e pop-up, interni, retail e beni culturali: lavorerai con lighting design, museografia, modellazione parametrica e fabbricazione digitale per trasformare concept audaci in installazioni reali.',
      copy_digital: 'Scegli Digital se ti affascina ciò che accade tra persone, schermi e sistemi. Se vuoi progettare prodotti e servizi che oggi non esistono ancora ma che tutti useranno domani. Al secondo anno ti concentri su Interaction Design (UI/UX), estetica digitale, Systemic Design, branding e comunicazione web, esplorando scenari AR/VR, multimedia e ambienti connessi (IoT) per costruire l’architettura invisibile di esperienze significative.',
      skills_kicker: '03 · FINESTRA FUSTELLATA & PIEGHEVOLE GIALLO (PAGINE 07 / 09)',
      skills_h2: 'CONOSCENZE E COMPETENZE',
      skills_btn_fold: 'Richiudi Foglio',
      skills_btn_unfold: 'Espandi le 6 Skill',
      skills_bm_btn: 'Apri Indice Pagine',
      yellow_h3: 'Le idee sono solo l’inizio.',
      yellow_p: 'Il design è molto più della creatività. Richiede capacità di ricerca, sperimentazione, comunicazione e risoluzione di problemi complessi. Durante il corso sviluppi le competenze per trasformare i concept in soluzioni tangibili: dalla ricerca e visualizzazione fino a prototipazione, test e realizzazione.',
      plan_kicker: '04 · PIANO DI STUDI COMPLETO 2026/2027 (120 CFU)',
      plan_h2: 'LESS TALK. MORE MAKING.',
      plan_intro: 'A DBE le idee escono dalla pagina. Attraverso laboratori di progetto, workshop pratici e attività sperimentali, gli studenti esplorano materiali, tecnologie e processi creativi: dal concept al prototipo, imparare diventa fare, testare e migliorare.',
      method_1_t: 'Concept & Ricerca',
      method_1_d: 'Analisi di spazi, materiali e comportamenti prima di progettare.',
      method_2_t: 'Prototipazione Reale',
      method_2_d: 'Modelli fisici in scala, fabbricazione CNC e sistemi digitali interattivi.',
      method_3_t: 'Revisioni & Brief Reali',
      method_3_d: 'Revisioni settimanali in aula, workshop aziendali e tirocinio obbligatorio.',
      plan_note: 'Piano di studi ufficiale 2026/2027 verificato su corsi.unina.it (DB101, DB102, DB103). Clicca su ogni corso per aprire moduli integrati, docenti e obiettivi.',
      adm_kicker: '05 · AMMISSIONE E REQUISITI 2026/2027 (PAGINA 11 + CARTA LUCIDA)',
      adm_h2: 'ISCRIVERSI SENZA CONFUSIONE.',
      adm_lead: 'Solleva il foglio trasparente qui sotto per scoprire i numeri Federico II e i requisiti base, poi imposta il tuo profilo per ottenere subito la tua checklist personalizzata 2026/27.',
      vellum_slider_lbl: 'SFOGLIA CARTA LUCIDA:',
      vellum_hint: 'Scorri o clicca sul foglio trasparente per scoprire numeri Federico II e requisiti',
      campus_kicker: '06 · SBOCCHI, PALAZZO GRAVINA & FAQ',
      campus_h2: 'DA PALAZZO GRAVINA AL MONDO.',
      campus_lead: 'Dove lavorano i laureati DBE, dove si studia a Napoli, chi coordina il corso e risposte chiare a tutte le domande pratiche.',
      stickers_kicker: '07 · FOGLIO STICKERS INTERATTIVO (PAGINA 06)',
      stickers_h2: 'TAKE ME WITH YOU!',
      stickers_lead: 'Tutte le 9 espressioni della Mascotte e i 6 badge @dbe_federicosecondo estratti dal nostro editoriale. Attacca, sposta, componi la tua cartolina DBE Napoli e scaricala in PNG ad alta qualità o PDF.',
      closing_h2: 'IL FUTURO HA BISOGNO DI DESIGNER. CI SEI?',
      mirror_badge: 'PAGINA 12 · CARTA SPECCHIATA INTERATTIVA',
      mirror_title: 'GUARDATI ALLO SPECCHIO. CI SEI?',
      mirror_sub: 'Proprio come la carta specchiata nell’ultima pagina del nostro editoriale, attiva la fotocamera (oppure carica una foto) per specchiarti come futuro designer DBE e scaricare il tuo ritratto.',
      mirror_cam_btn: 'Attiva Fotocamera Specchio',
      mirror_upload_btn: 'Carica una Foto',
      mirror_snap_btn: 'Scatta Foto',
      mirror_retake_btn: 'Scatta di Nuovo',
      mirror_stop_btn: 'Chiudi Fotocamera',
      ft_office: 'Segreteria Studenti',
      ft_hq: 'Sede Dipartimento DiARC',
      ft_contact: 'Contatti & Portali Ufficiali',
      ft_where: 'Dove Siamo?',
      ft_hours_lbl: 'Orari di apertura studenti:',
      ft_hours_1: 'Lun, Mer, Ven · 09:00 alle 12:00',
      ft_hours_2: 'Mar e Gio · 09:00 alle 12:00 e 14:30 alle 16:30'
    }
  }
};
