import {
  PRODUCTS, CATEGORIES, COLORS, SIZES, TRENDING_IDS,
  byId, toneClass, money, productMediaHtml,
} from './products.js';
import { state, saveState, setUserPhoto } from './state.js';
import { generatePreview, animateGauge } from './tryon.js';

export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => Array.from(document.querySelectorAll(sel));

export function showToast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._tid);
  showToast._tid = setTimeout(() => t.classList.remove('show'), 1800);
}

export function switchScreen(id) {
  $$('.screen').forEach((s) => s.classList.remove('active'));
  $('#' + id).classList.add('active');
  $('#' + id).scrollTop = 0;
  const navKeyMap = {
    'screen-home': 'home',
    'screen-saved': 'saved',
    'screen-bag': 'bag',
    'screen-profile': 'profile',
  };
  const key = navKeyMap[id];
  $$('.nav-btn').forEach((b) => b.classList.toggle('active', key && b.dataset.key === key));
  state.lastScreen = id;
}

export function productCard(p, opts = {}) {
  const showMatch = opts.match;
  const saved = state.saved.has(p.id);
  return `
  <div class="pcard" data-id="${p.id}">
    <div class="pcard-media ${toneClass(p)}">
      ${showMatch ? `<span class="match-badge">
        <svg viewBox="0 0 24 24" fill="currentColor" width="9" height="9"><path d="M12 2l1.6 5.5L19 9l-5.4 1.5L12 16l-1.6-5.5L5 9l5.4-1.5z"/></svg>
        ${p.match}% match</span>` : ''}
      <button class="heart-btn ${saved ? 'saved' : ''}" data-heart="${p.id}" aria-label="Save">
        <svg viewBox="0 0 24 24" fill="${saved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.35-9.5-8.8C.5 8.5 2.3 5 6 5c2 0 3.5 1.2 4 2.4C10.5 6.2 12 5 14 5c3.7 0 5.5 3.5 3.5 7.2C19 16.65 12 21 12 21z"/></svg>
      </button>
      ${productMediaHtml(p)}
    </div>
    <div class="pcard-info">
      <div class="pname">${p.name}</div>
      <div class="pcat">${p.cat}</div>
      <div class="pprice">${money(p.price)}</div>
    </div>
  </div>`;
}

export function renderChips() {
  $('#chip-row').innerHTML = CATEGORIES.map((c) =>
    `<button class="chip ${c === state.activeCategory ? 'active' : ''}" data-cat="${c}">${c}</button>`,
  ).join('');
}

export function renderTrending() {
  $('#trend-scroll').innerHTML = TRENDING_IDS.map((id) => {
    const p = byId(id);
    return `<div class="trend-card">${productCard(p)}</div>`;
  }).join('');
}

export function renderCurated() {
  const list = PRODUCTS.filter((p) => state.activeCategory === 'All' || p.cat === state.activeCategory);
  const grid = $('#curated-grid');
  grid.classList.add('stagger');
  grid.innerHTML = list.map((p) => `<div class="grid-card">${productCard(p)}</div>`).join('') ||
    '<p style="grid-column:1/-1;color:var(--ink-soft);font-size:var(--text-sm);padding:1rem 0;">No pieces in this category yet.</p>';
}

export function renderSaved() {
  const list = PRODUCTS.filter((p) => state.saved.has(p.id));
  $('#saved-grid').innerHTML = list.map((p) => `<div class="grid-card">${productCard(p)}</div>`).join('');
  $('#saved-empty').classList.toggle('hidden', list.length > 0);
  $('#stat-saved').textContent = state.saved.size;
  const badge = $('#badge-saved');
  badge.textContent = state.saved.size;
  badge.classList.toggle('hidden', state.saved.size === 0);
}

export function renderResults() {
  const shuffled = [...PRODUCTS].sort((a, b) => b.match - a.match).slice(0, 6);
  $('#results-grid').innerHTML = shuffled.map((p) => `<div class="grid-card">${productCard(p, { match: true })}</div>`).join('');
}

