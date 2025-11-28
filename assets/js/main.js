// --- 1. Lógica del Menú Móvil ---
const menuToggle = document.getElementById('menu-toggle');
const navbarSticky = document.getElementById('navbar-sticky');

if (menuToggle && navbarSticky) {
    menuToggle.addEventListener('click', () => {
        navbarSticky.classList.toggle('hidden');
    });
}

// --- 2. Lógica del Canvas Interactivo y MAGNETISMO ---
const canvas = document.getElementById('bg-canvas');
let ctx;
if (canvas) {
    ctx = canvas.getContext('2d');
}
let particlesArray;

// Función para ajustar el tamaño del canvas
function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Recalculate mouse radius if needed
    mouse.radius = (canvas.height / 100) * (canvas.width / 100);
    init();
}

let mouse = {
    x: null,
    y: null,
    radius: canvas ? (canvas.height / 100) * (canvas.width / 100) : 0
}

// Estado del "Imán" (Magnet)
let magnetState = {
    active: false,
    rect: null // Guardará las coordenadas de la tarjeta hovereada
};

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Configurar los triggers del imán
function setupMagnetTriggers() {
    const triggers = document.querySelectorAll('.magnet-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', () => {
            magnetState.active = true;
            magnetState.rect = trigger.getBoundingClientRect();
        });
        trigger.addEventListener('mouseleave', () => {
            magnetState.active = false;
            magnetState.rect = null;
        });
    });
}

// Actualizar coordenadas del imán al hacer scroll
window.addEventListener('scroll', () => {
    if (magnetState.active) {
        // Forzar reset temporal para evitar coordenadas desfasadas
        magnetState.active = false;
    }
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random() * 30) + 1;
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Movimiento base normal
        this.x += this.directionX;
        this.y += this.directionY;

        // Rebotes
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        // --- LÓGICA DE INTERACCIÓN ---

        if (magnetState.active && magnetState.rect) {
            // MODO IMÁN: Atraer al borde más cercano de la caja
            const rect = magnetState.rect;

            // 1. Encontrar el punto más cercano en el rectángulo (Clamp)
            let closestX = Math.max(rect.left, Math.min(this.x, rect.right));
            let closestY = Math.max(rect.top, Math.min(this.y, rect.bottom));

            // 2. Si el punto está DENTRO de la caja, forzarlo al borde más cercano
            // (Esto hace que los puntos delineen la caja en lugar de llenarla)
            if (this.x > rect.left && this.x < rect.right && this.y > rect.top && this.y < rect.bottom) {
                const distLeft = Math.abs(this.x - rect.left);
                const distRight = Math.abs(this.x - rect.right);
                const distTop = Math.abs(this.y - rect.top);
                const distBottom = Math.abs(this.y - rect.bottom);

                const minDist = Math.min(distLeft, distRight, distTop, distBottom);

                if (minDist === distLeft) closestX = rect.left;
                else if (minDist === distRight) closestX = rect.right;
                else if (minDist === distTop) closestY = rect.top;
                else closestY = rect.bottom;
            }

            // 3. Calcular distancia a ese punto del borde
            let dx = closestX - this.x;
            let dy = closestY - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Rango de atracción
            let magnetRange = 150;

            if (distance < magnetRange) {
                // Atraer suavemente
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (magnetRange - distance) / magnetRange;

                // Velocidad de atracción
                const attractionSpeed = 2.5;

                this.x += forceDirectionX * force * attractionSpeed;
                this.y += forceDirectionY * force * attractionSpeed;
            }

        } else {
            // MODO NORMAL: Repulsión del ratón
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                this.x -= directionX;
                this.y -= directionY;
            }
        }

        this.draw();
    }
}

