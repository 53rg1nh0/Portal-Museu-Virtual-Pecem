// // Limpa cache
// (function () {
//   const VERSION_FILE = '/version.txt';
//   const STORAGE_KEY = 'site_version';
//   const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
//   document.getElementsByClassName("scroll")[0].style.display = "none";
//   async function fetchVersion() {
//     try {
//       const r = await fetch(VERSION_FILE, { cache: 'no-store' });
//       if (!r.ok) return null;
//       return (await r.text()).trim();
//     } catch (e) {
//       return null;
//     }
//   }
//   async function checkForUpdate() {
//     const newVersion = await fetchVersion();
//     if (!newVersion) return;
//     const current = localStorage.getItem(STORAGE_KEY);
//     if (current && current !== newVersion) {
//       localStorage.setItem(STORAGE_KEY, newVersion);
//       const base = window.location.href.split('?')[0];
//       const sep = base.includes('?') ? '&' : '?';
//       window.location.replace(base + sep + '_cb=' + Date.now());
//     } else if (!current) {
//       localStorage.setItem(STORAGE_KEY, newVersion);
//     }
//   }
//   checkForUpdate();
//   setInterval(checkForUpdate, CHECK_INTERVAL_MS);

// })();

///////////////////////////////////contAPI//////////////////////////////////////
//Incrementar(GET): https://countapi.mileshilliard.com/api/v1/hit/your_key    //
//Resposta:                                                                   //
//{                                                                           //
//  "key": "your_key",                                                        //
//  "message": "Key updated successfully",                                    //
//  "value": 3                                                                //
//}                                                                           //
//Obter valor(GET): https://countapi.mileshilliard.com/api/v1/get/your_key    //
//Resposta:                                                                   //
// {                                                                          //
//   "key": "your_key",                                                       //
//   "value": 3                                                               //
// }                                                                          //
//Setar(GET): https://countapi.mileshilliard.com/api/v1/set/your_key?value=100//
//Resposta:                                                                   //
// {                                                                          //  
//   "key": "your_key",                                                       //
//   "old_value": 3,                                                          //
//   "value": 100                                                             //
// }                                                                          //
////////////////////////////////////////////////////////////////////////////////

const COUNT_API_URL = 'https://countapi.mileshilliard.com/api/v1';
const COUNT_KEY = 'Mu$3u6!99363m';
const DAY_IN_MS = 864e5;

function getStoredValue(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    return null;
  }
}

function setStoredValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    // O contador continua funcionando mesmo com o armazenamento bloqueado.
  }
}

function incrementaContador(value = getStoredValue('contagem') || '...') {
  const contador = document.querySelector('.contador');
  if (contador) contador.textContent = value;
}

async function websiteVisits() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);

  try {
    const lastVisit = getStoredValue('relogio');
    const shouldCount = !getStoredValue('contagem') || !lastVisit ||
      Date.now() - new Date(lastVisit).getTime() > DAY_IN_MS;

    if (shouldCount) {
      await fetch(`${COUNT_API_URL}/hit/${COUNT_KEY}`, { signal: controller.signal });
    }

    const response = await fetch(`${COUNT_API_URL}/get/${COUNT_KEY}`, {
      signal: controller.signal,
    });
    if (!response.ok) throw new Error('Falha ao consultar o contador');

    const result = await response.json();
    setStoredValue('relogio', new Date().toISOString());
    setStoredValue('contagem', String(result.value));
    incrementaContador(String(result.value));
  } catch (error) {
    incrementaContador();
  } finally {
    clearTimeout(timeout);
  }
}

incrementaContador();
const runWhenIdle = window.requestIdleCallback || ((callback) => setTimeout(callback, 0));
runWhenIdle(websiteVisits);

const btn = document.querySelector('.scroll');
const menuToggle = document.querySelector('#chk');

if (menuToggle) {
  menuToggle.setAttribute('aria-label', menuToggle.getAttribute('aria-label') || 'Abrir menu principal');
}

if (btn) {
  btn.setAttribute('aria-label', btn.getAttribute('aria-label') || 'Voltar ao topo');
  btn.setAttribute('aria-hidden', 'true');

  let ticking = false;
  const updateScrollButton = () => {
    const isVisible = window.scrollY > 157;
    btn.classList.toggle('is-visible', isVisible);
    btn.setAttribute('aria-hidden', String(!isVisible));
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollButton);
      ticking = true;
    }
  }, { passive: true });

  updateScrollButton();
}

const videos = document.querySelectorAll('video');
videos.forEach(video => { video.addEventListener('mouseover', () => { video.currentTime = 0; video.play(); }); video.addEventListener('mouseout', () => { video.pause(); }); });