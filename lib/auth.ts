import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { getDb } from './mongodb';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'kaya-ge-secret-change-me-in-production';
const JWT_EXPIRES_IN = '7d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Password helpers
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// JWT helpers
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// Extract token from request (cookie or Authorization header)
export function getTokenFromRequest(req: NextRequest): string | null {
  // Check cookie first
  const cookieToken = req.cookies.get('kaya-token')?.value;
  if (cookieToken) return cookieToken;

  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

// Get current user from request
export async function getCurrentUser(req: NextRequest) {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const db = await getDb();
  let user: any = null;
  if (ObjectId.isValid(payload.userId)) {
    try {
      user = await db.collection('users').findOne(
        { _id: new ObjectId(payload.userId) },
        { projection: { passwordHash: 0 } }
      );
    } catch {
      user = null;
    }
  }
  if (!user) {
    user = await db.collection('users').findOne(
      { _id: payload.userId },
      { projection: { passwordHash: 0 } }
    );
  }

  return user;
}

// Generate a unique affiliate code
export function generateAffiliateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'KAY';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
