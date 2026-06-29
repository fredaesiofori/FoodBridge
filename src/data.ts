import { FoodDrop, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-recipient-1',
    name: "St. Jude's Community Shelter",
    email: 'contact@stjudesshelter.org',
    role: 'recipient',
    status: 'active',
    verificationStatus: 'verified',
    emailVerified: true,
    activityLog: [
      'Collected 45 Artisan Croissants drop',
      'Requested AI recipe for surplus vegetables',
      'Browsed North Precinct listings'
    ],
    avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=150&auto=format&fit=crop&q=80',
    organization: "St. Jude's Shelter",
    preferredFoodTypes: ['Bakery & Bread', 'Prepared Meals', 'Fresh Produce'],
    preferredRadiusKm: 10,
    ratingSum: 24,
    reviewCount: 5,
    reviews: [
      {
        id: 'rev-1',
        reviewerName: 'Green Wheat Bakery',
        reviewerRole: 'donor',
        rating: 5,
        comment: 'Always punctual and friendly during surplus pickups!',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'user-donor-1',
    name: 'Green Wheat Bakery',
    email: 'manager@greenwheat.com',
    role: 'donor',
    status: 'active',
    verificationStatus: 'verified',
    emailVerified: true,
    activityLog: [
      'Posted 30 Fresh Sandwiches drop',
      'Updated surplus expiration timeline',
      'Rated recipient pickup 5 stars'
    ],
    avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
    organization: 'Green Wheat Artisan Bakery',
    preferredFoodTypes: ['Bakery & Bread'],
    preferredRadiusKm: 5,
    ratingSum: 49,
    reviewCount: 10,
    reviews: [
      {
        id: 'rev-2',
        reviewerName: "St. Jude's Community Shelter",
        reviewerRole: 'recipient',
        rating: 5,
        comment: 'Incredible fresh sourdough and pastries every single week!',
        createdAt: new Date().toISOString()
      }
    ]
  },
  {
    id: 'user-admin-1',
    name: 'Freda Esiofori (Platform Admin)',
    email: 'fredaesiofori905@gmail.com',
    role: 'admin',
    status: 'active',
    verificationStatus: 'verified',
    emailVerified: true,
    adminStatus: true,
    activityLog: [
      'Performed full RBAC security audit',
      'Approved Green Wheat donor verification',
      'Generated platform impact telemetry'
    ],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    organization: 'FoodBridge Central Admin',
    preferredFoodTypes: ['Bakery & Bread', 'Fresh Produce', 'Prepared Meals', 'Dairy & Refrigerated', 'Pantry & Dry', 'Catering & Trays'],
    preferredRadiusKm: 25,
  }
];

export const PRESET_FOOD_IMAGES = [
  { label: 'Artisan Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80' },
  { label: 'Fresh Vegetables', url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80' },
  { label: 'Catered Meals', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80' },
  { label: 'Pastries & Croissants', url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80' },
  { label: 'Sandwiches & Wraps', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' },
  { label: 'Fruit & Dairy', url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80' },
  { label: 'Hot Roast Meals', url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80' },
  { label: 'Salad Bowls', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80' }
];

const now = new Date().getTime();
const mins = (m: number) => new Date(now + m * 60 * 1000).toISOString();
const pastMins = (m: number) => new Date(now - m * 60 * 1000).toISOString();

export const INITIAL_DROPS: FoodDrop[] = [
  {
    id: 'drop-1',
    title: 'Artisan Sourdough Loaves & Baguettes',
    quantity: '12 loaves',
    mealsEstimated: 24,
    category: 'Bakery & Bread',
    donorName: 'Green Wheat Bakery',
    donorAvatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&auto=format&fit=crop&q=80',
    location: '742 Market St, North Precinct',
    neighborhood: 'North Precinct',
    distanceKm: 0.8,
    postedAt: pastMins(30),
    expiresAt: mins(45), // Expiring in 45 mins! Urgent
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    notes: 'Baked fresh this morning. Perfectly edible surplus before evening closing.',
    allergens: ['Wheat', 'Gluten']
  },
  {
    id: 'drop-2',
    title: 'Fresh Organic Veggie Box & Herb Bundles',
    quantity: '15 kg box',
    mealsEstimated: 35,
    category: 'Fresh Produce',
    donorName: 'Root & Stem Produce',
    donorAvatar: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&auto=format&fit=crop&q=80',
    location: '120 West End Ave, Midtown',
    neighborhood: 'Midtown',
    distanceKm: 2.4,
    postedAt: pastMins(120),
    expiresAt: mins(240), // 4 hours
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    notes: 'Assorted seasonal greens, carrots, heirloom tomatoes, and fresh thyme.',
    allergens: []
  },
  {
    id: 'drop-3',
    title: 'Prepared Hot Catering Trays (Lasagna & Sides)',
    quantity: '8 large trays',
    mealsEstimated: 40,
    category: 'Catering & Trays',
    donorName: 'Corporate Eats Catering',
    donorAvatar: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=100&auto=format&fit=crop&q=80',
    location: '55 Tech Boulevard, Central Business District',
    neighborhood: 'Central District',
    distanceKm: 1.2,
    postedAt: pastMins(90),
    expiresAt: mins(180), // 3 hours
    status: 'claimed',
    claimedBy: "St. Jude's Community Shelter",
    claimedAt: pastMins(15),
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80',
    notes: 'Kept warm in insulated chafing containers. Ready for immediate pickup.',
    allergens: ['Dairy', 'Wheat']
  },
  {
    id: 'drop-urgent-claim',
    title: 'Fresh Rotisserie Chickens & Roasted Veggies',
    quantity: '12 hot trays',
    mealsEstimated: 25,
    category: 'Prepared Meals',
    donorName: 'Harbor Grille & Deli',
    donorAvatar: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=100&auto=format&fit=crop&q=80',
    location: '412 Harbor Blvd, Harbor View',
    neighborhood: 'Harbor View',
    distanceKm: 1.8,
    postedAt: pastMins(40),
    expiresAt: mins(22), // 22 minutes left! Triggers <30 min alert
    status: 'claimed',
    claimedBy: "Hope Kitchen & Food Pantry",
    claimedAt: pastMins(10),
    imageUrl: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
    notes: 'Hot ready-to-serve protein meals packed in thermal insulated containers.',
    allergens: []
  },
  {
    id: 'drop-4',
    title: 'Mixed Breakfast Croissants & Danishes',
    quantity: '30 pcs',
    mealsEstimated: 30,
    category: 'Bakery & Bread',
    donorName: 'The Morning Crumb',
    donorAvatar: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&auto=format&fit=crop&q=80',
    location: '88 Oakway Rd, Harbor View',
    neighborhood: 'Harbor View',
    distanceKm: 4.1,
    postedAt: pastMins(60),
    expiresAt: mins(90), // 1.5 hours - Urgent!
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
    notes: 'Butter croissants, almond pastries, and cinnamon swirls.',
    allergens: ['Wheat', 'Dairy', 'Eggs', 'Tree Nuts']
  },
  {
    id: 'drop-5',
    title: 'Gourmet Roasted Turkey Sandwiches & Wraps',
    quantity: '18 boxed meals',
    mealsEstimated: 18,
    category: 'Prepared Meals',
    donorName: 'Deli Central',
    donorAvatar: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=100&auto=format&fit=crop&q=80',
    location: '304 Pine St, North Precinct',
    neighborhood: 'North Precinct',
    distanceKm: 1.5,
    postedAt: pastMins(45),
    expiresAt: mins(160), // ~2.6 hours
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
    notes: 'Individually wrapped and labeled. Includes vegetarian option wraps.',
    allergens: ['Wheat', 'Dairy', 'Soy']
  },
  {
    id: 'drop-6',
    title: 'Organic Greek Yogurt Tubs & Fresh Berries',
    quantity: '25 tubs + 5 kg berries',
    mealsEstimated: 25,
    category: 'Dairy & Refrigerated',
    donorName: 'Dairy Meadow Co-op',
    donorAvatar: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&auto=format&fit=crop&q=80',
    location: '912 Valley Way, Eastside',
    neighborhood: 'Eastside',
    distanceKm: 3.2,
    postedAt: pastMins(180),
    expiresAt: mins(300), // 5 hours
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    notes: 'Chilled surplus. Great for breakfast programs or healthy snacks.',
    allergens: ['Dairy']
  },
  {
    id: 'drop-7',
    title: 'Hot Rotisserie Herb Chickens',
    quantity: '6 whole chickens',
    mealsEstimated: 24,
    category: 'Prepared Meals',
    donorName: 'Market Bistro',
    donorAvatar: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=100&auto=format&fit=crop&q=80',
    location: '445 Central Square, Midtown',
    neighborhood: 'Midtown',
    distanceKm: 2.0,
    postedAt: pastMins(40),
    expiresAt: mins(70), // Expiring soon! 1h 10m
    status: 'available',
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
    notes: 'Freshly roasted rotisserie chickens in warming bags.',
    allergens: []
  },
  {
    id: 'drop-8',
    title: 'Catered Quinoa & Mediterranean Salad Bowls',
    quantity: '15 large bowls',
    mealsEstimated: 15,
    category: 'Prepared Meals',
    donorName: 'Green Leaf Cafe',
    donorAvatar: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&auto=format&fit=crop&q=80',
    location: '12 Green St, North Precinct',
    neighborhood: 'North Precinct',
    distanceKm: 1.0,
    postedAt: pastMins(200),
    expiresAt: pastMins(10), // Picked up already
    status: 'picked_up',
    claimedBy: "St. Jude's Community Shelter",
    claimedAt: pastMins(180),
    pickedUpAt: pastMins(30),
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    notes: 'Packed in eco-friendly compostable containers.',
    allergens: []
  }
];
