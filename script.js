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

const themeKey = 'user-theme';

// II. DOM ELEMENTS
// ================================
let domElements = {};

// III. CORE APPLICATION LOGIC
// ================================

// A. Theme Management
// --------------------------------
/**
 * Sets the theme for the application.
 * @param {string} theme - The theme to set ('light' or 'dark').
 */
function setTheme(theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  if (domElements.themeToggleButton) {
    domElements.themeToggleButton.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }
  localStorage.setItem(themeKey, theme);
}

// B. Product Display & Navigation
// --------------------------------
/**
 * Renders the current product in the main view.
 */
function renderCurrentProductView() {
  const {
    currentProductImg,
    productImagePlaceholder,
    currentProductName,
    currentProductPrice,
    singleViewProductQty,
    singleViewAddBtn,
    singleViewRemoveBtn
  } = domElements;

  if (products.length === 0) {
    if (currentProductImg) currentProductImg.classList.add('hidden');
    if (productImagePlaceholder) {
      productImagePlaceholder.classList.remove('hidden');
      productImagePlaceholder.style.display = 'flex';
      productImagePlaceholder.textContent = translations[currentLang].noProductsLoaded;
    }
    if (currentProductName) currentProductName.textContent = 'N/A';
    if (currentProductPrice) currentProductPrice.textContent = '$0.00';
    if (singleViewProductQty) singleViewProductQty.textContent = '0';
    if (singleViewAddBtn) singleViewAddBtn.setAttribute('aria-label', `Add one item`);
    if (singleViewRemoveBtn) singleViewRemoveBtn.setAttribute('aria-label', `Remove one item`);
    updateSummary();
    return;
  }

  const product = products[currentIndex];
  if (product.img && product.img.trim() !== '') {
    if (currentProductImg) {
      currentProductImg.src = product.img;
      currentProductImg.alt = product.name;
      currentProductImg.setAttribute('aria-label', `View larger image of ${product.name}`);
      currentProductImg.classList.remove('hidden');
      currentProductImg.style.display = 'block';
    }
    if (productImagePlaceholder) productImagePlaceholder.classList.add('hidden');
  } else {
    if (currentProductImg) currentProductImg.classList.add('hidden');
    if (productImagePlaceholder) {
      productImagePlaceholder.classList.remove('hidden');
      productImagePlaceholder.style.display = 'flex';
      productImagePlaceholder.textContent = translations[currentLang].noImageAvailable;
    }
  }

  if (currentProductName) currentProductName.textContent = product.name;
  if (currentProductPrice) currentProductPrice.textContent = `$${product.price.toFixed(2)}`;
  if (singleViewProductQty) singleViewProductQty.textContent = product.qty;
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
  if (domElements.singleViewProductQty) {
    domElements.singleViewProductQty.textContent = products[currentIndex].qty;
  }
  updateSummary();
}

// C. Order Summary
// --------------------------------
/**
 * Updates the order summary list and totals.
 */
function updateSummary() {
  const { orderList, subtotal, vat, total } = domElements;

  if (!orderList || !subtotal || !vat || !total) {
    return;
  }
  orderList.innerHTML = '';
  let subtotalValue = 0;
  const vatRate = 0.12;
  const activeProducts = products.filter(p => p.qty > 0);

  if (activeProducts.length === 0) {
    for (let i = 0; i < 5; i++) {
      const li = document.createElement('li');
      li.innerHTML = `<span>${translations[currentLang].emptyItem}</span><span></span>`;
      orderList.appendChild(li);
    }
  } else {
    activeProducts.forEach(p => {
      const totalItemPrice = p.qty * p.price;
      subtotalValue += totalItemPrice;
      const li = document.createElement('li');
      li.innerHTML = `<span>${p.name} x ${p.qty}</span><span>$${totalItemPrice.toFixed(2)}</span>`;
      orderList.appendChild(li);
    });
  }

  const vatAmount = subtotalValue * vatRate;
  const totalAmount = subtotalValue + vatAmount;

  subtotal.textContent = subtotalValue.toFixed(2);
  vat.textContent = vatAmount.toFixed(2);
  total.textContent = totalAmount.toFixed(2);
}

// D. Modal Viewer
// --------------------------------
/**
 * Opens the modal to display a larger image.
 * @param {string} imageSrc - The source URL of the image to display.
 */
function openModal(imageSrc) {
  const { modalOverlay, modalImage } = domElements;
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
  if (domElements.modalOverlay) {
    domElements.modalOverlay.classList.remove('active');
  }
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
  if (domElements.langBtn) {
    domElements.langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN';
  }
  applyTranslations();
  renderCurrentProductView();
}

/**
 * Applies the current language translations to UI elements.
 */
