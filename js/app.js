(() => {
  const { ui, languages, stations, pageTitle } = window.LAB_TOUR;
  const app = document.getElementById("app");
  const toastEl = document.getElementById("toast");
  const mediaReady = new Map();

  const state = {
    screen: "language",
    lang: null,
    mode: null,
    stationId: null,
  };

  const flaskSvg = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3h6v4.2L19 15a5 5 0 1 1-14 0l4-7.8V3Z" stroke="currentColor" stroke-width="1.8"/>
      <path d="M9 3h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="12" cy="16.5" r="1.4" fill="currentColor"/>
    </svg>`;

  const playSvg = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5L8 5.5Z"/>
    </svg>`;

  const pauseSvg = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4.5" height="14" rx="1.2"/>
      <rect x="13.5" y="5" width="4.5" height="14" rx="1.2"/>
    </svg>`;

  const videoSvg = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="6" width="14" height="12" rx="2.5" stroke="currentColor" stroke-width="1.8"/>
      <path d="M17 10.2 21 8v8l-4-2.2V10.2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    </svg>`;

  const audioSvg = `
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 10v4h3.2L12 18V6L7.2 10H4Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M16 9.2a4.2 4.2 0 0 1 0 5.6M18.5 7a7 7 0 0 1 0 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;

  const flagSvg = {
    zh: `
      <svg class="flag" viewBox="0 0 32 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="32" height="21" fill="#fe0000"/>
        <rect width="16" height="10.5" fill="#000095"/>
        <g transform="translate(8 5.25)" fill="#fff">
          ${Array.from({ length: 12 }, (_, i) => `<polygon points="0,-4.35 0.7,-1.85 -0.7,-1.85" transform="rotate(${i * 30})"/>`).join("")}
          <circle r="2.15" fill="#000095"/>
          <circle r="1.55" fill="#fff"/>
        </g>
      </svg>`,
    en: `
      <svg class="flag" viewBox="0 0 32 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="32" height="21" fill="#bf0a30"/>
        <g fill="#fff">
          <rect y="1.615" width="32" height="1.615"/>
          <rect y="4.846" width="32" height="1.615"/>
          <rect y="8.077" width="32" height="1.615"/>
          <rect y="11.308" width="32" height="1.615"/>
          <rect y="14.538" width="32" height="1.615"/>
          <rect y="17.769" width="32" height="1.615"/>
        </g>
        <rect width="12.8" height="11.308" fill="#002868"/>
        <g fill="#fff">
          ${[0, 1, 2, 3, 4]
            .flatMap((row) => {
              const count = row % 2 === 0 ? 6 : 5;
              const x0 = row % 2 === 0 ? 1.15 : 2.2;
              return Array.from({ length: count }, (_, col) => {
                const x = x0 + col * 2.1;
                const y = 1.15 + row * 2.05;
                return `<polygon points="${x},${y - 0.55} ${x + 0.16},${y - 0.16} ${x + 0.55},${y - 0.16} ${x + 0.22},${y + 0.08} ${x + 0.34},${y + 0.48} ${x},${y + 0.22} ${x - 0.34},${y + 0.48} ${x - 0.22},${y + 0.08} ${x - 0.55},${y - 0.16} ${x - 0.16},${y - 0.16}"/>`;
              });
            })
            .join("")}
        </g>
      </svg>`,
    ja: `
      <svg class="flag" viewBox="0 0 32 21" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="32" height="21" fill="#fff"/>
        <circle cx="16" cy="10.5" r="6.2" fill="#bc002d"/>
      </svg>`,
  };

  function flag(id) {
    return flagSvg[id] || "";
  }

  function t(key) {
    return ui[state.lang || "zh"][key];
  }

  function youtubeId(url) {
    if (!url) return "";
    const match = String(url).match(
      /(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/
    );
    return match ? match[1] : "";
  }

  function stationById(id) {
    return stations.find((item) => item.id === id);
  }

  function mediaPath(station) {
    if (!station || !state.lang || !state.mode) return "";
    return station[state.mode][state.lang] || "";
  }

  function hasConfiguredMedia(station) {
    const path = mediaPath(station);
    if (state.mode === "video") return Boolean(youtubeId(path));
    return Boolean(path);
  }

  async function isReady(station) {
    if (!hasConfiguredMedia(station)) return false;
    if (state.mode === "video") return true;
    const path = mediaPath(station);
    if (mediaReady.has(path)) return mediaReady.get(path);
    try {
      const head = await fetch(path, { method: "HEAD" });
      if (head.ok) {
        mediaReady.set(path, true);
        return true;
      }
      if (head.status !== 405 && head.status !== 501) {
        mediaReady.set(path, false);
        return false;
      }
      const ranged = await fetch(path, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
      });
      const ok = ranged.ok || ranged.status === 206;
      mediaReady.set(path, ok);
      return ok;
    } catch {
      mediaReady.set(path, false);
      return false;
    }
  }

  function showToast(message) {
    toastEl.hidden = false;
    toastEl.textContent = message;
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2200);
  }

  function langMeta() {
    return languages.find((item) => item.id === state.lang);
  }

  function renderLanguage() {
    document.documentElement.lang = "zh-Hant";
    document.title = pageTitle;
    app.innerHTML = `
      <section class="screen">
        <div class="brand">
          <div class="mark">${flaskSvg}</div>
          <div>
            <div class="eyebrow">Dr. Hung-Lin Chen's Lab Tour</div>
            <strong>陳宏霖博士實驗室簡介</strong>
          </div>
        </div>
        <p class="eyebrow">Language</p>
        <h1 class="headline">請選擇語言<br>Choose a language</h1>
        <p class="sub">中文 / English / 日本語</p>
        <div class="stack">
          ${languages
            .map(
              (item) => `
            <button class="card" data-lang="${item.id}">
              <span class="lang-flag">${flag(item.id)}</span>
              <span>
                <h2>${item.native}</h2>
                <p>${item.label}</p>
              </span>
            </button>`
            )
            .join("")}
        </div>
      </section>`;
  }

  function renderMode() {
    document.documentElement.lang =
      state.lang === "en" ? "en" : state.lang === "ja" ? "ja" : "zh-Hant";
    document.title = pageTitle;
    app.innerHTML = `
      <section class="screen">
        <div class="topbar">
          <button class="back" data-go="language">← ${t("back")}</button>
          <span class="chip">${flag(state.lang)}${langMeta().native}</span>
        </div>
        <p class="eyebrow">${t("kicker")}</p>
        <h1 class="headline">${t("chooseMode")}</h1>
        <p class="sub">${t("chooseModeHint")}</p>
        <div class="stack">
          <button class="card mode-card" data-mode="video">
            <span class="icon">${videoSvg}</span>
            <span>
              <h2>${t("video")}</h2>
              <p>${t("videoHint")}</p>
            </span>
          </button>
          <button class="card mode-card" data-mode="audio">
            <span class="icon">${audioSvg}</span>
            <span>
              <h2>${t("audio")}</h2>
              <p>${t("audioHint")}</p>
            </span>
          </button>
        </div>
      </section>`;
  }

  async function renderStations() {
    document.title = pageTitle;
    const readiness = await Promise.all(stations.map((item) => isReady(item)));
    app.innerHTML = `
      <section class="screen">
        <div class="topbar">
          <button class="back" data-go="mode">← ${t("back")}</button>
          <span class="chip">${state.mode === "video" ? t("video") : t("audio")}</span>
        </div>
        <p class="eyebrow lang-now">${flag(state.lang)}${langMeta().native}</p>
        <h1 class="headline">${t("stations")}</h1>
        <div class="stack">
          ${stations
            .map((item, index) => {
              const ready = readiness[index];
              return `
              <button class="card station ${ready ? "ready" : "disabled"}" data-station="${item.id}" ${ready ? "" : 'data-soon="1"'}>
                <span class="num">${item.id}</span>
                <span class="body">
                  <h2>${item.title[state.lang]}</h2>
                  <p>${ready ? t("play") : t("soon")}</p>
                </span>
                ${ready ? `<span class="play-btn" aria-hidden="true">${playSvg}</span>` : `<span class="soon">${t("soon")}</span>`}
              </button>`;
            })
            .join("")}
        </div>
      </section>`;
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function neighborId(offset) {
    const index = stations.findIndex((item) => item.id === state.stationId);
    for (let i = index + offset; i >= 0 && i < stations.length; i += offset) {
      if (hasConfiguredMedia(stations[i]) && (state.mode === "video" || mediaReady.get(mediaPath(stations[i])))) {
        return stations[i].id;
      }
    }
    return null;
  }

  async function renderPlayer() {
    const station = stationById(state.stationId);
    const ready = await isReady(station);
    if (!ready) {
      state.screen = "stations";
      showToast(t("missing"));
      render();
      return;
    }

    const prev = neighborId(-1);
    const next = neighborId(1);
    const path = mediaPath(station);
    const video = youtubeId(path);

    app.innerHTML = `
      <section class="screen">
        <div class="topbar">
          <button class="back" data-go="stations">← ${t("back")}</button>
          <span class="chip">${station.id}</span>
        </div>
        <div class="player-title">
          <p class="eyebrow">${state.mode === "video" ? t("video") : t("audio")}</p>
          <h1>${station.title[state.lang]}</h1>
        </div>
        ${
          state.mode === "video"
            ? `<div class="frame">
                <iframe
                  src="https://www.youtube.com/embed/${video}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
                  title="${station.title[state.lang]}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>`
            : `<div class="audio-stage" id="audio-stage">
                <div class="wave" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                <button class="icon-btn" id="audio-toggle" aria-label="${t("play")}">${playSvg}</button>
                <input id="seek" type="range" min="0" max="100" value="0" />
                <div class="time-row"><span id="cur">0:00</span><span id="dur">0:00</span></div>
                <audio id="narration" src="${path}" preload="metadata" playsinline></audio>
              </div>`
        }
        <div class="nav-row">
          <button class="nav-btn" data-jump="${prev || ""}" ${prev ? "" : "disabled"}>${t("prev")}</button>
          <button class="nav-btn" data-jump="${next || ""}" ${next ? "" : "disabled"}>${t("next")}</button>
        </div>
      </section>`;

    if (state.mode === "audio") bindAudio();
  }

  function bindAudio() {
    const audio = document.getElementById("narration");
    const toggle = document.getElementById("audio-toggle");
    const seek = document.getElementById("seek");
    const cur = document.getElementById("cur");
    const dur = document.getElementById("dur");
    const stage = document.getElementById("audio-stage");
    let seeking = false;

    const sync = () => {
      toggle.innerHTML = audio.paused ? playSvg : pauseSvg;
      stage.classList.toggle("playing", !audio.paused);
      cur.textContent = formatTime(audio.currentTime);
      dur.textContent = formatTime(audio.duration);
      if (!seeking && audio.duration) {
        seek.value = String((audio.currentTime / audio.duration) * 100);
      }
    };

    toggle.addEventListener("click", () => {
      if (audio.paused) audio.play();
      else audio.pause();
    });
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("loadedmetadata", sync);
    audio.addEventListener("ended", sync);
    audio.addEventListener("error", () => showToast(t("missing")));
    seek.addEventListener("input", () => {
      seeking = true;
      if (audio.duration) audio.currentTime = (Number(seek.value) / 100) * audio.duration;
    });
    seek.addEventListener("change", () => {
      seeking = false;
    });
    audio.play().catch(() => sync());
  }

  async function render() {
    if (state.screen === "language") renderLanguage();
    else if (state.screen === "mode") renderMode();
    else if (state.screen === "stations") await renderStations();
    else await renderPlayer();
  }

  const params = new URLSearchParams(location.search);
  if (["zh", "en", "ja"].includes(params.get("lang"))) {
    state.lang = params.get("lang");
    state.screen = "mode";
  }
  if (["video", "audio"].includes(params.get("mode")) && state.lang) {
    state.mode = params.get("mode");
    state.screen = "stations";
  }
  if (params.get("station") && stationById(params.get("station")) && state.mode) {
    state.stationId = params.get("station");
    state.screen = "player";
  }

  app.addEventListener("click", async (event) => {
    const langBtn = event.target.closest("[data-lang]");
    if (langBtn) {
      state.lang = langBtn.dataset.lang;
      state.screen = "mode";
      render();
      return;
    }

    const go = event.target.closest("[data-go]");
    if (go) {
      state.screen = go.dataset.go;
      if (state.screen === "language") {
        state.mode = null;
        state.stationId = null;
      }
      if (state.screen === "mode") state.stationId = null;
      render();
      return;
    }

    const modeBtn = event.target.closest("[data-mode]");
    if (modeBtn) {
      state.mode = modeBtn.dataset.mode;
      state.screen = "stations";
      render();
      return;
    }

    const jump = event.target.closest("[data-jump]");
    if (jump && jump.dataset.jump) {
      state.stationId = jump.dataset.jump;
      state.screen = "player";
      render();
      return;
    }

    const stationBtn = event.target.closest("[data-station]");
    if (stationBtn) {
      const station = stationById(stationBtn.dataset.station);
      if (stationBtn.dataset.soon || !(await isReady(station))) {
        showToast(t("soon"));
        return;
      }
      state.stationId = station.id;
      state.screen = "player";
      render();
    }
  });

  render();
})();
