let startTime = 0;
let elapsed = 0;
let running = false;
let rafId = null;
let laps = [];
let lapStartTime = 0;
let lapElapsed = 0;
let soundEnabled = true;
let darkTheme = true;
let progressMax = 60000; // 60s cycle for progress bar
let lastLapTime = 0;

// ─── Audio ────────────────────────────────────────────────────────────────────

let audioCtx = null;

function getAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function beep(freq = 880, dur = 0.06, type = 'sine', vol = 0.15) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch (e) {}
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatTime(ms, full = false) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0 || full) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatMs(ms) {
  return '.' + String(ms % 1000).padStart(3, '0');
}

function formatLapTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

// ─── Timer Core ───────────────────────────────────────────────────────────────

function tick() {
  const now = performance.now();
  elapsed = now - startTime;
  lapElapsed = now - lapStartTime;

  document.getElementById('timeDisplay').childNodes[0].textContent = formatTime(elapsed);
  document.getElementById('msDisplay').textContent = formatMs(elapsed);

  const pct = (elapsed % progressMax) / progressMax * 100;
  document.getElementById('progressFill').style.width = pct + '%';

  rafId = requestAnimationFrame(tick);
}

function toggleTimer() {
  if (running) {
    // Pause
    cancelAnimationFrame(rafId);
    running = false;
    beep(440, 0.08);

    document.getElementById('mainBtn').textContent = '▶';
    document.getElementById('mainBtn').classList.remove('running');
    document.getElementById('lapBtn').disabled = true;
    document.getElementById('splitBtn').disabled = true;
    document.getElementById('statusDot').classList.remove('running');
    document.getElementById('statusText').textContent = 'PAUSED';
    document.getElementById('timeDisplay').classList.remove('running');
  } else {
    // Start / Resume
    beep(880, 0.07);
    if (elapsed === 0) {
      startTime = performance.now();
      lapStartTime = performance.now();
      lastLapTime = 0;
    } else {
      startTime = performance.now() - elapsed;
      lapStartTime = performance.now() - lapElapsed;
    }
    running = true;
    rafId = requestAnimationFrame(tick);

    document.getElementById('mainBtn').innerHTML = '⏸';
    document.getElementById('mainBtn').classList.add('running');
    document.getElementById('lapBtn').disabled = false;
    document.getElementById('splitBtn').disabled = false;
    document.getElementById('resetBtn').disabled = false;
    document.getElementById('statusDot').classList.add('running');
    document.getElementById('statusText').textContent = 'RUNNING';
    document.getElementById('timeDisplay').classList.add('running');
  }
}

function resetTimer() {
  if (running) {
    cancelAnimationFrame(rafId);
    running = false;
  }
  elapsed = 0;
  lapElapsed = 0;
  lastLapTime = 0;

  document.getElementById('timeDisplay').childNodes[0].textContent = '00:00';
  document.getElementById('msDisplay').textContent = '.000';
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('mainBtn').innerHTML = '▶';
  document.getElementById('mainBtn').classList.remove('running');
  document.getElementById('lapBtn').disabled = true;
  document.getElementById('splitBtn').disabled = true;
  document.getElementById('resetBtn').disabled = true;
  document.getElementById('statusDot').classList.remove('running');
  document.getElementById('statusText').textContent = 'STANDBY';
  document.getElementById('timeDisplay').classList.remove('running');

  beep(300, 0.12, 'square', 0.08);
}

// ─── Laps & Splits ────────────────────────────────────────────────────────────

function recordLap() {
  if (!running) return;
  const now = performance.now();
  const lapTime = now - lapStartTime;
  const totalTime = elapsed;

  laps.unshift({ num: laps.length + 1, lapTime, totalTime, type: 'lap' });
  lapStartTime = now;
  lastLapTime = lapTime;

  beep(1100, 0.05);
  renderLaps();
  updateStats();
  showToast(`LAP ${laps.length} — ${formatLapTime(lapTime)}`);
}

function recordSplit() {
  if (!running) return;
  const now = performance.now();
  const lapTime = now - lapStartTime;
  const totalTime = elapsed;

  laps.unshift({ num: laps.length + 1, lapTime, totalTime, type: 'split' });
  beep(660, 0.05);
  renderLaps();
  updateStats();
  showToast(`SPLIT MARKED — ${formatLapTime(totalTime)}`);
}

