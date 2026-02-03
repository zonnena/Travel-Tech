// ============================================================
// GeoLayers — Map Initialization & GPS Positioning
// ============================================================

// --- Global State (accessible by all modules) ---
window.geoState = {
  timePeriod: 'ancient',
  category: 'archaeology',
  position: null
};

(function () {
  'use strict';

  // --- Constants ---
  var DEFAULT_CENTER = [32.0853, 34.7818]; // Tel Aviv
  var DEFAULT_ZOOM = 15;
  var TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  var TILE_ATTR =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
    '&copy; <a href="https://carto.com/">CARTO</a>';

  // --- DOM refs ---
  var statusText = document.getElementById('status-text');
  var statusPill = document.getElementById('status-pill');

  // --- Map setup ---
  var map = L.map('map', {
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    zoomControl: true
  });

  L.tileLayer(TILE_URL, {
    attribution: TILE_ATTR,
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // --- User marker (pulsing div icon) ---
  var userIcon = L.divIcon({
    className: 'user-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });

  var userMarker = null;

  function setUserPosition(lat, lng) {
    if (userMarker) {
      userMarker.setLatLng([lat, lng]);
    } else {
      userMarker = L.marker([lat, lng], { icon: userIcon }).addTo(map);
    }
  }

  function updateStatus(text, active) {
    statusText.textContent = text;
    if (active) {
      statusPill.classList.add('status-pill--active');
    } else {
      statusPill.classList.remove('status-pill--active');
    }
  }

  // --- Geolocation ---
  function onLocationFound(pos) {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;
    map.flyTo([lat, lng], DEFAULT_ZOOM);
    setUserPosition(lat, lng);
    window.geoState.position = { lat: lat, lng: lng };
    updateStatus('GPS Active', true);
  }

  function onLocationError() {
    updateStatus('GPS unavailable \u2014 showing Tel Aviv', false);
  }

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(onLocationFound, onLocationError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    });

    navigator.geolocation.watchPosition(
      function (pos) {
        setUserPosition(pos.coords.latitude, pos.coords.longitude);
        window.geoState.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      },
      function () {
        // Silently ignore watch errors after initial attempt
      },
      { enableHighAccuracy: true, maximumAge: 30000 }
    );
  } else {
    onLocationError();
  }
})();

// ============================================================
// GeoLayers — Dual-Axis Navigator Interaction
// ============================================================

(function () {
  'use strict';

  var timeAxis = document.getElementById('time-axis');
  var categoryBar = document.getElementById('category-bar');
  var body = document.body;

  // Set initial theme class
  body.classList.add('theme-ancient');

  // --- Time Period Selection ---
  timeAxis.addEventListener('click', function (e) {
    var btn = e.target.closest('.time-axis__item');
    if (!btn || btn.classList.contains('active')) return;

    // Update active button
    timeAxis.querySelector('.active').classList.remove('active');
    btn.classList.add('active');

    // Update state
    var period = btn.getAttribute('data-period');
    window.geoState.timePeriod = period;

    // Swap theme class on body
    body.className = body.className.replace(/theme-\w+/, '');
    body.classList.add('theme-' + period);

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('timePeriodChange', {
      detail: { timePeriod: period }
    }));
  });

  // --- Category Selection ---
  categoryBar.addEventListener('click', function (e) {
    var btn = e.target.closest('.category-bar__item');
    if (!btn || btn.classList.contains('active')) return;

    // Update active button
    categoryBar.querySelector('.active').classList.remove('active');
    btn.classList.add('active');

    // Update state
    var category = btn.getAttribute('data-category');
    window.geoState.category = category;

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('categoryChange', {
      detail: { category: category }
    }));
  });
})();
