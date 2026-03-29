// Limpa cache

(function () {
    const VERSION_FILE = '/version.txt';
    const STORAGE_KEY = 'site_version';
    const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
    document.getElementsByClassName("scroll")[0].style.display = "none";
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

const btn = document.getElementsByClassName("scroll")[0];

window.onscroll = function() {
  // Verifica se a rolagem passou de 300px
  if (document.body.scrollTop > 157 || document.documentElement.scrollTop > 157) {
    btn.style.display = "flex";
  } else {
    btn.style.display = "none";
  }
};

// Funcionalidade de clique para voltar ao topo suavemente
btn.onclick = function() {
  window.scrollTo({
    top: 0,
    // behavior: 'smooth' // Rolagem suave
  });
};