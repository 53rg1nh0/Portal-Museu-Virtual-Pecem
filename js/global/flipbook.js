pdfjsLib.GlobalWorkerOptions.workerSrc = './libs/pdf.worker.min.js';

const containerLivro = document.querySelector('.container-livro')
const bkg = document.querySelector('.bkg-cor')
if (bkg && containerLivro) {
    bkg.addEventListener('click', function (e) {
        if (e.target.classList.contains('flip')) {
            livro(
                e.target.getAttribute('pathWebp'),
                e.target.getAttribute('pathPDF'),
                parseInt(e.target.getAttribute('totalPaginas')),
                parseFloat(e.target.getAttribute('width')),
                parseFloat(e.target.getAttribute('height')),
                parseFloat(e.target.getAttribute('opacity'))
            )
            containerLivro.style.display = "flex"
        }
    })
}

async function livro(pathWebp = '', pathPDF = '', totalPaginas = 1, width = 550, hight = 733, opacity = 0) {
    const path = pathWebp ? pathWebp : pathPDF

    let pageFlip = null;
    let pdfDoc = null;

    const renderedPages = new Set();
    const renderingQueue = new Set();

    const PRELOAD_AHEAD = 3;
    const PRELOAD_BEHIND = 1;
    const propLivro = {
        width: width,
        height: hight,
        size: "fixed",
        minWidth: 315,
        maxWidth: 2 * width,
        minHeight: 420,
        maxHeight: 1000,
        maxShadowOpacity: opacity,
        showCover: true,
        mobileScrollSupport: false
    }

    containerLivro.innerHTML = `
        <div class="livro">
            <div id="loading">Carregando PDF...</div>
            <div id="flipbook" class="flipbook"></div>
        </div>

        <div class="toolbar">
            <div class="controls">
                <button id="prev-btn">Anterior</button>
                <a class="lnk-doc" href="${pathPDF}" target="_blank">DOC</a>
                <input type="number" id="jump-input" min="1" placeholder="Pág..." />
                <button id="jump-btn">Ir</button>
                <button id="next-btn">Próxima</button>
            </div>
        </div>

        <span class="close">×</span>
`
    document.querySelector('.close').addEventListener('click', () => {
        containerLivro.style.display = "none"
    })

    // document.addEventListener('DOMContentLoaded', async () => {
    loadExistingPdf();
    // });

    async function loadExistingPdf() {
        const loading = document.getElementById('loading');
        const container = document.getElementById('flipbook');
        container.style.height = hight + 'px'

        loading.style.display = 'block';
        container.innerHTML = '';
        renderedPages.clear();
        renderingQueue.clear();

        if (pageFlip) {
            pageFlip.destroy();
            pageFlip = null;
        }

        try {
            pdfDoc = pathWebp ? null : await pdfjsLib.getDocument(path).promise;
            totalPaginas = pathWebp ? totalPaginas : pdfDoc.numPages

            for (let i = 1; i <= totalPaginas; i++) {
                const pageDiv = document.createElement('div');
                pageDiv.className = 'page';
                pageDiv.dataset.pageNumber = i;

                const img = pathWebp ? document.createElement('div') : document.createElement('img');
                pageDiv.appendChild(img);
                container.appendChild(pageDiv);
            }

            pageFlip = new St.PageFlip(container, propLivro);

            pageFlip.loadFromHTML(container.querySelectorAll('.page'));
            loading.style.display = 'none';

            document.getElementById('jump-input').max = totalPaginas;//

            //fitBookToScreen();
            await updateRenderQueue();
            updatePageCounter();
            fitBookToScreen();

            pageFlip.on('flip', () => {
                updatePageCounter()
                requestAnimationFrame(() => updateRenderQueue());
                fitBookToScreen()
            });

        } catch (error) {
            console.error(error);
            loading.textContent = 'Erro ao carregar o PDF do projeto.';
        }
    }

    function fitBookToScreen() {
        const containerWrapper = document.querySelector('.livro');
        const flipbook = document.getElementById('flipbook');
        const isMobile = document.querySelector('.stf__wrapper').classList.contains('--portrait') //window.innerWidth <= 768;

        if (!containerWrapper || !flipbook) return;

        const computedStyle = window.getComputedStyle(containerWrapper);
        const paddingTop = parseFloat(computedStyle.paddingTop);
        const paddingBottom = parseFloat(computedStyle.paddingBottom);
        const paddingLeft = parseFloat(computedStyle.paddingLeft);
        const paddingRight = parseFloat(computedStyle.paddingRight);

        const availableWidth = containerWrapper.clientWidth - (paddingLeft + paddingRight);
        const availableHeight = containerWrapper.clientHeight - (paddingTop + paddingBottom);

        if (availableWidth <= 0 || availableHeight <= 0) return;

        const baseWidth = isMobile ? width : 1100;
        const baseHeight = hight;

        const scaleX = availableWidth / baseWidth;
        const scaleY = availableHeight / baseHeight;
        const scale = Math.min(scaleX, scaleY);

        const isCover = pageFlip ? pageFlip.getCurrentPageIndex() === 0 : true;

        if (!isMobile && isCover) {
            flipbook.style.transform = totalPaginas > 1 ? `scale(${scale}) translateX(-25%)` : `scale(${scale}) translateX(25%)`;
        } else {
            flipbook.style.transform = `scale(${scale}) translateX(0)`;
        }
        flipbook.style.transformOrigin = 'center center';
    }

    async function goToPage() {
        if (!pageFlip) return;

        const input = document.getElementById('jump-input');
        const targetPage = parseInt(input.value, 10);

        if (isNaN(targetPage) || targetPage < 1 || targetPage > totalPaginas) {
            alert(`Por favor, insira um número de página válido (entre 1 e ${totalPaginas}).`);
            return;
        }

        pageFlip.flip(targetPage - 1);

        await updateRenderQueue();
    }

    async function updateRenderQueue() {
        if (!pageFlip) return;

        const currentPage = pageFlip.getCurrentPageIndex() + 1;

        const targetPages = [currentPage];
        if (currentPage + 1 <= totalPaginas) targetPages.push(currentPage + 1);

        for (let i = 2; i <= PRELOAD_AHEAD; i++) {
            if (currentPage + i <= totalPaginas) targetPages.push(currentPage + i);
        }

        for (let i = 1; i <= PRELOAD_BEHIND; i++) {
            if (currentPage - i >= 1) targetPages.push(currentPage - i);
        }

        for (const pageNum of targetPages) {
            if (!renderedPages.has(pageNum) && !renderingQueue.has(pageNum)) {
                renderingQueue.add(pageNum);
                renderPageToImage(pageNum).then(() => {
                    renderingQueue.delete(pageNum);
                    renderedPages.add(pageNum);
                });
            }
        }
    }

    async function renderPageToImage(pageNum) {
        const pageElement = document.querySelector(`.page[data-page-number="${pageNum}"]`);
        if (!pageElement) return;

        const imgElement = pathWebp ? pageElement.querySelector('div') : pageElement.querySelector('img');//
        if (!imgElement) return;
        if (pathWebp) {
            if (totalPaginas === 1) {
                imgElement.style.backgroundImage = `url(${path})`
            }
            else {
                imgElement.style.backgroundImage = `url("${path}/pagina ${pageNum}.webp")`
            }

            imgElement.style.backgroundSize = '100% 100%'//
            imgElement.style.backgroundRepeat = 'no-repeat'//
            imgElement.style.height = '100%'//
        }
        else {
            const page = await pdfDoc.getPage(pageNum);

            const dpr = window.devicePixelRatio || 1;
            const viewport = page.getViewport({ scale: 2 * Math.min(dpr, 2) });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            imgElement.src = canvas.toDataURL('image/jpeg', 0.60);

            canvas.width = 0;
            canvas.height = 0;
        }
        if (totalPaginas === 1) {
            const controls = document.querySelector('.controls')
            controls.querySelectorAll('button').forEach(a => { a.style.display = 'none' })
            controls.querySelector('input').style.display = 'none'
        }
    }

    function updatePageCounter() {
        if (!pageFlip) return;
        const current = pageFlip.getCurrentPageIndex() + 1;
        document.getElementById('jump-input').value = current
    }

    window.addEventListener('resize', fitBookToScreen);

    document.getElementById('jump-btn').addEventListener('click', goToPage);
    document.getElementById('jump-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            goToPage();
        }
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (pageFlip) pageFlip.flipPrev();
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (pageFlip) pageFlip.flipNext();
    });
}