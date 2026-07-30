/* global TRIP_DATA, MYMAPS_CONFIG, I18N, FLIGHT_DATA */

const state = {
  regionId: "busan",
  dayIndex: 0,
  activeStopId: null,
  mapFocused: false,
  lang: "zh",
  theme: "light",
  view: "map",
};

function readStoredTheme() {
  try {
    const saved = localStorage.getItem("trip-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch (_) {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

state.theme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : readStoredTheme();

const urlParams = new URLSearchParams(location.search);
if (urlParams.get("region") === "jeju") state.regionId = "jeju";
if (urlParams.get("day")) state.dayIndex = Math.max(0, parseInt(urlParams.get("day"), 10) - 1);
if (urlParams.get("lang") === "en") state.lang = "en";
else {
  try {
    if (localStorage.getItem("trip-lang") === "en") state.lang = "en";
  } catch (_) { /* private browsing */ }
}
if (urlParams.get("view") === "flowchart") state.view = "flowchart";
else if (urlParams.get("view") === "flights") state.view = "flights";

function isDark() {
  return state.theme === "dark";
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", isDark() ? "dark" : "light");
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.innerHTML = isDark()
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    btn.setAttribute("aria-label", ui(isDark() ? "themeLight" : "themeDark"));
  }
}

function toggleTheme() {
  state.theme = isDark() ? "light" : "dark";
  try {
    localStorage.setItem("trip-theme", state.theme);
  } catch (_) {}
  applyTheme();
}

function isEn() {
  return state.lang === "en";
}

function ui(key) {
  const item = I18N.ui[key];
  if (!item) return key;
  if (typeof item === "function") return item;
  return isEn() ? item.en : item.zh;
}

function uiFn(key, arg) {
  const item = I18N.ui[key];
  const fn = isEn() ? item.en : item.zh;
  return typeof fn === "function" ? fn(arg) : fn;
}

function getMeta() {
  const base = TRIP_DATA.meta;
  if (!isEn() || !I18N.meta.en) return base;
  return { ...base, ...I18N.meta.en };
}

function getRegion() {
  const region = TRIP_DATA.regions.find((r) => r.id === state.regionId);
  if (!isEn()) return region;
  const en = I18N.regions[region.id]?.en;
  return en ? { ...region, ...en } : region;
}

function getDayRaw() {
  return TRIP_DATA.regions.find((r) => r.id === state.regionId).days[state.dayIndex];
}

function getDay() {
  const day = getDayRaw();
  if (!isEn()) return day;
  const en = I18N.days[day.id]?.en;
  return en ? { ...day, ...en } : day;
}

function localizeStop(stop) {
  if (!isEn()) return stop;
  const en = I18N.stops[stop.id]?.en;
  return en ? { ...stop, ...en } : stop;
}

function getMyMapsConfig(regionId) {
  return (window.MYMAPS_CONFIG || {})[regionId] || {};
}

function flowchartPage() {
  return state.regionId === "busan" ? "busan-flowchart.html" : "jeju-flowchart.html";
}

function isMapView() {
  return state.view === "map";
}

function isFlowchartView() {
  return state.view === "flowchart";
}

function isFlightsView() {
  return state.view === "flights";
}

function setView(view) {
  if (view === "flowchart") state.view = "flowchart";
  else if (view === "flights") state.view = "flights";
  else state.view = "map";
  if (state.view !== "map") {
    state.mapFocused = false;
    state.activeStopId = null;
  }
  updateUrl();
  renderAll();
}

function locField(obj) {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  return isEn() ? obj.en : obj.zh;
}

function renderFlightsPanel() {
  const root = document.getElementById("flights-content");
  if (!root || !window.FLIGHT_DATA) return;

  const passengers = FLIGHT_DATA.passengers
    .map((p) => `<span class="flight-pax">${p.surname} ${p.given}</span>`)
    .join("");

  const cards = FLIGHT_DATA.flights
    .map((f) => {
      const seats = f.seats
        .map((s) => {
          const bag =
            s.bag && s.bag !== "shared rule"
              ? `<span class="seat-bag">${ui("flightBag")} ${s.bag}</span>`
              : s.bag === "shared rule"
                ? ""
                : `<span class="seat-bag muted">${ui("flightNoBag")}</span>`;
          return `<li><strong>${s.name}</strong><span class="seat-no">${s.seat}</span>${bag}</li>`;
        })
        .join("");

      return `
      <article class="flight-card">
        <div class="flight-card-top">
          <div>
            <p class="flight-date">${locField(f.dateLabel)}</p>
            <h3 class="flight-no">${f.flightNo}</h3>
            <p class="flight-airline">${locField(f.airline)} · ${locField(f.cabin)}${f.fareClass ? ` · ${f.fareClass}` : ""}</p>
          </div>
          <div class="flight-pnr-box">
            <span class="flight-pnr-label">${ui("flightPnr")}</span>
            <code class="flight-pnr">${f.pnr}</code>
          </div>
        </div>
        <div class="flight-route">
          <div class="flight-endpoint">
            <span class="flight-time">${f.depart}</span>
            <span class="flight-code">${f.from.code}</span>
            <span class="flight-airport">${locField(f.from)}</span>
          </div>
          <div class="flight-arrow" aria-hidden="true">→</div>
          <div class="flight-endpoint">
            <span class="flight-time">${f.arrive}</span>
            <span class="flight-code">${f.to.code}</span>
            <span class="flight-airport">${locField(f.to)}</span>
          </div>
        </div>
        <p class="flight-tip"><strong>${ui("flightCheckIn")}</strong> ${locField(f.checkInHint)}</p>
        <p class="flight-tip"><strong>${ui("flightCarry")}</strong> ${locField(f.bagCarry)}</p>
        <div class="flight-seats">
          <h4>${ui("flightSeats")}</h4>
          <ul>${seats}</ul>
        </div>
      </article>`;
    })
    .join("");

  root.innerHTML = `
    <div class="flights-intro">
      <h2>${ui("flightsOverview")}</h2>
      <p class="flights-pax-label">${ui("flightPassengers")}</p>
      <div class="flight-pax-row">${passengers}</div>
    </div>
    ${cards}`;
}

function applyView() {
  const mapPanel = document.getElementById("map-panel");
  const flowPanel = document.getElementById("flowchart-panel");
  const flightsPanel = document.getElementById("flights-panel");
  const restoreBtn = document.getElementById("map-restore");
  const externalLink = document.getElementById("map-open-external");
  const label = document.getElementById("map-mode-label");

  document.querySelectorAll("#view-tabs button[data-view]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === state.view);
    const key =
      btn.dataset.view === "map"
        ? "viewMap"
        : btn.dataset.view === "flowchart"
          ? "viewFlowchart"
          : "viewFlights";
    btn.textContent = ui(key);
  });

  mapPanel?.classList.toggle("active", isMapView());
  flowPanel?.classList.toggle("active", isFlowchartView());
  flightsPanel?.classList.toggle("active", isFlightsView());

  if (isMapView()) {
    externalLink.hidden = false;
    externalLink.textContent = ui("mapFullscreen");
    const myMaps = getMyMapsConfig(state.regionId);
    externalLink.href = isConfigured(myMaps.viewUrl) ? myMaps.viewUrl : "https://www.google.com/maps/d/";
    if (!state.mapFocused) label.textContent = ui("mapOverview");
  } else if (isFlowchartView()) {
    restoreBtn.hidden = true;
    externalLink.hidden = false;
    label.textContent = ui("flowchartOverview");
    externalLink.textContent = ui("flowchartFullscreen");
    externalLink.href = flowchartPage();
    const frame = document.getElementById("flowchart-frame");
    if (frame) {
      frame.title = ui("iframeFlowchart");
      const src = flowchartPage();
      if (!frame.getAttribute("src")?.includes(src)) frame.src = src;
    }
  } else {
    restoreBtn.hidden = true;
    externalLink.hidden = true;
    label.textContent = ui("flightsOverview");
    renderFlightsPanel();
  }
}

function isConfigured(url) {
  return url && !url.includes("YOUR_") && url.startsWith("http");
}

function mapsHl() {
  return isEn() ? "en" : "zh-TW";
}

function placeEmbedUrl(stop) {
  const s = localizeStop(stop);
  if (stop.cid) {
    return `https://maps.google.com/maps?cid=${stop.cid}&hl=${mapsHl()}&output=embed`;
  }
  const q = encodeURIComponent(`${s.name} ${stop.lat},${stop.lng}`);
  return `https://maps.google.com/maps?q=${q}&ll=${stop.lat},${stop.lng}&z=16&hl=${mapsHl()}&output=embed`;
}

function stopMapsUrl(stop) {
  if (stop.cid) return `https://maps.google.com/?cid=${stop.cid}`;
  return `https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`;
}

function stopDirectionsUrl(stop) {
  return `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=driving`;
}

function directionsUrl(stops) {
  const pts = stops.filter((s) => !s.skipMarker);
  if (pts.length < 2) return null;
  const origin = `${pts[0].lat},${pts[0].lng}`;
  const dest = `${pts[pts.length - 1].lat},${pts[pts.length - 1].lng}`;
  const waypoints = pts.slice(1, -1).map((s) => `${s.lat},${s.lng}`).join("|");
  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=driving`;
  if (waypoints) url += `&waypoints=${waypoints}`;
  return url;
}

function setMapFrameSrc(src) {
  const frame = document.getElementById("map-frame");
  if (frame.src !== src) frame.src = src;
}

function applyStaticUi() {
  applyTheme();
  document.documentElement.lang = isEn() ? "en" : "zh-Hant";
  document.title = isEn()
    ? "Busan + Jeju 2026 · Interactive Trip Map"
    : "釜山 + 濟州島 2026 · 互動行程地圖";

  document.getElementById("map-restore").textContent = ui("mapRestore");
  document.getElementById("map-open-external").textContent = ui("mapFullscreen");
  document.getElementById("day-directions").textContent = ui("dayRoute");
  document.getElementById("map-frame").title = ui("iframeTitle");

  document.querySelector('[data-region="busan"]').textContent = ui("regionBusan");
  document.querySelector('[data-region="jeju"]').textContent = ui("regionJeju");

  document.querySelectorAll(".lang-tabs button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
  });
}

function showMyMapsOverview() {
  if (!isMapView()) return;
  const cfg = getMyMapsConfig(state.regionId);
  state.mapFocused = false;
  state.activeStopId = null;

  document.getElementById("map-restore").hidden = true;
  document.getElementById("map-mode-label").textContent = ui("mapOverview");

  const setup = document.getElementById("map-setup");
  const frame = document.getElementById("map-frame");

  if (!isConfigured(cfg.embedUrl)) {
    setup.classList.add("visible");
    frame.style.visibility = "hidden";
    frame.removeAttribute("src");
    return;
  }

  setup.classList.remove("visible");
  frame.style.visibility = "visible";
  setMapFrameSrc(cfg.embedUrl);
}

function renderSidebar() {
  const region = getRegion();
  const day = getDay();
  const visibleStops = day.stops.filter((s) => !s.skipMarker);
  const color = region.dayColors[state.dayIndex];
  const myMaps = getMyMapsConfig(state.regionId);

  document.getElementById("sidebar-title").textContent = `${region.name} · ${day.label}`;
  document.getElementById("sidebar-theme").textContent = day.theme;
  document.getElementById("stat-stops").textContent = `${visibleStops.length}${ui("stops")}`;
  document.getElementById("stat-region").textContent = region.dates;

  const dayHint = document.getElementById("day-hint");
  if (isFlightsView()) {
    dayHint.textContent = ui("flightsHint");
  } else if (isFlowchartView()) {
    dayHint.textContent = ui("flowchartHint");
  } else if (isConfigured(myMaps.embedUrl)) {
    dayHint.textContent = uiFn("dayHint", day.label.split(" · ")[0]);
  } else {
    dayHint.textContent = "";
  }

  const openLink = document.getElementById("map-open-external");
  if (isMapView()) {
    openLink.hidden = false;
    openLink.href = isConfigured(myMaps.viewUrl) ? myMaps.viewUrl : "https://www.google.com/maps/d/";
  } else if (isFlowchartView()) {
    openLink.hidden = false;
    openLink.href = flowchartPage();
    openLink.textContent = ui("flowchartFullscreen");
  } else {
    openLink.hidden = true;
  }

  const dirEl = document.getElementById("day-directions");
  const dirLink = directionsUrl(day.stops);
  dirEl.href = dirLink || "#";
  dirEl.style.display = dirLink ? "inline" : "none";

  document.querySelectorAll(".region-tabs button[data-region]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.region === state.regionId);
  });

  const dayTabs = document.getElementById("day-tabs");
  dayTabs.innerHTML = "";
  TRIP_DATA.regions.find((r) => r.id === state.regionId).days.forEach((d, i) => {
    const btn = document.createElement("button");
    btn.textContent = d.label.replace(/ · .*/, "");
    btn.classList.toggle("active", i === state.dayIndex);
    btn.addEventListener("click", () => {
      state.dayIndex = i;
      state.activeStopId = null;
      state.mapFocused = false;
      updateUrl();
      renderAll();
    });
    dayTabs.appendChild(btn);
  });

  document.getElementById("legend").innerHTML = getRegion()
    .days.map(
      (d, i) =>
        `<span class="legend-item"><span class="legend-dot" style="background:${region.dayColors[i]}"></span>${d.label.split(" · ")[0]}</span>`
    )
    .join("");

  const list = document.getElementById("itinerary");
  list.innerHTML = "";
  let num = 0;
  day.stops.forEach((rawStop) => {
    if (rawStop.skipMarker) return;
    const stop = localizeStop(rawStop);
    num += 1;
    const el = document.createElement("div");
    el.className = "stop-item" + (state.activeStopId === stop.id ? " active" : "");
    el.dataset.id = stop.id;
    el.innerHTML = `
      <div class="stop-num" style="background:${color}">${num}</div>
      <div class="stop-body">
        <div class="stop-time">${stop.time}</div>
        <div class="stop-name">${stop.name}</div>
        ${rawStop.nameKo ? `<div class="stop-ko">${rawStop.nameKo}</div>` : ""}
        <div class="stop-desc">${stop.desc}</div>
        ${stop.transport && stop.transport !== "—" ? `<div class="stop-transport">${stop.transport}</div>` : ""}
        <div class="stop-actions">
          <a href="#" class="stop-focus">${ui("mapLocate")}</a>
          <a href="${stopMapsUrl(rawStop)}" target="_blank" rel="noopener">${ui("googleMaps")}</a>
          <a href="${stopDirectionsUrl(rawStop)}" target="_blank" rel="noopener">${ui("navigate")}</a>
        </div>
      </div>`;
    el.addEventListener("click", (e) => {
      if (e.target.closest("a") && !e.target.classList.contains("stop-focus")) return;
      e.preventDefault();
      focusStop(stop.id);
    });
    list.appendChild(el);
  });
}

function focusStop(stopId) {
  if (!isMapView()) {
    state.view = "map";
    applyView();
  }
  const rawStop = getDayRaw().stops.find((s) => s.id === stopId);
  if (!rawStop) return;
  const stop = localizeStop(rawStop);

  state.activeStopId = stopId;
  state.mapFocused = true;

  document.getElementById("map-setup").classList.remove("visible");
  document.getElementById("map-frame").style.visibility = "visible";
  setMapFrameSrc(placeEmbedUrl(rawStop));

  document.getElementById("map-restore").hidden = false;
  document.getElementById("map-mode-label").textContent = `${ui("mapFocus")}${stop.name}`;

  renderSidebar();
  document.querySelector(`.stop-item[data-id="${stopId}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function renderHeader() {
  const meta = getMeta();
  document.getElementById("page-title").textContent = meta.title;
  document.getElementById("page-subtitle").textContent = meta.subtitle;
  document.getElementById("flights-bar").innerHTML = meta.flights
    .map((f) => `<span><span class="flight-code">${f.code}</span> ${f.date} · ${f.route}</span>`)
    .join("");
}

function renderSetupPanel() {
  const setup = document.getElementById("map-setup");
  if (!setup) return;
  const h3 = setup.querySelector("h3");
  const intro = setup.querySelector(".setup-intro");
  const note = setup.querySelector(".setup-note");
  if (h3) h3.textContent = ui("setupTitle");
  if (intro) intro.textContent = ui("setupIntro");
  if (note) note.textContent = ui("setupNote");
}

function renderAll() {
  applyStaticUi();
  applyView();
  renderHeader();
  renderSetupPanel();
  if (isMapView() && !state.mapFocused) showMyMapsOverview();
  renderSidebar();
}

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.set("region", state.regionId);
  url.searchParams.set("day", String(state.dayIndex + 1));
  if (state.lang === "en") url.searchParams.set("lang", "en");
  else url.searchParams.delete("lang");
  if (state.view === "flowchart" || state.view === "flights") {
    url.searchParams.set("view", state.view);
  } else {
    url.searchParams.delete("view");
  }
  history.replaceState(null, "", url);
}

function setLang(lang) {
  state.lang = lang === "en" ? "en" : "zh";
  try {
    localStorage.setItem("trip-lang", state.lang);
  } catch (_) { /* Safari private mode */ }
  updateUrl();
  renderAll();
}

function boot() {
  document.getElementById("map-restore").addEventListener("click", () => {
    state.mapFocused = false;
    state.activeStopId = null;
    showMyMapsOverview();
    renderSidebar();
  });

  document.querySelector(".header-actions")?.addEventListener("click", (e) => {
    if (e.target.closest("#theme-toggle")) {
      e.preventDefault();
      toggleTheme();
      return;
    }
    const langBtn = e.target.closest(".lang-tabs button[data-lang]");
    if (langBtn) {
      e.preventDefault();
      setLang(langBtn.dataset.lang);
      return;
    }
    const regionBtn = e.target.closest(".region-tabs button[data-region]");
    if (regionBtn) {
      state.regionId = regionBtn.dataset.region;
      state.dayIndex = 0;
      state.activeStopId = null;
      state.mapFocused = false;
      updateUrl();
      renderAll();
    }
  });

  document.getElementById("view-tabs")?.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("button[data-view]");
    if (!viewBtn) return;
    e.preventDefault();
    setView(viewBtn.dataset.view);
  });

  try {
    renderAll();
  } catch (err) {
    console.error(err);
  }
}

boot();
