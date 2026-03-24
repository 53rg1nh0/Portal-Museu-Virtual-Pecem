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
