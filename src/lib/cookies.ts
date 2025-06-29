"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/middleware";
import { AuthData, RedirectOptions } from "@/types";

const cookieStore = cookies();
export async function setCookie(data: AuthData, options?: RedirectOptions) {
  // Set cookies with proper configuration
  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8766, // 1 year
    path: "/",
  });

  cookieStore.set("userRole", data.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8766, // 1 year
    path: "/",
  });

  // Handle redirects based on options
  // if (options?.passwordChangeRequired) {
  //   redirect(AUTH_ROUTES.CHANGE_PASSWORD);
  // }

  if (options?.redirect) {
    redirect(options.redirect);
  }
}

export async function signOut() {
  cookieStore.delete("accessToken");
  cookieStore.delete("userRole");
  redirect(AUTH_ROUTES.LOGIN);
}
