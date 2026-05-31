/* global google, TRIP_DATA, GMAPS_API_KEY */

let map;
let markers = [];
let polylines = [];
let infoWindow;
let state = {
  regionId: "busan",
  dayIndex: 0,
  activeStopId: null,
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

function mapsUrl(lat, lng, name) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
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

function clearMapOverlays() {
  markers.forEach((m) => m.setMap(null));
  polylines.forEach((p) => p.setMap(null));
  markers = [];
  polylines = [];
}

function renderSidebar() {
  const region = getRegion();
  const day = getDay();
  const visibleStops = day.stops.filter((s) => !s.skipMarker);
  const color = region.dayColors[state.dayIndex];

  document.getElementById("sidebar-title").textContent = `${region.name} · ${day.label}`;
  document.getElementById("sidebar-theme").textContent = day.theme;
  document.getElementById("stat-stops").textContent = `${visibleStops.length} 個站點`;
  document.getElementById("stat-region").textContent = region.dates;

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
          <a href="${mapsUrl(stop.lat, stop.lng, stop.name)}" target="_blank" rel="noopener">📍 Google Maps</a>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=driving" target="_blank" rel="noopener">🧭 導航</a>
        </div>
      </div>`;
    el.addEventListener("click", () => focusStop(stop.id));
    list.appendChild(el);
  });
}

function focusStop(stopId) {
  state.activeStopId = stopId;
  const stop = getDay().stops.find((s) => s.id === stopId);
  if (!stop || !map) return;
  map.panTo({ lat: stop.lat, lng: stop.lng });
  map.setZoom(15);
  const marker = markers.find((m) => m.stopId === stopId);
  if (marker) {
    infoWindow.setContent(`<strong>${stop.name}</strong><br>${stop.time}<br>${stop.desc}`);
    infoWindow.open(map, marker);
  }
  renderSidebar();
  const activeEl = document.querySelector(`.stop-item[data-id="${stopId}"]`);
  if (activeEl) activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
}

function renderMap() {
  if (!map) return;
  clearMapOverlays();
  const region = getRegion();
  const day = getDay();
  const color = region.dayColors[state.dayIndex];
  const path = [];
  let num = 0;

  day.stops.forEach((stop) => {
    if (stop.skipMarker) {
      path.push({ lat: stop.lat, lng: stop.lng });
      return;
    }
    num += 1;
    path.push({ lat: stop.lat, lng: stop.lng });

    const marker = new google.maps.Marker({
      position: { lat: stop.lat, lng: stop.lng },
      map,
      title: stop.name,
      label: { text: String(num), color: "#fff", fontSize: "11px", fontWeight: "700" },
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 14,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 2,
      },
    });
    marker.stopId = stop.id;
    marker.addListener("click", () => focusStop(stop.id));
    markers.push(marker);
  });

  if (path.length > 1) {
    const line = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 0.85,
      strokeWeight: 4,
      map,
      icons: [
        {
          icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3, strokeColor: color },
          offset: "50%",
          repeat: "120px",
        },
      ],
    });
    polylines.push(line);
  }

  const bounds = new google.maps.LatLngBounds();
  path.forEach((p) => bounds.extend(p));
  if (path.length === 1) {
    map.setCenter(path[0]);
    map.setZoom(14);
  } else {
    map.fitBounds(bounds, 48);
  }
}

function renderAll() {
  renderSidebar();
  renderMap();
}

function updateUrl() {
  const url = new URL(location.href);
  url.searchParams.set("region", state.regionId);
  url.searchParams.set("day", String(state.dayIndex + 1));
  history.replaceState(null, "", url);
}

function initMap() {
  infoWindow = new google.maps.InfoWindow();
  const region = getRegion();

  map = new google.maps.Map(document.getElementById("map"), {
    center: region.center,
    zoom: region.zoom,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    gestureHandling: "greedy",
  });

  document.querySelectorAll(".region-tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.regionId = btn.dataset.region;
      state.dayIndex = 0;
      state.activeStopId = null;
      map.setCenter(getRegion().center);
      map.setZoom(getRegion().zoom);
      updateUrl();
      renderAll();
    });
  });

  renderAll();
}

function showMapError() {
  document.getElementById("map-error").classList.add("visible");
}

function boot() {
  const flightsBar = document.getElementById("flights-bar");
  flightsBar.innerHTML = TRIP_DATA.meta.flights
    .map((f) => `<span>✈️ ${f.date} ${f.code} ${f.route}</span>`)
    .join("");

  document.getElementById("page-title").textContent = TRIP_DATA.meta.title;
  document.getElementById("page-subtitle").textContent = TRIP_DATA.meta.subtitle;

  const key = window.GMAPS_API_KEY || "";
  if (!key || key === "YOUR_API_KEY_HERE") {
    showMapError();
    renderSidebar();
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;
  script.async = true;
  script.defer = true;
  script.onerror = showMapError;
  document.head.appendChild(script);
}

boot();
