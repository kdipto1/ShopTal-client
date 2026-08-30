import { NextResponse } from "next/server";
import { auth, update } from "@/auth";

export async function POST() {
  const session = await auth();
  const refreshToken = session?.user?.refreshToken;

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, message: "No refresh token available" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: "Session expired, please login again" },
        { status: 401 }
      );
    }

    const data = await response.json();

    if (!data.success || !data.data?.accessToken) {
      return NextResponse.json(
        { success: false, message: "Session expired, please login again" },
        { status: 401 }
      );
    }

    await update({
      user: {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      },
    });

    return NextResponse.json({
      success: true,
      accessToken: data.data.accessToken,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
