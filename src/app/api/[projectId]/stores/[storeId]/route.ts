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
  props: { params: Promise<{ projectId: string; storeId: string }> },
) {
  try {
    const params = await props.params;
    const projectId = params.projectId;
    const storeId = params.storeId;

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const isAuthorized = await checkApiKey(req, projectId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await db.store.findFirst({
      where: {
        id: storeId,
        projectId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        storeSettings: {
          select: {
            pageSize: true,
            isShippingFee: true,
            shippingFee: true,
            freeShippingMoreThan: true,
            taxPercent: true,
          },
        },
      },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.error("[STORE_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ projectId: string; storeId: string }> },
) {
  try {
    const params = await props.params;
    const projectId = params.projectId;
    const storeId = params.storeId;

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const isAuthorized = await checkApiKey(req, projectId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const validationResult = storeSchema.safeParse(body);
    if (!validationResult.success) {
      return new NextResponse(
        JSON.stringify({ errors: validationResult.error.format() }),
        { status: 400 },
      );
    }

    const { title, description } = validationResult.data;

    const existingStore = await db.store.findUnique({
      where: { id: storeId },
    });

    if (!existingStore) {
      return new NextResponse("Store not found", { status: 404 });
    }

    if (title && title !== existingStore.title) {
      const titleExists = await db.store.findFirst({
        where: { title, projectId },
      });

      if (titleExists) {
        return new NextResponse("Title already in use", { status: 409 });
      }
    }

    const updatedStore = await db.store.update({
      where: { id: storeId },
      data: {
        title,
        description,
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedStore, { status: 200 });
  } catch (error) {
    console.error("[STORE_PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ projectId: string; storeId: string }> },
) {
  try {
    const params = await props.params;
    const projectId = params.projectId;
    const storeId = params.storeId;

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const isAuthorized = await checkApiKey(req, projectId);
    if (!isAuthorized) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const existingStore = await db.store.findFirst({
      where: {
        id: storeId,
        projectId,
      },
    });

    if (!existingStore) {
      return new NextResponse("Store not found", { status: 404 });
    }

    await db.store.delete({
      where: { id: storeId },
    });

    return new NextResponse("Store deleted", { status: 200 });
  } catch (error) {
    console.error("[STORE_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
