// ==========================================
// CINEMATIC DARK STUDIO — SCRIPT ENGINE
// ==========================================

// --- 1. Theme Management (Dark / Light) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');

function getPreferredTheme() {
  const storedTheme = localStorage.getItem('app-theme');
  if (storedTheme) return storedTheme;
  return 'dark'; // Option B default is dark
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('app-theme', theme);
  
  const icon = theme === 'dark' ? '☀' : '☾';
  if (themeToggleBtn) themeToggleBtn.textContent = icon;
  if (themeToggleMobile) themeToggleMobile.textContent = icon;
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

if (themeToggleMobile) {
  themeToggleMobile.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// Initial theme setup
setTheme(getPreferredTheme());


// --- 2. Mobile Menu Navigation ---
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Close menu when clicking nav links
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}


// --- 3. CV Dropdown ---
const cvDropdowns = document.querySelectorAll('[data-cv-dropdown]');

const cvFiles = {
  multiplayer: {
    en: 'CV/Alejandro_Garcia_Multiplayer_CV_2026.pdf',
    es: 'CV/Alejandro_Garcia_Multiplayer_CV_2026%20-%20Espa%C3%B1ol.pdf'
  },
  simulation: {
    en: 'CV/Alejandro_Garcia_Simulation_CV_2025.pdf',
    es: 'CV/Alejandro_Garcia_Simulation_CV_2025%20-%20Espa%C3%B1ol.pdf'
  }
};

function updateCvLinks(lang) {
  document.querySelectorAll('[data-cv]').forEach(link => {
    const key = link.getAttribute('data-cv');
    if (cvFiles[key] && cvFiles[key][lang]) {
      link.setAttribute('href', cvFiles[key][lang]);
    }
  });
}

cvDropdowns.forEach(dropdown => {
  const toggle = dropdown.querySelector('[data-cv-toggle]');
  if (!toggle) return;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const wasOpen = dropdown.classList.contains('open');

    cvDropdowns.forEach(d => {
      d.classList.remove('open');
      const t = d.querySelector('[data-cv-toggle]');
      if (t) t.setAttribute('aria-expanded', 'false');
    });

    if (!wasOpen) {
      dropdown.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
    }
  });

  dropdown.querySelectorAll('[data-cv-menu] a').forEach(link => {
    link.addEventListener('click', () => {
      dropdown.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});

document.addEventListener('click', (e) => {
  cvDropdowns.forEach(dropdown => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('open');
      const t = dropdown.querySelector('[data-cv-toggle]');
      if (t) t.setAttribute('aria-expanded', 'false');
    }
  });
});




// --- 4. Flagship Terminal: personal log stream ---
const terminalContent = document.getElementById('terminal-content');
const terminalFacts = [
  { tag: 'ship', html: `<a class="terminal-link" href="https://catnessgames.com/games/sea-horizon/" target="_blank" rel="noopener">Sea Horizon</a> <span class="terminal-ink">· PS4 / PS5 / Xbox Series port ✓</span>` },
  { tag: 'live', html: `<a class="terminal-link" href="https://store.steampowered.com/app/1162140/Rise_Of_The_Overlords/" target="_blank" rel="noopener">Rise of the Overlords</a> <span class="terminal-ink">· out on Steam ✓</span>` },
  { tag: 'demo', html: `<a class="terminal-link" href="https://mrlexdev.itch.io/fractalia" target="_blank" rel="noopener">Fractalia</a> <span class="terminal-ink">· GPU raymarching + analytic SDFs ✓</span>` },
  { tag: 'thesis', html: `<a class="terminal-link" href="https://youtu.be/S7lLfCrk1bQ" target="_blank" rel="noopener">Urban Traffic Simulation AI</a> <span class="terminal-ink">· multi-agent FSM ✓</span>` },
  { tag: 'roles', html: `<span class="terminal-ink">Catness Game Studios · Firescale Studios</span>` },
  { tag: 'edu', html: `<span class="terminal-ink">BSc Video Game Development · Universitat Jaume I</span>` },
  { tag: 'metrics', html: `<span class="terminal-ink">30+ TRC/XR fixes · QA turnaround −90% · 60 FPS steady</span>` },
  { tag: 'ping', html: `<a class="terminal-link" href="https://github.com/MrLexDev" target="_blank" rel="noopener">github.com/MrLexDev</a> <span class="terminal-ink">·</span> <a class="terminal-link" href="https://mrlexdev.itch.io/" target="_blank" rel="noopener">itch.io</a>` },
  { tag: 'hire', html: `<span class="terminal-ink">OPEN to gameplay / multiplayer / simulation roles</span> <span class="text-accent">●</span>` },
  { tag: 'mail', html: `<a class="terminal-link" href="mailto:AlejandroGaloDev@gmail.com">AlejandroGaloDev@gmail.com</a>` },
];

let baseTick = 1256;
let factIndex = 0;

function streamTerminalLog() {
  if (!terminalContent) return;

  const fact = terminalFacts[factIndex % terminalFacts.length];
  factIndex++;

  const newLine = document.createElement('div');
  newLine.innerHTML = `<span class="text-[var(--mute)]">[tick ${baseTick}]</span> <span class="text-accent">${fact.tag}</span> → ${fact.html}`;

  terminalContent.appendChild(newLine);
  if (terminalContent.children.length > 11) {
    terminalContent.removeChild(terminalContent.children[0]);
  }
}

if (terminalContent) {
  setInterval(streamTerminalLog, 2800);
}


// --- 5. Multi-Language (i18n) System ---
const translations = {
  en: {
    meta: {
      main_title: "Alejandro Galo — Gameplay, Multiplayer & Simulation Programmer",
      main_desc: "Portfolio of Alejandro Galo. Gameplay, Multiplayer & Simulation Programmer specializing in Unreal Engine 5, Unity, C++, Netcode Replication, Deterministic Systems, and Telemetry Tooling.",
      fractalia_title: "Fractalia — Real-Time GPU Raymarching & SDF Explorer | Alejandro Galo",
      fractalia_desc: "Playable real-time raymarched fractal demo in Unity WebGL using custom HLSL shaders and analytic Signed Distance Functions (SDFs). Engineered by Alejandro Galo."
    },
    nav: {
      brand_sub: "Gameplay, Multiplayer & Simulation Programmer",
      work: "Work",
      systems: "Systems",
      trajectory: "Trajectory",
      contact: "Contact",
      cv_btn: "CV ↓",
      cv_multiplayer: "Multiplayer CV",
      cv_sim: "Simulation CV"
    },
    hero: {
      status_avail: "OPEN TO GAMEPLAY, MULTIPLAYER & SIMULATION ROLES",
      status_loc: "Spain · Remote & Relocation",
      title_1: "Engineered for",
      title_2: "real-time.",
      desc: "I engineer gameplay, multiplayer and simulation systems in <strong class=\"text-ink\">Unreal Engine 5</strong> and <strong class=\"text-ink\">Unity</strong> — netcode replication, deterministic state synchronization, telemetry tooling, and GPU spatial computing. Experience at <strong class=\"text-ink\">Firescale Studios</strong> and <strong class=\"text-ink\">Catness Game Studios</strong>.",
      cta_systems: "See the systems →",
      cta_contact: "Email me",
      ticker_1: "Unreal 5 & Unity (C++ / C#)",
      ticker_2: "Replication & Deterministic State Sync",
      ticker_3: "Multi-Agent Simulation & Telemetry"
    },
    metrics: {
      col1_num: "100",
      col1_unit: "CONCURRENT ENTITIES",
      col1_desc: "dedicated-server stress tests",
      col2_num: "30+",
      col2_unit: "TRC / XR",
      col2_desc: "compliance fixes resolved",
      col3_num: "−90%",
      col3_unit: "PERCENT",
      col3_desc: "QA turnaround reduction",
      col4_num: "60",
      col4_unit: "FPS STEADY",
      col4_desc: "deterministic frame-time & memory"
    },
    flagship: {
      chip: "◆ FLAGSHIP SYSTEM",
      title_1: "Authoritative replication &",
      title_2: "deterministic state sync",
      title_3: "in UE5.",
      desc: "Engineered authority-driven state synchronization, replicated entity components, and deterministic gameplay logic in UE5 — validated with distributed stress tests on headless dedicated servers (~25 concurrent synchronized entities), profiling tick stability, RPC overhead, and bandwidth with Unreal Insights.",
      card1_title: "State Synchronization",
      card1_desc: "Authority-driven state sync, replicated entity components, and deterministic gameplay logic on dedicated servers.",
      card2_title: "Stress Testing & Profiling",
      card2_desc: "Distributed stress tests on headless servers (~25 concurrent entities): tick stability, RPC overhead, and bandwidth optimization.",
      card3_title: "Desync & Race Conditions",
      card3_desc: "Diagnosed state desynchronizations, edge-case race conditions, and network bottlenecks using Unreal Insights and telemetry tooling.",
      card4_title: "Observability & Tooling",
      card4_desc: "Runtime telemetry & diagnostics feeding custom tooling — profiling distributed systems to reproduce network edge cases deterministically."
    },
    projects: {
      title: "Selected work",
      count_chip: "04 projects",
      p1_sub: "Console port",
      p1_title: "Sea Horizon",
      p1_desc: "PS4 / PS5 / Xbox Series. Platform SDK integration, resolved 30+ TRC/XR platform compliance issues, and optimized memory budgets.",
      p2_sub: "Live Unity title",
      p2_title: "Rise of the Overlords",
      p2_desc: "Modular data-driven combat systems using C# and ScriptableObjects. In-engine cheat menu & tooling reduced QA turnaround by 90%.",
      p3_sub: "Real-time spatial computing",
      p3_title: "Fractalia",
      p3_desc: "GPU-accelerated volumetric rendering and spatial queries. Custom HLSL raymarching, analytic Signed Distance Functions (SDFs), and optimized sphere tracing on GPU compute passes.",
      p3_btn: "Play Web Demo →",
      p4_sub: "Bachelor's Thesis · Multi-Agent Simulation",
      p4_title: "Urban Traffic Simulation AI",
      p4_desc: "Autonomous vehicle agents (FSM) with spatial sensor queries simulating dynamic traffic flow, intersection priority rules, and reactive obstacle avoidance — optimized perception loops and raycasting for smooth multi-agent throughput."
    },
    trajectory: {
      chip: "◆ TIMELINE",
      title: "Trajectory.",
      item1_year: "Dec. 2024 — May 2026",
      item1_role: "Unity Gameplay & Systems Developer (C#)",
      item1_co: "Firescale Studios · Castellón, Spain",
      item1_desc: "Architected modular gameplay & engine systems with C#, Zenject DI, and ScriptableObjects — async asset streaming via Addressables, runtime diagnostics & telemetry tooling, Editor automation with data validation, and deterministic 60 FPS frame-time profiling.",
      item2_year: "Jan. 2023 — Nov. 2024",
      item2_role: "Multiplayer & Gameplay Programmer (C++)",
      item2_co: "Catness Game Studios · Hybrid, Spain",
      item2_desc: "Implemented networked gameplay mechanics with GAS, replicated inventories, and synchronized world states in UE5. Stress-tested dedicated servers (~25 concurrent entities), diagnosed desyncs & race conditions with Unreal Insights, and ported Sea Horizon to PS4/PS5/Xbox Series (30+ TRC/XR fixes, GDK).",
      item3_year: "Sept. 2019 — June 2023",
      item3_role: "BSc in Design & Development of Video Games",
      item3_co: "Universitat Jaume I · Castellón, Spain",
      item3_desc: "Specialization in Software Engineering and Real-Time Systems Architecture. Urban traffic simulation AI thesis."
    },
    contact: {
      chip: "◆ LET'S CONNECT",
      title_1: "Building something",
      title_2: "multiplayer or simulated?",
      desc: "I'm actively looking for gameplay, multiplayer, and simulation programming roles (Remote & Relocation). C++, C#, Unreal Engine 5, Unity, Netcode, Deterministic Systems, and Telemetry Tooling.",
      cta_email: "AlejandroGaloDev@gmail.com →",
      cta_cv: "Download CV"
    },
    footer: {
      copy: "© 2026 Alejandro García López (Alejandro Galo) · Spain",
      telemetry: "Tick 64Hz · RTT 00ms · Loss 0.0%",
      version: "v2.0.0"
    }
  },
  es: {
    meta: {
      main_title: "Alejandro Galo — Programador Gameplay, Multijugador & Simulación",
      main_desc: "Portfolio de Alejandro Galo. Programador Gameplay, Multijugador y Simulación especializado en Unreal Engine 5, Unity, C++, replicación de red, sistemas deterministas y telemetría.",
      fractalia_title: "Fractalia — Demo WebGL Raymarching en GPU y SDF | Alejandro Galo",
      fractalia_desc: "Demo jugable en tiempo real de fractal con raymarching en Unity WebGL usando shaders HLSL personalizados y funciones SDF analíticas. Desarrollado por Alejandro Galo."
    },
    nav: {
      brand_sub: "Programador Gameplay, Multijugador & Simulación",
      work: "Trabajos",
      systems: "Sistemas",
      trajectory: "Trayectoria",
      contact: "Contacto",
      cv_btn: "CV ↓",
      cv_multiplayer: "CV Multijugador",
      cv_sim: "CV Simulación"
    },
    hero: {
      status_avail: "DISPONIBLE PARA ROLES GAMEPLAY, MULTIJUGADOR Y SIMULACIÓN",
      status_loc: "España · Remoto & Reubicación",
      title_1: "Diseñado para",
      title_2: "real-time.",
      desc: "Desarrollo sistemas gameplay, multijugador y simulación en <strong class=\"text-ink\">Unreal Engine 5</strong> y <strong class=\"text-ink\">Unity</strong> — replicación de red, sincronización determinista de estado, herramientas de telemetría y computación espacial en GPU. Experiencia en <strong class=\"text-ink\">Firescale Studios</strong> y <strong class=\"text-ink\">Catness Game Studios</strong>.",
      cta_systems: "Ver los sistemas →",
      cta_contact: "Escríbeme",
      ticker_1: "Unreal 5 & Unity (C++ / C#)",
      ticker_2: "Replicación & Sincronización Determinista",
      ticker_3: "Simulación Multi-Agente & Telemetría"
    },
    metrics: {
      col1_num: "100",
      col1_unit: "ENTIDADES CONCURRENTES",
      col1_desc: "pruebas de estrés en servidores dedicados",
      col2_num: "30+",
      col2_unit: "TRC / XR",
      col2_desc: "incidencias resueltas en consolas",
      col3_num: "−90%",
      col3_unit: "POR CIENTO",
      col3_desc: "reducción tiempo de QA",
      col4_num: "60",
      col4_unit: "FPS ESTABLES",
      col4_desc: "frame-time determinista y memoria"
    },
    flagship: {
      chip: "◆ SISTEMA DESTACADO",
      title_1: "Replicación autoritativa y",
      title_2: "sincronización determinista",
      title_3: "en UE5.",
      desc: "Desarrollé sincronización de estado autoritativa, componentes de entidad replicados y lógica gameplay determinista en UE5 — validado con pruebas de estrés distribuidas en servidores dedicados headless (~25 entidades sincronizadas concurrentes), perfilando estabilidad del tick, overhead de RPCs y ancho de banda con Unreal Insights.",
      card1_title: "Sincronización de Estado",
      card1_desc: "Sincronización autoritativa de estado, componentes de entidad replicados y lógica gameplay determinista en servidores dedicados.",
      card2_title: "Pruebas de Estrés & Profiling",
      card2_desc: "Pruebas de estrés distribuidas en servidores headless (~25 entidades concurrentes): estabilidad del tick, overhead de RPCs y ancho de banda.",
      card3_title: "Desyncs & Condiciones de Carrera",
      card3_desc: "Diagnóstico de desincronizaciones de estado, condiciones de carrera y cuellos de botella de red con Unreal Insights y telemetría.",
      card4_title: "Observabilidad & Herramientas",
      card4_desc: "Telemetría y diagnóstico en ejecución conectados a herramientas internas — profiling de sistemas distribuidos para reproducir casos límite de red de forma determinista."
    },
    projects: {
      title: "Trabajos seleccionados",
      count_chip: "04 proyectos",
      p1_sub: "Port a consolas",
      p1_title: "Sea Horizon",
      p1_desc: "PS4 / PS5 / Xbox Series. Integración de SDKs de plataforma, resolución de más de 30 incidencias de conformidad TRC/XR y optimización de memoria.",
      p2_sub: "Título activo en Unity",
      p2_title: "Rise of the Overlords",
      p2_desc: "Sistemas de combate modulares guiados por datos con C# y ScriptableObjects. Menú de trucos y herramientas en el motor que redujeron el tiempo de QA un 90%.",
      p3_sub: "Computación espacial en tiempo real",
      p3_title: "Fractalia",
      p3_desc: "Renderizado volumétrico y consultas espaciales aceleradas por GPU. Raymarching con HLSL, Signed Distance Functions (SDFs) analíticas y sphere tracing optimizado en pases de cómpute GPU.",
      p3_btn: "Jugar Demo Web →",
      p4_sub: "Trabajo Fin de Grado · Simulación Multi-Agente",
      p4_title: "Urban Traffic Simulation AI",
      p4_desc: "Agentes de vehículos autónomos (FSM) con consultas espaciales por sensores que simulan flujo de tráfico urbano dinámico, reglas de prioridad en intersecciones y esquiva reactiva de obstáculos — bucles de percepción y raycasting optimizados para un throughput multi-agente fluido."
    },
    trajectory: {
      chip: "◆ TRAYECTORIA",
      title: "Trayectoria.",
      item1_year: "Dic. 2024 — May. 2026",
      item1_role: "Desarrollador Unity Gameplay & Sistemas (C#)",
      item1_co: "Firescale Studios · Castellón, España",
      item1_desc: "Arquitectura de sistemas gameplay y de motor modulares con C#, inyección de dependencias (Zenject) y ScriptableObjects — streaming asíncrono de assets con Addressables, herramientas de diagnóstico y telemetría en ejecución, automatización de Editor con validación de datos y profiling de frame-time determinista a 60 FPS.",
      item2_year: "Ene. 2023 — Nov. 2024",
      item2_role: "Programador Multijugador & Gameplay (C++)",
      item2_co: "Catness Game Studios · Híbrido, España",
      item2_desc: "Implementación de mecánicas gameplay en red con GAS, inventarios replicados y sincronización de estados en UE5. Pruebas de estrés en servidores dedicados (~25 entidades concurrentes), diagnóstico de desyncs y condiciones de carrera con Unreal Insights, y port de Sea Horizon a PS4/PS5/Xbox Series (más de 30 fixes TRC/XR, GDK).",
      item3_year: "Sept. 2019 — Jun. 2023",
      item3_role: "Grado en Diseño y Desarrollo de Videojuegos",
      item3_co: "Universitat Jaume I · Castellón, España",
      item3_desc: "Mención en Ingeniería de Software y Arquitectura de Sistemas en Tiempo Real. Trabajo de fin de grado en simulación de tráfico urbano mediante IA.",
    },
    contact: {
      chip: "◆ CONECTEMOS",
      title_1: "¿Construyendo algo",
      title_2: "multijugador o simulado?",
      desc: "Busco activamente roles de programación gameplay, multijugador y simulación (Remoto & Reubicación). C++, C#, Unreal Engine 5, Unity, Netcode, Sistemas Deterministas y Telemetría.",
      cta_email: "AlejandroGaloDev@gmail.com →",
      cta_cv: "Descargar CV"
    },
    footer: {
      copy: "© 2026 Alejandro García López (Alejandro Galo) · España",
      telemetry: "Tick 64Hz · RTT 00ms · Pérdida 0.0%",
      version: "v2.0.0"
    }
  }
};

let currentLanguage = 'en';
const langToggleBtn = document.getElementById('lang-toggle');
const langToggleMobile = document.getElementById('lang-toggle-mobile');

function updatePageLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('app-lang', lang);
  document.documentElement.setAttribute('lang', lang);

  const langText = lang.toUpperCase();
  if (langToggleBtn) langToggleBtn.textContent = langText;
  if (langToggleMobile) langToggleMobile.textContent = langText;

  // Dynamic SEO title & description update
  const isFractalia = window.location.pathname.toLowerCase().includes('fractalia');
  const langMeta = translations[lang] && translations[lang].meta;
  if (langMeta) {
    const titleText = isFractalia ? langMeta.fractalia_title : langMeta.main_title;
    const descText = isFractalia ? langMeta.fractalia_desc : langMeta.main_desc;
    if (titleText) {
      document.title = titleText;
      const pageTitleEl = document.getElementById('page-title');
      if (pageTitleEl) pageTitleEl.textContent = titleText;
    }
    const descEl = document.getElementById('page-description') || document.querySelector('meta[name="description"]');
    if (descEl && descText) descEl.setAttribute('content', descText);
    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute('content', lang === 'es' ? 'es_ES' : 'en_US');
  }

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const keyPath = el.getAttribute('data-i18n').split('.');
    let translation = translations[lang];
    keyPath.forEach(k => {
      if (translation) translation = translation[k];
    });

    if (translation) {
      el.innerHTML = translation;
    }
  });

  updateCvLinks(lang);
}

if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    updatePageLanguage(currentLanguage === 'en' ? 'es' : 'en');
  });
}

if (langToggleMobile) {
  langToggleMobile.addEventListener('click', () => {
    updatePageLanguage(currentLanguage === 'en' ? 'es' : 'en');
  });
}

// Initial language setup
const storedLang = localStorage.getItem('app-lang') || 'en';
updatePageLanguage(storedLang);

