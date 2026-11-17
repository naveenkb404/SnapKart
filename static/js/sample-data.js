/**
 * SnapKart Hyperlocal Marketplace - Sample Dataset
 * Stored separately from UI logic for easy replacement with Django REST APIs.
 * NOTE: All data is temporary demonstration data.
 */

const SnapData = {
  isDemo: true,
  demoDisclaimer: "DEMONSTRATION DATA: Hyperlocal stocks, camera recognition, and telemetry are simulated for preview purposes.",

  // Local Neighbourhood Delivery Hubs / Locations
  locations: [
    { id: 'loc-1', name: 'Indiranagar 100ft Rd', area: 'Indiranagar', city: 'Bangalore', lat: 12.9784, lng: 77.6408, default: true },
    { id: 'loc-2', name: 'Koramangala 5th Block', area: 'Koramangala', city: 'Bangalore', lat: 12.9352, lng: 77.6245 },
    { id: 'loc-3', name: 'HSR Layout Sector 2', area: 'HSR Layout', city: 'Bangalore', lat: 12.9121, lng: 77.6446 },
    { id: 'loc-4', name: 'Whitefield Main Road', area: 'Whitefield', city: 'Bangalore', lat: 12.9698, lng: 77.7499 }
  ],

  // Product Categories
  categories: [
    { id: 'all', name: 'All Items', icon: '🌟', count: 184 },
    { id: 'electronics', name: 'Electronics & Audio', icon: '⚡', count: 42 },
    { id: 'groceries', name: 'Organic Groceries', icon: '🥦', count: 58 },
    { id: 'fashion', name: 'Fashion & Footwear', icon: '👟', count: 36 },
    { id: 'wearables', name: 'Smart Wearables', icon: '⌚', count: 24 },
    { id: 'pharmacy', name: 'Pharmacy & Wellness', icon: '💊', count: 24 }
  ],

  // Hyperlocal Verified Shops
  shops: [
    {
      id: 'shop-1',
      name: 'Indiranagar TechHub',
      category: 'Electronics',
      avatar: 'IT',
      rating: 4.9,
      reviewsCount: 428,
      distanceKm: 0.8,
      deliveryTimeMin: 18,
      deliveryFee: 2.49,
      minOrder: 10.00,
      address: '#42, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bangalore 560038',
      phone: '+91 80 4123 9988',
      hours: '9:00 AM – 10:30 PM',
      verified: true,
      acceptsPickup: true,
      description: 'Authorized local dealer for premium electronics, wireless audio, smartphone accessories, and gaming peripherals. Guaranteed 15-minute dispatch.',
      lat: 12.9789,
      lng: 77.6412
    },
    {
      id: 'shop-2',
      name: 'Green Valley Organic Mart',
      category: 'Organic Groceries',
      avatar: 'GV',
      rating: 4.8,
      reviewsCount: 194,
      distanceKm: 0.5,
      deliveryTimeMin: 12,
      deliveryFee: 1.99,
      minOrder: 5.00,
      address: '#18, 12th Main Road, Indiranagar, Bangalore 560008',
      phone: '+91 80 2520 1144',
      hours: '7:30 AM – 9:30 PM',
      verified: true,
      acceptsPickup: true,
      description: 'Farm-fresh certified organic produce, raw wild honeys, cold-pressed oils, and artisanal whole grains sourced directly from local cooperatives.',
      lat: 12.9742,
      lng: 77.6395
    },
    {
      id: 'shop-3',
      name: 'Velocity Sports & Apparel',
      category: 'Fashion & Footwear',
      avatar: 'VS',
      rating: 4.7,
      reviewsCount: 312,
      distanceKm: 1.2,
      deliveryTimeMin: 25,
      deliveryFee: 2.99,
      minOrder: 20.00,
      address: '#89, CMH Road, Near Metro Station, Indiranagar, Bangalore 560038',
      phone: '+91 80 2521 8877',
      hours: '10:00 AM – 9:30 PM',
      verified: true,
      acceptsPickup: true,
      description: 'Neighbourhood athletic hub stocking verified running shoes, activewear, gym gear, and sports hydration equipment with instant size exchanges.',
      lat: 12.9781,
      lng: 77.6450
    },
    {
      id: 'shop-4',
      name: 'Gizmo Hub Hyperlocal',
      category: 'Wearables & Tech',
      avatar: 'GH',
      rating: 4.6,
      reviewsCount: 156,
      distanceKm: 1.9,
      deliveryTimeMin: 30,
      deliveryFee: 3.49,
      minOrder: 15.00,
      address: '#14, Double Road, Domlur Layout, Bangalore 560071',
      phone: '+91 80 4112 5500',
      hours: '10:30 AM – 10:00 PM',
      verified: true,
      acceptsPickup: true,
      description: 'Smart wearables specialist carrying smartwatches, fitness bands, health trackers, and wireless charging docks.',
      lat: 12.9620,
      lng: 77.6380
    },
    {
      id: 'shop-5',
      name: 'PrimeCare Local Chemist',
      category: 'Pharmacy',
      avatar: 'PC',
      rating: 4.9,
      reviewsCount: 520,
      distanceKm: 0.4,
      deliveryTimeMin: 10,
      deliveryFee: 1.49,
      minOrder: 5.00,
      address: '#5, 100ft Road Corner, Indiranagar, Bangalore 560038',
      phone: '+91 80 2528 3322',
      hours: '24 Hours Open',
      verified: true,
      acceptsPickup: true,
      description: 'Licensed 24/7 community pharmacy providing OTC wellness products, first-aid, vitamins, and baby care essentials.',
      lat: 12.9770,
      lng: 77.6420
    }
  ],

  // Products with Multi-Shop Price & Stock Comparisons
  products: [
    {
      id: 'prod-1',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      category: 'electronics',
      brand: 'Sony',
      tag: 'headphones',
      image: '../../static/images/placeholder.svg',
      rating: 4.9,
      reviewsCount: 142,
      basePrice: 348.00,
      mrp: 399.00,
      description: 'Industry-leading noise cancelling with two processors and eight microphones. Exceptional sound quality and ultra-clear hands-free calling.',
      specs: [
        { label: 'Battery Life', value: 'Up to 30 Hours' },
        { label: 'Connectivity', value: 'Bluetooth 5.2 & 3.5mm' },
        { label: 'Weight', value: '250 grams' },
        { label: 'Noise Cancellation', value: 'Auto NC Optimizer' }
      ],
      // Multi-Shop Pricing & Hyperlocal Availability
      shopPrices: [
        {
          shopId: 'shop-1',
          shopName: 'Indiranagar TechHub',
          price: 348.00,
          distanceKm: 0.8,
          deliveryMin: 18,
          stock: 12,
          stockStatus: 'In Stock (12 units left)',
          stockConfirmedMinsAgo: 8,
          isLowestPrice: true
        },
        {
          shopId: 'shop-4',
          shopName: 'Gizmo Hub Hyperlocal',
          price: 355.00,
          distanceKm: 1.9,
          deliveryMin: 30,
          stock: 3,
          stockStatus: 'Low Stock (3 units left)',
          stockConfirmedMinsAgo: 24,
          isLowestPrice: false
        }
      ]
    },
    {
      id: 'prod-2',
      name: 'Nike Pegasus Pro Hyper-Cushion Running Shoes',
      category: 'fashion',
      brand: 'Nike',
      tag: 'sneakers',
      image: '../../static/images/placeholder.svg',
      rating: 4.8,
      reviewsCount: 88,
      basePrice: 129.50,
      mrp: 145.00,
      description: 'Springy ride for every run. Breathable engineered mesh upper paired with Zoom Air cushioning in the forefoot and heel for maximum energy return.',
      specs: [
        { label: 'Surface', value: 'Road / Track' },
        { label: 'Cushioning', value: 'Dual Zoom Air Pods' },
        { label: 'Sizes Available', value: 'US 8, 9, 10, 11' },
        { label: 'Weight', value: '285g (Men 9)' }
      ],
      shopPrices: [
        {
          shopId: 'shop-3',
          shopName: 'Velocity Sports & Apparel',
          price: 129.50,
          distanceKm: 1.2,
          deliveryMin: 25,
          stock: 9,
          stockStatus: 'In Stock (9 pairs)',
          stockConfirmedMinsAgo: 15,
          isLowestPrice: true
        }
      ]
    },
    {
      id: 'prod-3',
      name: 'Himalayan Raw Wild Forest Honey (500g)',
      category: 'groceries',
      brand: 'Nature Crest',
      tag: 'honey',
      image: '../../static/images/placeholder.svg',
      rating: 4.9,
      reviewsCount: 230,
      basePrice: 14.99,
      mrp: 18.50,
      description: '100% pure, unpasteurized, and unfiltered honey gathered from high-altitude wild beehives in the pristine Himalayas. Naturally rich in pollen & enzymes.',
      specs: [
        { label: 'Weight', value: '500 grams' },
        { label: 'Processing', value: 'Cold Filtered / Raw' },
        { label: 'Certification', value: 'India Organic & FSSAI' },
        { label: 'Origin', value: 'Uttarakhand, India' }
      ],
      shopPrices: [
        {
          shopId: 'shop-2',
          shopName: 'Green Valley Organic Mart',
          price: 14.99,
          distanceKm: 0.5,
          deliveryMin: 12,
          stock: 28,
          stockStatus: 'In Stock (28 jars)',
          stockConfirmedMinsAgo: 5,
          isLowestPrice: true
        },
        {
          shopId: 'shop-5',
          shopName: 'PrimeCare Local Chemist',
          price: 16.50,
          distanceKm: 0.4,
          deliveryMin: 10,
          stock: 6,
          stockStatus: 'In Stock (6 jars)',
          stockConfirmedMinsAgo: 32,
          isLowestPrice: false
        }
      ]
    },
    {
      id: 'prod-4',
      name: 'Apex Ultra Gen-4 AMOLED Smartwatch',
      category: 'wearables',
      brand: 'Apex Tech',
      tag: 'smartwatch',
      image: '../../static/images/placeholder.svg',
      rating: 4.7,
      reviewsCount: 76,
      basePrice: 199.00,
      mrp: 240.00,
      description: 'Precision aircraft-grade titanium body with 1.43-inch Always-on Sapphire AMOLED display, dual-frequency GPS, and continuous heart-rate tracking.',
      specs: [
        { label: 'Display', value: '1.43" AMOLED 466x466' },
        { label: 'Water Rating', value: '5 ATM / 50m' },
        { label: 'Sensors', value: 'SpO2, ECG, HR, Barometer' },
        { label: 'Battery', value: '14 Days Typical Use' }
      ],
      shopPrices: [
        {
          shopId: 'shop-1',
          shopName: 'Indiranagar TechHub',
          price: 199.00,
          distanceKm: 0.8,
          deliveryMin: 18,
          stock: 8,
          stockStatus: 'In Stock (8 units)',
          stockConfirmedMinsAgo: 11,
          isLowestPrice: true
        },
        {
          shopId: 'shop-4',
          shopName: 'Gizmo Hub Hyperlocal',
          price: 204.00,
          distanceKm: 1.9,
          deliveryMin: 30,
          stock: 5,
          stockStatus: 'In Stock (5 units)',
          stockConfirmedMinsAgo: 45,
          isLowestPrice: false
        }
      ]
    },
    {
      id: 'prod-5',
      name: '65W GaN Compact Rapid Charger',
      category: 'electronics',
      brand: 'VoltSpeed',
      tag: 'charger',
      image: '../../static/images/placeholder.svg',
      rating: 4.8,
      reviewsCount: 112,
      basePrice: 34.50,
      mrp: 45.00,
      description: 'Next-gen Gallium Nitride (GaN) triple port charger (2x USB-C + 1x USB-A). Charges laptops, phones, and tablets simultaneously at top speeds.',
      specs: [
        { label: 'Total Output', value: '65W Max' },
        { label: 'Ports', value: '2x Type-C PD 3.0, 1x USB-A QC 4.0' },
        { label: 'Form Factor', value: 'Foldable Plug Pocket Size' }
      ],
      shopPrices: [
        {
          shopId: 'shop-1',
          shopName: 'Indiranagar TechHub',
          price: 34.50,
          distanceKm: 0.8,
          deliveryMin: 18,
          stock: 14,
          stockStatus: 'In Stock (14 units)',
          stockConfirmedMinsAgo: 19,
          isLowestPrice: true
        }
      ]
    },
    {
      id: 'prod-6',
      name: 'Cold-Pressed Extra Virgin Olive Oil (1L)',
      category: 'groceries',
      brand: 'Terra Pure',
      tag: 'oliveoil',
      image: '../../static/images/placeholder.svg',
      rating: 4.9,
      reviewsCount: 95,
      basePrice: 22.00,
      mrp: 26.00,
      description: 'Single-estate first cold-pressed olive oil with acidity below 0.3%. Ideal for drizzling over fresh salads, roasted vegetables, and Mediterranean dishes.',
      specs: [
        { label: 'Volume', value: '1000 ml (1 Liter)' },
        { label: 'Extraction', value: 'Mechanical Cold Extraction' },
        { label: 'Packaging', value: 'Dark UV-blocking Glass' }
      ],
      shopPrices: [
        {
          shopId: 'shop-2',
          shopName: 'Green Valley Organic Mart',
          price: 22.00,
          distanceKm: 0.5,
          deliveryMin: 12,
          stock: 18,
          stockStatus: 'In Stock (18 bottles)',
          stockConfirmedMinsAgo: 14,
          isLowestPrice: true
        }
      ]
    }
  ],

  // Visual Search Sample Database: Exact Matches vs Visually Similar Alternatives
  visualSearchDemoCatalog: {
    headphones: {
      queryTitle: 'Over-Ear Wireless Noise-Cancelling Headphones',
      detectedCategory: 'Electronics & Audio',
      confidence: '98.9%',
      extractedColor: 'Matte Silver / Black',
      // Exact Match (100% Identical SKU in Local Network)
      exactMatches: [
        {
          productId: 'prod-1',
          name: 'Sony WH-1000XM5 Wireless Headphones',
          brand: 'Sony',
          similarityScore: '99.4%',
          matchType: 'Exact Visual SKU Match',
          lowestPrice: 348.00,
          availableShopsCount: 2,
          nearestShop: 'Indiranagar TechHub (0.8 km)',
          eta: '18 mins',
          image: '../../static/images/placeholder.svg'
        }
      ],
      // Visually Similar Alternative Products
      similarMatches: [
        {
          productId: 'prod-sim-1',
          name: 'Bose QuietComfort 45 ANC Headphones',
          brand: 'Bose',
          similarityScore: '86.2%',
          matchType: 'Visually Similar Shape & Style',
          price: 329.00,
          nearestShop: 'Indiranagar TechHub (0.8 km)',
          image: '../../static/images/placeholder.svg'
        },
        {
          productId: 'prod-sim-2',
          name: 'Sennheiser Momentum 4 Wireless',
          brand: 'Sennheiser',
          similarityScore: '81.5%',
          matchType: 'Visually Similar Over-Ear Design',
          price: 349.95,
          nearestShop: 'Gizmo Hub Hyperlocal (1.9 km)',
          image: '../../static/images/placeholder.svg'
        }
      ]
    },

    sneakers: {
      queryTitle: 'Athletic Running Sneakers with White Cushion Midsole',
      detectedCategory: 'Fashion & Footwear',
      confidence: '97.2%',
      extractedColor: 'Obsidian Blue / Pure Platinum',
      exactMatches: [
        {
          productId: 'prod-2',
          name: 'Nike Pegasus Pro Hyper-Cushion Running Shoes',
          brand: 'Nike',
          similarityScore: '98.5%',
          matchType: 'Exact Visual SKU Match',
          lowestPrice: 129.50,
          availableShopsCount: 1,
          nearestShop: 'Velocity Sports & Apparel (1.2 km)',
          eta: '25 mins',
          image: '../../static/images/placeholder.svg'
        }
      ],
      similarMatches: [
        {
          productId: 'prod-sim-3',
          name: 'Adidas Ultraboost Light Performance',
          brand: 'Adidas',
          similarityScore: '88.1%',
          matchType: 'Visually Similar Athletic Mesh',
          price: 139.00,
          nearestShop: 'Velocity Sports & Apparel (1.2 km)',
          image: '../../static/images/placeholder.svg'
        },
        {
          productId: 'prod-sim-4',
          name: 'Asics Gel-Nimbus 26 Cushion',
          brand: 'Asics',
          similarityScore: '83.4%',
          matchType: 'Visually Similar Max-Cushion Sole',
          price: 145.00,
          nearestShop: 'Velocity Sports & Apparel (1.2 km)',
          image: '../../static/images/placeholder.svg'
        }
      ]
    },

    honey: {
      queryTitle: 'Amber Glass Jar with Organic Raw Forest Honey',
      detectedCategory: 'Organic Groceries',
      confidence: '99.3%',
      extractedColor: 'Deep Golden Amber',
      exactMatches: [
        {
          productId: 'prod-3',
          name: 'Himalayan Raw Wild Forest Honey (500g)',
          brand: 'Nature Crest',
          similarityScore: '99.5%',
          matchType: 'Exact Visual Packaging Match',
          lowestPrice: 14.99,
          availableShopsCount: 2,
          nearestShop: 'Green Valley Organic Mart (0.5 km)',
          eta: '12 mins',
          image: '../../static/images/placeholder.svg'
        }
      ],
      similarMatches: [
        {
          productId: 'prod-sim-5',
          name: 'Acacia Blossom Raw Honey Glass Jar (450g)',
          brand: 'Bee Pure',
          similarityScore: '89.0%',
          matchType: 'Visually Similar Jar & Amber Color',
          price: 17.50,
          nearestShop: 'Green Valley Organic Mart (0.5 km)',
          image: '../../static/images/placeholder.svg'
        }
      ]
    },

    smartwatch: {
      queryTitle: 'Circular Titanium Smartwatch with AMOLED Dial',
      detectedCategory: 'Smart Wearables',
      confidence: '95.6%',
      extractedColor: 'Titanium Grey / Black Strap',
      exactMatches: [
        {
          productId: 'prod-4',
          name: 'Apex Ultra Gen-4 AMOLED Smartwatch',
          brand: 'Apex Tech',
          similarityScore: '97.8%',
          matchType: 'Exact Visual Hardware Match',
          lowestPrice: 199.00,
          availableShopsCount: 2,
          nearestShop: 'Indiranagar TechHub (0.8 km)',
          eta: '18 mins',
          image: '../../static/images/placeholder.svg'
        }
      ],
      similarMatches: [
        {
          productId: 'prod-sim-6',
          name: 'Garmin Venu 3 Titanium AMOLED Watch',
          brand: 'Garmin',
          similarityScore: '84.6%',
          matchType: 'Visually Similar Bezel & Screen',
          price: 399.00,
          nearestShop: 'Gizmo Hub Hyperlocal (1.9 km)',
          image: '../../static/images/placeholder.svg'
        }
      ]
    }
  },

  // Customer User Profile & Addresses
  customerProfile: {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98450 12345',
    memberSince: 'March 2026',
    ordersCount: 14,
    defaultLocation: 'Indiranagar 100ft Rd',
    savedAddresses: [
      {
        id: 'addr-1',
        label: 'Home',
        icon: '🏠',
        isDefault: true,
        recipient: 'Priya Sharma',
        phone: '+91 98450 12345',
        line1: 'Apt 4B, Silver Oak Heights',
        line2: '12th Main Road, HAL 2nd Stage',
        city: 'Indiranagar, Bangalore',
        pincode: '560038'
      },
      {
        id: 'addr-2',
        label: 'Office',
        icon: '💼',
        isDefault: false,
        recipient: 'Priya Sharma (Tech Park)',
        phone: '+91 98450 12345',
        line1: 'Tower B, 4th Floor, Bagmane Tech Park',
        line2: 'C V Raman Nagar',
        city: 'Bangalore',
        pincode: '560093'
      }
    ]
  },

  // Past Orders History
  pastOrders: [
    {
      id: 'ORD-9842',
      date: 'Today, 2:15 PM',
      shopId: 'shop-2',
      shopName: 'Green Valley Organic Mart',
      status: 'Out for Delivery',
      statusCode: 'transit',
      fulfillmentType: 'Delivery',
      eta: '8 mins away',
      driverName: 'Vikram Singh (#DL-402)',
      driverPhone: '+91 98200 XXXXX',
      items: [
        { name: 'Himalayan Raw Wild Forest Honey (500g)', qty: 1, price: 14.99 },
        { name: 'Cold-Pressed Extra Virgin Olive Oil (1L)', qty: 1, price: 22.00 }
      ],
      subtotal: 36.99,
      deliveryFee: 1.99,
      tax: 1.85,
      total: 40.83,
      deliveryAddress: 'Apt 4B, Silver Oak Heights, 12th Main Road, Indiranagar',
      timeline: [
        { label: 'Order Confirmed', time: '2:15 PM', done: true },
        { label: 'Packed by Green Valley Organic', time: '2:22 PM', done: true },
        { label: 'Rider Picked Up Package', time: '2:28 PM', done: true },
        { label: 'Out for Delivery (Indiranagar)', time: '2:32 PM', current: true },
        { label: 'Estimated Delivery at Doorstep', time: '2:40 PM', done: false }
      ]
    },
    {
      id: 'ORD-9411',
      date: 'Yesterday, 6:40 PM',
      shopId: 'shop-1',
      shopName: 'Indiranagar TechHub',
      status: 'Delivered',
      statusCode: 'delivered',
      fulfillmentType: 'Delivery',
      items: [
        { name: '65W GaN Compact Rapid Charger', qty: 1, price: 34.50 }
      ],
      subtotal: 34.50,
      deliveryFee: 2.49,
      tax: 1.72,
      total: 38.71,
      deliveryAddress: 'Apt 4B, Silver Oak Heights, 12th Main Road, Indiranagar',
      timeline: [
        { label: 'Order Placed', time: '6:40 PM', done: true },
        { label: 'Merchant Accepted', time: '6:43 PM', done: true },
        { label: 'Delivered by Rider Arun P.', time: '7:01 PM', done: true }
      ]
    }
  ],

  // Promotional Banners
  promos: [
    {
      id: 'promo-1',
      title: 'Snap It. Compare It. Get It Fast.',
      subtitle: 'Upload any product snapshot to instantly discover neighbourhood dealer stocks.',
      badge: '📸 AI VISUAL SEARCH READY',
      ctaText: 'Launch Visual Scanner',
      action: 'openVisualSearch',
      bgGradient: 'linear-gradient(135deg, #14213D 0%, #1F325C 100%)',
      accentColor: '#FF8C42'
    },
    {
      id: 'promo-2',
      title: 'Zero Delivery Fee on Store Pickup',
      subtitle: 'Select "Store Pickup" at checkout and grab your order ready in 10 minutes.',
      badge: '⚡ CLICK & COLLECT',
      ctaText: 'Browse Nearby Stores',
      action: 'scrollToShops',
      bgGradient: 'linear-gradient(135deg, #0F766E 0%, #115E59 100%)',
      accentColor: '#34D399'
    }
  ]
};

// Make globally accessible
window.SnapData = SnapData;
