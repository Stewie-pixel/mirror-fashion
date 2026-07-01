import { loadState, state, saveState } from './state.js';
import {
  $, $$, showToast, switchScreen,
  renderChips, renderTrending, renderCurated, renderSaved, renderResults,
  openProduct, openTryOn, addToBag, renderBagBadge, renderBag,
  resetScan, handlePhotoUpload,
} from './ui.js';
import { bindCheckoutForm, openCheckout } from './checkout.js';

function bindEvents() {
  document.addEventListener('click', (e) => {
    const navBtn = e.target.closest('.nav-btn[data-nav]');
    if (navBtn) {
      if (navBtn.dataset.nav === 'screen-saved') renderSaved();
      if (navBtn.dataset.nav === 'screen-bag') renderBag();
      switchScreen(navBtn.dataset.nav);
      return;
    }

    if (e.target.closest('#btn-nav-camera')) {
      resetScan();
      switchScreen('screen-scan');
      return;
    }

    if (e.target.closest('#btn-open-camera-search') || e.target.closest('#btn-ai-banner')) {
      resetScan();
      switchScreen('screen-scan');
      return;
    }

    if (e.target.closest('#btn-profile-avatar')) {
      switchScreen('screen-profile');
      return;
    }

    if (e.target.closest('#btn-trend-seeall')) {
      renderResults();
      switchScreen('screen-results');
      return;
    }

    const back = e.target.closest('[data-back]');
    if (back) {
      switchScreen(back.dataset.back);
      return;
    }

    if (e.target.closest('#btn-product-back')) {
      switchScreen($('#screen-product').dataset.from || 'screen-home');
      return;
    }
    if (e.target.closest('#btn-tryon-back')) {
      switchScreen('screen-product');
      return;
    }

    const chip = e.target.closest('.chip[data-cat]');
    if (chip) {
      state.activeCategory = chip.dataset.cat;
      renderChips();
      renderCurated();
      return;
    }

    const heart = e.target.closest('[data-heart]');
    if (heart) {
      e.stopPropagation();
      const id = heart.dataset.heart;
      if (state.saved.has(id)) state.saved.delete(id);
      else {
        state.saved.add(id);
        showToast('Saved to your wishlist');
      }
      saveState();
      heart.classList.toggle('saved');
      heart.querySelector('svg').setAttribute('fill', state.saved.has(id) ? 'currentColor' : 'none');
      renderSaved();
      return;
    }

    const card = e.target.closest('.pcard[data-id]');
    if (card) {
      openProduct(card.dataset.id, state.lastScreen);
      return;
    }

    if (e.target.closest('#btn-product-heart')) {
      const p = state.currentProduct;
      const btn = $('#btn-product-heart');
      if (state.saved.has(p.id)) state.saved.delete(p.id);
      else {
        state.saved.add(p.id);
        showToast('Saved to your wishlist');
      }
      saveState();
      btn.classList.toggle('saved');
      btn.querySelector('svg').setAttribute('fill', state.saved.has(p.id) ? 'currentColor' : 'none');
      renderSaved();
      return;
    }

    const sw = e.target.closest('.swatch[data-color]');
    if (sw) {
      $$('.swatch').forEach((s) => s.classList.remove('active'));
      sw.classList.add('active');
      return;
    }

    const sz = e.target.closest('.size-chip[data-size]');
    if (sz) {
      $$('.size-chip').forEach((s) => s.classList.remove('active'));
      sz.classList.add('active');
      state.currentSize = sz.dataset.size;
      return;
    }

    if (e.target.closest('#btn-add-bag')) {
      addToBag(state.currentProduct, state.currentSize);
      return;
    }

    if (e.target.closest('#btn-try-on')) {
      if (state.currentProduct?.tryOn) openTryOn();
      else showToast('Virtual try-on available for select pieces');
      return;
    }

    if (e.target.closest('#btn-tryon-addbag')) {
      addToBag(state.currentProduct, state.currentSize);
      return;
    }

    if (e.target.closest('#btn-try-another')) {
      switchScreen('screen-product');
      return;
    }

    if (e.target.closest('#btn-tryon-upload')) {
      $('#file-input').dataset.mode = 'tryon';
      $('#file-input').click();
      return;
    }

    if (e.target.closest('#btn-take-photo') || e.target.closest('#btn-choose-photo')) {
      $('#file-input').dataset.mode = 'scan';
      $('#file-input').click();
      return;
    }

    const qtyBtn = e.target.closest('[data-qty]');
    if (qtyBtn) {
      const idx = +qtyBtn.dataset.idx;
      const delta = +qtyBtn.dataset.qty;
      state.bag[idx].qty += delta;
      if (state.bag[idx].qty <= 0) state.bag.splice(idx, 1);
      saveState();
      renderBag();
      renderBagBadge();
      return;
    }

    const rmBtn = e.target.closest('[data-remove]');
    if (rmBtn) {
      state.bag.splice(+rmBtn.dataset.remove, 1);
      saveState();
      renderBag();
      renderBagBadge();
      return;
    }

    if (e.target.closest('#btn-checkout')) {
      openCheckout();
      return;
    }

    if (e.target.closest('#btn-continue-shopping')) {
      switchScreen('screen-home');
      return;
    }
  });

  $('#file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const mode = e.target.dataset.mode;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => handlePhotoUpload(ev.target.result, mode);
    reader.readAsDataURL(file);
    e.target.value = '';
  });
}

function init() {
  loadState();
  renderChips();
  renderTrending();
  renderCurated();
  renderBagBadge();
  renderSaved();
  $('#stat-tryons').textContent = state.tryonCount;
  bindEvents();
  bindCheckoutForm();
}

init();
