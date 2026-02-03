// ============================================================
// GeoLayers — Map Initialization & GPS Positioning
// ============================================================

// --- Global State (accessible by all modules) ---
window.geoState = {
  timePeriod: 'ancient',
  category: 'archaeology',
  year: null,
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

  // Expose map globally for social.js
  window.geoMap = map;

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
// GeoLayers — 3D Scroll Wheel Pickers
// ============================================================

(function () {
  'use strict';

  var ITEM_ANGLE = 40; // degrees between items on the cylinder
  var DECELERATION = 0.95;
  var SNAP_TRANSITION_MS = 300;
  var DEG_PER_PX = 0.5;
  var RUBBER_BAND_MAX = 15; // degrees past first/last

  // --- WheelPicker Constructor ---
  function WheelPicker(opts) {
    this.container = document.getElementById(opts.containerId);
    this.rotor = document.getElementById(opts.rotorId);
    this.items = this.rotor.querySelectorAll('.wheel-picker__item');
    this.axis = opts.axis; // 'vertical' or 'horizontal'
    this.dataAttr = opts.dataAttr; // 'data-period' or 'data-category'
    this.eventName = opts.eventName;
    this.onSelect = opts.onSelect || function () {};

    this.currentAngle = 0;
    this.selectedIndex = 0;
    this.maxAngle = (this.items.length - 1) * ITEM_ANGLE;
    this.velocity = 0;
    this.animFrame = null;
    this.dragging = false;
    this.lastPos = 0;
    this.lastTime = 0;

    this._positionItems();
    this._bindEvents();
    this._updateSelection(0, true);
  }

  // Place each item on the cylinder surface
  WheelPicker.prototype._positionItems = function () {
    var radius = 90; // translateZ distance
    for (var i = 0; i < this.items.length; i++) {
      var angle = i * ITEM_ANGLE;
      if (this.axis === 'vertical') {
        this.items[i].style.transform =
          'rotateX(' + angle + 'deg) translateZ(' + radius + 'px)';
      } else {
        this.items[i].style.transform =
          'rotateY(' + angle + 'deg) translateZ(' + radius + 'px)';
      }
    }
    this._applyRotorTransform();
  };

  WheelPicker.prototype._applyRotorTransform = function () {
    if (this.axis === 'vertical') {
      this.rotor.style.transform = 'rotateX(' + (-this.currentAngle) + 'deg)';
    } else {
      this.rotor.style.transform = 'rotateY(' + (-this.currentAngle) + 'deg)';
    }
  };

  WheelPicker.prototype._updateSelection = function (index, silent) {
    if (this.items.length === 0) return;

    if (index < 0) index = 0;
    if (index >= this.items.length) index = this.items.length - 1;

    // Update active class
    for (var i = 0; i < this.items.length; i++) {
      this.items[i].classList.toggle('active', i === index);
    }

    if (this.selectedIndex !== index || silent) {
      this.selectedIndex = index;
      var item = this.items[index];
      var value = item.getAttribute(this.dataAttr);

      if (!silent && value) {
        this.onSelect(value);

        // Dispatch custom event
        var detail = {};
        detail[this.dataAttr.replace('data-', '')] = value;
        document.dispatchEvent(new CustomEvent(this.eventName, { detail: detail }));
      }
    }
  };

  WheelPicker.prototype._snapToNearest = function () {
    var nearest = Math.round(this.currentAngle / ITEM_ANGLE) * ITEM_ANGLE;
    nearest = Math.max(0, Math.min(nearest, this.maxAngle));

    this.rotor.style.transition = 'transform ' + SNAP_TRANSITION_MS + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
    this.currentAngle = nearest;
    this._applyRotorTransform();

    var self = this;
    setTimeout(function () {
      self.rotor.style.transition = '';
    }, SNAP_TRANSITION_MS);

    this._updateSelection(Math.round(nearest / ITEM_ANGLE), false);
  };

  WheelPicker.prototype._clampWithRubberBand = function (angle) {
    if (angle < 0) {
      return angle * (RUBBER_BAND_MAX / (RUBBER_BAND_MAX - angle));
    }
    if (angle > this.maxAngle) {
      var over = angle - this.maxAngle;
      return this.maxAngle + over * (RUBBER_BAND_MAX / (RUBBER_BAND_MAX + over));
    }
    return angle;
  };

  WheelPicker.prototype._startMomentum = function () {
    var self = this;
    if (self.animFrame) cancelAnimationFrame(self.animFrame);

    function step() {
      if (Math.abs(self.velocity) < 0.3) {
        self._snapToNearest();
        return;
      }
      self.velocity *= DECELERATION;
      self.currentAngle += self.velocity;
      self.currentAngle = self._clampWithRubberBand(self.currentAngle);

      // If rubber-banding, kill velocity faster
      if (self.currentAngle < 0 || self.currentAngle > self.maxAngle) {
        self.velocity *= 0.7;
      }

      self._applyRotorTransform();
      self.animFrame = requestAnimationFrame(step);
    }
    self.animFrame = requestAnimationFrame(step);
  };

  // --- Input Binding ---
  WheelPicker.prototype._bindEvents = function () {
    var self = this;

    function getPos(e) {
      if (e.touches && e.touches.length) {
        return self.axis === 'vertical' ? e.touches[0].clientY : e.touches[0].clientX;
      }
      return self.axis === 'vertical' ? e.clientY : e.clientX;
    }

    function onStart(e) {
      if (self.animFrame) cancelAnimationFrame(self.animFrame);
      self.rotor.style.transition = '';
      self.dragging = true;
      self.velocity = 0;
      self.lastPos = getPos(e);
      self.lastTime = Date.now();
      e.preventDefault();
    }

    function onMove(e) {
      if (!self.dragging) return;
      var pos = getPos(e);
      var delta = pos - self.lastPos;
      var now = Date.now();
      var dt = now - self.lastTime || 16;

      var angleDelta = delta * DEG_PER_PX;
      self.currentAngle = self._clampWithRubberBand(self.currentAngle + angleDelta);
      self._applyRotorTransform();

      self.velocity = angleDelta * (16 / dt); // normalize to ~60fps
      self.lastPos = pos;
      self.lastTime = now;

      // Live update active highlight
      var liveIndex = Math.round(Math.max(0, Math.min(self.currentAngle, self.maxAngle)) / ITEM_ANGLE);
      for (var i = 0; i < self.items.length; i++) {
        self.items[i].classList.toggle('active', i === liveIndex);
      }

      e.preventDefault();
    }

    function onEnd() {
      if (!self.dragging) return;
      self.dragging = false;
      self._startMomentum();
    }

    // Touch events
    self.container.addEventListener('touchstart', onStart, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    // Mouse events
    self.container.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Scroll wheel
    self.container.addEventListener('wheel', function (e) {
      if (self.animFrame) cancelAnimationFrame(self.animFrame);
      self.rotor.style.transition = '';

      var rawDelta = self.axis === 'vertical' ? e.deltaY : (e.deltaX || e.deltaY);
      // Invert so scroll direction matches visual rotation
      var delta = self.axis === 'vertical' ? rawDelta : -rawDelta;
      var angleDelta = (delta > 0 ? 1 : -1) * ITEM_ANGLE;
      var target = Math.round(self.currentAngle / ITEM_ANGLE) * ITEM_ANGLE + angleDelta;
      target = Math.max(0, Math.min(target, self.maxAngle));

      self.rotor.style.transition = 'transform ' + SNAP_TRANSITION_MS + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
      self.currentAngle = target;
      self._applyRotorTransform();

      setTimeout(function () {
        self.rotor.style.transition = '';
      }, SNAP_TRANSITION_MS);

      self._updateSelection(Math.round(target / ITEM_ANGLE), false);
      e.preventDefault();
    }, { passive: false });

    // Click on item to select
    self.container.addEventListener('click', function (e) {
      var item = e.target.closest('.wheel-picker__item');
      if (!item) return;
      var idx = Array.prototype.indexOf.call(self.items, item);
      if (idx === -1) return;

      var target = idx * ITEM_ANGLE;
      self.rotor.style.transition = 'transform ' + SNAP_TRANSITION_MS + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
      self.currentAngle = target;
      self._applyRotorTransform();

      setTimeout(function () {
        self.rotor.style.transition = '';
      }, SNAP_TRANSITION_MS);

      self._updateSelection(idx, false);
    });
  };

  // --- Rebuild method (replaces rotor items dynamically) ---
  WheelPicker.prototype.rebuild = function (newItems) {
    // Clear existing items
    while (this.rotor.firstChild) {
      this.rotor.removeChild(this.rotor.firstChild);
    }

    // Create new item elements
    for (var i = 0; i < newItems.length; i++) {
      var div = document.createElement('div');
      div.className = 'wheel-picker__item';
      div.setAttribute(this.dataAttr, newItems[i].value);
      div.textContent = newItems[i].label;
      this.rotor.appendChild(div);
    }

    // Re-query items and recalculate
    this.items = this.rotor.querySelectorAll('.wheel-picker__item');
    this.maxAngle = (this.items.length - 1) * ITEM_ANGLE;
    this.currentAngle = 0;
    this.selectedIndex = 0;
    this.velocity = 0;

    this._positionItems();
    this._updateSelection(0, true);

    // Fire initial selection so state updates
    if (this.items.length > 0) {
      var value = this.items[0].getAttribute(this.dataAttr);
      if (value) {
        this.onSelect(value);
        var detail = {};
        detail[this.dataAttr.replace('data-', '')] = value;
        document.dispatchEvent(new CustomEvent(this.eventName, { detail: detail }));
      }
    }
  };

  // --- Year Data Map ---
  var YEAR_ITEMS = {
    ancient: [
      { label: '3000 BCE', value: -3000 },
      { label: '2000 BCE', value: -2000 },
      { label: '1000 BCE', value: -1000 },
      { label: '1 CE',     value: 1 },
      { label: '500 CE',   value: 500 }
    ],
    medieval: [
      { label: '500',  value: 500 },
      { label: '600',  value: 600 },
      { label: '700',  value: 700 },
      { label: '800',  value: 800 },
      { label: '900',  value: 900 },
      { label: '1000', value: 1000 },
      { label: '1100', value: 1100 },
      { label: '1200', value: 1200 },
      { label: '1300', value: 1300 },
      { label: '1400', value: 1400 }
    ],
    ottoman: [
      { label: '1500', value: 1500 },
      { label: '1600', value: 1600 },
      { label: '1700', value: 1700 },
      { label: '1800', value: 1800 },
      { label: '1900', value: 1900 }
    ],
    modern: [
      { label: '1900', value: 1900 },
      { label: '1950', value: 1950 },
      { label: '2000', value: 2000 }
    ],
    folklore: [
      { label: 'Myths',        value: 'myths' },
      { label: 'Legends',      value: 'legends' },
      { label: 'Oral Lore',    value: 'oral' },
      { label: 'Living Tales', value: 'living' }
    ]
  };

  // --- Initialize Wheels ---
  var body = document.body;
  body.classList.add('theme-ancient');

  // Year Wheel (must be created before period wheel so period onSelect can reference it)
  var yearWheel = new WheelPicker({
    containerId: 'year-axis',
    rotorId: 'year-rotor',
    axis: 'vertical',
    dataAttr: 'data-year',
    eventName: 'yearChange',
    onSelect: function (year) {
      window.geoState.year = year;
    }
  });

  // Populate year wheel with initial period data
  yearWheel.rebuild(YEAR_ITEMS.ancient);

  // Time Period Wheel
  new WheelPicker({
    containerId: 'time-axis',
    rotorId: 'time-rotor',
    axis: 'vertical',
    dataAttr: 'data-period',
    eventName: 'timePeriodChange',
    onSelect: function (period) {
      window.geoState.timePeriod = period;
      body.className = body.className.replace(/theme-\w+/, '');
      body.classList.add('theme-' + period);

      // Rebuild year wheel for this period
      if (YEAR_ITEMS[period]) {
        yearWheel.rebuild(YEAR_ITEMS[period]);
      }
    }
  });

  // Category Wheel
  new WheelPicker({
    containerId: 'category-bar',
    rotorId: 'category-rotor',
    axis: 'horizontal',
    dataAttr: 'data-category',
    eventName: 'categoryChange',
    onSelect: function (category) {
      window.geoState.category = category;
    }
  });

  // ============================================================
  // Timeline Drawer — collapsible left panel
  // ============================================================

  var drawer = document.getElementById('timeline-drawer');
  var drawerTab = document.getElementById('timeline-tab');
  if (drawer && drawerTab) {
    var drawerOpen = false;
    var drawerDragging = false;
    var drawerStartX = 0;
    var drawerCurrentX = 0;
    var drawerVelocity = 0;
    var drawerLastX = 0;
    var drawerLastTime = 0;
    // Total width of the panel content (period 80 + year 70 = 150px)
    var drawerWidth = 150;
    var EDGE_ZONE = 25; // px from left edge to detect swipe-in

    function setDrawerOpen(open, animate) {
      drawerOpen = open;
      if (animate !== false) {
        drawer.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        drawer.style.transition = 'none';
      }
      if (open) {
        drawer.classList.remove('timeline-drawer--collapsed');
        drawer.style.transform = 'translateY(-50%) translateX(0)';
      } else {
        drawer.classList.add('timeline-drawer--collapsed');
        drawer.style.transform = '';
      }
    }

    // Tap the tab to toggle
    drawerTab.addEventListener('click', function (e) {
      if (drawerDragging) return;
      setDrawerOpen(!drawerOpen);
      e.stopPropagation();
    });

    // Tap outside the drawer to close
    document.addEventListener('click', function (e) {
      if (drawerOpen && !drawer.contains(e.target)) {
        setDrawerOpen(false);
      }
    });

    // Edge swipe to open, swipe-left to close
    var edgeSwipeActive = false;

    function onDrawerTouchStart(e) {
      var touch = e.touches[0];
      var fromLeftEdge = touch.clientX < EDGE_ZONE;
      var onDrawer = drawer.contains(e.target);

      if (!drawerOpen && fromLeftEdge) {
        edgeSwipeActive = true;
      } else if (drawerOpen && onDrawer) {
        edgeSwipeActive = true;
      } else {
        edgeSwipeActive = false;
        return;
      }

      drawerDragging = false;
      drawerStartX = touch.clientX;
      drawerLastX = touch.clientX;
      drawerLastTime = Date.now();
      drawerVelocity = 0;
    }

    function onDrawerTouchMove(e) {
      if (!edgeSwipeActive) return;
      var touch = e.touches[0];
      var dx = touch.clientX - drawerStartX;
      var now = Date.now();
      var dt = now - drawerLastTime || 16;

      drawerVelocity = (touch.clientX - drawerLastX) / dt;
      drawerLastX = touch.clientX;
      drawerLastTime = now;

      // Only start drag after 5px movement
      if (!drawerDragging && Math.abs(dx) > 5) {
        drawerDragging = true;
        drawer.style.transition = 'none';
      }

      if (!drawerDragging) return;

      var safeLeft = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-left')) || 0;

      if (drawerOpen) {
        // Dragging to close: dx goes negative
        var offset = Math.min(0, Math.max(-drawerWidth - safeLeft, dx));
        drawer.style.transform = 'translateY(-50%) translateX(' + offset + 'px)';
      } else {
        // Dragging to open: dx goes positive
        var openOffset = -drawerWidth - safeLeft + Math.min(drawerWidth + safeLeft, Math.max(0, dx));
        drawer.style.transform = 'translateY(-50%) translateX(' + openOffset + 'px)';
      }

      e.preventDefault();
    }

    function onDrawerTouchEnd() {
      if (!edgeSwipeActive) return;
      edgeSwipeActive = false;

      if (!drawerDragging) return;
      drawerDragging = false;

      var VELOCITY_THRESHOLD = 0.3;
      if (Math.abs(drawerVelocity) > VELOCITY_THRESHOLD) {
        setDrawerOpen(drawerVelocity > 0);
      } else {
        // Snap based on position
        var transform = window.getComputedStyle(drawer).transform;
        var tx = 0;
        if (transform && transform !== 'none') {
          var m = transform.match(/matrix.*\((.+)\)/);
          if (m) tx = parseFloat(m[1].split(', ')[4]) || 0;
        }
        setDrawerOpen(tx > -drawerWidth / 2);
      }
    }

    window.addEventListener('touchstart', onDrawerTouchStart, { passive: true });
    window.addEventListener('touchmove', onDrawerTouchMove, { passive: false });
    window.addEventListener('touchend', onDrawerTouchEnd);

    // Mouse support for desktop testing
    var mouseEdgeActive = false;
    drawer.addEventListener('mousedown', function (e) {
      mouseEdgeActive = true;
      drawerDragging = false;
      drawerStartX = e.clientX;
      drawerLastX = e.clientX;
      drawerLastTime = Date.now();
      drawerVelocity = 0;
    });
    window.addEventListener('mousemove', function (e) {
      if (!mouseEdgeActive) return;
      var fakeTouch = { touches: [{ clientX: e.clientX }] };
      // Reuse touch move logic
      var dx = e.clientX - drawerStartX;
      var now = Date.now();
      var dt = now - drawerLastTime || 16;
      drawerVelocity = (e.clientX - drawerLastX) / dt;
      drawerLastX = e.clientX;
      drawerLastTime = now;

      if (!drawerDragging && Math.abs(dx) > 5) {
        drawerDragging = true;
        drawer.style.transition = 'none';
      }
      if (!drawerDragging) return;

      if (drawerOpen) {
        var offset = Math.min(0, Math.max(-drawerWidth, dx));
        drawer.style.transform = 'translateY(-50%) translateX(' + offset + 'px)';
      } else {
        var openOffset = -drawerWidth + Math.min(drawerWidth, Math.max(0, dx));
        drawer.style.transform = 'translateY(-50%) translateX(' + openOffset + 'px)';
      }
      e.preventDefault();
    });
    window.addEventListener('mouseup', function () {
      if (!mouseEdgeActive) return;
      mouseEdgeActive = false;
      if (!drawerDragging) return;
      drawerDragging = false;
      var VELOCITY_THRESHOLD = 0.3;
      if (Math.abs(drawerVelocity) > VELOCITY_THRESHOLD) {
        setDrawerOpen(drawerVelocity > 0);
      } else {
        var transform = window.getComputedStyle(drawer).transform;
        var tx = 0;
        if (transform && transform !== 'none') {
          var m = transform.match(/matrix.*\((.+)\)/);
          if (m) tx = parseFloat(m[1].split(', ')[4]) || 0;
        }
        setDrawerOpen(tx > -drawerWidth / 2);
      }
    });
  }
})();
