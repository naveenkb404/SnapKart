/**
 * SnapKart Dealer Dashboard - Sample Data
 * Isolated sample dataset for store management, inventory, orders, reservations, and finance.
 * Ready for future Django REST API replacement.
 * NOTE: All data is temporary demonstration data.
 */

const DealerData = {
  isDemo: true,
  demoDisclaimer: "DEMONSTRATION SYSTEM: Merchant telemetry, payouts, and dispatch queues are simulated for preview purposes.",

  // Dealer Auth & Shop Verification
  merchantProfile: {
    dealerId: 'DLR-8821',
    merchantName: 'Vikram Mehta',
    businessEmail: 'vikram.mehta@techhub.in',
    phone: '+91 80 4123 9988',
    storeName: 'Indiranagar TechHub',
    legalEntityName: 'TechHub Electronics India Private Limited',
    category: 'Electronics & Audio',
    tradeLicenseNo: 'BLR/KA/TL-2024-9982',
    gstin: '29ABCDE1234F1Z5',
    panNumber: 'ABCDE1234F',
    verificationStatus: 'verified', // 'pending', 'verified', 'action_required'
    verificationDate: '12 January 2026',
    verifiedBadge: true,
    bankDetails: {
      accountHolder: 'TechHub Electronics India Pvt Ltd',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '••••••••4819',
      ifscCode: 'HDFC0000128',
      branch: 'Indiranagar 100ft Road'
    }
  },

  // Shop Settings & Geospatial Parameters
  shopSettings: {
    storeName: 'Indiranagar TechHub',
    description: 'Premier neighbourhood electronics boutique specializing in noise-cancelling headphones, high-speed chargers, smart wearables, and gaming gear. Guaranteed 15-minute dispatch.',
    phone: '+91 80 4123 9988',
    email: 'orders@indiranagartechhub.com',
    emergencyContact: '+91 98450 99882',
    address: '#42, 100 Feet Road, HAL 2nd Stage, Indiranagar',
    city: 'Bangalore',
    pincode: '560038',
    lat: 12.9789,
    lng: 77.6412,
    dispatchRadiusKm: 3.5,
    minOrderValue: 10.00,
    storeStatus: 'open', // 'open' or 'paused'
    pauseReason: '',
    autoAcceptOrders: true,
    openingHours: [
      { day: 'Monday', open: '09:00', close: '22:30', closed: false },
      { day: 'Tuesday', open: '09:00', close: '22:30', closed: false },
      { day: 'Wednesday', open: '09:00', close: '22:30', closed: false },
      { day: 'Thursday', open: '09:00', close: '22:30', closed: false },
      { day: 'Friday', open: '09:00', close: '23:00', closed: false },
      { day: 'Saturday', open: '09:00', close: '23:00', closed: false },
      { day: 'Sunday', open: '09:30', close: '22:00', closed: false }
    ]
  },

  // Products & Inventory Catalog
  products: [
    {
      id: 'prod-1',
      title: 'Sony WH-1000XM5 Wireless Headphones',
      category: 'Electronics',
      brand: 'Sony',
      sku: 'IND-TECH-901',
      mrp: 399.00,
      price: 348.00,
      stock: 12,
      lowStockThreshold: 5,
      status: 'in_stock', // 'in_stock', 'low_stock', 'out_of_stock'
      image: '../../static/images/placeholder.svg',
      description: 'Industry-leading noise cancelling with two processors and eight microphones.',
      hasVariants: true,
      variants: [
        { name: 'Color: Platinum Silver', sku: 'IND-TECH-901-SIL', price: 348.00, stock: 7 },
        { name: 'Color: Midnight Black', sku: 'IND-TECH-901-BLK', price: 348.00, stock: 5 }
      ],
      visualSearchIndexed: true,
      lastUpdated: '12 mins ago'
    },
    {
      id: 'prod-4',
      title: 'Apex Ultra Gen-4 AMOLED Smartwatch',
      category: 'Wearables',
      brand: 'Apex Tech',
      sku: 'IND-TECH-411',
      mrp: 240.00,
      price: 199.00,
      stock: 8,
      lowStockThreshold: 4,
      status: 'in_stock',
      image: '../../static/images/placeholder.svg',
      description: 'Titanium aerospace casing with 1.43" Always-on Sapphire AMOLED display.',
      hasVariants: true,
      variants: [
        { name: 'Strap: Ocean Blue Silicone', sku: 'IND-TECH-411-BLU', price: 199.00, stock: 5 },
        { name: 'Strap: Titanium Mesh Link', sku: 'IND-TECH-411-TI', price: 219.00, stock: 3 }
      ],
      visualSearchIndexed: true,
      lastUpdated: '25 mins ago'
    },
    {
      id: 'prod-5',
      title: '65W GaN Compact Rapid Charger',
      category: 'Accessories',
      brand: 'VoltSpeed',
      sku: 'IND-TECH-108',
      mrp: 45.00,
      price: 34.50,
      stock: 3,
      lowStockThreshold: 5,
      status: 'low_stock',
      image: '../../static/images/placeholder.svg',
      description: 'Triple-port GaN fast charger with 2x USB-C and 1x USB-A QC 4.0.',
      hasVariants: false,
      variants: [],
      visualSearchIndexed: true,
      lastUpdated: '35 mins ago'
    },
    {
      id: 'prod-7',
      title: 'Braided 240W USB-C to USB-C Cable (2m)',
      category: 'Accessories',
      brand: 'VoltSpeed',
      sku: 'IND-TECH-114',
      mrp: 24.00,
      price: 18.00,
      stock: 22,
      lowStockThreshold: 6,
      status: 'in_stock',
      image: '../../static/images/placeholder.svg',
      description: 'Ultra-durable Kevlar reinforced cable with 480Mbps data transfer speed.',
      hasVariants: false,
      variants: [],
      visualSearchIndexed: true,
      lastUpdated: '1 hour ago'
    },
    {
      id: 'prod-8',
      title: 'Wireless Ergonomic Mechanical Keyboard RGB',
      category: 'Electronics',
      brand: 'KeyPro',
      sku: 'IND-TECH-602',
      mrp: 120.00,
      price: 98.00,
      stock: 0,
      lowStockThreshold: 4,
      status: 'out_of_stock',
      image: '../../static/images/placeholder.svg',
      description: 'Hot-swappable tactile switches with multi-device Bluetooth and 2.4GHz.',
      hasVariants: true,
      variants: [
        { name: 'Switch: Gateron Red (Linear)', sku: 'IND-TECH-602-RED', price: 98.00, stock: 0 },
        { name: 'Switch: Gateron Brown (Tactile)', sku: 'IND-TECH-602-BRN', price: 98.00, stock: 0 }
      ],
      visualSearchIndexed: true,
      lastUpdated: '2 hours ago'
    }
  ],

  // Live Orders Pipeline
  orders: [
    {
      id: 'ORD-9421',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98450 11223',
      orderTime: 'Just now (2 mins ago)',
      deliveryType: 'Delivery',
      deliveryAddress: 'Apt 302, Palm Breeze, 4th Cross, Indiranagar (0.8 km)',
      items: [
        { name: 'Sony WH-1000XM5 Wireless Headphones (Midnight Black)', qty: 1, price: 348.00 }
      ],
      subtotal: 348.00,
      platformFee: 27.84, // 8% commission
      netPayout: 320.16,
      status: 'incoming', // 'incoming', 'preparing', 'ready', 'dispatched', 'rejected'
      assignedDriver: 'Pending Acceptance',
      notes: 'Please pack in weatherproof bubble sleeve'
    },
    {
      id: 'ORD-9419',
      customerName: 'Ananya Deshmukh',
      customerPhone: '+91 99012 44556',
      orderTime: '6 mins ago',
      deliveryType: 'Delivery',
      deliveryAddress: 'Villa 12, Defence Colony, Indiranagar (1.4 km)',
      items: [
        { name: '65W GaN Compact Rapid Charger', qty: 1, price: 34.50 },
        { name: 'Braided 240W USB-C Cable (2m)', qty: 1, price: 18.00 }
      ],
      subtotal: 52.50,
      platformFee: 4.20,
      netPayout: 48.30,
      status: 'preparing',
      assignedDriver: 'Arun Patel (Arriving in 4m)',
      prepTimerMin: 6,
      notes: ''
    },
    {
      id: 'ORD-9415',
      customerName: 'Dr. Siddharth Rao',
      customerPhone: '+91 98200 88991',
      orderTime: '14 mins ago',
      deliveryType: 'Delivery',
      deliveryAddress: 'Flat 4A, Orchid Manor, CMH Road (0.9 km)',
      items: [
        { name: 'Apex Ultra Gen-4 AMOLED Smartwatch (Ocean Blue)', qty: 1, price: 199.00 }
      ],
      subtotal: 199.00,
      platformFee: 15.92,
      netPayout: 183.08,
      status: 'ready',
      assignedDriver: 'Vikram Singh (#DL-402) - At Store Door',
      pickupOtp: '8492',
      notes: 'Customer requested gift receipt'
    }
  ],

  // In-Store Customer Pickup Reservations
  reservations: [
    {
      id: 'RES-302',
      customerName: 'Neha Sen',
      customerPhone: '+91 97410 77665',
      reservationCode: 'SK-849',
      pickupTimeSlot: 'Today, 4:00 PM – 5:00 PM',
      items: [
        { name: 'Sony WH-1000XM5 Headphones (Platinum Silver)', qty: 1, price: 348.00 }
      ],
      totalAmount: 348.00,
      status: 'pending_confirmation', // 'pending_confirmation', 'confirmed_ready', 'collected', 'cancelled'
      createdAt: '30 mins ago'
    },
    {
      id: 'RES-298',
      customerName: 'Karan Joshi',
      customerPhone: '+91 98860 33441',
      reservationCode: 'SK-214',
      pickupTimeSlot: 'Today, 2:30 PM – 3:30 PM',
      items: [
        { name: '65W GaN Compact Rapid Charger', qty: 2, price: 34.50 }
      ],
      totalAmount: 69.00,
      status: 'confirmed_ready',
      createdAt: '2 hours ago'
    },
    {
      id: 'RES-285',
      customerName: 'Sneha Kapoor',
      customerPhone: '+91 99450 11990',
      reservationCode: 'SK-702',
      pickupTimeSlot: 'Yesterday, 5:30 PM',
      items: [
        { name: 'Braided 240W USB-C Cable (2m)', qty: 1, price: 18.00 }
      ],
      totalAmount: 18.00,
      status: 'collected',
      createdAt: 'Yesterday'
    }
  ],

  // Financial Ledger & Weekly Settlement Payouts
  finances: {
    lifetimeGMV: 48920.00,
    currentMonthGMV: 14285.50,
    todayGMV: 1428.50,
    availableBalance: 2840.10,
    pendingSettlement: 1145.40,
    nextPayoutDate: 'Friday, 21 Nov 2026',
    platformCommissionRate: '8.0%',
    
    // Settlement Batches
    settlements: [
      {
        id: 'SETTL-9021',
        period: '07 Nov – 13 Nov 2026',
        grossSales: 6420.00,
        platformFee: 513.60,
        gatewayFee: 64.20,
        netPayout: 5842.20,
        status: 'Processed & Deposited',
        payoutDate: '14 Nov 2026',
        bankRefNumber: 'UTR-HDFC-99482012'
      },
      {
        id: 'SETTL-8942',
        period: '31 Oct – 06 Nov 2026',
        grossSales: 5890.00,
        platformFee: 471.20,
        gatewayFee: 58.90,
        netPayout: 5359.90,
        status: 'Processed & Deposited',
        payoutDate: '07 Nov 2026',
        bankRefNumber: 'UTR-HDFC-88129401'
      },
      {
        id: 'SETTL-Current',
        period: '14 Nov – 20 Nov 2026 (In Progress)',
        grossSales: 4120.00,
        platformFee: 329.60,
        gatewayFee: 41.20,
        netPayout: 3749.20,
        status: 'Accumulating (Pending Friday Batch)',
        payoutDate: '21 Nov 2026',
        bankRefNumber: 'Pending Cycle'
      }
    ],

    // Individual Transaction Records
    transactions: [
      { id: 'TXN-491', orderId: 'ORD-9415', date: 'Today, 2:10 PM', gross: 199.00, commission: 15.92, net: 183.08, status: 'Settled to Wallet' },
      { id: 'TXN-490', orderId: 'ORD-9411', date: 'Yesterday, 6:40 PM', gross: 34.50, commission: 2.76, net: 31.74, status: 'Settled to Wallet' },
      { id: 'TXN-489', orderId: 'ORD-9388', date: 'Yesterday, 3:15 PM', gross: 148.00, commission: 11.84, net: 136.16, status: 'Settled to Wallet' },
      { id: 'TXN-488', orderId: 'ORD-9372', date: '15 Nov, 7:20 PM', gross: 348.00, commission: 27.84, net: 320.16, status: 'Bank Transfer Complete' }
    ]
  }
};

window.DealerData = DealerData;