function applyTranslations() {
  document.documentElement.lang = currentLang;
  const {
    appTitle,
    summaryTitle,
    submitBtn,
    subtotalLabel,
    vatLabel,
    totalLabel,
    deliveryLabel
  } = domElements;

  if (appTitle) appTitle.textContent = translations[currentLang].appTitle;
  if (summaryTitle) summaryTitle.textContent = translations[currentLang].summaryTitle;
  if (submitBtn) submitBtn.textContent = translations[currentLang].payButton;
  if (subtotalLabel) subtotalLabel.textContent = translations[currentLang].subtotalLabel;
  if (vatLabel) vatLabel.textContent = translations[currentLang].vatLabel;
  if (totalLabel) totalLabel.textContent = translations[currentLang].totalLabel;
  if (deliveryLabel) deliveryLabel.textContent = translations[currentLang].deliveryLabel;
  updateSummary();
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
  domElements = {
    currentProductImg: document.getElementById('currentProductImg'),
    productImagePlaceholder: document.getElementById('productImagePlaceholder'),
    currentProductName: document.getElementById('currentProductName'),
    currentProductPrice: document.getElementById('currentProductPrice'),
    singleViewProductQty: document.getElementById('singleViewProductQty'),
    singleViewAddBtn: document.getElementById('singleViewAddBtn'),
    singleViewRemoveBtn: document.getElementById('singleViewRemoveBtn'),
    orderList: document.getElementById('orderList'),
    subtotal: document.getElementById('subtotal'),
    vat: document.getElementById('vat'),
    total: document.getElementById('total'),
    modalOverlay: document.getElementById('modalOverlay'),
    modalImage: document.getElementById('modalImage'),
    modalContent: document.querySelector('.modal-content'),
    modalCloseBtn: document.querySelector('.modal-close'),
    langBtn: document.getElementById('langBtn'),
    deliveryYesBtn: document.getElementById('deliveryYesBtn'),
    deliveryNoBtn: document.getElementById('deliveryNoBtn'),
    submitBtn: document.getElementById('submitBtn'),
    arrowLeftBtn: document.querySelector('.arrow.arrow-left'),
    arrowRightBtn: document.querySelector('.arrow.arrow-right'),
    themeToggleButton: document.getElementById('theme-toggle'),
    appTitle: document.getElementById('appTitle'),
    summaryTitle: document.getElementById('summaryTitle'),
    subtotalLabel: document.getElementById('subtotalLabel'),
    vatLabel: document.getElementById('vatLabel'),
    totalLabel: document.getElementById('totalLabel'),
    deliveryLabel: document.getElementById('deliveryLabel'),
    cookieConsentBanner: document.getElementById('cookieConsentBanner'),
    acceptCookieConsentBtn: document.getElementById('acceptCookieConsent'),
  };

  if (domElements.productImagePlaceholder) {
    domElements.productImagePlaceholder.classList.add('hidden');
  }

  document.documentElement.lang = currentLang;
  if (domElements.langBtn) {
    domElements.langBtn.textContent = currentLang === 'en' ? 'ES' : 'EN';
    domElements.langBtn.addEventListener('click', toggleLang);
  }

  const savedTheme = localStorage.getItem(themeKey);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));

  if (domElements.themeToggleButton) {
    domElements.themeToggleButton.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  if (domElements.arrowLeftBtn) domElements.arrowLeftBtn.addEventListener('click', () => navigateProduct(-1));
  if (domElements.arrowRightBtn) domElements.arrowRightBtn.addEventListener('click', () => navigateProduct(1));

  if (domElements.currentProductImg) {
    domElements.currentProductImg.addEventListener('click', () => {
      if (products[currentIndex] && products[currentIndex].img) {
        openModal(products[currentIndex].img);
      } else {
        openModal('');
      }
    });
  }

  if (domElements.singleViewAddBtn) domElements.singleViewAddBtn.addEventListener('click', () => updateQty(1));
  if (domElements.singleViewRemoveBtn) domElements.singleViewRemoveBtn.addEventListener('click', () => updateQty(-1));

  if (domElements.modalOverlay) domElements.modalOverlay.addEventListener('click', closeModal);
  if (domElements.modalCloseBtn) domElements.modalCloseBtn.addEventListener('click', closeModal);
  if (domElements.modalContent) domElements.modalContent.addEventListener('click', (event) => event.stopPropagation());

  if (domElements.deliveryYesBtn) {
    domElements.deliveryYesBtn.addEventListener('click', () => {
      if (!domElements.deliveryYesBtn.classList.contains('active')) {
        domElements.deliveryYesBtn.classList.add('active');
        domElements.deliveryYesBtn.setAttribute('aria-pressed', 'true');
        if (domElements.deliveryNoBtn) {
          domElements.deliveryNoBtn.classList.remove('active');
          domElements.deliveryNoBtn.setAttribute('aria-pressed', 'false');
        }
      }
    });
  }

  if (domElements.deliveryNoBtn) {
    domElements.deliveryNoBtn.addEventListener('click', () => {
      if (!domElements.deliveryNoBtn.classList.contains('active')) {
        domElements.deliveryNoBtn.classList.add('active');
        domElements.deliveryNoBtn.setAttribute('aria-pressed', 'true');
        if (domElements.deliveryYesBtn) {
          domElements.deliveryYesBtn.classList.remove('active');
          domElements.deliveryYesBtn.setAttribute('aria-pressed', 'false');
        }
      }
    });
  }

  if (domElements.submitBtn) domElements.submitBtn.addEventListener('click', submitOrder);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && domElements.modalOverlay && domElements.modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  if (domElements.cookieConsentBanner) {
    domElements.cookieConsentBanner.classList.add('hidden');
    if (!localStorage.getItem('cookieConsentAccepted')) {
      domElements.cookieConsentBanner.classList.remove('hidden');
    }
  }

  if (domElements.acceptCookieConsentBtn) {
    domElements.acceptCookieConsentBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsentAccepted', 'true');
      if (domElements.cookieConsentBanner) domElements.cookieConsentBanner.classList.add('hidden');
    });
  }

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