export function openProduct(id, fromScreen) {
  const p = byId(id);
  state.currentProduct = p;
  state.currentSize = 'M';
  state.currentColorIdx = 0;
  $('#pd-media').className = 'pd-media ' + toneClass(p);
  $('#pd-media').innerHTML = productMediaHtml(p);
  $('#pd-name').textContent = p.name;
  $('#pd-cat').textContent = p.cat;
  $('#pd-price').textContent = money(p.price);
  $('#pd-desc').textContent = p.desc;
  $('#pd-swatches').innerHTML = COLORS.map((c, i) =>
    `<span class="swatch ${i === 0 ? 'active' : ''}" data-color="${i}" style="background:${c}"></span>`,
  ).join('');
  $('#pd-sizes').innerHTML = SIZES.map((s) =>
    `<span class="size-chip ${s === 'M' ? 'active' : ''}" data-size="${s}">${s}</span>`,
  ).join('');
  const heartBtn = $('#btn-product-heart');
  heartBtn.classList.toggle('saved', state.saved.has(p.id));
  heartBtn.querySelector('svg').setAttribute('fill', state.saved.has(p.id) ? 'currentColor' : 'none');
  const tryBtn = $('#btn-try-on');
  if (p.tryOn) {
    tryBtn.disabled = false;
    tryBtn.title = '';
  } else {
    tryBtn.disabled = true;
    tryBtn.title = 'Virtual try-on available for select pieces';
  }
  $('#screen-product').dataset.from = fromScreen || 'screen-home';
  switchScreen('screen-product');
}

function setTryonLoading(loading) {
  const stage = $('#tryon-stage');
  let overlay = stage.querySelector('.tryon-loading');
  if (loading) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'tryon-loading';
      overlay.innerHTML = '<div class="tryon-spinner"></div><span>Creating your preview… this may take 20–30 seconds</span>';
      stage.appendChild(overlay);
    }
    overlay.classList.remove('hidden');
  } else if (overlay) {
    overlay.classList.add('hidden');
  }
}

function resetTryonStage() {
  const stage = $('#tryon-stage');
  stage.querySelectorAll('.tryon-result, .tryon-loading').forEach((el) => el.remove());
  $('#tryon-silhouette').classList.remove('hidden');
  $('#tryon-overlay').classList.remove('show');
  $('#tryon-overlay').innerHTML = '';
}

function showTryonResult(dataUrl) {
  const stage = $('#tryon-stage');
  resetTryonStage();
  $('#tryon-silhouette').classList.add('hidden');
  let img = stage.querySelector('.tryon-result');
  if (!img) {
    img = document.createElement('img');
    img.className = 'tryon-result';
    img.alt = 'Virtual try-on preview';
    stage.insertBefore(img, stage.firstChild);
  }
  img.src = dataUrl;
  state.tryonPreview = dataUrl;
}

export async function openTryOn() {
  const p = state.currentProduct;
  if (!p) return;
  if (!p.tryOn) {
    showToast('Virtual try-on available for select pieces');
    return;
  }
  if (!state.userPhoto) {
    showToast('Upload your photo first');
    $('#file-input').dataset.mode = 'tryon';
    $('#file-input').click();
    return;
  }

  $('#tryon-chip-label').textContent = p.name;
  switchScreen('screen-tryon');
  resetTryonStage();
  setTryonLoading(true);

  try {
    const result = await generatePreview(state.userPhoto, p.image, p);
    showTryonResult(result.compositeDataUrl);

    const ease = p.match >= 90 ? 'runs true to size' : 'fits with slight ease';
    $('#fit-size-copy').textContent = `Recommended size ${state.currentSize} — ${ease}`;
    $('#fit-tag').textContent = result.fitTag;
    animateGauge(result.fitScore);

    state.tryonCount++;
    $('#stat-tryons').textContent = state.tryonCount;
    saveState();
    showToast('Preview ready — see how it fits');
  } catch (err) {
    console.error(err);
    showToast('Could not generate preview — try another photo');
    resetTryonStage();
  } finally {
    setTryonLoading(false);
  }
}

