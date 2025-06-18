// Product Data
const products = [
  { id: 'p1', name: 'Liquid Glass Mug', price: 15.99, qty: 0, img: 'https://via.placeholder.com/300x200?text=Glass+Mug' },
  { id: 'p2', name: 'Neumorphic Lamp', price: 34.50, qty: 0, img: 'https://via.placeholder.com/300x200?text=Lamp' },
  { id: 'p3', name: 'AR Book Viewer', price: 9.99, qty: 0, img: '' },
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
const productImagePlaceholderEl = document.getElementById('productImagePlaceholder');
const currentProductNameEl = document.getElementById('currentProductName');
const currentProductPriceEl = document.getElementById('currentProductPrice');
const singleViewProductQtyEl = document.getElementById('singleViewProductQty');
const singleViewAddBtn = document.getElementById('singleViewAddBtn');
const singleViewRemoveBtn = document.getElementById('singleViewRemoveBtn');

// Delivery Toggle DOM Elements
const deliveryYesBtn = document.getElementById('deliveryYesBtn');
const deliveryNoBtn = document.getElementById('deliveryNoBtn');

// Language Strings
const translations = {
  en: {
    appTitle: 'Order App',
    summaryTitle: 'Order Items',
    payButton: 'PAY',
    subtotalLabel: 'Subtotal',
    vatLabel: 'VAT',
    totalLabel: 'Total',
    emptyItem: '&nbsp;',
    qtyLabel: 'Qty',
    orderAlert: '✅ Order submitted (simulated). Thank you!',
    deliveryLabel: "Includes Delivery",
  },
  es: {
    appTitle: 'Aplicación de Pedido',
    summaryTitle: 'Artículos del Pedido',
    payButton: 'PAGAR',
    subtotalLabel: 'Subtotal',
    vatLabel: 'IVA',
    totalLabel: 'Total',
    emptyItem: '&nbsp;',
    qtyLabel: 'Cant',
    orderAlert: '✅ Pedido enviado (simulado). ¡Gracias!',
    deliveryLabel: "Incluye Envío",
  }
};
let currentLang = 'en';

// Product Renderer
function renderCurrentProductView() {
  if (products.length === 0) {
    currentProductImgEl.style.display = 'none';
    productImagePlaceholderEl.style.display = 'flex';
    productImagePlaceholderEl.textContent = 'No Products Loaded';
    currentProductNameEl.textContent = 'N/A';
    currentProductPriceEl.textContent = '$0.00';
    singleViewProductQtyEl.textContent = '0';
    singleViewAddBtn.setAttribute('aria-label', `Add one item`);
    singleViewRemoveBtn.setAttribute('aria-label', `Remove one item`);
    updateSummary();
    return;
  }

  const product = products[currentIndex];
  if (product.img && product.img.trim() !== '') {
    currentProductImgEl.src = product.img;
    currentProductImgEl.alt = product.name;
    currentProductImgEl.style.display = 'block';
    productImagePlaceholderEl.style.display = 'none';
  } else {
    currentProductImgEl.style.display = 'none';
    productImagePlaceholderEl.style.display = 'flex';
    productImagePlaceholderEl.textContent = 'No Image Available';
  }

  currentProductNameEl.textContent = product.name;
  currentProductPriceEl.textContent = `$${product.price.toFixed(2)}`;
  singleViewProductQtyEl.textContent = product.qty;
  singleViewAddBtn.setAttribute('aria-label', `Add one ${product.name}`);
  singleViewRemoveBtn.setAttribute('aria-label', `Remove one ${product.name}`);
  updateSummary();
}

// Navigation
function navigateProduct(direction) {
  if (products.length === 0) return;
  currentIndex = (currentIndex + direction + products.length) % products.length;
  renderCurrentProductView();
}

// Quantity Updater
function updateQty(change) {
  if (products.length === 0) return;
  products[currentIndex].qty = Math.max(0, products[currentIndex].qty + change);
  singleViewProductQtyEl.textContent = products[currentIndex].qty;
  updateSummary();
}

// Summary Renderer
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
      li.innerHTML = `<span>${translations[currentLang].emptyItem}</span><span></span>`;
    }
    orderList.appendChild(li);
  }
  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal + vatAmount;

  subtotalEl.textContent = subtotal.toFixed(2);
  vatEl.textContent = vatAmount.toFixed(2);
  totalEl.textContent = totalAmount.toFixed(2);
}

// Modal Viewer
function openModal(imageSrc) {
  if (!imageSrc || imageSrc.endsWith('No%20Image%20Available')) {
    console.log("No image to zoom or placeholder is shown.");
    return;
  }
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
}

// Text/Label Translator
function applyTranslations() {
  document.getElementById('appTitle').textContent = translations[currentLang].appTitle;
  document.getElementById('summaryTitle').textContent = translations[currentLang].summaryTitle;
  document.getElementById('submitBtn').textContent = translations[currentLang].payButton;
  document.getElementById('subtotalLabel').textContent = translations[currentLang].subtotalLabel;
  document.getElementById('vatLabel').textContent = translations[currentLang].vatLabel;
  document.getElementById('totalLabel').textContent = translations[currentLang].totalLabel;
  document.getElementById('deliveryLabel').textContent = translations[currentLang].deliveryLabel;
  updateSummary();
}

// Submit Order
function submitOrder() {
  const orderData = products.filter(p => p.qty > 0);
  if (orderData.length === 0) {
    alert(currentLang === 'en' ? 'Your order is empty.' : 'Tu pedido está vacío.');
    return;
  }
  console.log("Order submitted:", orderData);
  alert(translations[currentLang].orderAlert);
}

// Key Events
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  if (singleViewAddBtn && singleViewRemoveBtn) {
    singleViewAddBtn.addEventListener('click', () => updateQty(1));
    singleViewRemoveBtn.addEventListener('click', () => updateQty(-1));
  }

  if (deliveryYesBtn && deliveryNoBtn) {
    deliveryYesBtn.addEventListener('click', () => {
      if (!deliveryYesBtn.classList.contains('active')) {
        deliveryYesBtn.classList.add('active');
        deliveryYesBtn.setAttribute('aria-pressed', 'true');
        deliveryNoBtn.classList.remove('active');
        deliveryNoBtn.setAttribute('aria-pressed', 'false');
      }
    });

    deliveryNoBtn.addEventListener('click', () => {
      if (!deliveryNoBtn.classList.contains('active')) {
        deliveryNoBtn.classList.add('active');
        deliveryNoBtn.setAttribute('aria-pressed', 'true');
        deliveryYesBtn.classList.remove('active');
        deliveryYesBtn.setAttribute('aria-pressed', 'false');
      }
    });
  }

  applyTranslations();
  renderCurrentProductView();
});