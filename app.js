/* global TRIP_DATA, MYMAPS_CONFIG, I18N */

const state = {
  regionId: "busan",
  dayIndex: 0,
  activeStopId: null,
  mapFocused: false,
  lang: "zh",
};

const urlParams = new URLSearchParams(location.search);
if (urlParams.get("region") === "jeju") state.regionId = "jeju";
if (urlParams.get("day")) state.dayIndex = Math.max(0, parseInt(urlParams.get("day"), 10) - 1);
if (urlParams.get("lang") === "en") state.lang = "en";
else {
  try {
    if (localStorage.getItem("trip-lang") === "en") state.lang = "en";
  } catch (_) { /* private browsing */ }
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
  document.documentElement.lang = isEn() ? "en" : "zh-Hant";
  document.title = isEn()
    ? "Busan + Jeju 2026 · Interactive Trip Map"
    : "釜山 + 濟州島 2026 · 互動行程地圖";

  document.getElementById("map-restore").textContent = ui("mapRestore");
  document.getElementById("map-open-mymaps").textContent = ui("mapFullscreen");
  document.getElementById("day-directions").textContent = ui("dayRoute");
  document.getElementById("map-frame").title = ui("iframeTitle");

  document.querySelector('[data-region="busan"]').textContent = ui("regionBusan");
  document.querySelector('[data-region="jeju"]').textContent = ui("regionJeju");

  document.querySelectorAll(".lang-tabs button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
  });
}

function showMyMapsOverview() {
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
  if (isConfigured(myMaps.embedUrl)) {
    dayHint.textContent = uiFn("dayHint", day.label.split(" · ")[0]);
  } else {
    dayHint.textContent = "";
  }

  const openLink = document.getElementById("map-open-mymaps");
  openLink.href = isConfigured(myMaps.viewUrl) ? myMaps.viewUrl : "https://www.google.com/maps/d/";

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
    .map((f) => `<span>✈️ ${f.date} ${f.code} ${f.route}</span>`)
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
  renderHeader();
  renderSetupPanel();
  if (!state.mapFocused) showMyMapsOverview();
  renderSidebar();
}

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.set("region", state.regionId);
  url.searchParams.set("day", String(state.dayIndex + 1));
  if (state.lang === "en") url.searchParams.set("lang", "en");
  else url.searchParams.delete("lang");
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

  try {
    renderAll();
  } catch (err) {
    console.error(err);
  }
}

boot();
