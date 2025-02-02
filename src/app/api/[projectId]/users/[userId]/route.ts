import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { checkApiKey } from "@/utils/checkApiKey";
import { z } from "zod";

const updateUserSchema = z.object({
  fullName: z.string().nullable().optional(),
  phoneNumber: z
    .string()
    .length(11, { message: "Phone number must be exactly 11 digits" })
    .regex(/^09\d{9}$/, { message: "Invalid phone number format" })
    .optional(),
  otpCode: z
    .string()
    .length(4, { message: "OTP must be exactly 4 digits" })
    .regex(/^\d{4}$/, { message: "OTP must be numeric" })
    .optional(),
  otpExpiresIn: z
    .number()
    .min(60, { message: "Expiration time must be at least 60 seconds" })
    .max(900, { message: "Expiration time cannot exceed 900 seconds" })
    .optional(),
});

const getOtpExpiryDate = (seconds?: number) =>
  seconds ? new Date(Date.now() + seconds * 1000) : undefined;

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ projectId: string; userId: string }> },
) {
  try {
    const params = await props.params;
    const projectId = params.projectId;
    const userId = params.userId;

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    const isAuthorized = await checkApiKey(req, projectId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.projectUser.findFirst({
      where: {
        id: userId,
        projectId,
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

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ projectId: string; userId: string }> },
) {
  try {
    const params = await props.params;
    const projectId = params.projectId;
    const userId = params.userId;

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    const isAuthorized = await checkApiKey(req, projectId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const validationResult = updateUserSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ errors: validationResult.error.format() }),
        { status: 400 },
      );
    }

    const { phoneNumber, fullName, otpCode, otpExpiresIn } =
      validationResult.data;

    const existingUser = await db.projectUser.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (phoneNumber && phoneNumber !== existingUser.phoneNumber) {
      const phoneExists = await db.projectUser.findFirst({
        where: { phoneNumber, projectId },
      });

      if (phoneExists) {
        return new NextResponse("Phone number already in use", { status: 409 });
      }
    }

    const otpExpirationDate = getOtpExpiryDate(otpExpiresIn);

    const updatedUser = await db.projectUser.update({
      where: { id: userId },
      data: {
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
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("[USER_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ projectId: string; userId: string }> },
) {
  try {
    const params = await props.params;
    const projectId = params.projectId;
    const userId = params.userId;

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }
    if (!userId) {
      return new NextResponse("Missing userId", { status: 400 });
    }

    const isAuthorized = await checkApiKey(req, projectId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingUser = await db.projectUser.findFirst({
      where: {
        id: userId,
        projectId,
      },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    await db.projectUser.delete({
      where: { id: userId },
    });

    return new NextResponse("User deleted", { status: 200 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
