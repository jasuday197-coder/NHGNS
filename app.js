// State variables
let activeTab = 'map-view';
let selectedProvince = null;
let currentPlayingAudio = null;
let mainAudioPlayer = null;
let waveformInterval = null;
let mediaRecorder = null;
let audioChunks = [];
let recordStartTime = null;
let recordDurationSec = 0;
let recordTimerInterval = null;
let recordedBlob = null;
let localAudioCorpus = [];
let localLexicon = [];
let pendingContributions = [];

// Helper for safely setting innerText without throwing on missing DOM elements
function safeSetText(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.innerText = text;
    return true;
  }
  return false;
}

// Province Centroids for Leaflet
const PROVINCE_COORDINATES = {
  "Thanh Hóa": [20.00, 105.50],
  "Nghệ An": [19.33, 104.83],
  "Hà Tĩnh": [18.33, 105.90],
  "Quảng Bình": [17.50, 106.33],
  "Quảng Trị": [16.75, 107.00],
  "Thừa Thiên Huế": [16.33, 107.58]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initData();
  setupNavigation();
  initMapModule();
  initDictionaryModule();
  initTranslatorModule();
  initChatbotModule();
  initAdminModule();
  setupAudioRecorder();
  updateGlobalStats();
});

// Load and merge with localStorage to ensure data persistence
function initData() {
  const storedCorpus = localStorage.getItem('vb_audio_corpus');
  const storedLexicon = localStorage.getItem('vb_lexicon');
  const storedPending = localStorage.getItem('vb_pending_contributions');

  if (storedCorpus) {
    localAudioCorpus = JSON.parse(storedCorpus);
  } else {
    localAudioCorpus = [...AUDIO_CORPUS];
    localStorage.setItem('vb_audio_corpus', JSON.stringify(localAudioCorpus));
  }

  if (storedLexicon) {
    localLexicon = JSON.parse(storedLexicon);
  } else {
    localLexicon = [...DIALECT_LEXICON];
    localStorage.setItem('vb_lexicon', JSON.stringify(localLexicon));
  }

  if (storedPending) {
    pendingContributions = JSON.parse(storedPending);
  } else {
    pendingContributions = [];
    localStorage.setItem('vb_pending_contributions', JSON.stringify(pendingContributions));
  }
}

function updateGlobalStats() {
  const totalBảnGhi = localAudioCorpus.length;
  // Calculate unique speakers
  const speakers = new Set(localAudioCorpus.map(a => a.speaker));
  const totalNgườiThamGia = speakers.size + 12; // Base padding + actual count
  const totalTừVựng = localLexicon.length;

  document.getElementById('stat-records').innerText = totalBảnGhi;
  document.getElementById('stat-contributors').innerText = totalNgườiThamGia;
  document.getElementById('stat-vocab').innerText = totalTừVựng;
}

// --------------------------------------------------------------------------
// Navigation Router
// --------------------------------------------------------------------------
function setupNavigation() {
  const navItems = document.querySelectorAll('.navbar-link');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      switchTab(targetView);
    });
  });
}

function switchTab(viewId) {
  activeTab = viewId;
  
  // Stop any playing audio
  stopAudioPlayer();
  if (window.voiceBankGames) {
    window.voiceBankGames.stopGameAudio();
  }

  // Update nav UI
  document.querySelectorAll('.navbar-link').forEach(item => {
    if (item.getAttribute('data-view') === viewId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update view visibility
  document.querySelectorAll('.app-view').forEach(view => {
    if (view.id === viewId) {
      view.classList.add('active');
    } else {
      view.classList.remove('active');
    }
  });

  // Special hooks
  if (viewId === 'quizzes-view') {
    if (window.voiceBankGames) {
      window.voiceBankGames.initHub();
    }
  } else if (viewId === 'admin-view') {
    renderAdminQueue();
  } else if (viewId === 'map-view') {
    // Redraw dynamic markers on GeoJSON SVG map if selected tab
    setTimeout(() => {
      drawMapMarkers();
    }, 100);
  }
}

// Expose switchTab globally for inline onclick handlers on the Landing Page feature cards
window.switchTab = switchTab;

// --------------------------------------------------------------------------
// Interactive Map Module (Leaflet & Vector SVG)
// --------------------------------------------------------------------------
let cachedGeojsonData = null;
let geojsonMinLon = 103.9;
let geojsonMaxLon = 108.3;
let geojsonMinLat = 15.9;
let geojsonMaxLat = 20.8;
const svgWidth = 600;
const svgHeight = 850;

let currentScale = 1.0;
let currentTranslateX = 0;
let currentTranslateY = 0;
let isDragging = false;
let startDragX = 0;
let startDragY = 0;
let computedCentroids = {};

function initMapModule() {
  const container = document.getElementById('geojson-svg-map');
  if (!container) return;

  const mapWrapper = document.getElementById('geojson-map-container');

  // Load geojson
  fetch('/vietnam.geojson')
    .then(res => res.json())
    .then(geojson => {
      cachedGeojsonData = geojson;
      renderGeoJsonMap();
    })
    .catch(err => {
      console.error("Error loading GeoJSON data:", err);
      container.innerHTML = '<div style="color: var(--color-error); text-align: center; padding: 20px;">Không thể tải dữ liệu bản đồ. Vui lòng thử lại.</div>';
    });

  // Setup filters on map
  document.getElementById('map-filter-age').addEventListener('change', filterMapData);
  document.getElementById('map-filter-topic').addEventListener('change', filterMapData);

  // Setup zoom buttons
  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    zoomMap(1.25);
  });
  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    zoomMap(0.8);
  });
  document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    resetMapZoom();
  });

  // Setup pan/drag events on mapWrapper
  mapWrapper.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return; // Left click only
    isDragging = true;
    startDragX = e.clientX - currentTranslateX;
    startDragY = e.clientY - currentTranslateY;
    mapWrapper.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    currentTranslateX = e.clientX - startDragX;
    currentTranslateY = e.clientY - startDragY;
    constrainPan();
    updateMapTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      mapWrapper.style.cursor = 'default';
    }
  });

  // Scroll wheel zoom
  mapWrapper.addEventListener('wheel', (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    zoomMap(factor);
  }, { passive: false });
}

function constrainPan() {
  if (currentScale <= 1.01) {
    currentTranslateX = 0;
    currentTranslateY = 0;
    return;
  }
  const maxDragX = (svgWidth * (currentScale - 1)) / 2;
  const maxDragY = (svgHeight * (currentScale - 1)) / 2;

  currentTranslateX = Math.max(-maxDragX, Math.min(maxDragX, currentTranslateX));
  currentTranslateY = Math.max(-maxDragY, Math.min(maxDragY, currentTranslateY));
}

function zoomMap(factor) {
  const newScale = currentScale * factor;
  currentScale = Math.max(1.0, Math.min(5.0, newScale));
  constrainPan();
  updateMapTransform();
}

function resetMapZoom() {
  currentScale = 1.0;
  currentTranslateX = 0;
  currentTranslateY = 0;
  updateMapTransform();
}

function updateMapTransform() {
  const svgMapEl = document.getElementById('geojson-svg-map');
  if (svgMapEl) {
    svgMapEl.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
  }
}

