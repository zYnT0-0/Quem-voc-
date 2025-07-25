document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const progressBar = document.getElementById('progress-bar');
    const fontSizeDecrease = document.getElementById('font-size-decrease');
    const fontSizeIncrease = document.getElementById('font-size-increase');
    const bookCover = document.getElementById('book-cover'); // Não usado no JS, mas mantido
    const firstChapter = document.getElementById('chapter1'); // Não usado no JS, mas mantido

    // --- 1. Tema Claro/Escuro ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
    }

    updateThemeIcons();

    if (themeToggle) { // Verifica se o elemento existe antes de adicionar o listener
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons();
        });
    }

    function updateThemeIcons() {
        if (body.getAttribute('data-theme') === 'dark') {
            if (sunIcon) sunIcon.style.display = 'none';
            if (moonIcon) moonIcon.style.display = 'block';
        } else {
            if (sunIcon) sunIcon.style.display = 'block';
            if (moonIcon) moonIcon.style.display = 'none';
        }
    }

    // --- 2. Tamanho da Fonte ---
    let currentFontSize = parseFloat(localStorage.getItem('fontSize') || '1.1');
    function applyFontSize() {
        body.style.setProperty('--base-font-size', `${currentFontSize}rem`);
        localStorage.setItem('fontSize', currentFontSize);
    }

    applyFontSize();

    if (fontSizeIncrease) {
        fontSizeIncrease.addEventListener('click', () => {
            currentFontSize = Math.min(currentFontSize + 0.1, 1.5);
            applyFontSize();
        });
    }

    if (fontSizeDecrease) {
        fontSizeDecrease.addEventListener('click', () => {
            currentFontSize = Math.max(currentFontSize - 0.1, 0.9);
            applyFontSize();
        });
    }

    // --- 3. Barra de Progresso ---
    function updateProgressBar() {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = document.documentElement.scrollTop;

        if (progressBar) { // Verifica se o elemento existe
            if (scrollHeight === 0) {
                progressBar.style.width = '100%';
                return;
            }
            const progress = (scrolled / scrollHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();

    // --- 4. Restaurar posição de leitura ---
    const saveReadingPosition = () => {
        localStorage.setItem('scrollPosition', window.scrollY);
    };

    const restoreReadingPosition = () => {
        const savedPosition = localStorage.getItem('scrollPosition');
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
            }, 100);
        }
    };

    window.addEventListener('beforeunload', saveReadingPosition);
    restoreReadingPosition();

    // --- 5. Gerar Sumário ---
    const tocToggle = document.getElementById('toc-toggle');
    const tocList = document.getElementById('toc-list');
    const chapterTitles = document.querySelectorAll('.chapter-title');

    function generateTableOfContents() {
        if (tocList) { // Verifica se o elemento existe
            tocList.innerHTML = '';
            chapterTitles.forEach(chapter => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `#${chapter.id}`;
                a.textContent = chapter.textContent;
                li.appendChild(a);
                tocList.appendChild(li);

                a.addEventListener('click', (event) => {
                    event.preventDefault();
                    const targetId = event.target.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        const headerOffset = document.querySelector('header')?.offsetHeight || 0; // Pega a altura do header, ou 0 se não existir
                        const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                        const offsetPosition = elementPosition - headerOffset - 10;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });

                        tocList.classList.add('hidden');
                    }
                });
            });
        }
    }

    if (tocToggle) {
        tocToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            if (tocList) tocList.classList.toggle('hidden');
        });
    }

    document.addEventListener('click', (event) => {
        if (tocList && tocToggle) { // Verifica se os elementos existem
            if (!tocList.contains(event.target) && !tocToggle.contains(event.target)) {
                tocList.classList.add('hidden');
            }
        }
    });

    generateTableOfContents();

    // --- 6. Dropdown personalizado de fontes ---
    const customSelect = document.getElementById('custom-font-selector');
    if (customSelect) {
        const toggleBtn = customSelect.querySelector('.selected-font');
        const optionsList = customSelect.querySelector('.font-options');
        const options = optionsList.querySelectorAll('li');

        if (toggleBtn && optionsList) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                optionsList.classList.toggle('hidden');
            });

            options.forEach(option => {
                option.addEventListener('click', () => {
                    const selectedFont = option.textContent;
                    const fontValue = option.dataset.value;

                    toggleBtn.textContent = selectedFont;
                    optionsList.classList.add('hidden');

                    // Aplica a fonte ao body
                    if (fontValue === 'Merriweather') {
                        body.style.fontFamily = 'var(--font-primary)';
                        localStorage.setItem('fontFamily', 'Merriweather');
                    } else if (fontValue === 'Open Sans') {
                        body.style.fontFamily = 'var(--font-secondary)';
                        localStorage.setItem('fontFamily', 'Open Sans');
                    } else if (fontValue === 'monospace') {
                        body.style.fontFamily = 'var(--font-monospace)';
                        localStorage.setItem('fontFamily', 'monospace');
                    }
                });
            });

            // Corrigir conflito com o sumário e outros cliques
            document.addEventListener('click', (e) => {
                const isInsideFontMenu = customSelect.contains(e.target);
                const isTocToggle = e.target.id === 'toc-toggle' || e.target.closest('#toc-toggle');
                const isTocList = e.target.closest('#toc-list');

                if (!isInsideFontMenu && !isTocToggle && !isTocList) {
                    optionsList.classList.add('hidden');
                }
            });

            // Restaurar fonte ao carregar
            const savedFont = localStorage.getItem('fontFamily');
            if (savedFont) {
                if (savedFont === 'Merriweather') {
                    body.style.fontFamily = 'var(--font-primary)';
                    toggleBtn.textContent = 'Serifada (Padrão)';
                } else if (savedFont === 'Open Sans') {
                    body.style.fontFamily = 'var(--font-secondary)';
                    toggleBtn.textContent = 'Sem Serifas';
                } else if (savedFont === 'monospace') {
                    body.style.fontFamily = 'var(--font-monospace)';
                    toggleBtn.textContent = 'Monoespaçada';
                }
            }
        }
    }

    // --- 7. Integração Painel de Comentários ---
    const toggleComments = document.getElementById('comments-toggle');
    const commentsPanel = document.getElementById('comments-panel');
    const closeComments = document.getElementById('close-comments');
    const commentsIframe = document.getElementById('comments-iframe'); // Não usado diretamente aqui, mas pode ser útil
    const fallback = document.getElementById('comments-fallback');

    if (toggleComments && commentsPanel && closeComments) {
        toggleComments.addEventListener('click', () => {
            commentsPanel.classList.add('active');
            document.body.style.overflow = 'hidden'; // Evita rolagem da página atrás
        });

        closeComments.addEventListener('click', () => {
            commentsPanel.classList.remove('active');
            document.body.style.overflow = ''; // Restaura rolagem
        });
    }

    // Detectar erro de login (popup bloqueado) vindo do iframe
    window.addEventListener('message', (event) => {
        if (
            typeof event.data === 'string' &&
            event.data.includes('auth/popup-blocked')
        ) {
            if (fallback) fallback.style.display = 'block';
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const isMiBrowser = navigator.userAgent.toLowerCase().includes('miuibrowser');
  
  if (isMiBrowser) {
    const toggleBtn = document.getElementById('comments-toggle');
    if (toggleBtn) {
      
      toggleBtn.style.right = '10px';
      toggleBtn.style.bottom = '110px';
    }
  }
});
