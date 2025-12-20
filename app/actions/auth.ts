"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "moneta-auth-token";

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  };

  cookieStore.set(COOKIE_NAME, token, options);
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

