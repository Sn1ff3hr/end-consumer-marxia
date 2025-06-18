// I. CONSTANTS & STATE VARIABLES
// ================================

/**
 * @type {Array<Object>} products - Array of product objects.
 */
const products = [
  { id: 'p1', name: 'Liquid Glass Mug', price: 15.99, qty: 0, img: 'https://via.placeholder.com/300x200?text=Glass+Mug' },
  { id: 'p2', name: 'Neumorphic Lamp', price: 34.50, qty: 0, img: 'https://via.placeholder.com/300x200?text=Lamp' },
  { id: 'p3', name: 'AR Book Viewer', price: 9.99, qty: 0, img: '' },
  { id: 'p4', name: 'Ergo Mouse Pad', price: 12.00, qty: 0, img: 'https://via.placeholder.com/300x200?text=Mouse+Pad' },
  { id: 'p5', name: 'Ambient LED Strip', price: 22.75, qty: 0, img: 'https://via.placeholder.com/300x200?text=LED+Strip' },
];
/** @type {number} currentIndex - Index of the currently displayed product. */
let currentIndex = 0;

/**
 * @type {Object} translations - Contains language strings for UI elements.
 */
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
    noImageAvailable: 'No Image Available',
    noProductsLoaded: 'No Products Loaded',
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
    noImageAvailable: 'No Hay Imagen Disponible',
    noProductsLoaded: 'No Hay Productos Cargados',
  }
};
/** @type {string} currentLang - Current selected language ('en' or 'es'). */
let currentLang = localStorage.getItem('preferredLang') || 'en';

// II. DOM ELEMENTS
// ================================
// Product Viewer Elements
const currentProductImgEl = document.getElementById('currentProductImg');
const productImagePlaceholderEl = document.getElementById('productImagePlaceholder');
const currentProductNameEl = document.getElementById('currentProductName');
const currentProductPriceEl = document.getElementById('currentProductPrice');
const singleViewProductQtyEl = document.getElementById('singleViewProductQty');
const singleViewAddBtn = document.getElementById('singleViewAddBtn');
const singleViewRemoveBtn = document.getElementById('singleViewRemoveBtn');
// Note: arrowLeftBtn and arrowRightBtn will be fetched in DOMContentLoaded as they are class-based

// Order Summary Elements
const orderList = document.getElementById('orderList');
const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const totalEl = document.getElementById('total');

// Modal Elements
const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
// Note: modalContent and modalCloseBtn will be fetched in DOMContentLoaded

// Language Switch Element
const langBtn = document.getElementById('langBtn'); // Already an ID

// Delivery Toggle Elements
const deliveryYesBtn = document.getElementById('deliveryYesBtn');
const deliveryNoBtn = document.getElementById('deliveryNoBtn');

// Pay Button
const payBtn = document.getElementById('submitBtn'); // Already an ID


// III. CORE APPLICATION LOGIC
// ================================

// A. Product Display & Navigation
// --------------------------------
/**
 * Renders the current product in the main view.
 */
