export type UserRole = 'donor' | 'recipient' | 'admin' | 'guest';

export type DropStatus = 'available' | 'claimed' | 'picked_up';

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
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organization?: string;
  preferredFoodTypes: FoodCategory[];
  preferredRadiusKm: number;
  ratingSum?: number;
  reviewCount?: number;
  reviews?: Review[];
}

export interface FoodDrop {
  id: string;
  title: string;
  quantity: string;
  mealsEstimated: number;
  category: FoodCategory;
  donorName: string;
  donorAvatar: string;
  location: string;
  neighborhood: string;
  distanceKm: number;
  postedAt: string; // ISO string
  expiresAt: string; // ISO string
  status: DropStatus;
  imageUrl: string;
  claimedBy?: string; // Recipient name/id
  claimedAt?: string;
  pickedUpAt?: string;
  notes?: string;
  allergens?: string[];
  donorRating?: number;
  donorReview?: string;
  recipientRating?: number;
  recipientReview?: string;
}

export type ViewMode = 'list' | 'map';

export type SegmentTab = 'all' | 'available' | 'claimed';

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
