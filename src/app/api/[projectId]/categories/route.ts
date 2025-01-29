import { NextRequest, NextResponse } from "next/server";

import db from "@/server/db";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathParts = pathname.split("/");
  const projectId = pathParts[2];

  try {
    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }

    const categories = await db.categories.findMany({
      where: {
        projectId,
      },
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
    });

    if (!categories) {
      return new NextResponse("Categories not found", { status: 404 });
    }

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
