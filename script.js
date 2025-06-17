const products = [
  { name: 'Liquid Glass Mug', price: 15.99, qty: 0, img: 'https://via.placeholder.com/300x200?text=Glass+Mug' },
  { name: 'Neumorphic Lamp', price: 34.50, qty: 0, img: 'https://via.placeholder.com/300x200?text=Lamp' },
  { name: 'AR Book Viewer', price: 9.99, qty: 0, img: 'https://via.placeholder.com/300x200?text=AR+Book' },
];

let currentIndex = 0;

const imgEl = document.getElementById('productImg');
const nameEl = document.getElementById('productName');
const priceEl = document.getElementById('productPrice');
const qtyEl = document.getElementById('productQty');
const listEl = document.getElementById('itemList');
const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const totalEl = document.getElementById('total');

function renderProduct() {
  const p = products[currentIndex];
  imgEl.src = p.img;
  nameEl.textContent = p.name;
  priceEl.textContent = `$${p.price.toFixed(2)}`;
  qtyEl.textContent = p.qty;
}

function updateQty(change) {
  const p = products[currentIndex];
  p.qty = Math.max(0, p.qty + change);
  qtyEl.textContent = p.qty;
  renderList();
}

function renderList() {
  listEl.innerHTML = '';
  let subtotal = 0;

  products.forEach(p => {
    const lineTotal = p.qty * p.price;
    if (p.qty > 0) {
      const li = document.createElement('li');
      li.innerHTML = `<span>${p.name} x${p.qty}</span><span>$${lineTotal.toFixed(2)}</span>`;
      listEl.appendChild(li);
    }
    subtotal += lineTotal;
  });

  const vat = subtotal * 0.12;
  const total = subtotal + vat;
  subtotalEl.textContent = subtotal.toFixed(2);
  vatEl.textContent = vat.toFixed(2);
  totalEl.textContent = total.toFixed(2);
}

document.getElementById('prevBtn').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + products.length) % products.length;
  renderProduct();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % products.length;
  renderProduct();
});

function payNow() {
  alert('💸 Integrate your payment processor here!');
}

renderProduct();
renderList();