function renderCurrentProductView() {
  if (products.length === 0) {
    if (currentProductImgEl) currentProductImgEl.style.display = 'none';
    if (productImagePlaceholderEl) {
      productImagePlaceholderEl.style.display = 'flex';
      productImagePlaceholderEl.textContent = translations[currentLang].noProductsLoaded;
    }
    if (currentProductNameEl) currentProductNameEl.textContent = 'N/A';
    if (currentProductPriceEl) currentProductPriceEl.textContent = '$0.00';
    if (singleViewProductQtyEl) singleViewProductQtyEl.textContent = '0';
    if (singleViewAddBtn) singleViewAddBtn.setAttribute('aria-label', `Add one item`);
    if (singleViewRemoveBtn) singleViewRemoveBtn.setAttribute('aria-label', `Remove one item`);
    updateSummary();
    return;
  }

  const product = products[currentIndex];
  if (product.img && product.img.trim() !== '') {
    if (currentProductImgEl) {
      currentProductImgEl.src = product.img;
      currentProductImgEl.alt = product.name;
      currentProductImgEl.style.display = 'block';
    }
    if (productImagePlaceholderEl) productImagePlaceholderEl.style.display = 'none';
  } else {
    if (currentProductImgEl) currentProductImgEl.style.display = 'none';
    if (productImagePlaceholderEl) {
      productImagePlaceholderEl.style.display = 'flex';
      productImagePlaceholderEl.textContent = translations[currentLang].noImageAvailable;
    }
  }

  if (currentProductNameEl) currentProductNameEl.textContent = product.name;
  if (currentProductPriceEl) currentProductPriceEl.textContent = `$${product.price.toFixed(2)}`;
  if (singleViewProductQtyEl) singleViewProductQtyEl.textContent = product.qty;
  if (singleViewAddBtn) singleViewAddBtn.setAttribute('aria-label', `Add one ${product.name}`);
  if (singleViewRemoveBtn) singleViewRemoveBtn.setAttribute('aria-label', `Remove one ${product.name}`);
  updateSummary();
}

/**
 * Navigates to the previous or next product.
 * @param {number} direction - -1 for previous, 1 for next.
 */
function navigateProduct(direction) {
  if (products.length === 0) return;
  currentIndex = (currentIndex + direction + products.length) % products.length;
  renderCurrentProductView();
}

// B. Quantity Management
// --------------------------------
/**
 * Updates the quantity of the current product.
 * @param {number} change - 1 to add, -1 to remove.
 */
function updateQty(change) {
  if (products.length === 0) return;
  products[currentIndex].qty = Math.max(0, products[currentIndex].qty + change);
  if (singleViewProductQtyEl) singleViewProductQtyEl.textContent = products[currentIndex].qty;
  updateSummary();
}

// C. Order Summary
// --------------------------------
/**
 * Updates the order summary list and totals.
 */
function updateSummary() {
  if (!orderList || !subtotalEl || !vatEl || !totalEl) return;
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

  if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
  if (vatEl) vatEl.textContent = vatAmount.toFixed(2);
  if (totalEl) totalEl.textContent = totalAmount.toFixed(2);
}

// D. Modal Viewer
// --------------------------------
/**
 * Opens the modal to display a larger image.
 * @param {string} imageSrc - The source URL of the image to display.
 */
function openModal(imageSrc) {
  if (!modalOverlay || !modalImage) return;
  if (!imageSrc || imageSrc.includes('No%20Image%20Available') || imageSrc.endsWith('/')) {
    console.log("No valid image to zoom or placeholder is shown.");
    return;
  }
  modalImage.src = imageSrc;
  modalOverlay.classList.add('active');
}
/**
 * Closes the image modal.
 */
function closeModal() {
  if (modalOverlay) modalOverlay.classList.remove('active');
}

// E. Language & Translations
// --------------------------------
/**
 * Toggles the application language between English and Spanish.
 */
function toggleLang() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  localStorage.setItem('preferredLang', currentLang);
  document.documentElement.lang = currentLang;
  if (langBtn) langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN';
  applyTranslations();
  renderCurrentProductView();
}

/**
 * Applies the current language translations to UI elements.
 */
function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.getElementById('appTitle')?.textContent = translations[currentLang].appTitle;
  document.getElementById('summaryTitle')?.textContent = translations[currentLang].summaryTitle;
  document.getElementById('submitBtn')?.textContent = translations[currentLang].payButton; // payBtn also refers to this
  document.getElementById('subtotalLabel')?.textContent = translations[currentLang].subtotalLabel;
  document.getElementById('vatLabel')?.textContent = translations[currentLang].vatLabel;
  document.getElementById('totalLabel')?.textContent = translations[currentLang].totalLabel;
  document.getElementById('deliveryLabel')?.textContent = translations[currentLang].deliveryLabel;
  // ARIA labels for product navigation and modal might also be updated here if they were dynamic
  updateSummary(); // For empty item text
}

