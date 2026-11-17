/**
 * SnapKart Delivery Partner Interface - Sample Dataset
 * Isolated sample dataset for rider profile, vehicles, active mission,
 * delivery requests, history, and earnings.
 * NOTE: All data is temporary demonstration data.
 */

const DeliveryData = {
  isDemo: true,
  demoDisclaimer: "DEMONSTRATION SYSTEM: Rider GPS telemetry, OTP handovers, and wallet payouts are simulated for preview purposes.",

  // Rider Profile & Identity
  riderProfile: {
    riderId: 'RDR-402',
    name: 'Vikram Singh',
    phone: '+91 98450 67890',
    email: 'vikram.singh@delivery.snapkart.in',
    avatar: 'VS',
    rating: 4.96,
    totalTrips: 418,
    joinedDate: 'November 2025',
    zone: 'Indiranagar Cluster (0-4 km)',
    dutyStatus: 'online', // 'online' or 'offline'
    shiftTimeMinutes: 240, // 4 hours on shift
    emergencyContact: '+91 98200 11223 (Pooja Singh - Sister)'
  },

  // Vehicle Details
  vehicle: {
    type: 'Electric Scooter (EV)',
    icon: '🛵',
    model: 'Ather 450X Gen 3',
    registrationNumber: 'KA-03-HA-8821',
    color: 'Space Grey',
    batteryPercentage: 78,
    estRangeKm: 64,
    insuranceValidUntil: '15 March 2027',
    emissionNorm: 'Zero Emission EV'
  },

  // Document Verification Status
  documents: [
    {
      id: 'doc-dl',
      name: 'Driving License (MCWG & LMV)',
      docNumber: 'DL-KA03-2021-009482',
      status: 'verified', // 'verified', 'pending', 'expired'
      verifiedDate: '12 Nov 2025',
      validUntil: '11 Nov 2035'
    },
    {
      id: 'doc-rc',
      name: 'Vehicle Registration Certificate (RC)',
      docNumber: 'RC-KA03HA8821',
      status: 'verified',
      verifiedDate: '12 Nov 2025',
      validUntil: '20 Oct 2036'
    },
    {
      id: 'doc-ins',
      name: 'Comprehensive Vehicle Insurance',
      docNumber: 'POL-HDFC-991204',
      status: 'verified',
      verifiedDate: '15 Mar 2026',
      validUntil: '15 Mar 2027'
    },
    {
      id: 'doc-bg',
      name: 'Background Verification & Police Clearance',
      docNumber: 'PCC-BLR-2025-4491',
      status: 'verified',
      verifiedDate: '14 Nov 2025',
      validUntil: 'Lifetime'
    }
  ],

  // Active Mission (In-Progress Delivery)
  activeMission: {
    orderId: 'ORD-9415',
    status: 'at_dealer', // 'assigned', 'at_dealer', 'picked_up', 'in_transit', 'arrived_customer', 'delivered'
    statusLabel: 'Collect Package at Merchant',
    estimatedPayout: 5.80,
    baseFare: 3.50,
    distanceKm: 1.5,
    distanceBonus: 1.30,
    peakSurge: 1.00,
    slaMinutesRemaining: 14,
    
    // Merchant Pickup Info
    shop: {
      id: 'shop-1',
      name: 'Indiranagar TechHub',
      category: 'Electronics & Audio',
      address: '#42, 100 Feet Road, HAL 2nd Stage, Indiranagar',
      phone: '+91 80 4123 9988',
      distanceFromRider: '0.4 km (2 mins away)',
      managerName: 'Vikram Mehta',
      pickupInstructions: 'Collect from Counter 2. Ask for staff pack ID #9415.',
      pickupOtp: '8492' // Expected OTP from Merchant
    },

    // Customer Drop Info
    customer: {
      name: 'Rajesh Kumar',
      maskedPhone: '+91 98450 XXXXX',
      address: 'Apt 302, Palm Breeze, 4th Cross Road, Indiranagar',
      landmark: 'Near BDA Complex, Opposite Cafe Coffee Day',
      distanceFromShop: '1.1 km (4 mins ride)',
      deliveryNotes: 'Please ring bell 302 and leave package with security if door unanswered.',
      deliveryOtp: '6149' // Expected OTP from Customer
    },

    // Package Items
    items: [
      { name: 'Apex Ultra Gen-4 AMOLED Smartwatch (Ocean Blue)', qty: 1, fragile: true, weight: '350g' }
    ],

    // Simulated Navigation Guidance Steps
    navigationSteps: [
      { instruction: 'Head north on 100 Feet Road toward 12th Main', distance: '250m' },
      { instruction: 'Turn right at Indiranagar TechHub entrance', distance: '150m' },
      { instruction: 'Head east on CMH Road towards 4th Cross', distance: '800m' },
      { instruction: 'Arrived at Palm Breeze Apartments (Customer)', distance: '300m' }
    ]
  },

  // Available Incoming Broadcast Requests Queue
  incomingRequests: [
    {
      id: 'REQ-108',
      orderId: 'ORD-9428',
      merchantName: 'Green Valley Organic Mart',
      merchantAddress: '12th Main, Indiranagar (0.6 km)',
      customerName: 'Ananya D.',
      customerAddress: 'Villa 12, Defence Colony (1.8 km)',
      itemsSummary: '2x Wild Forest Honey Jar, 1x Cold-Pressed Olive Oil',
      payout: 4.90,
      totalDistanceKm: 2.4,
      estDurationMin: 18,
      timerSeconds: 30
    },
    {
      id: 'REQ-109',
      orderId: 'ORD-9432',
      merchantName: 'Velocity Sports & Apparel',
      merchantAddress: 'CMH Road Metro (1.2 km)',
      customerName: 'Siddharth R.',
      customerAddress: 'Orchid Manor, Domlur (2.1 km)',
      itemsSummary: '1x Nike Pegasus Pro Running Shoes (Size 10)',
      payout: 6.20,
      totalDistanceKm: 3.3,
      estDurationMin: 24,
      timerSeconds: 45
    }
  ],

  // Delivery History
  history: [
    {
      id: 'TRIP-8841',
      orderId: 'ORD-9411',
      date: 'Today, 2:40 PM',
      merchant: 'Green Valley Organic Mart',
      customer: 'Priya Sharma (Silver Oak, 12th Main)',
      distanceKm: 1.2,
      timeTakenMin: 14,
      payout: 4.80,
      tip: 2.00,
      totalEarned: 6.80,
      status: 'Completed'
    },
    {
      id: 'TRIP-8840',
      orderId: 'ORD-9398',
      date: 'Today, 1:15 PM',
      merchant: 'Indiranagar TechHub',
      customer: 'Karan Joshi (Domlur Stage 2)',
      distanceKm: 2.2,
      timeTakenMin: 21,
      payout: 5.50,
      tip: 0.00,
      totalEarned: 5.50,
      status: 'Completed'
    },
    {
      id: 'TRIP-8839',
      orderId: 'ORD-9377',
      date: 'Today, 11:30 AM',
      merchant: 'PrimeCare Local Chemist',
      customer: 'Sunil Rao (HAL 2nd Stage)',
      distanceKm: 0.8,
      timeTakenMin: 9,
      payout: 4.00,
      tip: 1.50,
      totalEarned: 5.50,
      status: 'Completed'
    },
    {
      id: 'TRIP-8838',
      orderId: 'ORD-9352',
      date: 'Yesterday, 8:15 PM',
      merchant: 'Velocity Sports & Apparel',
      customer: 'Sneha K. (Indiranagar Club)',
      distanceKm: 1.6,
      timeTakenMin: 16,
      payout: 5.20,
      tip: 3.00,
      totalEarned: 8.20,
      status: 'Completed'
    }
  ],

  // Earnings Summary & Wallet
  earnings: {
    todayTotal: 48.30,
    todayTrips: 9,
    todayHours: 4.2,
    todayBaseFare: 36.80,
    todayTips: 6.50,
    todaySurgeBonus: 5.00,
    weekTotal: 312.50,
    weekTrips: 58,
    walletBalance: 124.80,
    bankAccount: 'HDFC Bank Ltd ••••8812',
    incentiveTarget: {
      tripsRequired: 12,
      tripsDone: 9,
      bonusAmount: 15.00
    }
  }
};

window.DeliveryData = DeliveryData;
