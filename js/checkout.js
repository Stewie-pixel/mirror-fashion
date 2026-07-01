import { state, saveState } from './state.js';
import { switchScreen, renderBagBadge, showToast } from './ui.js';
import { byId, money } from './products.js';

export function openCheckout() {
  const total = state.bag.reduce((s, b) => s + byId(b.id).price * b.qty, 0);
  const el = document.getElementById('checkout-total');
  if (el) el.textContent = money(total);
  switchScreen('screen-checkout');
}

export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + '/' + digits.slice(2);
}

export function bindCheckoutForm() {
  const cardInput = document.getElementById('checkout-card');
  const expiryInput = document.getElementById('checkout-expiry');
  const cvvInput = document.getElementById('checkout-cvv');
  const payBtn = document.getElementById('btn-pay-now');
  const backBtn = document.getElementById('btn-checkout-back');

  cardInput?.addEventListener('input', () => {
    cardInput.value = formatCardNumber(cardInput.value);
  });
  expiryInput?.addEventListener('input', () => {
    expiryInput.value = formatExpiry(expiryInput.value);
  });
  cvvInput?.addEventListener('input', () => {
    cvvInput.value = cvvInput.value.replace(/\D/g, '').slice(0, 3);
  });

  backBtn?.addEventListener('click', () => switchScreen('screen-bag'));

  payBtn?.addEventListener('click', async () => {
    const name = document.getElementById('checkout-name')?.value.trim();
    const card = cardInput?.value.replace(/\s/g, '');
    const expiry = expiryInput?.value.trim();
    const cvv = cvvInput?.value.trim();

    if (!name || !card || card.length < 16 || !expiry || expiry.length < 5 || !cvv || cvv.length < 3) {
      showToast('Please fill in all payment details');
      return;
    }

    payBtn.disabled = true;
    payBtn.textContent = 'Processing…';
    await new Promise((r) => setTimeout(r, 1500));

    state.bag = [];
    saveState();
    renderBagBadge();

    payBtn.disabled = false;
    payBtn.textContent = 'Pay now';
    document.getElementById('checkout-form')?.reset();
    switchScreen('screen-success');
  });
}
