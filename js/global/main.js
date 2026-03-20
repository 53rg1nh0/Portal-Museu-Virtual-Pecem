// Limpa cache

(function () {
    const VERSION_FILE = '/version.txt';
    const STORAGE_KEY = 'site_version';
    const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

    async function fetchVersion() {
        try {
            const r = await fetch(VERSION_FILE, { cache: 'no-store' });
            if (!r.ok) return null;
            return (await r.text()).trim();
        } catch (e) {
            return null;
        }
    }

    async function checkForUpdate() {
        const newVersion = await fetchVersion();
        if (!newVersion) return;
        const current = localStorage.getItem(STORAGE_KEY);
        if (current && current !== newVersion) {
            localStorage.setItem(STORAGE_KEY, newVersion);
            const base = window.location.href.split('?')[0];
            const sep = base.includes('?') ? '&' : '?';
            window.location.replace(base + sep + '_cb=' + Date.now());
        } else if (!current) {
            localStorage.setItem(STORAGE_KEY, newVersion);
        }
    }

    checkForUpdate();
    setInterval(checkForUpdate, CHECK_INTERVAL_MS);
})();
// Limpa cache

// Carrega os componentes e paginas

function loadComponent(id, file) {
    fetch(`components/${file}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

function loadPage(id, file) {
    fetch(`page/${file}`)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

// Carregar cada component e paginas
loadComponent("baner", "baner.html");
loadComponent("navegacao", "navegacao.html");

//loadPage("page-index", "page-index.html")
//loadPage("page-missao", "page-missao.html")
//loadPage("page-comunidade--documentos", "page-comunidade--documentos.html")

loadComponent("footer", "footer.html");
// Carrega os componentes e paginas