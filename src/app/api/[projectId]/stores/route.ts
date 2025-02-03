import { NextRequest, NextResponse } from "next/server";
import db from "@/server/db";
import { checkApiKey } from "@/utils/checkApiKey";
import { z } from "zod";

const storeSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
});

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

    const [stores, totalStores] = await Promise.all([
      db.store.findMany({
        where: { projectId },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
        skip,
        take: limit,
      }),
      db.store.count({
        where: { projectId },
      }),
    ]);

    const totalPages = Math.ceil(totalStores / limit);

    return NextResponse.json(
      {
        data: stores,
        pagination: {
          page,
          limit,
          totalPages,
          totalStores,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[STORES_GET]", error);
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
    const validationResult = storeSchema.safeParse({ ...body, projectId });
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ error: validationResult.error.format() }),
        { status: 400 },
      );
    }

    const { title, description } = validationResult.data;

    if (!title) {
      return new NextResponse("Missing title", { status: 400 });
    }

    const existingStore = await db.store.findFirst({
      where: {
        projectId,
        title,
      },
    });

    if (existingStore) {
      return new NextResponse("Store with this title already exists", {
        status: 409,
      });
    }

    const newStore = await db.store.create({
      data: {
        projectId,
        title,
        description,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newStore, { status: 201 });
  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
