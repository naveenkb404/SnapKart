/**
 * SnapKart Customer State Manager (Cart, Single-Shop Rules, Checkout, Account)
 * Ready for future Django API integration.
 */

const CustomerStore = (function() {
  'use strict';

  // Persistence keys
  const CART_KEY = 'snapkart_cart_v1';
  const AUTH_KEY = 'snapkart_auth_v1';
  const ADDR_KEY = 'snapkart_addresses_v1';
  const ORDERS_KEY = 'snapkart_orders_v1';
  const LOC_KEY = 'snapkart_selected_location_v1';

  // State
  let cart = {
    shopId: 'shop-1',
    shopName: 'Indiranagar TechHub',
    fulfillmentType: 'delivery', // 'delivery' or 'pickup'
    items: [
      {
        id: 'prod-1',
        name: 'Sony WH-1000XM5 Wireless Headphones',
        price: 348.00,
        qty: 1,
        shopId: 'shop-1',
        shopName: 'Indiranagar TechHub',
        image: '../../static/images/placeholder.svg'
      }
    ]
  };

  let selectedLocation = null;
  let userProfile = SnapData.customerProfile;
  let savedAddresses = SnapData.customerProfile.savedAddresses;
  let pastOrders = SnapData.pastOrders;
  let isAuthenticated = true; // demo logged in by default

  // Pending item when shop conflict occurs
  let pendingShopSwitch = null;

  function init() {
    loadFromStorage();
  }

  function loadFromStorage() {
    try {
      const storedCart = localStorage.getItem(CART_KEY);
      if (storedCart) cart = JSON.parse(storedCart);

      const storedOrders = localStorage.getItem(ORDERS_KEY);
      if (storedOrders) pastOrders = JSON.parse(storedOrders);

      const storedAddrs = localStorage.getItem(ADDR_KEY);
      if (storedAddrs) savedAddresses = JSON.parse(storedAddrs);

      const storedLoc = localStorage.getItem(LOC_KEY);
      if (storedLoc) {
        selectedLocation = JSON.parse(storedLoc);
      } else {
        selectedLocation = null;
      }
    } catch (e) {
      console.warn('LocalStorage not available, running in memory mode.', e);
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {}
  }

  function saveOrders() {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(pastOrders));
    } catch (e) {}
  }

  function saveAddresses() {
    try {
      localStorage.setItem(ADDR_KEY, JSON.stringify(savedAddresses));
    } catch (e) {}
  }

  /* ==========================================================================
     Cart & Single-Shop Constraint Logic
     ========================================================================== */
  function getCart() {
    return cart;
  }

  function getCartItemsCount() {
    return cart.items.reduce((sum, item) => sum + item.qty, 0);
  }

  function getCartCalculations() {
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shop = SnapData.shops.find(s => s.id === cart.shopId);
    const deliveryFee = (cart.fulfillmentType === 'pickup' || subtotal === 0) ? 0.00 : (shop ? shop.deliveryFee : 2.49);
    const tax = subtotal * 0.05; // 5% simulated local tax
    const total = subtotal + deliveryFee + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee: parseFloat(deliveryFee.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      shopName: cart.shopName,
      shopId: cart.shopId,
      fulfillmentType: cart.fulfillmentType
    };
  }

  function setFulfillmentType(type) {
    if (type === 'delivery' || type === 'pickup') {
      cart.fulfillmentType = type;
      saveCart();
      if (window.CustomerUI) window.CustomerUI.renderCart();
    }
  }

  /**
   * Adds product from a specific shop, enforcing single-vendor checkout!
   */
  function addToCart(product, shopId, customPrice = null) {
    const shop = SnapData.shops.find(s => s.id === shopId) || SnapData.shops[0];
    const price = customPrice !== null ? customPrice : (product.basePrice || product.price);

    // Single-Shop Rule Check
    if (cart.items.length > 0 && cart.shopId && cart.shopId !== shopId) {
      // Conflict: prompt user to confirm shop switch
      pendingShopSwitch = { product, shopId, price, shopName: shop.name };
      showShopConflictModal(cart.shopName, shop.name);
      return false;
    }

    // Assign shop to cart if empty
    if (cart.items.length === 0) {
      cart.shopId = shopId;
      cart.shopName = shop.name;
    }

    // Add or increment
    const existing = cart.items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({
        id: product.id,
        name: product.name,
        price: parseFloat(price),
        qty: 1,
        shopId: shop.id,
        shopName: shop.name,
        image: product.image || '../../static/images/placeholder.svg'
      });
    }

    saveCart();
    SnapKart.showToast(`Added "${product.name}" from ${shop.name}!`, 'success');
    if (window.CustomerUI) window.CustomerUI.renderCart();
    return true;
  }

  function confirmShopSwitch() {
    if (!pendingShopSwitch) return;
    const { product, shopId, price, shopName } = pendingShopSwitch;

    // Reset cart to new shop
    cart.shopId = shopId;
    cart.shopName = shopName;
    cart.items = [{
      id: product.id,
      name: product.name,
      price: parseFloat(price),
      qty: 1,
      shopId: shopId,
      shopName: shopName,
      image: product.image || '../../static/images/placeholder.svg'
    }];

    saveCart();
    pendingShopSwitch = null;
    SnapKart.closeModal('shop-conflict-modal');
    SnapKart.showToast(`Cart switched to ${shopName}! Previous items cleared.`, 'info');
    if (window.CustomerUI) window.CustomerUI.renderCart();
  }

  function cancelShopSwitch() {
    pendingShopSwitch = null;
    SnapKart.closeModal('shop-conflict-modal');
  }

  function showShopConflictModal(currentShopName, newShopName) {
    const modal = document.getElementById('shop-conflict-modal');
    if (!modal) {
      // Fallback native confirm if modal element not rendered
      const ok = confirm(`Your cart currently has items from "${currentShopName}".\n\nSnapKart orders are dispatched per shop for 15-minute delivery.\n\nClear cart and start a new order from "${newShopName}"?`);
      if (ok) confirmShopSwitch(); else cancelShopSwitch();
      return;
    }

    const curEl = document.getElementById('conflict-current-shop');
    const newEl = document.getElementById('conflict-new-shop');
    if (curEl) curEl.textContent = currentShopName;
    if (newEl) newEl.textContent = newShopName;
    SnapKart.openModal('shop-conflict-modal');
  }

  function updateItemQty(productId, delta) {
    const item = cart.items.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart.items = cart.items.filter(i => i.id !== productId);
      if (cart.items.length === 0) {
        cart.shopId = null;
        cart.shopName = '';
      }
      SnapKart.showToast('Item removed from cart', 'info');
    }

    saveCart();
    if (window.CustomerUI) window.CustomerUI.renderCart();
  }

  function clearCart() {
    cart.items = [];
    cart.shopId = null;
    cart.shopName = '';
    saveCart();
    if (window.CustomerUI) window.CustomerUI.renderCart();
  }

  /* ==========================================================================
     Order Creation & Checkout Simulation
     ========================================================================== */
  function placeOrder(orderDetails) {
    if (cart.items.length === 0) {
      SnapKart.showToast('Your cart is empty!', 'warning');
      return null;
    }

    const calc = getCartCalculations();
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: newOrderId,
      date: `Today, ${timeStr}`,
      shopId: cart.shopId,
      shopName: cart.shopName,
      status: cart.fulfillmentType === 'pickup' ? 'Ready for Store Pickup' : 'Confirmed & Preparing',
      statusCode: 'confirmed',
      fulfillmentType: cart.fulfillmentType === 'pickup' ? 'Store Pickup' : 'Delivery',
      eta: cart.fulfillmentType === 'pickup' ? 'Ready in 10 mins' : '15-20 mins',
      driverName: cart.fulfillmentType === 'pickup' ? 'N/A (Self Pickup)' : 'Assigning nearest rider...',
      pickupVerificationCode: `SK-${Math.floor(100 + Math.random() * 900)}`,
      items: [...cart.items],
      subtotal: calc.subtotal,
      deliveryFee: calc.deliveryFee,
      tax: calc.tax,
      total: calc.total,
      deliveryAddress: orderDetails.deliveryAddress || (savedAddresses[0] ? `${savedAddresses[0].line1}, ${savedAddresses[0].city}` : 'Indiranagar 100ft Rd'),
      deliveryInstructions: orderDetails.notes || 'Please call on arrival',
      timeline: [
        { label: 'Order Confirmed', time: timeStr, done: true },
        { label: `Merchant Accepting (${cart.shopName})`, time: 'In Progress', current: true },
        { label: cart.fulfillmentType === 'pickup' ? 'Ready at Store Counter' : 'Rider Picked Up', time: 'Pending', done: false },
        { label: cart.fulfillmentType === 'pickup' ? 'Completed Handover' : 'Delivered to Doorstep', time: 'Pending', done: false }
      ]
    };

    pastOrders.unshift(newOrder);
    saveOrders();
    clearCart();

    SnapKart.showToast(`🎉 Order #${newOrderId} placed successfully!`, 'success', 5000);
    return newOrder;
  }

  /* ==========================================================================
     Address Management
     ========================================================================== */
  function getAddresses() {
    return savedAddresses;
  }

  function addAddress(newAddr) {
    const addr = {
      id: `addr-${Date.now()}`,
      label: newAddr.label || 'Home',
      icon: newAddr.label === 'Office' ? '💼' : (newAddr.label === 'Other' ? '📍' : '🏠'),
      isDefault: savedAddresses.length === 0,
      recipient: newAddr.recipient || userProfile.name,
      phone: newAddr.phone || userProfile.phone,
      line1: newAddr.line1,
      line2: newAddr.line2 || '',
      city: newAddr.city || 'Bangalore',
      pincode: newAddr.pincode || '560038'
    };
    savedAddresses.push(addr);
    saveAddresses();
    SnapKart.showToast(`Address "${addr.label}" saved!`, 'success');
    if (window.CustomerUI) window.CustomerUI.renderAddresses();
    return addr;
  }

  function deleteAddress(id) {
    savedAddresses = savedAddresses.filter(a => a.id !== id);
    saveAddresses();
    SnapKart.showToast('Address deleted', 'info');
    if (window.CustomerUI) window.CustomerUI.renderAddresses();
  }

  function setDefaultAddress(id) {
    savedAddresses.forEach(a => a.isDefault = (a.id === id));
    saveAddresses();
    SnapKart.showToast('Default delivery address updated', 'success');
    if (window.CustomerUI) window.CustomerUI.renderAddresses();
  }

  /* ==========================================================================
     Location Hub Selector
     ========================================================================== */
  function getSelectedLocation() {
    return selectedLocation;
  }

  function setSelectedLocation(locIdOrObj) {
    let loc = null;
    if (typeof locIdOrObj === 'string') {
      loc = SnapData.locations.find(l => l.id === locIdOrObj) || {
        id: 'custom-' + Date.now(),
        name: locIdOrObj,
        city: 'Local Area',
        radius: '3.0 km'
      };
    } else if (locIdOrObj && typeof locIdOrObj === 'object') {
      loc = locIdOrObj;
    }
    if (loc) {
      selectedLocation = loc;
      try {
        localStorage.setItem(LOC_KEY, JSON.stringify(loc));
      } catch (e) {}
      SnapKart.showToast(`Delivery area set to ${loc.name}`, 'info');
      if (window.CustomerUI) window.CustomerUI.renderLocation();
    }
  }

  /* ==========================================================================
     Auth State
     ========================================================================== */
  function getAuth() {
    return {
      isAuthenticated,
      user: userProfile
    };
  }

  function setAuth(status, profile = null) {
    isAuthenticated = status;
    if (profile) userProfile = { ...userProfile, ...profile };
    SnapKart.showToast(status ? `Welcome back, ${userProfile.name}!` : 'Signed out', 'info');
    if (window.CustomerUI) window.CustomerUI.renderAuth();
  }

  return {
    init,
    getCart,
    getCartItemsCount,
    getCartCalculations,
    setFulfillmentType,
    addToCart,
    confirmShopSwitch,
    cancelShopSwitch,
    updateItemQty,
    clearCart,
    placeOrder,
    getAddresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    getSelectedLocation,
    setSelectedLocation,
    getAuth,
    setAuth,
    getOrders: () => pastOrders
  };
})();

// Auto-initialize
CustomerStore.init();
window.CustomerStore = CustomerStore;
