document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const progressBar = document.getElementById('progress-bar');
    const fontSizeDecrease = document.getElementById('font-size-decrease');
    const fontSizeIncrease = document.getElementById('font-size-increase');
    const fontFamilySelect = document.getElementById('font-family-select');
    const startReadingButton = document.getElementById('start-reading');
    const bookCover = document.getElementById('book-cover');
    const firstChapter = document.getElementById('chapter1'); // ID do primeiro capítulo

    // --- 1. Tema Claro/Escuro ---
    // Tenta carregar o tema salvo ou usa a preferência do sistema
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark'); // Padrão se o sistema preferir escuro
    } else {
        body.setAttribute('data-theme', 'light'); // Padrão light
    }
    // Atualiza os ícones do botão imediatamente com base no tema definido
    updateThemeIcons();

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme); // Salva a preferência do usuário
        updateThemeIcons(); // Atualiza os ícones após a mudança
    });

    function updateThemeIcons() {
        if (body.getAttribute('data-theme') === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // --- 2. Controle de Fonte (Tamanho e Tipo) ---
    // Recupera o tamanho e tipo de fonte salvos ou define padrões
    let currentFontSize = parseFloat(localStorage.getItem('fontSize') || '1.1'); // Padrão 1.1rem
    let currentFontFamily = localStorage.getItem('fontFamily') || 'Merriweather'; // Padrão 'Merriweather'

    function applyFontSettings() {
        // Aplica o tamanho da fonte
        body.style.setProperty('--base-font-size', `${currentFontSize}rem`);
        localStorage.setItem('fontSize', currentFontSize);

        // Aplica o tipo de fonte
        if (currentFontFamily === 'Merriweather') {
            body.style.fontFamily = 'var(--font-primary)';
        } else if (currentFontFamily === 'Open Sans') {
            body.style.fontFamily = 'var(--font-secondary)';
        } else if (currentFontFamily === 'monospace') {
            body.style.fontFamily = 'var(--font-monospace)';
        }
        localStorage.setItem('fontFamily', currentFontFamily);
        fontFamilySelect.value = currentFontFamily; // Sincroniza o select
    }

    // Aplica as configurações salvas ao carregar
    applyFontSettings();

    fontSizeIncrease.addEventListener('click', () => {
        currentFontSize = Math.min(currentFontSize + 0.1, 1.5); // Limite máximo
        applyFontSettings();
    });

    fontSizeDecrease.addEventListener('click', () => {
        currentFontSize = Math.max(currentFontSize - 0.1, 0.9); // Limite mínimo
        applyFontSettings();
    });

    fontFamilySelect.addEventListener('change', (event) => {
        currentFontFamily = event.target.value;
        applyFontSettings();
    });

    // --- 3. Barra de Progresso de Leitura ---
    function updateProgressBar() {
        // Calcula a altura total da página menos a altura da viewport
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = document.documentElement.scrollTop;
        
        // Evita divisão por zero para páginas muito curtas
        if (scrollHeight === 0) {
            progressBar.style.width = '100%';
            return;
        }

        const progress = (scrolled / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Atualiza ao carregar a página

    // --- 4. Botão "Começar a Ler" e Salvar Posição de Leitura ---
    startReadingButton.addEventListener('click', () => {
        if (firstChapter) {
            firstChapter.scrollIntoView({
                behavior: 'smooth'
            });
            // Oculta a capa (opcional, ou pode ser apenas rolagem)
            // bookCover.style.display = 'none'; 
            // Ou, para uma transição mais suave, você pode adicionar uma classe CSS que oculta a capa
        }
    });

    // Salvar e Restaurar Posição de Leitura
    const saveReadingPosition = () => {
        localStorage.setItem('scrollPosition', window.scrollY);
    };

    const restoreReadingPosition = () => {
        const savedPosition = localStorage.getItem('scrollPosition');
        if (savedPosition) {
            // Usa setTimeout para garantir que o layout esteja pronto antes de rolar
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
            }, 100); 
        }
    };

    window.addEventListener('beforeunload', saveReadingPosition);
    restoreReadingPosition(); // Restaura ao carregar

    // --- Acessibilidade ---
    // `alt` text para a imagem da capa é definido no HTML
    // O contraste é gerenciado pelas variáveis CSS do tema.
    // Os botões de controle de fonte e tema têm `aria-label`.
});
