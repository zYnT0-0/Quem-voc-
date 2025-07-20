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

    // NOVO: Elementos do Modal de Comentários
    const openCommentsBtn = document.getElementById('open-comments-btn');
    const commentsModalOverlay = document.getElementById('comments-modal-overlay');
    const closeCommentsBtn = document.getElementById('close-comments-btn');
    const commentsIframe = document.getElementById('comments-iframe');

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
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons();
    });

    function updateThemeIcons() {
        if (body.getAttribute('data-theme') === 'dark') {
            sunIcon.classList.remove('active');
            moonIcon.classList.add('active');
        } else {
            sunIcon.classList.add('active');
            moonIcon.classList.remove('active');
        }
    }

    // --- 2. Ajuste de Tamanho da Fonte ---
    fontSizeDecrease.addEventListener('click', () => {
        const currentSize = parseFloat(getComputedStyle(body).fontSize);
        body.style.fontSize = `${Math.max(0.8, currentSize / 1.1)}px`; // Diminui, com mínimo
        localStorage.setItem('fontSize', body.style.fontSize);
    });

    fontSizeIncrease.addEventListener('click', () => {
        const currentSize = parseFloat(getComputedStyle(body).fontSize);
        body.style.fontSize = `${currentSize * 1.1}px`; // Aumenta
        localStorage.setItem('fontSize', body.style.fontSize);
    });

    // Restaura tamanho da fonte salvo
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        body.style.fontSize = savedFontSize;
    }

    // --- 3. Seleção de Família da Fonte ---
    fontFamilySelect.addEventListener('change', (event) => {
        const selectedFont = event.target.value;
        body.style.fontFamily = `var(--font-${selectedFont.replace(/\s/g, '')})`; // Adapta para variáveis CSS
        localStorage.setItem('fontFamily', selectedFont);
    });

    // Restaura família da fonte salva
    const savedFontFamily = localStorage.getItem('fontFamily');
    if (savedFontFamily) {
        fontFamilySelect.value = savedFontFamily;
        body.style.fontFamily = `var(--font-${savedFontFamily.replace(/\s/g, '')})`;
    }

    // --- 4. Barra de Progresso de Leitura ---
    function updateProgressBar() {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar(); // Atualiza ao carregar a página

    // --- 5. Botão "Começar a Ler" e Salvar Posição de Leitura ---
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

    // --- 6. Funcionalidade do Modal de Comentários ---
    openCommentsBtn.addEventListener('click', () => {
        commentsModalOverlay.classList.add('active');
        // Opcional: Recarregar o iframe para garantir o conteúdo mais recente
        // commentsIframe.src = commentsIframe.src; 
    });

    closeCommentsBtn.addEventListener('click', () => {
        commentsModalOverlay.classList.remove('active');
    });

    // Fechar o modal clicando fora do conteúdo
    commentsModalOverlay.addEventListener('click', (event) => {
        if (event.target === commentsModalOverlay) {
            commentsModalOverlay.classList.remove('active');
        }
    });

    // --- Acessibilidade ---
    // `alt` text para a imagem da capa é definido no HTML
    // O contraste é gerenciado pelas variáveis CSS do tema.
    // Os botões de controle de fonte e tema têm `aria-label`.
});
