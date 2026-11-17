/**
 * SnapKart Platform Admin Operations Controller
 * Manages Overview KPIs, Customers, Dealers, Riders, KYC Approvals,
 * Categories, Orders, Disputes, Commissions, Settlements, and Audit Logs.
 */

const AdminApp = (function() {
  'use strict';

  // State cloned from AdminData
  let state = {
    stats: { ...AdminData.stats },
    customers: [...AdminData.customers],
    dealers: [...AdminData.dealers],
    riders: [...AdminData.riders],
    pendingApprovals: {
      merchants: [...AdminData.pendingApprovals.merchants],
      riders: [...AdminData.pendingApprovals.riders]
    },
    categories: [...AdminData.categories],
    orders: [...AdminData.orders],
    disputes: [...AdminData.disputes],
    commissionRules: { ...AdminData.commissionRules },
    settlements: [...AdminData.settlements],
    auditLogs: [...AdminData.auditLogs],
    currentView: 'dashboard',
    searchQuery: '',
    statusFilter: 'all',
    isAuthenticated: true
  };

  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  function init() {
    initSidebar();
    renderCurrentView();
  }

  /* ==========================================================================
     1. Navigation & View Routing
     ========================================================================== */
  function initSidebar() {
    const links = document.querySelectorAll('.sidebar-link[data-admin-view]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewKey = link.getAttribute('data-admin-view');
        switchView(viewKey);
      });
    });
  }

  function switchView(viewKey) {
    state.currentView = viewKey;
    state.searchQuery = '';
    state.statusFilter = 'all';

    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-admin-view') === viewKey);
    });

    // Close mobile drawer if open
    const sidebar = document.querySelector('.portal-sidebar');
    if (sidebar) sidebar.classList.remove('show');

    renderCurrentView();
  }

  function renderCurrentView() {
    const container = document.getElementById('admin-main-content-area');
    if (!container) return;

    // Header title update
    const titles = {
      dashboard: 'Platform Operations Center & Macro Telemetry',
      customers: 'Customer Directory & Accounts Governance',
      dealers: 'Local Merchants & Hyperlocal Stores',
      riders: 'Delivery Partner Fleet & Verification',
      approvals: 'Merchant KYC & Rider Onboarding Approvals',
      catalog: 'Product Categories & Neural Visual Index',
      orders: 'Cross-Platform Orders Live Dispatch Stream',
      disputes: 'Dispute & Resolution Escalation Center',
      commissions: 'Platform Take-Rate & Dynamic Surge Pricing Rules',
      settlements: 'Weekly Bank Settlement Batches & Ledger',
      audit: 'System Activity Logs & Enterprise Audit Trail'
    };
    const titleEl = document.getElementById('admin-header-title');
    if (titleEl) titleEl.textContent = titles[state.currentView] || 'Platform Operations';

    updatePendingBadges();

    if (state.currentView === 'dashboard') renderDashboardView(container);
    else if (state.currentView === 'customers') renderCustomersView(container);
    else if (state.currentView === 'dealers') renderDealersView(container);
    else if (state.currentView === 'riders') renderRidersView(container);
    else if (state.currentView === 'approvals') renderApprovalsView(container);
    else if (state.currentView === 'catalog') renderCatalogView(container);
    else if (state.currentView === 'orders') renderOrdersView(container);
    else if (state.currentView === 'disputes') renderDisputesView(container);
    else if (state.currentView === 'commissions') renderCommissionsView(container);
    else if (state.currentView === 'settlements') renderSettlementsView(container);
    else if (state.currentView === 'audit') renderAuditView(container);
  }

  function updatePendingBadges() {
    const kycCount = state.pendingApprovals.merchants.length + state.pendingApprovals.riders.length;
    const dispCount = state.disputes.filter(d => d.status === 'Open').length;

    const kycBadge = document.getElementById('sidebar-kyc-badge');
    const dispBadge = document.getElementById('sidebar-disputes-badge');
    if (kycBadge) kycBadge.textContent = kycCount;
    if (dispBadge) dispBadge.textContent = dispCount;
  }

  /* ==========================================================================
     2. Module 2: Dashboard Statistics & Telemetry
     ========================================================================== */
  function renderDashboardView(container) {
    const s = state.stats;
    container.innerHTML = `
      <!-- Top Metric Cards -->
      <div class="admin-grid-top">
        <div class="metric-card accent-orange">
          <div class="metric-header">
            <span>TODAY'S PLATFORM GMV</span>
            <span>💵</span>
          </div>
          <div class="metric-value">$${s.todayGMV.toLocaleString()}</div>
          <div class="metric-trend up">
            <span>↑ ${s.gmvGrowthPercent}%</span>
            <span class="text-muted text-xs">vs last week</span>
          </div>
        </div>

        <div class="metric-card accent-navy">
          <div class="metric-header">
            <span>TOTAL ORDERS TODAY</span>
            <span>📦</span>
          </div>
          <div class="metric-value">${s.totalOrdersToday.toLocaleString()}</div>
          <div class="metric-trend up">
            <span>↑ ${s.ordersGrowthPercent}%</span>
            <span class="text-muted text-xs">across 6 zones</span>
          </div>
        </div>

        <div class="metric-card accent-success">
          <div class="metric-header">
            <span>VERIFIED MERCHANTS</span>
            <span>🏪</span>
          </div>
          <div class="metric-value">${s.activeVendorsCount}</div>
          <div class="text-xs text-muted">98.4% local store uptime</div>
        </div>

        <div class="metric-card accent-info">
          <div class="metric-header">
            <span>ON-DUTY FLEET</span>
            <span>🛵</span>
          </div>
          <div class="metric-value">${s.activeRidersCount}</div>
          <div class="text-xs" style="color:var(--color-success); font-weight:700;">Avg Dispatch: ${s.averageDeliveryMinutes}</div>
        </div>
      </div>

      <!-- Geospatial Grid & AI Visual Search Engine Health -->
      <div class="grid-2 mb-6">
        <!-- Live Dispatch Map Simulation -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 style="font-size:var(--font-size-base);">Live Hyperlocal Dispatch Grid</h3>
              <span class="text-xs text-muted">Real-time rider and store telemetry in Bangalore</span>
            </div>
            <span class="badge badge-success">GPS Live Feed</span>
          </div>
          <div class="card-body">
            <div class="map-simulation-card">
              <div class="map-hub-pin" style="top:32%; left:22%;">📍 Indiranagar (48 orders)</div>
              <div class="map-hub-pin" style="top:58%; left:62%;">📍 Koramangala (62 orders)</div>
              <div class="map-rider-pin" style="top:38%; left:36%;"></div>
              <div class="map-rider-pin" style="top:62%; left:48%; animation-delay:1.2s;"></div>
              <div class="map-rider-pin" style="top:28%; left:72%; animation-delay:2.4s;"></div>
            </div>
          </div>
        </div>

        <!-- Visual Search Neural Engine Diagnostics -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 style="font-size:var(--font-size-base);">"Snap It" AI Visual Vector Engine</h3>
              <span class="text-xs text-muted">Neural search query ingestion pipeline</span>
            </div>
            <span class="badge badge-orange">Top-1 Accuracy: ${s.visualSearchAccuracyRate}</span>
          </div>
          <div class="card-body">
            <div class="alert alert-success mb-3" style="font-size:12px;">
              <span>⚡ <strong>Vector Latency:</strong> 184ms average visual feature extraction to local SKU distance lookup.</span>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="display:flex; justify-content:space-between; font-size:13px; padding:6px 0; border-bottom:1px solid var(--color-border);">
                <span>Total Visual Snaps Today:</span>
                <strong>${s.visualSearchQueriesToday.toLocaleString()} queries</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:13px; padding:6px 0; border-bottom:1px solid var(--color-border);">
                <span>Hyperlocal 15-Min SLA Compliance:</span>
                <strong style="color:var(--color-success);">${s.hyperlocalSlaCompliance}</strong>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:13px; padding:6px 0;">
                <span>Pending KYC Onboardings:</span>
                <strong style="color:var(--color-secondary);">${state.pendingApprovals.merchants.length + state.pendingApprovals.riders.length} applications</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     3. Module 3: Customer Management
     ========================================================================== */
  function renderCustomersView(container) {
    const filtered = state.customers.filter(c => {
      const matchSearch = (!state.searchQuery || c.name.toLowerCase().includes(state.searchQuery) || c.email.toLowerCase().includes(state.searchQuery));
      return matchSearch;
    });

    container.innerHTML = `
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:var(--font-size-base); color:var(--color-primary);">Customer Directory</h3>
            <span class="text-xs text-muted">${state.customers.length} registered customers</span>
          </div>
          <div class="search-input-wrap">
            <input type="text" class="form-control" placeholder="Search customer name or email..." value="${state.searchQuery}" oninput="AdminApp.handleSearch(this.value)">
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Customer ID & Name</th>
                <th>Contact</th>
                <th>Primary Hub</th>
                <th>Orders Placed</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(cust => `
                <tr>
                  <td>
                    <strong>${cust.name}</strong>
                    <div class="text-xs text-muted">${cust.id} • Joined ${cust.joinedDate}</div>
                  </td>
                  <td>
                    <div style="font-size:13px;">${cust.email}</div>
                    <div class="text-xs text-muted">${cust.phone}</div>
                  </td>
                  <td><span class="badge badge-neutral">${cust.hub}</span></td>
                  <td><strong>${cust.ordersCount}</strong></td>
                  <td><strong style="color:var(--color-primary);">$${cust.totalSpent.toFixed(2)}</strong></td>
                  <td>
                    <span class="badge ${cust.status === 'Active' ? 'badge-success' : 'badge-danger'}">${cust.status}</span>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="AdminApp.toggleCustomerStatus('${cust.id}')">
                      ${cust.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function toggleCustomerStatus(custId) {
    const cust = state.customers.find(c => c.id === custId);
    if (!cust) return;
    cust.status = (cust.status === 'Active') ? 'Suspended' : 'Active';
    logAudit('CUSTOMER_STATUS_TOGGLED', `Changed ${cust.name} (${cust.id}) status to ${cust.status}`);
    SnapKart.showToast(`Customer ${cust.name} is now ${cust.status}`, 'info');
    renderCustomersView(document.getElementById('admin-main-content-area'));
  }

  /* ==========================================================================
     4. Module 4: Dealer and Shop Management
     ========================================================================== */
  function renderDealersView(container) {
    container.innerHTML = `
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:var(--font-size-base); color:var(--color-primary);">Registered Merchant Stores</h3>
            <span class="text-xs text-muted">${state.dealers.length} stores enrolled</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="AdminApp.switchView('approvals')">
            Review Pending KYC (${state.pendingApprovals.merchants.length}) →
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Merchant ID & Store</th>
                <th>Owner & Contact</th>
                <th>Category</th>
                <th>Catalog SKUs</th>
                <th>Radius</th>
                <th>Take-Rate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.dealers.map(dlr => `
                <tr>
                  <td>
                    <strong>${dlr.storeName}</strong>
                    <div class="text-xs text-muted">${dlr.id} • ${dlr.address}</div>
                  </td>
                  <td>
                    <div style="font-size:13px;">${dlr.ownerName}</div>
                    <div class="text-xs text-muted">${dlr.phone}</div>
                  </td>
                  <td><span class="badge badge-neutral">${dlr.category}</span></td>
                  <td><strong>${dlr.activeProducts} items</strong></td>
                  <td>${dlr.dispatchRadiusKm} km</td>
                  <td><strong style="color:var(--color-primary);">${dlr.commissionRate}</strong></td>
                  <td>
                    <span class="badge ${dlr.status === 'Active' ? 'badge-success' : 'badge-warning'}">${dlr.status}</span>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="AdminApp.toggleDealerStatus('${dlr.id}')">
                      ${dlr.status === 'Active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function toggleDealerStatus(dealerId) {
    const dlr = state.dealers.find(d => d.id === dealerId);
    if (!dlr) return;
    dlr.status = (dlr.status === 'Active') ? 'Paused' : 'Active';
    logAudit('DEALER_STATUS_CHANGED', `Changed store ${dlr.storeName} (${dlr.id}) status to ${dlr.status}`);
    SnapKart.showToast(`Store ${dlr.storeName} status set to ${dlr.status}`, 'info');
    renderDealersView(document.getElementById('admin-main-content-area'));
  }

  /* ==========================================================================
     5. Module 5: Delivery Partner Management
     ========================================================================== */
  function renderRidersView(container) {
    container.innerHTML = `
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:var(--font-size-base); color:var(--color-primary);">Delivery Fleet Partners</h3>
            <span class="text-xs text-muted">${state.riders.length} registered riders</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="AdminApp.switchView('approvals')">
            Review Rider KYC (${state.pendingApprovals.riders.length}) →
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Rider ID & Name</th>
                <th>Vehicle & Plate</th>
                <th>Completed Trips</th>
                <th>Rating</th>
                <th>Duty Status</th>
                <th>Compliance KYC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.riders.map(rdr => `
                <tr>
                  <td>
                    <strong>${rdr.name}</strong>
                    <div class="text-xs text-muted">${rdr.id} • ${rdr.phone}</div>
                  </td>
                  <td>
                    <div>${rdr.vehicleType}</div>
                    <span style="font-family:var(--font-mono); font-size:11px; font-weight:bold;">${rdr.plateNumber}</span>
                  </td>
                  <td><strong>${rdr.completedTrips}</strong></td>
                  <td>⭐ ${rdr.rating > 0 ? rdr.rating : 'New'}</td>
                  <td>
                    <span class="badge ${rdr.onDuty ? 'badge-success' : 'badge-neutral'}">
                      ${rdr.onDuty ? '● On Duty' : '○ Off Duty'}
                    </span>
                  </td>
                  <td>
                    <span class="badge ${rdr.kycStatus === 'Verified' ? 'badge-success' : 'badge-warning'}">
                      ${rdr.kycStatus}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-outline btn-sm" onclick="AdminApp.toggleRiderStatus('${rdr.id}')">
                      ${rdr.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function toggleRiderStatus(riderId) {
    const rdr = state.riders.find(r => r.id === riderId);
    if (!rdr) return;
    rdr.status = (rdr.status === 'Active') ? 'Suspended' : 'Active';
    logAudit('RIDER_STATUS_CHANGED', `Updated rider ${rdr.name} (${rdr.id}) to ${rdr.status}`);
    SnapKart.showToast(`Rider ${rdr.name} status updated to ${rdr.status}`, 'info');
    renderRidersView(document.getElementById('admin-main-content-area'));
  }

  /* ==========================================================================
     6. Module 6: Verification & KYC Approval Screens
     ========================================================================== */
  function renderApprovalsView(container) {
    const merchants = state.pendingApprovals.merchants;
    const riders = state.pendingApprovals.riders;

    container.innerHTML = `
      <div style="margin-bottom:var(--space-6);">
        <h3>Compliance KYC & Verification Queues</h3>
        <p class="text-sm text-muted">Verify local merchant trade licenses and rider documentation</p>
      </div>

      <!-- Merchant KYC Approvals Queue -->
      <div class="card mb-6">
        <div class="card-header">
          <h4 style="font-size:var(--font-size-base); color:var(--color-primary);">Pending Merchant Store Applications (${merchants.length})</h4>
          <span class="badge badge-warning">Action Required</span>
        </div>

        ${merchants.length === 0 ? `
          <div class="p-5 text-center text-muted">✓ All merchant applications approved!</div>
        ` : `
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Business & Applicant</th>
                  <th>Trade License & GSTIN</th>
                  <th>Category / Zone</th>
                  <th>Uploaded Document</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${merchants.map(m => `
                  <tr id="kyc-mer-${m.id}">
                    <td>
                      <strong>${m.businessName}</strong>
                      <div class="text-xs text-muted">${m.applicantName} • ${m.phone}</div>
                    </td>
                    <td>
                      <div>License: <strong>${m.tradeLicense}</strong></div>
                      <div class="text-xs text-muted">GSTIN: ${m.gstin}</div>
                    </td>
                    <td>
                      <span class="badge badge-neutral">${m.category}</span>
                      <div class="text-xs text-muted">${m.location}</div>
                    </td>
                    <td><span class="kyc-doc-badge">📄 ${m.docType}</span></td>
                    <td>
                      <div style="display:flex; gap:6px;">
                        <button class="btn btn-success btn-sm" onclick="AdminApp.approveMerchant('${m.id}')">✓ Approve</button>
                        <button class="btn btn-outline btn-sm" onclick="AdminApp.rejectMerchant('${m.id}')">✕ Reject</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <!-- Rider KYC Approvals Queue -->
      <div class="card">
        <div class="card-header">
          <h4 style="font-size:var(--font-size-base); color:var(--color-primary);">Pending Rider Onboarding Applications (${riders.length})</h4>
          <span class="badge badge-warning">Action Required</span>
        </div>

        ${riders.length === 0 ? `
          <div class="p-5 text-center text-muted">✓ All rider onboarding applications processed!</div>
        ` : `
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Applicant Name & Phone</th>
                  <th>Vehicle & Plate</th>
                  <th>Driving License No</th>
                  <th>Submitted Documents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${riders.map(r => `
                  <tr id="kyc-rdr-${r.id}">
                    <td>
                      <strong>${r.applicantName}</strong>
                      <div class="text-xs text-muted">${r.phone}</div>
                    </td>
                    <td>
                      <div>${r.vehicleType}</div>
                      <span style="font-family:var(--font-mono); font-size:11px;">${r.plateNumber}</span>
                    </td>
                    <td><strong>${r.dlNumber}</strong></td>
                    <td><span class="kyc-doc-badge">🪪 ${r.docType}</span></td>
                    <td>
                      <div style="display:flex; gap:6px;">
                        <button class="btn btn-success btn-sm" onclick="AdminApp.approveRider('${r.id}')">✓ Verify Rider</button>
                        <button class="btn btn-outline btn-sm" onclick="AdminApp.rejectRider('${r.id}')">✕ Decline</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  }

  function approveMerchant(appId) {
    const item = state.pendingApprovals.merchants.find(m => m.id === appId);
    if (!item) return;

    state.pendingApprovals.merchants = state.pendingApprovals.merchants.filter(m => m.id !== appId);
    state.dealers.push({
      id: item.dealerId,
      storeName: item.businessName,
      ownerName: item.applicantName,
      category: item.category,
      address: item.location,
      phone: item.phone,
      activeProducts: 0,
      dispatchRadiusKm: 3.0,
      rating: 5.0,
      commissionRate: '8.0%',
      kycStatus: 'Verified',
      status: 'Active'
    });
    state.stats.activeVendorsCount += 1;

    logAudit('MERCHANT_KYC_APPROVED', `Approved merchant ${item.businessName} (${item.tradeLicense})`);
    SnapKart.showToast(`Merchant "${item.businessName}" approved & enrolled!`, 'success');
    renderApprovalsView(document.getElementById('admin-main-content-area'));
  }

  function rejectMerchant(appId) {
    const item = state.pendingApprovals.merchants.find(m => m.id === appId);
    if (!item) return;
    state.pendingApprovals.merchants = state.pendingApprovals.merchants.filter(m => m.id !== appId);
    logAudit('MERCHANT_KYC_REJECTED', `Declined merchant application ${item.businessName}`);
    SnapKart.showToast(`Application for "${item.businessName}" rejected.`, 'info');
    renderApprovalsView(document.getElementById('admin-main-content-area'));
  }

  function approveRider(appId) {
    const item = state.pendingApprovals.riders.find(r => r.id === appId);
    if (!item) return;

    state.pendingApprovals.riders = state.pendingApprovals.riders.filter(r => r.id !== appId);
    state.riders.push({
      id: item.riderId,
      name: item.applicantName,
      phone: item.phone,
      vehicleType: item.vehicleType,
      plateNumber: item.plateNumber,
      rating: 5.0,
      completedTrips: 0,
      onDuty: true,
      kycStatus: 'Verified',
      status: 'Active'
    });
    state.stats.activeRidersCount += 1;

    logAudit('RIDER_KYC_APPROVED', `Approved rider ${item.applicantName} (${item.dlNumber})`);
    SnapKart.showToast(`Rider "${item.applicantName}" verified & active!`, 'success');
    renderApprovalsView(document.getElementById('admin-main-content-area'));
  }

  function rejectRider(appId) {
    const item = state.pendingApprovals.riders.find(r => r.id === appId);
    if (!item) return;
    state.pendingApprovals.riders = state.pendingApprovals.riders.filter(r => r.id !== appId);
    logAudit('RIDER_KYC_REJECTED', `Rejected rider application ${item.applicantName}`);
    SnapKart.showToast(`Rider application rejected.`, 'info');
    renderApprovalsView(document.getElementById('admin-main-content-area'));
  }

  /* ==========================================================================
     7. Module 7: Product & Category Management
     ========================================================================== */
  function renderCatalogView(container) {
    container.innerHTML = `
      <div class="grid-2 mb-6">
        <!-- Categories Manager -->
        <div class="card p-5">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
            <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:0;">Product Categories (${state.categories.length})</h4>
            <button class="btn btn-outline btn-sm" onclick="AdminApp.addNewCategory()">+ Add Category</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            ${state.categories.map(cat => `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:var(--color-surface-alt); border-radius:var(--radius-md);">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:1.25rem;">${cat.icon}</span>
                  <strong>${cat.name}</strong>
                </div>
                <div>
                  <span class="badge badge-neutral">${cat.productCount} SKUs</span>
                  <span class="badge badge-success ml-2">Active</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Visual Search Vector Index Telemetry -->
        <div class="card p-5">
          <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">Neural Visual Index Health</h4>
          <div class="alert alert-info mb-3" style="font-size:12px;">
            <span>📷 Visual vector embeddings are calculated and synchronized with local vendor inventory in real time.</span>
          </div>
          <div style="font-size:13px; line-height:1.7;">
            <div><strong>Indexed Products:</strong> 184 active SKUs</div>
            <div><strong>Vector Embedding Model:</strong> MobileNet-V3 Hyperlocal ViT</div>
            <div><strong>Local Radius Match Threshold:</strong> 0.82 cosine similarity</div>
            <div><strong>Top-1 Query Accuracy:</strong> 94.8% confirmed</div>
          </div>
          <button class="btn btn-secondary btn-sm mt-3" onclick="SnapKart.showToast('Triggered vector re-indexing for 184 products across 128 shops', 'success')">
            ⚡ Run Full Catalog Re-Index
          </button>
        </div>
      </div>
    `;
  }

  function addNewCategory() {
    const name = prompt('Enter new category name:');
    if (!name) return;
    state.categories.push({
      id: `cat-${Date.now()}`,
      name,
      icon: '📦',
      productCount: 0,
      active: true
    });
    logAudit('CATEGORY_ADDED', `Created new marketplace category: ${name}`);
    SnapKart.showToast(`Category "${name}" created!`, 'success');
    renderCatalogView(document.getElementById('admin-main-content-area'));
  }

  /* ==========================================================================
     8. Module 8: Order Management
     ========================================================================== */
  function renderOrdersView(container) {
    let filtered = state.orders;
    if (state.statusFilter !== 'all') {
      filtered = state.orders.filter(o => o.statusCode === state.statusFilter);
    }

    container.innerHTML = `
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:12px;">
          <div>
            <h3 style="font-size:var(--font-size-base); color:var(--color-primary);">Cross-Platform Order Stream</h3>
            <span class="text-xs text-muted">Real-time orders across all 6 delivery zones</span>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="filter-tab-pill ${state.statusFilter === 'all' ? 'active' : ''}" onclick="AdminApp.filterOrders('all')">All</button>
            <button class="filter-tab-pill ${state.statusFilter === 'in_transit' ? 'active' : ''}" onclick="AdminApp.filterOrders('in_transit')">In Transit</button>
            <button class="filter-tab-pill ${state.statusFilter === 'preparing' ? 'active' : ''}" onclick="AdminApp.filterOrders('preparing')">Preparing</button>
            <button class="filter-tab-pill ${state.statusFilter === 'delivered' ? 'active' : ''}" onclick="AdminApp.filterOrders('delivered')">Delivered</button>
            <button class="filter-tab-pill ${state.statusFilter === 'disputed' ? 'active' : ''}" onclick="AdminApp.filterOrders('disputed')">Disputed</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order Ref & Date</th>
                <th>Customer</th>
                <th>Merchant Store</th>
                <th>Assigned Rider</th>
                <th>Total ($)</th>
                <th>SnapKart Fee</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(ord => `
                <tr>
                  <td>
                    <strong>${ord.id}</strong>
                    <div class="text-xs text-muted">${ord.date}</div>
                  </td>
                  <td>${ord.customer}</td>
                  <td><strong>${ord.store}</strong></td>
                  <td>${ord.rider}</td>
                  <td><strong style="color:var(--color-primary);">$${ord.total.toFixed(2)}</strong></td>
                  <td><span class="badge badge-success">+$${ord.platformFee.toFixed(2)}</span></td>
                  <td>
                    <span class="badge ${ord.statusCode === 'delivered' ? 'badge-success' : (ord.statusCode === 'disputed' ? 'badge-danger' : 'badge-orange')}">
                      ${ord.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function filterOrders(filterKey) {
    state.statusFilter = filterKey;
    renderOrdersView(document.getElementById('admin-main-content-area'));
  }

  /* ==========================================================================
     9. Module 9: Refund & Complaint Management
     ========================================================================== */
  function renderDisputesView(container) {
    container.innerHTML = `
      <div style="margin-bottom:var(--space-4);">
        <h3>Refund & Customer Complaint Center</h3>
        <p class="text-sm text-muted">Review reported issues, damaged seals, and claim resolutions</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:var(--space-3);">
        ${state.disputes.map(d => `
          <div class="dispute-item-card ${d.status === 'Resolved' ? 'resolved' : ''}" id="disp-card-${d.id}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
              <div>
                <span class="badge ${d.status === 'Open' ? 'badge-danger' : 'badge-success'}">${d.id} • ${d.status}</span>
                <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-top:4px; margin-bottom:2px;">${d.reason}</h4>
                <div class="text-xs text-muted">Order Ref: <strong>${d.orderId}</strong> • Amount Claimed: <strong>$${d.amount.toFixed(2)}</strong> • Reported ${d.reportedAt}</div>
              </div>
              <strong style="font-size:1.25rem; color:var(--color-primary);">$${d.amount.toFixed(2)}</strong>
            </div>

            <div class="grid-2 mb-3" style="font-size:12px; gap:8px;">
              <div class="p-3" style="background:#FFFFFF; border:1px solid var(--color-border); border-radius:var(--radius-md);">
                <strong>Customer Claim (${d.customerName}):</strong>
                <p class="text-xs text-muted" style="margin-top:2px; margin-bottom:0;">${d.customerClaim}</p>
              </div>
              <div class="p-3" style="background:#FFFFFF; border:1px solid var(--color-border); border-radius:var(--radius-md);">
                <strong>Store Note (${d.storeName}):</strong>
                <p class="text-xs text-muted" style="margin-top:2px; margin-bottom:0;">${d.dealerNote}</p>
              </div>
            </div>

            ${d.status === 'Open' ? `
              <div style="display:flex; gap:8px; justify-content:flex-end;">
                <button class="btn btn-danger btn-sm" onclick="AdminApp.resolveDispute('${d.id}', 'refund')">
                  Refund Customer ($${d.amount.toFixed(2)})
                </button>
                <button class="btn btn-outline btn-sm" onclick="AdminApp.resolveDispute('${d.id}', 'release')">
                  Release to Merchant (Covered by Insurance)
                </button>
              </div>
            ` : '<div class="text-xs text-muted text-right">✓ Case closed and resolved by Operations.</div>'}
          </div>
        `).join('')}
      </div>
    `;
  }

  function resolveDispute(disputeId, actionType) {
    const d = state.disputes.find(disp => disp.id === disputeId);
    if (!d) return;

    d.status = 'Resolved';
    logAudit('DISPUTE_RESOLVED', `Closed Dispute ${d.id} with resolution: ${actionType.toUpperCase()}`);
    SnapKart.showToast(`Dispute #${disputeId} closed (${actionType === 'refund' ? 'Customer Refunded' : 'Merchant Released'})`, 'success');
    renderDisputesView(document.getElementById('admin-main-content-area'));
  }

  /* ==========================================================================
     10. Module 10: Commission & Dynamic Surge Management
     ========================================================================== */
  function renderCommissionsView(container) {
    const c = state.commissionRules;
    container.innerHTML = `
      <div class="grid-2 mb-6" style="align-items:start;">
        <div class="card p-5">
          <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">Platform Commission Take-Rate</h4>
          
          <div class="form-group">
            <label class="form-label">Merchant Base Commission Rate (%)</label>
            <input type="number" step="0.1" class="form-control" id="rule-take-rate" value="${c.baseTakeRatePercent}">
            <span class="text-xs text-muted">Standard rate charged on vendor gross order subtotal.</span>
          </div>

          <div class="form-group">
            <label class="form-label">Minimum Delivery Base Fare ($)</label>
            <input type="number" step="0.1" class="form-control" id="rule-base-fare" value="${c.minimumDeliveryBaseFare}">
          </div>

          <div class="form-group">
            <label class="form-label">Rider Per-Kilometer Payout Rate ($/km)</label>
            <input type="number" step="0.1" class="form-control" id="rule-per-km" value="${c.riderPerKmRate}">
          </div>

          <button class="btn btn-secondary btn-sm" onclick="AdminApp.saveCommissionRules()">Save Payout Rules</button>
        </div>

        <div class="card p-5">
          <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">Dynamic Geospatial Surge Multipliers</h4>
          
          <div class="form-group">
            <label class="form-label">Monsoon / Severe Weather Surge Multiplier</label>
            <input type="number" step="0.05" class="form-control" id="rule-monsoon" value="${c.monsoonSurgeMultiplier}">
            <span class="text-xs text-muted">Directly increases delivery payout to incentivize riders during rainfall.</span>
          </div>

          <div class="form-group">
            <label class="form-label">Night Shift Surge Multiplier (11 PM - 6 AM)</label>
            <input type="number" step="0.05" class="form-control" id="rule-night" value="${c.nightSurgeMultiplier}">
          </div>

          <button class="btn btn-outline btn-sm" onclick="SnapKart.showToast('Dynamic surge pricing matrix updated across all Bangalore clusters!', 'success')">
            Apply Surge Multipliers
          </button>
        </div>
      </div>
    `;
  }

  function saveCommissionRules() {
    state.commissionRules.baseTakeRatePercent = parseFloat(document.getElementById('rule-take-rate').value) || 8.0;
    state.commissionRules.minimumDeliveryBaseFare = parseFloat(document.getElementById('rule-base-fare').value) || 3.50;
    state.commissionRules.riderPerKmRate = parseFloat(document.getElementById('rule-per-km').value) || 1.20;
    logAudit('COMMISSION_RULES_UPDATED', `Take-rate set to ${state.commissionRules.baseTakeRatePercent}%`);
    SnapKart.showToast('Platform commission and fare rules updated successfully!', 'success');
  }

  /* ==========================================================================
     11. Module 11: Payment & Settlement Batches
     ========================================================================== */
  function renderSettlementsView(container) {
    container.innerHTML = `
      <div class="card mb-6">
        <div class="card-header">
          <div>
            <h4 style="font-size:var(--font-size-base); color:var(--color-primary);">Weekly Bank Settlement Batches</h4>
            <span class="text-xs text-muted">Automated Friday disbursements to merchants & fleet riders</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="SnapKart.showToast('Exporting settlement reconciliation CSV...', 'info')">
            📥 Export Settlement CSV
          </button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Batch Cycle ID</th>
                <th>Time Period</th>
                <th>Orders Fulfilled</th>
                <th>Gross Turnover</th>
                <th>Merchant Payouts (92%)</th>
                <th>Rider Payouts</th>
                <th>Platform Net Margin</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${state.settlements.map(s => `
                <tr>
                  <td><strong>${s.id}</strong></td>
                  <td>${s.cycle}</td>
                  <td>${s.totalOrders.toLocaleString()}</td>
                  <td>$${s.grossTurnover.toLocaleString()}</td>
                  <td><strong style="color:var(--color-primary);">$${s.dealerPayouts.toLocaleString()}</strong></td>
                  <td>$${s.riderPayouts.toLocaleString()}</td>
                  <td><strong style="color:var(--color-success);">+$${s.platformNetProfit.toLocaleString()}</strong></td>
                  <td><span class="badge ${s.status.includes('Settled') ? 'badge-success' : 'badge-warning'}">${s.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     12. Module 12: Audit Logs & Activity Stream
     ========================================================================== */
  function renderAuditView(container) {
    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div>
            <h4 style="font-size:var(--font-size-base); color:var(--color-primary);">System Activity & Audit Log Stream</h4>
            <span class="text-xs text-muted">Immutable trail of administrative operations</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="SnapKart.showToast('Audit trail exported (4 logs)', 'info')">
            Export Audit Trail
          </button>
        </div>

        <div class="p-4">
          ${state.auditLogs.map(l => `
            <div class="audit-log-row">
              <span class="audit-action-tag">${l.action}</span>
              <div style="flex-grow:1;">
                <div><strong>${l.details}</strong></div>
                <div class="text-xs text-muted">User: ${l.adminUser} • IP: ${l.ipAddress}</div>
              </div>
              <span class="text-xs text-muted">${l.timestamp}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function logAudit(action, details) {
    state.auditLogs.unshift({
      id: `LOG-${Math.floor(9000 + Math.random() * 1000)}`,
      timestamp: 'Just now',
      adminUser: 'admin@snapkart.internal',
      action,
      details,
      ipAddress: '192.168.1.104'
    });
  }

  function handleSearch(query) {
    state.searchQuery = query.trim().toLowerCase();
    renderCurrentView();
  }

  return {
    switchView,
    handleSearch,
    toggleCustomerStatus,
    toggleDealerStatus,
    toggleRiderStatus,
    approveMerchant,
    rejectMerchant,
    approveRider,
    rejectRider,
    addNewCategory,
    filterOrders,
    resolveDispute,
    saveCommissionRules
  };
})();

window.AdminApp = AdminApp;
