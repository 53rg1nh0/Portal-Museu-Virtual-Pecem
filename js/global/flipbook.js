const livro0 = document.querySelector('.livro0')
const livro1 = document.querySelector('.livro1')
const livro2 = document.querySelector('.livro2')
const livro3 = document.querySelector('.livro3')
const livro4 = document.querySelector('.livro4')
const livro5 = document.querySelector('.livro5')
const ata1 = document.querySelector('.ata1')
const ata2 = document.querySelector('.ata2')
const ata3 = document.querySelector('.ata3')
const book = document.querySelector('.livro')
const bkg = document.querySelector('.bkg-cor')

bkg.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG' || e.target.classList.contains('liv') ||
        e.target.classList.contains('conteiner-livro')) {

        book.style.display = "flex"
    }
})


if (livro0) {
    livro0.addEventListener('click', function (e) {
        book.innerHTML = ''
        livro('assets/images/pages/porto--trajetoria/', 'assets/documents/pages/historia--publicacoes/2007 trajetoria.pdf', 200, .3)
    })
}
if (livro1) {
    livro1.addEventListener('click', function (e) {
        book.innerHTML = '';
        livro('assets/images/pages/comunidade--publicacoes/livro1/', "assets/documents/pages/comunidade--publicacoes/1587 manuscrito.pdf", 142,)
    })
}
if (livro2) {
    livro2.addEventListener('click', function (e) {
        book.innerHTML = ''
        livro('assets/images/pages/comunidade--publicacoes/livro2/', "assets/documents/pages/comunidade--publicacoes/1610 manuscrito.pdf", 96)
    })
}
if (livro3) {
    livro3.addEventListener('click', function (e) {
        book.innerHTML = ''
        livro('assets/images/pages/historia--publicacoes/livro3/', "assets/documents/pages/hstoria--publicacoes/1940_Livro.pdf", 110, 0, true, 650, 733, 'contain')
    })
}
if (livro4) {
    livro4.addEventListener('click', function (e) {
        book.innerHTML = ''
        livro('assets/images/pages/comunidade--publicacoes/livro4/', "assets/documents/pages/comunidade--publicacoes/1700-1730.pdf", 58, .3, true, 531, 870, 'contain')
    })
}

if (livro5) {
    livro5.addEventListener('click', function (e) {
        book.innerHTML = ''
        livro('assets/images/pages/historia--publicacoes/livro5/', "assets/documents/pages/historia--publicacoes/1875_Melhoramento.pdf", 126, .3)
    })
}

if (ata1) {
    ata1.addEventListener('click', function (e) {
        book.innerHTML = ''
        livro('assets/images/pages/comunidade--documentos/ata1/', "assets/documents/pages/comunidade--documentos/1949.pdf", 10)
    })
}
if (ata2) {
    ata2.addEventListener('click', function (e) {
        book.innerHTML = ''
        livro('assets/images/pages/comunidade--documentos/ata2/', "assets/documents/pages/comunidade--documentos/1954.pdf", 10)
    })
}

if (ata3) {
    ata3.addEventListener('click', function (e) {
        book.innerHTML = ''
        livro('assets/images/pages/comunidade--documentos/ata3/', "assets/documents/pages/comunidade--documentos/1958.pdf", 6)
    })
}