function renderGeoJsonMap() {
  const container = document.getElementById('geojson-svg-map');
  if (!container || !cachedGeojsonData) return;

  const centralCoastKeys = ['vn-th', 'vn-na', 'vn-328', 'vn-qb', 'vn-qt', 'vn-tt'];
  const centralCoastNames = ['Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế'];

  const filteredFeatures = cachedGeojsonData.features.filter(f => {
    const hcKey = f.properties['hc-key'] || '';
    const name = f.properties['name'] || f.properties['title'] || '';
    return centralCoastKeys.includes(hcKey.toLowerCase()) || 
           centralCoastNames.some(n => name.toLowerCase().includes(n.toLowerCase()));
  });

  if (filteredFeatures.length === 0) {
    container.innerHTML = '<div style="color: var(--color-error); text-align: center; padding: 20px;">Không tìm thấy 6 tỉnh Bắc Trung Bộ trong dữ liệu bản đồ.</div>';
    return;
  }

  function getGeometryCoords(geometry) {
    let coords = [];
    if (geometry.type === 'Polygon') {
      geometry.coordinates.forEach(ring => {
        ring.forEach(pt => coords.push(pt));
      });
    } else if (geometry.type === 'MultiPolygon') {
      geometry.coordinates.forEach(poly => {
        poly.forEach(ring => {
          ring.forEach(pt => coords.push(pt));
        });
      });
    }
    return coords;
  }

  let minLon = 180, maxLon = -180, minLat = 90, maxLat = -90;
  filteredFeatures.forEach(f => {
    const pts = getGeometryCoords(f.geometry);
    pts.forEach(pt => {
      const lon = pt[0];
      const lat = pt[1];
      if (lon < minLon) minLon = lon;
      if (lon > maxLon) maxLon = lon;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    });
  });

  geojsonMinLon = minLon - (maxLon - minLon) * 0.05;
  geojsonMaxLon = maxLon + (maxLon - minLon) * 0.05;
  geojsonMinLat = minLat - (maxLat - minLat) * 0.05;
  geojsonMaxLat = maxLat + (maxLat - minLat) * 0.05;

  function project(lon, lat) {
    const x = ((lon - geojsonMinLon) / (geojsonMaxLon - geojsonMinLon)) * svgWidth;
    const y = svgHeight - ((lat - geojsonMinLat) / (geojsonMaxLat - geojsonMinLat)) * svgHeight;
    return { x, y };
  }

  const colors = {
    'Thanh Hóa': '#10b981',
    'Nghệ An': '#f59e0b',
    'Hà Tĩnh': '#a855f7',
    'Quảng Bình': '#3b82f6',
    'Quảng Trị': '#ec4899',
    'Thừa Thiên Huế': '#06b6d4'
  };

  function getProvinceStandardName(f) {
    const hcKey = (f.properties['hc-key'] || '').toLowerCase();
    const name = (f.properties['name'] || f.properties['title'] || '').toLowerCase();
    if (hcKey === 'vn-th' || name.includes('thanh hóa') || name.includes('thanh hoa')) return 'Thanh Hóa';
    if (hcKey === 'vn-na' || name.includes('nghệ an') || name.includes('nghe an')) return 'Nghệ An';
    if (hcKey === 'vn-328' || hcKey === 'vn-ht' || name.includes('hà tĩnh') || name.includes('ha tinh')) return 'Hà Tĩnh';
    if (hcKey === 'vn-qb' || name.includes('quảng bình') || name.includes('quang binh')) return 'Quảng Bình';
    if (hcKey === 'vn-qt' || name.includes('quảng trị') || name.includes('quang tri')) return 'Quảng Trị';
    if (hcKey === 'vn-tt' || name.includes('thừa thiên huế') || name.includes('thua thien hue') || name.includes('huế') || name.includes('hue')) return 'Thừa Thiên Huế';
    return 'Khác';
  }

  let pathsHtml = '';
  let labelsHtml = '';
  computedCentroids = {};

  filteredFeatures.forEach((f, idx) => {
    const provName = getProvinceStandardName(f);
    if (provName === 'Khác') return;

    let d = '';
    let sumX = 0, sumY = 0, ptCount = 0;

    if (f.geometry.type === 'Polygon') {
      f.geometry.coordinates.forEach(ring => {
        d += ring.map((pt, i) => {
          const p = project(pt[0], pt[1]);
          sumX += p.x;
          sumY += p.y;
          ptCount++;
          return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
        }).join(' ') + ' Z ';
      });
    } else if (f.geometry.type === 'MultiPolygon') {
      f.geometry.coordinates.forEach(poly => {
        poly.forEach(ring => {
          d += ring.map((pt, i) => {
            const p = project(pt[0], pt[1]);
            sumX += p.x;
            sumY += p.y;
            ptCount++;
            return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
          }).join(' ') + ' Z ';
        });
      });
    }

    const fillColor = colors[provName] || '#3b82f6';
    pathsHtml += `
      <path class="geojson-province" 
            id="geojson-prov-${idx}" 
            data-name="${provName}" 
            d="${d}" 
            fill="${fillColor}" 
            fill-opacity="0.6"
            onclick="selectProvince('${provName}')" />
    `;

    // Compute centroid in projected SVG coordinates
    if (ptCount > 0) {
      const cx = sumX / ptCount;
      const cy = sumY / ptCount;
      computedCentroids[provName] = { x: cx, y: cy };

      const textLen = provName.toUpperCase().length;
      const bgWidth = textLen * 6.5 + 16;
      labelsHtml += `
        <g transform="translate(${cx.toFixed(1)}, ${(cy + 24).toFixed(1)})">
          <rect class="geojson-label-bg" x="-${(bgWidth/2).toFixed(1)}" y="-8" width="${bgWidth}" height="16" />
          <text class="geojson-label-text" dy="4">${provName.toUpperCase()}</text>
        </g>
      `;
    }
  });

  container.innerHTML = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="geojson-svg" xmlns="http://www.w3.org/2000/svg" style="max-height: 90vh;">
      <g id="geojson-provinces-group">
        ${pathsHtml}
      </g>
      <g id="geojson-labels-group" style="pointer-events: none;">
        ${labelsHtml}
      </g>
      <g id="geojson-pins-group">
        <!-- Pins generated dynamically -->
      </g>
    </svg>
  `;

  drawMapMarkers();
}

function drawMapMarkers() {
  const pinsGroup = document.getElementById('geojson-pins-group');
  if (!pinsGroup) return;

  pinsGroup.innerHTML = '';

  const counts = {};
  localAudioCorpus.forEach(a => {
    counts[a.province] = (counts[a.province] || 0) + 1;
  });

  Object.keys(computedCentroids).forEach(provName => {
    const p = computedCentroids[provName];
    const totalCount = counts[provName] || 0;

    const pinGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    pinGroup.setAttribute('transform', `translate(${p.x.toFixed(1)}, ${p.y.toFixed(1)})`);
    pinGroup.setAttribute('class', 'svg-broadcast-pin');
    pinGroup.setAttribute('style', 'cursor: pointer;');
    
    pinGroup.innerHTML = `
      <title>${provName}: ${totalCount} bản ghi</title>
      <circle cx="0" cy="0" r="6" fill="none" stroke="var(--color-primary)" stroke-width="1.5" class="svg-wave" style="pointer-events: none;" />
      <circle cx="0" cy="0" r="6" fill="none" stroke="var(--color-primary)" stroke-width="1.5" class="svg-wave" style="pointer-events: none;" />
      <circle cx="0" cy="0" r="6" fill="var(--color-primary)" stroke="#ffffff" stroke-width="1.5" class="svg-broadcast-dot" />
      <circle cx="10" cy="-10" r="8" fill="var(--color-purple)" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
      <text x="10" y="-7" font-size="8" font-weight="700" fill="#ffffff" text-anchor="middle" font-family="var(--font-sans)">${totalCount}</text>
    `;

    pinGroup.addEventListener('click', (e) => {
      e.stopPropagation();
      selectProvince(provName);
    });

    pinsGroup.appendChild(pinGroup);
  });
}

function filterMapData() {
  if (selectedProvince) {
    displayProvinceInfo(selectedProvince);
  }
}

function selectProvince(provName) {
  selectedProvince = provName;
  
  // Highlight in GeoJSON SVG Map
  document.querySelectorAll('.geojson-province').forEach(el => {
    if (el.getAttribute('data-name') === provName) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });

  // Focus and zoom to selected province centroid
  const centroid = computedCentroids[provName];
  if (centroid) {
    currentScale = 1.8;
    currentTranslateX = (svgWidth / 2) - centroid.x * currentScale;
    currentTranslateY = (svgHeight / 2) - centroid.y * currentScale;
    constrainPan();
    updateMapTransform();
  }

  // Display details in Side Panel
  displayProvinceInfo(provName);
}

function displayProvinceInfo(provName) {
  safeSetText('side-panel-province-title', `Tỉnh ${provName}`);
  
  // Determine Dialect group name based on province
  let dialectGroup = "";
  if (provName === "Thanh Hóa") dialectGroup = "Phương ngữ Thanh Hóa";
  else if (provName === "Nghệ An" || provName === "Hà Tĩnh") dialectGroup = "Phương ngữ Nghệ Tĩnh";
  else dialectGroup = "Phương ngữ Bình Trị Thiên";
  
  safeSetText('side-panel-province-sub', dialectGroup);

  // Filter local corpus for province
  const ageFilter = document.getElementById('map-filter-age').value;
  const topicFilter = document.getElementById('map-filter-topic').value;

  const provinceAudios = localAudioCorpus.filter(a => {
    if (a.province !== provName) return false;
    if (ageFilter !== 'all' && a.ageGroup !== ageFilter) return false;
    if (topicFilter !== 'all' && a.topic !== topicFilter) return false;
    return true;
  });

  safeSetText('side-panel-total-records', provinceAudios.length);
  // Calculate unique speakers
  const speakers = new Set(provinceAudios.map(a => a.speaker));
  safeSetText('side-panel-total-contributors', speakers.size);

  // Render Categorized Audio Playlists
  const historyList = document.getElementById('audio-list-history');
  const singingList = document.getElementById('audio-list-singing');
  const generalList = document.getElementById('audio-list-general');

  historyList.innerHTML = '';
  singingList.innerHTML = '';
  generalList.innerHTML = '';

  provinceAudios.forEach(aud => {
    const card = document.createElement('div');
    card.className = 'audio-card';
    card.id = `audio-card-${aud.id}`;
    card.innerHTML = `
      <div class="audio-card-meta">
        <span>${aud.ageGroup} | ${aud.gender}</span>
        <span><i class="fas fa-certificate" style="color: var(--color-success)"></i> ${aud.confidence}% AI</span>
      </div>
      <div class="audio-card-title">${aud.title}</div>
      <div class="audio-card-speaker"><i class="fas fa-user-circle"></i> ${aud.speaker}</div>
    `;

    card.addEventListener('click', () => playAudio(aud));

    if (aud.topic === 'Lịch sử & Văn hóa') {
      historyList.appendChild(card);
    } else if (aud.topic === 'Giọng ca đặc trưng (Ví Giặm, Ca Huế...)') {
      singingList.appendChild(card);
    } else {
      generalList.appendChild(card);
    }
  });

  // Show placeholder if category empty
  if (historyList.children.length === 0) historyList.innerHTML = '<div style="font-size: 12px; color: var(--text-muted); font-style: italic; padding: 4px;">Không có bản ghi nào.</div>';
  if (singingList.children.length === 0) singingList.innerHTML = '<div style="font-size: 12px; color: var(--text-muted); font-style: italic; padding: 4px;">Không có bản ghi nào.</div>';
  if (generalList.children.length === 0) generalList.innerHTML = '<div style="font-size: 12px; color: var(--text-muted); font-style: italic; padding: 4px;">Không có bản ghi nào.</div>';
}

// --------------------------------------------------------------------------
// Audio Player Engine with Canvas Waveform Visualizer
// --------------------------------------------------------------------------
function playAudio(audioObj) {
  // Highlight card
  document.querySelectorAll('.audio-card').forEach(el => el.classList.remove('active'));
  const activeCard = document.getElementById(`audio-card-${audioObj.id}`);
  if (activeCard) activeCard.classList.add('active');

  // Update player UI panel
  safeSetText('track-player-title', audioObj.title);
  safeSetText('track-player-meta', `${audioObj.speaker} (${audioObj.province})`);
  
  // Set dual running transcript
  safeSetText('player-transcript-dialect', audioObj.transcriptDialect);
  safeSetText('player-transcript-standard', audioObj.transcriptStandard);

  // Clear previous player
  stopAudioPlayer();

  currentPlayingAudio = audioObj;
  mainAudioPlayer = new Audio(audioObj.audioUrl);
  mainAudioPlayer.play();
  
  const playBtnIcon = document.getElementById('player-play-btn-icon');
  if (playBtnIcon) playBtnIcon.className = 'fas fa-pause';
  startWaveformVisualizer();

  mainAudioPlayer.ontimeupdate = () => {
    const cur = formatTime(mainAudioPlayer.currentTime);
    const dur = formatTime(mainAudioPlayer.duration || 0);
    safeSetText('track-time-lbl', `${cur} / ${dur}`);
  };

  mainAudioPlayer.onended = () => {
    stopAudioPlayer();
  };
}

function togglePlayPause() {
  if (!mainAudioPlayer) return;
  
  const icon = document.getElementById('player-play-btn-icon');
  if (mainAudioPlayer.paused) {
    mainAudioPlayer.play();
    if (icon) icon.className = 'fas fa-pause';
    startWaveformVisualizer();
  } else {
    mainAudioPlayer.pause();
    if (icon) icon.className = 'fas fa-play';
    stopWaveformVisualizer();
  }
}

function stopAudioPlayer() {
  if (mainAudioPlayer) {
    mainAudioPlayer.pause();
    mainAudioPlayer = null;
  }
  const icon = document.getElementById('player-play-btn-icon');
  if (icon) icon.className = 'fas fa-play';
  safeSetText('track-time-lbl', '00:00 / 00:00');
  stopWaveformVisualizer();
}

function formatTime(secs) {
  if (isNaN(secs)) return '00:00';
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Canvas Waveform Animation
function startWaveformVisualizer() {
  stopWaveformVisualizer();
  const canvas = document.getElementById('player-waveform');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  waveformInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
    
    // Draw artificial bars moving randomly to simulate voice activity
    const barWidth = 3;
    const spacing = 2;
    const barCount = Math.floor(canvas.width / (barWidth + spacing));
    
    for (let i = 0; i < barCount; i++) {
      // Create sound bars peaking in middle
      const peakFactor = Math.sin((i / barCount) * Math.PI);
      const amp = Math.random() * canvas.height * 0.7 * peakFactor + 2;
      const x = i * (barWidth + spacing);
      const y = (canvas.height - amp) / 2;
      
      // Neon accent coloring
      ctx.fillStyle = i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)';
      ctx.fillRect(x, y, barWidth, amp);
    }
  }, 100);
}

function stopWaveformVisualizer() {
  if (waveformInterval) {
    clearInterval(waveformInterval);
    waveformInterval = null;
  }
  const canvas = document.getElementById('player-waveform');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw flat static line
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);
  }
}

// --------------------------------------------------------------------------
// Microphone Audio Contribution Flow
// --------------------------------------------------------------------------
function setupAudioRecorder() {
  const openFab = document.getElementById('open-contribute-fab');
  const closeBtn = document.getElementById('close-modal-btn');
  const cancelBtn = document.getElementById('btn-cancel-contrib');
  const submitBtn = document.getElementById('btn-submit-contrib');
  const modal = document.getElementById('contribution-modal');
  const micBtn = document.getElementById('mic-trigger-btn');
  const fileInput = document.getElementById('contrib-file');

  openFab.addEventListener('click', () => {
    // Reset form states
    document.getElementById('contrib-form').reset();
    recordedBlob = null;
    audioChunks = [];
    document.getElementById('record-time-text').innerText = '00:00 (Nhấn mic để bắt đầu thu âm)';
    document.getElementById('record-status').innerText = 'Chưa thu âm';
    micBtn.className = 'mic-circle';
    submitBtn.disabled = true;

    modal.classList.add('active');
  });

  const closeModal = () => {
    stopRecording();
    modal.classList.remove('active');
  };

  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  // Micro Button click handler for recording
  micBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      stopRecording();
    } else {
      startRecording();
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      recordedBlob = fileInput.files[0];
      document.getElementById('record-status').innerText = `Đã tải lên tệp: ${recordedBlob.name}`;
      validateForm();
    }
  });

  // Watch inputs to enable submit button
  document.getElementById('contrib-title').addEventListener('input', validateForm);
  document.getElementById('contrib-speaker').addEventListener('input', validateForm);
  document.getElementById('contrib-province').addEventListener('change', validateForm);
  document.getElementById('contrib-age').addEventListener('change', validateForm);
  document.getElementById('contrib-consent').addEventListener('change', validateForm);

  submitBtn.addEventListener('click', submitContribution);
}

function startRecording() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Trình duyệt không hỗ trợ ghi âm trực tiếp. Vui lòng tải lên tệp tin âm thanh.");
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      
      recordStartTime = Date.now();
      recordDurationSec = 0;
      
      const micBtn = document.getElementById('mic-trigger-btn');
      micBtn.className = 'mic-circle recording';
      document.getElementById('record-status').innerText = 'Đang thu âm...';

      recordTimerInterval = setInterval(() => {
        recordDurationSec = Math.floor((Date.now() - recordStartTime) / 1000);
        const m = Math.floor(recordDurationSec / 60).toString().padStart(2, '0');
        const s = Math.floor(recordDurationSec % 60).toString().padStart(2, '0');
        document.getElementById('record-time-text').innerText = `Đang ghi: ${m}:${s}`;
      }, 1000);

      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        clearInterval(recordTimerInterval);
        recordedBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        document.getElementById('mic-trigger-btn').className = 'mic-circle';
        document.getElementById('record-status').innerText = 'Đã hoàn thành thu âm.';

        // Validation for length (under 5 seconds)
        if (recordDurationSec < 5) {
          alert("Lỗi: Bản ghi quá ngắn (yêu cầu tối thiểu 5 giây để AI phân tích). Vui lòng thực hiện thu âm lại.");
          recordedBlob = null;
          document.getElementById('record-time-text').innerText = 'Lỗi: Âm thanh quá ngắn (< 5s)';
        } else {
          document.getElementById('record-time-text').innerText = `Bản ghi dài ${recordDurationSec}s (Đạt chuẩn)`;
        }
        validateForm();
      };
    })
    .catch(err => {
      console.error("Giao diện âm thanh mic không mở được: ", err);
      alert("Không có quyền truy cập microphone.");
    });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    // Stop mic stream track to close recording indicators on browser
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  }
}

function validateForm() {
  const title = document.getElementById('contrib-title').value.trim();
  const speaker = document.getElementById('contrib-speaker').value.trim();
  const province = document.getElementById('contrib-province').value;
  const age = document.getElementById('contrib-age').value;
  const consent = document.getElementById('contrib-consent').checked;
  const submitBtn = document.getElementById('btn-submit-contrib');

  const isValid = title && speaker && province && age && consent && recordedBlob;
  submitBtn.disabled = !isValid;
}

// Simulated AI Processing Pipeline trigger
function submitContribution() {
  // Hide Contribution modal
  document.getElementById('contribution-modal').classList.remove('active');

  // Open AI loader modal
  const aiModal = document.getElementById('ai-pipeline-modal');
  aiModal.classList.add('active');

  // Reset steps
  const steps = ['step-stt', 'step-predict', 'step-verify', 'step-tag'];
  steps.forEach(id => {
    const el = document.getElementById(id);
    el.className = 'ai-step pending';
    el.querySelector('i').className = 'far fa-circle';
  });

  // Step 1: PhoWhisper STT
  runPipelineStep('step-stt', 1500, () => {
    // Step 2: wav2vec2 Acoustic Gender/Age Prediction
    runPipelineStep('step-predict', 1800, () => {
      // Step 3: Dialect Verify regional accent check
      runPipelineStep('step-verify', 2000, () => {
        // Step 4: Claude API topic synthesis
        runPipelineStep('step-tag', 1500, () => {
          // Success Callback: Save contribution into pending review list
          setTimeout(() => {
            aiModal.classList.remove('active');
            completeContributionSave();
          }, 800);
        });
      });
    });
  });
}

function runPipelineStep(stepId, delay, callback) {
  const el = document.getElementById(stepId);
  el.className = 'ai-step processing';
  el.querySelector('i').className = 'fas fa-spinner fa-spin';

  setTimeout(() => {
    el.className = 'ai-step success';
    el.querySelector('i').className = 'fas fa-check-circle';
    callback();
  }, delay);
}

function completeContributionSave() {
  const title = document.getElementById('contrib-title').value.trim();
  const speaker = document.getElementById('contrib-speaker').value.trim();
  const province = document.getElementById('contrib-province').value;
  const age = document.getElementById('contrib-age').value;
  const gender = document.getElementById('contrib-gender').value;
  const topic = document.getElementById('contrib-topic').value;

  // Generate fake transcripts and AI verification data based on province and inputs
  let transcriptDialect = "Tui mần răng mô biết cấy chi tê rứa bọ mạ.";
  let transcriptStandard = "Tôi làm sao đâu biết cái gì kia thế bố mẹ.";
  
  if (province === "Thanh Hóa") {
    transcriptDialect = "Tao đón thế mi có tỏi chi không, gà nhà tui đẻ clả trứng.";
    transcriptStandard = "Tao nói thế mày có biết gì không, gà nhà tôi đẻ quả trứng.";
  } else if (province === "Nghệ An" || province === "Hà Tĩnh") {
    transcriptDialect = "Nhà tui ở cạnh cấy rú nớ, rót cho bát nác chè xanh mần lòng sướng tê.";
    transcriptStandard = "Nhà tôi ở cạnh cái núi đó, rót cho bát nước chè xanh làm lòng sướng thế.";
  }

  const isMatched = (Math.random() > 0.15); // 85% match confidence
  const confidence = Math.floor(Math.random() * 15) + 82; // 82-97%

  const newPending = {
    id: "p_" + Date.now(),
    title: title,
    province: province,
    dialectGroup: province === "Thanh Hóa" ? "Thanh Hóa" : (province === "Nghệ An" || province === "Hà Tĩnh" ? "Nghệ Tĩnh" : "Bình Trị Thiên"),
    speaker: speaker,
    ageGroup: age,
    gender: gender,
    topic: topic,
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // mock audio file
    transcriptDialect: transcriptDialect,
    transcriptStandard: transcriptStandard,
    verified: isMatched,
    confidence: confidence,
    tags: [topic.split(' ')[0], province, "Đóng góp"],
    consent: true
  };

  pendingContributions.push(newPending);
  localStorage.setItem('vb_pending_contributions', JSON.stringify(pendingContributions));
  
  alert(`Cảm ơn bạn! Bản ghi đã được gửi thành công.\n\nAI Đã phân tích:\n- Kết quả giọng nói: ${isMatched ? 'KHỚP' : 'KHÔNG KHỚP'} vùng ${province} (Độ tin cậy ${confidence}%)\n- Đã chuyển bản ghi tới hàng đợi kiểm duyệt của Admin.`);
  
  // Refresh stats & views if admin is open
  updateGlobalStats();
  if (activeTab === 'admin-view') {
    renderAdminQueue();
  }
}

// --------------------------------------------------------------------------
// Dialect Dictionary Module
// --------------------------------------------------------------------------
let activeDictionaryWord = null;

function initDictionaryModule() {
  const searchInput = document.getElementById('dict-search-input');
  searchInput.addEventListener('input', filterDictionary);

  // Group selection changes
  document.querySelectorAll('.dict-group-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dict-group-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterDictionary();
    });
  });

  renderDictionaryList(localLexicon);

  // Modal đóng góp từ
  const openCont = document.getElementById('open-add-word-btn');
  const closeCont = document.getElementById('close-word-modal-btn');
  const cancelWord = document.getElementById('btn-cancel-word');
  const submitWord = document.getElementById('btn-submit-word');
  const modalWord = document.getElementById('add-word-modal');

  openCont.addEventListener('click', () => {
    document.getElementById('add-word-form').reset();
    modalWord.classList.add('active');
  });

  closeCont.addEventListener('click', () => modalWord.classList.remove('active'));
  cancelWord.addEventListener('click', () => modalWord.classList.remove('active'));

  submitWord.addEventListener('click', () => {
    const word = document.getElementById('word-input').value.trim();
    const meaning = document.getElementById('word-meaning-input').value.trim();
    const region = document.getElementById('word-region').value;
    const example = document.getElementById('word-example').value.trim();
    const exampleTrans = document.getElementById('word-example-trans').value.trim();

    if (!word || !meaning || !region || !example || !exampleTrans) {
      alert("Vui lòng nhập đầy đủ các trường thông tin bắt buộc!");
      return;
    }

    const newWord = {
      id: "l_" + Date.now(),
      word: word.toLowerCase(),
      region: region,
      meaning: meaning,
      example: example,
      exampleTranslation: exampleTrans,
      culturalInsight: `Từ phương ngữ được đóng góp bởi thành viên cộng đồng. Giải thích văn hóa sơ bộ: Từ "${word}" thể hiện phong cách giao tiếp đặc trưng của vùng ${region}, biểu đạt nghĩa "${meaning}".`
    };

    localLexicon.push(newWord);
    localStorage.setItem('vb_lexicon', JSON.stringify(localLexicon));
    updateGlobalStats();
    filterDictionary();
    modalWord.classList.remove('active');
    alert("Từ vựng mới đã được cộng đồng đóng góp thành công!");
  });
}

function renderDictionaryList(list) {
  const container = document.getElementById('dict-list');
  container.innerHTML = '';

  if (list.length === 0) {
    container.innerHTML = '<div style="color: var(--text-muted); font-style: italic; text-align: center; padding: 20px;">Không tìm thấy từ tương thích.</div>';
    return;
  }

  list.forEach(w => {
    const card = document.createElement('div');
    card.className = `dict-item-card ${activeDictionaryWord && activeDictionaryWord.id === w.id ? 'active' : ''}`;
    card.innerHTML = `
      <div class="dict-item-header">
        <span class="dict-item-word">${w.word}</span>
        <span class="dict-item-region">${w.region}</span>
      </div>
      <div class="dict-item-meaning">${w.meaning}</div>
    `;
    card.addEventListener('click', () => showDictionaryDetail(w));
    container.appendChild(card);
  });
}

function filterDictionary() {
  const query = document.getElementById('dict-search-input').value.toLowerCase().trim();
  const filterBtn = document.querySelector('.dict-group-filter.active');
  const activeRegionCode = filterBtn ? filterBtn.getAttribute('data-region') : 'all';

  const filtered = localLexicon.filter(w => {
    // Match search query
    const matchQuery = w.word.includes(query) || w.meaning.toLowerCase().includes(query);
    if (!matchQuery) return false;

    // Match region tab
    if (activeRegionCode === 'all') return true;
    if (activeRegionCode === 'thanhhoa') return w.region.includes('Thanh Hóa');
    if (activeRegionCode === 'nghetinh') return w.region.includes('Nghệ Tĩnh');
    if (activeRegionCode === 'binhtrithien') return w.region.includes('Bình Trị Thiên');
    
    return true;
  });

  renderDictionaryList(filtered);
}

function showDictionaryDetail(wordObj) {
  activeDictionaryWord = wordObj;
  
  // Highlight active
  document.querySelectorAll('.dict-item-card').forEach(c => c.classList.remove('active'));
  
  // Redraw list to preserve active highlight
  filterDictionary();

  const emptyPane = document.getElementById('dict-detail-empty');
  const contentPane = document.getElementById('dict-detail-content');

  emptyPane.style.display = 'none';
  contentPane.style.display = 'block';

  safeSetText('detail-word', wordObj.word);
  safeSetText('detail-region-tag', wordObj.region);
  safeSetText('detail-meaning', wordObj.meaning);
  safeSetText('detail-example-orig', wordObj.example);
  safeSetText('detail-example-trans', wordObj.exampleTranslation);
  const aiInsightEl = document.getElementById('detail-ai-insight');
  if (aiInsightEl) aiInsightEl.innerHTML = wordObj.culturalInsight;
}

// --------------------------------------------------------------------------
// Dialect Translator Module (RAG Simulation)
// --------------------------------------------------------------------------
let translatorDirection = 'dialect-to-standard'; // or 'standard-to-dialect'

function initTranslatorModule() {
  const srcArea = document.getElementById('translator-src');
  const destArea = document.getElementById('translator-dest');
  const translateBtn = document.getElementById('btn-trigger-translate');
  const swapBtn = document.getElementById('btn-swap-languages');

  // Pre-fill saved Gemini API Key
  const apiKeyInput = document.getElementById('gemini-api-key-input');
  const saveKeyBtn = document.getElementById('btn-save-api-key');
  if (apiKeyInput) {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      apiKeyInput.value = savedKey;
    }
  }
  if (saveKeyBtn && apiKeyInput) {
    saveKeyBtn.addEventListener('click', () => {
      const key = apiKeyInput.value.trim();
      if (key) {
        localStorage.setItem('gemini_api_key', key);
        alert('Đã lưu Gemini API Key thành công!');
      } else {
        localStorage.removeItem('gemini_api_key');
        alert('Đã xóa Gemini API Key.');
      }
    });
  }

  srcArea.addEventListener('focus', () => srcArea.parentElement.classList.add('focus'));
  srcArea.addEventListener('blur', () => srcArea.parentElement.classList.remove('focus'));

  swapBtn.addEventListener('click', () => {
    const labelL = document.getElementById('translator-lbl-left');
    const labelR = document.getElementById('translator-lbl-right');

    if (translatorDirection === 'dialect-to-standard') {
      translatorDirection = 'standard-to-dialect';
      labelL.innerText = 'Tiếng Việt Phổ Thông';
      labelR.innerText = 'Phương ngữ Bắc Trung Bộ';
      srcArea.placeholder = 'Nhập câu tiếng phổ thông (ví dụ: mẹ tôi làm gì có đầu)';
    } else {
      translatorDirection = 'dialect-to-standard';
      labelL.innerText = 'Phương ngữ Bắc Trung Bộ';
      labelR.innerText = 'Tiếng Việt Phổ Thông';
      srcArea.placeholder = 'Nhập câu tiếng địa phương (ví dụ: răng bữa ni mi đi mần trễ rứa)';
    }
    srcArea.value = '';
    destArea.innerHTML = '<span class="translator-output empty">Kết quả dịch sẽ hiển thị ở đây...</span>';
    document.getElementById('translator-warning-bar').classList.remove('active');
    document.getElementById('translator-vocab-card-list').innerHTML = '<div style="font-size: 13px; color: var(--text-muted); font-style: italic;">Nhập câu phương ngữ và bấm dịch để phân tích chi tiết.</div>';
  });

  translateBtn.addEventListener('click', triggerTranslation);
}

function setTranslatorPreset(text) {
  const srcArea = document.getElementById('translator-src');
  if (srcArea) {
    srcArea.value = text;
    triggerTranslation();
  }
}
window.setTranslatorPreset = setTranslatorPreset;

async function triggerTranslation() {
  const srcText = document.getElementById('translator-src').value.trim();
  const destArea = document.getElementById('translator-dest');
  const vocabList = document.getElementById('translator-vocab-card-list');
  const warningBar = document.getElementById('translator-warning-bar');
  const translateBtn = document.getElementById('btn-trigger-translate');

  if (!srcText) {
    destArea.innerHTML = '<span class="translator-output empty">Kết quả dịch sẽ hiển thị ở đây...</span>';
    vocabList.innerHTML = '<div style="font-size: 13px; color: var(--text-muted); font-style: italic;">Nhập câu phương ngữ và bấm dịch để phân tích chi tiết.</div>';
    return;
  }

  const savedKey = localStorage.getItem('gemini_api_key');
  let apiSuccess = false;
  
  if (savedKey) {
    // Show spinner/loading state on button
    const oldBtnText = translateBtn.innerHTML;
    translateBtn.disabled = true;
    translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang phân tích AI...';
    destArea.innerHTML = '<span class="translator-output" style="color: var(--color-primary); font-size: 14px;"><i class="fas fa-brain fa-pulse"></i> Đang gửi yêu cầu dịch thuật tới Gemini API...</span>';

    try {
      const prompt = `Bạn là chuyên gia ngôn ngữ học về phương ngữ và văn hóa Việt Nam.
Hãy dịch câu phương ngữ sau đây sang tiếng Việt phổ thông chuẩn mực (hoặc ngược lại nếu chiều dịch là từ phổ thông sang phương ngữ), tự nhiên nhất:
Câu gốc: "${srcText}"
Chiều dịch: ${translatorDirection === 'dialect-to-standard' ? 'Từ phương ngữ Bắc Trung Bộ sang tiếng phổ thông chuẩn' : 'Từ tiếng phổ thông sang phương ngữ Bắc Trung Bộ'}

Hãy trả về cấu trúc JSON chính xác theo dạng sau:
{
  "translation": "câu tiếng Việt tương ứng sau khi dịch",
  "wordsBreakdown": [
    {
      "dialectWord": "từ địa phương",
      "standardMeaning": "nghĩa tiếng phổ thông",
      "explanation": "giải nghĩa văn cảnh ngắn gọn"
    }
  ]
}
Chỉ trả về JSON thô duy nhất, không thêm bớt từ ngữ thảo luận khác ngoài JSON này.`;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${savedKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const rawText = data.candidates[0].content.parts[0].text;
      const result = JSON.parse(rawText.trim());
      
      // Update output UI
      destArea.innerHTML = `<div class="translator-output">${result.translation}</div>`;
      warningBar.classList.remove('active');

      vocabList.innerHTML = '';
      if (result.wordsBreakdown && result.wordsBreakdown.length > 0) {
        result.wordsBreakdown.forEach(item => {
          const card = document.createElement('div');
          card.className = 'breakdown-card';
          card.innerHTML = `
            <span class="breakdown-card-word">${item.dialectWord}</span>
            <span class="breakdown-card-meaning">Nghĩa: ${item.standardMeaning}</span>
            <p class="breakdown-card-exp">${item.explanation}</p>
          `;
          vocabList.appendChild(card);
        });
      } else {
        vocabList.innerHTML = '<div style="grid-column: 1 / -1; font-size: 13px; color: var(--text-muted); font-style: italic; text-align: center; padding: 12px;">Không phát hiện từ địa phương bổ trợ RAG.</div>';
      }
      apiSuccess = true;
    } catch (err) {
      console.error("Gemini API call failed, falling back to local dictionary:", err);
      destArea.innerHTML = '<span class="translator-output" style="color: var(--color-danger); font-size: 12px; margin-bottom: 8px; display: block;"><i class="fas fa-exclamation-circle"></i> Gemini API bị lỗi hoặc API Key không hợp lệ. Đang tự động chuyển sang chế độ Dịch offline...</span>';
    } finally {
      translateBtn.disabled = false;
      translateBtn.innerHTML = oldBtnText;
    }
  }

  // --- LOCAL FALLBACK OFF-LINE TRANSLATION (DIACRITIC-INSENSITIVE ENGINE) ---
  if (!apiSuccess) {
    const normalized = srcText.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
    let translatedText = "";
    let matchedVocab = [];
    let isPreset = false;

    // 1. Check exact presets first for maximum accuracy
    if (normalized.includes('răng bữa ni mi đi học trễ rứa')) {
      translatedText = "Sao hôm nay mày đi học muộn thế?";
      matchedVocab = [
        { dialectWord: 'răng', standardMeaning: 'sao / tại sao', explanation: 'Từ hỏi lý do kinh điển trong tiếng Nghệ Tĩnh và Bình Trị Thiên.' },
        { dialectWord: 'bữa ni', standardMeaning: 'hôm nay', explanation: 'Biến âm chỉ thời gian hôm nay, ghép từ "bữa" và "ni" (này).' },
        { dialectWord: 'mi', standardMeaning: 'mày / bạn', explanation: 'Đại từ nhân xưng ngôi thứ hai thân mật.' },
        { dialectWord: 'rứa', standardMeaning: 'vậy / thế', explanation: 'Trợ từ đệm cảm thán đặt cuối câu để nhấn mạnh mức độ.' }
      ];
      isPreset = true;
    } else if (normalized.includes('mệ đi mô rứa mệ ơi') || normalized.includes('mệ đi mô rứa mệ')) {
      translatedText = "Bà đi đâu thế bà ơi?";
      matchedVocab = [
        { dialectWord: 'mệ', standardMeaning: 'bà / mẹ lớn tuổi', explanation: 'Kính xưng tôn kính để gọi bà hoặc các cụ bà lớn tuổi ở vùng Thừa Thiên Huế.' },
        { dialectWord: 'mô', standardMeaning: 'đâu / phương nào', explanation: 'Từ hỏi vị trí địa lý đặc trưng, dùng phổ biến ở miền Trung.' },
        { dialectWord: 'rứa', standardMeaning: 'vậy / thế', explanation: 'Từ đệm cuối câu hỏi để tăng tính nhẹ nhàng, thân mật.' }
      ];
      isPreset = true;
    } else if (normalized.includes('mát dữ hôn') || normalized.includes('trời mát dữ hôn tui mới qua bển mần chuyện')) {
      translatedText = "Hôm nay trời mát mẻ thật đấy chứ, tôi mới qua bên kia làm việc.";
      matchedVocab = [
        { dialectWord: 'bữa nay', standardMeaning: 'hôm nay', explanation: 'Cách định vị thời gian cực kỳ quen thuộc của người phương Nam.' },
        { dialectWord: 'dữ hôn', standardMeaning: 'quá trời / dữ dội thế', explanation: 'Từ cảm thán biểu đạt sắc thái cường điệu cực tả trong khẩu ngữ miền Nam.' },
        { dialectWord: 'tui', standardMeaning: 'tôi / tao', explanation: 'Đại từ nhân xưng ngôi thứ nhất số ít vùng Nam và Trung Bộ.' },
        { dialectWord: 'bển', standardMeaning: 'bên kia', explanation: 'Chỉ vị trí địa lý ở khoảng cách đối diện, đối lập.' },
        { dialectWord: 'mần', standardMeaning: 'làm', explanation: 'Biến âm động từ làm, thể hiện sự lao động vất vả, mộc mạc.' }
      ];
      isPreset = true;
    }

    // 2. Fallback to Dynamic Dictionary Translation with Diacritic-Insensitive Engine
    if (!isPreset) {
      function removeDiacritics(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
      }

      const srcTextClean = removeDiacritics(srcText.toLowerCase());

      localLexicon.forEach(lex => {
        const lexWordClean = removeDiacritics(lex.word.toLowerCase());
        if (srcTextClean.includes(lexWordClean)) {
          matchedVocab.push({
            dialectWord: lex.word,
            standardMeaning: lex.meaning,
            explanation: lex.culturalInsight ? lex.culturalInsight.split('.')[0] + '.' : 'Từ địa phương vùng ' + lex.region
          });
        }
      });

      let temp = srcText;
      if (translatorDirection === 'dialect-to-standard') {
        const sortedVocab = [...matchedVocab].sort((a, b) => b.dialectWord.length - a.dialectWord.length);
        sortedVocab.forEach(item => {
          let tempClean = removeDiacritics(temp.toLowerCase());
          let itemWordClean = removeDiacritics(item.dialectWord.toLowerCase());
          
          let index = tempClean.indexOf(itemWordClean);
          while (index !== -1) {
            temp = temp.substring(0, index) + item.standardMeaning.split(',')[0].trim() + temp.substring(index + itemWordClean.length);
            tempClean = removeDiacritics(temp.toLowerCase());
            index = tempClean.indexOf(itemWordClean);
          }
        });
        translatedText = temp.charAt(0).toUpperCase() + temp.slice(1);
      } else {
        // Standard to Dialect
        let matchedStandard = [];
        localLexicon.forEach(lex => {
          const meanings = lex.meaning.split(',').map(m => m.trim().toLowerCase());
          meanings.forEach(m => {
            const mClean = removeDiacritics(m);
            if (srcTextClean.includes(mClean)) {
              matchedStandard.push({
                dialectWord: lex.word,
                standardMeaning: m,
                explanation: `Biến đổi sang từ địa phương "${lex.word}" đại diện nghĩa "${m}"`
              });
              let tempClean = removeDiacritics(temp.toLowerCase());
              let index = tempClean.indexOf(mClean);
              while (index !== -1) {
                temp = temp.substring(0, index) + lex.word + temp.substring(index + mClean.length);
                tempClean = removeDiacritics(temp.toLowerCase());
                index = tempClean.indexOf(mClean);
              }
            }
          });
        });
        translatedText = temp.charAt(0).toUpperCase() + temp.slice(1);
        matchedVocab = matchedStandard;
      }
    }

    // Display translation
    const prevHtml = destArea.innerHTML;
    destArea.innerHTML = (prevHtml.includes('Gemini API bị lỗi') ? prevHtml : '') + `<div class="translator-output">${translatedText}</div>`;

    // Display Warning if suspicious dialect words exist but aren't mapped
    let hasMissing = false;
    if (!isPreset && translatorDirection === 'dialect-to-standard') {
      const midViet = ["mô", "tê", "răng", "rứa", "nớ", "mần", "trốc", "bọ", "mạ", "ngái", "nác", "rú", "khu", "clả", "cấy", "du"];
      midViet.forEach(mv => {
        if (srcText.toLowerCase().includes(mv) && !matchedVocab.some(x => x.dialectWord === mv)) {
          hasMissing = true;
        }
      });
    }

    if (hasMissing) {
      warningBar.classList.add('active');
    } else {
      warningBar.classList.remove('active');
    }

    // Render Breakdown Cards
    vocabList.innerHTML = '';
    if (matchedVocab.length > 0) {
      matchedVocab.forEach(item => {
        const card = document.createElement('div');
        card.className = 'breakdown-card';
        card.innerHTML = `
          <span class="breakdown-card-word">${item.dialectWord}</span>
          <span class="breakdown-card-meaning">Nghĩa: ${item.standardMeaning}</span>
          <p class="breakdown-card-exp">${item.explanation}</p>
        `;
        vocabList.appendChild(card);
      });
    } else {
      vocabList.innerHTML = '<div style="grid-column: 1 / -1; font-size: 13px; color: var(--text-muted); font-style: italic; text-align: center; padding: 12px;">Không phát hiện từ địa phương bổ trợ RAG.</div>';
    }
  }
}

// --------------------------------------------------------------------------
// Conversational AI Chatbot (Trợ lý Sông Núi)
// --------------------------------------------------------------------------
function initChatbotModule() {
  const sendBtn = document.getElementById('chat-send-btn');
  const chatInput = document.getElementById('chat-input');
  
  sendBtn.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // Handle Quick Queries Click
  const quickQueryBtns = document.querySelectorAll('.quick-query-btn');
  quickQueryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-query');
      triggerBotQuestion(text);
    });
  });
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  triggerBotQuestion(text);
  input.value = '';
}

function triggerBotQuestion(text) {
  appendMessage('user', text);
  
  // Show Typing indicator
  const messageBox = document.getElementById('chat-messages-container');
  const typingBubble = document.createElement('div');
  typingBubble.className = 'chat-bubble bot';
  typingBubble.id = 'chat-typing-indicator-bubble';
  typingBubble.innerHTML = `
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messageBox.appendChild(typingBubble);
  messageBox.scrollTop = messageBox.scrollHeight;

  // Simulate RAG and respond
  setTimeout(() => {
    // Remove typing bubble
    const typing = document.getElementById('chat-typing-indicator-bubble');
    if (typing) typing.remove();

    // RAG Search Logic
    let responseText = `Tôi là **Trợ lý văn hóa Thổ âm Sông núi**. Xin lỗi bạn, hiện tại tôi chưa tìm thấy câu trả lời hoàn hảo cho câu hỏi của bạn về: *"${text}"* trong cơ sở dữ liệu phương ngữ Bắc Trung Bộ. 
    
Bạn có thể thử hỏi tôi các câu hỏi nhanh có sẵn ở cột bên trái hoặc hỏi về nghĩa của từ như *“răng”*, *“mô”*, *“tê”*, *“rứa”* nhé!`;
    
    // Check keyword matching
    const matchedRag = CHATBOT_RAG_DATABASE.find(item => {
      return item.keywords.some(kw => text.toLowerCase().includes(kw));
    });

    if (matchedRag) {
      responseText = matchedRag.response;
    } else {
      // Fallback: search in Dictionary
      const dictMatch = localLexicon.find(w => text.toLowerCase().includes(w.word));
      if (dictMatch) {
        responseText = `Theo dữ liệu RAG tôi truy vấn được từ **Từ điển phương ngữ**:
- **Từ:** **"${dictMatch.word}"**
- **Nghĩa:** ${dictMatch.meaning}
- **Khu vực sử dụng:** ${dictMatch.region}
- **Ví dụ:** *"${dictMatch.example}"* $\\rightarrow$ Nghĩa: *"${dictMatch.exampleTranslation}"*
- **Bối cảnh văn hóa:** ${dictMatch.culturalInsight}`;
      }
    }

    appendMessage('bot', responseText);
  }, 1200);
}

