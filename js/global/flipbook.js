setTimeout(() => {
  const book = document.querySelector('.book');
  if (!book) {
    window.location.reload();
  }
  else {
    function criarLivro() {
      const nPag = 100;

      for (let i = 1; i <= nPag; i++) {

        const paper = document.createElement('div');
        i === 1 ? paper.setAttribute('class', 'paper active') : paper.setAttribute('class', 'paper');
        paper.style.zIndex = nPag + 1 - i;
        const front = document.createElement('div');
        front.setAttribute('class', 'front');
        const back = document.createElement('div');
        back.setAttribute('class', 'back');
        const img1 = document.createElement('img');
        img1.setAttribute('src', 'assets/images/pages/porto--trajetoria/pagina ' + (i * 2 - 1) + '.webp');
        const img2 = document.createElement('img');
        img2.setAttribute('src', 'assets/images/pages/porto--trajetoria/pagina ' + (i * 2) + '.webp');

        front.appendChild(img1);
        back.appendChild(img2);
        paper.appendChild(front);
        paper.appendChild(back);
        book.appendChild(paper);
      }
    };
    criarLivro();
    // const book = document.getElementById('book');
    // const papers = document.querySelectorAll('.paper');
    // papers.forEach((paper, index) => {
    //   paper.addEventListener('click', () => {
    //     if (index === 0 && !paper.classList.contains('flipped')) {
    //       // Abrindo o livro: movemos o container para compensar a abertura
    //       book.style.transform = "translateX(50%)";
    //       paper.classList.add('flipped');
    //       paper.style.zIndex = 1;
    //     } else if (paper.classList.contains('flipped')) {
    //       // Fechando a página
    //       paper.classList.remove('flipped');
    //       if (index === 0) {
    //         book.style.transform = "translateX(0%)";
    //       }
    //       setTimeout(() => { paper.style.zIndex = 3 - index; }, 300);
    //     } else {
    //       // Virando páginas internas
    //       paper.classList.add('flipped');
    //       paper.style.zIndex = index + 1;
    //     }
    //   });
    // });



    // const book = document.getElementById('book');
    const papers = document.querySelectorAll('.paper');
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    const pageInput = document.querySelector('#pageInput');
    const goBtn = document.querySelector('#goBtn');

    let currentState = 0; // Representa a página atual (0 = capa)
    const maxState = papers.length;

    function updateBook() {
      const isPortrait = window.innerHeight > window.innerWidth;

      papers.forEach((paper, index) => {
        if (index < currentState) {
          // Páginas que já foram viradas
          paper.classList.add('flipped');
          setTimeout(() => {
            paper.style.zIndex = index + 1;
          }, 100);
        } else {
          // Páginas que ainda não foram viradas
          paper.classList.remove('flipped');
          setTimeout(() => {
            paper.style.zIndex = papers.length - index;
          }, 100);
        }
      });

      // Ajuste de centralização (Apenas Landscape)
      if (!isPortrait) {
        book.style.transform = currentState > 0 ? "translateX(50%)" : "translateX(0%)";
      } else {
        book.style.transform = "translateX(0%)";
      }
    }

    // Eventos dos Botões
    nextBtn.addEventListener("click", () => {
      if (currentState < maxState) {
        currentState++;
        pageInput.value = currentState * 2 - 1;
        updateBook();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentState > 0) {
        currentState--;
        pageInput.value = currentState * 2 - 1;
        updateBook();
      }
    });

    pageInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const targetPage = parseInt(pageInput.value);
        // Como cada 'paper' tem 2 páginas, dividimos por 2 para achar o índice do paper
        // Ex: Página 3 está no paper 2 (índice 1)
        if (targetPage >= 0 && targetPage <= maxState * 2) {
          currentState = Math.ceil(targetPage / 2);
          updateBook();
        } else {
          alert("Página inválida");
        }
      }

    });

    // Evento do Input "Ir para página"
    goBtn.addEventListener("click", () => {
      const targetPage = parseInt(pageInput.value);
      // Como cada 'paper' tem 2 páginas, dividimos por 2 para achar o índice do paper
      // Ex: Página 3 está no paper 2 (índice 1)
      if (targetPage >= 0 && targetPage <= maxState * 2) {
        currentState = Math.ceil(targetPage / 2);
        updateBook();
      } else {
        alert("Página inválida");
      }
    });

    // Mantém o clique direto na página funcionando
    papers.forEach((paper, index) => {
      paper.addEventListener('click', () => {
        if (paper.classList.contains('flipped')) {
          currentState = index;
        } else {
          currentState = index + 1;
        }
        updateBook();
      });
    });

    // Inicializa o z-index correto
    updateBook();
  }
}, 100);