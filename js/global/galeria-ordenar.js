(function () {
    setTimeout(() => {
        let arrayFotoDescricao = [];
        let i = 1;
        let htmlFotos = '';
        let htmlSlides = '<div id="myModal" class="modal" style="display:none"><span class="close cursor" onclick="closeModal()">&times;</span><div class="modal-content">';

        for (let item of document.querySelectorAll(".foto img")) {
            arrayFotoDescricao.push({ url: item.getAttribute("src"), descricao: item.getAttribute("alt") });
        }

        arrayFotoDescricao = arrayFotoDescricao.sort((a, b) => a.descricao.localeCompare(b.descricao));
        for (let item of arrayFotoDescricao) {
            let urlFoto = item["url"];
            let descricaoFoto = item["descricao"];
            htmlFotos += '<div class="foto"> <img src="' + urlFoto + '" onclick="openModal();currentSlide(' + i + ')" class="hover-shadow demo" alt="' + descricaoFoto + '"></div>';
            htmlSlides += '<div class="mySlides"><div class="numbertext">' + i + ' / ' + arrayFotoDescricao.length + '</div><img src="' + urlFoto + '"></div>'
            i++;
        }
        htmlSlides += '<a class="prev" onclick="plusSlides(-1)">&#10094;</a> <a class="next" onclick="plusSlides(1)">&#10095;</a><div class="caption-container"><p id="caption"></p></div> </div></div>'
        const fotos = document.getElementsByClassName('fotos')[0];
        fotos.innerHTML = htmlFotos + htmlSlides;
    }, 100);
})();

