"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AUTH_ROUTES } from "@/middleware";
import { AuthData, RedirectOptions } from "@/types";

export async function setCookie(data: AuthData, options?: RedirectOptions) {
  const cookieStore = cookies();

  // Set cookies with proper configuration
  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  cookieStore.set("userRole", data.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  // Handle redirects based on options
  if (options?.passwordChangeRequired) {
    redirect(AUTH_ROUTES.CHANGE_PASSWORD);
  }

  if (options?.redirect) {
    redirect(options.redirect);
  }
}
