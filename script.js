// Product Data (adapted from original script.js)
const products = [
  { id: 'p1', name: 'Liquid Glass Mug', price: 15.99, qty: 0, img: 'https://via.placeholder.com/300x200?text=Glass+Mug' },
  { id: 'p2', name: 'Neumorphic Lamp', price: 34.50, qty: 0, img: 'https://via.placeholder.com/300x200?text=Lamp' },
  { id: 'p3', name: 'AR Book Viewer', price: 9.99, qty: 0, img: 'https://via.placeholder.com/300x200?text=AR+Book' },
  { id: 'p4', name: 'Ergo Mouse Pad', price: 12.00, qty: 0, img: 'https://via.placeholder.com/300x200?text=Mouse+Pad' },
  { id: 'p5', name: 'Ambient LED Strip', price: 22.75, qty: 0, img: 'https://via.placeholder.com/300x200?text=LED+Strip' },
];

// DOM Elements
const productGrid = document.getElementById('productGrid');
const orderList = document.getElementById('orderList');
const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const totalEl = document.getElementById('total');
const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');

// Language specific text
const translations = {
  en: {
    appTitle: 'Order App',
    summaryTitle: 'Order List',
    payButton: 'PAY',
    subtotalLabel: 'Subtotal',
    vatLabel: 'VAT',
    totalLabel: 'Total',
    emptyItem: '(empty)',
    qtyLabel: 'Qty',
    orderAlert: '✅ Order submitted (simulated). Thank you!'
  },
  es: {
    appTitle: 'Aplicación de Pedido',
    summaryTitle: 'Lista de Pedido',
    payButton: 'PAGAR',
    subtotalLabel: 'Subtotal',
    vatLabel: 'IVA',
    totalLabel: 'Total',
    emptyItem: '(vacío)',
    qtyLabel: 'Cant',
    orderAlert: '✅ Pedido enviado (simulado). ¡Gracias!'
  }
};
let currentLang = 'en'; // Default language

// Render Products into Carousel
function renderProducts() {
  productGrid.innerHTML = ''; // Clear existing products
  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" onclick="openModal('${product.img}')" />
      <div class="product-name">${product.name}</div>
      <div class="product-price">$${product.price.toFixed(2)}</div>
      <div class="product-controls">
        <button class="btn-remove" onclick="updateQty(${index}, -1)" aria-label="Remove one ${product.name}">-</button>
        <span class="product-qty-display" id="qty-${product.id}">${product.qty}</span>
        <button class="btn-add" onclick="updateQty(${index}, 1)" aria-label="Add one ${product.name}">+</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
  updateSummary(); // Update summary whenever products are re-rendered
}

// Update Product Quantity
function updateQty(index, change) {
  products[index].qty = Math.max(0, products[index].qty + change);
  // Update only the specific product's quantity display for efficiency
  const qtyDisplay = document.getElementById(`qty-${products[index].id}`);
  if (qtyDisplay) {
    qtyDisplay.textContent = products[index].qty;
  }
  // If not found (e.g. during initial full renderProducts), renderProducts will handle it.
  // For robustness, especially if cards were dynamically added/removed, a full renderProducts() might be safer
  // but for just qty change, updating the span is more performant.
  // Let's stick to re-rendering the specific span and then always update summary.
  updateSummary();
}

// Update Order Summary
function updateSummary() {
  orderList.innerHTML = ''; // Clear existing items
  let subtotal = 0;
  const vatRate = 0.12; // 12% VAT

  const activeProducts = products.filter(p => p.qty > 0);

  for (let i = 0; i < 5; i++) { // Display up to 5 lines in summary as per sample
    const li = document.createElement('li');
    if (activeProducts[i]) {
      const p = activeProducts[i];
      const totalItemPrice = p.qty * p.price;
      subtotal += totalItemPrice;
      li.innerHTML = `<span>${p.name} x ${p.qty}</span><span>$${totalItemPrice.toFixed(2)}</span>`;
    } else {
      // Empty slot styling (could be more subtle or use a placeholder class)
      li.innerHTML = `<span style="color:#aaa;">${translations[currentLang].emptyItem}</span><span></span>`;
    }
    orderList.appendChild(li);
  }

  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal + vatAmount;

  subtotalEl.textContent = subtotal.toFixed(2);
  vatEl.textContent = vatAmount.toFixed(2);
  totalEl.textContent = totalAmount.toFixed(2);
}

// Carousel Scrolling
function scrollCarousel(direction) {
  const scrollAmount = productGrid.clientWidth * 0.8; // Scroll by 80% of visible width
  productGrid.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// Modal Functions
function openModal(imageSrc) {
  modalImage.src = imageSrc;
  modalOverlay.classList.add('active'); // Use class to trigger CSS opacity transition
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
  renderProducts(); // Re-render products in case names/labels need translation (not in this data set, but good practice)
  updateSummary(); // Re-render summary for "(empty)" text
}

function applyTranslations() {
  document.getElementById('appTitle').textContent = translations[currentLang].appTitle;
  document.getElementById('summaryTitle').textContent = translations[currentLang].summaryTitle;
  document.getElementById('submitBtn').textContent = translations[currentLang].payButton;
  document.getElementById('subtotalLabel').textContent = translations[currentLang].subtotalLabel;
  document.getElementById('vatLabel').textContent = translations[currentLang].vatLabel;
  document.getElementById('totalLabel').textContent = translations[currentLang].totalLabel;
  // Note: Product names and descriptions themselves are not translated in this example
  // but if they were, renderProducts() would need to handle that.
}

// Submit Order
function submitOrder() {
  // In a real app, this would send data to a server.
  // For now, just an alert, using translated text.
  const orderData = products.filter(p => p.qty > 0);
  if (orderData.length === 0) {
    alert(currentLang === 'en' ? 'Your order is empty.' : 'Tu pedido está vacío.');
    return;
  }
  console.log("Order submitted:", orderData);
  alert(translations[currentLang].orderAlert);
  // Optionally, reset quantities after submission
  // products.forEach(p => p.qty = 0);
  // renderProducts();
  // updateSummary();
}

// Event Listeners
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations(); // Apply initial language
  renderProducts();
  // updateSummary(); // updateSummary is called by renderProducts
});
