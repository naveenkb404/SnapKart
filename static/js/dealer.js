/**
 * SnapKart Dealer Dashboard Controller
 * Connects DealerData, Order Pipeline, Product Management, Inventory,
 * Reservations, Shop Settings, and Finance.
 */

const DealerApp = (function() {
  'use strict';

  // Working state cloned from DealerData
  let state = {
    profile: DealerData.merchantProfile,
    shop: DealerData.shopSettings,
    products: [...DealerData.products],
    orders: [...DealerData.orders],
    reservations: [...DealerData.reservations],
    finances: DealerData.finances,
    currentView: 'dashboard',
    inventoryFilter: 'all',
    productSearch: ''
  };

  // Temp state for order rejection or modal handling
  let activeRejectOrderId = null;
  let activeVerifyResId = null;

  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  function init() {
    initStoreToggle();
    initSidebarNav();
    renderView('dashboard');
  }

  /* ==========================================================================
     1. Navigation & View Routing
     ========================================================================== */
  function initSidebarNav() {
    const links = document.querySelectorAll('.sidebar-link[data-dealer-view]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewKey = link.getAttribute('data-dealer-view');
        switchView(viewKey);
      });
    });
  }

  function switchView(viewKey) {
    state.currentView = viewKey;

    // Update sidebar active classes
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-dealer-view') === viewKey);
    });

    // Close mobile sidebar if open
    const sidebar = document.querySelector('.portal-sidebar');
    if (sidebar) sidebar.classList.remove('show');

    renderView(viewKey);
  }

  function renderView(viewKey) {
    const container = document.getElementById('dealer-main-content-area');
    if (!container) return;

    // Update section title in header
    const titles = {
      dashboard: 'Store Console & Live Telemetry',
      orders: 'Live Hyperlocal Dispatch Pipeline',
      products: 'Product Catalog & Variant Management',
      inventory: 'Inventory Quick Stock & Price Controls',
      reservations: 'In-Store Pickup Reservations (Click & Collect)',
      shop: 'Store Profile, Radius & Operating Hours',
      finance: 'Financial Ledger & Bank Settlements',
      verification: 'Merchant Authentication & KYC Verification'
    };
    const titleEl = document.getElementById('dealer-header-title');
    if (titleEl) titleEl.textContent = titles[viewKey] || 'Store Console';

    if (viewKey === 'dashboard') renderDashboardView(container);
    else if (viewKey === 'orders') renderOrdersView(container);
    else if (viewKey === 'products') renderProductsView(container);
    else if (viewKey === 'inventory') renderInventoryView(container);
    else if (viewKey === 'reservations') renderReservationsView(container);
    else if (viewKey === 'shop') renderShopView(container);
    else if (viewKey === 'finance') renderFinanceView(container);
    else if (viewKey === 'verification') renderVerificationView(container);

    updateBadgeCounts();
  }

  function updateBadgeCounts() {
    const activeOrdersCount = state.orders.filter(o => o.status !== 'dispatched' && o.status !== 'rejected').length;
    const activeResCount = state.reservations.filter(r => r.status !== 'collected' && r.status !== 'cancelled').length;

    const ordBadge = document.getElementById('sidebar-orders-badge');
    const resBadge = document.getElementById('sidebar-res-badge');
    if (ordBadge) ordBadge.textContent = activeOrdersCount;
    if (resBadge) resBadge.textContent = activeResCount;
  }

  /* ==========================================================================
     2. Store Availability Toggle (Online / Paused)
     ========================================================================== */
  function initStoreToggle() {
    const toggle = document.getElementById('dealer-store-toggle');
    const statusText = document.getElementById('dealer-store-status-text');
    if (!toggle || !statusText) return;

    toggle.checked = (state.shop.storeStatus === 'open');

    toggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.shop.storeStatus = 'open';
        statusText.textContent = 'Store Open (Accepting Orders)';
        statusText.parentElement.className = 'store-status-active';
        SnapKart.showToast('Store is now OPEN to customer marketplace orders', 'success');
      } else {
        state.shop.storeStatus = 'paused';
        statusText.textContent = 'Store Paused (Offline)';
        statusText.parentElement.className = 'text-muted text-sm font-semibold';
        SnapKart.showToast('Store is PAUSED. Marketplace orders are temporarily halted.', 'warning');
      }
    });
  }

  /* ==========================================================================
     3. Module 2: Dashboard Overview
     ========================================================================== */
  function renderDashboardView(container) {
    const lowStockItems = state.products.filter(p => p.stock <= p.lowStockThreshold);
    const incomingOrders = state.orders.filter(o => o.status === 'incoming');

    container.innerHTML = `
      <!-- Verification Banner -->
      <div class="verification-status-banner ${state.profile.verificationStatus}">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:22px;">🛡️</span>
          <div>
            <strong>Verified Merchant Partner: ${state.profile.legalEntityName}</strong>
            <p class="text-xs" style="margin-bottom:0;">GSTIN: ${state.profile.gstin} • Verified on ${state.profile.verificationDate}</p>
          </div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="DealerApp.switchView('verification')">View KYC Profile</button>
      </div>

      <!-- Low Stock Alert Banner (If Any) -->
      ${lowStockItems.length > 0 ? `
        <div class="low-stock-alert-bar">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:24px;">⚠️</span>
            <div>
              <strong style="color:#92400E;">Low Stock Warning: ${lowStockItems.length} products below threshold</strong>
              <p class="text-xs text-muted" style="margin-bottom:0;">${lowStockItems.map(p => `${p.title} (${p.stock} left)`).join(', ')}</p>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="DealerApp.switchView('inventory')">Quick Restock →</button>
        </div>
      ` : ''}

      <!-- Top KPI Metric Cards -->
      <div class="grid-4 mb-6">
        <div class="metric-card accent-orange">
          <div class="metric-header">
            <span>TODAY'S REVENUE</span>
            <span>💰</span>
          </div>
          <div class="metric-value">$${state.finances.todayGMV.toFixed(2)}</div>
          <div class="metric-trend up">
            <span>↑ 18.2%</span>
            <span class="text-muted text-xs">18 orders fulfilled</span>
          </div>
        </div>

        <div class="metric-card accent-navy">
          <div class="metric-header">
            <span>ACTIVE ORDERS</span>
            <span>📦</span>
          </div>
          <div class="metric-value">${state.orders.filter(o => o.status !== 'dispatched' && o.status !== 'rejected').length}</div>
          <div class="metric-trend up">
            <span class="text-secondary font-bold">${incomingOrders.length} New incoming</span>
          </div>
        </div>

        <div class="metric-card accent-success">
          <div class="metric-header">
            <span>TOTAL PRODUCTS</span>
            <span>🏷️</span>
          </div>
          <div class="metric-value">${state.products.length}</div>
          <div class="text-xs text-muted">${state.products.filter(p => p.stock > 0).length} actively in stock</div>
        </div>

        <div class="metric-card accent-info">
          <div class="metric-header">
            <span>AVAILABLE PAYOUT</span>
            <span>🏦</span>
          </div>
          <div class="metric-value">$${state.finances.availableBalance.toFixed(2)}</div>
          <div class="text-xs text-muted">Next batch: Friday, 21 Nov</div>
        </div>
      </div>

      <!-- Quick Action Grid -->
      <div class="grid-2 mb-6">
        <!-- Live Incoming Orders Quick Box -->
        <div class="card p-5">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
            <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:0;">🚨 Orders Awaiting Action (${incomingOrders.length})</h4>
            <button class="btn btn-ghost btn-sm" onclick="DealerApp.switchView('orders')">Full Pipeline →</button>
          </div>

          ${incomingOrders.length === 0 ? `
            <div style="text-align:center; padding:2rem 1rem; color:var(--color-text-muted);">
              <span>✓ All incoming orders accepted!</span>
            </div>
          ` : `
            <div style="display:flex; flex-direction:column; gap:var(--space-3);">
              ${incomingOrders.map(ord => `
                <div class="order-ticket" style="border-left: 4px solid var(--color-secondary);">
                  <div class="order-ticket-header">
                    <span class="order-id">${ord.id}</span>
                    <span class="order-timer">⏱️ ${ord.orderTime}</span>
                  </div>
                  <div class="order-items-summary">
                    <strong>Customer:</strong> ${ord.customerName} (${ord.deliveryAddress})<br>
                    <strong>Items:</strong> ${ord.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                  </div>
                  <div class="order-actions">
                    <button class="btn btn-primary btn-sm" onclick="DealerApp.acceptOrder('${ord.id}')">Accept & Prep</button>
                    <button class="btn btn-outline btn-sm" onclick="DealerApp.openRejectModal('${ord.id}')">Decline</button>
                    <button class="btn btn-ghost btn-sm" onclick="DealerApp.openOrderDetailsModal('${ord.id}')">Details</button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- In-Store Pickup Reservations Quick Box -->
        <div class="card p-5">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
            <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:0;">🛍️ In-Store Customer Pickups</h4>
            <button class="btn btn-ghost btn-sm" onclick="DealerApp.switchView('reservations')">All Reservations →</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:var(--space-3);">
            ${state.reservations.slice(0, 2).map(res => `
              <div class="card p-3" style="background:var(--color-surface-alt); border:1px solid var(--color-border);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <strong style="color:var(--color-primary);">${res.customerName}</strong>
                  <span class="pickup-code-badge">${res.reservationCode}</span>
                </div>
                <div class="text-xs text-muted" style="margin-bottom:6px;">
                  Slot: <strong>${res.pickupTimeSlot}</strong> • Amount: <strong>$${res.totalAmount.toFixed(2)}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span class="badge ${res.status === 'confirmed_ready' ? 'badge-success' : 'badge-warning'}">
                    ${res.status.replace('_', ' ')}
                  </span>
                  <button class="btn btn-secondary btn-sm" onclick="DealerApp.openVerifyReservationModal('${res.id}')">
                    Verify Code
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     4. Module 6: Live Order Management (Kanban & Details)
     ========================================================================== */
  function renderOrdersView(container) {
    const incoming = state.orders.filter(o => o.status === 'incoming');
    const preparing = state.orders.filter(o => o.status === 'preparing');
    const ready = state.orders.filter(o => o.status === 'ready');

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-4);">
        <div>
          <h3>Live Hyperlocal Dispatch Pipeline</h3>
          <p class="text-sm text-muted">Orders within 3.5 km radius automatically synchronized</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-outline btn-sm" onclick="SnapKart.showToast('Order sound alert tested (Beep)', 'info')">🔊 Test Order Alert</button>
        </div>
      </div>

      <div class="grid-3">
        <!-- Column 1: Incoming Orders -->
        <div class="order-pipeline-col" id="col-incoming">
          <div class="pipeline-header">
            <span class="pipeline-title">1. Incoming Requests</span>
            <span class="badge badge-orange">${incoming.length}</span>
          </div>

          ${incoming.map(ord => `
            <div class="order-ticket" id="order-ticket-${ord.id}">
              <div class="order-ticket-header">
                <span class="order-id">${ord.id}</span>
                <span class="order-timer">⏱️ ${ord.orderTime}</span>
              </div>
              <div class="order-items-summary">
                <strong>${ord.customerName}</strong><br>
                ${ord.items.map(i => `${i.qty}x ${i.name}`).join('<br>')}<br>
                <span class="text-xs text-muted">Net: <strong>$${ord.netPayout.toFixed(2)}</strong></span>
              </div>
              <div class="order-actions">
                <button class="btn btn-primary btn-sm" onclick="DealerApp.acceptOrder('${ord.id}')">Accept & Prep</button>
                <button class="btn btn-outline btn-sm" onclick="DealerApp.openRejectModal('${ord.id}')">Reject</button>
                <button class="btn btn-ghost btn-sm" onclick="DealerApp.openOrderDetailsModal('${ord.id}')">View</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Column 2: In Preparation -->
        <div class="order-pipeline-col" id="col-preparing">
          <div class="pipeline-header">
            <span class="pipeline-title">2. Packing & Prep</span>
            <span class="badge badge-navy">${preparing.length}</span>
          </div>

          ${preparing.map(ord => `
            <div class="order-ticket" id="order-ticket-${ord.id}">
              <div class="order-ticket-header">
                <span class="order-id">${ord.id}</span>
                <span class="badge badge-warning">Prep: ${ord.prepTimerMin || 5}m left</span>
              </div>
              <div class="order-items-summary">
                <strong>${ord.customerName}</strong><br>
                ${ord.items.map(i => `${i.qty}x ${i.name}`).join('<br>')}<br>
                <span class="text-xs text-muted">Assigned Driver: ${ord.assignedDriver}</span>
              </div>
              <div class="order-actions">
                <button class="btn btn-secondary btn-sm" onclick="DealerApp.markOrderReady('${ord.id}')">
                  ✓ Mark Ready for Driver
                </button>
                <button class="btn btn-ghost btn-sm" onclick="DealerApp.openOrderDetailsModal('${ord.id}')">View</button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Column 3: Ready for Driver Pickup -->
        <div class="order-pipeline-col" id="col-ready">
          <div class="pipeline-header">
            <span class="pipeline-title">3. Ready for Driver</span>
            <span class="badge badge-success">${ready.length}</span>
          </div>

          ${ready.map(ord => `
            <div class="order-ticket" id="order-ticket-${ord.id}">
              <div class="order-ticket-header">
                <span class="order-id">${ord.id}</span>
                <span class="badge badge-success">Awaiting Handover</span>
              </div>
              <div class="order-items-summary">
                <strong>${ord.customerName}</strong><br>
                Driver: <strong>${ord.assignedDriver}</strong><br>
                ${ord.pickupOtp ? `<span class="badge badge-orange" style="font-family:var(--font-mono); margin-top:4px;">OTP: ${ord.pickupOtp}</span>` : ''}
              </div>
              <div class="order-actions">
                <button class="btn btn-outline btn-sm" onclick="DealerApp.dispatchOrder('${ord.id}')">
                  Handed to Rider
                </button>
                <button class="btn btn-ghost btn-sm" onclick="DealerApp.openOrderDetailsModal('${ord.id}')">View</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function acceptOrder(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;

    ord.status = 'preparing';
    ord.prepTimerMin = 8;
    ord.assignedDriver = 'Arun Patel (#DL-301) - En route to store';

    SnapKart.showToast(`Order ${orderId} accepted! Moved to preparation pipeline.`, 'success');
    renderView(state.currentView);
  }

  function openRejectModal(orderId) {
    activeRejectOrderId = orderId;
    SnapKart.openModal('reject-order-modal');
  }

  function confirmRejectOrder() {
    if (!activeRejectOrderId) return;
    const ord = state.orders.find(o => o.id === activeRejectOrderId);
    if (ord) {
      ord.status = 'rejected';
      const reason = document.getElementById('reject-reason-select').value;
      SnapKart.showToast(`Order ${activeRejectOrderId} rejected (${reason}). Customer notified.`, 'info');
    }
    activeRejectOrderId = null;
    SnapKart.closeModal('reject-order-modal');
    renderView(state.currentView);
  }

  function markOrderReady(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;

    ord.status = 'ready';
    ord.pickupOtp = `${Math.floor(1000 + Math.random() * 9000)}`;

    SnapKart.showToast(`Order ${orderId} marked READY! Driver dispatched to storefront.`, 'success');
    renderView(state.currentView);
  }

  function dispatchOrder(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;

    ord.status = 'dispatched';
    SnapKart.showToast(`Order ${orderId} handed over to delivery partner!`, 'success');
    renderView(state.currentView);
  }

  function openOrderDetailsModal(orderId) {
    const ord = state.orders.find(o => o.id === orderId);
    if (!ord) return;

    const modalBody = document.getElementById('order-details-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div>
          <span class="badge badge-orange">${ord.deliveryType}</span>
          <h3 style="font-size:var(--font-size-lg); color:var(--color-primary); margin-top:2px;">Order ${ord.id}</h3>
        </div>
        <span class="badge ${ord.status === 'ready' ? 'badge-success' : 'badge-navy'}">${ord.status.toUpperCase()}</span>
      </div>

      <div class="card p-3 mb-3" style="background:var(--color-surface-alt);">
        <div style="font-size:13px;"><strong>Customer:</strong> ${ord.customerName} (${ord.customerPhone})</div>
        <div style="font-size:12px; color:var(--color-text-muted);"><strong>Address:</strong> ${ord.deliveryAddress}</div>
        ${ord.notes ? `<div style="font-size:12px; color:var(--color-secondary); margin-top:4px;"><strong>Note:</strong> ${ord.notes}</div>` : ''}
      </div>

      <h5 style="font-size:12px; text-transform:uppercase; color:var(--color-text-muted); margin-bottom:6px;">Items Ordered</h5>
      <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:12px;">
        ${ord.items.map(i => `
          <div style="display:flex; justify-content:space-between; font-size:13px; padding:4px 0; border-bottom:1px solid var(--color-border);">
            <span>${i.qty}x ${i.name}</span>
            <strong>$${(i.price * i.qty).toFixed(2)}</strong>
          </div>
        `).join('')}
      </div>

      <div class="card p-3" style="background:#FAFDFB; border:1px solid #A7F3D0;">
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:2px;">
          <span>Gross Subtotal:</span>
          <strong>$${ord.subtotal.toFixed(2)}</strong>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; color:#DC2626;">
          <span>SnapKart Commission (8%):</span>
          <span>-$${ord.platformFee.toFixed(2)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:14px; font-weight:800; color:var(--color-primary); border-top:1px dashed var(--color-border); padding-top:4px;">
          <span>Net Merchant Payout:</span>
          <span>$${ord.netPayout.toFixed(2)}</span>
        </div>
      </div>
    `;

    SnapKart.openModal('order-details-modal');
  }

  /* ==========================================================================
     5. Module 4: Product Management (CRUD & Variants)
     ========================================================================== */
  function renderProductsView(container) {
    const filtered = state.products.filter(p => {
      const matchSearch = (!state.productSearch || p.title.toLowerCase().includes(state.productSearch) || p.sku.toLowerCase().includes(state.productSearch));
      return matchSearch;
    });

    container.innerHTML = `
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:var(--font-size-base); color:var(--color-primary);">Product Catalog</h3>
            <p class="text-xs text-muted">Manage items, variants, pricing, and visual search index status</p>
          </div>
          <div style="display:flex; gap:8px;">
            <input type="text" class="form-control" placeholder="Search SKU or Title..." style="width:220px;" value="${state.productSearch}" oninput="DealerApp.handleProductSearch(this.value)">
            <button class="btn btn-secondary btn-sm" onclick="DealerApp.openAddProductModal()">+ Add New Product</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product & Visual SKU</th>
                <th>Category / Brand</th>
                <th>Price & MRP</th>
                <th>Stock Units</th>
                <th>Variants</th>
                <th>Visual AI Index</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(prod => `
                <tr>
                  <td>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <img src="${prod.image}" style="width:38px; height:38px; border-radius:var(--radius-sm); object-fit:cover; background:#E2E8F0;">
                      <div>
                        <strong style="color:var(--color-primary); font-size:13px;">${prod.title}</strong>
                        <div class="text-xs text-muted">SKU: ${prod.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-neutral">${prod.category}</span>
                    <div class="text-xs text-muted">${prod.brand}</div>
                  </td>
                  <td>
                    <strong style="color:var(--color-primary); font-size:14px;">$${prod.price.toFixed(2)}</strong>
                    <div class="text-xs text-muted" style="text-decoration:line-through;">$${prod.mrp.toFixed(2)}</div>
                  </td>
                  <td>
                    <span class="badge ${prod.stock === 0 ? 'badge-danger' : (prod.stock <= prod.lowStockThreshold ? 'badge-warning' : 'badge-success')}">
                      ${prod.stock} units
                    </span>
                  </td>
                  <td>
                    ${prod.hasVariants ? `
                      <span class="badge badge-orange" title="${prod.variants.map(v => v.name).join(', ')}">
                        ${prod.variants.length} Variants
                      </span>
                    ` : '<span class="text-xs text-muted">Single</span>'}
                  </td>
                  <td>
                    <span class="badge badge-success">✓ Indexed</span>
                  </td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="btn btn-outline btn-sm" onclick="DealerApp.openEditProductModal('${prod.id}')">Edit</button>
                      <button class="btn btn-ghost btn-sm" onclick="DealerApp.deleteProduct('${prod.id}')">🗑️</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function handleProductSearch(query) {
    state.productSearch = query.trim().toLowerCase();
    renderProductsView(document.getElementById('dealer-main-content-area'));
  }

  function openAddProductModal() {
    document.getElementById('product-modal-title').textContent = 'Add New Product to Store';
    document.getElementById('product-edit-id').value = '';
    document.getElementById('prod-form-title').value = '';
    document.getElementById('prod-form-brand').value = '';
    document.getElementById('prod-form-sku').value = `IND-TECH-${Math.floor(100 + Math.random() * 900)}`;
    document.getElementById('prod-form-mrp').value = '';
    document.getElementById('prod-form-price').value = '';
    document.getElementById('prod-form-stock').value = '';
    document.getElementById('prod-form-desc').value = '';
    document.getElementById('variants-list-box').innerHTML = '';
    SnapKart.openModal('product-form-modal');
  }

  function openEditProductModal(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;

    document.getElementById('product-modal-title').textContent = 'Edit Product Details';
    document.getElementById('product-edit-id').value = prod.id;
    document.getElementById('prod-form-title').value = prod.title;
    document.getElementById('prod-form-category').value = prod.category;
    document.getElementById('prod-form-brand').value = prod.brand;
    document.getElementById('prod-form-sku').value = prod.sku;
    document.getElementById('prod-form-mrp').value = prod.mrp;
    document.getElementById('prod-form-price').value = prod.price;
    document.getElementById('prod-form-stock').value = prod.stock;
    document.getElementById('prod-form-desc').value = prod.description;

    const variantsBox = document.getElementById('variants-list-box');
    variantsBox.innerHTML = '';
    if (prod.variants) {
      prod.variants.forEach(v => {
        addVariantRow(v.name, v.price, v.stock);
      });
    }

    SnapKart.openModal('product-form-modal');
  }

  function saveProductForm() {
    const editId = document.getElementById('product-edit-id').value;
    const title = document.getElementById('prod-form-title').value;
    const category = document.getElementById('prod-form-category').value;
    const brand = document.getElementById('prod-form-brand').value;
    const sku = document.getElementById('prod-form-sku').value;
    const mrp = parseFloat(document.getElementById('prod-form-mrp').value) || 0;
    const price = parseFloat(document.getElementById('prod-form-price').value) || 0;
    const stock = parseInt(document.getElementById('prod-form-stock').value, 10) || 0;
    const desc = document.getElementById('prod-form-desc').value;

    // Collect variants
    const variantRows = document.querySelectorAll('.variant-input-row');
    const variants = [];
    variantRows.forEach(row => {
      const vName = row.querySelector('.var-name').value;
      const vPrice = parseFloat(row.querySelector('.var-price').value) || price;
      const vStock = parseInt(row.querySelector('.var-stock').value, 10) || stock;
      if (vName) variants.push({ name: vName, price: vPrice, stock: vStock, sku: `${sku}-${variants.length + 1}` });
    });

    if (editId) {
      // Edit
      const prod = state.products.find(p => p.id === editId);
      if (prod) {
        prod.title = title;
        prod.category = category;
        prod.brand = brand;
        prod.sku = sku;
        prod.mrp = mrp;
        prod.price = price;
        prod.stock = stock;
        prod.description = desc;
        prod.hasVariants = (variants.length > 0);
        prod.variants = variants;
        prod.lastUpdated = 'Just now';
        SnapKart.showToast(`Updated "${title}" successfully!`, 'success');
      }
    } else {
      // Add
      const newProd = {
        id: `prod-${Date.now()}`,
        title,
        category,
        brand: brand || 'Generic',
        sku: sku || `IND-TECH-${Math.floor(100 + Math.random() * 900)}`,
        mrp: mrp || price,
        price,
        stock,
        lowStockThreshold: 5,
        status: stock > 0 ? 'in_stock' : 'out_of_stock',
        image: '../../static/images/placeholder.svg',
        description: desc,
        hasVariants: (variants.length > 0),
        variants,
        visualSearchIndexed: true,
        lastUpdated: 'Just now'
      };
      state.products.unshift(newProd);
      SnapKart.showToast(`Added "${title}" to store catalog!`, 'success');
    }

    SnapKart.closeModal('product-form-modal');
    renderView(state.currentView);
  }

  function addVariantRow(name = '', price = '', stock = '') {
    const box = document.getElementById('variants-list-box');
    if (!box) return;

    const row = document.createElement('div');
    row.className = 'variant-input-row';
    row.style = 'display:flex; gap:8px; align-items:center; margin-bottom:6px;';
    row.innerHTML = `
      <input type="text" class="form-control var-name" placeholder="Variant (e.g. 128GB Black)" value="${name}" style="flex:2;">
      <input type="number" step="0.01" class="form-control var-price" placeholder="Price ($)" value="${price}" style="flex:1;">
      <input type="number" class="form-control var-stock" placeholder="Stock" value="${stock}" style="flex:1;">
      <button type="button" class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()">✕</button>
    `;
    box.appendChild(row);
  }

  function deleteProduct(productId) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    if (confirm(`Are you sure you want to remove "${prod.title}" from store inventory?`)) {
      state.products = state.products.filter(p => p.id !== productId);
      SnapKart.showToast(`Removed "${prod.title}"`, 'info');
      renderView(state.currentView);
    }
  }

  /* ==========================================================================
     6. Module 5: Inventory Quick Stock & Price Management
     ========================================================================== */
  function renderInventoryView(container) {
    let filtered = state.products;
    if (state.inventoryFilter === 'in_stock') filtered = state.products.filter(p => p.stock > p.lowStockThreshold);
    else if (state.inventoryFilter === 'low_stock') filtered = state.products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
    else if (state.inventoryFilter === 'out_of_stock') filtered = state.products.filter(p => p.stock === 0);

    const counts = {
      all: state.products.length,
      in_stock: state.products.filter(p => p.stock > p.lowStockThreshold).length,
      low_stock: state.products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length,
      out_of_stock: state.products.filter(p => p.stock === 0).length
    };

    container.innerHTML = `
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:var(--font-size-base); color:var(--color-primary);">Inventory Controls</h3>
            <p class="text-xs text-muted">Adjust live quantities and selling prices instantly with inline controls</p>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="filter-tab-pill ${state.inventoryFilter === 'all' ? 'active' : ''}" onclick="DealerApp.setInventoryFilter('all')">
              All (${counts.all})
            </button>
            <button class="filter-tab-pill ${state.inventoryFilter === 'in_stock' ? 'active' : ''}" onclick="DealerApp.setInventoryFilter('in_stock')">
              In Stock (${counts.in_stock})
            </button>
            <button class="filter-tab-pill ${state.inventoryFilter === 'low_stock' ? 'active' : ''}" onclick="DealerApp.setInventoryFilter('low_stock')">
              ⚠️ Low Stock (${counts.low_stock})
            </button>
            <button class="filter-tab-pill ${state.inventoryFilter === 'out_of_stock' ? 'active' : ''}" onclick="DealerApp.setInventoryFilter('out_of_stock')">
              Out of Stock (${counts.out_of_stock})
            </button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product & SKU</th>
                <th>Stock Status</th>
                <th>Adjust Stock Quantity</th>
                <th>Store Price ($)</th>
                <th>Last Stock Update</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(prod => `
                <tr style="${prod.stock <= prod.lowStockThreshold ? 'background:#FFFDF7;' : ''}">
                  <td>
                    <strong style="color:var(--color-primary); font-size:13px;">${prod.title}</strong>
                    <div class="text-xs text-muted">SKU: ${prod.sku} • Threshold: ${prod.lowStockThreshold} units</div>
                  </td>
                  <td>
                    <span class="badge ${prod.stock === 0 ? 'badge-danger' : (prod.stock <= prod.lowStockThreshold ? 'badge-warning' : 'badge-success')}">
                      ${prod.stock === 0 ? 'Out of Stock' : (prod.stock <= prod.lowStockThreshold ? 'Low Stock' : 'Healthy Stock')}
                    </span>
                  </td>
                  <td>
                    <div class="inventory-stock-ctrl">
                      <button class="inventory-stock-btn" onclick="DealerApp.stepStock('${prod.id}', -1)">−</button>
                      <input type="number" class="inventory-stock-input" value="${prod.stock}" onchange="DealerApp.setStockDirect('${prod.id}', this.value)">
                      <button class="inventory-stock-btn" onclick="DealerApp.stepStock('${prod.id}', 1)">+</button>
                    </div>
                  </td>
                  <td>
                    <div style="display:flex; align-items:center; gap:6px;">
                      <span>$</span>
                      <input type="number" step="0.50" style="width:72px; padding:2px 6px; font-weight:700; border:1px solid var(--color-border); border-radius:var(--radius-sm);" value="${prod.price.toFixed(2)}" onchange="DealerApp.setPriceDirect('${prod.id}', this.value)">
                    </div>
                  </td>
                  <td>
                    <span class="text-xs text-muted">🕒 ${prod.lastUpdated}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function setInventoryFilter(filterKey) {
    state.inventoryFilter = filterKey;
    renderInventoryView(document.getElementById('dealer-main-content-area'));
  }

  function stepStock(productId, delta) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    prod.stock = Math.max(0, prod.stock + delta);
    prod.lastUpdated = 'Just now';
    SnapKart.showToast(`Updated "${prod.title}" stock to ${prod.stock}`, 'success');
    renderInventoryView(document.getElementById('dealer-main-content-area'));
  }

  function setStockDirect(productId, val) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    prod.stock = Math.max(0, parseInt(val, 10) || 0);
    prod.lastUpdated = 'Just now';
    SnapKart.showToast(`Stock set to ${prod.stock} units`, 'success');
    renderInventoryView(document.getElementById('dealer-main-content-area'));
  }

  function setPriceDirect(productId, val) {
    const prod = state.products.find(p => p.id === productId);
    if (!prod) return;
    prod.price = Math.max(0, parseFloat(val) || 0);
    prod.lastUpdated = 'Just now';
    SnapKart.showToast(`Selling price updated to $${prod.price.toFixed(2)}`, 'success');
    renderInventoryView(document.getElementById('dealer-main-content-area'));
  }

  /* ==========================================================================
     7. Module 7: In-Store Reservations (Click & Collect)
     ========================================================================== */
  function renderReservationsView(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-4);">
        <div>
          <h3>Customer In-Store Pickup Reservations</h3>
          <p class="text-sm text-muted">Customers reserve items online and collect at store counter</p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="DealerApp.openVerifyReservationModal()">
          🔑 Verify Customer Code
        </button>
      </div>

      <div class="grid-3">
        ${state.reservations.map(res => `
          <div class="reservation-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <span class="text-xs text-muted">RESERVATION ID:</span>
                <strong style="display:block; color:var(--color-primary); font-size:14px;">${res.id}</strong>
              </div>
              <span class="pickup-code-badge">${res.reservationCode}</span>
            </div>

            <div style="margin-bottom:8px;">
              <strong style="color:var(--color-primary);">${res.customerName}</strong>
              <div class="text-xs text-muted">${res.customerPhone}</div>
              <div class="text-xs" style="color:var(--color-secondary); font-weight:700; margin-top:2px;">
                🕒 Slot: ${res.pickupTimeSlot}
              </div>
            </div>

            <div style="border-top:1px dashed var(--color-border); padding-top:6px; margin-bottom:10px; font-size:12px;">
              ${res.items.map(i => `<div>${i.qty}x ${i.name}</div>`).join('')}
              <div style="font-weight:800; color:var(--color-primary); margin-top:4px;">Total: $${res.totalAmount.toFixed(2)}</div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="badge ${res.status === 'collected' ? 'badge-success' : (res.status === 'confirmed_ready' ? 'badge-navy' : 'badge-warning')}">
                ${res.status.replace('_', ' ').toUpperCase()}
              </span>

              ${res.status === 'pending_confirmation' ? `
                <button class="btn btn-primary btn-sm" onclick="DealerApp.confirmReservation('${res.id}')">Confirm Ready</button>
              ` : (res.status === 'confirmed_ready' ? `
                <button class="btn btn-secondary btn-sm" onclick="DealerApp.openVerifyReservationModal('${res.id}')">Hand Over</button>
              ` : '<span class="text-xs text-muted">✓ Collected</span>')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function confirmReservation(resId) {
    const res = state.reservations.find(r => r.id === resId);
    if (!res) return;
    res.status = 'confirmed_ready';
    SnapKart.showToast(`Reservation ${res.reservationCode} marked READY for customer pickup!`, 'success');
    renderReservationsView(document.getElementById('dealer-main-content-area'));
  }

  function openVerifyReservationModal(resId = null) {
    activeVerifyResId = resId;
    const input = document.getElementById('verify-code-input');
    if (input) {
      if (resId) {
        const res = state.reservations.find(r => r.id === resId);
        input.value = res ? res.reservationCode : '';
      } else {
        input.value = '';
      }
    }
    SnapKart.openModal('verify-reservation-modal');
  }

  function completeReservationHandover() {
    const input = document.getElementById('verify-code-input');
    const code = input ? input.value.trim().toUpperCase() : '';

    const res = state.reservations.find(r => r.reservationCode.toUpperCase() === code);
    if (!res) {
      SnapKart.showToast(`Invalid pickup code "${code}". Please ask customer for correct 4-digit code.`, 'danger');
      return;
    }

    res.status = 'collected';
    SnapKart.closeModal('verify-reservation-modal');
    SnapKart.showToast(`🎉 Verified code ${code}! Order handed over. $${res.totalAmount.toFixed(2)} added to settlement wallet.`, 'success', 5000);
    renderReservationsView(document.getElementById('dealer-main-content-area'));
  }

  /* ==========================================================================
     8. Module 3: Shop Management (Profile, Radius & Hours)
     ========================================================================== */
  function renderShopView(container) {
    const s = state.shop;
    container.innerHTML = `
      <div class="grid-2" style="align-items:start;">
        <!-- General Info & Contact -->
        <div class="card p-5 mb-5">
          <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">Store Information & Contact</h4>
          
          <div class="form-group">
            <label class="form-label">Store Public Name</label>
            <input type="text" class="form-control" id="store-set-name" value="${s.storeName}">
          </div>

          <div class="form-group">
            <label class="form-label">Store Description</label>
            <textarea class="form-control" rows="3" id="store-set-desc">${s.description}</textarea>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Order Hotline</label>
              <input type="text" class="form-control" id="store-set-phone" value="${s.phone}">
            </div>
            <div class="form-group">
              <label class="form-label">Support Email</label>
              <input type="email" class="form-control" id="store-set-email" value="${s.email}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Store Address</label>
            <input type="text" class="form-control" id="store-set-addr" value="${s.address}">
          </div>

          <!-- Geospatial Radius Slider -->
          <div class="form-group">
            <label class="form-label">Hyperlocal Dispatch Radius: <strong id="radius-val-label" class="text-secondary">${s.dispatchRadiusKm} km</strong></label>
            <input type="range" min="1.0" max="6.0" step="0.5" value="${s.dispatchRadiusKm}" class="form-control" style="cursor:pointer;" oninput="document.getElementById('radius-val-label').textContent = this.value + ' km'; state.shop.dispatchRadiusKm = parseFloat(this.value);">
            <span class="text-xs text-muted">Orders within this radius will be delivered in 15–25 minutes.</span>
          </div>

          <button class="btn btn-secondary btn-sm" onclick="DealerApp.saveShopDetails()">Save Store Settings</button>
        </div>

        <!-- Weekly Operating Hours Schedule -->
        <div class="card p-5">
          <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">Weekly Operating Hours</h4>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${s.openingHours.map((h, idx) => `
              <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--color-border); font-size:13px;">
                <span style="font-weight:700; width:90px;">${h.day}</span>
                <div style="display:flex; align-items:center; gap:6px;">
                  <input type="time" value="${h.open}" style="padding:2px 4px; border:1px solid var(--color-border); border-radius:var(--radius-sm);" onchange="state.shop.openingHours[${idx}].open = this.value">
                  <span>–</span>
                  <input type="time" value="${h.close}" style="padding:2px 4px; border:1px solid var(--color-border); border-radius:var(--radius-sm);" onchange="state.shop.openingHours[${idx}].close = this.value">
                </div>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-outline btn-sm mt-3" onclick="SnapKart.showToast('Store operating hours schedule saved!', 'success')">
            Save Hours
          </button>
        </div>
      </div>
    `;
  }

  function saveShopDetails() {
    state.shop.storeName = document.getElementById('store-set-name').value;
    state.shop.description = document.getElementById('store-set-desc').value;
    state.shop.phone = document.getElementById('store-set-phone').value;
    state.shop.email = document.getElementById('store-set-email').value;
    state.shop.address = document.getElementById('store-set-addr').value;
    SnapKart.showToast('Shop details updated successfully!', 'success');
  }

  /* ==========================================================================
     9. Module 8: Finance & Settlements
     ========================================================================== */
  function renderFinanceView(container) {
    const f = state.finances;
    container.innerHTML = `
      <!-- Financial Overview Cards -->
      <div class="finance-stats-grid">
        <div class="metric-card accent-orange">
          <div class="metric-header">
            <span>AVAILABLE WALLET BALANCE</span>
            <span>💵</span>
          </div>
          <div class="metric-value">$${f.availableBalance.toFixed(2)}</div>
          <div class="text-xs text-muted">Ready for bank transfer</div>
        </div>

        <div class="metric-card accent-navy">
          <div class="metric-header">
            <span>PENDING SETTLEMENT</span>
            <span>⏳</span>
          </div>
          <div class="metric-value">$${f.pendingSettlement.toFixed(2)}</div>
          <div class="text-xs text-muted">Next batch: ${f.nextPayoutDate}</div>
        </div>

        <div class="metric-card accent-success">
          <div class="metric-header">
            <span>LIFETIME GMV</span>
            <span>📈</span>
          </div>
          <div class="metric-value">$${f.lifetimeGMV.toFixed(2)}</div>
          <div class="text-xs text-muted">Gross platform volume</div>
        </div>

        <div class="metric-card accent-info">
          <div class="metric-header">
            <span>COMMISSION RATE</span>
            <span>🏷️</span>
          </div>
          <div class="metric-value">${f.platformCommissionRate}</div>
          <div class="text-xs text-muted">Transparent 8% dealer take-rate</div>
        </div>
      </div>

      <!-- Commission Model Explanation Card -->
      <div class="commission-breakdown-box mb-6">
        <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-2);">
          Transparent Hyperlocal Take-Rate Breakdown
        </h4>
        <div class="grid-3" style="gap:var(--space-3); font-size:13px;">
          <div class="card p-3" style="background:#FFFFFF;">
            <strong>Merchant Gross Share: 92%</strong>
            <p class="text-xs text-muted" style="margin-bottom:0;">Paid directly into your verified bank account weekly.</p>
          </div>
          <div class="card p-3" style="background:#FFFFFF;">
            <strong>SnapKart Fee: 8.0%</strong>
            <p class="text-xs text-muted" style="margin-bottom:0;">Covers AI visual search indexing & catalog maintenance.</p>
          </div>
          <div class="card p-3" style="background:#FFFFFF;">
            <strong>Delivery Logistics: Paid by User</strong>
            <p class="text-xs text-muted" style="margin-bottom:0;">Delivery fees go 100% to on-duty hyperlocal riders.</p>
          </div>
        </div>
      </div>

      <!-- Weekly Settlement History Table -->
      <div class="card mb-6">
        <div class="card-header">
          <div>
            <h4 style="font-size:var(--font-size-base); color:var(--color-primary);">Weekly Bank Settlement Batches</h4>
            <span class="text-xs text-muted">Disbursed to HDFC Bank (••••4819)</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="SnapKart.showToast('Generating simulated settlement tax statement PDF...', 'info')">
            📥 Download Statement
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Settlement Period</th>
                <th>Gross Volume</th>
                <th>Platform Fee</th>
                <th>Net Bank Deposit</th>
                <th>Status</th>
                <th>Bank UTR Reference</th>
              </tr>
            </thead>
            <tbody>
              ${f.settlements.map(s => `
                <tr>
                  <td><strong>${s.id}</strong></td>
                  <td>${s.period}</td>
                  <td>$${s.grossSales.toFixed(2)}</td>
                  <td style="color:#DC2626;">-$${s.platformFee.toFixed(2)}</td>
                  <td><strong style="color:var(--color-primary);">$${s.netPayout.toFixed(2)}</strong></td>
                  <td>
                    <span class="badge ${s.status.includes('Processed') ? 'badge-success' : 'badge-warning'}">
                      ${s.status}
                    </span>
                  </td>
                  <td><span style="font-family:var(--font-mono); font-size:11px;">${s.bankRefNumber}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Sales Transactions -->
      <div class="card">
        <div class="card-header">
          <h4 style="font-size:var(--font-size-base); color:var(--color-primary);">Recent Sales Order Transactions</h4>
          <span class="text-xs text-muted">Real-time ledger breakdown</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Order Ref</th>
                <th>Timestamp</th>
                <th>Gross Amount</th>
                <th>Fee (8%)</th>
                <th>Dealer Net Credit</th>
                <th>Settlement Status</th>
              </tr>
            </thead>
            <tbody>
              ${f.transactions.map(t => `
                <tr>
                  <td><strong>${t.id}</strong></td>
                  <td><a href="#" onclick="DealerApp.switchView('orders')">${t.orderId}</a></td>
                  <td>${t.date}</td>
                  <td>$${t.gross.toFixed(2)}</td>
                  <td style="color:#DC2626;">-$${t.commission.toFixed(2)}</td>
                  <td><strong style="color:var(--color-primary);">$${t.net.toFixed(2)}</strong></td>
                  <td><span class="badge badge-success">${t.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     10. Module 1: Dealer Authentication & Shop KYC Verification
     ========================================================================== */
  function renderVerificationView(container) {
    const p = state.profile;
    container.innerHTML = `
      <div class="card p-6 mb-6">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-4); flex-wrap:wrap; gap:12px;">
          <div>
            <span class="badge ${p.verificationStatus === 'verified' ? 'badge-success' : 'badge-warning'} mb-2">
              Status: ${p.verificationStatus.toUpperCase()}
            </span>
            <h3 style="font-size:var(--font-size-xl); color:var(--color-primary); margin-bottom:2px;">
              ${p.legalEntityName}
            </h3>
            <span class="text-xs text-muted">Merchant ID: <strong>${p.dealerId}</strong> • Registered: ${p.verificationDate}</span>
          </div>

          <div style="display:flex; gap:8px;">
            <button class="btn btn-outline btn-sm" onclick="DealerApp.toggleVerificationDemo()">
              Demo: Toggle Verification (${p.verificationStatus === 'verified' ? 'Set Pending' : 'Set Verified'})
            </button>
          </div>
        </div>

        <div class="grid-2 mb-4">
          <div class="card p-4" style="background:var(--color-surface-alt);">
            <h5 style="font-size:13px; color:var(--color-primary); margin-bottom:8px;">Tax & Business Registration</h5>
            <div style="font-size:12px; line-height:1.6;">
              <div><strong>Trade License:</strong> ${p.tradeLicenseNo}</div>
              <div><strong>GSTIN:</strong> ${p.gstin}</div>
              <div><strong>PAN:</strong> ${p.panNumber}</div>
              <div><strong>Authorized Signatory:</strong> ${p.merchantName}</div>
            </div>
          </div>

          <div class="card p-4" style="background:var(--color-surface-alt);">
            <h5 style="font-size:13px; color:var(--color-primary); margin-bottom:8px;">Payout Bank Account Details</h5>
            <div style="font-size:12px; line-height:1.6;">
              <div><strong>Account Holder:</strong> ${p.bankDetails.accountHolder}</div>
              <div><strong>Bank:</strong> ${p.bankDetails.bankName}</div>
              <div><strong>Account Number:</strong> ${p.bankDetails.accountNumber}</div>
              <div><strong>IFSC:</strong> ${p.bankDetails.ifscCode} (${p.bankDetails.branch})</div>
            </div>
          </div>
        </div>

        <div class="alert alert-success" style="margin-bottom:0;">
          <span class="alert-icon">✓</span>
          <div class="alert-content">
            <strong>Verified Merchant Privileges:</strong> Store is permitted to accept instant 15-minute dispatch requests, participate in visual search matches, and receive automated weekly Friday bank settlements.
          </div>
        </div>
      </div>
    `;
  }

  function toggleVerificationDemo() {
    state.profile.verificationStatus = (state.profile.verificationStatus === 'verified') ? 'pending' : 'verified';
    SnapKart.showToast(`Merchant verification status set to: ${state.profile.verificationStatus.toUpperCase()}`, 'info');
    renderVerificationView(document.getElementById('dealer-main-content-area'));
  }

  return {
    switchView,
    acceptOrder,
    openRejectModal,
    confirmRejectOrder,
    markOrderReady,
    dispatchOrder,
    openOrderDetailsModal,
    handleProductSearch,
    openAddProductModal,
    openEditProductModal,
    saveProductForm,
    addVariantRow,
    deleteProduct,
    setInventoryFilter,
    stepStock,
    setStockDirect,
    setPriceDirect,
    confirmReservation,
    openVerifyReservationModal,
    completeReservationHandover,
    saveShopDetails,
    toggleVerificationDemo
  };
})();

window.DealerApp = DealerApp;
