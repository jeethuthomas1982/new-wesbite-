// Shared UI helpers for static GitHub Pages version

function toast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = message;
  container.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

function medicineIcon(category) {
  const icons = { 'Pain Relief': '💊', 'Antibiotics': '🧬', 'Allergy': '🌿', 'Gastrology': '🫁', 'Cardiovascular': '❤️', 'Diabetes': '🩺' };
  return icons[category] || '💊';
}

function renderProductCard(p) {
  return `
    <div class="product-card" onclick="location.href='product.html?id=${p.id}'">
      <div class="product-img-wrap">
        <img src="${imgPath(p.image)}" alt="${p.name}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div style="display:none;font-size:3rem;width:100%;height:100%;align-items:center;justify-content:center">${medicineIcon(p.category)}</div>
        ${p.discount ? `<span class="product-discount-badge">${p.discount}% OFF</span>` : ''}
        ${p.prescription_required ? `<span class="rx-badge">Rx</span>` : ''}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-generic">${p.generic_name}</div>
        <div class="product-mfr">${p.manufacturer}</div>
        <div class="product-price-row">
          <span class="product-price">₹${p.price.toFixed(2)}</span>
          <span class="product-mrp">₹${p.mrp.toFixed(2)}</span>
        </div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.75rem">${p.pack_size}</div>
        <button class="btn-add-cart" onclick="event.stopPropagation();addToCartFromCard(${p.id})">Add to Cart</button>
      </div>
    </div>`;
}

function addToCartFromCard(productId) {
  if (!Auth.isLoggedIn()) {
    toast('Please login to add items to cart', 'error');
    setTimeout(() => location.href = 'login.html', 1200);
    return;
  }
  Cart.add(productId, 1);
  toast('Added to cart!');
  refreshCartBadge();
}

function refreshCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = Auth.isLoggedIn() ? Cart.count() : 0;
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

function renderNavbar() {
  const user = Auth.getSession();
  const loggedIn = Auth.isLoggedIn();
  return `
    <nav class="navbar">
      <div class="nav-inner">
        <a class="nav-logo" href="index.html">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
            <path d="M8 12h8M12 8v8"/>
          </svg>
          MediShop
        </a>
        <div class="nav-search">
          <input type="text" id="nav-search-input" placeholder="Search medicines..."
            onkeydown="if(event.key==='Enter') doSearch()">
          <button onclick="doSearch()">Search</button>
        </div>
        <div class="nav-actions">
          ${loggedIn ? `
            <a class="nav-btn" href="index.html">Home</a>
            <span class="nav-btn" style="cursor:default">Hi, ${user.name.split(' ')[0]}</span>
            <a class="nav-btn cart-btn" href="cart.html" style="position:relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Cart
              <span class="cart-badge" id="cart-badge" style="display:none">0</span>
            </a>
            <button class="nav-btn btn-login-nav" onclick="Auth.logout();location.href='login.html'">Logout</button>
          ` : `
            <a class="nav-btn" href="index.html">Home</a>
            <a class="nav-btn btn-login-nav" href="login.html">Login</a>
            <a class="nav-btn cart-btn" href="cart.html" style="position:relative">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Cart
            </a>
          `}
        </div>
      </div>
    </nav>
    <div class="trust-bar">
      <div class="trust-inner">
        <div class="trust-item">✅ Genuine Medicines</div>
        <div class="trust-item">🚚 Free Delivery over ₹499</div>
        <div class="trust-item">🔒 Secure Payments</div>
        <div class="trust-item">↩️ Easy Returns</div>
        <div class="trust-item">⚡ Express Delivery</div>
      </div>
    </div>`;
}

function renderFooter() {
  return `
    <footer>
      <p style="margin-bottom:0.5rem"><strong style="color:white">MediShop</strong> — Your trusted online pharmacy</p>
      <p>© ${new Date().getFullYear()} MediShop. All medicines sold through licensed pharmacists only.</p>
      <p style="margin-top:0.5rem;font-size:0.75rem">⚠️ Prescription medicines require a valid prescription from a registered medical practitioner.</p>
    </footer>`;
}

function doSearch() {
  const q = document.getElementById('nav-search-input')?.value?.trim();
  if (q) location.href = `index.html?search=${encodeURIComponent(q)}`;
  else location.href = 'index.html';
}
