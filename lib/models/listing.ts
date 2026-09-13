import { ObjectId } from 'mongodb';

export interface IListing {
  _id?: ObjectId;
  businessId?: ObjectId | string;
  businessName?: string;
  businessPhone?: string;
  title: string;
  description: string;
  category: 'hotels' | 'apartments' | 'guesthouses' | 'cabins' | 'villas' | 'houses' | 'restaurants' | 'cars' | 'tours' | 'services' | 'salons' | string;
  price_per_night: number;
  price_unit?: string; // 'night' | 'day' | 'person' | 'service' | 'hour'
  duration?: string;
  specs?: Record<string, any>;
  currency: string;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  images: string[];
  type?: string;
  host?: string;
  beds?: number;
  baths?: number;
  guests?: number;
  overall_rating: number;
  review_count: number;
  views_count: number;
  is_published: boolean;
  is_featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