function appendMessage(sender, text) {
  const container = document.getElementById('chat-messages-container');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;
  
  // Simple markdown-to-html conversion for responses
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
    
  bubble.innerHTML = formattedText;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

// --------------------------------------------------------------------------
// Admin Dashboard Module (Moderation Queue)
// --------------------------------------------------------------------------
let activeAdminReviewId = null;

function initAdminModule() {
  document.getElementById('admin-btn-approve').addEventListener('click', approveContribution);
  document.getElementById('admin-btn-delete').addEventListener('click', softDeleteContribution);
  
  // Custom audio player for Admin Detail
  const playBtn = document.getElementById('admin-play-btn');
  let adminAudio = null;

  playBtn.addEventListener('click', () => {
    if (!activeAdminReviewId) return;
    
    const contrib = pendingContributions.find(x => x.id === activeAdminReviewId);
    if (!contrib) return;

    const icon = playBtn.querySelector('i');
    
    if (adminAudio) {
      if (!adminAudio.paused) {
        adminAudio.pause();
        icon.className = 'fas fa-play';
        return;
      }
      adminAudio.play();
      icon.className = 'fas fa-pause';
      return;
    }

    adminAudio = new Audio(contrib.audioUrl);
    adminAudio.play();
    icon.className = 'fas fa-pause';

    adminAudio.onended = () => {
      icon.className = 'fas fa-play';
      adminAudio = null;
    };
  });
}

function renderAdminQueue() {
  const list = document.getElementById('admin-queue-list');
  list.innerHTML = '';

  if (pendingContributions.length === 0) {
    list.innerHTML = '<div style="color: var(--text-muted); font-style: italic; text-align: center; padding: 24px; font-size: 13px;">Hàng đợi kiểm duyệt trống.</div>';
    document.getElementById('admin-detail-empty').style.display = 'flex';
    document.getElementById('admin-detail-content').style.display = 'none';
    return;
  }

  pendingContributions.forEach(item => {
    const card = document.createElement('div');
    card.className = `admin-queue-card ${activeAdminReviewId === item.id ? 'active' : ''}`;
    
    const isMismatch = !item.verified;
    const badgeClass = isMismatch ? 'mismatch' : 'match';
    const badgeText = isMismatch ? 'LỆCH VÙNG' : 'KHỚP GIỌNG';

    card.innerHTML = `
      <div class="admin-card-header">
        <span class="admin-card-title">${item.title}</span>
        <span class="admin-card-badge ${badgeClass}">${badgeText}</span>
      </div>
      <div class="admin-card-details">
        <span>Tỉnh: ${item.province} | Loa: ${item.speaker}</span>
      </div>
    `;

    card.addEventListener('click', () => selectAdminReviewItem(item));
    list.appendChild(card);
  });
}

function selectAdminReviewItem(item) {
  activeAdminReviewId = item.id;
  
  // Highlight active card
  document.querySelectorAll('.admin-queue-card').forEach(c => c.classList.remove('active'));
  renderAdminQueue();

  const emptyPane = document.getElementById('admin-detail-empty');
  const contentPane = document.getElementById('admin-detail-content');

  emptyPane.style.display = 'none';
  contentPane.style.display = 'flex';

  document.getElementById('admin-detail-title-txt').innerText = item.title;
  document.getElementById('admin-detail-speaker').innerText = `Người đóng góp: ${item.speaker} | Tỉnh: ${item.province} | Nhóm tuổi: ${item.ageGroup} | Giới tính: ${item.gender}`;

  // AI Pipeline Labels
  const aiTagWrapper = document.getElementById('admin-ai-tags-row');
  const statusIcon = item.verified 
    ? `<span class="ai-pill green"><i class="fas fa-check-circle"></i> Khớp vùng: ${item.province} (${item.confidence}%)</span>`
    : `<span class="ai-pill" style="color: var(--color-danger); background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2);"><i class="fas fa-exclamation-triangle"></i> Nghi ngờ lệch giọng (${item.confidence}% tin cậy)</span>`;

  aiTagWrapper.innerHTML = `
    ${statusIcon}
    <span class="ai-pill"><i class="fas fa-robot"></i> STT PhoWhisper</span>
    <span class="ai-pill"><i class="fas fa-tags"></i> Tag: ${item.topic}</span>
  `;

  // Show Transcripts
  document.getElementById('admin-trans-dialect').innerText = item.transcriptDialect;
  document.getElementById('admin-trans-standard').innerText = item.transcriptStandard;
}

function approveContribution() {
  if (!activeAdminReviewId) return;

  const index = pendingContributions.findIndex(x => x.id === activeAdminReviewId);
  if (index === -1) return;

  const item = pendingContributions[index];

  // Modify stats: update verified status
  item.verified = true;
  
  // Add to active AUDIO_CORPUS
  localAudioCorpus.push(item);
  localStorage.setItem('vb_audio_corpus', JSON.stringify(localAudioCorpus));

  // Remove from pending
  pendingContributions.splice(index, 1);
  localStorage.setItem('vb_pending_contributions', JSON.stringify(pendingContributions));

  alert(`Đã duyệt thành công bản ghi: "${item.title}". Bản ghi hiện đã được đăng tải lên Bản đồ công khai.`);

  activeAdminReviewId = null;
  updateGlobalStats();
  drawMapMarkers();
  renderAdminQueue();
}

function softDeleteContribution() {
  if (!activeAdminReviewId) return;

  const index = pendingContributions.findIndex(x => x.id === activeAdminReviewId);
  if (index === -1) return;

  const item = pendingContributions[index];
  
  if (confirm(`Bạn có chắc chắn muốn xóa bản ghi "${item.title}"? Thao tác này sẽ xóa hoàn toàn tệp âm thanh trên bộ lưu trữ đám mây.`)) {
    // Remove from pending
    pendingContributions.splice(index, 1);
    localStorage.setItem('vb_pending_contributions', JSON.stringify(pendingContributions));

    alert("Đã xóa bản ghi thành công.");
    activeAdminReviewId = null;
    renderAdminQueue();
    updateGlobalStats();
  }
}
