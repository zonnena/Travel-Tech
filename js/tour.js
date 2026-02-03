/* ============================================================
   GeoLayers — Interactive Guided Tour
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'geolayers_tour_completed';
  var PAD = 16; // min distance from viewport edge
  var SPOTLIGHT_PAD = 8; // padding around target for spotlight

  var steps = [
    {
      target: '#map',
      title: 'Interactive Map',
      text: "Jerusalem's Old City. Pinch to zoom, drag to explore.",
      position: 'bottom'
    },
    {
      target: '.poi-marker',
      title: 'Points of Interest',
      text: 'Tap colored dots to discover historical sites.',
      position: 'bottom',
      optional: true
    },
    {
      target: '#timeline-tab',
      title: 'Time Machine',
      text: 'Swipe from the left edge or tap this tab to reveal the time machine.',
      position: 'right',
      onExit: function () { openDrawer(); }
    },
    {
      target: '#time-axis',
      title: 'Time Periods',
      text: 'Scroll to travel through time: Ancient, Medieval, Ottoman, Modern, Folklore.',
      position: 'right',
      onEnter: function () { openDrawer(); }
    },
    {
      target: '#category-bar',
      title: 'Categories',
      text: 'Swipe to filter: Archaeology, Nature, Religion, Geology.',
      position: 'above',
      onEnter: function () { closeDrawer(); }
    },
    {
      target: '#poi-list-toggle',
      title: 'Nearby Places',
      text: 'Tap to see all 15 nearby historical sites with ratings.',
      position: 'below'
    },
    {
      target: '#ghost-toggle',
      title: 'Ghost Mode',
      text: 'Hide friend avatars for a focused exploration.',
      position: 'below'
    },
    {
      target: '#ar-toggle',
      title: 'AR Mode',
      text: 'Launch AR to see 3D historical markers through your camera.',
      position: 'below'
    },
    {
      target: '#content-panel',
      title: 'Content Panel',
      text: 'AI narration appears here. Drag up to expand, down to minimize.',
      position: 'above',
      onEnter: function () { openContentPeek(); }
    },
    {
      target: '#tts-btn',
      title: 'Audio Narration',
      text: 'Shake your phone or tap play to hear the story read aloud.',
      position: 'left',
      onEnter: function () { showTtsBtn(); }
    }
  ];

  var currentStep = -1;
  var spotlightEl = null;
  var tooltipEl = null;
  var running = false;

  /* --- Helpers: Drawer / Panel controls --- */
  function openDrawer() {
    var d = document.getElementById('timeline-drawer');
    if (d) d.classList.remove('timeline-drawer--collapsed');
  }
  function closeDrawer() {
    var d = document.getElementById('timeline-drawer');
    if (d) d.classList.add('timeline-drawer--collapsed');
  }
  function openContentPeek() {
    var p = document.getElementById('content-panel');
    if (p) {
      p.classList.remove('content-panel--expanded', 'content-panel--collapsed');
      p.classList.add('content-panel--open');
    }
  }
  function showTtsBtn() {
    var b = document.getElementById('tts-btn');
    if (b) b.style.display = 'flex';
  }

  /* --- Build DOM elements --- */
  function createOverlay() {
    if (spotlightEl) return;

    spotlightEl = document.createElement('div');
    spotlightEl.className = 'tour-spotlight';
    document.body.appendChild(spotlightEl);

    tooltipEl = document.createElement('div');
    tooltipEl.className = 'tour-tooltip';
    document.body.appendChild(tooltipEl);
  }

  function removeOverlay() {
    if (spotlightEl) { spotlightEl.remove(); spotlightEl = null; }
    if (tooltipEl) { tooltipEl.remove(); tooltipEl = null; }
  }

  /* --- Measure & Position --- */
  function getRect(el) {
    var r = el.getBoundingClientRect();
    return {
      top: r.top - SPOTLIGHT_PAD,
      left: r.left - SPOTLIGHT_PAD,
      width: r.width + SPOTLIGHT_PAD * 2,
      height: r.height + SPOTLIGHT_PAD * 2,
      cx: r.left + r.width / 2,
      cy: r.top + r.height / 2,
      origTop: r.top,
      origLeft: r.left,
      origWidth: r.width,
      origHeight: r.height
    };
  }

  function positionSpotlight(rect) {
    spotlightEl.style.top = rect.top + 'px';
    spotlightEl.style.left = rect.left + 'px';
    spotlightEl.style.width = rect.width + 'px';
    spotlightEl.style.height = rect.height + 'px';
  }

  function bestPosition(preferred, rect) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var tooltipW = 280;
    var tooltipH = 160;

    var fits = {
      bottom: rect.top + rect.height + tooltipH + PAD < vh,
      above: rect.top - tooltipH - PAD > 0,
      right: rect.left + rect.width + tooltipW + PAD < vw,
      left: rect.left - tooltipW - PAD > 0,
      below: rect.top + rect.height + tooltipH + PAD < vh
    };

    if (preferred === 'below') preferred = 'bottom';
    if (fits[preferred]) return preferred;

    var order = ['bottom', 'above', 'right', 'left'];
    for (var i = 0; i < order.length; i++) {
      if (fits[order[i]]) return order[i];
    }
    return 'bottom';
  }

  function positionTooltip(rect, preferred) {
    var pos = bestPosition(preferred, rect);
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    // Remove old direction classes
    tooltipEl.classList.remove(
      'tour-tooltip--bottom', 'tour-tooltip--above',
      'tour-tooltip--right', 'tour-tooltip--left'
    );
    tooltipEl.classList.add('tour-tooltip--' + pos);

    var style = tooltipEl.style;
    style.top = '';
    style.left = '';
    style.right = '';
    style.bottom = '';

    var gap = 14;

    if (pos === 'bottom') {
      var t = rect.top + rect.height + gap;
      var l = rect.left + rect.width / 2 - 140;
      l = Math.max(PAD, Math.min(l, vw - 280 - PAD));
      style.top = t + 'px';
      style.left = l + 'px';
    } else if (pos === 'above') {
      var l2 = rect.left + rect.width / 2 - 140;
      l2 = Math.max(PAD, Math.min(l2, vw - 280 - PAD));
      style.left = l2 + 'px';
      // Position above: measure tooltip then set bottom-up
      style.top = (rect.top - gap) + 'px';
      style.transform = 'translateY(-100%)';
    } else if (pos === 'right') {
      var l3 = rect.left + rect.width + gap;
      var t3 = rect.top + rect.height / 2 - 80;
      t3 = Math.max(PAD, Math.min(t3, vh - 160 - PAD));
      style.top = t3 + 'px';
      style.left = l3 + 'px';
    } else if (pos === 'left') {
      var t4 = rect.top + rect.height / 2 - 80;
      t4 = Math.max(PAD, Math.min(t4, vh - 160 - PAD));
      style.top = t4 + 'px';
      style.left = (rect.left - gap) + 'px';
      style.transform = 'translateX(-100%)';
    }
  }

  /* --- Render a step --- */
  function renderStep() {
    var step = steps[currentStep];
    if (!step) { endTour(); return; }

    // Run onEnter hook
    if (step.onEnter) step.onEnter();

    // Wait for layout to settle
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var target = document.querySelector(step.target);

        // Skip if target missing or zero-size
        if (!target) {
          if (step.optional || true) { advance(1); return; }
        }
        var r = target.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) { advance(1); return; }

        var rect = getRect(target);

        // Elevate target
        clearElevation();
        target.classList.add('tour-elevated');

        positionSpotlight(rect);

        // Build tooltip content
        var isLast = currentStep === steps.length - 1;
        tooltipEl.innerHTML =
          '<div class="tour-tooltip__title">' + step.title + '</div>' +
          '<div class="tour-tooltip__text">' + step.text + '</div>' +
          '<div class="tour-tooltip__footer">' +
            '<span class="tour-tooltip__counter">' + (currentStep + 1) + ' / ' + steps.length + '</span>' +
            '<div class="tour-tooltip__btns">' +
              '<button class="tour-tooltip__btn tour-tooltip__btn--skip">Skip</button>' +
              '<button class="tour-tooltip__btn tour-tooltip__btn--next">' + (isLast ? 'Finish' : 'Next') + '</button>' +
            '</div>' +
          '</div>';

        // Reset transform before positioning
        tooltipEl.style.transform = '';
        positionTooltip(rect, step.position);

        // Show
        spotlightEl.classList.add('tour-spotlight--visible');
        tooltipEl.classList.add('tour-tooltip--visible');

        // Bind buttons
        var skipBtn = tooltipEl.querySelector('.tour-tooltip__btn--skip');
        var nextBtn = tooltipEl.querySelector('.tour-tooltip__btn--next');
        skipBtn.addEventListener('click', function (e) { e.stopPropagation(); endTour(); });
        nextBtn.addEventListener('click', function (e) { e.stopPropagation(); advance(1); });
      });
    });
  }

  function clearElevation() {
    var elevated = document.querySelectorAll('.tour-elevated');
    for (var i = 0; i < elevated.length; i++) {
      elevated[i].classList.remove('tour-elevated');
    }
  }

  function advance(dir) {
    // Run onExit hook of current step
    var prev = steps[currentStep];
    if (prev && prev.onExit) prev.onExit();

    // Hide tooltip briefly for transition
    tooltipEl.classList.remove('tour-tooltip--visible');
    tooltipEl.style.transform = '';

    currentStep += dir;
    if (currentStep >= steps.length || currentStep < 0) {
      endTour();
      return;
    }
    renderStep();
  }

  /* --- Lifecycle --- */
  function startTour() {
    if (running) return;
    running = true;
    currentStep = 0;
    createOverlay();
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    renderStep();
  }

  function endTour() {
    running = false;
    clearElevation();
    removeOverlay();
    localStorage.setItem(STORAGE_KEY, '1');
    closeDrawer();
    // Close content panel
    var cp = document.getElementById('content-panel');
    if (cp) {
      cp.classList.remove('content-panel--open', 'content-panel--expanded', 'content-panel--collapsed');
    }
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', onResize);
    currentStep = -1;
  }

  function onKey(e) {
    if (e.key === 'Escape') endTour();
  }

  function onResize() {
    if (!running || currentStep < 0) return;
    var step = steps[currentStep];
    if (!step) return;
    var target = document.querySelector(step.target);
    if (!target) return;
    var r = target.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    var rect = getRect(target);
    positionSpotlight(rect);
    tooltipEl.style.transform = '';
    positionTooltip(rect, step.position);
  }

  /* --- Auto-start on first visit --- */
  function init() {
    // Header button
    var btn = document.getElementById('tour-start');
    if (btn) {
      btn.addEventListener('click', function () {
        startTour();
      });
    }

    // Auto-start if first visit
    if (!localStorage.getItem(STORAGE_KEY)) {
      setTimeout(function () {
        startTour();
      }, 2500);
    }
  }

  // Expose globally
  window.startGeoTour = startTour;

  // Init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
