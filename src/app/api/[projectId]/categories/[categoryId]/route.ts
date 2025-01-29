import { NextRequest, NextResponse } from "next/server";

import db from "@/server/db";

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const pathParts = pathname.split("/");
  const projectId = pathParts[2];
  const categoryId = pathParts[4];

  try {
    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Missing categoryId", { status: 400 });
    }

    const category = await db.categories.findFirst({
      where: {
        id: categoryId,
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

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log("[CATEGORY_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
