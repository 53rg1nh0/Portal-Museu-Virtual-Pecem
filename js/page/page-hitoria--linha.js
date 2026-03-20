loadPage("page-historia--linha", "page-historia--linha.html");

setTimeout(() => {
    const container = document.querySelector('.linha-tempo');
    const anos = document.createElement('div');
    anos.setAttribute('class', 'anos');
    const artigo = document.querySelectorAll('.artigo');
    const linha = document.querySelector('.linha-tempo');

    (function () {

        [...artigo].forEach(a => {
            const year = document.createElement('div');
            year.setAttribute('class', 'ano');
            const p = document.createElement('p');
            p.textContent = a.children[1].children[0].textContent;
            year.appendChild(p);
            const dot = document.createElement('div');
            dot.setAttribute('class', 'dot');
            year.appendChild(dot);
            anos.appendChild(year);
        });
        container.appendChild(anos);
    })();

    const ano = document.querySelectorAll('.ano');
    const avanca = document.querySelector('.avanca');
    const volta = document.querySelector('.volta');
    const gapAnos = 72;
    const widthAno = 47.58;
    const passada = gapAnos + widthAno;
    let s 
    let ativo = 0;
    let inicio = 93;
    let qtnm = 3;
    let meio = 3;
    let esquerda = 0;
    let direita = [...ano].length - 7;

    [...ano][0].setAttribute('class', 'ano ativo');
    anos.style.left = inicio + 'px';
    anos.style.gap = gapAnos + 'px';

    function next(ativo) {
        if (ativo >= 1 - [...ano].length && ativo < [...ano].length) {
            let passos;
            passos = qtnm - ativo;
            [...ano].forEach(a => {
                a.setAttribute('class', 'ano');
            })
            if (passos > 0) {
                esquerda < passos ? passos = esquerda : passos = passos;
            } else {
                direita < (-1) * passos ? passos = direita * (-1) : passos = passos;
            }
            esquerda -= passos;
            direita += passos;
            meio = document.documentElement.clientWidth > 666 ? 3 :  1;
            qtnm = esquerda + meio;
            anos.style.left = inicio + 'px';
            anos.style.transform = 'translateX(' + passada * passos + 'px)';
            inicio += passada * passos;
            setVisivel(ativo);
            [...ano][ativo].setAttribute('class', 'ano ativo');
        }
    }

    function setVisivel(n) {
        [...artigo].forEach(a => {
            a.setAttribute('class', 'artigo');
        });
        [...artigo][n].setAttribute('class', 'artigo visivel');
    }

    [...ano].forEach(a => {
        a.addEventListener('click', e => {
            ativo = [...ano].indexOf(e.currentTarget);
            next(ativo);
        })
    });

    volta.addEventListener('click', e => {
        [...ano].forEach(a => {
            if (a.className === 'ano ativo') {
                ativo = [...ano].indexOf(a) - 1;
            }
        })
        if (ativo >= 0) {
            next(ativo);
        }
    });

    avanca.addEventListener('click', e => {
        [...ano].forEach(a => {
            if (a.className === 'ano ativo') {
                ativo = [...ano].indexOf(a) + 1;
            }
        })
        if (ativo < [...ano].length) {
            next(ativo);
        }
    });
}, 150)