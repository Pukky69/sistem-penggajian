import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { loginSchema } from "@/validations/auth.validation";
import { loginService } from "@/services/auth.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validatedData = loginSchema.parse(body);

    const { token, user } = await loginService(validatedData);

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      user,
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "Request body harus berupa JSON.",
        },
        { status: 400 }
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          errors: error.flatten(),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Terjadi kesalahan",
      },
      { status: 401 }
    );
  }
}