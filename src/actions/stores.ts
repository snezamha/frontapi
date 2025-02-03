"use server";
import db from "@/server/db";
import { currentUser } from "@/lib/auth";
import { Project, StoreSettings, UserProject } from "@prisma/client";

interface CheckPermissionsResult {
  project: Project & { userProjects: UserProject[] };
  userIsAdmin: boolean;
  userPermissions?: string[];
}

interface ActionResponse {
  success: string;
  error: string;
  project?: Project;
}

export async function checkUserPermissions(
  projectId: string,
  userId: string,
  userRole: string,
): Promise<CheckPermissionsResult> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      userProjects: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const userIsProjectOwner = project.userProjects.some(
    (up) => up.userId === userId,
  );
  const userIsAdmin = userRole === "ADMIN";

  if (!userIsProjectOwner && !userIsAdmin) {
    throw new Error("unauthorized");
  }

  const userPermissions = project.userProjects.find(
    (up) => up.userId === userId,
  )?.permissions;

  return {
    project,
    userIsAdmin,
    userPermissions,
  };
}

export async function getAllStores(projectId: string) {
  const user = await currentUser();
  if (!user) {
    return {
      success: "",
      error: "Unauthorized: User not authenticated",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
  const canView =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("VIEW");

  if (!canView) {
    return { success: "", error: "unauthorized" };
  }
  try {
    const stores = await db.store.findMany({
      where: {
        projectId,
      },
      include: {
        project: true,
      },
    });
    return stores.map((store) => ({
      ...store,
    }));
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch stores");
  }
}

export async function getStoreById(projectId: string, storeId: string) {
  const user = await currentUser();
  if (!user) {
    return {
      success: "",
      error: "Unauthorized: User not authenticated",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
  const canView =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("VIEW");

  if (!canView) {
    return { success: "", error: "unauthorized" };
  }
  try {
    const store = await db.store.findUnique({
      where: {
        id: storeId,
        projectId,
      },
      include: {
        project: true,
      },
    });
    return store || null;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch store");
  }
}

export interface StoreFormData {
  id?: string;
  title: string;
  description?: string | null;
  projectId: string;
}

export async function createStore(
  data: StoreFormData,
): Promise<ActionResponse> {
  const user = await currentUser();
  if (!user) {
    return {
      success: "",
      error: "Unauthorized: User not authenticated",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      data.projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }

  const canCreate =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("ADD");

  if (!canCreate) {
    return { success: "", error: "unauthorized" };
  }

  const existingStore = await db.store.findFirst({
    where: {
      title: data.title,
    },
  });

  if (existingStore) {
    return {
      success: "",
      error: "error.store_exists",
    };
  }

  try {
    await db.store.create({
      data: {
        title: data.title,
        description: data.description || null,
        projectId: data.projectId,
      },
    });

    return {
      success: "storeAddedSuccessfully",
      error: "",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
}

export async function updateStore(
  data: StoreFormData,
): Promise<ActionResponse> {
  if (!data.id) {
    return { success: "", error: "storeIdNotProvided" };
  }

  const user = await currentUser();
  if (!user) {
    return {
      success: "",
      error: "Unauthorized: User not authenticated",
    };
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      data.projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }

  const canEdit =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("EDIT");

  if (!canEdit) {
    return { success: "", error: "unauthorized" };
  }

  try {
    await db.store.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description || null,
        projectId: data.projectId,
      },
    });

    return {
      success: "storeUpdatedSuccessfully",
      error: "",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: "", error: error.message };
    }
    return { success: "", error: "somethingWentWrong" };
  }
}

export async function deleteStore(
  projectId: string,
  storeId: string,
): Promise<ActionResponse> {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }

  let userPermissions;
  let userIsAdmin;

  try {
    ({ userPermissions, userIsAdmin } = await checkUserPermissions(
      projectId,
      user.id,
      user.role,
    ));
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: "",
        error: error.message,
      };
    }
    return {
      success: "",
      error: "somethingWentWrong",
    };
  }

  const canDelete =
    userIsAdmin ||
    userPermissions?.includes("FULLACCESS") ||
    userPermissions?.includes("DELETE");
  if (!canDelete) {
    return { success: "", error: "unauthorized" };
  }

  try {
    await db.store.delete({
      where: { id: storeId },
    });
    return {
      success: "storeDeletedSuccessfully",
      error: "",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: "",
        error: error.message,
      };
    }
    return {
      success: "",
      error: "somethingWentWrong",
    };
  }
}

export const getStoreSettings = async (
  storeId: string,
): Promise<{ data?: StoreSettings; error?: string }> => {
  try {
    let data = await db.storeSettings.findUnique({
      where: { storeId },
    });

    if (!data) {
      data = await db.storeSettings.create({
        data: {
          storeId,
          pageSize: 10,
          isShippingFee: false,
          shippingFee: 0,
          freeShippingMoreThan: 0,
          taxPercent: 0,
        },
      });
    }

    return { data };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }
    return {
      error: "somethingWentWrong",
    };
  }
};

export interface StoreSettingsFormData {
  storeId: string;
  pageSize: number;
  isShippingFee: boolean;
  shippingFee: number;
  freeShippingMoreThan: number;
  taxPercent: number;
}

export const updateStoreSettings = async (
  data: StoreSettingsFormData,
): Promise<{ success?: string; error?: string }> => {
  try {
    const {
      storeId,
      pageSize,
      isShippingFee,
      shippingFee,
      freeShippingMoreThan,
      taxPercent,
    } = data;

    await db.storeSettings.upsert({
      where: { storeId },
      update: {
        pageSize,
        isShippingFee,
        shippingFee,
        freeShippingMoreThan,
        taxPercent,
      },
      create: {
        storeId,
        pageSize,
        isShippingFee,
        shippingFee,
        freeShippingMoreThan,
        taxPercent,
      },
    });

    return { success: "storeSettingsUpdatedSuccessfully" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: "",
        error: error.message,
      };
    }
    return {
      success: "",
      error: "storeSettingsError",
    };
  }
};