function updateStats() {
  const lapTimes = laps.map(l => l.lapTime);
  document.getElementById('lapCountStat').textContent = laps.length;
  document.getElementById('lapBadge').textContent = laps.length;

  if (laps.length > 0) {
    const best = Math.min(...lapTimes);
    const worst = Math.max(...lapTimes);
    document.getElementById('bestLapStat').textContent = formatLapTime(best);
    document.getElementById('worstLapStat').textContent = formatLapTime(worst);
  }
}

function renderLaps() {
  const container = document.getElementById('lapsContainer');
  document.getElementById('emptyState')?.remove();

  const lapTimes = laps.map(l => l.lapTime);
  const bestTime = Math.min(...lapTimes);
  const worstTime = Math.max(...lapTimes);

  container.innerHTML = '';

  laps.forEach((lap, idx) => {
    const isBest = lap.lapTime === bestTime && laps.length > 1;
    const isWorst = lap.lapTime === worstTime && laps.length > 1;

    const prevLap = laps[idx + 1];
    let deltaHtml = '<span class="lap-delta">—</span>';
    if (prevLap) {
      const delta = lap.lapTime - prevLap.lapTime;
      const sign = delta < 0 ? '−' : '+';
      const cls = delta < 0 ? 'faster' : 'slower';
      deltaHtml = `<span class="lap-delta ${cls}">${sign}${formatLapTime(Math.abs(delta))}</span>`;
    }

    const row = document.createElement('div');
    row.className = `lap-row${isBest ? ' best-lap' : ''}${isWorst ? ' worst-lap' : ''}`;
    row.innerHTML = `
      <div class="lap-num">${lap.type === 'split' ? 'S' : 'L'}${String(lap.num).padStart(2, '0')}</div>
      <div class="lap-time-cell">${formatLapTime(lap.lapTime)}</div>
      <div class="lap-split">${formatLapTime(lap.totalTime)}</div>
      ${deltaHtml}
      <div class="lap-badge${isBest ? ' best' : isWorst ? ' worst' : ''}"></div>
    `;
    container.appendChild(row);
  });
}

function clearLaps() {
  laps = [];
  lastLapTime = 0;
  document.getElementById('lapsContainer').innerHTML =
    '<div class="laps-empty" id="emptyState">NO LAPS RECORDED</div>';
  document.getElementById('lapCountStat').textContent = '—';
  document.getElementById('bestLapStat').textContent = '—';
  document.getElementById('worstLapStat').textContent = '—';
  document.getElementById('lapBadge').textContent = '0';
  beep(300, 0.06);
}

// ─── Theme & Sound ────────────────────────────────────────────────────────────

let lightMode = false;

function toggleTheme() {
  lightMode = !lightMode;
  if (lightMode) {
    document.documentElement.style.setProperty('--bg', '#f0f2f7');
    document.documentElement.style.setProperty('--surface', '#ffffff');
    document.documentElement.style.setProperty('--surface2', '#f5f7fb');
    document.documentElement.style.setProperty('--border', 'rgba(0,0,0,0.08)');
    document.documentElement.style.setProperty('--text', '#0d1117');
    document.documentElement.style.setProperty('--muted', '#8898aa');
  } else {
    document.documentElement.style.setProperty('--bg', '#080a0f');
    document.documentElement.style.setProperty('--surface', '#0d1117');
    document.documentElement.style.setProperty('--surface2', '#131820');
    document.documentElement.style.setProperty('--border', 'rgba(255,255,255,0.06)');
    document.documentElement.style.setProperty('--text', '#e8edf5');
    document.documentElement.style.setProperty('--muted', '#4a5568');
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById('soundLabel').textContent = soundEnabled ? 'Sound' : 'Muted';
  document.getElementById('soundIcon').style.opacity = soundEnabled ? '1' : '0.4';
  if (soundEnabled) beep(660, 0.05);
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ─── Keyboard Shortcuts ───────────────────────────────────────────────────────

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.code === 'Space') { e.preventDefault(); toggleTimer(); }
  if (e.key === 'l' || e.key === 'L') { if (running) recordLap(); }
  if (e.key === 'r' || e.key === 'R') { if (!running && elapsed > 0) resetTimer(); }
  if (e.key === 'm' || e.key === 'M') { if (running) recordSplit(); }
});
