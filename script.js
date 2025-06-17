// Product Data (adapted from original script.js)
const products = [
  { id: 'p1', name: 'Liquid Glass Mug', price: 15.99, qty: 0, img: 'https://via.placeholder.com/300x200?text=Glass+Mug' },
  { id: 'p2', name: 'Neumorphic Lamp', price: 34.50, qty: 0, img: 'https://via.placeholder.com/300x200?text=Lamp' },
  { id: 'p3', name: 'AR Book Viewer', price: 9.99, qty: 0, img: 'https://via.placeholder.com/300x200?text=AR+Book' },
  { id: 'p4', name: 'Ergo Mouse Pad', price: 12.00, qty: 0, img: 'https://via.placeholder.com/300x200?text=Mouse+Pad' },
  { id: 'p5', name: 'Ambient LED Strip', price: 22.75, qty: 0, img: 'https://via.placeholder.com/300x200?text=LED+Strip' },
];

let currentIndex = 0;

// DOM Elements
const orderList = document.getElementById('orderList');
const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const totalEl = document.getElementById('total');
const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');

// Single Product View DOM Elements
const currentProductImgEl = document.getElementById('currentProductImg');
const currentProductNameEl = document.getElementById('currentProductName');
const currentProductPriceEl = document.getElementById('currentProductPrice');
const singleViewProductQtyEl = document.getElementById('singleViewProductQty');
const singleViewAddBtn = document.getElementById('singleViewAddBtn');
const singleViewRemoveBtn = document.getElementById('singleViewRemoveBtn');

// Language specific text (translations object remains the same)
const translations = {
  en: {
    appTitle: 'Order App',
    summaryTitle: 'Order List',
    payButton: 'PAY',
    subtotalLabel: 'Subtotal',
    vatLabel: 'VAT',
    totalLabel: 'Total',
    emptyItem: '&nbsp;', // Changed from '(empty)'
    qtyLabel: 'Qty', // This might be used if we add a static "Qty" label
    orderAlert: '✅ Order submitted (simulated). Thank you!'
  },
  es: {
    appTitle: 'Aplicación de Pedido',
    summaryTitle: 'Lista de Pedido',
    payButton: 'PAGAR',
    subtotalLabel: 'Subtotal',
    vatLabel: 'IVA',
    totalLabel: 'Total',
    emptyItem: '&nbsp;', // Changed from '(vacío)'
    qtyLabel: 'Cant',
    orderAlert: '✅ Pedido enviado (simulado). ¡Gracias!'
  }
};
let currentLang = 'en';

// Render Current Product in Single View
function renderCurrentProductView() {
  if (products.length === 0) {
    // Handle case with no products (e.g., clear display or show a message)
    currentProductImgEl.src = '';
    currentProductImgEl.alt = 'No product available';
    currentProductNameEl.textContent = 'N/A';
    currentProductPriceEl.textContent = '$0.00';
    singleViewProductQtyEl.textContent = '0';
    singleViewAddBtn.setAttribute('aria-label', `Add one item`);
    singleViewRemoveBtn.setAttribute('aria-label', `Remove one item`);
    updateSummary(); // Still update summary to show empty totals
    return;
  }
  const product = products[currentIndex];
  currentProductImgEl.src = product.img;
  currentProductImgEl.alt = product.name;
  currentProductNameEl.textContent = product.name;
  currentProductPriceEl.textContent = `$${product.price.toFixed(2)}`;
  singleViewProductQtyEl.textContent = product.qty;

  // Update aria-labels for controls
  singleViewAddBtn.setAttribute('aria-label', `Add one ${product.name}`);
  singleViewRemoveBtn.setAttribute('aria-label', `Remove one ${product.name}`);

  updateSummary();
}

// Navigate Products (for arrow buttons)
function navigateProduct(direction) {
  if (products.length === 0) return;
  currentIndex = (currentIndex + direction + products.length) % products.length;
  renderCurrentProductView();
}

