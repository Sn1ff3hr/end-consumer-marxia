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
// DOM elements will be fetched inside DOMContentLoaded

// III. CORE APPLICATION LOGIC
// ================================

// A. Product Display & Navigation
// --------------------------------
/**
 * Renders the current product in the main view.
 */
function renderCurrentProductView() {
  const currentProductImgEl = document.getElementById('currentProductImg');
  const productImagePlaceholderEl = document.getElementById('productImagePlaceholder');
  const currentProductNameEl = document.getElementById('currentProductName');
  const currentProductPriceEl = document.getElementById('currentProductPrice');
  const singleViewProductQtyEl = document.getElementById('singleViewProductQty');
  const singleViewAddBtn = document.getElementById('singleViewAddBtn');
  const singleViewRemoveBtn = document.getElementById('singleViewRemoveBtn');

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
  const singleViewProductQtyEl = document.getElementById('singleViewProductQty');
  if (singleViewProductQtyEl) singleViewProductQtyEl.textContent = products[currentIndex].qty;
  updateSummary();
}

// C. Order Summary
// --------------------------------
/**
 * Updates the order summary list and totals.
 */
function updateSummary() {
  const orderList = document.getElementById('orderList');
  const subtotalEl = document.getElementById('subtotal');
  const vatEl = document.getElementById('vat');
  const totalEl = document.getElementById('total');

  if (!orderList || !subtotalEl || !vatEl || !totalEl) {
    // console.error("Order summary elements not found in updateSummary. Cannot update totals or list.");
    return; // Early exit if critical summary elements are missing
  }
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
  const modalOverlay = document.getElementById('modalOverlay');
  const modalImage = document.getElementById('modalImage');
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
  const modalOverlay = document.getElementById('modalOverlay');
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
  const langBtnEl = document.getElementById('langBtn');
  if (langBtnEl) langBtnEl.textContent = currentLang === 'en' ? 'ES' : 'EN';
  applyTranslations();
  renderCurrentProductView();
}

/**
 * Applies the current language translations to UI elements.
 */
function applyTranslations() {
  document.documentElement.lang = currentLang;
  const appTitleEl = document.getElementById('appTitle');
  if (appTitleEl) appTitleEl.textContent = translations[currentLang].appTitle;

  const summaryTitleEl = document.getElementById('summaryTitle');
  if (summaryTitleEl) summaryTitleEl.textContent = translations[currentLang].summaryTitle;

  const submitBtnEl = document.getElementById('submitBtn');
  if (submitBtnEl) submitBtnEl.textContent = translations[currentLang].payButton;

  const subtotalLabelEl = document.getElementById('subtotalLabel');
  if (subtotalLabelEl) subtotalLabelEl.textContent = translations[currentLang].subtotalLabel;

  const vatLabelEl = document.getElementById('vatLabel');
  if (vatLabelEl) vatLabelEl.textContent = translations[currentLang].vatLabel;

  const totalLabelEl = document.getElementById('totalLabel');
  if (totalLabelEl) totalLabelEl.textContent = translations[currentLang].totalLabel;

  const deliveryLabelEl = document.getElementById('deliveryLabel');
  if (deliveryLabelEl) deliveryLabelEl.textContent = translations[currentLang].deliveryLabel;
  // ARIA labels for product navigation and modal might also be updated here if they were dynamic
  updateSummary(); // For empty item text, which itself fetches elements
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
  // Fetch ALL DOM elements here
  const currentProductImgEl = document.getElementById('currentProductImg');
  const productImagePlaceholderEl = document.getElementById('productImagePlaceholder');
  const currentProductNameEl = document.getElementById('currentProductName');
  const currentProductPriceEl = document.getElementById('currentProductPrice');
  const singleViewProductQtyEl = document.getElementById('singleViewProductQty');
  const singleViewAddBtn = document.getElementById('singleViewAddBtn');
  const singleViewRemoveBtn = document.getElementById('singleViewRemoveBtn');

  const orderList = document.getElementById('orderList');
  const subtotalEl = document.getElementById('subtotal'); // Though not directly used for event, good to fetch with group
  const vatEl = document.getElementById('vat'); // same as above
  const totalEl = document.getElementById('total'); // same as above

  const modalOverlay = document.getElementById('modalOverlay');
  const modalImage = document.getElementById('modalImage'); // Though not directly used for event, good to fetch with group
  const modalContentLocal = document.querySelector('.modal-content');
  const modalCloseBtnLocal = document.querySelector('.modal-close');

  const langBtn = document.getElementById('langBtn');

  const deliveryYesBtn = document.getElementById('deliveryYesBtn');
  const deliveryNoBtn = document.getElementById('deliveryNoBtn');

  const payBtn = document.getElementById('submitBtn');

  const arrowLeftBtnLocal = document.querySelector('.arrow.arrow-left');
  const arrowRightBtnLocal = document.querySelector('.arrow.arrow-right');

  // Critical elements check
  if (!singleViewAddBtn || !orderList || !langBtn || !payBtn || !arrowLeftBtnLocal || !arrowRightBtnLocal) {
    console.error("Critical DOM elements missing after DOMContentLoaded. Functionality impaired.");
    return;
  }

  // Initial language setup
  document.documentElement.lang = currentLang;
  if (langBtn) {
    langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN'; // Set initial text
    langBtn.addEventListener('click', toggleLang); // toggleLang will fetch its own langBtn for text update
  }

  // Product Navigation
  if (arrowLeftBtnLocal) arrowLeftBtnLocal.addEventListener('click', () => navigateProduct(-1));
  if (arrowRightBtnLocal) arrowRightBtnLocal.addEventListener('click', () => navigateProduct(1));

  // Product Image Modal Trigger
  if (currentProductImgEl) {
    currentProductImgEl.addEventListener('click', () => {
      // openModal will fetch its own DOM elements
      if (products[currentIndex] && products[currentIndex].img) {
         openModal(products[currentIndex].img);
      } else {
         openModal('');
      }
    });
  }

  // Quantity Buttons
  // updateQty will fetch its own DOM elements for display
  if (singleViewAddBtn) singleViewAddBtn.addEventListener('click', () => updateQty(1));
  if (singleViewRemoveBtn) singleViewRemoveBtn.addEventListener('click', () => updateQty(-1));

  // Modal Close Mechanisms
  // closeModal will fetch its own modalOverlay
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
  // closeModal will fetch its own modalOverlay
  document.addEventListener('keydown', (e) => {
    // Need to fetch modalOverlay here for the classList.contains check, or pass it to closeModal
    // For now, let closeModal handle its own element fetching. This check is fine.
    const currentModalOverlay = document.getElementById('modalOverlay'); // Fetch for check
    if (e.key === 'Escape' && currentModalOverlay && currentModalOverlay.classList.contains('active')) {
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