export function addToBag(p, size) {
  const existing = state.bag.find((b) => b.id === p.id && b.size === size);
  if (existing) existing.qty++;
  else state.bag.push({ id: p.id, size, qty: 1 });
  saveState();
  renderBagBadge();
  showToast(`Added "${p.name}" to your bag`);
}

export function renderBagBadge() {
  const count = state.bag.reduce((s, b) => s + b.qty, 0);
  const badge = $('#badge-bag');
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}

export function renderBag() {
  const list = $('#bag-list');
  if (state.bag.length === 0) {
    list.innerHTML = '';
    $('#bag-empty').classList.remove('hidden');
    $('#bag-summary').classList.add('hidden');
    return;
  }
  $('#bag-empty').classList.add('hidden');
  $('#bag-summary').classList.remove('hidden');
  list.innerHTML = state.bag.map((b, i) => {
    const p = byId(b.id);
    return `
    <div class="bag-item">
      <div class="bag-thumb ${toneClass(p)}">${productMediaHtml(p)}</div>
      <div class="bag-info">
        <div class="bag-name">${p.name}</div>
        <div class="bag-meta">Size ${b.size} · ${money(p.price)}</div>
        <div class="bag-row-bottom">
          <div class="qty-control">
            <button data-qty="-1" data-idx="${i}">−</button>
            <span>${b.qty}</span>
            <button data-qty="1" data-idx="${i}">+</button>
          </div>
          <button class="remove-btn" data-remove="${i}">Remove</button>
        </div>
      </div>
    </div>`;
  }).join('');
  const subtotal = state.bag.reduce((s, b) => s + byId(b.id).price * b.qty, 0);
  $('#bag-subtotal').textContent = money(subtotal);
  $('#bag-total').textContent = money(subtotal);
}

export function resetScan() {
  const frame = $('#scan-frame');
  frame.classList.remove('scanning');
  $('#scan-img').classList.add('hidden');
  $('#scan-img').removeAttribute('src');
  frame.querySelector('.placeholder-icon').classList.remove('hidden');
  $('#scan-title').textContent = 'Upload a photo to begin';
  $('#scan-sub').textContent = 'Full-length shots against a plain background work best.';
  $('#progress-track').classList.add('hidden');
  $('#progress-fill').style.width = '0%';
  $('#upload-choices').classList.remove('hidden');
}

export function runScan(imgSrc) {
  setUserPhoto(imgSrc);
  const frame = $('#scan-frame');
  const img = $('#scan-img');
  img.src = imgSrc;
  img.classList.remove('hidden');
  frame.querySelector('.placeholder-icon').classList.add('hidden');
  frame.classList.add('scanning');
  $('#upload-choices').classList.add('hidden');
  $('#scan-title').textContent = 'Analyzing your photo…';
  $('#scan-sub').textContent = 'Matching shape, texture and tone against the catalogue.';
  const track = $('#progress-track');
  track.classList.remove('hidden');
  const fill = $('#progress-fill');
  let pct = 0;
  clearInterval(runScan._t);
  runScan._t = setInterval(() => {
    pct += Math.random() * 14 + 6;
    if (pct >= 100) {
      pct = 100;
      clearInterval(runScan._t);
      fill.style.width = pct + '%';
      $('#scan-title').textContent = 'Matches found';
      $('#scan-sub').textContent = 'Here are the closest pieces from the catalogue.';
      setTimeout(() => {
        renderResults();
        switchScreen('screen-results');
        resetScan();
      }, 450);
      return;
    }
    fill.style.width = pct + '%';
  }, 160);
}

export function handlePhotoUpload(dataUrl, mode) {
  setUserPhoto(dataUrl);
  if (mode === 'scan') {
    runScan(dataUrl);
  } else if (mode === 'tryon') {
    showToast('Photo saved — tap Try It On to preview');
    if (state.currentProduct?.tryOn) openTryOn();
  }
}