// F. Order Submission
// --------------------------------
/**
 * Simulates submitting the order.
 */
function submitOrder() {
  const orderData = products.filter(p => p.qty > 0);
  if (orderData.length === 0) {
    alert(currentLang === 'en' ? 'Your order is empty.' : 'Tu pedido está vacío.');
    return;
  }
  console.log("Order submitted:", orderData);
  alert(translations[currentLang].orderAlert);
}


// IV. EVENT LISTENERS & INITIALIZATION
// =====================================
document.addEventListener('DOMContentLoaded', () => {
  // Re-fetch some elements that use querySelector or are specific to DOMContentLoaded context
  const arrowLeftBtnLocal = document.querySelector('.arrow.arrow-left');
  const arrowRightBtnLocal = document.querySelector('.arrow.arrow-right');
  const modalContentLocal = document.querySelector('.modal-content');
  const modalCloseBtnLocal = document.querySelector('.modal-close');

  // Initial language setup (already done for langBtn text content)
  document.documentElement.lang = currentLang;
  if (langBtn) {
    langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN'; // Set initial text
    langBtn.addEventListener('click', toggleLang);
  }

  // Product Navigation
  if (arrowLeftBtnLocal) arrowLeftBtnLocal.addEventListener('click', () => navigateProduct(-1));
  if (arrowRightBtnLocal) arrowRightBtnLocal.addEventListener('click', () => navigateProduct(1));

  // Product Image Modal Trigger
  if (currentProductImgEl) currentProductImgEl.addEventListener('click', () => {
    if (products[currentIndex] && products[currentIndex].img) {
       openModal(products[currentIndex].img);
    } else {
       openModal(''); // openModal handles invalid src
    }
  });

  // Quantity Buttons
  if (singleViewAddBtn) singleViewAddBtn.addEventListener('click', () => updateQty(1));
  if (singleViewRemoveBtn) singleViewRemoveBtn.addEventListener('click', () => updateQty(-1));

  // Modal Close Mechanisms
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
  if (modalCloseBtnLocal) modalCloseBtnLocal.addEventListener('click', closeModal);
  if (modalContentLocal) modalContentLocal.addEventListener('click', (event) => event.stopPropagation());

  // Delivery Toggle Buttons
  if (deliveryYesBtn) {
    deliveryYesBtn.addEventListener('click', () => {
      if (!deliveryYesBtn.classList.contains('active')) {
        deliveryYesBtn.classList.add('active');
        deliveryYesBtn.setAttribute('aria-pressed', 'true');
        if (deliveryNoBtn) {
          deliveryNoBtn.classList.remove('active');
          deliveryNoBtn.setAttribute('aria-pressed', 'false');
        }
      }
    });
  }
  if (deliveryNoBtn) {
    deliveryNoBtn.addEventListener('click', () => {
      if (!deliveryNoBtn.classList.contains('active')) {
        deliveryNoBtn.classList.add('active');
        deliveryNoBtn.setAttribute('aria-pressed', 'true');
        if (deliveryYesBtn) {
          deliveryYesBtn.classList.remove('active');
          deliveryYesBtn.setAttribute('aria-pressed', 'false');
        }
      }
    });
  }

  // Pay Button
  if (payBtn) payBtn.addEventListener('click', submitOrder);

  // Global Key Events (Modal Escape)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Cookie Consent Banner Logic
  const cookieConsentBanner = document.getElementById('cookieConsentBanner');
  const acceptCookieConsentBtn = document.getElementById('acceptCookieConsent');

  if (!localStorage.getItem('cookieConsentAccepted')) {
    if (cookieConsentBanner) cookieConsentBanner.style.display = 'block';
  }

  if (acceptCookieConsentBtn) {
    acceptCookieConsentBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsentAccepted', 'true');
      if (cookieConsentBanner) cookieConsentBanner.style.display = 'none';
    });
  }

  // Initial Render
  applyTranslations();
  renderCurrentProductView();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}