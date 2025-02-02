import { NextRequest, NextResponse } from "next/server";

import db from "@/server/db";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ projectId: string }> },
) {
  const params = await props.params;
  const projectId = params.projectId;

  try {
    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);
    const page = Math.max(pageParam, 1);
    const limit = Math.max(limitParam, 1);
    const skip = (page - 1) * limit;

    const [categories, totalClassifications] = await Promise.all([
      db.categories.findMany({
        where: { projectId },
        select: {
          id: true,
          title: true,
          slug: true,
          type: true,
          parent: {
            select: {
              id: true,
              title: true,
              slug: true,
              type: true,
            },
          },
        },
        skip,
        take: limit,
      }),
      db.categories.count({
        where: { projectId },
      }),
    ]);

    if (!categories) {
      return new NextResponse("Categories not found", { status: 404 });
    }

    const totalPages = Math.ceil(totalClassifications / limit);

    return NextResponse.json(
      {
        data: categories,
        pagination: {
          page,
          limit,
          totalPages,
          totalClassifications,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
