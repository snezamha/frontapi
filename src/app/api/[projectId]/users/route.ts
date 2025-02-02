import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { checkApiKey } from "@/utils/checkApiKey";
import { z } from "zod";

const userSchema = z.object({
  fullName: z.string().nullable(),
  phoneNumber: z
    .string()
    .length(11, { message: "Phone number must be exactly 11 digits" })
    .regex(/^09\d{9}$/, { message: "Invalid phone number format" }),
  otpCode: z
    .string()
    .length(4, { message: "OTP must be exactly 4 digits" })
    .regex(/^\d{4}$/, { message: "OTP must be numeric" }),
  otpExpiresIn: z
    .number()
    .min(60, { message: "Expiration time must be at least 60 seconds" })
    .max(900, {
      message: "Expiration time cannot exceed 900 seconds (15 minutes)",
    }),
});

const getOtpExpiryDate = (seconds: number) =>
  new Date(Date.now() + seconds * 1000);

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ projectId: string }> },
) {
  const params = await props.params;

  try {
    const { projectId } = params;

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }

    const isAuthorized = await checkApiKey(req, projectId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);
    const page = Math.max(pageParam, 1);
    const limit = Math.max(limitParam, 1);
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      db.projectUser.findMany({
        where: { projectId },
        select: {
          id: true,
          phoneNumber: true,
          fullName: true,
          createdAt: true,
        },
        skip,
        take: limit,
      }),
      db.projectUser.count({
        where: { projectId },
      }),
    ]);

    const totalPages = Math.ceil(totalUsers / limit);

    return NextResponse.json(
      {
        data: users,
        pagination: {
          page,
          limit,
          totalPages,
          totalUsers,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ projectId: string }> },
) {
  const params = await props.params;
  try {
    const { projectId } = params;

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }

    const isAuthorized = await checkApiKey(req, projectId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validationResult = userSchema.safeParse({ ...body, projectId });
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ error: validationResult.error.format() }),
        { status: 400 },
      );
    }

    const { phoneNumber, fullName, otpCode, otpExpiresIn } =
      validationResult.data;

    if (!phoneNumber) {
      return new NextResponse("Missing phoneNumber", { status: 400 });
    }

    const existingUser = await db.projectUser.findUnique({
      where: {
        projectId,
        phoneNumber,
      },
    });

    if (existingUser) {
      return new NextResponse("User with this phone number already exists", {
        status: 409,
      });
    }

    const otpExpirationDate = getOtpExpiryDate(otpExpiresIn);

    const newUser = await db.projectUser.create({
      data: {
        projectId,
        phoneNumber,
        fullName,
        otpCode,
        otpExpiresIn: otpExpirationDate,
      },
      select: {
        id: true,
        phoneNumber: true,
        fullName: true,
        otpCode: true,
        otpExpiresIn: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("[USERS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