function init() {
    if (!canvas) return;
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = '#38bdf8';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                if (ctx) {
                    ctx.strokeStyle = 'rgba(56, 189, 248,' + opacityValue * 0.15 + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    if (ctx && canvas) {
        ctx.clearRect(0, 0, innerWidth, innerHeight);
    }

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Eventos de ventana
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

// Inicialización segura
window.addEventListener('load', () => {
    resizeCanvas();
    setupMagnetTriggers(); // Iniciar los triggers
    animate();
});

// Fallback por si load ya ocurrió (común en algunos entornos de desarrollo)
if (document.readyState === 'complete') {
    resizeCanvas();
    setupMagnetTriggers();
    animate();
}

// --- 3. Lógica de Cambio de Idioma (Actualizada con tus datos) ---
const translations = {
    es: {
        nav: { home: "Inicio", about: "Sobre Mí", exp: "Trayectoria", skills: "Habilidades", projects: "Proyectos", contact: "Contacto" },
        hero: {
            role: "Programador de Gameplay",
            title_prefix: "Creando Experiencias",
            title_suffix: "De Juego Inmersivas",
            desc: "Transformo conceptos complejos en mecánicas jugables y código eficiente. Especializado en Unity y Unreal Engine con un enfoque en optimización y portabilidad a consolas.",
            cta_cv: "Descargar CV",
            cta_contact: "Contactar"
        },
        about: {
            title: "Sobre",
            title_span: "Mí",
            p1: "Hola, soy Alejandro. Soy un Programador de Gameplay con base en Castellón, España. Mi viaje comenzó creando juegos simples en Scratch, y ahora envío builds semanales para prototipos multijugador complejos.",
            p2: "Tengo experiencia porteando títulos como 'Sea Horizon' a PS4, PS5 y Xbox. Me impulsa dominar tecnologías emergentes y escribir código limpio. He mejorado los tiempos de QA un 40% y aumentado los FPS un 15% mediante optimización.",
            check1: "Portabilidad Consolas (PS/Xbox)",
            check2: "Optimización de Rendimiento",
            check3: "Redes Multijugador",
            check4: "Desarrollo de Herramientas"
        },
        exp: {
            title: "Mi",
            title_span: "Trayectoria",
            item1_role: "Unity Developer",
            item1_date: "Dic 2024 - Presente",
            item1_desc: "Desarrollo de sistemas de trucos acelerando el QA un 40%. Creación de herramientas de localización reduciendo la iteración un 60%. Implementación de sistemas de encuentros basados en datos para <a href='https://riseoftheoverlords.com/' target='_blank' class='text-tech-primary hover:underline'>Rise of the Overlords</a>.",
            item2_role: "Unreal Developer",
            item2_date: "Ene 2023 - Nov 2024",
            item2_desc: "Creación de un Battle Royale de 100 jugadores en UE5. Portabilidad de <a href='https://catnessgames.com/es/juegos/sea-horizon/' target='_blank' class='text-tech-primary hover:underline'>Sea Horizon</a> a consolas. Migración a UE 5.3 con ganancia de +15% FPS. Sistemas de inventario replicados.",
            item3_role: "Grado en Diseño y Desarrollo de Videojuegos",
            item3_date: "Sep 2019 - Jun 2023",
            item3_desc: "Formación especializada en diseño, programación y gráficos. Incluye concentración en Ingeniería de Software (2020-2021)."
        },
        skills: {
            title: "Stack",
            title_span: "Tecnológico"
        },
        projects: {
            title: "Proyectos",
            title_span: "Destacados",
            p1_desc: "Juego de exploración fractal generado proceduralmente. Implementación de algoritmos de raymarching personalizados en shaders de Unity usando HLSL para geometrías complejas en tiempo real.",
            p2_desc: "Experiencia de sigilo narrativo creada en 48h para la Game Off jam. Scripting de gameplay y lógica visual usando Blueprints y C++ en UE5.",
            p3_desc: "Un juego único con niveles peculiares y jugabilidad dispar en mundos diversos. Desarrollado con herramientas 'obsoletas' en un entorno distópico.",
            btn: "Ver Detalles",
            btn_demo: "Jugar Demo"
        },
        contact: {
            title: "¿Hablamos?",
            desc: "Estoy disponible para oportunidades freelance o para unirme a un gran equipo. Si tienes un proyecto en mente, contáctame.",
            name: "Nombre",
            msg: "Mensaje",
            btn: "Enviar Mensaje"
        },
        footer: "Todos los derechos reservados.",
        fractalia: {
            title: "Demo Web de Fractalia",
            desc: "Interactúa con la demo de Fractalia alojada en itch.io directamente en tu navegador. Para la mejor experiencia, expande el embed de abajo o ábrela en una nueva pestaña.",
            fallback: "Si el embed no carga, puedes <a href='https://mrlexdev.itch.io/fractalia' target='_blank' rel='noopener' class='text-tech-primary hover:underline'>jugar Fractalia directamente en itch.io</a>."
        }
    },
    en: {
        nav: { home: "Home", about: "About Me", exp: "Career", skills: "Skills", projects: "Projects", contact: "Contact" },
        hero: {
            role: "Gameplay Programmer",
            title_prefix: "Building Immersive",
            title_suffix: "Game Experiences",
            desc: "I transform complex concepts into playable mechanics and efficient code. Specialized in Unity and Unreal Engine with a focus on optimization and console porting.",
            cta_cv: "Download CV",
            cta_contact: "Contact Me"
        },
        about: {
            title: "About",
            title_span: "Me",
            p1: "Hi, I'm Alejandro. I am a Gameplay Programmer based in Castellón, Spain. My journey started with creating simple games in Scratch, and now I'm shipping weekly builds for complex multiplayer prototypes.",
            p2: "I have experience porting titles like 'Sea Horizon' to PS4, PS5, and Xbox. I am driven by mastering emerging technologies and writing clean, maintainable code. I've improved QA turnaround times by 40% and boosted frame rates by 15% through optimization.",
            check1: "Console Porting (PS/Xbox)",
            check2: "Performance Optimization",
            check3: "Multiplayer Networking",
            check4: "Tool Development"
        },
        exp: {
            title: "My",
            title_span: "Journey",
            item1_role: "Unity Developer",
            item1_date: "Dec 2024 - Present",
            item1_desc: "Built in-game Cheat Systems accelerating QA by 40%. Developed localization tools cutting iteration time by 60%. Implemented data-driven encounter systems for <a href='https://riseoftheoverlords.com/' target='_blank' class='text-tech-primary hover:underline'>Rise of the Overlords</a>.",
            item2_role: "Unreal Developer",
            item2_date: "Jan 2023 - Nov 2024",
            item2_desc: "Built a 100-player battle-royale in UE5. Ported <a href='https://catnessgames.com/games/sea-horizon/' target='_blank' class='text-tech-primary hover:underline'>Sea Horizon</a> to PS4, PS5, and Xbox. Migrated projects to UE 5.3 yielding +15% FPS gain. Implemented replicated inventory systems.",
            item3_role: "BSc, Design and Development of Videogames",
            item3_date: "Sep 2019 - Jun 2023",
            item3_desc: "Specialized training in game design, programming, and graphics. Included a concentration in Software Engineering (2020-2021)."
        },
        skills: {
            title: "Tech",
            title_span: "Stack"
        },
        projects: {
            title: "Featured",
            title_span: "Projects",
            p1_desc: "Procedurally generated fractal exploration game. Implemented custom raymarching algorithms in Unity shaders using HLSL to render complex geometries in real-time.",
            p2_desc: "Narrative-stealth experience created in 48h for Game Off jam. Handled gameplay scripting and visual logic using Blueprints and C++ in UE5.",
            p3_desc: "A unique game featuring quirky levels with mismatched gameplay across diverse worlds. Developed using obsolete tools in a dystopian setting.",
            btn: "View Details",
            btn_demo: "Play Demo"
        },
        contact: {
            title: "Let's Talk?",
            desc: "I am available for freelance opportunities or to join a great team. If you have a project in mind, get in touch.",
            name: "Name",
            msg: "Message",
            btn: "Send Message"
        },
        footer: "All rights reserved.",
        fractalia: {
            title: "Fractalia Web Demo",
            desc: "Interact with the Fractalia demo hosted on itch.io directly in your browser. For the best experience, expand the embed below or open it in a new tab.",
            fallback: "If the embed does not load, you can <a href='https://mrlexdev.itch.io/fractalia' target='_blank' rel='noopener' class='text-tech-primary hover:underline'>play Fractalia directly on itch.io</a>."
        }
    }
};

let currentLang = 'en'; // Default a inglés para ser más internacional
const langToggleBtn = document.getElementById('lang-toggle');
const langText = document.getElementById('current-lang-text');

function updateContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let value = translations[currentLang];
        keys.forEach(key => {
            if (value) value = value[key];
        });

        if (value) {
            // Si es un input o textarea, cambiamos el placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                // Para etiquetas label
                if (element.getAttribute('for')) {
                    element.textContent = value;
                }
            } else {
                // Usamos innerHTML para permitir enlaces dentro de las traducciones
                element.innerHTML = value;
            }
        }
    });

    // Actualizar texto del botón
    langText.textContent = currentLang === 'es' ? 'ES' : 'EN';
}

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    updateContent();
});

// Inicializar textos
updateContent();
