/* =====================================================
   UrbanBazzar — Single JS for ALL pages
   Works with style.css and your 9 HTML files
   ===================================================== */

/* ---------- Data ---------- */
const PRODUCTS = [
  {id:1,  title:"Headphone",        img:"product1.jpg",  price:21000, desc:"High-quality wireless headphones for immersive sound."},
  {id:2,  title:"Arthouse",         img:"product2.jpg",  price:15000, desc:"Modern art piece to elevate your home decor."},
  {id:3,  title:"Coffee Maker",     img:"product3.jpg",  price:8000,  desc:"Brew your perfect cup every morning with ease."},
  {id:4,  title:"Mirror",           img:"product4.jpg",  price:12000, desc:"Elegant wall mirror for bedroom or living room."},
  {id:5,  title:"Painting",         img:"product5.jpg",  price:5000,  desc:"Canvas painting for your cozy corner."},
  {id:6,  title:"Makeup Kit",       img:"product6.jpg",  price:7000,  desc:"Complete makeup kit for daily and party looks."},
  {id:7,  title:"Nike Shoes",       img:"product7.jpg",  price:25000, desc:"Comfortable and stylish Nike sneakers."},
  {id:8,  title:"Handbag",          img:"product8.jpg",  price:14000, desc:"Trendy handbag with ample space."},
  {id:9,  title:"Furniture",        img:"product9.jpg",  price:55000, desc:"Premium furniture set for your living room."},
  {id:10, title:"Hair Color Tube",  img:"product10.jpg", price:2000,  desc:"Long-lasting professional hair color."},
  {id:11, title:"Face Serum",       img:"product11.jpg", price:4000,  desc:"Nourishing face serum for radiant skin."},
  {id:12, title:"Barbie Doll",      img:"product12.jpg", price:3500,  desc:"Classic Barbie doll for kids and collectors."},
];

/* ---------- Helpers ---------- */
const fmtPKR = n => "PKR " + Number(n || 0).toLocaleString();

const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = cart => localStorage.setItem("cart", JSON.stringify(cart));

function cartCount() {
  const cart = getCart();
  return cart.reduce((sum, it) => sum + (it.qty || 0), 0);
}

function updateHeaderCartBadge() {
  const badge = document.querySelector('.badge');
  if (badge) badge.textContent = `Cart (${cartCount()})`;
}

function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
  updateHeaderCartBadge();
}

function setActiveNav() {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === path) a.classList.add('active');
  });
}

/* ---------- Mobile Menu ---------- */
function initMobileMenu() {
  const btn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => nav.classList.toggle('open'));
}

/* ---------- Home: show featured (optional) ---------- */
function initHomeFeatured() {
  const wrap = document.getElementById('homeFeatured');
  if (!wrap) return;
  const featured = PRODUCTS.slice(0, 3);
  wrap.innerHTML = '';
  featured.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="product-body">
        <h4 class="product-title">${p.title}</h4>
        <p class="price">${fmtPKR(p.price)}</p>
        <div style="display:flex; gap:8px; margin-top:6px;">
          <a href="product.html?id=${p.id}" class="btn ghost">View</a>
          <button class="btn primary" data-add="${p.id}">Add to Cart</button>
        </div>
      </div>
    `;
    wrap.appendChild(card);
  });
  wrap.querySelectorAll('[data-add]').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const id = Number(e.currentTarget.getAttribute('data-add'));
      addToCart(id, 1);
      alert('Added to cart!');
    });
  });
}

/* ---------- Shop page: grid + search + sort ---------- */
function initShop() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  function render(list) {
    grid.innerHTML = '';
    list.forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div class="product-body">
          <h4 class="product-title">${p.title}</h4>
          <p class="price">${fmtPKR(p.price)}</p>
          <p class="muted" style="margin:6px 0 10px;">${p.desc}</p>
          <div style="display:flex; gap:8px;">
            <a href="product.html?id=${p.id}" class="btn ghost">View</a>
            <button class="btn primary" data-add="${p.id}">Add to Cart</button>
          </div>
        </div>
      `;
      grid.appendChild(div);
    });

    grid.querySelectorAll('[data-add]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const id = Number(e.currentTarget.getAttribute('data-add'));
        addToCart(id, 1);
        alert('Added to cart!');
      });
    });
  }

  function applySort(list, mode) {
    const arr = [...list];
    switch (mode) {
      case 'priceLow':  return arr.sort((a,b)=>a.price-b.price);
      case 'priceHigh': return arr.sort((a,b)=>b.price-a.price);
      case 'nameAZ':    return arr.sort((a,b)=>a.title.localeCompare(b.title));
      case 'nameZA':    return arr.sort((a,b)=>b.title.localeCompare(a.title));
      default:          return arr;
    }
  }

  let current = [...PRODUCTS];
  render(current);

  if (searchInput) {
    searchInput.addEventListener('input', e=>{
      const q = e.target.value.toLowerCase();
      current = PRODUCTS.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
      const mode = sortSelect ? sortSelect.value : 'default';
      render(applySort(current, mode));
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', e=>{
      render(applySort(current, e.target.value));
    });
  }
}

