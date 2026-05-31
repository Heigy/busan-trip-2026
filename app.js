/* global TRIP_DATA, MYMAPS_CONFIG */

const state = {
  regionId: "busan",
  dayIndex: 0,
  activeStopId: null,
  mapFocused: false,
};

const urlParams = new URLSearchParams(location.search);
if (urlParams.get("region") === "jeju") state.regionId = "jeju";
if (urlParams.get("day")) state.dayIndex = Math.max(0, parseInt(urlParams.get("day"), 10) - 1);

function getRegion() {
  return TRIP_DATA.regions.find((r) => r.id === state.regionId);
}

function getDay() {
  return getRegion().days[state.dayIndex];
}

function getMyMapsConfig(regionId) {
  const cfg = window.MYMAPS_CONFIG || {};
  return cfg[regionId] || {};
}

function isConfigured(url) {
  return url && !url.includes("YOUR_") && url.startsWith("http");
}

function placeEmbedUrl(stop) {
  if (stop.cid) {
    return `https://maps.google.com/maps?cid=${stop.cid}&hl=zh-TW&output=embed`;
  }
  const q = encodeURIComponent(`${stop.name} ${stop.lat},${stop.lng}`);
  return `https://maps.google.com/maps?q=${q}&ll=${stop.lat},${stop.lng}&z=16&hl=zh-TW&output=embed`;
}

function stopMapsUrl(stop) {
  if (stop.cid) return `https://maps.google.com/?cid=${stop.cid}`;
  return `https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`;
}

function stopDirectionsUrl(stop) {
  if (stop.cid) {
    return `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=driving`;
  }
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

function showMyMapsOverview() {
  const cfg = getMyMapsConfig(state.regionId);
  state.mapFocused = false;
  state.activeStopId = null;

  document.getElementById("map-restore").hidden = true;
  document.getElementById("map-mode-label").textContent = "My Maps 總覽";

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
  document.getElementById("stat-stops").textContent = `${visibleStops.length} 個站點`;
  document.getElementById("stat-region").textContent = region.dates;

  const dayHint = document.getElementById("day-hint");
  if (isConfigured(myMaps.embedUrl)) {
    const dayFolder = day.label.split(" · ")[0];
    dayHint.textContent = `💡 左側 My Maps 圖層欄勾選「${dayFolder}」查看當日標記`;
  } else {
    dayHint.textContent = "";
  }

  const openLink = document.getElementById("map-open-mymaps");
  if (isConfigured(myMaps.viewUrl)) {
    openLink.href = myMaps.viewUrl;
    openLink.style.display = "inline-flex";
  } else {
    openLink.href = "https://www.google.com/maps/d/";
    openLink.style.display = "inline-flex";
  }

  const dirLink = directionsUrl(day.stops);
  const dirEl = document.getElementById("day-directions");
  if (dirLink) {
    dirEl.href = dirLink;
    dirEl.style.display = "inline";
  } else {
    dirEl.style.display = "none";
  }

  document.querySelectorAll(".region-tabs button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.region === state.regionId);
  });

  const dayTabs = document.getElementById("day-tabs");
  dayTabs.innerHTML = "";
  region.days.forEach((d, i) => {
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

  const legend = document.getElementById("legend");
  legend.innerHTML = region.days
    .map(
      (d, i) =>
        `<span class="legend-item"><span class="legend-dot" style="background:${region.dayColors[i]}"></span>${d.label.split(" · ")[0]}</span>`
    )
    .join("");

  const list = document.getElementById("itinerary");
  list.innerHTML = "";
  let num = 0;
  day.stops.forEach((stop) => {
    if (stop.skipMarker) return;
    num += 1;
    const el = document.createElement("div");
    el.className = "stop-item" + (state.activeStopId === stop.id ? " active" : "");
    el.dataset.id = stop.id;
    el.innerHTML = `
      <div class="stop-num" style="background:${color}">${num}</div>
      <div class="stop-body">
        <div class="stop-time">${stop.time}</div>
        <div class="stop-name">${stop.name}</div>
        ${stop.nameKo ? `<div class="stop-ko">${stop.nameKo}</div>` : ""}
        <div class="stop-desc">${stop.desc}</div>
        ${stop.transport && stop.transport !== "—" ? `<div class="stop-transport">${stop.transport}</div>` : ""}
        <div class="stop-actions">
          <a href="#" class="stop-focus" data-id="${stop.id}">🗺️ 地圖定位</a>
          <a href="${stopMapsUrl(stop)}" target="_blank" rel="noopener">📍 Google Maps</a>
          <a href="${stopDirectionsUrl(stop)}" target="_blank" rel="noopener">🧭 導航</a>
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
  const stop = getDay().stops.find((s) => s.id === stopId);
  if (!stop) return;

  state.activeStopId = stopId;
  state.mapFocused = true;

  document.getElementById("map-setup").classList.remove("visible");
  const frame = document.getElementById("map-frame");
  frame.style.visibility = "visible";
  setMapFrameSrc(placeEmbedUrl(stop));

  document.getElementById("map-restore").hidden = false;
  document.getElementById("map-mode-label").textContent = `定位：${stop.name}`;

  renderSidebar();
  const activeEl = document.querySelector(`.stop-item[data-id="${stopId}"]`);
  if (activeEl) activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function renderAll() {
  if (!state.mapFocused) showMyMapsOverview();
  renderSidebar();
}

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.set("region", state.regionId);
  url.searchParams.set("day", String(state.dayIndex + 1));
  history.replaceState(null, "", url);
}

function boot() {
  document.getElementById("flights-bar").innerHTML = TRIP_DATA.meta.flights
    .map((f) => `<span>✈️ ${f.date} ${f.code} ${f.route}</span>`)
    .join("");

  document.getElementById("page-title").textContent = TRIP_DATA.meta.title;
  document.getElementById("page-subtitle").textContent = TRIP_DATA.meta.subtitle;

  document.getElementById("map-restore").addEventListener("click", () => {
    state.mapFocused = false;
    state.activeStopId = null;
    showMyMapsOverview();
    renderSidebar();
  });

  document.querySelectorAll(".region-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.regionId = btn.dataset.region;
      state.dayIndex = 0;
      state.activeStopId = null;
      state.mapFocused = false;
      updateUrl();
      renderAll();
    });
  });

  renderAll();
}

boot();
