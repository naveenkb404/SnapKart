/**
 * SnapKart Customer Frontend Interactive Controller
 * Connects Sample Data, Store, Visual Search, Cart, Multi-Shop Comparisons,
 * Checkout, and Account Management.
 */

const CustomerUI = (function() {
  'use strict';

  let currentCategory = 'all';
  let searchQuery = '';

  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  function init() {
    renderLocation();
    renderCategories();
    renderPromos();
    renderShops();
    renderProducts();
    renderCart();
    renderAuth();
    initSearch();
    SnapSearch.init();
  }

  /* ==========================================================================
     1. Location Hub Selector
     ========================================================================== */
  function renderLocation() {
    const loc = CustomerStore.getSelectedLocation();
    const locPillText = document.getElementById('navbar-location-text');
    const locationBanner = document.getElementById('location-prompt-banner');
    
    if (locPillText) {
      if (loc && loc.name) {
        locPillText.innerHTML = `${loc.name} • <span style="color:var(--color-secondary); font-weight:700;">Active Area</span>`;
      } else {
        locPillText.innerHTML = `<span style="color:var(--color-secondary); font-weight:700;">Select Delivery Location ▾</span>`;
      }
    }

    if (locationBanner) {
      if (!loc) {
        locationBanner.style.display = 'block';
      } else {
        locationBanner.style.display = 'none';
      }
    }

    // Modal locations list
    const locList = document.getElementById('location-options-list');
    if (locList) {
      locList.innerHTML = `
        <div style="margin-bottom:var(--space-3);">
          <div class="search-input-group" style="margin-bottom:var(--space-3);">
            <span style="color:var(--color-text-subtle); margin-right:6px;">📍</span>
            <input type="text" id="custom-location-input" placeholder="Type neighborhood or area (e.g. Indiranagar)...">
            <button type="button" class="btn btn-secondary btn-sm" onclick="setCustomLocationFromInput()">Set Area</button>
          </div>
          <div class="text-xs text-muted mb-2 font-bold uppercase">Popular Verified Neighbourhood Hubs:</div>
        </div>
      ` + SnapData.locations.map(l => `
        <div class="address-select-card ${loc && l.id === loc.id ? 'selected' : ''}" onclick="CustomerStore.setSelectedLocation('${l.id}'); SnapKart.closeModal('location-modal');">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-weight:700; color:var(--color-primary);">${l.name}</div>
              <div class="text-xs text-muted">${l.area}, ${l.city} • (Radius: ${l.radius})</div>
            </div>
            ${loc && l.id === loc.id ? '<span class="badge badge-orange">Selected</span>' : '<button class="btn btn-outline btn-sm">Select</button>'}
          </div>
        </div>
      `).join('');
    }
  }

  window.setCustomLocationFromInput = function() {
    const input = document.getElementById('custom-location-input');
    if (input && input.value.trim()) {
      CustomerStore.setSelectedLocation(input.value.trim());
      SnapKart.closeModal('location-modal');
    } else {
      SnapKart.showToast('Please enter an area or neighborhood name', 'warning');
    }
  };

  /* ==========================================================================
     2. Categories & Promotional Banners
     ========================================================================== */
  function renderCategories() {
    const strip = document.getElementById('category-strip');
    if (!strip) return;

    strip.innerHTML = SnapData.categories.map(cat => `
      <button class="category-chip ${cat.id === currentCategory ? 'active' : ''}" data-cat="${cat.id}" onclick="CustomerUI.setCategory('${cat.id}')">
        <span class="category-icon">${cat.icon}</span>
        <span>${cat.name}</span>
        <span class="badge badge-neutral" style="font-size:10px; margin-left:4px;">${cat.count}</span>
      </button>
    `).join('');
  }

  function setCategory(catId) {
    currentCategory = catId;
    renderCategories();
    renderProducts();
  }

  function renderPromos() {
    const container = document.getElementById('promo-banner-strip');
    if (!container) return;

    container.innerHTML = SnapData.promos.map(promo => `
      <div class="promo-card" style="background: ${promo.bgGradient};">
        <div>
          <span class="promo-badge">${promo.badge}</span>
          <h3 class="promo-title">${promo.title}</h3>
          <p class="promo-sub">${promo.subtitle}</p>
        </div>
        <div>
          <button class="btn btn-sm btn-secondary" onclick="CustomerUI.handlePromoAction('${promo.action}')">
            ${promo.ctaText} →
          </button>
        </div>
      </div>
    `).join('');
  }

  function handlePromoAction(action) {
    if (action === 'openVisualSearch') {
      SnapKart.openModal('visual-search-modal');
      SnapSearch.startCamera();
    } else if (action === 'scrollToShops') {
      const el = document.getElementById('nearby-shops-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* ==========================================================================
     3. Search Filtering (Live Keyword & Autocomplete)
     ========================================================================== */
  function initSearch() {
    const input = document.getElementById('marketplace-search-input');
    if (!input) return;

    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderProducts();
    });
  }

  /* ==========================================================================
     4. Nearby Shops Grid
     ========================================================================== */
  function renderShops() {
    const container = document.getElementById('nearby-shops-grid');
    if (!container) return;

    container.innerHTML = SnapData.shops.map(shop => `
      <div class="store-card" onclick="CustomerUI.openShopDetail('${shop.id}')" title="Click to view store details and inventory">
        <div class="store-avatar">${shop.avatar}</div>
        <div class="store-info">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div class="store-title">${shop.name}</div>
            <span class="badge badge-success" style="font-size:10px;">⚡ ${shop.deliveryTimeMin}m</span>
          </div>
          <p class="text-xs text-muted" style="margin-bottom:4px; line-height:1.3;">${shop.address}</p>
          <div class="store-meta">
            <span>⭐ ${shop.rating} (${shop.reviewsCount})</span>
            <span>•</span>
            <span class="text-secondary font-bold">${shop.distanceKm} km away</span>
            <span>•</span>
            <span class="text-xs text-muted">${shop.category}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ==========================================================================
     5. Products Grid & Multi-Vendor Highlights
     ========================================================================== */
  function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const filtered = SnapData.products.filter(p => {
      const matchCat = (currentCategory === 'all' || p.category === currentCategory);
      const matchSearch = (!searchQuery || p.name.toLowerCase().includes(searchQuery) || p.brand.toLowerCase().includes(searchQuery));
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>No products match your search</h3>
          <p class="text-sm">Try searching for other items or snap a photo of what you want!</p>
          <button class="btn btn-secondary btn-sm mt-3" onclick="SnapKart.openModal('visual-search-modal'); SnapSearch.startCamera();">
            📷 Try Visual Search
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(prod => {
      const lowestShop = prod.shopPrices[0];
      const otherShopsCount = prod.shopPrices.length - 1;

      return `
        <div class="product-card" data-category="${prod.category}" data-product-tag="${prod.tag}">
          <div class="product-image-wrap" onclick="CustomerUI.openProductDetail('${prod.id}')" style="cursor:pointer;">
            <div class="product-snap-match-badge">📷 Visual Index Active</div>
            <div class="product-eta-badge">⚡ ${lowestShop.deliveryMin}m delivery</div>
            <img src="${prod.image}" alt="${prod.name}">
          </div>

          <div class="product-info">
            <div class="product-vendor">
              <span>🏪 ${lowestShop.shopName}</span>
              <span class="product-vendor-dist">(${lowestShop.distanceKm} km)</span>
            </div>

            <h4 class="product-title" onclick="CustomerUI.openProductDetail('${prod.id}')" style="cursor:pointer;">
              ${prod.name}
            </h4>

            <!-- Multi-Store Price Comparison Hint -->
            <div style="margin-bottom: var(--space-2);">
              <span class="text-xs text-muted" style="display:flex; align-items:center; gap:4px; cursor:pointer;" onclick="CustomerUI.openProductDetail('${prod.id}')">
                <span>🔄 Compare in <strong>${prod.shopPrices.length} nearby stores</strong></span>
                <span class="badge badge-orange" style="font-size:10px;">View</span>
              </span>
            </div>

            <div class="product-footer">
              <div>
                <span class="product-price">$${lowestShop.price.toFixed(2)}</span>
                <span class="product-old-price">$${prod.mrp.toFixed(2)}</span>
              </div>
              <div style="display:flex; gap:6px;">
                <button class="btn btn-outline btn-sm" onclick="CustomerUI.openProductDetail('${prod.id}')" title="Compare stores">
                  Compare
                </button>
                <button class="btn btn-secondary btn-sm" onclick="CustomerStore.addToCart(SnapData.products.find(p => p.id === '${prod.id}'), '${lowestShop.shopId}', ${lowestShop.price})">
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ==========================================================================
     6. Product Detail & Multi-Shop Price Comparison Modal
     ========================================================================== */
  function openProductDetail(productId) {
    const prod = SnapData.products.find(p => p.id === productId);
    if (!prod) return;

    const modalBody = document.getElementById('product-detail-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="grid-2" style="margin-bottom: var(--space-4);">
        <div style="background:var(--color-surface-alt); border-radius:var(--radius-lg); display:flex; align-items:center; justify-content:center; padding:1.5rem;">
          <img src="${prod.image}" alt="${prod.name}" style="max-height:220px; object-fit:contain;">
        </div>
        <div>
          <span class="badge badge-orange" style="margin-bottom:6px;">${prod.brand}</span>
          <h3 style="font-size:var(--font-size-xl); margin-bottom:6px; color:var(--color-primary);">${prod.name}</h3>
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
            <span style="color:#F59E0B; font-weight:bold;">⭐ ${prod.rating}</span>
            <span class="text-xs text-muted">(${prod.reviewsCount} verified local reviews)</span>
          </div>
          <p class="text-sm text-muted" style="margin-bottom:12px;">${prod.description}</p>
          <div style="display:flex; flex-wrap:wrap; gap:6px;">
            ${prod.specs.map(s => `<span class="badge badge-neutral" style="font-size:11px;"><strong>${s.label}:</strong> ${s.value}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Multi-Shop Price & Stock Comparison Section -->
      <div class="compare-shops-box">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div>
            <h4 style="font-size:var(--font-size-sm); color:var(--color-primary); margin-bottom:2px;">
              Nearby Shops Selling This Product (${prod.shopPrices.length} Available)
            </h4>
            <p class="text-xs text-muted">Compare live prices, distances, and store stock confirmation times</p>
          </div>
          <span class="badge badge-success">📍 Stock Verified</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          ${prod.shopPrices.map(sp => `
            <div class="shop-price-row ${sp.isLowestPrice ? 'lowest-price' : ''}">
              <div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <strong style="color:var(--color-primary);">${sp.shopName}</strong>
                  ${sp.isLowestPrice ? '<span class="badge badge-success" style="font-size:10px;">Lowest Price</span>' : ''}
                </div>
                <div class="text-xs text-muted" style="margin-top:2px;">
                  <span>📍 ${sp.distanceKm} km away</span> • 
                  <span>⚡ ${sp.deliveryMin} mins delivery</span> • 
                  <span class="stock-freshness-pill">🕒 Verified ${sp.stockConfirmedMinsAgo}m ago</span>
                </div>
                <div class="text-xs" style="color:var(--color-secondary); font-weight:600; margin-top:2px;">
                  ${sp.stockStatus}
                </div>
              </div>

              <div style="display:flex; align-items:center; gap:12px;">
                <div style="text-align:right;">
                  <span style="font-size:var(--font-size-lg); font-weight:800; color:var(--color-primary);">$${sp.price.toFixed(2)}</span>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="CustomerStore.addToCart(SnapData.products.find(p => p.id === '${prod.id}'), '${sp.shopId}', ${sp.price}); SnapKart.closeModal('product-detail-modal');">
                  Select & Add
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    SnapKart.openModal('product-detail-modal');
  }

  /* ==========================================================================
     7. Shop Details & Navigation Modal / View
     ========================================================================== */
  function openShopDetail(shopId) {
    const shop = SnapData.shops.find(s => s.id === shopId);
    if (!shop) return;

    const modalBody = document.getElementById('shop-detail-modal-body');
    if (!modalBody) return;

    // Filter products available from this shop
    const shopProducts = SnapData.products.filter(p => p.shopPrices.some(sp => sp.shopId === shop.id));

    modalBody.innerHTML = `
      <!-- Shop Header Profile -->
      <div style="display:flex; gap:var(--space-4); margin-bottom:var(--space-5);">
        <div class="store-avatar" style="width:64px; height:64px; font-size:1.5rem;">${shop.avatar}</div>
        <div style="flex-grow:1;">
          <div style="display:flex; align-items:center; gap:8px;">
            <h3 style="font-size:var(--font-size-xl); color:var(--color-primary);">${shop.name}</h3>
            ${shop.verified ? '<span class="badge badge-success">✓ Verified Vendor</span>' : ''}
          </div>
          <p class="text-xs text-muted" style="margin-top:2px;">${shop.address}</p>
          <div class="store-meta" style="margin-top:4px;">
            <span>⭐ ${shop.rating} (${shop.reviewsCount} reviews)</span>
            <span>•</span>
            <span class="text-secondary font-bold">${shop.distanceKm} km from you</span>
            <span>•</span>
            <span>🕒 Open: ${shop.hours}</span>
          </div>
        </div>
      </div>

      <!-- Interactive Map / Navigation Placeholder -->
      <div class="card p-3 mb-4" style="background:#F1F5F9; border:1px solid var(--color-border);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
          <span class="text-xs font-bold text-primary">🗺️ Hyperlocal Route & Store Directions</span>
          <button class="btn btn-outline btn-sm" onclick="SnapKart.showToast('Launching GPS turn-by-turn navigation to ${shop.name}...', 'info')">
            Get Directions (${shop.distanceKm} km)
          </button>
        </div>
        <div style="height:140px; background:#E2E8F0; border-radius:var(--radius-md); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden;">
          <div style="text-align:center;">
            <div style="font-size:2rem; margin-bottom:4px;">📍</div>
            <div style="font-weight:700; color:var(--color-primary); font-size:13px;">${shop.name}</div>
            <span class="text-xs text-muted">Est. Drive: 4 mins • Bicycle: 7 mins • Walk: 12 mins</span>
          </div>
        </div>
      </div>

      <!-- Shop Products Catalog -->
      <div style="margin-top:var(--space-4);">
        <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">
          Available Products at this Store (${shopProducts.length})
        </h4>

        <div style="display:flex; flex-direction:column; gap:var(--space-3);">
          ${shopProducts.map(prod => {
            const sp = prod.shopPrices.find(s => s.shopId === shop.id);
            return `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:var(--space-3); background:var(--color-surface); border:1px solid var(--color-border); border-radius:var(--radius-md);">
                <div style="display:flex; align-items:center; gap:var(--space-3);">
                  <img src="${prod.image}" alt="${prod.name}" style="width:48px; height:48px; object-fit:cover; border-radius:var(--radius-sm); background:#E2E8F0;">
                  <div>
                    <h5 style="font-size:var(--font-size-sm); color:var(--color-primary); margin-bottom:2px;">${prod.name}</h5>
                    <span class="text-xs text-muted">${sp.stockStatus} • Confirmed ${sp.stockConfirmedMinsAgo}m ago</span>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                  <span style="font-weight:800; color:var(--color-primary);">$${sp.price.toFixed(2)}</span>
                  <button class="btn btn-secondary btn-sm" onclick="CustomerStore.addToCart(SnapData.products.find(p => p.id === '${prod.id}'), '${shop.id}', ${sp.price})">
                    + Add
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    SnapKart.openModal('shop-detail-modal');
  }

  /* ==========================================================================
     8. Cart Drawer Rendering & Calculations
     ========================================================================== */
  function renderCart() {
    const cart = CustomerStore.getCart();
    const count = CustomerStore.getCartItemsCount();
    const calc = CustomerStore.getCartCalculations();

    // Top navbar badges
    const badge = document.getElementById('cart-count-badge');
    const mobileBadge = document.getElementById('mobile-cart-badge');
    if (badge) badge.textContent = count;
    if (mobileBadge) mobileBadge.textContent = count;

    const drawerBody = document.getElementById('drawer-cart-items');
    if (!drawerBody) return;

    if (cart.items.length === 0) {
      drawerBody.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--color-text-muted);">
          <div style="font-size: 3.5rem; margin-bottom: 1rem;">🛒</div>
          <h4>Your cart is empty</h4>
          <p class="text-sm">Snap or browse items from verified neighbourhood stores!</p>
          <button class="btn btn-secondary btn-sm mt-3" onclick="SnapKart.closeDrawer('cart-drawer'); SnapKart.openModal('visual-search-modal'); SnapSearch.startCamera();">
            📷 Snap & Find Products
          </button>
        </div>
      `;
      updateCartTotals(0, 0, 0, 0);
      return;
    }

    // Render single shop banner
    let html = `
      <div class="single-shop-banner">
        <div>
          <span style="font-weight:700;">Ordering from:</span>
          <strong>${cart.shopName}</strong>
        </div>
        <span class="badge badge-success" style="font-size:10px;">Single Shop Guaranteed</span>
      </div>

      <!-- Fulfillment Switcher: Delivery vs Store Pickup -->
      <div class="fulfillment-pill-group">
        <button class="fulfillment-pill ${cart.fulfillmentType === 'delivery' ? 'active' : ''}" onclick="CustomerStore.setFulfillmentType('delivery')">
          🛵 Doorstep Delivery ($${calc.deliveryFee.toFixed(2)})
        </button>
        <button class="fulfillment-pill ${cart.fulfillmentType === 'pickup' ? 'active' : ''}" onclick="CustomerStore.setFulfillmentType('pickup')">
          🏬 Store Pickup (FREE)
        </button>
      </div>

      <!-- Item Rows -->
      <div style="display:flex; flex-direction:column; gap:var(--space-2);">
    `;

    cart.items.forEach(item => {
      html += `
        <div class="cart-item-row">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h5 style="font-size:0.875rem; margin-bottom:2px; color:var(--color-primary);">${item.name}</h5>
            <div style="font-weight:800; color:var(--color-primary); font-size:0.875rem;">$${item.price.toFixed(2)}</div>
          </div>
          <div class="cart-qty-ctrl">
            <button class="cart-qty-btn" onclick="CustomerStore.updateItemQty('${item.id}', -1)">−</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn" onclick="CustomerStore.updateItemQty('${item.id}', 1)">+</button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    drawerBody.innerHTML = html;

    updateCartTotals(calc.subtotal, calc.deliveryFee, calc.tax, calc.total);
  }

  function updateCartTotals(subtotal, deliveryFee, tax, total) {
    const subEl = document.getElementById('cart-subtotal');
    const feeEl = document.getElementById('cart-delivery-fee');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');

    if (subEl) subEl.textContent = `$${subtotal.toFixed(2)}`;
    if (feeEl) feeEl.textContent = `$${deliveryFee.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
  }

  /* ==========================================================================
     9. Checkout Flow (Address, Payment & Order Placement)
     ========================================================================== */
  function openCheckoutModal() {
    const cart = CustomerStore.getCart();
    if (cart.items.length === 0) {
      SnapKart.showToast('Your cart is empty! Add items from any shop first.', 'warning');
      return;
    }

    SnapKart.closeDrawer('cart-drawer');
    const calc = CustomerStore.getCartCalculations();
    const addresses = CustomerStore.getAddresses();
    const modalBody = document.getElementById('checkout-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-4);">
        <div>
          <span class="badge badge-orange">1-Shop Express Order</span>
          <h3 style="font-size:var(--font-size-lg); color:var(--color-primary); margin-top:2px;">${cart.shopName}</h3>
        </div>
        <span class="badge badge-success">⚡ ${cart.fulfillmentType === 'pickup' ? 'Ready in 10m' : '15-20 min Delivery'}</span>
      </div>

      <!-- Fulfillment Choice -->
      <div class="fulfillment-pill-group mb-4">
        <button class="fulfillment-pill ${cart.fulfillmentType === 'delivery' ? 'active' : ''}" onclick="CustomerStore.setFulfillmentType('delivery'); CustomerUI.openCheckoutModal();">
          🛵 Deliver to Address
        </button>
        <button class="fulfillment-pill ${cart.fulfillmentType === 'pickup' ? 'active' : ''}" onclick="CustomerStore.setFulfillmentType('pickup'); CustomerUI.openCheckoutModal();">
          🏬 Self Pickup at Counter
        </button>
      </div>

      ${cart.fulfillmentType === 'delivery' ? `
        <!-- Delivery Address Selection -->
        <div style="margin-bottom:var(--space-4);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
            <label class="form-label" style="margin-bottom:0;">Select Delivery Address</label>
            <button class="btn btn-ghost btn-sm" onclick="SnapKart.openModal('add-address-modal')">+ New Address</button>
          </div>
          <div id="checkout-address-list">
            ${addresses.map((addr, idx) => `
              <div class="address-select-card ${addr.isDefault ? 'selected' : ''}" onclick="CustomerUI.selectCheckoutAddress('${addr.id}')">
                <div style="display:flex; align-items:center; justify-content:space-between;">
                  <div>
                    <span style="font-weight:700; color:var(--color-primary);">${addr.icon} ${addr.label}</span>
                    <p class="text-xs text-muted" style="margin-bottom:0;">${addr.line1}, ${addr.city} (${addr.pincode})</p>
                  </div>
                  <input type="radio" name="checkout_addr" value="${addr.id}" ${addr.isDefault ? 'checked' : ''}>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : `
        <!-- Store Pickup Address Info -->
        <div class="card p-3 mb-4" style="background:#F0FDF4; border:1px solid #BBF7D0;">
          <h5 style="color:#065F46; font-size:13px; margin-bottom:4px;">🏬 Pickup Location & Instructions:</h5>
          <p class="text-xs text-muted" style="margin-bottom:4px;">${cart.shopName}</p>
          <p class="text-xs text-muted" style="margin-bottom:0;">Show your order verification pickup code at the counter. Zero delivery fee applies.</p>
        </div>
      `}

      <!-- Delivery Instructions -->
      <div class="form-group mb-4">
        <label class="form-label">Drop-off Note / Landmark</label>
        <input type="text" class="form-control" id="checkout-notes" placeholder="e.g. Ring the doorbell, leave at front desk">
      </div>

      <!-- Payment Simulation Disclaimer -->
      <div class="alert alert-info mb-4" style="font-size:12px;">
        <span class="alert-icon">💳</span>
        <div class="alert-content">
          <strong>Demonstration Mode:</strong> Payment gateway is simulated. Order will be placed as <em>Cash on Delivery / Card on Delivery</em>.
        </div>
      </div>

      <!-- Price Breakdown -->
      <div class="card p-4" style="background:var(--color-surface-alt);">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:var(--font-size-sm);">
          <span>Items Subtotal:</span>
          <span class="font-bold">$${calc.subtotal.toFixed(2)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px; font-size:var(--font-size-sm);">
          <span>Fulfillment (${cart.fulfillmentType === 'pickup' ? 'Self Pickup' : 'Hyperlocal Delivery'}):</span>
          <span class="font-bold" style="color:var(--color-success);">$${calc.deliveryFee.toFixed(2)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:var(--font-size-sm);">
          <span>Taxes (5%):</span>
          <span class="font-bold">$${calc.tax.toFixed(2)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-top:1px dashed var(--color-border); padding-top:8px; font-size:var(--font-size-lg); font-weight:800; color:var(--color-primary);">
          <span>Total:</span>
          <span>$${calc.total.toFixed(2)}</span>
        </div>
      </div>
    `;

    SnapKart.openModal('checkout-modal');
  }

  function selectCheckoutAddress(addrId) {
    const cards = document.querySelectorAll('#checkout-address-list .address-select-card');
    cards.forEach(card => card.classList.remove('selected'));
    const clicked = event.currentTarget;
    if (clicked) {
      clicked.classList.add('selected');
      const radio = clicked.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    }
  }

  function confirmOrderPlacement() {
    const notesInput = document.getElementById('checkout-notes');
    const notes = notesInput ? notesInput.value : '';
    const newOrder = CustomerStore.placeOrder({ notes });

    if (newOrder) {
      SnapKart.closeModal('checkout-modal');
      openOrderTracker(newOrder.id);
    }
  }

  /* ==========================================================================
     10. Customer Account, Saved Addresses & Order Tracking UI
     ========================================================================== */
  function renderAuth() {
    const auth = CustomerStore.getAuth();
    const nameEl = document.getElementById('nav-user-name');
    if (nameEl) nameEl.textContent = auth.isAuthenticated ? auth.user.name : 'Sign In';
  }

  function openAccountModal(initialTab = 'orders') {
    switchAccountTab(initialTab);
    SnapKart.openModal('account-modal');
  }

  function switchAccountTab(tabKey) {
    document.querySelectorAll('.account-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabKey);
    });

    const contentBox = document.getElementById('account-tab-content');
    if (!contentBox) return;

    if (tabKey === 'orders') {
      renderOrdersTab(contentBox);
    } else if (tabKey === 'addresses') {
      renderAddressesTab(contentBox);
    } else if (tabKey === 'profile') {
      renderProfileTab(contentBox);
    }
  }

  function renderOrdersTab(container) {
    const orders = CustomerStore.getOrders();
    if (orders.length === 0) {
      container.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:var(--color-text-muted);">
          <div style="font-size:3rem; margin-bottom:1rem;">📦</div>
          <h4>No orders yet</h4>
          <p class="text-sm">Start your first hyperlocal order with 15-minute delivery!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:var(--space-3);">
        ${orders.map(ord => `
          <div class="card p-4" style="border:1px solid var(--color-border);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <div>
                <strong style="color:var(--color-primary);">${ord.id}</strong>
                <span class="text-xs text-muted" style="margin-left:6px;">${ord.date}</span>
              </div>
              <span class="badge ${ord.statusCode === 'delivered' ? 'badge-success' : 'badge-orange'}">
                ${ord.status}
              </span>
            </div>

            <div style="font-size:var(--font-size-sm); color:var(--color-primary); font-weight:700; margin-bottom:4px;">
              🏪 ${ord.shopName}
            </div>

            <div class="text-xs text-muted" style="margin-bottom:8px;">
              ${ord.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
            </div>

            <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px dashed var(--color-border); padding-top:8px;">
              <span style="font-weight:800; color:var(--color-primary);">$${ord.total.toFixed(2)} (${ord.fulfillmentType})</span>
              <button class="btn btn-secondary btn-sm" onclick="CustomerUI.openOrderTracker('${ord.id}')">
                📍 Track Order Live
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderAddressesTab(container) {
    const addresses = CustomerStore.getAddresses();
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-4);">
        <h4 style="font-size:var(--font-size-base); color:var(--color-primary);">Saved Delivery Locations</h4>
        <button class="btn btn-secondary btn-sm" onclick="SnapKart.openModal('add-address-modal')">+ Add Address</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:var(--space-3);">
        ${addresses.map(addr => `
          <div class="card p-4" style="display:flex; align-items:flex-start; justify-content:space-between;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:1.2rem;">${addr.icon}</span>
                <strong style="color:var(--color-primary);">${addr.label}</strong>
                ${addr.isDefault ? '<span class="badge badge-success" style="font-size:10px;">Default</span>' : ''}
              </div>
              <p class="text-xs text-muted" style="margin-top:4px; margin-bottom:2px;">${addr.recipient} • ${addr.phone}</p>
              <p class="text-xs text-muted" style="margin-bottom:0;">${addr.line1}, ${addr.line2 ? addr.line2 + ', ' : ''}${addr.city} - ${addr.pincode}</p>
            </div>
            <div style="display:flex; gap:6px;">
              ${!addr.isDefault ? `<button class="btn btn-outline btn-sm" onclick="CustomerStore.setDefaultAddress('${addr.id}')">Set Default</button>` : ''}
              <button class="btn btn-ghost btn-sm" onclick="CustomerStore.deleteAddress('${addr.id}')">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderProfileTab(container) {
    const user = CustomerStore.getAuth().user;
    container.innerHTML = `
      <div class="card p-5">
        <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-4);">Personal Profile</h4>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" value="${user.name}" id="profile-name">
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" value="${user.email}" id="profile-email">
          </div>
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-control" value="${user.phone}" id="profile-phone">
          </div>
          <div class="form-group">
            <label class="form-label">Default Hub</label>
            <input type="text" class="form-control" value="${user.defaultLocation}" readonly style="background:#F1F5F9;">
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:var(--space-3);">
          <button class="btn btn-secondary btn-sm" onclick="SnapKart.showToast('Profile details updated successfully!', 'success')">Save Changes</button>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     11. Live Order Tracker Modal (Interactive Stepper)
     ========================================================================== */
  function openOrderTracker(orderId) {
    const orders = CustomerStore.getOrders();
    const order = orders.find(o => o.id === orderId) || orders[0];
    if (!order) return;

    const modalBody = document.getElementById('order-tracker-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="background:linear-gradient(135deg, var(--color-primary), #1C2D54); color:#FFFFFF; border-radius:var(--radius-lg); padding:var(--space-4) var(--space-5); margin-bottom:var(--space-4);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:11px; color:#FF8C42; font-weight:bold;">LIVE TRACKING</span>
            <h3 style="color:#FFFFFF; font-size:var(--font-size-base); margin-bottom:2px;">Order #${order.id}</h3>
            <span class="text-xs" style="color:#CBD5E1;">Fulfillment: ${order.fulfillmentType}</span>
          </div>
          <div style="text-align:right;">
            <div style="font-size:var(--font-size-lg); font-weight:800; color:#FF8C42;">${order.eta || 'Hyperlocal Delivery'}</div>
            <span class="text-xs" style="color:#CBD5E1;">Fulfillment Status</span>
          </div>
        </div>
      </div>

      <!-- Timeline Stepper -->
      <div class="order-tracker-timeline">
        ${order.timeline.map(step => `
          <div class="order-tracker-step ${step.done ? 'done' : (step.current ? 'active' : '')}">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <strong style="color:var(--color-primary); font-size:var(--font-size-sm);">${step.label}</strong>
              <span class="text-xs text-muted">${step.time}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Merchant & Rider Details -->
      <div class="card p-3 mb-4" style="background:var(--color-surface-alt);">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <div>
            <span class="text-xs text-muted">Merchant Store</span>
            <div class="font-bold text-primary">${order.shopName}</div>
          </div>
          <div style="text-align:right;">
            <span class="text-xs text-muted">Assigned Rider</span>
            <div class="font-bold text-primary">${order.driverName || 'Alex M. (#DL-402)'}</div>
          </div>
        </div>
      </div>

      <!-- Itemized Receipt -->
      <div class="card p-4">
        <h5 style="font-size:var(--font-size-xs); color:var(--color-text-muted); text-transform:uppercase; margin-bottom:8px;">Receipt Breakdown</h5>
        ${order.items.map(i => `
          <div style="display:flex; justify-content:space-between; font-size:var(--font-size-xs); margin-bottom:4px;">
            <span>${i.qty}x ${i.name}</span>
            <span>$${(i.price * i.qty).toFixed(2)}</span>
          </div>
        `).join('')}
        <div style="display:flex; justify-content:space-between; border-top:1px dashed var(--color-border); padding-top:6px; margin-top:6px; font-weight:800; color:var(--color-primary);">
          <span>Total Paid:</span>
          <span>$${order.total.toFixed(2)}</span>
        </div>
      </div>
    `;

    SnapKart.openModal('order-tracker-modal');
  }

  return {
    init,
    setCategory,
    handlePromoAction,
    openProductDetail,
    openShopDetail,
    renderCart,
    openCheckoutModal,
    selectCheckoutAddress,
    confirmOrderPlacement,
    openAccountModal,
    switchAccountTab,
    openOrderTracker
  };
})();

window.CustomerUI = CustomerUI;
