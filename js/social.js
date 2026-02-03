// ============================================================
// GeoLayers — Social Layer (Friend Avatars, Ghost Mode, POIs)
// ============================================================

(function () {
  'use strict';

  // Check if map is ready
  if (!window.geoMap) {
    console.warn('Map not ready - social layer skipped');
    return;
  }

  // --- Constants ---
  var DEFAULT_CENTER = [32.0853, 34.7818]; // Tel Aviv

  // --- Friend Avatar Data ---
  var friends = [
    { name: 'Maya', lat: 32.0863, lng: 34.7828, emoji: '🧑‍🎨' },
    { name: 'Ori', lat: 32.0843, lng: 34.7808, emoji: '🎸' },
    { name: 'Noa', lat: 32.0873, lng: 34.7798, emoji: '📸' },
    { name: 'Amit', lat: 32.0833, lng: 34.7838, emoji: '🏃' },
    { name: 'Yael', lat: 32.0853, lng: 34.7848, emoji: '🎨' }
  ];

  // --- POI Data ---
  var pois = [
    { name: 'Ancient Market Square', lat: 32.0858, lng: 34.7823, type: 'market' },
    { name: 'Historical Museum', lat: 32.0848, lng: 34.7813, type: 'museum' },
    { name: 'Old Temple Ruins', lat: 32.0868, lng: 34.7803, type: 'temple' },
    { name: 'Garden Park', lat: 32.0838, lng: 34.7833, type: 'park' },
    { name: 'Archaeological Site', lat: 32.0863, lng: 34.7843, type: 'ruins' },
    { name: 'Heritage Center', lat: 32.0843, lng: 34.7793, type: 'museum' }
  ];

  // --- Create Friend Markers ---
  var friendMarkers = [];
  var friendsLayer = L.layerGroup();

  friends.forEach(function (friend) {
    var iconHtml =
      '<div class="friend-marker">' +
      '<div class="friend-marker__emoji">' + friend.emoji + '</div>' +
      '<div class="friend-marker__name">' + friend.name + '</div>' +
      '</div>';

    var icon = L.divIcon({
      className: 'friend-marker-wrapper',
      html: iconHtml,
      iconSize: [40, 50],
      iconAnchor: [20, 50]
    });

    var marker = L.marker([friend.lat, friend.lng], { icon: icon });
    marker.friendData = friend; // Store original position
    friendMarkers.push(marker);
    friendsLayer.addLayer(marker);
  });

  // Add friends layer to map
  window.geoMap.addLayer(friendsLayer);

  // --- Friend Movement Animation ---
  var movementInterval = setInterval(function () {
    friendMarkers.forEach(function (marker) {
      var currentPos = marker.getLatLng();
      var randomLat = currentPos.lat + (Math.random() - 0.5) * 0.0004;
      var randomLng = currentPos.lng + (Math.random() - 0.5) * 0.0004;
      marker.setLatLng([randomLat, randomLng]);
    });
  }, 3000);

  // --- Create POI Markers ---
  var poisLayer = L.layerGroup();

  pois.forEach(function (poi) {
    var marker = L.circleMarker([poi.lat, poi.lng], {
      radius: 6,
      fillColor: 'var(--theme-accent)',
      color: 'rgba(var(--theme-accent-rgb), 0.8)',
      weight: 1,
      fillOpacity: 0.7
    });

    marker.bindTooltip(poi.name, {
      direction: 'top',
      offset: [0, -6],
      opacity: 0.9
    });

    poisLayer.addLayer(marker);
  });

  // Add POIs layer to map
  window.geoMap.addLayer(poisLayer);

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

  // --- Cleanup on unload (optional) ---
  window.addEventListener('beforeunload', function () {
    if (movementInterval) {
      clearInterval(movementInterval);
    }
  });

})();