/* ---------- Product page ---------- */
function initProductDetail() {
  // Two supported layouts:
  // 1) Single container #productDetail (we inject all)
  // 2) Separate elements with #productImg, #productTitle, #productPrice, #productDesc
  const detailWrap = document.getElementById('productDetail');
  const imgEl   = document.getElementById('productImg');
  const titleEl = document.getElementById('productTitle');
  const priceEl = document.getElementById('productPrice');
  const descEl  = document.getElementById('productDesc');

  // if neither exists, it's not product page
  if (!detailWrap && !imgEl) return;

  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id')) || 1;
  const p = getProductById(id) || PRODUCTS[0];

  if (detailWrap) {
    detailWrap.classList.add('product-detail');
    detailWrap.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="product-detail-img">
      <div class="product-detail-info">
        <h2>${p.title}</h2>
        <p>${p.desc}</p>
        <p class="price">${fmtPKR(p.price)}</p>
        <div style="display:flex; align-items:center; gap:12px; margin:12px 0;">
          <label for="qty">Quantity:</label>
          <input type="number" id="qty" value="1" min="1" style="width:70px; padding:6px; border-radius:8px; border:1px solid rgba(255,255,255,.2); background:#0b0f14; color:#f1f6f9;">
        </div>
        <button class="btn primary" id="addToCartBtn">Add to Cart</button>
      </div>
    `;
  } else {
    // Populate separate nodes
    if (imgEl)   imgEl.src = p.img;
    if (titleEl) titleEl.textContent = p.title;
    if (priceEl) priceEl.textContent = fmtPKR(p.price);
    if (descEl)  descEl.textContent  = p.desc;
  }

  const btn = document.getElementById('addToCartBtn');
  if (btn) {
    btn.addEventListener('click', ()=>{
      const qtyInput = document.getElementById('qty');
      const qty = Math.max(1, Number(qtyInput ? qtyInput.value : 1));
      addToCart(p.id, qty);
      alert(`${p.title} added to cart!`);
      // stay on product page, or redirect if you want:
      // location.href = 'cart.html';
    });
  }

  // Related products (optional if #relatedProducts exists)
  const related = document.getElementById('relatedProducts');
  if (related) {
    related.innerHTML = '';
    PRODUCTS.filter(x => x.id !== p.id).slice(0,4).forEach(r=>{
      const div = document.createElement('div');
      div.className = 'product-card';
      div.innerHTML = `
        <img src="${r.img}" alt="${r.title}">
        <div class="product-body">
          <h4 class="product-title">${r.title}</h4>
          <p class="price">${fmtPKR(r.price)}</p>
          <a href="product.html?id=${r.id}" class="btn ghost" style="margin-top:6px;">View</a>
        </div>
      `;
      related.appendChild(div);
    });
  }
}

/* ---------- Cart page ---------- */
function initCartPage() {
  const listEl  = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!listEl || !totalEl) return;

  function render() {
    const cart = getCart();
    listEl.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      const p = getProductById(item.id);
      if (!p) return;
      const subtotal = p.price * item.qty;
      total += subtotal;

      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <div>
          <h4>${p.title}</h4>
          <p>${fmtPKR(p.price)} x ${item.qty} = ${fmtPKR(subtotal)}</p>
          <div class="qty-controls">
            <button class="qty-btn" data-dec="${p.id}">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-inc="${p.id}">+</button>
          </div>
        </div>
        <button class="remove-btn" data-remove="${p.id}">Remove</button>
      `;
      listEl.appendChild(row);
    });

    totalEl.textContent = total.toLocaleString();

    // bind actions
    listEl.querySelectorAll('[data-inc]').forEach(b=>{
      b.addEventListener('click', e=>{
        const id = Number(e.currentTarget.getAttribute('data-inc'));
        const cart = getCart();
        const it = cart.find(i=>i.id===id);
        if (it) it.qty += 1;
        saveCart(cart); render(); updateHeaderCartBadge();
      });
    });
    listEl.querySelectorAll('[data-dec]').forEach(b=>{
      b.addEventListener('click', e=>{
        const id = Number(e.currentTarget.getAttribute('data-dec'));
        const cart = getCart();
        const it = cart.find(i=>i.id===id);
        if (it) it.qty = Math.max(1, it.qty - 1);
        saveCart(cart); render(); updateHeaderCartBadge();
      });
    });
    listEl.querySelectorAll('[data-remove]').forEach(b=>{
      b.addEventListener('click', e=>{
        const id = Number(e.currentTarget.getAttribute('data-remove'));
        let cart = getCart().filter(i=>i.id!==id);
        saveCart(cart); render(); updateHeaderCartBadge();
      });
    });
  }

  render();
}

