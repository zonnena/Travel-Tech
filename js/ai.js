// ============================================================
// GeoLayers — AI Content Service (Gemini API)
// ============================================================

(function () {
  'use strict';

  // --- DOM References ---
  var panel = document.getElementById('content-panel');
  var panelTitle = document.getElementById('content-panel-title');
  var panelText = document.getElementById('content-text');
  var panelLoading = document.getElementById('content-loading');
  var closeBtn = document.getElementById('content-panel-close');

  // --- Cache ---
  var contentCache = {}; // key: "timePeriod|category|lat|lng" -> value: {title, text}

  // --- Debounce ---
  var debounceTimer = null;
  var DEBOUNCE_MS = 300;

  function debouncedFetch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      fetchContent();
    }, DEBOUNCE_MS);
  }

  // --- Cache key builder ---
  function buildCacheKey() {
    var pos = window.geoState.position;
    var lat = pos ? pos.lat.toFixed(2) : '0';
    var lng = pos ? pos.lng.toFixed(2) : '0';
    return window.geoState.timePeriod + '|' + window.geoState.category + '|' + lat + '|' + lng;
  }

  // --- Panel control ---
  function openPanel() {
    panel.classList.add('content-panel--open');
  }

  function closePanel() {
    panel.classList.remove('content-panel--open');
  }

  function showLoading() {
    panelLoading.classList.remove('content-panel__loading--hidden');
    panelText.innerHTML = '';
  }

  function hideLoading() {
    panelLoading.classList.add('content-panel__loading--hidden');
  }

  function displayContent(title, text) {
    hideLoading();
    panelTitle.textContent = title;
    // Convert plain text paragraphs to HTML paragraphs
    panelText.innerHTML = text
      .split('\n\n')
      .filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p>' + p.trim() + '</p>'; })
      .join('');
  }

  // --- Title builder ---
  function buildTitle() {
    var period = window.geoState.timePeriod;
    var category = window.geoState.category;
    var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };
    return cap(period) + ' ' + cap(category);
  }

  // --- Core fetch function ---
  function fetchContent() {
    var cacheKey = buildCacheKey();

    // Check cache first
    if (contentCache[cacheKey]) {
      displayContent(contentCache[cacheKey].title, contentCache[cacheKey].text);
      openPanel();
      return;
    }

    // Show loading state
    panelTitle.textContent = buildTitle();
    showLoading();
    openPanel();

    // Build position string
    var pos = window.geoState.position;
    var posStr = pos
      ? pos.lat.toFixed(4) + ', ' + pos.lng.toFixed(4)
      : '32.0853, 34.7818'; // fallback: Tel Aviv

    // Build prompt
    var prompt = 'You are a historical guide. The user is standing at [' + posStr + '] in Israel. ' +
      'Tell them about this location during the ' + window.geoState.timePeriod + ' era, ' +
      'focusing on ' + window.geoState.category + '. ' +
      'Be vivid, engaging, and educational. 2-3 paragraphs. ' +
      'Do not use markdown formatting, just plain text paragraphs separated by blank lines.';

    // Build request body
    var body = JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    });

    var url = GEO_CONFIG.GEMINI_ENDPOINT + '?key=' + GEO_CONFIG.GEMINI_API_KEY;

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    })
      .then(function (res) {
        if (!res.ok) throw new Error('API error: ' + res.status);
        return res.json();
      })
      .then(function (data) {
        // Extract text from Gemini response
        var text = '';
        try {
          text = data.candidates[0].content.parts[0].text;
        } catch (e) {
          text = 'Unable to parse AI response. Please try again.';
        }

        var title = buildTitle();

        // Cache the response
        contentCache[cacheKey] = { title: title, text: text };

        // Display
        displayContent(title, text);
      })
      .catch(function (err) {
        hideLoading();
        panelText.innerHTML = '<p style="color: var(--neon-magenta);">Could not load content. ' +
          'Check your API key in js/config.js.</p>' +
          '<p style="color: var(--text-secondary); font-size: 0.8rem;">' + err.message + '</p>';
      });
  }

  // --- Event listeners ---

  // Close button
  closeBtn.addEventListener('click', closePanel);

  // Navigator changes trigger content fetch (debounced)
  document.addEventListener('timePeriodChange', debouncedFetch);
  document.addEventListener('categoryChange', debouncedFetch);

  // Auto-fetch on first load (small delay to let GPS settle)
  setTimeout(function () {
    fetchContent();
  }, 1000);

})();