// Update Product Quantity (for +/- buttons in single view)
function updateQty(change) {
  if (products.length === 0) return; // Should not happen if buttons are disabled/hidden for no products
  products[currentIndex].qty = Math.max(0, products[currentIndex].qty + change);
  singleViewProductQtyEl.textContent = products[currentIndex].qty;
  updateSummary();
}

// Update Order Summary (modified emptyItem handling in previous step)
function updateSummary() {
  orderList.innerHTML = '';
  let subtotal = 0;
  const vatRate = 0.12;

  const activeProducts = products.filter(p => p.qty > 0);

  for (let i = 0; i < 5; i++) {
    const li = document.createElement('li');
    if (activeProducts[i]) {
      const p = activeProducts[i];
      const totalItemPrice = p.qty * p.price;
      subtotal += totalItemPrice;
      li.innerHTML = `<span>${p.name} x ${p.qty}</span><span>$${totalItemPrice.toFixed(2)}</span>`;
    } else {
      li.innerHTML = `<span>${translations[currentLang].emptyItem}</span><span></span>`; // Use translated empty item
    }
    orderList.appendChild(li);
  }

  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal + vatAmount;

  subtotalEl.textContent = subtotal.toFixed(2);
  vatEl.textContent = vatAmount.toFixed(2);
  totalEl.textContent = totalAmount.toFixed(2);
}

// Modal Functions (openModal, closeModal remain the same)
function openModal(imageSrc) {
  modalImage.src = imageSrc;
  modalOverlay.classList.add('active');
}

function closeModal() {
  modalOverlay.classList.remove('active');
}

// Language Toggle
function toggleLang() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  const langBtn = document.getElementById('langBtn');
  langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN';
  applyTranslations();
  renderCurrentProductView();
  // updateSummary(); // updateSummary is called by renderCurrentProductView
}

function applyTranslations() {
  document.getElementById('appTitle').textContent = translations[currentLang].appTitle;
  document.getElementById('summaryTitle').textContent = translations[currentLang].summaryTitle;
  document.getElementById('submitBtn').textContent = translations[currentLang].payButton;
  document.getElementById('subtotalLabel').textContent = translations[currentLang].subtotalLabel;
  document.getElementById('vatLabel').textContent = translations[currentLang].vatLabel;
  document.getElementById('totalLabel').textContent = translations[currentLang].totalLabel;
  // If product names/descriptions were translatable, they would be updated in renderCurrentProductView
  // via its call in toggleLang().
  // Also update the emptyItem text in the summary by calling updateSummary directly if it's not covered
  // Forcing re-render of summary items.
  updateSummary();
}

// Submit Order (submitOrder remains the same)
function submitOrder() {
  const orderData = products.filter(p => p.qty > 0);
  if (orderData.length === 0) {
    alert(currentLang === 'en' ? 'Your order is empty.' : 'Tu pedido está vacío.');
    return;
  }
  console.log("Order submitted:", orderData);
  alert(translations[currentLang].orderAlert);
}

// Event Listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// Event listeners for single view quantity buttons
// These need to be after the DOM elements are declared.
// If script is in <head>, wrap in DOMContentLoaded or ensure buttons exist.
// Assuming buttons exist as per HTML structure.
if (singleViewAddBtn && singleViewRemoveBtn) {
    singleViewAddBtn.addEventListener('click', () => updateQty(1));
    singleViewRemoveBtn.addEventListener('click', () => updateQty(-1));
}


// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  renderCurrentProductView();
  // updateSummary(); // updateSummary is called by renderCurrentProductView

  // Re-assign event listeners inside DOMContentLoaded if elements might not be ready globally
  // This is a robust way, though for this specific setup, it might be redundant if script is at body end.
  if (!singleViewAddBtn.onclick) { // Check if listeners were already attached (e.g. if script ran twice)
    singleViewAddBtn.addEventListener('click', () => updateQty(1));
    singleViewRemoveBtn.addEventListener('click', () => updateQty(-1));
  }
});
