/**
 * SnapKart Platform Admin Operations - Sample Dataset
 * Comprehensive dataset for admin metrics, users, merchants, riders,
 * KYC approvals, orders, disputes, commission rules, settlements, and audit logs.
 * NOTE: All data is temporary demonstration data.
 */

const AdminData = {
  isDemo: true,
  demoDisclaimer: "DEMONSTRATION SYSTEM: Platform governance telemetry, payouts, and KYC verification queues are simulated.",

  // Admin Profile & Auth
  currentAdmin: {
    adminId: 'ADM-001',
    name: 'Super Admin Operations',
    email: 'admin@snapkart.internal',
    role: 'Root Administrator',
    lastLogin: 'Today, 21:15 IST'
  },

  // Platform Macro Statistics
  stats: {
    todayGMV: 84290.00,
    gmvGrowthPercent: 22.4,
    totalOrdersToday: 1420,
    ordersGrowthPercent: 18.5,
    activeVendorsCount: 128,
    activeRidersCount: 312,
    visualSearchQueriesToday: 3840,
    visualSearchAccuracyRate: '94.8%',
    hyperlocalSlaCompliance: '98.2%',
    averageDeliveryMinutes: '14.2 min',
    openDisputesCount: 2
  },

  // Customer Management Records
  customers: [
    {
      id: 'CUST-1001',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98450 12345',
      hub: 'Indiranagar 100ft Rd',
      ordersCount: 14,
      totalSpent: 482.50,
      status: 'Active',
      joinedDate: '15 March 2026'
    },
    {
      id: 'CUST-1002',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      phone: '+91 98450 11223',
      hub: 'Indiranagar Central',
      ordersCount: 8,
      totalSpent: 624.00,
      status: 'Active',
      joinedDate: '22 March 2026'
    },
    {
      id: 'CUST-1003',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@example.com',
      phone: '+91 99012 44556',
      hub: 'Defence Colony',
      ordersCount: 5,
      totalSpent: 189.50,
      status: 'Active',
      joinedDate: '02 April 2026'
    },
    {
      id: 'CUST-1004',
      name: 'Rohan Verma',
      email: 'rohan.v@example.com',
      phone: '+91 98765 43210',
      hub: 'Koramangala 5th Block',
      ordersCount: 1,
      totalSpent: 35.00,
      status: 'Suspended',
      joinedDate: '10 April 2026'
    }
  ],

  // Dealer and Shop Management
  dealers: [
    {
      id: 'DLR-8821',
      storeName: 'Indiranagar TechHub',
      ownerName: 'Vikram Mehta',
      category: 'Electronics & Audio',
      address: '#42, 100ft Road, Indiranagar',
      phone: '+91 80 4123 9988',
      activeProducts: 5,
      dispatchRadiusKm: 3.5,
      rating: 4.92,
      commissionRate: '8.0%',
      kycStatus: 'Verified',
      status: 'Active'
    },
    {
      id: 'DLR-8822',
      storeName: 'Green Valley Organic Mart',
      ownerName: 'Ramesh Patel',
      category: 'Organic Groceries',
      address: '#18, 12th Main, Indiranagar',
      phone: '+91 80 2520 1144',
      activeProducts: 8,
      dispatchRadiusKm: 3.0,
      rating: 4.85,
      commissionRate: '8.0%',
      kycStatus: 'Verified',
      status: 'Active'
    },
    {
      id: 'DLR-8823',
      storeName: 'Velocity Sports & Apparel',
      ownerName: 'Sunil Rao',
      category: 'Fashion & Footwear',
      address: '#89, CMH Road, Indiranagar',
      phone: '+91 80 2521 8877',
      activeProducts: 6,
      dispatchRadiusKm: 4.0,
      rating: 4.78,
      commissionRate: '8.0%',
      kycStatus: 'Verified',
      status: 'Active'
    },
    {
      id: 'DLR-8824',
      storeName: 'Artisan Bakery & Roastery',
      ownerName: 'Anita Rao',
      category: 'Bakery & Cafe',
      address: '12th Main Indiranagar',
      phone: '+91 99012 88441',
      activeProducts: 0,
      dispatchRadiusKm: 2.5,
      rating: 0.0,
      commissionRate: '8.0%',
      kycStatus: 'Pending',
      status: 'Awaiting KYC'
    }
  ],

  // Delivery Partner Management
  riders: [
    {
      id: 'RDR-402',
      name: 'Vikram Singh',
      phone: '+91 98450 67890',
      vehicleType: 'Electric Scooter (EV)',
      plateNumber: 'KA-03-HA-8821',
      rating: 4.96,
      completedTrips: 418,
      onDuty: true,
      kycStatus: 'Verified',
      status: 'Active'
    },
    {
      id: 'RDR-403',
      name: 'Arun Patel',
      phone: '+91 98200 44551',
      vehicleType: 'Motorcycle (Petrol)',
      plateNumber: 'KA-03-EN-9941',
      rating: 4.88,
      completedTrips: 342,
      onDuty: true,
      kycStatus: 'Verified',
      status: 'Active'
    },
    {
      id: 'RDR-404',
      name: 'Deepak Nair',
      phone: '+91 98451 22334',
      vehicleType: 'Bicycle (Hyperlocal)',
      plateNumber: 'N/A',
      rating: 4.92,
      completedTrips: 189,
      onDuty: false,
      kycStatus: 'Verified',
      status: 'Active'
    },
    {
      id: 'RDR-405',
      name: 'Suresh Kumar',
      phone: '+91 97410 99882',
      vehicleType: 'EV Scooter',
      plateNumber: 'KA-04-EA-1102',
      rating: 0.0,
      completedTrips: 0,
      onDuty: false,
      kycStatus: 'Pending',
      status: 'Awaiting Onboarding'
    }
  ],

  // Verification & Approval Queues
  pendingApprovals: {
    merchants: [
      {
        id: 'APP-MER-1',
        dealerId: 'DLR-8824',
        businessName: 'Artisan Bakery & Roastery',
        applicantName: 'Anita Rao',
        phone: '+91 99012 88441',
        tradeLicense: 'BLR/KA/TL-2026-1049',
        gstin: '29AAACA1122D1Z8',
        submittedDate: 'Today, 11:30 AM',
        category: 'Bakery & Cafe',
        location: 'Indiranagar 12th Main',
        docType: 'GSTIN Certificate + FSSAI Food License'
      },
      {
        id: 'APP-MER-2',
        dealerId: 'DLR-8825',
        businessName: 'Apex Mobile Care & Gadgets',
        applicantName: 'Suresh M.',
        phone: '+91 98450 44991',
        tradeLicense: 'BLR/KA/TL-2026-2004',
        gstin: '29XYZAB8899C1Z4',
        submittedDate: 'Yesterday, 17:45 PM',
        category: 'Electronics',
        location: 'Domlur Layout',
        docType: 'Trade License + PAN Document'
      }
    ],
    riders: [
      {
        id: 'APP-RDR-1',
        riderId: 'RDR-405',
        applicantName: 'Suresh Kumar',
        phone: '+91 97410 99882',
        vehicleType: 'Electric Scooter (EV)',
        plateNumber: 'KA-04-EA-1102',
        dlNumber: 'DL-KA04-2023-884102',
        submittedDate: 'Today, 14:20 PM',
        docType: 'Driving License + RC Copy + Aadhaar'
      }
    ]
  },

  // Categories & Global Products
  categories: [
    { id: 'cat-1', name: 'Electronics & Audio', icon: '⚡', productCount: 42, active: true },
    { id: 'cat-2', name: 'Organic Groceries', icon: '🥦', productCount: 58, active: true },
    { id: 'cat-3', name: 'Fashion & Footwear', icon: '👟', productCount: 36, active: true },
    { id: 'cat-4', name: 'Smart Wearables', icon: '⌚', productCount: 24, active: true },
    { id: 'cat-5', name: 'Pharmacy & Care', icon: '💊', productCount: 24, active: true }
  ],

  // Platform Orders Cross-Section
  orders: [
    {
      id: 'ORD-9421',
      date: 'Today, 21:10 IST',
      customer: 'Rajesh Kumar',
      store: 'Indiranagar TechHub',
      rider: 'Vikram Singh (#DL-402)',
      total: 348.00,
      platformFee: 27.84,
      status: 'In Transit',
      statusCode: 'in_transit'
    },
    {
      id: 'ORD-9419',
      date: 'Today, 21:02 IST',
      customer: 'Ananya Deshmukh',
      store: 'Indiranagar TechHub',
      rider: 'Arun Patel (#DL-403)',
      total: 52.50,
      platformFee: 4.20,
      status: 'Preparing',
      statusCode: 'preparing'
    },
    {
      id: 'ORD-9415',
      date: 'Today, 20:45 IST',
      customer: 'Rajesh Kumar',
      store: 'Indiranagar TechHub',
      rider: 'Vikram Singh (#DL-402)',
      total: 199.00,
      platformFee: 15.92,
      status: 'Delivered',
      statusCode: 'delivered'
    },
    {
      id: 'ORD-8921',
      date: 'Today, 19:30 IST',
      customer: 'Priya Sharma',
      store: 'Green Valley Organic',
      rider: 'Arun Patel (#DL-403)',
      total: 28.50,
      platformFee: 2.28,
      status: 'Disputed',
      statusCode: 'disputed'
    }
  ],

  // Refund and Complaint Management
  disputes: [
    {
      id: 'DSP-309',
      orderId: 'ORD-8921',
      customerName: 'Priya Sharma',
      storeName: 'Green Valley Organic Mart',
      riderName: 'Arun Patel (#DL-403)',
      amount: 28.50,
      reason: 'Package seal compromised during transit',
      customerClaim: 'Glass jar of honey had broken outer seal upon doorstep arrival.',
      dealerNote: 'Item was dispatched intact in bubble wrapper.',
      status: 'Open',
      reportedAt: '45 mins ago'
    },
    {
      id: 'DSP-308',
      orderId: 'ORD-8842',
      customerName: 'Karan Joshi',
      storeName: 'Velocity Sports & Apparel',
      riderName: 'Vikram Singh (#DL-402)',
      amount: 129.50,
      reason: 'Incorrect Shoe Size Delivered',
      customerClaim: 'Ordered US Size 10, box contained US Size 8.',
      dealerNote: 'Inventory tag swapped in store. Replacement ready.',
      status: 'Open',
      reportedAt: '2 hours ago'
    }
  ],

  // Commission & Surge Rules
  commissionRules: {
    baseTakeRatePercent: 8.0,
    monsoonSurgeMultiplier: 1.25,
    nightSurgeMultiplier: 1.15,
    minimumDeliveryBaseFare: 3.50,
    riderPerKmRate: 1.20,
    customerCancellationFee: 2.00
  },

  // Settlements Overview
  settlements: [
    {
      id: 'BATCH-2026-W46',
      cycle: '07 Nov – 13 Nov 2026',
      totalOrders: 9420,
      grossTurnover: 548900.00,
      dealerPayouts: 489400.00,
      riderPayouts: 37400.00,
      platformNetProfit: 22100.00,
      status: 'Settled to Bank',
      settlementDate: '14 Nov 2026'
    },
    {
      id: 'BATCH-2026-W47',
      cycle: '14 Nov – 20 Nov 2026 (Live)',
      totalOrders: 6240,
      grossTurnover: 394200.00,
      dealerPayouts: 351200.00,
      riderPayouts: 26800.00,
      platformNetProfit: 16200.00,
      status: 'Accumulating (Friday Release)',
      settlementDate: '21 Nov 2026'
    }
  ],

  // System Audit & Activity Logs
  auditLogs: [
    {
      id: 'LOG-9924',
      timestamp: 'Today, 21:05 IST',
      adminUser: 'admin@snapkart.internal',
      action: 'SURGE_PRICING_UPDATED',
      details: 'Monsoon surge multiplier set to 1.25x for Indiranagar cluster',
      ipAddress: '192.168.1.104'
    },
    {
      id: 'LOG-9923',
      timestamp: 'Today, 20:48 IST',
      adminUser: 'admin@snapkart.internal',
      action: 'VENDOR_KYC_VERIFIED',
      details: 'Approved merchant registration for Velocity Sports & Apparel',
      ipAddress: '192.168.1.104'
    },
    {
      id: 'LOG-9922',
      timestamp: 'Today, 19:12 IST',
      adminUser: 'admin@snapkart.internal',
      action: 'DISPUTE_INSPECTED',
      details: 'Opened investigation for Dispute #DSP-309 (Broken Honey Seal)',
      ipAddress: '192.168.1.104'
    },
    {
      id: 'LOG-9921',
      timestamp: 'Today, 16:30 IST',
      adminUser: 'system_cron',
      action: 'SETTLEMENT_BATCH_GENERATED',
      details: 'Accumulated weekly transaction totals for BATCH-2026-W47',
      ipAddress: '10.0.0.12'
    }
  ]
};

window.AdminData = AdminData;
