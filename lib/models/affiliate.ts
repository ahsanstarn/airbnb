import { ObjectId } from 'mongodb';

export interface IAffiliate {
  _id?: ObjectId;
  referrerUserId: ObjectId;       // The user who shared their code
  referrerEmail: string;
  referredUserId?: ObjectId;      // The user who signed up (once registered)
  referredEmail?: string;
  affiliateCode: string;          // The code that was used
  status: 'clicked' | 'registered' | 'active';
  createdAt: Date;
  convertedAt?: Date;
}

export interface IAffiliateStats {
  totalClicks: number;
  totalRegistered: number;
  totalActive: number;
  referrals: IAffiliate[];
}
