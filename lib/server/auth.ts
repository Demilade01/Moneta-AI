/**
 * Authentication Utilities
 * JWT generation/verification and password hashing
 */

import { hash, compare } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { serialize, parse } from "cookie";

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "7d"; // 7 days

// Cookie Configuration
const COOKIE_NAME = "moneta-auth-token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  path: "/",
};

// Types
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: AuthUser): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Create an auth cookie with JWT token
 */
export function createAuthCookie(token: string): string {
  return serialize(COOKIE_NAME, token, COOKIE_OPTIONS);
}

/**
 * Create a cookie to clear authentication
 */
export function clearAuthCookie(): string {
  return serialize(COOKIE_NAME, "", {
    ...COOKIE_OPTIONS,
    maxAge: 0,
  });
}

/**
 * Extract JWT token from cookie header
 */
export function getTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  return cookies[COOKIE_NAME] || null;
}

/**
 * Get user from JWT token
 */
export function getUserFromToken(token: string): AuthUser | null {
  const payload = verifyToken(token);
  if (!payload) return null;

  return {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
  };
}

