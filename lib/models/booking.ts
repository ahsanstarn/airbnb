import { ObjectId } from 'mongodb';

export interface IBooking {
  _id?: ObjectId;
  listing_id: string;
  listing_title: string;
  listing_image?: string;
  listing_location?: string;
  tourist_id: string;
  tourist_name?: string;
  tourist_email?: string;
  business_id?: string;
  check_in: string;
  check_out: string;
  nights: number;
  guest_count: number;
  price_per_night: number;
  total_price: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  payment_method: 'card' | 'cash' | string;
  payment_status: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date;
}
