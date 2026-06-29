export type UserRole = 'donor' | 'recipient' | 'admin';

export type DropStatus = 'available' | 'reserved' | 'collected' | 'expired' | 'claimed' | 'picked_up';

export type FoodCategory =
  | 'Bakery & Bread'
  | 'Fresh Produce'
  | 'Prepared Meals'
  | 'Dairy & Refrigerated'
  | 'Pantry & Dry'
  | 'Catering & Trays';

export interface Review {
  id: string;
  reviewerName: string;
  reviewerRole: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: string;
}

export interface User {
  id: string;
  uid?: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone?: string;
  address?: string;
  organization?: string;
  status?: 'active' | 'suspended' | 'pending';
  verificationStatus?: 'pending' | 'verified' | 'suspended' | 'revoked';
  emailVerified?: boolean;
  adminStatus?: boolean;
  activityLog?: string[];
  preferredFoodTypes: FoodCategory[];
  preferredRadiusKm: number;
  emailAlertsNearby?: boolean;
  ratingSum?: number;
  reviewCount?: number;
  reviews?: Review[];
  createdAt?: string;
}

export interface FoodDrop {
  id: string;
  title: string;
  description?: string;
  quantity: string;
  mealsEstimated: number;
  category: FoodCategory;
  donorName: string;
  donorId?: string;
  donorAvatar: string;
  location: string;
  pickupLocation?: string;
  neighborhood: string;
  distanceKm: number;
  postedAt: string; // ISO string
  createdAt?: string;
  updatedAt?: string;
  expiresAt: string; // ISO string
  expiryDate?: string;
  scheduledPickupTime?: string;
  pickupTime?: string;
  status: DropStatus;
  imageUrl: string;
  claimedBy?: string; // Recipient name/id
  requestedBy?: { id: string; name: string; email: string; requestedAt: string; status: 'pending' | 'accepted' | 'rejected' }[];
  claimedAt?: string;
  pickedUpAt?: string;
  notes?: string;
  allergens?: string[];
  verificationStatus?: 'pending' | 'verified' | 'suspended' | 'revoked';
  donorRating?: number;
  donorReview?: string;
  recipientRating?: number;
  recipientReview?: string;
}

export type ViewMode = 'list' | 'map';

export type SegmentTab = 'all' | 'available' | 'claimed' | 'reserved' | 'collected' | 'expired' | 'requests';

export type SortOption = 'soonest' | 'newest' | 'quantity';

export interface AiRecipePlan {
  recipeName: string;
  prepTime: string;
  servings: string;
  summary: string;
  ingredients: string[];
  instructions: string[];
  storageTip: string;
}
