// ============================================================
// GeoLayers — AI Content Service + Bottom Sheet + OpenAI TTS
// ============================================================

(function () {
  'use strict';

  // --- DOM References ---
  var panel = document.getElementById('content-panel');
  var panelTitle = document.getElementById('content-panel-title');
  var panelText = document.getElementById('content-text');
  var panelLoading = document.getElementById('content-loading');
  var closeBtn = document.getElementById('content-panel-close');
  var dragHandle = document.getElementById('drag-handle');
  var modeListenBtn = document.getElementById('mode-listen');
  var modeReadBtn = document.getElementById('mode-read');

  // --- Content Database (5 periods x 4 categories = 20 entries) ---
  var contentDB = {
    'ancient|archaeology': {
      title: 'Ancient Archaeology',
      text: 'Beneath the soil you stand on lie thousands of years of human civilization. This region of ancient Israel was home to Canaanite settlements dating back to the Bronze Age, where traders moved goods between Egypt and Mesopotamia along routes that passed through these very hills.\n\nArchaeologists have uncovered layers of pottery, tools, and fortification walls that tell a story of successive civilizations — each building on the ruins of the last. The most fascinating finds include clay tablets inscribed with early alphabetic writing, evidence that this land was at the crossroads of humanity\'s greatest invention: written language.\n\nIf you could peel back the earth beneath your feet, you would find a timeline compressed into stone and soil — cooking fires from 3,000 BCE, Roman-era mosaics, Crusader foundations, and Ottoman water channels, all stacked in a vertical history of this enduring place.'
    },
    'ancient|nature': {
      title: 'Ancient Nature',
      text: 'In ancient times, this landscape looked remarkably different. Dense forests of oak, terebinth, and carob covered the hillsides, providing habitat for lions, bears, and wild aurochs that roamed freely. The rivers ran fuller, fed by a climate that was slightly wetter than today.\n\nAncient peoples here lived in deep harmony with the land. They understood the seasonal rhythms — the early rains of autumn that softened the earth for planting, the spring wildflowers that signaled harvest time, and the dry summer winds that carried the scent of wild thyme across the valleys.\n\nThe natural springs that still bubble up in this region were sacred sites in antiquity. Communities gathered around them, built their villages near them, and told stories of spirits that lived in the water. These springs shaped where people lived for millennia, and their influence is still visible in the settlement patterns you can trace on any modern map.'
    },
    'ancient|religion': {
      title: 'Ancient Religion',
      text: 'This land is one of the oldest continuously sacred landscapes on Earth. Long before the great monotheistic religions, the Canaanites worshipped here at high places — hilltop shrines where they made offerings to Ba\'al, the storm god, and Asherah, the mother goddess. Stone altars and clay figurines found nearby testify to these ancient rituals.\n\nAs Israelite culture emerged, these same hilltops became contested spiritual ground. The Hebrew prophets thundered against the old worship practices, demanding exclusive devotion to one God — a revolutionary idea that would eventually reshape the entire world.\n\nStanding here, you are at a place where humanity\'s spiritual consciousness evolved. The transition from polytheism to monotheism didn\'t happen in a single moment — it unfolded over centuries, in places exactly like this one, where the old and new sacred worlds collided and slowly, irreversibly transformed.'
    },
    'ancient|geology': {
      title: 'Ancient Geology',
      text: 'The ground beneath you tells a story far older than any human civilization. This region sits on limestone bedrock formed 80-100 million years ago, when a warm shallow sea covered the entire area. The fossils embedded in these rocks — sea urchins, shells, and ancient coral — are remnants of that vanished ocean.\n\nThe Great Rift Valley, visible to the east, is one of the most dramatic geological features on Earth. It began forming 35 million years ago as the African and Arabian tectonic plates slowly tore apart. This ongoing process created the Dead Sea, the Sea of Galilee, and the Jordan Valley — a landscape defined by the immense forces beneath the surface.\n\nEarthquakes have shaped human history here as much as any king or army. Ancient cities were leveled and rebuilt repeatedly. The geological instability that makes this land dangerous also made it fertile — volcanic soils in the north, mineral-rich springs along the rift, and aquifers that sustain life in an otherwise arid region.'
    },
    'medieval|archaeology': {
      title: 'Medieval Archaeology',
      text: 'The medieval period left an extraordinary archaeological footprint across this land. Crusader castles, their massive walls still standing, dot the hilltops like stone sentinels. These fortifications represent some of the most ambitious military architecture of the 12th and 13th centuries, built by European knights who traveled thousands of miles to claim this ground.\n\nBeneath the Crusader layers, archaeologists find evidence of the vibrant Arab and Byzantine communities that preceded them — intricate mosaic floors in churches, hammams with sophisticated heating systems, and marketplaces where goods from three continents changed hands.\n\nThe archaeological record of this period reveals something profound: despite the violence of the Crusades, daily life continued. People farmed, traded, married, and buried their dead. Their modest artifacts — oil lamps, grinding stones, children\'s toys — remind us that beneath the grand narrative of holy wars, ordinary people simply lived their lives.'
    },
    'medieval|nature': {
      title: 'Medieval Nature',
      text: 'During the medieval period, the landscape here underwent dramatic transformation. Crusader settlers cleared forests for farmland and fuel, beginning a process of deforestation that would accelerate over centuries. They introduced European crops — grapes, olives, and wheat varieties — that changed the agricultural character of the region.\n\nThe Crusaders were fascinated by the exotic flora and fauna they encountered. Their chronicles describe encounters with jackals, gazelles, and enormous flocks of migrating birds — the same flyway that still brings millions of birds through Israel each spring and autumn.\n\nWater management was critical in this era. The Crusaders inherited and expanded sophisticated irrigation systems originally built by Roman and Arab engineers. Some of these water channels still function today, carrying spring water through carved stone aqueducts that have survived nearly a thousand years of use.'
    },
    'medieval|religion': {
      title: 'Medieval Religion',
      text: 'The medieval period transformed this landscape into the most contested religious territory on Earth. Christians, Muslims, and Jews all claimed deep spiritual connections to this ground, and their competing claims fueled two centuries of Crusader warfare that reshaped the political map of the Middle East.\n\nChurches were built on every site associated with biblical events — some genuine, some imagined. The architectural ambition was staggering: Romanesque basilicas with soaring vaulted ceilings, painted in vivid blues and golds, rose from the rocky hillsides. Many of these churches were later converted to mosques after Saladin\'s victories, gaining minarets and mihrab prayer niches.\n\nPerhaps most remarkably, Jewish communities persisted throughout this turbulent period. Scholars in places like Tiberias and Safed continued their work on the Talmud and early Kabbalistic texts, preserving and expanding a tradition that had been rooted in this land for over a thousand years.'
    },
    'medieval|geology': {
      title: 'Medieval Geology',
      text: 'Medieval builders in this region had an intimate understanding of local geology — their survival depended on it. They quarried the soft limestone when freshly exposed, knowing it would harden upon weathering, creating durable building blocks. The distinctive honey-gold color of medieval structures comes directly from the local bedrock.\n\nThe region experienced several significant earthquakes during the medieval period, most notably in 1202 CE and 1293 CE. These seismic events toppled Crusader fortifications and reshaped the coastline. Archaeological evidence shows that communities rebuilt repeatedly on the same sites, adapting their construction techniques to resist future tremors.\n\nMedieval travelers wrote extensively about the geological wonders they encountered — the Dead Sea\'s extreme salinity, the hot springs at Tiberias, and the basalt landscapes of the Golan. Their accounts, combining scientific observation with biblical interpretation, represent some of the earliest geological descriptions of this region.'
    },
    'ottoman|archaeology': {
      title: 'Ottoman Archaeology',
      text: 'The Ottoman period, spanning four centuries from 1517 to 1917, left a rich but often overlooked archaeological legacy across this land. Ottoman architecture blended Islamic geometric patterns with local building traditions, creating structures of remarkable elegance — bathhouses with star-shaped skylights, fountains adorned with calligraphic inscriptions, and caravanserais that hosted travelers along ancient trade routes.\n\nOne of the most significant Ottoman contributions was the reconstruction of Jerusalem\'s walls by Suleiman the Magnificent in the 1530s. These walls, which still define the Old City today, were built on foundations dating back to Herodian and even Canaanite times — a physical embodiment of the layers of civilization.\n\nOttoman-era artifacts tell stories of daily life in a multicultural empire. Coffee sets, tobacco pipes, ornate locks, and colorful ceramic tiles reveal a society that valued both function and beauty, and where Arab, Turkish, Jewish, and Christian traditions intermingled in the markets and neighborhoods of every town.'
    },
    'ottoman|nature': {
      title: 'Ottoman Nature',
      text: 'The Ottoman centuries brought profound changes to the natural landscape of this region. Extensive tree-felling for railroad construction and fuel depleted ancient forests that had survived millennia. By the late Ottoman period, much of the hillside terrain had been reduced to scrubby garrigue and exposed bedrock.\n\nYet the Ottomans also created beauty within this changing landscape. They planted ornamental gardens around mosques and public buildings, introducing cypress, pomegranate, and jasmine that still grow in many historic quarters today. The famous citrus groves of the coastal plain expanded dramatically under Ottoman rule, turning the shoreline into a fragrant green ribbon.\n\nWildlife adapted to the changing conditions. The last lions had disappeared centuries earlier, but leopards still prowled the northern mountains, and the skies remained darkened by migrating stork and pelican flocks that awed Ottoman-era chroniclers just as they had amazed ancient travelers before them.'
    },
    'ottoman|religion': {
      title: 'Ottoman Religion',
      text: 'Under Ottoman rule, this land became a mosaic of religious communities governed by the millet system — a framework that granted each religious group internal autonomy in matters of personal law, education, and worship. Mosques, churches, and synagogues often stood within sight of each other, their bells and muezzin calls creating an intertwined soundscape.\n\nThe Ottomans invested heavily in Islamic architecture and infrastructure in the holy cities. Elaborate mosque complexes, madrasas, and Sufi lodges were constructed, many with charitable endowments (waqf) that funded hospitals, soup kitchens, and schools for the poor. These institutions formed the backbone of social welfare for centuries.\n\nThis period also saw waves of Jewish immigration, particularly after the Spanish Expulsion of 1492. The mystical city of Safed became a global center of Kabbalistic study, while Jewish communities in Jerusalem, Hebron, and Tiberias maintained an unbroken presence. The Ottoman authorities generally protected these communities, understanding their value to the empire\'s diverse social fabric.'
    },
    'ottoman|geology': {
      title: 'Ottoman Geology',
      text: 'Ottoman engineers and builders displayed remarkable geological awareness in their construction projects. They identified the best quarry sites, understood which stone types resisted weathering, and developed sophisticated techniques for working with the region\'s varied geology — from soft chalk in the lowlands to hard basalt in the north.\n\nThe Ottoman period coincided with the Little Ice Age, a global climate event that brought cooler and wetter conditions to the eastern Mediterranean. This affected agriculture, water availability, and settlement patterns. Ottoman administrative records document droughts, floods, and earthquakes with bureaucratic precision, providing valuable data for modern geologists.\n\nPerhaps the most visible geological legacy of the Ottoman era is the extensive network of cisterns, aqueducts, and water channels they maintained and expanded. These systems, originally Roman or Byzantine, were essential for sustaining cities in a region where summer rainfall is virtually nonexistent. Many still function, channeling groundwater through limestone aquifers that have been tapped for over two thousand years.'
    },
    'modern|archaeology': {
      title: 'Modern Archaeology',
      text: 'Modern archaeology in Israel is one of the most active and technologically advanced in the world. Every construction project in this country has the potential to uncover artifacts spanning 10,000 years of human habitation. The Israel Antiquities Authority conducts hundreds of salvage excavations annually, racing to document the past before it\'s built over.\n\nRecent breakthroughs include the use of LIDAR scanning to reveal hidden structures beneath vegetation, DNA analysis of ancient remains that has rewritten our understanding of population movements, and AI-assisted artifact classification that can process thousands of pottery sherds in hours rather than years.\n\nThe modern era has also brought ethical complexity to archaeology here. Excavations intersect with competing national narratives, religious sensitivities, and property rights. Every major dig becomes a focal point for questions about identity, belonging, and who gets to tell the story of the past. This tension makes Israeli archaeology uniquely charged — every discovery is both scientific and political.'
    },
    'modern|nature': {
      title: 'Modern Nature',
      text: 'Modern Israel has undertaken one of the most ambitious ecological restoration projects in history. The Jewish National Fund\'s reforestation efforts have planted over 250 million trees since 1901, transforming barren hillsides into forests of Aleppo pine, native oak, and carob. The results are visible everywhere — green corridors where a century ago there was only rock and scrub.\n\nIsrael sits at the junction of three continents, creating extraordinary biodiversity for such a small country. Over 500 million birds pass through twice yearly on the Great Rift Valley flyway, making it one of the world\'s premier birdwatching destinations. Conservation programs have reintroduced species like the Persian fallow deer and white oryx that had been extinct in the wild.\n\nWater technology has become Israel\'s signature contribution to global ecology. Drip irrigation, invented here in the 1960s, revolutionized agriculture worldwide. Today, Israel recycles over 85% of its wastewater — the highest rate on Earth — and desalination plants provide much of the country\'s drinking water, turning scarcity into innovation.'
    },
    'modern|religion': {
      title: 'Modern Religion',
      text: 'In the modern era, this land remains the spiritual epicenter for three major world religions, drawing millions of pilgrims annually. The Western Wall, the Church of the Holy Sepulchre, and the Al-Aqsa Mosque sit within a few hundred meters of each other in Jerusalem\'s Old City, creating what may be the most intensely sacred square kilometer on the planet.\n\nThe establishment of Israel in 1948 transformed religious dynamics profoundly. For Jews, the return to the ancestral homeland fulfilled a 2,000-year-old prayer. For Palestinian Muslims and Christians, it brought displacement and ongoing struggle. These competing religious and national narratives remain unresolved, infusing everyday life with spiritual significance.\n\nYet beyond the headlines, interfaith encounters happen daily. Druze villages welcome visitors of all faiths, Baha\'i gardens in Haifa attract spiritual seekers worldwide, and grassroots dialogue initiatives bring Jews, Muslims, and Christians together in shared spaces. The modern religious landscape is as complex and layered as the archaeological strata beneath it.'
    },
    'modern|geology': {
      title: 'Modern Geology',
      text: 'Modern geological research has revealed that this small country sits at one of the most geologically dynamic locations on Earth. The Dead Sea Transform fault system, running the length of the country, produces regular seismic activity and has created landscapes found nowhere else — including the Dead Sea, the lowest point on any continent at 430 meters below sea level.\n\nThe Dead Sea itself is shrinking at an alarming rate, its surface dropping over a meter per year due to water diversion from the Jordan River. This has created thousands of sinkholes along its shores — dramatic collapses that swallow roads and buildings as underground salt layers dissolve. It\'s a geological crisis unfolding in real time.\n\nIsrael\'s geological diversity is extraordinary for its size. Within a two-hour drive, you can traverse ancient granite in Eilat (600 million years old), sandstone canyons in the Negev, chalk and limestone in the central hills, basalt plateaus in the Golan, and young sand dunes along the Mediterranean coast. This compressed geological variety makes the country a natural laboratory for earth scientists.'
    },
    'folklore|archaeology': {
      title: 'Folklore & Archaeology',
      text: 'Every archaeological site in this land is wrapped in layers of folklore as rich as the soil itself. Local legends speak of hidden treasures buried by Crusader knights, secret tunnels connecting ancient cities, and cursed objects that bring misfortune to those who disturb them. These stories, while fanciful, often contain kernels of archaeological truth.\n\nOne persistent legend tells of King Solomon\'s mines — vast underground chambers filled with gold somewhere in the southern desert. While no such treasure has been found, archaeologists did discover ancient copper smelting sites in the Timna Valley that date to roughly Solomon\'s era, suggesting the legend grew from real metallurgical activity.\n\nThe blending of folklore and archaeology creates a unique cultural phenomenon here. Villagers will point to a pile of stones and recount a detailed story about the prophet Elijah, a Roman general, or a local saint — and sometimes, when archaeologists investigate, they find that the oral tradition preserved a genuine historical memory that had been lost to written records for centuries.'
    },
    'folklore|nature': {
      title: 'Folklore & Nature',
      text: 'The natural world of this land is alive with folk beliefs that have been passed down for generations. The ancient terebinth tree is said to mark places where prophets rested, and cutting one down is still considered bad luck in many communities. Springs are inhabited by water spirits, and certain caves are avoided at night because of the jinn said to dwell within.\n\nThe most enchanting folklore surrounds the wildflowers that carpet the hillsides each spring. Red anemones are said to have sprung from the tears of the goddess Adonis, while the striking purple iris — Israel\'s national flower — carries legends of wisdom and protection. Shepherds still read the blooming patterns to predict weather and grazing conditions.\n\nMigrating birds feature prominently in local mythology. The white stork, which arrives each spring in enormous flocks, is believed to carry the souls of the righteous. Owls are viewed with suspicion — their nighttime calls are interpreted as prophecies. And the hoopoe, Israel\'s national bird, is celebrated in a Quranic story where it served as King Solomon\'s messenger to the Queen of Sheba.'
    },
    'folklore|religion': {
      title: 'Folklore & Religion',
      text: 'In this land, the boundary between formal religion and folk belief has always been beautifully blurred. Hilltop tombs of holy figures — Muslim walis, Jewish tzadikim, and Christian saints — dot the landscape, visited by people of all faiths seeking healing, fertility, or divine intervention. Colored ribbons tied to nearby trees flutter like prayers made visible.\n\nThe practice of leaving written wishes at sacred sites predates the famous tradition at the Western Wall. For centuries, people across this region have tucked messages into rock crevices, wrapped them around tree branches, or buried them near tombs. These small acts of faith represent perhaps the most intimate form of religious expression — a direct, personal appeal to the divine.\n\nSome of the most fascinating folk-religious traditions cross boundaries between faiths. The tomb of Rabbi Shimon bar Yochai in Meron draws Jewish pilgrims, but local Druze also venerate the site. The shrine of Al-Khidr (associated with the Green Man of Islamic mythology, but also linked to the Prophet Elijah and Saint George) is visited by Muslims, Christians, and Druze alike. These shared sacred spaces remind us that beneath doctrinal differences, human spiritual needs are remarkably universal.'
    },
    'folklore|geology': {
      title: 'Folklore & Geology',
      text: 'The dramatic geology of this land has inspired some of the most vivid folk stories in human history. The pillar formations near the Dead Sea are said to be Lot\'s wife, turned to salt for looking back at the destruction of Sodom. The basalt boulders scattered across the Golan are described as stones thrown by angry giants. And the caves of the Galilee are told to be hiding places of legendary heroes.\n\nHot springs throughout the region carry their own mythology. The thermal waters of Tiberias are said to have been heated by hellfire, while the sulfurous springs near the Dead Sea are attributed to King Solomon\'s command over demons who were forced to heat the water for his pleasure. These stories reflect ancient attempts to explain geological phenomena that wouldn\'t be scientifically understood for millennia.\n\nPerhaps the most poetic geological folklore concerns earthquakes. Local traditions hold that the land trembles when it is burdened by injustice — a moral explanation for seismic activity that transforms a terrifying natural event into a call for human righteousness. In this telling, the very stones beneath your feet are not just geological formations but moral witnesses, keeping account of everything that happens on the surface above.'
    }
  };

  // ============================================================
  // Bottom Sheet Logic
  // ============================================================

  var SHEET_STATES = { HIDDEN: 'hidden', PEEK: 'peek', EXPANDED: 'expanded', COLLAPSED: 'collapsed' };
  var sheetState = SHEET_STATES.HIDDEN;

  // Drag state
  var isDragging = false;
  var dragStartY = 0;
  var dragStartTranslateY = 0;
  var panelHeight = 0;
  var currentTranslateY = 0;
  var dragVelocity = 0;
  var lastDragY = 0;
  var lastDragTime = 0;

  function getTranslateYPercent(state) {
    switch (state) {
      case SHEET_STATES.PEEK: return 55;      // shows ~45%
      case SHEET_STATES.EXPANDED: return 0;    // full sheet
      case SHEET_STATES.COLLAPSED: return 92;  // just handle + title (~60px visible from 70vh)
      default: return 100;                     // hidden
    }
  }

  function setSheetState(state, animate) {
    sheetState = state;
    var percent = getTranslateYPercent(state);

    // Remove all state classes
    panel.classList.remove('content-panel--open', 'content-panel--expanded', 'content-panel--collapsed');

    if (state === SHEET_STATES.HIDDEN) {
      panel.style.transition = animate !== false ? 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)' : '';
      panel.style.transform = 'translateY(100%)';
      return;
    }

    // Add appropriate class
    if (state === SHEET_STATES.PEEK) panel.classList.add('content-panel--open');
    else if (state === SHEET_STATES.EXPANDED) panel.classList.add('content-panel--expanded');
    else if (state === SHEET_STATES.COLLAPSED) panel.classList.add('content-panel--collapsed');

    if (animate !== false) {
      panel.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
      panel.style.transition = 'none';
    }
    panel.style.transform = 'translateY(' + percent + '%)';
  }

  function openPanel() {
    setSheetState(SHEET_STATES.PEEK);
  }

  function closePanel() {
    setSheetState(SHEET_STATES.HIDDEN);
  }

  // --- Drag Handling ---
  function onDragStart(e) {
    isDragging = true;
    panelHeight = panel.offsetHeight;
    dragStartY = e.touches ? e.touches[0].clientY : e.clientY;

    // Get current translateY from computed style
    var transform = window.getComputedStyle(panel).transform;
    if (transform && transform !== 'none') {
      var matrix = transform.match(/matrix.*\((.+)\)/);
      if (matrix) {
        var values = matrix[1].split(', ');
        currentTranslateY = parseFloat(values[5]) || 0;
      }
    }
    dragStartTranslateY = currentTranslateY;

    panel.style.transition = 'none';
    dragVelocity = 0;
    lastDragY = dragStartY;
    lastDragTime = Date.now();

    e.preventDefault();
  }

  function onDragMove(e) {
    if (!isDragging) return;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    var deltaY = clientY - dragStartY;
    var now = Date.now();
    var dt = now - lastDragTime || 16;

    dragVelocity = (clientY - lastDragY) / dt; // px/ms, positive = downward
    lastDragY = clientY;
    lastDragTime = now;

    var newTranslateY = dragStartTranslateY + deltaY;
    // Clamp: don't allow dragging above expanded (0) or below hidden
    newTranslateY = Math.max(0, Math.min(newTranslateY, panelHeight));

    currentTranslateY = newTranslateY;
    panel.style.transform = 'translateY(' + newTranslateY + 'px)';

    e.preventDefault();
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;

    var percentY = (currentTranslateY / panelHeight) * 100;
    var VELOCITY_THRESHOLD = 0.5; // px/ms

    // Fast swipe detection
    if (Math.abs(dragVelocity) > VELOCITY_THRESHOLD) {
      if (dragVelocity > 0) {
        // Swiping down
        if (sheetState === SHEET_STATES.EXPANDED) {
          setSheetState(SHEET_STATES.PEEK);
        } else {
          setSheetState(SHEET_STATES.COLLAPSED);
        }
      } else {
        // Swiping up
        if (sheetState === SHEET_STATES.COLLAPSED) {
          setSheetState(SHEET_STATES.PEEK);
        } else {
          setSheetState(SHEET_STATES.EXPANDED);
        }
      }
      return;
    }

    // Snap to nearest position based on current percentage
    if (percentY < 25) {
      setSheetState(SHEET_STATES.EXPANDED);
    } else if (percentY < 75) {
      setSheetState(SHEET_STATES.PEEK);
    } else {
      setSheetState(SHEET_STATES.COLLAPSED);
    }
  }

  // Bind drag events on the handle and header area
  if (dragHandle) {
    dragHandle.addEventListener('touchstart', onDragStart, { passive: false });
    dragHandle.addEventListener('mousedown', onDragStart);
  }
  window.addEventListener('touchmove', onDragMove, { passive: false });
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('touchend', onDragEnd);
  window.addEventListener('mouseup', onDragEnd);

  // Tap handle when collapsed → peek
  if (dragHandle) {
    dragHandle.addEventListener('click', function () {
      if (sheetState === SHEET_STATES.COLLAPSED) {
        setSheetState(SHEET_STATES.PEEK);
      }
    });
  }

  // ============================================================
  // Listen / Read Mode Toggle
  // ============================================================

  var currentMode = 'listen'; // 'listen' or 'read'

  function setMode(mode) {
    currentMode = mode;
    if (mode === 'listen') {
      modeListenBtn.classList.add('mode-toggle__btn--active');
      modeReadBtn.classList.remove('mode-toggle__btn--active');
    } else {
      modeReadBtn.classList.add('mode-toggle__btn--active');
      modeListenBtn.classList.remove('mode-toggle__btn--active');
    }
  }

  if (modeListenBtn) {
    modeListenBtn.addEventListener('click', function () {
      setMode('listen');
      // Auto-play if content is loaded
      var text = getContentText();
      if (text && ttsState !== 'speaking') {
        speakContent(text);
      }
    });
  }

  if (modeReadBtn) {
    modeReadBtn.addEventListener('click', function () {
      setMode('read');
      stopAudio();
    });
  }

  // ============================================================
  // Content Fetching
  // ============================================================

  var debounceTimer = null;
  var DEBOUNCE_MS = 300;

  function debouncedFetch() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      fetchContent();
    }, DEBOUNCE_MS);
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
    panelText.innerHTML = text
      .split('\n\n')
      .filter(function (p) { return p.trim(); })
      .map(function (p) { return '<p>' + p.trim() + '</p>'; })
      .join('');

    // Show TTS button
    showTtsBtn();

    // Auto-play in listen mode
    if (currentMode === 'listen') {
      speakContent(panelText.innerText || panelText.textContent || '');
    }
  }

  function fetchContent() {
    var key = window.geoState.timePeriod + '|' + window.geoState.category;
    var entry = contentDB[key];

    // Stop any playing audio
    stopAudio();

    showLoading();
    openPanel();

    setTimeout(function () {
      if (entry) {
        displayContent(entry.title, entry.text);
      } else {
        hideLoading();
        panelText.innerHTML = '<p>No content available for this combination yet.</p>';
        panelTitle.textContent = window.geoState.timePeriod.charAt(0).toUpperCase() +
          window.geoState.timePeriod.slice(1) + ' ' +
          window.geoState.category.charAt(0).toUpperCase() +
          window.geoState.category.slice(1);
      }
    }, 600);
  }

  // ============================================================
  // OpenAI TTS Engine (with browser speechSynthesis fallback)
  // ============================================================

  var ttsBtn = document.getElementById('tts-btn');
  var ttsIcon = document.getElementById('tts-icon');
  var ttsState = 'ready'; // ready | speaking | paused | finished
  var audioElement = null;

  // Browser TTS fallback references
  var ttsUtterance = null;
  var ttsVoice = null;
  var useBrowserTTS = false;

  function pickVoice() {
    if (typeof speechSynthesis === 'undefined') return null;
    var voices = speechSynthesis.getVoices();
    if (!voices.length) return null;
    var preferred = voices.filter(function (v) {
      return v.lang.indexOf('en') === 0 && (/google/i.test(v.name) || /natural/i.test(v.name));
    });
    if (preferred.length) return preferred[0];
    var english = voices.filter(function (v) { return v.lang.indexOf('en') === 0; });
    if (english.length) return english[0];
    return voices[0];
  }

  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = function () {
      ttsVoice = pickVoice();
    };
    ttsVoice = pickVoice();
  }

  function setTtsState(state) {
    ttsState = state;
    if (!ttsBtn) return;
    ttsBtn.classList.remove('tts-btn--playing', 'tts-btn--paused', 'tts-btn--finished');
    switch (state) {
      case 'ready':
        ttsIcon.innerHTML = '&#9654;'; // play triangle
        break;
      case 'speaking':
        ttsIcon.innerHTML = '&#10074;&#10074;'; // pause bars
        ttsBtn.classList.add('tts-btn--playing');
        break;
      case 'paused':
        ttsIcon.innerHTML = '&#9654;'; // play triangle
        ttsBtn.classList.add('tts-btn--paused');
        break;
      case 'finished':
        ttsIcon.innerHTML = '&#8634;'; // replay arrow
        ttsBtn.classList.add('tts-btn--finished');
        break;
    }
  }

  function getContentText() {
    return panelText.innerText || panelText.textContent || '';
  }

  // --- OpenAI TTS ---
  function speakWithOpenAI(text) {
    var config = window.GEO_CONFIG;
    if (!config || !config.OPENAI_API_KEY || !config.OPENAI_TTS_ENDPOINT) {
      speakWithBrowser(text);
      return;
    }

    // OpenAI TTS has a 4096 char limit — truncate if needed
    var ttsInput = text.length > 4000 ? text.substring(0, 4000) : text;

    setTtsState('speaking');

    fetch(config.OPENAI_TTS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + config.OPENAI_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.OPENAI_TTS_MODEL || 'tts-1',
        voice: config.OPENAI_TTS_VOICE || 'nova',
        input: ttsInput
      })
    })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('TTS API error: ' + response.status);
      }
      return response.blob();
    })
    .then(function (blob) {
      var url = URL.createObjectURL(blob);
      if (audioElement) {
        audioElement.pause();
        if (audioElement.src) URL.revokeObjectURL(audioElement.src);
      }
      audioElement = new Audio(url);
      audioElement.onended = function () {
        setTtsState('finished');
      };
      audioElement.onerror = function () {
        setTtsState('ready');
      };
      var playPromise = audioElement.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          // Autoplay blocked — user must tap play button
          setTtsState('ready');
        });
      }
      useBrowserTTS = false;
    })
    .catch(function (err) {
      console.warn('OpenAI TTS failed, falling back to browser:', err);
      speakWithBrowser(text);
    });
  }

  // --- Browser TTS Fallback ---
  function speakWithBrowser(text) {
    if (typeof speechSynthesis === 'undefined') return;
    useBrowserTTS = true;
    speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    if (ttsVoice) utterance.voice = ttsVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = function () {
      setTtsState('finished');
    };
    utterance.onerror = function () {
      setTtsState('ready');
    };
    ttsUtterance = utterance;
    speechSynthesis.speak(utterance);
    setTtsState('speaking');
  }

  function speakContent(text) {
    if (!text) return;
    speakWithOpenAI(text);
  }

  function stopAudio() {
    // Stop OpenAI audio
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
    // Stop browser TTS
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    ttsUtterance = null;
    setTtsState('ready');
  }

  function toggleSpeech() {
    switch (ttsState) {
      case 'ready':
      case 'finished':
        speakContent(getContentText());
        break;
      case 'speaking':
        if (useBrowserTTS) {
          if (typeof speechSynthesis !== 'undefined') speechSynthesis.pause();
        } else if (audioElement) {
          audioElement.pause();
        }
        setTtsState('paused');
        break;
      case 'paused':
        if (useBrowserTTS) {
          if (typeof speechSynthesis !== 'undefined') speechSynthesis.resume();
        } else if (audioElement) {
          audioElement.play();
        }
        setTtsState('speaking');
        break;
    }
  }

  function showTtsBtn() {
    if (ttsBtn) {
      ttsBtn.style.display = 'flex';
      setTtsState('ready');
    }
  }

  function hideTtsBtn() {
    if (ttsBtn) {
      ttsBtn.style.display = 'none';
    }
    stopAudio();
  }

  if (ttsBtn) {
    ttsBtn.addEventListener('click', toggleSpeech);
  }

  // ============================================================
  // Shake Detection
  // ============================================================

  var lastShakeTime = 0;
  var SHAKE_THRESHOLD = 15;
  var SHAKE_DEBOUNCE = 1000;

  if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function (e) {
      var acc = e.accelerationIncludingGravity;
      if (!acc) return;
      var magnitude = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      if (Math.abs(magnitude - 9.8) > SHAKE_THRESHOLD) {
        var now = Date.now();
        if (now - lastShakeTime < SHAKE_DEBOUNCE) return;
        lastShakeTime = now;
        if (ttsState === 'speaking' || ttsState === 'paused') {
          stopAudio();
        } else {
          speakContent(getContentText());
        }
      }
    });
  }

  // ============================================================
  // Event Listeners
  // ============================================================

  closeBtn.addEventListener('click', function () {
    closePanel();
    hideTtsBtn();
  });

  document.addEventListener('timePeriodChange', function () {
    stopAudio();
    debouncedFetch();
  });

  document.addEventListener('categoryChange', function () {
    stopAudio();
    debouncedFetch();
  });

  // Auto-fetch on first load
  setTimeout(function () {
    fetchContent();
  }, 1000);

})();