/* ---------- Checkout page ---------- */
function initCheckout() {
  const itemsEl = document.getElementById('checkoutItems');
  const totalEl = document.getElementById('checkoutTotal');
  const placeBtn = document.getElementById('placeOrder');
  if (!itemsEl || !totalEl || !placeBtn) return;

  function renderSummary() {
    const cart = getCart();
    itemsEl.innerHTML = '';
    let total = 0;
    cart.forEach(it=>{
      const p = getProductById(it.id);
      if (!p) return;
      const sub = p.price * it.qty;
      total += sub;
      const div = document.createElement('div');
      div.className = 'checkout-item';
      div.innerHTML = `<span>${p.title} x ${it.qty}</span><span>${fmtPKR(sub)}</span>`;
      itemsEl.appendChild(div);
    });
    totalEl.textContent = total.toLocaleString();
  }

  placeBtn.addEventListener('click', ()=>{
    // Basic field check (optional)
    // You can add more validations here if needed.
    alert('Thank you! Your order has been placed.');
    localStorage.removeItem('cart');
    updateHeaderCartBadge();
    location.href = 'index.html';
  });

  renderSummary();
}

/* ---------- Auth (login / signup) ---------- */
function initAuth() {
  // Signup
  const suForm = document.getElementById('signupForm');
  if (suForm) {
    suForm.addEventListener('submit', e=>{
      e.preventDefault();
      const name = (document.getElementById('su_name') || {}).value || '';
      const email = (document.getElementById('su_email') || {}).value || '';
      const pass = (document.getElementById('su_password') || {}).value || '';
      if (!name || !email || !pass) return alert('Please fill all fields.');
      localStorage.setItem('ub_user', JSON.stringify({name, email}));
      alert('Account created. You can now log in.');
      location.href = 'login.html';
    });
  }

  // Login
  const liForm = document.getElementById('loginForm');
  if (liForm) {
    liForm.addEventListener('submit', e=>{
      e.preventDefault();
      const email = (document.getElementById('li_email') || {}).value || '';
      const pass = (document.getElementById('li_password') || {}).value || '';
      // Demo only — accept anything if email matches "registered" user
      const saved = JSON.parse(localStorage.getItem('ub_user') || '{}');
      if (saved.email && email === saved.email && pass) {
        localStorage.setItem('ub_loggedin', '1');
        alert(`Welcome back, ${saved.name || 'User'}!`);
        location.href = 'index.html';
      } else {
        alert('Invalid credentials (demo). Try signing up first.');
      }
    });
  }
}

/* ---------- Initialize on DOM ready ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  updateHeaderCartBadge();
  setActiveNav();
  initMobileMenu();

  initHomeFeatured();   // only runs if #homeFeatured exists
  initShop();           // only runs if shop elements exist
  initProductDetail();  // only runs if product elements exist
  initCartPage();       // only runs if cart elements exist
  initCheckout();       // only runs if checkout elements exist
  initAuth();           // only runs if login/signup forms exist
});
// Sample product data
const products = {
  1: {
    title: "Cool Sneakers",
    desc: "Best comfort sneakers for daily wear.",
    price: "$49",
    img: "img/product1.jpg"
  },
  2: {
    title: "Casual Shirt",
    desc: "Stylish and comfy cotton shirt.",
    price: "$25",
    img: "img/product2.jpg"
  },
  3: {
    title: "Leather Jacket",
    desc: "Classic leather jacket for all seasons.",
    price: "$99",
    img: "img/product3.jpg"
  }
};

// Load product detail if on product.html
if (window.location.pathname.includes("product.html")) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (products[id]) {
    document.getElementById("product-title").textContent = products[id].title;
    document.getElementById("product-desc").textContent = products[id].desc;
    document.getElementById("product-price").textContent = products[id].price;
    document.getElementById("product-img").src = products[id].img;
  } else {
    document.getElementById("product-detail").innerHTML = "<h2>Product not found!</h2>";
  }
}
