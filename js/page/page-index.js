 loadPage("page-index", "page-index.html");

        carrossel();

        function carrossel() {
            let count = 1;
            // document.getElementById('rad1').checked = true;
            setInterval(function () {
                count > 2 ? count = 1 : count++;
                document.getElementById('rad' + count).checked = true;
            }, 5000)
        };