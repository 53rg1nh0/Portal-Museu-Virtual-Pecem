const book = document.querySelector('.book');
const papers = document.querySelectorAll('.paper');
const pageInput = document.querySelector('#pageInput');
const goBtn = document.querySelector('#goBtn');
const nextBtn = document.querySelector('#nextBtn');
const prevBtn = document.querySelector('#prevBtn');

let pag = -1;

papers.forEach(p => {
    p.addEventListener('click', () => {
        passaPagina(p);
    })
});

goBtn.addEventListener('click', () => {
    const n = Math.ceil((parseInt(pageInput.value) - pag) / 2);
    for (let i = 1; i <= Math.abs(n); i++) {
        let pag;
        (n > 0) ? pag = document.querySelectorAll('.direita') : pag = document.querySelectorAll('.esquerda');
        if (pag.length > 0) {
            let max = pag[0];
            pag.forEach(p => {
                max.style.zIndex < p.style.zIndex ? max = p : max = max;
            })
            passaPagina(max);
        }
    }
});

pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const n = Math.ceil((parseInt(pageInput.value) - pag) / 2);
        for (let i = 1; i <= Math.abs(n); i++) {
            let pag;
            (n > 0) ? pag = document.querySelectorAll('.direita') : pag = document.querySelectorAll('.esquerda');
            if (pag.length > 0) {
                let max = pag[0];
                pag.forEach(p => {
                    max.style.zIndex < p.style.zIndex ? max = p : max = max;
                })
                passaPagina(max);
            }
        }
    }
});

nextBtn.addEventListener('click', () => {
    const direita = document.querySelectorAll('.direita');
    if (direita.length > 0) {
        let max = direita[0];
        direita.forEach(p => {
            max.style.zIndex < p.style.zIndex ? max = p : max = max;
        })
        passaPagina(max);
    }
});

prevBtn.addEventListener('click', () => {
    const esquerda = document.querySelectorAll('.esquerda');
    if (esquerda.length > 0) {
        let max = esquerda[0];
        esquerda.forEach(p => {
            max.style.zIndex < p.style.zIndex ? max = p : max = max;
        })
        passaPagina(max);
    }
});

function passaPagina(p) {
    let esquerda;
    let direita;
    papers.forEach(p => {
        if (p.style.zIndex === '1') {
            p.style.display = 'block';
        }
    })
    document.querySelectorAll('.esquerda').forEach(e => {
        if (e.style.zIndex === '5') {
            e.style.zIndex = document.querySelectorAll('.esquerda').length;
        }
    })
    document.querySelectorAll('.direita').forEach(e => {
        if (e.style.zIndex === '5') {
            e.style.zIndex = document.querySelectorAll('.direita').length;
        }
    })
    if (p.getAttribute('class') === 'paper direita') {
        p.setAttribute('class', 'paper esquerda');
        esquerda = document.querySelectorAll('.esquerda');
        direita = document.querySelectorAll('.direita');
        p.style.zIndex = '5';
        pag += 2;
        cicloPagina(esquerda, direita);
    }
    else {
        p.setAttribute('class', 'paper direita');
        esquerda = document.querySelectorAll('.esquerda');
        direita = document.querySelectorAll('.direita');

        p.style.zIndex = '5';
        pag -= 2;
        cicloPagina(esquerda, direita);
    }
    moverLivro();
    pageInput.value = pag;
}

function cicloPagina(e, d) {
    if (d.length < 2 && pag < 197) {
        d.forEach(i => {
            i.style.zIndex++;
        })
        document.querySelectorAll('.esquerda').forEach(i => {
            if (i.style.zIndex === '1') {
                i.setAttribute('class', 'paper direita');
                carregaPagina(i, 4);
                i.style.display = 'none';
            }
            else if (i.style.zIndex !== '5') {
                i.style.zIndex--;
            }

        })
    }
    else if (e.length < 2 && pag > 1) {
        e.forEach(i => {
            i.style.zIndex++;
        })
        document.querySelectorAll('.direita').forEach(i => {
            if (i.style.zIndex === '1') {
                i.setAttribute('class', 'paper esquerda');
                carregaPagina(i, -2);
                i.style.display = 'none';
            }
            else if (i.style.zIndex !== '5') {
                i.style.zIndex--;
            }
        })
    }
}

function carregaPagina(p, n) {
    p.children[0].children[0].setAttribute('src', `assets/images/pages/porto--trajetoria/pagina ${pag + n}.webp`)
    p.children[1].children[0].setAttribute('src', `assets/images/pages/porto--trajetoria/pagina ${pag + n + 1}.webp`)
}

function moverLivro() {
    if (pag > -1) {
        book.style.transform = 'translateX(270px)';
    }
    else {
        book.style.transform = 'translateX(0)';
    }
}

