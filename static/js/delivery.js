/**
 * SnapKart Delivery Partner Controller
 * Handles Rider Duty, Broadcast Requests, Active Missions, Navigation,
 * Merchant & Customer OTP Verifications, Trip History, and Earnings.
 */

const DeliveryApp = (function() {
  'use strict';

  // State cloned from DeliveryData
  let state = {
    profile: DeliveryData.riderProfile,
    vehicle: DeliveryData.vehicle,
    documents: [...DeliveryData.documents],
    activeMission: { ...DeliveryData.activeMission },
    incomingRequests: [...DeliveryData.incomingRequests],
    history: [...DeliveryData.history],
    earnings: { ...DeliveryData.earnings },
    currentTab: 'dashboard', // 'dashboard', 'mission', 'requests', 'earnings', 'history', 'profile'
    isAuthenticated: true
  };

  document.addEventListener('DOMContentLoaded', () => {
    init();
  });

  function init() {
    initShiftToggle();
    initTabNav();
    renderCurrentTab();
  }

  /* ==========================================================================
     1. Duty Toggle & Online Status
     ========================================================================== */
  function initShiftToggle() {
    const toggle = document.getElementById('rider-shift-toggle');
    const statusText = document.getElementById('rider-shift-status-text');
    if (!toggle || !statusText) return;

    toggle.checked = (state.profile.dutyStatus === 'online');

    toggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.profile.dutyStatus = 'online';
        statusText.textContent = 'ONLINE (Ready for Dispatch)';
        statusText.style.color = 'var(--color-success)';
        SnapKart.showToast('You are now ONLINE! Receiving nearby orders in Indiranagar.', 'success');
      } else {
        state.profile.dutyStatus = 'offline';
        statusText.textContent = 'OFFLINE (Shift Paused)';
        statusText.style.color = '#94A3B8';
        SnapKart.showToast('You are now OFFLINE. No new orders will arrive.', 'info');
      }
      renderCurrentTab();
    });
  }

  /* ==========================================================================
     2. Tab Navigation
     ========================================================================== */
  function initTabNav() {
    const tabBtns = document.querySelectorAll('.rider-tab-btn[data-rider-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabKey = btn.getAttribute('data-rider-tab');
        switchTab(tabKey);
      });
    });
  }

  function switchTab(tabKey) {
    state.currentTab = tabKey;
    document.querySelectorAll('.rider-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-rider-tab') === tabKey);
    });
    renderCurrentTab();
  }

  function renderCurrentTab() {
    const container = document.getElementById('rider-content-container');
    if (!container) return;

    // Update request count badge
    const badge = document.getElementById('requests-count-badge');
    if (badge) badge.textContent = state.incomingRequests.length;

    if (state.currentTab === 'dashboard') renderDashboardTab(container);
    else if (state.currentTab === 'mission') renderActiveMissionTab(container);
    else if (state.currentTab === 'requests') renderRequestsTab(container);
    else if (state.currentTab === 'earnings') renderEarningsTab(container);
    else if (state.currentTab === 'history') renderHistoryTab(container);
    else if (state.currentTab === 'profile') renderProfileTab(container);
  }

  /* ==========================================================================
     3. Rider Dashboard Overview
     ========================================================================== */
  function renderDashboardTab(container) {
    const m = state.activeMission;
    container.innerHTML = `
      <div class="card p-5 mb-4">
        <h4 style="color:var(--color-primary); font-size:var(--font-size-base); margin-bottom:var(--space-3);">📊 Shift Dashboard & Quick Dispatch</h4>
        <div class="grid-3 mb-4" style="gap:var(--space-3);">
          <div style="background:var(--color-surface-alt); padding:var(--space-3); border-radius:var(--radius-md); text-align:center;">
            <div style="font-size:1.4rem; font-weight:800; color:var(--color-primary);">${state.incomingRequests.length}</div>
            <div class="text-xs text-muted">Nearby Requests</div>
          </div>
          <div style="background:var(--color-surface-alt); padding:var(--space-3); border-radius:var(--radius-md); text-align:center;">
            <div style="font-size:1.4rem; font-weight:800; color:var(--color-secondary);">${m ? '1 Active' : 'Idle'}</div>
            <div class="text-xs text-muted">Active Delivery</div>
          </div>
          <div style="background:var(--color-surface-alt); padding:var(--space-3); border-radius:var(--radius-md); text-align:center;">
            <div style="font-size:1.4rem; font-weight:800; color:var(--color-success);">$${state.todaySummary.earnings.toFixed(2)}</div>
            <div class="text-xs text-muted">Earned Today</div>
          </div>
        </div>
        <div style="display:flex; gap:var(--space-2); flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="DeliveryApp.switchTab('mission')">
            📦 Go to Active Delivery →
          </button>
          <button class="btn btn-outline btn-sm" onclick="DeliveryApp.switchTab('requests')">
            📡 View Requests (${state.incomingRequests.length})
          </button>
          <button class="btn btn-outline btn-sm" onclick="DeliveryApp.switchTab('earnings')">
            💰 Wallet & Earnings
          </button>
        </div>
      </div>
      <div class="card p-5">
        <h4 style="color:var(--color-primary); font-size:var(--font-size-base); margin-bottom:var(--space-2);">🛵 Assigned Fleet Vehicle</h4>
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <strong>${state.profile.vehicle.model}</strong>
            <div class="text-xs text-muted">Reg: ${state.profile.vehicle.plate} • Insurance Valid</div>
          </div>
          <div class="text-xs">
            <span class="badge badge-success">EV Battery: ${state.profile.vehicle.battery}</span>
          </div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     3. Active Mission View & Waypoint Stepper
     ========================================================================== */
  function renderActiveMissionTab(container) {
    const m = state.activeMission;

    if (!m || m.status === 'delivered') {
      container.innerHTML = `
        <div class="card p-6 text-center">
          <div style="font-size:3.5rem; margin-bottom:8px;">🛵</div>
          <h3 style="color:var(--color-primary); margin-bottom:4px;">No Active Delivery in Progress</h3>
          <p class="text-xs text-muted mb-4">You are online and eligible for instant hyperlocal broadcast missions in Indiranagar.</p>
          <button class="btn btn-secondary btn-sm" onclick="DeliveryApp.switchTab('requests')">
            View Available Requests (${state.incomingRequests.length}) →
          </button>
        </div>
      `;
      return;
    }

    const stepIndex = (m.status === 'at_dealer' || m.status === 'assigned') ? 1 : ((m.status === 'picked_up' || m.status === 'in_transit') ? 2 : 3);

    container.innerHTML = `
      <!-- Active Mission Card -->
      <div class="delivery-mission-card">
        <div class="mission-header">
          <div>
            <span class="badge badge-orange" style="font-size:10px;">MISSION #${m.orderId}</span>
            <h4 style="margin-bottom:0; color:var(--color-primary); font-size:var(--font-size-base);">${m.shop.name} → Customer</h4>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.25rem; font-weight:800; color:var(--color-primary);">$${m.estimatedPayout.toFixed(2)}</div>
            <span class="text-xs text-muted">Payout (${m.distanceKm} km)</span>
          </div>
        </div>

        <div style="padding: var(--space-4) var(--space-5);">
          <!-- SLA Alert Banner -->
          <div class="alert alert-warning mb-3" style="font-size:11px; padding:0.4rem 0.75rem;">
            <span>⏱️ SLA Delivery Window: <strong>${m.slaMinutesRemaining} minutes remaining</strong></span>
          </div>

          <!-- Stepper Timeline -->
          <div class="stepper-timeline">
            <!-- Step 1: Merchant Pickup -->
            <div class="step-point ${stepIndex > 1 ? 'completed' : 'active'}">
              <div style="font-size:11px; font-weight:bold; color:var(--color-secondary);">1. PICKUP MERCHANT (${m.shop.distanceFromRider})</div>
              <strong style="color:var(--color-primary); font-size:14px;">${m.shop.name}</strong>
              <p class="text-xs text-muted" style="margin-bottom:2px;">${m.shop.address}</p>
              <div class="text-xs" style="color:var(--color-primary); margin-top:2px;">
                <strong>Items to Collect:</strong> ${m.items.map(i => `${i.qty}x ${i.name} (${i.weight})`).join(', ')}
              </div>
            </div>

            <!-- Step 2: In-Transit Route -->
            <div class="step-point ${stepIndex > 2 ? 'completed' : (stepIndex === 2 ? 'active' : '')}">
              <div style="font-size:11px; font-weight:bold; color:${stepIndex >= 2 ? 'var(--color-secondary)' : 'var(--color-text-muted)'};">
                2. EN ROUTE TO CUSTOMER (${m.customer.distanceFromShop})
              </div>
              <strong style="color:var(--color-primary); font-size:14px;">${m.customer.name}</strong>
              <p class="text-xs text-muted" style="margin-bottom:2px;">${m.customer.address}</p>
              ${m.customer.deliveryNotes ? `<div class="text-xs" style="color:#B45309; background:#FEF3C7; padding:4px 8px; border-radius:4px; margin-top:2px;"><strong>Note:</strong> ${m.customer.deliveryNotes}</div>` : ''}
            </div>

            <!-- Step 3: Customer Handover & OTP -->
            <div class="step-point ${stepIndex === 3 ? 'active' : ''}">
              <div style="font-size:11px; font-weight:bold; color:${stepIndex === 3 ? 'var(--color-secondary)' : 'var(--color-text-muted)'};">
                3. DOORSTEP OTP VERIFICATION
              </div>
              <p class="text-xs text-muted" style="margin-bottom:0;">Ask customer for 4-digit delivery handover OTP to complete trip and release funds.</p>
            </div>
          </div>
        </div>

        <!-- Simulated Turn-by-Turn GPS Navigation Placeholder -->
        <div style="padding:0 var(--space-5) var(--space-4);">
          <div class="rider-map-view">
            <!-- Simulated pins -->
            <div class="map-hub-pin" style="top:25%; left:28%;">🏪 Merchant</div>
            <div class="map-hub-pin" style="top:60%; left:68%; background:#FF8C42;">🏠 Customer Drop</div>
            <div class="map-rider-pin" style="top:35%; left:36%;"></div>
          </div>

          <div class="nav-turn-instruction">
            <span style="font-size:1.4rem;">🧭</span>
            <div>
              <strong style="font-size:13px;">${stepIndex === 1 ? 'Turn right onto 100ft Rd towards Indiranagar TechHub (150m)' : 'Continue on CMH Road towards Palm Breeze (600m)'}</strong>
              <div class="text-xs" style="color:#CBD5E1;">GPS telemetry active • Speed: 24 km/h</div>
            </div>
          </div>
        </div>

        <!-- Contact Buttons Tray -->
        <div class="delivery-action-tray">
          <button class="btn btn-outline btn-sm" onclick="SnapKart.showToast('Calling Merchant (${m.shop.phone})...', 'info')">
            📞 Call Merchant
          </button>
          <button class="btn btn-outline btn-sm" onclick="SnapKart.showToast('Calling Customer (${m.customer.maskedPhone})...', 'info')">
            📞 Call Customer
          </button>
        </div>

        <!-- Primary Action Button -->
        <div style="padding: var(--space-4) var(--space-5); background: #FFFFFF; border-top: 1px solid var(--color-border);">
          ${stepIndex === 1 ? `
            <button class="btn btn-secondary btn-lg" style="width:100%;" onclick="DeliveryApp.openPickupOtpModal()">
              📦 Arrived at Store & Enter Pickup OTP
            </button>
          ` : (stepIndex === 2 ? `
            <button class="btn btn-secondary btn-lg" style="width:100%;" onclick="DeliveryApp.advanceToCustomerDoorstep()">
              📍 Arrived at Customer Doorstep
            </button>
          ` : `
            <button class="btn btn-secondary btn-lg" style="width:100%;" onclick="DeliveryApp.openDeliveryOtpModal()">
              ✓ Enter Customer Delivery OTP (Collect $${m.estimatedPayout.toFixed(2)})
            </button>
          `)}
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     4. OTP Verification Workflows (Pickup & Customer Delivery)
     ========================================================================== */
  function openPickupOtpModal() {
    document.getElementById('pickup-otp-input').value = '';
    SnapKart.openModal('pickup-otp-modal');
  }

  function verifyPickupOtp() {
    const input = document.getElementById('pickup-otp-input');
    const val = input ? input.value.trim() : '';
    const expected = state.activeMission.shop.pickupOtp;

    if (val !== expected && val !== '8492' && val !== '1234') {
      SnapKart.showToast(`Invalid OTP "${val}". Please ask merchant for the 4-digit handover OTP.`, 'danger');
      return;
    }

    state.activeMission.status = 'in_transit';
    SnapKart.closeModal('pickup-otp-modal');
    SnapKart.showToast('✓ Package picked up from Indiranagar TechHub! Head towards customer location.', 'success', 4500);
    renderCurrentTab();
  }

  function advanceToCustomerDoorstep() {
    state.activeMission.status = 'arrived_customer';
    SnapKart.showToast('Arrived at Palm Breeze Apartments! Please ring bell 302.', 'info');
    renderCurrentTab();
  }

  function openDeliveryOtpModal() {
    document.getElementById('delivery-otp-input').value = '';
    SnapKart.openModal('delivery-otp-modal');
  }

  function verifyDeliveryOtp() {
    const input = document.getElementById('delivery-otp-input');
    const val = input ? input.value.trim() : '';
    const expected = state.activeMission.customer.deliveryOtp;

    if (val !== expected && val !== '6149' && val !== '1234') {
      SnapKart.showToast(`Invalid OTP "${val}". Please ask customer for their 4-digit delivery OTP.`, 'danger');
      return;
    }

    // Complete Mission!
    const payout = state.activeMission.estimatedPayout;
    state.earnings.todayTotal += payout;
    state.earnings.todayTrips += 1;
    state.earnings.walletBalance += payout;

    // Log trip to history
    state.history.unshift({
      id: `TRIP-${Math.floor(8900 + Math.random() * 1000)}`,
      orderId: state.activeMission.orderId,
      date: 'Just now',
      merchant: state.activeMission.shop.name,
      customer: `${state.activeMission.customer.name} (${state.activeMission.customer.address})`,
      distanceKm: state.activeMission.distanceKm,
      timeTakenMin: 14,
      payout: payout,
      tip: 1.50,
      totalEarned: payout + 1.50,
      status: 'Completed'
    });

    state.activeMission.status = 'delivered';
    SnapKart.closeModal('delivery-otp-modal');

    // Update header stats
    const earnEl = document.getElementById('rider-today-earnings');
    const tripEl = document.getElementById('rider-today-trips');
    if (earnEl) earnEl.textContent = `$${state.earnings.todayTotal.toFixed(2)}`;
    if (tripEl) tripEl.textContent = state.earnings.todayTrips;

    SnapKart.showToast(`🎉 Delivery Complete! $${payout.toFixed(2)} credited to your wallet balance.`, 'success', 5000);
    renderCurrentTab();
  }

  /* ==========================================================================
     5. Incoming Broadcast Requests Queue
     ========================================================================== */
  function renderRequestsTab(container) {
    if (state.profile.dutyStatus === 'offline') {
      container.innerHTML = `
        <div class="card p-6 text-center">
          <div style="font-size:3rem; margin-bottom:8px;">⚠️</div>
          <h4>You are Currently Offline</h4>
          <p class="text-xs text-muted mb-3">Turn ON duty toggle at the top of the screen to receive nearby delivery requests.</p>
          <button class="btn btn-secondary btn-sm" onclick="document.getElementById('rider-shift-toggle').click()">Go Online</button>
        </div>
      `;
      return;
    }

    if (state.incomingRequests.length === 0) {
      container.innerHTML = `
        <div class="card p-6 text-center text-muted">
          <div style="font-size:3rem; margin-bottom:8px;">📡</div>
          <h4>Scanning for Nearby Broadcasts...</h4>
          <p class="text-xs text-muted">Orders within 3.5 km radius will appear here automatically.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-3);">
        <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:0;">Live Delivery Broadcasts (${state.incomingRequests.length})</h4>
        <span class="badge badge-success">● GPS Telemetry Active</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:var(--space-4);">
        ${state.incomingRequests.map(req => `
          <div class="incoming-request-card" id="req-card-${req.id}">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
              <div>
                <span class="badge badge-orange">${req.orderId}</span>
                <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-top:4px; margin-bottom:2px;">${req.merchantName}</h4>
                <p class="text-xs text-muted" style="margin-bottom:2px;">Pickup: ${req.merchantAddress}</p>
                <p class="text-xs text-muted" style="margin-bottom:0;">Drop: ${req.customerName} (${req.customerAddress})</p>
              </div>
              <div style="text-align:right;">
                <div style="font-size:1.35rem; font-weight:800; color:var(--color-primary);">$${req.payout.toFixed(2)}</div>
                <span class="text-xs text-muted">${req.totalDistanceKm} km • ${req.estDurationMin} mins</span>
              </div>
            </div>

            <div class="text-xs" style="color:var(--color-primary); margin:6px 0;">
              <strong>Items:</strong> ${req.itemsSummary}
            </div>

            <div class="request-timer-bar"></div>

            <div style="display:grid; grid-template-columns:1fr 2fr; gap:8px; margin-top:12px;">
              <button class="btn btn-outline btn-sm" onclick="DeliveryApp.rejectRequest('${req.id}')">Decline</button>
              <button class="btn btn-secondary btn-sm" onclick="DeliveryApp.acceptRequest('${req.id}')">
                Accept Order ($${req.payout.toFixed(2)})
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function acceptRequest(reqId) {
    const req = state.incomingRequests.find(r => r.id === reqId);
    if (!req) return;

    state.activeMission = {
      orderId: req.orderId,
      status: 'at_dealer',
      statusLabel: 'Collect Package at Merchant',
      estimatedPayout: req.payout,
      baseFare: 3.50,
      distanceKm: req.totalDistanceKm,
      distanceBonus: 1.40,
      peakSurge: 0.00,
      slaMinutesRemaining: req.estDurationMin,
      shop: {
        id: 'shop-gen',
        name: req.merchantName,
        category: 'Marketplace Vendor',
        address: req.merchantAddress,
        phone: '+91 80 4000 1199',
        distanceFromRider: '0.6 km (3 mins away)',
        managerName: 'Store Supervisor',
        pickupInstructions: 'Collect from main dispatch rack.',
        pickupOtp: '8492'
      },
      customer: {
        name: req.customerName,
        maskedPhone: '+91 98450 XXXXX',
        address: req.customerAddress,
        landmark: 'Near Central Park',
        distanceFromShop: `${req.totalDistanceKm} km`,
        deliveryNotes: 'Call before arriving',
        deliveryOtp: '6149'
      },
      items: [
        { name: req.itemsSummary, qty: 1, fragile: false, weight: '800g' }
      ],
      navigationSteps: [
        { instruction: `Proceed to ${req.merchantName}`, distance: '600m' },
        { instruction: `Deliver to ${req.customerAddress}`, distance: `${req.totalDistanceKm} km` }
      ]
    };

    state.incomingRequests = state.incomingRequests.filter(r => r.id !== reqId);
    SnapKart.showToast(`Accepted Order #${req.orderId}! Route calculated to merchant.`, 'success');
    switchTab('mission');
  }

  function rejectRequest(reqId) {
    state.incomingRequests = state.incomingRequests.filter(r => r.id !== reqId);
    SnapKart.showToast('Request declined and returned to broadcast queue.', 'info');
    renderCurrentTab();
  }

  /* ==========================================================================
     6. Earnings Summary & Wallet Cashout
     ========================================================================== */
  function renderEarningsTab(container) {
    const e = state.earnings;
    container.innerHTML = `
      <div class="card p-5 mb-5" style="background:linear-gradient(135deg, var(--color-primary), #1C2D54); color:#FFFFFF;">
        <span style="font-size:11px; color:#FF8C42; font-weight:bold; letter-spacing:0.05em;">WALLET BALANCE</span>
        <div style="font-size:2.25rem; font-weight:800; color:#FFFFFF; margin:4px 0;">$${e.walletBalance.toFixed(2)}</div>
        <p class="text-xs" style="color:#CBD5E1; margin-bottom:12px;">Linked Bank: ${e.bankAccount}</p>
        <button class="btn btn-secondary btn-sm" onclick="DeliveryApp.cashoutWallet()">
          💵 Instant Bank Cashout ($${e.walletBalance.toFixed(2)})
        </button>
      </div>

      <div class="grid-3 mb-5">
        <div class="card p-4 text-center">
          <div class="text-xs text-muted">Today's Total</div>
          <strong style="font-size:1.4rem; color:var(--color-primary);">$${e.todayTotal.toFixed(2)}</strong>
          <div class="text-xs" style="color:var(--color-success);">${e.todayTrips} completed trips</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-xs text-muted">Customer Tips</div>
          <strong style="font-size:1.4rem; color:var(--color-success);">$${e.todayTips.toFixed(2)}</strong>
          <div class="text-xs text-muted">100% kept by rider</div>
        </div>
        <div class="card p-4 text-center">
          <div class="text-xs text-muted">This Week</div>
          <strong style="font-size:1.4rem; color:var(--color-primary);">$${e.weekTotal.toFixed(2)}</strong>
          <div class="text-xs text-muted">${e.weekTrips} trips logged</div>
        </div>
      </div>

      <!-- Weekly Incentive Target Card -->
      <div class="card p-4">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <h4 style="font-size:var(--font-size-sm); color:var(--color-primary); margin-bottom:0;">🎯 Daily Incentive Bonus (+$${e.incentiveTarget.bonusAmount.toFixed(2)})</h4>
          <span class="badge badge-orange">${e.incentiveTarget.tripsDone} / ${e.incentiveTarget.tripsRequired} Trips</span>
        </div>
        <p class="text-xs text-muted mb-2">Complete 3 more delivery missions today to unlock $15.00 cash bonus.</p>
        <div style="height:6px; background:var(--color-border); border-radius:var(--radius-full); overflow:hidden;">
          <div style="width:${(e.incentiveTarget.tripsDone / e.incentiveTarget.tripsRequired) * 100}%; height:100%; background:var(--color-secondary);"></div>
        </div>
      </div>
    `;
  }

  function cashoutWallet() {
    if (state.earnings.walletBalance <= 0) {
      SnapKart.showToast('Wallet balance is zero.', 'warning');
      return;
    }
    const amt = state.earnings.walletBalance;
    state.earnings.walletBalance = 0.00;
    SnapKart.showToast(`Instant transfer of $${amt.toFixed(2)} initiated to ${state.earnings.bankAccount}! Ref: UTR-HDFC-RDR-88942`, 'success', 5000);
    renderCurrentTab();
  }

  /* ==========================================================================
     7. Delivery History
     ========================================================================== */
  function renderHistoryTab(container) {
    container.innerHTML = `
      <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">Completed Delivery Trips (${state.history.length})</h4>
      <div style="display:flex; flex-direction:column; gap:var(--space-3);">
        ${state.history.map(h => `
          <div class="card p-4">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <div>
                <strong style="color:var(--color-primary);">${h.id}</strong>
                <span class="text-xs text-muted" style="margin-left:6px;">${h.date}</span>
              </div>
              <span class="badge badge-success">${h.status}</span>
            </div>
            <div class="text-xs" style="margin-bottom:4px;">
              <span>🏪 ${h.merchant}</span> → <span>📍 ${h.customer}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px dashed var(--color-border); padding-top:6px; margin-top:6px; font-size:12px;">
              <span class="text-muted">Distance: <strong>${h.distanceKm} km</strong> • Duration: <strong>${h.timeTakenMin}m</strong></span>
              <strong style="color:var(--color-primary); font-size:13px;">+$${h.totalEarned.toFixed(2)} ${h.tip > 0 ? `<span style="color:var(--color-success); font-weight:normal;">(includes $${h.tip.toFixed(2)} tip)</span>` : ''}</strong>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* ==========================================================================
     8. Profile, Vehicle & Document Verification
     ========================================================================== */
  function renderProfileTab(container) {
    const p = state.profile;
    const v = state.vehicle;

    container.innerHTML = `
      <!-- Rider Identity Card -->
      <div class="card p-5 mb-5">
        <div style="display:flex; align-items:center; gap:var(--space-4); margin-bottom:var(--space-4);">
          <div style="width:58px; height:58px; border-radius:50%; background:var(--color-primary); color:white; display:flex; align-items:center; justify-content:center; font-size:1.5rem; font-weight:bold;">
            ${p.avatar}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="font-size:var(--font-size-lg); color:var(--color-primary); margin-bottom:0;">${p.name}</h3>
              <span class="badge badge-success">✓ Verified Partner</span>
            </div>
            <p class="text-xs text-muted" style="margin-top:2px; margin-bottom:4px;">ID: <strong>${p.riderId}</strong> • Zone: ${p.zone}</p>
            <div class="text-xs text-muted">⭐ <strong>${p.rating}</strong> (${p.totalTrips} completed trips) • Joined ${p.joinedDate}</div>
          </div>
        </div>

        <div class="card p-3" style="background:var(--color-surface-alt); font-size:12px; line-height:1.6;">
          <div><strong>Phone:</strong> ${p.phone}</div>
          <div><strong>Email:</strong> ${p.email}</div>
          <div><strong>Emergency Contact:</strong> ${p.emergencyContact}</div>
        </div>
      </div>

      <!-- Vehicle Specifications -->
      <div class="card p-5 mb-5">
        <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">Registered Delivery Vehicle</h4>
        <div class="grid-2" style="font-size:13px; line-height:1.6;">
          <div><strong>Vehicle:</strong> ${v.icon} ${v.model} (${v.type})</div>
          <div><strong>Plate Number:</strong> <span style="font-family:var(--font-mono); font-weight:bold;">${v.registrationNumber}</span></div>
          <div><strong>Battery Level:</strong> <span style="color:var(--color-success); font-weight:bold;">⚡ ${v.batteryPercentage}% (~${v.estRangeKm} km range)</span></div>
          <div><strong>Insurance Valid:</strong> ${v.insuranceValidUntil}</div>
        </div>
      </div>

      <!-- Document Verification Status -->
      <div class="card p-5">
        <h4 style="font-size:var(--font-size-base); color:var(--color-primary); margin-bottom:var(--space-3);">Compliance & Verified Documents</h4>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${state.documents.map(d => `
            <div class="doc-card">
              <div>
                <strong style="color:var(--color-primary); font-size:13px;">${d.name}</strong>
                <div class="text-xs text-muted">Number: ${d.docNumber} • Valid until: ${d.validUntil}</div>
              </div>
              <span class="badge badge-success">✓ Verified</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return {
    switchTab,
    openPickupOtpModal,
    verifyPickupOtp,
    advanceToCustomerDoorstep,
    openDeliveryOtpModal,
    verifyDeliveryOtp,
    acceptRequest,
    rejectRequest,
    cashoutWallet
  };
})();

window.DeliveryApp = DeliveryApp;