function livro(url, urlPDF, numPaginas, opacidade = 0, capa = true, BOOK_PAGE_WIDTH = 550, BOOK_PAGE_HEIGHT = 733, page = 'page') {

    let pageFlip = null;

    const pageStates = new Map();

    book.innerHTML = `<div id="loading">Carregando livro...</div>
        <div id="flipbook" class="flipbook"></div>

        <div class="toolbar">
            <div class="controls">
                <button id="prev-btn" class="btn-livro">Anterior</button>
                <div class="page-search">
                    <a class="link lnk-livro" target="_blank">PDF</a>
                    <input class = "ipt-livro" type="number" id="page-num" min="0" placeholder="Pág.">
                    <button id="go-btn" class="btn-livro">Ir</button>
                </div>
                <button id="next-btn" class="btn-livro">Próxima</button>
            </div>

        </div>
        
        <span class="close">×</span>
        `
    book.style.display = 'flex'

    document.querySelector('.close').addEventListener('click', () => {
        book.style.display = "none"
    })


    const arrayLivro = []

    const pageInput = document.getElementById('page-num');
    const lnk = document.querySelector('.lnk-livro')
    lnk.setAttribute('href', urlPDF)

    initBook(url, numPaginas);

    function initBook() {
        const loading = document.getElementById('loading');
        const container = document.getElementById('flipbook');

        loading.style.display = 'block';

        try {
            for (i = 1; i <= numPaginas; i++) {
                arrayLivro.push(url + 'pagina ' + i + '.webp')
            }
            // 2. Cria a estrutura de blocos no DOM para cada página
            for (let i = 1; i <= numPaginas; i++) {
                const pageDiv = document.createElement('div');
                pageDiv.className = page;
                pageDiv.dataset.pageNumber = i;
                container.appendChild(pageDiv);
            }

            pageInput.setAttribute('max', numPaginas)

            const propLivro = {
                width: BOOK_PAGE_WIDTH,
                height: BOOK_PAGE_HEIGHT,
                size: "fixed",
                minWidth: 315,
                maxWidth: 1000,
                minHeight: 420,
                maxHeight: 1350,
                maxShadowOpacity: opacidade,
                showCover: capa,
                mobileScrollSupport: false,

                useMouseEvents: true,
                clickEventForward: true
            }
            // 3. Inicializa a biblioteca PageFlip
            pageFlip = new St.PageFlip(container, propLivro);

            fitBookToScreen();

            // 2. Ajusta a escala visual (scale) conforme o navegador muda de tamanho
            window.addEventListener('resize', () => {
                fitBookToScreen();
            });

            /**
             * Redimensiona visualmente o livro usando CSS Transform Scale.
             * Garante que a capa e a animação 3D permaneçam perfeitas sem bugs de deslocamento.
             */

            function fitBookToScreen() {
                const container = document.querySelector('.livro');
                const flipbookEl = document.getElementById('flipbook');
                if (!container || !flipbookEl || !pageFlip) return;

                const isPortrait = window.innerWidth <= 768;

                const currentBookWidth = isPortrait ? BOOK_PAGE_WIDTH : BOOK_PAGE_WIDTH * 2;
                const currentBookHeight = BOOK_PAGE_HEIGHT;


                // Pega a altura e largura internas reais descontando o padding do CSS (incluindo os 50px da margem inferior)
                const containerStyle = window.getComputedStyle(container);
                const paddingTop = parseFloat(containerStyle.paddingTop);
                const paddingBottom = parseFloat(containerStyle.paddingBottom); // 50px
                const paddingLeft = parseFloat(containerStyle.paddingLeft);
                const paddingRight = parseFloat(containerStyle.paddingRight);

                const availableWidth = container.clientWidth - paddingLeft - paddingRight;
                const availableHeight = container.clientHeight - paddingTop - paddingBottom;

                const scaleX = availableWidth / currentBookWidth;
                const scaleY = availableHeight / currentBookHeight;

                let scale = Math.min(scaleX, scaleY);

                flipbookEl.style.transform = `scale(${scale})`;
            }

            pageFlip.loadFromHTML(container.querySelectorAll('.' + page));
            loading.style.display = 'none';

            // Executa o pré-carregamento imediato com buffer
            updateBuffer();
            updatePageCounter();

            // 5. Atualiza o buffer a cada folheada de página
            pageFlip.on('flip', () => {
                updatePageCounter();
                updateBuffer();
            });

        } catch (error) {
            console.error('Erro ao inicializar o livro:', error);
            loading.textContent = 'Erro ao carregar o arquivo PDF.';
        }
    }

    /**
     * Calcula a janela prioritária de buffer (Atual + 2 à frente + 2 atrás)
     */
    function updateBuffer() {
        if (!pageFlip) return;

        const current = pageFlip.getCurrentPageIndex() + 1; // 1-based index
        const total = numPaginas;

        // Em visualização de livro (duas páginas exibidas por vez), a página par/ímpar vizinha também é visível
        const isPortrait = pageFlip.getOrientation() === 'portrait';
        const visiblePages = isPortrait ? [current] : [current, current + 1];

        // Fila com ordem de prioridade de renderização:
        // 1º: Páginas atualmente visíveis no visor
        // 2º: Duas páginas à frente (Buffer Forward)
        // 3º: Duas páginas atrás (Buffer Backward)
        const priorityQueue = [];

        // Adiciona páginas visíveis
        visiblePages.forEach(p => {
            if (p >= 1 && p <= total) priorityQueue.push(p);
        });

        // Adiciona 4 páginas à frente
        const maxVisible = Math.max(...visiblePages);
        for (let offset = 1; offset <= 4; offset++) {//--altera para 4 páginas
            const nextP = maxVisible + offset;
            if (nextP <= total && !priorityQueue.includes(nextP)) {
                priorityQueue.push(nextP);
            }
        }

        // Adiciona 4 páginas atrás
        const minVisible = Math.min(...visiblePages);
        for (let offset = 1; offset <= 4; offset++) {//->alterado para 4 páginas
            const prevP = minVisible - offset;
            if (prevP >= 1 && !priorityQueue.includes(prevP)) {
                priorityQueue.push(prevP);
            }
        }

        // Processa a fila de renderização em sequência para não travar a CPU
        for (const pageNum of priorityQueue) {
            if (!pageStates.has(pageNum)) {
                renderSinglePage(pageNum);
            }
        }

        // Desaloca páginas distantes (fora da margem de 6 páginas) para liberar RAM
        pageStates.forEach((state, pageNum) => {
            if (pageNum < minVisible - 8 || pageNum > maxVisible + 8) {
                const pageDiv = document.querySelector(`.${page}[data-page-number="${pageNum}"]`);
                if (pageDiv) {
                    pageDiv.innerHTML = ''; // Apaga o Canvas do DOM
                }
                pageStates.delete(pageNum);
            }
        });
    }

    /**
     * Renderiza uma página em canvas e adiciona ao DOM
     */
    function renderSinglePage(pageNum) {
        pageStates.set(pageNum, 'rendering');

        try {
            const canvas = document.createElement('div');
            // const context = canvas.getContext('2d');
            canvas.style.width = '100%'
            canvas.style.height = '100%'
            canvas.style.backgroundImage = `url("${arrayLivro[pageNum - 1]}")`
            canvas.style.backgroundRepeat = 'no-repeat'
            canvas.style.backgroundSize = 'cover'


            const pageDiv = document.querySelector(`.${page}[data-page-number="${pageNum}"]`);
            if (pageDiv) {
                pageDiv.innerHTML = '';
                pageDiv.appendChild(canvas);
                pageStates.set(pageNum, 'done');
            }
        } catch (err) {
            console.error(`Erro ao renderizar página ${pageNum}:`, err);
            pageStates.delete(pageNum);
        }
    }


    function updatePageCounter() {
        if (!pageFlip) return;

        const current = pageFlip.getCurrentPageIndex() + 1; // Página atual (1-based)


        if (pageInput) {
            pageInput.value = current;
        }
    }

    // Botões de navegação
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (pageFlip) pageFlip.flipPrev();
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (pageFlip) pageFlip.flipNext();
    });

    document.getElementById('go-btn').addEventListener('click', () => {
        const pageInput = document.getElementById('page-num');
        goToPage(pageInput.value);
    });

    // 2. Pressionar a tecla "Enter" dentro do campo de texto
    document.getElementById('page-num').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            goToPage(event.target.value);
            event.target.blur(); // Remove o foco do campo após apertar Enter
        }
    });

    /**
     * Função para saltar direto para uma página específica
     * @param {number} pageNum - O número da página desejada (1-based)
     */
    function goToPage(pageNum) {
        if (!pageFlip) return;

        // Garante que a página solicitada esteja dentro dos limites válidos (entre 1 e o total)
        let targetPage = parseInt(pageNum, 10);
        if (isNaN(targetPage)) return;

        if (targetPage < 1) targetPage = 1;
        if (targetPage > numPaginas) targetPage = numPaginas;

        // StPageFlip utiliza índice 0-based, por isso subtraímos 1
        pageFlip.flip(targetPage - 1);
    }

}
