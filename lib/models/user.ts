import { ObjectId } from 'mongodb';
import crypto from 'crypto';

export function maskEmail(email?: string): string {
  if (!email || !email.includes('@')) return '';
  const [local, domain] = email.split('@');
  const maskedLocal = local.length <= 2 ? local[0] + '***' : local.slice(0, 2) + '***' + local.slice(-1);
  const domainParts = domain.split('.');
  const maskedDomain = domainParts[0].length <= 2 ? domainParts[0][0] + '***' : domainParts[0].slice(0, 2) + '***';
  return `${maskedLocal}@${maskedDomain}.${domainParts.slice(1).join('.')}`;
}

export function hashEmail(email?: string): string {
  if (!email) return '';
  return crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex').slice(0, 16);
}

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
  emailMasked: string;
  emailHash: string;
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
  const email = user.email || '';
  return {
    _id: user._id.toString(),
    email: email,
    emailMasked: maskEmail(email),
    emailHash: hashEmail(email),
    name: user.name,
    role: user.role,
    phone: user.phone ? (user.phone.slice(0, 4) + '****' + user.phone.slice(-2)) : '',
    avatar: user.avatar || '',
    language: user.language || 'en',
    affiliateCode: user.affiliateCode,
    referredBy: user.referredBy || '',
    createdAt: user.createdAt?.toISOString?.() || new Date().toISOString(),
  };
}
