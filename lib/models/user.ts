import { ObjectId } from 'mongodb';

export interface IUser {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: 'tourist' | 'business' | 'admin' | 'affiliate';
  phone?: string;
  avatar?: string;
  language?: string;
  affiliateCode: string;
  referredBy?: string; // affiliate code of referrer
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPublic {
  _id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
  language?: string;
  affiliateCode: string;
  referredBy?: string;
  createdAt: string;
}

export function toPublicUser(user: any): IUserPublic {
  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    phone: user.phone || '',
    avatar: user.avatar || '',
    language: user.language || 'en',
    affiliateCode: user.affiliateCode,
    referredBy: user.referredBy || '',
    createdAt: user.createdAt?.toISOString?.() || new Date().toISOString(),
  };
}
