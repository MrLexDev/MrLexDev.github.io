const datasetKeyFor = (language) => (language === 'es' ? 'langEs' : 'langEn');

const updateLanguageVisibility = (language) => {
    document.querySelectorAll('[data-lang]').forEach((element) => {
        const matchesLanguage = element.dataset.lang === language;
        element.classList.toggle('lang-hidden', !matchesLanguage);
        if (matchesLanguage) {
            element.removeAttribute('aria-hidden');
        } else {
            element.setAttribute('aria-hidden', 'true');
        }
    });
};

const updateLanguageHeadContent = (language) => {
    const key = datasetKeyFor(language);
    const titleElement = document.getElementById('page-title');
    const descriptionElement = document.getElementById('page-description');

    if (titleElement?.dataset[key]) {
        document.title = titleElement.dataset[key];
    }

    if (descriptionElement?.dataset[key]) {
        descriptionElement.setAttribute('content', descriptionElement.dataset[key]);
    }
};

const setActiveLanguageButton = (language, buttons) => {
    Object.values(buttons).forEach((button) => button?.classList.remove('active'));
    buttons[language]?.classList.add('active');
};

const initLanguageSwitcher = () => {
    const buttons = {
        en: document.getElementById('lang-en'),
        es: document.getElementById('lang-es'),
    };

    if (!buttons.en || !buttons.es) {
        return;
    }

    const applyLanguage = (language) => {
        updateLanguageVisibility(language);
        updateLanguageHeadContent(language);
        setActiveLanguageButton(language, buttons);
        document.documentElement.lang = language;
        localStorage.setItem('language', language);
    };

    buttons.en.addEventListener('click', () => applyLanguage('en'));
    buttons.es.addEventListener('click', () => applyLanguage('es'));

    const storedLanguage = localStorage.getItem('language');
    const initialLanguage = storedLanguage === 'es' ? 'es' : 'en';
    applyLanguage(initialLanguage);
};

const initMobileMenuToggle = () => {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!menuButton || !mobileMenu) {
        return;
    }

    const closeMenu = () => mobileMenu.classList.add('hidden');

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });
};

const initNavbarShadow = () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) {
        return;
    }

    const toggleShadow = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
        } else {
            navbar.classList.remove('shadow-lg');
        }
    };

    window.addEventListener('scroll', toggleShadow);
    toggleShadow();
};

const setCurrentYear = () => {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear().toString();
    }
};

const initCvToggle = () => {
    const cvDownload = document.getElementById('cvDownload');
    const cvToggle = document.getElementById('cvToggle');
    const cvButtonTextEs = document.getElementById('cvButtonTextEs');
    const cvButtonTextEn = document.getElementById('cvButtonTextEn');

    if (!cvDownload || !cvToggle || !cvButtonTextEs || !cvButtonTextEn) {
        return;
    }

    const labels = {
        traditional: {
            href: 'Alejandro_Garcia_GameDev_CV_2025_Human_NoNumber.pdf',
            es: 'Descargar CV Tradicional',
            en: 'Download Traditional CV',
        },
        atm: {
            href: 'Alejandro_Garcia_GameDev_CV_2025_NoNumber.pdf',
            es: 'Descargar CV ATM-friendly',
            en: 'Download ATM-friendly CV',
        },
    };

    const updateCvLink = () => {
        const option = cvToggle.checked ? labels.atm : labels.traditional;
        cvDownload.href = option.href;
        cvButtonTextEs.textContent = option.es;
        cvButtonTextEn.textContent = option.en;
    };

    cvToggle.addEventListener('change', updateCvLink);
    updateCvLink();
};

const initializePage = () => {
    initLanguageSwitcher();
    initMobileMenuToggle();
    initNavbarShadow();
    setCurrentYear();
    initCvToggle();
};

document.addEventListener('DOMContentLoaded', initializePage);
