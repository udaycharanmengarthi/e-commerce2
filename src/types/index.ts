import { UserProfile } from '../lib/supabase';

import { UserProfile } from '../lib/supabase';

export interface User extends UserProfile {
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User extends UserProfile {
  email: string;

export interface WishlistItem {
  productId: string;
}