// ============================================================
// GeoLayers — Social Layer (Friend Avatars, Ghost Mode, POIs)
// ============================================================

(function () {
  'use strict';

  if (!window.geoMap) {
    console.warn('Map not ready - social layer skipped');
    return;
  }

  // --- Friend & POI templates (offsets from user position) ---
  var friendTemplates = [
    { name: 'Maya', dLat:  0.0010, dLng:  0.0010, emoji: '\uD83E\uDDD1\u200D\uD83C\uDFA8' },
    { name: 'Ori',  dLat: -0.0010, dLng: -0.0010, emoji: '\uD83C\uDFB8' },
    { name: 'Noa',  dLat:  0.0020, dLng: -0.0020, emoji: '\uD83D\uDCF8' },
    { name: 'Amit', dLat: -0.0020, dLng:  0.0020, emoji: '\uD83C\uDFC3' },
    { name: 'Yael', dLat:  0.0000, dLng:  0.0030, emoji: '\uD83C\uDFA8' }
  ];

  // Period → marker color mapping
  var periodColors = {
    ancient:  '#f59e0b',
    medieval: '#a0845c',
    ottoman:  '#14b8a6',
    modern:   '#3b82f6',
    folklore: '#d946ef'
  };

  function randomRating() {
    return Math.round((3.5 + Math.random() * 1.5) * 10) / 10;
  }
  function randomCount() {
    return Math.floor(12 + Math.random() * 328);
  }

  var poiTemplates = [
    { name: 'Temple of the Sun',       dLat:  0.0020, dLng:  0.0015, type: 'temple',  category: 'religion',    period: 'ancient',   rating: randomRating(), ratingCount: randomCount() },
    { name: 'Bronze Age Excavation',   dLat: -0.0025, dLng:  0.0010, type: 'ruins',   category: 'archaeology', period: 'ancient',   rating: randomRating(), ratingCount: randomCount() },
    { name: 'Roman Aqueduct Remains',  dLat:  0.0030, dLng: -0.0020, type: 'ruins',   category: 'archaeology', period: 'medieval',  rating: randomRating(), ratingCount: randomCount() },
    { name: 'Crusader Watchtower',     dLat: -0.0015, dLng: -0.0035, type: 'ruins',   category: 'archaeology', period: 'medieval',  rating: randomRating(), ratingCount: randomCount() },
    { name: 'Ottoman Bathhouse',       dLat:  0.0010, dLng:  0.0040, type: 'museum',  category: 'archaeology', period: 'ottoman',   rating: randomRating(), ratingCount: randomCount() },
    { name: "Suleiman's Fountain",     dLat: -0.0035, dLng:  0.0025, type: 'market',  category: 'geology',     period: 'ottoman',   rating: randomRating(), ratingCount: randomCount() },
    { name: 'Heritage Museum',         dLat:  0.0005, dLng: -0.0045, type: 'museum',  category: 'archaeology', period: 'modern',    rating: randomRating(), ratingCount: randomCount() },
    { name: 'Nature Reserve Trail',    dLat: -0.0040, dLng: -0.0010, type: 'park',    category: 'nature',      period: 'modern',    rating: randomRating(), ratingCount: randomCount() },
    { name: 'Sacred Grove',            dLat:  0.0035, dLng:  0.0030, type: 'park',    category: 'nature',      period: 'folklore',  rating: randomRating(), ratingCount: randomCount() },
    { name: "Prophet's Cave",          dLat: -0.0010, dLng:  0.0050, type: 'cave',    category: 'religion',    period: 'folklore',  rating: randomRating(), ratingCount: randomCount() },
    { name: 'Geological Overlook',     dLat:  0.0045, dLng: -0.0005, type: 'park',    category: 'geology',     period: 'ancient',   rating: randomRating(), ratingCount: randomCount() },
    { name: 'Old City Marketplace',    dLat: -0.0020, dLng: -0.0040, type: 'market',  category: 'archaeology', period: 'ottoman',   rating: randomRating(), ratingCount: randomCount() },
    { name: 'Monastery Ruins',         dLat:  0.0015, dLng: -0.0035, type: 'ruins',   category: 'religion',    period: 'medieval',  rating: randomRating(), ratingCount: randomCount() },
    { name: 'Wildflower Meadow',       dLat: -0.0045, dLng:  0.0020, type: 'park',    category: 'nature',      period: 'ancient',   rating: randomRating(), ratingCount: randomCount() },
    { name: 'Fossil Cliff',            dLat:  0.0025, dLng:  0.0045, type: 'cave',    category: 'geology',     period: 'modern',    rating: randomRating(), ratingCount: randomCount() }
  ];

  // --- State ---
  var friendMarkers = [];
  var friendsLayer = L.layerGroup();
  var poisLayer = L.layerGroup();
  var markersPlaced = false;
  var movementInterval = null;

  function placeMarkers(centerLat, centerLng) {
    if (markersPlaced) return;
    markersPlaced = true;

    // Create friend markers around the user's position
    friendTemplates.forEach(function (f) {
      var lat = centerLat + f.dLat;
      var lng = centerLng + f.dLng;

      var iconHtml =
        '<div class="friend-marker">' +
        '<div class="friend-marker__emoji">' + f.emoji + '</div>' +
        '<div class="friend-marker__name">' + f.name + '</div>' +
        '</div>';

      var icon = L.divIcon({
        className: 'friend-marker-wrapper',
        html: iconHtml,
        iconSize: [40, 50],
        iconAnchor: [20, 50]
      });

      var marker = L.marker([lat, lng], { icon: icon });
      friendMarkers.push(marker);
      friendsLayer.addLayer(marker);
    });

    window.geoMap.addLayer(friendsLayer);

    // Animate friend movement
    movementInterval = setInterval(function () {
      friendMarkers.forEach(function (marker) {
        var pos = marker.getLatLng();
        marker.setLatLng([
          pos.lat + (Math.random() - 0.5) * 0.0004,
          pos.lng + (Math.random() - 0.5) * 0.0004
        ]);
      });
    }, 3000);

    // Create POI markers around the user's position
    poiTemplates.forEach(function (p) {
      var lat = centerLat + p.dLat;
      var lng = centerLng + p.dLng;
      var color = periodColors[p.period] || '#f59e0b';

      var icon = L.divIcon({
        className: '',
        html: '<div class="poi-marker" style="background:' + color + '; box-shadow: 0 0 6px ' + color + ';"></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      var marker = L.marker([lat, lng], { icon: icon });

      var starsText = p.rating.toFixed(1);
      marker.bindTooltip(p.name + ' \u2605 ' + starsText, {
        direction: 'top',
        offset: [0, -8],
        opacity: 0.9
      });

      marker.on('click', function () {
        if (window.showPoiContent) {
          window.showPoiContent(p);
        }
      });

      poisLayer.addLayer(marker);
    });

    window.geoMap.addLayer(poisLayer);
  }

  // Wait for GPS position, fall back to map center after timeout
  function waitForPosition() {
    // If GPS already available, use it
    if (window.geoState.position) {
      placeMarkers(window.geoState.position.lat, window.geoState.position.lng);
      return;
    }

    // Poll for GPS position, timeout after 5s and use map center
    var attempts = 0;
    var poll = setInterval(function () {
      attempts++;
      if (window.geoState.position) {
        clearInterval(poll);
        placeMarkers(window.geoState.position.lat, window.geoState.position.lng);
      } else if (attempts > 10) {
        clearInterval(poll);
        var center = window.geoMap.getCenter();
        placeMarkers(center.lat, center.lng);
      }
    }, 500);
  }

  waitForPosition();

  // --- Ghost Mode Toggle ---
  var ghostToggle = document.getElementById('ghost-toggle');
  var ghostModeActive = false;

  if (ghostToggle) {
    ghostToggle.addEventListener('click', function () {
      ghostModeActive = !ghostModeActive;

      if (ghostModeActive) {
        ghostToggle.classList.add('ghost-toggle--active');
        window.geoMap.removeLayer(friendsLayer);
      } else {
        ghostToggle.classList.remove('ghost-toggle--active');
        window.geoMap.addLayer(friendsLayer);
      }
    });
  }

  // --- Content Panel Reopen Button ---
  var contentPanel = document.getElementById('content-panel');
  var reopenBtn = document.getElementById('content-reopen');

  if (contentPanel && reopenBtn) {
    function isPanelVisible() {
      return contentPanel.classList.contains('content-panel--open') ||
             contentPanel.classList.contains('content-panel--expanded') ||
             contentPanel.classList.contains('content-panel--collapsed');
    }

    var panelObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === 'class') {
          reopenBtn.style.display = isPanelVisible() ? 'none' : 'flex';
        }
      });
    });

    panelObserver.observe(contentPanel, { attributes: true });

    reopenBtn.addEventListener('click', function () {
      contentPanel.classList.add('content-panel--open');
      contentPanel.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      contentPanel.style.transform = 'translateY(55%)';
    });

    reopenBtn.style.display = isPanelVisible() ? 'none' : 'flex';
  }

  window.addEventListener('beforeunload', function () {
    if (movementInterval) clearInterval(movementInterval);
  });

})();
